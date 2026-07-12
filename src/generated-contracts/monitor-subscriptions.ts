/**
 * Structured event-type monitor subscriptions (OMNI-5127, WS13).
 *
 * Extends the keyword-only monitor spec (v1-post-bodies.ts
 * `v1CreateMonitorBodySchema`) to subscribe to the Wave-A intelligence planes:
 *
 *   search_mode="situation"     → situation.* events, filtered by
 *                                 type/subtype/status/ticker/sector.
 *   search_mode="filing_event"  → filing.event_tagged, filtered by
 *                                 ai_insights category/sentiment/ticker.
 *   search_mode="footnote"      → footnote.new / footnote.topic_delta,
 *                                 filtered by ticker/topic/newness.
 *   search_mode="section_delta" → section.delta, filtered by
 *                                 ticker/sectionKey/changeType/min materiality.
 *
 * These reuse the existing 15-min sweep → Resend + monitor.match webhook/stream
 * fan-out (see services/datastream-api/src/lib/delivery/sweep-monitors.ts). The
 * `filters` object is JSONB-backed on the monitors table, so adding a mode adds
 * NO migration.
 *
 * The keyword mode (search_mode="keyword", the default) is untouched — its
 * `filters` shape is the legacy `{ tickers, forms, date_from, ... }` bag that
 * buildMonitorSearchQueries already reads.
 */
import { z } from "zod"
import {
  situationTypeSchema,
  situationSubtypeSchema,
  situationStatusSchema,
} from "./situations.js"
import { filingEventCategorySchema } from "./filings-intelligence.js"

/** Search modes a monitor can run in. `keyword` is the legacy default. */
export const MONITOR_STRUCTURED_SEARCH_MODES = [
  "situation",
  "filing_event",
  "footnote",
  "section_delta",
] as const

export const MONITOR_SEARCH_MODES = ["keyword", ...MONITOR_STRUCTURED_SEARCH_MODES] as const
export const monitorSearchModeSchema = z.enum(MONITOR_SEARCH_MODES)
export type MonitorSearchMode = z.infer<typeof monitorSearchModeSchema>

export type MonitorStructuredSearchMode = (typeof MONITOR_STRUCTURED_SEARCH_MODES)[number]

export function isStructuredSearchMode(mode: string): mode is MonitorStructuredSearchMode {
  return (MONITOR_STRUCTURED_SEARCH_MODES as readonly string[]).includes(mode)
}

// ---------------------------------------------------------------------------
// Filter shapes (JSONB `filters` payload) — one per structured mode.
//
// Every list field is normalized to `string[]` and treated as an OR set.
// Tickers are uppercased at read time. `null`/omitted fields mean "no filter".
// ---------------------------------------------------------------------------

const tickerListSchema = z.array(z.string().trim().min(1)).max(200).optional()
const stringListSchema = z.array(z.string().trim().min(1)).max(200).optional()
const situationIdListSchema = z.array(z.string().regex(/^sit_[a-f0-9]{20}$/, "Expected a canonical situation id")).min(1).max(50).optional()

/** search_mode="situation" — subscribe to situation.* by type/subtype/status/ticker/sector. */
export const situationMonitorFilterSchema = z.object({
  /** Exact situation subscriptions use the event timeline, not lifecycle snapshots. */
  situationIds: situationIdListSchema,
  types: z.array(situationTypeSchema).max(50).optional(),
  subtypes: z.array(situationSubtypeSchema).max(100).optional(),
  statuses: z.array(situationStatusSchema).max(10).optional(),
  tickers: tickerListSchema,
  sectors: stringListSchema,
}).strict()
export type SituationMonitorFilter = z.infer<typeof situationMonitorFilterSchema>

/** search_mode="filing_event" — subscribe to filing.event_tagged by category/sentiment/ticker. */
export const filingEventMonitorFilterSchema = z.object({
  categories: z.array(filingEventCategorySchema).max(50).optional(),
  sentiments: z.array(z.enum(["positive", "neutral", "negative"])).max(3).optional(),
  tickers: tickerListSchema,
  forms: stringListSchema,
}).strict()
export type FilingEventMonitorFilter = z.infer<typeof filingEventMonitorFilterSchema>

/** search_mode="footnote" — subscribe to footnote.new / footnote.topic_delta by ticker/topic/newness. */
export const footnoteMonitorFilterSchema = z.object({
  tickers: tickerListSchema,
  topics: stringListSchema,
  newness: z.array(z.enum(["new", "changed", "recurring"])).max(3).optional(),
}).strict()
export type FootnoteMonitorFilter = z.infer<typeof footnoteMonitorFilterSchema>

/** search_mode="section_delta" — subscribe to section.delta by ticker/sectionKey/changeType/materiality. */
export const sectionDeltaMonitorFilterSchema = z.object({
  tickers: tickerListSchema,
  sectionKeys: stringListSchema,
  changeTypes: z.array(z.enum(["added", "removed", "modified"])).max(3).optional(),
  minMaterialityScore: z.number().min(0).max(1).optional(),
}).strict()
export type SectionDeltaMonitorFilter = z.infer<typeof sectionDeltaMonitorFilterSchema>

/**
 * Discriminated union keyed on `searchMode`. Used by the NL compiler output
 * and the structured-monitor create path to validate the (mode, filters) pair
 * as a unit. Keyword monitors are validated separately by the legacy body
 * schema, so they are not part of this union.
 */
export const structuredMonitorSpecSchema = z.discriminatedUnion("searchMode", [
  z.object({ searchMode: z.literal("situation"), filters: situationMonitorFilterSchema }),
  z.object({ searchMode: z.literal("filing_event"), filters: filingEventMonitorFilterSchema }),
  z.object({ searchMode: z.literal("footnote"), filters: footnoteMonitorFilterSchema }),
  z.object({ searchMode: z.literal("section_delta"), filters: sectionDeltaMonitorFilterSchema }),
])
export type StructuredMonitorSpec = z.infer<typeof structuredMonitorSpecSchema>

/**
 * Validate a (searchMode, filters) pair against the mode's filter schema.
 * Returns a discriminated result so callers can surface field-level errors.
 */
export function parseStructuredMonitorSpec(
  searchMode: string,
  filters: unknown,
): { ok: true; spec: StructuredMonitorSpec } | { ok: false; error: z.ZodError } {
  const result = structuredMonitorSpecSchema.safeParse({ searchMode, filters })
  return result.success ? { ok: true, spec: result.data } : { ok: false, error: result.error }
}

/**
 * Body for POST /v1/monitors/compile — the natural-language custom-alert
 * compiler. The `prompt` is a plain-English trigger ("notify me when the CFO
 * changes at any watchlist company"); the compiler returns a StructuredMonitorSpec.
 * `tickers` optionally scopes "watchlist company" style prompts.
 */
export const v1CompileMonitorBodySchema = z.object({
  prompt: z.string().trim().min(1).max(2000),
  tickers: z.array(z.string().trim().min(1)).max(200).optional(),
})
export type V1CompileMonitorBody = z.infer<typeof v1CompileMonitorBodySchema>

/**
 * Body for POST /v1/alerts/signup — public free-tier email capture (OMNI-5127).
 * `source` is an optional funnel tag (e.g. "embed", "pricing_page").
 */
export const v1AlertSignupBodySchema = z.object({
  email: z.string().trim().email().max(320),
  source: z.string().trim().max(120).optional(),
})
export type V1AlertSignupBody = z.infer<typeof v1AlertSignupBodySchema>
