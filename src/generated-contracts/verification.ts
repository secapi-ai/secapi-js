/**
 * Verification-infrastructure contracts (OMNI-3081).
 *
 * Mirrors `services/datastream-api/migrations/023_extraction_disputes.sql`.
 * The dilution-side verification block (`dilutionVerificationSchema`,
 * `crossValidationResultSchema`) lives in `dilution.ts` and is re-exported
 * through the package barrel; this file owns only the cross-cutting
 * dispute table and the summary helper.
 *
 * The customer-facing summary view is consumed by W4 (OMNI-3089) route
 * handlers; `summarizeVerification` is exported here so W4 doesn't have
 * to invent the shape.
 */
import { z } from "zod"

import { type DilutionVerification } from "./dilution.js"

// ---------------------------------------------------------------------------
// extraction_disputes (OMNI-3168 superseded by OMNI-3081)
// ---------------------------------------------------------------------------

export const extractionDisputeResolutionSchema = z.enum([
  "open",
  "accept_primary",
  "accept_challenger",
  "manual_override",
  "duplicate",
])

export const extractionDisputeSourceTableSchema = z.enum([
  "dilution_events",
  "dilution_warrants",
  "dilution_convertibles",
  "dilution_rofr",
  "dilution_lockups",
  "dilution_cash_position",
])

// Note: NO `livemode` field — disputes are engineering-internal triage
// records, not customer-facing data shapes (where `livemode` distinguishes
// production from test data). The DB table has no livemode column; including
// it on the schema would 422 every dispute response when W4 reads from DB.
export const extractionDisputeSchema = z.object({
  object: z.literal("extraction_dispute"),
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  sourceTable: extractionDisputeSourceTableSchema,
  sourceRowId: z.string(),
  fieldPath: z.string(),
  primaryValue: z.unknown().nullable().optional(),
  primaryModel: z.string(),
  primaryExtractionTraceId: z.string().nullable().optional(),
  challengerValue: z.unknown().nullable().optional(),
  challengerModel: z.string(),
  challengerExtractionTraceId: z.string().nullable().optional(),
  deviation: z.number().nullable().optional(),
  resolution: extractionDisputeResolutionSchema,
  resolutionValue: z.unknown().nullable().optional(),
  resolutionReason: z.string().nullable().optional(),
  resolvedAt: z.string().nullable().optional(),
  resolvedBy: z.string().nullable().optional(),
})

export type ExtractionDisputeResolution = z.infer<typeof extractionDisputeResolutionSchema>
export type ExtractionDisputeSourceTable = z.infer<typeof extractionDisputeSourceTableSchema>
export type ExtractionDispute = z.infer<typeof extractionDisputeSchema>

// ---------------------------------------------------------------------------
// Customer-facing summary view (consumed by W4 / OMNI-3089)
// ---------------------------------------------------------------------------

// Naming convention: camelCase, matching the rest of the contracts package
// (sibling extractionDisputeSchema and dilutionVerificationSchema both use
// camelCase). The handoff documentation references snake_case names like
// `cross_validations_passed`; that's the WIRE format produced by the
// response shaper layer (W4 / OMNI-3089), not the contract shape. The
// contract is the source of truth for SDK generation, so consistency with
// the rest of the package matters.
export const dilutionVerificationSummarySchema = z.object({
  confidence: z.number().min(0).max(1).nullable(),
  crossValidationsPassed: z.number().int().min(0),
  sourceSpanResolved: z.boolean(),
  modelVersion: z.string().nullable(),
})

export type DilutionVerificationSummary = z.infer<typeof dilutionVerificationSummarySchema>

/**
 * Produce the customer-facing summary view from the raw verification block.
 * `crossValidationsPassed` counts entries with `passed === true`;
 * `sourceSpanResolved` is true iff `sourceSpan` is non-null AND the
 * `citation_verifier` cross-validation (if present) passed.
 */
export function summarizeVerification(v: DilutionVerification | null | undefined): DilutionVerificationSummary {
  if (!v) {
    return {
      confidence: null,
      crossValidationsPassed: 0,
      sourceSpanResolved: false,
      modelVersion: null,
    }
  }
  const validations = v.crossValidations ?? []
  const passedCount = validations.filter((entry) => entry.passed === true).length
  // Scan from the end so summarizeVerification reflects the most-recent
  // citation_verifier entry — matters when a verifier-version bump leaves
  // multiple historical entries on the row even after the dedup filter
  // (extractor entries are kept; only verifier-managed prefixes are
  // replaced). Manual scan avoids needing ES2023 `findLast` in the lib.
  let citationEntry: typeof validations[number] | undefined
  for (let i = validations.length - 1; i >= 0; i -= 1) {
    if (validations[i].name === "citation_verifier") {
      citationEntry = validations[i]
      break
    }
  }
  const citationOk = citationEntry ? citationEntry.passed === true : false
  return {
    confidence: v.confidence ?? null,
    crossValidationsPassed: passedCount,
    sourceSpanResolved: Boolean(v.sourceSpan) && citationOk,
    modelVersion: v.modelVersion ?? null,
  }
}
