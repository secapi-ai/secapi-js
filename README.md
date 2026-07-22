# SEC API JavaScript SDK

SEC API provides programmatic access to SEC filings, filing sections, financial statements, and ownership data. `@secapi/sdk-js` is its JavaScript and TypeScript client.

## Install and retrieve a filing

```bash
npm install @secapi/sdk-js
export SECAPI_API_KEY="secapi_..."
```

Create `first-request.mjs`:

```js
import { SecApiClient } from "@secapi/sdk-js"

const client = new SecApiClient()
const filing = await client.agentLatestFiling({ ticker: "AAPL", form: "10-K" })

console.log({
  accessionNumber: filing.accessionNumber,
  filingDate: filing.filingDate,
  filingUrl: filing.filingUrl,
  requestId: filing.requestId,
})
```

Run `node first-request.mjs`. It prints the current filing identity and request ID for Apple's latest matching 10-K. Those live values can change when a newer filing is available.

`SecApiClient` sends `SECAPI_API_KEY` as `x-api-key` to `https://api.secapi.ai`. It wraps public REST endpoints; use the [hosted MCP server](https://docs.secapi.ai/mcp-install) separately when your client supports MCP. Keep API keys in server-side configuration and do not use a machine key as an `Authorization: Bearer` token.

## Compatibility and support

Node.js 18 or newer is required. `streamFilings()` needs a global `WebSocket` (Node.js 21+, Bun, Deno, or browsers); Node.js 18 callers need a polyfill or newer runtime. See the [JavaScript SDK guide](https://docs.secapi.ai/javascript-sdk) and [API reference](https://docs.secapi.ai/api-reference), review [pricing](https://secapi.ai/pricing), check [status](https://status.secapi.ai), or [open an SDK issue](https://github.com/secapi-ai/secapi-js/issues).

## Common requests

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

Use `latestFiling()` for the default endpoint response and `agentLatestFiling()` for the endpoint-supported `agent` view. Preserve returned filing identifiers and request IDs with derived output.

## Configuration, errors, and pagination

Pass values directly when environment variables are not appropriate:

```js
const client = new SecApiClient({
  apiKey: process.env.SECAPI_API_KEY,
  baseUrl: "https://api.secapi.ai",
})
```

`SECAPI_BASE_URL` and `SECAPI_API_BASE_URL` can override the default origin. API failures throw `SecApiError`, including `status`, `code`, and `requestId` when supplied. Cursor-backed endpoints can be consumed as async iterators; see the [SDK reliability guide](https://docs.secapi.ai/sdk-reliability) for retry and streaming behavior.

## License

MIT
