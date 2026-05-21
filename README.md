# @secapi/sdk-js

TypeScript and JavaScript SDK for [SEC API](https://secapi.ai/developers) -- SEC filings, financial statements, ownership data, and more. Legacy client names remain available for compatibility.

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

const client = new SecApiClient({
  apiKey: process.env.SECAPI_API_KEY ?? process.env.OMNI_DATASTREAM_API_KEY,
  // Optional: override the base URL (defaults to https://api.secapi.ai)
  // baseUrl: process.env.SECAPI_BASE_URL ?? process.env.SECAPI_API_BASE_URL ?? process.env.OMNI_DATASTREAM_BASE_URL,
})
```

You can also authenticate with a Bearer token instead of an API key:

```ts
const client = new SecApiClient({
  bearerToken: process.env.SECAPI_BEARER_TOKEN ?? process.env.OMNI_DATASTREAM_BEARER_TOKEN,
})
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `SECAPI_API_KEY` | Preferred SEC API key env var |
| `SECAPI_BEARER_TOKEN` | Preferred OAuth bearer token env var |
| `SECAPI_BASE_URL` | Preferred base URL override |
| `SECAPI_API_BASE_URL` | Preferred API base URL override alias |
| `SECAPI_OPERATOR_API_KEY` | Preferred operator/admin API key env var |
| `OMNI_DATASTREAM_API_KEY` | Legacy API key fallback |
| `OMNI_DATASTREAM_BEARER_TOKEN` | Legacy OAuth bearer token fallback |
| `OMNI_DATASTREAM_BASE_URL` | Legacy base URL fallback |

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
  apiKey: process.env.SECAPI_API_KEY ?? process.env.OMNI_DATASTREAM_API_KEY,
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
  apiKey: process.env.SECAPI_API_KEY ?? process.env.OMNI_DATASTREAM_API_KEY,
})

// Resolve a company entity
const entity = await client.resolveEntity({ ticker: "AAPL" })
console.log(entity)

// Get the latest 10-K filing
const filing = await client.latestFiling({ ticker: "AAPL", form: "10-K" })
console.log(filing)

// Extract a specific section from the filing
const section = await client.latestSection({
  ticker: "AAPL",
  form: "10-K",
  sectionKey: "item_1a",
  mode: "compact",
})
console.log(section)
```

## Common Use Cases

### Financial Statements

```ts
// Get XBRL facts
const facts = await client.facts({ ticker: "AAPL", tag: "Assets", taxonomy: "us-gaap", limit: 5 })

// Full financial statements
const statements = await client.allStatements({ ticker: "AAPL", period: "annual", limit: 3 })
```

### Ownership and Institutional Holdings

```ts
// Latest 13F filing (institutional holdings)
const holdings = await client.latest13f({ cik: "0001067983", limit: 10 })

// Insider trades
const insiders = await client.insiderTrades({ ticker: "AAPL", limit: 10 })
```

### Market Data

```ts
// Market calendar
const calendar = await client.marketCalendar({ market: "XNYS", duration: 3 })

// Volatility signal
const vol = await client.volatilitySignal({ ticker: "AAPL" })
```

## Error Handling

All API errors throw `SecApiError` with structured details. `OmniDatastreamError` remains an alias-compatible legacy export:

```ts
import { SecApiClient, SecApiError } from "@secapi/sdk-js"

const client = new SecApiClient({
  apiKey: process.env.SECAPI_API_KEY ?? process.env.OMNI_DATASTREAM_API_KEY,
})

try {
  await client.requestDiagnostics("missing-request-id")
} catch (error) {
  if (error instanceof SecApiError) {
    console.error(error.status, error.requestId, error.body)
  }
}
```

## MCP (Model Context Protocol) Usage

The SDK supports MCP-compatible tool invocation for AI agent workflows:

```ts
// Get available MCP tools
const mcpInfo = await client.mcpInfo()
console.log(mcpInfo)

// Invoke an MCP tool
const toolResult = await client.mcp({
  jsonrpc: "2.0",
  id: "1",
  method: "tools/call",
  params: {
    name: "entities.resolve",
    arguments: { ticker: "AAPL" },
  },
})
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

## Runtime Validation

All responses are validated at runtime using Zod schemas. This ensures type safety even when consuming untyped API responses.

## Links

- [API Documentation](https://docs.secapi.ai)
- [Developer Portal](https://secapi.ai/developers)
- [GitHub Repository](https://github.com/autonomous-computer/omni-datastream)
