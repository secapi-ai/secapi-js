# SEC API JavaScript SDK

`@secapi/sdk-js` is an ESM JavaScript and TypeScript client for retrieving SEC filings, filing sections, financial statements, and ownership data from [SEC API](https://secapi.ai/developers).

[Documentation](https://docs.secapi.ai) · [Get an API key](https://secapi.ai/signup) · [Support](https://github.com/secapi-ai/secapi-js/issues) · [Status](https://status.secapi.ai)

## Start here

Install the package and set an API key in server-side configuration:

```bash
npm install @secapi/sdk-js
export SECAPI_API_KEY="secapi_live_..."
```

Create `first-request.mjs`:

```js
import { SecApiClient } from "@secapi/sdk-js"

const client = new SecApiClient()
const filing = await client.agentLatestFiling({ ticker: "AAPL", form: "10-K" })

console.log(filing.accessionNumber)
```

Run `node first-request.mjs`. It prints the accession number for the latest matching Apple 10-K; this live value changes when a newer filing is available. `agentLatestFiling()` requests the endpoint's `agent` view. Use `latestFiling()` for the default endpoint response.

**Compatibility and support:** REST calls require Node.js 18 or newer. `streamFilings()` requires a global `WebSocket` (Node.js 21+, Bun, Deno, or browsers); Node.js 18 callers need a polyfill or a newer runtime. Read the [JavaScript SDK guide](https://docs.secapi.ai/javascript-sdk) for API details, and [open an issue](https://github.com/secapi-ai/secapi-js/issues) for SDK support.

## Common requests

The client also resolves issuers, searches filings, extracts sections, and returns normalized statements:

```js
const company = await client.resolveEntity({ ticker: "AAPL", view: "agent" })

const filings = await client.searchFilings({
  ticker: "AAPL",
  forms: ["10-K", "10-Q"],
  limit: 20,
})

const riskFactors = await client.agentSection({
  ticker: "AAPL",
  form: "10-K",
  sectionKey: "item_1a",
})

const incomeStatements = await client.agentStatement("income_statement", {
  ticker: "AAPL",
  period: "annual",
  limit: 3,
})
```

Flat methods are the complete interface. Grouped aliases, including `client.filings.latest()` and `client.sections.latest()`, are available when they make editor discovery clearer.

## Factor response modes

Use `response_mode: "compact"` when you want the smallest useful payload. Compact catalog responses still include readiness/proof summaries. Set `include: "trust"` only when you need the full trust/provenance envelope plus full methodology/materialization/revision/source-rights objects for citations or checks. For catalog/tool-discovery calls, start narrow with `category` and `limit`; the full trust envelope can be larger than a simple picker payload.

## Configuration

`new SecApiClient()` reads `SECAPI_API_KEY` and sends it in the `x-api-key` header. `SECAPI_BASE_URL` and `SECAPI_API_BASE_URL` can override the default API origin, `https://api.secapi.ai`.

Pass values directly when environment variables are not appropriate:

```js
const client = new SecApiClient({
  apiKey: process.env.SECAPI_API_KEY,
  baseUrl: "https://api.secapi.ai",
})
```

Keep API keys out of browser bundles and client-side configuration. The SDK also accepts a bearer token for signed-in account endpoints through `bearerToken` or `SECAPI_BEARER_TOKEN`.

## Errors and pagination

API failures throw `SecApiError`, which includes `status`, `code`, and `requestId` when the service supplied one. Include the request ID in a support report.

Cursor-backed endpoints can be consumed as async iterators:

```js
for await (const filing of client.paginateFilings({
  ticker: "AAPL",
  form: "10-K",
  limit: 100,
})) {
  console.log(filing.accessionNumber)
}
```

Read methods (`GET`, `HEAD`, and `OPTIONS`) retry network errors and HTTP `408`, `429`, `502`, `503`, and `504` within a bounded policy. A `429` that the API does not mark non-retryable is retried for every method by default, including mutations; pass `retry: false` per call to disable it, or set it on the client to disable retries by default. Other mutation retries require `{ retry: { enabled: true, idempotencyKey: "..." } }`; use that only with a stable key and replay-safe application handling. See the [SDK reliability guide](https://docs.secapi.ai/sdk-reliability) for retry and streaming details.

## Reference

See the [JavaScript SDK guide](https://docs.secapi.ai/javascript-sdk) for endpoint behavior and the [API reference](https://docs.secapi.ai) for parameters and response fields.

## License

MIT
