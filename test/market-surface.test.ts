import { describe, expect, test } from "bun:test"
import { MARKET_QUERY_PARAMS, SecApiClient } from "../src/index.js"
import { openApiDocument } from "../src/generated-contracts/openapi.js"

/**
 * Regression guard for the public `/v1/market/*` plane.
 *
 * Commit f84021b07d removed these public methods alongside the genuinely
 * internal ones, and the restore initially came back with signatures narrower
 * than the routes: `symbols` required on snapshots, `symbol` plus BOTH date
 * bounds required on bars and corporate-actions, `adjusted` missing, and a
 * spurious `interval`. Every one of those made a documented, API-accepted
 * request fail to compile.
 *
 * These tests pin the SDK's accepted parameters to the generated contract in
 * both directions, so neither a regeneration nor a hand edit can silently
 * re-narrow the surface again.
 */

function jsonResponse(body: unknown = { ok: true }) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" },
  })
}

function recordingClient() {
  const calls: URL[] = []
  const client = new SecApiClient({
    apiKey: "test_key",
    telemetry: false,
    retry: false,
    fetch: async (input) => {
      calls.push(new URL(String(input)))
      return jsonResponse()
    },
  })
  return { client, calls }
}

type QueryParameter = { name: string; in: string; required?: boolean }

function contractQueryParams(path: string): { names: string[]; required: string[] } {
  const paths = (openApiDocument as { paths: Record<string, unknown> }).paths
  const entry = paths[path] as { get?: { parameters?: QueryParameter[] } } | undefined
  if (!entry?.get) throw new Error(`${path} is missing from the generated public OpenAPI document`)
  const query = (entry.get.parameters ?? []).filter((parameter) => parameter.in === "query")
  return {
    names: query.map((parameter) => parameter.name),
    required: query.filter((parameter) => parameter.required === true).map((parameter) => parameter.name),
  }
}

const MARKET_PATHS = Object.keys(MARKET_QUERY_PARAMS) as (keyof typeof MARKET_QUERY_PARAMS)[]

describe("public /v1/market/* SDK surface", () => {
  test("every public market route is still present in the generated contract", () => {
    for (const path of MARKET_PATHS) {
      expect(() => contractQueryParams(path)).not.toThrow()
    }
  })

  test.each(MARKET_PATHS)("%s accepts exactly the contract's query parameters", (path) => {
    const contract = contractQueryParams(path)
    const declared = [...MARKET_QUERY_PARAMS[path]] as string[]

    // Neither narrower nor wider than the route. A missing name means TypeScript
    // consumers cannot express a documented request; an extra name means the SDK
    // advertises a parameter the route ignores (this is what caught `interval`).
    expect(declared.slice().sort()).toEqual(contract.names.slice().sort())
  })

  test.each(MARKET_PATHS)("%s marks no parameter as required, matching the route", (path) => {
    // services/datastream-api/src/routes/market.ts resolves `ticker ?? symbol`
    // and defaults omitted date bounds, so nothing on this plane is required.
    // If the contract ever does mark one required, this test must be revisited
    // deliberately rather than the SDK type being tightened by accident.
    expect(contractQueryParams(path).required).toEqual([])
  })

  test("documented single-ticker calls reach the right route with their params intact", async () => {
    const { client, calls } = recordingClient()

    await client.marketSnapshots({ ticker: "AAPL" })
    await client.marketBars({ ticker: "AAPL", adjusted: true })
    await client.marketCorporateActions({ ticker: "AAPL" })
    await client.marketReference({ ticker: "AAPL" })
    await client.marketCalendar({ market: "stocks" })

    expect(calls.map((url) => url.pathname)).toEqual([
      "/v1/market/snapshots",
      "/v1/market/bars",
      "/v1/market/corporate-actions",
      "/v1/market/reference",
      "/v1/market/calendar",
    ])
    expect(calls[0].searchParams.get("ticker")).toBe("AAPL")
    expect(calls[1].searchParams.get("adjusted")).toBe("true")
    expect(calls[1].searchParams.get("date_from")).toBeNull()
    expect(calls[1].searchParams.get("date_to")).toBeNull()
    expect(calls[2].searchParams.get("ticker")).toBe("AAPL")
    expect(calls[2].searchParams.get("date_from")).toBeNull()
  })

  test("the `symbols` and `symbol` spellings still work alongside `ticker`", async () => {
    const { client, calls } = recordingClient()

    await client.marketSnapshots({ symbols: ["AAPL", "MSFT"] })
    await client.marketBars({ symbol: "AAPL", date_from: "2026-01-01", date_to: "2026-02-01", limit: 10 })

    expect(calls[0].pathname).toBe("/v1/market/snapshots")
    expect(calls[0].searchParams.getAll("symbols").join(",")).toContain("AAPL")
    expect(calls[1].searchParams.get("symbol")).toBe("AAPL")
    expect(calls[1].searchParams.get("date_from")).toBe("2026-01-01")
    expect(calls[1].searchParams.get("limit")).toBe("10")
  })
})
