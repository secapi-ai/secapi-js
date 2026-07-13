# SEC API JavaScript SDK

Use `@secapi/sdk-js` to retrieve SEC API filing data from a JavaScript or TypeScript server application.

[Documentation](https://docs.secapi.ai) | [API reference](https://docs.secapi.ai/api-reference) | [Pricing](https://secapi.ai/pricing) | [Status](https://status.secapi.ai/)

## Install

```bash
npm install @secapi/sdk-js
```

## First cited filing

Create an API key, keep it in your server environment, and export it. The client reads `SECAPI_API_KEY` and sends it as the `x-api-key` request header.

```bash
export SECAPI_API_KEY="secapi_live_..."
```

Save this as `index.mjs`, then run `node index.mjs`:

```js
import { SecApiClient } from "@secapi/sdk-js"

const sec = new SecApiClient()
const filing = await sec.filings.latest({ ticker: "AAPL", form: "10-K" })

console.log({
  ticker: filing.ticker,
  form: filing.form,
  accessionNumber: filing.accessionNumber,
  filingDate: filing.filingDate,
  source: filing.provenance.source,
  filingUrl: filing.provenance.filingUrl,
})
```

The response includes the filing's accession number, filing date, and `provenance` record. Preserve `accessionNumber` and `provenance.filingUrl` with any result that cites the filing.

## Compatibility and support

This ESM package supports Node.js 18 or later. Keep API keys out of browser bundles; call the SDK from your server or a server-side proxy.

For endpoint parameters and response fields, use the [API reference](https://docs.secapi.ai/api-reference). For help, visit [Support](https://secapi.ai/support) or [open an SDK issue](https://github.com/secapi-ai/secapi-js/issues).

## License

MIT
