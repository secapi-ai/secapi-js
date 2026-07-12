/**
 * Situations-plane contracts (OMNI-5118, Wave A — WS10).
 *
 * FROZEN INTERFACE CONTRACT. These shapes are the permanent customer-facing
 * surface for the special-situations intelligence plane. Changes require
 * supervisor escalation per docs/designs/wave-a-intelligence-contracts.md.
 *
 * Two related taxonomies (the most permanent decision in Wave A):
 *
 *   1. `situation_type` — DURABLE, multi-filing situations with a lifecycle
 *      (announced → pending → completed | terminated | expired). One
 *      `situation` row aggregates many filings over months/years. Modeled on
 *      the merged Special Situations Digest 27-category database + their
 *      live-feed type/subtype pairs.
 *
 *   2. `filing_event_category` — PER-FILING tagging of 8-K / 6-K disclosures
 *      (StockInsights-style ai_insights). One `filing_event` row per tagged
 *      filing. Lives in `filings-intelligence.ts`; the canonical
 *      category → situation_type mapping lives here
 *      (`FILING_EVENT_CATEGORY_TO_SITUATION_TYPE`).
 *
 * Endpoints frozen here (registration in openapi.ts + api-surface-registry
 * happens when WS10 ships; all shapes are UNRELEASED until then):
 *   GET /v1/situations               — filterable list
 *   GET /v1/situations/:id           — detail incl. per-filing timeline
 *   GET /v1/situations/feed          — reverse-chron enriched event feed
 *   GET /v1/situations/calendar      — upcoming key dates (record/vote/expiry/close)
 *   GET /v1/situations/stats         — counts by type/status/sector
 *   GET /v1/situations/performance   — closed-situation outcomes / base rates
 *   GET /v1/situations/:id/underwriting-pack — source-cited agent-ready research bundle
 *
 * Persistence: `situations` + `situation_events` (Postgres, enforcement_actions
 * pattern) — see services/datastream-api/migrations/drafts/wave_a_situations.sql.
 *
 * ID prefixes: `sit_` (situation), `sevt_` (situation_event).
 */
import { z } from "zod"
import {
  degradedStateSchema,
  freshnessMetadataSchema,
  materializationMetadataSchema,
  methodologyMetadataSchema,
  revisionMetadataSchema,
  sourceRightsMetadataSchema,
} from "./foundation.js"
import { provenanceSchema } from "./schemas.js"
import { dilutionVerificationSchema } from "./dilution.js"
import { filingEventCategorySchema, type FilingEventCategory } from "./filings-intelligence.js"

// ---------------------------------------------------------------------------
// Taxonomy 1: situation_type (durable situations)
// ---------------------------------------------------------------------------

/**
 * Canonical situation types. Merges the Special Situations Digest database
 * categories (27) with their live-feed event types. Lifecycle-only SSD
 * categories intentionally do NOT get their own type:
 *   - "Deal Terminations" / "Busted M&A"  → status: "terminated" on the deal type
 *   - "Bankruptcy Exits"                  → subtype: "emergence" on `bankruptcy`
 *   - "Issuer Tenders"                    → subtype: "self_tender" on `tender_offer`
 *   - "Carve-Outs"                        → subtype: "carve_out" on `divestiture`
 *   - "Rights Offerings"                  → subtype: "rights_offering" on `capital_raise`
 * Full mapping table: docs/designs/wave-a-intelligence-contracts.md §2.3.
 */
export const SITUATION_TYPES = [
  "merger",
  "tender_offer",
  "going_private",
  "spin_off",
  "divestiture",
  "activist_campaign",
  "restructuring",
  "bankruptcy",
  "liquidation",
  "strategic_review",
  "capital_return",
  "capital_raise",
  "spac",
  "delisting",
  "relisting",
  "litigation",
  "management_change",
  "domicile_change",
  "demutualization",
  "other",
] as const

export const situationTypeSchema = z.enum(SITUATION_TYPES)
export type SituationType = z.infer<typeof situationTypeSchema>

/**
 * Per-type subtypes. `subtype` is nullable on the wire — a situation whose
 * subtype is not yet determinable carries `null`, never a guessed value.
 * Note: de-SPAC business combinations are `merger`/`spac_merger`; the `spac`
 * type covers SPAC-vehicle lifecycle only (IPO, extensions, trust liquidation).
 */
export const SITUATION_SUBTYPES_BY_TYPE = {
  merger: ["definitive", "preliminary", "unsolicited", "rumor_response", "scheme_of_arrangement", "spac_merger"],
  tender_offer: ["self_tender", "third_party", "exchange_offer", "unsolicited"],
  going_private: ["management_buyout", "sponsor_buyout", "squeeze_out"],
  spin_off: ["spin_off", "split_off", "carve_out_ipo"],
  divestiture: ["asset_sale", "joint_venture", "carve_out"],
  activist_campaign: ["stake_disclosure", "proxy_contest", "cooperation_agreement", "settlement"],
  restructuring: ["debt_for_equity_swap", "exchange_offer", "out_of_court", "operational"],
  bankruptcy: ["chapter_11", "chapter_7", "chapter_15", "administration", "prepackaged", "emergence"],
  liquidation: ["plan_of_liquidation", "dissolution"],
  strategic_review: ["formal_alternatives", "sale_process"],
  capital_return: ["buyback_authorization", "special_dividend", "recapitalization"],
  capital_raise: ["rights_offering", "public_offering", "private_placement", "pipe", "atm_program"],
  spac: ["ipo", "extension", "trust_liquidation"],
  delisting: ["forced", "voluntary"],
  relisting: ["uplisting", "otc_relisting"],
  litigation: ["won", "lost", "settled"],
  management_change: ["ceo", "cfo", "chair", "board"],
  domicile_change: ["redomiciliation"],
  demutualization: [],
  other: [],
} as const satisfies Record<SituationType, readonly string[]>

type SituationSubtypeLiteral =
  (typeof SITUATION_SUBTYPES_BY_TYPE)[SituationType][number]

const ALL_SITUATION_SUBTYPES = [
  ...new Set(Object.values(SITUATION_SUBTYPES_BY_TYPE).flat()),
] as unknown as [SituationSubtypeLiteral, ...SituationSubtypeLiteral[]]

export const situationSubtypeSchema = z.enum(ALL_SITUATION_SUBTYPES)
export type SituationSubtype = z.infer<typeof situationSubtypeSchema>

/**
 * Lifecycle statuses (frozen):
 *   rumored    — credible press/rumor-response disclosure; no definitive filing yet
 *   announced  — definitive public disclosure filed (the anchor filing)
 *   pending    — signed/underway; awaiting votes, approvals, tender expiry, court
 *   completed  — consummated (deal closed, plan effective, emergence done)
 *   terminated — abandoned, withdrawn, rejected, or busted (SSD "Deal Terminations"/"Busted M&A")
 *   expired    — lapsed by its own terms without consummation (tender/rights expiry)
 * Legal transitions: rumored→announced|terminated; announced→pending|completed|terminated|expired;
 * pending→completed|terminated|expired. `completed`/`terminated`/`expired` are terminal.
 */
export const SITUATION_STATUSES = ["rumored", "announced", "pending", "completed", "terminated", "expired"] as const

export const situationStatusSchema = z.enum(SITUATION_STATUSES)
export type SituationStatus = z.infer<typeof situationStatusSchema>

/**
 * Market-cap buckets (USD, at situation announcement):
 *   nano < $50M ≤ micro < $300M ≤ small < $2B ≤ mid < $10B ≤ large < $200B ≤ mega
 */
export const MARKET_CAP_BUCKETS = ["nano", "micro", "small", "mid", "large", "mega"] as const
export const marketCapBucketSchema = z.enum(MARKET_CAP_BUCKETS)
export type MarketCapBucket = z.infer<typeof marketCapBucketSchema>

/** Matches the existing live M&A classifier's ConsiderationType (services/datastream-api/src/lib/filing-events.ts). */
export const situationConsiderationTypeSchema = z.enum(["cash", "stock", "mixed", "unspecified"])
export type SituationConsiderationType = z.infer<typeof situationConsiderationTypeSchema>

// ---------------------------------------------------------------------------
// Form-type detection map
// ---------------------------------------------------------------------------

/**
 * Which SEC form types (and 8-K items) open or advance each situation type.
 * `forms` use EDGAR form-type spellings; `424B*` matches any 424B variant.
 * `eightKItems` apply only when an `8-K`/`8-K/A` (or `6-K` analog) is filed.
 * Detection is a trigger map, not a proof map — a matching form starts
 * classification; the extractor confirms before a situation row is written.
 */
export const SITUATION_FORM_DETECTION = {
  merger: { forms: ["8-K", "425", "S-4", "F-4", "DEFM14A", "DEFC14A", "DFAN14A", "PREM14A", "SC 13D", "SC 13D/A"], eightKItems: ["1.01", "1.02", "2.01", "8.01"] },
  tender_offer: { forms: ["SC TO-T", "SC TO-I", "SC TO-C", "SC 14D9", "8-K"], eightKItems: ["8.01"] },
  going_private: { forms: ["SC 13E-3", "PREM14A", "DEFM14A", "SC TO-I", "8-K"], eightKItems: ["1.01", "8.01"] },
  spin_off: { forms: ["10-12B", "8-K", "S-1"], eightKItems: ["1.01", "8.01"] },
  divestiture: { forms: ["8-K"], eightKItems: ["1.01", "2.01", "8.01"] },
  activist_campaign: { forms: ["SC 13D", "SC 13D/A", "DFAN14A", "DEFC14A", "PREC14A", "PX14A6G"], eightKItems: ["5.02", "8.01"] },
  restructuring: { forms: ["8-K", "T-3", "S-4"], eightKItems: ["1.01", "1.02", "2.03", "3.02", "8.01"] },
  bankruptcy: { forms: ["8-K", "25-NSE", "15-12B", "15-12G"], eightKItems: ["1.03", "3.01", "8.01"] },
  liquidation: { forms: ["8-K", "PREM14A", "DEFM14A"], eightKItems: ["1.03", "8.01"] },
  strategic_review: { forms: ["8-K"], eightKItems: ["8.01"] },
  capital_return: { forms: ["8-K"], eightKItems: ["8.01"] },
  capital_raise: { forms: ["8-K", "S-1", "S-3", "424B*", "F-1", "F-3"], eightKItems: ["1.01", "2.03", "3.02", "8.01"] },
  spac: { forms: ["8-K", "S-1", "424B*", "DEF 14A", "PREM14A"], eightKItems: ["1.01", "3.02", "5.07", "8.01"] },
  delisting: { forms: ["25-NSE", "25", "15-12B", "15-12G", "8-K"], eightKItems: ["3.01"] },
  relisting: { forms: ["8-K", "8-A12B", "8-A12G"], eightKItems: ["3.01", "8.01"] },
  litigation: { forms: ["8-K"], eightKItems: ["1.01", "8.01"] },
  management_change: { forms: ["8-K"], eightKItems: ["5.02"] },
  domicile_change: { forms: ["8-K", "S-4", "F-4", "DEFM14A", "PREM14A"], eightKItems: ["3.03", "5.03", "8.01"] },
  demutualization: { forms: ["8-K", "S-1", "PREM14A", "DEFM14A"], eightKItems: ["1.01", "8.01"] },
  other: { forms: ["8-K", "6-K"], eightKItems: ["8.01"] },
} as const satisfies Record<SituationType, { forms: readonly string[]; eightKItems: readonly string[] }>

// ---------------------------------------------------------------------------
// filing_event_category → situation_type mapping
// ---------------------------------------------------------------------------

/**
 * Which durable situation type (if any) a per-filing event category can open
 * or advance. `null` = the category is informational only and never creates a
 * situation (earnings, conferences, product launches, …). The inverse mapping
 * (situation types whose timeline entries commonly carry each category) is
 * documented in docs/designs/wave-a-intelligence-contracts.md §2.4.
 */
export const FILING_EVENT_CATEGORY_TO_SITUATION_TYPE: Record<FilingEventCategory, SituationType | null> = {
  merger_acquisition: "merger",
  tender_offer: "tender_offer",
  going_private: "going_private",
  spin_off: "spin_off",
  divestiture: "divestiture",
  activist_activity: "activist_campaign",
  restructuring: "restructuring",
  bankruptcy: "bankruptcy",
  liquidation: "liquidation",
  strategic_review: "strategic_review",
  capital_return: "capital_return",
  securities_offering: "capital_raise",
  delisting_action: "delisting",
  relisting_action: "relisting",
  legal_dispute: "litigation",
  management_change: "management_change",
  domicile_change: "domicile_change",
  // insider_transaction is a per-filing SIGNAL, not a durable situation: an
  // insider Form 4 purchase has no announced→pending→completed lifecycle, so
  // it stays a filing_event_category only and opens no situation (supervisor
  // review, decision D3). See docs §7.
  insider_transaction: null,
  // Informational categories — never open a situation on their own.
  earnings_report: null,
  earnings_call: null,
  guidance_update: null,
  investor_conference: null,
  expansion: null,
  contract_award: null,
  product_launch: null,
  regulatory_inspection: null,
  operational_disruption: null,
  labor_issue: null,
  accounting_change: null,
  auditor_change: null,
  // A distress / payment-default disclosure does NOT by itself open a
  // restructuring situation — mapping it to `restructuring` would hurt
  // precision on the public feed. A `restructuring` situation opens only on
  // actual restructuring filings (debt-for-equity swaps, exchange offers,
  // plan filings). Supervisor review, decision D4. See docs §7.
  financial_distress: null,
  payment_default: null,
  credit_rating: null,
  capital_structure: null,
  dividend_policy: "capital_return",
  investment: null,
  ipo: null,
  name_change: null,
  other: null,
}

// ---------------------------------------------------------------------------
// Resource objects
// ---------------------------------------------------------------------------

const situationInvestorMetadataShape = {
  provenance: provenanceSchema,
  freshness: freshnessMetadataSchema.optional(),
  materialization: materializationMetadataSchema.optional(),
  sourceRights: sourceRightsMetadataSchema,
  methodology: methodologyMetadataSchema.optional(),
  revision: revisionMetadataSchema.optional(),
  degradedState: degradedStateSchema.nullable().optional(),
} as const

/** Deal economics. All monetary fields are USD; `null` = not disclosed / not applicable. */
export const situationTermsSchema = z.object({
  counterparty: z.string().nullable().optional(),
  counterpartyTicker: z.string().nullable().optional(),
  stakePct: z.number().min(0).max(100).nullable().optional(),
  dealValueUsd: z.number().nullable().optional(),
  pricePerShare: z.number().nullable().optional(),
  considerationType: situationConsiderationTypeSchema.nullable().optional(),
  premiumPct: z.number().nullable().optional(),
})

export type SituationTerms = z.infer<typeof situationTermsSchema>

/** Key dates (ISO YYYY-MM-DD). `null` = not yet known / not applicable. */
export const situationKeyDatesSchema = z.object({
  announced: z.string().nullable(),
  record: z.string().nullable().optional(),
  vote: z.string().nullable().optional(),
  expiry: z.string().nullable().optional(),
  expectedClose: z.string().nullable().optional(),
  completed: z.string().nullable().optional(),
  terminated: z.string().nullable().optional(),
})

export type SituationKeyDates = z.infer<typeof situationKeyDatesSchema>

/** Market join fields snapshotted from the market plane; never extracted from filings. */
export const situationMarketContextSchema = z.object({
  price: z.number().nullable().optional(),
  marketCapUsd: z.number().nullable().optional(),
  marketCapBucket: marketCapBucketSchema.nullable().optional(),
  enterpriseValueUsd: z.number().nullable().optional(),
  asOf: z.string().nullable().optional(),
})

export type SituationMarketContext = z.infer<typeof situationMarketContextSchema>

export const situationSchema = z.object({
  object: z.literal("situation"),
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  livemode: z.boolean(),
  type: situationTypeSchema,
  subtype: situationSubtypeSchema.nullable(),
  status: situationStatusSchema,
  statusUpdatedAt: z.string(),
  ticker: z.string().nullable(),
  cik: z.string(),
  entityName: z.string(),
  exchange: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  sector: z.string().nullable().optional(),
  headline: z.string(),
  summaryMd: z.string().nullable().optional(),
  /** One-line business profile of the filing company (situations-quality-overhaul). */
  businessProfile: z.string().nullable().optional(),
  terms: situationTermsSchema,
  keyDates: situationKeyDatesSchema,
  market: situationMarketContextSchema,
  /** Accession numbers of every filing folded into this situation, oldest first. */
  sourceAccessions: z.array(z.string()).default([]),
  eventCount: z.number().int().nonnegative(),
  latestEventAt: z.string().nullable(),
  providerKey: z.string(),
  verification: dilutionVerificationSchema,
  ...situationInvestorMetadataShape,
})

export type Situation = z.infer<typeof situationSchema>

/** One per-filing timeline entry inside a situation. */
export const situationEventSchema = z.object({
  object: z.literal("situation_event"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  situationId: z.string(),
  occurredAt: z.string(),
  accessionNumber: z.string(),
  formType: z.string(),
  eightKItems: z.array(z.string()).default([]),
  category: filingEventCategorySchema.nullable(),
  title: z.string(),
  summaryMd: z.string().nullable().optional(),
  statusBefore: situationStatusSchema.nullable(),
  statusAfter: situationStatusSchema.nullable(),
  documentUrl: z.string().url().nullable(),
  providerKey: z.string(),
  verification: dilutionVerificationSchema,
})

export type SituationEvent = z.infer<typeof situationEventSchema>

export const situationDetailSchema = situationSchema.extend({
  /** Full per-filing timeline, oldest first. */
  events: z.array(situationEventSchema).default([]),
})

export type SituationDetail = z.infer<typeof situationDetailSchema>

/** Immutable, numbered weekly publication made from frozen situation snapshots. */
export const situationWeeklyIssueSituationSchema = z.object({
  id: z.string(),
  type: situationTypeSchema,
  subtype: situationSubtypeSchema.nullable(),
  status: situationStatusSchema,
  ticker: z.string().nullable(),
  cik: z.string(),
  entityName: z.string(),
  headline: z.string(),
  summaryMd: z.string().nullable(),
  businessProfile: z.string().nullable(),
  terms: situationTermsSchema,
  keyDates: situationKeyDatesSchema,
  sourceAccessions: z.array(z.string()),
  eventCount: z.number().int().nonnegative(),
  latestEventAt: z.string().nullable(),
})

/** Frozen, source-citable filing-event data for a weekly issue. */
export const situationWeeklyIssueEventSchema = z.object({
  object: z.literal("situation_event"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  situationId: z.string(),
  occurredAt: z.string(),
  accessionNumber: z.string(),
  formType: z.string(),
  eightKItems: z.array(z.string()).default([]),
  category: filingEventCategorySchema.nullable(),
  title: z.string(),
  summaryMd: z.string().nullable().optional(),
  statusBefore: situationStatusSchema.nullable(),
  statusAfter: situationStatusSchema.nullable(),
  documentUrl: z.string().url().nullable(),
})

export const situationWeeklyIssueSchema = z.object({
  object: z.literal("situation_weekly_issue"),
  id: z.string(),
  issueNumber: z.number().int().positive(),
  slug: z.string(),
  periodStart: z.string(),
  periodEnd: z.string(),
  title: z.string(),
  summaryMd: z.string().nullable(),
  markdown: z.string(),
  sourceSituationIds: z.array(z.string()),
  sourceEventIds: z.array(z.string()),
  sourceEvents: z.array(situationWeeklyIssueEventSchema).default([]),
  publishedAt: z.string(),
  situations: z.array(situationWeeklyIssueSituationSchema),
})

export type SituationWeeklyIssue = z.infer<typeof situationWeeklyIssueSchema>

export const situationWeeklyIssueListSchema = z.object({
  object: z.literal("list"),
  data: z.array(situationWeeklyIssueSchema),
  hasMore: z.boolean(),
  nextCursor: z.string().nullable(),
})

export type SituationWeeklyIssueList = z.infer<typeof situationWeeklyIssueListSchema>

// ---------------------------------------------------------------------------
// Special Situations customer projections (additive, T3)
//
// These are ADDITIVE views over the frozen `situation` resource — a minimal
// projection for high-volume lookups and a compact summary. They do NOT modify
// or re-order any field on `situationSchema`/`situationDetailSchema`; each field
// is copied verbatim from the durable situation row.
// ---------------------------------------------------------------------------

/**
 * Minimal situation projection (`enrich=false`). A stable, low-payload subset of
 * the frozen `situation` resource for list/lookup surfaces that do not need the
 * full terms/market/verification blocks. `formTypes` are the EDGAR form types
 * present on this situation's timeline; `sourceUrl` is the anchor filing URL.
 */
export const situationStrippedSchema = z.object({
  object: z.literal("situation_stripped"),
  id: z.string(),
  type: situationTypeSchema,
  subtype: situationSubtypeSchema.nullable(),
  status: situationStatusSchema,
  ticker: z.string().nullable(),
  cik: z.string(),
  entityName: z.string(),
  headline: z.string(),
  announced: z.string().nullable(),
  formTypes: z.array(z.string()).default([]),
  sourceUrl: z.string().nullable(),
})

export type SituationStripped = z.infer<typeof situationStrippedSchema>

/** Compact summary: rendered markdown + deal terms + the latest timeline event. */
export const situationSummarySchema = z.object({
  object: z.literal("situation_summary"),
  id: z.string(),
  summaryMd: z.string().nullable(),
  terms: situationTermsSchema,
  latestEvent: situationEventSchema.nullable(),
})

export type SituationSummary = z.infer<typeof situationSummarySchema>

/**
 * Deterministic, source-cited research bundle for a single situation. The
 * bundle preserves the canonical detail and event timeline; it does not pull
 * internal-only enrichment or manufacture an additional investment narrative.
 */
export const situationUnderwritingPackSchema = z.object({
  object: z.literal("situation_underwriting_pack"),
  id: z.string(),
  generatedAt: z.string(),
  research: z.object({
    headline: z.string(),
    businessProfile: z.string().nullable(),
    narrative: z.string().nullable(),
  }),
  situation: situationDetailSchema,
  markdown: z.string(),
})

export type SituationUnderwritingPack = z.infer<typeof situationUnderwritingPackSchema>

/**
 * Allow-list of EDGAR form types that resolve a Special Situations `by-form`
 * lookup. A superset-safe subset of the trigger forms in
 * `SITUATION_FORM_DETECTION` — the distinctive special-situations forms a
 * customer would filter on. `by-form` rejects any form outside this list.
 */
export const SITUATION_LOOKUP_FORMS = [
  "SC 13D",
  "SC 13D/A",
  "SC TO-T",
  "SC TO-I",
  "SC TO-C",
  "SC 14D9",
  "425",
  "SC 13E-3",
  "DEFM14A",
  "PREM14A",
  "10-12B",
  "25-NSE",
] as const

export type SituationLookupForm = (typeof SITUATION_LOOKUP_FORMS)[number]

/** Case/space/hyphen-insensitive canonicalization for form matching. */
function canonicalizeForm(form: string): string {
  return form.trim().toUpperCase().replace(/\s+/g, " ").replace(/\/A\d*$/, "").replace(/-/g, "")
}

/**
 * Invert `SITUATION_FORM_DETECTION`: given an EDGAR form type, return every
 * durable `situation_type` whose detection map lists that form as a trigger.
 * Canonicalizes both sides (space/hyphen/amendment-insensitive) so feed
 * spellings (`SC 13E3`, `SC 13D/A`) resolve to the same set. Returns `[]` for a
 * form that opens no situation type. `424B*` wildcards match any 424B variant.
 */
export function formToSituationTypes(form: string): SituationType[] {
  const canon = canonicalizeForm(form)
  if (!canon) return []
  const matched: SituationType[] = []
  for (const [type, detection] of Object.entries(SITUATION_FORM_DETECTION) as Array<
    [SituationType, (typeof SITUATION_FORM_DETECTION)[SituationType]]
  >) {
    const hit = detection.forms.some((trigger) => {
      const t = canonicalizeForm(trigger)
      return t.endsWith("*") ? canon.startsWith(t.slice(0, -1)) : canon === t
    })
    if (hit) matched.push(type)
  }
  return matched
}

/** Feed item: a situation event enriched with its parent situation summary (reverse-chron). */
export const situationFeedItemSchema = z.object({
  object: z.literal("situation_feed_item"),
  event: situationEventSchema,
  situation: z.object({
    id: z.string(),
    type: situationTypeSchema,
    subtype: situationSubtypeSchema.nullable(),
    status: situationStatusSchema,
    ticker: z.string().nullable(),
    entityName: z.string(),
    headline: z.string(),
    market: situationMarketContextSchema,
  }),
})

export type SituationFeedItem = z.infer<typeof situationFeedItemSchema>

export const SITUATION_CALENDAR_DATE_TYPES = ["record", "vote", "expiry", "expected_close"] as const
export const situationCalendarDateTypeSchema = z.enum(SITUATION_CALENDAR_DATE_TYPES)

export const situationCalendarEntrySchema = z.object({
  object: z.literal("situation_calendar_entry"),
  date: z.string(),
  dateType: situationCalendarDateTypeSchema,
  situationId: z.string(),
  type: situationTypeSchema,
  subtype: situationSubtypeSchema.nullable(),
  status: situationStatusSchema,
  ticker: z.string().nullable(),
  entityName: z.string(),
  headline: z.string(),
})

export type SituationCalendarEntry = z.infer<typeof situationCalendarEntrySchema>

export const situationStatsSchema = z.object({
  object: z.literal("situation_stats"),
  asOf: z.string(),
  window: z.string().nullable(),
  total: z.number().int().nonnegative(),
  byType: z.record(z.string(), z.number().int().nonnegative()),
  byStatus: z.record(z.string(), z.number().int().nonnegative()),
  bySector: z.record(z.string(), z.number().int().nonnegative()),
  byMarketCapBucket: z.record(z.string(), z.number().int().nonnegative()),
})

export type SituationStats = z.infer<typeof situationStatsSchema>

/** One outcome cohort (type or type+subtype) over closed situations. */
export const situationPerformanceCohortSchema = z.object({
  type: situationTypeSchema,
  subtype: situationSubtypeSchema.nullable(),
  closedCount: z.number().int().nonnegative(),
  completedCount: z.number().int().nonnegative(),
  terminatedCount: z.number().int().nonnegative(),
  expiredCount: z.number().int().nonnegative(),
  /** completedCount / closedCount, 0..1. Null when closedCount is 0. */
  completionRate: z.number().min(0).max(1).nullable(),
  medianDaysToClose: z.number().nullable(),
  avgPremiumPct: z.number().nullable(),
})

export const situationPerformanceSchema = z.object({
  object: z.literal("situation_performance"),
  asOf: z.string(),
  window: z.string().nullable(),
  cohorts: z.array(situationPerformanceCohortSchema).default([]),
})

export type SituationPerformance = z.infer<typeof situationPerformanceSchema>

// ---------------------------------------------------------------------------
// Query contracts (GET query params, snake_case on the wire per /v1 convention;
// arrays accept comma-separated values)
// ---------------------------------------------------------------------------

const commaListOf = <T extends z.ZodTypeAny>(item: T) =>
  z.union([z.array(item), z.string()]).optional()

export const situationsListQuerySchema = z.object({
  types: commaListOf(situationTypeSchema),
  subtypes: commaListOf(situationSubtypeSchema),
  statuses: commaListOf(situationStatusSchema),
  tickers: commaListOf(z.string()),
  forms: commaListOf(z.string()),
  sectors: commaListOf(z.string()),
  market_cap: commaListOf(marketCapBucketSchema),
  country: z.string().optional(),
  announced_from: z.string().optional(),
  announced_to: z.string().optional(),
  updated_from: z.string().optional(),
  enrich: z.enum(["true", "false"]).optional(),
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional(),
  response_mode: z.enum(["compact", "standard", "verbose", "agent"]).optional(),
})

export type SituationsListQuery = z.infer<typeof situationsListQuerySchema>

export const situationsFeedQuerySchema = z.object({
  types: commaListOf(situationTypeSchema),
  categories: commaListOf(filingEventCategorySchema),
  tickers: commaListOf(z.string()),
  since: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional(),
  response_mode: z.enum(["compact", "standard", "verbose", "agent"]).optional(),
})

export type SituationsFeedQuery = z.infer<typeof situationsFeedQuerySchema>

export const situationsCalendarQuerySchema = z.object({
  types: commaListOf(situationTypeSchema),
  date_types: commaListOf(situationCalendarDateTypeSchema),
  tickers: commaListOf(z.string()),
  days: z.number().int().min(1).max(365).optional(),
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional(),
})

export type SituationsCalendarQuery = z.infer<typeof situationsCalendarQuerySchema>

export const situationsPerformanceQuerySchema = z.object({
  types: commaListOf(situationTypeSchema),
  window: z.string().optional(),
  group_by: z.enum(["type", "subtype"]).optional(),
})

export type SituationsPerformanceQuery = z.infer<typeof situationsPerformanceQuerySchema>
