import { describe, expect, test } from "bun:test"
import { SecApiClient, SecApiError, type FundLetterDocumentRedirect } from "../src/index.js"

function jsonResponse(body: unknown = { ok: true }) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" },
  })
}

function recordingClient(handler?: (url: URL, init?: RequestInit) => Response | Promise<Response>) {
  const calls: Array<{ url: URL; init?: RequestInit }> = []
  const client = new SecApiClient({
    apiKey: "test_key",
    telemetry: false,
    retry: false,
    fetch: async (input, init) => {
      const url = new URL(String(input))
      calls.push({ url, init })
      return handler ? handler(url, init) : jsonResponse()
    },
  })
  return { client, calls }
}

describe("fund letters SDK methods", () => {
  test("grouped fundLetters alias covers every endpoint on the frozen surface", async () => {
    const { client, calls } = recordingClient((url) => {
      if (url.searchParams.get("format") === "pdf") {
        return new Response(null, {
          status: 302,
          headers: { location: "https://r2.example.com/fund-letters/abc.pdf" },
        })
      }
      return jsonResponse()
    })

    await client.fundLetters.list({ ticker: "AAPL" })
    await client.fundLetters.search({ q: "moat" })
    await client.fundLetters.semantic({ q: "pricing power", top_k: 10 })
    await client.fundLetters.get("ltr_abc123")
    await client.fundLetters.document("ltr_abc123")
    await client.fundLetters.document("ltr_abc123", { format: "pdf" })
    await client.fundLetters.theses({ ticker: "AAPL" })
    await client.fundLetters.managers({ q: "greenhaven" })
    await client.fundLetters.managerGet("mgr_abc123")
    await client.fundLetters.funds({ manager_id: "mgr_abc123" })
    await client.fundLetters.fundGet("fnd_abc123")
    await client.fundLetters.companies({ min_theses: 2 })
    await client.fundLetters.changes({ since: "2026-07-01T00:00:00Z" })

    expect(calls.map((call) => call.url.pathname)).toEqual([
      "/v1/fund-letters",
      "/v1/fund-letters/search",
      "/v1/fund-letters/semantic",
      "/v1/fund-letters/ltr_abc123",
      "/v1/fund-letters/ltr_abc123/document",
      "/v1/fund-letters/ltr_abc123/document",
      "/v1/fund-letters/theses",
      "/v1/fund-letters/managers",
      "/v1/fund-letters/managers/mgr_abc123",
      "/v1/fund-letters/funds",
      "/v1/fund-letters/funds/fnd_abc123",
      "/v1/fund-letters/companies",
      "/v1/fund-letters/changes",
    ])
  })

  test("listFundLetters serializes every documented filter", async () => {
    const { client, calls } = recordingClient()
    await client.listFundLetters({
      manager_id: "mgr_1",
      fund_id: "fnd_1",
      ticker: "AAPL",
      cik: "0000320193",
      letter_type: "hedge_fund_letter",
      source: "fund_website",
      distribution: "fund_published",
      period: "2025Q1",
      year: 2025,
      quarter: 1,
      published_from: "2025-01-01",
      published_to: "2025-06-30",
      since: "2025-05-01T00:00:00Z",
      sort: "published_at_desc",
      cursor: "10",
      limit: 25,
      view: "agent",
    })

    const params = Object.fromEntries(calls[0]!.url.searchParams.entries())
    expect(params).toEqual({
      manager_id: "mgr_1",
      fund_id: "fnd_1",
      ticker: "AAPL",
      cik: "0000320193",
      letter_type: "hedge_fund_letter",
      source: "fund_website",
      distribution: "fund_published",
      period: "2025Q1",
      year: "2025",
      quarter: "1",
      published_from: "2025-01-01",
      published_to: "2025-06-30",
      since: "2025-05-01T00:00:00Z",
      sort: "published_at_desc",
      cursor: "10",
      limit: "25",
      view: "agent",
    })
  })

  test("searchFundLetters forwards q plus list filters", async () => {
    const { client, calls } = recordingClient()
    await client.searchFundLetters({ q: "variant perception", ticker: "NVDA", period: "2025Q2", limit: 5 })
    const params = Object.fromEntries(calls[0]!.url.searchParams.entries())
    expect(params).toEqual({ q: "variant perception", ticker: "NVDA", period: "2025Q2", limit: "5" })
  })

  test("semanticSearchFundLetters forwards top_k and period bounds", async () => {
    const { client, calls } = recordingClient()
    await client.semanticSearchFundLetters({
      q: "durable pricing power",
      top_k: 20,
      manager_id: "mgr_1",
      ticker: "AAPL",
      period_from: "2025Q1",
      period_to: "2026Q1",
    })
    const params = Object.fromEntries(calls[0]!.url.searchParams.entries())
    expect(params).toEqual({
      q: "durable pricing power",
      top_k: "20",
      manager_id: "mgr_1",
      ticker: "AAPL",
      period_from: "2025Q1",
      period_to: "2026Q1",
    })
  })

  test("listFundLetterTheses joins relationship arrays into a comma list", async () => {
    const { client, calls } = recordingClient()
    await client.listFundLetterTheses({
      ticker: "AAPL",
      relationship: ["long", "added"],
      stance: "bullish",
      conviction: "high",
      period_from: "2025Q1",
      period_to: "2026Q2",
      since: "2026-01-01T00:00:00Z",
      limit: 50,
    })
    const params = Object.fromEntries(calls[0]!.url.searchParams.entries())
    expect(params.relationship).toBe("long,added")
    expect(params.stance).toBe("bullish")
    expect(params.conviction).toBe("high")
    expect(params.period_from).toBe("2025Q1")
    expect(params.period_to).toBe("2026Q2")
  })

  test("listFundLetterManagers serializes has_13f and min_letters", async () => {
    const { client, calls } = recordingClient()
    await client.listFundLetterManagers({ q: "value", strategy: "long_short", has_13f: true, min_letters: 4, sort: "letters_desc" })
    const params = Object.fromEntries(calls[0]!.url.searchParams.entries())
    expect(params).toEqual({ q: "value", strategy: "long_short", has_13f: "true", min_letters: "4", sort: "letters_desc" })
  })

  test("listFundLetterChanges joins change types into a comma list", async () => {
    const { client, calls } = recordingClient()
    await client.listFundLetterChanges({
      since: "2026-07-01T00:00:00Z",
      types: ["letter.published", "thesis.extracted"],
      ticker: "AAPL",
      manager_id: "mgr_1",
      limit: 100,
    })
    const params = Object.fromEntries(calls[0]!.url.searchParams.entries())
    expect(params.types).toBe("letter.published,thesis.extracted")
    expect(params.since).toBe("2026-07-01T00:00:00Z")
  })

  test("id path segments are URL-encoded", async () => {
    const { client, calls } = recordingClient()
    await client.getFundLetter("ltr_a/b c")
    expect(calls[0]!.url.pathname).toBe("/v1/fund-letters/ltr_a%2Fb%20c")
  })

  test("document defaults to the markdown pages JSON and forwards sha", async () => {
    const pagesDoc = {
      object: "fund_letter_document",
      pages: [{ page: 1, markdown: "Dear partners," }],
      sourceSha256: "ab".repeat(32),
      paginationVersion: 1,
      pageCount: 1,
    }
    const { client, calls } = recordingClient(() => jsonResponse(pagesDoc))
    const doc = await client.getFundLetterDocument("ltr_abc123", { sha: "cd".repeat(32) })
    expect(doc).toEqual(pagesDoc)
    expect(calls[0]!.url.searchParams.get("format")).toBe("markdown")
    expect(calls[0]!.url.searchParams.get("sha")).toBe("cd".repeat(32))
    // Markdown requests flow through the normal JSON pipeline (no manual redirect).
    expect(calls[0]!.init?.redirect).toBeUndefined()
  })

  test("document format=pdf surfaces the 302 redirect URL without following it", async () => {
    const { client, calls } = recordingClient(() =>
      new Response(null, {
        status: 302,
        headers: { location: "https://r2.example.com/fund-letters/pdf/ab/abcd.pdf?signature=sig" },
      }))
    const redirect = await client.getFundLetterDocument("ltr_abc123", { format: "pdf" }) as FundLetterDocumentRedirect
    expect(redirect).toEqual({
      object: "fund_letter_document_redirect",
      letterId: "ltr_abc123",
      format: "pdf",
      url: "https://r2.example.com/fund-letters/pdf/ab/abcd.pdf?signature=sig",
      status: 302,
    })
    expect(calls[0]!.init?.redirect).toBe("manual")
    expect(calls[0]!.url.searchParams.get("format")).toBe("pdf")
    expect(calls).toHaveLength(1)
  })

  test("document format=pdf forwards sha for superseded variants", async () => {
    const { client, calls } = recordingClient(() =>
      new Response(null, { status: 302, headers: { location: "https://r2.example.com/x.pdf" } }))
    await client.getFundLetterDocument("ltr_abc123", { format: "pdf", sha: "ef".repeat(32) })
    expect(calls[0]!.url.searchParams.get("sha")).toBe("ef".repeat(32))
  })

  test("document format=pdf raises document_not_distributable for third_party letters", async () => {
    const { client } = recordingClient(() =>
      new Response(JSON.stringify({
        object: "error",
        code: "document_not_distributable",
        message: "This letter's document is not distributable",
        hint: "Use the sourceUrl link-out",
      }), { status: 403, headers: { "content-type": "application/json" } }))

    expect(client.getFundLetterDocument("ltr_abc123", { format: "pdf" }))
      .rejects.toMatchObject({
        name: "SecApiError",
        status: 403,
        code: "document_not_distributable",
        hint: "Use the sourceUrl link-out",
      })
  })

  test("document format=pdf tolerates a JSON body carrying the target URL", async () => {
    const { client } = recordingClient(() => jsonResponse({ object: "fund_letter_document_link", url: "https://r2.example.com/direct.pdf" }))
    const redirect = await client.getFundLetterDocument("ltr_abc123", { format: "pdf" }) as FundLetterDocumentRedirect
    expect(redirect.url).toBe("https://r2.example.com/direct.pdf")
    expect(redirect.status).toBe(200)
  })

  test("document format=pdf rejects a non-redirect response without a URL", async () => {
    const { client } = recordingClient(() => jsonResponse({ ok: true }))
    expect(client.getFundLetterDocument("ltr_abc123", { format: "pdf" }))
      .rejects.toMatchObject({ code: "client_document_redirect_expected" })
  })

  test("document format=pdf rejects a redirect missing the Location header", async () => {
    const { client } = recordingClient(() => new Response(null, { status: 302 }))
    expect(client.getFundLetterDocument("ltr_abc123", { format: "pdf" }))
      .rejects.toMatchObject({ code: "client_document_redirect_missing_location" })
  })

  test("paginateFundLetters walks cursors and stops on hasMore=false", async () => {
    const pages = [
      { object: "list", data: [{ id: "ltr_1" }, { id: "ltr_2" }], hasMore: true, nextCursor: "2" },
      { object: "list", data: [{ id: "ltr_3" }], hasMore: false, nextCursor: null },
    ]
    let call = 0
    const { client, calls } = recordingClient(() => jsonResponse(pages[call++]))

    const ids: string[] = []
    for await (const letter of client.paginateFundLetters({ ticker: "AAPL" })) {
      ids.push((letter as { id: string }).id)
    }
    expect(ids).toEqual(["ltr_1", "ltr_2", "ltr_3"])
    expect(calls).toHaveLength(2)
    expect(calls[1]!.url.searchParams.get("cursor")).toBe("2")
  })

  test("paginateFundLetterTheses honors maxItems", async () => {
    const page = {
      object: "list",
      data: [{ id: "ths_1" }, { id: "ths_2" }, { id: "ths_3" }],
      hasMore: true,
      nextCursor: "3",
    }
    const { client, calls } = recordingClient(() => jsonResponse(page))
    const ids: string[] = []
    for await (const thesis of client.paginateFundLetterTheses({ ticker: "AAPL" }, { maxItems: 2 })) {
      ids.push((thesis as { id: string }).id)
    }
    expect(ids).toEqual(["ths_1", "ths_2"])
    expect(calls).toHaveLength(1)
  })

  test("flag-off dormancy surfaces the server 404 as a SecApiError", async () => {
    const { client } = recordingClient(() =>
      new Response(JSON.stringify({ object: "error", code: "not_found", message: "Not found" }), {
        status: 404,
        headers: { "content-type": "application/json" },
      }))
    expect(client.listFundLetters()).rejects.toBeInstanceOf(SecApiError)
  })
})
