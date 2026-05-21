import { z } from "zod"

export const responseMetadataSchema = z.object({
  requestId: z.string(),
  traceparent: z.string().nullable().optional(),
})

export const freshnessMetadataSchema = z.object({
  status: z.enum(["fresh", "stale", "degraded", "unknown"]),
  asOf: z.string(),
  sourcePublishedAt: z.string().nullable().optional(),
  lagMs: z.number().int().nonnegative().nullable().optional(),
})

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
  status: z.enum(["fresh", "stale", "degraded", "unknown"]),
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
