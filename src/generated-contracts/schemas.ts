import { z } from "zod"
import { capabilityStateSchema, freshnessMetadataSchema, materializationMetadataSchema, traceKindSchema, traceStatusSchema, validationStatusSchema } from "./foundation.js"

export const provenanceSchema = z.object({
  source: z.string(),
  sourceLabel: z.string().optional(),
  sourceAgency: z.string().optional(),
  canonicality: z.string().optional(),
  fallbackPolicy: z.string().optional(),
  accessionNumber: z.string().nullable(),
  filingUrl: z.string().url(),
  acceptedAt: z.string().nullable().optional(),
  retrievedAt: z.string(),
  parserVersion: z.string(),
})

export const entityIdentifierSchema = z.object({
  type: z.string(),
  value: z.string(),
  normalized: z.string(),
  isPrimary: z.boolean().default(false),
  provenance: z.record(z.string(), z.unknown()).optional(),
  firstSeenAt: z.string().nullable().optional(),
  lastSeenAt: z.string().nullable().optional(),
})

export const entityResolutionSchema = z.object({
  confidence: z.number().min(0).max(1),
  matchBasis: z.string(),
  matchedValue: z.string().nullable().optional(),
  staleSymbol: z.boolean().default(false),
})

export const traceRegionSchema = z.object({
  status: traceStatusSchema,
  kind: z.enum(["inline_xbrl_fact", "html_text_range"]).nullable().optional(),
  startOffset: z.number().int().nonnegative().nullable().optional(),
  endOffset: z.number().int().nonnegative().nullable().optional(),
  snippet: z.string().nullable().optional(),
  viewerFragment: z.string().nullable().optional(),
})

export const traceSourceRecordSchema = z.object({
  sourceName: z.string(),
  sourceKind: z.string(),
  sourceKey: z.string(),
  sourceUrl: z.string().url(),
  publicationTs: z.string().nullable().optional(),
  firstObservedAt: z.string().nullable().optional(),
  lastObservedAt: z.string().nullable().optional(),
  latestIngestedAt: z.string().nullable().optional(),
  latestHttpStatus: z.number().int().nullable().optional(),
  latestStorageRef: z.string().nullable().optional(),
  lineage: z.record(z.string(), z.unknown()).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  error: z.string().nullable().optional(),
})

export const traceReferenceSchema = z.object({
  id: z.string(),
  kind: traceKindSchema,
  status: traceStatusSchema,
  href: z.string(),
  page: z.number().int().positive().nullable().optional(),
  region: traceRegionSchema.nullable().optional(),
})

export const entitySchema = z.object({
  object: z.literal("entity"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  entityType: z.string().optional(),
  ticker: z.string().nullable(),
  cik: z.string().nullable(),
  name: z.string(),
  aliases: z.array(z.string()).default([]),
  identifiers: z.array(entityIdentifierSchema).default([]),
  resolution: entityResolutionSchema.optional(),
  jurisdiction: z.string().nullable(),
  status: z.enum(["active", "merged", "conflicted"]).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  provenance: provenanceSchema,
  freshness: freshnessMetadataSchema.optional(),
  materialization: materializationMetadataSchema.optional(),
  validation: validationStatusSchema.optional(),
})

export const filingSchema = z.object({
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
  provenance: provenanceSchema,
  freshness: freshnessMetadataSchema.optional(),
  materialization: materializationMetadataSchema.optional(),
  validation: validationStatusSchema.optional(),
})

export const sectionSchema = z.object({
  object: z.literal("section"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  filingId: z.string(),
  ticker: z.string().nullable().optional(),
  form: z.string().optional(),
  key: z.string(),
  title: z.string(),
  contentMd: z.string(),
  snippet: z.string().optional(),
  trace: traceReferenceSchema.optional(),
  provenance: provenanceSchema,
  freshness: freshnessMetadataSchema.optional(),
  materialization: materializationMetadataSchema.optional(),
  validation: validationStatusSchema.optional(),
})

export const factPointSchema = z.object({
  object: z.literal("fact_point"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  entityId: z.string(),
  ticker: z.string().nullable(),
  companyName: z.string(),
  taxonomy: z.string(),
  tag: z.string(),
  label: z.string(),
  unit: z.string(),
  value: z.number(),
  periodStart: z.string().nullable(),
  periodEnd: z.string(),
  filedAt: z.string().nullable(),
  form: z.string().nullable(),
  fy: z.number().nullable(),
  fp: z.string().nullable(),
  frame: z.string().nullable(),
  provenance: provenanceSchema,
})

export const statementPeriodSchema = z.object({
  periodEnd: z.string(),
  filedAt: z.string().nullable(),
  form: z.string().nullable(),
  fy: z.number().nullable(),
  fp: z.string().nullable(),
})

export const statementValueSchema = statementPeriodSchema.extend({
  value: z.number().nullable(),
})

export const statementRowSchema = z.object({
  key: z.string(),
  tag: z.string(),
  taxonomy: z.string(),
  label: z.string(),
  unit: z.string().nullable(),
  values: z.array(statementValueSchema),
})

export const compactStatementRowSchema = z.object({
  key: z.string().nullable(),
  label: z.string().nullable().optional(),
  unit: z.string().nullable(),
  values: z.array(z.number().nullable()),
})

export const compactStatementSchema = z.object({
  ticker: z.string().nullable(),
  statementKey: z.string().nullable(),
  period: z.enum(["annual", "quarterly"]).nullable(),
  periods: z.array(statementPeriodSchema),
  rows: z.array(compactStatementRowSchema),
  requestId: z.string().optional(),
  traceparent: z.string().nullable().optional(),
})

export const statementSchema = z.object({
  object: z.literal("statement"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  entityId: z.string(),
  ticker: z.string().nullable(),
  companyName: z.string(),
  statementKey: z.string(),
  title: z.string(),
  period: z.enum(["annual", "quarterly"]),
  periods: z.array(statementPeriodSchema),
  rows: z.array(statementRowSchema),
  provenance: provenanceSchema,
  completeness: z.object({
    source: z.enum(["xbrl_facts", "company_facts"]),
    observationsReturned: z.number().int().nonnegative().optional(),
    hasResolvedConcept: z.boolean().optional(),
  }).optional(),
  freshness: freshnessMetadataSchema.optional(),
  materialization: materializationMetadataSchema.optional(),
  validation: validationStatusSchema.optional(),
})

export const statementBundleSchema = z.object({
  object: z.literal("statement_bundle"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  entityId: z.string(),
  ticker: z.string().nullable(),
  companyName: z.string(),
  period: z.enum(["annual", "quarterly"]),
  statements: z.object({
    balanceSheet: statementSchema,
    incomeStatement: statementSchema,
    cashFlowStatement: statementSchema,
  }),
  provenance: provenanceSchema,
  freshness: freshnessMetadataSchema.optional(),
  materialization: materializationMetadataSchema.optional(),
  validation: validationStatusSchema.optional(),
})

export const segmentedFactMetricSchema = z.enum(["revenue", "profit_loss"])

export const segmentedRevenueRecordSchema = z.object({
  segmentAxis: z.string(),
  segmentMember: z.string(),
  segmentLabel: z.string(),
  segmentType: z.enum(["geographic", "product", "other"]).optional(),
  axisFamily: z.string().optional(),
  hierarchyDepth: z.number().int().optional(),
  isMostGranularSibling: z.boolean().optional(),
  metricKey: z.literal("revenue").optional(),
  taxonomy: z.string(),
  tag: z.string(),
  unit: z.string(),
  value: z.number(),
  periodStart: z.string().nullable(),
  periodEnd: z.string(),
  filingDate: z.string(),
  reportDate: z.string().nullable(),
  form: z.string(),
  accessionNumber: z.string(),
  capability: capabilityStateSchema.optional(),
  trace: traceReferenceSchema.optional(),
  provenance: provenanceSchema,
})

export const segmentedRevenueSeriesSchema = z.object({
  object: z.literal("segmented_revenue_series"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  entityId: z.string(),
  ticker: z.string().nullable(),
  companyName: z.string(),
  period: z.enum(["annual", "quarterly"]),
  capability: capabilityStateSchema.optional(),
  records: z.array(segmentedRevenueRecordSchema),
  provenance: provenanceSchema,
  freshness: freshnessMetadataSchema.optional(),
  materialization: materializationMetadataSchema.optional(),
  validation: validationStatusSchema.optional(),
})

export const segmentedFactRecordSchema = segmentedRevenueRecordSchema.extend({
  metricKey: segmentedFactMetricSchema,
  axisFamily: z.string(),
  hierarchyDepth: z.number().int(),
  isMostGranularSibling: z.boolean(),
})

export const segmentedFactSeriesSchema = z.object({
  object: z.literal("segmented_fact_series"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  entityId: z.string(),
  ticker: z.string().nullable(),
  companyName: z.string(),
  period: z.enum(["annual", "quarterly"]),
  metric: segmentedFactMetricSchema,
  capability: capabilityStateSchema.optional(),
  records: z.array(segmentedFactRecordSchema),
  provenance: provenanceSchema,
  freshness: freshnessMetadataSchema.optional(),
  materialization: materializationMetadataSchema.optional(),
  validation: validationStatusSchema.optional(),
})

const pensionBenefitScheduleRowSchema = z.object({
  label: z.string(),
  value: z.number(),
})

export const pensionBenefitScheduleSchema = z.object({
  object: z.literal("pension_benefit_schedule"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  entityId: z.string(),
  ticker: z.string().nullable(),
  companyName: z.string(),
  form: z.string(),
  filingDate: z.string(),
  reportDate: z.string().nullable(),
  targetYear: z.number().int(),
  rows: z.object({
    pension_benefits: pensionBenefitScheduleRowSchema.nullable(),
    health_care_and_life_insurance_benefits: pensionBenefitScheduleRowSchema.nullable(),
  }),
  provenance: provenanceSchema,
  freshness: freshnessMetadataSchema.optional(),
  materialization: materializationMetadataSchema.optional(),
  validation: validationStatusSchema.optional(),
})

export const shareFloatFactSchema = z.object({
  taxonomy: z.string(),
  tag: z.string(),
  label: z.string(),
  unit: z.string(),
  value: z.number(),
  periodEnd: z.string(),
  filedAt: z.string().nullable(),
  form: z.string().nullable(),
})

export const shareFloatSchema = z.object({
  object: z.literal("share_float"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  entityId: z.string(),
  ticker: z.string().nullable(),
  cik: z.string().nullable(),
  companyName: z.string(),
  asOf: z.string(),
  form: z.string().nullable(),
  filingDate: z.string().nullable(),
  reportDate: z.string().nullable(),
  capability: capabilityStateSchema,
  sourceMode: z.enum(["company_facts", "shares_outstanding_proxy", "not_disclosed", "unavailable"]),
  statusNote: z.string().nullable(),
  publicFloatUsd: z.number().nullable(),
  sharesOutstanding: z.number().nullable(),
  xbrlData: z.record(z.string(), z.number()),
  facts: z.object({
    publicFloatUsd: shareFloatFactSchema.nullable(),
    sharesOutstanding: shareFloatFactSchema.nullable(),
  }),
  summaryMd: z.string(),
  provenance: provenanceSchema,
  freshness: freshnessMetadataSchema.optional(),
  materialization: materializationMetadataSchema.optional(),
  validation: validationStatusSchema.optional(),
})

export const companyFinancialRecordSchema = z.object({
  period_of_report_date: z.string(),
  fiscal_period: z.string().nullable(),
  fiscal_year: z.number().nullable(),
  filing_date: z.string().nullable(),
})

export const companyIncomeStatementSchema = companyFinancialRecordSchema.extend({
  revenue: z.number().nullable(),
  costOfRevenue: z.number().nullable(),
  grossProfit: z.number().nullable(),
  operatingIncome: z.number().nullable(),
  netIncome: z.number().nullable(),
  ebitda: z.number().nullable(),
  eps: z.number().nullable(),
  epsDiluted: z.number().nullable(),
  weightedAverageShares: z.number().nullable(),
})

export const companyBalanceSheetSchema = companyFinancialRecordSchema.extend({
  assets: z.number().nullable(),
  currentAssets: z.number().nullable(),
  equity: z.number().nullable(),
  totalLiabilities: z.number().nullable(),
  longTermDebt: z.number().nullable(),
  currentLiabilities: z.number().nullable(),
  retainedEarnings: z.number().nullable(),
  cashAndEquivalents: z.number().nullable(),
})

export const companyCashFlowStatementSchema = companyFinancialRecordSchema.extend({
  operatingCashFlow: z.number().nullable(),
  capitalExpenditures: z.number().nullable(),
  freeCashFlow: z.number().nullable(),
  dividendsPaid: z.number().nullable(),
  depreciationAndAmortization: z.number().nullable(),
})

export const companyFinancialsSchema = companyFinancialRecordSchema.extend({
  financials: z.object({
    income_statement: companyIncomeStatementSchema,
    balance_sheet: companyBalanceSheetSchema,
    cash_flow_statement: companyCashFlowStatementSchema,
  }),
})

export const companyRatioSchema = companyFinancialRecordSchema.extend({
  grossProfitMargin: z.number().nullable(),
  operatingProfitMargin: z.number().nullable(),
  netProfitMargin: z.number().nullable(),
  ebitdaMargin: z.number().nullable(),
  returnOnEquity: z.number().nullable(),
  returnOnAssets: z.number().nullable(),
  returnOnCapitalEmployed: z.number().nullable(),
  priceEarningsRatio: z.number().nullable(),
  priceToBookRatio: z.number().nullable(),
  enterpriseValueMultiple: z.number().nullable(),
  dividendYield: z.number().nullable(),
  dividendPayoutRatio: z.number().nullable(),
  debtEquityRatio: z.number().nullable(),
  currentRatio: z.number().nullable(),
  dividendPerShare: z.number().nullable(),
  dividendPerShareCagr: z.number().nullable(),
})

const companyFinancialEnvelopeBase = z.object({
  ticker: z.string().nullable(),
  companyName: z.string(),
  period: z.enum(["annual", "quarterly"]),
  provenance: provenanceSchema,
  freshness: freshnessMetadataSchema.optional(),
  materialization: materializationMetadataSchema.optional(),
  requestId: z.string().optional(),
  traceparent: z.string().optional(),
})

export const companyIncomeStatementsSchema = companyFinancialEnvelopeBase.extend({
  object: z.literal("company_income_statements"),
  data: z.array(companyIncomeStatementSchema),
})

export const companyBalanceSheetsSchema = companyFinancialEnvelopeBase.extend({
  object: z.literal("company_balance_sheets"),
  data: z.array(companyBalanceSheetSchema),
})

export const companyCashFlowStatementsSchema = companyFinancialEnvelopeBase.extend({
  object: z.literal("company_cash_flow_statements"),
  data: z.array(companyCashFlowStatementSchema),
})

export const companyFinancialsEnvelopeSchema = companyFinancialEnvelopeBase.extend({
  object: z.literal("company_financials"),
  data: z.array(companyFinancialsSchema),
})

export const companyRatiosSchema = companyFinancialEnvelopeBase.extend({
  object: z.literal("company_ratios"),
  data: z.array(companyRatioSchema),
})

export const boardDirectorSchema = z.object({
  name: z.string(),
  roleTitle: z.string().nullable(),
  nominationStatus: z.enum(["nominee", "continuing", "departing", "unknown"]),
  independence: z.enum(["independent", "non_independent", "unknown"]),
  committees: z.array(z.string()),
  chairCommittees: z.array(z.string()),
  age: z.number().nullable(),
  directorSince: z.number().nullable(),
  biographySnippet: z.string().nullable(),
})

export const boardCompositionSchema = z.object({
  object: z.literal("board_composition"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  entityId: z.string(),
  ticker: z.string().nullable(),
  cik: z.string().nullable(),
  companyName: z.string(),
  form: z.string(),
  filingDate: z.string(),
  reportDate: z.string().nullable(),
  accessionNumber: z.string(),
  capability: capabilityStateSchema,
  committeeCoverage: z.enum(["complete", "partial", "none"]),
  statusNote: z.string().nullable(),
  directorCount: z.number(),
  directors: z.array(boardDirectorSchema),
  summaryMd: z.string(),
  provenance: provenanceSchema,
  freshness: freshnessMetadataSchema.optional(),
  materialization: materializationMetadataSchema.optional(),
  validation: validationStatusSchema.optional(),
})

export const nportHoldingSchema = z.object({
  issuer: z.string(),
  title: z.string().nullable(),
  cusip: z.string().nullable(),
  isin: z.string().nullable(),
  valueUsd: z.number().nullable(),
  balance: z.number().nullable(),
  balanceUnit: z.string().nullable(),
  assetType: z.string().nullable(),
  issuerType: z.string().nullable(),
  country: z.string().nullable(),
  currency: z.string().nullable(),
  pctNetAssets: z.number().nullable(),
})

export const nportHoldingsSchema = z.object({
  object: z.literal("nport_holdings"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  entityId: z.string(),
  ticker: z.string().nullable(),
  cik: z.string().nullable(),
  fundName: z.string(),
  form: z.string(),
  filingDate: z.string(),
  reportDate: z.string().nullable(),
  accessionNumber: z.string(),
  capability: capabilityStateSchema,
  statusNote: z.string().nullable(),
  holdingCount: z.number(),
  holdings: z.array(nportHoldingSchema),
  summaryMd: z.string(),
  provenance: provenanceSchema,
  freshness: freshnessMetadataSchema.optional(),
  materialization: materializationMetadataSchema.optional(),
  validation: validationStatusSchema.optional(),
})

export const ownershipHoldingSchema = z.object({
  issuer: z.string(),
  classTitle: z.string().nullable(),
  cusip: z.string().nullable(),
  valueUsdThousands: z.number().nullable(),
  shares: z.number().nullable(),
  shareType: z.string().nullable(),
  putCall: z.string().nullable(),
  investmentDiscretion: z.string().nullable(),
})

export const ownershipReportSchema = z.object({
  object: z.literal("ownership_report"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  entityId: z.string(),
  ticker: z.string().nullable(),
  managerName: z.string(),
  form: z.string(),
  filingDate: z.string(),
  reportDate: z.string().nullable(),
  accessionNumber: z.string(),
  holdings: z.array(ownershipHoldingSchema),
  provenance: provenanceSchema,
  freshness: freshnessMetadataSchema.optional(),
  materialization: materializationMetadataSchema.optional(),
  validation: validationStatusSchema.optional(),
})

export const ownershipComparisonRowSchema = z.object({
  issuer: z.string(),
  cusip: z.string().nullable(),
  status: z.enum(["added", "removed", "changed", "unchanged"]),
  currentValueUsdThousands: z.number().nullable(),
  previousValueUsdThousands: z.number().nullable(),
  deltaValueUsdThousands: z.number().nullable(),
  currentShares: z.number().nullable(),
  previousShares: z.number().nullable(),
  deltaShares: z.number().nullable(),
})

export const ownershipComparisonSchema = z.object({
  object: z.literal("ownership_comparison"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  entityId: z.string(),
  ticker: z.string().nullable(),
  managerName: z.string(),
  currentFilingDate: z.string(),
  previousFilingDate: z.string(),
  rows: z.array(ownershipComparisonRowSchema),
  summaryMd: z.string(),
  provenance: provenanceSchema,
  freshness: freshnessMetadataSchema.optional(),
  materialization: materializationMetadataSchema.optional(),
  validation: validationStatusSchema.optional(),
})

export const institutionalInvestorHoldingSchema = z.object({
  issuer: z.string(),
  issuerEntityId: z.string().nullable(),
  issuerTicker: z.string().nullable(),
  classTitle: z.string().nullable(),
  cusip: z.string().nullable(),
  valueUsdThousands: z.number().nullable(),
  shares: z.number().nullable(),
  shareType: z.string().nullable(),
  putCall: z.string().nullable(),
  investmentDiscretion: z.string().nullable(),
  weightBps: z.number().nullable(),
  positionRank: z.number(),
  changeStatus: z.enum(["added", "changed", "unchanged"]),
  previousValueUsdThousands: z.number().nullable(),
  previousShares: z.number().nullable(),
  deltaValueUsdThousands: z.number().nullable(),
  deltaShares: z.number().nullable(),
})

export const institutionalInvestorPortfolioSchema = z.object({
  object: z.literal("institutional_investor_portfolio"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  entityId: z.string(),
  ticker: z.string().nullable(),
  managerEntityId: z.string(),
  managerName: z.string(),
  managerCik: z.string(),
  managerTicker: z.string().nullable(),
  filingDate: z.string(),
  reportDate: z.string().nullable(),
  accessionNumber: z.string(),
  holdingsCount: z.number(),
  totalValueUsdThousands: z.number().nullable(),
  holdings: z.array(institutionalInvestorHoldingSchema),
  provenance: provenanceSchema,
  freshness: freshnessMetadataSchema.optional(),
  materialization: materializationMetadataSchema.optional(),
  validation: validationStatusSchema.optional(),
})

export const institutionalOwnershipExtractSchema = z.object({
  object: z.literal("institutional_ownership_extract"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  entityId: z.string(),
  ticker: z.string().nullable(),
  managerEntityId: z.string(),
  managerName: z.string(),
  managerCik: z.string(),
  managerTicker: z.string().nullable(),
  year: z.number().int(),
  quarter: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  reportDate: z.string(),
  filingDate: z.string(),
  accessionNumber: z.string(),
  comparisonCoverage: z.enum(["with_prior_quarter_delta", "current_only"]),
  statusNote: z.string().nullable(),
  holdingsCount: z.number(),
  totalValueUsdThousands: z.number().nullable(),
  holdings: z.array(institutionalInvestorHoldingSchema),
  summaryMd: z.string(),
  provenance: provenanceSchema,
  freshness: freshnessMetadataSchema.optional(),
  materialization: materializationMetadataSchema.optional(),
  validation: validationStatusSchema.optional(),
})

export const institutionalHolderSchema = z.object({
  holderEntityId: z.string().nullable(),
  managerName: z.string(),
  managerCik: z.string(),
  managerTicker: z.string().nullable(),
  filingDate: z.string(),
  reportDate: z.string().nullable(),
  accessionNumber: z.string(),
  issuer: z.string(),
  issuerEntityId: z.string().nullable(),
  issuerTicker: z.string().nullable(),
  classTitle: z.string().nullable(),
  cusip: z.string().nullable(),
  valueUsdThousands: z.number().nullable(),
  shares: z.number().nullable(),
  shareType: z.string().nullable(),
  putCall: z.string().nullable(),
  investmentDiscretion: z.string().nullable(),
  weightBps: z.number().nullable(),
  holderRank: z.number(),
})

export const institutionalHolderListSchema = z.object({
  object: z.literal("institutional_holder_list"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  entityId: z.string(),
  ticker: z.string().nullable(),
  companyName: z.string(),
  reportDate: z.string().nullable(),
  filingDate: z.string().nullable(),
  formsScanned: z.number(),
  holders: z.array(institutionalHolderSchema),
  provenance: provenanceSchema,
  freshness: freshnessMetadataSchema.optional(),
  materialization: materializationMetadataSchema.optional(),
  validation: validationStatusSchema.optional(),
})

export const insiderTradeSchema = z.object({
  object: z.literal("insider_trade"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  entityId: z.string(),
  ticker: z.string().nullable(),
  ownerName: z.string().nullable(),
  ownerCik: z.string().nullable(),
  ownerTitle: z.string().nullable(),
  issuerName: z.string(),
  form: z.string(),
  filingDate: z.string(),
  transactionDate: z.string().nullable(),
  transactionCode: z.string().nullable(),
  transactionDirection: z.enum(["acquired", "disposed", "unknown"]),
  securityTitle: z.string().nullable(),
  transactionShares: z.number().nullable(),
  transactionPrice: z.number().nullable(),
  transactionValue: z.number().nullable(),
  sharesOwnedPrior: z.number().nullable(),
  sharesOwnedFollowing: z.number().nullable(),
  ownershipType: z.string().nullable(),
  isDirector: z.boolean().nullable(),
  isOfficer: z.boolean().nullable(),
  isTenPercentOwner: z.boolean().nullable(),
  isOther: z.boolean().nullable(),
  accessionNumber: z.string(),
  provenance: provenanceSchema,
  freshness: freshnessMetadataSchema.optional(),
  materialization: materializationMetadataSchema.optional(),
  validation: validationStatusSchema.optional(),
})

export const beneficialOwnershipReportSchema = z.object({
  object: z.literal("beneficial_ownership_report"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  entityId: z.string(),
  ticker: z.string().nullable(),
  issuerName: z.string(),
  filerName: z.string().nullable(),
  form: z.string(),
  filingFamily: z.enum(["13D", "13G"]),
  isAmendment: z.boolean(),
  ownershipChangeType: z.enum(["initial", "amendment", "passive"]),
  filingDate: z.string(),
  accessionNumber: z.string(),
  eventDate: z.string().nullable(),
  sharesBeneficiallyOwned: z.number().nullable(),
  ownershipPercent: z.number().nullable(),
  sourceOfFunds: z.string().nullable(),
  purposeSummary: z.string().nullable(),
  summaryMd: z.string(),
  provenance: provenanceSchema,
  freshness: freshnessMetadataSchema.optional(),
  materialization: materializationMetadataSchema.optional(),
  validation: validationStatusSchema.optional(),
})

export const offeringRecordSchema = z.object({
  object: z.literal("offering_record"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  entityId: z.string(),
  ticker: z.string().nullable(),
  companyName: z.string(),
  form: z.string(),
  offeringFamily: z.enum(["S-1", "424"]),
  isAmendment: z.boolean(),
  filingDate: z.string(),
  accessionNumber: z.string(),
  offeringType: z.enum(["registration_statement", "prospectus"]),
  title: z.string(),
  prospectusUrl: z.string().url(),
  sourceSurface: z.literal("sec_filings"),
  legalShareability: z.literal("public_sec_filing"),
  provenance: provenanceSchema,
  freshness: freshnessMetadataSchema.optional(),
  materialization: materializationMetadataSchema.optional(),
  validation: validationStatusSchema.optional(),
})

export const maEventSchema = z.object({
  object: z.literal("ma_event"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  entityId: z.string(),
  ticker: z.string().nullable(),
  companyName: z.string(),
  form: z.string(),
  filingDate: z.string(),
  reportDate: z.string().nullable(),
  accessionNumber: z.string(),
  eventType: z.enum(["merger", "acquisition", "tender_offer", "divestiture"]),
  status: z.enum(["announced", "pending", "shareholder_vote", "completed", "terminated"]),
  considerationType: z.enum(["cash", "stock", "mixed", "unspecified"]),
  counterparty: z.string().nullable(),
  headline: z.string(),
  summaryMd: z.string(),
  sourceSurface: z.literal("sec_filings"),
  legalShareability: z.literal("public_sec_filing"),
  capability: capabilityStateSchema.optional(),
  provenance: provenanceSchema,
  freshness: freshnessMetadataSchema.optional(),
  materialization: materializationMetadataSchema.optional(),
  validation: validationStatusSchema.optional(),
})

export const votingProposalTypeSchema = z.enum([
  "elect_directors",
  "ratify_auditor",
  "say_on_pay",
  "say_on_pay_frequency",
  "amend_charter",
  "amend_bylaws",
  "approve_equity_plan",
  "approve_merger",
  "approve_asset_sale",
  "shareholder_proposal",
  "adjourn_meeting",
  "other",
])

export const votingParsingConfidenceSchema = z.enum(["high", "medium", "low"])

export const votingMeetingTypeSchema = z.enum(["annual", "special", "unknown"])

export const votingVoteFormatSchema = z.enum(["for_against_abstain", "for_withhold"])

export const votingProposalSchema = z.object({
  id: z.string(),
  number: z.string(),
  description: z.string(),
  proposalType: votingProposalTypeSchema,
  voteFormat: votingVoteFormatSchema,
  // Vote counts are non-negative integers. `null` is semantically distinct
  // from `0`: null means "not reported in the filing", zero means explicitly
  // "zero votes cast in this column".
  votesFor: z.number().int().nonnegative().nullable(),
  votesAgainst: z.number().int().nonnegative().nullable(),
  abstain: z.number().int().nonnegative().nullable(),
  brokerNonVotes: z.number().int().nonnegative().nullable(),
  approved: z.boolean().nullable(),
})

export const votingResultsEventSchema = z.object({
  object: z.literal("voting_results_event"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  entityId: z.string(),
  ticker: z.string().nullable(),
  companyName: z.string(),
  form: z.string(),
  filingDate: z.string(),
  reportDate: z.string().nullable(),
  periodOfReport: z.string().nullable(),
  accessionNumber: z.string(),
  meetingDate: z.string().nullable(),
  meetingType: votingMeetingTypeSchema,
  proposalTypes: z.array(votingProposalTypeSchema),
  proposals: z.array(votingProposalSchema),
  parsingConfidence: votingParsingConfidenceSchema,
  parserVersion: z.string(),
  supersededBy: z.string().nullable(),
  headline: z.string(),
  summaryMd: z.string(),
  sourceSurface: z.literal("sec_filings"),
  legalShareability: z.literal("public_sec_filing"),
  capability: capabilityStateSchema.optional(),
  provenance: provenanceSchema,
  freshness: freshnessMetadataSchema.optional(),
  materialization: materializationMetadataSchema.optional(),
  validation: validationStatusSchema.optional(),
})

export const enforcementActionSchema = z.object({
  object: z.literal("enforcement_action"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  sourceType: z.enum(["litigation_release", "administrative_proceeding"]),
  publishedAt: z.string(),
  releaseNumber: z.string().nullable(),
  title: z.string(),
  excerpt: z.string(),
  summaryMd: z.string(),
  documentUrl: z.string().url(),
  htmlUrl: z.string().url().nullable(),
  sourceSurface: z.literal("sec_enforcement"),
  legalShareability: z.literal("public_sec_release"),
  capability: capabilityStateSchema.optional(),
  statusNote: z.string().nullable(),
  trace: traceReferenceSchema.optional(),
  provenance: provenanceSchema,
  freshness: freshnessMetadataSchema.optional(),
  materialization: materializationMetadataSchema.optional(),
  validation: validationStatusSchema.optional(),
})

export const riskCategorySchema = z.object({
  key: z.enum([
    "macroeconomic_demand",
    "regulatory_legal",
    "cybersecurity_privacy",
    "competition_market",
    "supply_chain_operations",
    "international_geopolitical",
    "liquidity_capital",
    "technology_product",
  ]),
  label: z.string(),
  confidence: z.enum(["high", "medium", "low"]),
  mentionCount: z.number(),
  signals: z.array(z.string()),
  snippets: z.array(z.string()),
})

export const riskCategoryReportSchema = z.object({
  object: z.literal("risk_category_report"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  entityId: z.string(),
  ticker: z.string().nullable(),
  companyName: z.string(),
  form: z.string(),
  filingDate: z.string(),
  reportDate: z.string().nullable(),
  accessionNumber: z.string(),
  sectionKey: z.literal("item_1a"),
  capability: capabilityStateSchema,
  statusNote: z.string().nullable(),
  categoryCount: z.number(),
  categories: z.array(riskCategorySchema),
  summaryMd: z.string(),
  provenance: provenanceSchema,
  freshness: freshnessMetadataSchema.optional(),
  materialization: materializationMetadataSchema.optional(),
  validation: validationStatusSchema.optional(),
})

export const earningsMaterialSchema = z.object({
  object: z.literal("earnings_material"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  entityId: z.string(),
  ticker: z.string().nullable(),
  companyName: z.string(),
  form: z.string(),
  filingDate: z.string(),
  reportDate: z.string().nullable(),
  accessionNumber: z.string(),
  sourceScope: z.literal("sec_furnished"),
  coverage: z.enum(["release_only", "prepared_remarks", "transcript_text", "unusable"]),
  headline: z.string(),
  excerpt: z.string(),
  contentMd: z.string().nullable(),
  exhibitUrl: z.string().url().nullable(),
  sourceSurface: z.literal("sec_filings"),
  legalShareability: z.literal("public_sec_filing"),
  capability: capabilityStateSchema.optional(),
  provenance: provenanceSchema,
  freshness: freshnessMetadataSchema.optional(),
  materialization: materializationMetadataSchema.optional(),
  validation: validationStatusSchema.optional(),
})

export const compensationRecordSchema = z.object({
  object: z.literal("compensation_record"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  entityId: z.string(),
  ticker: z.string().nullable(),
  companyName: z.string(),
  executiveName: z.string(),
  roleTitle: z.string().nullable(),
  year: z.string().nullable(),
  salaryUsd: z.number().nullable(),
  bonusUsd: z.number().nullable(),
  stockAwardsUsd: z.number().nullable(),
  optionAwardsUsd: z.number().nullable(),
  nonEquityIncentiveUsd: z.number().nullable(),
  totalUsd: z.number().nullable(),
  accessionNumber: z.string(),
  provenance: provenanceSchema,
  freshness: freshnessMetadataSchema.optional(),
  materialization: materializationMetadataSchema.optional(),
  validation: validationStatusSchema.optional(),
})

export const compensationComparisonRowSchema = z.object({
  executiveName: z.string(),
  status: z.enum(["added", "removed", "changed", "unchanged"]),
  currentTotalUsd: z.number().nullable(),
  previousTotalUsd: z.number().nullable(),
  deltaTotalUsd: z.number().nullable(),
  currentYear: z.string().nullable(),
  previousYear: z.string().nullable(),
})

export const compensationComparisonSchema = z.object({
  object: z.literal("compensation_comparison"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  entityId: z.string(),
  ticker: z.string().nullable(),
  companyName: z.string(),
  currentFilingDate: z.string(),
  previousFilingDate: z.string(),
  rows: z.array(compensationComparisonRowSchema),
  summaryMd: z.string(),
  provenance: provenanceSchema,
})

export const artifactSchema = z.object({
  object: z.literal("artifact"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  kind: z.enum(["markdown_bundle", "csv_tablet", "json_bundle", "duckdb_pack", "ownership_compare_bundle", "compensation_compare_bundle"]),
  status: z.enum(["pending", "ready", "failed"]),
  downloadUrl: z.string().nullable(),
  provenance: provenanceSchema,
})

export const marketCalendarDaySchema = z.object({
  object: z.literal("market_calendar_day"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  market: z.string(),
  marketName: z.string(),
  date: z.string(),
  timezone: z.string(),
  sessionStatus: z.enum(["open", "closed", "early_close"]),
  opensAt: z.string().nullable(),
  closesAt: z.string().nullable(),
  holidayName: z.string().nullable(),
  coverage: z.enum(["weekend_only", "configured_holidays"]),
  confidence: z.enum(["confirmed", "tentative"]),
  statusNote: z.string().nullable(),
  provenance: provenanceSchema,
})

export const marketEstimateRecordSchema = z.object({
  ticker: z.string().nullable().optional(),
  date: z.string().nullable().optional(),
  rating: z.string().nullable().optional(),
  price_target: z.number().nullable().optional(),
  price_target_average: z.number().nullable().optional(),
  price_target_high: z.number().nullable().optional(),
  price_target_low: z.number().nullable().optional(),
}).passthrough()

export const marketEstimatesSchema = z.object({
  object: z.literal("market_estimates"),
  requestId: z.string(),
  traceparent: z.string().optional(),
  status: z.string().optional(),
  next_url: z.string().nullable().optional(),
  request_id: z.string().optional(),
  results: z.array(marketEstimateRecordSchema).optional(),
}).passthrough()

export const indexSchema = z.object({
  object: z.literal("index"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  code: z.string(),
  name: z.string(),
  family: z.string(),
  provider: z.string(),
  region: z.string(),
  market: z.string().nullable(),
  status: z.enum(["supported", "inventory_only"]),
  rightsStatus: z.enum([
    "public_source_documented",
    "public_source_review_required",
    "licensed_index_not_supported",
  ]),
  legalShareability: z.enum([
    "public_source_table",
    "public_source_review_required",
    "license_required",
  ]),
  constituentCount: z.number().int().nullable(),
  sourceUrl: z.string().url(),
  constituentSourceUrl: z.string().url().nullable(),
  syncCadence: z.enum(["daily_midnight_local", "daily_manual_review", "manual_review_only"]),
  lastReviewedAt: z.string(),
  notes: z.string().nullable(),
  provenance: provenanceSchema,
})

export const indexConstituentSchema = z.object({
  object: z.literal("index_constituent"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  indexCode: z.string(),
  indexName: z.string(),
  entityId: z.string().nullable(),
  ticker: z.string().nullable(),
  cik: z.string().nullable(),
  companyName: z.string(),
  market: z.string().nullable(),
  positionRank: z.number().int(),
  weightBps: z.number().nullable(),
  weightMethod: z.enum(["published", "unpublished"]).nullable(),
  legalShareability: z.enum([
    "public_source_table",
    "public_source_review_required",
    "license_required",
  ]),
  rightsStatus: z.enum([
    "public_source_documented",
    "public_source_review_required",
    "licensed_index_not_supported",
  ]),
  asOf: z.string(),
  sourceUrl: z.string().url(),
  provenance: provenanceSchema,
  freshness: freshnessMetadataSchema.optional(),
  materialization: materializationMetadataSchema.optional(),
  validation: validationStatusSchema.optional(),
})

export const signalFactorSchema = z.object({
  key: z.string(),
  label: z.string(),
  score: z.number(),
  weight: z.number(),
  value: z.number().nullable(),
  explanation: z.string(),
})

export const derivedSignalSchema = z.object({
  object: z.literal("derived_signal"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  signalKey: z.string(),
  methodologyVersion: z.string(),
  entityId: z.string().nullable(),
  ticker: z.string().nullable(),
  cik: z.string().nullable(),
  companyName: z.string().nullable(),
  asOf: z.string(),
  score: z.number(),
  band: z.enum(["low", "moderate", "elevated", "high"]),
  confidence: z.enum(["high", "medium", "low"]),
  summaryMd: z.string(),
  factors: z.array(signalFactorSchema),
  degradedReasons: z.array(z.string()),
  freshness: z.object({
    status: z.enum(["fresh", "stale", "degraded"]),
    updatedAt: z.string(),
    reason: z.string().nullable(),
  }),
  provenance: provenanceSchema,
})

export const traceNodeSchema = z.object({
  id: z.string(),
  kind: z.enum(["xbrl_fact", "filing_document", "filing_excerpt", "derived_formula", "source_document", "source_record"]),
  source: z.enum(["disclosed", "derived", "observed"]),
  label: z.string(),
  value: z.union([z.string(), z.number()]).nullable().optional(),
  unit: z.string().nullable().optional(),
  taxonomy: z.string().nullable().optional(),
  tag: z.string().nullable().optional(),
  filingUrl: z.string().url().nullable().optional(),
  documentUrl: z.string().url().nullable().optional(),
  pdfUrl: z.string().url().nullable().optional(),
  viewerUrl: z.string().url().nullable().optional(),
  accessionNumber: z.string().nullable().optional(),
  sourceName: z.string().nullable().optional(),
  sourceKind: z.string().nullable().optional(),
  sourceKey: z.string().nullable().optional(),
  sourceSurface: z.string().nullable().optional(),
  publishedAt: z.string().nullable().optional(),
  page: z.number().int().positive().nullable().optional(),
  region: traceRegionSchema.nullable().optional(),
  periodStart: z.string().nullable().optional(),
  periodEnd: z.string().nullable().optional(),
  segmentAxis: z.string().nullable().optional(),
  segmentMember: z.string().nullable().optional(),
  segmentLabel: z.string().nullable().optional(),
})

export const traceSchema = z.object({
  object: z.literal("trace"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  kind: traceKindSchema,
  status: traceStatusSchema,
  title: z.string(),
  summary: z.string().nullable().optional(),
  formula: z.string().nullable().optional(),
  filing: z.object({
    accessionNumber: z.string(),
    filingUrl: z.string().url(),
    pdfUrl: z.string().url().nullable().optional(),
    viewerUrl: z.string().url().nullable().optional(),
    filingDate: z.string().nullable().optional(),
    reportDate: z.string().nullable().optional(),
    form: z.string().nullable().optional(),
    page: z.number().int().positive().nullable().optional(),
    region: traceRegionSchema.nullable().optional(),
  }).nullable().optional(),
  sourceRecord: traceSourceRecordSchema.nullable().optional(),
  nodes: z.array(traceNodeSchema),
})

export const analyticsDatasetSchema = z.enum(["filings", "sections_items", "segmented_revenues", "ownership", "enforcement"])
export const analyticsDimensionSchema = z.enum(["year", "form", "ticker", "source_type"])
export const analyticsMeasureSchema = z.enum(["count", "sum_value"])
export const analyticsSortFieldSchema = z.enum(["year", "form", "count", "ticker", "sum_value"])
export const analyticsSortDirectionSchema = z.enum(["asc", "desc"])

export const analyticsQueryFilterSchema = z.object({
  ticker: z.string().trim().min(1).optional(),
  cik: z.string().trim().min(1).optional(),
  form: z.string().trim().min(1).optional(),
})

export const analyticsTimeWindowSchema = z.object({
  from: z.string().trim().min(1).optional(),
  to: z.string().trim().min(1).optional(),
})

export const analyticsQueryRequestSchema = z.object({
  dataset: analyticsDatasetSchema,
  dimensions: z.array(analyticsDimensionSchema).min(1).max(2),
  measures: z.array(analyticsMeasureSchema).min(1).max(1).default(["count"]),
  filters: analyticsQueryFilterSchema.optional(),
  timeWindow: analyticsTimeWindowSchema.optional(),
  sort: z.object({
    field: analyticsSortFieldSchema,
    direction: analyticsSortDirectionSchema.default("desc"),
  }).optional(),
  limit: z.number().int().min(1).max(200).optional(),
})

export const analyticsQueryRowSchema = z.object({
  values: z.record(z.string(), z.union([z.string(), z.number(), z.null()])),
  recordCount: z.number().int().nonnegative(),
})

export const analyticsQueryResultSchema = z.object({
  object: z.literal("analytics_query_result"),
  dataset: analyticsDatasetSchema,
  dimensions: z.array(analyticsDimensionSchema),
  measures: z.array(analyticsMeasureSchema),
  filters: analyticsQueryFilterSchema.optional(),
  timeWindow: analyticsTimeWindowSchema.optional(),
  sort: z.object({
    field: analyticsSortFieldSchema,
    direction: analyticsSortDirectionSchema,
  }),
  limit: z.number().int().min(1).max(200),
  rowCount: z.number().int().nonnegative(),
  rows: z.array(analyticsQueryRowSchema),
})

export type AnalyticsDataset = z.infer<typeof analyticsDatasetSchema>
export type AnalyticsDimension = z.infer<typeof analyticsDimensionSchema>
export type AnalyticsMeasure = z.infer<typeof analyticsMeasureSchema>

export const analyticsQueryInputSchema = z.object({
  dataset: analyticsDatasetSchema,
  dimensions: z.array(analyticsDimensionSchema).min(1),
  measures: z.array(analyticsMeasureSchema).default(["count"]),
  filters: analyticsQueryFilterSchema.optional(),
  timeWindow: analyticsTimeWindowSchema.refine(
    (tw) => !(tw.from && tw.to && tw.from > tw.to),
    { message: "timeWindow.from must be <= timeWindow.to" }
  ).optional(),
  sort: z.object({
    field: analyticsSortFieldSchema,
    direction: analyticsSortDirectionSchema.optional(),
  }).optional(),
  limit: z.number().int().min(1).max(200).default(50),
})
export type AnalyticsQueryInput = z.infer<typeof analyticsQueryInputSchema>

export const artifactInventorySchema = z.object({
  object: z.literal("artifact"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  kind: z.string(),
  status: z.string(),
  downloadUrl: z.string(),
  storageMode: z.enum(["local", "r2"]),
  objectKey: z.string().nullable(),
  manifest: z.record(z.string(), z.unknown()).optional(),
  freshness: freshnessMetadataSchema.optional(),
  materialization: materializationMetadataSchema.optional(),
  validation: validationStatusSchema.optional(),
})

export const artifactManifestSchema = z.object({
  object: z.literal("artifact_manifest"),
  id: z.string(),
  artifactId: z.string(),
  kind: z.string(),
  status: z.string(),
  filename: z.string(),
  contentType: z.string(),
  storageMode: z.enum(["local", "r2"]),
  objectKey: z.string().nullable(),
  byteLength: z.number().int(),
  lineCount: z.number().int(),
  checksumSha1: z.string(),
  filing: z.record(z.string(), z.unknown()).nullable(),
  section: z.record(z.string(), z.unknown()).nullable(),
  exportedFormats: z.array(z.string()),
  createdAt: z.string(),
})

export const artifactSummarySchema = z.object({
  object: z.literal("artifact_summary"),
  orgId: z.string(),
  rows: z.array(z.object({
    kind: z.string(),
    status: z.string(),
    storageMode: z.enum(["local", "r2"]),
    totalBytes: z.number().int(),
    count: z.number().int(),
  })),
  requestId: z.string(),
})

export const webhookEndpointSchema = z.object({
  object: z.literal("webhook_endpoint"),
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  livemode: z.boolean(),
  orgId: z.string(),
  description: z.string().nullable(),
  destinationUrl: z.string().url(),
  subscribedEventTypes: z.array(z.enum(["artifact.created", "artifact.reconciled", "filing.published", "monitor.match", "webhook_endpoint.created", "stream_subscription.created"])),
  status: z.enum(["active", "disabled"]),
  lastDeliveredAt: z.string().nullable(),
  signingSecret: z.string().optional(),
})

export const webhookDeliveryAttemptSchema = z.object({
  object: z.literal("webhook_delivery_attempt"),
  id: z.string(),
  createdAt: z.string(),
  orgId: z.string(),
  webhookId: z.string(),
  eventId: z.string(),
  eventType: z.enum(["artifact.created", "artifact.reconciled", "filing.published", "monitor.match", "webhook_endpoint.created", "stream_subscription.created"]),
  destinationUrl: z.string().url(),
  status: z.number().int().nullable(),
  ok: z.boolean(),
  requestId: z.string(),
  error: z.string().nullable(),
  latencyMs: z.number().int().nullable(),
  replayedFromDeliveryId: z.string().nullable(),
})

export const webhookDeliveryReplaySchema = z.object({
  object: z.literal("webhook_delivery_replay"),
  sourceDeliveryId: z.string(),
  eventId: z.string(),
  eventsReplayed: z.number().int(),
  deliveries: z.array(z.object({
    kind: z.literal("webhook_delivery"),
    deliveryId: z.string().optional(),
    recordedAt: z.string(),
    eventId: z.string(),
    eventType: z.enum(["artifact.created", "artifact.reconciled", "filing.published", "monitor.match", "webhook_endpoint.created", "stream_subscription.created"]),
    webhookId: z.string(),
    destinationUrl: z.string().url(),
    status: z.number().int().nullable(),
    ok: z.boolean(),
    requestId: z.string(),
    error: z.string().nullable(),
    latencyMs: z.number().int().nullable(),
    replayedFromDeliveryId: z.string().nullable().optional(),
  })),
})

export const streamSubscriptionSchema = z.object({
  object: z.literal("stream_subscription"),
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  livemode: z.boolean(),
  orgId: z.string(),
  description: z.string().nullable(),
  eventTypes: z.array(z.enum(["artifact.created", "artifact.reconciled", "filing.published", "monitor.match", "webhook_endpoint.created", "stream_subscription.created"])),
  transport: z.enum(["poll", "webhook_mirror", "websocket"]),
  status: z.enum(["active", "paused"]),
  cursor: z.string().nullable(),
  lastEventAt: z.string().nullable(),
})

export const streamTicketSchema = z.object({
  object: z.literal("stream_ticket"),
  token: z.string(),
  ticketId: z.string(),
  issuedAt: z.string(),
  expiresAt: z.string(),
  requestId: z.string(),
})

export const streamEventSchema = z.object({
  object: z.literal("stream_event"),
  id: z.string(),
  cursor: z.string(),
  recordedAt: z.string(),
  requestId: z.string(),
  eventType: z.enum(["artifact.created", "artifact.reconciled", "filing.published", "monitor.match", "webhook_endpoint.created", "stream_subscription.created"]),
  transport: z.enum(["poll", "webhook_mirror", "websocket"]),
  replayable: z.boolean(),
})

export const streamEventPageSchema = z.object({
  object: z.literal("stream_event_page"),
  streamId: z.string(),
  data: z.array(streamEventSchema),
  hasMore: z.boolean(),
  nextCursor: z.string().nullable(),
  replayCursor: z.string().nullable(),
  requestId: z.string(),
})

export const organizationSchema = z.object({
  object: z.literal("organization"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  name: z.string().nullable(),
  metadata: z.record(z.string(), z.unknown()).default({}),
  requestId: z.string().optional(),
})

export const apiKeySchema = z.object({
  object: z.literal("api_key"),
  id: z.string(),
  createdAt: z.string(),
  livemode: z.boolean(),
  orgId: z.string(),
  label: z.string().nullable(),
  keyPrefix: z.string(),
  scopes: z.array(z.string()),
  status: z.enum(["active", "revoked"]),
  lastUsedAt: z.string().nullable(),
  secret: z.string().optional(),
})

export const usageSummarySchema = z.object({
  object: z.literal("usage_summary"),
  orgId: z.string().nullable(),
  recordedAt: z.string(),
  totalRequests: z.number().int(),
  meters: z.array(z.object({
    meterClass: z.string(),
    count: z.number().int(),
    successCount: z.number().int(),
    errorCount: z.number().int(),
    avgLatencyMs: z.number(),
    lastSeenAt: z.string().nullable(),
  })),
  requestId: z.string().optional(),
})

export const limitsSchema = z.object({
  object: z.literal("limits"),
  orgId: z.string(),
  requestId: z.string(),
  recordedAt: z.string(),
  effectivePlanKey: z.string(),
  billingState: z.string(),
  quotas: z.array(z.object({
    meterClass: z.string(),
    limit: z.number().int(),
    period: z.enum(["minute", "hour", "day"]),
    allowed: z.boolean(),
    planKey: z.string(),
    billingState: z.string(),
  })),
})

export const billingMeterFamilyPriceSchema = z.object({
  key: z.string(),
  displayName: z.string(),
  description: z.string(),
  paygUnitAmountUsd: z.number(),
  unitAmountUsd: z.number(),
  discount: z.number(),
})

export const billingPlanSchema = z.object({
  key: z.string(),
  displayName: z.string(),
  public: z.boolean(),
  kind: z.enum(["grant", "metered", "subscription", "contract"]),
  rightsKey: z.string(),
  checkoutMode: z.enum(["none", "setup", "subscription", "sales"]),
  monthlyPriceUsd: z.number().nullable(),
  annualPriceUsd: z.number().nullable(),
  monthlyPriceFloorUsd: z.number().nullable(),
  annualContractFloorUsd: z.number().nullable(),
  annualDiscountPercent: z.number(),
  seatsIncluded: z.number().int(),
  apiKeysIncluded: z.number().int(),
  features: z.array(z.string()),
  meterFamilyPrices: z.array(billingMeterFamilyPriceSchema),
})

export const billingCustomerSchema = z.object({
  object: z.literal("billing_customer"),
  orgId: z.string(),
  stripeCustomerId: z.string(),
  livemode: z.boolean(),
  email: z.string().nullable(),
  name: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const billingSubscriptionSchema = z.object({
  object: z.literal("billing_subscription"),
  id: z.string(),
  orgId: z.string(),
  stripeCustomerId: z.string(),
  planKey: z.string(),
  stripeProductId: z.string().nullable(),
  stripePriceId: z.string().nullable(),
  status: z.string(),
  currentPeriodStart: z.string().nullable(),
  currentPeriodEnd: z.string().nullable(),
  cancelAtPeriodEnd: z.boolean(),
  livemode: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const billingSettlementSchema = z.object({
  provider: z.string(),
  status: z.string(),
  externalAccountId: z.string().nullable(),
  metadata: z.record(z.string(), z.unknown()).default({}),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
})

export const billingBudgetLineItemSchema = z.object({
  publicPlanKey: z.string(),
  meterFamily: z.string(),
  units: z.number().int(),
  requestCount: z.number().int(),
  unitAmountUsd: z.number(),
  amountCents: z.number().int(),
  lastRecordedAt: z.string().nullable(),
})

export const billingBudgetSchema = z.object({
  object: z.literal("billing_budget"),
  currency: z.literal("usd"),
  invoicePeriod: z.string(),
  spendCapCents: z.number().int().nullable(),
  softCapCents: z.number().int().nullable(),
  approvalThresholdCents: z.number().int().nullable(),
  accruedUsageCents: z.number().int(),
  softCapReached: z.boolean(),
  approvalRequired: z.boolean(),
  hardCapReached: z.boolean(),
  lineItems: z.array(billingBudgetLineItemSchema),
})

export const monthlyQuotaSnapshotSchema = z.object({
  family: z.string(),
  limit: z.number().int(),
  used: z.number().int(),
  remaining: z.number().int(),
  resetAt: z.string(),
  graceUntil: z.string().nullable(),
})

export const billingBudgetGateSchema = z.object({
  code: z.string(),
  status: z.number().int(),
  message: z.string(),
  details: z.record(z.string(), z.unknown()).default({}),
})

export const billingAccountSchema = z.object({
  object: z.literal("billing_account"),
  orgId: z.string(),
  livemode: z.boolean(),
  customer: billingCustomerSchema.nullable(),
  subscription: billingSubscriptionSchema.nullable(),
  effectivePlanKey: z.string(),
  billingState: z.string(),
  publicPlanKey: z.string(),
  rightsKey: z.string(),
  freeGrantTotal: z.number().int(),
  freeGrantUsed: z.number().int(),
  freeGrantRemaining: z.number().int(),
  cardOnFile: z.boolean(),
  cardRequired: z.boolean(),
  rateCardVersion: z.string(),
  meterFamilyPrices: z.array(billingMeterFamilyPriceSchema),
  nextRecommendedPlan: z.string().nullable(),
  plans: z.array(billingPlanSchema),
  settlement: billingSettlementSchema,
  budget: billingBudgetSchema,
  monthlyQuotas: z.record(z.string(), monthlyQuotaSnapshotSchema),
  requestId: z.string().optional(),
})

export const billingQuoteSchema = z.object({
  object: z.literal("billing_quote"),
  planKey: z.string(),
  meterClass: z.string(),
  meterFamily: z.string(),
  units: z.number().int(),
  unitAmountUsd: z.number(),
  amountUsd: z.number(),
  amountCents: z.number().int(),
  currency: z.literal("usd"),
  requestId: z.string(),
  budget: billingBudgetSchema,
  budgetGate: billingBudgetGateSchema.nullable(),
})

export const billingBudgetUpdateSchema = z.object({
  object: z.literal("billing_budget_update"),
  requestId: z.string(),
  budget: billingBudgetSchema,
})

export const billingCheckoutSessionSchema = z.object({
  object: z.literal("billing_checkout_session"),
  id: z.string(),
  orgId: z.string(),
  planKey: z.string(),
  url: z.string().url().nullable(),
  livemode: z.boolean(),
})

export const billingPortalSessionSchema = z.object({
  object: z.literal("billing_portal_session"),
  id: z.string(),
  orgId: z.string(),
  url: z.string().url(),
  livemode: z.boolean(),
})

export const billingWebhookResultSchema = z.object({
  object: z.literal("billing_webhook_result"),
  eventId: z.string(),
  duplicate: z.boolean(),
  status: z.enum(["processed", "ignored", "duplicate"]),
  requestId: z.string(),
})

export const dashboardPrincipalSchema = z.object({
  principalId: z.string(),
  subject: z.string(),
  orgId: z.string().nullable(),
  authMode: z.string(),
  scopes: z.array(z.string()),
  livemode: z.boolean(),
}).passthrough()

export const dashboardSettingsPrincipalSchema = z.object({
  principalId: z.string(),
  subject: z.string(),
  orgId: z.string().nullable(),
  authMode: z.string(),
  scopes: z.array(z.string()),
  livemode: z.boolean(),
})

export const dashboardOverviewSummarySchema = z.object({
  object: z.literal("dashboard_overview_summary"),
  recordedAt: z.string(),
  privateBeta: z.object({
    object: z.literal("dashboard_auth_gate_state"),
    privateBetaEnabled: z.boolean(),
    publicSignupEnabled: z.boolean(),
    authkitConfigured: z.boolean(),
    clientIdConfigured: z.boolean(),
    workosConfigured: z.boolean(),
    loginEnabled: z.boolean(),
    signupEnabled: z.boolean(),
  }),
  capabilities: z.object({
    authMode: z.string(),
    canManageApiKeys: z.boolean(),
    canCreateApiKeys: z.boolean(),
    canManageBilling: z.boolean(),
    acceptedApiKeyManagementScopes: z.array(z.string()),
    acceptedBillingManagementScopes: z.array(z.string()),
  }),
  apiKeys: z.object({
    activeCount: z.number().int(),
    revokedCount: z.number().int(),
    totalCount: z.number().int(),
    activeKeyLimit: z.number().int(),
    remainingCreateCount: z.number().int(),
  }),
  usage: z.object({
    totalRequests: z.number().int(),
    successCount: z.number().int(),
    errorCount: z.number().int(),
    errorRate: z.number(),
    lastSeenAt: z.string().nullable(),
    topMeters: usageSummarySchema.shape.meters,
  }),
  billing: z.object({
    publicPlanKey: z.string(),
    billingState: z.string(),
    rightsKey: z.string(),
    cardOnFile: z.boolean(),
    cardRequired: z.boolean(),
    freeGrant: z.object({
      total: z.number().int(),
      used: z.number().int(),
      remaining: z.number().int(),
    }),
    monthlyQuotas: z.record(z.string(), monthlyQuotaSnapshotSchema),
    budget: billingBudgetSchema,
    settlementStatus: z.string(),
    nextRecommendedPlan: z.string().nullable(),
    subscriptionStatus: z.string().nullable(),
    currentPeriodEnd: z.string().nullable(),
  }),
  actions: z.array(z.object({
    id: z.string(),
    label: z.string(),
    enabled: z.boolean(),
    reason: z.string().nullable(),
  })),
})

export const dashboardOverviewSchema = z.object({
  object: z.literal("dashboard_overview"),
  requestId: z.string(),
  principal: dashboardPrincipalSchema.nullable(),
  organization: organizationSchema.omit({ object: true }).nullable(),
  billing: billingAccountSchema,
  usage: usageSummarySchema,
  apiKeys: z.array(apiKeySchema),
  overview: dashboardOverviewSummarySchema,
})

export const dashboardAccountSettingsSchema = z.object({
  object: z.literal("dashboard_account_settings"),
  requestId: z.string(),
  principal: dashboardSettingsPrincipalSchema.nullable(),
  profile: z.object({
    object: z.literal("dashboard_profile"),
    userId: z.string().nullable(),
    email: z.string().nullable(),
    emailNormalized: z.string().nullable(),
    name: z.string().nullable(),
    displayName: z.string().nullable(),
    displayNameSource: z.enum(["dashboard_settings", "workos", "unknown"]),
    avatarUrl: z.string().nullable(),
    editable: z.object({
      displayName: z.boolean(),
      email: z.boolean(),
      name: z.boolean(),
      avatarUrl: z.boolean(),
    }),
    updatedAt: z.string().nullable(),
  }),
  organization: z.object({
    id: z.string(),
    name: z.string().nullable(),
    nameSource: z.enum(["dashboard_settings", "workos"]),
    workosName: z.string().nullable(),
    livemode: z.boolean(),
    createdAt: z.string(),
    settings: z.object({
      organization: z.object({
        displayName: z.string().nullable(),
        updatedAt: z.string().nullable(),
      }),
      appearance: z.object({
        theme: z.enum(["dark", "system"]),
        density: z.enum(["comfortable", "compact"]),
      }),
      accountDeletionRequest: z.object({
        status: z.enum(["not_requested", "requested"]),
        requestedAt: z.string().nullable(),
        requestedByPrincipalId: z.string().nullable(),
        reason: z.string().nullable(),
      }),
    }),
  }).nullable(),
  membership: z.object({
    object: z.literal("workos_org_membership"),
    userId: z.string(),
    orgId: z.string(),
    status: z.enum(["active", "inactive", "suspended"]),
    scopes: z.array(z.string()),
    firstSeenAt: z.string(),
    lastSeenAt: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }).nullable(),
  appearance: z.object({
    theme: z.enum(["dark", "system"]),
    density: z.enum(["comfortable", "compact"]),
  }),
  security: z.object({
    object: z.literal("dashboard_security_settings"),
    authProvider: z.literal("workos"),
    authMode: z.string(),
    sessionExpiresAt: z.string().nullable(),
    scopes: z.array(z.string()),
    logoutPath: z.string(),
    profileFieldsManagedBy: z.literal("workos"),
  }),
  accountDeletion: z.object({
    status: z.enum(["not_requested", "requested"]),
    requestedAt: z.string().nullable(),
    requestedByPrincipalId: z.string().nullable(),
    reason: z.string().nullable(),
  }),
  actions: z.array(z.object({
    id: z.string(),
    method: z.string(),
    path: z.string(),
    enabled: z.boolean(),
  })),
})

export const dashboardUsageSeriesSchema = z.object({
  object: z.literal("dashboard_usage_series"),
  requestId: z.string().optional(),
  orgId: z.string(),
  bucket: z.enum(["hour", "day"]),
  since: z.string(),
  until: z.string(),
  data: z.array(z.object({
    bucketStart: z.string(),
    requestCount: z.number().int(),
    successCount: z.number().int(),
    errorCount: z.number().int(),
    units: z.number().int(),
    avgLatencyMs: z.number(),
  })),
})

export const dashboardEndpointBreakdownSchema = z.object({
  object: z.literal("dashboard_endpoint_breakdown"),
  requestId: z.string().optional(),
  orgId: z.string(),
  since: z.string(),
  until: z.string(),
  data: z.array(z.object({
    endpointKey: z.string(),
    method: z.string(),
    path: z.string(),
    meterClass: z.string(),
    meterFamily: z.string(),
    requestCount: z.number().int(),
    successCount: z.number().int(),
    errorCount: z.number().int(),
    units: z.number().int(),
    avgLatencyMs: z.number(),
    lastSeenAt: z.string().nullable(),
  })),
})

export const dashboardUsageRequestSchema = z.object({
  id: z.string(),
  requestId: z.string(),
  principalId: z.string().nullable(),
  endpointKey: z.string(),
  method: z.string(),
  path: z.string(),
  status: z.number().int(),
  authMode: z.string().nullable(),
  meterClass: z.string(),
  meterFamily: z.string(),
  mcpToolName: z.string().nullable(),
  units: z.number().int(),
  latencyMs: z.number(),
  invoicePeriod: z.string(),
  recordedAt: z.string(),
})

export const dashboardAuditEventSchema = z.object({
  id: z.string(),
  orgId: z.string().nullable(),
  actorPrincipalId: z.string().nullable(),
  eventType: z.string(),
  category: z.string(),
  outcome: z.enum(["started", "succeeded", "failed", "blocked"]),
  requestId: z.string().nullable(),
  authMode: z.string().nullable(),
  source: z.string(),
  metadata: z.record(z.string(), z.unknown()),
  occurredAt: z.string(),
})

export const dashboardUsageRequestLogSchema = z.object({
  object: z.literal("dashboard_usage_request_log"),
  requestId: z.string(),
  orgId: z.string(),
  since: z.string(),
  until: z.string(),
  data: z.array(dashboardUsageRequestSchema),
})

export const dashboardUsageExportSchema = z.object({
  object: z.literal("dashboard_usage_export"),
  requestId: z.string(),
  orgId: z.string(),
  since: z.string(),
  until: z.string(),
  format: z.literal("json"),
  data: z.array(dashboardUsageRequestSchema),
})

export const dashboardUsageActivitySchema = z.object({
  object: z.literal("dashboard_usage_activity"),
  requestId: z.string(),
  orgId: z.string(),
  since: z.string(),
  until: z.string(),
  totalRequests: z.number().int(),
  successCount: z.number().int(),
  errorCount: z.number().int(),
  firstSeenAt: z.string().nullable(),
  lastSeenAt: z.string().nullable(),
  activePrincipalCount: z.number().int(),
  endpointCount: z.number().int(),
  recentRequests: z.array(dashboardUsageRequestSchema),
  recentAuditEvents: z.array(dashboardAuditEventSchema),
})

export const installPayloadSchema = z.object({
  transport: z.object({
    type: z.string(),
    url: z.string().url(),
  }),
  auth: z.object({
    preferred: z.string(),
    supported: z.array(z.string()),
    apiKeyHeader: z.string(),
    protectedResourceMetadataUrl: z.string().url(),
    authorizationServerMetadataUrl: z.string().url(),
    note: z.string(),
  }),
  clients: z.object({
    claudeCode: z.object({
      addCommand: z.string(),
      note: z.string(),
    }),
    cursor: z.object({
      config: z.object({
        url: z.string().url(),
        headers: z.record(z.string(), z.string()),
      }),
      note: z.string(),
    }),
    generic: z.object({
      url: z.string().url(),
      headers: z.record(z.string(), z.string()),
    }),
  }),
  docs: z.object({
    agentsUrl: z.string().url(),
    gettingStartedUrl: z.string().url(),
    mcpWorkflowsUrl: z.string().url(),
    authUrl: z.string().url(),
  }),
  bootstrap: z.object({
    sponsorTokenUrl: z.string().url(),
    machineBootstrapUrl: z.string().url(),
    note: z.string(),
  }),
  capabilitiesSummary: z.object({
    tools: z.array(z.string()),
    resourceTemplates: z.array(z.string()),
  }),
})

export const agentBootstrapTokenSchema = z.object({
  object: z.literal("agent_bootstrap_token"),
  id: z.string(),
  orgId: z.string(),
  actorPrincipalId: z.string(),
  label: z.string().nullable(),
  tokenPrefix: z.string(),
  scopes: z.array(z.string()),
  livemode: z.boolean(),
  expiresAt: z.string(),
  usedAt: z.string().nullable(),
  usedByPrincipalId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  secret: z.string(),
  requestId: z.string(),
})

export const agentBootstrapSchema = z.object({
  object: z.literal("agent_bootstrap"),
  requestId: z.string(),
  organization: organizationSchema,
  apiKey: apiKeySchema,
  billing: billingAccountSchema,
  limits: limitsSchema,
  distribution: installPayloadSchema,
  sponsorToken: z.object({
    id: z.string(),
    expiresAt: z.string(),
    usedAt: z.string().nullable(),
    scopes: z.array(z.string()),
  }),
})

export const artifactReconciliationSchema = z.object({
  object: z.literal("artifact_reconciliation"),
  id: z.string(),
  artifactId: z.string(),
  status: z.enum(["local_only", "synced", "recovered", "uploaded"]),
  storageMode: z.enum(["local", "r2"]),
  objectKey: z.string().nullable(),
  requestId: z.string(),
})

export const artifactExportSchema = z.object({
  object: z.literal("artifact_export"),
  artifactId: z.string(),
  format: z.enum(["json", "markdown", "compact_json"]),
  manifest: artifactManifestSchema,
  artifact: z.record(z.string(), z.unknown()).optional(),
  download: z.record(z.string(), z.unknown()).optional(),
})

export const errorSchema = z.object({
  object: z.literal("error"),
  id: z.string(),
  code: z.string(),
  type: z.string(),
  message: z.string(),
  requestId: z.string(),
  details: z.record(z.string(), z.unknown()).default({}),
})

export const createApiKeyInputSchema = z.object({
  label: z.string().nullable().optional(),
  scopes: z.array(z.string()).optional().default(["read:sec"]),
  livemode: z.boolean().optional().default(false),
})

export const createBootstrapTokenInputSchema = z.object({
  label: z.string().nullable().optional(),
  scopes: z.array(z.string()).optional(),
  ttlSeconds: z.number().int().positive().max(86_400).optional(),
})

export const bootstrapAgentInputSchema = z.object({
  token: z.string().min(1, "token is required"),
  label: z.string().nullable().optional(),
  scopes: z.array(z.string()).optional(),
})

export const createWebhookInputSchema = z.object({
  destinationUrl: z.string().url("destinationUrl must be a valid URL"),
  description: z.string().nullable().optional(),
  subscribedEventTypes: z.array(z.string()).optional(),
  livemode: z.boolean().optional().default(false),
})

export const createStreamSubscriptionInputSchema = z.object({
  description: z.string().nullable().optional(),
  eventTypes: z.array(z.string()).optional(),
  transport: z.enum(["poll", "webhook_mirror", "websocket"]).optional().default("poll"),
  livemode: z.boolean().optional().default(false),
})

export const billingQuoteInputSchema = z.object({
  planKey: z.string().optional(),
  meterClass: z.string().optional(),
  path: z.string().optional(),
  method: z.string().optional(),
  units: z.number().int().positive().optional(),
})

export const billingBudgetInputSchema = z.object({
  spendCapCents: z.number().int().nullable().optional(),
  softCapCents: z.number().int().nullable().optional(),
  approvalThresholdCents: z.number().int().nullable().optional(),
})

export const checkoutSessionInputSchema = z.object({
  planKey: z.string().min(1, "planKey is required"),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
})

export const billingPortalInputSchema = z.object({
  returnUrl: z.string().url().optional(),
})

export type CreateApiKeyInput = z.infer<typeof createApiKeyInputSchema>
export type CreateBootstrapTokenInput = z.infer<typeof createBootstrapTokenInputSchema>
export type BootstrapAgentInput = z.infer<typeof bootstrapAgentInputSchema>
export type CreateWebhookInput = z.infer<typeof createWebhookInputSchema>
export type CreateStreamSubscriptionInput = z.infer<typeof createStreamSubscriptionInputSchema>
export type BillingQuoteInput = z.infer<typeof billingQuoteInputSchema>
export type BillingBudgetInput = z.infer<typeof billingBudgetInputSchema>
export type CheckoutSessionInput = z.infer<typeof checkoutSessionInputSchema>
export type BillingPortalInput = z.infer<typeof billingPortalInputSchema>

export const listSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    object: z.literal("list"),
    data: z.array(itemSchema),
    hasMore: z.boolean(),
    nextCursor: z.string().nullable(),
    responseMode: z.enum(["compact", "standard", "verbose"]).nullable().optional(),
    include: z.array(z.string()).nullable().optional(),
    requestId: z.string(),
  })

export const entityListSchema = listSchema(entitySchema)
export const filingListSchema = listSchema(filingSchema)
export const sectionListSchema = listSchema(sectionSchema)
export const factPointListSchema = listSchema(factPointSchema).extend({
  completeness: z.object({
    source: z.enum(["xbrl_facts", "company_facts"]),
    observationsReturned: z.number().int().nonnegative().optional(),
    hasResolvedConcept: z.boolean().optional(),
  }).optional(),
  freshness: freshnessMetadataSchema.optional(),
  materialization: materializationMetadataSchema.optional(),
  validation: validationStatusSchema.optional(),
})
export const insiderTradeListSchema = listSchema(insiderTradeSchema)
export const maEventListSchema = listSchema(maEventSchema)
export const votingResultsEventListSchema = listSchema(votingResultsEventSchema)
export const enforcementActionListSchema = listSchema(enforcementActionSchema)
export const earningsMaterialListSchema = listSchema(earningsMaterialSchema)
export const compensationRecordListSchema = listSchema(compensationRecordSchema)
export const artifactListSchema = listSchema(artifactSchema)
export const artifactInventoryListSchema = listSchema(artifactInventorySchema)
export const apiKeyListSchema = listSchema(apiKeySchema)
export const webhookEndpointListSchema = listSchema(webhookEndpointSchema)
export const webhookDeliveryAttemptListSchema = listSchema(webhookDeliveryAttemptSchema)
export const streamSubscriptionListSchema = listSchema(streamSubscriptionSchema)

// Response view (`?view=`) enum + agent-mode response shapes — OMNI-3075.
// Agent mode is a Pick/Omit of default-mode fields (camelCase preserved),
// selected for agent ergonomics: essentials + citation pointers.

export const responseViewSchema = z.enum(["default", "compact", "agent"])

export const filingAgentRecordSchema = filingSchema
  .pick({
    object: true,
    ticker: true,
    form: true,
    accessionNumber: true,
    filingDate: true,
    title: true,
  })
  .extend({
    filingUrl: z.string().nullable(),
    requestId: z.string(),
  })

export const entityAgentRecordSchema = z.object({
  object: z.literal("entity"),
  id: z.string(),
  ticker: z.string().nullable(),
  cik: z.string().nullable(),
  name: z.string(),
  primaryIdentifiers: z.array(entityIdentifierSchema.pick({ type: true, value: true })),
  matchConfidence: z.number().nullable(),
  matchBasis: z.string().nullable(),
  requestId: z.string(),
})

export const statementAgentRecordSchema = statementSchema
  .pick({
    object: true,
    ticker: true,
    companyName: true,
    statementKey: true,
    title: true,
    period: true,
    periods: true,
    rows: true,
  })
  .extend({
    sources: z.array(z.object({
      source: z.string(),
      sourceKind: z.enum(["company_facts", "filing"]),
      accessionNumber: z.string().nullable(),
      sourceUrl: z.string().url(),
    })).default([]),
    requestId: z.string(),
  })

export const factPointAgentItemSchema = factPointSchema
  .pick({
    object: true,
    tag: true,
    label: true,
    taxonomy: true,
    unit: true,
    value: true,
    periodEnd: true,
    fy: true,
    fp: true,
    form: true,
  })
  .extend({
    accessionNumber: z.string().nullable(),
    filingUrl: z.string().nullable(),
  })

export const factPointAgentListSchema = listSchema(factPointAgentItemSchema)

export const sectionAgentItemSchema = z.object({
  object: z.literal("section"),
  ticker: z.string().nullable(),
  accessionNumber: z.string().nullable(),
  key: z.string(),
  startOffset: z.number().int().nullable(),
  endOffset: z.number().int().nullable(),
  snippet: z.string().nullable(),
  // OMNI-3083 citation fields (additive, optional). Section-text-relative
  // (`char_start`/`char_end`) coexists with legacy HTML-byte `startOffset`/
  // `endOffset` from trace.region. `accession` mirrors `accessionNumber` in
  // snake_case for the agent citation contract; `section_key` mirrors `key`.
  accession: z.string().nullable().optional(),
  section_key: z.string().nullable().optional(),
  char_start: z.number().int().nonnegative().nullable().optional(),
  char_end: z.number().int().nonnegative().nullable().optional(),
  highlighted_snippet: z.string().nullable().optional(),
  source_url: z.string().nullable().optional(),
})

export const sectionAgentListSchema = listSchema(sectionAgentItemSchema)

// OMNI-3084 agent-mode shapes — second tranche (10 endpoints).

export const insiderTradeAgentItemSchema = insiderTradeSchema
  .pick({
    object: true,
    ticker: true,
    ownerName: true,
    ownerTitle: true,
    issuerName: true,
    form: true,
    filingDate: true,
    transactionDate: true,
    transactionCode: true,
    transactionDirection: true,
    securityTitle: true,
    transactionShares: true,
    transactionPrice: true,
    transactionValue: true,
    accessionNumber: true,
  })
  .extend({
    filingUrl: z.string().nullable(),
  })
export const insiderTradeAgentListSchema = listSchema(insiderTradeAgentItemSchema)

export const form144AgentItemSchema = z.object({
  object: z.literal("form_144_filing"),
  ticker: z.string().nullable(),
  form: z.string(),
  filingDate: z.string(),
  accessionNumber: z.string(),
  title: z.string().nullable(),
  filingUrl: z.string().nullable(),
})
export const form144AgentListSchema = listSchema(form144AgentItemSchema)

export const maEventAgentItemSchema = maEventSchema
  .pick({
    object: true,
    ticker: true,
    form: true,
    filingDate: true,
    accessionNumber: true,
    eventType: true,
    status: true,
    considerationType: true,
    counterparty: true,
    headline: true,
  })
  .extend({
    filingUrl: z.string().nullable(),
  })
export const maEventAgentListSchema = listSchema(maEventAgentItemSchema)

export const votingProposalAgentItemSchema = votingProposalSchema.pick({
  number: true,
  description: true,
  proposalType: true,
  votesFor: true,
  votesAgainst: true,
  abstain: true,
  approved: true,
})
export const votingResultsEventAgentItemSchema = votingResultsEventSchema
  .pick({
    object: true,
    ticker: true,
    form: true,
    filingDate: true,
    accessionNumber: true,
    meetingDate: true,
    meetingType: true,
    headline: true,
  })
  .extend({
    filingUrl: z.string().nullable(),
    proposals: z.array(votingProposalAgentItemSchema),
  })
export const votingResultsEventAgentListSchema = listSchema(votingResultsEventAgentItemSchema)

export const offeringRecordAgentItemSchema = offeringRecordSchema
  .pick({
    object: true,
    ticker: true,
    form: true,
    offeringFamily: true,
    isAmendment: true,
    filingDate: true,
    accessionNumber: true,
    offeringType: true,
    title: true,
  })
  .extend({
    prospectusUrl: z.string().nullable(),
    filingUrl: z.string().nullable(),
  })
export const offeringRecordAgentListSchema = listSchema(offeringRecordAgentItemSchema)

export const compensationRecordAgentItemSchema = compensationRecordSchema
  .pick({
    object: true,
    ticker: true,
    executiveName: true,
    roleTitle: true,
    year: true,
    salaryUsd: true,
    bonusUsd: true,
    stockAwardsUsd: true,
    optionAwardsUsd: true,
    nonEquityIncentiveUsd: true,
    totalUsd: true,
    accessionNumber: true,
  })
  .extend({
    filingUrl: z.string().nullable(),
  })
export const compensationRecordAgentListSchema = listSchema(compensationRecordAgentItemSchema)

export const ownershipHoldingAgentItemSchema = ownershipHoldingSchema.pick({
  issuer: true,
  cusip: true,
  valueUsdThousands: true,
  shares: true,
  shareType: true,
  putCall: true,
})
export const ownershipReportAgentRecordSchema = ownershipReportSchema
  .pick({
    object: true,
    ticker: true,
    managerName: true,
    form: true,
    filingDate: true,
    reportDate: true,
    accessionNumber: true,
  })
  .extend({
    filingUrl: z.string().nullable(),
    holdings: z.array(ownershipHoldingAgentItemSchema),
    requestId: z.string(),
  })

export const nportHoldingAgentItemSchema = nportHoldingSchema.pick({
  issuer: true,
  cusip: true,
  valueUsd: true,
  balance: true,
  balanceUnit: true,
  pctNetAssets: true,
})
export const nportHoldingsAgentRecordSchema = nportHoldingsSchema
  .pick({
    object: true,
    ticker: true,
    cik: true,
    fundName: true,
    form: true,
    filingDate: true,
    accessionNumber: true,
    holdingCount: true,
  })
  .extend({
    filingUrl: z.string().nullable(),
    holdings: z.array(nportHoldingAgentItemSchema),
    requestId: z.string(),
  })

export const subsidiaryAgentItemSchema = z.object({
  object: z.literal("subsidiary"),
  name: z.string(),
  jurisdiction: z.string().nullable(),
  ownershipPercent: z.number().nullable(),
})
// Subsidiaries aren't paginated (full list returned from a single 10-K's
// Exhibit 21), so the agent envelope drops hasMore/nextCursor to stay
// strictly smaller than the default envelope (which carries lineage metadata).
export const subsidiaryAgentListSchema = z.object({
  object: z.literal("list"),
  data: z.array(subsidiaryAgentItemSchema),
  accessionNumber: z.string().nullable(),
  filingDate: z.string().nullable(),
  filingUrl: z.string().nullable(),
  note: z.string().optional(),
  requestId: z.string(),
})

export const enforcementActionAgentItemSchema = enforcementActionSchema
  .pick({
    object: true,
    sourceType: true,
    publishedAt: true,
    releaseNumber: true,
    title: true,
    excerpt: true,
    documentUrl: true,
    htmlUrl: true,
  })
export const enforcementActionAgentListSchema = listSchema(enforcementActionAgentItemSchema)

export const eventExportSchema = z.object({
  object: z.literal("event_export"),
  format: z.enum(["json", "ndjson"]),
  count: z.number().int(),
  content: z.string(),
})

export const usageEventSchema = z.object({
  recordedAt: z.string(),
  requestId: z.string(),
  orgId: z.string().nullable(),
  principalId: z.string().nullable(),
  authMode: z.string().nullable(),
  meterClass: z.string(),
  method: z.string(),
  path: z.string(),
  status: z.number().int(),
  latencyMs: z.number(),
})

export const requestDiagnosticsSchema = z.object({
  object: z.literal("request_diagnostics"),
  requestId: z.string(),
  targetRequestId: z.string(),
  orgId: z.string(),
  usageEvents: z.array(usageEventSchema),
  events: z.array(z.record(z.string(), z.unknown())),
  webhookDeliveries: z.array(z.record(z.string(), z.unknown())),
  streamEvents: z.array(z.record(z.string(), z.unknown())),
  artifacts: z.array(artifactInventorySchema),
  summary: z.object({
    usageEventCount: z.number().int(),
    eventCount: z.number().int(),
    webhookDeliveryCount: z.number().int(),
    streamEventCount: z.number().int(),
    artifactCount: z.number().int(),
    meterClasses: z.array(z.object({
      meterClass: z.string(),
      count: z.number().int(),
    })),
    eventTypes: z.array(z.object({
      eventType: z.string(),
      count: z.number().int(),
    })),
  }),
})

export const deliverySummarySchema = z.object({
  object: z.literal("delivery_summary"),
  orgId: z.string(),
  requestId: z.string().nullable(),
  webhookRows: z.array(z.object({
    webhookId: z.string(),
    eventType: z.string(),
    status: z.number().int().nullable(),
    okCount: z.number().int(),
    errorCount: z.number().int(),
    replayCount: z.number().int(),
    count: z.number().int(),
    lastSeenAt: z.string(),
  })),
  streamRows: z.array(z.object({
    streamId: z.string(),
    eventType: z.string(),
    transport: z.string(),
    count: z.number().int(),
    replayableCount: z.number().int(),
    lastSeenAt: z.string(),
  })),
})

export const observabilityConfigSchema = z.object({
  object: z.literal("observability_config"),
  service: z.literal("secapi-api"),
  environment: z.string(),
  baseUrl: z.string().nullable(),
  providers: z.object({
    sentryConfigured: z.boolean(),
    posthogConfigured: z.boolean(),
    otlpConfigured: z.boolean(),
    workosConfigured: z.boolean(),
  }),
  logs: z.object({
    usageEventLog: z.boolean(),
    webhookEventLog: z.boolean(),
  }),
  quotas: z.array(z.object({
    meterClass: z.string(),
    limit: z.number().int(),
    period: z.string(),
  })),
  requestId: z.string().optional(),
})

export const observabilityExportSchema = z.object({
  object: z.literal("observability_export"),
  config: observabilityConfigSchema.omit({ requestId: true }),
  usage: z.record(z.string(), z.unknown()),
  recentEvents: z.array(z.record(z.string(), z.unknown())),
  requestId: z.string().optional(),
})

export type Entity = z.infer<typeof entitySchema>
export type Filing = z.infer<typeof filingSchema>
export type Section = z.infer<typeof sectionSchema>
export type FactPoint = z.infer<typeof factPointSchema>
export type Statement = z.infer<typeof statementSchema>
export type CompactStatement = z.infer<typeof compactStatementSchema>
export type ResponseView = z.infer<typeof responseViewSchema>
export type FilingAgentRecord = z.infer<typeof filingAgentRecordSchema>
export type EntityAgentRecord = z.infer<typeof entityAgentRecordSchema>
export type StatementAgentRecord = z.infer<typeof statementAgentRecordSchema>
export type FactPointAgentItem = z.infer<typeof factPointAgentItemSchema>
export type FactPointAgentList = z.infer<typeof factPointAgentListSchema>
export type SectionAgentItem = z.infer<typeof sectionAgentItemSchema>
export type SectionAgentList = z.infer<typeof sectionAgentListSchema>
export type InsiderTradeAgentItem = z.infer<typeof insiderTradeAgentItemSchema>
export type InsiderTradeAgentList = z.infer<typeof insiderTradeAgentListSchema>
export type Form144AgentItem = z.infer<typeof form144AgentItemSchema>
export type Form144AgentList = z.infer<typeof form144AgentListSchema>
export type MaEventAgentItem = z.infer<typeof maEventAgentItemSchema>
export type MaEventAgentList = z.infer<typeof maEventAgentListSchema>
export type VotingProposalAgentItem = z.infer<typeof votingProposalAgentItemSchema>
export type VotingResultsEventAgentItem = z.infer<typeof votingResultsEventAgentItemSchema>
export type VotingResultsEventAgentList = z.infer<typeof votingResultsEventAgentListSchema>
export type OfferingRecordAgentItem = z.infer<typeof offeringRecordAgentItemSchema>
export type OfferingRecordAgentList = z.infer<typeof offeringRecordAgentListSchema>
export type CompensationRecordAgentItem = z.infer<typeof compensationRecordAgentItemSchema>
export type CompensationRecordAgentList = z.infer<typeof compensationRecordAgentListSchema>
export type OwnershipHoldingAgentItem = z.infer<typeof ownershipHoldingAgentItemSchema>
export type OwnershipReportAgentRecord = z.infer<typeof ownershipReportAgentRecordSchema>
export type NportHoldingAgentItem = z.infer<typeof nportHoldingAgentItemSchema>
export type NportHoldingsAgentRecord = z.infer<typeof nportHoldingsAgentRecordSchema>
export type SubsidiaryAgentItem = z.infer<typeof subsidiaryAgentItemSchema>
export type SubsidiaryAgentList = z.infer<typeof subsidiaryAgentListSchema>
export type EnforcementActionAgentItem = z.infer<typeof enforcementActionAgentItemSchema>
export type EnforcementActionAgentList = z.infer<typeof enforcementActionAgentListSchema>
export type SegmentedFactSeries = z.infer<typeof segmentedFactSeriesSchema>
export type SegmentedRevenueSeries = z.infer<typeof segmentedRevenueSeriesSchema>
export type PensionBenefitSchedule = z.infer<typeof pensionBenefitScheduleSchema>
export type ShareFloat = z.infer<typeof shareFloatSchema>
export type CompanyIncomeStatements = z.infer<typeof companyIncomeStatementsSchema>
export type CompanyBalanceSheets = z.infer<typeof companyBalanceSheetsSchema>
export type CompanyCashFlowStatements = z.infer<typeof companyCashFlowStatementsSchema>
export type CompanyFinancials = z.infer<typeof companyFinancialsEnvelopeSchema>
export type CompanyRatios = z.infer<typeof companyRatiosSchema>
export type BoardComposition = z.infer<typeof boardCompositionSchema>
export type NportHoldings = z.infer<typeof nportHoldingsSchema>
export type TraceReference = z.infer<typeof traceReferenceSchema>
export type TraceNode = z.infer<typeof traceNodeSchema>
export type Trace = z.infer<typeof traceSchema>
export type AnalyticsQueryRequest = z.infer<typeof analyticsQueryRequestSchema>
export type AnalyticsQueryResult = z.infer<typeof analyticsQueryResultSchema>
export type MaEvent = z.infer<typeof maEventSchema>
export type VotingProposal = z.infer<typeof votingProposalSchema>
export type VotingProposalType = z.infer<typeof votingProposalTypeSchema>
export type VotingParsingConfidence = z.infer<typeof votingParsingConfidenceSchema>
export type VotingMeetingType = z.infer<typeof votingMeetingTypeSchema>
export type VotingVoteFormat = z.infer<typeof votingVoteFormatSchema>
export type VotingResultsEvent = z.infer<typeof votingResultsEventSchema>
export type EnforcementAction = z.infer<typeof enforcementActionSchema>
export type EarningsMaterial = z.infer<typeof earningsMaterialSchema>
export type OwnershipReport = z.infer<typeof ownershipReportSchema>
export type OwnershipComparison = z.infer<typeof ownershipComparisonSchema>
export type InstitutionalInvestorPortfolio = z.infer<typeof institutionalInvestorPortfolioSchema>
export type InstitutionalHolderList = z.infer<typeof institutionalHolderListSchema>
export type InsiderTrade = z.infer<typeof insiderTradeSchema>
export type BeneficialOwnershipReport = z.infer<typeof beneficialOwnershipReportSchema>
export type CompensationRecord = z.infer<typeof compensationRecordSchema>
export type CompensationComparison = z.infer<typeof compensationComparisonSchema>
export type Artifact = z.infer<typeof artifactSchema>
export type Index = z.infer<typeof indexSchema>
export type IndexConstituent = z.infer<typeof indexConstituentSchema>
export type Organization = z.infer<typeof organizationSchema>
export type ApiKey = z.infer<typeof apiKeySchema>
export type UsageSummary = z.infer<typeof usageSummarySchema>
export type Limits = z.infer<typeof limitsSchema>
export type BillingBudget = z.infer<typeof billingBudgetSchema>
export type BillingQuote = z.infer<typeof billingQuoteSchema>
export type BillingBudgetUpdate = z.infer<typeof billingBudgetUpdateSchema>
export type DashboardOverview = z.infer<typeof dashboardOverviewSchema>
export type DashboardAccountSettings = z.infer<typeof dashboardAccountSettingsSchema>
export type DashboardUsageSeries = z.infer<typeof dashboardUsageSeriesSchema>
export type DashboardEndpointBreakdown = z.infer<typeof dashboardEndpointBreakdownSchema>
export type DashboardUsageRequest = z.infer<typeof dashboardUsageRequestSchema>
export type DashboardAuditEvent = z.infer<typeof dashboardAuditEventSchema>
export type DashboardUsageRequestLog = z.infer<typeof dashboardUsageRequestLogSchema>
export type DashboardUsageExport = z.infer<typeof dashboardUsageExportSchema>
export type DashboardUsageActivity = z.infer<typeof dashboardUsageActivitySchema>
export type AgentBootstrapToken = z.infer<typeof agentBootstrapTokenSchema>
export type AgentBootstrap = z.infer<typeof agentBootstrapSchema>
export type WebhookEndpoint = z.infer<typeof webhookEndpointSchema>
export type WebhookDeliveryAttempt = z.infer<typeof webhookDeliveryAttemptSchema>
export type StreamSubscription = z.infer<typeof streamSubscriptionSchema>
export type StreamTicket = z.infer<typeof streamTicketSchema>
export type ArtifactReconciliation = z.infer<typeof artifactReconciliationSchema>
export type ApiError = z.infer<typeof errorSchema>
