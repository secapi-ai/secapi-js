/**
 * Fund-letters contracts (PR-0 foundations).
 *
 * Customer-facing shapes for the fund-letters plane: investor letters from
 * hedge funds, partnerships, and registered funds (EDGAR N-CSR/N-CSRS),
 * parsed into structured per-company investment theses.
 *
 * Thesis decision-context enums are kept verbatim Fiscal.ai-compatible so a
 * migration is a rename, not a re-model. Endpoints (registration in
 * openapi.ts + api-surface-registry happens when Track A ships; all shapes
 * are UNRELEASED until then) live under `/v1/fund-letters` — the `/v1/funds/*`
 * prefix is already taken by N-PORT holdings.
 *
 * Provenance anchor (the moat): `{page, charStart, charEnd, quote,
 * sourceSha256, paginationVersion}` — offsets into the page-segmented
 * markdown served by `/v1/fund-letters/:letter_id/document?format=markdown`.
 * Verbatim-by-construction: `pages[page].markdown.slice(charStart, charEnd)
 * === quote` holds for every anchor (the persist guard stores the matched
 * span from stored page text as `quote`; the LLM's variant is kept as
 * `quoteAsExtracted` when a fuzzy locate differed).
 *
 * Persistence: fund_letter_* tables (migrations 133/134); Drizzle mirror
 * services/datastream-api/src/db/schema/fund_letters.ts.
 *
 * ID prefixes: `ltr_` (letter), `mgr_` (manager), `fnd_` (fund), `ths_`
 * (thesis) — deterministic sha256(naturalKey).slice(0,16) per
 * services/datastream-api/src/lib/fund-letters/ids.ts. Merged/superseded IDs
 * resolve forever via fund_letter_id_aliases; responses carry the canonical
 * `id` plus `requestedId` when they differ.
 */
import { z } from "zod"
import { listSchema } from "./schemas.js"

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

/**
 * v1 letter types. `corporate_shareholder_letter` was originally a deferred
 * Phase-2 lane, un-deferred by the Corpus Curation Review (2026-07-12, OMNI-5429)
 * for TWO managers only — Berkshire Hathaway (1977→) and Markel Group / Tom
 * Gayner (1986→), both `public_record`/`fund_published` with pristine archives.
 * The broader ARS/IR corporate-letter lane stays deferred; ingestion only mints
 * this type for the two curation-approved corporate sources (crawl_config
 * letterType hint), so the enum being open does not widen the crawl surface.
 */
export const FUND_LETTER_TYPES = [
  "hedge_fund_letter",
  "registered_fund_letter",
  "corporate_shareholder_letter",
] as const
export const fundLetterTypeSchema = z.enum(FUND_LETTER_TYPES)
export type FundLetterType = z.infer<typeof fundLetterTypeSchema>

/** Where the canonical bytes came from. Canonical preference: fund_website > edgar > aggregator. */
export const FUND_LETTER_SOURCES = ["fund_website", "edgar", "aggregator"] as const
export const fundLetterSourceSchema = z.enum(FUND_LETTER_SOURCES)
export type FundLetterSource = z.infer<typeof fundLetterSourceSchema>

/**
 * Rights tier — governs what `/document` serves:
 *   public_record   — EDGAR-sourced; full PDF/markdown served
 *   fund_published  — fetched from the fund's own domain; full PDF/markdown served
 *   third_party     — only obtainable from re-hosts/leaks; metadata + snippet
 *                     quotes + sourceUrl link-out only (403 document_not_distributable)
 */
export const FUND_LETTER_DISTRIBUTIONS = ["public_record", "fund_published", "third_party"] as const
export const fundLetterDistributionSchema = z.enum(FUND_LETTER_DISTRIBUTIONS)
export type FundLetterDistribution = z.infer<typeof fundLetterDistributionSchema>

/** Fiscal.ai-verbatim relationship taxonomy (frozen — migration compatibility). */
export const FUND_LETTER_RELATIONSHIPS = [
  "long",
  "short",
  "new_position",
  "added",
  "trimmed",
  "sold",
  "exited",
  "watchlist",
  "negative_research",
  "issuer",
] as const
export const fundLetterRelationshipSchema = z.enum(FUND_LETTER_RELATIONSHIPS)
export type FundLetterRelationship = z.infer<typeof fundLetterRelationshipSchema>

export const FUND_LETTER_STANCES = ["bullish", "bearish", "mixed", "neutral"] as const
export const fundLetterStanceSchema = z.enum(FUND_LETTER_STANCES)
export type FundLetterStance = z.infer<typeof fundLetterStanceSchema>

/** Conviction as EXPRESSED by the manager, never inferred (convictionBasis is always "as_expressed"). */
export const FUND_LETTER_CONVICTIONS = ["high", "medium", "low", "unknown"] as const
export const fundLetterConvictionSchema = z.enum(FUND_LETTER_CONVICTIONS)
export type FundLetterConviction = z.infer<typeof fundLetterConvictionSchema>

/** Why a company mention qualified as a thesis (Fiscal-verbatim materiality basis). */
export const FUND_LETTER_MATERIALITY_BASES = [
  "substantive_thesis",
  "performance_attribution",
  "portfolio_action",
  "meaningful_position_size",
  "valuation_discussion",
  "catalyst_discussion",
  "risk_or_bear_case",
  "substantive_negative_view",
  "mistake_or_exit_review",
] as const
export const fundLetterMaterialityBasisSchema = z.enum(FUND_LETTER_MATERIALITY_BASES)
export type FundLetterMaterialityBasis = z.infer<typeof fundLetterMaterialityBasisSchema>

/** Delta-feed event types (/changes + the fund_letter.* webhook family). */
export const FUND_LETTER_CHANGE_TYPES = [
  "letter.published",
  "letter.updated",
  "letter.superseded",
  "thesis.extracted",
  "manager.added",
] as const
export const fundLetterChangeTypeSchema = z.enum(FUND_LETTER_CHANGE_TYPES)
export type FundLetterChangeType = z.infer<typeof fundLetterChangeTypeSchema>

// ---------------------------------------------------------------------------
// Provenance anchor
// ---------------------------------------------------------------------------

/**
 * Page-anchored provenance into `/document?format=markdown`. Offsets are
 * relative to the stored page markdown identified by `sourceSha256` +
 * `paginationVersion`; `?sha=` retrieves superseded source variants so
 * historical anchors always verify.
 */
export const fundLetterAnchorSchema = z
  .object({
    page: z.number().int().positive(),
    charStart: z.number().int().nonnegative(),
    charEnd: z.number().int().nonnegative(),
    quote: z.string(),
    sourceSha256: z.string(),
    /** Namespaced page-parser build stamp ("pdf@1" / "ncsr@1") — review minor 12. */
    paginationVersion: z.string(),
  })
  .refine((anchor) => anchor.charEnd >= anchor.charStart, {
    message: "charEnd must be >= charStart",
    path: ["charEnd"],
  })

export type FundLetterAnchor = z.infer<typeof fundLetterAnchorSchema>

// ---------------------------------------------------------------------------
// Resource objects
// ---------------------------------------------------------------------------

/** Reporting period: canonical YYYYQn plus the free-text label as printed. */
export const fundLetterPeriodSchema = z.object({
  year: z.number().int().nullable(),
  quarter: z.number().int().min(1).max(4).nullable(),
  /** Canonical `YYYYQn` (e.g. "2025Q1"); null when the period is undetermined. */
  period: z.string().nullable(),
  label: z.string().nullable().optional(),
  fiscalPeriodEnd: z.string().nullable().optional(),
})

export type FundLetterPeriod = z.infer<typeof fundLetterPeriodSchema>

export const fundLetterPerformanceSummarySchema = z.object({
  netReturnPercent: z.number().nullable(),
  benchmarkName: z.string().nullable(),
  benchmarkReturnPercent: z.number().nullable(),
})

export type FundLetterPerformanceSummary = z.infer<typeof fundLetterPerformanceSummarySchema>

/**
 * Provenance-confidence flag (OMNI-5430): how authoritative the source bytes are.
 * - `fund_authenticated` — fetched from the fund's own domain (`fund_published`)
 *   or EDGAR (`public_record`); the letter is what the fund itself put out.
 * - `third_party_unverified` — obtained via a third-party mirror/aggregator
 *   (`third_party` distribution); rights-limited (snippet + link only) and not
 *   confirmed against a fund-authenticated copy.
 * - `leak_sourced` — a leak-circulated confidential letter (a subset of
 *   `third_party`). Reserved for the leak-source lane (held pending counsel,
 *   OMNI-5427/OMNI-5430): that lane persists this value into the letter's
 *   provenance so it overrides the distribution-derived default at serve time.
 */
export const FUND_LETTER_PROVENANCE_CONFIDENCE = [
  "fund_authenticated",
  "third_party_unverified",
  "leak_sourced",
] as const
export const fundLetterProvenanceConfidenceSchema = z.enum(FUND_LETTER_PROVENANCE_CONFIDENCE)
export type FundLetterProvenanceConfidence = z.infer<typeof fundLetterProvenanceConfidenceSchema>

export const fundLetterProvenanceSchema = z.object({
  sourceUrl: z.string().nullable(),
  /** Accession of the N-CSR/N-CSRS source filing; null for web-sourced letters. */
  accessionNumber: z.string().nullable(),
  /** sha256 of canonical source bytes (the `ltr_` natural-key component). */
  sourceSha256: z.string(),
  /** sha256 of the served PDF bytes; null for EDGAR-sourced letters (no PDF). */
  pdfSha256: z.string().nullable(),
  retrievedAt: z.string().nullable(),
  extractorVersion: z.string().nullable(),
  /** How authoritative the source bytes are (leak-sourced vs fund-authenticated). */
  confidence: fundLetterProvenanceConfidenceSchema,
})

export type FundLetterProvenance = z.infer<typeof fundLetterProvenanceSchema>

export const fundLetterSchema = z.object({
  object: z.literal("fund_letter"),
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  livemode: z.boolean(),
  /** Canonical id echoed when the request used an alias (merged/superseded id). */
  requestedId: z.string().nullable().optional(),
  managerId: z.string().nullable(),
  managerName: z.string().nullable(),
  fundId: z.string().nullable(),
  fundName: z.string().nullable(),
  letterType: fundLetterTypeSchema,
  source: fundLetterSourceSchema,
  distribution: fundLetterDistributionSchema,
  title: z.string().nullable(),
  period: fundLetterPeriodSchema,
  publishedAt: z.string().nullable(),
  ingestedAt: z.string(),
  pageCount: z.number().int().nullable(),
  wordCount: z.number().int().nullable(),
  /** Namespaced page-parser build stamp ("pdf@1" / "ncsr@1") — review minor 12. */
  paginationVersion: z.string(),
  tickersMentioned: z.array(z.string()).default([]),
  thesisCount: z.number().int().nonnegative(),
  performanceSummary: fundLetterPerformanceSummarySchema.nullable(),
  provenance: fundLetterProvenanceSchema,
  links: z.record(z.string(), z.string()).default({}),
})

export type FundLetter = z.infer<typeof fundLetterSchema>

/** One letter-level narrative block: extracted text plus its page anchors. */
export const fundLetterNarrativeSchema = z.object({
  text: z.string(),
  anchors: z.array(fundLetterAnchorSchema).default([]),
})

export type FundLetterNarrative = z.infer<typeof fundLetterNarrativeSchema>

/**
 * Letter-level narratives served on the detail endpoint. Every block is
 * nullable — a letter that lacks a section serves null, never a guess.
 */
export const fundLetterNarrativesSchema = z.object({
  marketBackdrop: fundLetterNarrativeSchema.nullable(),
  positioning: fundLetterNarrativeSchema.nullable(),
  performanceCommentary: fundLetterNarrativeSchema.nullable(),
  outlook: fundLetterNarrativeSchema.nullable(),
  firmUpdates: fundLetterNarrativeSchema.nullable(),
})

export type FundLetterNarratives = z.infer<typeof fundLetterNarrativesSchema>

/** One reported performance figure (net/benchmark return for a stated period). */
export const fundLetterPerformanceFigureSchema = z.object({
  label: z.string().nullable(),
  period: z.string().nullable(),
  netReturnPercent: z.number().nullable(),
  benchmarkName: z.string().nullable(),
  benchmarkReturnPercent: z.number().nullable(),
  anchors: z.array(fundLetterAnchorSchema).default([]),
})

export type FundLetterPerformanceFigure = z.infer<typeof fundLetterPerformanceFigureSchema>

const fundLetterCompanyRefSchema = z.object({
  ticker: z.string().nullable(),
  cik: z.string().nullable(),
  name: z.string(),
  entityId: z.string().nullable(),
})

export const fundLetterPositionSizeSchema = z.object({
  percent: z.number().nullable(),
  /**
   * How the size was stated. Free string; `estimated_from_13f_adviser`
   * marks entity-linking estimates (long-family relationships only, with the
   * adviser-aggregate denominator disclosed in crossLinks metadata).
   */
  basis: z.string().nullable(),
})

export const fundLetterThesisSchema = z.object({
  object: z.literal("fund_letter_thesis"),
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  livemode: z.boolean(),
  requestedId: z.string().nullable().optional(),
  letterId: z.string(),
  managerId: z.string().nullable(),
  managerName: z.string().nullable(),
  fundId: z.string().nullable(),
  company: fundLetterCompanyRefSchema,
  /** Canonical `YYYYQn`; null when the letter's period is undetermined. */
  reportPeriod: z.string().nullable(),
  relationship: fundLetterRelationshipSchema,
  stance: fundLetterStanceSchema.nullable(),
  conviction: fundLetterConvictionSchema.nullable(),
  /** Always "as_expressed" — conviction is never inferred by the extractor. */
  convictionBasis: z.literal("as_expressed"),
  timeHorizon: z.string().nullable(),
  positionSize: fundLetterPositionSizeSchema.nullable(),
  materiality: z.object({
    basis: z.array(fundLetterMaterialityBasisSchema).default([]),
  }),
  // Narrative fields (nullable — a field the letter does not support is null,
  // never guessed).
  thesisSummary: z.string().nullable(),
  variantPerception: z.string().nullable(),
  riskSummary: z.string().nullable(),
  catalystSummary: z.string().nullable(),
  valuationSummary: z.string().nullable(),
  businessQualitySummary: z.string().nullable(),
  managementAssessment: z.string().nullable(),
  capitalAllocationSummary: z.string().nullable(),
  financialExpectations: z.string().nullable(),
  performanceOrActionSummary: z.string().nullable(),
  /** Verbatim-by-construction quote with page anchors (`text` is the matched span). */
  sourceQuote: z
    .object({
      text: z.string(),
      anchors: z.array(fundLetterAnchorSchema).default([]),
    })
    .nullable(),
  /** The LLM's original quote when the anchor locate step matched fuzzily. */
  quoteAsExtracted: z.string().nullable().optional(),
  /** Hard cross-links into the 13F/insider/filings data planes. */
  crossLinks: z.object({
    holdings13F: z.string().nullable(),
    holderHistory: z.string().nullable(),
    insiderActivity: z.string().nullable(),
    companyFilings: z.string().nullable(),
  }),
  status: z.enum(["active", "superseded"]),
  supersededBy: z.string().nullable(),
})

export type FundLetterThesis = z.infer<typeof fundLetterThesisSchema>

/**
 * Full letter detail (`GET /v1/fund-letters/:letter_id`): the list record plus
 * narratives, performance figures, and inline theses. `theses` inlines at most
 * 25 rows — `thesisCount` carries the true total and `links.theses` pages the
 * rest via `/v1/fund-letters/theses?letter_id=`.
 */
export const fundLetterDetailSchema = fundLetterSchema.extend({
  narratives: fundLetterNarrativesSchema,
  performanceFigures: z.array(fundLetterPerformanceFigureSchema).default([]),
  theses: z.array(fundLetterThesisSchema).default([]),
})

export type FundLetterDetail = z.infer<typeof fundLetterDetailSchema>

/**
 * `view=compact` list projection — a payload-shape convenience (billed
 * identically to the default view). `period` flattens to the canonical
 * YYYYQn string.
 */
export const fundLetterCompactSchema = z.object({
  id: z.string(),
  managerId: z.string().nullable(),
  managerName: z.string().nullable(),
  fundId: z.string().nullable(),
  letterType: fundLetterTypeSchema,
  period: z.string().nullable(),
  publishedAt: z.string().nullable(),
  title: z.string().nullable(),
  thesisCount: z.number().int().nonnegative(),
})

export type FundLetterCompact = z.infer<typeof fundLetterCompactSchema>

/**
 * `GET /v1/fund-letters/:letter_id/document?format=markdown` — page-segmented
 * markdown. BYTE-IDENTITY CONTRACT: each `pages[].markdown` is byte-identical
 * to the stored `fund_letter_pages.content_md` (never re-normalized at serve
 * time), so `pages[page-1].markdown.slice(charStart, charEnd) === quote` holds
 * for every anchor stamped with this `sourceSha256` + `paginationVersion`.
 * `?sha=` retrieves superseded source variants so historical anchors verify.
 */
export const fundLetterDocumentMarkdownSchema = z.object({
  object: z.literal("fund_letter_document"),
  letterId: z.string(),
  requestedId: z.string().nullable().optional(),
  format: z.literal("markdown"),
  sourceSha256: z.string(),
  paginationVersion: z.string(),
  pageCount: z.number().int().nonnegative(),
  pages: z.array(z.object({
    page: z.number().int().positive(),
    markdown: z.string(),
  })),
})

export type FundLetterDocumentMarkdown = z.infer<typeof fundLetterDocumentMarkdownSchema>

export const fundLetterManagerSchema = z.object({
  object: z.literal("fund_letter_manager"),
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  livemode: z.boolean(),
  requestedId: z.string().nullable().optional(),
  name: z.string(),
  strategy: z.object({
    approach: z.string().nullable(),
    styleTags: z.array(z.string()).default([]),
  }),
  coverage: z.object({
    lettersCount: z.number().int().nonnegative(),
    fundsCount: z.number().int().nonnegative(),
    companiesCount: z.number().int().nonnegative(),
    thesesCount: z.number().int().nonnegative(),
    firstPeriod: z.string().nullable(),
    latestPeriod: z.string().nullable(),
    cadence: z.string().nullable(),
  }),
  identifiers: z.object({
    adviserCik: z.string().nullable(),
    crd: z.string().nullable(),
    lei: z.string().nullable(),
  }),
  crossLinks: z.object({
    holdings13F: z.string().nullable(),
  }),
})

export type FundLetterManager = z.infer<typeof fundLetterManagerSchema>

// ---------------------------------------------------------------------------
// Fund Overview (manager overview) — the manager twin of /v1/companies/overview
// ---------------------------------------------------------------------------

/** One fund founder/principal from the curated profile. */
export const fundManagerFounderSchema = z.object({
  name: z.string(),
  role: z.string().nullable(),
})

export type FundManagerFounder = z.infer<typeof fundManagerFounderSchema>

/**
 * One headline thesis on the overview: a deliberately tiny projection of
 * fundLetterThesisSchema (ticker + relationship + stance + one line). Full
 * theses (anchors, narratives, cross-links) live behind `links.theses`.
 */
export const fundManagerOverviewKeyThesisSchema = z.object({
  ticker: z.string().nullable(),
  company: z.string(),
  relationship: fundLetterRelationshipSchema,
  stance: fundLetterStanceSchema.nullable(),
  /** First sentence of the extracted thesis summary (never a full narrative). */
  oneLine: z.string().nullable(),
})

export type FundManagerOverviewKeyThesis = z.infer<typeof fundManagerOverviewKeyThesisSchema>

/** Latest-letter highlights inlined on the overview (null for an empty corpus). */
export const fundManagerOverviewLatestLetterSchema = z.object({
  id: z.string(),
  /** Canonical `YYYYQn`; null when the period is undetermined. */
  period: z.string().nullable(),
  title: z.string().nullable(),
  publishedAt: z.string().nullable(),
  tickersMentioned: z.array(z.string()).default([]),
  performanceSummary: fundLetterPerformanceSummarySchema.nullable(),
  /** Up to 5 headline theses, most material first. */
  keyTheses: z.array(fundManagerOverviewKeyThesisSchema).default([]),
})

export type FundManagerOverviewLatestLetter = z.infer<typeof fundManagerOverviewLatestLetterSchema>

/**
 * `GET /v1/fund-letters/managers/{manager_id}/overview` — the token-efficient
 * "who is this manager" briefing, mirroring the company-overview discipline:
 * identity (canonical name, description, founders, website), coverage counts,
 * the latest letter's highlights, and links out to the full surfaces. No page
 * markdown, no anchors, no full thesis bodies.
 */
export const fundManagerOverviewSchema = z.object({
  object: z.literal("fund_manager_overview"),
  id: z.string(),
  livemode: z.boolean(),
  /** Canonical id echoed when the request used an alias (merged/superseded id). */
  requestedId: z.string().nullable().optional(),
  /** The name as recorded (letter mastheads / ADV legal name). */
  name: z.string(),
  /** The human-readable name people say — curated, else derived ("Oaktree Capital"). */
  canonicalName: z.string(),
  /** Curated 2-4 sentence factual blurb (fund + strategy); null until curated. */
  description: z.string().nullable(),
  founders: z.array(fundManagerFounderSchema).default([]),
  website: z.string().nullable(),
  strategy: z.object({
    approach: z.string().nullable(),
    styleTags: z.array(z.string()).default([]),
  }),
  identifiers: z.object({
    adviserCik: z.string().nullable(),
    crd: z.string().nullable(),
  }),
  coverage: z.object({
    lettersCount: z.number().int().nonnegative(),
    fundsCount: z.number().int().nonnegative(),
    firstPeriod: z.string().nullable(),
    latestPeriod: z.string().nullable(),
  }),
  latestLetter: fundManagerOverviewLatestLetterSchema.nullable(),
  links: z.object({
    self: z.string(),
    letters: z.string(),
    theses: z.string(),
    holdings13F: z.string().nullable(),
  }),
})

export type FundManagerOverview = z.infer<typeof fundManagerOverviewSchema>

export const fundLetterFundSchema = z.object({
  object: z.literal("fund_letter_fund"),
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  livemode: z.boolean(),
  requestedId: z.string().nullable().optional(),
  managerId: z.string(),
  managerName: z.string().nullable(),
  name: z.string(),
  edgarSeriesId: z.string().nullable(),
  lettersCount: z.number().int().nonnegative(),
})

export type FundLetterFund = z.infer<typeof fundLetterFundSchema>

/** Company coverage index row (`/v1/fund-letters/companies`). */
export const fundLetterCompanyCoverageSchema = z.object({
  object: z.literal("fund_letter_company_coverage"),
  company: z.object({
    ticker: z.string().nullable(),
    cik: z.string().nullable(),
    name: z.string().nullable(),
    entityId: z.string().nullable(),
  }),
  thesisCount: z.number().int().nonnegative(),
  managerCount: z.number().int().nonnegative(),
  letterCount: z.number().int().nonnegative(),
  firstPeriod: z.string().nullable(),
  latestPeriod: z.string().nullable(),
  latestStance: fundLetterStanceSchema.nullable(),
  latestRelationship: fundLetterRelationshipSchema.nullable(),
})

export type FundLetterCompanyCoverage = z.infer<typeof fundLetterCompanyCoverageSchema>

/**
 * One `/changes` delta-feed entry. Keyset-paginated over (createdAt DESC,
 * id DESC) — never offset-paginated, never response-cached.
 */
export const fundLetterChangeSchema = z.object({
  object: z.literal("fund_letter_change"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  type: fundLetterChangeTypeSchema,
  letterId: z.string().nullable(),
  thesisId: z.string().nullable(),
  managerId: z.string().nullable(),
  fundId: z.string().nullable(),
  ticker: z.string().nullable(),
  cik: z.string().nullable(),
  data: z.record(z.string(), z.unknown()).default({}),
})

export type FundLetterChange = z.infer<typeof fundLetterChangeSchema>

// ---------------------------------------------------------------------------
// Search hits (Track D — /search + /semantic engines)
// ---------------------------------------------------------------------------

/**
 * Compact letter reference embedded in search/semantic hits — enough to
 * render a result row and follow `links.letter` without a second lookup.
 */
export const fundLetterSearchLetterRefSchema = z.object({
  id: z.string(),
  managerId: z.string().nullable(),
  managerName: z.string().nullable(),
  fundId: z.string().nullable(),
  letterType: fundLetterTypeSchema,
  source: fundLetterSourceSchema,
  distribution: fundLetterDistributionSchema,
  title: z.string().nullable(),
  period: z.string().nullable(),
  publishedAt: z.string().nullable(),
})

export type FundLetterSearchLetterRef = z.infer<typeof fundLetterSearchLetterRefSchema>

/**
 * One full-text highlight with its page-anchored location. The anchor is
 * produced by the server-side locate step (Typesense highlights return
 * snippets, not offsets — the engine re-locates each snippet against the
 * stored `fund_letter_pages.content_md` so
 * `pages[page].markdown.slice(charStart, charEnd) === quote` holds).
 */
export const fundLetterSearchHighlightSchema = z.object({
  /** Human-readable snippet with `<mark>` emphasis stripped. */
  snippet: z.string(),
  /** Null when the locate step could not verify the snippet against stored page text. */
  anchor: fundLetterAnchorSchema.nullable(),
})

export type FundLetterSearchHighlight = z.infer<typeof fundLetterSearchHighlightSchema>

/** One `/v1/fund-letters/search` hit (page-level full-text match). */
export const fundLetterSearchHitSchema = z.object({
  object: z.literal("fund_letter_search_hit"),
  letter: fundLetterSearchLetterRefSchema,
  page: z.number().int().positive(),
  highlights: z.array(fundLetterSearchHighlightSchema).default([]),
})

export type FundLetterSearchHit = z.infer<typeof fundLetterSearchHitSchema>

/** One `/v1/fund-letters/semantic` hit (vector match over page chunks). */
export const fundLetterSemanticHitSchema = z.object({
  object: z.literal("fund_letter_semantic_hit"),
  /** Cosine similarity score from the vector index. */
  score: z.number(),
  letter: fundLetterSearchLetterRefSchema,
  page: z.number().int().positive(),
  /** The matched chunk text (verbatim slice of the stored page markdown). */
  chunkText: z.string(),
  /** Page-anchored chunk location; offsets come from chunk_start/chunk_end. */
  anchor: fundLetterAnchorSchema.nullable(),
})

export type FundLetterSemanticHit = z.infer<typeof fundLetterSemanticHitSchema>

// ---------------------------------------------------------------------------
// List envelopes
// ---------------------------------------------------------------------------

export const fundLetterListSchema = listSchema(fundLetterSchema)
export const fundLetterThesisListSchema = listSchema(fundLetterThesisSchema)
export const fundLetterManagerListSchema = listSchema(fundLetterManagerSchema)
export const fundLetterFundListSchema = listSchema(fundLetterFundSchema)
export const fundLetterCompanyCoverageListSchema = listSchema(fundLetterCompanyCoverageSchema)
export const fundLetterChangeListSchema = listSchema(fundLetterChangeSchema)
export const fundLetterSearchHitListSchema = listSchema(fundLetterSearchHitSchema)
export const fundLetterSemanticHitListSchema = listSchema(fundLetterSemanticHitSchema)
export const fundLetterCompactListSchema = listSchema(fundLetterCompactSchema)
