# @secapi/sdk-js

TypeScript and JavaScript SDK for [SEC API](https://secapi.ai/developers) -- factor data, SEC filings, financial statements, ownership data, and more. Legacy client names remain available for compatibility.

## Installation

```bash
npm install @secapi/sdk-js
# or
pnpm add @secapi/sdk-js
# or
yarn add @secapi/sdk-js
```

## Configuration

Create a client instance with your API key:

```ts
import { SecApiClient } from "@secapi/sdk-js"

// Reads SECAPI_API_KEY and SECAPI_BASE_URL from the environment by default.
const client = new SecApiClient()
```

You can also pass credentials explicitly:

```ts
const client = new SecApiClient({
  apiKey: process.env.SECAPI_API_KEY,
  // Optional: override the base URL (defaults to https://api.secapi.ai)
  // baseUrl: process.env.SECAPI_BASE_URL ?? process.env.SECAPI_API_BASE_URL,
})
```

You can also authenticate with a Bearer token instead of an API key:

```ts
const client = new SecApiClient({
  bearerToken: process.env.SECAPI_BEARER_TOKEN,
})
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `SECAPI_API_KEY` | Preferred SEC API key env var |
| `SECAPI_BEARER_TOKEN` | Preferred OAuth bearer token env var |
| `SECAPI_BASE_URL` | Preferred base URL override |
| `SECAPI_API_BASE_URL` | Preferred API base URL override alias |
| `OMNI_DATASTREAM_API_KEY` | Compatibility API key env var |
| `OMNI_DATASTREAM_BASE_URL` | Compatibility base URL override |
| `OMNI_DATASTREAM_API_BASE_URL` | Compatibility base URL override alias |
| `SECAPI_OPERATOR_API_KEY` | Preferred operator/admin API key env var |

## Reliability

The SDK retries transient failures with exponential backoff and jitter. Defaults:

- Auto-retried by default: `GET`, `HEAD`, `OPTIONS`
- Opt-in required: `POST`, `PUT`, `PATCH`, `DELETE`, MCP `tools/call`
- Always retried regardless of method: `429` rate limits, with `Retry-After` honored
- Retryable failures: network errors, `408`, `429`, `502`, `503`, `504`
- Never retried: `400`, `401`, `403`, `404`, `422`
- Backoff: base `200ms`, max `5s`, max retries `3`, total budget `30s`
- Circuit breaker: opens after 5 consecutive retryable failures, cools down for 60s

Disable retries globally if you already wrap the SDK with your own retry layer:

```ts
const client = new SecApiClient({
  apiKey: process.env.SECAPI_API_KEY,
  retry: false,
})
```

Per-call overrides are supported:

```ts
await client.latestFiling({ ticker: "AAPL", retry: false })

await client.createArtifact(
  { kind: "audit", payload: { ticker: "AAPL" } },
  { retry: { enabled: true, idempotencyKey: "artifact-aapl-audit-2026-05-01" } },
)
```

Only opt into retries for mutating requests when the operation is idempotent from your application's point of view. Provide an idempotency key so ambiguous network failures can be correlated safely.

Retry telemetry emits anonymous `client_retry_attempt` events to SEC API's telemetry project. Set `telemetry: false` globally or per call to opt out.

## Quickstart

```ts
import { SecApiClient } from "@secapi/sdk-js"

const client = new SecApiClient({
  // Uses SECAPI_API_KEY from the environment.
})

// Resolve a company entity
const entity = await client.resolveEntity({ ticker: "AAPL" })
console.log(entity)

// Get the latest 10-K filing
const filing = await client.latestFiling({ ticker: "AAPL", form: "10-K" })
console.log(filing)

// Same workflow in the compact agent response shape
const agentFiling = await client.agentLatestFiling({ ticker: "AAPL", form: "10-K" })
console.log(agentFiling)

// Extract a specific section from the filing
const section = await client.latestSection({
  ticker: "AAPL",
  form: "10-K",
  sectionKey: "item_1a",
  mode: "compact",
})
console.log(section)
```

### Grouped namespaces

Flat methods remain the canonical API, and the client also exposes grouped
aliases for editor discovery:

```ts
const filing = await client.filings.latest({ ticker: "AAPL", form: "10-K" })
const section = await client.sections.latest({
  ticker: "AAPL",
  form: "10-K",
  sectionKey: "item_1a",
  mode: "compact",
})
const results = await client.search.semantic({
  q: "revenue concentration risk",
  ticker: "AAPL",
  mode: "hybrid",
  view: "agent",
})
const history = await client.factors.history("VALUE", {
  range: "1y",
  response_mode: "compact",
})
```

Available namespaces include `entities`, `filings`, `sections`, `search`, and
`factors`. These namespaces are curated for common discovery workflows; the flat
methods remain the exhaustive SDK surface.

### Live agent workflow example

For a production-backed copy/paste path, run the focused example that resolves
an entity, fetches the latest 10-K, and extracts Item 1A in compact mode:

```bash
export SECAPI_API_KEY="secapi_live_..."
bun run packages/sdk-js/examples/agent_workflow.ts
```

From the monorepo root, `bun run smoke:sdk-examples` runs the matching
JavaScript, Python, Go, and Rust examples and asserts that each returns entity,
filing, and compact-section metadata.

### Auto-pagination

Cursor endpoints can be consumed with async iterators instead of hand-rolling
`nextCursor` loops:

```ts
for await (const filing of client.paginateFilings({
  ticker: "AAPL",
  form: "10-K",
  limit: 100,
})) {
  console.log(filing)
}
```

Built-in helpers cover common discovery flows: `paginateFilings`,
`paginateSections`, and `paginateEntities`. For other cursor endpoints, use the
generic helper and pass the page function:

```ts
for await (const event of client.paginate(
  (params) => client.streamEvents("stream_123", params),
  { limit: 100 },
  { maxItems: 500 },
)) {
  console.log(event)
}
```

If an endpoint returns a non-standard list key, provide `getItems` or
`getNextCursor` in the options.

## Common Use Cases

### Factor Data and Portfolio Workflows

Use `response_mode: "compact"` when you are feeding an agent, LLM, notebook, or UI card and want the smallest useful payload. Compact catalog responses still include readiness/proof summaries. Add `include: "trust"` only when you need the full trust/provenance envelope plus full methodology/materialization/revision/source-rights objects for citations or checks. For catalog/tool-discovery calls, start narrow with `category` plus `limit` before requesting trust metadata; the full trust envelope can be larger than a simple picker payload.

```ts
// Factor catalog for picker UIs and agent tool discovery
const catalog = await client.factorCatalog({
  category: "style",
  limit: 25,
  response_mode: "compact",
  include: "trust",
})

// 1D through MAX style return history for charts and tables
const valueHistory = await client.factorHistory("VALUE", {
  range: "1y",
  response_mode: "compact",
  include: "trust,series",
})

// Factor opportunity screen for valuation-led workflows
const valuations = await client.factorValuations({
  keys: ["VALUE", "QUALITY", "MOMENTUM"],
  side: "all",
  sort: "opportunity_score",
  response_mode: "compact",
  include: "trust",
  limit: 25,
})

// Extreme moves and pairs for dashboard surfaces
const dashboard = await client.factorDashboard({
  country: "US",
  category: "style",
  ticker: "AAPL",
  response_mode: "compact",
})
const extremeMoves = await client.factorExtremeMoves({
  category: "style",
  window: "1d",
  min_z_score: 2,
  response_mode: "compact",
})
const extremePairs = await client.factorExtremePairs({
  category: "style",
  window: "1m",
  min_z_score: 1,
  response_mode: "compact",
})
```

Portfolio and model workflows use `POST` because they carry holdings or model payloads. Keep retries off by default unless your request is idempotent and you provide an idempotency key.

```ts
const holdings = [
  { symbol: "AAPL", weight: 0.4 },
  { symbol: "MSFT", weight: 0.35 },
  { symbol: "NVDA", weight: 0.25 },
]

const attribution = await client.portfolioAttribution(
  { holdings, window: "1y", frequency: "monthly" },
  { response_mode: "compact", include: "trust" },
)

const hedge = await client.portfolioHedge(
  { holdings, objective: "factor_neutral", constraints: { maxHedges: 5 } },
  { response_mode: "compact", include: "trust" },
)

const optimized = await client.portfolioOptimize(
  { holdings, objective: "regime_aware", constraints: { longOnly: true, maxPositionWeight: 0.35 } },
  { response_mode: "compact", include: "trust" },
)

const modelFactorAnalysis = await client.modelFactorAnalysis(
  {
    model: { id: "growth-core", label: "Growth Core" },
    holdings,
    include: { attribution: true, hedge: true, optimizer: true },
  },
  { response_mode: "compact", include: "trust" },
)
```

### Financial Statements

```ts
// Get XBRL facts
const facts = await client.facts({ ticker: "AAPL", tag: "Assets", taxonomy: "us-gaap", limit: 5 })

// Full financial statements
const statements = await client.allStatements({ ticker: "AAPL", period: "annual", limit: 3 })

// Agent-mode statement rows keep compact source metadata for citations
const agentIncome = await client.agentStatement("income_statement", {
  ticker: "AAPL",
  period: "annual",
  limit: 3,
})
```

### Ownership and Institutional Holdings

```ts
// Latest 13F filing (institutional holdings)
const holdings = await client.latest13F({ cik: "0001067983", limit: 10 })

// Insider trades
const insiders = await client.insiders({ ticker: "AAPL", limit: 10 })

// Issuer-level institutional holders, agent-mode by default
const holders = await client.agentInstitutionalHolders({ ticker: "NVDA", limit: 10 })

// Form 144 proposed sale filings, agent-mode by default
const form144 = await client.agentForm144({ ticker: "NVDA", limit: 10 })
```

### Market Data

```ts
// Market calendar
const calendar = await client.marketCalendar({ market: "XNYS", duration: 3 })

// Volatility signal
const vol = await client.volatilitySignal({ ticker: "AAPL" })
```

### Dashboard and Account Management

Dashboard endpoints require a WorkOS bearer token with account-management permissions.

```ts
const dashboardClient = new SecApiClient({
  bearerToken: process.env.SECAPI_BEARER_TOKEN,
})

const dashboard = await dashboardClient.dashboardOverview()
const settings = await dashboardClient.dashboardSettings()

await dashboardClient.updateDashboardAppearance({
  theme: "dark",
  density: "compact",
})

const usage = await dashboardClient.dashboardUsageSeries({
  bucket: "day",
  since: "2026-06-01T00:00:00.000Z",
  until: "2026-06-07T00:00:00.000Z",
})

const requests = await dashboardClient.dashboardUsageRequests({ status: "error", limit: 25 })
console.log(dashboard, settings, usage, requests)
```

## Error Handling

All API errors throw `SecApiError` with structured details:

```ts
import { SecApiClient, SecApiError } from "@secapi/sdk-js"

const client = new SecApiClient({
  apiKey: process.env.SECAPI_API_KEY,
})

try {
  await client.requestDiagnostics("missing-request-id")
} catch (error) {
  if (error instanceof SecApiError) {
    console.error({
      status: error.status,
      code: error.code,
      requestId: error.requestId,
      message: error.message,
      hint: error.hint,
      docsUrl: error.docsUrl,
      details: error.details,
    })
  }
}
```

## MCP (Model Context Protocol) Usage

The SDK supports MCP-compatible tool invocation for AI agent workflows:

```ts
// Get available MCP tools
const mcpInfo = await client.mcpInfo()
console.log(mcpInfo)

// Invoke an MCP tool without hand-writing JSON-RPC
const toolResult = await client.callMcpTool(
  "sections.get",
  { ticker: "AAPL", form: "10-K", sectionKey: "item_1a", mode: "compact" },
  { id: "aapl-risk-factors" },
)
```

MCP tool calls use HTTP `POST`, so they are not retried on `502`/`503` by default. Opt in per call only when the tool is read-only or otherwise idempotent:

```ts
await client.mcp(
  {
    jsonrpc: "2.0",
    id: "1",
    method: "tools/call",
    params: { name: "entities.resolve", arguments: { ticker: "AAPL" } },
  },
  { retry: { enabled: true, idempotencyKey: "mcp-entities-resolve-aapl" } },
)
```

The convenience `callMcpTool(name, arguments, options)` helper uses the same `POST /mcp` transport. Use per-call retry opt-in only for read-only tools such as `entities.resolve`, `filings.latest`, `sections.get`, `statements.get`, `owners.institutional_holders`, and `forms.list_144`.

## Runtime Validation

All responses are validated at runtime using Zod schemas. This ensures type safety even when consuming untyped API responses.

## Links

- [API Documentation](https://docs.secapi.ai)
- [Developer Portal](https://secapi.ai/developers)
- [GitHub Repository](https://github.com/secapi-ai/secapi-js)
