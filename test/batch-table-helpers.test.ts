import { describe, expect, test } from "bun:test"
import { SecApiClient, decodeTable } from "../src/index.js"

function jsonResponse(body: unknown = { ok: true }) {
  return new Response(JSON.stringify(body), { status: 200, headers: { "content-type": "application/json" } })
}

function captureUrlClient() {
  const urls: string[] = []
  const client = new SecApiClient({
    apiKey: "secapi_test_key",
    baseUrl: "https://api.secapi.test/",
    telemetry: false,
    fetch: async (url) => {
      urls.push(String(url))
      return jsonResponse({ object: "list", data: [] })
    },
  })
  return { client, urls }
}

describe("company batch helpers serialize tickers as a comma-separated list", () => {
  test("companyOverview batch", async () => {
    const { client, urls } = captureUrlClient()
    await client.companyOverview({ tickers: ["AAPL", "MSFT", "NVDA"] })
    expect(urls[0]).toContain("/v1/companies/overview")
    expect(urls[0]).toContain("tickers=AAPL%2CMSFT%2CNVDA")
  })

  test("companyFinancials + companyRatios batch", async () => {
    const { client, urls } = captureUrlClient()
    await client.companyFinancials({ tickers: ["AAPL", "MSFT"], period: "annual" })
    await client.companyRatios({ tickers: ["AAPL", "MSFT"] })
    expect(urls[0]).toContain("/v1/companies/financials")
    expect(urls[0]).toContain("tickers=AAPL%2CMSFT")
    expect(urls[1]).toContain("/v1/companies/ratios")
    expect(urls[1]).toContain("tickers=AAPL%2CMSFT")
  })

  test("single-entity calls still work (no tickers)", async () => {
    const { client, urls } = captureUrlClient()
    await client.companyOverview({ ticker: "AAPL" })
    expect(urls[0]).toContain("ticker=AAPL")
    expect(urls[0]).not.toContain("tickers=")
  })
})

describe("decodeTable", () => {
  test("restores row objects from a columnar table envelope", () => {
    const table = { object: "table" as const, format: "toon", columns: ["ticker", "revenue"], rows: [["AAPL", 391], ["MSFT", 245]] }
    expect(decodeTable(table)).toEqual([
      { ticker: "AAPL", revenue: 391 },
      { ticker: "MSFT", revenue: 245 },
    ])
  })

  test("fills missing trailing cells with undefined", () => {
    const table = { object: "table" as const, columns: ["a", "b", "c"], rows: [["x", "y"]] }
    expect(decodeTable(table)).toEqual([{ a: "x", b: "y", c: undefined }])
  })

  test("throws on a non-table payload", () => {
    expect(() => decodeTable({ object: "list", data: [] })).toThrow(/table envelope/)
    expect(() => decodeTable(null)).toThrow(/table envelope/)
  })
})
