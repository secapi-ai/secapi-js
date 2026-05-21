import type { ZodType } from "zod"
import {
  entityResolutionSchema,
  entitySchema,
  filingSchema,
  sectionSchema,
  statementBundleSchema,
  statementSchema,
  factPointSchema,
  shareFloatSchema,
  segmentedRevenueSeriesSchema,
  boardCompositionSchema,
  nportHoldingsSchema,
  riskCategoryReportSchema,
  ownershipReportSchema,
  ownershipComparisonSchema,
  institutionalOwnershipExtractSchema,
  institutionalHolderListSchema,
  insiderTradeSchema,
  beneficialOwnershipReportSchema,
  offeringRecordSchema,
  maEventSchema,
  enforcementActionSchema,
  earningsMaterialSchema,
  compensationRecordSchema,
  compensationComparisonSchema,
  artifactSchema,
  artifactSummarySchema,
  artifactManifestSchema,
  artifactExportSchema,
  artifactReconciliationSchema,
  marketCalendarDaySchema,
  indexSchema,
  indexConstituentSchema,
  derivedSignalSchema,
  traceSchema,
  analyticsQueryResultSchema,
  organizationSchema,
  apiKeySchema,
  usageSummarySchema,
  limitsSchema,
  billingAccountSchema,
  billingQuoteSchema,
  billingCheckoutSessionSchema,
  billingPortalSessionSchema,
  billingBudgetSchema,
  dashboardOverviewSchema,
  webhookEndpointSchema,
  webhookDeliveryAttemptSchema,
  streamSubscriptionSchema,
  streamTicketSchema,
  streamEventPageSchema,
  agentBootstrapTokenSchema,
  agentBootstrapSchema,
  installPayloadSchema,
  responseViewSchema,
} from "./generated-contracts/index.js"
import type { z } from "zod"

/**
 * `?view=` response mode. Mirrors the canonical `ResponseView` union in
 * `@omni-datastream/contracts`. Agent mode returns a strictly smaller,
 * essentials+citation-pointers shape on supported endpoints (OMNI-3075 / 3084).
 */
export type ResponseView = z.infer<typeof responseViewSchema>

const DEFAULT_BASE_URL = "https://api.secapi.ai"
const DEFAULT_API_VERSION = "2026-03-19"
const SDK_VERSION = "0.3.0"
const POSTHOG_CAPTURE_TOKEN = "phc_erM3KBxu4WfepnjJ6TLT11QA0yykiCeRQdi5S4xwCR6"
const POSTHOG_CAPTURE_HOST = "https://us.i.posthog.com"

const SAFE_RETRY_METHODS = new Set(["GET", "HEAD", "OPTIONS"])
const RETRYABLE_STATUSES = new Set([408, 429, 502, 503, 504])
const NEVER_RETRY_STATUSES = new Set([400, 401, 403, 404, 422])
const DEFAULT_RETRY_CONFIG = {
  maxRetries: 3,
  baseDelayMs: 200,
  maxDelayMs: 5_000,
  totalBudgetMs: 30_000,
  circuitBreakerFailureThreshold: 5,
  circuitBreakerCooldownMs: 60_000,
}

export type OmniDatastreamClientOptions = {
  apiKey?: string
  bearerToken?: string
  apiVersion?: string
  baseUrl?: string
  fetch?: typeof fetch
  headers?: HeadersInit
  retry?: false | RetryOptions
  telemetry?: false | TelemetryOptions
}

export type SecApiClientOptions = OmniDatastreamClientOptions

export type RetryOptions = {
  enabled?: boolean
  maxRetries?: number
  baseDelayMs?: number
  maxDelayMs?: number
  totalBudgetMs?: number
  idempotencyKey?: string
  sleep?: (delayMs: number) => Promise<void>
  now?: () => number
  random?: () => number
}

export type TelemetryOptions = {
  enabled?: boolean
  captureToken?: string
  host?: string
  fetch?: typeof fetch
  distinctId?: string
  timeoutMs?: number
}

export type RequestOptions = {
  retry?: false | RetryOptions
  telemetry?: false | TelemetryOptions
}

export type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue }

export type RequestParams<T extends Record<string, unknown>> = T & RequestOptions

type ParsedResponse = {
  payload: unknown
  requestId?: string
}

type RetryDecision = {
  retryable: boolean
  status?: number
  reason: "status" | "network" | "budget" | "disabled" | "method" | "non_retryable_status" | "aborted" | "validation"
}

type CircuitState = "closed" | "open" | "half_open"

class ClientCircuitBreaker {
  private state: CircuitState = "closed"
  private consecutiveFailures = 0
  private openedAt = 0

  constructor(
    private readonly failureThreshold: number,
    private readonly cooldownMs: number,
  ) {}

  beforeRequest(now: number) {
    if (this.state !== "open") return
    if (now - this.openedAt >= this.cooldownMs) {
      this.state = "half_open"
      return
    }
    throw new OmniDatastreamError({
      message: "Omni Datastream client circuit breaker is open",
      status: 0,
      code: "client_circuit_open",
    })
  }

  recordSuccess() {
    this.state = "closed"
    this.consecutiveFailures = 0
    this.openedAt = 0
  }

  recordFailure(now: number) {
    this.consecutiveFailures += 1
    if (this.state === "half_open" || this.consecutiveFailures >= this.failureThreshold) {
      this.state = "open"
      this.openedAt = now
    }
  }

  snapshot() {
    return {
      state: this.state,
      consecutiveFailures: this.consecutiveFailures,
      openedAt: this.openedAt,
    }
  }
}

export class OmniDatastreamError extends Error {
  readonly status: number
  readonly code?: string
  readonly requestId?: string
  readonly body?: unknown
  readonly retryAfterMs?: number

  constructor(args: { message: string; status: number; code?: string; requestId?: string; body?: unknown; retryAfterMs?: number }) {
    super(args.message)
    this.name = "OmniDatastreamError"
    this.status = args.status
    this.code = args.code
    this.requestId = args.requestId
    this.body = args.body
    this.retryAfterMs = args.retryAfterMs
  }
}

export class OmniDatastreamValidationError extends Error {
  readonly raw: unknown
  readonly issues: unknown[]

  constructor(raw: unknown, issues: unknown[]) {
    super(`Response validation failed: ${issues.length} issue(s)`)
    this.name = "OmniDatastreamValidationError"
    this.raw = raw
    this.issues = issues
  }
}

function parseWithSchema<S extends ZodType>(schema: S, data: unknown): z.infer<S> {
  const result = schema.safeParse(data)
  if (result.success) return result.data
  throw new OmniDatastreamValidationError(data, result.error.issues)
}

function isRequestOptionKey(key: string) {
  return key === "retry" || key === "telemetry"
}

function requestOptionsFromParams(params?: Record<string, unknown>): RequestOptions | undefined {
  if (!params) return undefined
  const options: RequestOptions = {}
  if ("retry" in params) {
    const retry = params.retry
    if (retry === false || (retry && typeof retry === "object" && !Array.isArray(retry))) {
      options.retry = retry as false | RetryOptions
    }
  }
  if ("telemetry" in params) {
    const telemetry = params.telemetry
    if (telemetry === false || (telemetry && typeof telemetry === "object" && !Array.isArray(telemetry))) {
      options.telemetry = telemetry as false | TelemetryOptions
    }
  }
  return Object.keys(options).length > 0 ? options : undefined
}

function mergeRequestOptions(first?: RequestOptions, second?: RequestOptions): RequestOptions | undefined {
  if (!first) return second
  if (!second) return first
  return {
    retry: second.retry ?? first.retry,
    telemetry: second.telemetry ?? first.telemetry,
  }
}

function buildSearchParams(params: Record<string, unknown>) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (isRequestOptionKey(key)) continue
    if (value === undefined || value === null) continue
    const serialized = Array.isArray(value) ? value.join(",") : String(value)
    if (serialized === "") continue
    search.set(key, serialized)
  }
  return search
}

function buildUrl(path: string, params?: Record<string, unknown>) {
  const url = new URL(path, DEFAULT_BASE_URL)
  if (!params) return url.pathname

  const search = buildSearchParams(params)
  return search.size > 0 ? `${url.pathname}?${search.toString()}` : url.pathname
}

function methodOf(init: RequestInit) {
  return (init.method ?? "GET").toUpperCase()
}

function sleep(delayMs: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, delayMs))
}

function parseRetryAfterMs(value: string | null, now: number): number | undefined {
  if (!value) return undefined
  const trimmed = value.trim()
  if (!trimmed) return undefined
  const seconds = Number(trimmed)
  if (Number.isFinite(seconds) && seconds >= 0) {
    return Math.round(seconds * 1_000)
  }
  const dateMs = Date.parse(trimmed)
  if (Number.isFinite(dateMs)) {
    return Math.max(0, dateMs - now)
  }
  return undefined
}

function mergeRetryOptions(globalRetry: false | RetryOptions | undefined, callRetry: false | RetryOptions | undefined) {
  if (callRetry === false) return { disabled: true, options: {} as RetryOptions, unsafeOptIn: false }
  const callOptions = callRetry ?? {}
  const unsafeOptIn = Boolean(callRetry && callRetry.enabled === true)
  if (globalRetry === false && !unsafeOptIn) return { disabled: true, options: {} as RetryOptions, unsafeOptIn: false }
  const globalOptions = globalRetry === false ? {} : globalRetry ?? {}
  const enabled = callOptions.enabled ?? globalOptions.enabled ?? true
  const options = { ...globalOptions, ...callOptions, enabled }
  return {
    disabled: enabled === false,
    options,
    unsafeOptIn,
  }
}

function mergeTelemetryOptions(globalTelemetry: false | TelemetryOptions | undefined, callTelemetry: false | TelemetryOptions | undefined) {
  if (callTelemetry === false || globalTelemetry === false) return { disabled: true, options: {} as TelemetryOptions }
  const globalOptions = globalTelemetry ?? {}
  const callOptions = callTelemetry ?? {}
  return {
    disabled: callOptions.enabled === false || globalOptions.enabled === false,
    options: { ...globalOptions, ...callOptions },
  }
}

function retryDelayMs(args: {
  attempt: number
  baseDelayMs: number
  maxDelayMs: number
  random: () => number
  retryAfterMs?: number
}) {
  if (args.retryAfterMs !== undefined) return args.retryAfterMs
  const exponential = Math.min(args.maxDelayMs, args.baseDelayMs * 2 ** args.attempt)
  return Math.floor(args.random() * exponential)
}

function isAbortError(error: unknown) {
  return Boolean(error && typeof error === "object" && "name" in error && (error as { name?: unknown }).name === "AbortError")
}

function retryBudgetExceededError() {
  return new OmniDatastreamError({
    message: "Omni Datastream request exceeded retry budget",
    status: 0,
    code: "client_retry_budget_exceeded",
  })
}

function joinSignals(signals: Array<AbortSignal | null | undefined>): { signal?: AbortSignal; cleanup: () => void } {
  const active = signals.filter(Boolean) as AbortSignal[]
  if (active.length === 0) return { cleanup: () => undefined }
  if (active.length === 1) return { signal: active[0], cleanup: () => undefined }
  if (typeof AbortSignal !== "undefined" && "any" in AbortSignal) {
    return { signal: AbortSignal.any(active), cleanup: () => undefined }
  }
  const controller = new AbortController()
  const listeners: Array<{ signal: AbortSignal; listener: () => void }> = []
  const cleanup = () => {
    for (const entry of listeners) {
      entry.signal.removeEventListener("abort", entry.listener)
    }
    listeners.length = 0
  }

  for (const signal of active) {
    if (signal.aborted) {
      controller.abort(signal.reason)
      break
    }
    const listener = () => {
      controller.abort(signal.reason)
      cleanup()
    }
    signal.addEventListener("abort", listener, { once: true })
    listeners.push({ signal, listener })
  }
  return { signal: controller.signal, cleanup }
}

function randomId() {
  const cryptoApi = globalThis.crypto
  if (cryptoApi && "randomUUID" in cryptoApi) return cryptoApi.randomUUID()
  return `sdk_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`
}

function routeTemplate(path: string) {
  const pathname = new URL(path, DEFAULT_BASE_URL).pathname
  return pathname
    .split("/")
    .map((segment) => {
      if (/^[0-9a-f]{8,}$/i.test(segment)) return ":id"
      if (/^\d{10}-\d{2}-\d{6}$/.test(segment)) return ":accession"
      if (/^[A-Z0-9]{10,}$/i.test(segment) && /\d/.test(segment)) return ":id"
      return segment
    })
    .join("/")
}

function extractRequestId(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return undefined
  const value = (payload as Record<string, unknown>).requestId
  return typeof value === "string" && value.trim() ? value.trim() : undefined
}

function extractErrorCode(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return undefined
  const value = (payload as Record<string, unknown>).code
  return typeof value === "string" && value.trim() ? value.trim() : undefined
}

function buildErrorMessage(status: number, requestId: string | undefined, payload: unknown) {
  const message =
    payload && typeof payload === "object" && !Array.isArray(payload) && typeof (payload as Record<string, unknown>).message === "string"
      ? String((payload as Record<string, unknown>).message)
      : payload && typeof payload === "object" && !Array.isArray(payload) && typeof (payload as Record<string, unknown>).error === "string"
        ? String((payload as Record<string, unknown>).error)
      : typeof payload === "string" && payload.trim()
        ? payload.trim()
        : `Omni Datastream request failed with status ${status}`

  return requestId ? `${message} (request_id: ${requestId})` : message
}

export class OmniDatastreamClient {
  private readonly circuitBreaker = new ClientCircuitBreaker(
    DEFAULT_RETRY_CONFIG.circuitBreakerFailureThreshold,
    DEFAULT_RETRY_CONFIG.circuitBreakerCooldownMs,
  )
  private readonly telemetryDistinctId = randomId()

  constructor(private readonly options: OmniDatastreamClientOptions = {}) {}

  get baseUrl() {
    return (this.options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "")
  }

  private get fetchImpl() {
    return this.options.fetch ?? fetch
  }

  private headers(initHeaders?: HeadersInit) {
    const headers = new Headers(this.options.headers)
    headers.set("secapi-version", this.options.apiVersion ?? DEFAULT_API_VERSION)
    headers.set("omni-version", this.options.apiVersion ?? DEFAULT_API_VERSION)

    if (this.options.bearerToken) {
      headers.set("Authorization", `Bearer ${this.options.bearerToken}`)
    }

    if (this.options.apiKey) {
      headers.set("x-api-key", this.options.apiKey)
    }

    const extraHeaders = new Headers(initHeaders)
    extraHeaders.forEach((value, key) => {
      headers.set(key, value)
    })

    return headers
  }

  private async get<T = unknown>(path: string, params?: RequestParams<Record<string, unknown>>, schema?: ZodType<T>): Promise<T> {
    return this.request(buildUrl(path, params), {}, schema, requestOptionsFromParams(params))
  }

  private async fetchOnce(path: string, init: RequestInit, signal?: AbortSignal): Promise<Response> {
    return this.fetchImpl(`${this.baseUrl}${path}`, {
      ...init,
      signal,
      headers: this.headers(init.headers),
    })
  }

  private async parseResponse(response: Response): Promise<ParsedResponse> {
    const contentType = response.headers.get("content-type") ?? ""
    const responseRequestId =
      response.headers.get("Request-Id") ??
      response.headers.get("X-Correlation-Id") ??
      undefined

    let payload: unknown = undefined
    if (response.status !== 204) {
      if (contentType.includes("application/json")) {
        payload = await response.json()
      } else {
        payload = await response.text()
      }
    }

    const requestId = extractRequestId(payload) ?? responseRequestId
    return { payload, requestId }
  }

  private shouldRetry(args: {
    error: unknown
    method: string
    retryDisabled: boolean
    unsafeOptIn: boolean
  }): RetryDecision {
    if (args.retryDisabled) return { retryable: false, reason: "disabled" }
    if (isAbortError(args.error)) return { retryable: false, reason: "aborted" }
    if (args.error instanceof OmniDatastreamValidationError) return { retryable: false, reason: "validation" }

    if (args.error instanceof OmniDatastreamError) {
      const status = args.error.status
      if (NEVER_RETRY_STATUSES.has(status)) return { retryable: false, status, reason: "non_retryable_status" }
      if (!RETRYABLE_STATUSES.has(status)) return { retryable: false, status, reason: "status" }
      if (status === 429) return { retryable: true, status, reason: "status" }
      if (SAFE_RETRY_METHODS.has(args.method) || args.unsafeOptIn) return { retryable: true, status, reason: "status" }
      return { retryable: false, status, reason: "method" }
    }

    if (SAFE_RETRY_METHODS.has(args.method) || args.unsafeOptIn) return { retryable: true, reason: "network" }
    return { retryable: false, reason: "method" }
  }

  private emitRetryTelemetry(args: {
    path: string
    method: string
    attempt: number
    maxRetries: number
    delayMs: number
    status?: number
    reason: string
    elapsedMs: number
    requestOptions?: RequestOptions
  }) {
    const { disabled, options } = mergeTelemetryOptions(this.options.telemetry, args.requestOptions?.telemetry)
    if (disabled) return

    const captureToken = options.captureToken ?? POSTHOG_CAPTURE_TOKEN
    const host = (options.host ?? POSTHOG_CAPTURE_HOST).replace(/\/$/, "")
    const fetchImpl = options.fetch ?? globalThis.fetch
    if (!captureToken || typeof fetchImpl !== "function") return

    const controller = typeof AbortController !== "undefined" ? new AbortController() : null
    const timeout = controller ? setTimeout(() => controller.abort(), options.timeoutMs ?? 1_000) : null
    const payload = {
      api_key: captureToken,
      event: "client_retry_attempt",
      distinct_id: options.distinctId ?? this.telemetryDistinctId,
      properties: {
        sdk_language: "js",
        sdk_version: SDK_VERSION,
        method: args.method,
        route: routeTemplate(args.path),
        server_origin: new URL(this.baseUrl).origin,
        attempt: args.attempt,
        max_retries: args.maxRetries,
        delay_ms: args.delayMs,
        status: args.status ?? null,
        reason: args.reason,
        elapsed_ms: Math.round(args.elapsedMs),
        $process_person_profile: false,
      },
    }

    void fetchImpl(`${host}/capture/`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller?.signal,
    }).catch(() => undefined).finally(() => {
      if (timeout) clearTimeout(timeout)
    })
  }

  private async request<T = unknown>(path: string, init: RequestInit = {}, schema?: ZodType<T>, requestOptions?: RequestOptions): Promise<T> {
    const method = methodOf(init)
    const { disabled: retryDisabled, options: retryOptions, unsafeOptIn } = mergeRetryOptions(this.options.retry, requestOptions?.retry)
    const maxRetries = retryOptions.maxRetries ?? DEFAULT_RETRY_CONFIG.maxRetries
    const baseDelayMs = retryOptions.baseDelayMs ?? DEFAULT_RETRY_CONFIG.baseDelayMs
    const maxDelayMs = retryOptions.maxDelayMs ?? DEFAULT_RETRY_CONFIG.maxDelayMs
    const totalBudgetMs = retryDisabled ? Number.POSITIVE_INFINITY : retryOptions.totalBudgetMs ?? DEFAULT_RETRY_CONFIG.totalBudgetMs
    const now = retryOptions.now ?? (() => Date.now())
    const random = retryOptions.random ?? (() => Math.random())
    const sleepImpl = retryOptions.sleep ?? sleep
    const startedAt = now()
    const circuitEligible = !retryDisabled

    if (circuitEligible) {
      this.circuitBreaker.beforeRequest(startedAt)
    }

    let attempt = 0
    let lastError: unknown

    while (attempt <= maxRetries) {
      const elapsedMs = now() - startedAt
      const remainingMs = totalBudgetMs - elapsedMs
      if (remainingMs <= 0) {
        if (circuitEligible && lastError) this.circuitBreaker.recordFailure(now())
        throw lastError instanceof Error ? lastError : retryBudgetExceededError()
      }

      const controller = Number.isFinite(remainingMs) && typeof AbortController !== "undefined" ? new AbortController() : null
      const timeout = controller ? setTimeout(() => controller.abort(), remainingMs) : null
      const joinedSignal = joinSignals([init.signal, controller?.signal])

      try {
        const headers = new Headers(init.headers)
        if (retryOptions.idempotencyKey) {
          headers.set("Idempotency-Key", retryOptions.idempotencyKey)
        }
        const response = await this.fetchOnce(path, { ...init, headers }, joinedSignal.signal)
        const { payload, requestId } = await this.parseResponse(response)

        if (!response.ok) {
          throw new OmniDatastreamError({
            message: buildErrorMessage(response.status, requestId, payload),
            status: response.status,
            code: extractErrorCode(payload),
            requestId,
            body: payload,
            retryAfterMs: parseRetryAfterMs(response.headers.get("retry-after"), now()),
          })
        }

        if (circuitEligible) this.circuitBreaker.recordSuccess()
        if (schema) return parseWithSchema(schema, payload)
        return payload as T
      } catch (error) {
        if (controller?.signal.aborted && isAbortError(error)) {
          const budgetError = retryBudgetExceededError()
          lastError = budgetError
          if (circuitEligible) this.circuitBreaker.recordFailure(now())
          throw budgetError
        }
        lastError = error
        const decision = this.shouldRetry({ error, method, retryDisabled, unsafeOptIn })
        const retryAfterMs = error instanceof OmniDatastreamError && decision.status === 429 ? error.retryAfterMs : undefined

        if (!decision.retryable || attempt >= maxRetries) {
          if (decision.retryable && circuitEligible) this.circuitBreaker.recordFailure(now())
          throw error
        }

        const delayMs = retryDelayMs({
          attempt,
          baseDelayMs,
          maxDelayMs,
          random,
          retryAfterMs,
        })
        const elapsedAfterAttemptMs = now() - startedAt
        if (elapsedAfterAttemptMs + delayMs > totalBudgetMs) {
          if (circuitEligible) this.circuitBreaker.recordFailure(now())
          throw error
        }

        this.emitRetryTelemetry({
          path,
          method,
          attempt: attempt + 1,
          maxRetries,
          delayMs,
          status: decision.status,
          reason: decision.reason,
          elapsedMs: elapsedAfterAttemptMs,
          requestOptions,
        })

        await sleepImpl(delayMs)
        attempt += 1
      } finally {
        if (timeout) clearTimeout(timeout)
        joinedSignal.cleanup()
      }
    }

    throw lastError instanceof Error ? lastError : new OmniDatastreamError({
      message: "Omni Datastream request failed",
      status: 0,
      code: "client_request_failed",
    })
  }

  get circuitState() {
    return this.circuitBreaker.snapshot()
  }

  async health(options?: RequestOptions) {
    return this.request("/healthz", {}, undefined, options)
  }

  async me(options?: RequestOptions) {
    return this.request("/v1/me", {}, undefined, options)
  }

  async org(options?: RequestOptions) {
    return this.request("/v1/org", {}, undefined, options)
  }

  async billing(options?: RequestOptions) {
    return this.request("/v1/billing", {}, undefined, options)
  }

  async dashboardOverview(options?: RequestOptions) {
    return this.request("/v1/dashboard/overview", {}, undefined, options)
  }

  async listApiKeys(options?: RequestOptions) {
    return this.request("/v1/api_keys", {}, undefined, options)
  }

  async deleteApiKey(keyId: string, options?: RequestOptions) {
    return this.request(`/v1/api_keys/${encodeURIComponent(keyId)}`, { method: "DELETE" }, undefined, options)
  }

  async usage(options?: RequestOptions) {
    return this.request("/v1/usage", {}, undefined, options)
  }

  async limits(options?: RequestOptions) {
    return this.request("/v1/limits", {}, undefined, options)
  }

  async events(params: RequestParams<{ kind?: string; type?: string; requestId?: string; since?: string; limit?: number }> = {}) {
    return this.get("/v1/events", params)
  }

  async exportEvents(
    params: RequestParams<{ kind?: string; type?: string; requestId?: string; since?: string; limit?: number; format?: "json" | "ndjson" }> = {},
  ) {
    return this.get("/v1/events/export", params)
  }

  async requestDiagnostics(requestId: string, options?: RequestOptions) {
    return this.request(`/v1/diagnostics/requests/${requestId}`, {}, undefined, options)
  }

  async listAdminOrganizations(params: RequestParams<{ q?: string; limit?: number }> = {}) {
    return this.get("/v1/admin/orgs", params)
  }

  async getAdminOrganization(orgId: string, params: RequestParams<{ limit?: number }> = {}) {
    return this.get(`/v1/admin/orgs/${orgId}`, params)
  }

  async getAdminRequestDiagnostics(orgId: string, requestId: string, options?: RequestOptions) {
    return this.request(`/v1/admin/orgs/${orgId}/requests/${requestId}`, {}, undefined, options)
  }

  async getAdminDeliverySummary(orgId: string, params: RequestParams<{ since?: string; limit?: number }> = {}) {
    return this.get(`/v1/admin/orgs/${orgId}/deliveries/summary`, params)
  }

  async deliverySummary(params: RequestParams<{ since?: string; limit?: number }> = {}) {
    return this.get("/v1/diagnostics/deliveries/summary", params)
  }

  async observability(options?: RequestOptions) {
    return this.request("/v1/observability", {}, undefined, options)
  }

  async exportObservability(params: RequestParams<{ limit?: number }> = {}) {
    return this.get("/v1/observability/export", params)
  }

  async createApiKey(body: { label?: string; scopes?: string[]; livemode?: boolean }, options?: RequestOptions) {
    return this.request("/v1/api_keys", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }, undefined, options)
  }

  async createAgentBootstrapToken(body: { label?: string; scopes?: string[]; ttlSeconds?: number } = {}, options?: RequestOptions) {
    return this.request("/v1/agent/bootstrap_tokens", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }, undefined, options)
  }

  async bootstrapAgent(body: { token: string; label?: string; scopes?: string[] }, options?: RequestOptions) {
    return this.request("/v1/agent/bootstrap", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }, undefined, options)
  }

  async quoteBilling(body: { planKey?: string; meterClass?: string; path?: string; method?: string; units?: number }, options?: RequestOptions) {
    return this.request("/v1/billing/quote", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }, undefined, options)
  }

  async updateBillingBudget(body: {
    spendCapCents?: number | null
    softCapCents?: number | null
    approvalThresholdCents?: number | null
  }, options?: RequestOptions) {
    return this.request("/v1/billing/budget", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }, undefined, options)
  }

  async createCheckoutSession(body: { planKey: string; successUrl?: string; cancelUrl?: string }, options?: RequestOptions) {
    return this.request("/v1/billing/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }, undefined, options)
  }

  async createBillingPortalSession(body: { returnUrl?: string } = {}, options?: RequestOptions) {
    return this.request("/v1/billing/portal", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }, undefined, options)
  }

  async listWebhookEndpoints(options?: RequestOptions) {
    return this.request("/v1/webhook_endpoints", {}, undefined, options)
  }

  async createWebhookEndpoint(
    body: { destinationUrl: string; description?: string; subscribedEventTypes?: string[]; livemode?: boolean },
    options?: RequestOptions,
  ) {
    return this.request("/v1/webhook_endpoints", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }, undefined, options)
  }

  async rotateWebhookEndpointSecret(webhookId: string, options?: RequestOptions) {
    return this.request(`/v1/webhook_endpoints/${webhookId}/rotate_secret`, {
      method: "POST",
    }, undefined, options)
  }

  async listWebhookDeliveries(webhookId: string, params: RequestParams<{ eventId?: string; limit?: number }> = {}) {
    return this.get(`/v1/webhook_endpoints/${webhookId}/deliveries`, params)
  }

  async replayWebhookDelivery(webhookId: string, deliveryId: string, options?: RequestOptions) {
    return this.request(`/v1/webhook_endpoints/${webhookId}/deliveries/${deliveryId}/replay`, {
      method: "POST",
    }, undefined, options)
  }

  async listStreamSubscriptions(options?: RequestOptions) {
    return this.request("/v1/stream_subscriptions", {}, undefined, options)
  }

  async createStreamSubscription(
    body: { description?: string; eventTypes?: string[]; transport?: "poll" | "webhook_mirror"; livemode?: boolean },
    options?: RequestOptions,
  ) {
    return this.request("/v1/stream_subscriptions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }, undefined, options)
  }

  async streamEvents(streamId: string, params: RequestParams<{ cursor?: string; type?: string; limit?: number }> = {}) {
    return this.get(`/v1/stream_subscriptions/${streamId}/events`, params)
  }

  async resolveEntity(params: RequestParams<{
    ticker?: string
    cik?: string
    figi?: string
    composite_figi?: string
    share_class_figi?: string
    isin?: string
    cusip?: string
    name?: string
  }>) {
    return this.get("/v1/entities/resolve", params)
  }

  async listTraces(params: RequestParams<{ ids: string | string[] }>) {
    const ids = Array.isArray(params.ids) ? params.ids.join(",") : params.ids
    return this.get("/v1/traces", { ids, ...(requestOptionsFromParams(params) ?? {}) })
  }

  async getTrace(traceId: string, options?: RequestOptions) {
    return this.request(`/v1/traces/${traceId}`, {}, undefined, options)
  }

  async analyticsQuery(body: {
    dataset: "filings" | "sections_items"
    dimensions?: Array<"year" | "form">
    measures?: Array<"count">
    filters?: { ticker?: string; cik?: string; form?: string }
    timeWindow?: { from?: string; to?: string }
    sort?: { field: "year" | "form" | "count"; direction?: "asc" | "desc" }
    limit?: number
  }, options?: RequestOptions) {
    return this.request("/v1/analytics/query", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }, undefined, options)
  }

  async searchEntities(params: RequestParams<{ q?: string; entity_type?: string; cursor?: string; limit?: number }> = {}) {
    return this.get("/v1/entities", params)
  }

  async searchFilings(params: RequestParams<{
    ticker?: string
    cik?: string
    form?: string
    forms?: string | string[]
    accession_number?: string
    q?: string
    date_from?: string
    date_to?: string
    sort?: "filing_date_desc" | "filing_date_asc"
    cursor?: string
    limit?: number
  }>) {
    return this.get("/v1/filings", params)
  }

  async filingByAccession(accessionNumber: string, params: RequestParams<{ ticker?: string; cik?: string; form?: string }> = {}) {
    return this.get(`/v1/filings/${accessionNumber}`, params)
  }

  async latestFiling(params: RequestParams<{ ticker?: string; cik?: string; form?: string }>) {
    return this.get("/v1/filings/latest", params)
  }

  async renderLatestFiling(params: RequestParams<{ ticker?: string; cik?: string; form?: string }>) {
    return this.get("/v1/filings/latest/render", params)
  }

  async latestSection(params: RequestParams<{ ticker?: string; cik?: string; form?: string; sectionKey: string; mode?: "compact" | "full" }>) {
    const { sectionKey, ...rest } = params
    return this.get(`/v1/filings/latest/sections/${sectionKey}`, rest)
  }

  async latestRiskCategories(params: RequestParams<{ ticker?: string; cik?: string; form?: string }> = {}) {
    return this.get("/v1/filings/latest/risk-categories", params)
  }

  async boardComposition(params: RequestParams<{ ticker?: string; cik?: string }> = {}) {
    return this.get("/v1/board", params)
  }

  async nportHoldings(params: RequestParams<{ ticker?: string; cik?: string; limit?: number; view?: ResponseView }> = {}) {
    return this.get("/v1/funds/nport/holdings", params)
  }

  async filingSectionByAccession(
    accessionNumber: string,
    params: RequestParams<{ sectionKey: string; ticker?: string; cik?: string; form?: string }>,
  ) {
    const { sectionKey, ...rest } = params
    return this.get(`/v1/filings/${accessionNumber}/sections/${sectionKey}`, rest)
  }

  async searchSections(params: RequestParams<{ ticker?: string; cik?: string; form?: string; filing_id?: string; q?: string; cursor?: string; limit?: number }>) {
    return this.get("/v1/sections/search", params)
  }

  async segmentedRevenues(
    params: RequestParams<{ ticker?: string; cik?: string; period?: "annual" | "quarterly"; segment_type?: "geographic" | "product" | "other"; limit?: number }> = {},
  ) {
    return this.get("/v1/statements/segmented-revenues", params)
  }

  async segmentedFacts(
    params: RequestParams<{ ticker?: string; cik?: string; metric: "revenue" | "profit_loss"; period?: "annual" | "quarterly"; segment_type?: "geographic" | "product" | "other"; limit?: number; submission_file_limit?: number }> ,
  ) {
    return this.get("/v1/statements/segmented-facts", params)
  }

  async pensionBenefitSchedule(
    params: RequestParams<{ ticker?: string; cik?: string; filing_year: number; target_year: number; form?: string; accession_number?: string }>,
  ) {
    return this.get("/v1/filings/pension-benefit-schedule", params)
  }

  async shareFloat(params: RequestParams<{ ticker?: string; cik?: string }> = {}) {
    return this.get("/v1/statements/share-float", params)
  }

  async offerings(params: RequestParams<{ ticker?: string; cik?: string; forms?: string | string[]; date_from?: string; date_to?: string; cursor?: string; limit?: number; view?: ResponseView }> = {}) {
    return this.get("/v1/offerings", params)
  }

  async maEvents(
    params: RequestParams<{ ticker?: string; cik?: string; date_from?: string; date_to?: string; submission_file_limit?: number; cursor?: string; limit?: number; view?: ResponseView }> = {},
  ) {
    return this.get("/v1/events/ma", params)
  }

  async enforcementActions(
    params: RequestParams<{ query?: string; source_type?: "litigation_release" | "administrative_proceeding"; date_from?: string; date_to?: string; cursor?: string; limit?: number; view?: ResponseView }> = {},
  ) {
    return this.get("/v1/events/enforcement", params)
  }

  async votingResultsEvents(
    params: RequestParams<{ ticker?: string; cik?: string; date_from?: string; date_to?: string; meeting_type?: "annual" | "special"; submission_file_limit?: number; cursor?: string; limit?: number; view?: ResponseView }> = {},
  ) {
    return this.get("/v1/events/voting-results", params)
  }

  // Dilution endpoints (OMNI-3091). All accept ?view=agent except dilutionCoverage,
  // whose route returns a small rollup with no agent shape.
  async dilutionEvents(
    params: RequestParams<{ ticker?: string; cik?: string; accession_number?: string; form_type?: string; offering_type?: string; is_atm?: boolean; filed_at_from?: string; filed_at_to?: string; cursor?: string; limit?: number; view?: ResponseView }> = {},
  ) {
    return this.get("/v1/dilution/events", params)
  }

  async dilutionEventDetail(eventId: string, params: RequestParams<{ view?: ResponseView }> = {}) {
    return this.get(`/v1/dilution/events/${encodeURIComponent(eventId)}`, params)
  }

  async dilutionWarrants(
    params: RequestParams<{ ticker?: string; cik?: string; accession_number?: string; form_type?: string; filed_at_from?: string; filed_at_to?: string; cursor?: string; limit?: number; view?: ResponseView }> = {},
  ) {
    return this.get("/v1/dilution/warrants", params)
  }

  async dilutionConvertibles(
    params: RequestParams<{ ticker?: string; cik?: string; accession_number?: string; form_type?: string; filed_at_from?: string; filed_at_to?: string; cursor?: string; limit?: number; view?: ResponseView }> = {},
  ) {
    return this.get("/v1/dilution/convertibles", params)
  }

  async dilutionRofr(
    params: RequestParams<{ ticker?: string; cik?: string; accession_number?: string; form_type?: string; filed_at_from?: string; filed_at_to?: string; cursor?: string; limit?: number; view?: ResponseView }> = {},
  ) {
    return this.get("/v1/dilution/rofr", params)
  }

  async dilutionLockups(
    params: RequestParams<{ ticker?: string; cik?: string; accession_number?: string; form_type?: string; filed_at_from?: string; filed_at_to?: string; cursor?: string; limit?: number; view?: ResponseView }> = {},
  ) {
    return this.get("/v1/dilution/lockups", params)
  }

  async dilutionCashPosition(
    params: RequestParams<{ ticker?: string; period_ended_from?: string; period_ended_to?: string; cursor?: string; limit?: number; view?: ResponseView }> = {},
  ) {
    return this.get("/v1/dilution/cash-position", params)
  }

  async dilutionCorporateActions(
    params: RequestParams<{ ticker?: string; action_type?: string; effective_date_from?: string; effective_date_to?: string; cursor?: string; limit?: number; view?: ResponseView }> = {},
  ) {
    return this.get("/v1/dilution/corporate-actions", params)
  }

  async dilutionNasdaqCompliance(
    params: RequestParams<{ ticker?: string; status?: string; date_from?: string; date_to?: string; cursor?: string; limit?: number; view?: ResponseView }> = {},
  ) {
    return this.get("/v1/dilution/nasdaq-compliance", params)
  }

  async dilutionRatings(
    params: RequestParams<{ ticker?: string; overall_risk?: "low" | "medium" | "high" | "extreme"; cursor?: string; limit?: number; view?: ResponseView }> = {},
  ) {
    return this.get("/v1/dilution/ratings", params)
  }

  async dilutionReverseSplits(
    params: RequestParams<{ ticker?: string; execution_date_from?: string; execution_date_to?: string; cursor?: string; limit?: number; view?: ResponseView }> = {},
  ) {
    return this.get("/v1/dilution/reverse-splits", params)
  }

  async dilutionScore(params: RequestParams<{ ticker: string; view?: ResponseView }>) {
    return this.get("/v1/dilution/score", params)
  }

  async dilutionShareFloatHistory(
    params: RequestParams<{ ticker?: string; as_of_date_from?: string; as_of_date_to?: string; cursor?: string; limit?: number; view?: ResponseView }> = {},
  ) {
    return this.get("/v1/dilution/share-float-history", params)
  }

  async dilutionCoverage(params: RequestParams<{ ticker?: string }> = {}) {
    return this.get("/v1/dilution/coverage", params)
  }

  async form144Filings(
    params: RequestParams<{ ticker?: string; cik?: string; date_from?: string; date_to?: string; submission_file_limit?: number; cursor?: string; limit?: number; view?: ResponseView }> = {},
  ) {
    return this.get("/v1/forms/144", params)
  }

  async companySubsidiaries(
    params: RequestParams<{ ticker?: string; cik?: string; view?: ResponseView }> = {},
  ) {
    return this.get("/v1/companies/subsidiaries", params)
  }

  async earningsTranscripts(
    params: RequestParams<{ ticker?: string; cik?: string; date_from?: string; date_to?: string; submission_file_limit?: number; cursor?: string; limit?: number }> = {},
  ) {
    return this.get("/v1/earnings/transcripts", params)
  }

  async marketCalendar(params: RequestParams<{ market?: string; start?: string; duration?: number }> = {}) {
    return this.get("/v1/market/calendar", params)
  }

  async marketSnapshots(params: RequestParams<{ symbols: string | string[] }>) {
    return this.get("/v1/market/snapshots", params)
  }

  async marketBars(params: RequestParams<{ symbol: string; date_from: string; date_to: string; interval?: string; limit?: number }>) {
    return this.get("/v1/market/bars", params)
  }

  async marketCorporateActions(params: RequestParams<{ symbol: string; date_from: string; date_to: string; limit?: number }>) {
    return this.get("/v1/market/corporate-actions", params)
  }

  async marketReference(params: RequestParams<{ symbol?: string; ticker?: string }>) {
    return this.get("/v1/market/reference", params)
  }

  async marketEstimates(params: RequestParams<{ symbol?: string; ticker?: string; limit?: number }>) {
    return this.get("/v1/market/estimates", params)
  }

  async newsStories(params: RequestParams<{ ticker?: string; cik?: string; q?: string; limit?: number }> = {}) {
    return this.get("/v1/news/stories", params)
  }

  async macroIndicators(params: RequestParams<{ country: string; indicator_key: string; limit?: number }>) {
    return this.get("/v1/macro/indicators", params)
  }

  async macroReleases(params: RequestParams<{ country?: string; indicator_key?: string; limit?: number }> = {}) {
    return this.get("/v1/macro/releases", params)
  }

  async macroCalendar(params: RequestParams<{ country?: string; days?: number; limit?: number }> = {}) {
    return this.get("/v1/macro/calendar", params)
  }

  async macroForecasts(params: RequestParams<{ country?: string; indicator_key?: string; horizons?: number }> = {}) {
    return this.get("/v1/macro/forecasts", params)
  }

  async macroHighSignalPack(params: RequestParams<{ country?: string }> = {}) {
    return this.get("/v1/macro/high-signal-pack", params)
  }

  async macroRegimes(params: RequestParams<{ country?: string; lookback?: string }> = {}) {
    return this.get("/v1/macro/regimes", params)
  }

  async factorCatalog(params: RequestParams<{ category?: string; keys?: string | string[] }> = {}) {
    return this.get("/v1/factors/catalog", params)
  }

  async factorReturns(params: RequestParams<{ keys?: string | string[]; category?: string; window?: string; lookback?: string }> = {}) {
    return this.get("/v1/factors/returns", params)
  }

  async factorReturnsIntraday(params: RequestParams<{ keys?: string | string[]; category?: string; window?: string }> = {}) {
    return this.get("/v1/factors/returns/intraday", params)
  }

  async factorDashboard(params: RequestParams<{ country?: string; category?: string; window?: string; lookback?: string; limit?: number; ticker?: string; portfolioId?: string; keys?: string | string[] }> = {}) {
    return this.get("/v1/factors/dashboard", params)
  }

  async factorRegimePerformance(params: RequestParams<{ country?: string; category?: string; window?: string; lookback?: string; limit?: number }> = {}) {
    return this.get("/v1/factors/regime-performance", params)
  }

  async factorCorrelations(params: RequestParams<{ keys?: string | string[]; category?: string; lookback?: string }> = {}) {
    return this.get("/v1/factors/correlations", params)
  }

  async factorScreen(params: RequestParams<{ category?: string; window?: string; lookback?: string; limit?: number }> = {}) {
    return this.get("/v1/factors/screen", params)
  }

  async factorExposures(params: RequestParams<{ symbols: string | string[]; category?: string; lookback?: string }>) {
    return this.get("/v1/factors/exposures", params)
  }

  async stockLoadings(ticker: string, params: RequestParams<{ keys?: string | string[]; category?: string; lookback?: string }> = {}) {
    return this.get(`/v1/stocks/${encodeURIComponent(ticker)}/loadings`, params)
  }

  async factorDecomposition(params: RequestParams<{ symbol: string; lookback?: string; window?: string }>) {
    return this.get("/v1/factors/decomposition", params)
  }

  async factorRelatedStocks(params: RequestParams<{ symbol: string; candidates?: string | string[]; lookback?: string; limit?: number }>) {
    return this.get("/v1/factors/related-stocks", params)
  }

  async factorSimilarityPack(params: RequestParams<{ symbol: string; candidates?: string | string[]; lookback?: string; limit?: number }>) {
    return this.get("/v1/factors/similarity-pack", params)
  }

  async portfolioAnalyze(body: {
    holdings: Array<{ symbol: string; weight: number; shares?: number | null; costBasis?: number | null }>
    country?: string
    lookback?: string
    category?: string
  }, options?: RequestOptions) {
    return this.request("/v1/portfolio/analyze", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }, undefined, options)
  }

  async modelPortfolioFactorView(portfolioId: string, params: RequestParams<{ keys?: string | string[]; category?: string; lookback?: string }> = {}) {
    return this.get(`/v1/model-portfolios/${encodeURIComponent(portfolioId)}/factor-view`, params)
  }

  async portfolioOptimize(body: {
    holdings: Array<{ symbol: string; weight: number; shares?: number | null; costBasis?: number | null }>
    country?: string
    lookback?: string
    objective?: "factor_neutral" | "min_drawdown" | "regime_aware"
  }, options?: RequestOptions) {
    return this.request("/v1/portfolio/optimize", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }, undefined, options)
  }

  async portfolioStressTest(body: {
    holdings: Array<{ symbol: string; weight: number; shares?: number | null; costBasis?: number | null }>
    country?: string
    lookback?: string
    scenario_key?: string
  }, options?: RequestOptions) {
    return this.request("/v1/portfolio/stress-test", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }, undefined, options)
  }

  async strategyFactorRotation(body: { country?: string; category?: string; window?: string; lookback?: string; limit?: number } = {}, options?: RequestOptions) {
    return this.request("/v1/strategies/factor-rotation", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }, undefined, options)
  }

  async strategyRegimeScreen(body: { country?: string; category?: string; window?: string; lookback?: string; limit?: number } = {}, options?: RequestOptions) {
    return this.request("/v1/strategies/regime-screen", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }, undefined, options)
  }

  async intelligenceSecurity(params: RequestParams<{ ticker?: string; cik?: string; view?: "compact" | "full" }> = {}) {
    return this.get("/v1/intelligence/security", params)
  }

  async intelligenceCompany(params: RequestParams<{ ticker?: string; cik?: string; view?: "compact" | "full" }> = {}) {
    return this.get("/v1/intelligence/company", params)
  }

  async intelligenceEarningsPreview(params: RequestParams<{ ticker?: string; cik?: string; view?: "compact" | "full" }> = {}) {
    return this.get("/v1/intelligence/earnings-preview", params)
  }

  async intelligenceCountryReport(body: { country?: string; lookback?: string } = {}, options?: RequestOptions) {
    return this.request("/v1/intelligence/country-report", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }, undefined, options)
  }

  async intelligencePortfolio(body: {
    holdings: Array<{ symbol: string; weight: number; shares?: number | null; costBasis?: number | null }>
    country?: string
    lookback?: string
  }, options?: RequestOptions) {
    return this.request("/v1/intelligence/portfolio", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }, undefined, options)
  }

  async intelligenceWatchlist(body: { symbols: string[]; country?: string; lookback?: string }, params: RequestParams<{ view?: "compact" | "full" }> = {}, options?: RequestOptions) {
    return this.request(buildUrl("/v1/intelligence/watchlist", params), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }, undefined, mergeRequestOptions(requestOptionsFromParams(params), options))
  }

  async intelligenceQuery(body: {
    query: string
    entities?: string[]
    countries?: string[]
    lookback?: string | null
    responseMode?: "compact_json" | "compact_json_and_md" | "markdown"
    portfolio?: Array<{ symbol: string; weight: number; shares?: number | null; costBasis?: number | null }> | null
  }, options?: RequestOptions) {
    return this.request("/v1/intelligence/query", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }, undefined, options)
  }

  async intelligenceFootnotesQuery(body: {
    ticker?: string
    cik?: string
    form?: string
    query?: string | null
    topics?: Array<"lease" | "tax" | "revenue" | "debt_covenant" | "segment">
  }, options?: RequestOptions) {
    return this.request("/v1/intelligence/footnotes/query", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }, undefined, options)
  }

  async marketIndices(params: RequestParams<{ include_inventory?: boolean }> = {}) {
    return this.get("/v1/market/indices", params)
  }

  async indexConstituents(params: RequestParams<{ index?: string; index_code?: string; cursor?: string; limit?: number }> = {}) {
    return this.get("/v1/market/indices/constituents", params)
  }

  async volatilitySignal(params: RequestParams<{ ticker?: string; cik?: string }>) {
    return this.get("/v1/signals/volatility", params)
  }

  async facts(params: RequestParams<{ ticker?: string; cik?: string; taxonomy?: string; tag: string; unit?: string; form?: string; limit?: number }>) {
    return this.get("/v1/facts", params)
  }

  async statements(
    params: RequestParams<{ ticker?: string; cik?: string; statement?: string; period?: "annual" | "quarterly"; limit?: number }>,
  ) {
    return this.get("/v1/statements", params)
  }

  async allStatements(params: RequestParams<{ ticker?: string; cik?: string; period?: "annual" | "quarterly"; limit?: number }>) {
    return this.get("/v1/statements/all", params)
  }

  async statementByKey(
    statementKey: string,
    params: RequestParams<{ ticker?: string; cik?: string; period?: "annual" | "quarterly"; limit?: number }>,
  ) {
    return this.get(`/v1/statements/${statementKey}`, params)
  }

  async companyIncomeStatements(params: RequestParams<{ ticker: string; period?: "annual" | "quarterly"; limit?: number }>) {
    return this.get("/v1/companies/income-statements", params)
  }

  async companyBalanceSheets(params: RequestParams<{ ticker: string; period?: "annual" | "quarterly"; limit?: number }>) {
    return this.get("/v1/companies/balance-sheets", params)
  }

  async companyCashFlowStatements(params: RequestParams<{ ticker: string; period?: "annual" | "quarterly"; limit?: number }>) {
    return this.get("/v1/companies/cash-flow-statements", params)
  }

  async companyFinancials(params: RequestParams<{ ticker: string; period?: "annual" | "quarterly"; limit?: number }>) {
    return this.get("/v1/companies/financials", params)
  }

  async companyRatios(params: RequestParams<{ ticker: string; period?: "annual" | "quarterly"; limit?: number }>) {
    return this.get("/v1/companies/ratios", params)
  }

  async companyResolve(params: RequestParams<{ ticker?: string; cik?: string; name?: string; figi?: string; isin?: string; cusip?: string; view?: "compact" }>) {
    return this.get("/v1/companies/resolve", params)
  }

  async companySearch(params: RequestParams<{ q: string; limit?: number }>) {
    return this.get("/v1/companies/search", params)
  }

  async latest13F(params: RequestParams<{ cik: string; reportDate?: string; filingDate?: string; limit?: number; view?: ResponseView }>) {
    return this.get("/v1/owners/13f", params)
  }

  async list13FFilings(params: RequestParams<{ cik: string; limit?: number; since?: string }>) {
    // OMNI-3772 SDK parity with Python SDK's `list_13f_filings`. Pairs
    // with `latest13F` (single filing's holdings) — this returns the
    // LIST of filings available for a CIK so callers can iterate over
    // a filer's quarterly history or detect newly-landed filings via
    // the `since` filter (ISO-8601, filters on SEC acceptedAt for
    // sub-day precision when available — see omni-datastream PR #539).
    return this.get("/v1/owners/13f/filings", params)
  }

  async institutionalOwnershipExtract(params: RequestParams<{ cik: string; year: number; quarter: 1 | 2 | 3 | 4; limit?: number }>) {
    return this.get("/v1/owners/institutional/extract", params)
  }

  async compare13F(body: { cik: string; limit?: number }, options?: RequestOptions) {
    return this.request("/v1/owners/13f/compare", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }, undefined, options)
  }

  async beneficialOwnershipReports(
    params: RequestParams<{
      ticker?: string
      cik?: string
      filer?: string
      forms?: string | string[]
      date_from?: string
      date_to?: string
      submission_file_limit?: number
      cursor?: string
      limit?: number
    }> = {},
  ) {
    return this.get("/v1/owners/13d-13g", params)
  }

  async insiders(params: RequestParams<{ ticker?: string; cik?: string; forms?: string | string[]; date_from?: string; date_to?: string; cursor?: string; limit?: number; view?: ResponseView }>) {
    return this.get("/v1/insiders", params)
  }

  async compensation(params: RequestParams<{ ticker?: string; cik?: string; limit?: number; view?: ResponseView }>) {
    return this.get("/v1/compensation", params)
  }

  async compareCompensation(body: { ticker?: string; cik?: string; limit?: number }, options?: RequestOptions) {
    return this.request("/v1/compensation/compare", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }, undefined, options)
  }

  async createArtifact(body: Record<string, unknown>, options?: RequestOptions) {
    return this.request("/v1/artifacts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }, undefined, options)
  }

  async listArtifacts(params: RequestParams<{ kind?: string; status?: string; limit?: number }> = {}) {
    return this.get("/v1/artifacts", params)
  }

  async artifactSummary(options?: RequestOptions) {
    return this.request("/v1/artifacts/summary", {}, undefined, options)
  }

  async getArtifact(artifactId: string, options?: RequestOptions) {
    return this.request(`/v1/artifacts/${artifactId}`, {}, undefined, options)
  }

  async artifactManifest(artifactId: string, options?: RequestOptions) {
    return this.request(`/v1/artifacts/${artifactId}/manifest`, {}, undefined, options)
  }

  async exportArtifact(artifactId: string, params: RequestParams<{ format?: "json" | "markdown" }> = {}) {
    return this.get(`/v1/artifacts/${artifactId}/export`, params)
  }

  async downloadArtifact(artifactId: string, options?: RequestOptions) {
    return this.request(`/v1/artifacts/${artifactId}/download`, {}, undefined, options)
  }

  async reconcileArtifact(artifactId: string, options?: RequestOptions) {
    return this.request(`/v1/artifacts/${artifactId}/reconcile`, {
      method: "POST",
    }, undefined, options)
  }

  async mcpInfo(options?: RequestOptions) {
    return this.request("/mcp", {}, undefined, options)
  }

  async mcp(request: Record<string, unknown>, options?: RequestOptions) {
    return this.request("/mcp", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(request),
    }, undefined, options)
  }

  private async createStreamTicket() {
    return this.request("/v1/stream/tickets", {
      method: "POST",
    }, streamTicketSchema)
  }

  /**
   * Open a WebSocket connection for real-time filing event streaming.
   *
   * Uses the global `WebSocket` constructor (Node 21+, Bun, Deno, browsers).
   * Returns an `OmniFilingStream` with typed event callbacks and auto-reconnect.
   */
  streamFilings(params: StreamFilingsParams = {}): OmniFilingStream {
    const streamState: { forms?: string | string[]; tickers?: string | string[]; cursor?: string } = {
      forms: params.forms,
      tickers: params.tickers,
      cursor: params.cursor,
    }

    return new OmniFilingStream(async (cursor) => {
      const ticket = await this.createStreamTicket()
      return this.baseUrl.replace(/^http/, "ws") + buildUrl("/v1/stream/ws", {
        forms: streamState.forms,
        tickers: streamState.tickers,
        cursor: cursor ?? streamState.cursor,
        ticket: ticket.token,
      })
    }, {
      autoReconnect: params.autoReconnect ?? true,
      maxReconnectDelayMs: params.maxReconnectDelayMs ?? 30_000,
      onFiling: params.onFiling,
      onConnected: params.onConnected,
      onRateLimited: params.onRateLimited,
      onError: params.onError,
      onClose: params.onClose,
    }, (filters) => {
      if (filters.forms) {
        streamState.forms = filters.forms
      }
      if (filters.tickers) {
        streamState.tickers = filters.tickers
      }
    })
  }
}

// ---------------------------------------------------------------------------
// WebSocket filing stream
// ---------------------------------------------------------------------------

export type StreamFilingsParams = {
  forms?: string | string[]
  tickers?: string | string[]
  cursor?: string
  autoReconnect?: boolean
  maxReconnectDelayMs?: number
  onFiling?: (event: FilingStreamEvent) => void
  onConnected?: (event: StreamConnectedEvent) => void
  onRateLimited?: (event: StreamRateLimitedEvent) => void
  onError?: (error: unknown) => void
  onClose?: (code: number, reason: string) => void
}

export type FilingStreamEvent = {
  event: "filing.published"
  filing: {
    accessionNumber: string | null
    form: string | null
    ticker: string | null
    cik: string | null
    completedAt: string
  }
  cursor: string
  deliveredAt: string
  replayed?: boolean
}

export type StreamConnectedEvent = {
  event: "connected"
  connectionId: string
  orgId: string
  filters: { forms: string[]; tickers: string[] }
  cursor: string | null
  serverTime: string
}

export type StreamRateLimitedEvent = {
  event: "rate_limited"
  message: string
  retryAfterMs: number
}

type StreamInternalOptions = {
  autoReconnect: boolean
  maxReconnectDelayMs: number
  onFiling?: (event: FilingStreamEvent) => void
  onConnected?: (event: StreamConnectedEvent) => void
  onRateLimited?: (event: StreamRateLimitedEvent) => void
  onError?: (error: unknown) => void
  onClose?: (code: number, reason: string) => void
}

export class OmniFilingStream {
  private ws: WebSocket | null = null
  private closed = false
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private backoffMs = 1_000
  private lastCursor: string | null = null
  private connecting = false

  constructor(
    private readonly buildUrl: (cursor: string | null) => Promise<string>,
    private readonly opts: StreamInternalOptions,
    private readonly persistFilters?: (filters: { forms?: string[]; tickers?: string[] }) => void,
  ) {
    void this.connect()
  }

  private async connect() {
    if (this.closed || this.connecting) return

    this.connecting = true

    let connectUrl: string
    try {
      connectUrl = await this.buildUrl(this.lastCursor)
    } catch (error) {
      this.connecting = false
      this.opts.onError?.(error)
      if (!this.closed && this.opts.autoReconnect) {
        this.scheduleReconnect()
      }
      return
    }

    if (this.closed) {
      this.connecting = false
      return
    }

    this.ws = new WebSocket(connectUrl)
    this.connecting = false

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(typeof event.data === "string" ? event.data : "")
        if (data.event === "filing.published") {
          if (data.cursor) this.lastCursor = data.cursor
          this.opts.onFiling?.(data as FilingStreamEvent)
        } else if (data.event === "connected") {
          this.backoffMs = 1_000
          this.opts.onConnected?.(data as StreamConnectedEvent)
        } else if (data.event === "rate_limited") {
          this.opts.onRateLimited?.(data as StreamRateLimitedEvent)
        }
      } catch (err) {
        this.opts.onError?.(err)
      }
    }

    this.ws.onerror = (event) => {
      this.opts.onError?.(event)
    }

    this.ws.onclose = (event) => {
      try {
        this.opts.onClose?.(event.code, event.reason)
      } catch (err) {
        this.opts.onError?.(err)
      }
      this.ws = null
      if (!this.closed && this.opts.autoReconnect) {
        this.scheduleReconnect()
      }
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer || this.closed) return
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      this.connect()
    }, this.backoffMs)
    this.backoffMs = Math.min(this.backoffMs * 2, this.opts.maxReconnectDelayMs)
  }

  /** Send a ping to the server. */
  ping() {
    this.ws?.send(JSON.stringify({ type: "ping" }))
  }

  /** Update form/ticker filters on a live connection. */
  updateFilters(filters: { forms?: string[]; tickers?: string[] }) {
    this.ws?.send(JSON.stringify({ type: "update_filters", ...filters }))
    this.persistFilters?.(filters)
  }

  /** Close the stream permanently (no auto-reconnect). */
  close() {
    this.closed = true
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    this.ws?.close(1000, "client_close")
    this.ws = null
  }

  /** The last event cursor received (useful for manual reconnection). */
  get cursor(): string | null {
    return this.lastCursor
  }

  /** Whether the underlying WebSocket is currently open. */
  get connected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

export {
  OmniDatastreamClient as SecApiClient,
  OmniDatastreamError as SecApiError,
}

export type {
  Entity,
  Filing,
  Section,
  FactPoint,
  Statement,
  SegmentedRevenueSeries,
  ShareFloat,
  BoardComposition,
  NportHoldings,
  Trace,
  AnalyticsQueryResult,
  MaEvent,
  EnforcementAction,
  EarningsMaterial,
  OwnershipReport,
  OwnershipComparison,
  InstitutionalHolderList,
  InsiderTrade,
  BeneficialOwnershipReport,
  CompensationRecord,
  CompensationComparison,
  Artifact,
  Index,
  IndexConstituent,
  Organization,
  ApiKey,
  UsageSummary,
  Limits,
  BillingQuote,
  DashboardOverview,
  AgentBootstrapToken,
  AgentBootstrap,
  WebhookEndpoint,
  WebhookDeliveryAttempt,
  StreamSubscription,
  StreamTicket,
  DilutionEvent,
  DilutionWarrant,
  DilutionConvertible,
  DilutionRofr,
  DilutionLockup,
  DilutionCashPosition,
  DilutionCorporateAction,
  DilutionNasdaqCompliance,
  DilutionRating,
  DilutionReverseSplit,
  DilutionShareFloatHistory,
  DilutionCoverage,
} from "./generated-contracts/index.js"
