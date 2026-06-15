import { z } from "zod"

export const v1MaintenanceHotLaneBodySchema = z
  .object({
    tickers: z.union([z.array(z.string()), z.string()]).optional(),
    forms: z.union([z.array(z.string()), z.string()]).optional(),
    perTickerLimit: z.union([z.number(), z.string()]).optional(),
  })
  .passthrough()

export const v1MaintenanceReconcileHotBodySchema = z
  .object({
    tickers: z.union([z.array(z.string()), z.string()]).optional(),
    forms: z.union([z.array(z.string()), z.string()]).optional(),
    perTickerLimit: z.union([z.number(), z.string()]).optional(),
    checkpointKey: z.string().nullable().optional(),
  })
  .passthrough()

export const v1MaintenanceIngestWorkerBodySchema = z
  .object({
    passes: z.union([z.number(), z.string()]).optional(),
    hotBudget: z.union([z.number(), z.string()]).optional(),
    bulkBudget: z.union([z.number(), z.string()]).optional(),
    reMaterializeBudget: z.union([z.number(), z.string()]).optional(),
  })
  .passthrough()

export const v1MaintenanceWarmMarketLatestBodySchema = z
  .object({
    forms: z.union([z.array(z.string()), z.string()]).optional(),
  })
  .passthrough()

export const v1MaintenanceWarmMarketDataBodySchema = z
  .object({
    symbols: z.union([z.array(z.string()), z.string()]).optional(),
    datasets: z.union([z.array(z.string()), z.string()]).optional(),
    barsDays: z.union([z.number(), z.string()]).optional(),
    refreshLive: z.union([z.boolean(), z.string()]).optional(),
  })
  .passthrough()

export const v1MaintenanceWarmMacroDataBodySchema = z
  .object({
    countries: z.union([z.array(z.string()), z.string()]).optional(),
    refreshLive: z.union([z.boolean(), z.string()]).optional(),
  })
  .passthrough()

export const v1MaintenanceWarmFactorDataBodySchema = z
  .object({
    symbols: z.union([z.array(z.string()), z.string()]).optional(),
    categories: z.union([z.array(z.string()), z.string()]).optional(),
    lookback: z.string().optional(),
    refreshLive: z.union([z.boolean(), z.string()]).optional(),
    precomputeRouteResponses: z.union([z.boolean(), z.string()]).optional(),
  })
  .passthrough()

export const v1MaintenanceWarmFactorIntradayBodySchema = z
  .object({
    categories: z.union([z.array(z.string()), z.string()]).optional(),
    windows: z.union([z.array(z.string()), z.string()]).optional(),
  })
  .passthrough()

export const v1MaintenanceMaterializeInvestorDataPlaneBodySchema = z
  .object({
    mode: z.enum(["all", "market", "macro", "factor", "factor_intraday", "intelligence"]).optional(),
    factorMaintenanceSubprocessTimeoutMs: z.union([z.number(), z.string()]).optional(),
    market: z.object({
      symbols: z.union([z.array(z.string()), z.string()]).optional(),
      datasets: z.union([z.array(z.string()), z.string()]).optional(),
      barsDays: z.union([z.number(), z.string()]).optional(),
      estimateLimit: z.union([z.number(), z.string()]).optional(),
      corporateActionLimit: z.union([z.number(), z.string()]).optional(),
      refreshLive: z.union([z.boolean(), z.string()]).optional(),
    }).optional(),
    macro: z.object({
      countries: z.union([z.array(z.string()), z.string()]).optional(),
      observationLimit: z.union([z.number(), z.string()]).optional(),
      releaseLimit: z.union([z.number(), z.string()]).optional(),
      calendarDays: z.union([z.number(), z.string()]).optional(),
      forecastHorizons: z.union([z.number(), z.string()]).optional(),
      refreshLive: z.union([z.boolean(), z.string()]).optional(),
      includeHighSignalPacks: z.union([z.boolean(), z.string()]).optional(),
    }).optional(),
    factor: z.object({
      mode: z.enum(["refresh", "backfill"]).optional(),
      symbols: z.union([z.array(z.string()), z.string()]).optional(),
      factorKeys: z.union([z.array(z.string()), z.string()]).optional(),
      categories: z.union([z.array(z.string()), z.string()]).optional(),
      countries: z.union([z.array(z.string()), z.string()]).optional(),
      lookback: z.string().optional(),
      returnSurfaceLookback: z.string().optional(),
      refreshLive: z.union([z.boolean(), z.string()]).optional(),
      includeWarm: z.union([z.boolean(), z.string()]).optional(),
      includeIntraday: z.union([z.boolean(), z.string()]).optional(),
      includePortfolios: z.union([z.boolean(), z.string()]).optional(),
      includeAllFactorDecomposition: z.union([z.boolean(), z.string()]).optional(),
      precomputeRouteResponses: z.union([z.boolean(), z.string()]).optional(),
      materializePrerequisites: z.union([z.boolean(), z.string()]).optional(),
      intradayWindows: z.union([z.array(z.string()), z.string()]).optional(),
      stockBasketInputPath: z.string().optional(),
      requiredStockBasketStartDate: z.string().optional(),
      stockBasketRequiredStartDateByFactorKey: z.record(z.string(), z.string()).optional(),
      stockBasketStartToleranceDays: z.union([z.number(), z.string()]).optional(),
    }).optional(),
    factorIntraday: z.object({
      categories: z.union([z.array(z.string()), z.string()]).optional(),
      windows: z.union([z.array(z.string()), z.string()]).optional(),
    }).optional(),
    intelligence: z.object({
      tickers: z.union([z.array(z.string()), z.string()]).optional(),
      mode: z.enum(["refresh", "backfill"]).optional(),
      lookback: z.string().optional(),
      countryReportCountry: z.string().optional(),
      countryReportLookback: z.string().optional(),
    }).optional(),
  })
  .passthrough()

export const v1CompanyMappingIdentifiersBodySchema = z
  .object({
    rows: z.array(z.record(z.string(), z.unknown())).optional(),
    indexCodes: z.union([z.array(z.string()), z.string()]).optional(),
    dryRun: z.union([z.boolean(), z.string()]).optional(),
    limitPerIndex: z.union([z.number(), z.string()]).optional(),
  })
  .passthrough()

export const v1CreateWebhookEndpointBodySchema = z
  .object({
    destinationUrl: z.string(),
    description: z.string().nullish(),
    /** Python SDK sends JSON `null` for omitted list/bool optionals. */
    subscribedEventTypes: z.array(z.string()).nullish(),
    livemode: z.boolean().nullish(),
  })
  .passthrough()

export const v1CreateStreamSubscriptionBodySchema = z
  .object({
    description: z.string().nullish(),
    eventTypes: z.array(z.string()).nullish(),
    transport: z.enum(["poll", "webhook_mirror", "websocket"]).nullish(),
    livemode: z.boolean().nullish(),
  })
  .passthrough()

export const v1OwnershipCompareBodySchema = z
  .object({
    cik: z.string().nullish(),
    limit: z.union([z.number(), z.string()]).nullish(),
  })
  .passthrough()

export const v1CompensationCompareBodySchema = z
  .object({
    ticker: z.string().nullish(),
    cik: z.string().nullish(),
    limit: z.union([z.number(), z.string()]).nullish(),
  })
  .passthrough()

export const v1CreateArtifactBodySchema = z
  .object({
    ticker: z.string().nullish(),
    cik: z.string().nullish(),
    form: z.string().nullish(),
    sectionKey: z.string().nullish(),
    kind: z.string().nullish(),
  })
  .passthrough()

export const v1AnalyticsQueryBodySchema = z.record(z.string(), z.unknown())

/** Strict empty body — rejects unexpected keys on POST endpoints that take no payload. */
export const v1StrictEmptyPostBodySchema = z.object({}).strict()

// OMNI-3244: monitor dispatch sweep (Dagster cron → admin route).
export const v1MaintenanceSweepMonitorMatchesBodySchema = z
  .object({
    limit: z.union([z.number(), z.string()]).optional(),
    retryLimit: z.union([z.number(), z.string()]).optional(),
    matchLimit: z.union([z.number(), z.string()]).optional(),
  })
  .passthrough()

// OMNI-3244: daily summary asset (Dagster cron at 23:55 UTC → admin route).
export const v1MaintenanceDispatchDailySummaryBodySchema = z
  .object({
    hours: z.union([z.number(), z.string()]).optional(),
    dryRun: z.union([z.boolean(), z.string()]).optional(),
  })
  .passthrough()

/**
 * Monitor delivery destination — discriminated union keyed on `type`.
 * Email is the first conformer (OMNI-3082); Slack and others extend the union later.
 * `config` is JSONB-backed in the DB so future fields (cc, bcc, template_id, etc.)
 * extend without migrations.
 */
export const v1MonitorDestinationSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("email"),
    config: z.object({
      to: z.string().email(),
      from: z.string().email().nullish(),
    }),
  }),
])

export const v1CreateMonitorBodySchema = z.preprocess(
  (input) => {
    // Backward compat: pre-Zod monitor CRUD accepted snake_case (`webhook_url`,
    // `search_mode`). The Zod schema below uses camelCase. Without normalization,
    // `.passthrough()` would silently accept-and-ignore the snake_case keys,
    // producing monitors with `webhookUrl=null` from existing client payloads.
    //
    // Clone before mutating so the caller's object isn't reshaped under them
    // (a test suite that introspects the request payload would otherwise see
    // BOTH `webhook_url` and `webhookUrl`). Drop the snake_case copies after
    // mapping so the parsed result carries only the canonical camelCase keys.
    if (input && typeof input === "object" && !Array.isArray(input)) {
      const obj = input as Record<string, unknown>
      const cloned: Record<string, unknown> = { ...obj }
      if (cloned.webhook_url !== undefined && cloned.webhookUrl === undefined) {
        cloned.webhookUrl = cloned.webhook_url
      }
      delete cloned.webhook_url
      if (cloned.search_mode !== undefined && cloned.searchMode === undefined) {
        cloned.searchMode = cloned.search_mode
      }
      delete cloned.search_mode
      return cloned
    }
    return input
  },
  z
    .object({
      // `.trim()` runs before `.min(1)` so whitespace-only inputs (e.g., '   ')
      // fail validation rather than persisting as empty strings.
      name: z.string().trim().min(1),
      query: z.string().trim().min(1),
      filters: z.record(z.string(), z.unknown()).nullish(),
      /** Only `keyword` is currently supported for monitor execution. */
      searchMode: z.enum(["keyword"]).nullish(),
      /** Legacy single-webhook path. Kept for backward compat with existing clients. */
      webhookUrl: z.string().url().nullish(),
      /** New path: typed `{type, config}` destination. v1 ships single email destination per monitor. */
      delivery: v1MonitorDestinationSchema.nullish(),
    })
    .passthrough()
    // A monitor has exactly one destination. Once auto-dispatch lands (OMNI-3244)
    // a row carrying both `webhookUrl` and `delivery` would fire duplicate
    // alerts on every match. Reject the ambiguous payload at the contract layer
    // so the rule is enforced uniformly across SDK + curl + dashboard clients.
    .refine(
      (data) => !(data.webhookUrl && data.delivery),
      {
        message: "Specify either webhookUrl OR delivery, not both — a monitor has exactly one destination.",
        path: ["delivery"],
      },
    ),
)

export const v1UpdateMonitorDeliveryBodySchema = v1MonitorDestinationSchema

// Note: the unsubscribe POST body intentionally has no Zod schema. The handler
// in `routes/delivery.ts:readUnsubscribeBody` parses form-encoded, JSON, and
// query-string variants (per RFC 8058 the token may live in any of these),
// then passes the token through `verifyUnsubscribeToken` for the authoritative
// HMAC validation. A Zod schema would add a dangling contract surface that
// could drift from the actual parser without catching anything verify doesn't.
