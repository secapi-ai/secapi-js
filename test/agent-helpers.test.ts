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
  test("loads auth and base URL from environment when constructor options are omitted", async () => {
    const previous = {
      apiKey: process.env.SECAPI_API_KEY,
      baseUrl: process.env.SECAPI_BASE_URL,
    }
    const seen: Array<{ url: string; apiKey: string | null }> = []
    try {
      process.env.SECAPI_API_KEY = "env_fallback_api_key"
      process.env.SECAPI_BASE_URL = "https://env.secapi.test/"

      const client = new SecApiClient({
        telemetry: false,
        fetch: async (url, init) => {
          seen.push({
            url: String(url),
            apiKey: new Headers(init?.headers).get("x-api-key"),
          })
          return jsonResponse({ ok: true })
        },
      })

      await client.latestFiling({ ticker: "AAPL", form: "10-K" })

      expect(seen).toEqual([
        {
          url: "https://env.secapi.test/v1/filings/latest?ticker=AAPL&form=10-K",
          apiKey: "env_fallback_api_key",
        },
      ])
    } finally {
      if (previous.apiKey === undefined) delete process.env.SECAPI_API_KEY
      else process.env.SECAPI_API_KEY = previous.apiKey
      if (previous.baseUrl === undefined) delete process.env.SECAPI_BASE_URL
      else process.env.SECAPI_BASE_URL = previous.baseUrl
    }
  })

  test("treats blank constructor auth and base URL values as missing", async () => {
    const previous = {
      apiKey: process.env.SECAPI_API_KEY,
      baseUrl: process.env.SECAPI_BASE_URL,
    }
    const seen: Array<{ url: string; apiKey: string | null }> = []
    try {
      process.env.SECAPI_API_KEY = "env_fallback_api_key"
      process.env.SECAPI_BASE_URL = "https://env.secapi.test/"

      const client = new SecApiClient({
        apiKey: " ",
        baseUrl: "",
        telemetry: false,
        fetch: async (url, init) => {
          seen.push({
            url: String(url),
            apiKey: new Headers(init?.headers).get("x-api-key"),
          })
          return jsonResponse({ ok: true })
        },
      })

      await client.latestFiling({ ticker: "AAPL", form: "10-K" })

      expect(seen).toEqual([
        {
          url: "https://env.secapi.test/v1/filings/latest?ticker=AAPL&form=10-K",
          apiKey: "env_fallback_api_key",
        },
      ])
    } finally {
      if (previous.apiKey === undefined) delete process.env.SECAPI_API_KEY
      else process.env.SECAPI_API_KEY = previous.apiKey
      if (previous.baseUrl === undefined) delete process.env.SECAPI_BASE_URL
      else process.env.SECAPI_BASE_URL = previous.baseUrl
    }
  })

  test("loads compatibility auth and base URL environment fallbacks", async () => {
    const previous = {
      apiKey: process.env.SECAPI_API_KEY,
      baseUrl: process.env.SECAPI_BASE_URL,
      omniApiKey: process.env.OMNI_DATASTREAM_API_KEY,
      omniBaseUrl: process.env.OMNI_DATASTREAM_BASE_URL,
      omniApiBaseUrl: process.env.OMNI_DATASTREAM_API_BASE_URL,
    }
    const seen: Array<{ url: string; apiKey: string | null }> = []
    try {
      delete process.env.SECAPI_API_KEY
      delete process.env.SECAPI_BASE_URL
      process.env.OMNI_DATASTREAM_API_KEY = "omni_fallback_api_key"
      delete process.env.OMNI_DATASTREAM_BASE_URL
      process.env.OMNI_DATASTREAM_API_BASE_URL = "https://omni-api.secapi.test/"

      const client = new SecApiClient({
        telemetry: false,
        fetch: async (url, init) => {
          seen.push({
            url: String(url),
            apiKey: new Headers(init?.headers).get("x-api-key"),
          })
          return jsonResponse({ ok: true })
        },
      })

      await client.latestFiling({ ticker: "AAPL", form: "10-K" })

      expect(seen).toEqual([
        {
          url: "https://omni-api.secapi.test/v1/filings/latest?ticker=AAPL&form=10-K",
          apiKey: "omni_fallback_api_key",
        },
      ])
    } finally {
      if (previous.apiKey === undefined) delete process.env.SECAPI_API_KEY
      else process.env.SECAPI_API_KEY = previous.apiKey
      if (previous.baseUrl === undefined) delete process.env.SECAPI_BASE_URL
      else process.env.SECAPI_BASE_URL = previous.baseUrl
      if (previous.omniApiKey === undefined) delete process.env.OMNI_DATASTREAM_API_KEY
      else process.env.OMNI_DATASTREAM_API_KEY = previous.omniApiKey
      if (previous.omniBaseUrl === undefined) delete process.env.OMNI_DATASTREAM_BASE_URL
      else process.env.OMNI_DATASTREAM_BASE_URL = previous.omniBaseUrl
      if (previous.omniApiBaseUrl === undefined) delete process.env.OMNI_DATASTREAM_API_BASE_URL
      else process.env.OMNI_DATASTREAM_API_BASE_URL = previous.omniApiBaseUrl
    }
  })

  test("loads compatibility bearer token environment fallback", async () => {
    const previous = {
      apiKey: process.env.SECAPI_API_KEY,
      bearerToken: process.env.SECAPI_BEARER_TOKEN,
      omniBearerToken: process.env.OMNI_DATASTREAM_BEARER_TOKEN,
    }
    let authorization: string | null = null
    try {
      delete process.env.SECAPI_API_KEY
      delete process.env.SECAPI_BEARER_TOKEN
      process.env.OMNI_DATASTREAM_BEARER_TOKEN = "bearer_OMNI_FALLBACK"

      const client = new SecApiClient({
        telemetry: false,
        fetch: async (_url, init) => {
          authorization = new Headers(init?.headers).get("authorization")
          return jsonResponse({ ok: true })
        },
      })

      await client.latestFiling({ ticker: "AAPL", form: "10-K" })

      expect(authorization).toBe("Bearer bearer_OMNI_FALLBACK")
    } finally {
      if (previous.apiKey === undefined) delete process.env.SECAPI_API_KEY
      else process.env.SECAPI_API_KEY = previous.apiKey
      if (previous.bearerToken === undefined) delete process.env.SECAPI_BEARER_TOKEN
      else process.env.SECAPI_BEARER_TOKEN = previous.bearerToken
      if (previous.omniBearerToken === undefined) delete process.env.OMNI_DATASTREAM_BEARER_TOKEN
      else process.env.OMNI_DATASTREAM_BEARER_TOKEN = previous.omniBearerToken
    }
  })

  test("explicit constructor auth and base URL override environment fallbacks", async () => {
    const previous = {
      apiKey: process.env.SECAPI_API_KEY,
      baseUrl: process.env.SECAPI_BASE_URL,
    }
    const seen: Array<{ url: string; apiKey: string | null }> = []
    try {
      process.env.SECAPI_API_KEY = "env_fallback_api_key"
      process.env.SECAPI_BASE_URL = "https://env.secapi.test"

      const client = new SecApiClient({
        apiKey: "explicit_api_key",
        baseUrl: "https://explicit.secapi.test",
        telemetry: false,
        fetch: async (url, init) => {
          seen.push({
            url: String(url),
            apiKey: new Headers(init?.headers).get("x-api-key"),
          })
          return jsonResponse({ ok: true })
        },
      })

      await client.latestFiling({ ticker: "AAPL", form: "10-K" })

      expect(seen).toEqual([
        {
          url: "https://explicit.secapi.test/v1/filings/latest?ticker=AAPL&form=10-K",
          apiKey: "explicit_api_key",
        },
      ])
    } finally {
      if (previous.apiKey === undefined) delete process.env.SECAPI_API_KEY
      else process.env.SECAPI_API_KEY = previous.apiKey
      if (previous.baseUrl === undefined) delete process.env.SECAPI_BASE_URL
      else process.env.SECAPI_BASE_URL = previous.baseUrl
    }
  })

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
    expect(seenUrls[4]).toBe("https://api.secapi.ai/v1/filings/latest/sections/item_1a?ticker=AAPL&form=10-K&filing_year=2025&view=agent")
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

    await client.searchSections({ q: "going concern", symbol: "AAPL", form: "10-K", limit: 5 })
    await client.searchFulltext({ q: "going concern", symbol: "AAPL", form: "10-K", filing_year: 2025, accession_number: "0000320193-25-000079", date_from: "2025-01-01", date_to: "2025-12-31", limit: 10 })
    await client.semanticSearch({ q: "going concern", symbol: "AAPL", mode: "keyword", filing_year: 2025, limit: 10 })

    expect(seenUrls[0]).toBe("https://api.secapi.ai/v1/sections/search?q=going+concern&symbol=AAPL&form=10-K&limit=5")
    expect(seenUrls[1]).toBe("https://api.secapi.ai/v1/search/fulltext?q=going+concern&symbol=AAPL&form=10-K&filing_year=2025&accession_number=0000320193-25-000079&date_from=2025-01-01&date_to=2025-12-31&limit=10")
    expect(seenUrls[2]).toBe("https://api.secapi.ai/v1/search/semantic?q=going+concern&symbol=AAPL&mode=keyword&filing_year=2025&limit=10")
  })

  test("resolveEntity forwards agent view for compact entity resolution", async () => {
    const seenUrls: string[] = []
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url) => {
        seenUrls.push(String(url))
        return jsonResponse({ ok: true })
      },
    })

    await client.resolveEntity({ ticker: "AAPL", view: "agent" })

    expect(seenUrls[0]).toBe("https://api.secapi.ai/v1/entities/resolve?ticker=AAPL&view=agent")
  })

  test("resolveEntity forwards intuitive resolver aliases", async () => {
    const seenUrls: string[] = []
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url) => {
        seenUrls.push(String(url))
        return jsonResponse({ ok: true })
      },
    })

    await client.resolveEntity({ symbol: "AAPL", view: "agent" })
    await client.resolveEntity({ query: "Acme Corp", view: "agent" })
    await client.resolveEntity({ q: "Tesla", view: "agent" })

    expect(seenUrls).toEqual([
      "https://api.secapi.ai/v1/entities/resolve?symbol=AAPL&view=agent",
      "https://api.secapi.ai/v1/entities/resolve?query=Acme+Corp&view=agent",
      "https://api.secapi.ai/v1/entities/resolve?q=Tesla&view=agent",
    ])
  })

  test("facts helper forwards agent view and enrichment query controls", async () => {
    const seenUrls: string[] = []
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url) => {
        seenUrls.push(String(url))
        return jsonResponse({ ok: true })
      },
    })

    await client.facts({
      ticker: "AAPL",
      tag: "Revenues",
      period: "quarter",
      include: "geographic_segments",
      segment_limit: 3,
      submission_file_limit: 4,
      view: "agent",
    })

    expect(seenUrls[0]).toBe("https://api.secapi.ai/v1/facts?ticker=AAPL&tag=Revenues&period=quarter&include=geographic_segments&segment_limit=3&submission_file_limit=4&view=agent")
  })

  test("facts helper allows common-metric lookups without a tag", async () => {
    const seenUrls: string[] = []
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url) => {
        seenUrls.push(String(url))
        return jsonResponse({ ok: true })
      },
    })

    await client.facts({ ticker: "AAPL", period: "annual" })

    expect(seenUrls[0]).toBe("https://api.secapi.ai/v1/facts?ticker=AAPL&period=annual")
  })

  test("statement-family helpers forward symbol aliases", async () => {
    const seenUrls: string[] = []
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url) => {
        seenUrls.push(String(url))
        return jsonResponse({ ok: true })
      },
    })

    await client.facts({ symbol: "AAPL", period: "annual" })
    await client.statements({ symbol: "MSFT", statement: "income_statement" })
    await client.allStatements({ symbol: "NVDA", period: "quarterly" })
    await client.statementByKey("cash_flow_statement", { symbol: "AMZN", period: "annual" })
    await client.segmentedFacts({ symbol: "JPM", metric: "revenue" })
    await client.segmentedRevenues({ symbol: "PFE" })
    await client.shareFloat({ symbol: "MSFT" })

    expect(seenUrls).toEqual([
      "https://api.secapi.ai/v1/facts?symbol=AAPL&period=annual",
      "https://api.secapi.ai/v1/statements?symbol=MSFT&statement=income_statement",
      "https://api.secapi.ai/v1/statements/all?symbol=NVDA&period=quarterly",
      "https://api.secapi.ai/v1/statements/cash_flow_statement?symbol=AMZN&period=annual",
      "https://api.secapi.ai/v1/statements/segmented-facts?symbol=JPM&metric=revenue",
      "https://api.secapi.ai/v1/statements/segmented-revenues?symbol=PFE",
      "https://api.secapi.ai/v1/statements/share-float?symbol=MSFT",
    ])
  })

  test("segmented statement helpers forward period aliases and submission budget", async () => {
    const seenUrls: string[] = []
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url) => {
        seenUrls.push(String(url))
        return jsonResponse({ ok: true })
      },
    })

    await client.segmentedFacts({
      ticker: "JPM",
      metric: "profit_loss",
      period: "q",
      segment_type: "product",
      segmentLimit: 4,
      submissionFileLimit: 5,
    })
    await client.segmentedRevenues({
      ticker: "PFE",
      period: "quarter",
      segment_type: "geographic",
      segment_limit: 3,
      submission_file_limit: 4,
    })

    expect(seenUrls[0]).toBe("https://api.secapi.ai/v1/statements/segmented-facts?ticker=JPM&metric=profit_loss&period=q&segment_type=product&segmentLimit=4&submissionFileLimit=5")
    expect(seenUrls[1]).toBe("https://api.secapi.ai/v1/statements/segmented-revenues?ticker=PFE&period=quarter&segment_type=geographic&segment_limit=3&submission_file_limit=4")
  })

  test("grouped namespaces delegate to flat SDK methods", async () => {
    const seenUrls: string[] = []
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url) => {
        seenUrls.push(String(url))
        return jsonResponse({ ok: true })
      },
    })

    await client.entities.resolve({ ticker: "AAPL", view: "agent" })
    await client.filings.latest({ ticker: "AAPL", form: "10-K" })
    await client.sections.latest({ ticker: "AAPL", form: "10-K", sectionKey: "item/1a", mode: "compact" })
    await client.search.semantic({ q: "risk factors", ticker: "AAPL", mode: "hybrid", view: "agent" })
    await client.factors.catalog({ category: "style", limit: 25, response_mode: "compact", include: "trust" })
    await client.factors.history("VALUE", { range: "1y", response_mode: "compact", include: "trust,series" })
    await client.factors.dashboard({ country: "US", category: "style", ticker: "AAPL", response_mode: "compact" })

    expect(seenUrls).toEqual([
      "https://api.secapi.ai/v1/entities/resolve?ticker=AAPL&view=agent",
      "https://api.secapi.ai/v1/filings/latest?ticker=AAPL&form=10-K",
      "https://api.secapi.ai/v1/filings/latest/sections/item%2F1a?ticker=AAPL&form=10-K&mode=compact",
      "https://api.secapi.ai/v1/search/semantic?q=risk+factors&ticker=AAPL&mode=hybrid&view=agent",
      "https://api.secapi.ai/v1/factors/catalog?category=style&limit=25&response_mode=compact&include=trust",
      "https://api.secapi.ai/v1/factors/history/VALUE?range=1y&response_mode=compact&include=trust%2Cseries",
      "https://api.secapi.ai/v1/factors/dashboard?country=US&category=style&ticker=AAPL&response_mode=compact",
    ])
  })

  test("paginateFilings follows nextCursor and yields items across pages", async () => {
    const seenUrls: string[] = []
    const responses = [
      {
        object: "list",
        data: [{ accessionNumber: "0001" }, { accessionNumber: "0002" }],
        nextCursor: "cur_2",
      },
      {
        object: "list",
        data: [{ accessionNumber: "0003" }],
        nextCursor: null,
      },
    ]
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url) => {
        seenUrls.push(String(url))
        return jsonResponse(responses.shift() ?? { object: "list", data: [] })
      },
    })

    const accessions: string[] = []
    for await (const filing of client.paginateFilings({ ticker: "AAPL", form: "10-K", limit: 2 })) {
      accessions.push(filing.accessionNumber)
    }

    expect(accessions).toEqual(["0001", "0002", "0003"])
    expect(seenUrls).toEqual([
      "https://api.secapi.ai/v1/filings?ticker=AAPL&form=10-K&limit=2",
      "https://api.secapi.ai/v1/filings?ticker=AAPL&form=10-K&limit=2&cursor=cur_2",
    ])
  })

  test("paginateFilings stops when hasMore is false even if a cursor is present", async () => {
    const seenUrls: string[] = []
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url) => {
        seenUrls.push(String(url))
        return jsonResponse({
          object: "list",
          data: [{ accessionNumber: "0001" }],
          hasMore: false,
          nextCursor: "stale_cursor",
        })
      },
    })

    const accessions: string[] = []
    for await (const filing of client.paginateFilings({ ticker: "AAPL", form: "10-K", limit: 2 })) {
      accessions.push(filing.accessionNumber)
    }

    expect(accessions).toEqual(["0001"])
    expect(seenUrls).toEqual([
      "https://api.secapi.ai/v1/filings?ticker=AAPL&form=10-K&limit=2",
    ])
  })

  test("generic paginate raises structured error when a cursor repeats", async () => {
    const client = new SecApiClient({ apiKey: "secapi_test_key", telemetry: false, retry: false })
    const iterator = client.paginate(
      async (params: { cursor?: string }) => ({
        object: "list",
        data: [{ accessionNumber: params.cursor ? "0000000000-25-000002" : "0000000000-25-000001" }],
        hasMore: true,
        nextCursor: "cur_repeat",
        requestId: params.cursor ? "req_page_2" : "req_page_1",
      }),
      {},
    )
    await iterator.next()
    await iterator.next()
    await expect(iterator.next()).rejects.toMatchObject({
      name: "SecApiError",
      status: 0,
      code: "client_pagination_cursor_repeated",
      hint: expect.stringContaining("retry from the first page"),
    })
  })

  test("paginateFilings stops on an empty page even if a fresh cursor is present", async () => {
    const seenUrls: string[] = []
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url) => {
        seenUrls.push(String(url))
        return jsonResponse({
          object: "list",
          data: [],
          nextCursor: "cur_fresh",
        })
      },
    })

    const accessions: string[] = []
    for await (const filing of client.paginateFilings({ limit: 1 })) {
      accessions.push(filing.accessionNumber)
    }

    expect(accessions).toEqual([])
    expect(seenUrls).toEqual([
      "https://api.secapi.ai/v1/filings?limit=1",
    ])
  })

  test("pagination helpers forward symbol aliases", async () => {
    const seenUrls: string[] = []
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url) => {
        seenUrls.push(String(url))
        return jsonResponse({ object: "list", data: [], sections: [] })
      },
    })

    for await (const _filing of client.paginateFilings({ symbol: "AAPL", form: "10-K", limit: 1 })) {
      // no rows in this smoke response
    }
    for await (const _section of client.paginateSections({ symbol: "AAPL", q: "risk", limit: 1 })) {
      // no rows in this smoke response
    }

    expect(seenUrls).toEqual([
      "https://api.secapi.ai/v1/filings?symbol=AAPL&form=10-K&limit=1",
      "https://api.secapi.ai/v1/sections/search?symbol=AAPL&q=risk&limit=1",
    ])
  })

  test("paginateSections honors maxItems without fetching extra pages", async () => {
    const seenUrls: string[] = []
    const responses = [
      {
        object: "list",
        sections: [{ id: "sec_1", contentMd: "first" }, { id: "sec_2", contentMd: "second" }],
        nextCursor: "cur_2",
      },
      {
        object: "list",
        sections: [{ id: "sec_3", contentMd: "third" }],
        nextCursor: "cur_3",
      },
    ]
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url) => {
        seenUrls.push(String(url))
        return jsonResponse(responses.shift() ?? { object: "list", sections: [] })
      },
    })

    const sections: string[] = []
    for await (const section of client.paginateSections({ q: "risk", ticker: "AAPL", limit: 2 }, { maxItems: 2 })) {
      sections.push(section.contentMd)
    }

    expect(sections).toEqual(["first", "second"])
    expect(seenUrls).toEqual([
      "https://api.secapi.ai/v1/sections/search?q=risk&ticker=AAPL&limit=2",
    ])
  })

  test("paginateEntities yields typed entity records", async () => {
    const seenUrls: string[] = []
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url) => {
        seenUrls.push(String(url))
        return jsonResponse({
          object: "list",
          data: [{ object: "entity", id: "ent_aapl", name: "Apple Inc.", ticker: "AAPL" }],
          nextCursor: null,
        })
      },
    })

    const names: string[] = []
    for await (const entity of client.paginateEntities({ q: "apple", limit: 1 })) {
      names.push(entity.name)
    }

    expect(names).toEqual(["Apple Inc."])
    expect(seenUrls).toEqual([
      "https://api.secapi.ai/v1/entities?q=apple&limit=1",
    ])
  })

  test("generic paginate supports custom item and cursor extractors", async () => {
    const seenUrls: string[] = []
    const responses = [
      { rows: [{ id: "evt_1" }], cursor: "event_cursor_2" },
      { rows: [{ id: "evt_2" }], cursor: null },
    ]
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url) => {
        seenUrls.push(String(url))
        return jsonResponse(responses.shift() ?? { rows: [] })
      },
    })

    const events: string[] = []
    for await (const event of client.paginate(
      (params) => client.streamEvents("stream_1", params),
      { limit: 1 },
      {
        getItems: (page) => (page as { rows: Array<{ id: string }> }).rows,
        getNextCursor: (page) => (page as { cursor?: string | null }).cursor,
      },
    )) {
      events.push(event.id)
    }

    expect(events).toEqual(["evt_1", "evt_2"])
    expect(seenUrls).toEqual([
      "https://api.secapi.ai/v1/stream_subscriptions/stream_1/events?limit=1",
      "https://api.secapi.ai/v1/stream_subscriptions/stream_1/events?limit=1&cursor=event_cursor_2",
    ])
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
    await client.monitorMatches("mon/with spaces", { limit: 5 })

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
      url: "https://api.secapi.ai/v1/monitors/mon%2Fwith%20spaces/matches?limit=5",
      method: undefined,
      body: undefined,
    })
  })

  test("webhook helpers escape opaque path ids", async () => {
    const seen: Array<{ url: string; method?: string }> = []
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url, init) => {
        seen.push({ url: String(url), method: init?.method })
        return jsonResponse({ ok: true })
      },
    })

    await client.rotateWebhookEndpointSecret("we/with spaces")
    await client.listWebhookDeliveries("we/with spaces", { eventId: "evt_1", limit: 2 })
    await client.replayWebhookDelivery("we/with spaces", "del/with spaces")

    expect(seen).toEqual([
      {
        url: "https://api.secapi.ai/v1/webhook_endpoints/we%2Fwith%20spaces/rotate_secret",
        method: "POST",
      },
      {
        url: "https://api.secapi.ai/v1/webhook_endpoints/we%2Fwith%20spaces/deliveries?eventId=evt_1&limit=2",
        method: undefined,
      },
      {
        url: "https://api.secapi.ai/v1/webhook_endpoints/we%2Fwith%20spaces/deliveries/del%2Fwith%20spaces/replay",
        method: "POST",
      },
    ])
  })

  test("artifact helpers escape opaque path ids", async () => {
    const seen: Array<{ url: string; method?: string }> = []
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url, init) => {
        seen.push({ url: String(url), method: init?.method })
        return jsonResponse({ ok: true })
      },
    })

    await client.getArtifact("artifact/with spaces")
    await client.artifactManifest("artifact/with spaces")
    await client.exportArtifact("artifact/with spaces", { format: "markdown" })
    await client.downloadArtifact("artifact/with spaces")
    await client.reconcileArtifact("artifact/with spaces")

    expect(seen).toEqual([
      {
        url: "https://api.secapi.ai/v1/artifacts/artifact%2Fwith%20spaces",
        method: undefined,
      },
      {
        url: "https://api.secapi.ai/v1/artifacts/artifact%2Fwith%20spaces/manifest",
        method: undefined,
      },
      {
        url: "https://api.secapi.ai/v1/artifacts/artifact%2Fwith%20spaces/export?format=markdown",
        method: undefined,
      },
      {
        url: "https://api.secapi.ai/v1/artifacts/artifact%2Fwith%20spaces/download",
        method: undefined,
      },
      {
        url: "https://api.secapi.ai/v1/artifacts/artifact%2Fwith%20spaces/reconcile",
        method: "POST",
      },
    ])
  })

  test("filing helpers escape opaque path ids", async () => {
    const seenUrls: string[] = []
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url) => {
        seenUrls.push(String(url))
        return jsonResponse({ ok: true })
      },
    })

    await client.filingByAccession("0000320193/25 000079", { ticker: "AAPL" })
    await client.latestSection({ ticker: "AAPL", sectionKey: "item 1/risk factors", mode: "compact" })
    await client.filingSectionByAccession("0000320193/25 000079", { sectionKey: "item 1/risk factors", form: "10-K" })

    expect(seenUrls).toEqual([
      "https://api.secapi.ai/v1/filings/0000320193%2F25%20000079?ticker=AAPL",
      "https://api.secapi.ai/v1/filings/latest/sections/item%201%2Frisk%20factors?ticker=AAPL&mode=compact",
      "https://api.secapi.ai/v1/filings/0000320193%2F25%20000079/sections/item%201%2Frisk%20factors?form=10-K",
    ])
  })

  test("filing helpers forward symbol aliases", async () => {
    const seenUrls: string[] = []
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url) => {
        seenUrls.push(String(url))
        return jsonResponse({ ok: true })
      },
    })

    await client.searchFilings({ symbol: "AAPL", form: "10-K", limit: 1 })
    await client.latestFiling({ symbol: "AAPL", form: "10-K" })
    await client.agentLatestFiling({ symbol: "AAPL", form: "10-K" })
    await client.renderLatestFiling({ symbol: "AAPL", form: "10-K" })
    await client.latestSection({ symbol: "AAPL", sectionKey: "item_1a", mode: "compact" })
    await client.latestRiskCategories({ symbol: "AAPL", form: "10-K" })
    await client.pensionBenefitSchedule({ symbol: "VZ", filing_year: 2022, target_year: 2024 })

    expect(seenUrls).toEqual([
      "https://api.secapi.ai/v1/filings?symbol=AAPL&form=10-K&limit=1",
      "https://api.secapi.ai/v1/filings/latest?symbol=AAPL&form=10-K",
      "https://api.secapi.ai/v1/filings/latest?symbol=AAPL&form=10-K&view=agent",
      "https://api.secapi.ai/v1/filings/latest/render?symbol=AAPL&form=10-K",
      "https://api.secapi.ai/v1/filings/latest/sections/item_1a?symbol=AAPL&mode=compact",
      "https://api.secapi.ai/v1/filings/latest/risk-categories?symbol=AAPL&form=10-K",
      "https://api.secapi.ai/v1/filings/pension-benefit-schedule?symbol=VZ&filing_year=2022&target_year=2024",
    ])
  })

  test("stream event helper escapes opaque path ids", async () => {
    const seenUrls: string[] = []
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url) => {
        seenUrls.push(String(url))
        return jsonResponse({ ok: true })
      },
    })

    await client.streamEvents("stream/with spaces", { cursor: "cur_1", limit: 10 })

    expect(seenUrls[0]).toBe("https://api.secapi.ai/v1/stream_subscriptions/stream%2Fwith%20spaces/events?cursor=cur_1&limit=10")
  })

  test("admin helpers escape opaque path ids", async () => {
    const seenUrls: string[] = []
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url) => {
        seenUrls.push(String(url))
        return jsonResponse({ ok: true })
      },
    })

    await client.getAdminOrganization("org/with spaces", { limit: 2 })
    await client.getAdminRequestDiagnostics("org/with spaces", "req/with spaces")
    await client.getAdminDeliverySummary("org/with spaces", { limit: 3 })

    expect(seenUrls).toEqual([
      "https://api.secapi.ai/v1/admin/orgs/org%2Fwith%20spaces?limit=2",
      "https://api.secapi.ai/v1/admin/orgs/org%2Fwith%20spaces/requests/req%2Fwith%20spaces",
      "https://api.secapi.ai/v1/admin/orgs/org%2Fwith%20spaces/deliveries/summary?limit=3",
    ])
  })

  test("delete api key escapes opaque key ids", async () => {
    const seen: Array<{ url: string; method?: string }> = []
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url, init) => {
        seen.push({ url: String(url), method: init?.method })
        return jsonResponse({ ok: true })
      },
    })

    await client.deleteApiKey("key/with spaces")

    expect(seen[0]).toEqual({
      url: "https://api.secapi.ai/v1/api_keys/key%2Fwith%20spaces",
      method: "DELETE",
    })
  })

  test("stock loadings escape ticker path segments", async () => {
    const seenUrls: string[] = []
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url) => {
        seenUrls.push(String(url))
        return jsonResponse({ ok: true })
      },
    })

    await client.stockLoadings("BRK/B class", { factors: ["VALUE", "QUALITY"] })

    expect(seenUrls[0]).toBe("https://api.secapi.ai/v1/stocks/BRK%2FB%20class/loadings?factors=VALUE%2CQUALITY")
  })

  test("model portfolio factor view escapes portfolio ids", async () => {
    const seenUrls: string[] = []
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url) => {
        seenUrls.push(String(url))
        return jsonResponse({ ok: true })
      },
    })

    await client.modelPortfolioFactorView("portfolio/team alpha", { factors: ["VALUE"] })

    expect(seenUrls[0]).toBe("https://api.secapi.ai/v1/model-portfolios/portfolio%2Fteam%20alpha/factor-view?factors=VALUE")
  })

  test("statement helper escapes opaque statement keys", async () => {
    const seenUrls: string[] = []
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url) => {
        seenUrls.push(String(url))
        return jsonResponse({ ok: true })
      },
    })

    await client.statementByKey("income/statement with spaces", { ticker: "AAPL", period: "annual", limit: 2 })

    expect(seenUrls[0]).toBe("https://api.secapi.ai/v1/statements/income%2Fstatement%20with%20spaces?ticker=AAPL&period=annual&limit=2")
  })

  test("dilution event detail escapes opaque event ids", async () => {
    const seenUrls: string[] = []
    const client = new SecApiClient({
      telemetry: false,
      fetch: async (url) => {
        seenUrls.push(String(url))
        return jsonResponse({ ok: true })
      },
    })

    await client.dilutionEventDetail("event/with spaces", { view: "agent" })

    expect(seenUrls[0]).toBe("https://api.secapi.ai/v1/dilution/events/event%2Fwith%20spaces?view=agent")
  })
})
