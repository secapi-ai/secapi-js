import { SecApiClient } from "../src/index.js"

const client = new SecApiClient()

type ApiObject = Record<string, unknown>

function asApiObject(value: unknown, label: string): ApiObject {
  if (value && typeof value === "object" && !Array.isArray(value)) return value as ApiObject
  throw new Error(`${label} response was not an object`)
}

function stringField(record: ApiObject, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key]
    if (typeof value === "string") return value
  }
  return undefined
}

const entity = asApiObject(await client.resolveEntity({ ticker: "AAPL" }), "entity")
const filing = asApiObject(await client.latestFiling({ ticker: "AAPL", form: "10-K" }), "latest filing")
const accessionNumber = stringField(filing, "accessionNumber", "accession_number")
if (!accessionNumber) {
  throw new Error("latest filing response did not include an accession number")
}
const section = asApiObject(await client.filingSectionByAccession(accessionNumber, {
  ticker: "AAPL",
  sectionKey: "item_1a",
  mode: "compact",
}), "filing section")

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
    name: stringField(entity, "name"),
    ticker: stringField(entity, "ticker"),
    cik: stringField(entity, "cik"),
  },
  filing: {
    id: stringField(filing, "id"),
    accessionNumber,
    form: stringField(filing, "form"),
    filingDate: stringField(filing, "filingDate", "filing_date"),
  },
  section: {
    title: stringField(section, "title"),
    key: stringField(section, "key", "section_key"),
    mode: "compact",
    accessionNumber: stringField(section, "accessionNumber", "accession_number") ?? accessionNumber,
    contentLength: stringField(section, "contentMd", "snippet")?.length ?? 0,
  },
}, null, 2))
