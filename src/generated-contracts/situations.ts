import { z } from "zod"
import { dilutionVerificationSchema } from "./dilution.js"

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

export const SITUATION_SUBTYPES = [
  "definitive",
  "preliminary",
  "unsolicited",
  "rumor_response",
  "scheme_of_arrangement",
  "spac_merger",
  "self_tender",
  "third_party",
  "exchange_offer",
  "management_buyout",
  "sponsor_buyout",
  "squeeze_out",
  "spin_off",
  "split_off",
  "carve_out_ipo",
  "asset_sale",
  "joint_venture",
  "carve_out",
  "stake_disclosure",
  "proxy_contest",
  "cooperation_agreement",
  "settlement",
  "debt_for_equity_swap",
  "out_of_court",
  "operational",
  "chapter_11",
  "chapter_7",
  "chapter_15",
  "administration",
  "prepackaged",
  "emergence",
  "plan_of_liquidation",
  "dissolution",
  "formal_alternatives",
  "sale_process",
  "buyback_authorization",
  "special_dividend",
  "recapitalization",
  "rights_offering",
  "public_offering",
  "private_placement",
  "pipe",
  "atm_program",
  "ipo",
  "extension",
  "trust_liquidation",
  "forced",
  "voluntary",
  "uplisting",
  "otc_relisting",
  "won",
  "lost",
  "settled",
  "ceo",
  "cfo",
  "chair",
  "board",
  "redomiciliation",
] as const

export const situationSubtypeSchema = z.enum(SITUATION_SUBTYPES)
export type SituationSubtype = z.infer<typeof situationSubtypeSchema>

export const SITUATION_STATUSES = ["rumored", "announced", "pending", "completed", "terminated", "expired"] as const
export const situationStatusSchema = z.enum(SITUATION_STATUSES)
export type SituationStatus = z.infer<typeof situationStatusSchema>

export const MARKET_CAP_BUCKETS = ["nano", "micro", "small", "mid", "large", "mega"] as const
export const marketCapBucketSchema = z.enum(MARKET_CAP_BUCKETS)
export type MarketCapBucket = z.infer<typeof marketCapBucketSchema>

export const situationConsiderationTypeSchema = z.enum(["cash", "stock", "mixed", "unspecified"])
export type SituationConsiderationType = z.infer<typeof situationConsiderationTypeSchema>

export const SITUATION_EVENT_CATEGORIES = [
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
  "accounting_change",
  "auditor_change",
  "financial_distress",
  "payment_default",
  "credit_rating",
  "capital_structure",
  "dividend_policy",
  "investment",
  "ipo",
  "name_change",
  "other",
] as const

export const situationEventCategorySchema = z.enum(SITUATION_EVENT_CATEGORIES)
export type SituationEventCategory = z.infer<typeof situationEventCategorySchema>

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

function canonicalizeForm(form: string): string {
  return form.trim().toUpperCase().replace(/\s+/g, " ").replace(/\/A\d*$/, "").replace(/-/g, "")
}

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
  businessProfile: z.string().nullable().optional(),
  terms: situationTermsSchema,
  keyDates: situationKeyDatesSchema,
  market: situationMarketContextSchema,
  sourceAccessions: z.array(z.string()).default([]),
  eventCount: z.number().int().nonnegative(),
  latestEventAt: z.string().nullable(),
  providerKey: z.string(),
  verification: dilutionVerificationSchema,
})

export type Situation = z.infer<typeof situationSchema>

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
  category: situationEventCategorySchema.nullable(),
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
  events: z.array(situationEventSchema).default([]),
})

export type SituationDetail = z.infer<typeof situationDetailSchema>

export const situationListSchema = z.object({
  object: z.literal("list"),
  data: z.array(situationSchema),
  hasMore: z.boolean(),
  nextCursor: z.string().nullable(),
})

export type SituationList = z.infer<typeof situationListSchema>

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
  category: situationEventCategorySchema.nullable(),
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

export const situationStrippedListSchema = z.object({
  object: z.literal("list"),
  data: z.array(situationStrippedSchema),
  hasMore: z.boolean(),
  nextCursor: z.string().nullable(),
})

export type SituationStrippedList = z.infer<typeof situationStrippedListSchema>

export const situationSummarySchema = z.object({
  object: z.literal("situation_summary"),
  id: z.string(),
  summaryMd: z.string().nullable(),
  terms: situationTermsSchema,
  latestEvent: situationEventSchema.nullable(),
})

export type SituationSummary = z.infer<typeof situationSummarySchema>

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

export const situationFeedItemListSchema = z.object({
  object: z.literal("list"),
  data: z.array(situationFeedItemSchema),
  hasMore: z.boolean(),
  nextCursor: z.string().nullable(),
})

export type SituationFeedItemList = z.infer<typeof situationFeedItemListSchema>

export const SITUATION_CALENDAR_DATE_TYPES = ["record", "vote", "expiry", "expected_close"] as const
export const situationCalendarDateTypeSchema = z.enum(SITUATION_CALENDAR_DATE_TYPES)
export type SituationCalendarDateType = z.infer<typeof situationCalendarDateTypeSchema>

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

export const situationCalendarEntryListSchema = z.object({
  object: z.literal("list"),
  data: z.array(situationCalendarEntrySchema),
  hasMore: z.boolean(),
  nextCursor: z.string().nullable(),
})

export type SituationCalendarEntryList = z.infer<typeof situationCalendarEntryListSchema>

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

export const situationPerformanceCohortSchema = z.object({
  type: situationTypeSchema,
  subtype: situationSubtypeSchema.nullable(),
  closedCount: z.number().int().nonnegative(),
  completedCount: z.number().int().nonnegative(),
  terminatedCount: z.number().int().nonnegative(),
  expiredCount: z.number().int().nonnegative(),
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

export const situationEventListSchema = z.object({
  object: z.literal("list"),
  data: z.array(situationEventSchema),
  hasMore: z.boolean(),
  nextCursor: z.string().nullable(),
})

export type SituationEventList = z.infer<typeof situationEventListSchema>

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

export const situationsByFormQuerySchema = z.object({
  subtypes: commaListOf(situationSubtypeSchema),
  statuses: commaListOf(situationStatusSchema),
  tickers: commaListOf(z.string()),
  sectors: commaListOf(z.string()),
  market_cap: commaListOf(marketCapBucketSchema),
  country: z.string().optional(),
  announced_from: z.string().optional(),
  announced_to: z.string().optional(),
  updated_from: z.string().optional(),
  enrich: z.enum(["true", "false"]).optional(),
  cursor: z.union([z.string(), z.number().int().nonnegative()]).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  response_mode: z.enum(["compact", "standard", "verbose", "agent"]).optional(),
})

export type SituationsByFormQuery = z.infer<typeof situationsByFormQuerySchema>

export const situationsFeedQuerySchema = z.object({
  types: commaListOf(situationTypeSchema),
  categories: commaListOf(situationEventCategorySchema),
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
