import { z } from "zod"

export const responseMetadataSchema = z.object({
  requestId: z.string(),
  traceparent: z.string().nullable().optional(),
})

/**
 * Freshness status semantics.
 *
 * For row-level datasets that are continuously refreshed (factors, market,
 * macro) the historical `fresh`/`stale`/`degraded`/`unknown` values describe how
 * recently the underlying source was observed.
 *
 * For immutable SEC filings, freshness is the PIPELINE lag — the time between
 * SEC acceptance (`sourcePublishedAt`) and the moment we materialized the
 * record — NOT the age of the document. An immutable historical filing that we
 * hold fully materialized is healthy regardless of how old the document is, so
 * it reads:
 *   - `current`  — recently published and materialized; the pipeline is keeping up.
 *   - `archival` — an immutable historical document we hold in full; the
 *                  publish→materialize span is not a pipeline signal.
 * `degraded`/`stale` are reserved for a genuinely-lagged ingest: a
 * recently-published filing whose materialization fell behind the freshness
 * thresholds. This prevents old immutable filings (e.g. a years-old 10-K) from
 * being mislabeled `stale` simply because they were published long ago.
 */
export const freshnessStatusSchema = z.enum([
  "fresh",
  "current",
  "archival",
  "stale",
  "degraded",
  "unknown",
])

export const freshnessMetadataSchema = z.object({
  status: freshnessStatusSchema,
  asOf: z.string(),
  sourcePublishedAt: z.string().nullable().optional(),
  lagMs: z.number().int().nonnegative().nullable().optional(),
})

export type FreshnessStatus = z.infer<typeof freshnessStatusSchema>

const DEFAULT_FILING_FRESH_MS = 24 * 60 * 60 * 1000
const DEFAULT_FILING_DEGRADED_MS = 72 * 60 * 60 * 1000
// A document published more than this far in the past is treated as an
// immutable historical/backfill document. This must be comfortably larger than
// the degraded *lag* threshold so that a recently-published filing whose
// materialization merely lagged by a few days is NOT misclassified as archival
// — its high pipeline lag is a real ingest problem and must surface as
// `degraded`/`stale`.
const DEFAULT_FILING_ARCHIVAL_AGE_MS = 30 * 24 * 60 * 60 * 1000

/**
 * Derive filing-level freshness from PIPELINE lag (SEC acceptance →
 * materialization), not document age.
 *
 * - Returns `lagMs` = max(0, materializedAt − sourcePublishedAt) for telemetry
 *   continuity (this is the publish→materialize pipeline latency).
 * - `stale`/`degraded` are driven by PIPELINE lag and are the dead-man signal
 *   for ingestion falling behind. They must keep firing for a genuinely-lagged
 *   materialization of a *recently-published* filing — even when freshness is
 *   computed at materialization time (the production path omits `now`, so
 *   `now ≈ materializedAt`).
 * - `archival` is reserved for immutable *historical* documents: a filing
 *   published longer ago than the archival age threshold. Their
 *   publish→materialize span reflects a backfill, not live-pipeline lag, so they
 *   read `archival` regardless of how large that span is (e.g. a years-old 10-K
 *   materialized today is `archival`, never `stale`).
 * - `current` is a recently-published filing materialized promptly.
 * - Missing timestamps → `unknown`.
 *
 * The archival age threshold is deliberately much larger than the degraded lag
 * threshold so the two concerns do not collide: a 4-day ingest lag on a filing
 * published this week reads `stale` (real problem), while a filing published
 * years ago reads `archival` (immutable backfill).
 */
export function deriveFilingFreshness(input: {
  sourcePublishedAt: string | null | undefined
  materializedAt: string | null | undefined
  now?: number
  freshThresholdMs?: number
  degradedThresholdMs?: number
  archivalAgeThresholdMs?: number
}): { status: FreshnessStatus; lagMs: number | null } {
  const freshThresholdMs = input.freshThresholdMs ?? DEFAULT_FILING_FRESH_MS
  const degradedThresholdMs = input.degradedThresholdMs ?? DEFAULT_FILING_DEGRADED_MS
  const archivalAgeThresholdMs = input.archivalAgeThresholdMs ?? DEFAULT_FILING_ARCHIVAL_AGE_MS

  const publishedMs = input.sourcePublishedAt ? Date.parse(input.sourcePublishedAt) : NaN
  const materializedMs = input.materializedAt ? Date.parse(input.materializedAt) : NaN

  if (!Number.isFinite(publishedMs) || !Number.isFinite(materializedMs)) {
    return { status: "unknown", lagMs: null }
  }

  const lagMs = Math.max(0, materializedMs - publishedMs)
  const now = input.now ?? Date.now()
  const documentAgeMs = Math.max(0, now - publishedMs)

  // Immutable historical document: published far enough in the past that the
  // publish→materialize span reflects a backfill, not live-pipeline lag. The
  // archival age threshold is much larger than the degraded lag threshold so a
  // merely-lagged recent filing is NOT swept up here — its lag still surfaces
  // below as the genuine ingest signal.
  if (documentAgeMs > archivalAgeThresholdMs) {
    return { status: "archival", lagMs }
  }

  // Recently-published filing: pipeline lag is the live ingest signal. A high
  // publish→materialize lag here is a real problem (the dead-man indicator for
  // ingestion lag) and must read `degraded`/`stale`.
  if (lagMs <= freshThresholdMs) return { status: "current", lagMs }
  if (lagMs <= degradedThresholdMs) return { status: "degraded", lagMs }
  return { status: "stale", lagMs }
}

export const materializationMetadataSchema = z.object({
  parserVersion: z.string(),
  materializationVersion: z.string(),
})

export const degradedStateSchema = z.object({
  code: z.string().min(1),
  message: z.string(),
  retryable: z.boolean(),
  missingCapabilities: z.array(z.string()).default([]),
  fallbackUsed: z.array(z.string()).default([]),
})

export const capabilityStateSchema = z.enum(["supported", "not_disclosed", "degraded", "unavailable"])

export const traceStatusSchema = z.enum(["supported", "degraded", "unavailable"])

export const traceKindSchema = z.enum(["filing_fact", "filing_excerpt", "derived_metric", "source_record"])

export const datasetFamilySchema = z.enum([
  "entities",
  "filings",
  "sections_items",
  "statements",
  "ownership",
  "insiders",
  "offerings",
  "board_composition",
  "fund_holdings",
  "enforcement_actions",
  "market_data",
  "news",
  "macro_data",
  "factors",
  "portfolio_analytics",
  "intelligence_bundles",
  "derived_signals",
])

export const sourceRightsPostureSchema = z.enum([
  "public_safe",
  "contract_gated",
  "internal_only",
  "inventory_only",
  "review_required",
])

export const sourceRightsAvailabilitySchema = z.enum([
  "public",
  "contract_gated",
  "internal_only",
  "inventory_only",
])

export const sourceRightsContractStatusSchema = z.enum([
  "approved",
  "review_required",
  "restricted",
  "prohibited",
  "expired",
])

export const sourceRightsMetadataSchema = z.object({
  source: z.string(),
  sourceLabel: z.string().optional(),
  sourceAgency: z.string().optional(),
  canonicality: z.string().optional(),
  fallbackPolicy: z.string().optional(),
  posture: sourceRightsPostureSchema,
  publicAvailability: sourceRightsAvailabilitySchema,
  contractStatus: sourceRightsContractStatusSchema,
  reviewOwner: z.string().nullable().optional(),
  reviewedAt: z.string().nullable().optional(),
  restrictions: z.array(z.string()).default([]),
  notes: z.string().nullable().optional(),
})

export const methodologyConfidenceSchema = z.enum(["high", "medium", "low"])

export const methodologyLaunchStateSchema = z.enum(["experimental", "beta", "ga"])

export const methodologyMetadataSchema = z.object({
  id: z.string(),
  version: z.string(),
  summary: z.string(),
  confidence: methodologyConfidenceSchema,
  launchState: methodologyLaunchStateSchema,
  inputs: z.array(z.string()).default([]),
  validation: z.record(z.string(), z.unknown()).optional(),
})

export const revisionMetadataSchema = z.object({
  sourcePublishedAt: z.string().nullable().optional(),
  retrievedAt: z.string(),
  vintageId: z.string().nullable().optional(),
  revisedFrom: z.string().nullable().optional(),
})

export const certificationDimensionSchema = z.enum([
  "parser_correctness",
  "contract_shape",
  "history_completeness",
  "freshness_sla",
  "benchmark_target",
  "failure_path_coverage",
])

export const datasetCertificationStatusSchema = z.object({
  datasetFamily: datasetFamilySchema,
  dimensions: z.record(certificationDimensionSchema, z.boolean()),
})

export const validationStatusSchema = z.object({
  status: z.enum(["validated", "unvalidated", "degraded"]),
  confidence: methodologyConfidenceSchema.nullable().optional(),
  validatedAt: z.string().nullable().optional(),
  validationPipeline: z.string().nullable().optional(),
  exceptions: z.array(z.string()).default([]),
})

export type ResponseMetadata = z.infer<typeof responseMetadataSchema>
export type FreshnessMetadata = z.infer<typeof freshnessMetadataSchema>
export type MaterializationMetadata = z.infer<typeof materializationMetadataSchema>
export type DegradedState = z.infer<typeof degradedStateSchema>
export type CapabilityState = z.infer<typeof capabilityStateSchema>
export type TraceStatus = z.infer<typeof traceStatusSchema>
export type TraceKind = z.infer<typeof traceKindSchema>
export type DatasetFamily = z.infer<typeof datasetFamilySchema>
export type SourceRightsPosture = z.infer<typeof sourceRightsPostureSchema>
export type SourceRightsAvailability = z.infer<typeof sourceRightsAvailabilitySchema>
export type SourceRightsContractStatus = z.infer<typeof sourceRightsContractStatusSchema>
export type SourceRightsMetadata = z.infer<typeof sourceRightsMetadataSchema>
export type MethodologyConfidence = z.infer<typeof methodologyConfidenceSchema>
export type MethodologyLaunchState = z.infer<typeof methodologyLaunchStateSchema>
export type MethodologyMetadata = z.infer<typeof methodologyMetadataSchema>
export type RevisionMetadata = z.infer<typeof revisionMetadataSchema>
export type CertificationDimension = z.infer<typeof certificationDimensionSchema>
export type DatasetCertificationStatus = z.infer<typeof datasetCertificationStatusSchema>
export type ValidationStatus = z.infer<typeof validationStatusSchema>

export const dataQualityFreshnessSchema = z.object({
  latestObservationAt: z.string().nullable(),
  averageLagMs: z.number().nonnegative().nullable(),
  status: freshnessStatusSchema,
  observationCount: z.number().int().nonnegative(),
})

export const dataQualityCompletenessSchema = z.object({
  expectedFields: z.number().int().nonnegative(),
  presentFields: z.number().int().nonnegative(),
  completenessPercent: z.number().min(0).max(100),
})

export const dataQualityValidationSchema = z.object({
  totalRecords: z.number().int().nonnegative(),
  validatedRecords: z.number().int().nonnegative(),
  validationPercent: z.number().min(0).max(100),
})

export const dataQualityScorecardSchema = z.object({
  family: datasetFamilySchema,
  freshness: dataQualityFreshnessSchema,
  completeness: dataQualityCompletenessSchema,
  validation: dataQualityValidationSchema,
  computedAt: z.string(),
})

export type DataQualityFreshness = z.infer<typeof dataQualityFreshnessSchema>
export type DataQualityCompleteness = z.infer<typeof dataQualityCompletenessSchema>
export type DataQualityValidation = z.infer<typeof dataQualityValidationSchema>
export type DataQualityScorecard = z.infer<typeof dataQualityScorecardSchema>
