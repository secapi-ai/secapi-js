import { z } from "zod"
import {
  degradedStateSchema,
  freshnessMetadataSchema,
  materializationMetadataSchema,
  methodologyMetadataSchema,
  revisionMetadataSchema,
  sourceRightsMetadataSchema,
} from "./foundation.js"
import { filingSchema, provenanceSchema, traceReferenceSchema } from "./schemas.js"

const symbolSchema = z.string().min(1)
const isoCountryCodeSchema = z.string().length(2)

const footnoteFreshnessStatusValues = ["fresh", "stale", "degraded", "unknown"] as const
const footnoteSourceRightsPostureValues = ["public_safe", "contract_gated", "internal_only", "inventory_only", "review_required"] as const
const footnoteSourceRightsAvailabilityValues = ["public", "contract_gated", "internal_only", "inventory_only"] as const
const footnoteSourceRightsContractStatusValues = ["approved", "review_required", "restricted", "prohibited", "expired"] as const
const footnoteMethodologyConfidenceValues = ["high", "medium", "low"] as const
const footnoteMethodologyLaunchStateValues = ["experimental", "beta", "ga"] as const
const footnoteTraceStatusValues = ["supported", "degraded", "unavailable"] as const
const footnoteTraceKindValues = ["filing_fact", "filing_excerpt", "derived_metric", "source_record"] as const
const footnoteTraceRegionKindValues = ["inline_xbrl_fact", "html_text_range"] as const

// These footnote-specific factories intentionally inline the shared investor metadata shapes.
// Reusing the shared schema instances caused zod-to-json-schema to emit schema-relative `$ref`
// pointers that break in the full OpenAPI document for this nested payload.
function createFootnoteFreshnessMetadataSchema() {
  return z.object({
    status: z.enum(footnoteFreshnessStatusValues),
    asOf: z.string(),
    sourcePublishedAt: z.string().nullable().optional(),
    lagMs: z.number().int().nonnegative().nullable().optional(),
  })
}

function createFootnoteMaterializationMetadataSchema() {
  return z.object({
    parserVersion: z.string(),
    materializationVersion: z.string(),
  })
}

function createFootnoteDegradedStateSchema() {
  return z.object({
    code: z.string().min(1),
    message: z.string(),
    retryable: z.boolean(),
    missingCapabilities: z.array(z.string()).default([]),
    fallbackUsed: z.array(z.string()).default([]),
  })
}

function createFootnoteSourceRightsMetadataSchema() {
  return z.object({
    source: z.string(),
    posture: z.enum(footnoteSourceRightsPostureValues),
    publicAvailability: z.enum(footnoteSourceRightsAvailabilityValues),
    contractStatus: z.enum(footnoteSourceRightsContractStatusValues),
    reviewOwner: z.string().nullable().optional(),
    reviewedAt: z.string().nullable().optional(),
    restrictions: z.array(z.string()).default([]),
    notes: z.string().nullable().optional(),
  })
}

function createFootnoteMethodologyMetadataSchema() {
  return z.object({
    id: z.string(),
    version: z.string(),
    summary: z.string(),
    confidence: z.enum(footnoteMethodologyConfidenceValues),
    launchState: z.enum(footnoteMethodologyLaunchStateValues),
    inputs: z.array(z.string()).default([]),
    validation: z.record(z.string(), z.unknown()).optional(),
  })
}

function createFootnoteRevisionMetadataSchema() {
  return z.object({
    sourcePublishedAt: z.string().nullable().optional(),
    retrievedAt: z.string(),
    vintageId: z.string().nullable().optional(),
    revisedFrom: z.string().nullable().optional(),
  })
}

function createFootnoteProvenanceSchema() {
  return z.object({
    source: z.string(),
    accessionNumber: z.string().nullable(),
    filingUrl: z.string().url(),
    acceptedAt: z.string().nullable().optional(),
    retrievedAt: z.string(),
    parserVersion: z.string(),
  })
}

function createFootnoteTraceRegionSchema() {
  return z.object({
    status: z.enum(footnoteTraceStatusValues),
    kind: z.enum(footnoteTraceRegionKindValues).nullable().optional(),
    startOffset: z.number().int().nonnegative().nullable().optional(),
    endOffset: z.number().int().nonnegative().nullable().optional(),
    snippet: z.string().nullable().optional(),
    viewerFragment: z.string().nullable().optional(),
  })
}

function createFootnoteTraceReferenceSchema() {
  return z.object({
    id: z.string(),
    kind: z.enum(footnoteTraceKindValues),
    status: z.enum(footnoteTraceStatusValues),
    href: z.string(),
    page: z.number().int().positive().nullable().optional(),
    region: createFootnoteTraceRegionSchema().nullable().optional(),
  })
}

function createFootnoteFilingSchema() {
  return z.object({
    object: z.literal("filing"),
    id: z.string(),
    createdAt: z.string(),
    livemode: z.boolean(),
    entityId: z.string(),
    ticker: z.string().nullable().optional(),
    companyName: z.string().optional(),
    form: z.string(),
    filingDate: z.string(),
    reportDate: z.string().nullable().optional(),
    accessionNumber: z.string(),
    title: z.string(),
    summaryMd: z.string().optional(),
    snippet: z.string().optional(),
    provenance: createFootnoteProvenanceSchema(),
    freshness: createFootnoteFreshnessMetadataSchema().optional(),
    materialization: createFootnoteMaterializationMetadataSchema().optional(),
  })
}

function createFootnoteInvestorMetadataShape() {
  return {
    provenance: createFootnoteProvenanceSchema(),
    freshness: createFootnoteFreshnessMetadataSchema().optional(),
    materialization: createFootnoteMaterializationMetadataSchema().optional(),
    sourceRights: createFootnoteSourceRightsMetadataSchema(),
    methodology: createFootnoteMethodologyMetadataSchema().optional(),
    revision: createFootnoteRevisionMetadataSchema().optional(),
    degradedState: createFootnoteDegradedStateSchema().nullable().optional(),
  } as const
}

const investorMetadataShape = {
  responseMode: z.enum(["compact", "standard", "verbose"]).optional(),
  dataAsOf: z.string().optional(),
  freshnessStatus: z.string().optional(),
  methodologyVersion: z.string().optional(),
  materializationVersion: z.string().optional(),
  provenance: provenanceSchema.optional(),
  freshness: freshnessMetadataSchema.optional(),
  materialization: materializationMetadataSchema.optional(),
  sourceRights: sourceRightsMetadataSchema.optional(),
  methodology: methodologyMetadataSchema.optional(),
  revision: revisionMetadataSchema.optional(),
  degradedState: degradedStateSchema.nullable().optional(),
} as const

export const marketSnapshotSchema = z.object({
  object: z.literal("market_snapshot"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  symbol: symbolSchema,
  name: z.string().nullable().optional(),
  exchange: z.string().nullable().optional(),
  currency: z.string().nullable().optional(),
  asOf: z.string(),
  price: z.number(),
  change: z.number().nullable().optional(),
  changePercent: z.number().nullable().optional(),
  volume: z.number().int().nonnegative().nullable().optional(),
  marketCap: z.number().nullable().optional(),
  previousClose: z.number().nullable().optional(),
  ...investorMetadataShape,
})

export const marketReferenceSchema = z.object({
  object: z.literal("market_reference"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  symbol: symbolSchema,
  name: z.string().nullable().optional(),
  market: z.string().nullable().optional(),
  locale: z.string().nullable().optional(),
  exchange: z.string().nullable().optional(),
  securityType: z.string().nullable().optional(),
  active: z.boolean().nullable().optional(),
  currency: z.string().nullable().optional(),
  cik: z.string().nullable().optional(),
  compositeFigi: z.string().nullable().optional(),
  shareClassFigi: z.string().nullable().optional(),
  marketCap: z.number().nullable().optional(),
  listDate: z.string().nullable().optional(),
  homepageUrl: z.string().url().nullable().optional(),
  description: z.string().nullable().optional(),
  sicCode: z.string().nullable().optional(),
  sicDescription: z.string().nullable().optional(),
  totalEmployees: z.number().int().nonnegative().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
  address: z.object({
    line1: z.string().nullable().optional(),
    line2: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    state: z.string().nullable().optional(),
    postalCode: z.string().nullable().optional(),
  }).nullable().optional(),
  branding: z.object({
    logoUrl: z.string().url().nullable().optional(),
    iconUrl: z.string().url().nullable().optional(),
  }).nullable().optional(),
  asOf: z.string(),
  ...investorMetadataShape,
})

export const marketBarSchema = z.object({
  object: z.literal("market_bar"),
  id: z.string(),
  symbol: symbolSchema,
  interval: z.enum(["1m", "5m", "15m", "1h", "1d", "1w", "1mo"]),
  open: z.number(),
  high: z.number(),
  low: z.number(),
  close: z.number(),
  volume: z.number().int().nonnegative().nullable().optional(),
  timestamp: z.string(),
  ...investorMetadataShape,
})

export const corporateActionSchema = z.object({
  object: z.literal("corporate_action"),
  id: z.string(),
  symbol: symbolSchema,
  actionType: z.enum(["split", "dividend"]),
  exDate: z.string(),
  recordDate: z.string().nullable().optional(),
  payDate: z.string().nullable().optional(),
  ratio: z.number().nullable().optional(),
  cashAmount: z.number().nullable().optional(),
  currency: z.string().nullable().optional(),
  ...investorMetadataShape,
})

export const marketEstimateSnapshotSchema = z.object({
  object: z.literal("market_estimate_snapshot"),
  id: z.string(),
  symbol: symbolSchema,
  fiscalPeriod: z.string(),
  fiscalYear: z.number().int(),
  metric: z.string(),
  value: z.number().nullable(),
  actual: z.number().nullable().optional(),
  surprisePercent: z.number().nullable().optional(),
  analystCount: z.number().int().nonnegative().nullable().optional(),
  asOf: z.string(),
  ...investorMetadataShape,
})

export const newsEntityMentionSchema = z.object({
  symbol: symbolSchema.nullable().optional(),
  entityId: z.string().nullable().optional(),
  companyName: z.string().nullable().optional(),
  confidence: z.number().min(0).max(1).optional(),
})

export const newsStorySchema = z.object({
  object: z.literal("news_story"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  headline: z.string(),
  sourceName: z.string(),
  sourceUrl: z.string().url(),
  publishedAt: z.string(),
  summaryMd: z.string().nullable().optional(),
  symbols: z.array(symbolSchema).default([]),
  mentions: z.array(newsEntityMentionSchema).default([]),
  sentiment: z.enum(["positive", "neutral", "negative"]).nullable().optional(),
  ...investorMetadataShape,
})

export const macroObservationSchema = z.object({
  object: z.literal("macro_observation"),
  id: z.string(),
  indicatorKey: z.string(),
  country: isoCountryCodeSchema,
  frequency: z.enum(["daily", "weekly", "monthly", "quarterly", "annual"]),
  period: z.string(),
  unit: z.string().nullable().optional(),
  value: z.number().nullable(),
  previousValue: z.number().nullable().optional(),
  changePercent: z.number().nullable().optional(),
  regimeTag: z.string().nullable().optional(),
  ...investorMetadataShape,
})

export const macroReleaseSchema = z.object({
  object: z.literal("macro_release"),
  id: z.string(),
  indicatorKey: z.string(),
  country: isoCountryCodeSchema,
  scheduledAt: z.string(),
  actual: z.number().nullable().optional(),
  previous: z.number().nullable().optional(),
  consensus: z.number().nullable().optional(),
  surprisePercent: z.number().nullable().optional(),
  status: z.enum(["scheduled", "released", "delayed", "canceled"]),
  ...investorMetadataShape,
})

export const macroForecastSchema = z.object({
  object: z.literal("macro_forecast"),
  id: z.string(),
  indicatorKey: z.string(),
  country: isoCountryCodeSchema,
  horizon: z.string(),
  value: z.number().nullable(),
  intervalLow: z.number().nullable().optional(),
  intervalHigh: z.number().nullable().optional(),
  scenario: z.string().nullable().optional(),
  ...investorMetadataShape,
})

export const factorQualityProofSourceMetadataSchema = z.object({
  latestAsOf: z.string().nullable(),
  latestSourcePublishedAt: z.string().nullable(),
  observedModelNameCount: z.number().int().nonnegative(),
  observedModelNamesSample: z.array(z.string()).default([]),
  nonStockBasketRowCount: z.number().int().nonnegative(),
  metadataModelNames: z.array(z.string()).default([]),
  metadataModelVersions: z.array(z.string()).default([]),
  metadataMethodologyUrls: z.array(z.string()).default([]),
})

export const factorQualityProofSchema = z.object({
  object: z.literal("factor_quality_proof"),
  status: z.enum(["ready", "degraded", "not_available"]),
  proofSource: z.string().nullable(),
  proofObservedAt: z.string().nullable(),
  rowLevelProofAvailable: z.boolean(),
  proofReady: z.boolean(),
  firstDate: z.string().nullable(),
  lastDate: z.string().nullable(),
  firstRequiredMarketDate: z.string().nullable(),
  latestMarketDay: z.string().nullable(),
  targetHistoryStartDate: z.string().nullable(),
  requiredHistoryStartDate: z.string().nullable(),
  shortHistoryExempt: z.boolean(),
  historyStartMarketDayLag: z.number().int().nullable(),
  latestMarketDayLag: z.number().int().nullable(),
  rowCount: z.number().int().nonnegative().nullable(),
  distinctFactorDateCount: z.number().int().nonnegative().nullable(),
  coveredMarketDateCount: z.number().int().nonnegative().nullable(),
  expectedMarketDateCount: z.number().int().nonnegative().nullable(),
  missingSessionCount: z.number().int().nonnegative().nullable(),
  coveragePct: z.number().min(0).max(1).nullable(),
  methodologyVersion: z.string().nullable(),
  modelName: z.string().nullable(),
  methodologyUrl: z.string().nullable(),
  sourceMetadata: factorQualityProofSourceMetadataSchema.nullable(),
  degradedReasons: z.array(z.string()).default([]),
})

export const factorDefinitionSchema = z.object({
  object: z.literal("factor_definition"),
  id: z.string(),
  key: z.string(),
  name: z.string(),
  category: z.enum(["market", "style", "macro", "sector", "industry", "country", "thematic"]),
  description: z.string(),
  benchmarkSymbol: z.string().nullable().optional(),
  equation: z.record(z.string(), z.number()).optional(),
  orthogonalizedAgainst: z.array(z.string()).default([]),
  qualityProof: factorQualityProofSchema,
  ...investorMetadataShape,
})

export const factorReturnSchema = z.object({
  object: z.literal("factor_return"),
  id: z.string(),
  factorKey: z.string(),
  asOf: z.string(),
  window: z.string(),
  rawReturn: z.number().nullable().optional(),
  pureReturn: z.number().nullable().optional(),
  scaledReturn: z.number().nullable().optional(),
  zScore: z.number().nullable().optional(),
  leverage: z.number().nullable().optional(),
  qualityProof: factorQualityProofSchema,
  ...investorMetadataShape,
})

export const factorExtremeMoveSchema = z.object({
  object: z.literal("factor_extreme_move"),
  id: z.string(),
  rank: z.number().int().positive(),
  factorKey: z.string(),
  factorName: z.string(),
  category: z.string(),
  window: z.string(),
  lookback: z.string(),
  direction: z.enum(["up", "down", "flat"]),
  sort: z.enum(["abs_z_score", "abs_scaled_return"]),
  score: z.number(),
  absZScore: z.number().nonnegative(),
  absScaledReturn: z.number().nonnegative(),
  minAbsZScore: z.number().nonnegative(),
  isExtreme: z.boolean(),
  asOf: z.string(),
  rawReturn: z.number().nullable().optional(),
  pureReturn: z.number().nullable().optional(),
  scaledReturn: z.number().nullable().optional(),
  zScore: z.number().nullable().optional(),
  leverage: z.number().nullable().optional(),
  ...investorMetadataShape,
})

export const factorExtremePairSchema = z.object({
  object: z.literal("factor_extreme_pair"),
  id: z.string(),
  rank: z.number().int().positive(),
  factor1: z.string(),
  factor2: z.string(),
  factor1Name: z.string(),
  factor2Name: z.string(),
  category1: z.string(),
  category2: z.string(),
  window: z.enum(["1d", "5d", "10d", "21d", "63d", "126d", "252d"]),
  lookback: z.string(),
  direction: z.enum(["factor1", "factor2", "flat"]),
  sort: z.enum(["abs_z_score", "abs_spread_return"]),
  score: z.number(),
  absZScore: z.number().nonnegative(),
  absSpreadReturn: z.number().nonnegative(),
  minAbsZScore: z.number().nonnegative(),
  isExtreme: z.boolean(),
  spreadReturn: z.number(),
  factor1Return: z.number(),
  factor2Return: z.number(),
  averageSpreadReturn: z.number(),
  spreadVolatility: z.number().nonnegative(),
  zScore: z.number(),
  spreadZScore: z.number(),
  meanReversionSignal: z.enum(["factor1_overextended", "factor2_overextended", "neutral"]),
  meanReversionSummary: z.string(),
  windowStartDate: z.string(),
  windowEndDate: z.string(),
  pairHistory: z.record(z.string(), z.unknown()),
  observationCount: z.number().int().nonnegative(),
  rollingObservationCount: z.number().int().nonnegative(),
  asOf: z.string(),
  ...investorMetadataShape,
})

export const factorValuationSchema = z.object({
  object: z.literal("factor_valuation"),
  id: z.string(),
  rank: z.number().int().positive(),
  factorKey: z.string(),
  factorName: z.string(),
  category: z.string(),
  valuationMetric: z.string(),
  longLeg: z.string(),
  shortLeg: z.string(),
  window: z.string(),
  lookback: z.string(),
  signal: z.enum(["tailwind", "headwind", "neutral"]),
  signalDirection: z.enum(["tailwind", "headwind", "neutral"]),
  weightingMode: z.enum(["long_short_equal", "long_leg_focus", "short_leg_focus"]),
  legWeights: z.object({
    long: z.number(),
    short: z.number(),
  }),
  rawFactorZScore: z.number(),
  weightedZScore: z.number(),
  sort: z.enum(["opportunity_score", "abs_z_score", "factor_key"]),
  score: z.number(),
  opportunityScore: z.number(),
  zScore: z.number(),
  absZScore: z.number().nonnegative(),
  scaledReturn: z.number().nullable().optional(),
  pureReturn: z.number().nullable().optional(),
  rawReturn: z.number().nullable().optional(),
  asOf: z.string(),
  signalSource: z.literal("materialized_factor_return_z_score"),
  stockDrilldown: z.record(z.string(), z.unknown()),
  opportunitySummary: z.string(),
  ...investorMetadataShape,
})

export const factorValuationStockSchema = z.object({
  object: z.literal("factor_valuation_stock"),
  id: z.string(),
  rank: z.number().int().positive(),
  symbol: symbolSchema,
  factorKey: z.string(),
  factorName: z.string(),
  category: z.string(),
  valuationMetric: z.string(),
  valuationSignal: z.enum(["tailwind", "headwind", "neutral"]),
  signalDirection: z.enum(["tailwind", "headwind", "neutral"]),
  weightingMode: z.enum(["long_short_equal", "long_leg_focus", "short_leg_focus"]),
  legWeights: z.object({
    long: z.number(),
    short: z.number(),
  }),
  stance: z.enum(["beneficiaries", "at_risk", "both"]),
  impact: z.enum(["beneficiary", "at_risk", "neutral"]),
  sort: z.enum(["score", "abs_beta", "symbol"]),
  score: z.number(),
  expectedFactorImpactScore: z.number(),
  factorZScore: z.number(),
  rawFactorZScore: z.number(),
  weightedFactorZScore: z.number(),
  exposureAdjustedFactorZScore: z.number(),
  exposureBeta: z.number(),
  absExposureBeta: z.number().nonnegative(),
  exposurePercentile: z.number().nullable().optional(),
  exposureConfidence: z.enum(["high", "medium", "low"]).nullable().optional(),
  nActiveFactors: z.number().int().nonnegative(),
  window: z.string(),
  lookback: z.string(),
  modelName: z.string(),
  asOf: z.string(),
  factorAsOf: z.string(),
  factorFreshness: freshnessMetadataSchema.optional(),
  factorMaterialization: materializationMetadataSchema.optional(),
  signalSource: z.literal("materialized_factor_return_z_score_plus_latest_factor_exposure"),
  rankingRationale: z.string(),
  opportunitySummary: z.string(),
  ...investorMetadataShape,
})

export const factorHistoryPointSchema = z.object({
  date: z.string(),
  rawReturn: z.number().nullable().optional(),
  pureReturn: z.number().nullable().optional(),
  scaledReturn: z.number().nullable().optional(),
  zScore: z.number().nullable().optional(),
  leverage: z.number().nullable().optional(),
})

export const factorHistoryWindowSchema = z.object({
  window: z.string(),
  rawReturn: z.number().nullable().optional(),
  pureReturn: z.number().nullable().optional(),
  scaledReturn: z.number().nullable().optional(),
  observationCount: z.number().int().nonnegative(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
})

export const factorHistorySchema = z.object({
  object: z.literal("factor_history"),
  id: z.string(),
  factorKey: z.string(),
  factorName: z.string(),
  category: z.string(),
  range: z.string(),
  dateFrom: z.string(),
  dateTo: z.string(),
  historyStartDate: z.string().nullable().optional(),
  historyEndDate: z.string().nullable().optional(),
  observationCount: z.number().int().nonnegative(),
  asOf: z.string(),
  series: z.array(factorHistoryPointSchema).default([]),
  seriesCount: z.number().int().nonnegative().optional(),
  seriesSample: z.array(factorHistoryPointSchema).optional(),
  expansionHints: z.array(z.string()).optional(),
  summaryWindows: z.array(factorHistoryWindowSchema).default([]),
  qualityProof: factorQualityProofSchema,
  ...investorMetadataShape,
})

export const factorSparklinePointSchema = z.object({
  date: z.string(),
  value: z.number(),
})

export const factorSparklineSchema = z.object({
  object: z.literal("factor_sparkline"),
  id: z.string(),
  factorKey: z.string(),
  factorName: z.string(),
  category: z.string(),
  range: z.string(),
  metric: z.enum(["scaled_return", "pure_return", "raw_return", "z_score"]),
  dateFrom: z.string(),
  dateTo: z.string(),
  historyStartDate: z.string().nullable().optional(),
  historyEndDate: z.string().nullable().optional(),
  observationCount: z.number().int().nonnegative(),
  pointCount: z.number().int().nonnegative(),
  asOf: z.string(),
  latestValue: z.number().nullable().optional(),
  latestRawReturn: z.number().nullable().optional(),
  latestPureReturn: z.number().nullable().optional(),
  latestScaledReturn: z.number().nullable().optional(),
  latestZScore: z.number().nullable().optional(),
  latestLeverage: z.number().nullable().optional(),
  summaryWindows: z.array(factorHistoryWindowSchema).default([]),
  points: z.array(factorSparklinePointSchema).default([]),
  qualityProof: factorQualityProofSchema,
  ...investorMetadataShape,
})

export const factorIntradaySnapshotSchema = z.object({
  object: z.literal("factor_intraday_snapshot"),
  id: z.string(),
  factorKey: z.string(),
  factorName: z.string(),
  factorCategory: z.string(),
  modelName: z.string(),
  window: z.string(),
  snapshotAt: z.string(),
  benchmarkSymbols: z.array(symbolSchema).default([]),
  rawReturn: z.number().nullable().optional(),
  pureReturn: z.number().nullable().optional(),
  scaledReturn: z.number().nullable().optional(),
  zScore: z.number().nullable().optional(),
  leverage: z.number().nullable().optional(),
  ...investorMetadataShape,
})

export const factorRegimePerformanceSchema = z.object({
  object: z.literal("factor_regime_performance"),
  id: z.string(),
  country: isoCountryCodeSchema,
  regimeKey: z.string(),
  regimeLabel: z.string(),
  factorKey: z.string(),
  factorName: z.string(),
  factorCategory: z.enum(["market", "style", "macro", "sector", "industry", "country", "thematic"]),
  window: z.string(),
  lookback: z.string(),
  rank: z.number().int().positive(),
  regimeScore: z.number(),
  combinedScore: z.number(),
  direction: z.enum(["tailwind", "headwind", "neutral"]),
  rationale: z.string(),
  rawReturn: z.number().nullable().optional(),
  pureReturn: z.number().nullable().optional(),
  scaledReturn: z.number().nullable().optional(),
  zScore: z.number().nullable().optional(),
  leverage: z.number().nullable().optional(),
  asOf: z.string(),
  ...investorMetadataShape,
})

export const factorExposureSchema = z.object({
  object: z.literal("factor_exposure"),
  id: z.string(),
  subjectType: z.enum(["security", "portfolio", "watchlist"]),
  subjectKey: z.string(),
  factorKey: z.string(),
  beta: z.number(),
  intercept: z.number().nullable().optional(),
  rSquared: z.number().min(0).max(1).nullable().optional(),
  adjustedRSquared: z.number().nullable().optional(),
  tStat: z.number().nullable().optional(),
  observationCount: z.number().int().nonnegative().nullable().optional(),
  nActiveFactors: z.number().int().nonnegative().nullable().optional(),
  percentile: z.number().min(0).max(100).nullable().optional(),
  confidence: z.enum(["high", "medium", "low"]).nullable().optional(),
  modelName: z.string().nullable().optional(),
  asOf: z.string(),
  ...investorMetadataShape,
})

export const factorThemeEvidenceSchema = z.object({
  source: z.enum(["entity_name", "sic_description", "filing_title", "filing_snippet", "news_headline", "news_summary"]),
  text: z.string(),
  symbol: symbolSchema,
  accessionNumber: z.string().nullable().optional(),
  publishedAt: z.string().nullable().optional(),
})

export const factorThemeLabelCandidateSchema = z.object({
  label: z.string(),
  score: z.number(),
  kind: z.enum(["keyword", "phrase"]),
  evidenceTerms: z.array(z.string()).default([]),
  sourceCount: z.number().int().nonnegative(),
})

export const factorSemanticSignatureSchema = z.object({
  algorithm: z.string(),
  dimensions: z.number().int().positive(),
  topTerms: z.array(z.string()).default([]),
  sourceKinds: z.array(z.enum(["entity_name", "sic_description", "filing_title", "filing_snippet", "news_headline", "news_summary"])).default([]),
  sourceCount: z.number().int().nonnegative(),
})

export const factorSimilarityPackNamingWorkflowSchema = z.object({
  workflowVersion: z.string(),
  selectedLabel: z.string(),
  factorKeySuggestion: z.string(),
  confidence: z.enum(["high", "medium", "low"]),
  labelCandidates: z.array(factorThemeLabelCandidateSchema).default([]),
  rationale: z.string(),
})

export const factorSimilarityPeerSchema = z.object({
  object: z.literal("related_security"),
  id: z.string(),
  symbol: symbolSchema,
  similarity: z.number(),
  score: z.number(),
  factorSimilarity: z.number(),
  thematicSimilarity: z.number(),
  factorOverlap: z.array(z.string()).default([]),
  explanation: z.string(),
  themeLabels: z.array(z.string()).default([]),
  evidence: z.array(factorThemeEvidenceSchema).default([]),
  ...investorMetadataShape,
})

export const factorSimilarityPackSchema = z.object({
  object: z.literal("factor_similarity_pack"),
  id: z.string(),
  symbol: symbolSchema,
  asOf: z.string(),
  anchorTheme: z.string(),
  themeLabels: z.array(z.string()).default([]),
  factorKeySuggestion: z.string(),
  discoveryMode: z.enum(["factor_overlap_plus_filing_news_signature"]),
  semanticSignature: factorSemanticSignatureSchema,
  namingWorkflow: factorSimilarityPackNamingWorkflowSchema,
  evidence: z.array(factorThemeEvidenceSchema).default([]),
  peers: z.array(factorSimilarityPeerSchema).default([]),
  summaryMd: z.string(),
  ...investorMetadataShape,
})

export const factorCustomDiscoveryRequestSchema = z.object({
  symbol: symbolSchema.optional(),
  symbols: z.array(symbolSchema).max(25).default([]),
  candidates: z.array(symbolSchema).max(25).default([]),
  lookback: z.string().default("6m"),
  limit: z.number().int().min(1).max(25).default(5),
}).superRefine((value, ctx) => {
  if (!value.symbol && value.symbols.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["symbol"],
      message: "symbol or symbols is required",
    })
  }
})

export const attributionContributionSchema = z.object({
  key: z.string(),
  label: z.string(),
  category: z.enum(["factor", "macro", "filing_risk", "news", "valuation", "ownership"]),
  contributionPercent: z.number(),
  explanation: z.string(),
  trace: traceReferenceSchema.nullable().optional(),
})

export const hedgeCandidateSchema = z.object({
  symbol: symbolSchema,
  instrumentType: z.enum(["equity", "etf", "future", "option", "cash"]),
  rationale: z.string(),
  expectedExposureDelta: z.record(z.string(), z.number()).default({}),
  confidence: z.enum(["high", "medium", "low"]),
})

export const filingRiskSchema = z.object({
  key: z.string(),
  label: z.string(),
  severity: z.enum(["low", "medium", "high"]),
  summary: z.string(),
  trace: traceReferenceSchema.nullable().optional(),
})

export const macroFactorImpactSchema = z.object({
  factorKey: z.string(),
  score: z.number(),
  direction: z.enum(["tailwind", "headwind", "neutral"]),
  rationale: z.string(),
})

export const macroRegimeSchema = z.object({
  key: z.string(),
  label: z.string(),
  country: isoCountryCodeSchema,
  confidence: z.enum(["high", "medium", "low"]),
  drivers: z.array(attributionContributionSchema).default([]),
  factorImpacts: z.array(macroFactorImpactSchema).default([]),
})

const createMacroSourceAdapterMetadataSchema = () => z.object({
  key: z.string(),
  label: z.string().nullable().optional(),
  version: z.string().nullable().optional(),
})

const createMacroRequestTemplateMetadataSchema = () => z.object({
  key: z.string(),
  label: z.string().nullable().optional(),
  version: z.string().nullable().optional(),
})

const createMacroSourcePlanStepSchema = () => z.object({
  key: z.string(),
  label: z.string(),
  kind: z.enum(["api", "sdmx", "portal", "publication"]),
  canonicalUrl: z.string().url(),
  revisionSupport: z.enum(["native", "partial", "fallback_only"]),
  expectedLag: z.enum(["intraday", "daily", "weekly", "monthly", "quarterly"]),
  adapter: createMacroSourceAdapterMetadataSchema().nullable().optional(),
  requestTemplate: createMacroRequestTemplateMetadataSchema().nullable().optional(),
})

export const macroSourceAdapterMetadataSchema = createMacroSourceAdapterMetadataSchema()
export const macroRequestTemplateMetadataSchema = createMacroRequestTemplateMetadataSchema()
export const macroSourcePlanStepSchema = createMacroSourcePlanStepSchema()

// Keep fallback as a wholly distinct schema tree so OpenAPI generation does not
// emit schema-local $refs that break once nested inside a larger document.
const macroFallbackSourcePlanStepSchema = createMacroSourcePlanStepSchema()

export const macroSourcePlanSchema = z.object({
  primary: macroSourcePlanStepSchema,
  fallback: macroFallbackSourcePlanStepSchema.nullable().optional(),
  rationale: z.string(),
})

export const macroHighSignalSeriesSchema = z.object({
  indicatorKey: z.string(),
  label: z.string(),
  sourceKey: z.string(),
  sourceLabel: z.string(),
  dataset: z.string(),
  seriesCode: z.string(),
  frequency: z.enum(["daily", "weekly", "monthly", "quarterly", "annual"]),
  revisionSupport: z.enum(["native", "partial", "fallback_only"]),
  releaseCalendarSupport: z.enum(["native", "estimated", "fallback_only"]),
  canonicality: z.enum(["official", "official_via_dbnomics", "fallback_harmonized"]),
  fallbackPolicy: z.enum(["none", "dbnomics", "imf_ifs", "world_bank"]),
  coverageState: z.enum(["live", "materialized_bootstrap", "planned"]),
  sourcePlan: macroSourcePlanSchema,
  latestObservation: macroObservationSchema.nullable().optional(),
  upcomingRelease: macroReleaseSchema.nullable().optional(),
  forecast: macroForecastSchema.nullable().optional(),
})

export const macroHighSignalPackSchema = z.object({
  object: z.literal("macro_high_signal_pack"),
  id: z.string(),
  asOf: z.string(),
  country: isoCountryCodeSchema,
  ring: z.enum(["launch_ring_1", "tier_1_expansion"]),
  series: z.array(macroHighSignalSeriesSchema).default([]),
  regime: macroRegimeSchema.nullable().optional(),
  summaryMd: z.string(),
  ...investorMetadataShape,
})

export const portfolioHoldingInputSchema = z.object({
  symbol: symbolSchema,
  weight: z.number(),
  shares: z.number().nullable().optional(),
  costBasis: z.number().nullable().optional(),
})

export const countryReportRequestSchema = z.object({
  country: z.string().min(2).max(12).default("US"),
  lookback: z.string().min(2).max(12).optional(),
})

export const portfolioIntelligenceRequestSchema = z.object({
  country: z.string().min(2).max(12).default("US"),
  lookback: z.string().min(2).max(12).optional(),
  category: z.string().min(2).max(32).optional(),
  keys: z.array(z.string()).default([]),
  holdings: z.array(portfolioHoldingInputSchema).min(1).max(250),
  benchmarkLabel: z.string().min(1).max(160).optional(),
  benchmarkHoldings: z.array(portfolioHoldingInputSchema).min(1).max(250).optional(),
  whatIfLabel: z.string().min(1).max(160).optional(),
  whatIfHoldings: z.array(portfolioHoldingInputSchema).min(1).max(250).optional(),
})

export const portfolioAttributionRequestSchema = z.object({
  country: z.string().min(2).max(12).default("US"),
  lookback: z.string().min(2).max(12).optional(),
  window: z.string().min(2).max(12).optional(),
  frequency: z.enum(["daily", "weekly", "monthly", "quarterly", "annual"]).default("daily"),
  exportFormat: z.enum(["json", "csv", "both"]).default("json"),
  category: z.string().min(2).max(32).optional(),
  keys: z.array(z.string()).default([]),
  holdings: z.array(portfolioHoldingInputSchema).min(1).max(250),
})

export const portfolioHedgeInstrumentTypeSchema = z.enum(["equity", "etf", "future", "option", "cash"])

export const portfolioHedgeConstraintsSchema = z.object({
  maxHedges: z.number().int().min(1).max(5).default(3),
  maxPositionWeight: z.number().min(0.001).max(1).default(0.1),
  maxTotalHedgeWeight: z.number().min(0.001).max(1).default(0.3),
  maxSectorWeight: z.number().min(0.001).max(1).default(1),
  hedgeIntensity: z.number().min(0.05).max(1).default(1),
  longOnly: z.boolean().default(false),
  allowedInstrumentTypes: z.array(portfolioHedgeInstrumentTypeSchema).min(1).default(["etf"]),
  customUniverse: z.array(symbolSchema).max(250).default([]),
  targetExposures: z.record(z.string(), z.number()).default({}),
  minConfidence: z.enum(["low", "medium", "high"]).default("medium"),
  minLiquidityUsd: z.number().min(0).default(0),
  excludedSectors: z.array(z.string()).max(64).default([]),
}).strict().default({
  maxHedges: 3,
  maxPositionWeight: 0.1,
  maxTotalHedgeWeight: 0.3,
  maxSectorWeight: 1,
  hedgeIntensity: 1,
  longOnly: false,
  allowedInstrumentTypes: ["etf"],
  customUniverse: [],
  targetExposures: {},
  minConfidence: "medium",
  minLiquidityUsd: 0,
  excludedSectors: [],
})

export const portfolioOptimizerConstraintsSchema = z.object({
  maxCandidates: z.number().int().min(1).max(8).default(3),
  maxIterations: z.number().int().min(10).max(250).default(50),
  maxRuntimeMs: z.number().int().min(50).max(2500).default(750),
  maxPositionWeight: z.number().min(0.001).max(1).default(0.35),
  minPositionWeight: z.number().min(0).max(0.5).default(0),
  longOnly: z.boolean().default(true),
  turnoverLimit: z.number().min(0).max(2).default(0.25),
  riskFreeRate: z.number().min(-0.25).max(0.25).default(0),
}).strict().default({
  maxCandidates: 3,
  maxIterations: 50,
  maxRuntimeMs: 750,
  maxPositionWeight: 0.35,
  minPositionWeight: 0,
  longOnly: true,
  turnoverLimit: 0.25,
  riskFreeRate: 0,
})

export const portfolioOptimizeRequestSchema = z.object({
  country: z.string().min(2).max(12).default("US"),
  lookback: z.string().min(2).max(12).optional(),
  category: z.string().min(2).max(32).optional(),
  keys: z.array(z.string()).default([]),
  objective: z.enum(["factor_neutral", "min_drawdown", "regime_aware"]).default("factor_neutral"),
  maxHedges: z.number().int().min(1).max(5).optional(),
  constraints: portfolioOptimizerConstraintsSchema.optional(),
  holdings: z.array(portfolioHoldingInputSchema).min(1).max(250),
}).strict()

export const portfolioHedgeRequestSchema = z.object({
  country: z.string().min(2).max(12).default("US"),
  lookback: z.string().min(2).max(12).optional(),
  category: z.string().min(2).max(32).optional(),
  keys: z.array(z.string()).default([]),
  objective: z.enum(["factor_neutral", "min_drawdown", "regime_aware"]).default("factor_neutral"),
  mode: z.enum(["compact", "standard"]).default("compact"),
  constraints: portfolioHedgeConstraintsSchema,
  holdings: z.array(portfolioHoldingInputSchema).min(1).max(250),
}).strict()

export const portfolioStressTestRequestSchema = z.object({
  country: z.string().min(2).max(12).default("US"),
  lookback: z.string().min(2).max(12).optional(),
  category: z.string().min(2).max(32).optional(),
  keys: z.array(z.string()).default([]),
  scenarioKey: z.enum(["us_recession", "higher_for_longer", "china_growth_scare"]).optional(),
  holdings: z.array(portfolioHoldingInputSchema).min(1).max(250),
})

export const modelFactorAnalysisModelInputSchema = z.object({
  id: z.string().min(1).max(120).optional(),
  label: z.string().min(1).max(160).default("Ad hoc model"),
  description: z.string().max(500).default("Ad hoc model submitted for factor analysis."),
  tags: z.array(z.string().min(1).max(64)).max(20).default([]),
  source: z.enum(["turos", "client", "model_builder"]).default("client"),
}).strict().default({
  label: "Ad hoc model",
  description: "Ad hoc model submitted for factor analysis.",
  tags: [],
  source: "client",
})

export const modelFactorAnalysisIncludeSchema = z.object({
  attribution: z.boolean().default(true),
  hedge: z.boolean().default(false),
  optimizer: z.boolean().default(false),
  positionViews: z.boolean().default(true),
}).strict().default({
  attribution: true,
  hedge: false,
  optimizer: false,
  positionViews: true,
})

export const modelFactorAnalysisHedgeOptionsSchema = z.object({
  objective: z.enum(["factor_neutral", "min_drawdown", "regime_aware"]).default("factor_neutral"),
  mode: z.enum(["compact", "standard"]).default("compact"),
  constraints: portfolioHedgeConstraintsSchema,
}).strict().default({
  objective: "factor_neutral",
  mode: "compact",
  constraints: portfolioHedgeConstraintsSchema.parse(undefined),
})

export const modelFactorAnalysisOptimizerOptionsSchema = z.object({
  objective: z.enum(["factor_neutral", "min_drawdown", "regime_aware"]).default("factor_neutral"),
  constraints: portfolioOptimizerConstraintsSchema.optional(),
}).strict().default({
  objective: "factor_neutral",
})

export const modelFactorAnalysisRequestSchema = z.object({
  model: modelFactorAnalysisModelInputSchema,
  country: z.string().min(2).max(12).default("US"),
  lookback: z.string().min(2).max(12).optional(),
  window: z.string().min(2).max(12).optional(),
  category: z.string().min(2).max(32).optional(),
  keys: z.array(z.string()).default([]),
  include: modelFactorAnalysisIncludeSchema,
  hedge: modelFactorAnalysisHedgeOptionsSchema,
  optimizer: modelFactorAnalysisOptimizerOptionsSchema,
  holdings: z.array(portfolioHoldingInputSchema).min(1).max(250),
}).strict()

export const watchlistIntelligenceRequestSchema = z.object({
  country: z.string().min(2).max(12).default("US"),
  lookback: z.string().min(2).max(12).optional(),
  symbols: z.array(symbolSchema).min(1).max(25),
})

export const securityIntelligenceBundleSchema = z.object({
  object: z.literal("security_intelligence_bundle"),
  id: z.string(),
  asOf: z.string(),
  symbol: symbolSchema,
  snapshot: marketSnapshotSchema,
  reference: marketReferenceSchema.optional(),
  recentBars: z.array(marketBarSchema).default([]),
  catalysts: z.array(newsStorySchema).default([]),
  freshFilings: z.array(traceReferenceSchema).default([]),
  factorExposures: z.array(factorExposureSchema).default([]),
  summaryMd: z.string(),
  ...investorMetadataShape,
})

export const companyIntelligenceBundleSchema = z.object({
  object: z.literal("company_intelligence_bundle"),
  id: z.string(),
  asOf: z.string(),
  symbol: symbolSchema,
  entityId: z.string().nullable().optional(),
  snapshot: marketSnapshotSchema.nullable().optional(),
  reference: marketReferenceSchema.optional(),
  estimates: z.array(marketEstimateSnapshotSchema).default([]),
  latestNews: z.array(newsStorySchema).default([]),
  macroRegimes: z.array(macroRegimeSchema).default([]),
  factorExposures: z.array(factorExposureSchema).default([]),
  keyRisks: z.array(filingRiskSchema).default([]),
  returnDrivers: z.array(attributionContributionSchema).default([]),
  hedgeCandidates: z.array(hedgeCandidateSchema).default([]),
  summaryMd: z.string(),
  ...investorMetadataShape,
})

export const earningsPreviewBundleSchema = z.object({
  object: z.literal("earnings_preview_bundle"),
  id: z.string(),
  asOf: z.string(),
  symbol: symbolSchema,
  upcomingRelease: macroReleaseSchema.nullable().optional(),
  estimates: z.array(marketEstimateSnapshotSchema).default([]),
  keyRisks: z.array(filingRiskSchema).default([]),
  keyDrivers: z.array(attributionContributionSchema).default([]),
  summaryMd: z.string(),
  ...investorMetadataShape,
})

export const portfolioFitSummarySchema = z.object({
  object: z.literal("portfolio_fit_summary"),
  exposureCount: z.number().int().nonnegative(),
  activeFactorCount: z.number().int().nonnegative(),
  averageRSquared: z.number().min(0).max(1).nullable(),
  averageAdjustedRSquared: z.number().nullable(),
  idiosyncraticRiskScore: z.number().min(0).max(1).nullable(),
  rSquaredMethod: z.literal("unweighted_average_of_factor_exposure_r_squared"),
  idiosyncraticRiskMethod: z.literal("one_minus_average_factor_exposure_r_squared_proxy"),
  observationCount: z.number().int().nonnegative().nullable(),
  interpretation: z.string(),
})

export const portfolioBenchmarkTiltSchema = z.object({
  object: z.literal("portfolio_benchmark_tilt"),
  factorKey: z.string(),
  portfolioBeta: z.number(),
  benchmarkBeta: z.number(),
  activeTilt: z.number(),
  direction: z.enum(["overweight", "underweight", "neutral"]),
  summary: z.string(),
})

export const portfolioWhatIfComparisonSchema = z.object({
  object: z.literal("portfolio_what_if_comparison"),
  label: z.string(),
  holdings: z.array(portfolioHoldingInputSchema),
  exposureDeltas: z.array(portfolioBenchmarkTiltSchema).default([]),
  summaryMd: z.string(),
})

export const portfolioOptimizerCandidateSchema = z.object({
  object: z.literal("portfolio_optimizer_candidate"),
  rank: z.number().int().positive(),
  name: z.string(),
  objective: z.enum(["current_reference", "factor_neutral", "min_drawdown", "regime_aware"]),
  holdings: z.array(portfolioHoldingInputSchema),
  expectedReturn: z.number(),
  expectedVolatility: z.number(),
  expectedSharpe: z.number(),
  maxDrawdownProxy: z.number(),
  factorExposureScore: z.number(),
  turnover: z.number(),
  score: z.number(),
  constraintStatus: z.enum(["ok", "capped", "rejected"]),
  constraintsApplied: z.array(z.string()).default([]),
  rationale: z.string(),
})

export const portfolioOptimizerCandidateSummarySchema = portfolioOptimizerCandidateSchema.omit({
  holdings: true,
})

export const portfolioOptimizerRuntimeSchema = z.object({
  object: z.literal("portfolio_optimizer_runtime"),
  method: z.literal("bounded_deterministic_candidate_search"),
  candidateCount: z.number().int().nonnegative(),
  iterationBudget: z.number().int().positive(),
  iterationsRun: z.number().int().nonnegative(),
  runtimeMs: z.number(),
  maxRuntimeMs: z.number().int().positive(),
  timeout: z.boolean(),
})

export const portfolioAnalysisSchema = z.object({
  object: z.literal("portfolio_analysis"),
  id: z.string(),
  asOf: z.string(),
  holdings: z.array(portfolioHoldingInputSchema),
  exposures: z.array(factorExposureSchema).default([]),
  fit: portfolioFitSummarySchema.nullable().default(null),
  benchmarkLabel: z.string().nullable().default(null),
  benchmarkTilts: z.array(portfolioBenchmarkTiltSchema).default([]),
  whatIfComparison: portfolioWhatIfComparisonSchema.nullable().default(null),
  positionViews: z.array(z.lazy(() => portfolioPositionFactorViewSchema)).default([]),
  positionExposures: z.array(factorExposureSchema).default([]),
  attribution: z.array(attributionContributionSchema).default([]),
  hedgeSuggestions: z.array(hedgeCandidateSchema).default([]),
  optimizationNotes: z.array(z.string()).default([]),
  factorNeutralPlan: z.array(z.string()).default([]),
  optimizerObjective: z.enum(["factor_neutral", "min_drawdown", "regime_aware"]).optional(),
  optimizerConstraints: portfolioOptimizerConstraintsSchema.optional(),
  optimizerRuntime: portfolioOptimizerRuntimeSchema.optional(),
  optimizerCandidates: z.array(portfolioOptimizerCandidateSchema).default([]).optional(),
  optimizerCandidateCount: z.number().int().nonnegative().optional(),
  optimizerCandidateSample: z.array(portfolioOptimizerCandidateSummarySchema).default([]).optional(),
  selectedCandidate: z.union([portfolioOptimizerCandidateSchema, portfolioOptimizerCandidateSummarySchema]).nullable().optional(),
  optimizerDisclosures: z.array(z.string()).default([]).optional(),
  summaryMd: z.string(),
  ...investorMetadataShape,
})

export const portfolioFactorAttributionSchema = z.object({
  object: z.literal("portfolio_factor_attribution"),
  rank: z.number().int().positive(),
  factorKey: z.string(),
  factorName: z.string(),
  factorCategory: z.string(),
  contributionPercent: z.number(),
  contributionPct: z.number().nullable(),
  beta: z.number(),
  factorReturn: z.number(),
  rawReturn: z.number().nullable().optional(),
  pureReturn: z.number().nullable().optional(),
  scaledReturn: z.number().nullable().optional(),
  zScore: z.number().nullable().optional(),
  leverage: z.number().nullable().optional(),
  modelName: z.string().nullable().optional(),
  explanation: z.string(),
  trace: traceReferenceSchema.nullable().optional(),
})

export const portfolioReturnPointSchema = z.object({
  object: z.literal("portfolio_return_point"),
  period: z.string(),
  periodEnd: z.string(),
  frequency: z.enum(["daily", "weekly", "monthly", "quarterly", "annual"]),
  periodReturn: z.number(),
  cumulativeReturn: z.number(),
  coverageWeight: z.number().min(0),
  missingSymbols: z.array(z.string()).default([]),
})

export const portfolioRollingBetaSchema = z.object({
  object: z.literal("portfolio_rolling_beta"),
  factorKey: z.string(),
  factorName: z.string(),
  factorCategory: z.string(),
  beta: z.number(),
  lookback: z.string(),
  windowStart: z.string().nullable(),
  windowEnd: z.string(),
  rSquared: z.number().nullable(),
  adjustedRSquared: z.number().nullable(),
  observationCount: z.number().int().nonnegative().nullable(),
  method: z.literal("materialized_factor_exposure_regression_beta"),
})

export const portfolioAttributionExportFileSchema = z.object({
  name: z.string(),
  kind: z.enum(["contributions", "return_stream", "rolling_betas"]),
  format: z.literal("csv"),
  columns: z.array(z.string()).default([]),
  csv: z.string(),
})

export const portfolioAttributionExportSchema = z.object({
  object: z.literal("portfolio_attribution_export"),
  requestedFormat: z.enum(["json", "csv", "both"]),
  formats: z.array(z.enum(["json", "csv"])).default(["json"]),
  fileName: z.string(),
  columns: z.array(z.string()).default([]),
  csv: z.string().nullable().default(null),
  files: z.array(portfolioAttributionExportFileSchema).default([]),
})

export const portfolioAttributionSchema = z.object({
  object: z.literal("portfolio_attribution"),
  id: z.string(),
  analysisId: z.string(),
  asOf: z.string(),
  country: z.string(),
  window: z.string(),
  lookback: z.string(),
  frequency: z.enum(["daily", "weekly", "monthly", "quarterly", "annual"]),
  holdings: z.array(portfolioHoldingInputSchema),
  portfolioReturn: z.number().nullable(),
  totalExplained: z.number(),
  alpha: z.number().nullable(),
  rSquared: z.number().nullable(),
  contributions: z.array(portfolioFactorAttributionSchema).default([]),
  returnStream: z.array(portfolioReturnPointSchema).default([]),
  returnPointCount: z.number().int().nonnegative().optional(),
  returnStreamSample: z.array(portfolioReturnPointSchema).default([]).optional(),
  rollingBetas: z.array(portfolioRollingBetaSchema).default([]),
  rollingBetaCount: z.number().int().nonnegative().optional(),
  rollingBetasUnavailableReason: z.string().nullable().default(null),
  exposures: z.array(factorExposureSchema).default([]),
  export: portfolioAttributionExportSchema,
  summaryMd: z.string(),
  ...investorMetadataShape,
})

export const portfolioHedgeTargetExposureSchema = z.object({
  object: z.literal("portfolio_hedge_target_exposure"),
  factorKey: z.string(),
  factorName: z.string(),
  factorCategory: z.string(),
  beta: z.number(),
  targetExposureDelta: z.number(),
  proposedExposureDelta: z.number(),
  residualBeta: z.number(),
  hedged: z.boolean(),
  skipReason: z.string().nullable(),
})

export const portfolioHedgeCandidateSchema = z.object({
  object: z.literal("portfolio_hedge_candidate"),
  rank: z.number().int().positive(),
  factorKey: z.string(),
  factorName: z.string(),
  factorCategory: z.string(),
  symbol: symbolSchema,
  instrumentType: portfolioHedgeInstrumentTypeSchema,
  action: z.enum(["long", "short"]),
  recommendedWeight: z.number(),
  targetExposureDelta: z.number(),
  expectedExposureDelta: z.record(z.string(), z.number()).default({}),
  residualBeta: z.number(),
  constraintStatus: z.enum(["ok", "capped"]),
  constraintsApplied: z.array(z.string()).default([]),
  liquidityUsd: z.number().nullable(),
  estimatedCostBps: z.number().nullable(),
  sectorKey: z.string().nullable(),
  rationale: z.string(),
  confidence: z.enum(["high", "medium", "low"]),
})

export const portfolioHedgeSchema = z.object({
  object: z.literal("portfolio_hedge"),
  id: z.string(),
  analysisId: z.string().nullable(),
  asOf: z.string(),
  country: z.string(),
  lookback: z.string(),
  objective: z.enum(["factor_neutral", "min_drawdown", "regime_aware"]),
  mode: z.enum(["compact", "standard"]),
  constraints: portfolioHedgeConstraintsSchema,
  holdings: z.array(portfolioHoldingInputSchema),
  targetExposures: z.array(portfolioHedgeTargetExposureSchema).default([]),
  hedges: z.array(portfolioHedgeCandidateSchema).default([]),
  residualExposure: z.record(z.string(), z.number()).default({}),
  exposures: z.array(factorExposureSchema).default([]),
  optimizationNotes: z.array(z.string()).default([]),
  factorNeutralPlan: z.array(z.string()).default([]),
  summaryMd: z.string(),
  ...investorMetadataShape,
})

export const portfolioStressTestSchema = z.object({
  object: z.literal("portfolio_stress_test"),
  id: z.string(),
  asOf: z.string(),
  scenarioKey: z.string(),
  scenarioLabel: z.string(),
  estimatedDrawdownPercent: z.number(),
  factorShocks: z.record(z.string(), z.number()).default({}),
  macroShocks: z.record(z.string(), z.number()).default({}),
  regime: macroRegimeSchema.nullable().optional(),
  conditioningNotes: z.array(z.string()).default([]),
  summaryMd: z.string(),
  ...investorMetadataShape,
})

export const factorDrillTargetSchema = z.object({
  label: z.string(),
  method: z.literal("GET"),
  path: z.string(),
})

export const portfolioPositionFactorViewSchema = z.object({
  object: z.literal("portfolio_position_factor_view"),
  symbol: symbolSchema,
  holding: portfolioHoldingInputSchema,
  activeFactorCount: z.number().int().nonnegative(),
  topFactors: z.array(factorExposureSchema).default([]),
  summaryMd: z.string(),
  drillTargets: z.object({
    loadings: factorDrillTargetSchema,
    decomposition: factorDrillTargetSchema,
  }),
})

export const modelPortfolioFactorViewSchema = z.object({
  object: z.literal("model_portfolio_factor_view"),
  id: z.string(),
  portfolioId: z.string(),
  label: z.string(),
  description: z.string(),
  tags: z.array(z.string()).default([]),
  holdings: z.array(portfolioHoldingInputSchema),
  analysis: portfolioAnalysisSchema,
  positionViews: z.array(portfolioPositionFactorViewSchema).default([]),
  positionExposures: z.array(factorExposureSchema).default([]),
  ...investorMetadataShape,
})

export const modelFactorAnalysisSchema = z.object({
  object: z.literal("model_factor_analysis"),
  id: z.string(),
  asOf: z.string(),
  model: z.object({
    id: z.string(),
    label: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    source: z.enum(["turos", "client", "model_builder"]),
  }),
  country: z.string(),
  lookback: z.string(),
  window: z.string(),
  category: z.string(),
  holdings: z.array(portfolioHoldingInputSchema),
  include: modelFactorAnalysisIncludeSchema,
  analysis: portfolioAnalysisSchema,
  attribution: portfolioAttributionSchema.nullable(),
  hedge: portfolioHedgeSchema.nullable(),
  optimizerObjective: z.enum(["factor_neutral", "min_drawdown", "regime_aware"]).optional(),
  optimizerConstraints: portfolioOptimizerConstraintsSchema.optional(),
  optimizerRuntime: portfolioOptimizerRuntimeSchema.optional(),
  optimizerCandidates: z.array(portfolioOptimizerCandidateSchema).default([]).optional(),
  optimizerCandidateCount: z.number().int().nonnegative().optional(),
  optimizerCandidateSample: z.array(portfolioOptimizerCandidateSummarySchema).default([]).optional(),
  selectedCandidate: z.union([portfolioOptimizerCandidateSchema, portfolioOptimizerCandidateSummarySchema]).nullable().optional(),
  optimizerDisclosures: z.array(z.string()).default([]).optional(),
  positionViews: z.array(portfolioPositionFactorViewSchema).default([]),
  positionExposures: z.array(factorExposureSchema).default([]),
  summaryMd: z.string(),
  ...investorMetadataShape,
})

export const factorRotationStrategySchema = z.object({
  object: z.literal("factor_rotation_strategy"),
  id: z.string(),
  asOf: z.string(),
  country: isoCountryCodeSchema,
  regime: macroRegimeSchema,
  leaders: z.array(factorRegimePerformanceSchema).default([]),
  laggards: z.array(factorRegimePerformanceSchema).default([]),
  summaryMd: z.string(),
  ...investorMetadataShape,
})

export const factorDashboardSchema = z.object({
  object: z.literal("factor_dashboard"),
  id: z.string(),
  asOf: z.string(),
  country: isoCountryCodeSchema,
  category: z.string(),
  window: z.string(),
  lookback: z.string(),
  intraday: z.array(factorIntradaySnapshotSchema).default([]),
  regimePerformance: z.array(factorRegimePerformanceSchema).default([]),
  rotation: factorRotationStrategySchema.nullable().optional(),
  spotlightSymbol: symbolSchema.nullable().optional(),
  spotlightExposures: z.array(factorExposureSchema).default([]),
  modelPortfolio: modelPortfolioFactorViewSchema.nullable().optional(),
  summaryMd: z.string(),
  ...investorMetadataShape,
})

export const watchlistIntelligenceBundleSchema = z.object({
  object: z.literal("watchlist_intelligence_bundle"),
  id: z.string(),
  asOf: z.string(),
  symbols: z.array(symbolSchema).default([]),
  movers: z.array(securityIntelligenceBundleSchema).default([]),
  macroRegimes: z.array(macroRegimeSchema).default([]),
  summaryMd: z.string(),
  ...investorMetadataShape,
})

export const countryReportSchema = z.object({
  object: z.literal("country_report"),
  id: z.string(),
  asOf: z.string(),
  country: isoCountryCodeSchema,
  lookback: z.string(),
  indicators: z.array(macroObservationSchema).default([]),
  releases: z.array(macroReleaseSchema).default([]),
  forecasts: z.array(macroForecastSchema).default([]),
  regime: macroRegimeSchema.nullable().optional(),
  likelyDrivers: z.array(attributionContributionSchema).default([]),
  summaryMd: z.string(),
  ...investorMetadataShape,
})

export const footnoteTopicSchema = z.enum([
  "lease",
  "tax",
  "revenue",
  "debt_covenant",
  "segment",
])

export const footnoteIntelligenceRequestSchema = z.object({
  ticker: symbolSchema.optional(),
  cik: z.string().trim().min(1).optional(),
  form: z.string().trim().min(2).max(12).default("10-K"),
  topics: z.array(footnoteTopicSchema).max(5).default([]),
  query: z.string().trim().min(1).nullable().optional(),
}).superRefine((value, ctx) => {
  if (!value.ticker && !value.cik) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["ticker"],
      message: "ticker or cik is required",
    })
  }
})

export const footnoteTopicMatchSchema = z.object({
  key: footnoteTopicSchema,
  label: z.string(),
  snippets: z.array(z.string()).default([]),
  traces: z.array(traceReferenceSchema).default([]),
})

export const footnoteIntelligenceResultSchema = z.object({
  object: z.literal("footnote_intelligence_result"),
  id: z.string(),
  asOf: z.string(),
  symbol: symbolSchema.nullable().optional(),
  cik: z.string().nullable().optional(),
  form: z.string(),
  query: z.string().nullable().optional(),
  filing: filingSchema.nullable(),
  topics: z.array(footnoteTopicMatchSchema).default([]),
  summaryMd: z.string(),
  ...investorMetadataShape,
})

export const intelligenceIntentSchema = z.enum([
  "macro_conditioned_decomposition",
  "return_decomposition",
  "factor_neutralization",
  "factor_rotation",
  "regime_screen",
  "portfolio_optimization",
  "portfolio_stress_test",
  "country_regime_report",
  "manager_style_drift",
  "ownership_change",
  "insider_monitor",
  "insider_tracking",
  "filing_footnote_investigation",
  "earnings_preview",
  "why_did_it_move",
])

export const intelligenceResponseModeSchema = z.enum(["compact_json", "compact_json_and_md", "markdown"])

export const intelligenceExecutionClassSchema = z.enum(["hot_sync", "standard_sync", "async"])

export const intelligenceQueryActionSlotSchema = z.enum([
  "decompose",
  "neutralize",
  "rotate",
  "screen",
  "optimize",
  "stress_test",
  "report",
  "track",
  "investigate",
  "preview",
  "explain",
])

export const intelligenceQuerySubjectSlotSchema = z.enum([
  "return",
  "factor",
  "portfolio",
  "regime",
  "macro",
  "country",
  "ownership",
  "insider",
  "footnote",
  "earnings",
  "price_move",
  "lease",
  "tax",
  "revenue",
  "debt_covenant",
  "segment",
])

export const intelligenceQueryContextSlotSchema = z.enum([
  "macro",
  "filing",
  "risk",
  "hedge",
  "style_drift",
  "13f",
  "tightening",
  "recession",
  "higher_for_longer",
])

export const intelligenceScopeSchema = z.object({
  target: z.enum(["security", "watchlist", "portfolio", "country", "manager"]),
  entityCount: z.number().int().nonnegative(),
  countryCount: z.number().int().nonnegative(),
  portfolioHoldings: z.number().int().nonnegative(),
  lookback: z.string().nullable().optional(),
})

export const intelligenceQueryPlanSchema = z.object({
  intent: intelligenceIntentSchema,
  intentConfidence: z.number().min(0).max(1),
  scope: intelligenceScopeSchema,
  requiredInputs: z.array(z.string()).default([]),
  narrowingHints: z.array(z.string()).default([]),
  executionClass: intelligenceExecutionClassSchema,
  planVersion: z.string(),
})

export const intelligenceQuerySlotManifestSchema = z.object({
  actions: z.array(intelligenceQueryActionSlotSchema).default([]),
  subjects: z.array(intelligenceQuerySubjectSlotSchema).default([]),
  contexts: z.array(intelligenceQueryContextSlotSchema).default([]),
  entitySymbol: symbolSchema.nullable().optional(),
  country: isoCountryCodeSchema.nullable().optional(),
  managerCik: z.string().nullable().optional(),
  lookback: z.string().nullable().optional(),
})

export const intelligenceQueryPlanManifestSchema = z.object({
  object: z.literal("query_plan_manifest"),
  id: z.string(),
  intent: intelligenceIntentSchema,
  intentConfidence: z.number().min(0).max(1),
  scope: intelligenceScopeSchema,
  requiredInputs: z.array(z.string()).default([]),
  narrowingHints: z.array(z.string()).default([]),
  executionClass: intelligenceExecutionClassSchema,
  planVersion: z.string(),
  slots: intelligenceQuerySlotManifestSchema,
  validationState: z.enum(["ready", "needs_inputs"]),
  missingInputs: z.array(z.string()).default([]),
  matchedSignals: z.array(z.string()).default([]),
})

export const intelligenceQueryRequestSchema = z.object({
  query: z.string().min(1),
  entities: z.array(symbolSchema).default([]),
  portfolio: z.array(portfolioHoldingInputSchema).nullable().optional(),
  countries: z.array(isoCountryCodeSchema).default([]),
  lookback: z.string().nullable().optional(),
  responseMode: intelligenceResponseModeSchema.default("compact_json_and_md"),
})

export const intelligenceSourceSchema = z.object({
  kind: z.string(),
  key: z.string().nullable().optional(),
  label: z.string().nullable().optional(),
})

export const intelligenceQueryResponseSchema = z.object({
  object: z.literal("intelligence_query_result"),
  intent: intelligenceIntentSchema,
  intentConfidence: z.number().min(0).max(1),
  scope: intelligenceScopeSchema,
  requiredInputs: z.array(z.string()).default([]),
  narrowingHints: z.array(z.string()).default([]),
  executionClass: intelligenceExecutionClassSchema,
  planVersion: z.string(),
  queryPlan: intelligenceQueryPlanSchema,
  queryPlanManifest: intelligenceQueryPlanManifestSchema,
  answerMd: z.string().nullable().optional(),
  data: z.record(z.string(), z.unknown()),
  tracepack: z.array(z.string()).default([]),
  sources: z.array(intelligenceSourceSchema).default([]),
  latencyMs: z.number().int().nonnegative(),
  cacheStatus: z.enum(["hit", "miss", "stale_revalidated", "bypass"]),
  ...investorMetadataShape,
})

export const intelligenceQueryJobSchema = z.object({
  object: z.literal("intelligence_query_job"),
  id: z.string(),
  intent: intelligenceIntentSchema.nullable(),
  status: z.enum(["queued", "running", "failed"]),
  pollUrl: z.string(),
  artifactId: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  completedAt: z.string().nullable().optional(),
  errorText: z.string().nullable().optional(),
})

export type MarketSnapshot = z.infer<typeof marketSnapshotSchema>
export type MarketReference = z.infer<typeof marketReferenceSchema>
export type MarketBar = z.infer<typeof marketBarSchema>
export type CorporateAction = z.infer<typeof corporateActionSchema>
export type MarketEstimateSnapshot = z.infer<typeof marketEstimateSnapshotSchema>
export type NewsStory = z.infer<typeof newsStorySchema>
export type MacroObservation = z.infer<typeof macroObservationSchema>
export type MacroRelease = z.infer<typeof macroReleaseSchema>
export type MacroForecast = z.infer<typeof macroForecastSchema>
export type MacroSourceAdapterMetadata = z.infer<typeof macroSourceAdapterMetadataSchema>
export type MacroRequestTemplateMetadata = z.infer<typeof macroRequestTemplateMetadataSchema>
export type MacroSourcePlanStep = z.infer<typeof macroSourcePlanStepSchema>
export type MacroSourcePlan = z.infer<typeof macroSourcePlanSchema>
export type MacroHighSignalSeries = z.infer<typeof macroHighSignalSeriesSchema>
export type MacroHighSignalPack = z.infer<typeof macroHighSignalPackSchema>
export type FactorDefinition = z.infer<typeof factorDefinitionSchema>
export type FactorReturn = z.infer<typeof factorReturnSchema>
export type FactorExtremeMove = z.infer<typeof factorExtremeMoveSchema>
export type FactorExtremePair = z.infer<typeof factorExtremePairSchema>
export type FactorValuation = z.infer<typeof factorValuationSchema>
export type FactorValuationStock = z.infer<typeof factorValuationStockSchema>
export type FactorHistory = z.infer<typeof factorHistorySchema>
export type FactorSparkline = z.infer<typeof factorSparklineSchema>
export type FactorIntradaySnapshot = z.infer<typeof factorIntradaySnapshotSchema>
export type FactorRegimePerformance = z.infer<typeof factorRegimePerformanceSchema>
export type FactorExposure = z.infer<typeof factorExposureSchema>
export type FactorRotationStrategy = z.infer<typeof factorRotationStrategySchema>
export type FactorDashboard = z.infer<typeof factorDashboardSchema>
export type CountryReportRequest = z.infer<typeof countryReportRequestSchema>
export type PortfolioIntelligenceRequest = z.infer<typeof portfolioIntelligenceRequestSchema>
export type PortfolioAttributionRequest = z.infer<typeof portfolioAttributionRequestSchema>
export type PortfolioHedgeConstraints = z.infer<typeof portfolioHedgeConstraintsSchema>
export type PortfolioHedgeRequest = z.infer<typeof portfolioHedgeRequestSchema>
export type PortfolioStressTestRequest = z.infer<typeof portfolioStressTestRequestSchema>
export type ModelFactorAnalysisRequest = z.infer<typeof modelFactorAnalysisRequestSchema>
export type WatchlistIntelligenceRequest = z.infer<typeof watchlistIntelligenceRequestSchema>
export type SecurityIntelligenceBundle = z.infer<typeof securityIntelligenceBundleSchema>
export type CompanyIntelligenceBundle = z.infer<typeof companyIntelligenceBundleSchema>
export type EarningsPreviewBundle = z.infer<typeof earningsPreviewBundleSchema>
export type PortfolioAnalysis = z.infer<typeof portfolioAnalysisSchema>
export type PortfolioAttribution = z.infer<typeof portfolioAttributionSchema>
export type PortfolioHedge = z.infer<typeof portfolioHedgeSchema>
export type PortfolioStressTest = z.infer<typeof portfolioStressTestSchema>
export type ModelPortfolioFactorView = z.infer<typeof modelPortfolioFactorViewSchema>
export type ModelFactorAnalysis = z.infer<typeof modelFactorAnalysisSchema>
export type WatchlistIntelligenceBundle = z.infer<typeof watchlistIntelligenceBundleSchema>
export type CountryReport = z.infer<typeof countryReportSchema>
export type FootnoteTopic = z.infer<typeof footnoteTopicSchema>
export type FootnoteIntelligenceRequest = z.infer<typeof footnoteIntelligenceRequestSchema>
export type FootnoteTopicMatch = z.infer<typeof footnoteTopicMatchSchema>
export type FootnoteIntelligenceResult = z.infer<typeof footnoteIntelligenceResultSchema>
export type IntelligenceIntent = z.infer<typeof intelligenceIntentSchema>
export type IntelligenceQueryRequest = z.infer<typeof intelligenceQueryRequestSchema>
export type IntelligenceQueryResponse = z.infer<typeof intelligenceQueryResponseSchema>
export type IntelligenceQueryPlanManifest = z.infer<typeof intelligenceQueryPlanManifestSchema>
export type IntelligenceQueryJob = z.infer<typeof intelligenceQueryJobSchema>
