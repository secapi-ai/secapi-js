# SEC API JavaScript SDK

The SEC API JavaScript SDK lets ESM applications query SEC filings, financial statements, ownership data, and filing sections through `api.secapi.ai`.

[Documentation](https://docs.secapi.ai) | [API reference](https://docs.secapi.ai/api-reference) | [Get an API key](https://secapi.ai/signup)

## Install

```bash
npm install @secapi/sdk-js
```

## First request

In Node.js or Bun, set an API key in your environment:

```bash
export SECAPI_API_KEY="secapi_live_..."
```

Then request the latest Apple 10-K. This works in JavaScript (`.mjs`) and TypeScript (`.ts`):

```ts
import { SecApiClient } from "@secapi/sdk-js"

const sec = new SecApiClient()
const filing = await sec.agentLatestFiling({
  ticker: "AAPL",
  form: "10-K",
})

console.log(filing)
```

The response is a compact filing object. Confirm the result has the expected `ticker`, `form`, and `accessionNumber` before using it downstream; the accession number identifies the SEC filing. When present, use `filingUrl` to link back to its SEC source.

## Compatibility and configuration

- Published as ESM only. Use `import`, not CommonJS `require()`.
- Node.js 18 or later is supported for REST requests. Bun, Deno, and modern browsers also need a standards-compatible global `fetch`.
- Filing streaming additionally requires a global `WebSocket`; this is available in Node.js 21+, Bun, Deno, and modern browsers.
- In Node.js and Bun, `new SecApiClient()` reads `SECAPI_API_KEY` from `process.env` and sends it as `x-api-key`.
- In Deno, pass `apiKey: Deno.env.get("SECAPI_API_KEY")` when constructing the client.
- Browser applications should call the SDK through a server or proxy and must never bundle an API key.

To configure a Node.js or Bun client explicitly, including a custom API origin:

```ts
const sec = new SecApiClient({
  apiKey: process.env.SECAPI_API_KEY,
  baseUrl: "https://api.secapi.ai",
})
```

In Deno:

```ts
const sec = new SecApiClient({
  apiKey: Deno.env.get("SECAPI_API_KEY"),
})
```

See the [API reference](https://docs.secapi.ai/api-reference) for endpoints, parameters, response fields, and authentication details.

## Migration and support

`SecApiClient` is the current client name. Existing integrations using `OmniDatastreamClient` can continue to run because it remains an alias for `SecApiClient`; migrate imports when you next update application code. For help, review the [documentation](https://docs.secapi.ai), check [API status](https://status.secapi.ai), or [open an SDK issue](https://github.com/secapi-ai/secapi-js/issues) with the request ID from the API response or `SecApiError`.

## License

MIT
