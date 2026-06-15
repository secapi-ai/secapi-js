import { SecApiClient } from "../src/index.js"

const client = new SecApiClient({
  apiKey: process.env.SECAPI_API_KEY,
  baseUrl: process.env.SECAPI_BASE_URL ?? process.env.SECAPI_API_BASE_URL ?? "https://api.secapi.ai",
})

const [entity, filings, latest, sectionCompact, sectionFull, statements, offerings, marketCalendar, marketIndices, indexConstituents, volatilitySignal] = await Promise.all([
  client.resolveEntity({ ticker: "AAPL" }),
  client.searchFilings({ ticker: "AAPL", form: "10-K", limit: 3 }),
  client.latestFiling({ ticker: "AAPL", form: "10-K" }),
  client.latestSection({ ticker: "AAPL", form: "10-K", sectionKey: "item_1a", mode: "compact" }),
  client.latestSection({ ticker: "AAPL", form: "10-K", sectionKey: "item_1a", mode: "full" }),
  client.allStatements({ ticker: "AAPL", period: "annual", limit: 3 }),
  client.offerings({ ticker: "AAPL", forms: "S-1,424B4", limit: 3 }),
  client.marketCalendar({ market: "XNYS", duration: 3 }),
  client.marketIndices(),
  client.indexConstituents({ index: "NDX", limit: 5 }),
  client.volatilitySignal({ ticker: "AAPL" }),
])

console.log(JSON.stringify({
  metadataChecklist: {
    requestId: "Inspect requestId and traceparent on every response body in app logs.",
    provenance: "Persist provenance.accessionNumber and provenance.filingUrl with downstream outputs.",
    freshness: "Reject stale or degraded reads before triggering automated workflows.",
    materialization: "Track parserVersion and materializationVersion during backtests.",
  },
  entity,
  filings,
  latest,
  sectionCompact,
  sectionFull,
  statements,
  offerings,
  marketCalendar,
  marketIndices,
  indexConstituents,
  volatilitySignal,
}, null, 2))
