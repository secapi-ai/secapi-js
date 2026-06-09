/**
 * Dilution Score contracts (OMNI-3090).
 *
 * Mirrors `services/datastream-api/src/lib/scoring/dilution-score.ts` and the
 * `dilution_score_history` Drizzle table (migration 024).
 */
import { z } from "zod"

import { provenanceSchema } from "./schemas.js"

export const dilutionScoreFactorSchema = z.object({
  key: z.string(),
  label: z.string(),
  score: z.number().min(0).max(100),
  weight: z.number().min(0).max(1),
  value: z.union([z.number(), z.null()]).optional(),
  explanation: z.string(),
})

export type DilutionScoreFactor = z.infer<typeof dilutionScoreFactorSchema>

export const dilutionRiskBucketSchema = z.enum(["high", "medium", "low", "unknown"])

export const dilutionScoreSubRatingsSchema = z.object({
  overallRisk: dilutionRiskBucketSchema,
  offeringAbilityRisk: dilutionRiskBucketSchema,
  dilutionRisk: dilutionRiskBucketSchema,
  historicalRisk: dilutionRiskBucketSchema,
  cashNeedLevel: dilutionRiskBucketSchema,
  warrantExerciseRating: dilutionRiskBucketSchema,
})

export type DilutionScoreSubRatings = z.infer<typeof dilutionScoreSubRatingsSchema>

const dilutionScoreFreshnessSchema = z.object({
  status: z.enum(["fresh", "stale", "degraded"]),
  updatedAt: z.string(),
  reason: z.string().nullable(),
})

export const dilutionScoreHistoryEntrySchema = z.object({
  asOf: z.string(),
  score: z.number().min(0).max(100),
  band: z.enum(["low", "moderate", "elevated", "high"]),
  percentile: z.number().min(0).max(100).nullable(),
})

export type DilutionScoreHistoryEntry = z.infer<typeof dilutionScoreHistoryEntrySchema>

export const dilutionScoreSchema = z.object({
  object: z.literal("dilution_signal"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  signalKey: z.literal("secapi_dilution_score"),
  methodologyVersion: z.string(),
  entityId: z.string(),
  ticker: z.string().nullable().optional(),
  cik: z.string().nullable().optional(),
  companyName: z.string().nullable().optional(),
  asOf: z.string(),
  score: z.number().min(0).max(100),
  band: z.enum(["low", "moderate", "elevated", "high"]),
  confidence: z.enum(["high", "medium", "low"]),
  summaryMd: z.string(),
  factors: z.array(dilutionScoreFactorSchema),
  subRatings: dilutionScoreSubRatingsSchema,
  regsho: z.boolean(),
  percentile: z.number().min(0).max(100).nullable(),
  degradedReasons: z.array(z.string()).default([]),
  freshness: dilutionScoreFreshnessSchema,
  provenance: provenanceSchema,
  history: z.array(dilutionScoreHistoryEntrySchema).optional(),
})

export type DilutionScore = z.infer<typeof dilutionScoreSchema>

export const dilutionFactorModelContextSchema = z.object({
  liquidityRegime: z.object({
    macroRegimeKey: z
      .enum([
        "higher_for_longer",
        "tightening_with_softening_growth",
        "resilient_growth",
        "disinflation_under_restriction",
        "balanced_backdrop",
      ])
      .nullable(),
    macroRegimeConfidence: z.enum(["high", "medium", "low"]).nullable(),
    liquidityFactorBeta: z.number().nullable(),
    liquidityFactorPercentile: z.number().min(0).max(100).nullable(),
  }),
  momentum: z.object({
    factorBeta: z.number().nullable(),
    factorPercentile: z.number().min(0).max(100).nullable(),
    rSquared: z.number().min(0).max(1).nullable(),
    asOf: z.string().nullable(),
  }),
  shortInterest: z
    .object({
      percentOfFloat: z.number().nullable(),
      daysToCover: z.number().nullable(),
      asOf: z.string().nullable(),
      status: z.enum(["available", "unavailable"]),
    })
    .nullable(),
})

export type DilutionFactorModelContext = z.infer<typeof dilutionFactorModelContextSchema>

// Drop the optional `history` field from the enhanced schema — the
// /v1/signals/dilution/enhanced endpoint does not accept ?history= and never
// populates it. Including it here would mislead consumers reading the
// generated OpenAPI component. Bot-review feedback (cursor low — bot rev 11).
export const dilutionScoreEnhancedSchema = dilutionScoreSchema
  .omit({ history: true })
  .extend({
    factorModelContext: dilutionFactorModelContextSchema,
  })

export type DilutionScoreEnhanced = z.infer<typeof dilutionScoreEnhancedSchema>
