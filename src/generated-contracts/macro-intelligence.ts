/**
 * Macro-intelligence-plane contracts (OMNI-5118, Wave A — WS12).
 *
 * FROZEN INTERFACE CONTRACT. Changes require supervisor escalation per
 * docs/designs/wave-a-intelligence-contracts.md.
 *
 * Endpoints frozen here (registration in openapi.ts + api-surface-registry
 * happens when WS12 ships; all shapes are UNRELEASED until then):
 *   GET  /v1/macro/overview?country=          — one-call country dashboard
 *   GET  /v1/macro/all                        — bulk observation export
 *   GET  /v1/companies/macro-exposure?ticker= — single-company macro betas
 *   POST /v1/intelligence/macro-exposure      — portfolio variant
 *
 * Naming decision (frozen): the company endpoint uses the query-param style of
 * every existing /v1/companies/* route (`?ticker=`), NOT a path param — repo
 * convention over the `/:ticker/` spelling in the workstream brief.
 *
 * These endpoints layer on the existing macro read surface
 * (/v1/macro/indicators, /search, /status, /releases, /calendar, /forecasts,
 * /high-signal-pack, /regimes, /credit-ratings) and reuse its
 * `response_mode` compact|standard|verbose|agent projection pattern.
 *
 * Persistence: derived from existing macro observations; no new tables. The
 * exposure model's raw inputs land in `estimate_snapshots_raw` /
 * `benchmark_holdings_daily` (see
 * services/datastream-api/migrations/drafts/wave_a_market_reference.sql).
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
import { portfolioHoldingInputSchema } from "./investor-intelligence.js"

const macroInvestorMetadataShape = {
  provenance: provenanceSchema,
  freshness: freshnessMetadataSchema.optional(),
  materialization: materializationMetadataSchema.optional(),
  sourceRights: sourceRightsMetadataSchema,
  methodology: methodologyMetadataSchema.optional(),
  revision: revisionMetadataSchema.optional(),
  degradedState: degradedStateSchema.nullable().optional(),
} as const

// ---------------------------------------------------------------------------
// Indicator classification
// ---------------------------------------------------------------------------

/** Frozen indicator classification used by /v1/macro/all filters and /v1/macro/overview grouping. */
export const MACRO_INDICATOR_TYPES = [
  "growth",
  "inflation",
  "labor",
  "rates",
  "trade",
  "fiscal",
  "housing",
  "sentiment",
  "money",
  "other",
] as const

export const macroIndicatorTypeSchema = z.enum(MACRO_INDICATOR_TYPES)
export type MacroIndicatorType = z.infer<typeof macroIndicatorTypeSchema>

export const macroFrequencySchema = z.enum(["daily", "weekly", "monthly", "quarterly", "annual"])
export type MacroFrequency = z.infer<typeof macroFrequencySchema>

// ---------------------------------------------------------------------------
// GET /v1/macro/overview
// ---------------------------------------------------------------------------

export const macroOverviewIndicatorSchema = z.object({
  indicatorKey: z.string(),
  label: z.string(),
  indicatorType: macroIndicatorTypeSchema,
  frequency: macroFrequencySchema.nullable(),
  unit: z.string().nullable(),
  latestValue: z.number().nullable(),
  latestPeriod: z.string().nullable(),
  previousValue: z.number().nullable(),
  change: z.number().nullable(),
  changePct: z.number().nullable(),
  direction: z.enum(["up", "down", "flat"]).nullable(),
  nextReleaseAt: z.string().nullable(),
})

export type MacroOverviewIndicator = z.infer<typeof macroOverviewIndicatorSchema>

export const macroOverviewSchema = z.object({
  object: z.literal("macro_overview"),
  country: z.string(),
  asOf: z.string(),
  /** Headline indicators grouped by type, dashboard-ordered. */
  indicators: z.array(macroOverviewIndicatorSchema).default([]),
  regime: z.object({
    label: z.string().nullable(),
    growthDirection: z.enum(["accelerating", "decelerating", "flat"]).nullable(),
    inflationDirection: z.enum(["accelerating", "decelerating", "flat"]).nullable(),
    summaryMd: z.string().nullable(),
  }),
  upcomingReleases: z.array(z.object({
    indicatorKey: z.string(),
    label: z.string(),
    releaseAt: z.string(),
  })).default([]),
  creditRating: z.object({
    agency: z.string().nullable(),
    rating: z.string().nullable(),
    outlook: z.string().nullable(),
  }).nullable(),
  ...macroInvestorMetadataShape,
})

export type MacroOverview = z.infer<typeof macroOverviewSchema>

export const macroOverviewQuerySchema = z.object({
  country: z.string().optional(),
  response_mode: z.enum(["compact", "standard", "verbose", "agent"]).optional(),
})

// ---------------------------------------------------------------------------
// GET /v1/macro/all
// ---------------------------------------------------------------------------

const commaListOf = <T extends z.ZodTypeAny>(item: T) =>
  z.union([z.array(item), z.string()]).optional()

/**
 * Bulk observation surface. Rows are `macro_observation` objects
 * (macroObservationSchema, investor-intelligence.ts) inside the standard list
 * envelope. `format=csv` returns the same rows as a CSV attachment; large
 * exports go through the async exports pipeline (`export.completed` event).
 */
export const macroAllQuerySchema = z.object({
  country: z.string().optional(),
  countries: commaListOf(z.string()),
  indicator_type: macroIndicatorTypeSchema.optional(),
  indicator: z.string().optional(),
  frequency: macroFrequencySchema.optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(1000).optional(),
  format: z.enum(["json", "csv"]).optional(),
  response_mode: z.enum(["compact", "standard", "verbose", "agent"]).optional(),
})

export type MacroAllQuery = z.infer<typeof macroAllQuerySchema>

/**
 * Async-export job returned by GET /v1/macro/all when the result set is too
 * large to inline. Terminal state is announced via the `export.completed` /
 * `export.failed` webhook events; `downloadUrl` is a short-lived signed URL.
 * Mirrors the runtime BulkExportJob shape (lib/bulk-export.ts).
 */
export const macroExportJobSchema = z.object({
  object: z.literal("export_job"),
  jobId: z.string(),
  status: z.enum(["completed", "failed"]),
  dataset: z.literal("macro_observations"),
  format: z.enum(["json", "csv"]),
  rowCount: z.number().int().nonnegative(),
  byteSize: z.number().int().nonnegative(),
  downloadUrl: z.string().nullable(),
  expiresAt: z.string().nullable(),
  replayed: z.boolean().optional(),
  errorText: z.string().optional(),
})

export type MacroExportJob = z.infer<typeof macroExportJobSchema>

// ---------------------------------------------------------------------------
// GET /v1/companies/macro-exposure + POST /v1/intelligence/macro-exposure
// ---------------------------------------------------------------------------

export const macroExposureFactorSchema = z.object({
  indicatorKey: z.string(),
  label: z.string(),
  indicatorType: macroIndicatorTypeSchema,
  /** Regression beta of the security's returns to indicator surprises. */
  beta: z.number().nullable(),
  rSquared: z.number().min(0).max(1).nullable(),
  /** 1 = most sensitive among returned factors. */
  sensitivityRank: z.number().int().positive().nullable(),
  direction: z.enum(["positive", "negative", "neutral"]).nullable(),
  confidence: z.enum(["high", "medium", "low"]).nullable(),
})

export type MacroExposureFactor = z.infer<typeof macroExposureFactorSchema>

export const companyMacroExposureSchema = z.object({
  object: z.literal("company_macro_exposure"),
  ticker: z.string(),
  country: z.string(),
  asOf: z.string(),
  lookback: z.string().nullable(),
  exposures: z.array(macroExposureFactorSchema).default([]),
  summaryMd: z.string().nullable(),
  ...macroInvestorMetadataShape,
})

export type CompanyMacroExposure = z.infer<typeof companyMacroExposureSchema>

// WS12: register this at `GET /v1/companies/macro-exposure?ticker=` — a
// query-param `ticker`, NOT a `/v1/companies/:ticker/macro-exposure` path
// param. This matches every existing /v1/companies/* route
// (income-statements, balance-sheets, financials, ratios, resolve, search,
// segments, overview, subsidiaries, audit-fees), all of which take `?ticker=`.
// Supervisor review, decision D5.
export const companyMacroExposureQuerySchema = z.object({
  ticker: z.string(),
  country: z.string().optional(),
  lookback: z.string().optional(),
  response_mode: z.enum(["compact", "standard", "verbose", "agent"]).optional(),
})

/** POST body — portfolio variant. Reuses the shared holdings input shape (max 250). */
export const portfolioMacroExposureRequestSchema = z.object({
  holdings: z.array(portfolioHoldingInputSchema).min(1).max(250),
  country: z.string().optional(),
  lookback: z.string().optional(),
})

export type PortfolioMacroExposureRequest = z.infer<typeof portfolioMacroExposureRequestSchema>

export const portfolioMacroExposureSchema = z.object({
  object: z.literal("portfolio_macro_exposure"),
  country: z.string(),
  asOf: z.string(),
  lookback: z.string().nullable(),
  /** Weighted portfolio-level exposures. */
  exposures: z.array(macroExposureFactorSchema).default([]),
  /** Per-holding contributions to the portfolio's top exposures. */
  holdings: z.array(z.object({
    symbol: z.string(),
    weight: z.number(),
    exposures: z.array(macroExposureFactorSchema).default([]),
  })).default([]),
  summaryMd: z.string().nullable(),
  ...macroInvestorMetadataShape,
})

export type PortfolioMacroExposure = z.infer<typeof portfolioMacroExposureSchema>
