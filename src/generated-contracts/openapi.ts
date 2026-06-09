/**
 * AUTO-GENERATED paths and metadata merged with Zod-derived component schemas.
 * Do not edit the generated output (openapi.generated.json) directly.
 * Run `bun run contract:openapi` to regenerate, then `bun run contract:verify` to check for drift.
 */

const schemaRef = (name: string) => ({ $ref: `#/components/schemas/${name}` })

const jsonContent = (name: string) => ({
  "application/json": {
    schema: schemaRef(name),
  },
})

const jsonResponse = (name: string, description = "Successful response") => ({
  responses: {
    "200": {
      description,
      content: jsonContent(name),
    },
  },
})

const jsonRequestBody = (name: string, description?: string) => ({
  requestBody: {
    required: true,
    ...(description ? { description } : {}),
    content: jsonContent(name),
  },
})

export const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "SEC API",
    version: "2026-03-19",
    description: "SEC API for investor agents spanning SEC filings, market, macro, factor, portfolio, and intelligence-query workloads.",
  },
  servers: [
    { url: "https://api.secapi.ai", description: "Production" },
  ],
  paths: {
    "/.well-known/oauth-protected-resource": {
      get: { summary: "Return OAuth protected resource metadata for hosted MCP and API clients" },
    },
    "/.well-known/oauth-authorization-server": {
      get: { summary: "Return or proxy OAuth authorization server metadata for the configured WorkOS tenant" },
    },
    "/v1/me": {
      get: { summary: "Return the current authenticated principal and organization context" },
    },
    "/v1/org": {
      get: { summary: "Return the current organization profile" },
    },
    "/v1/admin/orgs": {
      get: { summary: "List operator-visible organizations with support-safe plan, usage, and recent activity summaries" },
    },
    "/v1/admin/orgs/{org_id}": {
      get: { summary: "Return an operator-facing organization snapshot with API keys, billing, usage, events, webhooks, streams, and delivery state" },
    },
    "/v1/admin/orgs/{org_id}/requests/{request_id}": {
      get: { summary: "Return operator-scoped request diagnostics for a tenant request identifier" },
    },
    "/v1/admin/orgs/{org_id}/deliveries/summary": {
      get: { summary: "Return operator-scoped delivery aggregates for webhook and stream activity within a tenant" },
    },
    "/v1/admin/maintenance/hot-lane": {
      post: { summary: "Run operator-scoped hot-lane polling to enqueue fresh SEC publication observations" },
    },
    "/v1/admin/maintenance/reconcile-hot": {
      post: { summary: "Run operator-scoped reconcile work to enqueue missing live hot-lane filings" },
    },
    "/v1/admin/maintenance/ingest-worker": {
      post: { summary: "Run operator-scoped ingest worker passes to materialize queued filing artifacts and sections" },
    },
    "/v1/admin/maintenance/ingest-queue": {
      post: { summary: "Export an operator-scoped ingest queue and checkpoint summary from the running SEC API service" },
    },
    "/v1/admin/maintenance/warm-market-latest": {
      post: { summary: "Warm search-visible manifests for the latest market-wide SEC filings by core form" },
    },
    "/v1/admin/maintenance/warm-market-data": {
      post: { summary: "Warm operator-scoped market snapshots, reference, estimates, bars, and corporate-action caches for covered symbols" },
    },
    "/v1/admin/maintenance/warm-macro-data": {
      post: { summary: "Bootstrap operator-scoped Tier-1 macro materialization for launch countries" },
    },
    "/v1/admin/maintenance/warm-factor-data": {
      post: { summary: "Warm operator-scoped factor returns, exposures, and correlations for covered symbols and factor categories" },
    },
    "/v1/admin/maintenance/warm-factor-intraday": {
      post: { summary: "Warm operator-scoped intraday factor snapshots for supported categories and windows" },
    },
    "/v1/admin/maintenance/company-mapping-identifiers": {
      post: { summary: "Backfill FIGI-family and security identifier coverage into the canonical entity store from operator-supplied universe rows" },
    },
    "/v1/billing/webhooks/stripe": {
      post: { summary: "Receive and process signed Stripe subscription lifecycle webhooks" },
    },
    "/v1/billing": {
      get: { summary: "Return the current organization's billing snapshot, including pricing posture, budget controls, and settlement provider state" },
    },
    "/v1/billing/rates": {
      get: { summary: "Return the public pricing catalog, plan metadata, and meter-family launch rates" },
    },
    "/v1/billing/payg/activate": {
      post: { summary: "Create a Stripe Checkout setup session that activates Pay As You Go card-on-file billing" },
    },
    "/v1/billing/quote": {
      post: { summary: "Quote a billable workflow or meter class against the current billing plan and budget gates" },
    },
    "/v1/billing/budget": {
      put: { summary: "Update organization-level spend caps, soft caps, and approval thresholds for PAYG usage" },
    },
    "/v1/billing/checkout": {
      post: { summary: "Create a Stripe Checkout session for a self-serve Personal or Team SEC API plan" },
    },
    "/v1/billing/portal": {
      post: { summary: "Create a Stripe Billing Portal session for the current organization" },
    },
    "/v1/api_keys": {
      get: { summary: "List API keys for the current organization" },
      post: { summary: "Create a new API key for the current organization" },
    },
    "/v1/agent/bootstrap_tokens": {
      post: { summary: "Issue a short-lived, single-use sponsor token for agent bootstrap under the current organization" },
    },
    "/v1/agent/bootstrap": {
      post: { summary: "Exchange a sponsor token for the first org-scoped API key, billing snapshot, limits, and MCP install metadata" },
    },
    "/v1/dashboard/overview": {
      get: { summary: "Return the logged-in dashboard overview with principal, org, enriched billing, usage, and API key context" },
    },
    "/v1/events": {
      get: { summary: "List canonical event, webhook delivery, and stream records for the current organization" },
    },
    "/v1/events/export": {
      get: { summary: "Export filtered canonical events as JSON or NDJSON for support and operations" },
    },
    "/v1/diagnostics/requests/{request_id}": {
      get: { summary: "Return request-id scoped diagnostics across usage, events, deliveries, streams, and artifacts" },
    },
    "/v1/diagnostics/deliveries/summary": {
      get: { summary: "Return aggregated webhook and stream delivery summaries for support workflows" },
    },
    "/v1/observability": {
      get: { summary: "Return operator-only observability configuration and provider seam status" },
    },
    "/v1/observability/export": {
      get: { summary: "Return an operator-only observability export with config, usage, and recent events" },
    },
    "/v1/webhook_endpoints": {
      get: { summary: "List webhook endpoints for the current organization" },
      post: { summary: "Create a signed webhook endpoint for artifact and stream events" },
    },
    "/v1/webhook_endpoints/{webhook_id}/rotate_secret": {
      post: { summary: "Rotate the signing secret for a webhook endpoint" },
    },
    "/v1/webhook_endpoints/{webhook_id}/deliveries": {
      get: { summary: "List canonical delivery attempts for a webhook endpoint" },
    },
    "/v1/webhook_endpoints/{webhook_id}/deliveries/{delivery_id}/replay": {
      post: { summary: "Replay a stored webhook delivery attempt by re-emitting its source event to the endpoint" },
    },
    "/v1/monitors": {
      get: { summary: "List saved-search monitors for the current organization" },
      post: { summary: "Create a saved-search monitor with optional webhook or email delivery destination" },
    },
    "/v1/monitors/{monitor_id}": {
      get: { summary: "Retrieve a single monitor by id" },
      delete: { summary: "Deactivate a monitor (idempotent; sets is_active=false)" },
    },
    "/v1/monitors/{monitor_id}/matches": {
      get: { summary: "Run the monitor's saved query and return new matches since last_checked_at" },
    },
    "/v1/monitors/{monitor_id}/delivery": {
      post: { summary: "Update or replace the monitor's delivery destination (e.g., set or change an email recipient)" },
    },
    "/v1/delivery/unsubscribe": {
      get: {
        summary: "Render an unsubscribe confirmation page for a signed token",
        description: "Anonymous endpoint. GET is preview-safe and never mutates state — it only renders a confirmation page with a POST form. Email link previewers (Outlook, Apple Mail, Gmail) will fetch this URL during scanning; the user must submit POST to actually unsubscribe (RFC 8058).",
        parameters: [
          { name: "token", in: "query", required: true, schema: { type: "string" }, description: "Signed unsubscribe token (HMAC-SHA256, with nonce + expiry)." },
        ],
        responses: {
          "200": { description: "Confirmation HTML page rendered" },
          "400": { description: "Invalid or expired token" },
        },
      },
      post: {
        summary: "Unsubscribe from monitor email delivery (RFC 8058 one-click compatible)",
        description: "Anonymous endpoint. Token may be supplied in form-encoded body OR query string. When the body includes `List-Unsubscribe=One-Click`, the response is 204 No Content per RFC 8058. Idempotent — repeated calls with the same token return the same result.",
        responses: {
          "200": { description: "Confirmation HTML page (interactive flow)" },
          "204": { description: "One-click unsubscribe processed (RFC 8058 List-Unsubscribe-Post)" },
          "400": { description: "Invalid or expired token" },
        },
      },
    },
    "/v1/stream_subscriptions": {
      get: { summary: "List stream subscriptions for the current organization" },
      post: { summary: "Create a stream subscription for event polling and replay" },
    },
    "/v1/stream_subscriptions/{stream_id}/events": {
      get: { summary: "Poll canonical stream events for a subscription with cursor semantics" },
    },
    "/v1/stream/tickets": {
      post: {
        summary: "Mint a short-lived signed WebSocket stream ticket for the current principal",
        description: "Creates a short-lived signed ticket that can be sent as the `ticket` query parameter when upgrading to `/v1/stream/ws`. This avoids sending long-lived API keys or bearer tokens in browser-visible WebSocket URLs.",
      },
    },
    "/v1/stream/ws": {
      get: {
        summary: "Upgrade to a WebSocket connection for real-time filing event streaming",
        description: "Upgrades the HTTP connection to a WebSocket. Clients must supply a short-lived signed `ticket` query parameter minted from `POST /v1/stream/tickets`. Streams `filing.published` events in real time with optional form/ticker filtering and cursor-based replay. Metered as `stream_connection` on upgrade and `stream_event` per delivery (1000/min default).",
        parameters: [
          { name: "ticket", in: "query", schema: { type: "string" }, description: "Short-lived signed stream ticket minted from `POST /v1/stream/tickets`." },
          { name: "forms", in: "query", schema: { type: "string" }, description: "Comma-separated form types to filter (e.g. '10-K,8-K'). Case-insensitive." },
          { name: "tickers", in: "query", schema: { type: "string" }, description: "Comma-separated tickers to filter (e.g. 'AAPL,MSFT'). Case-insensitive." },
          { name: "cursor", in: "query", schema: { type: "string" }, description: "Resume from a previous event cursor (e.g. 'sevt_...'). Events after this cursor are replayed on connect." },
        ],
        responses: {
          "101": { description: "WebSocket upgrade successful. Server sends JSON frames: connected, filing.published, pong, filters_updated, rate_limited." },
          "401": { description: "Missing or invalid stream ticket" },
          "429": { description: "Per-organization connection limit exceeded" },
          "503": { description: "Global connection capacity exceeded" },
        },
      },
    },
    "/v1/entities/resolve": {
      get: { summary: "Resolve an entity by ticker, CIK, FIGI-family identifier, ISIN, CUSIP, or name with confidence and match-basis metadata" },
    },
    "/v1/entities": {
      get: { summary: "Search canonical SEC entities across issuers, managers, insiders, and funds" },
    },
    "/v1/traces": {
      get: { summary: "Batch resolve shared trace records by trace identifier across filing-derived and supported non-filing datasets" },
    },
    "/v1/traces/{trace_id}": {
      get: { summary: "Resolve a single shared trace record by trace identifier across filing-derived and supported non-filing datasets" },
    },
    "/v1/analytics/query": {
      post: {
        summary: "Run a tenant-safe analytical query over supported SEC API history datasets without exposing raw SQL",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AnalyticsQueryInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Successful analytics query result",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AnalyticsQueryResult" },
              },
            },
          },
        },
      },
    },
    "/v1/filings": {
      get: { summary: "Search filing manifests with historical filters, accession lookup semantics, sorting, and cursor pagination" },
    },
    "/v1/filings/latest": {
      get: { summary: "Retrieve the latest filing for an entity and form" },
    },
    "/v1/filings/latest/render": {
      get: { summary: "Render the latest filing into Markdown-like text" },
    },
    "/v1/filings/latest/sections/{section_key}": {
      get: { summary: "Extract a section from the latest filing for an entity and form" },
    },
    "/v1/filings/latest/risk-categories": {
      get: { summary: "Return deterministic Item 1A risk-category coverage for the latest covered filing of an issuer" },
    },
    "/v1/board": {
      get: { summary: "Return the latest board composition derived from definitive proxy filings with director roster and committee coverage semantics" },
    },
    "/v1/funds/nport/holdings": {
      get: { summary: "Return the latest SEC N-PORT holdings roster with explicit capability semantics and balance-unit metadata" },
    },
    "/v1/filings/{accession_number}": {
      get: { summary: "Retrieve a filing manifest by accession number from the materialized filing corpus" },
    },
    "/v1/filings/{accession_number}/sections/{section_key}": {
      get: { summary: "Extract a filing item or section from a specific accession-number filing" },
    },
    "/v1/filings/pension-benefit-schedule": {
      get: { summary: "Return structured expected pension and retiree benefit payments for a target year when the filing discloses the schedule in rendered tables" },
    },
    "/v1/statements/segmented-facts": {
      get: { summary: "Return filing-derived segmented fact history for supported metrics such as revenue and segment profit/loss, with product or geography dimensions, hierarchy metadata, capability state, and trace references when issuers disclose them" },
    },
    "/v1/statements/segmented-revenues": {
      get: { summary: "Return filing-derived segmented revenue history with XBRL product or geography dimensions, capability state, and trace references when issuers disclose them" },
    },
    "/v1/statements/share-float": {
      get: { summary: "Return a share-float wrapper backed by SEC company facts, including disclosed public float when available and shares-outstanding fallback semantics otherwise" },
    },
    "/v1/sections/search": {
      get: { summary: "Search filing sections and snippets with filing-scoped filters and cursor pagination" },
    },
    "/v1/offerings": {
      get: { summary: "Return recent S-1 and 424B prospectus records with cursor pagination and date filters" },
    },
    "/v1/forms/144": {
      get: { summary: "Return recent Form 144 notices of proposed insider sales with cursor pagination and date filters" },
    },
    "/v1/companies/subsidiaries": {
      get: { summary: "Return the list of subsidiaries extracted from the latest 10-K Exhibit 21 for a given entity" },
    },
    "/v1/events/ma": {
      get: { summary: "Return SEC-native M&A events inferred from public-company filings and relevant exhibits" },
    },
    "/v1/events/enforcement": {
      get: { summary: "Return official SEC litigation releases and administrative proceedings with explicit release-source semantics and shared trace references" },
    },
    "/v1/events/restatements": {
      get: { summary: "Return 8-K Item 4.02 restatement and non-reliance events with severity classification and affected-period extraction" },
    },
    "/v1/events/auditor-changes": {
      get: { summary: "Return 8-K Item 4.01 auditor change events with change-type classification (dismissal, resignation, engagement)" },
    },
    "/v1/events/officer-changes": {
      get: { summary: "Return 8-K Item 5.02 officer and director change events with change-type classification (appointment, departure, resignation, termination)" },
    },
    "/v1/events/voting-results": {
      get: { summary: "Return 8-K Item 5.07 voting results with structured proposals, vote counts, and approval outcomes — first-in-market parser ahead of sec-api.io's open bug" },
    },
    "/v1/earnings/transcripts": {
      get: { summary: "Return SEC-furnished earnings materials from 8-K filings with release, remarks, and transcript coverage states" },
    },
    "/v1/market/calendar": {
      get: { summary: "Return market calendar sessions for supported exchanges with source coverage metadata" },
    },
    "/v1/market/indices": {
      get: { summary: "Return the supported public index roster inventory and optionally include the broader rights-tracked index source catalog" },
    },
    "/v1/market/indices/constituents": {
      get: { summary: "Return rights-safe index constituents for supported benchmark families with canonical entity mapping when available" },
    },
    "/v1/market/snapshots": {
      get: { summary: "Return persisted latest-market snapshots for one or more securities with freshness, rights, and revision metadata" },
    },
    "/v1/market/bars": {
      get: { summary: "Return historical OHLCV bars for a security with materialization and rights metadata" },
    },
    "/v1/market/corporate-actions": {
      get: { summary: "Return rights-reviewed corporate actions used to normalize price history and event analysis" },
    },
    "/v1/market/universe": {
      get: { summary: "Browse the full ticker universe with pagination, filtering by exchange, type, sector, industry, and search" },
    },
    "/v1/market/earnings-calendar": {
      get: { summary: "Return upcoming and recent earnings events with consensus estimates, actuals, and surprise data" },
    },
    "/v1/market/reference": {
      get: {
        summary: "Return canonical market reference metadata for a security, including identifiers, exchange, and listing context",
        ...jsonResponse("MarketReference"),
      },
    },
    "/v1/news/stories": {
      get: { summary: "Return rights-safe news stories with entity tagging, provenance, and source-rights metadata" },
    },
    "/v1/news/search": {
      get: { summary: "Search rights-safe news coverage and issuer communications by symbol, entity, or topic" },
    },
    "/v1/macro/search": {
      get: {
        summary: "Search supported macro indicators by keyword across all countries and high-signal packs",
        parameters: [
          { name: "q", in: "query", required: true, schema: { type: "string" }, description: "Search term matched against indicator key, label, dataset, and series code" },
          { name: "country", in: "query", schema: { type: "string" }, description: "ISO country code filter (e.g. US, JP, CN)" },
          { name: "frequency", in: "query", schema: { type: "string", enum: ["daily", "weekly", "monthly", "quarterly"] }, description: "Indicator frequency filter" },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100, default: 25 }, description: "Maximum results to return (default 25, max 100)" },
        ],
      },
    },
    "/v1/macro/indicators": {
      get: { summary: "Return official-source macro indicator observations with revision-aware provenance and country-quality metadata" },
    },
    "/v1/macro/releases": {
      get: { summary: "Return macro release observations with actual, prior, consensus, and surprise metadata" },
    },
    "/v1/macro/calendar": {
      get: { summary: "Return the macro event calendar for supported official-source releases and central-bank events" },
    },
    "/v1/macro/forecasts": {
      get: { summary: "Return SEC API forecast baselines and scenario-aware macro projections with methodology metadata" },
    },
    "/v1/macro/high-signal-pack": {
      get: {
        summary: "Return the launch-ring Tier-1 high-signal macro pack with explicit source, fallback, and release-calendar posture for supported countries",
        ...jsonResponse("MacroHighSignalPack"),
      },
    },
    "/v1/macro/regimes": {
      get: {
        summary: "Return the current macro regime classification for a country using the canonical SEC API macro overlay",
        ...jsonResponse("MacroRegime"),
      },
    },
    "/v1/macro/credit-ratings": {
      get: {
        summary: "Return sovereign credit ratings from S&P, Moody's, and Fitch for tracked countries and G20 members",
        parameters: [
          { name: "country", in: "query", schema: { type: "string" }, description: "Filter by country name or ISO country code (case-insensitive)" },
        ],
      },
    },
    "/v1/macro/credit-ratings/{country}": {
      get: {
        summary: "Return the sovereign credit rating for a single country by ISO country code",
        parameters: [
          { name: "country", in: "path", required: true, schema: { type: "string" }, description: "ISO 2-letter country code (e.g. US, JP, DE)" },
        ],
      },
    },
    "/v1/factors/catalog": {
      get: { summary: "Return the SEC API factor catalog with methodology, proxy, and orthogonalization metadata" },
    },
    "/v1/factors/returns": {
      get: { summary: "Return factor return history, z-scores, and volatility-scaled series for supported factor families" },
    },
    "/v1/factors/returns/intraday": {
      get: {
        summary: "Return intraday factor snapshots for live dashboards using the latest benchmark proxy surface",
        ...jsonResponse("FactorIntradaySnapshotList"),
      },
    },
    "/v1/factors/dashboard": {
      get: {
        summary: "Return a one-call live factor dashboard with intraday, regime, rotation, spotlight-security, and optional model-portfolio drill-down sections",
        ...jsonResponse("FactorDashboard"),
      },
    },
    "/v1/factors/regime-performance": {
      get: {
        summary: "Return regime-conditioned factor rankings that blend the active macro backdrop with current factor state",
        ...jsonResponse("FactorRegimePerformanceList"),
      },
    },
    "/v1/factors/exposures": {
      get: { summary: "Return security, portfolio, or watchlist factor exposures with model metadata and provenance" },
    },
    "/v1/stocks/{ticker}/loadings": {
      get: {
        summary: "Return stock-level factor loadings for a single ticker using the latest stored exposure model",
        ...jsonResponse("FactorExposureList"),
      },
    },
    "/v1/factors/correlations": {
      get: { summary: "Return factor-to-factor and factor-to-security correlation surfaces for strategy and risk workflows" },
    },
    "/v1/factors/screen": {
      get: { summary: "Return factor screens ranked by recent strength so agents can run factor-rotation and cross-factor ranking workflows" },
    },
    "/v1/factors/decomposition": {
      get: { summary: "Return factor-attribution decomposition for a security over a bounded lookback window with explained return, alpha, and methodology metadata" },
    },
    "/v1/factors/related-stocks": {
      get: { summary: "Return related stocks ranked by factor-overlap similarity for peer discovery and hedge ideation" },
    },
    "/v1/factors/similarity-pack": {
      get: {
        summary: "Return a custom thematic similarity pack that combines factor-overlap peers with deterministic filing/news signatures and naming workflow metadata",
        ...jsonResponse("FactorSimilarityPack"),
      },
    },
    "/v1/factors/pairs": {
      get: { summary: "Return pairwise factor spread data including cumulative spread, average, volatility, and daily series for two specified factors" },
    },
    "/v1/factors/pair-history/{f1}/{f2}": {
      get: { summary: "Return historical spread between two specific factors identified by path parameters with windowed series data" },
    },
    "/v1/factors/bulk-download": {
      get: { summary: "Return all factor returns data in bulk with full daily series for commercial plan bulk-download workflows" },
    },
    "/v1/factors/custom": {
      post: {
        summary: "Discover a custom thematic factor pack from factor-overlap peers plus deterministic filing/news signatures",
        ...jsonRequestBody("FactorCustomDiscoveryRequest"),
        ...jsonResponse("FactorSimilarityPack"),
      },
    },
    "/v1/portfolio/analyze": {
      post: {
        summary: "Return factor exposures, attribution, and hedge suggestions for a portfolio in one deterministic response",
        ...jsonRequestBody("PortfolioIntelligenceRequest"),
        ...jsonResponse("PortfolioAnalysis"),
      },
    },
    "/v1/model-portfolios/{portfolioId}/factor-view": {
      get: {
        summary: "Return a model-portfolio factor view with aggregate analysis and per-position exposures for drill-down workflows",
        ...jsonResponse("ModelPortfolioFactorView"),
      },
    },
    "/v1/portfolio/stress-test": {
      post: {
        summary: "Run portfolio stress scenarios across factor and macro shock definitions with compact traceable outputs",
        ...jsonRequestBody("PortfolioStressTestRequest"),
        ...jsonResponse("PortfolioStressTest"),
      },
    },
    "/v1/portfolio/optimize": {
      post: {
        summary: "Return portfolio optimization recommendations for factor neutrality, hedging, and regime-aware objectives",
        ...jsonRequestBody("PortfolioIntelligenceRequest"),
        ...jsonResponse("PortfolioAnalysis"),
      },
    },
    "/v1/strategies/factor-rotation": {
      post: { summary: "Return factor-rotation recommendations informed by macro regime context and factor state" },
    },
    "/v1/strategies/regime-screen": {
      post: { summary: "Return regime-aware security screens with factor, macro, and filing-aware filters" },
    },
    "/v1/intelligence/query": {
      post: {
        summary: "Compile an allocator prompt into a deterministic one-call intelligence workload with compact traced output",
        ...jsonRequestBody("IntelligenceQueryRequest"),
        responses: {
          "200": {
            description: "Synchronous intelligence query result",
            content: jsonContent("IntelligenceQueryResponse"),
          },
          "202": {
            description: "Queued async intelligence query job",
            content: jsonContent("IntelligenceQueryJob"),
          },
        },
      },
    },
    "/v1/intelligence/query/{jobId}": {
      get: {
        summary: "Poll an async intelligence workload until the final traced result is ready",
        responses: {
          "200": {
            description: "Completed intelligence query result",
            content: jsonContent("IntelligenceQueryResponse"),
          },
          "202": {
            description: "Still-running intelligence query job",
            content: jsonContent("IntelligenceQueryJob"),
          },
        },
      },
    },
    "/v1/intelligence/security": {
      get: {
        summary: "Return a one-call security bundle with snapshot, catalysts, filings, and factor context",
        ...jsonResponse("SecurityIntelligenceBundle"),
      },
    },
    "/v1/intelligence/company": {
      get: {
        summary: "Return a one-call company bundle spanning market, filings, ownership, macro, factor, and risk context",
        ...jsonResponse("CompanyIntelligenceBundle"),
      },
    },
    "/v1/intelligence/earnings-preview": {
      get: {
        summary: "Return an earnings preview bundle with estimates, drivers, risks, and traceable supporting context",
        ...jsonResponse("EarningsPreviewBundle"),
      },
    },
    "/v1/intelligence/portfolio": {
      post: {
        summary: "Return a one-call portfolio intelligence bundle with exposures, stress scenarios, events, and hedge ideas",
        ...jsonRequestBody("PortfolioIntelligenceRequest"),
        ...jsonResponse("PortfolioAnalysis"),
      },
    },
    "/v1/intelligence/watchlist": {
      post: {
        summary: "Return a watchlist briefing bundle with movers, catalysts, factor context, and regime overlays",
        ...jsonRequestBody("WatchlistIntelligenceRequest"),
        ...jsonResponse("WatchlistIntelligenceBundle"),
      },
    },
    "/v1/intelligence/country-report": {
      post: {
        summary: "Return a country intelligence bundle covering the prior period's macro path, likely drivers, and forward view",
        ...jsonRequestBody("CountryReportRequest"),
        ...jsonResponse("CountryReport"),
      },
    },
    "/v1/intelligence/footnotes/query": {
      post: {
        summary: "Return a structured filing-footnote investigation bundle for lease, tax, revenue, covenant, and segment-note workflows",
        ...jsonRequestBody("FootnoteIntelligenceRequest"),
        ...jsonResponse("FootnoteIntelligenceResult"),
      },
    },
    "/v1/signals/volatility": {
      get: { summary: "Return the SEC API volatility score with transparent factor breakdown and freshness metadata" },
    },
    "/v1/signals/dilution": {
      get: {
        summary:
          "Return the SEC API Dilution Score: factor-weighted 0-100 derived metric with sub-ratings, percentile, and optional rolling history",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker. Either ticker or cik is required." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Issuer CIK (10-digit zero-padded). Either ticker or cik is required." },
          { name: "history", in: "query", required: false, schema: { type: "string", enum: ["30d", "90d", "1y"] }, description: "Optional rolling-history window for the score timeseries." },
          { name: "view", in: "query", required: false, schema: { type: "string", enum: ["default", "compact", "agent"] }, description: "Response shape. agent drops the factor breakdown for token efficiency." },
        ],
        ...jsonResponse("DilutionScore"),
      },
    },
    "/v1/signals/dilution/enhanced": {
      get: {
        summary:
          "Return the SEC API Dilution Score augmented with factor-model context (macro liquidity regime, momentum exposure, short-interest placeholder)",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker. Either ticker or cik is required." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Issuer CIK (10-digit zero-padded). Either ticker or cik is required." },
          { name: "view", in: "query", required: false, schema: { type: "string", enum: ["default", "compact", "agent"] }, description: "Response shape. agent drops the factor breakdown for token efficiency." },
        ],
        ...jsonResponse("DilutionScoreEnhanced"),
      },
    },
    "/v1/facts": {
      get: { summary: "Return normalized SEC company facts for an issuer, concept, and optional form or unit" },
    },
    "/v1/statements": {
      get: { summary: "Return a normalized statement bundle backed by SEC company facts" },
    },
    "/v1/statements/all": {
      get: { summary: "Return the balance sheet, income statement, and cash flow statement as one normalized bundle" },
    },
    "/v1/statements/{statement_key}": {
      get: { summary: "Return a specific normalized statement bundle keyed by statement type" },
    },
    "/v1/companies/income-statements": {
      get: {
        summary: "Return SEC XBRL-derived income statements for a ticker with EBITDA and share-count enrichment",
        ...jsonResponse("CompanyIncomeStatements"),
      },
    },
    "/v1/companies/balance-sheets": {
      get: {
        summary: "Return SEC XBRL-derived balance sheets for a ticker with normalized debt, equity, and cash fields",
        ...jsonResponse("CompanyBalanceSheets"),
      },
    },
    "/v1/companies/cash-flow-statements": {
      get: {
        summary: "Return SEC XBRL-derived cash flow statements for a ticker with free-cash-flow and dividend enrichment",
        ...jsonResponse("CompanyCashFlowStatements"),
      },
    },
    "/v1/companies/financials": {
      get: {
        summary: "Return combined SEC XBRL-derived income, balance-sheet, and cash-flow statements for a ticker",
        ...jsonResponse("CompanyFinancials"),
      },
    },
    "/v1/companies/ratios": {
      get: {
        summary: "Return profitability, return, valuation, dividend, and leverage ratios derived from SEC XBRL statements plus market context",
        ...jsonResponse("CompanyRatios"),
      },
    },
    "/v1/owners/13f": {
      get: { summary: "Return the latest normalized 13F ownership report for a manager CIK, with optional quarter-specific selection" },
    },
    "/v1/owners/institutional/investor": {
      get: { summary: "Return an investor-centric institutional ownership graph for a manager CIK, including ranked holdings and quarter-over-quarter changes" },
    },
    "/v1/owners/institutional/extract": {
      get: { summary: "Return a quarter-specific historical institutional ownership extract for a manager CIK over the SEC-native 13F family" },
    },
    "/v1/owners/institutional/ticker": {
      get: { summary: "Return a ticker-centric institutional holder graph for the latest materialized 13F cohort, ranked by disclosed position value" },
    },
    "/v1/owners/13f/filings": {
      get: { summary: "List recent 13F filings, including quarter-end report dates, for a manager CIK" },
    },
    "/v1/owners/13d-13g": {
      get: { summary: "List beneficial ownership reports across the SEC-native 13D and 13G filing families" },
    },
    "/v1/owners/13f/compare": {
      post: { summary: "Compare the latest two 13F ownership reports for a manager CIK" },
    },
    "/v1/insiders": {
      get: { summary: "Return recent normalized insider trading records derived from Forms 3, 4, and 5 with date filters and cursor pagination" },
    },
    "/v1/compensation": {
      get: { summary: "Return normalized executive compensation records derived from the latest DEF 14A filing" },
    },
    "/v1/compensation/compare": {
      post: { summary: "Compare the latest two executive compensation disclosures for an issuer" },
    },
    "/v1/artifacts": {
      get: { summary: "List canonical artifacts for the current organization" },
      post: { summary: "Create and persist a derived artifact bundle" },
    },
    "/v1/artifacts/summary": {
      get: { summary: "Return artifact lifecycle counts by kind, status, and storage mode" },
    },
    "/v1/artifacts/{artifact_id}": {
      get: { summary: "Fetch persisted artifact metadata" },
    },
    "/v1/artifacts/{artifact_id}/manifest": {
      get: { summary: "Fetch the structured manifest for a persisted artifact" },
    },
    "/v1/artifacts/{artifact_id}/export": {
      get: { summary: "Export an artifact as structured JSON or a markdown-oriented download envelope" },
    },
    "/v1/artifacts/{artifact_id}/download": {
      get: { summary: "Download or redirect to the persisted artifact payload" },
    },
    "/v1/artifacts/{artifact_id}/reconcile": {
      post: { summary: "Reconcile artifact metadata with object storage and upload if needed" },
    },
    "/v1/search/fulltext": {
      get: {
        summary: "Full-text search across filing content and section text via Typesense",
        parameters: [
          { name: "q", in: "query", required: true, schema: { type: "string" }, description: "Search query" },
          { name: "ticker", in: "query", schema: { type: "string" } },
          { name: "cik", in: "query", schema: { type: "string" } },
          { name: "form", in: "query", schema: { type: "string" } },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 25 } },
        ],
      },
    },
    "/v1/search/semantic": {
      get: {
        summary: "Semantic vector search across SEC filing section content via Voyage AI + Pinecone, with hybrid keyword + vector RRF and citation fields on every result row",
        parameters: [
          { name: "q", in: "query", required: true, schema: { type: "string" }, description: "Search query" },
          { name: "mode", in: "query", schema: { type: "string", enum: ["keyword", "semantic", "hybrid"] }, description: "Retrieval mode (default hybrid)" },
          { name: "ticker", in: "query", schema: { type: "string" } },
          { name: "cik", in: "query", schema: { type: "string" } },
          { name: "form", in: "query", schema: { type: "string" } },
          { name: "filing_year", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100 } },
          { name: "view", in: "query", schema: { type: "string", enum: ["default", "agent"] }, description: "Pass `agent` to drop score and retrievalMode while preserving citation fields" },
        ],
      },
    },
    "/v1/advisers": {
      get: {
        summary: "Search SEC Form ADV investment adviser filings by name, CIK, or state",
        parameters: [
          { name: "query", in: "query", schema: { type: "string" }, description: "Adviser name or keyword" },
          { name: "cik", in: "query", schema: { type: "string" } },
          { name: "state", in: "query", schema: { type: "string" } },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 50 } },
        ],
      },
    },
    "/v1/market/financials": {
      get: {
        summary: "Financial statements (income, balance sheet, cash flow) for a ticker via MASSIVE/Polygon",
        parameters: [
          { name: "ticker", in: "query", required: true, schema: { type: "string" } },
          { name: "timeframe", in: "query", schema: { type: "string", enum: ["annual", "quarterly"] } },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100 } },
        ],
      },
    },
    "/v1/market/search": {
      get: {
        summary: "Search for stock tickers by company name or keyword",
        parameters: [
          { name: "q", in: "query", required: true, schema: { type: "string" } },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 50 } },
        ],
      },
    },
    "/v1/market/estimates": {
      get: {
        summary: "Return analyst consensus ratings and price-target estimates for a ticker via Massive/Benzinga",
        parameters: [
          { name: "ticker", in: "query", required: true, schema: { type: "string" } },
          { name: "date_from", in: "query", schema: { type: "string", format: "date" } },
          { name: "date_to", in: "query", schema: { type: "string", format: "date" } },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 50 } },
        ],
      },
    },
    "/v1/filings/{accession_number}/download": {
      get: { summary: "Redirect to the SEC EDGAR source document for a filing by accession number" },
    },
    "/v1/filings/{accession_number}/export": {
      get: {
        summary: "Export a filing as JSON, Markdown, CSV, XLSX, DOCX, or PDF",
        parameters: [
          {
            name: "format",
            in: "query",
            schema: { type: "string", enum: ["json", "markdown", "csv", "xlsx", "docx", "pdf"] },
            description: "Export format; defaults to json when omitted",
          },
          { name: "ticker", in: "query", schema: { type: "string" } },
          { name: "cik", in: "query", schema: { type: "string" } },
          { name: "form", in: "query", schema: { type: "string" } },
        ],
      },
    },
    "/mcp": {
      post: { summary: "Hosted MCP transport endpoint" },
    },
    // ----- Dilution domain (OMNI-3071 stubs; handlers land in OMNI-3089) -----
    "/v1/dilution/events": {
      get: {
        summary: "List dilution events (S-1, 424B*, FWP, S-3 offerings) with filters by ticker, form, date, and is_atm",
        ...jsonResponse("DilutionEventList"),
      },
    },
    "/v1/dilution/events/{event_id}": {
      get: {
        summary: "Retrieve a single dilution event with verification block, warrants, and convertibles linkage",
        parameters: [
          { name: "event_id", in: "path", required: true, schema: { type: "string" } },
        ],
        ...jsonResponse("DilutionEvent"),
      },
    },
    "/v1/dilution/warrants": {
      get: {
        summary: "List warrant schedules parsed from offering exhibits with price-protection and ratchet clauses",
        ...jsonResponse("DilutionWarrantList"),
      },
    },
    "/v1/dilution/convertibles": {
      get: {
        summary: "List convertible debt schedules with conversion price, maturity, and ratchet metadata",
        ...jsonResponse("DilutionConvertibleList"),
      },
    },
    "/v1/dilution/rofr": {
      get: {
        summary: "List right-of-first-refusal and tail-financing clauses parsed from underwriter agreements",
        ...jsonResponse("DilutionRofrList"),
      },
    },
    "/v1/dilution/lockups": {
      get: {
        summary: "List lockup schedules with start/end dates, parties, and conditions",
        ...jsonResponse("DilutionLockupList"),
      },
    },
    "/v1/dilution/nasdaq-compliance": {
      get: {
        summary: "List Nasdaq deficiency notices with status and remediation tracking",
        ...jsonResponse("DilutionNasdaqComplianceList"),
      },
    },
    "/v1/dilution/reverse-splits": {
      get: {
        summary: "List reverse-stock-split actions with execution date and ratio",
        ...jsonResponse("DilutionReverseSplitList"),
      },
    },
    "/v1/dilution/cash-position": {
      get: {
        summary: "Cash runway, burn, and management commentary computed from quarterly filings",
        ...jsonResponse("DilutionCashPositionList"),
      },
    },
    "/v1/dilution/corporate-actions": {
      get: {
        summary: "List dilution-relevant corporate actions: ticker changes, exchange moves, de-SPAC closings, splits",
        ...jsonResponse("DilutionCorporateActionList"),
      },
    },
    "/v1/dilution/ratings": {
      get: {
        summary: "Composite Dilution Score with sub-factors (offering ability, historical, cash need, warrant exercise risk)",
        ...jsonResponse("DilutionRatingList"),
      },
    },
    "/v1/dilution/share-float-history": {
      get: {
        summary: "Historical shares outstanding and public float series materialized from filings",
        ...jsonResponse("DilutionShareFloatHistoryList"),
      },
    },
    "/v1/dilution/score": {
      get: {
        summary: "Per-issuer Dilution Score with explanation and source events (alias of latest rating; ticker query parameter required)",
        parameters: [
          { name: "ticker", in: "query", required: true, schema: { type: "string" }, description: "Ticker symbol (required). Returns the latest dilution rating for this issuer." },
        ],
        ...jsonResponse("DilutionRating"),
      },
    },
    "/v1/dilution/coverage": {
      get: {
        summary: "Dilution-domain coverage and freshness summary across forms, tickers, and verification status",
        parameters: [
          { name: "ticker", in: "query", schema: { type: "string" }, description: "Optional ticker scope. When present, counts and freshness are restricted to rows for that issuer." },
        ],
        ...jsonResponse("DilutionCoverage"),
      },
    },
  },
} as const
