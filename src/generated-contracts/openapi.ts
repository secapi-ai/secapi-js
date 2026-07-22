/**
 * AUTO-GENERATED paths and metadata merged with Zod-derived component schemas.
 * Do not edit the generated output (openapi.generated.json) directly.
 * Run `bun run contract:openapi` to regenerate, then `bun run contract:verify` to check for drift.
 */

const schemaRef = (name: string) => ({ $ref: `#/components/schemas/${name}` })

const objectExampleBySchema: Record<string, string> = {}

const exampleAsOf = "2026-06-09T22:15:00.000Z"
const exampleSnapshotAt = "2026-06-09T19:45:00.000Z"
const exampleDataDate = "2026-06-09"
const exampleResearchScenarioDisclosures = ["Research scenario only. Not investment advice or a recommendation to trade."]

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
  // Explicit per-row symbol attribution for batched `?symbols=A,B,C` reads: echoes
  // the request ticker for security rows (null for portfolio/watchlist subjects).
  symbol: "AAPL",
  factorKey: "VALUE",
  beta: -0.42,
  percentile: 18.2,
  confidence: "high",
  modelName: "secapi_stock_basket_factor_model_v1",
  asOf: exampleAsOf,
  responseMode: "compact",
  expansionHints: ["Use include=diagnostics or response_mode=standard for regression diagnostics such as rSquared, tStat, and observationCount."],
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
  disclosures: exampleResearchScenarioDisclosures,
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
  disclosures: exampleResearchScenarioDisclosures,
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
  summaryMd: "The hedge candidate reduces negative VALUE beta while keeping total hedge weight under 20%.",
  disclosures: exampleResearchScenarioDisclosures,
  responseMode: "compact",
  ...exampleTrustMetadata,
  methodologyVersion: "secapi_portfolio_hedge_v1",
}

const responseExampleBySchema: Record<string, unknown> = {
  MacroHighSignalPack: {
    object: "macro_high_signal_pack",
    id: "macro_high_signal_pack_US",
    asOf: exampleAsOf,
    country: "US",
    ring: "launch_ring_1",
    responseMode: "compact",
    seriesCount: 32,
    series: [
      {
        indicatorKey: "US_CPI_ALL_ITEMS",
        label: "CPI (All Items)",
        frequency: "monthly",
        sourceKey: "fred",
        sourceLabel: "Federal Reserve (FRED)",
        dataset: "CPIAUCSL",
        seriesCode: "CPIAUCSL",
        coverageState: "live",
        canonicality: "official",
        fallbackPolicy: "none",
        latest: {
          period: "2026-05-01",
          value: 321.5,
          unit: "index",
          asOf: exampleAsOf,
          freshnessStatus: "fresh",
        },
        upcomingRelease: {
          scheduledAt: "2026-07-12T13:30:00.000Z",
          status: "scheduled",
          actual: null,
          prior: 321.5,
          consensus: 322,
          surprise: null,
        },
        forecast: {
          horizon: "1m",
          value: 322.1,
          intervalLow: 321,
          intervalHigh: 323,
          scenario: "baseline",
        },
      },
    ],
    regime: null,
    summaryMd: "US launch-ring high-signal macro pack includes 32 official-source or harmonized series with explicit fallback and release-calendar posture.",
    expansionHints: ["Use include=series to return full nested observations, releases, forecasts, source plans, and trust metadata."],
    requestId: "req_example",
  },
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
        responseMode: "compact",
        expansionHints: ["Use include=trust for launchReadiness, qualityProof, provenance, source rights, methodology, and revision metadata."],
      },
    ],
    hasMore: false,
    nextCursor: null,
    categories: ["market", "style", "sector", "industry"],
    requestId: "req_example",
    traceparent: "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01",
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
  PortfolioRisk: {
    object: "portfolio_risk",
    asOf: exampleAsOf,
    lookback: "6m",
    benchmarkLabel: "S&P 500 (SPY proxy)",
    trackingError: 0.0412,
    totalRisk: 0.1783,
    exAnteBeta: 1.06,
    factorRiskShare: 0.71,
    specificRiskShare: 0.29,
    factorGroups: [
      { object: "portfolio_factor_group_risk", group: "style", label: "Style", activeExposure: 0.18, ctevShare: 0.42, ctev: 0.0173, shorterHistory: false },
      { object: "portfolio_factor_group_risk", group: "sector", label: "Sector", activeExposure: -0.07, ctevShare: 0.29, ctev: 0.012, shorterHistory: false },
      { object: "portfolio_factor_group_risk", group: "macro", label: "Macro", activeExposure: 0.03, ctevShare: 0, ctev: 0, shorterHistory: true },
    ],
    factorExposures: [
      { object: "portfolio_factor_exposure_risk", factorKey: "MOMENTUM", factorName: "Momentum", group: "style", portfolioBeta: 0.22, benchmarkBeta: 0.05, activeBeta: 0.17, ctevShare: 0.31, ctev: 0.0128, shorterHistory: false },
      { object: "portfolio_factor_exposure_risk", factorKey: "VALUE", factorName: "Value", group: "style", portfolioBeta: -0.11, benchmarkBeta: 0.02, activeBeta: -0.13, ctevShare: 0.18, ctev: 0.0074, shorterHistory: false },
    ],
    securities: [
      { object: "portfolio_security_risk", symbol: "NVDA", weight: 0.12, modeled: true, activeWeight: 0.09, specificVol: 0.28, ctevShare: 0.14, ctev: 0.0058, note: null },
      { object: "portfolio_security_risk", symbol: "PRIVATECO", weight: 0.03, modeled: false, activeWeight: 0.03, specificVol: 0.35, ctevShare: 0.04, ctev: 0.0016, note: "Outside the ~4k US factor plane — beta-only / specific-risk-floor treatment." },
    ],
    coverage: {
      object: "portfolio_risk_coverage",
      modeledWeight: 0.94,
      modeledHoldings: 18,
      unmodeledHoldings: 1,
      unmodeledSymbols: ["PRIVATECO"],
      totalHoldings: 19,
      covarianceObservations: 156,
      covarianceEstimable: true,
    },
    disclosures: [
      "Ex-ante risk uses an EWMA factor covariance (~2y half-life, weekly) over the style/sector/industry factor plane (2015→).",
      "Model coverage: 94% of portfolio NAV is inside the ~4k US factor plane. Unmodelled names use a beta-only / specific-risk-floor treatment.",
      "Macro-factor covariance only reaches 2022; macro figures are labelled shorter-history and excluded from the P0 covariance basis.",
    ],
    summaryMd: "Ex-ante tracking error is 4.12% (annualised active risk); 71% factor / 29% specific.",
    responseMode: "compact",
    ...exampleTrustMetadata,
  },
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
    summaryMd: "Research scenario tilts toward value and momentum while low volatility trails in the current regime.",
    disclosures: exampleResearchScenarioDisclosures,
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
  PortfolioRiskRequest: {
    country: "US",
    lookback: "6m",
    category: "style",
    keys: ["VALUE", "MOMENTUM", "QUALITY"],
    holdings: exampleHoldings,
    benchmark: "SPY",
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
  "PortfolioAnalysis",
  "PortfolioAttribution",
  "PortfolioHedge",
  "PortfolioRisk",
  "PortfolioStressTest",
  "ModelPortfolioFactorView",
  "ModelFactorAnalysis",
  "FactorRotationStrategy",
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

const jsonResponseOneOf = (names: string[], description = "Successful response") => ({
  responses: {
    "200": {
      description,
      content: {
        "application/json": {
          schema: { oneOf: names.map((name) => schemaRef(name)) },
        },
      },
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

const filingsIntelligenceUnavailableResponse = () => ({
  responses: {
    "404": {
      description: "The filings-intelligence plane is currently disabled (filings_intelligence_not_available).",
      content: {
        "application/json": {
          schema: schemaRef("Error"),
          examples: {
            unavailable: {
              summary: "Filings intelligence is not enabled",
              value: {
                object: "error",
                id: "err_example",
                code: "filings_intelligence_not_available",
                type: "invalid_request_error",
                message: "The filings-intelligence plane is not enabled.",
                requestId: "req_example",
                details: {},
              },
            },
          },
        },
      },
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

const inlineJsonRequestBody = (schema: Record<string, unknown>, value: Record<string, unknown>, description?: string) => ({
  requestBody: {
    required: true,
    ...(description ? { description } : {}),
    content: {
      "application/json": {
        schema,
        examples: {
          default: {
            summary: "Copy-pasteable request",
            value,
          },
        },
      },
    },
  },
})

const inlineJsonResponse = (
  schema: Record<string, unknown>,
  value: Record<string, unknown>,
  description = "Successful response",
  status = "200",
) => ({
  responses: {
    [status]: {
      description,
      content: {
        "application/json": {
          schema,
          examples: {
            default: {
              summary: "Example response",
              value,
            },
          },
        },
      },
    },
  },
})

const billingRatesResponseSchema = {
  type: "object",
  additionalProperties: true,
  required: ["object", "requestId", "version", "starterGrant", "plans"],
  properties: {
    object: { type: "string", const: "pricing_catalog" },
    requestId: { type: "string" },
    version: { type: "string" },
    starterGrant: {
      type: "object",
      additionalProperties: true,
      required: ["object", "planKey", "billingState", "calls", "renewable", "overflowPlanKey"],
      properties: {
        object: { type: "string", const: "starter_grant" },
        planKey: { type: "string", const: "sandbox_grant" },
        billingState: { type: "string", const: "sandbox_grant" },
        calls: { type: "integer" },
        renewable: { type: "boolean" },
        period: { type: ["string", "null"] },
        overflowPlanKey: { type: "string" },
        note: { type: "string" },
      },
    },
    plans: { type: "array", items: { type: "object", additionalProperties: true } },
  },
}

const billingRatesResponseExample = {
  object: "pricing_catalog",
  requestId: "req_example_123",
  version: "2026-06-18",
  starterGrant: {
    object: "starter_grant",
    planKey: "sandbox_grant",
    billingState: "sandbox_grant",
    calls: 150,
    renewable: false,
    period: null,
    overflowPlanKey: "payg",
    note: "New organizations start on the starter grant; usage beyond the grant falls through to Pay As You Go rates once billing is activated.",
  },
  plans: [
    {
      key: "payg",
      displayName: "Pay As You Go",
      kind: "metered",
      meterFamilyPrices: [
        {
          key: "standard_reads",
          unitAmountUsd: 0.02,
        },
      ],
    },
  ],
}

const createApiKeyRequestSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: ["string", "null"] },
  },
}

const createApiKeyResponseSchema = {
  type: "object",
  additionalProperties: false,
  required: ["object", "id", "createdAt", "livemode", "orgId", "label", "keyPrefix", "scopes", "status", "lastUsedAt", "secret"],
  properties: {
    object: { type: "string", const: "api_key" },
    id: { type: "string" },
    createdAt: { type: "string" },
    livemode: { type: "boolean" },
    orgId: { type: "string" },
    label: { type: ["string", "null"] },
    keyPrefix: { type: "string" },
    scopes: { type: "array", items: { type: "string" } },
    status: { type: "string", enum: ["active", "revoked"] },
    lastUsedAt: { type: ["string", "null"] },
    secret: { type: "string" },
  },
}

const createApiKeyResponseExample = {
  object: "api_key",
  id: "key_123",
  createdAt: "2026-06-27T21:00:00.000Z",
  livemode: false,
  orgId: "org_123",
  label: "local-dev",
  keyPrefix: "secapi_live_abcd",
  scopes: ["read:sec"],
  status: "active",
  lastUsedAt: null,
  secret: "secapi_live_abcd...copy_this_once",
}

const webhookEndpointRequestSchema = {
  type: "object",
  additionalProperties: false,
  required: ["destinationUrl"],
  properties: {
    destinationUrl: { type: "string", format: "uri", description: "Public HTTPS endpoint URL. Self-serve endpoints must use default HTTPS port 443." },
    description: { type: ["string", "null"] },
    subscribedEventTypes: { type: "array", items: { type: "string" }, description: "Delivery event types from GET /v1/event_types. Supports exact event names, `*`, and namespace wildcards such as `monitor.*`." },
    livemode: { type: "boolean", default: false },
  },
}

const webhookEndpointUpdateRequestSchema = {
  type: "object",
  additionalProperties: false,
  minProperties: 1,
  properties: {
    destinationUrl: { type: "string", format: "uri" },
    description: { type: ["string", "null"] },
    subscribedEventTypes: { type: "array", items: { type: "string" } },
    status: { type: "string", enum: ["active", "disabled"] },
  },
}

const webhookEndpointTestRequestSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventType: { type: "string", const: "webhook.test", default: "webhook.test" },
    data: { type: "object", additionalProperties: true },
  },
}

const webhookEndpointExample = {
  object: "webhook_endpoint",
  id: "wh_2ZK8Q1W9F4M6P7R3",
  createdAt: "2026-06-25T15:00:00.000Z",
  updatedAt: "2026-06-25T15:00:00.000Z",
  livemode: false,
  orgId: "org_example_123",
  description: "Production monitor matches",
  destinationUrl: "https://example.com/hooks/secapi",
  subscribedEventTypes: ["monitor.match", "webhook.test"],
  status: "active",
  lastDeliveredAt: null,
}

const webhookEndpointCreateExample = {
  ...webhookEndpointExample,
  signingSecret: "whsec_example_reveal_once_on_create_or_rotate",
}

const webhookEndpointResponseSchema = {
  allOf: [schemaRef("WebhookEndpoint")],
  additionalProperties: true,
}

const webhookEndpointListResponseSchema = {
  type: "object",
  additionalProperties: false,
  required: ["object", "data", "hasMore", "nextCursor", "requestId", "traceparent"],
  properties: {
    object: { type: "string", const: "list" },
    data: { type: "array", items: webhookEndpointResponseSchema },
    hasMore: { type: "boolean" },
    nextCursor: { type: ["string", "null"] },
    queryPath: { type: ["string", "null"] },
    queryPathReason: { type: ["string", "null"] },
    policyYears: { type: ["object", "null"], additionalProperties: { type: "integer" } },
    degradedState: { type: ["object", "null"], additionalProperties: true },
    requestId: { type: "string" },
    traceparent: { type: "string" },
  },
} as const

const webhookEndpointListResponseExample = {
  object: "list",
  data: [webhookEndpointExample],
  hasMore: false,
  nextCursor: null,
  queryPath: null,
  queryPathReason: null,
  policyYears: null,
  degradedState: null,
  requestId: "req_2ZK8Q1W9F4M6P7R3",
  traceparent: "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01",
}

const webhookDeliveryAttemptSchema = {
  type: "object",
  additionalProperties: false,
  required: ["object", "id", "createdAt", "orgId", "webhookId", "eventId", "eventType", "destinationUrl", "status", "ok", "requestId", "error", "latencyMs", "replayedFromDeliveryId"],
  properties: {
    object: { type: "string", const: "webhook_delivery_attempt" },
    id: { type: "string" },
    createdAt: { type: "string", format: "date-time" },
    orgId: { type: "string" },
    webhookId: { type: "string" },
    eventId: { type: "string" },
    eventType: { type: "string" },
    destinationUrl: { type: "string", format: "uri" },
    status: { type: ["integer", "null"] },
    ok: { type: "boolean" },
    requestId: { type: "string" },
    error: { type: ["string", "null"] },
    latencyMs: { type: ["integer", "null"] },
    replayedFromDeliveryId: { type: ["string", "null"] },
  },
} as const

const webhookDeliveryAttemptExample = {
  object: "webhook_delivery_attempt",
  id: "wdel_2ZK8Q1W9F4M6P7R3",
  createdAt: "2026-06-25T15:01:00.250Z",
  orgId: "org_example_123",
  webhookId: "wh_2ZK8Q1W9F4M6P7R3",
  eventId: "evt_webhook_test_123",
  eventType: "webhook.test",
  destinationUrl: "https://example.com/hooks/secapi",
  status: 200,
  ok: true,
  requestId: "req_2ZK8Q1W9F4M6P7R3",
  error: null,
  latencyMs: 250,
  replayedFromDeliveryId: null,
}

const webhookDeliveryListResponseSchema = {
  ...webhookEndpointListResponseSchema,
  properties: {
    ...webhookEndpointListResponseSchema.properties,
    data: { type: "array", items: webhookDeliveryAttemptSchema },
  },
} as const

const webhookDeliveryListResponseExample = {
  ...webhookEndpointListResponseExample,
  data: [webhookDeliveryAttemptExample],
}

const webhookDeliveryReplayDeliverySchema = {
  type: "object",
  additionalProperties: false,
  required: ["kind", "deliveryId", "recordedAt", "orgId", "eventId", "eventType", "webhookId", "destinationUrl", "status", "ok", "requestId", "error", "latencyMs", "replayedFromDeliveryId"],
  properties: {
    kind: { type: "string", const: "webhook_delivery" },
    deliveryId: { type: "string" },
    recordedAt: { type: "string", format: "date-time" },
    orgId: { type: "string" },
    eventId: { type: "string" },
    eventType: { type: "string" },
    webhookId: { type: "string" },
    destinationUrl: { type: "string", format: "uri" },
    status: { type: ["integer", "null"] },
    ok: { type: "boolean" },
    requestId: { type: "string" },
    error: { type: ["string", "null"] },
    latencyMs: { type: ["integer", "null"] },
    replayedFromDeliveryId: { type: ["string", "null"] },
  },
} as const

const webhookDeliveryReplayResponseSchema = {
  type: "object",
  additionalProperties: false,
  required: ["object", "sourceDeliveryId", "eventId", "deliveries", "eventsReplayed"],
  properties: {
    object: { type: "string", const: "webhook_delivery_replay" },
    sourceDeliveryId: { type: "string" },
    eventId: { type: "string" },
    deliveries: { type: "array", items: webhookDeliveryReplayDeliverySchema },
    eventsReplayed: { type: "integer", minimum: 0 },
  },
} as const

const webhookDeliveryReplayResponseExample = {
  object: "webhook_delivery_replay",
  sourceDeliveryId: "wdel_2ZK8Q1W9F4M6P7R3",
  eventId: "evt_webhook_test_123",
  deliveries: [{
    kind: "webhook_delivery",
    deliveryId: "wdel_2ZK8Q1W9F4M6P7R4",
    recordedAt: "2026-06-25T15:05:00.250Z",
    orgId: "org_example_123",
    eventId: "evt_webhook_test_123",
    eventType: "webhook.test",
    webhookId: "wh_2ZK8Q1W9F4M6P7R3",
    destinationUrl: "https://example.com/hooks/secapi",
    status: 200,
    ok: true,
    requestId: "req_2ZK8Q1W9F4M6P7R3",
    error: null,
    latencyMs: 250,
    replayedFromDeliveryId: "wdel_2ZK8Q1W9F4M6P7R3",
  }],
  eventsReplayed: 1,
}

const webhookEndpointDeleteResponseSchema = {
  type: "object",
  additionalProperties: false,
  required: ["object", "id", "deleted", "requestId"],
  properties: {
    object: { type: "string", const: "webhook_endpoint.deleted" },
    id: { type: "string" },
    deleted: { type: "boolean" },
    requestId: { type: "string" },
  },
}

const webhookEndpointDeleteResponseExample = {
  object: "webhook_endpoint.deleted",
  id: "wh_2ZK8Q1W9F4M6P7R3",
  deleted: true,
  requestId: "req_2ZK8Q1W9F4M6P7R3",
}

const webhookTestResponseSchema = {
  type: "object",
  additionalProperties: true,
  required: ["object", "event", "delivery"],
  properties: {
    object: { type: "string", const: "webhook_test" },
    event: { type: "object", additionalProperties: true },
    delivery: { type: "object", additionalProperties: true },
  },
}

const webhookTestResponseExample = {
  object: "webhook_test",
  event: {
    object: "event",
    id: "evt_webhook_test_123",
    type: "webhook.test",
    createdAt: "2026-06-25T15:01:00.000Z",
    livemode: false,
    orgId: "org_example_123",
    requestId: "req_2ZK8Q1W9F4M6P7R3",
    data: {
      message: "SEC API webhook test",
      webhookId: "wh_2ZK8Q1W9F4M6P7R3",
      requestedBy: "delivery_api",
    },
  },
  delivery: {
    kind: "webhook_delivery",
    recordedAt: "2026-06-25T15:01:00.250Z",
    orgId: "org_example_123",
    eventId: "evt_webhook_test_123",
    eventType: "webhook.test",
    webhookId: "wh_2ZK8Q1W9F4M6P7R3",
    destinationUrl: "https://example.com/hooks/secapi",
    status: 200,
    ok: true,
    requestId: "req_2ZK8Q1W9F4M6P7R3",
    error: null,
    latencyMs: 250,
    replayedFromDeliveryId: null,
  },
}

const streamSubscriptionRequestSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    description: { type: ["string", "null"] },
    eventTypes: { type: "array", items: { type: "string" }, description: "Delivery event types from GET /v1/event_types. Supports exact event names, `*`, and namespace wildcards such as `monitor.*`." },
    transport: { type: "string", enum: ["poll", "webhook_mirror", "websocket"], default: "poll" },
    livemode: { type: "boolean", default: false },
  },
}

const streamSubscriptionUpdateRequestSchema = {
  type: "object",
  additionalProperties: false,
  minProperties: 1,
  properties: {
    description: { type: ["string", "null"] },
    eventTypes: { type: "array", items: { type: "string" } },
    transport: { type: "string", enum: ["poll", "webhook_mirror", "websocket"] },
    status: { type: "string", enum: ["active", "paused"] },
  },
}

const streamSubscriptionExample = {
  object: "stream_subscription",
  id: "strm_2ZK8Q1W9F4M6P7R3",
  createdAt: "2026-06-25T15:00:00.000Z",
  updatedAt: "2026-06-25T15:00:00.000Z",
  livemode: false,
  orgId: "org_example_123",
  description: "Monitor matches polling stream",
  eventTypes: ["monitor.match", "webhook.test"],
  transport: "poll",
  status: "active",
  cursor: null,
  lastEventAt: null,
}

const streamSubscriptionResponseSchema = {
  allOf: [schemaRef("StreamSubscription")],
  additionalProperties: true,
}

const streamSubscriptionDeleteResponseSchema = {
  type: "object",
  additionalProperties: false,
  required: ["object", "id", "deleted", "requestId"],
  properties: {
    object: { type: "string", const: "stream_subscription.deleted" },
    id: { type: "string" },
    deleted: { type: "boolean" },
    requestId: { type: "string" },
  },
}

const streamSubscriptionDeleteResponseExample = {
  object: "stream_subscription.deleted",
  id: "strm_2ZK8Q1W9F4M6P7R3",
  deleted: true,
  requestId: "req_2ZK8Q1W9F4M6P7R3",
}

const paygEnableRequestSchema = {
  type: "object",
  additionalProperties: false,
  required: ["amountUsd"],
  properties: {
    amountUsd: { type: "number", minimum: 5, description: "Initial prepaid credit amount to purchase while enabling PAYG." },
    autoTopupThresholdCents: { type: "integer", minimum: 1, description: "Optional low-balance threshold, in cents, that enables auto-top-up after payment succeeds." },
    autoTopupAmountCents: { type: "integer", minimum: 500, description: "Optional refill amount, in cents, used with autoTopupThresholdCents." },
  },
}

const paygEnableResponseSchema = {
  type: "object",
  additionalProperties: false,
  required: ["object", "clientSecret", "paymentIntentId", "breakdown", "requestId"],
  properties: {
    object: { type: "string", const: "payg_enable_intent" },
    clientSecret: { type: "string" },
    paymentIntentId: { type: "string" },
    breakdown: { type: "object", additionalProperties: true },
    requestId: { type: "string" },
  },
}

const paygEnableResponseExample = {
  object: "payg_enable_intent",
  clientSecret: "pi_example_secret_example",
  paymentIntentId: "pi_example",
  breakdown: {
    creditsCents: 1000,
    discountCents: 0,
    feeCents: 30,
    totalChargeCents: 1030,
    currency: "usd",
  },
  requestId: "req_2ZK8Q1W9F4M6P7R3",
}

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
    description: "Comma-separated compact-mode expansions such as trust, metadata, series, diagnostics, exposures, position_views, position_exposures, optimizer_candidates, or drilldown. Use trust when an agent or report needs provenance, freshness, source-rights, methodology, revision, and degraded-state metadata; use diagnostics for regression details such as rSquared and tStat where supported.",
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

const macroResponseParameters = [
  {
    name: "response_mode",
    in: "query",
    required: false,
    schema: { type: "string", enum: ["compact", "standard", "verbose", "agent"], default: "standard" },
    description: "Response projection. compact is token-efficient for agents; standard preserves the full launched shape; verbose is reserved for full trust/drill-down expansions. agent aliases compact.",
  },
  {
    name: "include",
    in: "query",
    required: false,
    schema: { type: "string" },
    description: "Comma-separated compact-mode expansions such as trust, metadata, series, releases, calendar, forecasts, or source_plan.",
  },
] as const

const macroResponseParams = (parameters: readonly Record<string, unknown>[] = [], options: { responseModeDefault?: "compact" | "standard" | "verbose" } = {}) => [
  ...parameters,
  ...macroResponseParameters.map((parameter) => {
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

const dilutionPaginationParameters = [
  {
    name: "limit",
    in: "query",
    required: false,
    schema: { type: "integer", minimum: 1, maximum: 50, default: 10 },
    description: "Maximum records to return (1-50; default 10).",
  },
  {
    name: "cursor",
    in: "query",
    required: false,
    schema: { type: "integer", minimum: 0, maximum: 9007199254740991, default: 0 },
    description: "Zero-based offset from a prior page. Follow nextCursor while hasMore is true.",
  },
] as const

const dilutionAgentViewParameter = {
  name: "view",
  in: "query",
  required: false,
  schema: { type: "string", enum: ["agent"] },
  description: "Return the compact agent projection. Omit for the standard response.",
} as const

const dilutionIssuerParameters = [
  { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker filter." },
  { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "SEC Central Index Key (CIK) filter." },
] as const

const situationsListParameters = [
  { name: "types", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated situation_type values." },
  { name: "subtypes", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated subtype values." },
  { name: "statuses", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated lifecycle statuses." },
  { name: "tickers", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated tickers." },
  { name: "sectors", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated sectors." },
  { name: "market_cap", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated market-cap buckets (nano|micro|small|mid|large|mega)." },
  { name: "country", in: "query", required: false, schema: { type: "string" }, description: "ISO 3166-1 alpha-2 country filter." },
  { name: "announced_from", in: "query", required: false, schema: { type: "string" }, description: "Lower bound (ISO date) on announced date." },
  { name: "announced_to", in: "query", required: false, schema: { type: "string" }, description: "Upper bound (ISO date) on announced date." },
  { name: "updated_from", in: "query", required: false, schema: { type: "string" }, description: "Lower bound (ISO datetime) on last update." },
  { name: "forms", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated EDGAR form types (e.g. SC 13D,SC TO-T,425). Expands each form to the situation types it opens and filters to them." },
  { name: "enrich", in: "query", required: false, schema: { type: "string", enum: ["true", "false"], default: "true" }, description: "When false, returns a minimal stripped projection instead of the full situation. Billed identically." },
  { name: "cursor", in: "query", required: false, schema: { type: "integer", minimum: 0, maximum: 9007199254740991, default: 0 } },
  { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 100, default: 25 } },
  { name: "response_mode", in: "query", required: false, schema: { type: "string", enum: ["compact", "standard", "verbose", "agent"] } },
] as const

const situationsByFormQueryParameters = [
  { name: "subtypes", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated subtype values." },
  { name: "statuses", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated lifecycle statuses." },
  { name: "tickers", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated tickers." },
  { name: "sectors", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated sectors." },
  { name: "market_cap", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated market-cap buckets (nano|micro|small|mid|large|mega)." },
  { name: "country", in: "query", required: false, schema: { type: "string" }, description: "ISO 3166-1 alpha-2 country filter." },
  { name: "announced_from", in: "query", required: false, schema: { type: "string" }, description: "Lower bound (ISO date) on announced date." },
  { name: "announced_to", in: "query", required: false, schema: { type: "string" }, description: "Upper bound (ISO date) on announced date." },
  { name: "updated_from", in: "query", required: false, schema: { type: "string" }, description: "Lower bound (ISO datetime) on last update." },
  { name: "enrich", in: "query", required: false, schema: { type: "string", enum: ["true", "false"], default: "true" }, description: "When false, returns a minimal stripped projection instead of the full situation. Billed identically." },
  { name: "cursor", in: "query", required: false, schema: { type: "integer", minimum: 0, maximum: 9007199254740991, default: 0 } },
  { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 100, default: 25 } },
  { name: "response_mode", in: "query", required: false, schema: { type: "string", enum: ["compact", "standard", "verbose", "agent"] } },
] as const

const publicEmbedSituationListParameters = [
  { name: "types", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated situation_type values. At most 25 values are honored." },
  { name: "statuses", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated lifecycle statuses. At most 25 values are honored." },
  { name: "tickers", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated tickers. At most 25 values are honored." },
  { name: "sectors", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated sectors. At most 25 values are honored." },
  { name: "market_cap", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated market-cap buckets (nano|micro|small|mid|large|mega). At most 25 values are honored." },
  { name: "country", in: "query", required: false, schema: { type: "string", enum: ["US", "CA", "GB"] }, description: "Supported country code." },
  { name: "cursor", in: "query", required: false, schema: { type: "string" }, description: "Public page cursor in {windowStart}:{offset} form." },
  { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 10 } },
] as const

const publicEmbedSituationFeedParameters = [
  { name: "types", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated situation_type values. At most 25 values are honored." },
  { name: "categories", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated filing_event_category values. At most 25 values are honored." },
  { name: "tickers", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated tickers. At most 25 values are honored." },
  { name: "country", in: "query", required: false, schema: { type: "string", enum: ["US", "CA", "GB"] }, description: "Supported country code." },
  { name: "cursor", in: "query", required: false, schema: { type: "string" }, description: "Public page cursor in {windowStart}:{offset} form." },
  { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 10 } },
] as const

const publicEmbedLegacyFeedParameters = [
  { name: "types", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated situation_type values." },
  { name: "categories", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated filing_event_category values." },
  { name: "tickers", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated tickers." },
  { name: "country", in: "query", required: false, schema: { type: "string", enum: ["US", "CA", "GB"] }, description: "Supported country code." },
  { name: "cursor", in: "query", required: false, schema: { type: "string" }, description: "Public page cursor in {windowStart}:{offset} form." },
  { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 10 } },
] as const

// Shared filter set for the fund-letters list + search + semantic endpoints
// (Track A). Filters are strictly hand-validated server-side: malformed
// values 400 with invalid_query_parameter, never 5xx.
const fundLetterListParameters = [
  { name: "manager_id", in: "query", required: false, schema: { type: "string" }, description: "mgr_-prefixed manager id." },
  { name: "fund_id", in: "query", required: false, schema: { type: "string" }, description: "fnd_-prefixed fund id." },
  { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Letters mentioning this ticker." },
  { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Letters with at least one thesis on this CIK." },
  { name: "letter_type", in: "query", required: false, schema: { type: "string", enum: ["hedge_fund_letter", "registered_fund_letter"] } },
  { name: "source", in: "query", required: false, schema: { type: "string", enum: ["fund_website", "edgar", "aggregator"] }, description: "Where the canonical source bytes came from." },
  { name: "distribution", in: "query", required: false, schema: { type: "string", enum: ["public_record", "fund_published", "third_party"] }, description: "Rights tier governing what /document serves." },
  { name: "period", in: "query", required: false, schema: { type: "string", pattern: "^\\d{4}Q[1-4]$" }, description: "Exact reporting period (YYYYQn, e.g. 2025Q1)." },
  { name: "year", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 } },
  { name: "quarter", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 4 } },
  { name: "published_from", in: "query", required: false, schema: { type: "string" }, description: "Inclusive lower bound (ISO date/datetime) on publishedAt." },
  { name: "published_to", in: "query", required: false, schema: { type: "string" }, description: "Inclusive upper bound (ISO date/datetime) on publishedAt." },
  { name: "since", in: "query", required: false, schema: { type: "string" }, description: "Only letters updated at or after this ISO date/datetime (updatedAt watermark convenience; /changes is the durable delta primitive). Requests with since are never response-cached." },
  { name: "sort", in: "query", required: false, schema: { type: "string", enum: ["published_at_desc", "published_at_asc", "updated_at_desc", "updated_at_asc", "period_desc", "period_asc"], default: "published_at_desc" } },
  { name: "cursor", in: "query", required: false, schema: { type: "integer", minimum: 0, maximum: 9007199254740991, default: 0 } },
  { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 100, default: 25 } },
  { name: "view", in: "query", required: false, schema: { type: "string", enum: ["default", "compact", "agent"] } },
] as const

// Filter subset for /search + /semantic (Track D engines): the list set
// MINUS `cik` (search-index metadata carries tickers, not per-thesis CIKs),
// `since` (no updatedAt watermark on page indexes), `sort` (relevance-ranked),
// `view` (hits are canonical), and `cursor` (results are a relevance-ranked
// top-N, never offset pages — hasMore is always false; raise limit/top_k or
// narrow filters to deepen recall).
const fundLetterSearchFilterParameters = [
  { name: "manager_id", in: "query", required: false, schema: { type: "string" }, description: "mgr_-prefixed manager id." },
  { name: "fund_id", in: "query", required: false, schema: { type: "string" }, description: "fnd_-prefixed fund id." },
  { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Letters mentioning this ticker." },
  { name: "letter_type", in: "query", required: false, schema: { type: "string", enum: ["hedge_fund_letter", "registered_fund_letter"] } },
  { name: "source", in: "query", required: false, schema: { type: "string", enum: ["fund_website", "edgar", "aggregator"] }, description: "Where the canonical source bytes came from." },
  { name: "distribution", in: "query", required: false, schema: { type: "string", enum: ["public_record", "fund_published", "third_party"] }, description: "Rights tier governing what /document serves." },
  { name: "period", in: "query", required: false, schema: { type: "string", pattern: "^\\d{4}Q[1-4]$" }, description: "Exact reporting period (YYYYQn, e.g. 2025Q1)." },
  { name: "year", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 } },
  { name: "quarter", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 4 } },
  { name: "published_from", in: "query", required: false, schema: { type: "string" }, description: "Inclusive lower bound (ISO date/datetime) on publishedAt." },
  { name: "published_to", in: "query", required: false, schema: { type: "string" }, description: "Inclusive upper bound (ISO date/datetime) on publishedAt." },
] as const

const statementPeriodQueryParameter = {
  name: "period",
  in: "query",
  required: false,
  schema: { type: "string", enum: ["annual", "quarterly", "quarter", "q"] },
  description: "Reporting cadence to select: annual or quarterly. `quarter` and `q` are aliases for `quarterly`; compare values only within like-for-like periods.",
} as const

const responseViewQueryParameter = {
  name: "view",
  in: "query",
  required: false,
  schema: { type: "string", enum: ["default", "compact", "agent"] },
  description: "Response shape. compact is equivalent to mode=compact; agent returns citation fields and snippets without the full section body.",
} as const

const sectionResponseViewQueryParameter = {
  ...responseViewQueryParameter,
  description: "Section response shape. compact is equivalent to mode=compact; agent returns citation fields and snippets without the full section body. Invalid values return invalid_query_parameter with acceptedValues.",
} as const

const filingCompactResponseSchema = {
  type: "object",
  required: ["ticker", "form", "filingDate", "accessionNumber", "requestId"],
  properties: {
    ticker: { type: ["string", "null"] },
    form: { type: ["string", "null"] },
    filingDate: { type: ["string", "null"] },
    accessionNumber: { type: ["string", "null"] },
    requestId: { type: "string" },
    traceparent: { type: "string" },
  },
  additionalProperties: false,
} as const

const filingAgentListResponseSchema = {
  type: "object",
  required: ["object", "data", "hasMore", "nextCursor", "requestId"],
  properties: {
    object: { type: "string", const: "list" },
    data: {
      type: "array",
      items: {
        type: "object",
        required: ["object", "ticker", "form", "accessionNumber", "filingDate", "title", "filingUrl"],
        properties: {
          object: { type: "string", const: "filing" },
          ticker: { type: ["string", "null"] },
          form: { type: "string" },
          accessionNumber: { type: "string" },
          filingDate: { type: "string" },
          title: { type: "string" },
          filingUrl: { type: ["string", "null"] },
        },
        additionalProperties: false,
      },
    },
    hasMore: { type: "boolean" },
    nextCursor: { type: ["string", "null"] },
    requestId: { type: "string" },
  },
  additionalProperties: false,
} as const

const filingSearchResponseSchema = {
  anyOf: [
    schemaRef("FilingList"),
    filingAgentListResponseSchema,
  ],
} as const

const filingDirectResponseSchema = {
  oneOf: [
    schemaRef("Filing"),
    filingCompactResponseSchema,
    schemaRef("FilingAgentRecord"),
  ],
} as const

const filingSectionResponseSchema = {
  oneOf: [
    schemaRef("Section"),
    schemaRef("SectionAgentRecord"),
  ],
} as const

const entitySearchListSchema = (itemProperties: Record<string, unknown>) => ({
  type: "object",
  required: ["object", "data", "hasMore", "nextCursor", "queryPath", "queryPathReason", "policyYears", "degradedState", "requestId", "traceparent"],
  properties: {
    object: { type: "string", enum: ["list"] },
    data: { type: "array", items: { type: "object", properties: itemProperties, additionalProperties: true } },
    hasMore: { type: "boolean" },
    nextCursor: { type: ["string", "null"], description: "The next zero-based offset cursor, or null when the current page is terminal." },
    queryPath: { type: ["string", "null"] },
    queryPathReason: { type: ["string", "null"] },
    policyYears: { type: ["object", "null"], additionalProperties: { type: "integer" } },
    degradedState: { type: ["object", "null"], additionalProperties: true },
    requestId: { type: "string" },
    traceparent: { type: "string" },
  },
  additionalProperties: false,
})

const entitySearchResponses = (description: string, itemProperties: Record<string, unknown>, searchErrorCode: string) => ({
  "200": {
    description,
    content: { "application/json": { schema: entitySearchListSchema(itemProperties) } },
  },
  "400": {
    description: "Invalid limit or cursor. Both routes require limit from 1 through 50 and a non-negative integer cursor.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
  },
  "502": {
    description: `The entity source could not complete the search (${searchErrorCode}).`,
    content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
  },
})

const sectionModeQueryParameter = {
  name: "mode",
  in: "query",
  required: false,
  schema: { type: "string", enum: ["full", "compact"] },
  description: "Section body mode. compact caps contentMd; full returns the full extracted section body when available. Invalid values return invalid_section_mode with acceptedValues.",
} as const

const filingTickerQueryParameter = {
  name: "ticker",
  in: "query",
  required: false,
  schema: { type: "string" },
  description: "Issuer ticker, for example AAPL. Use ticker, symbol, or cik to scope issuer-specific filing lookups.",
} as const

const filingSymbolQueryParameter = {
  name: "symbol",
  in: "query",
  required: false,
  schema: { type: "string" },
  description: "Alias for ticker, for customers coming from market-data APIs. If both ticker and symbol are provided, they must match.",
} as const

const filingCikQueryParameter = {
  name: "cik",
  in: "query",
  required: false,
  schema: { type: "string" },
  description: "Issuer Central Index Key. Use ticker, symbol, or cik to scope issuer-specific filing lookups.",
} as const

const deliveryLedgerQueryParameters = [
  { name: "kind", in: "query", required: false, schema: { type: "string", enum: ["event", "webhook_delivery", "stream_event"] }, description: "Filter to one Delivery ledger record family." },
  { name: "type", in: "query", required: false, schema: { type: "string" }, description: "Filter by canonical event type, for example filing.published." },
  { name: "requestId", in: "query", required: false, schema: { type: "string" }, description: "Filter by producer request id." },
  { name: "since", in: "query", required: false, schema: { type: "string", format: "date-time" }, description: "Return records recorded at or after this timestamp." },
  { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 1000, default: 25 }, description: "Maximum records to return." },
] as const

const deliveryLedgerRecordSchema = {
  type: "object",
  additionalProperties: true,
  properties: {
    kind: { type: "string", enum: ["event", "webhook_delivery", "stream_event"] },
    recordedAt: { type: "string", format: "date-time" },
    orgId: { type: ["string", "null"] },
    eventId: { type: "string" },
    eventType: { type: "string" },
    requestId: { type: "string" },
  },
} as const

const deliveryLedgerListResponse = {
  responses: {
    "200": {
      description: "Delivery ledger records for the current organization.",
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["object", "data", "hasMore", "nextCursor"],
            properties: {
              object: { type: "string", const: "list" },
              data: { type: "array", items: deliveryLedgerRecordSchema },
              hasMore: { type: "boolean" },
              nextCursor: { type: ["string", "null"] },
            },
          },
        },
      },
    },
    "503": { description: "Delivery ledger is temporarily unavailable." },
  },
} as const

const streamEventPageResponse = {
  responses: {
    "200": {
      description: "Cursor page of delivered stream events.",
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["object", "streamId", "data", "hasMore", "nextCursor", "replayCursor"],
            properties: {
              object: { type: "string", const: "stream_event_page" },
              streamId: { type: "string" },
              data: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    object: { type: "string", const: "stream_event" },
                    id: { type: "string" },
                    cursor: { type: "string" },
                    recordedAt: { type: "string", format: "date-time" },
                    requestId: { type: "string" },
                    eventType: { type: "string" },
                    transport: { type: "string", enum: ["poll", "webhook_mirror", "websocket"] },
                  },
                },
              },
              hasMore: { type: "boolean" },
              nextCursor: { type: ["string", "null"] },
              replayCursor: { type: ["string", "null"] },
              requestId: { type: "string" },
            },
          },
        },
      },
    },
    "503": { description: "Delivery ledger is temporarily unavailable." },
  },
} as const

const semanticSearchResponseSchema = {
  type: "object",
  additionalProperties: false,
  required: ["object", "query", "mode", "sections", "requestId", "traceparent"],
  properties: {
    object: { type: "string", const: "semantic_search" },
    query: { type: "string" },
    mode: { type: "string", enum: ["keyword", "semantic", "hybrid"] },
    sections: {
      type: "object",
      additionalProperties: false,
      required: ["object", "data", "count", "degradedState"],
      properties: {
        object: { type: "string", const: "list" },
        data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            required: ["object", "id", "key", "title", "contentMd", "provenance", "accession", "section_key", "char_start", "char_end", "highlighted_snippet", "source_url"],
            properties: {
              object: { type: "string", const: "section" },
              id: { type: "string" },
              ticker: { type: ["string", "null"] },
              form: { type: "string" },
              key: { type: "string" },
              title: { type: "string" },
              contentMd: { type: "string" },
              snippet: { type: "string" },
              accession: { type: ["string", "null"] },
              section_key: { type: ["string", "null"] },
              char_start: { type: ["integer", "null"], minimum: 0 },
              char_end: { type: ["integer", "null"], minimum: 0 },
              highlighted_snippet: { type: ["string", "null"] },
              source_url: { type: ["string", "null"], format: "uri" },
              score: { type: ["number", "null"] },
              retrievalMode: { type: "string", enum: ["keyword", "semantic", "hybrid"] },
              provenance: { $ref: "#/components/schemas/ResponseMetadata" },
            },
          },
        },
        count: { type: "integer", minimum: 0 },
        degradedState: { anyOf: [{ type: "object", additionalProperties: true }, { type: "null" }] },
      },
    },
    requestId: { type: "string" },
    traceparent: { type: "string" },
  },
} as const

const semanticSearchResponseExample = {
  object: "semantic_search",
  query: "liquidity risk",
  mode: "hybrid",
  sections: {
    object: "list",
    data: [
      {
        object: "section",
        id: "sec_example_2025_10k_item_7",
        ticker: "EXAMPLE",
        form: "10-K",
        key: "item_7",
        title: "Management's Discussion and Analysis",
        contentMd: "Example discussion of liquidity risk and capital resources.",
        snippet: "Example discussion of liquidity risk and capital resources.",
        accession: "example-accession",
        section_key: "item_7",
        char_start: 22,
        char_end: 36,
        highlighted_snippet: "Example discussion of **liquidity risk** and capital resources.",
        source_url: "https://example.com/sec-filings/example-2025-10-k",
        score: 0.8421,
        retrievalMode: "hybrid",
        provenance: {
          source: "example",
          sourceLabel: "Illustrative response - not a live SEC filing",
          accessionNumber: null,
          filingUrl: "https://example.com/sec-filings/example-2025-10-k",
          retrievedAt: "2026-02-20T00:00:00.000Z",
          parserVersion: "example",
        },
      },
    ],
    count: 1,
    degradedState: null,
  },
  requestId: "req_2ZK8Q1W9F4M6P7R3",
  traceparent: "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01",
} as const

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
    "/v1/limits": {
      get: {
        summary: "Return the current organization's effective plan, billing state, and route quota windows",
        ...inlineJsonResponse({
          type: "object",
          required: ["object", "orgId", "requestId", "recordedAt", "effectivePlanKey", "billingState", "quotas"],
          properties: {
            object: { type: "string", const: "limits" },
            orgId: { type: "string" },
            requestId: { type: "string" },
            recordedAt: { type: "string", format: "date-time" },
            effectivePlanKey: { type: "string" },
            billingState: { type: "string" },
            quotas: {
              type: "array",
              items: {
                type: "object",
                required: ["meterClass", "limit", "period", "allowed", "planKey", "billingState"],
                properties: {
                  meterClass: { type: "string" },
                  limit: { type: "integer" },
                  period: { type: "string", enum: ["minute", "hour", "day"] },
                  allowed: { type: "boolean" },
                  planKey: { type: "string" },
                  billingState: { type: "string" },
                },
              },
            },
          },
        }, {
          object: "limits",
          orgId: "org_example",
          requestId: "req_example_123",
          recordedAt: "2026-03-19T12:00:00.000Z",
          effectivePlanKey: "personal",
          billingState: "active",
          quotas: [{ meterClass: "standard_read", limit: 600, period: "minute", allowed: true, planKey: "personal", billingState: "active" }],
        }),
      },
    },
    "/v1/org": {
      get: { summary: "Return the current organization profile" },
    },
    "/v1/admin/orgs": {
      get: { summary: "List admin-visible organizations with support-safe plan, usage, and recent activity summaries" },
    },
    "/v1/admin/orgs/{org_id}": {
      get: { summary: "Return an admin-facing organization snapshot with API keys, billing, usage, events, webhooks, streams, and delivery state" },
    },
    "/v1/admin/orgs/{org_id}/requests/{request_id}": {
      get: { summary: "Return admin-scoped request diagnostics for a tenant request identifier" },
    },
    "/v1/admin/orgs/{org_id}/deliveries/summary": {
      get: { summary: "Return admin-scoped delivery aggregates for webhook and stream activity within a tenant" },
    },
    "/v1/admin/maintenance/hot-lane": {
      post: { summary: "Run admin-scoped hot-lane polling to enqueue fresh SEC publication observations" },
    },
    "/v1/admin/maintenance/reconcile-hot": {
      post: { summary: "Run admin-scoped reconcile work to enqueue missing live hot-lane filings" },
    },
    "/v1/admin/maintenance/ingest-worker": {
      post: { summary: "Run admin-scoped ingest worker passes to materialize queued filing artifacts and sections" },
    },
    "/v1/admin/maintenance/ingest-queue": {
      post: { summary: "Export an admin-scoped ingest queue and checkpoint summary from the running SEC API service" },
    },
    "/v1/admin/maintenance/warm-market-latest": {
      post: { summary: "Warm search-visible manifests for the latest market-wide SEC filings by core form" },
    },
    "/v1/admin/maintenance/warm-market-data": {
      post: { summary: "Warm admin-scoped public market-data caches for covered symbols" },
    },
    "/v1/admin/maintenance/warm-macro-data": {
      post: { summary: "Bootstrap admin-scoped Tier-1 macro materialization for launch countries" },
    },
    "/v1/admin/maintenance/warm-factor-data": {
      post: { summary: "Warm admin-scoped factor returns, exposures, and correlations for covered symbols and factor categories" },
    },
    "/v1/admin/maintenance/warm-factor-intraday": {
      post: { summary: "Warm admin-scoped intraday factor snapshots for supported categories and windows" },
    },
    "/v1/admin/maintenance/company-mapping-identifiers": {
      post: { summary: "Backfill FIGI-family and security identifier coverage into the canonical entity store from admin-supplied universe rows" },
    },
    "/v1/billing/webhooks/stripe": {
      post: { summary: "Receive and process signed Stripe subscription lifecycle webhooks" },
    },
    "/v1/billing": {
      get: { summary: "Return the current organization's billing snapshot, including pricing posture, budget controls, and settlement provider state" },
    },
    "/v1/billing/stripe-config": {
      get: {
        summary: "Return the current organization's Stripe publishable-key configuration for browser payment setup",
        responses: {
          "200": {
            description: "Stripe publishable-key configuration for browser payment setup",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["object", "publishableKey", "livemode", "requestId"],
                  properties: {
                    object: { type: "string", enum: ["stripe_config"] },
                    publishableKey: {
                      type: ["string", "null"],
                      description: "Stripe publishable key matching the current organization's billing mode. Null means browser payments are not configured.",
                    },
                    livemode: { type: "boolean", description: "Whether the key is for live Stripe mode." },
                    requestId: { type: "string" },
                  },
                  additionalProperties: false,
                },
                examples: {
                  configured: {
                    summary: "Payments configured",
                    value: {
                      object: "stripe_config",
                      publishableKey: "pk_live_example",
                      livemode: true,
                      requestId: "req_example_123",
                    },
                  },
                  unavailable: {
                    summary: "Payments unavailable",
                    value: {
                      object: "stripe_config",
                      publishableKey: null,
                      livemode: false,
                      requestId: "req_example_123",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/v1/billing/rates": {
      get: {
        summary: "Return the public pricing catalog, starter grant metadata, plan metadata, and meter-family launch rates",
        ...inlineJsonResponse(
          billingRatesResponseSchema,
          billingRatesResponseExample,
          "Public pricing catalog including machine-readable starter grant metadata.",
        ),
      },
    },
    "/v1/billing/credits": {
      get: { summary: "Return the current organization's prepaid credit balance, auto-top-up settings, lifetime totals, and low-balance status" },
    },
    "/v1/billing/credits/transactions": {
      get: { summary: "List the current organization's prepaid credit ledger entries (top-ups, debits, refunds, grants, adjustments), newest first" },
    },
    "/v1/billing/credits/topup": {
      post: { summary: "Create a Stripe PaymentIntent to purchase prepaid credits, returning the client secret and the discount/fee charge breakdown" },
    },
    "/v1/billing/credits/auto-topup": {
      put: { summary: "Enable or disable automatic prepaid-credit top-ups and set the low-balance threshold and refill amount" },
    },
    "/v1/billing/credits/refund": {
      post: { summary: "Refund the unspent credits of a prepaid top-up to the original payment method, within the refund window (platform fees non-refundable)" },
    },
    "/v1/billing/payment-methods/setup-intent": {
      post: {
        summary: "Create a Stripe SetupIntent to save a payment method off-session for top-ups and auto-top-up (max 3 per organization)",
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: {
                type: "object",
                additionalProperties: false,
                maxProperties: 0,
                description: "No request body fields are accepted. Send an empty object or omit the body.",
              },
              examples: {
                empty: {
                  summary: "No request body fields",
                  value: {},
                },
              },
            },
          },
        },
      },
    },
    "/v1/billing/payment-methods": {
      get: { summary: "List the current organization's saved payment methods, primary first" },
    },
    "/v1/billing/payment-methods/{id}": {
      put: {
        summary: "Set a saved payment method as primary and/or change its auto-top-up fallback priority",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                additionalProperties: false,
                minProperties: 1,
                properties: {
                  isPrimary: { type: "boolean", description: "Set this saved method as the primary payment method." },
                  priority: { type: "integer", minimum: 1, description: "Auto-top-up fallback priority. Lower numbers are tried first." },
                },
              },
              examples: {
                setPrimary: {
                  summary: "Make this payment method primary",
                  value: { isPrimary: true },
                },
                fallbackPriority: {
                  summary: "Update fallback priority",
                  value: { priority: 2 },
                },
              },
            },
          },
        },
      },
      delete: { summary: "Remove a saved payment method from the current organization" },
    },
    "/v1/billing/payg/enable": {
      post: {
        summary: "Enable pay-as-you-go in one flow: save a card, make an initial credit top-up, and optionally turn on auto-top-up (returns a PaymentIntent client secret)",
        ...inlineJsonRequestBody(paygEnableRequestSchema, {
          amountUsd: 10,
          autoTopupThresholdCents: 1000,
          autoTopupAmountCents: 2500,
        }),
        ...inlineJsonResponse(paygEnableResponseSchema, paygEnableResponseExample, "PAYG enable PaymentIntent created.", "201"),
      },
    },
    "/v1/billing/grant/reset": {
      post: { summary: "Re-grant the one-time free starter allowance (resets free-grant usage), rate-limited to once per rolling 30 days per organization" },
    },
    "/v1/billing/quote": {
      post: {
        summary: "Quote a billable workflow or meter class against the current billing plan and budget gates",
        ...inlineJsonRequestBody({
          type: "object",
          additionalProperties: true,
          properties: {
            planKey: { type: ["string", "null"], description: "Optional public plan key to quote instead of the organization's current plan." },
            meterClass: { type: ["string", "null"], description: "Optional meter class. Provide this or a path." },
            path: { type: ["string", "null"], description: "Optional API path used to derive the meter class. Provide this or meterClass." },
            method: { type: ["string", "null"], description: "HTTP method used with path; defaults to GET when path is supplied." },
            units: { type: ["number", "null"], description: "Optional positive number of units to quote." },
          },
        }, { path: "/v1/facts", method: "GET", units: 1 }, "Provide meterClass or path. planKey and units are optional."),
        ...inlineJsonResponse({
          type: "object",
          required: ["object", "planKey", "meterClass", "meterFamily", "units", "unitAmountUsd", "amountUsd", "amountCents", "currency", "requestId", "budget", "budgetGate"],
          properties: {
            object: { type: "string", const: "billing_quote" },
            planKey: { type: "string" },
            meterClass: { type: "string" },
            meterFamily: { type: "string" },
            units: { type: "integer" },
            unitAmountUsd: { type: "number" },
            amountUsd: { type: "number" },
            amountCents: { type: "integer" },
            currency: { type: "string", const: "usd" },
            requestId: { type: "string" },
            budget: { type: "object" },
            budgetGate: { type: ["object", "null"] },
          },
        }, {
          object: "billing_quote",
          planKey: "personal",
          meterClass: "fact_lookup",
          meterFamily: "standard_read",
          units: 1,
          unitAmountUsd: 0,
          amountUsd: 0,
          amountCents: 0,
          currency: "usd",
          requestId: "req_example_123",
          budget: {},
          budgetGate: null,
        }),
      },
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
      post: {
        summary: "Create a new API key for the current organization and reveal its secret exactly once",
        ...inlineJsonRequestBody(
          createApiKeyRequestSchema,
          { label: "local-dev" },
          "Optional API key label. Scopes and livemode are derived server-side for the current organization.",
        ),
        ...inlineJsonResponse(
          createApiKeyResponseSchema,
          createApiKeyResponseExample,
          "API key created. The `secret` field is revealed exactly once in this response.",
          "201",
        ),
      },
    },
    "/v1/agent/bootstrap_tokens": {
      post: {
        summary: "Issue a short-lived, single-use sponsor token for agent bootstrap under the current organization",
        ...inlineJsonRequestBody({
          type: "object",
          additionalProperties: false,
          properties: {
            label: { type: ["string", "null"], description: "Optional label carried into the issued agent API key." },
            scopes: { type: "array", items: { type: "string" }, description: "Optional requested scopes; self-serve sponsor tokens are limited to read:sec." },
            ttlSeconds: { type: "integer", minimum: 1, maximum: 86_400, description: "Optional lifetime in seconds. The service clamps the effective value to 60 through 86,400 seconds." },
          },
        }, { label: "research-agent", scopes: ["read:sec"], ttlSeconds: 900 }, "Requires a human organization member authenticated with a bearer token. API keys cannot create sponsor tokens."),
        ...inlineJsonResponse({
          type: "object",
          required: ["object", "id", "orgId", "actorPrincipalId", "label", "tokenPrefix", "scopes", "livemode", "expiresAt", "usedAt", "usedByPrincipalId", "createdAt", "updatedAt", "secret", "requestId"],
          properties: {
            object: { type: "string", const: "agent_bootstrap_token" },
            id: { type: "string" },
            orgId: { type: "string" },
            actorPrincipalId: { type: "string" },
            label: { type: ["string", "null"] },
            tokenPrefix: { type: "string" },
            scopes: { type: "array", items: { type: "string" } },
            livemode: { type: "boolean" },
            expiresAt: { type: "string", format: "date-time" },
            usedAt: { type: ["string", "null"], format: "date-time" },
            usedByPrincipalId: { type: ["string", "null"] },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            secret: { type: "string", description: "One-time sponsor-token secret. Store only long enough to send it to the bootstrap agent." },
            requestId: { type: "string" },
          },
        }, {
          object: "agent_bootstrap_token",
          id: "agtok_example",
          orgId: "org_example",
          actorPrincipalId: "user_example",
          label: "research-agent",
          tokenPrefix: "agtok_example",
          scopes: ["read:sec"],
          livemode: false,
          expiresAt: "2026-03-19T12:15:00.000Z",
          usedAt: null,
          usedByPrincipalId: null,
          createdAt: "2026-03-19T12:00:00.000Z",
          updatedAt: "2026-03-19T12:00:00.000Z",
          secret: "agtok_example_secret_returned_once",
          requestId: "req_example_123",
        }, "Sponsor token issued. The secret is returned once.", "201"),
      },
    },
    "/v1/agent/bootstrap": {
      post: {
        summary: "Exchange a sponsor token for the first org-scoped API key, billing snapshot, limits, and MCP install metadata",
        ...inlineJsonRequestBody({
          type: "object",
          additionalProperties: false,
          required: ["token"],
          properties: {
            token: { type: "string", minLength: 1, description: "Short-lived, single-use sponsor token returned by POST /v1/agent/bootstrap_tokens." },
            label: { type: ["string", "null"], description: "Optional label for the issued API key." },
            scopes: { type: "array", items: { type: "string" }, description: "Optional requested scopes; the self-serve exchange is limited to read:sec." },
          },
        }, { token: "agtok_example_sponsor_token", label: "research-agent", scopes: ["read:sec"] }, "This exchange is intentionally pre-auth. Do not send an API key or bearer token; submit the sponsor token in the JSON body."),
        ...inlineJsonResponse({
          type: "object",
          required: ["object", "requestId", "organization", "apiKey", "billing", "limits", "distribution", "sponsorToken"],
          properties: {
            object: { type: "string", const: "agent_bootstrap" },
            requestId: { type: "string" },
            organization: { type: "object" },
            apiKey: { type: "object" },
            billing: { type: "object" },
            limits: { type: "object" },
            distribution: { type: "object" },
            sponsorToken: { type: "object" },
          },
        }, {
          object: "agent_bootstrap",
          requestId: "req_example_123",
          organization: {},
          apiKey: {},
          billing: {},
          limits: {},
          distribution: {},
          sponsorToken: {},
        }, "Sponsor token exchanged and API key issued.", "201"),
      },
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
    "/v1/event_types": {
      get: {
        summary: "List Delivery event types, producer status, replay support, retention, and billing family metadata",
        parameters: [
          { name: "status", in: "query", required: false, schema: { type: "string", enum: ["public_emitting", "internal", "reserved"] }, description: "Filter the catalog by producer status." },
        ],
        responses: {
          "200": {
            description: "Delivery event type catalog.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["object", "data", "requestId"],
                  properties: {
                    object: { type: "string", const: "event_type_catalog" },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                        required: ["type", "status", "schemaVersion", "billingFamily"],
                        properties: {
                          type: { type: "string" },
                          status: { type: "string", enum: ["public_emitting", "internal", "reserved"] },
                          description: { type: "string" },
                          schemaVersion: { type: "string" },
                          producer: { type: "string" },
                          filterable: { type: "boolean" },
                          replaySupport: { type: "string" },
                          retention: { type: "string" },
                          billingFamily: { type: "string", description: "Meter family used when this event is delivered through a customer webhook, stream, or email transport." },
                          transports: { type: "array", items: { type: "string" } },
                          samplePayload: { type: "object", additionalProperties: true },
                        },
                      },
                    },
                    requestId: { type: "string" },
                  },
                },
              },
            },
          },
          "400": { description: "Invalid status filter." },
        },
      },
    },
    "/v1/delivery/events": {
      get: {
        summary: "List durable Delivery ledger, webhook delivery, and stream records for the current organization",
        parameters: deliveryLedgerQueryParameters,
        ...deliveryLedgerListResponse,
      },
    },
    "/v1/delivery/events/export": {
      get: {
        summary: "Export durable Delivery ledger records as JSON or NDJSON",
        parameters: [
          ...deliveryLedgerQueryParameters,
          { name: "format", in: "query", required: false, schema: { type: "string", enum: ["json", "ndjson"], default: "json" }, description: "Export format. ndjson returns application/x-ndjson." },
        ],
        responses: {
          "200": {
            description: "Delivery ledger export.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["object", "format", "count", "content"],
                  properties: {
                    object: { type: "string", const: "event_export" },
                    format: { type: "string", const: "json" },
                    count: { type: "integer" },
                    content: { type: "string", description: "Pretty-printed JSON array of ledger records." },
                  },
                },
              },
              "application/x-ndjson": {
                schema: { type: "string", description: "Newline-delimited JSON Delivery ledger records." },
              },
            },
          },
          "503": { description: "Delivery ledger is temporarily unavailable." },
        },
      },
    },
    "/v1/diagnostics/requests/{request_id}": {
      get: { summary: "Return request-id scoped diagnostics across usage, events, deliveries, streams, and artifacts" },
    },
    "/v1/diagnostics/deliveries/summary": {
      get: { summary: "Return aggregated webhook and stream delivery summaries for support workflows" },
    },
    "/v1/observability": {
      get: { summary: "Return admin-only observability configuration and provider seam status" },
    },
    "/v1/observability/export": {
      get: { summary: "Return an admin-only observability export with config, usage, and recent events" },
    },
    "/v1/webhook_endpoints": {
      get: {
        summary: "List webhook endpoints for the current organization",
        ...inlineJsonResponse(webhookEndpointListResponseSchema, webhookEndpointListResponseExample, "Webhook endpoints for the current organization. Signing secrets are never included."),
      },
      post: {
        summary: "Create a signed webhook endpoint for Delivery events",
        ...inlineJsonRequestBody(webhookEndpointRequestSchema, {
          destinationUrl: "https://example.com/hooks/secapi",
          description: "Production monitor matches",
          subscribedEventTypes: ["monitor.match"],
          livemode: false,
        }),
        ...inlineJsonResponse(webhookEndpointResponseSchema, webhookEndpointCreateExample, "Webhook endpoint created. The signing secret is revealed once on create/rotate.", "201"),
      },
    },
    "/v1/webhook_endpoints/{webhook_id}": {
      patch: {
        summary: "Update a webhook endpoint URL, description, subscribed event types, or active status",
        ...inlineJsonRequestBody(webhookEndpointUpdateRequestSchema, {
          destinationUrl: "https://example.com/hooks/secapi",
          description: "Production monitor matches",
          subscribedEventTypes: ["monitor.match", "webhook.test"],
          status: "active",
        }),
        ...inlineJsonResponse(webhookEndpointResponseSchema, webhookEndpointExample),
      },
      delete: {
        summary: "Delete a webhook endpoint while preserving delivery audit history",
        ...inlineJsonResponse(webhookEndpointDeleteResponseSchema, webhookEndpointDeleteResponseExample),
      },
    },
    "/v1/webhook_endpoints/{webhook_id}/enable": {
      post: {
        summary: "Enable a webhook endpoint",
        ...inlineJsonResponse(webhookEndpointResponseSchema, webhookEndpointExample),
      },
    },
    "/v1/webhook_endpoints/{webhook_id}/disable": {
      post: {
        summary: "Disable a webhook endpoint without deleting delivery history",
        ...inlineJsonResponse(webhookEndpointResponseSchema, { ...webhookEndpointExample, status: "disabled" }),
      },
    },
    "/v1/webhook_endpoints/{webhook_id}/test": {
      post: {
        summary: "Send a signed webhook.test event to a webhook endpoint",
        ...inlineJsonRequestBody(webhookEndpointTestRequestSchema, {
          eventType: "webhook.test",
          data: { source: "dashboard" },
        }),
        ...inlineJsonResponse(webhookTestResponseSchema, webhookTestResponseExample),
      },
    },
    "/v1/webhook_endpoints/{webhook_id}/rotate_secret": {
      post: {
        summary: "Rotate the signing secret for a webhook endpoint",
        ...inlineJsonResponse(webhookEndpointResponseSchema, webhookEndpointCreateExample, "Signing secret rotated. The new secret is revealed once."),
      },
    },
    "/v1/webhook_endpoints/{webhook_id}/deliveries": {
      get: {
        summary: "List canonical delivery attempts for a webhook endpoint",
        parameters: [
          { name: "eventId", in: "query", required: false, schema: { type: "string" }, description: "Filter delivery attempts to one event id." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 20 }, description: "Maximum attempts to return. Values outside 1 through 50 are clamped." },
        ],
        ...inlineJsonResponse(webhookDeliveryListResponseSchema, webhookDeliveryListResponseExample, "Recorded delivery attempts for the endpoint. A record captures an attempted send and observed HTTP result."),
      },
    },
    "/v1/webhook_endpoints/{webhook_id}/deliveries/{delivery_id}/replay": {
      post: {
        summary: "Replay a stored webhook delivery attempt by re-emitting its source event to the endpoint",
        ...inlineJsonResponse(webhookDeliveryReplayResponseSchema, webhookDeliveryReplayResponseExample, "Explicit replay result. Replay creates new delivery records linked to the source attempt."),
      },
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
    "/v1/monitors/compile": {
      post: {
        summary: "Compile a natural-language alert request into a structured monitor spec",
        description: "Turns a plain-English trigger (e.g. \"notify me about mergers at AAPL\") into a validated structured monitor subscription spec plus a ready-to-POST create body. Read-only: it returns a spec, it does not create the monitor.",
      },
    },
    "/v1/alerts/plan": {
      get: { summary: "Retrieve the public free-tier plan descriptor (included features, alert limits, and upgrade paths)" },
    },
    "/v1/alerts/signup": {
      post: { summary: "Register an email for the free alerts tier (idempotent lead capture)" },
    },
    "/v1/embed/feed": {
      get: {
        summary: "Public embeddable reverse-chronological situations feed for third-party sites (JSON, cacheable, CORS-enabled)",
        parameters: publicEmbedLegacyFeedParameters,
      },
    },
    "/v1/embed/situations/issues": {
      get: {
        tags: ["Embed"],
        summary: "Public capped Special Situations Digest issue archive",
        description: "Anonymous, cacheable archive index for published Special Situations Digest issues. The index omits member situation rows while preserving issue metadata, source ids, and publication dates.",
        parameters: [
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 24, default: 10 } },
        ],
        ...jsonResponse("PublicSituationWeeklyIssueList"),
      },
    },
    "/v1/embed/situations/issues/{issue}": {
      get: {
        tags: ["Embed"],
        summary: "Public Special Situations Digest issue detail by number or slug",
        description: "Anonymous, cacheable detail for one published Special Situations Digest issue. The response is the frozen public issue snapshot with provider-owned and market-plane internals omitted by the route projection.",
        parameters: [{ name: "issue", in: "path", required: true, schema: { type: "string" } }],
        ...jsonResponse("PublicSituationWeeklyIssue"),
      },
    },
    "/v1/embed/situations/{id}": {
      get: {
        tags: ["Embed"],
        summary: "Public situation detail used by secapi.ai situation permalinks and embeddable discovery surfaces",
        description: "Anonymous, cacheable detail surface for recent public situations. The response matches the implementation's public projection: provider-owned keys and verification internals are omitted.",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", pattern: "^sit_[a-f0-9]{20}$" }, description: "Canonical public situation id." },
        ],
        ...jsonResponse("PublicSituationDetail"),
      },
    },
    "/v1/embed/widget.js": {
      get: { summary: "Public embeddable feed widget script that renders the situations feed into a host element" },
    },
    "/v1/embed/situations": {
      get: {
        tags: ["Embed"],
        summary: "Public capped Special Situations list for logged-out experiences",
        description: "Anonymous, recent-only public projection. Includes SEC filing accessions and safe public citation provenance while keeping provider keys, extraction trace ids, model versions, confidence/cross-validation telemetry, prompts, and raw provenance metadata out of the response.",
        parameters: publicEmbedSituationListParameters,
        ...jsonResponse("PublicSituationList"),
      },
    },
    "/v1/embed/situations/feed": {
      get: {
        tags: ["Embed"],
        summary: "Public capped Special Situations event feed with safe filing provenance",
        description: "Anonymous recent event feed for embedded/public UI surfaces. Event provenance includes SEC accession, SEC filing URL when public-safe, and source-linked public citations when available.",
        parameters: publicEmbedSituationFeedParameters,
        ...jsonResponse("PublicSituationFeedItemList"),
      },
    },
    "/v1/embed/situations/feed.rss": {
      get: {
        tags: ["Embed"],
        summary: "Public RSS feed of recent Special Situations events",
        parameters: publicEmbedSituationFeedParameters.filter((parameter) => parameter.name !== "cursor" && parameter.name !== "limit"),
        responses: {
          "200": {
            description: "RSS XML feed of public situation events",
            content: { "application/rss+xml": { schema: { type: "string" } } },
          },
        },
      },
    },
    "/v1/embed/situations/stats": {
      get: {
        tags: ["Embed"],
        summary: "Public recent-window Special Situations counts with persisted-column coverage scope",
        ...jsonResponse("PublicSituationStats"),
      },
    },
    "/v1/embed/situations/{situation_id}/export": {
      get: {
        tags: ["Embed"],
        summary: "Public Markdown Copy-for-LLM brief for one recent Special Situation",
        parameters: [{ name: "situation_id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": {
            description: "Markdown situation brief",
            content: { "text/markdown": { schema: { type: "string" } } },
          },
        },
      },
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
      post: {
        summary: "Create a stream subscription for event polling and replay",
        ...inlineJsonRequestBody(streamSubscriptionRequestSchema, {
          description: "Monitor matches polling stream",
          eventTypes: ["monitor.match"],
          transport: "poll",
          livemode: false,
        }),
        ...inlineJsonResponse(streamSubscriptionResponseSchema, streamSubscriptionExample, "Stream subscription created.", "201"),
      },
    },
    "/v1/stream_subscriptions/{stream_id}": {
      patch: {
        summary: "Update a stream subscription description, event types, transport, or status",
        ...inlineJsonRequestBody(streamSubscriptionUpdateRequestSchema, {
          description: "Monitor matches polling stream",
          eventTypes: ["monitor.match", "webhook.test"],
          transport: "poll",
          status: "active",
        }),
        ...inlineJsonResponse(streamSubscriptionResponseSchema, streamSubscriptionExample),
      },
      delete: {
        summary: "Delete a stream subscription while preserving delivery records",
        ...inlineJsonResponse(streamSubscriptionDeleteResponseSchema, streamSubscriptionDeleteResponseExample),
      },
    },
    "/v1/stream_subscriptions/{stream_id}/enable": {
      post: {
        summary: "Enable a stream subscription",
        ...inlineJsonResponse(streamSubscriptionResponseSchema, streamSubscriptionExample),
      },
    },
    "/v1/stream_subscriptions/{stream_id}/disable": {
      post: {
        summary: "Disable a stream subscription without deleting its delivery records",
        ...inlineJsonResponse(streamSubscriptionResponseSchema, { ...streamSubscriptionExample, status: "paused" }),
      },
    },
    "/v1/stream_subscriptions/{stream_id}/events": {
      get: {
        summary: "Poll canonical stream events for a subscription with cursor semantics",
        parameters: [
          { name: "stream_id", in: "path", required: true, schema: { type: "string" }, description: "Stream subscription id." },
          { name: "cursor", in: "query", required: false, schema: { type: "string" }, description: "Last seen stream cursor. The response returns records after this cursor." },
          { name: "type", in: "query", required: false, schema: { type: "string" }, description: "Filter by canonical event type." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 1000, default: 20 }, description: "Maximum stream events to return." },
        ],
        ...streamEventPageResponse,
      },
    },
    "/v1/stream/tickets": {
      post: {
        summary: "Mint a short-lived signed WebSocket stream ticket for the current principal",
        description: "Creates a short-lived signed ticket that can be sent as the `ticket` query parameter when upgrading to `/v1/stream/ws`. This avoids sending long-lived API keys or bearer tokens in browser-visible WebSocket URLs.",
      },
    },
    "/v1/stream/ws": {
      get: {
        summary: "Upgrade to a WebSocket connection for delivery event streaming",
        description: "Upgrades an active WebSocket stream subscription to a WebSocket connection. Clients must supply that subscription's `stream_id` and authenticate with either a short-lived signed `ticket` minted from `POST /v1/stream/tickets` or the `x-api-key` header. Connections are capped by plan but are not separately billable in v1. Delivered events use the same delivery-event billing family as stream polling and are idempotent per subscription and event.",
        parameters: [
          { name: "stream_id", in: "query", required: true, schema: { type: "string" }, description: "ID of an active stream subscription configured for WebSocket delivery." },
          { name: "ticket", in: "query", required: false, schema: { type: "string" }, description: "Short-lived signed stream ticket minted from `POST /v1/stream/tickets`. Provide this or the `x-api-key` header." },
          { name: "x-api-key", in: "header", required: false, schema: { type: "string" }, description: "API key for the WebSocket upgrade. Provide this or a short-lived `ticket` query parameter." },
          { name: "cursor", in: "query", required: false, schema: { type: "string" }, description: "Resume delivery after a previously observed stream cursor. Events after this cursor are replayed on connect." },
        ],
        responses: {
          "101": { description: "WebSocket upgrade successful. Server sends JSON frames such as connected, filing.published, pong, filters_updated, and rate_limited." },
          "401": { description: "Missing or invalid stream ticket or API key" },
          "429": { description: "Per-organization connection limit exceeded" },
          "503": { description: "Global connection capacity exceeded" },
        },
      },
    },
    "/v1/entities/resolve": {
      get: {
        summary: "Resolve one issuer, manager, insider, or fund from a market or SEC identifier, returning the canonical entity and match confidence",
        parameters: [
          { name: "ticker", in: "query", schema: { type: "string" }, description: "Exchange ticker to resolve, such as AAPL. When ticker and symbol are both supplied, ticker takes precedence." },
          { name: "symbol", in: "query", schema: { type: "string" }, description: "Alias for ticker for market-data clients. It is used when ticker is absent or blank." },
          { name: "cik", in: "query", schema: { type: "string" }, description: "SEC CIK to resolve; leading zeros are accepted and preserved in the canonical response." },
          { name: "figi", in: "query", schema: { type: "string" }, description: "FIGI-family identifier to resolve." },
          { name: "composite_figi", in: "query", schema: { type: "string" }, description: "Composite FIGI identifier to resolve." },
          { name: "share_class_figi", in: "query", schema: { type: "string" }, description: "Share-class FIGI identifier to resolve." },
          { name: "isin", in: "query", schema: { type: "string" }, description: "ISIN identifier to resolve." },
          { name: "cusip", in: "query", schema: { type: "string" }, description: "CUSIP identifier to resolve." },
          { name: "name", in: "query", schema: { type: "string" }, description: "Company, fund, manager, or insider name to resolve. Prefer a stable identifier when one is available." },
          { name: "query", in: "query", schema: { type: "string" }, description: "Alias for name; used when name is absent or blank." },
          { name: "q", in: "query", schema: { type: "string" }, description: "Short alias for query/name; used after name and query." },
          { name: "view", in: "query", schema: { type: "string", enum: ["agent", "compact"] }, description: "Use agent for a citation-ready compact payload with identity and match fields, or compact for core identity fields. Omit for the full canonical record." },
        ],
        responses: {
          "200": {
            description: "Canonical entity record. matchConfidence and matchBasis explain how the supplied identifier resolved; requestId supports support and retry correlation.",
            content: {
              "application/json": {
                schema: { type: "object", additionalProperties: true },
                examples: {
                  agent: {
                    summary: "Agent view by ticker",
                    value: {
                      object: "entity",
                      id: "cent_f3913349312cbf5bfd60ecdb",
                      ticker: "AAPL",
                      cik: "0000320193",
                      name: "Apple Inc.",
                      primaryIdentifiers: [
                        { type: "ticker", value: "AAPL" },
                        { type: "cik", value: "0000320193" },
                      ],
                      matchConfidence: 1,
                      matchBasis: "ticker",
                      requestId: "req_example",
                    },
                  },
                },
              },
            },
          },
          default: {
            description: "Contract-aware error response. A missing or blank identifier returns 400 missing_identifier; an unresolved identifier returns 404 entity_not_found.",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
          },
        },
      },
    },
    "/v1/entities": {
      get: {
        summary: "Search canonical SEC entities across issuers, managers, insiders, and funds with offset pagination",
        parameters: [
          { name: "q", in: "query", required: false, schema: { type: "string" }, description: "Ticker, CIK, identifier, or name text. Omit only when browsing a bounded entity-type slice." },
          { name: "entity_type", in: "query", required: false, schema: { type: "string" }, description: "Optional canonical type filter, such as issuer, manager, insider, or fund." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50 }, description: "Page size from 1 through 50; defaults to 25." },
          { name: "cursor", in: "query", required: false, schema: { type: "integer", minimum: 0 }, description: "Zero-based offset from nextCursor. Continue only while hasMore is true." },
        ],
        responses: entitySearchResponses(
          "Canonical entity search page. The envelope always includes pagination, request correlation, and nullable query-path metadata.",
          {
            object: { type: "string", enum: ["entity"] },
            id: { type: "string" },
            entityType: { type: "string" },
            ticker: { type: ["string", "null"] },
            cik: { type: ["string", "null"] },
            name: { type: "string" },
            aliases: { type: "array", items: { type: "string" } },
            identifiers: { type: "array", items: { type: "object", additionalProperties: true } },
          },
          "entity_search_failed",
        ),
      },
    },
    "/v1/entities/edgar": {
      get: {
        summary: "Search SEC EDGAR entity records by name, ticker, CIK, or identifier with source-oriented pagination",
        parameters: [
          { name: "q", in: "query", required: false, schema: { type: "string" }, description: "Name, ticker, CIK, or identifier text matched against SEC EDGAR entity records." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50 }, description: "Page size from 1 through 50; defaults to 25." },
          { name: "cursor", in: "query", required: false, schema: { type: "integer", minimum: 0 }, description: "Zero-based offset from nextCursor. Continue only while hasMore is true." },
        ],
        responses: entitySearchResponses(
          "SEC EDGAR entity search page. The envelope always includes pagination, request correlation, and nullable query-path metadata.",
          {
            object: { type: "string", enum: ["edgar_entity"] },
            id: { type: "string" },
            cik: { type: "string" },
            ticker: { type: ["string", "null"] },
            companyName: { type: "string" },
            companyNameAliases: { type: "array", items: { type: "string" } },
            secSubmissionsUrl: { type: "string", format: "uri" },
          },
          "edgar_entity_search_failed",
        ),
      },
    },
    "/v1/traces": {
      get: {
        summary: "Batch resolve shared trace records by trace identifier across filing-derived and supported non-filing datasets",
        parameters: [
          { name: "ids", in: "query", required: true, schema: { type: "string" }, description: "Comma-separated trace identifiers. At most 50 IDs per request." },
        ],
      },
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
      get: {
        summary: "Find SEC filing records by issuer, form, date, text, or accession number",
        description: "Search materialized SEC filing manifests for a bounded research or monitoring workflow. Filter by one issuer identifier, form, filing date, text, or a known accession number; results include filing identity and source links. Coverage and freshness reflect the returned records and provenance, not a promise of real-time or complete EDGAR history.",
        parameters: [
          filingTickerQueryParameter,
          filingSymbolQueryParameter,
          filingCikQueryParameter,
          { name: "form", in: "query", required: false, schema: { type: "string" }, description: "Single SEC form type to filter by, for example 10-K or 8-K." },
          { name: "forms", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated SEC form types to filter by." },
          { name: "fp", in: "query", required: false, schema: { type: "string" }, description: "Fiscal period filter, for example FY, Q1, Q2, Q3, or Q4." },
          { name: "q", in: "query", required: false, schema: { type: "string" }, description: "Text query over indexed filing manifests. Combine it with an issuer, form, or date range for a bounded review set; a match is not a conclusion about the filing." },
          { name: "accession_number", in: "query", required: false, schema: { type: "string" }, description: "Exact SEC accession-number filter for a known filing." },
          { name: "date_from", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Earliest filing date to include." },
          { name: "date_to", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Latest filing date to include; must be on or after date_from." },
          { name: "filing_year", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Calendar filing year filter." },
          { name: "fy", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Fiscal-year alias used to derive a filing-date window." },
          { name: "sort", in: "query", required: false, schema: { type: "string", enum: ["filing_date_desc", "filing_date_asc"] }, description: "Filing date sort order." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 10 }, description: "Maximum filings to return." },
          { name: "cursor", in: "query", required: false, schema: { type: "integer", minimum: 0, maximum: 9007199254740991, default: 0 }, description: "Zero-based result offset. Use the returned nextCursor while hasMore is true rather than deriving an offset from row IDs." },
          { name: "submission_file_limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50 }, description: "Bound on SEC submission files inspected during fallback coverage; raise only when older history is required." },
          responseViewQueryParameter,
        ],
        responses: {
          "200": {
            description: "Successful filing search response. Default and compact views return filing-list metadata with full or compact filing records; view=agent returns the runtime agent list envelope with compact filing citation records.",
            content: { "application/json": { schema: filingSearchResponseSchema } },
          },
          "400": { description: "Invalid filing search filters, pagination, or response view.", content: { "application/json": { schema: schemaRef("Error") } } },
          "502": { description: "The filing search path could not complete (filing_search_failed).", content: { "application/json": { schema: schemaRef("Error") } } },
        },
      },
    },
    "/v1/filings/latest": {
      get: {
        summary: "Get an issuer's newest filing, optionally for a specific SEC form",
        description: "Resolve the newest materialized filing for one issuer and optionally one SEC form, returning filing identity, date, accession number, and provenance. Without form, the newest record may be any filing type, such as a Form 4 or 8-K; retain the returned accession number for an immutable follow-up.",
        parameters: [
          filingTickerQueryParameter,
          filingSymbolQueryParameter,
          filingCikQueryParameter,
          { name: "form", in: "query", required: false, schema: { type: "string" }, description: "SEC form type, such as 10-K or 8-K. Omit it to retrieve the issuer's newest filing of any type, including ownership or insider filings." },
          { name: "fp", in: "query", required: false, schema: { type: "string" }, description: "Fiscal period filter, for example FY, Q1, Q2, Q3, or Q4." },
          { name: "filing_year", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Calendar filing year filter." },
          { name: "fy", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Fiscal-year selector. With ticker, it maps to that issuer's fiscal filing-date window." },
          responseViewQueryParameter,
        ],
        responses: {
          "200": {
            description: "Successful latest-filing response. Default returns the filing manifest, compact returns the compact filing identity plus requestId, and view=agent returns the runtime agent filing record with lifted filingUrl.",
            content: { "application/json": { schema: filingDirectResponseSchema } },
          },
          "400": { description: "Missing or conflicting issuer selector, invalid year selector, or invalid response view.", content: { "application/json": { schema: schemaRef("Error") } } },
          "404": { description: "The issuer/form/time slice could not resolve to a filing (filing_not_found).", content: { "application/json": { schema: schemaRef("Error") } } },
        },
      },
    },
    "/v1/filings/latest/render": {
      get: {
        summary: "Render an issuer's latest selected filing as readable text",
        description: "Return a Markdown-like rendering of the latest selected filing for reading, local indexing, or downstream extraction. This route defaults to a 10-K, unlike the any-form latest-filing route. Check the selected filing, provenance, and truncated flag before treating the rendering as complete source text.",
        parameters: [
          filingTickerQueryParameter,
          filingSymbolQueryParameter,
          filingCikQueryParameter,
          { name: "form", in: "query", required: false, schema: { type: "string" }, description: "SEC form type to render. Defaults to 10-K, unlike GET /v1/filings/latest." },
          { name: "filing_year", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Calendar filing year filter." },
          { name: "fy", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Fiscal-year selector." },
        ],
      },
    },
    "/v1/filings/latest/sections/{section_key}": {
      get: {
        summary: "Extract a named section from an issuer's latest selected filing",
        description: "Retrieve one supported canonical filing section, such as item_1a, item_7, or item_8, from an issuer's latest selected filing. Use the returned accession number and source URL as the citation identity. The endpoint defaults to a 10-K and a missing or unavailable section is not evidence that the issuer made no disclosure.",
        parameters: [
          { name: "section_key", in: "path", required: true, schema: { type: "string" }, description: "Canonical filing section key, such as item_1a, item_7, or item_8; it is not arbitrary heading text." },
          filingTickerQueryParameter,
          filingSymbolQueryParameter,
          filingCikQueryParameter,
          { name: "form", in: "query", required: false, schema: { type: "string" }, description: "SEC form type. Defaults to 10-K." },
          { name: "filing_year", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Calendar filing year filter." },
          { name: "fy", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Fiscal-year selector." },
          sectionModeQueryParameter,
          sectionResponseViewQueryParameter,
        ],
        responses: {
          "200": {
            description: "Successful latest-section response. Default/full and compact modes return section content with provenance; view=agent returns citation fields and snippet metadata without contentMd.",
            content: { "application/json": { schema: filingSectionResponseSchema } },
          },
          "400": { description: "Invalid issuer selector, section mode, year selector, or response view.", content: { "application/json": { schema: schemaRef("Error") } } },
          "502": { description: "The latest filing section could not be resolved or rendered (section_lookup_failed).", content: { "application/json": { schema: schemaRef("Error") } } },
        },
      },
    },
    "/v1/filings/latest/risk-categories": {
      get: {
        summary: "Classify Item 1A risk categories in a selected issuer filing",
        description: "Return deterministic risk-category coverage derived from Item 1A in a selected covered filing. Use one issuer selector and optionally an accession number to make the filing explicit. Categories describe available extracted disclosure and should be verified against the cited filing before an investment conclusion.",
        parameters: [
          filingTickerQueryParameter,
          filingSymbolQueryParameter,
          filingCikQueryParameter,
          { name: "form", in: "query", required: false, schema: { type: "string" }, description: "SEC form type. Defaults to the latest covered risk-category filing." },
          { name: "accession_number", in: "query", required: false, schema: { type: "string" }, description: "Optional SEC accession number to inspect directly." },
        ],
      },
    },
    "/v1/board": {
      get: { summary: "Return the latest board composition derived from definitive proxy filings with director roster and committee coverage semantics" },
    },
    "/v1/funds/nport/holdings": {
      get: { summary: "Return the latest SEC N-PORT holdings roster with explicit capability semantics and balance-unit metadata" },
    },
    "/v1/filings/{accession_number}": {
      get: {
        summary: "Get one SEC filing record by its accession number",
        description: "Retrieve the materialized manifest for one immutable SEC accession number, including filing identity and source provenance. Optional issuer and form values are resolution hints, not substitutes for the accession number. A not-found response should not be silently replaced with a different or latest filing.",
        parameters: [
          { name: "accession_number", in: "path", required: true, schema: { type: "string" }, description: "Immutable SEC accession number for the filing to retrieve." },
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Optional issuer ticker hint used while resolving the accession." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Optional issuer CIK hint used while resolving the accession." },
          { name: "form", in: "query", required: false, schema: { type: "string" }, description: "Optional SEC form hint used while resolving the accession." },
          { name: "submission_file_limit", in: "query", required: false, schema: { type: "integer", minimum: 1 }, description: "Bound on SEC submission files inspected while resolving older filing coverage." },
          responseViewQueryParameter,
        ],
        responses: {
          "200": {
            description: "Filing manifest for the requested accession. Default returns the filing manifest, compact returns compact filing identity plus requestId, and view=agent returns the runtime agent filing record with lifted filingUrl.",
            content: { "application/json": { schema: filingDirectResponseSchema } },
          },
          default: { description: "Contract-aware error response. An accession that cannot be resolved returns 404 filing_not_found." },
        },
      },
    },
    "/v1/filings/{accession_number}/sections/{section_key}": {
      get: {
        summary: "Extract a named section from one accession-number filing",
        description: "Retrieve a supported canonical section from one explicitly selected SEC filing. The accession number fixes the source document; preserve it with the returned source URL and section key for a reproducible citation. A missing section or unresolved accession does not establish that the underlying disclosure is absent.",
        parameters: [
          { name: "accession_number", in: "path", required: true, schema: { type: "string" }, description: "Immutable SEC accession number for the filing to inspect." },
          { name: "section_key", in: "path", required: true, schema: { type: "string" }, description: "Canonical filing section key, such as item_1a, item_7, or item_8; it is not arbitrary heading text." },
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Optional ticker hint." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Optional CIK hint." },
          { name: "form", in: "query", required: false, schema: { type: "string" }, description: "Optional SEC form hint." },
          { name: "submission_file_limit", in: "query", required: false, schema: { type: "integer", minimum: 1 }, description: "Bound on SEC submission files inspected while resolving older filing coverage." },
          sectionModeQueryParameter,
          sectionResponseViewQueryParameter,
        ],
        responses: {
          "200": {
            description: "Extracted section for the requested accession. Default/full and compact modes return section content with provenance; view=agent returns citation fields and snippet metadata without contentMd.",
            content: { "application/json": { schema: filingSectionResponseSchema } },
          },
          "400": { description: "Invalid response mode, section mode, or request values.", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "404": { description: "The requested accession or section could not be resolved (section_lookup_failed).", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/v1/filings/pension-benefit-schedule": {
      get: {
        summary: "Extract disclosed pension and retiree benefit payments for a target year",
        description: "Extract expected pension and retiree benefit payments for a requested target year from a selected issuer filing when the rendered source discloses a usable schedule. Supply an issuer, filing year, and target year; preserve the source accession and provenance. An unavailable result is not a zero payment or a complete benefits forecast.",
        parameters: [
          filingTickerQueryParameter,
          filingSymbolQueryParameter,
          filingCikQueryParameter,
          { name: "filing_year", in: "query", required: true, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Calendar year of the filing to inspect; this identifies the disclosure vintage, not the payment year." },
          { name: "target_year", in: "query", required: true, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Expected pension or retiree benefit-payment year to extract from that filing's disclosed schedule." },
          { name: "form", in: "query", required: false, schema: { type: "string" }, description: "SEC form type. Defaults to 10-K." },
          { name: "accession_number", in: "query", required: false, schema: { type: "string" }, description: "Optional SEC accession number to inspect directly." },
        ],
      },
    },
    "/v1/statements/segmented-facts": {
      get: {
        summary: "Retrieve an issuer's disclosed segment revenue or profit/loss history with filing-level dimensions and source context",
        description: "Use this route to compare a disclosed segment metric across recent annual or quarterly filings. Select `metric` first, then use `segment_type` when the workflow needs a product, geographic, or other dimension. Rows preserve the issuer's reported axes, members, units, reporting periods, and filing provenance; a missing segment or unsupported capability is not a zero value. Keep the returned accession, filing URL, and freshness fields with any analysis. See [API conventions](/api-conventions) and [freshness and source evidence](/freshness-and-trust).",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker, for example JPM. Either ticker, symbol, or cik is required." },
          { name: "symbol", in: "query", required: false, schema: { type: "string" }, description: "Alias for ticker, for customers coming from market-data APIs." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Issuer CIK. Either ticker, symbol, or cik is required." },
          { name: "metric", in: "query", required: true, schema: { type: "string", enum: ["revenue", "profit_loss"] }, description: "Required disclosed metric: `revenue` or `profit_loss`. Values remain in the returned XBRL unit and are only comparable when unit, period, and segment definition align." },
          statementPeriodQueryParameter,
          { name: "segment_type", in: "query", required: false, schema: { type: "string", enum: ["geographic", "product", "other"] }, description: "Optional disclosed-dimension filter. Omit it to retain all supported dimensions; do not infer an omitted geographic or product split." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 6 }, description: "Maximum reporting periods to return (1-6). This bounds returned history rather than proving older disclosure is absent." },
          { name: "segment_limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 6 }, description: "Alias for limit when requesting bounded segment rows." },
          { name: "segmentLimit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 6 }, description: "Alias for segment_limit." },
          { name: "submission_file_limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 6 }, description: "Maximum SEC submission-history files to inspect (1-6). This bounds historical search depth, not the number of returned segment rows." },
          { name: "submissionFileLimit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 6 }, description: "Alias for submission_file_limit." },
        ],
        responses: {
          "200": {
            description: "Successful response. Returns a SegmentedFactSeries with bounded records and request metadata.",
            content: {
              "application/json": {
                schema: schemaRef("SegmentedFactSeries"),
                examples: {
                  default: {
                    summary: "Product segment profit/loss history",
                    value: {
                      object: "segmented_fact_series",
                      id: "segfact_cent_jpm_profit_loss_product",
                      createdAt: "2026-03-17T00:00:00.000Z",
                      livemode: true,
                      entityId: "cent_jpm_example",
                      ticker: "JPM",
                      companyName: "JPMorgan Chase & Co.",
                      period: "quarterly",
                      metric: "profit_loss",
                      capability: "supported",
                      records: [
                        {
                          segmentAxis: "us-gaap:StatementBusinessSegmentsAxis",
                          segmentMember: "jpm:ConsumerAndCommunityBankingMember",
                          segmentLabel: "Consumer & Community Banking",
                          segmentType: "product",
                          axisFamily: "business",
                          hierarchyDepth: 1,
                          isMostGranularSibling: true,
                          metricKey: "profit_loss",
                          taxonomy: "us-gaap",
                          tag: "ProfitLoss",
                          unit: "USD",
                          value: 4579000000,
                          periodStart: "2026-01-01",
                          periodEnd: "2026-03-31",
                          filingDate: "2026-04-12",
                          reportDate: "2026-03-31",
                          form: "10-Q",
                          accessionNumber: "0000019617-26-000123",
                          capability: "supported",
                          provenance: {
                            source: "sec",
                            accessionNumber: "0000019617-26-000123",
                            filingUrl: "https://www.sec.gov/Archives/edgar/data/19617/000001961726000123/jpm-20260331.htm",
                            retrievedAt: "2026-04-12T00:00:00.000Z",
                            parserVersion: "secapi-segmented-statements-v1",
                          },
                        },
                      ],
                      provenance: {
                        source: "sec",
                        accessionNumber: "0000019617-26-000123",
                        filingUrl: "https://www.sec.gov/Archives/edgar/data/19617/000001961726000123/jpm-20260331.htm",
                        retrievedAt: "2026-04-12T00:00:00.000Z",
                        parserVersion: "secapi-segmented-statements-v1",
                      },
                      requestId: "req_example",
                      traceparent: "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/v1/statements/segmented-revenues": {
      get: {
        summary: "Retrieve an issuer's disclosed product or geographic revenue history with filing-level dimensions and source context",
        description: "Use this route to analyze revenue splits the issuer actually disclosed in XBRL. Choose annual or quarterly cadence and, when useful, narrow to a product, geographic, or other reported dimension. Records retain the reported unit, period, segment hierarchy, capability status, and filing provenance; they are not a modeled revenue allocation. Preserve the returned accession, filing URL, and freshness fields before aggregating or presenting the result. See [API conventions](/api-conventions) and [freshness and source evidence](/freshness-and-trust).",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker, for example PFE. Either ticker, symbol, or cik is required." },
          { name: "symbol", in: "query", required: false, schema: { type: "string" }, description: "Alias for ticker, for customers coming from market-data APIs." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Issuer CIK. Either ticker, symbol, or cik is required." },
          statementPeriodQueryParameter,
          { name: "segment_type", in: "query", required: false, schema: { type: "string", enum: ["geographic", "product", "other"] }, description: "Optional disclosed-dimension filter. Omit it to retain all supported dimensions; no row does not establish that revenue was zero." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 6 }, description: "Maximum reporting periods to return (1-6). This bounds returned history rather than proving older disclosure is absent." },
          { name: "segment_limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 6 }, description: "Alias for limit when requesting bounded segment rows." },
          { name: "segmentLimit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 6 }, description: "Alias for segment_limit." },
          { name: "submission_file_limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 6 }, description: "Maximum SEC submission-history files to inspect (1-6). This bounds historical search depth, not the number of returned segment rows." },
          { name: "submissionFileLimit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 6 }, description: "Alias for submission_file_limit." },
        ],
        responses: {
          "200": {
            description: "Successful response. Returns a SegmentedRevenueSeries with bounded records and request metadata.",
            content: {
              "application/json": {
                schema: schemaRef("SegmentedRevenueSeries"),
                examples: {
                  default: {
                    summary: "Geographic revenue history",
                    value: {
                      object: "segmented_revenue_series",
                      id: "segrev_cent_pfe_geographic",
                      createdAt: "2026-03-17T00:00:00.000Z",
                      livemode: true,
                      entityId: "cent_pfe_example",
                      ticker: "PFE",
                      companyName: "Pfizer Inc.",
                      period: "quarterly",
                      capability: "supported",
                      records: [
                        {
                          segmentAxis: "us-gaap:StatementGeographicalAxis",
                          segmentMember: "us-gaap:UnitedStatesMember",
                          segmentLabel: "United States",
                          segmentType: "geographic",
                          axisFamily: "geography",
                          hierarchyDepth: 1,
                          isMostGranularSibling: true,
                          metricKey: "revenue",
                          taxonomy: "us-gaap",
                          tag: "Revenues",
                          unit: "USD",
                          value: 6200000000,
                          periodStart: "2026-01-01",
                          periodEnd: "2026-03-31",
                          filingDate: "2026-05-02",
                          reportDate: "2026-03-31",
                          form: "10-Q",
                          accessionNumber: "0000078003-26-000045",
                          capability: "supported",
                          provenance: {
                            source: "sec",
                            accessionNumber: "0000078003-26-000045",
                            filingUrl: "https://www.sec.gov/Archives/edgar/data/78003/000007800326000045/pfe-20260331.htm",
                            retrievedAt: "2026-05-02T00:00:00.000Z",
                            parserVersion: "secapi-segmented-statements-v1",
                          },
                        },
                      ],
                      provenance: {
                        source: "sec",
                        accessionNumber: "0000078003-26-000045",
                        filingUrl: "https://www.sec.gov/Archives/edgar/data/78003/000007800326000045/pfe-20260331.htm",
                        retrievedAt: "2026-05-02T00:00:00.000Z",
                        parserVersion: "secapi-segmented-statements-v1",
                      },
                      requestId: "req_example",
                      traceparent: "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/v1/statements/share-float": {
      get: {
        summary: "Retrieve an issuer's disclosed public float when available, with a clearly labeled shares-outstanding fallback",
        description: "Use this route when a workflow needs the public-float fact reported in SEC company facts and must distinguish it from a shares-outstanding proxy. Check `sourceMode`, `statusNote`, unit, reporting date, provenance, and freshness before using a value: `publicFloatUsd` may be null while `sharesOutstanding` is present. A proxy is not public float, market capitalization, or free float. See [API conventions](/api-conventions) and [freshness and source evidence](/freshness-and-trust).",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker. Either ticker, symbol, or cik is required." },
          { name: "symbol", in: "query", required: false, schema: { type: "string" }, description: "Alias for ticker, for customers coming from market-data APIs." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Issuer CIK. Either ticker, symbol, or cik is required." },
        ],
        ...jsonResponse("ShareFloat"),
      },
    },
    "/v1/sections/search": {
      get: {
        summary: "Search filing sections and snippets with filing-scoped filters and cursor pagination",
        parameters: [
          { name: "q", in: "query", required: false, schema: { type: "string" }, description: "Section search query." },
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Optional issuer ticker filter. `symbol` is accepted as an alias." },
          { name: "symbol", in: "query", required: false, schema: { type: "string" }, description: "Alias for ticker, for customers coming from market-data APIs. If both ticker and symbol are provided, they must match." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Optional issuer CIK filter." },
          { name: "form", in: "query", required: false, schema: { type: "string" }, description: "Optional filing form filter such as 10-K or 10-Q." },
          { name: "filing_id", in: "query", required: false, schema: { type: "string" }, description: "Optional stored filing id to scope section search to a single filing." },
          { name: "filing_year", in: "query", required: false, schema: { type: "integer" }, description: "Optional filing-year filter." },
          { name: "fy", in: "query", required: false, schema: { type: "integer" }, description: "Optional fiscal-year selector. With ticker, maps to the issuer fiscal-year filing-date window." },
          { name: "year", in: "query", required: false, schema: { type: "integer" }, description: "Alias for fy when ticker is present." },
          { name: "fp", in: "query", required: false, schema: { type: "string" }, description: "Optional fiscal period selector such as FY, Q1, Q2, Q3, or Q4." },
          { name: "quarter", in: "query", required: false, schema: { type: "string" }, description: "Alias for fp, such as FY, Q1, Q2, Q3, or Q4." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 100 }, description: "Maximum sections to return." },
          { name: "cursor", in: "query", required: false, schema: { type: "integer", minimum: 0 }, description: "Non-negative result offset from a previous page." },
          { name: "view", in: "query", required: false, schema: { type: "string", enum: ["default", "compact", "agent"] }, description: "Search response shape. Use agent for a compact citation-ready shape; compact is accepted for response-format consistency and currently matches the default search rows. Invalid values return invalid_query_parameter with details.acceptedValues." },
        ],
      },
    },
    "/v1/offerings": {
      get: {
        summary: "Find SEC registration statements and prospectuses for public-offering research",
        description: "Searches S-1 and 424B-family filing records. Results identify filed disclosures, not every capital raise or a completed offering. Preserve the accession number and source fields when reviewing a result: `filingDate` is the SEC disclosure date, not necessarily an offering or pricing date. Continue with the returned `nextCursor` value for the same filters. A lower `submission_file_limit` scans fewer SEC submission files and can omit older matches. See [API conventions](https://docs.secapi.ai/api-conventions).",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Optional issuer ticker filter." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Optional issuer CIK filter." },
          { name: "forms", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated offering forms, such as S-1, S-1/A, 424B4, or 424B5." },
          { name: "date_from", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive filing-date lower bound." },
          { name: "date_to", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive filing-date upper bound." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 25 }, description: "Maximum offering records to return." },
          { name: "cursor", in: "query", required: false, schema: { type: "integer", minimum: 0, maximum: 500, default: 0 }, description: "Non-negative pagination offset." },
          { name: "submission_file_limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50 }, description: "Maximum SEC submission files to inspect while looking for offering filings." },
          { name: "view", in: "query", required: false, schema: { type: "string", enum: ["default", "compact", "agent"] }, description: "Use agent for a compact citation-oriented offering record. Compact currently matches the default row shape." },
        ],
      },
    },
    "/v1/forms/144": {
      get: {
        summary: "Return recent Form 144 notices of proposed insider sales with cursor pagination and date filters",
        description: "Use this route to review filed notices of proposed Rule 144 sales by an issuer's affiliates. A notice is not a completed sale, a trade execution record, or a measure of the holder's remaining position; corroborate a later Form 4 or other filing when the workflow needs completed transactions. `date_from` and `date_to` bound filing dates, and `submission_file_limit` can reduce the SEC submission history searched, which can omit older records. Follow `nextCursor` with the same filters. See [filing conventions](/api-conventions) and [insider transaction workflows](/api-reference/insiders).",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Optional ticker filter." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Optional CIK filter." },
          { name: "date_from", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive filing-date lower bound." },
          { name: "date_to", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive filing-date upper bound." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 25 }, description: "Maximum Form 144 filings to return." },
          { name: "cursor", in: "query", required: false, schema: { type: "integer", minimum: 0, default: 0 }, description: "Non-negative result offset from a previous page." },
          { name: "submission_file_limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50 }, description: "Maximum SEC submission files to inspect while looking for Form 144 filings." },
        ],
      },
    },
    "/v1/forms/d": {
      get: {
        summary: "Return recent Form D private-offering filings with DB/SEC source-stable cursor pagination",
        description: "Use this route to find filed Form D and D/A notices for private-placement research. A Form D notice does not establish that an offering closed, that all securities were sold, or that every economic term is public. `date_from` and `date_to` bound filing dates. Continue with the returned `db:` or `sec:` cursor unchanged and keep the same filters; the prefix keeps a paged review on its original source. If SEC fallback is used, a lower `submission_file_limit` can omit older matches. Retrieve a selected accession before relying on parsed terms. See [Form D API guidance](/seo/sec-form-d-api) and [API conventions](/api-conventions).",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Optional ticker filter." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Optional CIK filter." },
          { name: "date_from", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive filing-date lower bound." },
          { name: "date_to", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive filing-date upper bound." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 25 }, description: "Maximum Form D filings to return." },
          { name: "cursor", in: "query", required: false, schema: { type: "string" }, description: "Non-negative offset or source-prefixed cursor such as db:25 or sec:25." },
          { name: "submission_file_limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50 }, description: "Maximum SEC submission files to inspect when falling back to SEC submissions." },
        ],
      },
    },
    "/v1/forms/d/{accessionNumber}": {
      get: {
        summary: "Return structured Form D offering data parsed from the filing XML",
        description: "Use this route after selecting a Form D accession to inspect structured values parsed from that filing's XML. The result reflects the filed notice, not independent verification that a financing closed, that all securities were sold, or that undisclosed terms do not exist. Retain the accession number and filing source when reporting values, and review the linked filing when a field affects a capital-raise conclusion. See [Form D API guidance](/seo/sec-form-d-api) and [API conventions](/api-conventions).",
        parameters: [
          { name: "accessionNumber", in: "path", required: true, schema: { type: "string" }, description: "SEC accession number for the Form D filing." },
        ],
      },
    },
    "/v1/forms/ncen": {
      get: {
        summary: "Return recent Form N-CEN annual census filings with cursor pagination and date filters",
        description: "Use this route to locate filed Form N-CEN annual census reports for registered investment companies. Results are filing records, not a current fund roster, portfolio-holdings dataset, or proof of a fund's current registration status. `date_from` and `date_to` bound filing dates, while `submission_file_limit` can reduce the SEC submission history searched and omit older records. Follow `nextCursor` with the same filters and review the cited filing for report-period context. See [filing conventions](/api-conventions).",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Optional ticker filter." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Optional CIK filter." },
          { name: "date_from", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive filing-date lower bound." },
          { name: "date_to", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive filing-date upper bound." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 25 }, description: "Maximum Form N-CEN filings to return." },
          { name: "cursor", in: "query", required: false, schema: { type: "integer", minimum: 0, default: 0 }, description: "Non-negative pagination offset." },
          { name: "submission_file_limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50 }, description: "Maximum SEC submission files to inspect." },
        ],
      },
    },
    "/v1/forms/npx": {
      get: {
        summary: "Return recent Form N-PX proxy voting filings with cursor pagination and date filters",
        description: "Use this route to locate filed Form N-PX proxy-voting disclosures for a fund or manager review. Results identify filings, not a complete current holdings list, an issuer-level vote tally, or an interpretation of voting intent. `date_from` and `date_to` bound filing dates; the filing's own reporting period may differ. A lower `submission_file_limit` can omit older SEC submission matches. Follow `nextCursor` with the same filters and retain the accession number for review. See [filing conventions](/api-conventions).",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Optional ticker filter." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Optional CIK filter." },
          { name: "date_from", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive filing-date lower bound." },
          { name: "date_to", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive filing-date upper bound." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 25 }, description: "Maximum Form N-PX filings to return." },
          { name: "cursor", in: "query", required: false, schema: { type: "integer", minimum: 0, default: 0 }, description: "Non-negative pagination offset." },
          { name: "submission_file_limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50 }, description: "Maximum SEC submission files to inspect." },
        ],
      },
    },
    "/v1/forms/c": {
      get: {
        summary: "Return recent Form C crowdfunding offering filings with cursor pagination and date filters",
        description: "Use this route to find filed Form C crowdfunding-offering disclosures. A filing record is not proof that a campaign reached its target, closed, or sold all offered securities; review the cited filing and any later amendments for the disclosed status. `date_from` and `date_to` bound filing dates. `submission_file_limit` can reduce the SEC submission history searched, so lower values can omit older records. Follow `nextCursor` with the same filters. See [filing conventions](/api-conventions).",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Optional ticker filter." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Optional CIK filter." },
          { name: "date_from", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive filing-date lower bound." },
          { name: "date_to", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive filing-date upper bound." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 25 }, description: "Maximum Form C filings to return." },
          { name: "cursor", in: "query", required: false, schema: { type: "integer", minimum: 0, default: 0 }, description: "Non-negative pagination offset." },
          { name: "submission_file_limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50 }, description: "Maximum SEC submission files to inspect." },
        ],
      },
    },
    "/v1/forms/1-a": {
      get: {
        summary: "Return recent Regulation A Form 1-A offering filings with cursor pagination and date filters",
        description: "Use this route to find filed Regulation A Form 1-A offering statements. A Form 1-A filing is a disclosure record, not confirmation that the SEC qualified an offering, that a sale occurred, or that the full raise was completed. `date_from` and `date_to` bound filing dates. `submission_file_limit` can reduce the SEC submission history searched, so lower values can omit older records. Follow `nextCursor` with the same filters and review the cited filing for offering-stage context. See [filing conventions](/api-conventions).",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Optional ticker filter." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Optional CIK filter." },
          { name: "date_from", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive filing-date lower bound." },
          { name: "date_to", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive filing-date upper bound." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 25 }, description: "Maximum Form 1-A filings to return." },
          { name: "cursor", in: "query", required: false, schema: { type: "integer", minimum: 0, default: 0 }, description: "Non-negative pagination offset." },
          { name: "submission_file_limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50 }, description: "Maximum SEC submission files to inspect." },
        ],
      },
    },
    "/v1/companies/subsidiaries": {
      get: {
        summary: "Retrieve subsidiaries disclosed in an issuer's latest available 10-K Exhibit 21",
        description: "Use this route to review subsidiaries an issuer disclosed in Exhibit 21 of its latest available 10-K. The result is an extracted filing schedule, not a current legal-entity registry, complete ownership chart, or confirmation that an issuer has no other subsidiaries. An empty list can mean the selected filing lacks a usable Exhibit 21. Preserve the returned accession, filing date, and request metadata when presenting the default result; `filingUrl` is included only in `agent` view. See [filing conventions](/api-conventions) and [freshness and source evidence](/freshness-and-trust).",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker. Either ticker or cik is required; use CIK when issuer identity or ticker history could be ambiguous." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Issuer CIK. Either ticker or cik is required; CIK is the SEC-stable issuer identifier." },
          { name: "view", in: "query", required: false, schema: { type: "string", enum: ["default", "agent"] }, description: "Response shape. Use `agent` for the compact subsidiary rows with filing citation fields; omit it or use `default` for the fuller response." },
        ],
      },
    },
    "/v1/companies/audit-fees": {
      get: {
        summary: "Return principal-accountant fee rows extracted from the latest DEF 14A or 10-K for an issuer",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker. Provide ticker or cik; cik is preferable when ticker history matters." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Issuer CIK. Provide ticker or cik; cik is preferable when ticker history matters." },
        ],
        ...inlineJsonResponse({
          type: "object",
          additionalProperties: true,
          required: ["object", "data", "accessionNumber", "filingDate", "sourceForm", "lineage", "requestId"],
          properties: {
            object: { type: "string", const: "list" },
            data: {
              type: "array",
              description: "Parsed fee rows. Empty when no eligible filing or fee table is found.",
              items: {
                type: "object",
                required: ["object", "category", "amount", "rawText"],
                properties: {
                  object: { type: "string", const: "audit_fee_entry" },
                  category: { type: "string", description: "Parser-assigned fee category from the filing table." },
                  amount: { type: ["number", "null"], description: "First parseable dollar amount for the category, when available." },
                  rawText: { type: "string", description: "Source table text used to derive the category and amount." },
                },
              },
            },
            accessionNumber: { type: ["string", "null"], description: "Accession number of the filing selected for extraction." },
            filingDate: { type: ["string", "null"], description: "Filing date of the filing selected for extraction." },
            sourceForm: { type: ["string", "null"], description: "DEF 14A when available; otherwise the latest 10-K." },
            note: { type: "string", description: "Explanation when no eligible filing or audit-fee table is found." },
            lineage: {
              type: "object",
              required: ["sources", "canonical", "surface"],
              properties: {
                sources: { type: "array", items: { type: "string" }, example: ["sec_edgar"] },
                canonical: { type: "boolean", const: true },
                surface: { type: "string", const: "companies" },
              },
            },
            requestId: { type: "string" },
            traceparent: { type: "string" },
          },
        }, {
          object: "list",
          data: [{
            object: "audit_fee_entry",
            category: "Audit Fees",
            amount: 25000000,
            rawText: "Audit Fees: $25,000,000",
          }],
          accessionNumber: "0000320193-25-000079",
          filingDate: "2025-10-31",
          sourceForm: "DEF 14A",
          lineage: { sources: ["sec_edgar"], canonical: true, surface: "companies" },
          requestId: "req_example_audit_fees",
          traceparent: "00-0123456789abcdef0123456789abcdef-0123456789abcdef-01",
        }, "Audit-fee rows with the selected filing identity and SEC EDGAR lineage."),
      },
    },
    "/v1/events/ma": {
      get: {
        summary: "Discover filing-derived merger and acquisition signals from public-company disclosures",
        description: "Returns merger and acquisition candidates inferred from SEC filings and relevant exhibits. It is a research surface, not a definitive deal feed or closing-status record. Preserve the cited accession and source fields, and treat filing dates as disclosure timing rather than announcement, signing, or closing dates. Use the returned `nextCursor` value with the same filters. The bounded submission scan can leave older matching filings outside the result. See [API conventions](https://docs.secapi.ai/api-conventions).",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Issuer CIK." },
          { name: "date_from", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive filing-date lower bound." },
          { name: "date_to", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive filing-date upper bound." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 25 }, description: "Maximum M&A events to return." },
          { name: "cursor", in: "query", required: false, schema: { type: "integer", minimum: 0, maximum: 500, default: 0 }, description: "Non-negative pagination offset." },
          { name: "submission_file_limit", in: "query", required: false, schema: { type: "integer", minimum: 12, maximum: 50 }, description: "Maximum SEC submission files to inspect while looking for M&A events." },
          { name: "view", in: "query", required: false, schema: { type: "string", enum: ["default", "compact", "agent"] }, description: "Response shape. Use agent for a compact cited deal record; compact currently matches the default row shape." },
        ],
      },
    },
    "/v1/events/enforcement": {
      get: {
        summary: "Search official SEC enforcement releases, proceedings, and accounting actions",
        description: "Searches official SEC litigation releases, administrative proceedings, and Accounting and Auditing Enforcement Releases (AAERs). Preserve release URLs and source fields when reviewing a result. `publishedAt` is the source publication date; classifications and extracted penalties are derived fields, and a missing penalty is not zero. Continue with the returned `nextCursor` value for the same filters. See [API conventions](https://docs.secapi.ai/api-conventions).",
        parameters: [
          { name: "query", in: "query", required: false, schema: { type: "string" }, description: "Full-text search across enforcement title, excerpt, release number, and document URL." },
          { name: "source_type", in: "query", required: false, schema: { type: "string", enum: ["litigation_release", "administrative_proceeding", "aaer"] }, description: "SEC enforcement source family." },
          { name: "violation_type", in: "query", required: false, schema: { type: "string", enum: ["fraud", "insider_trading", "reporting_violation", "market_manipulation", "registration_violation", "investment_adviser", "broker_dealer", "municipal_securities", "other"] }, description: "Classifier-derived violation family." },
          { name: "respondent", in: "query", required: false, schema: { type: "string" }, description: "Respondent name text filter." },
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker to resolve against respondent names." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Issuer CIK to resolve against respondent names." },
          { name: "penalty_min", in: "query", required: false, schema: { type: "number", minimum: 0 }, description: "Minimum penalty amount in USD." },
          { name: "penalty_max", in: "query", required: false, schema: { type: "number", minimum: 0 }, description: "Maximum penalty amount in USD." },
          { name: "date_from", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive publication-date lower bound." },
          { name: "date_to", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive publication-date upper bound." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 25 }, description: "Maximum enforcement events to return." },
          { name: "cursor", in: "query", required: false, schema: { type: "integer", minimum: 0, maximum: 500, default: 0 }, description: "Non-negative pagination offset." },
          { name: "view", in: "query", required: false, schema: { type: "string", enum: ["default", "compact", "agent"] }, description: "Response shape. Use agent for a compact cited release record; compact currently matches the default row shape." },
        ],
      },
    },
    "/v1/events/restatements": {
      get: {
        summary: "Find 8-K Item 4.02 non-reliance and restatement disclosures with affected periods",
        description: "Finds issuer disclosures under 8-K Item 4.02, including non-reliance and restatement-related events. It reports filing-derived classifications and extracted periods, not an independent accounting conclusion or a complete restatement universe. Preserve accession and source fields when reviewing a result. Filing dates are disclosure dates, and bounded submission scans can omit older eligible filings. Continue with the returned `nextCursor` value for the same filters. See [API conventions](https://docs.secapi.ai/api-conventions).",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Issuer CIK." },
          { name: "date_from", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive filing-date lower bound." },
          { name: "date_to", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive filing-date upper bound." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 25 }, description: "Maximum restatement events to return." },
          { name: "cursor", in: "query", required: false, schema: { type: "integer", minimum: 0, maximum: 500, default: 0 }, description: "Non-negative pagination offset." },
          { name: "submission_file_limit", in: "query", required: false, schema: { type: "integer", minimum: 16, maximum: 50 }, description: "Maximum SEC submission files to inspect while looking for restatement events." },
        ],
      },
    },
    "/v1/events/auditor-changes": {
      get: {
        summary: "Find 8-K Item 4.01 auditor dismissal, resignation, and engagement disclosures",
        description: "Finds auditor-change events derived from 8-K Item 4.01 disclosures. Change types summarize the filing and should be checked against the cited source before making a governance or accounting claim. Preserve accession and source fields, and treat filing dates as disclosure dates rather than effective-change dates. Coverage is bounded by the submission scan; continue with the returned `nextCursor` value for the same filters. See [API conventions](https://docs.secapi.ai/api-conventions).",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Issuer CIK." },
          { name: "date_from", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive filing-date lower bound." },
          { name: "date_to", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive filing-date upper bound." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 25 }, description: "Maximum auditor-change events to return." },
          { name: "cursor", in: "query", required: false, schema: { type: "integer", minimum: 0, maximum: 500, default: 0 }, description: "Non-negative pagination offset." },
          { name: "submission_file_limit", in: "query", required: false, schema: { type: "integer", minimum: 16, maximum: 50 }, description: "Maximum SEC submission files to inspect while looking for auditor-change events." },
        ],
      },
    },
    "/v1/events/officer-changes": {
      get: {
        summary: "Find 8-K Item 5.02 officer and director appointment and departure disclosures",
        description: "Finds officer and director changes derived from 8-K Item 5.02 filings, including appointments, departures, resignations, and terminations. These are filing-derived classifications, not a complete employment-history or board record. Preserve accession and source fields, and treat filing dates as disclosure dates. A bounded submission scan can omit older eligible filings; continue with the returned `nextCursor` value for the same filters. See [API conventions](https://docs.secapi.ai/api-conventions).",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Issuer CIK." },
          { name: "date_from", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive filing-date lower bound." },
          { name: "date_to", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive filing-date upper bound." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 25 }, description: "Maximum officer-change events to return." },
          { name: "cursor", in: "query", required: false, schema: { type: "integer", minimum: 0, default: 0 }, description: "Non-negative pagination offset." },
          { name: "submission_file_limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50 }, description: "Maximum SEC submission files to inspect while looking for officer-change events." },
        ],
      },
    },
    "/v1/events/ipo": {
      get: {
        summary: "Find filing-derived IPO and public-offering candidates from registration filings",
        description: "Finds IPO and public-offering candidates inferred from S-1, F-1, and 424B filings; it does not confirm that an offering priced, closed, or began trading. Treat filing dates as disclosure dates, preserve accession and source fields, and continue with the returned `nextCursor` value for the same filters. The supported forms and bounded submission scan define coverage, so no result is not proof that no offering occurred. See [API conventions](https://docs.secapi.ai/api-conventions).",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Issuer CIK." },
          { name: "date_from", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive filing-date lower bound." },
          { name: "date_to", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive filing-date upper bound." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 25 }, description: "Maximum IPO events to return." },
          { name: "cursor", in: "query", required: false, schema: { type: "integer", minimum: 0, default: 0 }, description: "Non-negative pagination offset." },
          { name: "submission_file_limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50 }, description: "Maximum SEC submission files to inspect while looking for IPO events." },
        ],
      },
    },
    "/v1/events/voting-results": {
      get: {
        summary: "Retrieve structured shareholder-vote results from 8-K Item 5.07 filings",
        description: "Returns proposals, vote counts, and reported outcomes extracted from 8-K Item 5.07 disclosures for one issuer. It is not a universal proxy-voting archive: issuer identity is required, coverage is limited to eligible filings scanned, and proposal interpretation should retain the cited accession and source fields. Treat filing dates as disclosure dates and continue with the returned `nextCursor` value for the same filters. See [API conventions](https://docs.secapi.ai/api-conventions).",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker. Either ticker or cik is required." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Issuer CIK. Either ticker or cik is required." },
          { name: "date_from", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive filing-date lower bound." },
          { name: "date_to", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive filing-date upper bound." },
          { name: "meeting_type", in: "query", required: false, schema: { type: "string", enum: ["annual", "special"] }, description: "Optional meeting-type filter." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 25 }, description: "Maximum voting-results events to return." },
          { name: "cursor", in: "query", required: false, schema: { type: "integer", minimum: 0, maximum: 500, default: 0 }, description: "Non-negative pagination offset." },
          { name: "submission_file_limit", in: "query", required: false, schema: { type: "integer", minimum: 16, maximum: 50 }, description: "Maximum SEC submission files to inspect while looking for voting-results events." },
          { name: "view", in: "query", required: false, schema: { type: "string", enum: ["default", "compact", "agent"] }, description: "Response shape. Use agent for a compact cited voting-results record; compact currently matches the default row shape." },
        ],
      },
    },
    "/v1/earnings/transcripts": {
      get: { summary: "Return SEC-furnished earnings materials from 8-K filings with release, remarks, and transcript coverage states" },
    },
    "/v1/market/calendar": {
      get: {
        summary: "Check scheduled trading sessions for a supported market",
        description: "Use this route before scheduling a market-data job or interpreting a missing daily observation. It returns a bounded calendar window for one supported market and identifies whether each row uses configured-holiday or weekend-only coverage. `sessionStatus` is a schedule, not evidence that trading occurred or that an exchange did not change its hours. Preserve `coverage`, `confidence`, `statusNote`, and row-level `provenance` when a workflow depends on the result. See [API conventions](https://docs.secapi.ai/api-conventions).",
        parameters: [
          { name: "market", in: "query", required: false, schema: { type: "string", default: "XNYS" }, description: "Supported ISO market identifier. Defaults to XNYS when omitted; unsupported values also use the XNYS calendar." },
          { name: "start", in: "query", required: false, schema: { type: "string", format: "date" }, description: "First calendar date in YYYY-MM-DD format. Defaults to the current date." },
          { name: "duration", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 31, default: 7 }, description: "Number of consecutive calendar dates to return. Values above 31 are capped at 31." },
        ],
      },
    },
    "/v1/market/snapshots": {
      get: {
        summary: "Retrieve stored latest-price snapshots for one or more symbols",
        description: "Use this route to populate a bounded quote view from stored latest snapshots. Supply `symbols` as a comma-separated list, or one `ticker` alias. Results preserve request order, but a missing requested symbol is reported in `degradedState.missingSymbols` rather than represented as a zero price. Inspect each row's `asOf`, `freshness`, `provenance`, `sourceRights`, and `revision` before presenting a value as current. See [API conventions](https://docs.secapi.ai/api-conventions).",
        parameters: [
          { name: "symbols", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated security symbols. Supply this or ticker. Requests accept at most 250 distinct symbols, each no longer than 32 characters." },
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Single-symbol alias for symbols. Supply this or symbols." },
        ],
        ...jsonResponse("MarketSnapshotList", "Stored latest-market snapshots in request order, with a degraded-state indicator when requested symbols are absent."),
      },
    },
    "/v1/market/bars": {
      get: {
        summary: "Retrieve daily OHLCV history for one security",
        description: "Use this route to build a daily price series for one symbol. Supply `ticker` or its `symbol` alias, then narrow the date range before requesting a long history. The route returns daily bars only; `adjusted` is accepted for compatibility but does not change the stored response shape. A returned list is not a guarantee that every trading day in the requested range is present. Preserve each bar's timestamp, freshness, provenance, source-rights, and revision fields when comparing or charting the series. See [API conventions](https://docs.secapi.ai/api-conventions).",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Security symbol. Supply ticker or symbol." },
          { name: "symbol", in: "query", required: false, schema: { type: "string" }, description: "Alias for ticker. Supply ticker or symbol." },
          { name: "date_from", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive first bar date in YYYY-MM-DD format. Defaults to approximately one year before the request." },
          { name: "date_to", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive last bar date in YYYY-MM-DD format. Defaults to the request date." },
          { name: "adjusted", in: "query", required: false, schema: { type: "boolean" }, description: "Compatibility flag for adjusted-bar requests. Preserve the returned bar metadata rather than assuming an adjustment method." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 1000, default: 365 }, description: "Maximum bars to return. Values above 1,000 are capped." },
        ],
        ...jsonResponse("MarketBarList", "Daily OHLCV bars for the requested security and date range."),
      },
    },
    "/v1/market/corporate-actions": {
      get: {
        summary: "Retrieve splits and dividends for one security",
        description: "Use this route to reconcile splits and cash dividends with a price-history workflow. Supply `ticker` or its `symbol` alias and constrain the date range when you know the event window. `ratio` applies to splits and `cashAmount` applies to dividends when the relevant value is available; neither field turns an event into a total-return calculation. Preserve the ex-date, source-rights, provenance, freshness, and revision fields, and treat an empty list as no returned events for the requested range rather than proof that none occurred. See [API conventions](https://docs.secapi.ai/api-conventions).",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Security symbol. Supply ticker or symbol." },
          { name: "symbol", in: "query", required: false, schema: { type: "string" }, description: "Alias for ticker. Supply ticker or symbol." },
          { name: "date_from", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive first event date in YYYY-MM-DD format. Defaults to approximately one year before the request." },
          { name: "date_to", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive last event date in YYYY-MM-DD format. Defaults to the request date." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 1000, default: 250 }, description: "Maximum actions to return. Values above 1,000 are capped." },
        ],
        ...jsonResponse("CorporateActionList", "Split and dividend events for the requested security and date range."),
      },
    },
    "/v1/market/reference": {
      get: {
        summary: "Retrieve reference metadata and identifiers for one security",
        description: "Use this route to normalize a known security symbol before joining it to SEC records, market history, or an issuer view. Supply `ticker` or its `symbol` alias. The response can include identifiers, listing fields, classification, and market-cap context when available; null fields are unavailable values, not inferred substitutes. Preserve the returned symbol, CIK, FIGIs, `asOf`, freshness, provenance, source-rights, and revision metadata. See [API conventions](https://docs.secapi.ai/api-conventions).",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Security symbol. Supply ticker or symbol." },
          { name: "symbol", in: "query", required: false, schema: { type: "string" }, description: "Alias for ticker. Supply ticker or symbol." },
        ],
        ...jsonResponse("MarketReference"),
      },
    },
    "/v1/news/stories": {
      get: {
        summary: "Return rights-safe news stories with entity tagging, provenance, and source-rights metadata",
        parameters: [
          { name: "ticker", in: "query", schema: { type: "string" } },
          { name: "cik", in: "query", schema: { type: "string" } },
          { name: "q", in: "query", schema: { type: "string" } },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 50 } },
        ],
      },
    },
    "/v1/news/search": {
      get: {
        summary: "Search rights-safe news coverage and issuer communications by symbol, entity, or topic",
        parameters: [
          { name: "q", in: "query", required: true, schema: { type: "string" } },
          { name: "ticker", in: "query", schema: { type: "string" } },
          { name: "cik", in: "query", schema: { type: "string" } },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 50 } },
        ],
      },
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
      get: {
        summary: "Return official-source macro indicator observations with revision-aware provenance and country-quality metadata",
        parameters: macroResponseParams([
          { name: "indicator", in: "query", required: true, schema: { type: "string" }, description: "Indicator key (alias: indicator_key)" },
          { name: "country", in: "query", schema: { type: "string", default: "US" }, description: "ISO country code (e.g. US, JP, CN)" },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 240, default: 24 }, description: "Maximum observations to return (default 24, max 240)" },
        ]),
      },
    },
    "/v1/macro/releases": {
      get: {
        summary: "Return macro release observations with actual, prior, consensus, and surprise metadata",
        parameters: macroResponseParams([
          { name: "country", in: "query", schema: { type: "string", default: "US" }, description: "ISO country code (e.g. US, JP, CN)" },
          { name: "indicator", in: "query", schema: { type: "string" }, description: "Optional indicator key filter (alias: indicator_key)" },
          { name: "status", in: "query", schema: { type: "string", enum: ["released", "scheduled"], default: "released" }, description: "Released history by default. Use scheduled to return upcoming calendar events." },
          { name: "days", in: "query", schema: { type: "integer", minimum: 1, maximum: 180, default: 45 }, description: "Look-ahead window when status=scheduled." },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 120, default: 12 }, description: "Maximum releases to return (default 12, max 120)" },
        ]),
      },
    },
    "/v1/macro/calendar": {
      get: {
        summary: "Return the macro event calendar for supported official-source releases and central-bank events",
        parameters: macroResponseParams([
          { name: "country", in: "query", schema: { type: "string", default: "US" }, description: "ISO country code (e.g. US, JP, CN)" },
          { name: "indicator", in: "query", schema: { type: "string" }, description: "Optional indicator key filter (alias: indicator_key)" },
          { name: "days", in: "query", schema: { type: "integer", minimum: 1, maximum: 180, default: 45 }, description: "Look-ahead window in days (default 45, max 180)" },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 120, default: 120 }, description: "Maximum scheduled events to return (default/max 120)" },
        ]),
      },
    },
    "/v1/macro/forecasts": {
      get: {
        summary: "Return SEC API forecast baselines and scenario-aware macro projections with methodology metadata",
        parameters: macroResponseParams([
          { name: "country", in: "query", schema: { type: "string", default: "US" }, description: "ISO country code (e.g. US, JP, CN)" },
          { name: "indicator", in: "query", schema: { type: "string" }, description: "Optional indicator key filter (alias: indicator_key)" },
          { name: "horizons", in: "query", schema: { type: "integer", minimum: 1, maximum: 6, default: 3 }, description: "Number of forecast horizons to return (default 3, max 6)" },
        ], { responseModeDefault: "compact" }),
      },
    },
    "/v1/macro/high-signal-pack": {
      get: {
        summary: "Return the launch-ring Tier-1 high-signal macro pack with explicit source, fallback, and release-calendar posture for supported countries",
        parameters: [
          ...macroResponseParams([
            { name: "country", in: "query", schema: { type: "string", default: "US" }, description: "ISO country code (e.g. US, JP, CN). Defaults to US." },
          ], { responseModeDefault: "compact" }),
        ],
        responses: {
          "200": {
            description: "Successful response. Defaults to compact; pass response_mode=standard or include=series for the full nested pack.",
            content: jsonContentWithExample("MacroHighSignalPack"),
          },
        },
      },
    },
    "/v1/macro/regimes": {
      get: {
        summary: "Return the current macro regime classification for a country using the canonical SEC API macro overlay",
        parameters: macroResponseParams([
          { name: "country", in: "query", schema: { type: "string", default: "US" }, description: "ISO country code (e.g. US, JP, CN)" },
          { name: "lookback", in: "query", schema: { type: "string", default: "18m" }, description: "Lookback window for regime inference." },
        ]),
        responses: {
          "200": {
            description: "Successful response.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    object: { type: "string", enum: ["list"] },
                    data: { type: "array", items: schemaRef("MacroRegime") },
                    hasMore: { type: "boolean" },
                    nextCursor: { type: ["string", "null"] },
                    requestId: { type: "string" },
                  },
                  required: ["object", "data"],
                },
              },
            },
          },
        },
      },
    },
    "/v1/macro/overview": {
      get: {
        summary: "Return a one-call country macro dashboard: headline indicators with latest/previous/change/direction and next release, the current regime, upcoming releases, and the sovereign credit rating",
        parameters: macroResponseParams([
          { name: "country", in: "query", schema: { type: "string", default: "US" }, description: "ISO country code (e.g. US, JP, CN). Defaults to US." },
        ]),
        ...jsonResponse("MacroOverview"),
      },
    },
    "/v1/macro/all": {
      get: {
        summary: "Return a bulk, filterable export of macro observations across countries and indicators, with cursor pagination and CSV or async export",
        parameters: [
          { name: "country", in: "query", schema: { type: "string" }, description: "ISO country code, or a comma-separated list (alias: countries). Defaults to US." },
          { name: "indicator_type", in: "query", schema: { type: "string", enum: ["growth", "inflation", "labor", "rates", "trade", "fiscal", "housing", "sentiment", "money", "other"] }, description: "Filter by macro indicator type." },
          { name: "indicator", in: "query", schema: { type: "string" }, description: "Filter by a specific indicator key." },
          { name: "frequency", in: "query", schema: { type: "string", enum: ["daily", "weekly", "monthly", "quarterly", "annual"] }, description: "Filter by observation frequency." },
          { name: "date_from", in: "query", schema: { type: "string" }, description: "Inclusive lower bound on the observation period (ISO date)." },
          { name: "date_to", in: "query", schema: { type: "string" }, description: "Inclusive upper bound on the observation period (ISO date)." },
          { name: "cursor", in: "query", schema: { type: "string" }, description: "Opaque pagination cursor from the previous page's nextCursor." },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 1000, default: 250 }, description: "Maximum observations per page (default 250, max 1000)." },
          { name: "format", in: "query", schema: { type: "string", enum: ["json", "csv"], default: "json" }, description: "Response format. csv returns an attachment; oversized exports are materialized asynchronously and returned as an export job." },
        ],
        ...jsonResponseOneOf(["MacroObservationList", "MacroExportJob"], "A page of macro observations, or — when the filtered result set is too large to inline — an async export job whose signed download URL is delivered via the export.completed webhook event."),
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
        summary: "Return compact SEC API factor definitions, with trust and methodology metadata available on request",
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
            schema: { type: "string", enum: ["1d", "5d", "10d", "1m", "3m", "6m", "1y", "ytd", "max"], default: "1y" },
            description: "Trailing observation window for the returned chart series. Defaults to 1y for token-efficient agent and dashboard workflows. YTD covers Jan 1 of the latest observation's year through the latest market date. MAX requests the public launch-history floor, 2015-01-01, through the latest complete market date when row-level coverage exists for the factor.",
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
            schema: { type: "string", enum: ["1d", "5d", "10d", "1m", "3m", "6m", "1y", "ytd", "max"], default: "1y" },
            description: "Trailing observation window for the returned sparkline points. Defaults to 1y for token-efficient dashboard and agent workflows. YTD covers Jan 1 of the latest observation's year through the latest market date. MAX requests the public launch-history floor, 2015-01-01, through the latest complete market date when row-level coverage exists for each factor.",
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
        summary: "Return factor exposures for securities, portfolios, or watchlists.",
        description: "Use `symbols=A,B,C` to request multiple securities. Each returned row includes its source `symbol` and `subjectKey`, so you can match results to requested symbols without relying on row order. `unresolvedSymbols` lists requested symbols with no exposure rows, including securities outside supported historical coverage, so unavailable coverage is distinct from a zero beta.",
        parameters: factorResponseParams([
          { name: "symbols", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated symbols to load exposures for. Required unless `symbol`, `ticker`, or `tickers` is provided. Each response row echoes its originating ticker in `symbol` so batched results attribute back to the requested symbols directly." },
          { name: "symbol", in: "query", schema: { type: "string" }, description: "Single-symbol alias for symbols." },
          { name: "ticker", in: "query", schema: { type: "string" }, description: "Single-ticker alias for symbols." },
          { name: "tickers", in: "query", schema: { type: "string" }, description: "Comma-separated ticker alias for symbols." },
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
        summary: "Return factor return attribution for a portfolio with explained return, residual/unexplained return, and compact contribution rows",
        parameters: factorResponseParams(),
        ...jsonRequestBody("PortfolioAttributionRequest"),
        ...jsonFactorResponse("PortfolioAttribution"),
      },
    },
    "/v1/portfolio/risk": {
      post: {
        summary: "Return ex-ante portfolio risk: tracking error, CTEV by factor group and by security, ex-ante beta, and the factor-vs-idiosyncratic split, labelled with model coverage",
        parameters: factorResponseParams(),
        ...jsonRequestBody("PortfolioRiskRequest"),
        ...jsonFactorResponse("PortfolioRisk"),
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
        summary: "Return factor-rotation research scenarios informed by macro regime context and factor state",
        parameters: factorResponseParams(),
        ...jsonRequestBody("FactorStrategyRequest"),
        ...jsonFactorResponse("FactorRotationStrategy"),
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
        parameters: macroResponseParams([], { responseModeDefault: "standard" }),
        ...jsonRequestBody("CountryReportRequest"),
        ...jsonResponse("CountryReport"),
      },
    },
    "/v1/intelligence/macro-exposure": {
      post: {
        summary: "Return revenue-weighted macro sensitivities for a portfolio: geographic revenue segments crossed with the country macro plane, with per-holding contributions and a coverage percentage",
        ...jsonRequestBody("PortfolioMacroExposureRequest"),
        ...jsonResponse("PortfolioMacroExposure"),
      },
    },
    "/v1/intelligence/footnotes/query": {
      post: {
        summary: "Return a structured filing-footnote investigation bundle. Single-ticker latest-only requests return a footnote_intelligence_result; multi-ticker or date-range requests return a footnote_intelligence_collection.",
        ...jsonRequestBody("FootnoteIntelligenceRequest"),
        ...jsonResponseOneOf(["FootnoteIntelligenceResult", "FootnoteIntelligenceCollection"]),
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
      get: {
        summary: "Return normalized SEC company facts for an issuer, concept, and optional form or unit. Defaults to the us-gaap taxonomy (10-K/10-Q); when no explicit taxonomy or form is supplied and the us-gaap lookup is empty, automatically falls back to ifrs-full on 20-F/6-K for foreign private issuers (e.g. SAP, TM, SONY, RIO).",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker, for example AAPL. Either ticker, symbol, or cik is required." },
          { name: "symbol", in: "query", required: false, schema: { type: "string" }, description: "Alias for ticker, for customers coming from market-data APIs." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Issuer CIK. Either ticker, symbol, or cik is required." },
          { name: "tag", in: "query", required: false, schema: { type: "string" }, description: "XBRL concept tag for concept-specific lookups, such as Revenues, Revenue, NetIncomeLoss, or PropertyPlantAndEquipmentNet. When omitted, the API returns common financial metrics." },
          { name: "taxonomy", in: "query", required: false, schema: { type: "string" }, description: "Optional taxonomy pin, such as us-gaap or ifrs-full." },
          { name: "unit", in: "query", required: false, schema: { type: "string" }, description: "Optional unit filter." },
          { name: "form", in: "query", required: false, schema: { type: "string" }, description: "Optional SEC form filter, such as 10-K or 10-Q." },
          { name: "formType", in: "query", required: false, schema: { type: "string" }, description: "Alias for form." },
          statementPeriodQueryParameter,
          { name: "fy", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Fiscal year filter." },
          { name: "year", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Alias for fy." },
          { name: "fy_from", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Inclusive fiscal-year lower bound." },
          { name: "fyFrom", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Alias for fy_from." },
          { name: "fy_to", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Inclusive fiscal-year upper bound." },
          { name: "fyTo", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Alias for fy_to." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50 }, description: "Maximum fact points to return." },
          { name: "include", in: "query", required: false, schema: { type: "string" }, description: "Optional comma-separated enrichments. Use geographic_segments for revenue geography when available." },
          { name: "include_geographic_segments", in: "query", required: false, schema: { type: "boolean" }, description: "Legacy boolean alias for include=geographic_segments." },
          { name: "geographic_segments", in: "query", required: false, schema: { type: "boolean" }, description: "Legacy boolean alias for include=geographic_segments." },
          { name: "segment_limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 6 }, description: "Maximum geographic segment rows when include=geographic_segments is requested." },
          { name: "segmentLimit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 6 }, description: "Alias for segment_limit." },
          { name: "submission_file_limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 6 }, description: "Maximum recent filing submission files to inspect for geographic segment enrichment." },
          { name: "submissionFileLimit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 6 }, description: "Alias for submission_file_limit." },
          { name: "view", in: "query", required: false, schema: { type: "string", enum: ["default", "agent"] }, description: "Use agent for token-efficient fact point records." },
        ],
        responses: {
          "200": {
            description: "Successful response. Default view returns FactPointList; view=agent returns FactPointAgentList.",
            content: {
              "application/json": {
                schema: { anyOf: [schemaRef("FactPointList"), schemaRef("FactPointAgentList")] },
                examples: {
                  default: {
                    summary: "Quarterly revenue facts",
                    value: {
                      object: "list",
                      data: [
                        {
                          object: "fact_point",
                          id: "fact_0000320193_Revenues_2025_Q3",
                          createdAt: "2026-03-17T00:00:00.000Z",
                          livemode: true,
                          entityId: "cent_f3913349312cbf5bfd60ecdb",
                          ticker: "AAPL",
                          companyName: "Apple Inc.",
                          taxonomy: "us-gaap",
                          tag: "Revenues",
                          label: "Revenue",
                          unit: "USD",
                          value: 95359000000,
                          periodStart: "2025-03-30",
                          fy: 2025,
                          fp: "Q3",
                          form: "10-Q",
                          periodEnd: "2025-06-28",
                          filedAt: "2025-08-01T00:00:00.000Z",
                          frame: "CY2025Q2",
                          provenance: {
                            source: "sec",
                            accessionNumber: "0000320193-25-000079",
                            filingUrl: "https://www.sec.gov/Archives/edgar/data/320193/000032019325000079/aapl-20250628.htm",
                            retrievedAt: "2026-03-17T00:00:00.000Z",
                            parserVersion: "secapi-xbrl-v1",
                          },
                        },
                      ],
                      hasMore: false,
                      nextCursor: null,
                      requestedTag: "Revenues",
                      resolvedTag: "Revenues",
                      aliasStrategy: "exact",
                      completeness: {
                        source: "company_facts",
                        observationsReturned: 1,
                        hasResolvedConcept: true,
                      },
                      requestId: "req_example",
                      traceparent: "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01",
                    },
                  },
                  agent: {
                    summary: "Token-efficient agent view",
                    value: {
                      object: "list",
                      data: [
                        {
                          object: "fact_point",
                          tag: "Revenues",
                          label: "Revenue",
                          taxonomy: "us-gaap",
                          unit: "USD",
                          value: 95359000000,
                          periodEnd: "2025-06-28",
                          fy: 2025,
                          fp: "Q3",
                          form: "10-Q",
                          accessionNumber: "0000320193-25-000079",
                          filingUrl: "https://www.sec.gov/Archives/edgar/data/320193/000032019325000079/aapl-20250628.htm",
                        },
                      ],
                      hasMore: false,
                      nextCursor: null,
                      requestId: "req_example",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/v1/statements": {
      get: {
        summary: "Retrieve one SEC-derived normalized balance sheet, income statement, or cash flow statement for an issuer",
        description: "Use this route to fetch one normalized statement for analysis or a financial-model input. Set `statement` and select annual or quarterly cadence, fiscal year, and a bounded history when the reporting slice matters. The response resolves supported US GAAP and IFRS filers, preserves reported units, periods, and filing provenance, and can contain missing or incomparable line items; it is not a substitute for the cited filing. See [API conventions](/api-conventions) and [freshness and source evidence](/freshness-and-trust).",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker. Either ticker, symbol, or cik is required." },
          { name: "symbol", in: "query", required: false, schema: { type: "string" }, description: "Alias for ticker, for customers coming from market-data APIs." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Issuer CIK. Either ticker, symbol, or cik is required." },
          { name: "statement", in: "query", required: false, schema: { type: "string" }, description: "Normalized statement to retrieve: `income_statement`, `balance_sheet`, or `cash_flow_statement`. Omit it to use the route default balance sheet." },
          statementPeriodQueryParameter,
          { name: "fy", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Issuer fiscal year to select. This is a fiscal reporting year, not necessarily a calendar year." },
          { name: "year", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Alias for fy." },
          { name: "fy_from", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Inclusive lower bound for issuer fiscal years. Combine with `fy_to` for a bounded historical range." },
          { name: "fyFrom", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Alias for fy_from." },
          { name: "fy_to", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Inclusive upper bound for issuer fiscal years. Combine with `fy_from` for a bounded historical range." },
          { name: "fyTo", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Alias for fy_to." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 40 }, description: "Maximum statement periods to return (1-40). Use fiscal-year filters when period identity matters." },
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
        summary: "Retrieve an issuer's normalized balance sheet, income statement, and cash flow statement as one SEC-derived bundle",
        description: "Use this route to obtain the three core statements for a common issuer and reporting selection. Choose annual or quarterly cadence and fiscal-year filters before comparing periods. Each statement retains its own rows, units, periods, completeness, and filing provenance, so a bundle does not guarantee that every normalized line item is available or comparable across all three statements. See [API conventions](/api-conventions) and [freshness and source evidence](/freshness-and-trust).",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker. Either ticker, symbol, or cik is required." },
          { name: "symbol", in: "query", required: false, schema: { type: "string" }, description: "Alias for ticker, for customers coming from market-data APIs." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Issuer CIK. Either ticker, symbol, or cik is required." },
          statementPeriodQueryParameter,
          { name: "fy", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Fiscal year filter." },
          { name: "year", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Alias for fy." },
          { name: "fy_from", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Inclusive fiscal-year lower bound." },
          { name: "fyFrom", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Alias for fy_from." },
          { name: "fy_to", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Inclusive fiscal-year upper bound." },
          { name: "fyTo", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Alias for fy_to." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 40 } },
        ],
        ...jsonResponse("StatementBundle"),
      },
    },
    "/v1/statements/{statement_key}": {
      get: {
        summary: "Retrieve one SEC-derived normalized statement selected by statement key",
        description: "Use this route when the statement type belongs in the URL rather than a query string. Set `statement_key` to a supported normalized statement, then select annual or quarterly cadence and fiscal years as needed. The result preserves reported units, periods, and filing provenance and may contain missing or incomparable normalized line items. See [API conventions](/api-conventions) and [freshness and source evidence](/freshness-and-trust).",
        parameters: [
          { name: "statement_key", in: "path", required: true, schema: { type: "string" }, description: "Normalized statement to retrieve: `income_statement`, `balance_sheet`, or `cash_flow_statement`." },
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker. Either ticker, symbol, or cik is required." },
          { name: "symbol", in: "query", required: false, schema: { type: "string" }, description: "Alias for ticker, for customers coming from market-data APIs." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Issuer CIK. Either ticker, symbol, or cik is required." },
          statementPeriodQueryParameter,
          { name: "fy", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Fiscal year filter." },
          { name: "year", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Alias for fy." },
          { name: "fy_from", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Inclusive fiscal-year lower bound." },
          { name: "fyFrom", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Alias for fy_from." },
          { name: "fy_to", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Inclusive fiscal-year upper bound." },
          { name: "fyTo", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Alias for fy_to." },
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
        summary: "Retrieve an issuer's SEC-derived income statement history with normalized operating and per-share fields",
        description: "Use this route to analyze reported income-statement history for one issuer. Select annual or quarterly cadence, then use fiscal-year filters and `limit` to constrain the reporting periods returned. Values are normalized from supported SEC XBRL filings and retain their reported units, periods, and provenance; derived fields do not replace the cited filing or make unlike periods comparable. See [statements reference](/api-reference/statements) and [freshness and source evidence](/freshness-and-trust).",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker. Supply ticker or cik; use CIK when issuer identity or ticker history could be ambiguous." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "SEC-stable issuer CIK. Supply ticker or cik." },
          { name: "period", in: "query", required: false, schema: { type: "string", enum: ["annual", "quarterly"] }, description: "Reporting cadence to return. Use one cadence when comparing margins, earnings, or per-share values." },
          { name: "fy", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Issuer fiscal year to select; this is not necessarily a calendar year." },
          { name: "fy_from", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Inclusive lower bound for issuer fiscal years." },
          { name: "fy_to", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Inclusive upper bound for issuer fiscal years." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 40 }, description: "Maximum reporting periods to return (1-40)." },
          { name: "view", in: "query", required: false, schema: { type: "string", enum: ["compact"] }, description: "Use compact for period-indexed row arrays. Omit for the generic Statement response." },
        ],
        responses: {
          "200": {
            description: "Successful response. The default response is Statement; view=compact returns CompactStatement.",
            content: { "application/json": { schema: { oneOf: [schemaRef("Statement"), schemaRef("CompactStatement")] } } },
          },
        },
      },
    },
    "/v1/companies/balance-sheets": {
      get: {
        summary: "Retrieve an issuer's SEC-derived balance sheet history with normalized cash, debt, and equity fields",
        description: "Use this route to inspect reported balance-sheet positions for one issuer. Choose annual or quarterly cadence and bound the history with `limit`; balance-sheet rows are point-in-time observations, so do not treat them as duration values. Results are normalized from supported SEC XBRL filings and retain units, period dates, and provenance. See [statements reference](/api-reference/statements) and [freshness and source evidence](/freshness-and-trust).",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker. Supply ticker or cik; use CIK when issuer identity or ticker history could be ambiguous." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "SEC-stable issuer CIK. Supply ticker or cik." },
          { name: "period", in: "query", required: false, schema: { type: "string", enum: ["annual", "quarterly"] }, description: "Reporting cadence to return. Balance-sheet observations are as of each reported period end." },
          { name: "fy", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Issuer fiscal year to select; this is not necessarily a calendar year." },
          { name: "fy_from", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Inclusive lower bound for issuer fiscal years." },
          { name: "fy_to", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Inclusive upper bound for issuer fiscal years." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 40 }, description: "Maximum reporting periods to return (1-40)." },
          { name: "view", in: "query", required: false, schema: { type: "string", enum: ["compact"] }, description: "Use compact for period-indexed row arrays. Omit for the generic Statement response." },
        ],
        responses: {
          "200": {
            description: "Successful response. The default response is Statement; view=compact returns CompactStatement.",
            content: { "application/json": { schema: { oneOf: [schemaRef("Statement"), schemaRef("CompactStatement")] } } },
          },
        },
      },
    },
    "/v1/companies/cash-flow-statements": {
      get: {
        summary: "Retrieve an issuer's SEC-derived cash flow statement history with normalized cash-generation fields",
        description: "Use this route to review operating, investing, and financing cash-flow history for one issuer. Choose annual or quarterly cadence before comparing periods, because cash-flow rows describe a duration rather than a point-in-time balance. Values are normalized from supported SEC XBRL filings and retain units, periods, and provenance; free-cash-flow fields are derived from those filings, not a forecast. See [statements reference](/api-reference/statements) and [freshness and source evidence](/freshness-and-trust).",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker. Supply ticker or cik; use CIK when issuer identity or ticker history could be ambiguous." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "SEC-stable issuer CIK. Supply ticker or cik." },
          { name: "period", in: "query", required: false, schema: { type: "string", enum: ["annual", "quarterly"] }, description: "Reporting cadence to return. Use one cadence when comparing cash generation or capital spending." },
          { name: "fy", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Issuer fiscal year to select; this is not necessarily a calendar year." },
          { name: "fy_from", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Inclusive lower bound for issuer fiscal years." },
          { name: "fy_to", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Inclusive upper bound for issuer fiscal years." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 40 }, description: "Maximum reporting periods to return (1-40)." },
          { name: "view", in: "query", required: false, schema: { type: "string", enum: ["compact"] }, description: "Use compact for period-indexed row arrays. Omit for the generic Statement response." },
        ],
        responses: {
          "200": {
            description: "Successful response. The default response is Statement; view=compact returns CompactStatement.",
            content: { "application/json": { schema: { oneOf: [schemaRef("Statement"), schemaRef("CompactStatement")] } } },
          },
        },
      },
    },
    "/v1/companies/financials": {
      get: {
        summary: "Retrieve an issuer's SEC-derived income, balance-sheet, and cash flow statements in one company-focused response",
        description: "Use this route to assemble the three core normalized statements for one issuer or a bounded ticker batch. `tickers` returns one row per requested ticker and can include a partial degraded state when an individual issuer fails; inspect each row rather than treating the batch as all-or-nothing. Select annual or quarterly cadence and fiscal-year filters before comparing results. Values retain SEC XBRL source context and are not live market data. See [statements reference](/api-reference/statements) and [freshness and source evidence](/freshness-and-trust).",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker for one company. Supply ticker, cik, or tickers/symbols for a batch." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "SEC-stable issuer CIK for one company. Supply ticker, cik, or tickers/symbols for a batch." },
          { name: "tickers", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated issuer tickers for a batch of up to 50 companies. Batch rows can individually report an error state." },
          { name: "symbols", in: "query", required: false, schema: { type: "string" }, description: "Alias for tickers when requesting a batch." },
          { name: "period", in: "query", required: false, schema: { type: "string", enum: ["annual", "quarterly"] }, description: "Reporting cadence to return. Compare only like-for-like periods." },
          { name: "fy", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Issuer fiscal year to select; this is not necessarily a calendar year." },
          { name: "fy_from", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Inclusive lower bound for issuer fiscal years." },
          { name: "fy_to", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Inclusive upper bound for issuer fiscal years." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50 }, description: "Maximum reporting periods to return for each issuer." },
        ],
        ...jsonResponseOneOf(["CompanyFinancials", "CompanyFinancialsBatch"]),
      },
    },
    "/v1/companies/ratios": {
      get: {
        summary: "Retrieve an issuer's statement-derived profitability, return, valuation, dividend, and leverage ratios with period context",
        description: "Use this route to compare a company's calculated ratios across reported periods or a bounded ticker batch. `tickers` can return a partial degraded state when an individual issuer fails, so inspect each item before ranking. Ratio inputs combine SEC-derived statement values with available market context; retain the reported period, units, provenance, and freshness fields, and do not treat a missing ratio as zero or as a trading signal. See [statements reference](/api-reference/statements) and [freshness and source evidence](/freshness-and-trust).",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker for one company. Supply ticker or tickers/symbols for a batch." },
          { name: "tickers", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated issuer tickers for a batch of up to 50 companies. Batch rows can individually report an error state." },
          { name: "symbols", in: "query", required: false, schema: { type: "string" }, description: "Alias for tickers when requesting a batch." },
          { name: "period", in: "query", required: false, schema: { type: "string", enum: ["annual", "quarterly"] }, description: "Reporting cadence to return. Compare only like-for-like periods." },
          { name: "fy", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Issuer fiscal year to select; this is not necessarily a calendar year." },
          { name: "fy_from", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Inclusive lower bound for issuer fiscal years." },
          { name: "fy_to", in: "query", required: false, schema: { type: "integer", minimum: 1900, maximum: 2100 }, description: "Inclusive upper bound for issuer fiscal years." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50 }, description: "Maximum reporting periods to return for each issuer." },
        ],
        ...jsonResponseOneOf(["CompanyRatios", "CompanyRatiosBatch"]),
      },
    },
    "/v1/companies/segments": {
      get: {
        summary: "Retrieve an issuer's SEC-disclosed product, geographic, and operating segment breakdown with revenue-tie confidence",
        description: "Use this route to understand an issuer's disclosed business mix across product, geographic, and operating axes. The service groups filing-derived segment facts, anchors each axis to reported revenue where possible, and returns a confidence signal; a `low_confidence` axis should not be presented as a complete revenue decomposition. Select annual or quarterly reporting before comparing results, and keep the returned filing provenance and freshness fields with any analysis. See [statements reference](/api-reference/statements) and [freshness and source evidence](/freshness-and-trust).",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker. Either ticker or cik is required." },
          { name: "symbol", in: "query", required: false, schema: { type: "string" }, description: "Alias for ticker. Supply ticker, symbol, or cik; ticker and symbol must agree when both are sent." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Issuer CIK. Either ticker or cik is required." },
          { name: "period", in: "query", required: false, schema: { type: "string", enum: ["annual", "quarterly"], default: "annual" }, description: "Reporting cadence for the disclosed segment facts. Defaults to annual; `quarter` and `q` are accepted aliases for quarterly." },
          { name: "segment_type", in: "query", required: false, schema: { type: "string", enum: ["product", "geographic", "operating"] }, description: "Optional restriction to one normalized axis. Omit it to return all supported axes, then inspect each axis's confidence and revenue tie." },
        ],
        ...jsonResponse("CompanySegments"),
      },
    },
    "/v1/companies/macro-exposure": {
      get: {
        summary: "Retrieve a revenue-weighted macro-exposure snapshot built from an issuer's disclosed geographic revenue and country indicators",
        description: "Use this route to inspect a company's modelled macro sensitivities, weighted by available disclosed geographic revenue segments. `coveragePercent`, confidence, source context, and the selected reporting period explain how much of the issuer's revenue could be mapped; a low-coverage result is not a statement that the issuer has no foreign exposure. The returned betas and directions are an exposure snapshot, not a forecast or investment recommendation. See [statements reference](/api-reference/statements) and [freshness and source evidence](/freshness-and-trust).",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker (alias: symbol). Either ticker or cik is required." },
          { name: "symbol", in: "query", required: false, schema: { type: "string" }, description: "Alias for ticker. Supply ticker, symbol, or cik; ticker and symbol must agree when both are sent." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Issuer CIK. Either ticker or cik is required." },
          { name: "country", in: "query", required: false, schema: { type: "string", default: "US" }, description: "Domestic country used for revenue that cannot be mapped to a disclosed geography. Defaults to `US`; it is an allocation assumption, not issuer-reported geography." },
          { name: "lookback", in: "query", required: false, schema: { type: "string" }, description: "Optional lookback label echoed in the exposure context. It does not change the issuer's disclosed reporting period." },
          { name: "period", in: "query", required: false, schema: { type: "string", enum: ["annual", "quarterly"], default: "annual" }, description: "Reporting period for the geographic revenue segments. Defaults to annual." },
        ],
        ...jsonResponse("CompanyMacroExposure"),
      },
    },
    "/v1/companies/overview": {
      get: {
        summary: "Retrieve an SEC-derived company snapshot with identity, latest material filing, and a sector-aware financial view",
        description: "Use this route to start issuer research with identity, classification, the latest material filing, and a financial snapshot drawn from recent annual SEC XBRL facts. `companyType` determines which metrics are meaningful, so null margins or cash-flow values can be expected for financial institutions or pre-revenue companies. Optional enrichments are bounded and independently statused; factor exposure is descriptive, not a forecast, and footnotes are returned as a reference. Preserve the returned filing, provenance, and freshness fields before presenting the snapshot as current. See [statements reference](/api-reference/statements) and [freshness and source evidence](/freshness-and-trust).",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker for one company. Supply ticker, symbol, cik, or tickers/symbols for a batch." },
          { name: "symbol", in: "query", required: false, schema: { type: "string" }, description: "Alias for ticker. Ticker and symbol must agree when both are sent." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Issuer CIK. Either ticker or cik is required." },
          { name: "tickers", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated issuer tickers for a batch of up to 50 companies. Batch rows can individually report an error state." },
          { name: "symbols", in: "query", required: false, schema: { type: "string" }, description: "Alias for tickers when requesting a batch." },
          { name: "include", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated optional enrichments: `segments`, `footnotes`, `dilution`, and `factors`. Each reports its own status; `factors` requires a ticker, and `footnotes` returns a reference rather than rendered filing text." },
        ],
        ...jsonResponseOneOf(["CompanyOverview", "CompanyOverviewBatch"]),
      },
    },
    "/v1/owners/13f": {
      get: {
        summary: "Retrieve one manager's disclosed Form 13F holdings for the latest parsable or selected report",
        description: "Use this route to inspect the positions an institutional manager disclosed on Form 13F for one reporting period. `cik` identifies the manager/filer, not an issuer held in the report. Without a date selector, the service returns the latest parsable 13F it can select; `reportDate` and `filingDate` select one disclosed period. Retain the returned report date, filing date, accession number, provenance, and freshness metadata when presenting holdings. Form 13F is delayed, periodic disclosure rather than a live portfolio, transaction ledger, or complete economic-exposure record. See [ownership workflows](/ownership-workflows) and [freshness and source evidence](/freshness-and-trust).",
        parameters: [
          { name: "cik", in: "query", required: true, schema: { type: "string" }, description: "CIK of the institutional manager that filed the 13F; do not pass the CIK of an issuer held in the portfolio." },
          { name: "reportDate", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Optional disclosed quarter-end report date in YYYY-MM-DD form. Use a date returned by the manager's 13F filing list when selecting a historical report." },
          { name: "filingDate", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Optional SEC filing date in YYYY-MM-DD form. This is the filing date, not the portfolio reporting-period end." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 50 }, description: "Maximum disclosed holding rows to return from the selected report (1-50). A smaller result does not establish that the manager held no additional positions." },
          { name: "view", in: "query", required: false, schema: { type: "string", enum: ["default", "agent"] }, description: "Response shape. Use `agent` for the compact, citation-preserving payload; omit it or use `default` for the fuller response." },
        ],
      },
    },
    "/v1/owners/institutional/investor": {
      get: {
        summary: "Retrieve a manager-centric 13F portfolio with ranked disclosed holdings and available prior-quarter changes",
        description: "Use this manager-centric view to review one institutional filer's selected 13F portfolio and the reported changes against a prior parsable report when one is available. `cik` is the manager/filer CIK. The ranking and changes describe filed 13F positions for the returned reporting period; they are not real-time holdings, trades, or a complete exposure view. Preserve the selected report and filing dates, accession, provenance, and freshness metadata before comparing managers or periods. See [ownership workflows](/ownership-workflows) for disclosure-family and period guidance.",
        parameters: [
          { name: "cik", in: "query", required: true, schema: { type: "string" }, description: "CIK of the institutional manager whose filed 13F portfolio you want to inspect." },
          { name: "reportDate", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Optional quarter-end report date in YYYY-MM-DD form for the manager's selected 13F report." },
          { name: "filingDate", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Optional SEC filing date in YYYY-MM-DD form for the manager's selected 13F report." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 50 }, description: "Maximum ranked disclosed holdings to return (1-50)." },
        ],
      },
    },
    "/v1/owners/institutional/extract": {
      get: {
        summary: "Retrieve one manager's historical 13F extract for a specified calendar quarter",
        description: "Use this route when the reporting period is known and you need a manager's quarter-specific 13F extract. `year` and `quarter` select the calendar quarter-end report date; the response can include prior-quarter deltas only when a prior parsable report is available, otherwise its coverage is current-only. Results are SEC-derived, period-specific holdings disclosure, not current ownership or a complete exposure record. Keep the returned filing identity, provenance, and freshness metadata with any analysis. See [ownership workflows](/ownership-workflows).",
        parameters: [
          { name: "cik", in: "query", required: true, schema: { type: "string" }, description: "CIK of the institutional manager that filed the historical 13F." },
          { name: "year", in: "query", required: true, schema: { type: "integer", minimum: 1900 }, description: "Four-digit calendar year for the requested quarter-end report date (1900 or later)." },
          { name: "quarter", in: "query", required: true, schema: { type: "integer", enum: [1, 2, 3, 4] }, description: "Calendar quarter number for the requested report date: 1, 2, 3, or 4." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 50 }, description: "Maximum disclosed holding rows to return (1-50)." },
        ],
      },
    },
    "/v1/owners/institutional/ticker": {
      get: {
        summary: "Retrieve institutional managers that disclosed a position in one issuer for a selected 13F cohort",
        description: "Use this issuer-centric view to identify managers that disclosed a position in one security within the selected materialized 13F cohort. Provide either the issuer ticker or issuer CIK, not a manager identifier. The response is ranked by disclosed position value and tied to its returned report date, filing date, and accessions; it is not a current cap table, complete holder roster, or real-time ownership measure. Pagination is offset-based: advance only with the returned `nextCursor` while `hasMore` is true, and read the full cohort size from `totals.holders`. Cohort availability depends on the materialized 13F read model, so preserve provenance and freshness metadata and treat a non-2xx response as unavailable data rather than an absence-of-holders conclusion. See [ownership workflows](/ownership-workflows).",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker for the security whose disclosed institutional holders you want to inspect. Provide this or the issuer `cik`." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Issuer CIK for the security whose disclosed institutional holders you want to inspect. Provide this or the issuer `ticker`; do not pass a manager CIK." },
          { name: "reportDate", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Optional 13F quarter-end report date in YYYY-MM-DD form for the holder cohort." },
          { name: "filingDate", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Optional SEC filing date in YYYY-MM-DD form for the holder cohort." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 25 }, description: "Maximum institutional-holder rows to return per page (1-50), ranked by disclosed position value." },
          { name: "cursor", in: "query", required: false, schema: { type: "integer", minimum: 0, maximum: 9007199254740991, default: 0 }, description: "Non-negative safe-integer offset into the value-ranked holder cohort. Use the response `nextCursor` for the next page while `hasMore` is true; do not derive an offset from holder ranks. `totals.holders` reports the full cohort size." },
          { name: "view", in: "query", required: false, schema: { type: "string", enum: ["default", "agent"] }, description: "Response shape. Use `agent` for a compact holder ranking with filing identifiers; omit it or use `default` for the fuller response." },
        ],
      },
    },
    "/v1/owners/13f/filings": {
      get: {
        summary: "List a manager's recent SEC Form 13F filings and their reported period dates",
        description: "Use this route to discover the available 13F filings for one institutional manager before selecting a historical report or comparing periods. `cik` identifies the manager/filer. Each filing record supplies the reported quarter-end date, SEC filing identity, and provenance needed to request the corresponding holdings. `since` supports incremental polling by filing acceptance time when available, with filing-date fallback for records that have only day-level timing. A returned filing is a disclosure record, not proof that every filing is parsable or that it represents current holdings. See [ownership workflows](/ownership-workflows).",
        parameters: [
          { name: "cik", in: "query", required: true, schema: { type: "string" }, description: "CIK of the institutional manager whose Form 13F filing history you want to list." },
          { name: "since", in: "query", required: false, schema: { type: "string", format: "date-time" }, description: "Optional inclusive ISO-8601 timestamp for incremental polling. The filter uses SEC acceptance time when available and otherwise includes records from the same filing-date day." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 8 }, description: "Maximum filing records to return (1-50)." },
        ],
      },
    },
    "/v1/owners/13d-13g": {
      get: {
        summary: "Search SEC Schedule 13D and 13G beneficial-ownership reports by issuer, filer, form, and filing date",
        description: "Use this route to find filed beneficial-ownership reports in the Schedule 13D and 13G families, including amendments. Filter by issuer, filer name, form, and filing date, then retain the returned accession, filing URL, provenance, and freshness metadata for review. Reported beneficial ownership is filing-specific and can be amended; it is not a real-time cap table, complete economic-exposure measure, or inference about investor intent. Pagination is offset-based: advance only with the returned `nextCursor` while `hasMore` is true. See [ownership workflows](/ownership-workflows) and [freshness and source evidence](/freshness-and-trust).",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Optional issuer ticker filter for beneficial-ownership filings." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Optional issuer CIK filter for beneficial-ownership filings." },
          { name: "filer", in: "query", required: false, schema: { type: "string" }, description: "Optional case-insensitive beneficial owner or filer-name filter." },
          { name: "forms", in: "query", required: false, schema: { type: "string" }, description: "Optional comma-separated form filter, for example `SC 13D,SC 13G`. Omit to search the supported 13D, 13G, and amendment forms." },
          { name: "date_from", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Optional inclusive filing-date lower bound in YYYY-MM-DD form." },
          { name: "date_to", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Optional inclusive filing-date upper bound in YYYY-MM-DD form." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 25 }, description: "Maximum beneficial-ownership report rows to return per page (1-50)." },
          { name: "cursor", in: "query", required: false, schema: { type: "integer", minimum: 0, maximum: 9007199254740991, default: 0 }, description: "Non-negative safe-integer offset. Use the response `nextCursor` for the next page; do not derive an offset from row IDs." },
          { name: "submission_file_limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50 }, description: "Maximum SEC submission-history files to inspect while locating 13D/13G reports (1-50). This bounds search depth, not the number of returned rows." },
        ],
      },
    },
    "/v1/owners/13f/compare": {
      post: {
        summary: "Compare the latest two parsable Form 13F reports for one institutional manager",
        description: "Use this route to generate a manager-level difference between the latest two parsable 13F reports the service finds. The request CIK belongs to the manager/filer. The response labels disclosed positions as added, removed, changed, or unchanged and includes filing dates and provenance, but it does not accept arbitrary report-date selectors. For a specific historical period, first list the manager's filings and retrieve individual reports. 13F changes are delayed filing differences, not trade dates, manager intent, current ownership, or complete exposure. See [ownership workflows](/ownership-workflows) and the [13F comparison guide](/seo/sec-13f-comparison-api).",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["cik"],
                properties: {
                  cik: { type: "string", description: "CIK of the institutional manager whose latest two parsable 13F reports will be compared; do not pass an issuer CIK." },
                  limit: { type: "integer", minimum: 1, maximum: 50, default: 50, description: "Maximum disclosed position rows to parse from each report (1-50). Rows outside that limit cannot appear in the comparison." },
                },
              },
            },
          },
        },
      },
    },
    "/v1/insiders": {
      get: {
        summary: "Search normalized SEC Forms 3, 4, and 5 records by issuer, reporting owner, transaction, and filing date",
        description: "Use this route to build a review queue from filed insider-ownership records. Filter by issuer, reporting owner, security title, Form 4 transaction code, and filing date; `date_from` and `date_to` apply to the filing date, not the transaction date. Rows preserve the reported transaction and filing fields, accession, provenance, and freshness metadata, but a filing-derived record does not establish motive, legality, 10b5-1-plan status, current ownership, or investment outcome. Page only with the returned `nextCursor` while `hasMore` is true, and inspect the cited filing for footnotes or missing context. See [ownership workflows](/ownership-workflows) and the [insider trading guide](/seo/insider-trading-api).",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Optional issuer ticker filter for Forms 3, 4, and 5." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Optional issuer CIK filter for Forms 3, 4, and 5." },
          { name: "forms", in: "query", required: false, schema: { type: "string" }, description: "Optional comma-separated ownership-form filter, typically `3,4,5`. Omit to search Forms 3, 4, and 5." },
          { name: "date_from", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Optional inclusive filing-date lower bound in YYYY-MM-DD form; this does not filter `transactionDate`." },
          { name: "date_to", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Optional inclusive filing-date upper bound in YYYY-MM-DD form; this does not filter `transactionDate`." },
          { name: "owner_name", in: "query", required: false, schema: { type: "string" }, description: "Optional case-insensitive reporting-owner name filter." },
          { name: "owner_cik", in: "query", required: false, schema: { type: "string" }, description: "Optional reporting-owner CIK filter." },
          { name: "security_title", in: "query", required: false, schema: { type: "string" }, description: "Optional case-insensitive disclosed security-title filter." },
          { name: "transaction_code", in: "query", required: false, schema: { type: "string" }, description: "Optional Form 4 transaction-code filter. This filters the reported filing code; inspect the source filing before assigning economic intent." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 25 }, description: "Maximum normalized insider-record rows to return per page (1-50)." },
          { name: "cursor", in: "query", required: false, schema: { type: "integer", minimum: 0, maximum: 9007199254740991, default: 0 }, description: "Non-negative safe-integer offset. Use the response `nextCursor` for the next page; do not derive an offset from row IDs." },
          { name: "submission_file_limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50 }, description: "Maximum SEC submission-history files to inspect while locating insider filings (1-50). This bounds search depth, not the number of returned rows." },
        ],
      },
    },
    "/v1/compensation": {
      get: { summary: "Return normalized executive compensation records derived from the latest DEF 14A filing" },
    },
    "/v1/compensation/compare": {
      post: {
        summary: "Compare the latest two executive compensation disclosures for an issuer",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker. Provide ticker or cik in the query or JSON body." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Issuer CIK. Provide ticker or cik in the query or JSON body." },
        ],
        requestBody: {
          required: false,
          description: "Provide either ticker or cik in this JSON body, or provide one as a query parameter.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                additionalProperties: true,
                properties: {
                  ticker: { type: "string", description: "Issuer ticker. Provide ticker or cik in the JSON body or query." },
                  cik: { type: "string", description: "Issuer CIK. Provide ticker or cik in the JSON body or query." },
                  limit: { type: ["integer", "string"], minimum: 1, maximum: 50, default: 10, description: "Maximum compensation records to parse from each proxy disclosure." },
                },
              },
              examples: {
                ticker: { summary: "Compare Apple disclosures by ticker", value: { ticker: "AAPL", limit: 10 } },
                cik: { summary: "Compare Apple disclosures by CIK", value: { cik: "0000320193", limit: 10 } },
              },
            },
          },
        },
      },
    },
    "/v1/artifacts": {
      get: {
        summary: "List artifacts previously persisted for the current organization",
        description: "Returns persisted artifact records owned by the authenticated organization. Filter by stored `kind` or `status`; the response is a bounded list and does not promise a complete archive or an external-storage inventory.",
        parameters: [
          { name: "kind", in: "query", required: false, schema: { type: "string" }, description: "Optional stored artifact kind filter, such as `markdown_bundle` or `ownership_compare_bundle`." },
          { name: "status", in: "query", required: false, schema: { type: "string" }, description: "Optional stored lifecycle-status filter." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 20 }, description: "Maximum number of persisted records to return (1-50). Values outside this range are rejected; no cursor is exposed by this endpoint." },
        ],
        responses: { "200": { description: "Organization-scoped artifact list with request correlation fields.", content: { "application/json": { schema: schemaRef("ArtifactInventoryList") } } } },
      },
      post: {
        summary: "Build and persist a filing-derived artifact bundle",
        description: "Builds one derived bundle for the selected issuer or comparison workflow, persists it to the authenticated organization, and returns the persisted record. For filing bundles, the default form is `10-K`; `sectionKey` selects one extracted section when available. This is an asynchronous-style acceptance response (`202`) even when the returned record is ready.",
        requestBody: {
          required: false,
          description: "Provide issuer selectors and optional bundle settings in JSON. The route also accepts `ticker` and `cik` as query parameters; body values take precedence when they are strings.",
          content: { "application/json": { schema: schemaRef("CreateArtifactRequest"), examples: { filingSection: { summary: "Create a 10-K section bundle", value: { ticker: "AAPL", form: "10-K", sectionKey: "item_1a", kind: "markdown_bundle" } }, ownershipComparison: { summary: "Create an ownership comparison bundle", value: { cik: "0000320193", kind: "ownership_compare_bundle" } } } } },
        },
        responses: { "202": { description: "Persisted artifact record, including its retrieval paths and manifest.", content: { "application/json": { schema: schemaRef("ArtifactCreateResponse") } } } },
      },
    },
    "/v1/artifacts/summary": {
      get: {
        summary: "Summarize persisted artifact storage for the current organization",
        description: "Groups the current organization's persisted artifacts by stored kind, lifecycle status, and storage mode. Counts and byte totals describe stored records, not source-filing coverage or external object-store completeness.",
        responses: { "200": { description: "Organization-scoped artifact counts and total stored bytes.", content: { "application/json": { schema: schemaRef("ArtifactSummary") } } } },
      },
    },
    "/v1/artifacts/{artifact_id}": {
      get: {
        summary: "Get one persisted artifact and its manifest",
        description: "Returns the saved artifact record and its structured manifest when the artifact belongs to the authenticated organization. Use the manifest or export routes when a workflow needs explicit file metadata or an export envelope.",
        parameters: [{ name: "artifact_id", in: "path", required: true, schema: { type: "string" }, description: "The artifact ID returned when the bundle was persisted." }],
        responses: { "200": { description: "Persisted artifact record with its manifest.", content: { "application/json": { schema: schemaRef("ArtifactMemberResponse") } } } },
      },
    },
    "/v1/artifacts/{artifact_id}/manifest": {
      get: {
        summary: "Get the structured manifest for one persisted artifact",
        description: "Returns storage metadata, file size, checksum, optional filing and section context, and supported export formats for one organization-scoped artifact. Manifest citation fields are descriptive metadata; retain the cited filing reference when a downstream result needs source evidence.",
        parameters: [{ name: "artifact_id", in: "path", required: true, schema: { type: "string" }, description: "The artifact ID returned when the bundle was persisted." }],
        responses: { "200": { description: "Structured manifest for the requested persisted artifact.", content: { "application/json": { schema: schemaRef("ArtifactManifest") } } } },
      },
    },
    "/v1/artifacts/{artifact_id}/export": {
      get: {
        summary: "Export one persisted artifact as JSON, compact JSON, or a markdown download envelope",
        description: "Returns the saved artifact with its manifest for `json` or `compact_json`. With `format=markdown`, the response is a download envelope rather than inline markdown; follow its download details. Compact JSON is intentionally reduced and may truncate large content or arrays.",
        parameters: [
          { name: "artifact_id", in: "path", required: true, schema: { type: "string" }, description: "The artifact ID returned when the bundle was persisted." },
          { name: "format", in: "query", required: false, schema: { type: "string", enum: ["json", "markdown", "compact_json"], default: "json" }, description: "Export representation. Omit for full JSON; use `markdown` for a download envelope or `compact_json` for a size-reduced JSON representation." },
        ],
        responses: { "200": { description: "Artifact export envelope in the requested representation.", content: { "application/json": { schema: schemaRef("ArtifactExport") } } } },
      },
    },
    "/v1/artifacts/{artifact_id}/download": {
      get: {
        summary: "Download one persisted artifact payload",
        description: "Returns the saved payload directly when it is stored locally. When the record is stored in R2, the route returns a `302` redirect to a short-lived signed object URL. Callers must allow redirects and should retain the artifact ID and manifest checksum alongside downloaded content.",
        parameters: [{ name: "artifact_id", in: "path", required: true, schema: { type: "string" }, description: "The artifact ID returned when the bundle was persisted." }],
        responses: { "200": { description: "Locally stored artifact payload.", content: { "text/markdown": { schema: { type: "string" } } } }, "302": { description: "Redirect to a signed R2 download URL for an externally stored artifact." } },
      },
    },
    "/v1/artifacts/{artifact_id}/reconcile": {
      post: {
        summary: "Reconcile one persisted artifact with configured object storage",
        description: "Checks the saved record against configured R2 storage. Without R2 configuration it reports `local_only`; with R2 it can report an existing object as `synced`, repair a missing stored object as `recovered`, or upload a local record as `uploaded`. Send no request fields.",
        parameters: [{ name: "artifact_id", in: "path", required: true, schema: { type: "string" }, description: "The artifact ID returned when the bundle was persisted." }],
        requestBody: { required: false, description: "Omit the body or send `{}`. Unknown body fields are rejected.", content: { "application/json": { schema: { type: "object", additionalProperties: false }, examples: { empty: { value: {} } } } } },
        responses: { "200": { description: "Reconciliation result for the persisted artifact.", content: { "application/json": { schema: schemaRef("ArtifactReconciliation") } } } },
      },
    },
    "/v1/search/fulltext": {
      get: {
        summary: "Full-text search across filing content and section text",
        parameters: [
          { name: "q", in: "query", required: true, schema: { type: "string" }, description: "Search query" },
          { name: "ticker", in: "query", schema: { type: "string" }, description: "Optional issuer ticker filter. `symbol` is accepted as an alias." },
          { name: "symbol", in: "query", schema: { type: "string" }, description: "Alias for ticker, for customers coming from market-data APIs. If both ticker and symbol are provided, they must match." },
          { name: "cik", in: "query", schema: { type: "string" } },
          { name: "form", in: "query", schema: { type: "string" } },
          { name: "accession_number", in: "query", schema: { type: "string" }, description: "Optional SEC accession number to scope the filing leg." },
          { name: "filing_year", in: "query", schema: { type: "integer" }, description: "Optional filing-year filter." },
          { name: "fy", in: "query", schema: { type: "integer" }, description: "Optional fiscal-year selector. With ticker or symbol, maps to the issuer fiscal-year filing-date window." },
          { name: "year", in: "query", schema: { type: "integer" }, description: "Alias for fy when ticker or symbol is present." },
          { name: "date_from", in: "query", schema: { type: "string", format: "date" }, description: "Inclusive filing-date lower bound." },
          { name: "date_to", in: "query", schema: { type: "string", format: "date" }, description: "Inclusive filing-date upper bound." },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100 }, description: "Maximum combined search budget before the response splits work across filing and section legs." },
        ],
      },
    },
    "/v1/search/semantic": {
      get: {
        summary: "Semantic vector search across SEC filing section content with finance-tuned embeddings, hybrid keyword + vector RRF, and citation fields on every result row",
        parameters: [
          { name: "q", in: "query", required: true, schema: { type: "string" }, description: "Search query" },
          { name: "mode", in: "query", schema: { type: "string", enum: ["keyword", "semantic", "hybrid"] }, description: "Retrieval mode (default hybrid). Invalid values return invalid_query_parameter with acceptedValues." },
          { name: "ticker", in: "query", schema: { type: "string" }, description: "Optional issuer ticker filter. `symbol` is accepted as an alias." },
          { name: "symbol", in: "query", schema: { type: "string" }, description: "Alias for ticker, for customers coming from market-data APIs. If both ticker and symbol are provided, they must match." },
          { name: "cik", in: "query", schema: { type: "string" } },
          { name: "form", in: "query", schema: { type: "string" } },
          { name: "filing_year", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100 } },
          { name: "view", in: "query", schema: { type: "string", enum: ["default", "compact", "agent"] }, description: "Search response shape. Pass agent to drop score and retrievalMode while preserving citation fields; compact is accepted for response-format consistency and currently matches the default search rows. Invalid values return invalid_query_parameter with details.acceptedValues." },
        ],
        ...inlineJsonResponse(semanticSearchResponseSchema, semanticSearchResponseExample, "Semantic search results with request tracing metadata."),
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
    "/v1/market/search": {
      get: {
        summary: "Find candidate stock tickers from a company name or keyword",
        description: "Use this route when a workflow starts with a company name or partial keyword and needs candidate symbols. `q` is required and results are matches, not a final identity decision. Resolve the selected symbol or CIK before using it for issuer-scoped research, especially when names are similar or a company has multiple listed classes. The route is subject to the configured result limit and can return a source or service error instead of an empty successful list. See [entity resolution](https://docs.secapi.ai/api-reference/entities/get-v1-entities-resolve) and [API conventions](https://docs.secapi.ai/api-conventions).",
        parameters: [
          { name: "q", in: "query", required: true, schema: { type: "string" }, description: "Company name, ticker fragment, or keyword used to find candidate securities." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 15 }, description: "Maximum candidate records to return. Defaults to 15; values above 50 are capped." },
        ],
        ...jsonResponse("MarketSearch", "Candidate securities with the redacted market-data source label and request tracing metadata."),
      },
    },
    "/v1/filings/{accession_number}/download": {
      get: {
        summary: "Open a filing's source document by accession number",
        description: "Resolve a filing accession number and return its source document through the available delivery path. The response may be served from a cached copy or redirect to SEC EDGAR; use the source document itself when the exact filed presentation matters.",
      },
    },
    "/v1/filings/{accession_number}/export": {
      get: {
        summary: "Export one filing in JSON or document formats",
        description: "Export a selected filing as JSON by default, or request a derived Markdown, CSV, XLSX, DOCX, or PDF document with `format`. JSON returns the filing manifest; derived formats can be large and should retain the filing accession and source provenance. Derived exports do not replace the original filing as evidence.",
        parameters: [
          {
            name: "format",
            in: "query",
            required: false,
            schema: { type: "string", enum: ["json", "markdown", "csv", "xlsx", "docx", "pdf"], default: "json" },
            description: "Optional export format. Defaults to json, which returns the filing manifest; markdown, csv, xlsx, docx, and pdf are derived deliverables that can be large for long filings.",
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
        summary: "Find filed offering and issuance events by issuer, filing, date, or ATM status",
        parameters: [
          ...dilutionIssuerParameters,
          { name: "accession_number", in: "query", required: false, schema: { type: "string" }, description: "Exact SEC accession number filter." },
          { name: "form_type", in: "query", required: false, schema: { type: "string" }, description: "SEC form type filter, such as S-1, S-3, 424B5, or FWP." },
          { name: "offering_type", in: "query", required: false, schema: { type: "string" }, description: "Normalized offering-type filter." },
          { name: "is_atm", in: "query", required: false, schema: { type: "boolean" }, description: "Restrict to at-the-market events when true, or non-ATM events when false." },
          { name: "filed_at_from", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive lower filing-date bound." },
          { name: "filed_at_to", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive upper filing-date bound." },
          ...dilutionPaginationParameters,
          dilutionAgentViewParameter,
        ],
        ...jsonResponse("DilutionEventList"),
      },
    },
    "/v1/dilution/events/{event_id}": {
      get: {
        summary: "Retrieve one filed dilution event with linked instruments and verification fields",
        parameters: [
          { name: "event_id", in: "path", required: true, schema: { type: "string" }, description: "Dilution event identifier returned by the events list." },
          dilutionAgentViewParameter,
        ],
        ...jsonResponse("DilutionEvent"),
      },
    },
    "/v1/dilution/warrants": {
      get: {
        summary: "Find disclosed warrant terms and potential share overhang in offering materials",
        parameters: [
          ...dilutionIssuerParameters,
          { name: "accession_number", in: "query", required: false, schema: { type: "string" }, description: "Exact SEC accession number filter." },
          { name: "form_type", in: "query", required: false, schema: { type: "string" }, description: "SEC form type filter." },
          { name: "filed_at_from", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive lower filing-date bound." },
          { name: "filed_at_to", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive upper filing-date bound." },
          ...dilutionPaginationParameters,
          dilutionAgentViewParameter,
        ],
        ...jsonResponse("DilutionWarrantList"),
      },
    },
    "/v1/dilution/convertibles": {
      get: {
        summary: "Find disclosed convertible instruments and their conversion terms",
        parameters: [
          ...dilutionIssuerParameters,
          { name: "accession_number", in: "query", required: false, schema: { type: "string" }, description: "Exact SEC accession number filter." },
          { name: "form_type", in: "query", required: false, schema: { type: "string" }, description: "SEC form type filter." },
          { name: "filed_at_from", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive lower filing-date bound." },
          { name: "filed_at_to", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive upper filing-date bound." },
          ...dilutionPaginationParameters,
          dilutionAgentViewParameter,
        ],
        ...jsonResponse("DilutionConvertibleList"),
      },
    },
    "/v1/dilution/rofr": {
      get: {
        summary: "Find disclosed rights-of-first-refusal and underwriter tail-financing provisions",
        parameters: [
          ...dilutionIssuerParameters,
          { name: "accession_number", in: "query", required: false, schema: { type: "string" }, description: "Exact SEC accession number filter." },
          { name: "filed_at_from", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive lower filing-date bound." },
          { name: "filed_at_to", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive upper filing-date bound." },
          ...dilutionPaginationParameters,
          dilutionAgentViewParameter,
        ],
        ...jsonResponse("DilutionRofrList"),
      },
    },
    "/v1/dilution/lockups": {
      get: {
        summary: "Find disclosed lockup restrictions, dates, parties, and release conditions",
        parameters: [
          ...dilutionIssuerParameters,
          { name: "accession_number", in: "query", required: false, schema: { type: "string" }, description: "Exact SEC accession number filter." },
          { name: "filed_at_from", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive lower filing-date bound." },
          { name: "filed_at_to", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive upper filing-date bound." },
          ...dilutionPaginationParameters,
          dilutionAgentViewParameter,
        ],
        ...jsonResponse("DilutionLockupList"),
      },
    },
    "/v1/dilution/nasdaq-compliance": {
      get: {
        summary: "Find Nasdaq deficiency and compliance notices by issuer, status, or date",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker filter." },
          { name: "status", in: "query", required: false, schema: { type: "string" }, description: "Normalized compliance-status filter." },
          { name: "date_from", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive lower notice-date bound." },
          { name: "date_to", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive upper notice-date bound." },
          ...dilutionPaginationParameters,
          dilutionAgentViewParameter,
        ],
        ...jsonResponse("DilutionNasdaqComplianceList"),
      },
    },
    "/v1/dilution/reverse-splits": {
      get: {
        summary: "Find disclosed reverse stock split ratios and execution dates",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker filter." },
          { name: "execution_date_from", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive lower execution-date bound." },
          { name: "execution_date_to", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive upper execution-date bound." },
          ...dilutionPaginationParameters,
          dilutionAgentViewParameter,
        ],
        ...jsonResponse("DilutionReverseSplitList"),
      },
    },
    "/v1/dilution/cash-position": {
      get: {
        summary: "Find reported cash, burn, and runway fields by issuer and reporting period",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker filter." },
          { name: "period_ended_from", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive lower reporting-period-end bound." },
          { name: "period_ended_to", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive upper reporting-period-end bound." },
          ...dilutionPaginationParameters,
          dilutionAgentViewParameter,
        ],
        ...jsonResponse("DilutionCashPositionList"),
      },
    },
    "/v1/dilution/corporate-actions": {
      get: {
        summary: "Find capital-structure context from ticker, exchange, de-SPAC, and split actions",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker filter." },
          { name: "action_type", in: "query", required: false, schema: { type: "string" }, description: "Normalized corporate-action type filter." },
          { name: "effective_date_from", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive lower effective-date bound." },
          { name: "effective_date_to", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive upper effective-date bound." },
          ...dilutionPaginationParameters,
          dilutionAgentViewParameter,
        ],
        ...jsonResponse("DilutionCorporateActionList"),
      },
    },
    "/v1/dilution/ratings": {
      get: {
        summary: "List persisted dilution-rating history by issuer or overall-risk value",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker filter." },
          { name: "overall_risk", in: "query", required: false, schema: { type: "string" }, description: "Overall-risk bucket filter." },
          ...dilutionPaginationParameters,
          dilutionAgentViewParameter,
        ],
        ...jsonResponse("DilutionRatingList"),
      },
    },
    "/v1/dilution/share-float-history": {
      get: {
        summary: "List disclosed shares-outstanding and public-float observations by issuer and date",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Issuer ticker filter." },
          { name: "as_of_date_from", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive lower observation-date bound." },
          { name: "as_of_date_to", in: "query", required: false, schema: { type: "string", format: "date" }, description: "Inclusive upper observation-date bound." },
          ...dilutionPaginationParameters,
          dilutionAgentViewParameter,
        ],
        ...jsonResponse("DilutionShareFloatHistoryList"),
      },
    },
    "/v1/dilution/score": {
      get: {
        summary: "Calculate the current per-issuer Dilution Score from available inputs",
        parameters: [
          { name: "ticker", in: "query", required: true, schema: { type: "string" }, description: "Issuer ticker. Required; the route resolves the issuer before calculating the current score." },
          dilutionAgentViewParameter,
        ],
        ...jsonResponse("DilutionRating"),
      },
    },
    "/v1/dilution/coverage": {
      get: {
        summary: "Inspect dilution row counts, verified rows, and latest observation dates by table",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Optional issuer scope. Counts and latest dates are limited to that issuer's rows when supplied." },
        ],
        ...jsonResponse("DilutionCoverage"),
      },
    },
    // ----- Filings-intelligence plane (OMNI-5123, WS11) -----
    // NOTE: filing_event responses use the PUBLIC schema (sentiment omitted).
    "/v1/filings/events": {
      get: {
        summary: "Filing events endpoint (currently unavailable)",
        description: "This endpoint is currently unavailable and returns `404 filings_intelligence_not_available`. When available, it will list persisted classifications from covered 8-K and 6-K filings for issuer- and date-bounded monitoring. Rows are derived from filing content and are not a real-time market-news feed or a complete record of every issuer event.",
        parameters: [
          { name: "forms", in: "query", schema: { type: "string" }, description: "Comma-separated filing forms to include, such as 8-K and 6-K." },
          { name: "categories", in: "query", schema: { type: "string" }, description: "Comma-separated derived filing-event categories for triage; categories are not SEC form classifications." },
          { name: "tickers", in: "query", schema: { type: "string" }, description: "Comma-separated issuer tickers to include. Use with a date range to keep monitoring queries bounded." },
          { name: "date_from", in: "query", schema: { type: "string" }, description: "Inclusive lower bound on the filing event's filedAt date (ISO date)." },
          { name: "date_to", in: "query", schema: { type: "string" }, description: "Inclusive upper bound on the filing event's filedAt date (ISO date)." },
          { name: "cursor", in: "query", schema: { type: "integer", minimum: 0 }, description: "Pagination offset. Continue with the returned cursor until the requested review window is exhausted." },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100, default: 25 }, description: "Maximum classified filing-event rows to return per page." },
          { name: "response_mode", in: "query", schema: { type: "string", enum: ["compact", "standard", "verbose", "agent"] }, description: "Response detail level. Choose compact or agent for triage, then preserve filing citation fields for verification." },
        ],
        ...filingsIntelligenceUnavailableResponse(),
      },
    },
    "/v1/filings/diff": {
      get: {
        summary: "Filing comparison endpoint (currently unavailable)",
        description: "This endpoint is currently unavailable and returns `404 filings_intelligence_not_available`. When available, it will compare a selected issuer filing with a prior-period or explicitly chosen counterpart and return section-level change information. Any comparison is a review aid based on rendered filing text, not a determination of materiality or legal significance.",
        parameters: [
          { name: "ticker", in: "query", required: true, schema: { type: "string" }, description: "Issuer ticker for both sides of the comparison." },
          { name: "form", in: "query", required: true, schema: { type: "string" }, description: "SEC form type to pair, such as 10-K. Compare like form types for a meaningful review." },
          { name: "from", in: "query", schema: { type: "string" }, description: "Base filing selector: accession number or ISO date. Defaults to the prior filing of the selected form." },
          { name: "to", in: "query", schema: { type: "string" }, description: "Comparison filing selector: accession number or ISO date. Defaults to the latest filing of the selected form." },
          { name: "sections", in: "query", schema: { type: "string" }, description: "Comma-separated canonical section keys to restrict the diff." },
          { name: "include_hunks", in: "query", schema: { type: "string", enum: ["true", "false"] }, description: "Include redline hunks (default true)." },
          { name: "response_mode", in: "query", schema: { type: "string", enum: ["compact", "standard", "verbose", "agent"] } },
        ],
        ...filingsIntelligenceUnavailableResponse(),
      },
    },
    "/v1/filings/transcripts": {
      get: {
        summary: "Filing transcripts endpoint (currently unavailable)",
        description: "This endpoint is currently unavailable and returns `404 filings_intelligence_not_available`. When available, it will list persisted earnings-transcript records extracted from covered EX-99 filing materials, with speaker and prepared-remarks or Q&A structure where source material supports extraction. Results will depend on available source materials and extraction coverage.",
        parameters: [
          { name: "tickers", in: "query", schema: { type: "string" }, description: "Comma-separated issuer tickers to include." },
          { name: "cik", in: "query", schema: { type: "string" }, description: "Issuer CIK filter for one SEC registrant." },
          { name: "fiscal_period", in: "query", schema: { type: "string" }, description: "Optional reported fiscal-period filter when the source material provides one." },
          { name: "date_from", in: "query", schema: { type: "string" }, description: "Inclusive source-date boundary." },
          { name: "date_to", in: "query", schema: { type: "string" }, description: "Inclusive source-date boundary." },
          { name: "cursor", in: "query", schema: { type: "integer", minimum: 0 }, description: "Pagination offset for the persisted transcript list." },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100, default: 25 }, description: "Maximum transcript rows to return per page." },
          { name: "response_mode", in: "query", schema: { type: "string", enum: ["compact", "standard", "verbose", "agent"] }, description: "Response detail level. Use a compact mode for discovery and source citation fields for verification." },
        ],
        ...filingsIntelligenceUnavailableResponse(),
      },
    },
    "/v1/filings/guidance": {
      get: {
        summary: "Filing guidance endpoint (currently unavailable)",
        description: "This endpoint is currently unavailable and returns `404 filings_intelligence_not_available`. When available, it will list persisted management-guidance records extracted from covered earnings materials and transcripts, including metric, direction, target period, and disclosed ranges where available. These records will be source-derived extractions, not normalized estimates or a complete guidance history.",
        parameters: [
          { name: "tickers", in: "query", schema: { type: "string" }, description: "Comma-separated issuer tickers to include." },
          { name: "cik", in: "query", schema: { type: "string" }, description: "Issuer CIK filter for one SEC registrant." },
          { name: "metric", in: "query", schema: { type: "string" }, description: "Normalized extracted metric label, such as revenue or eps. Check the cited source for the issuer's exact definition and units." },
          { name: "direction", in: "query", schema: { type: "string", enum: ["raised", "lowered", "reaffirmed", "initiated", "withdrawn"] }, description: "Optional extracted guidance-direction filter." },
          { name: "fiscal_period", in: "query", schema: { type: "string" }, description: "Optional target fiscal-period filter when available from the source disclosure." },
          { name: "date_from", in: "query", schema: { type: "string" }, description: "Inclusive source-date boundary." },
          { name: "date_to", in: "query", schema: { type: "string" }, description: "Inclusive source-date boundary." },
          { name: "cursor", in: "query", schema: { type: "integer", minimum: 0 }, description: "Pagination offset for the persisted guidance list." },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100, default: 25 }, description: "Maximum guidance rows to return per page." },
          { name: "response_mode", in: "query", schema: { type: "string", enum: ["compact", "standard", "verbose", "agent"] }, description: "Response detail level. Preserve source and filing fields when carrying a guidance item into another workflow." },
        ],
        ...filingsIntelligenceUnavailableResponse(),
      },
    },
    "/v1/intelligence/coverage": {
      get: {
        summary: "Filing-intelligence coverage endpoint (currently unavailable)",
        description: "This endpoint is currently unavailable and returns `404 filings_intelligence_not_available`. When available, it will compose a single-issuer rollup over persisted filings-intelligence stores, including tagged events, guidance, transcripts, and footnote newness. Coverage will reflect available extracted records, not complete issuer disclosure history.",
        parameters: [
          { name: "ticker", in: "query", schema: { type: "string" }, description: "Issuer ticker (ticker or cik required)." },
          { name: "cik", in: "query", schema: { type: "string" }, description: "Issuer CIK (ticker or cik required)." },
          { name: "date_from", in: "query", schema: { type: "string" } },
          { name: "date_to", in: "query", schema: { type: "string" } },
          { name: "response_mode", in: "query", schema: { type: "string", enum: ["compact", "standard", "verbose", "agent"] } },
        ],
        ...filingsIntelligenceUnavailableResponse(),
      },
    },
    // ----- Situations plane (OMNI-5122, WS10) -----
    "/v1/situations": {
      get: {
        tags: ["Special Situations"],
        summary: "List durable special situations (M&A, tender offers, going-private, spin-offs, activist campaigns, restructuring, bankruptcy, …) with lifecycle status, deal terms, and market snapshot.",
        parameters: situationsListParameters,
        ...jsonResponseOneOf(["SituationList", "SituationStrippedList"]),
      },
    },
    "/v1/situations/watchlists": {
      get: {
        tags: ["Special Situations"],
        summary: "List situation-scoped watchlist monitors for the current organization",
        parameters: [
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 25 } },
          { name: "cursor", in: "query", required: false, schema: { type: "integer", minimum: 0 }, description: "Numeric monitor offset from a previous page." },
        ],
      },
      post: {
        tags: ["Special Situations"],
        summary: "Create a situation-scoped watchlist monitor",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "query", "searchMode", "filters"],
                properties: {
                  name: { type: "string", minLength: 1 },
                  query: { type: "string", minLength: 1 },
                  searchMode: { type: "string", enum: ["situation"] },
                  filters: {
                    type: "object",
                    properties: {
                      situationIds: { type: "array", items: { type: "string" } },
                      types: { type: "array", items: { type: "string" } },
                      subtypes: { type: "array", items: { type: "string" } },
                      statuses: { type: "array", items: { type: "string" } },
                      tickers: { type: "array", items: { type: "string" } },
                      sectors: { type: "array", items: { type: "string" } },
                    },
                    additionalProperties: false,
                  },
                  startAt: { type: ["string", "null"], format: "date-time" },
                  delivery: {
                    oneOf: [
                      {
                        type: "object",
                        required: ["type", "config"],
                        properties: {
                          type: { type: "string", enum: ["email"] },
                          config: {
                            type: "object",
                            required: ["to"],
                            properties: { to: { type: "string", format: "email" } },
                            additionalProperties: false,
                          },
                        },
                        additionalProperties: false,
                      },
                      {
                        type: "object",
                        required: ["type", "config"],
                        properties: {
                          type: { type: "string", enum: ["webhook"] },
                          config: {
                            type: "object",
                            required: ["organizationEventFanout"],
                            properties: { organizationEventFanout: { type: "boolean" } },
                            additionalProperties: false,
                          },
                        },
                        additionalProperties: false,
                      },
                    ],
                  },
                },
                additionalProperties: false,
              },
              examples: {
                filterOnly: {
                  summary: "Filter-only API-key-safe watchlist",
                  value: {
                    name: "M&A watch",
                    query: "situations.watch",
                    searchMode: "situation",
                    filters: { types: ["merger"], statuses: ["pending"], tickers: ["AAPL"] },
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Situation-scoped watchlist monitor.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["object", "id", "orgId", "name", "query", "filters", "searchMode", "webhookUrl", "delivery", "isActive", "lastCheckedAt", "createdAt", "updatedAt"],
                  properties: {
                    object: { type: "string", enum: ["monitor"] },
                    id: { type: "string" },
                    orgId: { type: "string" },
                    name: { type: "string" },
                    query: { type: "string" },
                    filters: { type: "object", additionalProperties: true },
                    searchMode: { type: "string", enum: ["situation"] },
                    webhookUrl: { type: ["string", "null"] },
                    delivery: {
                      type: "object",
                      required: ["type", "config", "status"],
                      properties: {
                        type: { type: "string", enum: ["webhook", "email"] },
                        config: { type: "object", additionalProperties: true },
                        status: { type: "string" },
                      },
                    },
                    isActive: { type: "boolean" },
                    lastCheckedAt: { type: ["string", "null"], format: "date-time" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/v1/situations/watchlists/{monitor_id}": {
      get: {
        tags: ["Special Situations"],
        summary: "Retrieve a situation-scoped watchlist monitor by id",
        parameters: [{ name: "monitor_id", in: "path", required: true, schema: { type: "string" } }],
      },
      delete: {
        tags: ["Special Situations"],
        summary: "Deactivate a situation-scoped watchlist monitor",
        parameters: [{ name: "monitor_id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": {
            description: "Deactivated situation-scoped watchlist monitor.",
            content: {
              "application/json": {
                schema: { type: "object" },
              },
            },
          },
        },
      },
    },
    "/v1/situations/issues": {
      get: {
        tags: ["Special Situations"],
        summary: "List immutable, numbered weekly Special Situations Digest issues",
        parameters: [
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 100, default: 24 } },
        ],
        ...jsonResponse("SituationWeeklyIssueList"),
      },
    },
    "/v1/situations/issues/{issue}": {
      get: {
        tags: ["Special Situations"],
        summary: "Retrieve one immutable weekly Special Situations Digest issue by number or slug",
        parameters: [{ name: "issue", in: "path", required: true, schema: { type: "string" } }],
        ...jsonResponse("SituationWeeklyIssue"),
      },
    },
    "/v1/situations/feed": {
      get: {
        tags: ["Special Situations"],
        summary: "Reverse-chronological feed of situation events, each enriched with its parent situation summary",
        parameters: [
          { name: "types", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated situation_type values." },
          { name: "categories", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated filing_event_category values." },
          { name: "tickers", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated tickers." },
          { name: "country", in: "query", required: false, schema: { type: "string" }, description: "ISO 3166-1 alpha-2 country filter." },
          { name: "since", in: "query", required: false, schema: { type: "string" }, description: "Lower bound (ISO datetime) on event time." },
          { name: "cursor", in: "query", required: false, schema: { type: "integer", minimum: 0, maximum: 9007199254740991, default: 0 } },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 100, default: 25 } },
        ],
        ...jsonResponse("SituationFeedItemList"),
      },
    },
    "/v1/situations/feed.rss": {
      get: {
        tags: ["Special Situations"],
        summary: "Paid authenticated RSS feed of situation events",
        description: "RSS XML version of the paid Special Situations event feed. This is distinct from the limited public website RSS preview.",
        parameters: [
          { name: "types", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated situation_type values." },
          { name: "categories", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated filing_event_category values." },
          { name: "tickers", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated tickers." },
          { name: "country", in: "query", required: false, schema: { type: "string" }, description: "ISO 3166-1 alpha-2 country filter." },
          { name: "since", in: "query", required: false, schema: { type: "string" }, description: "Lower bound (ISO datetime) on event time." },
        ],
        responses: {
          "200": {
            description: "RSS XML feed of situation events",
            content: { "application/rss+xml": { schema: { type: "string" } } },
          },
        },
      },
    },
    "/v1/situations/calendar": {
      get: {
        tags: ["Special Situations"],
        summary: "Upcoming situation key dates (record, vote, expiry, expected close) within a horizon of up to 365 days",
        parameters: [
          { name: "types", in: "query", required: false, schema: { type: "string" } },
          { name: "date_types", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated: record,vote,expiry,expected_close." },
          { name: "tickers", in: "query", required: false, schema: { type: "string" } },
          { name: "days", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 365, default: 90 } },
          { name: "cursor", in: "query", required: false, schema: { type: "integer", minimum: 0, maximum: 9007199254740991, default: 0 } },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 100, default: 25 } },
        ],
        ...jsonResponse("SituationCalendarEntryList"),
      },
    },
    "/v1/situations/stats": {
      get: {
        tags: ["Special Situations"],
        summary: "Situation counts by type, status, sector, market-cap bucket, and country with coverage scope",
        parameters: [
          { name: "window", in: "query", required: false, schema: { type: "string" }, description: "Optional ISO date lower bound on last update." },
        ],
        ...jsonResponse("SituationStats"),
      },
    },
    "/v1/situations/performance": {
      get: {
        tags: ["Special Situations"],
        summary: "Closed-situation outcome cohorts: completion rate, median days to close, average premium, terminated/expired counts",
        parameters: [
          { name: "types", in: "query", required: false, schema: { type: "string" } },
          { name: "window", in: "query", required: false, schema: { type: "string" } },
          { name: "group_by", in: "query", required: false, schema: { type: "string", enum: ["type", "subtype"] } },
        ],
        ...jsonResponse("SituationPerformance"),
      },
    },
    "/v1/situations/by-form/{form}": {
      get: {
        tags: ["Special Situations"],
        summary: "List special situations opened or advanced by a given EDGAR form type (e.g. SC 13D, SC TO-T, 425, DEFM14A). The form is expanded to the situation types it triggers.",
        parameters: [
          { name: "form", in: "path", required: true, schema: { type: "string" }, description: "EDGAR form type, URL-encoded (e.g. SC%2013D)." },
          ...situationsByFormQueryParameters,
        ],
        ...jsonResponseOneOf(["SituationList", "SituationStrippedList"]),
      },
    },
    "/v1/situations/{situation_id}/filings": {
      get: {
        tags: ["Special Situations"],
        summary: "Retrieve a situation's per-filing timeline as a paginated sub-resource (oldest first)",
        parameters: [
          { name: "situation_id", in: "path", required: true, schema: { type: "string" } },
          { name: "cursor", in: "query", required: false, schema: { type: "integer", minimum: 0, maximum: 9007199254740991, default: 0 } },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 100, default: 25 } },
        ],
        ...jsonResponse("SituationEventList"),
      },
    },
    "/v1/situations/{situation_id}/summary": {
      get: {
        tags: ["Special Situations"],
        summary: "Retrieve a compact situation summary: rendered markdown, deal terms, and the latest timeline event",
        parameters: [
          { name: "situation_id", in: "path", required: true, schema: { type: "string" } },
        ],
        ...jsonResponse("SituationSummary"),
      },
    },
    "/v1/situations/{situation_id}/underwriting-pack": {
      get: {
        tags: ["Special Situations"],
        summary: "Retrieve a deterministic, source-cited underwriting pack with canonical detail, filing timeline, and Copy-for-LLM markdown",
        description: "This paid endpoint returns canonical Special Situations detail and the SEC filing timeline. It does not provide proprietary enrichment or investment advice.",
        parameters: [
          { name: "situation_id", in: "path", required: true, schema: { type: "string" } },
        ],
        ...jsonResponse("SituationUnderwritingPack"),
      },
    },
    "/v1/situations/{situation_id}/export": {
      get: {
        tags: ["Special Situations"],
        summary: "Render a source-cited Markdown Copy-for-LLM brief for one situation",
        parameters: [
          { name: "situation_id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": {
            description: "Markdown situation brief",
            content: { "text/markdown": { schema: { type: "string" } } },
          },
        },
      },
    },
    "/v1/situations/{situation_id}": {
      get: {
        tags: ["Special Situations"],
        summary: "Retrieve a single situation with its full per-filing timeline (oldest first)",
        parameters: [
          { name: "situation_id", in: "path", required: true, schema: { type: "string" } },
          { name: "enrich", in: "query", required: false, schema: { type: "string", enum: ["true", "false"], default: "true" }, description: "When false, returns the minimal stripped projection. Billed identically." },
        ],
        ...jsonResponseOneOf(["SituationDetail", "SituationStripped"]),
      },
    },
    // ----- Fund letters plane (Track A routes; Track D search/changes) -----
    // Dormant behind OMNI_FUND_LETTERS_ENABLED: every endpoint 404s until the
    // golden-set eval + shadow soak pass. /search, /semantic, and /changes
    // serve the Track D engines (Typesense/Pinecone with Postgres fallbacks,
    // keyset event feed); meter classes and plan gating were live from Track A.
    "/v1/fund-letters": {
      get: {
        tags: ["Fund Letters"],
        summary: "List investor letters from hedge funds, partnerships, and registered funds, filterable by manager, fund, company, period, source, and distribution tier.",
        description: "view=compact returns the trimmed FundLetterCompactList projection (billed identically); view=agent currently equals the default view.",
        parameters: fundLetterListParameters,
        ...jsonResponseOneOf(["FundLetterList", "FundLetterCompactList"]),
      },
    },
    "/v1/fund-letters/search": {
      get: {
        tags: ["Fund Letters"],
        summary: "Full-text search over letter bodies; hits carry page-anchored highlights.",
        description: "Metered as fund_letter_search. Results are a relevance-ranked top-N (hasMore is always false; raise limit or narrow filters to deepen recall). Every highlight anchor verifies against /document?format=markdown bytes. When the full-text engine is unavailable the response degrades to Postgres lexical search, reported via degradedState.",
        parameters: [
          { name: "q", in: "query", required: true, schema: { type: "string" }, description: "Full-text query over letter bodies." },
          ...fundLetterSearchFilterParameters,
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 10 } },
        ],
        ...jsonResponse("FundLetterSearchHitList"),
      },
    },
    "/v1/fund-letters/semantic": {
      get: {
        tags: ["Fund Letters"],
        summary: "Semantic (vector) search over letter content; hits carry similarity scores, matched chunks, and page anchors.",
        description: "Metered as fund_letter_semantic; paid plans only. Results are a relevance-ranked top-N (hasMore is always false). third_party-distribution letters return snippet-capped chunks (their /document is not distributable). On vector-engine failure the response degrades to lexical hits (score 0), reported via degradedState.",
        parameters: [
          { name: "q", in: "query", required: true, schema: { type: "string" }, description: "Natural-language query." },
          { name: "top_k", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 10 } },
          ...fundLetterSearchFilterParameters,
        ],
        ...jsonResponse("FundLetterSemanticHitList"),
      },
    },
    "/v1/fund-letters/changes": {
      get: {
        tags: ["Fund Letters"],
        summary: "Keyset-paginated delta feed of fund-letter events (letter.published, letter.updated, letter.superseded, thesis.extracted, manager.added). Never response-cached.",
        description: "Metered as fund_letter_lookup. The cursor is an opaque keyset token minted by this endpoint (never an offset); malformed cursors 400 as invalid_cursor. nextCursor pins the last returned row whenever the page is non-empty, so pollers resume from it regardless of hasMore.",
        parameters: [
          { name: "types", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated change types." },
          { name: "since", in: "query", required: false, schema: { type: "string" }, description: "Only events created at or after this ISO date/datetime." },
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Events tagged with this ticker." },
          { name: "manager_id", in: "query", required: false, schema: { type: "string" }, description: "mgr_-prefixed manager id." },
          { name: "fund_id", in: "query", required: false, schema: { type: "string" }, description: "fnd_-prefixed fund id." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Events tagged with this CIK." },
          { name: "cursor", in: "query", required: false, schema: { type: "string" }, description: "Opaque keyset cursor from a prior page." },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 10 } },
        ],
        ...jsonResponse("FundLetterChangeList"),
      },
    },
    "/v1/fund-letters/managers": {
      get: {
        tags: ["Fund Letters"],
        summary: "Browse the fund directory: managers (firms) with coverage stats, searchable by fund/CIO name, ticker held, theme, strategy, and 13F quarter.",
        description: "The Fund Directory expansion (letterless 13F managers, the ticker/cik/theme/min_positions/publishes_letters/period/sort filters, and the theme/publishesLetters/has13F/latest13F/references fields) is flag-gated server-side; while it is disabled this endpoint lists letter-publishing managers with the pre-directory fields only and ignores directory-only parameters. latest13F is a summary — follow crossLinks.holdings13F for full holdings.",
        parameters: [
          { name: "q", in: "query", required: false, schema: { type: "string" }, description: "Case-insensitive substring match on the firm name (directory also matches founder/CIO names)." },
          { name: "strategy", in: "query", required: false, schema: { type: "string" }, description: "Strategy approach filter (e.g. long_short_equity); directory also matches styleTags entries." },
          { name: "has_13f", in: "query", required: false, schema: { type: "string", enum: ["true", "false"] }, description: "Only managers with a linked 13F adviser." },
          { name: "min_letters", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 100000 } },
          { name: "ticker", in: "query", required: false, schema: { type: "string" }, description: "Directory: managers whose LATEST 13F holds this ticker (resolved to issuer match keys)." },
          { name: "cik", in: "query", required: false, schema: { type: "string" }, description: "Directory: adviser CIK exact match (padded or unpadded)." },
          { name: "theme", in: "query", required: false, schema: { type: "string" }, description: "Directory: curated theme tag (e.g. value, activist)." },
          { name: "min_positions", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 100000 }, description: "Directory: latest-13F position count at least this many." },
          { name: "publishes_letters", in: "query", required: false, schema: { type: "string", enum: ["true", "false"] }, description: "Directory: letter-publishing managers only (true) or directory-only 13F managers (false)." },
          { name: "period", in: "query", required: false, schema: { type: "string" }, description: "Directory: managers with a 13F report date inside this YYYYQn quarter (alias: quarter)." },
          { name: "sort", in: "query", required: false, schema: { type: "string", enum: ["aum_desc", "positions_desc", "letters_desc", "name_asc"] }, description: "Directory sort; default preserves the pre-directory order (letters desc, name asc)." },
          { name: "cursor", in: "query", required: false, schema: { type: "integer", minimum: 0, maximum: 9007199254740991, default: 0 } },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 100, default: 25 } },
        ],
        ...jsonResponse("FundLetterManagerList"),
      },
    },
    "/v1/fund-letters/managers/{manager_id}": {
      get: {
        tags: ["Fund Letters"],
        summary: "Retrieve one manager profile. Merged manager IDs resolve forever via aliases; the response carries the canonical id plus requestedId when they differ.",
        parameters: [
          { name: "manager_id", in: "path", required: true, schema: { type: "string", pattern: "^mgr_[0-9a-f]{16}$" } },
        ],
        ...jsonResponse("FundLetterManager"),
      },
    },
    "/v1/fund-letters/managers/{manager_id}/overview": {
      get: {
        tags: ["Fund Letters"],
        summary: "Fund Overview: one token-efficient briefing per manager — canonical name, description, founders, website, coverage counts, and the latest letter's highlights with up to 5 headline theses. Pass include=positions for the latest 13F's top-10 positions.",
        description: "Metered as fund_letter_lookup. The manager twin of GET /v1/companies/overview: identity and latest-letter highlights only — no page markdown, no anchors, no full thesis bodies (follow links.letters / links.theses for those). latestLetter is null for a manager with no canonical letters yet. include=positions opts in latest13F: the manager's latest canonical 13F report (amendment/restatement-deduped, never double-counted) with reportDate, filedAt, totalPositions, and the top 10 positions by reported value — rank, issuer, resolved ticker, CUSIP, USD value, shares, pctOfPortfolio. latest13F is omitted when not requested and null when the manager has no adviser CIK or no indexed 13F; page beyond the top 10 via links.holdings13F. Merged manager IDs resolve forever via aliases; the response carries the canonical id plus requestedId when they differ.",
        parameters: [
          { name: "manager_id", in: "path", required: true, schema: { type: "string", pattern: "^mgr_[0-9a-f]{16}$" } },
          { name: "include", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated opt-in enrichments: positions (latest-13F top-10 as latest13F). Omitted enrichments keep the default lean briefing." },
        ],
        ...jsonResponse("FundManagerOverview"),
      },
    },
    "/v1/fund-letters/funds": {
      get: {
        tags: ["Fund Letters"],
        summary: "List funds that publish letters, with per-fund letter counts.",
        parameters: [
          { name: "manager_id", in: "query", required: false, schema: { type: "string" } },
          { name: "q", in: "query", required: false, schema: { type: "string" }, description: "Case-insensitive substring match on the fund name." },
          { name: "cursor", in: "query", required: false, schema: { type: "integer", minimum: 0, maximum: 9007199254740991, default: 0 } },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 100, default: 25 } },
        ],
        ...jsonResponse("FundLetterFundList"),
      },
    },
    "/v1/fund-letters/funds/{fund_id}": {
      get: {
        tags: ["Fund Letters"],
        summary: "Retrieve one fund. Merged fund IDs resolve forever via aliases; the response carries the canonical id plus requestedId when they differ.",
        parameters: [
          { name: "fund_id", in: "path", required: true, schema: { type: "string", pattern: "^fnd_[0-9a-f]{16}$" } },
        ],
        ...jsonResponse("FundLetterFund"),
      },
    },
    "/v1/fund-letters/companies": {
      get: {
        tags: ["Fund Letters"],
        summary: "Company coverage index: every company with at least one extracted thesis, with thesis/manager/letter counts and the latest stance.",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" } },
          { name: "cik", in: "query", required: false, schema: { type: "string" } },
          { name: "cursor", in: "query", required: false, schema: { type: "integer", minimum: 0, maximum: 9007199254740991, default: 0 } },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 100, default: 25 } },
        ],
        ...jsonResponse("FundLetterCompanyCoverageList"),
      },
    },
    "/v1/fund-letters/theses": {
      get: {
        tags: ["Fund Letters"],
        summary: "Cross-cutting thesis screen: structured per-company extractions (relationship, stance, conviction, narratives, verbatim anchored quotes) across all letters.",
        parameters: [
          { name: "ticker", in: "query", required: false, schema: { type: "string" } },
          { name: "cik", in: "query", required: false, schema: { type: "string" } },
          { name: "manager_id", in: "query", required: false, schema: { type: "string" } },
          { name: "fund_id", in: "query", required: false, schema: { type: "string" } },
          { name: "letter_id", in: "query", required: false, schema: { type: "string", pattern: "^ltr_[0-9a-f]{16}$" } },
          { name: "relationship", in: "query", required: false, schema: { type: "string" }, description: "Comma-separated relationship values (long, short, new_position, added, trimmed, sold, exited, watchlist, negative_research, issuer)." },
          { name: "stance", in: "query", required: false, schema: { type: "string", enum: ["bullish", "bearish", "mixed", "neutral"] } },
          { name: "conviction", in: "query", required: false, schema: { type: "string", enum: ["high", "medium", "low", "unknown"] } },
          { name: "period", in: "query", required: false, schema: { type: "string", pattern: "^\\d{4}Q[1-4]$" }, description: "Exact reporting period (YYYYQn)." },
          { name: "period_from", in: "query", required: false, schema: { type: "string", pattern: "^\\d{4}Q[1-4]$" } },
          { name: "period_to", in: "query", required: false, schema: { type: "string", pattern: "^\\d{4}Q[1-4]$" } },
          { name: "since", in: "query", required: false, schema: { type: "string" }, description: "Only theses updated at or after this ISO date/datetime. Requests with since are never response-cached." },
          { name: "cursor", in: "query", required: false, schema: { type: "integer", minimum: 0, maximum: 9007199254740991, default: 0 } },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 100, default: 25 } },
        ],
        ...jsonResponse("FundLetterThesisList"),
      },
    },
    "/v1/fund-letters/{letter_id}": {
      get: {
        tags: ["Fund Letters"],
        summary: "Retrieve one letter with letter-level narratives, performance figures, and inline theses (capped at 25; thesisCount carries the total). Superseded/merged IDs resolve forever via aliases.",
        description: "Detail never inlines page markdown (that is the /document endpoint, metered separately), so view=agent and view=compact currently equal the default detail view.",
        parameters: [
          { name: "letter_id", in: "path", required: true, schema: { type: "string", pattern: "^ltr_[0-9a-f]{16}$" } },
          { name: "view", in: "query", required: false, schema: { type: "string", enum: ["default", "compact", "agent"] } },
        ],
        ...jsonResponse("FundLetterDetail"),
      },
    },
    "/v1/fund-letters/{letter_id}/document": {
      get: {
        tags: ["Fund Letters"],
        summary: "Retrieve the original letter document (format=pdf, 302 redirect) or page-segmented markdown whose bytes verify every anchor (format=markdown).",
        description: "Distribution rules: public_record and fund_published letters serve the full document; third_party letters return 403 document_not_distributable with a sourceUrl hint. EDGAR-sourced letters redirect to the EDGAR primary document. `?sha=` retrieves a superseded source variant's markdown so historical anchors always verify — only when the canonical letter's distribution permits document serving.",
        parameters: [
          { name: "letter_id", in: "path", required: true, schema: { type: "string", pattern: "^ltr_[0-9a-f]{16}$" } },
          { name: "format", in: "query", required: false, schema: { type: "string", enum: ["pdf", "markdown"], default: "pdf" } },
          { name: "sha", in: "query", required: false, schema: { type: "string", pattern: "^[0-9a-f]{64}$" }, description: "Superseded source-variant sha256 (format=markdown only)." },
        ],
        responses: {
          "200": {
            description: "Page-segmented markdown (format=markdown), byte-identical to the stored anchor substrate",
            content: { "application/json": { schema: schemaRef("FundLetterDocumentMarkdown") } },
          },
          "302": {
            description: "Redirect to the original document: a presigned R2 URL for web-sourced PDFs, or the EDGAR primary document URL for EDGAR-sourced letters",
          },
        },
      },
    },
  },
} as const
