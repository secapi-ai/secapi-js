import { describe, expect, test } from "bun:test"
import { SecApiClient, SecApiError, SecApiValidationError, SDK_VERSION, type RetryOptions } from "../src/index.js"

type RetryTestClient = SecApiClient & {
  createStreamTicket(): Promise<unknown>
  request(path: string, options?: { signal?: AbortSignal }): Promise<unknown>
}

function retryTestClient(client: SecApiClient): RetryTestClient {
  return client as RetryTestClient
}

function jsonResponse(status: number, body: unknown = { ok: true }, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      ...headers,
    },
  })
}

function retryHarness(overrides: RetryOptions = {}) {
  const delays: number[] = []
  return {
    delays,
    retry: {
      sleep: async (delayMs: number) => {
        delays.push(delayMs)
      },
      random: () => 1,
      ...overrides,
    },
  }
}

const TEST_TIMESTAMP = "2026-06-07T00:00:00.000Z"

async function packageVersion() {
  const packageJson = await Bun.file(new URL("../package.json", import.meta.url)).json()
  return packageJson.version as string
}

function dashboardSettingsPayload(overrides: Record<string, unknown> = {}) {
  return {
    object: "dashboard_account_settings",
    requestId: "req_dashboard_settings",
    principal: {
      principalId: "user_ds",
      subject: "user_ds",
      orgId: "org_secapi",
      authMode: "bearer",
      scopes: ["api_keys:manage", "billing:manage"],
      livemode: false,
    },
    profile: {
      object: "dashboard_profile",
      userId: "user_ds",
      email: "ds@example.com",
      emailNormalized: "ds@example.com",
      name: "Daniel Scrivner",
      displayName: "Daniel",
      displayNameSource: "workos",
      avatarUrl: null,
      editable: {
        displayName: true,
        email: false,
        name: false,
        avatarUrl: false,
      },
      updatedAt: null,
    },
    organization: {
      id: "org_secapi",
      name: "secapi.ai",
      nameSource: "workos",
      workosName: "secapi.ai",
      livemode: false,
      createdAt: TEST_TIMESTAMP,
      settings: {
        organization: {
          displayName: null,
          updatedAt: null,
        },
        appearance: {
          theme: "dark",
          density: "comfortable",
        },
        accountDeletionRequest: {
          status: "not_requested",
          requestedAt: null,
          requestedByPrincipalId: null,
          reason: null,
        },
      },
    },
    membership: {
      object: "workos_org_membership",
      userId: "user_ds",
      orgId: "org_secapi",
      status: "active",
      scopes: ["api_keys:manage", "billing:manage"],
      firstSeenAt: TEST_TIMESTAMP,
      lastSeenAt: TEST_TIMESTAMP,
      createdAt: TEST_TIMESTAMP,
      updatedAt: TEST_TIMESTAMP,
    },
    appearance: {
      theme: "dark",
      density: "comfortable",
    },
    security: {
      object: "dashboard_security_settings",
      authProvider: "workos",
      authMode: "bearer",
      sessionExpiresAt: null,
      scopes: ["api_keys:manage", "billing:manage"],
      logoutPath: "/auth/session/logout",
      profileFieldsManagedBy: "workos",
    },
    accountDeletion: {
      status: "not_requested",
      requestedAt: null,
      requestedByPrincipalId: null,
      reason: null,
    },
    actions: [],
    ...overrides,
  }
}

describe("SecApiClient retry behavior", () => {
  test("SDK_VERSION matches package metadata", async () => {
    expect(SDK_VERSION).toBe(await packageVersion())
  })

  test("sends SEC API version header", async () => {
    let headers: Headers | null = null
    const client = new SecApiClient({
      telemetry: false,
      apiVersion: "2026-05-20",
      fetch: async (_url, init) => {
        headers = new Headers(init?.headers)
        return jsonResponse(200, { ok: true })
      },
    })

    await expect(client.health()).resolves.toEqual({ ok: true })
    expect(headers?.get("secapi-version")).toBe("2026-05-20")
    expect(headers?.get(["omni", "version"].join("-"))).toBeNull()
  })

  test("sends an SDK user agent by default", async () => {
    let headers: Headers | null = null
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (_url, init) => {
        headers = new Headers(init?.headers)
        return jsonResponse(200, { ok: true })
      },
    })

    await expect(client.health()).resolves.toEqual({ ok: true })
    expect(headers?.get("user-agent")).toBe(`secapi-js/${SDK_VERSION}`)
  })

  test("does not add a default user agent in browser-shaped runtimes", async () => {
    let headers: Headers | null = null
    const hadWindow = "window" in globalThis
    const previousWindow = (globalThis as { window?: unknown }).window
    Object.defineProperty(globalThis, "window", { configurable: true, value: {} })

    try {
      const client = new SecApiClient({
        telemetry: false,
        fetch: async (_url, init) => {
          headers = new Headers(init?.headers)
          return jsonResponse(200, { ok: true })
        },
      })

      await expect(client.health()).resolves.toEqual({ ok: true })
      expect(headers?.has("user-agent")).toBe(false)
    } finally {
      if (hadWindow) {
        Object.defineProperty(globalThis, "window", { configurable: true, value: previousWindow })
      } else {
        delete (globalThis as { window?: unknown }).window
      }
    }
  })

  test("allows callers to override the SDK user agent", async () => {
    let headers: Headers | null = null
    const client = new SecApiClient({
      telemetry: false,
      headers: { "user-agent": "custom-client/1.0" },
      fetch: async (_url, init) => {
        headers = new Headers(init?.headers)
        return jsonResponse(200, { ok: true })
      },
    })

    await expect(client.health()).resolves.toEqual({ ok: true })
    expect(headers?.get("user-agent")).toBe("custom-client/1.0")
  })

  test("retries safe GET requests on retryable 5xx responses", async () => {
    const attempts: string[] = []
    const { delays, retry } = retryHarness()
    const client = new SecApiClient({
      retry,
      telemetry: false,
      fetch: async (url) => {
        attempts.push(String(url))
        return attempts.length === 1 ? jsonResponse(502, { message: "bad gateway" }) : jsonResponse(200, { ok: true })
      },
    })

    await expect(client.health()).resolves.toEqual({ ok: true })
    expect(attempts).toHaveLength(2)
    expect(delays).toEqual([200])
  })

  test("retries safe GET requests on network errors", async () => {
    let attempts = 0
    const { delays, retry } = retryHarness({ random: () => 0.5 })
    const client = new SecApiClient({
      retry,
      telemetry: false,
      fetch: async () => {
        attempts += 1
        if (attempts === 1) throw new TypeError("network down")
        return jsonResponse(200, { ok: true })
      },
    })

    await expect(client.me()).resolves.toEqual({ ok: true })
    expect(attempts).toBe(2)
    expect(delays).toEqual([100])
  })

  test("does not retry nonretryable 4xx responses", async () => {
    let attempts = 0
    const { retry } = retryHarness()
    const client = new SecApiClient({
      retry,
      telemetry: false,
      fetch: async () => {
        attempts += 1
        return jsonResponse(400, { message: "bad request" })
      },
    })

    await expect(client.health()).rejects.toMatchObject({ status: 400 })
    expect(attempts).toBe(1)
  })

  test("extracts API error diagnostics from top-level aliases", async () => {
    const client = new SecApiClient({
      retry: false,
      telemetry: false,
      fetch: async () => jsonResponse(400, {
        error_code: "invalid_request",
        title: "ticker is required",
        request_id: "req_alias_123",
        hint: "Add ticker=AAPL or cik=0000320193.",
        docsUrl: "https://docs.secapi.ai/api-reference/entities/get-v1-entities-resolve",
        details: { parameter: "ticker" },
      }),
    })

    await expect(client.health()).rejects.toMatchObject({
      name: "SecApiError",
      status: 400,
      code: "invalid_request",
      requestId: "req_alias_123",
      message: "ticker is required (request_id: req_alias_123)",
      hint: "Add ticker=AAPL or cik=0000320193.",
      docsUrl: "https://docs.secapi.ai/api-reference/entities/get-v1-entities-resolve",
      details: { parameter: "ticker" },
    })
  })

  test("extracts API error diagnostics from nested error objects", async () => {
    const client = new SecApiClient({
      retry: false,
      telemetry: false,
      fetch: async () => jsonResponse(502, {
        error: {
          code: -32603,
          message: "JSON-RPC tool error",
          data: {
            code: "mcp_tool_failed",
            message: "hosted tool failed",
            hint: "Retry with a smaller limit.",
            docsUrl: "https://docs.secapi.ai/mcp-workflows",
            action: "retry_with_narrower_arguments",
            retryable: true,
            requestId: "req_mcp_data",
          },
        },
      }),
    })

    await expect(client.callMcpTool("filings.latest", {})).rejects.toMatchObject({
      name: "SecApiError",
      status: 502,
      code: "mcp_tool_failed",
      requestId: "req_mcp_data",
      message: "hosted tool failed (request_id: req_mcp_data)",
      hint: "Retry with a smaller limit.",
      docsUrl: "https://docs.secapi.ai/mcp-workflows",
      action: "retry_with_narrower_arguments",
      retryable: true,
    })
  })

  test("promotes legacy details diagnostics onto SecApiError", async () => {
    const client = new SecApiClient({
      retry: false,
      telemetry: false,
      fetch: async () => jsonResponse(401, {
        code: "missing_api_key",
        message: "Authentication required.",
        requestId: "req_auth_details",
        details: {
          hint: "Pass your key in the x-api-key header.",
          docsUrl: "https://docs.secapi.ai/auth-and-pricing",
        },
      }),
    })

    await expect(client.me()).rejects.toMatchObject({
      name: "SecApiError",
      status: 401,
      code: "missing_api_key",
      requestId: "req_auth_details",
      hint: "Pass your key in the x-api-key header.",
      docsUrl: "https://docs.secapi.ai/auth-and-pricing",
    })
  })

  test("billing and quota denial matrix preserves diagnostics and retry posture", async () => {
    const cases = [
      {
        name: "missing key",
        call: (client: SecApiClient) => client.me(),
        responses: [jsonResponse(401, {
          object: "error",
          code: "missing_api_key",
          type: "authentication_error",
          message: "Authentication required. Pass your API key in the x-api-key header.",
          requestId: "req_missing_key",
          hint: "Create an API key, then send it as x-api-key.",
          docsUrl: "https://docs.secapi.ai/auth-and-pricing",
        })],
        expected: {
          status: 401,
          code: "missing_api_key",
          requestId: "req_missing_key",
          hint: "Create an API key, then send it as x-api-key.",
          docsUrl: "https://docs.secapi.ai/auth-and-pricing",
          attempts: 1,
        },
      },
      {
        name: "invalid key",
        call: (client: SecApiClient) => client.me(),
        responses: [jsonResponse(401, {
          object: "error",
          code: "authentication_failed",
          type: "authentication_error",
          message: "The API key was rejected. Rotate the key in the dashboard.",
          requestId: "req_invalid_key",
          details: {
            docsUrl: "https://docs.secapi.ai/auth-and-pricing",
          },
        })],
        expected: {
          status: 401,
          code: "authentication_failed",
          requestId: "req_invalid_key",
          docsUrl: "https://docs.secapi.ai/auth-and-pricing",
          attempts: 1,
        },
      },
      {
        name: "exhausted prepaid credits",
        call: (client: SecApiClient) => client.billing(),
        responses: [jsonResponse(402, {
          object: "error",
          code: "insufficient_credits",
          type: "invalid_request_error",
          message: "Insufficient prepaid credits to serve this request.",
          requestId: "req_credits_empty",
          details: {
            meterClass: "filing_retrieval",
            planKey: "payg",
            creditBalanceCents: 0,
            requestCostCents: 2,
            topUpUrl: "https://secapi.ai/app/billing",
            docsUrl: "https://docs.secapi.ai/pay-as-you-go",
            action: "add_credits_or_enable_auto_top_up",
            retryable: false,
          },
        })],
        expected: {
          status: 402,
          code: "insufficient_credits",
          requestId: "req_credits_empty",
          details: { planKey: "payg", creditBalanceCents: 0, requestCostCents: 2 },
          action: "add_credits_or_enable_auto_top_up",
          retryable: false,
          attempts: 1,
        },
      },
      {
        name: "PAYG inactive after starter grant",
        call: (client: SecApiClient) => client.billing(),
        responses: [jsonResponse(402, {
          object: "error",
          code: "billing_required",
          type: "invalid_request_error",
          message: "Attach a card to continue after the starter grant is exhausted.",
          requestId: "req_payg_pending_card",
          details: {
            meterClass: "section_extract",
            planKey: "payg",
            billingState: "payg_pending_card",
            freeGrantRemaining: 0,
            action: "resolve_billing_status",
            retryable: false,
          },
        })],
        expected: {
          status: 402,
          code: "billing_required",
          requestId: "req_payg_pending_card",
          details: { billingState: "payg_pending_card", freeGrantRemaining: 0 },
          action: "resolve_billing_status",
          retryable: false,
          attempts: 1,
        },
      },
      {
        name: "free grant feature denial",
        call: (client: SecApiClient) => client.billing(),
        responses: [jsonResponse(402, {
          object: "error",
          code: "billing_required",
          type: "invalid_request_error",
          message: "intelligence_query is not available on the sandbox_grant plan",
          requestId: "req_free_grant_denied",
          details: {
            meterClass: "intelligence_query",
            planKey: "sandbox_grant",
            publicPlanKey: "sandbox_grant",
            freeGrantRemaining: 17,
            action: "upgrade_plan",
            retryable: false,
          },
        })],
        expected: {
          status: 402,
          code: "billing_required",
          requestId: "req_free_grant_denied",
          details: { planKey: "sandbox_grant", freeGrantRemaining: 17 },
          action: "upgrade_plan",
          retryable: false,
          attempts: 1,
        },
      },
      {
        name: "short rate limit retries once with Retry-After",
        call: (client: SecApiClient) => client.me(),
        responses: [
          jsonResponse(429, {
            object: "error",
            code: "rate_limit_exceeded",
            type: "invalid_request_error",
            message: "Rate limit exceeded on the sandbox_grant plan for filing_search requests.",
            requestId: "req_rate_limited",
            details: {
              meterClass: "filing_search",
              limit: 1,
              period: "minute",
              planKey: "sandbox_grant",
              upgradeUrl: "https://secapi.ai/pricing",
              action: "retry_after",
              retryable: true,
            },
          }, { "retry-after": "2" }),
          jsonResponse(200, { object: "me", requestId: "req_after_retry" }),
        ],
        expected: { attempts: 2, delays: [2000], resolves: { requestId: "req_after_retry" } },
      },
      {
        name: "REST monthly quota exhausted does not retry",
        call: (client: SecApiClient) => client.intelligenceSecurity({ ticker: "AAPL" }),
        responses: [jsonResponse(429, {
          object: "error",
          code: "ai_query_quota_exceeded",
          type: "invalid_request_error",
          message: "Monthly AI query quota exhausted (10/10). Upgrade your plan at https://secapi.ai/pricing for a higher allowance.",
          requestId: "req_rest_quota",
          details: {
            quotaFamily: "ai_queries",
            aiQueryQuotaLimit: 10,
            aiQueryQuotaUsed: 10,
            aiQueryQuotaRemaining: 0,
            planKey: "sandbox_grant",
            upgradeUrl: "https://secapi.ai/pricing",
            docsUrl: "https://docs.secapi.ai/api-conventions",
            action: "wait_for_quota_reset_or_upgrade",
            retryable: false,
          },
        }, { "retry-after": "86400" })],
        expected: {
          status: 429,
          code: "ai_query_quota_exceeded",
          requestId: "req_rest_quota",
          details: { quotaFamily: "ai_queries", aiQueryQuotaRemaining: 0, upgradeUrl: "https://secapi.ai/pricing" },
          action: "wait_for_quota_reset_or_upgrade",
          retryable: false,
          attempts: 1,
        },
      },
      {
        name: "MCP monthly quota exhausted does not retry",
        call: (client: SecApiClient) => client.callMcpTool("intelligence.query", { query: "AAPL risk", entities: ["AAPL"] }),
        responses: [jsonResponse(429, {
          error: {
            code: -32005,
            message: "ai_query_quota_exceeded",
            data: {
              code: "ai_query_quota_exceeded",
              message: "Monthly AI query quota exhausted (10/10). Upgrade your plan at https://secapi.ai/pricing for a higher allowance.",
              requestId: "req_mcp_quota",
              mcpToolName: "intelligence.query",
              quota: { family: "ai_queries", used: 10, limit: 10, remaining: 0 },
              upgradeUrl: "https://secapi.ai/pricing",
              docsUrl: "https://docs.secapi.ai/mcp-workflows#ai-query-quota",
              action: "wait_for_quota_reset_or_upgrade",
              retryable: false,
            },
          },
        }, { "retry-after": "86400" })],
        expected: {
          status: 429,
          code: "ai_query_quota_exceeded",
          requestId: "req_mcp_quota",
          docsUrl: "https://docs.secapi.ai/mcp-workflows#ai-query-quota",
          details: { mcpToolName: "intelligence.query", upgradeUrl: "https://secapi.ai/pricing" },
          action: "wait_for_quota_reset_or_upgrade",
          retryable: false,
          attempts: 1,
        },
      },
      {
        name: "MCP billing required does not retry",
        call: (client: SecApiClient) => client.callMcpTool("filings.latest", { ticker: "AAPL", form: "10-K" }),
        responses: [jsonResponse(402, {
          error: {
            code: -32007,
            message: "billing_required",
            data: {
              code: "billing_required",
              message: "Attach a card to continue after the starter grant is exhausted.",
              requestId: "req_mcp_billing_required",
              meterClass: "mcp",
              billingState: "payg_pending_card",
              docsUrl: "https://docs.secapi.ai/auth-and-pricing",
              action: "resolve_billing_status",
              retryable: false,
            },
          },
        })],
        expected: {
          status: 402,
          code: "billing_required",
          requestId: "req_mcp_billing_required",
          docsUrl: "https://docs.secapi.ai/auth-and-pricing",
          details: { meterClass: "mcp", billingState: "payg_pending_card" },
          action: "resolve_billing_status",
          retryable: false,
          attempts: 1,
        },
      },
      {
        name: "unsafe POST 503 does not retry by default",
        call: (client: SecApiClient) => client.quoteBilling({ meterClass: "section_extract", units: 1 }),
        responses: [jsonResponse(503, {
          object: "error",
          code: "service_unavailable",
          type: "api_error",
          message: "Billing quote temporarily unavailable.",
          requestId: "req_quote_503",
        })],
        expected: {
          status: 503,
          code: "service_unavailable",
          requestId: "req_quote_503",
          attempts: 1,
        },
      },
    ]

    for (const entry of cases) {
      let attempts = 0
      const { delays, retry } = retryHarness({ maxRetries: 1 })
      const client = new SecApiClient({
        retry,
        telemetry: false,
        fetch: async () => entry.responses[Math.min(attempts++, entry.responses.length - 1)]!,
      })

      if (entry.expected.resolves) {
        await expect(entry.call(client)).resolves.toMatchObject(entry.expected.resolves)
      } else {
        await expect(entry.call(client)).rejects.toMatchObject({
          name: "SecApiError",
          status: entry.expected.status,
          code: entry.expected.code,
          requestId: entry.expected.requestId,
          ...("hint" in entry.expected && entry.expected.hint ? { hint: entry.expected.hint } : {}),
          ...("docsUrl" in entry.expected && entry.expected.docsUrl ? { docsUrl: entry.expected.docsUrl } : {}),
          ...("action" in entry.expected && entry.expected.action ? { action: entry.expected.action } : {}),
          ...("retryable" in entry.expected && typeof entry.expected.retryable === "boolean" ? { retryable: entry.expected.retryable } : {}),
          ...("details" in entry.expected && entry.expected.details ? { details: expect.objectContaining(entry.expected.details) } : {}),
        })
      }

      expect(attempts, entry.name).toBe(entry.expected.attempts)
      expect(delays, entry.name).toEqual(entry.expected.delays ?? [])
    }
  })

  test("does not retry 429 responses when the API marks them non-retryable", async () => {
    let attempts = 0
    const { delays, retry } = retryHarness({ maxRetries: 2 })
    const client = new SecApiClient({
      retry,
      telemetry: false,
      fetch: async () => {
        attempts += 1
        return jsonResponse(429, {
          object: "error",
          code: "quota_not_ready",
          message: "This quota can only be retried after an account action.",
          requestId: "req_non_retryable_429",
          details: {
            action: "resolve_account_state",
            retryable: false,
          },
        }, { "retry-after": "1" })
      },
    })

    await expect(client.me()).rejects.toMatchObject({
      status: 429,
      code: "quota_not_ready",
      action: "resolve_account_state",
      retryable: false,
    })
    expect(attempts).toBe(1)
    expect(delays).toEqual([])
  })

  test("uses x-request-id header when API error body omits request id", async () => {
    const client = new SecApiClient({
      retry: false,
      telemetry: false,
      fetch: async () => jsonResponse(
        429,
        { errorCode: "rate_limited", message: "retry later" },
        { "x-request-id": "req_header_789" },
      ),
    })

    await expect(client.health()).rejects.toMatchObject({
      status: 429,
      code: "rate_limited",
      requestId: "req_header_789",
      message: "retry later (request_id: req_header_789)",
    })
  })

  test("does not retry schema validation failures after successful responses", async () => {
    let attempts = 0
    const { delays, retry } = retryHarness()
    const client = new SecApiClient({
      retry,
      telemetry: false,
      fetch: async () => {
        attempts += 1
        return jsonResponse(200, { object: "not_a_stream_ticket" })
      },
    })

    await expect(retryTestClient(client).createStreamTicket()).rejects.toBeInstanceOf(SecApiValidationError)
    expect(attempts).toBe(1)
    expect(delays).toEqual([])
  })

  test("honors per-call opt-out", async () => {
    let attempts = 0
    const { retry } = retryHarness()
    const client = new SecApiClient({
      retry,
      telemetry: false,
      fetch: async () => {
        attempts += 1
        return jsonResponse(503, { message: "unavailable" })
      },
    })

    await expect(client.health({ retry: false })).rejects.toMatchObject({ status: 503 })
    expect(attempts).toBe(1)
  })

  test("honors per-call options on query params without serializing them", async () => {
    const seenUrls: string[] = []
    const { retry } = retryHarness()
    const client = new SecApiClient({
      retry,
      telemetry: false,
      fetch: async (url) => {
        seenUrls.push(String(url))
        return jsonResponse(503, { message: "unavailable" })
      },
    })

    await expect(client.listTraces({ ids: ["trace_a", "trace_b"], retry: false })).rejects.toMatchObject({ status: 503 })
    expect(seenUrls).toHaveLength(1)
    expect(seenUrls[0]).toContain("ids=trace_a%2Ctrace_b")
    expect(seenUrls[0]).not.toContain("retry")
  })

  test("getTrace escapes the trace id path segment", async () => {
    const seenUrls: string[] = []
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url) => {
        seenUrls.push(String(url))
        return jsonResponse(200, { ok: true })
      },
    })

    await expect(client.getTrace("trace/with spaces")).resolves.toEqual({ ok: true })
    expect(seenUrls[0]).toBe("https://api.secapi.ai/v1/traces/trace%2Fwith%20spaces")
  })

  test("requestDiagnostics escapes the request id path segment", async () => {
    const seenUrls: string[] = []
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url) => {
        seenUrls.push(String(url))
        return jsonResponse(200, { ok: true })
      },
    })

    await expect(client.requestDiagnostics("req/with spaces")).resolves.toEqual({ ok: true })
    expect(seenUrls[0]).toBe("https://api.secapi.ai/v1/diagnostics/requests/req%2Fwith%20spaces")
  })

  test("dashboard usage series helper serializes dashboard params without request options", async () => {
    const seenUrls: string[] = []
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url) => {
        seenUrls.push(String(url))
        return jsonResponse(200, {
          object: "dashboard_usage_series",
          requestId: "req_series",
          orgId: "org_secapi",
          bucket: "day",
          since: "2026-06-01T00:00:00.000Z",
          until: "2026-06-07T00:00:00.000Z",
          data: [],
        })
      },
    })

    await expect(client.dashboardUsageSeries({
      bucket: "day",
      since: "2026-06-01T00:00:00.000Z",
      until: "2026-06-07T00:00:00.000Z",
      retry: false,
    })).resolves.toMatchObject({ object: "dashboard_usage_series" })

    expect(seenUrls).toHaveLength(1)
    expect(seenUrls[0]).toContain("/v1/dashboard/usage/series?")
    expect(seenUrls[0]).toContain("bucket=day")
    expect(seenUrls[0]).not.toContain("retry")
  })

  test("dashboard usage endpoints helper serializes dashboard params without request options", async () => {
    const seenUrls: string[] = []
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url) => {
        seenUrls.push(String(url))
        return jsonResponse(200, {
          object: "dashboard_endpoint_breakdown",
          requestId: "req_endpoints",
          orgId: "org_secapi",
          since: "2026-06-01T00:00:00.000Z",
          until: "2026-06-07T00:00:00.000Z",
          data: [],
        })
      },
    })

    await expect(client.dashboardUsageEndpoints({
      since: "2026-06-01T00:00:00.000Z",
      until: "2026-06-07T00:00:00.000Z",
      limit: 10,
      retry: false,
    })).resolves.toMatchObject({ object: "dashboard_endpoint_breakdown" })

    expect(seenUrls).toHaveLength(1)
    expect(seenUrls[0]).toContain("/v1/dashboard/usage/endpoints?")
    expect(seenUrls[0]).toContain("limit=10")
    expect(seenUrls[0]).not.toContain("retry")
  })

  test("dashboard usage helpers serialize dashboard params without request options", async () => {
    const seenUrls: string[] = []
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url) => {
        seenUrls.push(String(url))
        return jsonResponse(200, {
          object: "dashboard_usage_request_log",
          requestId: "req_usage",
          orgId: "org_secapi",
          since: "2026-06-01T00:00:00.000Z",
          until: "2026-06-07T00:00:00.000Z",
          data: [],
        })
      },
    })

    await expect(client.dashboardUsageRequests({
      since: "2026-06-01T00:00:00.000Z",
      until: "2026-06-07T00:00:00.000Z",
      status: "error",
      meterClass: "search",
      limit: 5,
      retry: false,
    })).resolves.toMatchObject({ object: "dashboard_usage_request_log" })

    expect(seenUrls).toHaveLength(1)
    expect(seenUrls[0]).toContain("/v1/dashboard/usage/requests?")
    expect(seenUrls[0]).toContain("status=error")
    expect(seenUrls[0]).toContain("meterClass=search")
    expect(seenUrls[0]).toContain("limit=5")
    expect(seenUrls[0]).not.toContain("retry")
  })

  test("dashboard activity helper validates audit activity responses", async () => {
    const seenUrls: string[] = []
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url) => {
        seenUrls.push(String(url))
        return jsonResponse(200, {
          object: "dashboard_usage_activity",
          requestId: "req_activity",
          orgId: "org_secapi",
          since: "2026-06-01T00:00:00.000Z",
          until: "2026-06-07T00:00:00.000Z",
          totalRequests: 0,
          successCount: 0,
          errorCount: 0,
          firstSeenAt: null,
          lastSeenAt: null,
          activePrincipalCount: 0,
          endpointCount: 0,
          recentRequests: [],
          recentAuditEvents: [],
        })
      },
    })

    await expect(client.dashboardActivity({ requestLimit: 5, auditLimit: 3, retry: false })).resolves.toMatchObject({
      object: "dashboard_usage_activity",
      recentAuditEvents: [],
    })
    expect(seenUrls[0]).toContain("limit=5")
    expect(seenUrls[0]).toContain("auditLimit=3")
    expect(seenUrls[0]).not.toContain("retry")
  })

  test("dashboard usage export helpers force their response formats", async () => {
    const seenUrls: string[] = []
    const seenContentTypes: string[] = []
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url) => {
        seenUrls.push(String(url))
        const parsedUrl = new URL(String(url))
        if (parsedUrl.searchParams.get("format") === "csv") {
          seenContentTypes.push("text/csv")
          return new Response("request_id,status\nreq_usage,200\n", {
            status: 200,
            headers: { "content-type": "text/csv; charset=utf-8" },
          })
        }
        seenContentTypes.push("application/json")
        return jsonResponse(200, {
          object: "dashboard_usage_export",
          requestId: "req_export",
          orgId: "org_secapi",
          since: "2026-06-01T00:00:00.000Z",
          until: "2026-06-07T00:00:00.000Z",
          format: "json",
          data: [],
        })
      },
    })

    await expect(client.dashboardUsageExport({ format: "json", retry: false })).resolves.toMatchObject({
      object: "dashboard_usage_export",
      format: "json",
    })
    await expect(client.dashboardUsageExportCsv({ retry: false })).resolves.toContain("request_id,status")

    expect(seenUrls[0]).toContain("format=json")
    expect(seenUrls[1]).toContain("format=csv")
    expect(seenUrls.join("\n")).not.toContain("retry")
    expect(seenContentTypes).toEqual(["application/json", "text/csv"])
  })

  test("factor CSV helpers force text exports", async () => {
    const seenUrls: string[] = []
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url) => {
        seenUrls.push(String(url))
        const parsedUrl = new URL(String(url))
        if (parsedUrl.searchParams.get("format") === "csv") {
          return new Response("rank,factor_key\n1,VALUE\n", {
            status: 200,
            headers: { "content-type": "text/csv; charset=utf-8" },
          })
        }
        return jsonResponse(200, { object: "list", data: [] })
      },
    })

    await expect(client.factorHistoryCsv("MKT/US", { range: "max", retry: false })).resolves.toContain("VALUE")
    await expect(client.factorSparklinesCsv({ keys: ["VALUE", "MOMENTUM"], range: "1y", points: 32, retry: false })).resolves.toContain("VALUE")
    await expect(client.factorBulkDownloadCsv({ keys: ["VALUE", "MOMENTUM"], lookback: "12m", retry: false })).resolves.toContain("VALUE")

    expect(seenUrls[0]).toContain("/v1/factors/history/MKT%2FUS?")
    expect(seenUrls[0]).toContain("range=max")
    expect(seenUrls[0]).toContain("format=csv")
    expect(seenUrls[1]).toContain("/v1/factors/sparklines?")
    expect(seenUrls[1]).toContain("keys=VALUE%2CMOMENTUM")
    expect(seenUrls[1]).toContain("range=1y")
    expect(seenUrls[1]).toContain("points=32")
    expect(seenUrls[1]).toContain("format=csv")
    expect(seenUrls[2]).toContain("/v1/factors/bulk-download?")
    expect(seenUrls[2]).toContain("keys=VALUE%2CMOMENTUM")
    expect(seenUrls[2]).toContain("lookback=12m")
    expect(seenUrls[2]).toContain("format=csv")
    expect(seenUrls.join("\n")).not.toContain("retry")
  })

  test("dashboard settings helper rejects invalid response shapes", async () => {
    const client = new SecApiClient({
      telemetry: false,
      fetch: async () => jsonResponse(200, { object: "not_dashboard_account_settings" }),
    })

    await expect(client.dashboardSettings()).rejects.toBeInstanceOf(SecApiValidationError)
  })

  test("dashboard settings mutation helpers validate body and response", async () => {
    const seenRequests: Array<{ method?: string; path: string; body: unknown; idempotencyKey: string | null }> = []
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url, init) => {
        const parsedUrl = new URL(String(url))
        seenRequests.push({
          path: parsedUrl.pathname,
          method: init?.method,
          body: JSON.parse(String(init?.body)),
          idempotencyKey: new Headers(init?.headers).get("Idempotency-Key"),
        })
        return jsonResponse(200, dashboardSettingsPayload({
          appearance: {
            theme: "dark",
            density: "compact",
          },
        }))
      },
    })

    await expect(client.updateDashboardOrganization({ name: " " })).rejects.toThrow()
    expect(seenRequests).toHaveLength(0)

    await expect(client.updateDashboardProfile({ displayName: "DS" })).resolves.toMatchObject({
      object: "dashboard_account_settings",
    })
    await expect(client.updateDashboardOrganization({ name: "SecAPI Labs" })).resolves.toMatchObject({
      object: "dashboard_account_settings",
    })
    await expect(client.updateDashboardAppearance(
      { theme: "dark", density: "compact" },
      { retry: { enabled: true, idempotencyKey: "dashboard-appearance-compact" } },
    )).resolves.toMatchObject({
      object: "dashboard_account_settings",
      appearance: {
        theme: "dark",
        density: "compact",
      },
    })

    expect(seenRequests).toEqual([
      {
        path: "/v1/dashboard/settings/profile",
        method: "PATCH",
        body: { displayName: "DS" },
        idempotencyKey: null,
      },
      {
        path: "/v1/dashboard/settings/organization",
        method: "PATCH",
        body: { name: "SecAPI Labs" },
        idempotencyKey: null,
      },
      {
        path: "/v1/dashboard/settings/appearance",
        method: "PUT",
        body: { theme: "dark", density: "compact" },
        idempotencyKey: "dashboard-appearance-compact",
      },
    ])
  })

  test("dashboard account deletion helper uses the deferred-request route", async () => {
    let seenMethod: string | undefined
    let seenPath: string | undefined
    let seenBody: unknown
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url, init) => {
        const parsedUrl = new URL(String(url))
        seenPath = parsedUrl.pathname
        seenMethod = init?.method
        seenBody = JSON.parse(String(init?.body))
        return jsonResponse(202, dashboardSettingsPayload({
          accountDeletion: {
            status: "requested",
            requestedAt: TEST_TIMESTAMP,
            requestedByPrincipalId: "user_ds",
            reason: "beta cleanup",
          },
        }))
      },
    })

    await expect(client.requestDashboardAccountDeletion({ reason: "beta cleanup" })).resolves.toMatchObject({
      object: "dashboard_account_settings",
      accountDeletion: {
        status: "requested",
      },
    })

    expect(seenPath).toBe("/v1/dashboard/settings/account-deletion-request")
    expect(seenMethod).toBe("POST")
    expect(seenBody).toEqual({ reason: "beta cleanup" })
  })

  test("does not attach retry budget timeout when retries are disabled", async () => {
    let seenSignal: AbortSignal | undefined
    const client = new SecApiClient({
      retry: false,
      telemetry: false,
      fetch: async (_url, init) => {
        seenSignal = init?.signal ?? undefined
        return jsonResponse(200, { ok: true })
      },
    })

    await expect(client.health()).resolves.toEqual({ ok: true })
    expect(seenSignal).toBeUndefined()
  })

  test("per-call enabled overrides global enabled false", async () => {
    let attempts = 0
    const seenIdempotencyKeys: Array<string | null> = []
    const { retry } = retryHarness({ enabled: false })
    const client = new SecApiClient({
      retry,
      telemetry: false,
      fetch: async (_url, init) => {
        attempts += 1
        seenIdempotencyKeys.push(new Headers(init?.headers).get("Idempotency-Key"))
        return attempts === 1 ? jsonResponse(503, { message: "unavailable" }) : jsonResponse(200, { ok: true })
      },
    })

    await expect(client.createArtifact(
      { kind: "audit" },
      { retry: { enabled: true, idempotencyKey: "idem_enabled_override" } },
    )).resolves.toEqual({ ok: true })
    expect(attempts).toBe(2)
    expect(seenIdempotencyKeys).toEqual(["idem_enabled_override", "idem_enabled_override"])
  })

  test("per-call enabled false overrides global enabled true", async () => {
    let attempts = 0
    const { retry } = retryHarness({ enabled: true })
    const client = new SecApiClient({
      retry,
      telemetry: false,
      fetch: async () => {
        attempts += 1
        return jsonResponse(503, { message: "unavailable" })
      },
    })

    await expect(client.health({ retry: { enabled: false } })).rejects.toMatchObject({ status: 503 })
    expect(attempts).toBe(1)
  })

  test("does not retry caller-aborted requests", async () => {
    let attempts = 0
    const { delays, retry } = retryHarness()
    const controller = new AbortController()
    const client = new SecApiClient({
      retry,
      telemetry: false,
      fetch: async () => {
        attempts += 1
        throw new DOMException("The operation was aborted.", "AbortError")
      },
    })

    controller.abort()
    await expect(retryTestClient(client).request("/healthz", { signal: controller.signal })).rejects.toMatchObject({ name: "AbortError" })
    expect(attempts).toBe(1)
    expect(delays).toEqual([])
  })

  test("cleans up fallback abort listeners after completed requests", async () => {
    const anyDescriptor = Object.getOwnPropertyDescriptor(AbortSignal, "any")
    expect(anyDescriptor?.configurable).toBe(true)
    delete (AbortSignal as typeof AbortSignal & { any?: typeof AbortSignal.any }).any

    const controller = new AbortController()
    const activeListeners = new Set<EventListenerOrEventListenerObject>()
    const addEventListener = controller.signal.addEventListener.bind(controller.signal)
    const removeEventListener = controller.signal.removeEventListener.bind(controller.signal)

    controller.signal.addEventListener = ((type, listener, options) => {
      if (type === "abort" && listener) activeListeners.add(listener)
      return addEventListener(type, listener, options)
    }) as AbortSignal["addEventListener"]
    controller.signal.removeEventListener = ((type, listener, options) => {
      if (type === "abort" && listener) activeListeners.delete(listener)
      return removeEventListener(type, listener, options)
    }) as AbortSignal["removeEventListener"]

    const client = new SecApiClient({
      retry: { totalBudgetMs: 30_000 },
      telemetry: false,
      fetch: async () => jsonResponse(200, { ok: true }),
    })

    try {
      for (let i = 0; i < 12; i += 1) {
        await expect(retryTestClient(client).request("/healthz", { signal: controller.signal })).resolves.toEqual({ ok: true })
        expect(activeListeners.size).toBe(0)
      }
    } finally {
      controller.signal.addEventListener = addEventListener as AbortSignal["addEventListener"]
      controller.signal.removeEventListener = removeEventListener as AbortSignal["removeEventListener"]
      if (anyDescriptor) Object.defineProperty(AbortSignal, "any", anyDescriptor)
    }
  })

  test("raises structured budget errors for internal in-flight aborts", async () => {
    let attempts = 0
    const client = new SecApiClient({
      retry: { totalBudgetMs: 5 },
      telemetry: false,
      fetch: async (_url, init) => {
        attempts += 1
        return await new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener(
            "abort",
            () => reject(new DOMException("The operation was aborted.", "AbortError")),
            { once: true },
          )
        })
      },
    })

    for (let i = 0; i < 5; i += 1) {
      await expect(client.health()).rejects.toMatchObject({
        name: "SecApiError",
        status: 0,
        code: "client_retry_budget_exceeded",
      })
    }
    expect(client.circuitState.state).toBe("open")
    await expect(client.health()).rejects.toMatchObject({ code: "client_circuit_open" })
    expect(attempts).toBe(5)
  })

  test("does not retry unsafe POST 503 responses without per-call opt-in", async () => {
    let attempts = 0
    const { retry } = retryHarness()
    const client = new SecApiClient({
      retry,
      telemetry: false,
      fetch: async () => {
        attempts += 1
        return jsonResponse(503, { message: "unavailable" })
      },
    })

    await expect(client.createArtifact({ kind: "audit" })).rejects.toMatchObject({ status: 503 })
    expect(attempts).toBe(1)
  })

  test("per-call opt-in overrides global retry false", async () => {
    let attempts = 0
    const seenIdempotencyKeys: Array<string | null> = []
    const client = new SecApiClient({
      retry: false,
      telemetry: false,
      fetch: async (_url, init) => {
        attempts += 1
        seenIdempotencyKeys.push(new Headers(init?.headers).get("Idempotency-Key"))
        return attempts === 1 ? jsonResponse(503, { message: "unavailable" }) : jsonResponse(200, { ok: true })
      },
    })

    await expect(client.createArtifact(
      { kind: "audit" },
      { retry: { enabled: true, idempotencyKey: "idem_global_off" } },
    )).resolves.toEqual({ ok: true })
    expect(attempts).toBe(2)
    expect(seenIdempotencyKeys).toEqual(["idem_global_off", "idem_global_off"])
  })

  test("opens circuit after repeated terminal 429 failures on unsafe methods", async () => {
    let now = 0
    let attempts = 0
    const { retry } = retryHarness({ maxRetries: 0, now: () => now })
    const client = new SecApiClient({
      retry,
      telemetry: false,
      fetch: async () => {
        attempts += 1
        return jsonResponse(429, { message: "rate limited" })
      },
    })

    for (let i = 0; i < 5; i += 1) {
      await expect(client.createArtifact({ kind: "audit" })).rejects.toMatchObject({ status: 429 })
    }
    expect(client.circuitState.state).toBe("open")
    await expect(client.createArtifact({ kind: "audit" })).rejects.toMatchObject({ code: "client_circuit_open" })
    expect(attempts).toBe(5)
  })

  test("retries 429 responses on unsafe methods and honors Retry-After", async () => {
    let attempts = 0
    const { delays, retry } = retryHarness()
    const client = new SecApiClient({
      retry,
      telemetry: false,
      fetch: async () => {
        attempts += 1
        return attempts === 1
          ? jsonResponse(429, { message: "rate limited" }, { "retry-after": "2" })
          : jsonResponse(200, { ok: true })
      },
    })

    await expect(client.createArtifact({ kind: "audit" })).resolves.toEqual({ ok: true })
    expect(attempts).toBe(2)
    expect(delays).toEqual([2_000])
  })

  test("retries 429 responses using structured retry timing when Retry-After is unavailable", async () => {
    let attempts = 0
    const { delays, retry } = retryHarness()
    const client = new SecApiClient({
      retry,
      telemetry: false,
      fetch: async () => {
        attempts += 1
        return attempts === 1
          ? jsonResponse(429, {
              object: "error",
              code: "rate_limit_exceeded",
              message: "Rate limit exceeded.",
              details: {
                retryAfterSeconds: 3,
                retryable: true,
              },
            })
          : jsonResponse(200, { ok: true })
      },
    })

    await expect(client.createArtifact({ kind: "audit" })).resolves.toEqual({ ok: true })
    expect(attempts).toBe(2)
    expect(delays).toEqual([3_000])
  })

  test("retries retryable service errors using structured retry timing when Retry-After is unavailable", async () => {
    let attempts = 0
    const { delays, retry } = retryHarness()
    const client = new SecApiClient({
      retry,
      telemetry: false,
      fetch: async () => {
        attempts += 1
        return attempts === 1
          ? jsonResponse(503, {
              object: "error",
              code: "auth_verification_unavailable",
              message: "Auth verification temporarily unavailable.",
              retryAfterMs: 750,
            })
          : jsonResponse(200, { ok: true })
      },
    })

    await expect(client.health()).resolves.toEqual({ ok: true })
    expect(attempts).toBe(2)
    expect(delays).toEqual([750])
  })

  test("exposes structured MCP retry timing on terminal quota errors without Retry-After", async () => {
    const client = new SecApiClient({
      retry: false,
      telemetry: false,
      fetch: async () => jsonResponse(429, {
        error: {
          code: -32005,
          message: "ai_query_quota_exceeded",
          data: {
            code: "ai_query_quota_exceeded",
            message: "Monthly AI query quota exhausted.",
            requestId: "req_mcp_quota_body_retry",
            retryAfterSeconds: 86_400,
            action: "wait_for_quota_reset_or_upgrade",
            retryable: false,
          },
        },
      }),
    })

    await expect(client.callMcpTool("intelligence.query", { query: "AAPL risk" })).rejects.toMatchObject({
      status: 429,
      code: "ai_query_quota_exceeded",
      requestId: "req_mcp_quota_body_retry",
      retryAfterMs: 86_400_000,
      action: "wait_for_quota_reset_or_upgrade",
      retryable: false,
    })
  })

  test("retries MCP tools/call only when explicitly opted in", async () => {
    let attempts = 0
    const seenIdempotencyKeys: Array<string | null> = []
    const { retry } = retryHarness()
    const client = new SecApiClient({
      retry,
      telemetry: false,
      fetch: async (_url, init) => {
        attempts += 1
        seenIdempotencyKeys.push(new Headers(init?.headers).get("Idempotency-Key"))
        return attempts < 3 ? jsonResponse(503, { message: "unavailable" }) : jsonResponse(200, { ok: true })
      },
    })

    await expect(client.mcp({ method: "tools/call" }, { retry: { enabled: true, idempotencyKey: "idem_123" } })).resolves.toEqual({ ok: true })
    expect(attempts).toBe(3)
    expect(seenIdempotencyKeys).toEqual(["idem_123", "idem_123", "idem_123"])
  })

  test("opens circuit after consecutive terminal retryable failures and half-opens after cooldown", async () => {
    let now = 0
    let attempts = 0
    const { retry } = retryHarness({ maxRetries: 0, now: () => now })
    const client = new SecApiClient({
      retry,
      telemetry: false,
      fetch: async () => {
        attempts += 1
        return jsonResponse(attempts <= 5 ? 503 : 200, attempts <= 5 ? { message: "unavailable" } : { ok: true })
      },
    })

    for (let i = 0; i < 5; i += 1) {
      await expect(client.health()).rejects.toMatchObject({ status: 503 })
    }
    expect(client.circuitState.state).toBe("open")
    await expect(client.health()).rejects.toMatchObject({ code: "client_circuit_open" })
    expect(attempts).toBe(5)

    now = 60_000
    await expect(client.health()).resolves.toEqual({ ok: true })
    expect(client.circuitState.state).toBe("closed")
  })

  test("emits sanitized retry telemetry", async () => {
    const telemetryPayloads: unknown[] = []
    let attempts = 0
    const { retry } = retryHarness()
    const client = new SecApiClient({
      apiKey: "ods_secret",
      retry,
      telemetry: {
        captureToken: "phc_test",
        distinctId: "sdk-test",
        fetch: async (_url, init) => {
          telemetryPayloads.push(JSON.parse(String(init?.body)))
          return jsonResponse(200, { ok: true })
        },
      },
      fetch: async () => {
        attempts += 1
        return attempts === 1 ? jsonResponse(502, { message: "bad gateway" }) : jsonResponse(200, { ok: true })
      },
    })

    await expect(client.latestFiling({ ticker: "AAPL", form: "10-K" })).resolves.toEqual({ ok: true })
    expect(telemetryPayloads).toHaveLength(1)
    expect(telemetryPayloads[0]).toMatchObject({
      api_key: "phc_test",
      event: "client_retry_attempt",
      distinct_id: "sdk-test",
      properties: {
        sdk_language: "js",
        sdk_version: SDK_VERSION,
        method: "GET",
        route: "/v1/filings/latest",
        status: 502,
        $process_person_profile: false,
      },
    })
    expect(JSON.stringify(telemetryPayloads[0])).not.toContain("ods_secret")
    expect(JSON.stringify(telemetryPayloads[0])).not.toContain("AAPL")
  })

  test("factor parity wrappers route to the launch OpenAPI paths", async () => {
    const seen: Array<{ url: string; method?: string; body?: string }> = []
    const client = new SecApiClient({
      retry: false,
      telemetry: false,
      fetch: async (url, init) => {
        seen.push({ url: String(url), method: init?.method, body: String(init?.body ?? "") })
        if (new URL(String(url)).pathname === "/v1/portfolio/hedge") {
          return jsonResponse(200, {
            object: "portfolio_hedge",
            id: "portfolio_hedge_test",
            analysisId: "portfolio_analysis_test",
            asOf: "2026-06-10T22:14:15.385Z",
            country: "US",
            lookback: "6m",
            objective: "factor_neutral",
            mode: "compact",
            constraints: {
              maxHedges: 1,
              maxPositionWeight: 0.1,
              maxTotalHedgeWeight: 0.3,
              maxSectorWeight: 1,
              hedgeIntensity: 1,
              longOnly: false,
              allowedInstrumentTypes: ["etf"],
              customUniverse: [],
              targetExposures: {},
              minConfidence: "medium",
              minLiquidityUsd: 0,
              excludedSectors: [],
            },
            holdings: [{ symbol: "AAPL", weight: 1 }],
            targetExposures: [{
              object: "portfolio_hedge_target_exposure",
              factorKey: "MKT_US",
              factorName: "US Market",
              factorCategory: "market",
              beta: 0.4,
              targetExposureDelta: -0.4,
              proposedExposureDelta: -0.1,
              residualBeta: 0.3,
              hedged: true,
              skipReason: null,
            }],
            hedges: [{
              object: "portfolio_hedge_candidate",
              rank: 1,
              factorKey: "MKT_US",
              factorName: "US Market",
              factorCategory: "market",
              symbol: "SPY",
              instrumentType: "etf",
              action: "short",
              recommendedWeight: 0.1,
              targetExposureDelta: -0.4,
              expectedExposureDelta: { MKT_US: -0.1 },
              residualBeta: 0.3,
              constraintStatus: "capped",
              constraintsApplied: ["max_position_weight"],
              liquidityUsd: 250000000,
              estimatedCostBps: 8.5,
              sectorKey: null,
              rationale: "Short SPY to reduce MKT_US exposure toward 0.",
              confidence: "medium",
            }],
            residualExposure: { MKT_US: 0.3 },
            exposures: [],
            optimizationNotes: ["Launch hedge weights are beta-equivalent proxy weights."],
            factorNeutralPlan: ["Apply MKT_US hedge delta -0.100; residual beta 0.300."],
            summaryMd: "Portfolio hedge is led by SPY for MKT_US.",
            provenance: {
              source: "secapi_factor_models",
              accessionNumber: null,
              filingUrl: "https://secapi.ai/methodology/factors",
              retrievedAt: "2026-06-10T22:14:15.385Z",
              parserVersion: "factor_strategy_v1",
            },
            sourceRights: {
              source: "secapi_factor_models",
              posture: "public_safe",
              publicAvailability: "public",
              contractStatus: "approved",
              restrictions: [],
            },
          })
        }
        if (new URL(String(url)).pathname === "/v1/models/factor-analysis") {
          return jsonResponse(200, {
            object: "model_factor_analysis",
            id: "model_factor_analysis_draft",
            asOf: "2026-06-10T22:14:15.385Z",
            model: {
              id: "draft",
              label: "Draft model",
              description: "Ad hoc model submitted for factor analysis.",
              tags: [],
              source: "client",
            },
            country: "US",
            lookback: "6m",
            window: "1m",
            category: "all",
            holdings: [{ symbol: "AAPL", weight: 1 }],
            include: {
              attribution: true,
              hedge: false,
              optimizer: true,
              positionViews: true,
            },
            analysis: {
              object: "portfolio_analysis",
              id: "portfolio_analysis_test",
              asOf: "2026-06-10T22:14:15.385Z",
              holdings: [{ symbol: "AAPL", weight: 1 }],
              exposures: [],
              summaryMd: "Draft model factor analysis.",
              provenance: {
                source: "secapi_factor_models",
                accessionNumber: null,
                filingUrl: "https://secapi.ai/methodology/factors",
                retrievedAt: "2026-06-10T22:14:15.385Z",
                parserVersion: "factor_strategy_v1",
              },
              sourceRights: {
                source: "secapi_factor_models",
                posture: "public_safe",
                publicAvailability: "public",
                contractStatus: "approved",
                restrictions: [],
              },
            },
            attribution: null,
            hedge: null,
            optimizerCandidateCount: 1,
            optimizerCandidateSample: [{
              object: "portfolio_optimizer_candidate",
              rank: 1,
              name: "Factor neutral",
              objective: "factor_neutral",
              expectedReturn: 0.1,
              expectedVolatility: 0.2,
              expectedSharpe: 0.5,
              maxDrawdownProxy: -0.1,
              factorExposureScore: 0.1,
              turnover: 0,
              score: 0.9,
              constraintStatus: "ok",
              constraintsApplied: [],
              rationale: "Bounded deterministic optimizer candidate.",
            }],
            selectedCandidate: {
              object: "portfolio_optimizer_candidate",
              rank: 1,
              name: "Factor neutral",
              objective: "factor_neutral",
              expectedReturn: 0.1,
              expectedVolatility: 0.2,
              expectedSharpe: 0.5,
              maxDrawdownProxy: -0.1,
              factorExposureScore: 0.1,
              turnover: 0,
              score: 0.9,
              constraintStatus: "ok",
              constraintsApplied: [],
              rationale: "Bounded deterministic optimizer candidate.",
            },
            optimizerDisclosures: ["Analytical research output, not investment advice."],
            positionViews: [],
            positionExposures: [],
            summaryMd: "Draft model factor analysis.",
            provenance: {
              source: "secapi_factor_models",
              accessionNumber: null,
              filingUrl: "https://secapi.ai/methodology/factors",
              retrievedAt: "2026-06-10T22:14:15.385Z",
              parserVersion: "factor_strategy_v1",
            },
            sourceRights: {
              source: "secapi_factor_models",
              posture: "public_safe",
              publicAvailability: "public",
              contractStatus: "approved",
              restrictions: [],
            },
          })
        }
        return jsonResponse(200, { ok: true })
      },
    })

    await client.factorHistory("MKT/US", { range: "1y", response_mode: "compact" })
    await client.factorSparklines({ factors: ["MOMENTUM", "VALUE"], points: 32 })
    await client.factorExtremeMoves({ category: "style", window: "1d", lookback: "6m", direction: "up", minAbsZScore: 1.25, response_mode: "compact" })
    await client.factorExtremePairs({ factors: ["MOMENTUM", "VALUE"], window: "1m", lookback: "6m", direction: "factor1", sort: "abs_spread_return", minAbsZScore: 0.75, response_mode: "compact" })
    await client.factorPairs({ factor1: "MOMENTUM", factor2: "VALUE" })
    await client.factorPairHistory("MOM/US", "VAL/US", { range: "1y", response_mode: "compact" })
    await client.factorBulkDownload({ factors: ["MOMENTUM"], include: "series" })
    await client.factorCustom({ symbol: "AAPL" }, { response_mode: "compact" })
    await client.portfolioAttribution({ holdings: [{ symbol: "AAPL", weight: 1 }] }, { response_mode: "compact" })
    const modelAnalysis = await client.modelFactorAnalysis({
      model: { id: "draft" },
      holdings: [{ symbol: "AAPL", weight: 1 }],
      include: { optimizer: true },
    }, { response_mode: "compact" })
    expect(modelAnalysis.optimizerCandidateSample?.[0]?.object).toBe("portfolio_optimizer_candidate")
    const hedge = await client.portfolioHedge({
      holdings: [{ symbol: "AAPL", weight: 1 }],
      constraints: { maxHedges: 1 },
    }, { response_mode: "compact" })
    expect(hedge.hedges[0]?.liquidityUsd).toBe(250000000)
    expect(hedge.hedges[0]?.estimatedCostBps).toBe(8.5)
    expect(hedge.hedges[0]?.sectorKey).toBeNull()

    expect(seen.map((entry) => new URL(entry.url).pathname)).toEqual([
      "/v1/factors/history/MKT%2FUS",
      "/v1/factors/sparklines",
      "/v1/factors/extreme-moves",
      "/v1/factors/extreme-pairs",
      "/v1/factors/pairs",
      "/v1/factors/pair-history/MOM%2FUS/VAL%2FUS",
      "/v1/factors/bulk-download",
      "/v1/factors/custom",
      "/v1/portfolio/attribution",
      "/v1/models/factor-analysis",
      "/v1/portfolio/hedge",
    ])
    expect(new URL(seen[0].url).searchParams.get("response_mode")).toBe("compact")
    expect(new URL(seen[1].url).searchParams.get("factors")).toBe("MOMENTUM,VALUE")
    expect(new URL(seen[2].url).searchParams.get("direction")).toBe("up")
    expect(new URL(seen[2].url).searchParams.get("window")).toBe("1d")
    expect(new URL(seen[2].url).searchParams.get("lookback")).toBe("6m")
    expect(new URL(seen[2].url).searchParams.get("minAbsZScore")).toBe("1.25")
    expect(new URL(seen[2].url).searchParams.get("response_mode")).toBe("compact")
    expect(new URL(seen[3].url).searchParams.get("factors")).toBe("MOMENTUM,VALUE")
    expect(new URL(seen[3].url).searchParams.get("direction")).toBe("factor1")
    expect(new URL(seen[3].url).searchParams.get("window")).toBe("1m")
    expect(new URL(seen[3].url).searchParams.get("lookback")).toBe("6m")
    expect(new URL(seen[3].url).searchParams.get("sort")).toBe("abs_spread_return")
    expect(new URL(seen[3].url).searchParams.get("minAbsZScore")).toBe("0.75")
    expect(new URL(seen[3].url).searchParams.get("response_mode")).toBe("compact")
    expect(new URL(seen[5].url).searchParams.get("range")).toBe("1y")
    expect(new URL(seen[6].url).searchParams.get("include")).toBe("series")
    expect(new URL(seen[7].url).searchParams.get("response_mode")).toBe("compact")
    expect(new URL(seen[10].url).searchParams.get("response_mode")).toBe("compact")
    expect(seen.slice(7).map((entry) => entry.method)).toEqual(["POST", "POST", "POST", "POST"])
    expect(seen[10].body).not.toContain("response_mode")
    expect(seen[10].body).toContain("constraints")
  })
})
