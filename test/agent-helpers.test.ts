import { describe, expect, test } from "bun:test"
import {
  OmniDatastreamClient,
  OmniDatastreamError,
  OmniDatastreamValidationError,
  SecApiClient,
  SecApiError,
  SecApiValidationError,
  type OmniDatastreamClientOptions,
} from "../src/index.js"

function jsonResponse(body: unknown = { ok: true }) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" },
  })
}

describe("SecApiClient agent helpers", () => {
  test("preserves legacy OmniDatastream aliases for published packages", () => {
    const options: OmniDatastreamClientOptions = { telemetry: false }

    expect(OmniDatastreamClient).toBe(SecApiClient)
    expect(OmniDatastreamError).toBe(SecApiError)
    expect(OmniDatastreamValidationError).toBe(SecApiValidationError)
    expect(new OmniDatastreamClient(options)).toBeInstanceOf(SecApiClient)
  })

  test("agent helpers default to compact agent response shapes", async () => {
    const seenUrls: string[] = []
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url) => {
        seenUrls.push(String(url))
        return jsonResponse({ ok: true })
      },
    })

    await client.agentLatestFiling({ ticker: "AAPL", form: "10-K" })
    await client.agentStatement("income_statement", { ticker: "AAPL", period: "annual", limit: 2 })
    await client.agentInstitutionalHolders({ ticker: "NVDA", limit: 5 })
    await client.agentForm144({ ticker: "NVDA", limit: 5 })
    await client.agentSection({ ticker: "AAPL", form: "10-K", sectionKey: "item_1a", filing_year: 2025 })
    await client.semanticSearch({ q: "supply chain risk", ticker: "AAPL", form: "10-K", mode: "hybrid", limit: 5, view: "agent" })
    await client.marketEarningsCalendar({ ticker: "AAPL", date_from: "2026-06-08", date_to: "2026-06-15" })

    expect(seenUrls[0]).toBe("https://api.secapi.ai/v1/filings/latest?ticker=AAPL&form=10-K&view=agent")
    expect(seenUrls[1]).toBe("https://api.secapi.ai/v1/statements/income_statement?ticker=AAPL&period=annual&limit=2&view=agent")
    expect(seenUrls[2]).toBe("https://api.secapi.ai/v1/owners/institutional/ticker?ticker=NVDA&limit=5&view=agent")
    expect(seenUrls[3]).toBe("https://api.secapi.ai/v1/forms/144?ticker=NVDA&limit=5&view=agent")
    expect(seenUrls[4]).toBe("https://api.secapi.ai/v1/filings/latest/sections/item_1a?ticker=AAPL&form=10-K&filing_year=2025&mode=compact")
    expect(seenUrls[5]).toBe("https://api.secapi.ai/v1/search/semantic?q=supply+chain+risk&ticker=AAPL&form=10-K&mode=hybrid&limit=5&view=agent")
    expect(seenUrls[6]).toBe("https://api.secapi.ai/v1/market/earnings-calendar?ticker=AAPL&date_from=2026-06-08&date_to=2026-06-15")
  })

  test("search helpers reach both Typesense full-text and vector endpoints", async () => {
    const seenUrls: string[] = []
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url) => {
        seenUrls.push(String(url))
        return jsonResponse({ ok: true })
      },
    })

    await client.searchFulltext({ q: "going concern", form: "10-K", limit: 10 })
    await client.semanticSearch({ q: "going concern", mode: "keyword", filing_year: 2025, limit: 10 })

    expect(seenUrls[0]).toBe("https://api.secapi.ai/v1/search/fulltext?q=going+concern&form=10-K&limit=10")
    expect(seenUrls[1]).toBe("https://api.secapi.ai/v1/search/semantic?q=going+concern&mode=keyword&filing_year=2025&limit=10")
  })

  test("callMcpTool builds a JSON-RPC tools/call envelope", async () => {
    let body: unknown
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (_url, init) => {
        body = JSON.parse(String(init?.body))
        return jsonResponse({ result: { content: [] } })
      },
    })

    await client.callMcpTool("filings.latest", { ticker: "AAPL", form: "10-K" }, { id: "agent-test" })

    expect(body).toEqual({
      jsonrpc: "2.0",
      id: "agent-test",
      method: "tools/call",
      params: {
        name: "filings.latest",
        arguments: { ticker: "AAPL", form: "10-K" },
      },
    })
  })

  test("monitor helpers use the current flat SDK surface", async () => {
    const seen: Array<{ url: string; method?: string; body?: unknown }> = []
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url, init) => {
        seen.push({
          url: String(url),
          method: init?.method,
          body: init?.body ? JSON.parse(String(init.body)) : undefined,
        })
        return jsonResponse({ ok: true })
      },
    })

    await client.createWebhookEndpoint({
      destinationUrl: "https://example.com/webhooks/filings",
      subscribedEventTypes: ["monitor.match"],
      description: "Filing monitor webhook",
    })
    await client.createMonitor({
      name: "FAANG 8-K Monitor",
      query: "latest 8-K filings",
      filters: { forms: ["8-K", "8-K/A"], tickers: ["AAPL", "AMZN"] },
    })
    await client.monitorMatches("mon_123", { limit: 5 })

    expect(seen[0]).toEqual({
      url: "https://api.secapi.ai/v1/webhook_endpoints",
      method: "POST",
      body: {
        destinationUrl: "https://example.com/webhooks/filings",
        subscribedEventTypes: ["monitor.match"],
        description: "Filing monitor webhook",
      },
    })
    expect(seen[1]).toEqual({
      url: "https://api.secapi.ai/v1/monitors",
      method: "POST",
      body: {
        name: "FAANG 8-K Monitor",
        query: "latest 8-K filings",
        filters: { forms: ["8-K", "8-K/A"], tickers: ["AAPL", "AMZN"] },
      },
    })
    expect(seen[2]).toEqual({
      url: "https://api.secapi.ai/v1/monitors/mon_123/matches?limit=5",
      method: undefined,
      body: undefined,
    })
  })
})
