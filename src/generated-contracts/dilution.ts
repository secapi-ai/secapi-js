/**
 * Dilution domain contracts (OMNI-3071).
 *
 * Mirrors `services/datastream-api/src/db/schema/dilution.ts` and
 * `services/datastream-api/migrations/021_dilution_schema.sql`. Field naming:
 * camelCase here, snake_case in the database; Drizzle's column-name string
 * handles the mapping. Decimals: `z.number()` (universal repo convention; pg
 * conversion happens upstream of contracts).
 *
 * Verification block is the moat vs AskEdgar's `verified: boolean`. See
 * `docs/strategy/traction-dilution-epic.md` lines 234-264. The raw block is
 * exposed on every row; the customer-facing summary view (epic line 256-262)
 * is derived in route handlers (not in the contract).
 */
import { z } from "zod"
import {
  freshnessMetadataSchema,
  materializationMetadataSchema,
  methodologyMetadataSchema,
  revisionMetadataSchema,
  sourceRightsMetadataSchema,
  degradedStateSchema,
} from "./foundation.js"
import { provenanceSchema } from "./schemas.js"

// ---------------------------------------------------------------------------
// Verification block (programmatic, not human)
// ---------------------------------------------------------------------------

export const crossValidationResultSchema = z.object({
  name: z.string(),
  passed: z.boolean(),
  expected: z.unknown().nullable().optional(),
  actual: z.unknown().nullable().optional(),
  deviation: z.number().nullable().optional(),
})

export const dilutionVerificationSchema = z.object({
  sourceSpan: z.string().nullable().optional(),
  extractionTraceId: z.string().nullable().optional(),
  confidence: z.number().min(0).max(1).nullable().optional(),
  crossValidations: z.array(crossValidationResultSchema).default([]),
  modelVersion: z.string().nullable().optional(),
  verifiedAt: z.string().nullable().optional(),
})

const dilutionVerificationShape = {
  verification: dilutionVerificationSchema,
} as const

const dilutionInvestorMetadataShape = {
  provenance: provenanceSchema,
  freshness: freshnessMetadataSchema.optional(),
  materialization: materializationMetadataSchema.optional(),
  sourceRights: sourceRightsMetadataSchema,
  methodology: methodologyMetadataSchema.optional(),
  revision: revisionMetadataSchema.optional(),
  degradedState: degradedStateSchema.nullable().optional(),
} as const

export type CrossValidationResult = z.infer<typeof crossValidationResultSchema>
export type DilutionVerification = z.infer<typeof dilutionVerificationSchema>

// ---------------------------------------------------------------------------
// 1. dilution_events
// ---------------------------------------------------------------------------

export const dilutionEventSchema = z.object({
  object: z.literal("dilution_event"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  ticker: z.string().nullable().optional(),
  cik: z.string(),
  accessionNumber: z.string(),
  fileNo: z.string().nullable().optional(),
  formType: z.string().nullable().optional(),
  documentUrl: z.string().url(),
  primaryFiling: z.boolean(),
  askedgarUrl: z.string().url().nullable().optional(),
  raisableAmount: z.number().nullable().optional(),
  calculatedRaisableAmount: z.number().nullable().optional(),
  float: z.number().nullable().optional(),
  floatValue: z.number().nullable().optional(),
  sharesAmount: z.number().nullable().optional(),
  sharePrice: z.number().nullable().optional(),
  warrantsAmount: z.number().nullable().optional(),
  warrantsRemaining: z.number().nullable().optional(),
  warrantsExercisePrice: z.number().nullable().optional(),
  conversionPrice: z.number().nullable().optional(),
  offeringAmount: z.number().nullable().optional(),
  offeringType: z.string().nullable().optional(),
  amountSoldToDate: z.number().nullable().optional(),
  amountRemainingAtm: z.number().nullable().optional(),
  totalRaised: z.number().nullable().optional(),
  isAtm: z.boolean(),
  overBabyShelf: z.boolean().nullable().optional(),
  priceToExceedBabyShelf: z.number().nullable().optional(),
  bank: z.string().nullable().optional(),
  sellingShareholderDetails: z.array(z.record(z.string(), z.unknown())).default([]),
  potentialOwners: z.array(z.record(z.string(), z.unknown())).default([]),
  fFilers: z.array(z.record(z.string(), z.unknown())).default([]),
  headline: z.string().nullable().optional(),
  summary: z.string().nullable().optional(),
  prompt: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  filedAt: z.string(),
  effectiveDate: z.string().nullable().optional(),
  effectiveStatus: z.string().nullable().optional(),
  expirationDate: z.string().nullable().optional(),
  dayHigh: z.number().nullable().optional(),
  updatedAt: z.string(),
  ...dilutionVerificationShape,
  ...dilutionInvestorMetadataShape,
})

export type DilutionEvent = z.infer<typeof dilutionEventSchema>

// ---------------------------------------------------------------------------
// 2. dilution_warrants
// ---------------------------------------------------------------------------

export const dilutionWarrantSchema = z.object({
  object: z.literal("dilution_warrant"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  ticker: z.string().nullable().optional(),
  cik: z.string(),
  accessionNumber: z.string(),
  fileNo: z.string().nullable().optional(),
  formType: z.string().nullable().optional(),
  documentUrl: z.string().url(),
  primaryFiling: z.boolean(),
  askedgarUrl: z.string().url().nullable().optional(),
  warrantsAmount: z.number().nullable().optional(),
  warrantsRemaining: z.number().nullable().optional(),
  warrantsExercisePrice: z.number().nullable().optional(),
  conversionPrice: z.number().nullable().optional(),
  sharePrice: z.number().nullable().optional(),
  prefundedCost: z.number().nullable().optional(),
  priceProtection: z.boolean().nullable().optional(),
  ppClause: z.string().nullable().optional(),
  registered: z.boolean().nullable().optional(),
  underlyingSharesCalculated: z.number().nullable().optional(),
  underlyingSharesRemaining: z.number().nullable().optional(),
  convertibleDebtRemaining: z.number().nullable().optional(),
  bank: z.string().nullable().optional(),
  holders: z.array(z.record(z.string(), z.unknown())).default([]),
  headline: z.string().nullable().optional(),
  summary: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  filedAt: z.string(),
  exercisableDate: z.string().nullable().optional(),
  maturityDate: z.string().nullable().optional(),
  convertibleDate: z.string().nullable().optional(),
  expirationDate: z.string().nullable().optional(),
  updatedAt: z.string(),
  ...dilutionVerificationShape,
  ...dilutionInvestorMetadataShape,
})

export type DilutionWarrant = z.infer<typeof dilutionWarrantSchema>

// ---------------------------------------------------------------------------
// 3. dilution_convertibles
// ---------------------------------------------------------------------------

export const dilutionConvertibleSchema = z.object({
  object: z.literal("dilution_convertible"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  ticker: z.string().nullable().optional(),
  cik: z.string(),
  accessionNumber: z.string(),
  fileNo: z.string().nullable().optional(),
  formType: z.string().nullable().optional(),
  documentUrl: z.string().url(),
  primaryFiling: z.boolean(),
  askedgarUrl: z.string().url().nullable().optional(),
  sharesAmount: z.number().nullable().optional(),
  sharesRemaining: z.number().nullable().optional(),
  conversionPrice: z.number().nullable().optional(),
  sharePrice: z.number().nullable().optional(),
  prefundedCost: z.number().nullable().optional(),
  priceProtection: z.boolean().nullable().optional(),
  ppClause: z.string().nullable().optional(),
  registered: z.boolean().nullable().optional(),
  underlyingSharesCalculated: z.number().nullable().optional(),
  underlyingSharesRemaining: z.number().nullable().optional(),
  convertibleDebtAmount: z.number().nullable().optional(),
  convertibleDebtRemaining: z.number().nullable().optional(),
  bank: z.string().nullable().optional(),
  holders: z.array(z.record(z.string(), z.unknown())).default([]),
  headline: z.string().nullable().optional(),
  summary: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  filedAt: z.string(),
  exercisableDate: z.string().nullable().optional(),
  convertibleDate: z.string().nullable().optional(),
  maturityDate: z.string().nullable().optional(),
  expirationDate: z.string().nullable().optional(),
  updatedAt: z.string(),
  ...dilutionVerificationShape,
  ...dilutionInvestorMetadataShape,
})

export type DilutionConvertible = z.infer<typeof dilutionConvertibleSchema>

// ---------------------------------------------------------------------------
// 4. dilution_rofr
// ---------------------------------------------------------------------------

export const dilutionRofrSchema = z.object({
  object: z.literal("dilution_rofr"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  ticker: z.string().nullable().optional(),
  cik: z.string(),
  accessionNumber: z.string(),
  documentUrl: z.string().url(),
  filedAt: z.string(),
  rightOfFirstRefusalPresent: z.boolean().nullable().optional(),
  rightOfFirstRefusalDetails: z.string().nullable().optional(),
  rightOfFirstRefusalDuration: z.string().nullable().optional(),
  rightOfFirstRefusalType: z.string().nullable().optional(),
  rightOfFirstRefusalEndDate: z.string().nullable().optional(),
  /** Duplicate alias of rightOfFirstRefusalEndDate — AskEdgar exposes both names. */
  rofrEndDate: z.string().nullable().optional(),
  tailFinancingPaymentsPresent: z.boolean().nullable().optional(),
  tailFinancingPaymentsDetails: z.string().nullable().optional(),
  tailFinancingPaymentsDuration: z.string().nullable().optional(),
  offeringType: z.string().nullable().optional(),
  bankName: z.string().nullable().optional(),
  updatedAt: z.string(),
  ...dilutionVerificationShape,
  ...dilutionInvestorMetadataShape,
})

export type DilutionRofr = z.infer<typeof dilutionRofrSchema>

// ---------------------------------------------------------------------------
// 5. dilution_lockups
// ---------------------------------------------------------------------------

export const dilutionLockupSchema = z.object({
  object: z.literal("dilution_lockup"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  ticker: z.string().nullable().optional(),
  cik: z.string(),
  accessionNumber: z.string(),
  documentUrl: z.string().url(),
  filedAt: z.string(),
  title: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  timePeriod: z.string().nullable().optional(),
  startDate: z.string().nullable().optional(),
  startDateDescription: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  endDateDescription: z.string().nullable().optional(),
  sharesAmount: z.number().nullable().optional(),
  lockUpParties: z.array(z.record(z.string(), z.unknown())).default([]),
  conditions: z.array(z.record(z.string(), z.unknown())).default([]),
  duplicate: z.boolean(),
  updatedAt: z.string(),
  ...dilutionVerificationShape,
  ...dilutionInvestorMetadataShape,
})

export type DilutionLockup = z.infer<typeof dilutionLockupSchema>

// ---------------------------------------------------------------------------
// 6. dilution_nasdaq_compliance
// ---------------------------------------------------------------------------

export const dilutionNasdaqComplianceSchema = z.object({
  object: z.literal("dilution_nasdaq_compliance"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  ticker: z.string(),
  date: z.string(),
  deficiency: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  market: z.string().nullable().optional(),
  risk: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  notesUpdated: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  cik: z.string().nullable().optional(),
  accessionNumber: z.string().nullable().optional(),
  documentUrl: z.string().url().nullable().optional(),
  updatedAt: z.string(),
  ...dilutionVerificationShape,
  ...dilutionInvestorMetadataShape,
})

export type DilutionNasdaqCompliance = z.infer<typeof dilutionNasdaqComplianceSchema>

// ---------------------------------------------------------------------------
// 7. dilution_reverse_splits
// ---------------------------------------------------------------------------

export const dilutionReverseSplitSchema = z.object({
  object: z.literal("dilution_reverse_split"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  ticker: z.string(),
  executionDate: z.string().nullable().optional(),
  splitFrom: z.number().nullable().optional(),
  splitTo: z.number().nullable().optional(),
  cik: z.string().nullable().optional(),
  accessionNumber: z.string().nullable().optional(),
  documentUrl: z.string().url().nullable().optional(),
  filedAt: z.string().nullable().optional(),
  updatedAt: z.string(),
  ...dilutionVerificationShape,
  ...dilutionInvestorMetadataShape,
})

export type DilutionReverseSplit = z.infer<typeof dilutionReverseSplitSchema>

// ---------------------------------------------------------------------------
// 8. dilution_cash_position
// ---------------------------------------------------------------------------

export const dilutionCashPositionSchema = z.object({
  object: z.literal("dilution_cash_position"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  ticker: z.string(),
  cik: z.string().nullable().optional(),
  accessionNumber: z.string().nullable().optional(),
  documentUrl: z.string().url().nullable().optional(),
  filedAt: z.string().nullable().optional(),
  periodEnded: z.string().nullable().optional(),
  cash: z.number().nullable().optional(),
  currentAssets: z.number().nullable().optional(),
  currentLiabilities: z.number().nullable().optional(),
  totalAssets: z.number().nullable().optional(),
  totalLiabilities: z.number().nullable().optional(),
  cashBurn: z.number().nullable().optional(),
  recentFinancing: z.number().nullable().optional(),
  estimatedCash: z.number().nullable().optional(),
  cashRemainingMonths: z.number().nullable().optional(),
  cashNeed: z.string().nullable().optional(),
  commentary: z.string().nullable().optional(),
  mgmtCommentary: z.string().nullable().optional(),
  oldTickers: z.array(z.string()).default([]),
  updatedAt: z.string(),
  ...dilutionVerificationShape,
  ...dilutionInvestorMetadataShape,
})

export type DilutionCashPosition = z.infer<typeof dilutionCashPositionSchema>

// ---------------------------------------------------------------------------
// 9. dilution_corporate_actions
// ---------------------------------------------------------------------------

export const dilutionCorporateActionSchema = z.object({
  object: z.literal("dilution_corporate_action"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  ticker: z.string(),
  effectiveDate: z.string().nullable().optional(),
  actionType: z.string().nullable().optional(),
  splitFrom: z.number().nullable().optional(),
  splitTo: z.number().nullable().optional(),
  newSymbol: z.string().nullable().optional(),
  oldSymbol: z.string().nullable().optional(),
  symbolChange: z.boolean(),
  despacClosing: z.boolean(),
  voteDate: z.string().nullable().optional(),
  approvedDate: z.string().nullable().optional(),
  exchange: z.string().nullable().optional(),
  currentStatus: z.string().nullable().optional(),
  cik: z.string().nullable().optional(),
  accessionNumber: z.string().nullable().optional(),
  documentUrl: z.string().url().nullable().optional(),
  filedAt: z.string().nullable().optional(),
  updatedAt: z.string(),
  ...dilutionVerificationShape,
  ...dilutionInvestorMetadataShape,
})

export type DilutionCorporateAction = z.infer<typeof dilutionCorporateActionSchema>

// ---------------------------------------------------------------------------
// 10. dilution_ratings
// ---------------------------------------------------------------------------

export const dilutionRatingSchema = z.object({
  object: z.literal("dilution_rating"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  ticker: z.string(),
  overallRisk: z.string().nullable().optional(),
  offeringAbilityRisk: z.string().nullable().optional(),
  dilutionRisk: z.string().nullable().optional(),
  historicalRisk: z.string().nullable().optional(),
  cashNeedLevel: z.string().nullable().optional(),
  warrantExerciseRating: z.string().nullable().optional(),
  regsho: z.boolean().nullable().optional(),
  numericScore: z.number().min(0).max(100).nullable().optional(),
  factorExposures: z.record(z.string(), z.unknown()).default({}),
  computedAt: z.string(),
  updatedAt: z.string(),
  ...dilutionVerificationShape,
  ...dilutionInvestorMetadataShape,
})

export type DilutionRating = z.infer<typeof dilutionRatingSchema>

// ---------------------------------------------------------------------------
// 11. dilution_share_float_history
// ---------------------------------------------------------------------------

export const dilutionShareFloatHistorySchema = z.object({
  object: z.literal("dilution_share_float_history"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  ticker: z.string(),
  asOfDate: z.string(),
  sharesOutstanding: z.number().nullable().optional(),
  publicFloat: z.number().nullable().optional(),
  sourceForm: z.string().nullable().optional(),
  sourceAccession: z.string().nullable().optional(),
  computedAt: z.string(),
  updatedAt: z.string(),
  ...dilutionVerificationShape,
  ...dilutionInvestorMetadataShape,
})

export type DilutionShareFloatHistory = z.infer<typeof dilutionShareFloatHistorySchema>

// ---------------------------------------------------------------------------
// Coverage rollup (OMNI-3089) — derived view over the 11 tables. Surfaced at
// /v1/dilution/coverage to expose row counts + verified-row counts + latest
// observation timestamps so customers can answer "do I have data for this
// ticker yet?" without polling 11 endpoints.
// ---------------------------------------------------------------------------

export const dilutionCoveragePerTableSchema = z.object({
  table: z.string(),
  rowCount: z.number().int().nonnegative(),
  verifiedRowCount: z.number().int().nonnegative(),
  latestVerifiedAt: z.string().nullable(),
  latestFilingDate: z.string().nullable(),
})

export type DilutionCoveragePerTable = z.infer<typeof dilutionCoveragePerTableSchema>

export const dilutionCoverageSchema = z.object({
  object: z.literal("dilution_coverage"),
  ticker: z.string().nullable(),
  generatedAt: z.string(),
  totalRowCount: z.number().int().nonnegative(),
  totalVerifiedRowCount: z.number().int().nonnegative(),
  tables: z.array(dilutionCoveragePerTableSchema),
})

export type DilutionCoverage = z.infer<typeof dilutionCoverageSchema>
