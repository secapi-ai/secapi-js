# SEC API JavaScript SDK

Query SEC filings, financial statements, ownership data, and filing sections from TypeScript or JavaScript.

[Documentation](https://docs.secapi.ai) · [Get an API key](https://secapi.ai/signup) · [API status](https://status.secapi.ai)

## Install

```bash
npm install @secapi/sdk-js
```

The package is ESM-only and includes TypeScript declarations.

## Retrieve a filing

Set your API key:

```bash
export SECAPI_API_KEY="secapi_live_..."
```

Then fetch Apple's latest 10-K:

```ts
import { SecApiClient } from "@secapi/sdk-js"

const sec = new SecApiClient()
const filing = await sec.agentLatestFiling({
  ticker: "AAPL",
  form: "10-K",
})

console.log(filing)
```

Save the example as `first-request.mjs` and run it with `node first-request.mjs`.

The compact response identifies the filing and links back to the SEC source:

```json
{
  "object": "filing",
  "ticker": "AAPL",
  "form": "10-K",
  "accessionNumber": "0000320193-25-000079",
  "filingDate": "2025-10-31",
  "title": "10-K - Apple Inc.",
  "filingUrl": "https://www.sec.gov/Archives/edgar/data/320193/0000320193-25-000079.txt",
  "requestId": "req_..."
}
```

The accession number is the filing's stable SEC identifier. Keep it with any extracted text or analysis so you can trace the result to its source. Filing dates and accession numbers in this example will change when Apple files a newer 10-K.

## Common requests

Flat methods are the complete SDK interface. Grouped aliases such as `sec.filings.latest()` and `sec.sections.latest()` are available for editor discovery.

```ts
// Resolve a ticker, CIK, FIGI, ISIN, CUSIP, or company name.
const company = await sec.resolveEntity({ ticker: "AAPL", view: "agent" })

// Search filings and follow the returned SEC source metadata.
const filings = await sec.searchFilings({
  ticker: "AAPL",
  forms: ["10-K", "10-Q"],
  limit: 20,
})

// Retrieve Item 1A from the latest 10-K.
const riskFactors = await sec.agentSection({
  ticker: "AAPL",
  form: "10-K",
  sectionKey: "item_1a",
})

// Retrieve annual income-statement rows in the compact response shape.
const income = await sec.agentStatement("income_statement", {
  ticker: "AAPL",
  period: "annual",
  limit: 3,
})

// Inspect recent insider transactions.
const insiders = await sec.insiders({ ticker: "AAPL", limit: 20 })
```

See the [API documentation](https://docs.secapi.ai) for endpoint coverage, parameters, response fields, and runnable tutorials.

## Pagination

Use the built-in async iterators for cursor-based endpoints:

```ts
for await (const filing of sec.paginateFilings({
  ticker: "AAPL",
  form: "8-K",
  limit: 100,
})) {
  console.log(filing)
}
```

The SDK also provides `paginateEntities()`, `paginateSections()`, and a generic `paginate()` helper.

## Errors

API failures throw `SecApiError` with a status, stable error code, request ID, and recovery guidance when available:

```ts
import { SecApiClient, SecApiError } from "@secapi/sdk-js"

const sec = new SecApiClient()

try {
  await sec.latestFiling({ ticker: "NOT-A-TICKER", form: "10-K" })
} catch (error) {
  if (error instanceof SecApiError) {
    console.error({
      status: error.status,
      code: error.code,
      requestId: error.requestId,
      message: error.message,
      hint: error.hint,
    })
  }
}
```

Include `requestId` when reporting an API problem.

## Authentication and configuration

`new SecApiClient()` reads `SECAPI_API_KEY` and sends it as the `x-api-key` header. You can pass configuration explicitly when needed:

```ts
const sec = new SecApiClient({
  apiKey: process.env.SECAPI_API_KEY,
  apiVersion: "2026-03-19",
  baseUrl: "https://api.secapi.ai",
})
```

The SDK also recognizes these environment variables:

| Variable | Purpose |
| --- | --- |
| `SECAPI_API_KEY` | API key for server-side and local development |
| `SECAPI_BASE_URL` | Optional API base URL override |
| `SECAPI_API_BASE_URL` | Alias for `SECAPI_BASE_URL` |
| `SECAPI_BEARER_TOKEN` | WorkOS bearer token for signed-in account endpoints |

For normal data requests, use an API key. Dashboard and account-management methods require a WorkOS bearer token.

The client sends SEC API version `2026-03-19` by default. Pinning the version makes response-contract changes explicit rather than dependent on the request date.

## Retries

The SDK retries transient failures for safe HTTP methods with exponential backoff and jitter. By default it retries network errors and HTTP `408`, `429`, `502`, `503`, and `504` responses, up to three retries within a 30-second budget. It honors `Retry-After` on rate limits and opens a circuit breaker after five consecutive retryable failures.

Mutating requests and MCP tool calls use `POST` and are not retried automatically. Opt in only when the operation is safe to repeat:

```ts
await sec.callMcpTool(
  "entities.resolve",
  { ticker: "AAPL" },
  { retry: { enabled: true, idempotencyKey: "resolve-aapl" } },
)
```

Disable the built-in retry layer if your application already provides one:

```ts
const sec = new SecApiClient({ retry: false })
```

Retry telemetry records SDK retry attempts without sending response payloads. Set `telemetry: false` on the client or a request to disable it.

## Filing streams

After creating a WebSocket stream subscription, pass its ID to the SDK. The client mints a short-lived connection ticket so the API key is not placed in the WebSocket URL:

```ts
const stream = sec.streamFilings({
  streamId: "stream_...",
  forms: ["8-K"],
  tickers: ["AAPL"],
  onFiling: (event) => console.log(event.filing),
  onError: (error) => console.error(error),
})
```

Streaming uses the runtime's global `WebSocket` implementation. It works without a polyfill in modern browsers, Bun, Deno, and Node.js 21 or newer. REST methods require a standards-compatible `fetch`, available in Node.js 18 or newer and the other runtimes above.

## Run the repository example

The checked-in example resolves Apple, retrieves its latest 10-K, and extracts Item 1A:

```bash
git clone https://github.com/secapi-ai/secapi-js.git
cd secapi-js
bun install
export SECAPI_API_KEY="secapi_live_..."
bun run examples/agent_workflow.ts
```

## Contributing

```bash
bun install
bun run typecheck
bun test
bun run build
```

Please open an issue before changing generated API contract code by hand.

## Support and links

- [Documentation](https://docs.secapi.ai)
- [Get an API key](https://secapi.ai/signup)
- [Pricing](https://secapi.ai/pricing)
- [API status](https://status.secapi.ai)
- [Report an SDK issue](https://github.com/secapi-ai/secapi-js/issues)

## License

MIT
