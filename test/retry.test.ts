import { describe, expect, test } from "bun:test"
import { OmniDatastreamClient, OmniDatastreamError, OmniDatastreamValidationError, type RetryOptions } from "../src/index.js"

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

describe("OmniDatastreamClient retry behavior", () => {
  test("sends SEC API version header plus legacy compatibility header", async () => {
    let headers: Headers | null = null
    const client = new OmniDatastreamClient({
      telemetry: false,
      apiVersion: "2026-05-20",
      fetch: async (_url, init) => {
        headers = new Headers(init?.headers)
        return jsonResponse(200, { ok: true })
      },
    })

    await expect(client.health()).resolves.toEqual({ ok: true })
    expect(headers?.get("secapi-version")).toBe("2026-05-20")
    expect(headers?.get("omni-version")).toBe("2026-05-20")
  })

  test("retries safe GET requests on retryable 5xx responses", async () => {
    const attempts: string[] = []
    const { delays, retry } = retryHarness()
    const client = new OmniDatastreamClient({
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
    const client = new OmniDatastreamClient({
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
    const client = new OmniDatastreamClient({
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

  test("does not retry schema validation failures after successful responses", async () => {
    let attempts = 0
    const { delays, retry } = retryHarness()
    const client = new OmniDatastreamClient({
      retry,
      telemetry: false,
      fetch: async () => {
        attempts += 1
        return jsonResponse(200, { object: "not_a_stream_ticket" })
      },
    })

    await expect((client as any).createStreamTicket()).rejects.toBeInstanceOf(OmniDatastreamValidationError)
    expect(attempts).toBe(1)
    expect(delays).toEqual([])
  })

  test("honors per-call opt-out", async () => {
    let attempts = 0
    const { retry } = retryHarness()
    const client = new OmniDatastreamClient({
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
    const client = new OmniDatastreamClient({
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

  test("does not attach retry budget timeout when retries are disabled", async () => {
    let seenSignal: AbortSignal | undefined
    const client = new OmniDatastreamClient({
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
    const client = new OmniDatastreamClient({
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
    const client = new OmniDatastreamClient({
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
    const client = new OmniDatastreamClient({
      retry,
      telemetry: false,
      fetch: async () => {
        attempts += 1
        throw new DOMException("The operation was aborted.", "AbortError")
      },
    })

    controller.abort()
    await expect((client as any).request("/healthz", { signal: controller.signal })).rejects.toMatchObject({ name: "AbortError" })
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

    const client = new OmniDatastreamClient({
      retry: { totalBudgetMs: 30_000 },
      telemetry: false,
      fetch: async () => jsonResponse(200, { ok: true }),
    })

    try {
      for (let i = 0; i < 12; i += 1) {
        await expect((client as any).request("/healthz", { signal: controller.signal })).resolves.toEqual({ ok: true })
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
    const client = new OmniDatastreamClient({
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
        name: "OmniDatastreamError",
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
    const client = new OmniDatastreamClient({
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
    const client = new OmniDatastreamClient({
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
    const client = new OmniDatastreamClient({
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
    const client = new OmniDatastreamClient({
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

  test("retries MCP tools/call only when explicitly opted in", async () => {
    let attempts = 0
    const seenIdempotencyKeys: Array<string | null> = []
    const { retry } = retryHarness()
    const client = new OmniDatastreamClient({
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
    const client = new OmniDatastreamClient({
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
    const client = new OmniDatastreamClient({
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
        sdk_version: "0.3.0",
        method: "GET",
        route: "/v1/filings/latest",
        status: 502,
        $process_person_profile: false,
      },
    })
    expect(JSON.stringify(telemetryPayloads[0])).not.toContain("ods_secret")
    expect(JSON.stringify(telemetryPayloads[0])).not.toContain("AAPL")
  })
})
