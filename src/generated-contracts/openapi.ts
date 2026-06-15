/**
 * AUTO-GENERATED paths and metadata merged with Zod-derived component schemas.
 * Do not edit the generated output (openapi.generated.json) directly.
 * Run `bun run contract:openapi` to regenerate, then `bun run contract:verify` to check for drift.
 */

const schemaRef = (name: string) => ({ $ref: `#/components/schemas/${name}` })

const objectExampleBySchema: Record<string, string> = {
  FactorRegimeScreen: "regime_screen",
}

const exampleAsOf = "2026-06-09T22:15:00.000Z"
const exampleSnapshotAt = "2026-06-09T19:45:00.000Z"
const exampleDataDate = "2026-06-09"

const exampleTrustMetadata = {
  dataAsOf: exampleDataDate,
  freshnessStatus: "fresh",
  methodologyVersion: "secapi_factor_returns_v1",
  materializationVersion: "2026-06-09",
  provenance: {
    source: "secapi_factor_pipeline",
    sourceLabel: "SecAPI factor pipeline",
    accessionNumber: null,
    filingUrl: "https://docs.secapi.ai/factors/methodology",
    acceptedAt: null,
    retrievedAt: exampleAsOf,
    parserVersion: "secapi-factor-pipeline",
  },
  freshness: {
    status: "fresh",
    asOf: exampleAsOf,
    sourcePublishedAt: "2026-06-09T21:30:00.000Z",
    lagMs: 2700000,
  },
  materialization: {
    parserVersion: "secapi-factor-pipeline",
    materializationVersion: "2026-06-09",
  },
  sourceRights: {
    source: "secapi_owned_factor_pipeline",
    sourceLabel: "SecAPI factor pipeline",
    posture: "public_safe",
    publicAvailability: "public",
    contractStatus: "approved",
    restrictions: [],
    notes: "SecAPI-owned derived factor data.",
  },
  methodology: {
    id: "secapi_factor_returns",
    version: "v1",
    summary: "SecAPI-owned daily factor returns, exposures, and portfolio analytics built for agent and API workflows.",
    confidence: "high",
    launchState: "beta",
    inputs: ["secapi_factor_returns", "secapi_factor_exposures", "market_calendar"],
    validation: { launchHistoryFloor: "2015-01-01", marketCalendarAware: true },
  },
  revision: {
    sourcePublishedAt: "2026-06-09T21:30:00.000Z",
    retrievedAt: exampleAsOf,
    vintageId: "2026-06-09",
    revisedFrom: null,
  },
  degradedState: null,
}

const exampleLaunchReadiness = {
  object: "factor_launch_readiness",
  status: "launch_ready",
  proofGated: true,
  proofReady: true,
  observedProofStatus: "ready",
  proofObservedAt: exampleAsOf,
  requiredProofArtifact: "factor_quality_daily_proof",
  requiredProofStatus: "ready",
  targetHistoryStartDate: "2015-01-01",
  historyStartDateClaim: "2015-01-01",
  betaReason: null,
  exclusionReason: null,
  claimPrerequisites: ["2015+ launch history", "latest complete market day", "row-level quality proof"],
}

const exampleQualityProof = {
  object: "factor_quality_proof",
  status: "ready",
  proofSource: "secapi_factor_pipeline",
  proofObservedAt: exampleAsOf,
  rowLevelProofAvailable: true,
  proofReady: true,
  firstDate: "2015-01-02",
  lastDate: "2026-06-09",
  firstRequiredMarketDate: "2015-01-02",
  latestMarketDay: "2026-06-09",
  targetHistoryStartDate: "2015-01-01",
  requiredHistoryStartDate: "2015-01-01",
  shortHistoryExempt: false,
  historyStartMarketDayLag: 0,
  latestMarketDayLag: 0,
  rowCount: 2882,
  distinctFactorDateCount: 2882,
  coveredMarketDateCount: 2882,
  expectedMarketDateCount: 2882,
  missingSessionCount: 0,
  coveragePct: 1,
  methodologyVersion: "secapi_factor_returns_v1",
  modelName: "secapi_stock_basket_factor_model_v1",
  methodologyUrl: "https://docs.secapi.ai/factors/methodology",
  sourceMetadata: {
    latestAsOf: "2026-06-09",
    latestSourcePublishedAt: "2026-06-09T21:30:00.000Z",
    observedModelNameCount: 1,
    observedModelNamesSample: ["secapi_stock_basket_factor_model_v1"],
    nonStockBasketRowCount: 0,
    metadataModelNames: ["secapi_stock_basket_factor_model_v1"],
    metadataModelVersions: ["2026-06-09"],
    metadataMethodologyUrls: ["https://docs.secapi.ai/factors/methodology"],
  },
  degradedReasons: [],
}

const exampleHoldings = [
  { symbol: "AAPL", weight: 0.35 },
  { symbol: "MSFT", weight: 0.3 },
  { symbol: "NVDA", weight: 0.2 },
  { symbol: "JPM", weight: 0.15 },
]

const exampleHedgeConstraints = {
  maxHedges: 3,
  maxPositionWeight: 0.08,
  maxTotalHedgeWeight: 0.2,
  maxSectorWeight: 0.35,
  hedgeIntensity: 0.75,
  longOnly: false,
  allowedInstrumentTypes: ["etf"],
  customUniverse: ["QUAL", "MTUM", "VLUE", "USMV"],
  targetExposures: { VALUE: 0, MOMENTUM: 0.1 },
  minConfidence: "medium",
  minLiquidityUsd: 10000000,
  excludedSectors: [],
}

const exampleOptimizerConstraints = {
  maxCandidates: 3,
  maxIterations: 50,
  maxRuntimeMs: 750,
  maxPositionWeight: 0.4,
  minPositionWeight: 0.02,
  longOnly: true,
  turnoverLimit: 0.25,
  riskFreeRate: 0.04,
}

const exampleExposure = {
  object: "factor_exposure",
  id: "factor_exposure:AAPL:VALUE:2026-06-09",
  subjectType: "security",
  subjectKey: "AAPL",
  factorKey: "VALUE",
  beta: -0.42,
  intercept: 0.001,
  rSquared: 0.31,
  adjustedRSquared: 0.29,
  tStat: -4.8,
  observationCount: 126,
  nActiveFactors: 7,
  percentile: 18.2,
  confidence: "high",
  modelName: "secapi_stock_basket_factor_model_v1",
  asOf: exampleAsOf,
  responseMode: "compact",
  ...exampleTrustMetadata,
  methodologyVersion: "secapi_factor_exposures_v1",
}

const exampleFactorReturn = {
  object: "factor_return",
  id: "factor_return:VALUE:1m:2026-06-09",
  factorKey: "VALUE",
  factorName: "Value",
  category: "style",
  asOf: exampleAsOf,
  window: "1m",
  modelName: "secapi_stock_basket_factor_model_v1",
  rawReturn: 0.018,
  pureReturn: 0.014,
  scaledReturn: 0.021,
  zScore: 1.42,
  leverage: 1,
  qualityProof: exampleQualityProof,
  responseMode: "compact",
  ...exampleTrustMetadata,
}

const exampleRegime = {
  key: "soft_landing",
  label: "Soft Landing",
  country: "US",
  confidence: "medium",
  drivers: [],
  factorImpacts: [],
}

const exampleRegimePerformance = {
  object: "factor_regime_performance",
  id: "factor_regime_performance:US:VALUE:soft_landing:2026-06-09",
  country: "US",
  regimeKey: "soft_landing",
  regimeLabel: "Soft Landing",
  factorKey: "VALUE",
  factorName: "Value",
  factorCategory: "style",
  window: "1m",
  lookback: "6m",
  rank: 1,
  regimeScore: 0.68,
  combinedScore: 0.74,
  direction: "tailwind",
  rationale: "Value has positive recent return and historically improves in this regime.",
  rawReturn: 0.018,
  pureReturn: 0.014,
  scaledReturn: 0.021,
  zScore: 1.42,
  leverage: 1,
  asOf: exampleAsOf,
  responseMode: "compact",
  ...exampleTrustMetadata,
}

const examplePortfolioAnalysis = {
  object: "portfolio_analysis",
  id: "portfolio_analysis:example:2026-06-09",
  asOf: exampleAsOf,
  holdings: exampleHoldings,
  exposures: [exampleExposure],
  fit: null,
  benchmarkLabel: "NASDAQ 100",
  benchmarkTilts: [],
  whatIfComparison: null,
  positionViews: [],
  positionExposures: [exampleExposure],
  attribution: [
    {
      key: "VALUE",
      label: "Value",
      category: "factor",
      contributionPercent: -0.48,
      explanation: "Negative value beta detracted as value lagged over the selected window.",
    },
  ],
  hedgeSuggestions: [
    {
      symbol: "VLUE",
      instrumentType: "etf",
      rationale: "Offsets the portfolio's negative value exposure with a liquid value ETF sleeve.",
      expectedExposureDelta: { VALUE: 0.18 },
      confidence: "medium",
    },
  ],
  optimizationNotes: ["Candidate search respected max position and turnover constraints."],
  factorNeutralPlan: ["Reduce negative VALUE exposure before increasing MOMENTUM exposure."],
  optimizerObjective: "factor_neutral",
  optimizerConstraints: exampleOptimizerConstraints,
  optimizerRuntime: {
    object: "portfolio_optimizer_runtime",
    method: "bounded_deterministic_candidate_search",
    candidateCount: 3,
    iterationBudget: 50,
    iterationsRun: 38,
    runtimeMs: 118,
    maxRuntimeMs: 750,
    timeout: false,
  },
  optimizerCandidateCount: 1,
  optimizerCandidateSample: [
    {
      object: "portfolio_optimizer_candidate",
      rank: 1,
      name: "Factor-neutral tilt",
      objective: "factor_neutral",
      expectedReturn: 0.087,
      expectedVolatility: 0.164,
      expectedSharpe: 0.53,
      maxDrawdownProxy: -0.18,
      factorExposureScore: 0.21,
      turnover: 0.12,
      score: 0.81,
      constraintStatus: "ok",
      constraintsApplied: ["turnoverLimit"],
      rationale: "Improves factor balance without breaching turnover or concentration limits.",
    },
  ],
  selectedCandidate: null,
  optimizerDisclosures: ["Optimizer output is a deterministic scenario, not investment advice."],
  summaryMd: "Portfolio is growth and quality tilted with a moderate negative value exposure.",
  responseMode: "compact",
  ...exampleTrustMetadata,
  methodologyVersion: "secapi_portfolio_factor_v1",
}

const examplePortfolioAttribution = {
  object: "portfolio_attribution",
  id: "portfolio_attribution:example:2026-06-09",
  analysisId: "portfolio_analysis:example:2026-06-09",
  asOf: exampleAsOf,
  country: "US",
  window: "3m",
  lookback: "12m",
  frequency: "weekly",
  holdings: exampleHoldings,
  portfolioReturn: 0.082,
  totalExplained: 0.061,
  alpha: 0.021,
  rSquared: 0.74,
  contributions: [
    {
      object: "portfolio_factor_attribution",
      rank: 1,
      factorKey: "MOMENTUM",
      factorName: "Momentum",
      factorCategory: "style",
      contributionPercent: 2.4,
      contributionPct: 0.024,
      beta: 0.37,
      factorReturn: 0.065,
      rawReturn: 0.058,
      pureReturn: 0.052,
      scaledReturn: 0.065,
      zScore: 1.7,
      leverage: 1,
      modelName: "secapi_stock_basket_factor_model_v1",
      explanation: "Positive momentum exposure explained 240 bps of the portfolio return.",
    },
  ],
  returnStream: [],
  returnPointCount: 12,
  returnStreamSample: [
    {
      object: "portfolio_return_point",
      period: "2026-W22",
      periodEnd: "2026-05-29",
      frequency: "weekly",
      periodReturn: 0.011,
      cumulativeReturn: 0.064,
      coverageWeight: 1,
      missingSymbols: [],
    },
  ],
  rollingBetas: [],
  rollingBetaCount: 4,
  rollingBetasUnavailableReason: null,
  exposures: [exampleExposure],
  export: {
    object: "portfolio_attribution_export",
    requestedFormat: "json",
    formats: ["json"],
    fileName: "secapi-portfolio-attribution-2026-06-09",
    columns: ["factorKey", "contributionPercent", "beta", "factorReturn"],
    csv: null,
    files: [],
  },
  summaryMd: "Momentum and quality explained most of the recent return while value detracted.",
  responseMode: "compact",
  ...exampleTrustMetadata,
  methodologyVersion: "secapi_portfolio_attribution_v1",
}

const examplePortfolioHedge = {
  object: "portfolio_hedge",
  id: "portfolio_hedge:example:2026-06-09",
  analysisId: "portfolio_analysis:example:2026-06-09",
  asOf: exampleAsOf,
  country: "US",
  lookback: "12m",
  objective: "factor_neutral",
  mode: "compact",
  constraints: exampleHedgeConstraints,
  holdings: exampleHoldings,
  targetExposures: [
    {
      object: "portfolio_hedge_target_exposure",
      factorKey: "VALUE",
      factorName: "Value",
      factorCategory: "style",
      beta: -0.42,
      targetExposureDelta: 0.42,
      proposedExposureDelta: 0.18,
      residualBeta: -0.24,
      hedged: true,
      skipReason: null,
    },
  ],
  hedges: [
    {
      object: "portfolio_hedge_candidate",
      rank: 1,
      factorKey: "VALUE",
      factorName: "Value",
      factorCategory: "style",
      symbol: "VLUE",
      instrumentType: "etf",
      action: "long",
      recommendedWeight: 0.08,
      targetExposureDelta: 0.42,
      expectedExposureDelta: { VALUE: 0.18 },
      residualBeta: -0.24,
      constraintStatus: "ok",
      constraintsApplied: ["maxPositionWeight"],
      liquidityUsd: 145000000,
      estimatedCostBps: 4,
      sectorKey: null,
      rationale: "Adds liquid value exposure without increasing single-name concentration.",
      confidence: "medium",
    },
  ],
  residualExposure: { VALUE: -0.24, MOMENTUM: 0.37 },
  exposures: [exampleExposure],
  optimizationNotes: ["Hedge candidates are bounded by liquidity and max total hedge weight."],
  factorNeutralPlan: ["Add VLUE at 8% funded pro rata from overweight growth names."],
  summaryMd: "The suggested hedge reduces negative VALUE beta while keeping total hedge weight under 20%.",
  responseMode: "compact",
  ...exampleTrustMetadata,
  methodologyVersion: "secapi_portfolio_hedge_v1",
}

const responseExampleBySchema: Record<string, unknown> = {
  FactorCatalog: {
    object: "list",
    data: [
      {
        object: "factor_definition",
        id: "factor:VALUE",
        key: "VALUE",
        name: "Value",
        category: "style",
        description: "Long cheaper stocks and short expensive stocks using SecAPI-owned factor construction.",
        benchmarkSymbol: "VLUE",
        equation: { long_leg: 1, short_leg: -1 },
        orthogonalizedAgainst: ["MARKET"],
        catalogStatus: "launch_ready",
        sourceAvailabilityStatus: "implemented",
        launchUniverseStatus: "launch_candidate",
        launchClaimStatus: "candidate_pending_history_freshness_proof",
        launchParityCategory: "style",
        launchReadiness: exampleLaunchReadiness,
        qualityProof: exampleQualityProof,
        responseMode: "compact",
        ...exampleTrustMetadata,
      },
    ],
    hasMore: false,
    nextCursor: null,
    categories: ["market", "style", "sector", "industry"],
    requestId: "req_example",
  },
  FactorReturnList: {
    object: "list",
    data: [exampleFactorReturn],
    hasMore: false,
    nextCursor: null,
    responseMode: "compact",
    requestId: "req_example",
  },
  FactorHistory: {
    object: "factor_history",
    id: "factor_history:VALUE:1y:2026-06-09",
    factorKey: "VALUE",
    factorName: "Value",
    category: "style",
    range: "1y",
    dateFrom: "2025-06-10",
    dateTo: "2026-06-09",
    historyStartDate: "2015-01-02",
    historyEndDate: "2026-06-09",
    observationCount: 252,
    asOf: exampleAsOf,
    series: [],
    seriesCount: 252,
    seriesSample: [
      { date: "2025-06-10", rawReturn: 0.0012, pureReturn: 0.0009, scaledReturn: 0.0011, zScore: 0.18, leverage: 1 },
      { date: "2026-06-09", rawReturn: 0.0038, pureReturn: 0.0031, scaledReturn: 0.0042, zScore: 1.42, leverage: 1 },
    ],
    expansionHints: ["Use include=series for full daily observations in compact mode."],
    summaryWindows: [
      { window: "1d", rawReturn: 0.0038, pureReturn: 0.0031, scaledReturn: 0.0042, observationCount: 1, startDate: "2026-06-09", endDate: "2026-06-09" },
      { window: "1m", rawReturn: 0.018, pureReturn: 0.014, scaledReturn: 0.021, observationCount: 21, startDate: "2026-05-11", endDate: "2026-06-09" },
      { window: "max", rawReturn: 1.46, pureReturn: 1.12, scaledReturn: 1.31, observationCount: 2882, startDate: "2015-01-02", endDate: "2026-06-09" },
    ],
    qualityProof: exampleQualityProof,
    responseMode: "compact",
    ...exampleTrustMetadata,
    methodologyVersion: "secapi_factor_returns_v1",
  },
  FactorSparklineList: {
    object: "list",
    data: [
      {
        object: "factor_sparkline",
        id: "factor_sparkline:VALUE:1y:scaled_return",
        factorKey: "VALUE",
        factorName: "Value",
        category: "style",
        range: "1y",
        metric: "scaled_return",
        dateFrom: "2025-06-10",
        dateTo: "2026-06-09",
        historyStartDate: "2015-01-02",
        historyEndDate: "2026-06-09",
        observationCount: 252,
        pointCount: 120,
        asOf: exampleAsOf,
        latestValue: 0.131,
        latestRawReturn: 0.0038,
        latestPureReturn: 0.0031,
        latestScaledReturn: 0.0042,
        latestZScore: 1.42,
        latestLeverage: 1,
        summaryWindows: [
          { window: "1m", rawReturn: 0.018, pureReturn: 0.014, scaledReturn: 0.021, observationCount: 21, startDate: "2026-05-11", endDate: "2026-06-09" },
        ],
        points: [
          { date: "2025-06-10", value: 0 },
          { date: "2026-06-09", value: 0.131 },
        ],
        qualityProof: exampleQualityProof,
        responseMode: "compact",
        ...exampleTrustMetadata,
      },
    ],
    hasMore: false,
    nextCursor: null,
    responseMode: "compact",
    requestId: "req_example",
  },
  FactorDashboard: {
    object: "factor_dashboard",
    id: "factor_dashboard:US:style:2026-06-09",
    asOf: exampleAsOf,
    country: "US",
    category: "style",
    window: "1m",
    lookback: "6m",
    intraday: [],
    regimePerformance: [],
    rotation: null,
    spotlightSymbol: "AAPL",
    spotlightExposures: [exampleExposure],
    modelPortfolio: null,
    summaryMd: "Value is a tailwind, momentum remains extended, and the portfolio spotlight shows negative value exposure.",
    responseMode: "compact",
    ...exampleTrustMetadata,
    methodologyVersion: "secapi_factor_dashboard_v1",
  },
  FactorIntradaySnapshotList: {
    object: "list",
    data: [
      {
        object: "factor_intraday_snapshot",
        id: "factor_intraday_snapshot:VALUE:1d:2026-06-09T19:45:00.000Z",
        factorKey: "VALUE",
        factorName: "Value",
        factorCategory: "style",
        modelName: "secapi_stock_basket_factor_model_v1",
        window: "1d",
        snapshotAt: exampleSnapshotAt,
        benchmarkSymbols: ["VLUE", "IWD", "IWF"],
        rawReturn: 0.0038,
        pureReturn: 0.0031,
        scaledReturn: 0.0042,
        zScore: 1.42,
        leverage: 1,
        responseMode: "compact",
        ...exampleTrustMetadata,
      },
    ],
    hasMore: false,
    nextCursor: null,
    responseMode: "compact",
    requestId: "req_example",
  },
  FactorRegimePerformanceList: {
    object: "list",
    data: [exampleRegimePerformance],
    hasMore: false,
    nextCursor: null,
    responseMode: "compact",
    requestId: "req_example",
  },
  FactorExtremeMoveList: {
    object: "list",
    data: [
      {
        object: "factor_extreme_move",
        id: "factor_extreme_move:MOMENTUM:1m:2026-06-09",
        rank: 1,
        factorKey: "MOMENTUM",
        factorName: "Momentum",
        category: "style",
        window: "1m",
        lookback: "6m",
        direction: "up",
        sort: "abs_z_score",
        score: 2.61,
        absZScore: 2.61,
        absScaledReturn: 0.064,
        minAbsZScore: 2,
        isExtreme: true,
        asOf: exampleAsOf,
        rawReturn: 0.057,
        pureReturn: 0.049,
        scaledReturn: 0.064,
        zScore: 2.61,
        leverage: 1,
        responseMode: "compact",
        ...exampleTrustMetadata,
      },
    ],
    hasMore: false,
    nextCursor: null,
    responseMode: "compact",
    requestId: "req_example",
  },
  FactorExtremePairList: {
    object: "list",
    data: [
      {
        object: "factor_extreme_pair",
        id: "factor_extreme_pair:MOMENTUM:VALUE:21d:2026-06-09",
        rank: 1,
        factor1: "MOMENTUM",
        factor2: "VALUE",
        factor1Name: "Momentum",
        factor2Name: "Value",
        category1: "style",
        category2: "style",
        window: "21d",
        lookback: "6m",
        direction: "factor1",
        sort: "abs_z_score",
        score: 2.18,
        absZScore: 2.18,
        absSpreadReturn: 0.043,
        minAbsZScore: 2,
        isExtreme: true,
        spreadReturn: 0.043,
        factor1Return: 0.064,
        factor2Return: 0.021,
        averageSpreadReturn: 0.006,
        spreadVolatility: 0.017,
        zScore: 2.18,
        spreadZScore: 2.18,
        meanReversionSignal: "factor1_overextended",
        meanReversionSummary: "Momentum has outperformed value unusually over the latest 21 trading days.",
        windowStartDate: "2026-05-11",
        windowEndDate: "2026-06-09",
        pairHistory: { endpoint: "/v1/factors/pair-history/MOMENTUM/VALUE?window=1m&lookback=6m" },
        observationCount: 126,
        rollingObservationCount: 106,
        asOf: exampleAsOf,
        responseMode: "compact",
        ...exampleTrustMetadata,
      },
    ],
    hasMore: false,
    nextCursor: null,
    responseMode: "compact",
    requestId: "req_example",
  },
  FactorValuationList: {
    object: "list",
    data: [
      {
        object: "factor_valuation",
        id: "factor_valuation:VALUE:2026-06-09",
        rank: 1,
        factorKey: "VALUE",
        factorName: "Value",
        category: "style",
        valuationMetric: "earnings_yield",
        longLeg: "cheap",
        shortLeg: "expensive",
        window: "1m",
        lookback: "6m",
        signal: "tailwind",
        signalDirection: "tailwind",
        weightingMode: "long_short_equal",
        legWeights: { long: 1, short: -1 },
        rawFactorZScore: 1.42,
        weightedZScore: 1.42,
        sort: "opportunity_score",
        score: 0.71,
        opportunityScore: 0.71,
        zScore: 1.42,
        absZScore: 1.42,
        scaledReturn: 0.021,
        pureReturn: 0.014,
        rawReturn: 0.018,
        asOf: exampleAsOf,
        signalSource: "materialized_factor_return_z_score",
        stockDrilldown: { endpoint: "/v1/factors/valuations/stocks?factor=VALUE&signal=tailwind" },
        opportunitySummary: "Value is above trend and inexpensive names have a current factor tailwind.",
        responseMode: "compact",
        ...exampleTrustMetadata,
      },
    ],
    hasMore: false,
    nextCursor: null,
    responseMode: "compact",
    requestId: "req_example",
  },
  FactorValuationStockList: {
    object: "list",
    data: [
      {
        object: "factor_valuation_stock",
        id: "factor_valuation_stock:VALUE:JPM:2026-06-09",
        rank: 1,
        symbol: "JPM",
        factorKey: "VALUE",
        factorName: "Value",
        category: "style",
        valuationMetric: "earnings_yield",
        valuationSignal: "tailwind",
        signalDirection: "tailwind",
        weightingMode: "long_short_equal",
        legWeights: { long: 1, short: -1 },
        stance: "beneficiaries",
        impact: "beneficiary",
        sort: "score",
        score: 0.84,
        expectedFactorImpactScore: 0.62,
        factorZScore: 1.42,
        rawFactorZScore: 1.42,
        weightedFactorZScore: 1.42,
        exposureAdjustedFactorZScore: 0.62,
        exposureBeta: 0.44,
        absExposureBeta: 0.44,
        exposurePercentile: 88.4,
        exposureConfidence: "high",
        nActiveFactors: 7,
        window: "1m",
        lookback: "6m",
        modelName: "secapi_stock_basket_factor_model_v1",
        asOf: exampleAsOf,
        factorAsOf: exampleAsOf,
        signalSource: "materialized_factor_return_z_score_plus_latest_factor_exposure",
        rankingRationale: "JPM has positive value beta while VALUE has a current tailwind.",
        opportunitySummary: "Potential beneficiary of a continuing value tailwind.",
        responseMode: "compact",
        ...exampleTrustMetadata,
      },
    ],
    hasMore: false,
    nextCursor: null,
    responseMode: "compact",
    requestId: "req_example",
  },
  FactorSimilarityPack: {
    object: "factor_similarity_pack",
    id: "factor_similarity_pack:NVDA:2026-06-09",
    symbol: "NVDA",
    asOf: exampleAsOf,
    anchorTheme: "accelerated compute",
    themeLabels: ["AI infrastructure", "semiconductors"],
    factorKeySuggestion: "AI_INFRASTRUCTURE",
    discoveryMode: "factor_overlap_plus_filing_news_signature",
    semanticSignature: {
      algorithm: "secapi_filing_news_signature_v1",
      dimensions: 384,
      topTerms: ["accelerated computing", "data center", "gpu"],
      sourceKinds: ["filing_title", "news_headline"],
      sourceCount: 18,
    },
    namingWorkflow: {
      workflowVersion: "2026-06-09",
      selectedLabel: "AI Infrastructure",
      factorKeySuggestion: "AI_INFRASTRUCTURE",
      confidence: "high",
      labelCandidates: [
        { label: "AI Infrastructure", score: 0.91, kind: "phrase", evidenceTerms: ["data center", "gpu"], sourceCount: 18 },
      ],
      rationale: "Peers cluster around data-center accelerator demand and AI infrastructure filings.",
    },
    evidence: [],
    peers: [],
    summaryMd: "NVDA peers share semiconductor and AI infrastructure signatures plus similar factor exposure.",
    responseMode: "compact",
    ...exampleTrustMetadata,
  },
  FactorExposureList: {
    object: "list",
    data: [exampleExposure],
    hasMore: false,
    nextCursor: null,
    responseMode: "compact",
    requestId: "req_example",
  },
  FactorCorrelationList: {
    object: "list",
    data: [
      {
        object: "factor_correlation",
        id: "factor_correlation:VALUE:MOMENTUM:6m",
        leftFactorKey: "VALUE",
        rightFactorKey: "MOMENTUM",
        lookback: "6m",
        correlation: -0.34,
        observationCount: 126,
        responseMode: "compact",
        ...exampleTrustMetadata,
      },
    ],
    hasMore: false,
    nextCursor: null,
    responseMode: "compact",
    requestId: "req_example",
  },
  FactorDecomposition: {
    object: "factor_decomposition",
    id: "factor_decomposition:AAPL:3m:2026-06-09",
    symbol: "AAPL",
    factorCategory: "style",
    window: "3m",
    asOf: exampleAsOf,
    exposures: [exampleExposure],
    contributions: [
      {
        factorKey: "MOMENTUM",
        contributionPercent: 1.8,
        explanation: "Momentum beta explained 180 bps of AAPL's selected-window return.",
      },
    ],
    summaryMd: "AAPL's selected-window return was mostly explained by momentum and quality exposure.",
    stockReturn: 0.072,
    totalExplained: 0.049,
    alpha: 0.023,
    rSquared: 0.68,
    modelName: "secapi_stock_basket_factor_model_v1",
    date: exampleDataDate,
    responseMode: "compact",
    ...exampleTrustMetadata,
  },
  RelatedSecurityList: {
    object: "list",
    data: [
      {
        object: "related_security",
        id: "related_security:NVDA:AMD",
        symbol: "AMD",
        similarity: 0.86,
        score: 0.84,
        factorSimilarity: 0.79,
        thematicSimilarity: 0.91,
        factorOverlap: ["MOMENTUM", "QUALITY", "AI_INFRASTRUCTURE"],
        explanation: "AMD shares semiconductor, AI infrastructure, and momentum exposure with NVDA.",
        themeLabels: ["AI infrastructure", "semiconductors"],
        evidence: [],
        responseMode: "compact",
        ...exampleTrustMetadata,
      },
    ],
    hasMore: false,
    nextCursor: null,
    responseMode: "compact",
    requestId: "req_example",
  },
  FactorPairSpreadList: {
    object: "list",
    data: [
      {
        object: "factor_pair_spread",
        id: "factor_pair_spread:MOMENTUM:VALUE:21d:2026-06-09",
        factor1: "MOMENTUM",
        factor2: "VALUE",
        factor1Name: "Momentum",
        factor2Name: "Value",
        category1: "style",
        category2: "style",
        window: "21d",
        lookback: "6m",
        spreadReturn: 0.043,
        factor1Return: 0.064,
        factor2Return: 0.021,
        averageSpread: 0.006,
        averageSpreadReturn: 0.006,
        spreadVolatility: 0.017,
        rollingSpreadVolatility: 0.017,
        zScore: 2.18,
        spreadZScore: 2.18,
        absZScore: 2.18,
        direction: "factor1",
        meanReversionSignal: "factor1_overextended",
        meanReversionSummary: "Momentum has outperformed value unusually over the latest 21 trading days.",
        windowStartDate: "2026-05-11",
        windowEndDate: "2026-06-09",
        rollingObservationCount: 106,
        observationCount: 126,
        seriesCount: 106,
        seriesSample: [
          { date: "2026-05-11", spread: 0.004, f1Return: 0.006, f2Return: 0.002 },
          { date: "2026-06-09", spread: 0.043, f1Return: 0.064, f2Return: 0.021 },
        ],
        expansionHints: ["Use response_mode=standard for full pair-history series."],
        asOf: exampleAsOf,
        responseMode: "compact",
        ...exampleTrustMetadata,
      },
    ],
    hasMore: false,
    nextCursor: null,
    responseMode: "compact",
    requestId: "req_example",
  },
  FactorBulkReturnList: {
    object: "list",
    data: [
      {
        object: "factor_bulk_return",
        id: "factor_bulk_return:VALUE:12m:2026-06-09",
        factorKey: "VALUE",
        factorName: "Value",
        category: "style",
        asOf: exampleAsOf,
        window: "1m",
        lookback: "12m",
        rawReturn: 0.018,
        pureReturn: 0.014,
        scaledReturn: 0.021,
        zScore: 1.42,
        leverage: 1,
        seriesCount: 252,
        seriesSample: [
          { date: "2025-06-10", rawReturn: 0.0012, pureReturn: 0.0009, scaledReturn: 0.0011, zScore: 0.18 },
          { date: "2026-06-09", rawReturn: 0.0038, pureReturn: 0.0031, scaledReturn: 0.0042, zScore: 1.42 },
        ],
        expansionHints: ["Use response_mode=standard for full daily series."],
        responseMode: "compact",
        ...exampleTrustMetadata,
      },
    ],
    hasMore: false,
    nextCursor: null,
    responseMode: "compact",
    requestId: "req_example",
  },
  PortfolioAnalysis: examplePortfolioAnalysis,
  PortfolioAttribution: examplePortfolioAttribution,
  PortfolioHedge: examplePortfolioHedge,
  ModelFactorAnalysis: {
    object: "model_factor_analysis",
    id: "model_factor_analysis:example:2026-06-09",
    asOf: exampleAsOf,
    model: {
      id: "growth-quality-core",
      label: "Growth Quality Core",
      description: "Model Builder portfolio submitted for factor analysis.",
      tags: ["model-builder", "growth"],
      source: "model_builder",
    },
    country: "US",
    lookback: "12m",
    window: "3m",
    category: "style",
    holdings: exampleHoldings,
    include: { attribution: true, hedge: true, optimizer: true, positionViews: true },
    analysis: examplePortfolioAnalysis,
    attribution: examplePortfolioAttribution,
    hedge: examplePortfolioHedge,
    optimizerObjective: "factor_neutral",
    optimizerConstraints: exampleOptimizerConstraints,
    optimizerRuntime: examplePortfolioAnalysis.optimizerRuntime,
    optimizerCandidates: [],
    optimizerCandidateCount: 1,
    optimizerCandidateSample: examplePortfolioAnalysis.optimizerCandidateSample,
    selectedCandidate: null,
    optimizerDisclosures: examplePortfolioAnalysis.optimizerDisclosures,
    positionViews: [],
    positionExposures: [exampleExposure],
    summaryMd: "Model is growth-quality tilted; hedge and optimizer sections show bounded factor-neutral alternatives.",
    responseMode: "compact",
    ...exampleTrustMetadata,
    methodologyVersion: "secapi_model_factor_analysis_v1",
  },
  ModelPortfolioFactorView: {
    object: "model_portfolio_factor_view",
    id: "model_portfolio_factor_view:growth-quality-core:2026-06-09",
    portfolioId: "growth-quality-core",
    label: "Growth Quality Core",
    description: "Saved Turos model portfolio factor view.",
    tags: ["model-builder", "growth"],
    holdings: exampleHoldings,
    analysis: examplePortfolioAnalysis,
    positionViews: [],
    positionExposures: [exampleExposure],
    responseMode: "compact",
    ...exampleTrustMetadata,
  },
  FactorRotationStrategy: {
    object: "factor_rotation_strategy",
    id: "factor_rotation_strategy:US:soft_landing:2026-06-09",
    asOf: exampleAsOf,
    country: "US",
    regime: exampleRegime,
    leaders: [exampleRegimePerformance],
    laggards: [
      {
        ...exampleRegimePerformance,
        id: "factor_regime_performance:US:LOW_VOL:soft_landing:2026-06-09",
        factorKey: "LOW_VOL",
        factorName: "Low Volatility",
        rank: 2,
        direction: "headwind",
        combinedScore: -0.41,
        rationale: "Low volatility trails in the current risk-on regime.",
      },
    ],
    summaryMd: "Rotate toward value and momentum while low volatility trails in the current regime.",
    responseMode: "compact",
    ...exampleTrustMetadata,
  },
  FactorRegimeScreen: {
    object: "regime_screen",
    id: "regime_screen:US:soft_landing:2026-06-09",
    asOf: exampleAsOf,
    country: "US",
    regime: exampleRegime,
    matches: [exampleFactorReturn],
    summaryMd: "Value and momentum are the highest-ranked style factors for the current regime screen.",
    responseMode: "compact",
    ...exampleTrustMetadata,
  },
  PortfolioStressTest: {
    object: "portfolio_stress_test",
    id: "portfolio_stress_test:higher_for_longer:2026-06-09",
    asOf: exampleAsOf,
    scenarioKey: "higher_for_longer",
    scenarioLabel: "Higher for Longer",
    estimatedDrawdownPercent: -7.4,
    factorShocks: { VALUE: 0.02, MOMENTUM: -0.04, QUALITY: 0.01 },
    macroShocks: { rates: 0.75, credit_spreads: 0.35 },
    regime: null,
    conditioningNotes: ["Uses bounded factor shocks from historical higher-rate episodes."],
    summaryMd: "Portfolio drawdown proxy is driven mainly by momentum and duration-sensitive exposures.",
    responseMode: "compact",
    ...exampleTrustMetadata,
  },
}

const requestExampleBySchema: Record<string, unknown> = {
  FactorCustomDiscoveryRequest: {
    symbol: "NVDA",
    candidates: ["AMD", "AVGO", "TSM", "ASML"],
    lookback: "6m",
    limit: 5,
  },
  PortfolioIntelligenceRequest: {
    country: "US",
    lookback: "12m",
    category: "style",
    keys: ["VALUE", "MOMENTUM", "QUALITY"],
    holdings: exampleHoldings,
    benchmarkLabel: "NASDAQ 100",
    benchmarkHoldings: [
      { symbol: "QQQ", weight: 1 },
    ],
  },
  PortfolioAttributionRequest: {
    country: "US",
    lookback: "12m",
    window: "3m",
    frequency: "weekly",
    exportFormat: "json",
    category: "style",
    keys: ["VALUE", "MOMENTUM", "QUALITY"],
    holdings: exampleHoldings,
  },
  PortfolioHedgeRequest: {
    country: "US",
    lookback: "12m",
    category: "style",
    keys: ["VALUE", "MOMENTUM", "QUALITY"],
    objective: "factor_neutral",
    mode: "compact",
    constraints: exampleHedgeConstraints,
    holdings: exampleHoldings,
  },
  PortfolioOptimizeRequest: {
    country: "US",
    lookback: "12m",
    category: "style",
    keys: ["VALUE", "MOMENTUM", "QUALITY"],
    objective: "factor_neutral",
    constraints: exampleOptimizerConstraints,
    holdings: exampleHoldings,
  },
  PortfolioStressTestRequest: {
    country: "US",
    lookback: "12m",
    category: "style",
    keys: ["VALUE", "MOMENTUM", "QUALITY"],
    scenarioKey: "higher_for_longer",
    holdings: exampleHoldings,
  },
  ModelFactorAnalysisRequest: {
    model: {
      id: "growth-quality-core",
      label: "Growth Quality Core",
      description: "Model Builder portfolio submitted for factor analysis.",
      tags: ["model-builder", "growth"],
      source: "model_builder",
    },
    country: "US",
    lookback: "12m",
    window: "3m",
    category: "style",
    keys: ["VALUE", "MOMENTUM", "QUALITY"],
    include: { attribution: true, hedge: true, optimizer: true, positionViews: true },
    hedge: {
      objective: "factor_neutral",
      mode: "compact",
      constraints: exampleHedgeConstraints,
    },
    optimizer: {
      objective: "factor_neutral",
      constraints: exampleOptimizerConstraints,
    },
    holdings: exampleHoldings,
  },
  FactorStrategyRequest: {
    country: "US",
    category: "style",
    window: "1m",
    lookback: "6m",
    limit: 5,
  },
}

const launchResponseSchemasRequiringExplicitExamples = new Set([
  "FactorCatalog",
  "FactorReturnList",
  "FactorHistory",
  "FactorSparklineList",
  "FactorIntradaySnapshotList",
  "FactorDashboard",
  "FactorRegimePerformanceList",
  "FactorExposureList",
  "FactorCorrelationList",
  "FactorDecomposition",
  "RelatedSecurityList",
  "FactorSimilarityPack",
  "FactorPairSpreadList",
  "FactorBulkReturnList",
  "FactorExtremeMoveList",
  "FactorExtremePairList",
  "FactorValuationList",
  "FactorValuationStockList",
  "PortfolioAnalysis",
  "PortfolioAttribution",
  "PortfolioHedge",
  "PortfolioStressTest",
  "ModelPortfolioFactorView",
  "ModelFactorAnalysis",
  "FactorRotationStrategy",
  "FactorRegimeScreen",
])

const responseExampleForSchema = (name: string) => {
  const specificExample = responseExampleBySchema[name]
  if (specificExample) return specificExample
  if (launchResponseSchemasRequiringExplicitExamples.has(name)) {
    throw new Error(`Launch OpenAPI schema ${name} requires a realistic explicit example`)
  }
  if (name === "FactorCatalog") {
    return {
      object: "list",
      data: [],
      hasMore: false,
      nextCursor: null,
      categories: ["market", "style", "sector", "industry"],
      requestId: "req_example",
    }
  }
  if (name.endsWith("List") || name === "FactorCatalog") {
    return {
      object: "list",
      data: [],
      hasMore: false,
      nextCursor: null,
      responseMode: "compact",
      requestId: "req_example",
    }
  }
  return {
    object: objectExampleBySchema[name] ?? name.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase(),
    responseMode: "compact",
    requestId: "req_example",
  }
}

const requestExampleForSchema = (name: string) => requestExampleBySchema[name]

const jsonContent = (name: string) => ({
  "application/json": {
    schema: schemaRef(name),
  },
})

const jsonContentWithExample = (name: string, summary = "Compact response") => ({
  "application/json": {
    schema: schemaRef(name),
    examples: {
      compact: {
        summary,
        value: responseExampleForSchema(name),
      },
    },
  },
})

const jsonResponse = (name: string, description = "Successful response") => ({
  responses: {
    "200": {
      description,
      content: jsonContent(name),
    },
  },
})

const jsonStatusResponse = (status: string, name: string, description = "Successful response") => ({
  responses: {
    [status]: {
      description,
      content: jsonContent(name),
    },
  },
})

const jsonResponseWithExample = (name: string, description = "Successful response") => ({
  responses: {
    "200": {
      description,
      content: jsonContentWithExample(name),
    },
  },
})

const jsonFactorResponse = (name: string, description = "Successful response") => ({
  responses: {
    "200": {
      description,
      content: {
        "application/json": {
          schema: schemaRef(name),
          examples: {
            compact: {
              summary: "Token-efficient compact response",
              value: responseExampleForSchema(name),
            },
          },
        },
      },
    },
  },
})

const jsonFactorResponseWithCsv = (name: string, description = "Successful response") => {
  const response = jsonFactorResponse(name, description)
  return {
    responses: {
      "200": {
        ...response.responses["200"],
        content: {
          ...response.responses["200"].content,
          "text/csv": {
            schema: { type: "string" },
          },
        },
      },
    },
  }
}

const jsonRequestBody = (name: string, description?: string) => ({
  requestBody: {
    required: true,
    ...(description ? { description } : {}),
    content: {
      "application/json": {
        schema: schemaRef(name),
        ...(requestExampleForSchema(name) ? {
          examples: {
            default: {
              summary: "Copy-pasteable request",
              value: requestExampleForSchema(name),
            },
          },
        } : {}),
      },
    },
  },
})

const factorResponseParameters = [
  {
    name: "response_mode",
    in: "query",
    required: false,
    schema: { type: "string", enum: ["compact", "standard", "verbose"], default: "compact" },
    description: "Response projection. compact is token-efficient for agents; standard returns the full operational shape; verbose preserves full trust metadata and drill-down context.",
  },
  {
    name: "include",
    in: "query",
    required: false,
    schema: { type: "string" },
    description: "Comma-separated compact-mode expansions such as trust, metadata, series, exposures, position_views, position_exposures, optimizer_candidates, or drilldown. Use trust when an agent or report needs provenance, freshness, source-rights, methodology, revision, and degraded-state metadata.",
  },
] as const

const factorResponseParams = (parameters: readonly Record<string, unknown>[] = [], options: { responseModeDefault?: "compact" | "standard" | "verbose" } = {}) => [
  ...parameters,
  ...factorResponseParameters.map((parameter) => {
    if (parameter.name !== "response_mode" || !options.responseModeDefault) return parameter
    return {
      ...parameter,
      schema: {
        ...parameter.schema,
        default: options.responseModeDefault,
      },
    }
  }),
]

export const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "SEC API",
    version: "2026-03-19",
    description: "SEC API for investor agents spanning SEC filings, market, macro, factor, portfolio, and intelligence-query workloads.",
  },
  servers: [
    { url: "https://api.secapi.ai", description: "Production" },
  ],
  paths: {
    "/.well-known/oauth-protected-resource": {
      get: { summary: "Return OAuth protected resource metadata for hosted MCP and API clients" },
    },
    "/.well-known/oauth-authorization-server": {
      get: { summary: "Return or proxy OAuth authorization server metadata for the configured WorkOS tenant" },
    },
    "/v1/me": {
      get: { summary: "Return the current authenticated principal and organization context" },
    },
    "/v1/org": {
      get: { summary: "Return the current organization profile" },
    },
    "/v1/admin/orgs": {
      get: { summary: "List operator-visible organizations with support-safe plan, usage, and recent activity summaries" },
    },
    "/v1/admin/orgs/{org_id}": {
      get: { summary: "Return an operator-facing organization snapshot with API keys, billing, usage, events, webhooks, streams, and delivery state" },
    },
    "/v1/admin/orgs/{org_id}/requests/{request_id}": {
      get: { summary: "Return operator-scoped request diagnostics for a tenant request identifier" },
    },
    "/v1/admin/orgs/{org_id}/deliveries/summary": {
      get: { summary: "Return operator-scoped delivery aggregates for webhook and stream activity within a tenant" },
    },
    "/v1/admin/maintenance/hot-lane": {
      post: { summary: "Run operator-scoped hot-lane polling to enqueue fresh SEC publication observations" },
    },
    "/v1/admin/maintenance/reconcile-hot": {
      post: { summary: "Run operator-scoped reconcile work to enqueue missing live hot-lane filings" },
    },
    "/v1/admin/maintenance/ingest-worker": {
      post: { summary: "Run operator-scoped ingest worker passes to materialize queued filing artifacts and sections" },
    },
    "/v1/admin/maintenance/ingest-queue": {
      post: { summary: "Export an operator-scoped ingest queue and checkpoint summary from the running SEC API service" },
    },
    "/v1/admin/maintenance/warm-market-latest": {
      post: { summary: "Warm search-visible manifests for the latest market-wide SEC filings by core form" },
    },
    "/v1/admin/maintenance/warm-market-data": {
      post: { summary: "Warm operator-scoped market snapshots, reference, estimates, bars, and corporate-action caches for covered symbols" },
    },
    "/v1/admin/maintenance/warm-macro-data": {
      post: { summary: "Bootstrap operator-scoped Tier-1 macro materialization for launch countries" },
    },
    "/v1/admin/maintenance/warm-factor-data": {
      post: { summary: "Warm operator-scoped factor returns, exposures, and correlations for covered symbols and factor categories" },
    },
    "/v1/admin/maintenance/warm-factor-intraday": {
      post: { summary: "Warm operator-scoped intraday factor snapshots for supported categories and windows" },
    },
    "/v1/admin/maintenance/company-mapping-identifiers": {
      post: { summary: "Backfill FIGI-family and security identifier coverage into the canonical entity store from operator-supplied universe rows" },
    },
    "/v1/billing/webhooks/stripe": {
      post: { summary: "Receive and process signed Stripe subscription lifecycle webhooks" },
    },
    "/v1/billing": {
      get: { summary: "Return the current organization's billing snapshot, including pricing posture, budget controls, and settlement provider state" },
    },
    "/v1/billing/rates": {
      get: { summary: "Return the public pricing catalog, plan metadata, and meter-family launch rates" },
    },
    "/v1/billing/payg/activate": {
      post: { summary: "Create a Stripe Checkout setup session that activates Pay As You Go card-on-file billing" },
    },
    "/v1/billing/quote": {
      post: { summary: "Quote a billable workflow or meter class against the current billing plan and budget gates" },
    },
    "/v1/billing/budget": {
      put: { summary: "Update organization-level spend caps, soft caps, and approval thresholds for PAYG usage" },
    },
    "/v1/billing/checkout": {
      post: { summary: "Create a Stripe Checkout session for a self-serve Personal or Team SEC API plan" },
    },
    "/v1/billing/portal": {
      post: { summary: "Create a Stripe Billing Portal session for the current organization" },
    },
    "/v1/api_keys": {
      get: { summary: "List API keys for the current organization" },
      post: { summary: "Create a new API key for the current organization" },
    },
    "/v1/agent/bootstrap_tokens": {
      post: { summary: "Issue a short-lived, single-use sponsor token for agent bootstrap under the current organization" },
    },
    "/v1/agent/bootstrap": {
      post: { summary: "Exchange a sponsor token for the first org-scoped API key, billing snapshot, limits, and MCP install metadata" },
    },
    "/v1/dashboard/overview": {
      get: {
        summary: "Return the logged-in dashboard overview with principal, org, enriched billing, usage, and API key context",
        ...jsonResponse("DashboardOverview"),
      },
    },
    "/v1/dashboard/settings": {
      get: {
        summary: "Return profile, organization, appearance, security, and account-deletion settings for the dashboard",
        ...jsonResponse("DashboardAccountSettings"),
      },
    },
    "/v1/dashboard/settings/profile": {
      patch: {
        summary: "Update local dashboard profile preferences for the current WorkOS user",
        ...jsonRequestBody("AccountUpdateDashboardProfileBody"),
        ...jsonResponse("DashboardAccountSettings"),
      },
    },
    "/v1/dashboard/settings/organization": {
      patch: {
        summary: "Update locally owned organization profile settings",
        ...jsonRequestBody("AccountUpdateDashboardOrganizationBody"),
        ...jsonResponse("DashboardAccountSettings"),
      },
    },
    "/v1/dashboard/settings/appearance": {
      put: {
        summary: "Update dashboard appearance preferences for the current organization",
        ...jsonRequestBody("AccountUpdateDashboardAppearanceBody"),
        ...jsonResponse("DashboardAccountSettings"),
      },
    },
    "/v1/dashboard/settings/account-deletion-request": {
      post: {
        summary: "Record an account-deletion request for the current organization without deleting data inline",
        ...jsonRequestBody("AccountRequestDeletionBody"),
        ...jsonStatusResponse("202", "DashboardAccountSettings", "Account-deletion request recorded"),
      },
    },
    "/v1/dashboard/usage/series": {
      get: {
        summary: "Return dashboard usage counts over time for the current organization",
        ...jsonResponse("DashboardUsageSeries"),
      },
    },
    "/v1/dashboard/usage/endpoints": {
      get: {
        summary: "Return dashboard endpoint-level usage breakdown for the current organization",
        ...jsonResponse("DashboardEndpointBreakdown"),
      },
    },
    "/v1/dashboard/usage/requests": {
      get: {
        summary: "Return recent dashboard request log rows for the current organization",
        ...jsonResponse("DashboardUsageRequestLog"),
      },
    },
    "/v1/dashboard/usage/export": {
      get: {
        summary: "Export dashboard usage request log rows as JSON or CSV",
        responses: {
          "200": {
            description: "Dashboard usage export as JSON or CSV",
            content: {
              ...jsonContent("DashboardUsageExport"),
              "text/csv": {
                schema: { type: "string" },
              },
            },
          },
        },
      },
    },
    "/v1/dashboard/activity": {
      get: {
        summary: "Return dashboard activity totals and recent request rows for the current organization",
        ...jsonResponse("DashboardUsageActivity"),
      },
    },
    "/v1/events": {
      get: { summary: "List canonical event, webhook delivery, and stream records for the current organization" },
    },
    "/v1/events/export": {
      get: { summary: "Export filtered canonical events as JSON or NDJSON for support and operations" },
    },
    "/v1/diagnostics/requests/{request_id}": {
      get: { summary: "Return request-id scoped diagnostics across usage, events, deliveries, streams, and artifacts" },
    },
    "/v1/diagnostics/deliveries/summary": {
      get: { summary: "Return aggregated webhook and stream delivery summaries for support workflows" },
    },
    "/v1/observability": {
      get: { summary: "Return operator-only observability configuration and provider seam status" },
    },
    "/v1/observability/export": {
      get: { summary: "Return an operator-only observability export with config, usage, and recent events" },
    },
    "/v1/webhook_endpoints": {
      get: { summary: "List webhook endpoints for the current organization" },
      post: { summary: "Create a signed webhook endpoint for artifact and stream events" },
    },
    "/v1/webhook_endpoints/{webhook_id}/rotate_secret": {
      post: { summary: "Rotate the signing secret for a webhook endpoint" },
    },
    "/v1/webhook_endpoints/{webhook_id}/deliveries": {
      get: { summary: "List canonical delivery attempts for a webhook endpoint" },
    },
    "/v1/webhook_endpoints/{webhook_id}/deliveries/{delivery_id}/replay": {
      post: { summary: "Replay a stored webhook delivery attempt by re-emitting its source event to the endpoint" },
    },
    "/v1/monitors": {
      get: { summary: "List saved-search monitors for the current organization" },
      post: { summary: "Create a saved-search monitor with optional webhook or email delivery destination" },
    },
    "/v1/monitors/{monitor_id}": {
      get: { summary: "Retrieve a single monitor by id" },
      delete: { summary: "Deactivate a monitor (idempotent; sets is_active=false)" },
    },
    "/v1/monitors/{monitor_id}/matches": {
      get: { summary: "Run the monitor's saved query and return new matches since last_checked_at" },
    },
    "/v1/monitors/{monitor_id}/delivery": {
      post: { summary: "Update or replace the monitor's delivery destination (e.g., set or change an email recipient)" },
    },
    "/v1/delivery/unsubscribe": {
      get: {
        summary: "Render an unsubscribe confirmation page for a signed token",
        description: "Anonymous endpoint. GET is preview-safe and never mutates state — it only renders a confirmation page with a POST form. Email link previewers (Outlook, Apple Mail, Gmail) will fetch this URL during scanning; the user must submit POST to actually unsubscribe (RFC 8058).",
        parameters: [
          { name: "token", in: "query", required: true, schema: { type: "string" }, description: "Signed unsubscribe token (HMAC-SHA256, with nonce + expiry)." },
        ],
        responses: {
          "200": { description: "Confirmation HTML page rendered" },
          "400": { description: "Invalid or expired token" },
        },
      },
      post: {
        summary: "Unsubscribe from monitor email delivery (RFC 8058 one-click compatible)",
        description: "Anonymous endpoint. Token may be supplied in form-encoded body OR query string. When the body includes `List-Unsubscribe=One-Click`, the response is 204 No Content per RFC 8058. Idempotent — repeated calls with the same token return the same result.",
        responses: {
          "200": { description: "Confirmation HTML page (interactive flow)" },
          "204": { description: "One-click unsubscribe processed (RFC 8058 List-Unsubscribe-Post)" },
          "400": { description: "Invalid or expired token" },
        },
      },
    },
    "/v1/stream_subscriptions": {
      get: { summary: "List stream subscriptions for the current organization" },
      post: { summary: "Create a stream subscription for event polling and replay" },
    },
    "/v1/stream_subscriptions/{stream_id}/events": {
      get: { summary: "Poll canonical stream events for a subscription with cursor semantics" },
    },
    "/v1/stream/tickets": {
      post: {
        summary: "Mint a short-lived signed WebSocket stream ticket for the current principal",
        description: "Creates a short-lived signed ticket that can be sent as the `ticket` query parameter when upgrading to `/v1/stream/ws`. This avoids sending long-lived API keys or bearer tokens in browser-visible WebSocket URLs.",
      },
    },
    "/v1/stream/ws": {
      get: {
        summary: "Upgrade to a WebSocket connection for real-time filing event streaming",
        description: "Upgrades the HTTP connection to a WebSocket. Clients must supply a short-lived signed `ticket` query parameter minted from `POST /v1/stream/tickets`. Streams `filing.published` events in real time with optional form/ticker filtering and cursor-based replay. Metered as `stream_connection` on upgrade and `stream_event` per delivery (1000/min default).",
        parameters: [
          { name: "ticket", in: "query", schema: { type: "string" }, description: "Short-lived signed stream ticket minted from `POST /v1/stream/tickets`." },
          { name: "forms", in: "query", schema: { type: "string" }, description: "Comma-separated form types to filter (e.g. '10-K,8-K'). Case-insensitive." },
          { name: "tickers", in: "query", schema: { type: "string" }, description: "Comma-separated tickers to filter (e.g. 'AAPL,MSFT'). Case-insensitive." },
          { name: "cursor", in: "query", schema: { type: "string" }, description: "Resume from a previous event cursor (e.g. 'sevt_...'). Events after this cursor are replayed on connect." },
        ],
        responses: {
          "101": { description: "WebSocket upgrade successful. Server sends JSON frames: connected, filing.published, pong, filters_updated, rate_limited." },
          "401": { description: "Missing or invalid stream ticket" },
          "429": { description: "Per-organization connection limit exceeded" },
          "503": { description: "Global connection capacity exceeded" },
        },
      },
    },
    "/v1/entities/resolve": {
      get: { summary: "Resolve an entity by ticker, CIK, FIGI-family identifier, ISIN, CUSIP, or name with confidence and match-basis metadata" },
    },
    "/v1/entities": {
      get: { summary: "Search canonical SEC entities across issuers, managers, insiders, and funds" },
    },
    "/v1/traces": {
      get: { summary: "Batch resolve shared trace records by trace identifier across filing-derived and supported non-filing datasets" },
    },
    "/v1/traces/{trace_id}": {
      get: { summary: "Resolve a single shared trace record by trace identifier across filing-derived and supported non-filing datasets" },
    },
    "/v1/analytics/query": {
      post: {
        summary: "Run a tenant-safe analytical query over supported SEC API history datasets without exposing raw SQL",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AnalyticsQueryInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Successful analytics query result",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AnalyticsQueryResult" },
              },
            },
          },
        },
      },
    },
    "/v1/filings": {
      get: { summary: "Search filing manifests with historical filters, accession lookup semantics, sorting, and cursor pagination" },
    },
    "/v1/filings/latest": {
      get: { summary: "Retrieve the latest filing for an entity and form" },
    },
    "/v1/filings/latest/render": {
      get: { summary: "Render the latest filing into Markdown-like text" },
    },
    "/v1/filings/latest/sections/{section_key}": {
      get: { summary: "Extract a section from the latest filing for an entity and form" },
    },
    "/v1/filings/latest/risk-categories": {
      get: { summary: "Return deterministic Item 1A risk-category coverage for the latest covered filing of an issuer" },
    },
    "/v1/board": {
      get: { summary: "Return the latest board composition derived from definitive proxy filings with director roster and committee coverage semantics" },
    },
    "/v1/funds/nport/holdings": {
      get: { summary: "Return the latest SEC N-PORT holdings roster with explicit capability semantics and balance-unit metadata" },
    },
    "/v1/filings/{accession_number}": {
      get: { summary: "Retrieve a filing manifest by accession number from the materialized filing corpus" },
    },
    "/v1/filings/{accession_number}/sections/{section_key}": {
      get: { summary: "Extract a filing item or section from a specific accession-number filing" },
    },
    "/v1/filings/pension-benefit-schedule": {
      get: { summary: "Return structured expected pension and retiree benefit payments for a target year when the filing discloses the schedule in rendered tables" },
    },
    "/v1/statements/segmented-facts": {
      get: { summary: "Return filing-derived segmented fact history for supported metrics such as revenue and segment profit/loss, with product or geography dimensions, hierarchy metadata, capability state, and trace references when issuers disclose them" },
    },
    "/v1/statements/segmented-revenues": {
      get: { summary: "Return filing-derived segmented revenue history with XBRL product or geography dimensions, capability state, and trace references when issuers disclose them" },
    },
    "/v1/statements/share-float": {
      get: { summary: "Return a share-float wrapper backed by SEC company facts, including disclosed public float when available and shares-outstanding fallback semantics otherwise" },
    },
    "/v1/sections/search": {
      get: { summary: "Search filing sections and snippets with filing-scoped filters and cursor pagination" },
    },
    "/v1/offerings": {
      get: { summary: "Return recent S-1 and 424B prospectus records with cursor pagination and date filters" },
    },
    "/v1/forms/144": {
      get: { summary: "Return recent Form 144 notices of proposed insider sales with cursor pagination and date filters" },
    },
    "/v1/companies/subsidiaries": {
      get: { summary: "Return the list of subsidiaries extracted from the latest 10-K Exhibit 21 for a given entity" },
    },
    "/v1/events/ma": {
      get: { summary: "Return SEC-native M&A events inferred from public-company filings and relevant exhibits" },
    },
    "/v1/events/enforcement": {
      get: { summary: "Return official SEC litigation releases and administrative proceedings with explicit release-source semantics and shared trace references" },
    },
    "/v1/events/restatements": {
      get: { summary: "Return 8-K Item 4.02 restatement and non-reliance events with severity classification and affected-period extraction" },
    },
    "/v1/events/auditor-changes": {
      get: { summary: "Return 8-K Item 4.01 auditor change events with change-type classification (dismissal, resignation, engagement)" },
    },
    "/v1/events/officer-changes": {
      get: { summary: "Return 8-K Item 5.02 officer and director change events with change-type classification (appointment, departure, resignation, termination)" },
    },
    "/v1/events/voting-results": {
      get: { summary: "Return 8-K Item 5.07 voting results with structured proposals, vote counts, and approval outcomes — first-in-market parser ahead of sec-api.io's open bug" },
    },
    "/v1/earnings/transcripts": {
      get: { summary: "Return SEC-furnished earnings materials from 8-K filings with release, remarks, and transcript coverage states" },
    },
    "/v1/market/calendar": {
      get: { summary: "Return market calendar sessions for supported exchanges with source coverage metadata" },
    },
    "/v1/market/indices": {
      get: { summary: "Return the supported public index roster inventory and optionally include the broader rights-tracked index source catalog" },
    },
    "/v1/market/indices/constituents": {
      get: { summary: "Return rights-safe index constituents for supported benchmark families with canonical entity mapping when available" },
    },
    "/v1/market/snapshots": {
      get: { summary: "Return persisted latest-market snapshots for one or more securities with freshness, rights, and revision metadata" },
    },
    "/v1/market/bars": {
      get: { summary: "Return historical OHLCV bars for a security with materialization and rights metadata" },
    },
    "/v1/market/corporate-actions": {
      get: { summary: "Return rights-reviewed corporate actions used to normalize price history and event analysis" },
    },
    "/v1/market/universe": {
      get: { summary: "Browse the full ticker universe with pagination, filtering by exchange, type, sector, industry, and search" },
    },
    "/v1/market/earnings-calendar": {
      get: { summary: "Return upcoming and recent earnings events with consensus estimates, actuals, and surprise data" },
    },
    "/v1/market/reference": {
      get: {
        summary: "Return canonical market reference metadata for a security, including identifiers, exchange, and listing context",
        ...jsonResponse("MarketReference"),
      },
    },
    "/v1/news/stories": {
      get: { summary: "Return rights-safe news stories with entity tagging, provenance, and source-rights metadata" },
    },
    "/v1/news/search": {
      get: { summary: "Search rights-safe news coverage and issuer communications by symbol, entity, or topic" },
    },
    "/v1/macro/search": {
      get: {
        summary: "Search supported macro indicators by keyword across all countries and high-signal packs",
        parameters: [
          { name: "q", in: "query", required: true, schema: { type: "string" }, description: "Search term matched against indicator key, label, dataset, and series code" },
          { name: "country", in: "query", schema: { type: "string" }, description: "ISO country code filter (e.g. US, JP, CN)" },
          { name: "frequency", in: "query", schema: { type: "string", enum: ["daily", "weekly", "monthly", "quarterly"] }, description: "Indicator frequency filter" },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100, default: 25 }, description: "Maximum results to return (default 25, max 100)" },
        ],
      },
    },
    "/v1/macro/indicators": {
      get: { summary: "Return official-source macro indicator observations with revision-aware provenance and country-quality metadata" },
    },
    "/v1/macro/releases": {
      get: { summary: "Return macro release observations with actual, prior, consensus, and surprise metadata" },
    },
    "/v1/macro/calendar": {
      get: { summary: "Return the macro event calendar for supported official-source releases and central-bank events" },
    },
    "/v1/macro/forecasts": {
      get: { summary: "Return SEC API forecast baselines and scenario-aware macro projections with methodology metadata" },
    },
    "/v1/macro/high-signal-pack": {
      get: {
        summary: "Return the launch-ring Tier-1 high-signal macro pack with explicit source, fallback, and release-calendar posture for supported countries",
        ...jsonResponse("MacroHighSignalPack"),
      },
    },
    "/v1/macro/regimes": {
      get: {
        summary: "Return the current macro regime classification for a country using the canonical SEC API macro overlay",
        ...jsonResponse("MacroRegime"),
      },
    },
    "/v1/macro/credit-ratings": {
      get: {
        summary: "Return sovereign credit ratings from S&P, Moody's, and Fitch for tracked countries and G20 members",
        parameters: [
          { name: "country", in: "query", schema: { type: "string" }, description: "Filter by country name or ISO country code (case-insensitive)" },
        ],
      },
    },
    "/v1/macro/credit-ratings/{country}": {
      get: {
        summary: "Return the sovereign credit rating for a single country by ISO country code",
        parameters: [
          { name: "country", in: "path", required: true, schema: { type: "string" }, description: "ISO 2-letter country code (e.g. US, JP, DE)" },
        ],
      },
    },
    "/v1/factors/catalog": {
      get: {
        summary: "Return the SEC API factor catalog with methodology, proxy, and orthogonalization metadata",
        parameters: factorResponseParams(),
        ...jsonResponseWithExample("FactorCatalog"),
      },
    },
    "/v1/factors/returns": {
      get: {
        summary: "Return factor return history, z-scores, and volatility-scaled series for supported factor families",
        parameters: factorResponseParams(),
        ...jsonFactorResponse("FactorReturnList"),
      },
    },
    "/v1/factors/history/{factorKey}": {
      get: {
        summary: "Return a single factor's daily return history with 1D through MAX summary windows for chart and table workflows",
        parameters: factorResponseParams([
          {
            name: "factorKey",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Canonical factor key or supported public alias such as VALUE_V2. Explicit keys do not broaden to other factors.",
          },
          {
            name: "range",
            in: "query",
            required: false,
            schema: { type: "string", enum: ["1d", "5d", "10d", "1m", "3m", "6m", "1y", "max"], default: "1y" },
            description: "Trailing observation window for the returned chart series. Defaults to 1y for token-efficient agent and dashboard workflows. MAX requests the public launch-history floor, 2015-01-01, through the latest complete market date when row-level coverage exists for the factor.",
          },
          {
            name: "date_from",
            in: "query",
            required: false,
            schema: { type: "string", format: "date", minimum: "2015-01-01" },
            description: "Optional inclusive ISO start date. Must be on or after 2015-01-01. When supplied, it overrides range for the returned series bounds.",
          },
          {
            name: "date_to",
            in: "query",
            required: false,
            schema: { type: "string", format: "date", minimum: "2015-01-01" },
            description: "Optional inclusive ISO end date. Must be on or after 2015-01-01 and on or before the latest complete XNYS market date.",
          },
          { name: "format", in: "query", schema: { type: "string", enum: ["json", "csv"], default: "json" }, description: "Return JSON by default or a table-ready CSV export with one row per factor/date." },
        ]),
        ...jsonFactorResponseWithCsv("FactorHistory"),
      },
    },
    "/v1/factors/sparklines": {
      get: {
        summary: "Return compact multi-factor sparkline series with 1D through MAX summary windows for dashboard, sector, index, and model UIs",
        parameters: factorResponseParams([
          {
            name: "factors",
            in: "query",
            required: false,
            schema: { type: "string" },
            description: "Comma-separated canonical factor keys or supported public aliases. Alias normalization is explicit and does not broaden the selection.",
          },
          {
            name: "keys",
            in: "query",
            required: false,
            schema: { type: "string" },
            description: "Alias for factors.",
          },
          {
            name: "category",
            in: "query",
            required: false,
            schema: { type: "string" },
            description: "Optional launch factor category filter such as style, sector, or industry.",
          },
          {
            name: "range",
            in: "query",
            required: false,
            schema: { type: "string", enum: ["1d", "5d", "10d", "1m", "3m", "6m", "1y", "max"], default: "1y" },
            description: "Trailing observation window for the returned sparkline points. Defaults to 1y for token-efficient dashboard and agent workflows. MAX requests the public launch-history floor, 2015-01-01, through the latest complete market date when row-level coverage exists for each factor.",
          },
          {
            name: "metric",
            in: "query",
            required: false,
            schema: { type: "string", enum: ["scaled_return", "pure_return", "raw_return", "z_score"], default: "scaled_return" },
            description: "Metric used for sparkline point values. Return metrics are cumulative over the selected range; z_score returns point-in-time z-scores.",
          },
          {
            name: "points",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 2, maximum: 500, default: 120 },
            description: "Maximum chart points per factor. The first and last observations are preserved when downsampling.",
          },
          {
            name: "date_from",
            in: "query",
            required: false,
            schema: { type: "string", format: "date", minimum: "2015-01-01" },
            description: "Optional inclusive ISO start date. Must be on or after 2015-01-01 and overrides range for returned sparkline bounds.",
          },
          {
            name: "date_to",
            in: "query",
            required: false,
            schema: { type: "string", format: "date", minimum: "2015-01-01" },
            description: "Optional inclusive ISO end date. Must be on or after 2015-01-01 and on or before the latest complete XNYS market date.",
          },
          { name: "format", in: "query", schema: { type: "string", enum: ["json", "csv"], default: "json" }, description: "Return JSON by default or a table-ready CSV export with one row per factor/date sparkline point." },
        ]),
        ...jsonFactorResponseWithCsv("FactorSparklineList"),
      },
    },
    "/v1/factors/returns/intraday": {
      get: {
        summary: "Return intraday factor snapshots for dashboards using the current benchmark proxy surface and freshness metadata",
        parameters: factorResponseParams(),
        ...jsonFactorResponse("FactorIntradaySnapshotList"),
      },
    },
    "/v1/factors/dashboard": {
      get: {
        summary: "Return a one-call factor dashboard with intraday, regime, rotation, spotlight-security, and optional model-portfolio drill-down sections",
        parameters: factorResponseParams(),
        ...jsonFactorResponse("FactorDashboard"),
      },
    },
    "/v1/factors/regime-performance": {
      get: {
        summary: "Return regime-conditioned factor rankings that blend the active macro backdrop with current factor state",
        parameters: factorResponseParams(),
        ...jsonFactorResponse("FactorRegimePerformanceList"),
      },
    },
    "/v1/factors/exposures": {
      get: {
        summary: "Return security, portfolio, or watchlist factor exposures with model metadata and provenance",
        parameters: factorResponseParams([
          { name: "symbols", in: "query", required: true, schema: { type: "string" }, description: "Comma-separated symbols to load exposures for. `tickers` is accepted as an alias." },
          { name: "factors", in: "query", schema: { type: "string" }, description: "Comma-separated factor keys or aliases." },
          { name: "keys", in: "query", schema: { type: "string" }, description: "Alias for factors." },
          { name: "category", in: "query", schema: { type: "string" }, description: "Optional launch factor category filter." },
          { name: "lookback", in: "query", schema: { type: "string", default: "6m" }, description: "Exposure lookback window." },
          { name: "model", in: "query", schema: { type: "string" }, description: "Optional factor exposure model selector." },
        ]),
        ...jsonFactorResponse("FactorExposureList"),
      },
    },
    "/v1/stocks/{ticker}/loadings": {
      get: {
        summary: "Return stock-level factor loadings for a single ticker using the latest stored exposure model",
        parameters: factorResponseParams([
          { name: "ticker", in: "path", required: true, schema: { type: "string" }, description: "Ticker symbol." },
        ]),
        ...jsonFactorResponse("FactorExposureList"),
      },
    },
    "/v1/factors/correlations": {
      get: {
        summary: "Return factor-to-factor and factor-to-security correlation surfaces for strategy and risk workflows",
        parameters: factorResponseParams(),
        ...jsonFactorResponse("FactorCorrelationList"),
      },
    },
    "/v1/factors/screen": {
      get: {
        summary: "Return factor screens ranked by recent strength so agents can run factor-rotation and cross-factor ranking workflows",
        parameters: factorResponseParams(),
        ...jsonFactorResponse("FactorReturnList"),
      },
    },
    "/v1/factors/extreme-moves": {
      get: {
        summary: "Return factor moves ranked by unusual z-score or absolute return with direction, threshold, and trust metadata",
        parameters: factorResponseParams([
          { name: "factors", in: "query", schema: { type: "string" }, description: "Comma-separated canonical factor keys or supported public aliases." },
          { name: "keys", in: "query", schema: { type: "string" }, description: "Alias for factors." },
          { name: "category", in: "query", schema: { type: "string" }, description: "Optional launch factor category filter such as style, sector, or industry." },
          { name: "window", in: "query", schema: { type: "string", enum: ["1d", "5d", "10d", "1m", "3m", "6m", "1y"], default: "1m" }, description: "Return window used to score the move." },
          { name: "lookback", in: "query", schema: { type: "string", default: "6m" }, description: "History lookback used to compute z-scores. Automatically widens when shorter than window." },
          { name: "side", in: "query", schema: { type: "string", enum: ["both", "up", "down", "flat"], default: "both" }, description: "Filter by move direction." },
          { name: "direction", in: "query", schema: { type: "string", enum: ["both", "up", "down", "flat"] }, description: "Alias for side, useful for dashboard filters that label move direction directly." },
          { name: "sort", in: "query", schema: { type: "string", enum: ["abs_z_score", "abs_scaled_return"], default: "abs_z_score" }, description: "Ranking metric for unusual moves." },
          { name: "min_z_score", in: "query", schema: { type: "number", minimum: 0, default: 0 }, description: "Optional absolute z-score floor. Defaults to 0 so the endpoint always returns the top ranked moves." },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100, default: 25 }, description: "Maximum number of ranked factor moves." },
        ]),
        ...jsonFactorResponse("FactorExtremeMoveList"),
      },
    },
    "/v1/factors/extreme-pairs": {
      get: {
        summary: "Return factor pairs ranked by unusual rolling spread divergence with direction, threshold, and trust metadata",
        parameters: factorResponseParams([
          { name: "factors", in: "query", schema: { type: "string" }, description: "Comma-separated canonical factor keys or supported public aliases used to generate pair combinations." },
          { name: "keys", in: "query", schema: { type: "string" }, description: "Alias for factors." },
          { name: "category", in: "query", schema: { type: "string" }, description: "Optional launch factor category filter such as style, sector, or industry." },
          { name: "window", in: "query", schema: { type: "string", enum: ["1d", "5d", "10d", "21d", "63d", "126d", "252d", "1m", "3m", "6m", "1y"], default: "21d" }, description: "Rolling spread window. Calendar aliases map to trading-day pair windows." },
          { name: "lookback", in: "query", schema: { type: "string", default: "6m" }, description: "History lookback used to score rolling spread z-scores. Automatically widens when shorter than window." },
          { name: "side", in: "query", schema: { type: "string", enum: ["both", "factor1", "factor2", "flat"], default: "both" }, description: "Filter by which side of the pair outperformed over the latest window." },
          { name: "direction", in: "query", schema: { type: "string", enum: ["both", "factor1", "factor2", "flat"] }, description: "Alias for side." },
          { name: "sort", in: "query", schema: { type: "string", enum: ["abs_z_score", "abs_spread_return"], default: "abs_z_score" }, description: "Ranking metric for pair divergence." },
          { name: "min_z_score", in: "query", schema: { type: "number", minimum: 0, default: 0 }, description: "Optional absolute z-score floor. Defaults to 0 so the endpoint always returns the top ranked pairs." },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100, default: 25 }, description: "Maximum number of ranked factor pairs." },
        ]),
        ...jsonFactorResponse("FactorExtremePairList"),
      },
    },
    "/v1/factors/valuations": {
      get: {
        summary: "Return valuation-factor opportunity signals ranked from SecAPI-owned factor return state with trust metadata",
        parameters: factorResponseParams([
          { name: "factors", in: "query", schema: { type: "string" }, description: "Comma-separated valuation factor keys or supported public aliases. Defaults to launch valuation factors." },
          { name: "keys", in: "query", schema: { type: "string" }, description: "Alias for factors." },
          { name: "category", in: "query", schema: { type: "string" }, description: "Optional category filter. Valuation defaults are style factors." },
          { name: "window", in: "query", schema: { type: "string", enum: ["1d", "5d", "10d", "1m", "3m", "6m", "1y"], default: "1m" }, description: "Return window used to score the valuation-factor signal." },
          { name: "lookback", in: "query", schema: { type: "string", default: "6m" }, description: "History lookback used to compute factor z-scores. Automatically widens when shorter than window." },
          { name: "side", in: "query", schema: { type: "string", enum: ["all", "tailwind", "headwind", "neutral"], default: "all" }, description: "Filter by valuation-factor signal direction." },
          { name: "signal", in: "query", schema: { type: "string", enum: ["all", "tailwind", "headwind", "neutral"] }, description: "Alias for side." },
          { name: "weighting_mode", in: "query", schema: { type: "string", enum: ["long_short_equal", "long_leg_focus", "short_leg_focus"], default: "long_short_equal" }, description: "Valuation lens used to transform the factor z-score. The default uses the native long-high-metric / short-low-metric factor; short_leg_focus flips the signal lens for the short leg." },
          { name: "weighting", in: "query", schema: { type: "string", enum: ["long_short_equal", "long_leg_focus", "short_leg_focus"] }, description: "Alias for weighting_mode." },
          { name: "sort", in: "query", schema: { type: "string", enum: ["opportunity_score", "abs_z_score", "factor_key"], default: "opportunity_score" }, description: "Ranking metric for valuation-factor opportunities. With side=headwind, opportunity_score ranks the strongest headwinds first while opportunityScore remains signed." },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100, default: 25 }, description: "Maximum number of valuation factor rows." },
          { name: "format", in: "query", schema: { type: "string", enum: ["json", "csv"], default: "json" }, description: "Return JSON by default or a CSV export for spreadsheet workflows." },
        ]),
        ...jsonFactorResponseWithCsv("FactorValuationList"),
      },
    },
    "/v1/factors/valuations/stocks": {
      get: {
        summary: "Return stock candidates exposed to a valuation-factor signal using latest materialized factor exposures",
        parameters: factorResponseParams([
          { name: "factor", in: "query", schema: { type: "string" }, description: "Valuation factor key or alias to drill into. If omitted, the top valuation factor is selected." },
          { name: "factorKey", in: "query", schema: { type: "string" }, description: "Alias for factor." },
          { name: "key", in: "query", schema: { type: "string" }, description: "Alias for factor." },
          { name: "factors", in: "query", schema: { type: "string" }, description: "Comma-separated valuation factor keys used when factor is omitted; the top valuation row is selected." },
          { name: "keys", in: "query", schema: { type: "string" }, description: "Alias for factors." },
          { name: "category", in: "query", schema: { type: "string" }, description: "Optional valuation factor category filter." },
          { name: "window", in: "query", schema: { type: "string", enum: ["1d", "5d", "10d", "1m", "3m", "6m", "1y"], default: "1m" }, description: "Return window used for the factor valuation signal." },
          { name: "lookback", in: "query", schema: { type: "string", default: "6m" }, description: "Exposure lookback and valuation z-score lookback." },
          { name: "signal", in: "query", schema: { type: "string", enum: ["all", "tailwind", "headwind", "neutral"] }, description: "Optional factor-level valuation signal filter when selecting the top factor." },
          { name: "stance", in: "query", schema: { type: "string", enum: ["beneficiaries", "at_risk", "both"] }, description: "Stock view: beneficiaries of the factor signal, stocks at risk from it, or both. When omitted, SEC API chooses beneficiaries for tailwind/neutral factors and at_risk for headwind factors." },
          { name: "side", in: "query", schema: { type: "string" }, description: "Alias for stance; also accepts long, short, all." },
          { name: "direction", in: "query", schema: { type: "string" }, description: "Alias for stance." },
          { name: "weighting_mode", in: "query", schema: { type: "string", enum: ["long_short_equal", "long_leg_focus", "short_leg_focus"], default: "long_short_equal" }, description: "Valuation lens used before ranking exposed stocks. Must match the factor-valuation workflow for consistent drilldowns." },
          { name: "weighting", in: "query", schema: { type: "string", enum: ["long_short_equal", "long_leg_focus", "short_leg_focus"] }, description: "Alias for weighting_mode." },
          { name: "sort", in: "query", schema: { type: "string", enum: ["score", "abs_beta", "symbol"], default: "score" }, description: "Ranking metric for stock candidates." },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100, default: 25 }, description: "Maximum number of stock candidates." },
          { name: "format", in: "query", schema: { type: "string", enum: ["json", "csv"], default: "json" }, description: "Return JSON by default or a CSV export for spreadsheet workflows." },
        ]),
        ...jsonFactorResponseWithCsv("FactorValuationStockList"),
      },
    },
    "/v1/factors/decomposition": {
      get: {
        summary: "Return factor-attribution decomposition for a security over a bounded lookback window with explained return, alpha, and methodology metadata",
        parameters: factorResponseParams([
          { name: "symbol", in: "query", required: true, schema: { type: "string" }, description: "Ticker symbol to decompose. `ticker` is accepted as an alias." },
          { name: "factors", in: "query", schema: { type: "string" }, description: "Comma-separated factor keys or aliases." },
          { name: "keys", in: "query", schema: { type: "string" }, description: "Alias for factors." },
          { name: "category", in: "query", schema: { type: "string" }, description: "Optional launch factor category filter." },
          { name: "window", in: "query", schema: { type: "string", default: "1m" }, description: "Return window used for decomposition." },
          { name: "lookback", in: "query", schema: { type: "string", default: "6m" }, description: "History lookback used for exposures and factor returns." },
        ]),
        ...jsonFactorResponse("FactorDecomposition"),
      },
    },
    "/v1/factors/related-stocks": {
      get: {
        summary: "Return related stocks ranked by factor-overlap similarity for peer discovery and hedge ideation",
        parameters: factorResponseParams([
          { name: "symbol", in: "query", required: true, schema: { type: "string" }, description: "Ticker symbol to find related stocks for. `ticker` is accepted as an alias." },
          { name: "candidates", in: "query", schema: { type: "string" }, description: "Optional comma-separated candidate universe." },
          { name: "factors", in: "query", schema: { type: "string" }, description: "Comma-separated factor keys or aliases." },
          { name: "keys", in: "query", schema: { type: "string" }, description: "Alias for factors." },
          { name: "category", in: "query", schema: { type: "string" }, description: "Optional launch factor category filter." },
          { name: "lookback", in: "query", schema: { type: "string", default: "6m" }, description: "Exposure lookback window." },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 25, default: 5 }, description: "Maximum related securities to return." },
        ]),
        ...jsonFactorResponse("RelatedSecurityList"),
      },
    },
    "/v1/factors/similarity-pack": {
      get: {
        summary: "Return a custom thematic similarity pack that combines factor-overlap peers with deterministic filing/news signatures and naming workflow metadata",
        parameters: factorResponseParams([
          { name: "symbol", in: "query", required: true, schema: { type: "string" }, description: "Anchor ticker symbol. `ticker` is accepted as an alias; `symbols` can also provide the anchor as its first item." },
          { name: "symbols", in: "query", schema: { type: "string" }, description: "Comma-separated anchor and optional candidate symbols. The first symbol is used as the anchor when symbol is omitted." },
          { name: "candidates", in: "query", schema: { type: "string" }, description: "Optional comma-separated candidate universe." },
          { name: "lookback", in: "query", schema: { type: "string", default: "6m" }, description: "Exposure and context lookback window." },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 25, default: 5 }, description: "Maximum peers to return." },
        ]),
        ...jsonFactorResponse("FactorSimilarityPack"),
      },
    },
    "/v1/factors/pairs": {
      get: {
        summary: "Return pairwise factor spread data including cumulative spread, average, volatility, and daily series for two specified factors",
        parameters: factorResponseParams([
          { name: "factor1", in: "query", required: true, schema: { type: "string" }, description: "First factor key. The shorter f1 alias is also accepted at runtime." },
          { name: "factor2", in: "query", required: true, schema: { type: "string" }, description: "Second factor key. The shorter f2 alias is also accepted at runtime." },
          { name: "f1", in: "query", schema: { type: "string" }, description: "Runtime alias for factor1." },
          { name: "f2", in: "query", schema: { type: "string" }, description: "Runtime alias for factor2." },
          { name: "window", in: "query", schema: { type: "string", default: "1m" }, description: "Rolling spread window." },
          { name: "lookback", in: "query", schema: { type: "string", default: "6m" }, description: "History lookback used to compute the spread." },
        ]),
        ...jsonFactorResponse("FactorPairSpreadList"),
      },
    },
    "/v1/factors/pair-history/{f1}/{f2}": {
      get: {
        summary: "Return historical spread between two specific factors identified by path parameters with windowed series data",
        parameters: factorResponseParams([
          { name: "f1", in: "path", required: true, schema: { type: "string" }, description: "First factor key." },
          { name: "f2", in: "path", required: true, schema: { type: "string" }, description: "Second factor key." },
          { name: "window", in: "query", schema: { type: "string", default: "1m" }, description: "Rolling spread window." },
          { name: "lookback", in: "query", schema: { type: "string", default: "6m" }, description: "History lookback used to compute the spread." },
        ]),
        ...jsonFactorResponse("FactorPairSpreadList"),
      },
    },
    "/v1/factors/bulk-download": {
      get: {
        summary: "Return available factor returns data in bulk with daily series for commercial plan bulk-download workflows",
        parameters: factorResponseParams([
          { name: "factors", in: "query", schema: { type: "string" }, description: "Required unless category is provided. Comma-separated factor keys or aliases." },
          { name: "keys", in: "query", schema: { type: "string" }, description: "Alias for factors. Required unless category is provided." },
          { name: "category", in: "query", schema: { type: "string" }, description: "Required unless factors or keys is provided. Optional launch factor category filter." },
          { name: "window", in: "query", schema: { type: "string", default: "1m" }, description: "Return window for summary fields." },
          { name: "lookback", in: "query", schema: { type: "string", default: "12m" }, description: "History lookback for returned series." },
          { name: "format", in: "query", schema: { type: "string", enum: ["json", "csv"], default: "json" }, description: "Return JSON by default or a long-table CSV export with one row per factor/date." },
        ], { responseModeDefault: "standard" }),
        ...jsonFactorResponseWithCsv("FactorBulkReturnList"),
      },
    },
    "/v1/factors/custom": {
      post: {
        summary: "Discover a custom thematic factor pack from factor-overlap peers plus deterministic filing/news signatures",
        parameters: factorResponseParams(),
        ...jsonRequestBody("FactorCustomDiscoveryRequest"),
        ...jsonFactorResponse("FactorSimilarityPack"),
      },
    },
    "/v1/portfolio/analyze": {
      post: {
        summary: "Return factor exposures, attribution, and hedge suggestions for a portfolio in one deterministic response",
        parameters: factorResponseParams(),
        ...jsonRequestBody("PortfolioIntelligenceRequest"),
        ...jsonFactorResponse("PortfolioAnalysis"),
      },
    },
    "/v1/portfolio/attribution": {
      post: {
        summary: "Return factor return attribution for a portfolio with explained return, alpha, and compact contribution rows",
        parameters: factorResponseParams(),
        ...jsonRequestBody("PortfolioAttributionRequest"),
        ...jsonFactorResponse("PortfolioAttribution"),
      },
    },
    "/v1/model-portfolios/{portfolioId}/factor-view": {
      get: {
        summary: "Return a model-portfolio factor view with aggregate analysis and per-position exposures for drill-down workflows",
        parameters: factorResponseParams([
          { name: "portfolioId", in: "path", required: true, schema: { type: "string" }, description: "Saved model portfolio identifier." },
        ]),
        ...jsonFactorResponse("ModelPortfolioFactorView"),
      },
    },
    "/v1/models/factor-analysis": {
      post: {
        summary: "Return model factor analysis for submitted Model Builder or saved-model holdings with optional attribution, hedge, and optimizer sections",
        parameters: factorResponseParams(),
        ...jsonRequestBody("ModelFactorAnalysisRequest"),
        ...jsonFactorResponse("ModelFactorAnalysis"),
      },
    },
    "/v1/portfolio/stress-test": {
      post: {
        summary: "Run portfolio stress scenarios across factor and macro shock definitions with compact traceable outputs",
        parameters: factorResponseParams(),
        ...jsonRequestBody("PortfolioStressTestRequest"),
        ...jsonFactorResponse("PortfolioStressTest"),
      },
    },
    "/v1/portfolio/hedge": {
      post: {
        summary: "Return bounded benchmark-instrument factor hedge candidates for a portfolio with compact residual exposure and trust metadata",
        parameters: factorResponseParams(),
        ...jsonRequestBody("PortfolioHedgeRequest"),
        ...jsonFactorResponse("PortfolioHedge"),
      },
    },
    "/v1/portfolio/optimize": {
      post: {
        summary: "Return bounded factor-aware optimizer scenario candidates for factor-neutral, min-drawdown, or regime-aware objectives",
        parameters: factorResponseParams(),
        ...jsonRequestBody("PortfolioOptimizeRequest"),
        ...jsonFactorResponse("PortfolioAnalysis"),
      },
    },
    "/v1/strategies/factor-rotation": {
      post: {
        summary: "Return factor-rotation recommendations informed by macro regime context and factor state",
        parameters: factorResponseParams(),
        ...jsonRequestBody("FactorStrategyRequest"),
        ...jsonFactorResponse("FactorRotationStrategy"),
      },
    },
    "/v1/strategies/regime-screen": {
      post: {
        summary: "Return regime-aware security screens with factor, macro, and filing-aware filters",
        parameters: factorResponseParams(),
        ...jsonRequestBody("FactorStrategyRequest"),
        ...jsonFactorResponse("FactorRegimeScreen"),
      },
    },
    "/v1/intelligence/query": {
      post: {
        summary: "Compile an allocator prompt into a deterministic one-call intelligence workload with compact traced output",
        ...jsonRequestBody("IntelligenceQueryRequest"),
        responses: {
          "200": {
            description: "Synchronous intelligence query result",
            content: jsonContent("IntelligenceQueryResponse"),
          },
          "202": {
            description: "Queued async intelligence query job",
            content: jsonContent("IntelligenceQueryJob"),
          },
        },
      },
    },
    "/v1/intelligence/query/{jobId}": {
      get: {
        summary: "Poll an async intelligence workload until the final traced result is ready",
        responses: {
          "200": {
            description: "Completed intelligence query result",
            content: jsonContent("IntelligenceQueryResponse"),
          },
          "202": {
            description: "Still-running intelligence query job",
            content: jsonContent("IntelligenceQueryJob"),
          },
        },
      },
    },
    "/v1/intelligence/security": {
      get: {
        summary: "Return a one-call security bundle with snapshot, catalysts, filings, and factor context",
        ...jsonResponse("SecurityIntelligenceBundle"),
      },
    },
    "/v1/intelligence/company": {
      get: {
        summary: "Return a one-call company bundle spanning market, filings, ownership, macro, factor, and risk context",
        ...jsonResponse("CompanyIntelligenceBundle"),
      },
    },
    "/v1/intelligence/earnings-preview": {
      get: {
        summary: "Return an earnings preview bundle with estimates, drivers, risks, and traceable supporting context",
        ...jsonResponse("EarningsPreviewBundle"),
      },
    },
    "/v1/intelligence/portfolio": {
      post: {
        summary: "Return a one-call portfolio intelligence bundle with exposures, stress scenarios, events, and hedge ideas",
        ...jsonRequestBody("PortfolioIntelligenceRequest"),
        ...jsonFactorResponse("PortfolioAnalysis"),
      },
    },
    "/v1/intelligence/watchlist": {
      post: {
        summary: "Return a watchlist briefing bundle with movers, catalysts, factor context, and regime overlays",
        ...jsonRequestBody("WatchlistIntelligenceRequest"),
        ...jsonResponse("WatchlistIntelligenceBundle"),
      },
    },
    "/v1/intelligence/country-report": {
      post: {
        summary: "Return a country intelligence bundle covering the prior period's macro path, likely drivers, and forward view",
        ...jsonRequestBody("CountryReportRequest"),
        ...jsonResponse("CountryReport"),
      },
    },
    "/v1/intelligence/footnotes/query": {
      post: {
        summary: "Return a structured filing-footnote investigation bundle for lease, tax, revenue, covenant, and segment-note workflows",
        ...jsonRequestBody("FootnoteIntelligenceRequest"),
        ...jsonResponse("FootnoteIntelligenceResult"),
      },
    },
    "/v1/signals/volatility": {
      get: { summary: "Return the SEC API volatility score with transparent factor breakdown and freshness metadata" },
    },
    "/v1/signals/dilution": {
      get: {
        summary:
          "Return the SEC API Dilution Score: factor-weighted 0-100 derived metric with sub-ratings, percentile, and optional rolling history",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker. Either ticker or cik is required." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Issuer CIK (10-digit zero-padded). Either ticker or cik is required." },
          { name: "history", in: "query", required: false, schema: { type: "string", enum: ["30d", "90d", "1y"] }, description: "Optional rolling-history window for the score timeseries." },
          { name: "view", in: "query", required: false, schema: { type: "string", enum: ["default", "compact", "agent"] }, description: "Response shape. agent drops the factor breakdown for token efficiency." },
        ],
        ...jsonResponse("DilutionScore"),
      },
    },
    "/v1/signals/dilution/enhanced": {
      get: {
        summary:
          "Return the SEC API Dilution Score augmented with factor-model context (macro liquidity regime, momentum exposure, short-interest placeholder)",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker. Either ticker or cik is required." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Issuer CIK (10-digit zero-padded). Either ticker or cik is required." },
          { name: "view", in: "query", required: false, schema: { type: "string", enum: ["default", "compact", "agent"] }, description: "Response shape. agent drops the factor breakdown for token efficiency." },
        ],
        ...jsonResponse("DilutionScoreEnhanced"),
      },
    },
    "/v1/facts": {
      get: { summary: "Return normalized SEC company facts for an issuer, concept, and optional form or unit" },
    },
    "/v1/statements": {
      get: {
        summary: "Return a normalized statement backed by SEC company facts",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker. Either ticker or cik is required." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Issuer CIK. Either ticker or cik is required." },
          { name: "statement", in: "query", required: false, schema: { type: "string" }, description: "Statement key such as income_statement, balance_sheet, or cash_flow_statement." },
          { name: "period", in: "query", required: false, schema: { type: "string", enum: ["annual", "quarterly"] } },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 40 } },
          { name: "view", in: "query", required: false, schema: { type: "string", enum: ["default", "compact", "agent"] }, description: "Use compact for period-indexed row arrays. Default and agent preserve statement value provenance." },
        ],
        responses: {
          "200": {
            description: "Successful response. view=compact returns CompactStatement; view=agent returns StatementAgentRecord; default returns Statement.",
            content: {
              "application/json": {
                schema: {
                  oneOf: [schemaRef("Statement"), schemaRef("CompactStatement"), schemaRef("StatementAgentRecord")],
                },
              },
            },
          },
        },
      },
    },
    "/v1/statements/all": {
      get: {
        summary: "Return the balance sheet, income statement, and cash flow statement as one normalized bundle",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker. Either ticker or cik is required." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Issuer CIK. Either ticker or cik is required." },
          { name: "period", in: "query", required: false, schema: { type: "string", enum: ["annual", "quarterly"] } },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 40 } },
        ],
        ...jsonResponse("StatementBundle"),
      },
    },
    "/v1/statements/{statement_key}": {
      get: {
        summary: "Return a specific normalized statement keyed by statement type",
        parameters: [
          { name: "statement_key", in: "path", required: true, schema: { type: "string" }, description: "Statement key such as income_statement, balance_sheet, or cash_flow_statement." },
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker. Either ticker or cik is required." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Issuer CIK. Either ticker or cik is required." },
          { name: "period", in: "query", required: false, schema: { type: "string", enum: ["annual", "quarterly"] } },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 40 } },
          { name: "view", in: "query", required: false, schema: { type: "string", enum: ["default", "compact", "agent"] }, description: "Use compact for period-indexed row arrays. Default and agent preserve statement value provenance." },
        ],
        responses: {
          "200": {
            description: "Successful response. view=compact returns CompactStatement; view=agent returns StatementAgentRecord; default returns Statement.",
            content: {
              "application/json": {
                schema: {
                  oneOf: [schemaRef("Statement"), schemaRef("CompactStatement"), schemaRef("StatementAgentRecord")],
                },
              },
            },
          },
        },
      },
    },
    "/v1/companies/income-statements": {
      get: {
        summary: "Return SEC XBRL-derived income statements for a ticker with EBITDA and share-count enrichment",
        parameters: [
          { name: "ticker", in: "query", required: true, schema: { type: "string" } },
          { name: "period", in: "query", required: false, schema: { type: "string", enum: ["annual", "quarterly"] } },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 40 } },
          { name: "view", in: "query", required: false, schema: { type: "string", enum: ["compact"] }, description: "Use compact for period-indexed row arrays. Omit for the enriched company income-statement envelope." },
        ],
        responses: {
          "200": {
            description: "Successful response. view=compact returns CompactStatement; default returns CompanyIncomeStatements.",
            content: { "application/json": { schema: { oneOf: [schemaRef("CompanyIncomeStatements"), schemaRef("CompactStatement")] } } },
          },
        },
      },
    },
    "/v1/companies/balance-sheets": {
      get: {
        summary: "Return SEC XBRL-derived balance sheets for a ticker with normalized debt, equity, and cash fields",
        parameters: [
          { name: "ticker", in: "query", required: true, schema: { type: "string" } },
          { name: "period", in: "query", required: false, schema: { type: "string", enum: ["annual", "quarterly"] } },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 40 } },
          { name: "view", in: "query", required: false, schema: { type: "string", enum: ["compact"] }, description: "Use compact for period-indexed row arrays. Omit for the enriched company balance-sheet envelope." },
        ],
        responses: {
          "200": {
            description: "Successful response. view=compact returns CompactStatement; default returns CompanyBalanceSheets.",
            content: { "application/json": { schema: { oneOf: [schemaRef("CompanyBalanceSheets"), schemaRef("CompactStatement")] } } },
          },
        },
      },
    },
    "/v1/companies/cash-flow-statements": {
      get: {
        summary: "Return SEC XBRL-derived cash flow statements for a ticker with free-cash-flow and dividend enrichment",
        parameters: [
          { name: "ticker", in: "query", required: true, schema: { type: "string" } },
          { name: "period", in: "query", required: false, schema: { type: "string", enum: ["annual", "quarterly"] } },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 40 } },
          { name: "view", in: "query", required: false, schema: { type: "string", enum: ["compact"] }, description: "Use compact for period-indexed row arrays. Omit for the enriched company cash-flow envelope." },
        ],
        responses: {
          "200": {
            description: "Successful response. view=compact returns CompactStatement; default returns CompanyCashFlowStatements.",
            content: { "application/json": { schema: { oneOf: [schemaRef("CompanyCashFlowStatements"), schemaRef("CompactStatement")] } } },
          },
        },
      },
    },
    "/v1/companies/financials": {
      get: {
        summary: "Return combined SEC XBRL-derived income, balance-sheet, and cash-flow statements for a ticker",
        ...jsonResponse("CompanyFinancials"),
      },
    },
    "/v1/companies/ratios": {
      get: {
        summary: "Return profitability, return, valuation, dividend, and leverage ratios derived from SEC XBRL statements plus market context",
        ...jsonResponse("CompanyRatios"),
      },
    },
    "/v1/owners/13f": {
      get: { summary: "Return the latest normalized 13F ownership report for a manager CIK, with optional quarter-specific selection" },
    },
    "/v1/owners/institutional/investor": {
      get: { summary: "Return an investor-centric institutional ownership graph for a manager CIK, including ranked holdings and quarter-over-quarter changes" },
    },
    "/v1/owners/institutional/extract": {
      get: { summary: "Return a quarter-specific historical institutional ownership extract for a manager CIK over the SEC-native 13F family" },
    },
    "/v1/owners/institutional/ticker": {
      get: { summary: "Return a ticker-centric institutional holder graph for the latest materialized 13F cohort, ranked by disclosed position value" },
    },
    "/v1/owners/13f/filings": {
      get: { summary: "List recent 13F filings, including quarter-end report dates, for a manager CIK" },
    },
    "/v1/owners/13d-13g": {
      get: { summary: "List beneficial ownership reports across the SEC-native 13D and 13G filing families" },
    },
    "/v1/owners/13f/compare": {
      post: { summary: "Compare the latest two 13F ownership reports for a manager CIK" },
    },
    "/v1/insiders": {
      get: { summary: "Return recent normalized insider trading records derived from Forms 3, 4, and 5 with date filters and cursor pagination" },
    },
    "/v1/compensation": {
      get: { summary: "Return normalized executive compensation records derived from the latest DEF 14A filing" },
    },
    "/v1/compensation/compare": {
      post: { summary: "Compare the latest two executive compensation disclosures for an issuer" },
    },
    "/v1/artifacts": {
      get: { summary: "List canonical artifacts for the current organization" },
      post: { summary: "Create and persist a derived artifact bundle" },
    },
    "/v1/artifacts/summary": {
      get: { summary: "Return artifact lifecycle counts by kind, status, and storage mode" },
    },
    "/v1/artifacts/{artifact_id}": {
      get: { summary: "Fetch persisted artifact metadata" },
    },
    "/v1/artifacts/{artifact_id}/manifest": {
      get: { summary: "Fetch the structured manifest for a persisted artifact" },
    },
    "/v1/artifacts/{artifact_id}/export": {
      get: { summary: "Export an artifact as structured JSON or a markdown-oriented download envelope" },
    },
    "/v1/artifacts/{artifact_id}/download": {
      get: { summary: "Download or redirect to the persisted artifact payload" },
    },
    "/v1/artifacts/{artifact_id}/reconcile": {
      post: { summary: "Reconcile artifact metadata with object storage and upload if needed" },
    },
    "/v1/search/fulltext": {
      get: {
        summary: "Full-text search across filing content and section text via Typesense",
        parameters: [
          { name: "q", in: "query", required: true, schema: { type: "string" }, description: "Search query" },
          { name: "ticker", in: "query", schema: { type: "string" } },
          { name: "cik", in: "query", schema: { type: "string" } },
          { name: "form", in: "query", schema: { type: "string" } },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 25 } },
        ],
      },
    },
    "/v1/search/semantic": {
      get: {
        summary: "Semantic vector search across SEC filing section content via Voyage AI + Pinecone, with hybrid keyword + vector RRF and citation fields on every result row",
        parameters: [
          { name: "q", in: "query", required: true, schema: { type: "string" }, description: "Search query" },
          { name: "mode", in: "query", schema: { type: "string", enum: ["keyword", "semantic", "hybrid"] }, description: "Retrieval mode (default hybrid)" },
          { name: "ticker", in: "query", schema: { type: "string" } },
          { name: "cik", in: "query", schema: { type: "string" } },
          { name: "form", in: "query", schema: { type: "string" } },
          { name: "filing_year", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100 } },
          { name: "view", in: "query", schema: { type: "string", enum: ["default", "agent"] }, description: "Pass `agent` to drop score and retrievalMode while preserving citation fields" },
        ],
      },
    },
    "/v1/advisers": {
      get: {
        summary: "Search SEC Form ADV investment adviser filings by name, CIK, or state",
        parameters: [
          { name: "query", in: "query", schema: { type: "string" }, description: "Adviser name or keyword" },
          { name: "cik", in: "query", schema: { type: "string" } },
          { name: "state", in: "query", schema: { type: "string" } },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 50 } },
        ],
      },
    },
    "/v1/market/financials": {
      get: {
        summary: "Financial statements (income, balance sheet, cash flow) for a ticker via MASSIVE/Polygon",
        parameters: [
          { name: "ticker", in: "query", required: true, schema: { type: "string" } },
          { name: "timeframe", in: "query", schema: { type: "string", enum: ["annual", "quarterly"] } },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100 } },
        ],
      },
    },
    "/v1/market/search": {
      get: {
        summary: "Search for stock tickers by company name or keyword",
        parameters: [
          { name: "q", in: "query", required: true, schema: { type: "string" } },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 50 } },
        ],
      },
    },
    "/v1/market/estimates": {
      get: {
        summary: "Return analyst consensus ratings and price-target estimates for a ticker via Massive/Benzinga",
        parameters: [
          { name: "ticker", in: "query", required: true, schema: { type: "string" } },
          { name: "date_from", in: "query", schema: { type: "string", format: "date" } },
          { name: "date_to", in: "query", schema: { type: "string", format: "date" } },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 50 } },
        ],
      },
    },
    "/v1/filings/{accession_number}/download": {
      get: { summary: "Redirect to the SEC EDGAR source document for a filing by accession number" },
    },
    "/v1/filings/{accession_number}/export": {
      get: {
        summary: "Export a filing as JSON, Markdown, CSV, XLSX, DOCX, or PDF",
        parameters: [
          {
            name: "format",
            in: "query",
            schema: { type: "string", enum: ["json", "markdown", "csv", "xlsx", "docx", "pdf"] },
            description: "Export format; defaults to json when omitted",
          },
          { name: "ticker", in: "query", schema: { type: "string" } },
          { name: "cik", in: "query", schema: { type: "string" } },
          { name: "form", in: "query", schema: { type: "string" } },
        ],
      },
    },
    "/mcp": {
      post: { summary: "Hosted MCP transport endpoint" },
    },
    // ----- Dilution domain (OMNI-3071 stubs; handlers land in OMNI-3089) -----
    "/v1/dilution/events": {
      get: {
        summary: "List dilution events (S-1, 424B*, FWP, S-3 offerings) with filters by ticker, form, date, and is_atm",
        ...jsonResponse("DilutionEventList"),
      },
    },
    "/v1/dilution/events/{event_id}": {
      get: {
        summary: "Retrieve a single dilution event with verification block, warrants, and convertibles linkage",
        parameters: [
          { name: "event_id", in: "path", required: true, schema: { type: "string" } },
        ],
        ...jsonResponse("DilutionEvent"),
      },
    },
    "/v1/dilution/warrants": {
      get: {
        summary: "List warrant schedules parsed from offering exhibits with price-protection and ratchet clauses",
        ...jsonResponse("DilutionWarrantList"),
      },
    },
    "/v1/dilution/convertibles": {
      get: {
        summary: "List convertible debt schedules with conversion price, maturity, and ratchet metadata",
        ...jsonResponse("DilutionConvertibleList"),
      },
    },
    "/v1/dilution/rofr": {
      get: {
        summary: "List right-of-first-refusal and tail-financing clauses parsed from underwriter agreements",
        ...jsonResponse("DilutionRofrList"),
      },
    },
    "/v1/dilution/lockups": {
      get: {
        summary: "List lockup schedules with start/end dates, parties, and conditions",
        ...jsonResponse("DilutionLockupList"),
      },
    },
    "/v1/dilution/nasdaq-compliance": {
      get: {
        summary: "List Nasdaq deficiency notices with status and remediation tracking",
        ...jsonResponse("DilutionNasdaqComplianceList"),
      },
    },
    "/v1/dilution/reverse-splits": {
      get: {
        summary: "List reverse-stock-split actions with execution date and ratio",
        ...jsonResponse("DilutionReverseSplitList"),
      },
    },
    "/v1/dilution/cash-position": {
      get: {
        summary: "Cash runway, burn, and management commentary computed from quarterly filings",
        ...jsonResponse("DilutionCashPositionList"),
      },
    },
    "/v1/dilution/corporate-actions": {
      get: {
        summary: "List dilution-relevant corporate actions: ticker changes, exchange moves, de-SPAC closings, splits",
        ...jsonResponse("DilutionCorporateActionList"),
      },
    },
    "/v1/dilution/ratings": {
      get: {
        summary: "Composite Dilution Score with sub-factors (offering ability, historical, cash need, warrant exercise risk)",
        ...jsonResponse("DilutionRatingList"),
      },
    },
    "/v1/dilution/share-float-history": {
      get: {
        summary: "Historical shares outstanding and public float series materialized from filings",
        ...jsonResponse("DilutionShareFloatHistoryList"),
      },
    },
    "/v1/dilution/score": {
      get: {
        summary: "Per-issuer Dilution Score with explanation and source events (alias of latest rating; ticker query parameter required)",
        parameters: [
          { name: "ticker", in: "query", required: true, schema: { type: "string" }, description: "Ticker symbol (required). Returns the latest dilution rating for this issuer." },
        ],
        ...jsonResponse("DilutionRating"),
      },
    },
    "/v1/dilution/coverage": {
      get: {
        summary: "Dilution-domain coverage and freshness summary across forms, tickers, and verification status",
        parameters: [
          { name: "ticker", in: "query", schema: { type: "string" }, description: "Optional ticker scope. When present, counts and freshness are restricted to rows for that issuer." },
        ],
        ...jsonResponse("DilutionCoverage"),
      },
    },
  },
} as const
