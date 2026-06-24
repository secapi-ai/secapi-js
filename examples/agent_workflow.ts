import { SecApiClient } from "../src/index.js"

const client = new SecApiClient()

const entity = await client.resolveEntity({ ticker: "AAPL" }) as Record<string, any>
const filing = await client.latestFiling({ ticker: "AAPL", form: "10-K" }) as Record<string, any>
const accessionNumber = filing.accessionNumber ?? filing.accession_number
if (!accessionNumber) {
  throw new Error("latest filing response did not include an accession number")
}
const section = await client.filingSectionByAccession(accessionNumber, {
  ticker: "AAPL",
  sectionKey: "item_1a",
  mode: "compact",
}) as Record<string, any>

console.log(JSON.stringify({
  object: "secapi_sdk_agent_workflow",
  sdk: "javascript",
  workflow: {
    ticker: "AAPL",
    form: "10-K",
    sectionKey: "item_1a",
    mode: "compact",
  },
  entity: {
    name: entity.name,
    ticker: entity.ticker,
    cik: entity.cik,
  },
  filing: {
    id: filing.id,
    accessionNumber,
    form: filing.form,
    filingDate: filing.filingDate,
  },
  section: {
    title: section.title,
    key: section.key ?? section.section_key,
    mode: "compact",
    accessionNumber: section.accessionNumber ?? section.accession_number ?? accessionNumber,
    contentLength: section.contentMd?.length ?? section.snippet?.length ?? 0,
  },
}, null, 2))
