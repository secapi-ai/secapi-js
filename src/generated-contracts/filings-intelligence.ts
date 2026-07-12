/**
 * Filings-intelligence-plane contracts (OMNI-5118, Wave A — WS11).
 *
 * FROZEN INTERFACE CONTRACT. Changes require supervisor escalation per
 * docs/designs/wave-a-intelligence-contracts.md.
 *
 * Owns taxonomy 2 of the Wave A pair: `filing_event_category` — per-filing
 * tagging of 8-K / 6-K disclosures (StockInsights-style ai_insights). The
 * category → situation_type mapping lives in `situations.ts`
 * (`FILING_EVENT_CATEGORY_TO_SITUATION_TYPE`).
 *
 * Endpoints frozen here (registration in openapi.ts + api-surface-registry
 * happens when WS11 ships; all shapes are UNRELEASED until then):
 *   GET /v1/filings/events  — the persisted tagged filing feed
 *   GET /v1/filings/diff    — pairwise section-level diff report (ticker/form/from/to)
 *   POST /v1/intelligence/footnotes/query — ADDITIVE request/response
 *     extensions (newness filter + per-note records); see
 *     `footnoteQueryExtensionShape` / `footnoteCollectionNotesExtensionShape`.
 *
 * Namespace decision (frozen): the persisted tagged feed lives under
 * `/v1/filings/events`, NOT under `/v1/events/*`. The existing `/v1/events/*`
 * namespace (ma, enforcement, restatements, auditor-changes, ipo,
 * officer-changes, voting-results) is the LIVE-CLASSIFIER namespace — computed
 * on read from recent filings. `/v1/filings/events` is a persisted,
 * cursor-paginated, replayable feed with one row per tagged filing. No alias
 * is created in either direction; the two surfaces converge only if/when the
 * live classifiers are re-platformed onto the persisted store.
 *
 * Persistence: `filing_ai_insights`, `filing_footnotes`,
 * `filing_section_deltas`, `earnings_transcripts` (Postgres) — see
 * services/datastream-api/migrations/drafts/wave_a_filings_intelligence.sql.
 *
 * ID prefixes: `fev_` (filing_event), `fn_` (filing_footnote),
 * `fsd_` (filing_section_delta), `etr_` (earnings_transcript).
 */
import { z } from "zod"
import { dilutionVerificationSchema } from "./dilution.js"

// ---------------------------------------------------------------------------
// Taxonomy 2: filing_event_category (per-filing tagging)
// ---------------------------------------------------------------------------

/**
 * Canonical per-filing event categories. Superset of StockInsights' 26
 * ai_insights categories (renamed to our conventions — see
 * `STOCKINSIGHTS_CATEGORY_NAME_COMPAT`) plus the situation-opening categories
 * required by the situations plane (tender_offer, going_private, spin_off,
 * activist_activity, strategic_review, capital_return, bankruptcy,
 * liquidation, relisting_action, domicile_change, insider_transaction,
 * auditor_change, guidance_update).
 */
export const FILING_EVENT_CATEGORIES = [
  // Deal / situation-opening categories
  "merger_acquisition",
  "tender_offer",
  "going_private",
  "spin_off",
  "divestiture",
  "activist_activity",
  "restructuring",
  "bankruptcy",
  "liquidation",
  "strategic_review",
  "capital_return",
  "securities_offering",
  "delisting_action",
  "relisting_action",
  "legal_dispute",
  "management_change",
  "domicile_change",
  "insider_transaction",
  // Financial / structural categories
  "financial_distress",
  "payment_default",
  "credit_rating",
  "capital_structure",
  "dividend_policy",
  "accounting_change",
  "auditor_change",
  "investment",
  "ipo",
  // Operational / informational categories
  "earnings_report",
  "earnings_call",
  "guidance_update",
  "investor_conference",
  "expansion",
  "contract_award",
  "product_launch",
  "regulatory_inspection",
  "operational_disruption",
  "labor_issue",
  "name_change",
  "other",
] as const

export const filingEventCategorySchema = z.enum(FILING_EVENT_CATEGORIES)
export type FilingEventCategory = z.infer<typeof filingEventCategorySchema>

/**
 * StockInsights ai_insights drop-in compatibility map: our category → their
 * `category_name` display string. `null` = no StockInsights equivalent (our
 * category is broader than their 26). Their numeric `category_id` is NOT
 * mirrored — we do not guess their internal numbering; integrators keying on
 * category_id must map through category_name. Field-name compatibility
 * (`summary_title`, `summary_text`, `sentiment`) is documented in
 * docs/designs/wave-a-intelligence-contracts.md §3.3.
 */
export const STOCKINSIGHTS_CATEGORY_NAME_COMPAT: Record<FilingEventCategory, string | null> = {
  merger_acquisition: "Company Mergers",
  tender_offer: "Offer for Sale",
  going_private: null,
  spin_off: null,
  divestiture: "Disposals and divestitures",
  activist_activity: null,
  restructuring: "Business Restructuring",
  bankruptcy: "Financial Troubles",
  liquidation: null,
  strategic_review: null,
  capital_return: null,
  securities_offering: "Offer for Sale",
  delisting_action: "Delisting Actions",
  relisting_action: null,
  legal_dispute: "Legal Disputes",
  management_change: "Management Changes",
  domicile_change: null,
  insider_transaction: null,
  financial_distress: "Financial Troubles",
  payment_default: "Payment Defaults",
  credit_rating: "Credit Rating Changes",
  capital_structure: "Capital Structure Changes",
  dividend_policy: "Dividend Policy Changes",
  accounting_change: "Accounting Changes",
  auditor_change: "Accounting Changes",
  investment: "Investments/Divestments",
  ipo: "IPO Launches",
  earnings_report: "Earnings Reports",
  earnings_call: "Earnings Calls",
  guidance_update: null,
  investor_conference: "Investor Conferences",
  expansion: "Expansion Plans",
  contract_award: "Contract Awards",
  product_launch: "Product Launches",
  regulatory_inspection: "US FDA Inspections",
  operational_disruption: "Operational Disruptions",
  labor_issue: "Labor Issues",
  name_change: "Name Changes",
  other: "Other Situations",
}

/**
 * Sentiment on tagged filing events. Nullable AND feature-gated: the field is
 * always present in the shape, emits `null` until the sentiment gate
 * (`OMNI_FILING_EVENT_SENTIMENT_ENABLED`) is on, and may be `null` per-row
 * whenever the classifier abstains.
 */
export const filingEventSentimentSchema = z.enum(["positive", "negative", "neutral"])
export type FilingEventSentiment = z.infer<typeof filingEventSentimentSchema>

// ---------------------------------------------------------------------------
// GET /v1/filings/events — tagged filing feed
// ---------------------------------------------------------------------------

export const filingEventSchema = z.object({
  object: z.literal("filing_event"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  ticker: z.string().nullable(),
  cik: z.string(),
  entityName: z.string().nullable().optional(),
  accessionNumber: z.string(),
  formType: z.string(),
  eightKItems: z.array(z.string()).default([]),
  /** Primary category (highest-confidence tag). */
  category: filingEventCategorySchema,
  /** Secondary categories, when one filing discloses several events. */
  categories: z.array(filingEventCategorySchema).default([]),
  summaryTitle: z.string(),
  summaryText: z.string(),
  sentiment: filingEventSentimentSchema.nullable(),
  /** Link to the durable situation this filing opened/advanced, when any. */
  situationId: z.string().nullable(),
  filedAt: z.string(),
  acceptedAt: z.string().nullable().optional(),
  documentUrl: z.string().url().nullable(),
  providerKey: z.string(),
  verification: dilutionVerificationSchema,
})

export type FilingEvent = z.infer<typeof filingEventSchema>

const commaListOf = <T extends z.ZodTypeAny>(item: T) =>
  z.union([z.array(item), z.string()]).optional()

export const filingsEventsQuerySchema = z.object({
  forms: commaListOf(z.string()),
  categories: commaListOf(filingEventCategorySchema),
  sentiment: filingEventSentimentSchema.optional(),
  tickers: commaListOf(z.string()),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional(),
  response_mode: z.enum(["compact", "standard", "verbose", "agent"]).optional(),
})

export type FilingsEventsQuery = z.infer<typeof filingsEventsQuerySchema>

// ---------------------------------------------------------------------------
// GET /v1/filings/diff — section-level diff report
// ---------------------------------------------------------------------------

/**
 * Pairwise section-level diff between two filings of the same form.
 * Extends (does not replace) the existing accession-pair endpoint
 * `GET /v1/filings/:accessionNumber/diff?compareWith=` (`filing_diff` object,
 * services/datastream-api/src/routes/filings.ts): `base`/`compare` reuse its
 * filing-ref shape and `summary` keeps its counters, so consumers can treat
 * `filing_diff_report` as a superset. New here: ticker/form/from/to pairing,
 * per-section deltas with materiality scores, redline hunks, and LLM summaries.
 */
export const filingSectionChangeTypeSchema = z.enum(["added", "removed", "modified", "unchanged"])
export type FilingSectionChangeType = z.infer<typeof filingSectionChangeTypeSchema>

export const filingDiffHunkSchema = z.object({
  type: z.enum(["added", "removed", "equal"]),
  text: z.string(),
})

export const filingSectionDeltaSchema = z.object({
  object: z.literal("filing_section_delta"),
  id: z.string(),
  /** Deterministic pair key: `{baseAccession}..{compareAccession}`. */
  pairId: z.string(),
  /** Canonical section key (e.g. "item_1a_risk_factors", "note_12_commitments"). */
  sectionKey: z.string(),
  sectionTitle: z.string().nullable(),
  changeType: filingSectionChangeTypeSchema,
  /** 0..1 — LLM-scored materiality of the change; null when scoring is unavailable. */
  materialityScore: z.number().min(0).max(1).nullable(),
  summaryMd: z.string().nullable(),
  addedChars: z.number().int().nonnegative(),
  removedChars: z.number().int().nonnegative(),
  /** Redline hunks. Empty for `unchanged`; may be truncated for very large sections. */
  hunks: z.array(filingDiffHunkSchema).default([]),
  hunksTruncated: z.boolean().default(false),
  providerKey: z.string(),
  verification: dilutionVerificationSchema,
})

export type FilingSectionDelta = z.infer<typeof filingSectionDeltaSchema>

const filingDiffFilingRefSchema = z.object({
  accessionNumber: z.string(),
  form: z.string(),
  filingDate: z.string().nullable(),
})

export const filingDiffReportSchema = z.object({
  object: z.literal("filing_diff_report"),
  pairId: z.string(),
  ticker: z.string().nullable(),
  cik: z.string().nullable(),
  form: z.string(),
  base: filingDiffFilingRefSchema,
  compare: filingDiffFilingRefSchema,
  summary: z.object({
    addedLines: z.number().int().nonnegative(),
    removedLines: z.number().int().nonnegative(),
    changedSections: z.array(z.string()).default([]),
    /** Max section materiality, 0..1; null when unscored. */
    materialityScore: z.number().min(0).max(1).nullable(),
  }),
  sections: z.array(filingSectionDeltaSchema).default([]),
  providerKey: z.string(),
})

export type FilingDiffReport = z.infer<typeof filingDiffReportSchema>

export const filingsDiffQuerySchema = z.object({
  ticker: z.string(),
  form: z.string(),
  /** Base filing selector: accession number or ISO date (nearest filing on/before). Defaults to the prior filing of `form`. */
  from: z.string().optional(),
  /** Compare filing selector: accession number or ISO date. Defaults to the latest filing of `form`. */
  to: z.string().optional(),
  /** Sections filter (canonical section keys). */
  sections: commaListOf(z.string()),
  /** Include redline hunks (default true; set false for summary-only). */
  include_hunks: z.union([z.boolean(), z.string()]).optional(),
  response_mode: z.enum(["compact", "standard", "verbose", "agent"]).optional(),
})

export type FilingsDiffQuery = z.infer<typeof filingsDiffQuerySchema>

// ---------------------------------------------------------------------------
// Footnote extensions (POST /v1/intelligence/footnotes/query)
// ---------------------------------------------------------------------------

/**
 * Newness of a footnote relative to the immediately-prior filing of the same
 * form: `new` (no matching note before), `changed` (matched note, content hash
 * differs), `recurring` (matched, unchanged). `any` disables the filter.
 */
export const footnoteNewnessSchema = z.enum(["new", "changed", "recurring", "any"])
export type FootnoteNewness = z.infer<typeof footnoteNewnessSchema>

/**
 * Newness as persisted on a footnote ROW. Unlike the request filter above,
 * a stored row is never `"any"` (that sentinel only disables the filter);
 * a row is `new`/`changed`/`recurring`, or null when unclassified.
 */
export const footnoteRowNewnessSchema = z.enum(["new", "changed", "recurring"])
export type FootnoteRowNewness = z.infer<typeof footnoteRowNewnessSchema>

/**
 * ADDITIVE request fields for `footnoteIntelligenceRequestSchema`
 * (investor-intelligence.ts). The existing schema is frozen and cannot be
 * mutated here (it is wrapped in `superRefine`); WS11 merges this shape into
 * the request parser. Both fields are optional so every existing request body
 * remains valid.
 */
export const footnoteQueryExtensionShape = {
  /** Filter matched notes by newness vs the prior filing. Default "any". */
  newness: footnoteNewnessSchema.optional(),
  /** Attach per-note records (`notes: filing_footnote[]`) to each filing result. Default false. */
  includeNotes: z.union([z.boolean(), z.string()]).optional(),
} as const

export const footnoteQueryExtensionSchema = z.object(footnoteQueryExtensionShape)
export type FootnoteQueryExtension = z.infer<typeof footnoteQueryExtensionSchema>

/** Persisted per-note record (`filing_footnotes` table). */
export const filingFootnoteSchema = z.object({
  object: z.literal("filing_footnote"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  ticker: z.string().nullable(),
  cik: z.string(),
  accessionNumber: z.string(),
  formType: z.string(),
  /** 0-based position of the note within the filing's footnote sequence. */
  noteIndex: z.number().int().nonnegative(),
  title: z.string().nullable(),
  /** Matches footnoteTopicSchema values (investor-intelligence.ts); null = untopiced. */
  topic: z.string().nullable(),
  /** SHA-256 of the normalized note text; the newness join key across filings. */
  contentHash: z.string(),
  charStart: z.number().int().nonnegative().nullable(),
  charEnd: z.number().int().nonnegative().nullable(),
  newness: footnoteRowNewnessSchema.nullable(),
  /** Accession of the prior-filing note this one was matched against, when any. */
  priorAccessionNumber: z.string().nullable(),
  summaryMd: z.string().nullable(),
  filedAt: z.string(),
  providerKey: z.string(),
})

export type FilingFootnote = z.infer<typeof filingFootnoteSchema>

/**
 * ADDITIVE response fields for `footnoteFilingResultSchema`
 * (investor-intelligence.ts): populated only when the request set
 * `includeNotes: true`.
 */
export const footnoteCollectionNotesExtensionShape = {
  notes: z.array(filingFootnoteSchema).default([]).optional(),
} as const

// ---------------------------------------------------------------------------
// Earnings transcripts (persisted; complements live GET /v1/earnings/transcripts)
// ---------------------------------------------------------------------------

export const earningsTranscriptSpeakerSchema = z.object({
  name: z.string(),
  role: z.string().nullable(),
  organization: z.string().nullable(),
  /** "management" | "analyst" | "operator" | "unknown" */
  affiliation: z.enum(["management", "analyst", "operator", "unknown"]),
})

export const earningsTranscriptSegmentSchema = z.object({
  speaker: earningsTranscriptSpeakerSchema,
  /** "prepared_remarks" | "qa" */
  session: z.enum(["prepared_remarks", "qa"]),
  text: z.string(),
})

export const earningsTranscriptSchema = z.object({
  object: z.literal("earnings_transcript"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  ticker: z.string().nullable(),
  cik: z.string(),
  accessionNumber: z.string(),
  /** Exhibit within the filing the transcript was extracted from (e.g. "EX-99.1"). */
  exhibit: z.string().nullable(),
  fiscalPeriod: z.string().nullable(),
  callDate: z.string().nullable(),
  speakers: z.array(earningsTranscriptSpeakerSchema).default([]),
  /** True when prepared remarks and Q&A were separably identified. */
  qaSplit: z.boolean(),
  segments: z.array(earningsTranscriptSegmentSchema).default([]),
  summaryMd: z.string().nullable(),
  filedAt: z.string(),
  documentUrl: z.string().url().nullable(),
  providerKey: z.string(),
  verification: dilutionVerificationSchema,
})

export type EarningsTranscript = z.infer<typeof earningsTranscriptSchema>

// ---------------------------------------------------------------------------
// WS11 additive blocks (OMNI-5123) — appended after the frozen contract.
// ---------------------------------------------------------------------------

export const filingEventPublicSchema = z.object({
  object: z.literal("filing_event"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  ticker: z.string().nullable(),
  cik: z.string(),
  entityName: z.string().nullable().optional(),
  accessionNumber: z.string(),
  formType: z.string(),
  eightKItems: z.array(z.string()).default([]),
  category: filingEventCategorySchema,
  categories: z.array(filingEventCategorySchema).default([]),
  summaryTitle: z.string(),
  summaryText: z.string(),
  situationId: z.string().nullable(),
  filedAt: z.string(),
  acceptedAt: z.string().nullable().optional(),
  documentUrl: z.string().url().nullable(),
  providerKey: z.string(),
  verification: dilutionVerificationSchema,
})
export type FilingEventPublic = z.infer<typeof filingEventPublicSchema>

// Compile-time guard: the public schema must equal the full schema minus
// `sentiment`. If a field is added to filingEventSchema, this assignment errors
// until filingEventPublicSchema is updated in lockstep.
type _AssertPublicMatchesFull = FilingEventPublic extends Omit<FilingEvent, "sentiment">
  ? Omit<FilingEvent, "sentiment"> extends FilingEventPublic
    ? true
    : never
  : never
const _filingEventPublicParityCheck: _AssertPublicMatchesFull = true
void _filingEventPublicParityCheck

export const earningsTranscriptsQuerySchema = z.object({
  tickers: commaListOf(z.string()),
  cik: z.string().optional(),
  fiscal_period: z.string().optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional(),
  response_mode: z.enum(["compact", "standard", "verbose", "agent"]).optional(),
})

export type EarningsTranscriptsQuery = z.infer<typeof earningsTranscriptsQuerySchema>

// ---------------------------------------------------------------------------
// Structured guidance extraction (guidance.extracted; feeds the estimates plane)
// ---------------------------------------------------------------------------

/**
 * A structured, queryable guidance statement extracted from an earnings
 * transcript / EX-99 press release. Additive WS11 shape (the frozen contract
 * doc reserved the `guidance.extracted` event and named a "queryable table" but
 * left the row shape to the implementing workstream — see escalation note in
 * the WS11 PR). `metric`/`direction`/`period` are nullable per the "null means
 * not-determinable, never guessed" principle.
 */
export const guidanceDirectionSchema = z.enum(["raised", "lowered", "reaffirmed", "initiated", "withdrawn"])
export type GuidanceDirection = z.infer<typeof guidanceDirectionSchema>

export const filingGuidanceSchema = z.object({
  object: z.literal("filing_guidance"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  ticker: z.string().nullable(),
  cik: z.string(),
  accessionNumber: z.string(),
  /** Parent transcript row (etr_...) this guidance was extracted from, when any. */
  transcriptId: z.string().nullable(),
  fiscalPeriod: z.string().nullable(),
  /** Guidance target period (e.g. "FY2026", "Q4 2026"); null when unspecified. */
  guidancePeriod: z.string().nullable(),
  /** Normalized metric label (e.g. "revenue", "eps", "operating_margin"). */
  metric: z.string(),
  direction: guidanceDirectionSchema.nullable(),
  valueLow: z.number().nullable(),
  valueHigh: z.number().nullable(),
  unit: z.string().nullable(),
  /** Verbatim guidance sentence(s) supporting the extraction. */
  citedText: z.string().nullable(),
  filedAt: z.string(),
  providerKey: z.string(),
  verification: dilutionVerificationSchema,
})

export type FilingGuidance = z.infer<typeof filingGuidanceSchema>

export const filingGuidanceQuerySchema = z.object({
  tickers: commaListOf(z.string()),
  cik: z.string().optional(),
  metric: z.string().optional(),
  direction: guidanceDirectionSchema.optional(),
  fiscal_period: z.string().optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional(),
  response_mode: z.enum(["compact", "standard", "verbose", "agent"]).optional(),
})

export type FilingGuidanceQuery = z.infer<typeof filingGuidanceQuerySchema>

// ---------------------------------------------------------------------------
// GET /v1/intelligence/coverage — AI coverage-report composer
// ---------------------------------------------------------------------------

/**
 * A composed "coverage report" for a single issuer: a rollup over the persisted
 * filings-intelligence stores (tagged events, section deltas, footnote newness,
 * transcripts + guidance) plus the existing /v1/intelligence/* bundles. Read
 * model only — never persisted; every nested item is a subset of an object
 * defined above.
 */
export const coverageReportSectionSchema = z.object({
  key: z.string(),
  title: z.string(),
  summaryMd: z.string().nullable(),
  /** Compact items (shape depends on `key`); always a subset of a plane object. */
  items: z.array(z.record(z.string(), z.unknown())).default([]),
})

export const filingCoverageReportSchema = z.object({
  object: z.literal("filing_coverage_report"),
  ticker: z.string().nullable(),
  cik: z.string().nullable(),
  entityName: z.string().nullable(),
  generatedAt: z.string(),
  /** Windows summarized across the report (ISO dates). */
  window: z.object({ from: z.string().nullable(), to: z.string().nullable() }),
  headlineMd: z.string().nullable(),
  sections: z.array(coverageReportSectionSchema).default([]),
  counts: z.object({
    taggedEvents: z.number().int().nonnegative(),
    sectionDeltas: z.number().int().nonnegative(),
    newFootnotes: z.number().int().nonnegative(),
    transcripts: z.number().int().nonnegative(),
    guidanceStatements: z.number().int().nonnegative(),
  }),
})

export type FilingCoverageReport = z.infer<typeof filingCoverageReportSchema>

export const filingCoverageReportQuerySchema = z.object({
  ticker: z.string().optional(),
  cik: z.string().optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  response_mode: z.enum(["compact", "standard", "verbose", "agent"]).optional(),
})

export type FilingCoverageReportQuery = z.infer<typeof filingCoverageReportQuerySchema>
