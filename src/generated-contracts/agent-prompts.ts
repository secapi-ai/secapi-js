/**
 * Agent prompt library (OMNI-3085).
 *
 * 60 entries across 5 customer personas, 50 v1 + 10 v2-pending. The library
 * is the single source of truth shared by:
 *   - Mintlify docs (`apps/docs/content/agents/prompt-library/<persona>.md`)
 *   - Persona vertical pages (`<Prompt>` block at the bottom of each
 *     `apps/docs/content/for-<persona>.md` mirrors the position-#1 prompt)
 *   - CLI (`secapi agents prompts list/read/copy`)
 *   - Validation gates (`scripts/validate/check_agent_prompt_library.ts` and
 *     `scripts/validate/check_agent_prompt_live.ts`)
 *
 * Each `expectedToolChain` step references a tool name from
 * `services/datastream-api/src/routes/mcp.ts:TOOL_DEFINITIONS`. The structural
 * validator parses that source file at validate-time and rejects unknown tool
 * names, missing required parameters, and topic-key mismatches against the
 * `intelligence.footnotes` enum (`lease, tax, revenue, debt_covenant,
 * segment` — defined in `services/datastream-api/src/lib/footnote-intelligence.ts`).
 *
 * v2-pending entries reference tool names that do not exist yet (e.g.
 * `dilution.warrants_query`, `events.enforcement`). They ship typed in the
 * library so the back-fill PR (when OMNI-3071/3079/3087 + AAER MCP wrap merge)
 * is a single status flip per entry, not a contract migration. The validator
 * skips tool-existence checks for `status: "v2-pending"`.
 */

export const AGENT_PROMPT_PERSONAS = [
  "law-firm",
  "investment-manager",
  "sophisticated-investor",
  "insurance",
  "pr-firm",
] as const

export type AgentPromptPersona = (typeof AGENT_PROMPT_PERSONAS)[number]

export type AgentPromptStatus = "v1" | "v2-pending"

export type AgentPromptToolStep = {
  /** Tool name. Must match TOOL_DEFINITIONS.name in routes/mcp.ts for v1 entries. */
  tool: string
  /** Single-line "why this step" description. */
  purpose: string
  /** Optional sample arguments — keys validate against the tool's input schema. */
  exampleArgs?: Record<string, unknown>
}

export type AgentPrompt = {
  /** Stable kebab-case slug. Convention: `<persona>-<workflow>`. Unique across the library. */
  id: string
  persona: AgentPromptPersona
  status: AgentPromptStatus
  /** Headline shown in nav, cards, and CLI list output. */
  title: string
  /** Workflow grouping within a persona page. */
  category: string
  /** 1-sentence pitch. */
  oneLiner: string
  /** Full copy-paste prompt body. */
  prompt: string
  /** ≥3 distinct tools for v1 entries. v2-pending entries may reference future tools. */
  expectedToolChain: AgentPromptToolStep[]
  /** Output artifact description (memo, table, JSON export, risk-score rubric, etc). */
  expectedOutput: string
  /** Optional caveats or known limitations the agent should surface. */
  caveats?: string[]
  difficulty: "starter" | "intermediate" | "advanced"
  /** For v2-pending: Linear ticket IDs blocking the entry from going live. */
  blockedBy?: string[]
}

export type PersonaDisplayMeta = {
  displayName: string
  slug: AgentPromptPersona
  summary: string
  /** Editorial introduction rendered above the persona's prompt list. */
  intro: string
  /** Optional operational note rendered below the introduction. */
  tip?: string
  /** Evidence standard rendered after the persona's prompt list. */
  evidenceStandard: string
  /** Optional note for the persona index page header — surfaces v1 framing vs v2 expansion. */
  framingNote?: string
}

export const PERSONA_DISPLAY: Record<AgentPromptPersona, PersonaDisplayMeta> = {
  "law-firm": {
    displayName: "Law firm",
    slug: "law-firm",
    summary:
      "Disclosure forensics, deal diligence, enforcement research, and litigation binder workflows for legal teams advising on public-company matters.",
    intro:
      "These prompts organize public-company filing research into reviewable work product. They do not provide legal advice or establish a complete record.",
    tip:
      "For a date window, retrieve candidate records first, then post-filter the returned filingDate locally before selecting sections or exports.",
    evidenceStandard:
      "Treat the cited filing, section, accession number, and filing date as the evidence. Re-open the source filing before relying on a material conclusion.",
  },
  "investment-manager": {
    displayName: "Investment manager",
    slug: "investment-manager",
    summary:
      "Quant research, factor decomposition, 13F-vs-insider divergence, and earnings-context workflows for portfolio managers and analysts.",
    intro:
      "Use these prompts to prepare an investment-committee input, not an investment recommendation. Specify the evaluation date: SEC filings, 13F reports, and factor data have different reporting and update schedules.",
    evidenceStandard:
      "Keep reported filing facts, delayed ownership reports, and model outputs separate. Neither a 13F filing nor Form 4 activity establishes conviction or intent.",
  },
  "sophisticated-investor": {
    displayName: "Sophisticated investor",
    slug: "sophisticated-investor",
    summary:
      "Forensic accounting and insider surveillance for activist, short-thesis, and prosumer analyst workflows.",
    intro:
      "These prompts help pressure-test a thesis against filings and reported market context. They do not establish fraud, manipulation, or an investment conclusion.",
    evidenceStandard:
      "Use the source filing as the record. Preserve fiscal period, filing date, accession, section, and any stated assumptions beside calculated views.",
    framingNote:
      "Forensic accounting workflows: footnote forensics, insider/13F divergence, and cash-flow stress.",
  },
  insurance: {
    displayName: "Insurance and risk",
    slug: "insurance",
    summary:
      "D&O underwriting profile, auditor-change detection, material-weakness scans, and renewal-book monitoring for risk and underwriting teams.",
    intro:
      "These prompts help an underwriting or claims team turn public disclosures into a reviewable research packet. They do not score a risk, establish coverage, or predict a claim.",
    tip:
      "For a book review, use no more than 50 tickers per batched company call. For every alert, keep the accession number, filing date, and exact disclosure excerpt.",
    evidenceStandard:
      "Use SEC filings as the record. 13F reports are delayed institutional disclosures, Form 4 transactions have transaction-code context, and analytics outputs may change with revised data.",
    framingNote:
      "D&O risk workflows: D&O profile via comp/13F/insider stack, keyword-search auditor changes, and semantic material-weakness detection.",
  },
  "pr-firm": {
    displayName: "PR firm",
    slug: "pr-firm",
    summary:
      "Proxy-season narrative, 8-K material event monitoring, executive transition tracking, and peer benchmarking for IR and crisis-comms teams.",
    intro:
      "These prompts produce factual, source-backed communications research. They do not determine materiality, predict market reaction, or substitute for counsel and issuer review.",
    evidenceStandard:
      "Keep each filing's form, filing date, accession, section, and source URL with the briefing. Separate disclosed facts from open questions and proposed messaging.",
  },
}

export const AGENT_PROMPT_LIBRARY_INDEX = {
  intro:
    "Use these prompts with the hosted [SEC API MCP server](/mcp-install). Supply the bracketed inputs, let the agent inspect the relevant tool schemas, and retain filing links and accession numbers in the output.",
  note:
    "SEC API returns public filing and market-derived data. A prompt can organize evidence; it cannot determine legal liability, suitability, underwriting terms, or investment merit.",
  evidence:
    "The prompts favor `entities.resolve`, `filings.search`, `sections.get`, and `sections.search` for primary-source work. Tools such as `intelligence.query`, factor analytics, and 13F data are useful leads or context, not substitutes for the underlying filing.",
} as const

const RAW_AGENT_PROMPT_LIBRARY: readonly AgentPrompt[] = [
  // ----------------------------------------------------------------------------
  // INVESTMENT-MANAGER (12 v1)
  // ----------------------------------------------------------------------------
  {
    id: "investment-manager-factor-decomposition",
    persona: "investment-manager",
    status: "v1",
    title: "Portfolio factor and filing brief",
    category: "Factor research",
    oneLiner:
      "Pull factor exposures and overlay security intelligence for a portfolio or watchlist.",
    prompt:
      "For holdings [TICKER: WEIGHT] as of [DATE], calculate portfolio and security factor context, then retrieve each issuer's latest material filing and recent Form 4 activity. Return factor outputs separately from filing facts, with accession numbers and transaction dates. Factor exposure is descriptive, not a forecast; 13F and Form 4 activity do not establish conviction. Use portfolio.analyze, factors.decomposition, companies.overview, filings.search, and insiders.list.",
    expectedToolChain: [
      { tool: "portfolio.analyze", purpose: "Compute portfolio-level factor weights and country exposure", exampleArgs: { holdings: [{ symbol: "AAPL", weight: 0.3 }, { symbol: "MSFT", weight: 0.4 }, { symbol: "NVDA", weight: 0.3 }], country: "US" } },
      { tool: "factors.decomposition", purpose: "Decompose per-security factor loadings", exampleArgs: { symbol: "AAPL", lookback: 252 } },
      { tool: "companies.overview", purpose: "Current issuer context for each holding", exampleArgs: { ticker: "AAPL" } },
      { tool: "insiders.list", purpose: "Recent Form 4 insider transactions per name", exampleArgs: { ticker: "AAPL", limit: 20 } },
    ],
    expectedOutput: "Per-name research memo (markdown) with factor weights, institutional rotations, insider clusters, and requestId citations.",
    difficulty: "advanced",
  },
  {
    id: "investment-manager-13f-quarterly-rotation",
    persona: "investment-manager",
    status: "v1",
    title: "13F rotation ledger",
    category: "Ownership intelligence",
    oneLiner:
      "Identify quarter-over-quarter institutional rotation across an institutional holder's portfolio.",
    prompt:
      "For 13F manager [13F MANAGER CIK], compare the latest two reported quarters. List additions, exits, and largest changes with the report period, filing date, shares, and reported value; then add recent issuer Form 4 activity as a separate context column for [TOP N] names. A manager CIK is required for `owners.get_13f` and `owners.compare_13f`; do not pass an issuer ticker or issuer CIK. Do not describe a quarterly filing as real-time positioning or infer motive. Use entities.resolve, owners.get_13f, owners.compare_13f, insiders.list, and filings.search.",
    expectedToolChain: [
      { tool: "entities.resolve", purpose: "Resolve the holder identifier to a best-match entity", exampleArgs: { cik: "0001067983" } },
      { tool: "owners.get_13f", purpose: "Latest holdings snapshot", exampleArgs: { cik: "0001067983", limit: 50 } },
      { tool: "owners.compare_13f", purpose: "Quarter-over-quarter delta", exampleArgs: { cik: "0001067983" } },
      { tool: "insiders.list", purpose: "Cross-validate with insider activity per surfaced ticker", exampleArgs: { ticker: "AAPL", limit: 10 } },
    ],
    expectedOutput: "Markdown table of top 30 rotations with insider-buy ratio and one-line interpretation each.",
    difficulty: "intermediate",
  },
  {
    id: "investment-manager-related-stocks-screen",
    persona: "investment-manager",
    status: "v1",
    title: "Comparable-screen review",
    category: "Screening",
    oneLiner:
      "Generate a factor-similar peer set and rank by momentum/quality overlay.",
    prompt:
      "For [TICKER], request up to [N] factor-similar securities and retrieve their latest reported ratios and annual financial statements. Produce a screened peer table with the factor method, fiscal period, and missing-data flags. Similar factor profiles are not business comparability or a valuation conclusion. Use entities.resolve, factors.related_stocks, factors.decomposition, companies.ratios, and companies.financials.",
    expectedToolChain: [
      { tool: "entities.resolve", purpose: "Resolve the seed symbol", exampleArgs: { ticker: "NVDA" } },
      { tool: "factors.related_stocks", purpose: "Factor-similar peer set", exampleArgs: { symbol: "NVDA", limit: 25 } },
      { tool: "factors.decomposition", purpose: "Per-candidate factor weights", exampleArgs: { symbol: "AMD", lookback: 252 } },
      { tool: "companies.ratios", purpose: "TTM valuation/quality ratios per candidate", exampleArgs: { ticker: "AMD", period: "annual", limit: 1 } },
    ],
    expectedOutput: "Ranked markdown table of 25 candidates with factor scores, valuation ratios, and one-line thesis per row.",
    difficulty: "intermediate",
  },
  {
    id: "investment-manager-regime-aware-screen",
    persona: "investment-manager",
    status: "v1",
    title: "Regime-aware watchlist note",
    category: "Macro overlay",
    oneLiner:
      "Pick factors aligned with the current macro regime and rank a watchlist accordingly.",
    prompt:
      "For [TICKER LIST] and country [COUNTRY], retrieve the current macro regime, high-signal macro pack, factor dashboard, and each security's factor decomposition. Write a dated watchlist note that separates observed macro data from factor analytics and calls out data freshness. Do not turn a regime classification into a timing recommendation. Use macro.regimes, macro.high_signal_pack, factors.dashboard, factors.decomposition, and portfolio.analyze.",
    expectedToolChain: [
      { tool: "macro.regimes", purpose: "Current regime classification", exampleArgs: { country: "US", lookback: 252 } },
      { tool: "macro.high_signal_pack", purpose: "Top macro indicator pack for regime context", exampleArgs: { country: "US" } },
      { tool: "factors.dashboard", purpose: "Factor returns aligned with regime", exampleArgs: { country: "US", category: "momentum", lookback: 90 } },
      { tool: "portfolio.analyze", purpose: "Apply factor weights to candidate portfolio", exampleArgs: { holdings: [{ symbol: "AAPL", weight: 0.5 }, { symbol: "NVDA", weight: 0.5 }], country: "US" } },
    ],
    expectedOutput: "Ranked screen of regime-aligned names + 1-paragraph regime narrative.",
    difficulty: "advanced",
  },
  {
    id: "investment-manager-earnings-context-pack",
    persona: "investment-manager",
    status: "v1",
    title: "Earnings-context pack",
    category: "Earnings prep",
    oneLiner:
      "Compile recent fundamentals, management guidance, and the latest MD&A excerpt before an earnings print.",
    prompt:
      "For [TICKER] before [EVENT DATE], retrieve the last four reported quarters of income statements, the latest 10-Q MD&A, and recent 8-K filings. Identify reported sequential changes and link each explanation to the filing section; label open questions rather than predicting the print. Use entities.resolve, companies.income_statements, sections.get, filings.search, and filings.latest.",
    expectedToolChain: [
      { tool: "entities.resolve", purpose: "Resolve to best-match CIK", exampleArgs: { ticker: "AAPL" } },
      { tool: "companies.income_statements", purpose: "Trailing four quarters", exampleArgs: { ticker: "AAPL", period: "quarterly", limit: 4 } },
      { tool: "sections.get", purpose: "Latest MD&A from 10-Q", exampleArgs: { ticker: "AAPL", form: "10-Q", sectionKey: "item_2" } },
      { tool: "filings.search", purpose: "Recent earnings-related 8-K disclosures", exampleArgs: { ticker: "AAPL", form: "8-K", limit: 8 } },
    ],
    expectedOutput: "1-page earnings brief with setup, debate, watch-points.",
    difficulty: "starter",
  },
  {
    id: "investment-manager-multi-period-fundamental-trend",
    persona: "investment-manager",
    status: "v1",
    title: "Multi-year fundamentals table",
    category: "Fundamentals",
    oneLiner:
      "Walk five years of revenue, margins, cash conversion, and ratios for a name.",
    prompt:
      "For [TICKER] across [FY FROM]-[FY TO], retrieve annual income, balance-sheet, cash-flow, and ratio data. Create a period-aligned table of reported revenue, margins, cash flow, debt, and documented inflections, with fiscal-year labels. Do not compare non-comparable periods or attribute a change without a cited filing discussion. Use entities.resolve, companies.income_statements, companies.balance_sheets, companies.cash_flow_statements, and companies.ratios. For a date window, MCP `filings.search` and `sections.search` do not filter by date: fetch candidate records, then post-filter the returned `filingDate` locally before selecting sections or reporting results.",
    expectedToolChain: [
      { tool: "entities.resolve", purpose: "Resolve to best-match CIK", exampleArgs: { ticker: "MSFT" } },
      { tool: "companies.income_statements", purpose: "5-year income trend", exampleArgs: { ticker: "MSFT", period: "annual", limit: 5 } },
      { tool: "companies.cash_flow_statements", purpose: "5-year cash flow trend", exampleArgs: { ticker: "MSFT", period: "annual", limit: 5 } },
      { tool: "companies.ratios", purpose: "5-year ratios trend", exampleArgs: { ticker: "MSFT", period: "annual", limit: 5 } },
    ],
    expectedOutput: "Year-over-year delta table + hypothesized drivers for inflection years.",
    difficulty: "starter",
  },
  {
    id: "investment-manager-intelligence-bundle-grounded",
    persona: "investment-manager",
    status: "v1",
    title: "Filing-grounded issuer brief",
    category: "Issuer brief",
    oneLiner:
      "Produce a citation-grounded company intelligence bundle for an allocator brief.",
    prompt:
      "For [TICKER], use intelligence.query only to identify research leads, then retrieve the current balance sheet, relevant footnotes, and MD&A from the underlying filing. Deliver a three-part brief: reported facts, source excerpts, and questions. Every claim needs a form, period, accession, and section or footnote; an intelligence response alone is not a citation. Use intelligence.query, intelligence.footnotes, sections.get, companies.balance_sheets, and filings.search.",
    expectedToolChain: [
      { tool: "intelligence.query", purpose: "Top-of-funnel semantic signal", exampleArgs: { query: "TSLA capital structure governance debate", entities: ["TSLA"] } },
      { tool: "intelligence.footnotes", purpose: "Debt-covenant + segment footnotes", exampleArgs: { ticker: "TSLA", form: "10-K", topics: ["debt_covenant", "segment"] } },
      { tool: "sections.get", purpose: "Item 7 MD&A passages for context", exampleArgs: { ticker: "TSLA", form: "10-K", sectionKey: "item_7" } },
      { tool: "companies.balance_sheets", purpose: "Most recent balance sheet snapshot", exampleArgs: { ticker: "TSLA", period: "quarterly", limit: 1 } },
    ],
    expectedOutput: "Markdown brief with 3 sections + inline filing URL citations.",
    difficulty: "intermediate",
  },
  {
    id: "investment-manager-portfolio-stress-test",
    persona: "investment-manager",
    status: "v1",
    title: "Portfolio scenario stress",
    category: "Risk",
    oneLiner:
      "Project portfolio factor returns across alternative macro regimes.",
    prompt:
      "For holdings [TICKER: WEIGHT], first list available scenarios, then run [SCENARIO KEY] and summarize factor exposures and scenario results. State the valuation date, assumptions, and residual exposures. Treat this as a model scenario, not realized-return history or a hedge instruction. Use portfolio.stress_scenarios, portfolio.stress_test, portfolio.analyze, factors.dashboard, and macro.regimes.",
    expectedToolChain: [
      { tool: "portfolio.analyze", purpose: "Current portfolio factor exposures", exampleArgs: { holdings: [{ symbol: "NVDA", weight: 0.3 }, { symbol: "AAPL", weight: 0.25 }, { symbol: "MSFT", weight: 0.25 }, { symbol: "GOOGL", weight: 0.2 }], country: "US" } },
      { tool: "macro.regimes", purpose: "Current and prior regimes", exampleArgs: { country: "US", lookback: 504 } },
      { tool: "factors.returns", purpose: "Factor returns under each regime", exampleArgs: { keys: ["momentum", "quality", "value"], window: 21, lookback: 252 } },
      { tool: "factors.dashboard", purpose: "Cross-regime factor comparison", exampleArgs: { country: "US", category: "momentum", window: 21, lookback: 252 } },
    ],
    expectedOutput: "1-page IC risk note with stress table + 2-factor swing commentary.",
    difficulty: "advanced",
  },
  {
    id: "investment-manager-insider-13f-divergence",
    persona: "investment-manager",
    status: "v1",
    title: "Insider versus 13F review",
    category: "Smart-money signals",
    oneLiner:
      "Find names where insiders are buying while institutions are selling.",
    prompt:
      "For [TICKER LIST], compare recent Form 4 transactions with the latest two 13F periods for named managers [13F MANAGER CIK LIST]. Keep issuer insiders, transaction codes, and 13F holdings in separate fields with dates. `owners.get_13f` and `owners.compare_13f` require each manager CIK, not the issuer ticker or issuer CIK. Rank only by clearly defined reported measures; do not characterize the combination as a buy or sell signal. Use entities.resolve, insiders.list, owners.get_13f, owners.compare_13f, and filings.search.",
    expectedToolChain: [
      { tool: "entities.resolve", purpose: "Resolve each ticker", exampleArgs: { ticker: "MULN" } },
      { tool: "insiders.list", purpose: "90-day insider transaction history", exampleArgs: { ticker: "MULN", limit: 50 } },
      { tool: "owners.get_13f", purpose: "Latest holdings for a named 13F manager", exampleArgs: { cik: "0001067983" } },
      { tool: "owners.compare_13f", purpose: "Quarter-over-quarter delta for that 13F manager", exampleArgs: { cik: "0001067983" } },
    ],
    expectedOutput: "Ranked table of divergence candidates with insider $ + institutional Δshares.",
    difficulty: "intermediate",
  },
  {
    id: "investment-manager-comp-aligned-incentives",
    persona: "investment-manager",
    status: "v1",
    title: "Executive-pay context review",
    category: "Governance",
    oneLiner:
      "Compare named-executive compensation against SEC-derived financial context.",
    prompt:
      "For [TICKER], retrieve the latest and prior proxy compensation disclosures, current financial statements, and factor-similar peers' compensation records. Compare reported pay components and performance measures with fiscal periods shown. Do not assign a pay-for-performance score unless its formula and missing inputs are explicit. Use entities.resolve, comp.list, comp.compare, companies.ratios, and factors.related_stocks.",
    expectedToolChain: [
      { tool: "entities.resolve", purpose: "Resolve to best-match CIK", exampleArgs: { ticker: "META" } },
      { tool: "comp.list", purpose: "Latest named-executive comp", exampleArgs: { ticker: "META", limit: 10 } },
      { tool: "comp.compare", purpose: "Year-over-year comp comparison", exampleArgs: { ticker: "META", limit: 10 } },
      { tool: "companies.ratios", purpose: "SEC-derived financial ratio context", exampleArgs: { ticker: "META", period: "annual", limit: 3 } },
    ],
    expectedOutput: "Alignment scorecard 0-10 with 3 bullets and supporting figures.",
    difficulty: "intermediate",
  },
  {
    id: "investment-manager-segment-revenue-forensics",
    persona: "investment-manager",
    status: "v1",
    title: "Segment trajectory reading",
    category: "Fundamentals",
    oneLiner:
      "Walk segment revenue + segment-disclosure footnotes for a diversified issuer.",
    prompt:
      "For [TICKER] across [FY FROM]-[FY TO], retrieve segment footnotes, annual income statements, and Item 8 financial-statement sections. Build a segment table from reported disclosures and identify changes management discusses. Do not manufacture segment margins or reconcile segments beyond disclosed data. Use entities.resolve, intelligence.footnotes, companies.income_statements, sections.get, and filings.search. For a date window, MCP `filings.search` and `sections.search` do not filter by date: fetch candidate records, then post-filter the returned `filingDate` locally before selecting sections or reporting results.",
    expectedToolChain: [
      { tool: "entities.resolve", purpose: "Resolve to best-match CIK", exampleArgs: { ticker: "AMZN" } },
      { tool: "intelligence.footnotes", purpose: "Segment-disclosure footnotes", exampleArgs: { ticker: "AMZN", form: "10-K", topics: ["segment"] } },
      { tool: "companies.income_statements", purpose: "5-year segmented income", exampleArgs: { ticker: "AMZN", period: "annual", limit: 5 } },
      { tool: "sections.get", purpose: "Item 8 financial-statement segment narrative", exampleArgs: { ticker: "AMZN", form: "10-K", sectionKey: "item_8" } },
    ],
    expectedOutput: "Markdown narrative + segment-mix waterfall covering 5 years.",
    difficulty: "advanced",
  },
  {
    id: "investment-manager-macro-tilt-recommendation",
    persona: "investment-manager",
    status: "v1",
    title: "Cross-country macro tilt memo",
    category: "Macro overlay",
    oneLiner:
      "Compare regimes across major markets and draft country/factor tilt research scenarios.",
    prompt:
      "Compare countries [COUNTRY LIST] using macro regimes, high-signal packs, and factor dashboards for [LOOKBACK]. Produce dated scenarios for a portfolio [HOLDINGS], stating source freshness and what would falsify each scenario. Do not recommend allocation changes or present modeled relationships as forecasts. Use macro.regimes, macro.high_signal_pack, macro.country_report, factors.dashboard, and portfolio.analyze. For a date window, MCP `filings.search` and `sections.search` do not filter by date: fetch candidate records, then post-filter the returned `filingDate` locally before selecting sections or reporting results.",
    expectedToolChain: [
      { tool: "macro.regimes", purpose: "Per-country regime classifications", exampleArgs: { country: "US", lookback: 252 } },
      { tool: "macro.indicators", purpose: "Recent indicator history per country", exampleArgs: { country: "US", indicatorKey: "industrial_production", limit: 12 } },
      { tool: "macro.high_signal_pack", purpose: "Top-of-stack indicators per country", exampleArgs: { country: "US" } },
      { tool: "portfolio.analyze", purpose: "Apply tilts to a baseline portfolio", exampleArgs: { holdings: [{ symbol: "SPY", weight: 0.4 }, { symbol: "EFA", weight: 0.3 }, { symbol: "EEM", weight: 0.3 }], country: "US" } },
    ],
    expectedOutput: "Country/factor tilt table + 4-paragraph rationale.",
    difficulty: "advanced",
  },

  // ----------------------------------------------------------------------------
  // LAW-FIRM (12 v1)
  // ----------------------------------------------------------------------------
  {
    id: "law-firm-enforcement-history",
    persona: "law-firm",
    status: "v1",
    title: "Issuer disclosure dossier",
    category: "Enforcement research",
    oneLiner:
      "Compile 12 months of filings, legal proceedings, and insider activity for due diligence.",
    prompt:
      "For [TICKER] during [DATE RANGE], resolve the issuer and inventory 10-K, 10-Q, 8-K, and DEF 14A filings. Retrieve the latest 10-K Item 3 and Item 1A, recent Item 5.02 disclosures, and Form 4 activity. Deliver a chronology with form, filed date, accession, section, and short neutral description. Do not call something enforcement history unless an SEC or issuer source expressly says so. Use entities.resolve, filings.search, sections.get, sections.search, and insiders.list. For a date window, MCP `filings.search` and `sections.search` do not filter by date: fetch candidate records, then post-filter the returned `filingDate` locally before selecting sections or reporting results.",
    expectedToolChain: [
      { tool: "entities.resolve", purpose: "Resolve the target to the best-match CIK", exampleArgs: { ticker: "WFC" } },
      { tool: "filings.search", purpose: "12-month filing history", exampleArgs: { ticker: "WFC", limit: 50 } },
      { tool: "sections.get", purpose: "Item 3 legal proceedings from latest 10-K", exampleArgs: { ticker: "WFC", form: "10-K", sectionKey: "item_3" } },
      { tool: "insiders.list", purpose: "12-month insider transaction history", exampleArgs: { ticker: "WFC", limit: 50 } },
    ],
    expectedOutput: "Disclosure dossier (markdown) with 4 sections + inline requestId citations.",
    difficulty: "intermediate",
  },
  {
    id: "law-firm-deal-disclosure-diligence",
    persona: "law-firm",
    status: "v1",
    title: "Material-agreement diligence",
    category: "Deal diligence",
    oneLiner:
      "Pull the most recent 8-K Item 1.01 material agreement and produce a litigation-ready PDF.",
    prompt:
      "For [TICKER] and [DATE RANGE], locate 8-K Item 1.01 disclosures and retrieve each matching section and filing metadata. Identify only counterparties, agreement type, dates, and terms actually disclosed; export a selected accession in [PDF OR DOCX] only after confirming it. Return a citation table and unanswered-diligence questions. Do not infer terms from a filing title. Use entities.resolve, filings.search, sections.search, sections.get, and filings.export. For a date window, MCP `filings.search` and `sections.search` do not filter by date: fetch candidate records, then post-filter the returned `filingDate` locally before selecting sections or reporting results.",
    expectedToolChain: [
      { tool: "entities.resolve", purpose: "Resolve target to CIK", exampleArgs: { ticker: "MSFT" } },
      { tool: "filings.search", purpose: "Find recent 8-K filings", exampleArgs: { ticker: "MSFT", form: "8-K", limit: 10 } },
      { tool: "sections.get", purpose: "Extract Item 1.01 text", exampleArgs: { ticker: "MSFT", form: "8-K", sectionKey: "item_1_01" } },
      { tool: "filings.export", purpose: "Render 8-K to PDF for the binder", exampleArgs: { accessionNumber: "0000950170-24-012345", format: "pdf" } },
    ],
    expectedOutput: "Item 1.01 extract + rendered 8-K PDF (base64) + counterparty/clause summary.",
    difficulty: "intermediate",
  },
  {
    id: "law-firm-proxy-fight-vote-analysis",
    persona: "law-firm",
    status: "v1",
    title: "Meeting-vote precedent memo",
    category: "Governance research",
    oneLiner:
      "Pull voting results, comp context, and 8-K Item 5.07 narrative for a contested proxy.",
    prompt:
      "For [TICKER] and meeting date [DATE], retrieve structured voting results, the related Item 5.07 disclosure, and the relevant DEF 14A compensation record. Reconcile proposal labels and vote outcomes to the source filings, noting the meeting type and reporting date. Do not characterize a vote as contested or infer investor intent without filing support. Use entities.resolve, events.voting_results, sections.get, comp.list, and filings.search.",
    expectedToolChain: [
      { tool: "entities.resolve", purpose: "Resolve issuer", exampleArgs: { ticker: "DIS" } },
      { tool: "events.voting_results", purpose: "Latest annual meeting tally", exampleArgs: { ticker: "DIS", meeting_type: "annual", limit: 5 } },
      { tool: "comp.list", purpose: "Named-executive comp same cycle", exampleArgs: { ticker: "DIS", limit: 10 } },
      { tool: "sections.get", purpose: "Item 5.07 8-K narrative", exampleArgs: { ticker: "DIS", form: "8-K", sectionKey: "item_5_07" } },
    ],
    expectedOutput: "Precedent memo (markdown) with proposal tallies + comp context + outliers.",
    difficulty: "advanced",
  },
  {
    id: "law-firm-restatement-detection",
    persona: "law-firm",
    status: "v1",
    title: "Amendment and controls queue",
    category: "Disclosure forensics",
    oneLiner:
      "Search a watchlist for 10-K/A restatements + Item 9A material-weakness language.",
    prompt:
      "For [TICKER LIST] over [24 MONTHS], find 10-K/A and 10-Q/A filings, search for restatement, revision, and non-reliance language, and retrieve related Item 9A or 4.02 sections. Map original and amended accessions where available. An amendment is not necessarily a restatement; report the issuer's wording and affected periods. Use entities.resolve, filings.search, sections.search, sections.get, and filings.latest. For a date window, MCP `filings.search` and `sections.search` do not filter by date: fetch candidate records, then post-filter the returned `filingDate` locally before selecting sections or reporting results.",
    expectedToolChain: [
      { tool: "entities.resolve", purpose: "Resolve each ticker", exampleArgs: { ticker: "MULN" } },
      { tool: "filings.search", purpose: "10-K/A filing history", exampleArgs: { ticker: "MULN", form: "10-K/A", limit: 10 } },
      { tool: "sections.search", purpose: "Find restatement language", exampleArgs: { ticker: "MULN", q: "restatement", form: "10-K/A", limit: 5 } },
      { tool: "sections.get", purpose: "Item 9A material-weakness text", exampleArgs: { ticker: "MULN", form: "10-K", sectionKey: "item_9a" } },
    ],
    expectedOutput: "Severity-ranked table of restatements + material-weakness disclosures.",
    caveats: [
      "Material-weakness detection is keyword-based on Item 9A text.",
    ],
    difficulty: "advanced",
  },
  {
    id: "law-firm-litigation-binder-export",
    persona: "law-firm",
    status: "v1",
    title: "Filing binder manifest",
    category: "Litigation support",
    oneLiner:
      "Produce a multi-format binder of relevant filings for a litigation matter.",
    prompt:
      "For [TICKER], collect the latest 10-K, the latest [N] 10-Qs, and 8-Ks matching [SEARCH TERMS]. Produce a manifest with accession, form, filed date, source URL, and requested export format [PDF/DOCX]. After selecting each manifest row, call `filings.export` with that row's `accessionNumber` and the requested `format` (`pdf` or `docx`); do not use `filings.render` for binder exports. Record hashes or identifiers returned. The output is a research binder, not a chain-of-custody certification. Use entities.resolve, filings.search, filings.latest, and filings.export.",
    expectedToolChain: [
      { tool: "entities.resolve", purpose: "Resolve defendant", exampleArgs: { ticker: "WFC" } },
      { tool: "filings.search", purpose: "Find target filings", exampleArgs: { ticker: "WFC", limit: 20 } },
      { tool: "filings.export", purpose: "PDF binder copy", exampleArgs: { accessionNumber: "0000072971-24-000045", format: "pdf" } },
      { tool: "filings.export", purpose: "DOCX markup-ready copy", exampleArgs: { accessionNumber: "0000072971-24-000045", format: "docx" } },
    ],
    expectedOutput: "Set of binder files (base64) + chain-of-custody log table.",
    difficulty: "starter",
  },
  {
    id: "law-firm-officer-departure-monitoring",
    persona: "law-firm",
    status: "v1",
    title: "Officer-change disclosure monitor",
    category: "Event monitoring",
    oneLiner:
      "Detect 8-K Item 5.02 officer departures for D&O claim-prevention monitoring.",
    prompt:
      "For [TICKER LIST] in [DATE RANGE], locate Item 5.02 disclosures and retrieve the complete section. State the filing's description of appointment, resignation, retirement, termination, or board change; add latest disclosed compensation and Form 4 context only for confirmed people. Do not infer cause or legal significance. Use filings.search, sections.search, sections.get, comp.list, and insiders.list. For a date window, MCP `filings.search` and `sections.search` do not filter by date: fetch candidate records, then post-filter the returned `filingDate` locally before selecting sections or reporting results.",
    expectedToolChain: [
      { tool: "filings.search", purpose: "Recent 8-K filings", exampleArgs: { form: "8-K", limit: 100 } },
      { tool: "sections.search", purpose: "Find Item 5.02 disclosures", exampleArgs: { form: "8-K", q: "resignation appointment", limit: 50 } },
      { tool: "sections.get", purpose: "Extract Item 5.02 text per match", exampleArgs: { ticker: "WFC", form: "8-K", sectionKey: "item_5_02" } },
      { tool: "insiders.list", purpose: "Departing executive's recent trades", exampleArgs: { ticker: "WFC", limit: 20 } },
    ],
    expectedOutput: "Ranked alert list with Item 5.02 text + comp + trading activity per departure.",
    difficulty: "intermediate",
  },
  {
    id: "law-firm-insider-trading-pattern-review",
    persona: "law-firm",
    status: "v1",
    title: "Section 16 research packet",
    category: "Compliance review",
    oneLiner:
      "Surface insider clusters and cross-reference with comp grants for Section 16 filings.",
    prompt:
      "For [TICKER] in [DATE RANGE], list Form 4 transactions by reporting person, transaction code, date, price, and reported shares. Compare the result with proxy compensation disclosures and relevant Form 4 footnotes where available. Flag transactions for reviewer attention using objective thresholds [THRESHOLD], not a conclusion of compliance or noncompliance. Use entities.resolve, insiders.list, comp.list, filings.search, and sections.get. For a date window, MCP `filings.search` and `sections.search` do not filter by date: fetch candidate records, then post-filter the returned `filingDate` locally before selecting sections or reporting results.",
    expectedToolChain: [
      { tool: "entities.resolve", purpose: "Resolve issuer", exampleArgs: { ticker: "ORCL" } },
      { tool: "insiders.list", purpose: "180-day insider transactions", exampleArgs: { ticker: "ORCL", limit: 100 } },
      { tool: "comp.list", purpose: "Named-executive comp + grant schedule", exampleArgs: { ticker: "ORCL", limit: 10 } },
      { tool: "filings.search", purpose: "Find the supporting Form 4 filing records", exampleArgs: { ticker: "ORCL", form: "4", limit: 50 } },
    ],
    expectedOutput: "Section 16 review packet with insider clusters + grant alignment + ≥$1M sales flagged.",
    difficulty: "advanced",
  },
  {
    id: "law-firm-disclosure-comparison-peer",
    persona: "law-firm",
    status: "v1",
    title: "Peer risk-factor comparison",
    category: "Disclosure comparison",
    oneLiner:
      "Benchmark a client's Item 1A risk factors against factor-similar peers.",
    prompt:
      "For [TICKER] and peer list [TICKERS], retrieve each latest 10-K Item 1A and build a topic matrix using explicit source excerpts. You may use factors.related_stocks to suggest candidates, but confirm issuer and fiscal-year comparability first. Report differences in disclosure, not missing legal obligations or proposed drafting. Use entities.resolve, factors.related_stocks, sections.get, sections.search, and filings.search.",
    expectedToolChain: [
      { tool: "entities.resolve", purpose: "Resolve subject and peers", exampleArgs: { ticker: "NVDA" } },
      { tool: "factors.related_stocks", purpose: "Factor-similar peer set", exampleArgs: { symbol: "NVDA", limit: 10 } },
      { tool: "sections.get", purpose: "Item 1A from each peer's 10-K", exampleArgs: { ticker: "AMD", form: "10-K", sectionKey: "item_1a" } },
      { tool: "intelligence.query", purpose: "Surface common risk-factor topics across the cohort", exampleArgs: { query: "common risk factors semiconductor industry 10-K", entities: ["NVDA", "AMD", "INTC"] } },
    ],
    expectedOutput: "Comparison matrix + draft risk-factor additions.",
    difficulty: "advanced",
  },
  {
    id: "law-firm-regulatory-search-thematic",
    persona: "law-firm",
    status: "v1",
    title: "Cross-issuer disclosure study",
    category: "Regulatory research",
    oneLiner:
      "Search semantically across filings for an emerging regulatory theme.",
    prompt:
      "Research how issuers discuss [TOPIC] in [FORM] filed during [DATE RANGE]. Use intelligence.query to find leads, then retrieve and quote the minimal relevant filing sections for [N] representative issuers. Classify the disclosed approaches and cite every excerpt. The search is not a complete survey and cannot establish market practice. Use intelligence.query, sections.search, sections.get, filings.search, and filings.export. For a date window, MCP `filings.search` and `sections.search` do not filter by date: fetch candidate records, then post-filter the returned `filingDate` locally before selecting sections or reporting results.",
    expectedToolChain: [
      { tool: "intelligence.query", purpose: "Semantic search across 10-Ks", exampleArgs: { query: "AI governance data privacy risk factor 10-K disclosure", lookback: 365 } },
      { tool: "sections.search", purpose: "Find specific risk-factor sections", exampleArgs: { q: "artificial intelligence governance", form: "10-K", limit: 20 } },
      { tool: "filings.search", purpose: "Underlying filings inventory", exampleArgs: { form: "10-K", limit: 20 } },
      { tool: "filings.export", purpose: "PDF of representative filings", exampleArgs: { accessionNumber: "0000950170-24-012345", format: "pdf" } },
    ],
    expectedOutput: "Thematic memo with 3 excerpts + disclosure approach taxonomy.",
    difficulty: "advanced",
  },
  {
    id: "law-firm-going-concern-keyword-scan",
    persona: "law-firm",
    status: "v1",
    title: "Going-concern disclosure scan",
    category: "Solvency monitoring",
    oneLiner:
      "Sweep watchlist filings for substantial-doubt and going-concern language.",
    prompt:
      "For [TICKER LIST] and [DATE RANGE], search 10-K and 10-Q filings for going-concern and substantial-doubt language. Retrieve matching sections plus current balance-sheet and cash-flow data, preserving fiscal periods. Report management's stated plans and reported liquidity; do not calculate a solvency opinion or legal conclusion. Use sections.search, sections.get, companies.balance_sheets, companies.cash_flow_statements, and filings.search. For a date window, MCP `filings.search` and `sections.search` do not filter by date: fetch candidate records, then post-filter the returned `filingDate` locally before selecting sections or reporting results.",
    expectedToolChain: [
      { tool: "sections.search", purpose: "Going-concern language search", exampleArgs: { q: "going concern substantial doubt", form: "10-K", limit: 50 } },
      { tool: "sections.get", purpose: "Item 9A internal-controls text", exampleArgs: { ticker: "MULN", form: "10-K", sectionKey: "item_9a" } },
      { tool: "companies.balance_sheets", purpose: "Latest balance sheet for runway estimation", exampleArgs: { ticker: "MULN", period: "quarterly", limit: 1 } },
      { tool: "companies.cash_flow_statements", purpose: "Burn-rate context", exampleArgs: { ticker: "MULN", period: "quarterly", limit: 4 } },
    ],
    expectedOutput: "Runway-ranked alert table for going-concern candidates.",
    caveats: [
      "Runway computation is approximate; uses cash + ST investments / TTM operating cash burn.",
    ],
    difficulty: "intermediate",
  },
  {
    id: "law-firm-defendant-financial-baseline",
    persona: "law-firm",
    status: "v1",
    title: "Financial baseline for expert review",
    category: "Litigation support",
    oneLiner:
      "Pull a financial baseline (revenue, margins, market cap) for damages computation.",
    prompt:
      "For [TICKER] as of [DATE], retrieve latest annual and quarterly financial statements, key ratios, and a current market snapshot. Build a source table that distinguishes reported values from computed ratios and labels each period. Do not supply damages, valuation, causation, or loss opinions. Use entities.resolve, companies.financials, companies.ratios, market.snapshots, and filings.search.",
    expectedToolChain: [
      { tool: "entities.resolve", purpose: "Resolve defendant", exampleArgs: { ticker: "WFC" } },
      { tool: "companies.financials", purpose: "Annual + quarterly fundamentals", exampleArgs: { ticker: "WFC", period: "annual", limit: 3 } },
      { tool: "companies.ratios", purpose: "Key ratios", exampleArgs: { ticker: "WFC", period: "annual", limit: 3 } },
      { tool: "market.snapshots", purpose: "Latest market snapshot", exampleArgs: { symbols: ["WFC"] } },
    ],
    expectedOutput: "1-page financial baseline + key ratios for the damages expert.",
    difficulty: "starter",
  },
  {
    id: "law-firm-d-and-o-binder",
    persona: "law-firm",
    status: "v1",
    title: "Board disclosure binder",
    category: "D&O preparation",
    oneLiner:
      "Build a board-side D&O binder covering comp, ownership, insider activity.",
    prompt:
      "For [TICKER], assemble the latest proxy compensation record, prior-year compensation comparison, latest available institutional-holder snapshot, and [12 MONTHS] of Form 4 transactions. Deliver a neutral governance binder with filing/report dates and sources, keeping delayed 13F data separate from issuer disclosures. Use `owners.institutional_holders` with the issuer ticker or issuer CIK; the manager-specific 13F holdings tool requires a named manager CIK. Do not assess fiduciary duty, board conduct, or D&O coverage. Use comp.list, comp.compare, owners.institutional_holders, insiders.list, and filings.search. For a date window, MCP `filings.search` and `sections.search` do not filter by date: fetch candidate records, then post-filter the returned `filingDate` locally before selecting sections or reporting results.",
    expectedToolChain: [
      { tool: "comp.list", purpose: "Latest comp disclosures", exampleArgs: { ticker: "META", limit: 10 } },
      { tool: "comp.compare", purpose: "Year-over-year comp comparison", exampleArgs: { ticker: "META", limit: 10 } },
      { tool: "owners.institutional_holders", purpose: "Institutional-holder snapshot for the issuer", exampleArgs: { ticker: "META", limit: 20 } },
      { tool: "insiders.list", purpose: "12-month Form 4 history", exampleArgs: { ticker: "META", limit: 50 } },
    ],
    expectedOutput: "D&O binder (markdown) + 1-page governance narrative.",
    difficulty: "intermediate",
  },

  // ----------------------------------------------------------------------------
  // PR-FIRM (12 v1)
  // ----------------------------------------------------------------------------
  {
    id: "pr-firm-voting-results-narrative",
    persona: "pr-firm",
    status: "v1",
    title: "Vote-results client brief",
    category: "Proxy season",
    oneLiner:
      "Pull voting results, comp context, and peer comparison for a proxy-season recap.",
    prompt:
      "For [TICKER] and meeting date [DATE], retrieve voting results, the related 8-K Item 5.07 section, and the current proxy compensation record. Draft a factual briefing with proposal outcomes, disclosed vote counts, and source citations. Do not add sentiment, causes, or a narrative not supported by the filing. Use events.voting_results, sections.get, comp.list, filings.search, and entities.resolve.",
    expectedToolChain: [
      { tool: "events.voting_results", purpose: "Voting results structured pull", exampleArgs: { ticker: "DIS", meeting_type: "annual", limit: 5 } },
      { tool: "comp.list", purpose: "Named-executive comp context", exampleArgs: { ticker: "DIS", limit: 10 } },
      { tool: "intelligence.query", purpose: "Surface narrative context for the meeting", exampleArgs: { query: "proxy season say-on-pay director election outcome", entities: ["DIS"] } },
      { tool: "factors.related_stocks", purpose: "Peer set for comparative recap", exampleArgs: { symbol: "DIS", limit: 5 } },
    ],
    expectedOutput: "Proxy-season recap memo (markdown) + comparative peer table.",
    difficulty: "intermediate",
  },
  {
    id: "pr-firm-8k-material-event-monitoring",
    persona: "pr-firm",
    status: "v1",
    title: "Material-event monitoring digest",
    category: "Event monitoring",
    oneLiner:
      "Sweep client portfolio 8-K filings for material-event disclosures.",
    prompt:
      "For [TICKER LIST] during [DATE RANGE], inventory 8-K filings and retrieve sections for items [ITEM LIST]. Return a client-by-client digest with filing date, accession, disclosed event, and a linkable source reference. Label unknowns and do not call an item material beyond the issuer's filing. Use filings.search, sections.search, sections.get, filings.latest, and entities.resolve. For a date window, MCP `filings.search` and `sections.search` do not filter by date: fetch candidate records, then post-filter the returned `filingDate` locally before selecting sections or reporting results.",
    expectedToolChain: [
      { tool: "entities.resolve", purpose: "Resolve each client to best-match CIK", exampleArgs: { ticker: "DIS" } },
      { tool: "filings.search", purpose: "Recent 8-K filings", exampleArgs: { ticker: "DIS", form: "8-K", limit: 20 } },
      { tool: "sections.search", purpose: "Find Item 8.01 material disclosures", exampleArgs: { form: "8-K", q: "material", limit: 20 } },
      { tool: "sections.get", purpose: "Extract full Item 8.01 text", exampleArgs: { ticker: "DIS", form: "8-K", sectionKey: "item_8_01" } },
    ],
    expectedOutput: "Daily monitoring digest + client-comms scenario per event.",
    difficulty: "intermediate",
  },
  {
    id: "pr-firm-executive-transition-detection",
    persona: "pr-firm",
    status: "v1",
    title: "Executive-transition briefing",
    category: "Crisis comms",
    oneLiner:
      "Surface 8-K Item 5.02 officer transitions and pull supporting comp + insider context.",
    prompt:
      "For [TICKER] in [DATE RANGE], retrieve Item 5.02 disclosures, relevant Form 4 activity, and current proxy compensation context. Produce a facts-first briefing: named person, disclosed role change, effective date, and source. Do not speculate about motive, succession, or market reaction. Use filings.search, sections.search, sections.get, insiders.list, and comp.list. For a date window, MCP `filings.search` and `sections.search` do not filter by date: fetch candidate records, then post-filter the returned `filingDate` locally before selecting sections or reporting results.",
    expectedToolChain: [
      { tool: "filings.search", purpose: "Recent 8-K filings", exampleArgs: { form: "8-K", limit: 50 } },
      { tool: "sections.get", purpose: "Item 5.02 text per match", exampleArgs: { ticker: "DIS", form: "8-K", sectionKey: "item_5_02" } },
      { tool: "comp.compare", purpose: "Departing officer's comp history", exampleArgs: { ticker: "DIS", limit: 10 } },
      { tool: "insiders.list", purpose: "Recent Form 4 trades", exampleArgs: { ticker: "DIS", limit: 20 } },
    ],
    expectedOutput: "Crisis-comms prep packet with reputational-risk ranking.",
    difficulty: "intermediate",
  },
  {
    id: "pr-firm-peer-comparison-context",
    persona: "pr-firm",
    status: "v1",
    title: "Peer event context",
    category: "Peer benchmarking",
    oneLiner:
      "Compare a client's financial posture against factor-similar peers for crisis prep.",
    prompt:
      "For [TICKER] and [PEER LIST], retrieve current financial statements and recent 8-K filings for [TOPIC]. Provide a dated comparison table with each issuer's reported facts and citations. A factor-similar cohort is a research aid, not a communications benchmark. Use entities.resolve, factors.related_stocks, companies.financials, filings.search, and sections.search.",
    expectedToolChain: [
      { tool: "entities.resolve", purpose: "Resolve client", exampleArgs: { ticker: "NFLX" } },
      { tool: "factors.related_stocks", purpose: "Factor-similar peer set", exampleArgs: { symbol: "NFLX", limit: 10 } },
      { tool: "companies.financials", purpose: "Peer fundamentals", exampleArgs: { ticker: "DIS", period: "annual", limit: 1 } },
      { tool: "comp.list", purpose: "Peer named-executive comp", exampleArgs: { ticker: "DIS", limit: 5 } },
    ],
    expectedOutput: "Peer comparison table + 3 message-framings for crisis comms.",
    difficulty: "intermediate",
  },
  {
    id: "pr-firm-quiet-period-trading-watch",
    persona: "pr-firm",
    status: "v1",
    title: "Quiet-period transaction facts",
    category: "Compliance comms",
    oneLiner:
      "Surface insider trades that occurred during quiet-period windows.",
    prompt:
      "For [TICKER] and internal review window [START]-[END], list reported Form 4 transactions and current compensation disclosures. Provide reporting person, transaction code, transaction date, and filed date, with source references. Do not decide whether a transaction violates a policy or securities law. Use insiders.list, comp.list, filings.search, entities.resolve, and sections.get. For a date window, MCP `filings.search` and `sections.search` do not filter by date: fetch candidate records, then post-filter the returned `filingDate` locally before selecting sections or reporting results.",
    expectedToolChain: [
      { tool: "entities.resolve", purpose: "Resolve client", exampleArgs: { ticker: "NFLX" } },
      { tool: "insiders.list", purpose: "90-day Form 4 transactions", exampleArgs: { ticker: "NFLX", limit: 50 } },
      { tool: "filings.search", purpose: "Recent Form 4 filings", exampleArgs: { ticker: "NFLX", form: "4", limit: 50 } },
      { tool: "sections.search", purpose: "Trading-window policy search", exampleArgs: { ticker: "NFLX", q: "trading window quiet period", limit: 5 } },
    ],
    expectedOutput: "Comms advisory + compliance flag table.",
    difficulty: "advanced",
  },
  {
    id: "pr-firm-acquisition-announcement-context",
    persona: "pr-firm",
    status: "v1",
    title: "Acquisition announcement context",
    category: "Deal comms",
    oneLiner:
      "Pull deal-context filings, comp impact, and entity profile for an acquisition press release.",
    prompt:
      "For [TICKER] and proposed announcement date [DATE], find recent 8-K Item 1.01, 2.01, and 8.01 disclosures and retrieve the relevant sections. Create a facts-only source sheet of disclosed parties, timing, consideration, and stated rationale. Do not draft a release or fill gaps with external reporting. Use filings.search, sections.search, sections.get, filings.latest, and entities.resolve.",
    expectedToolChain: [
      { tool: "filings.search", purpose: "Find recent 8-K Item 1.01 filings", exampleArgs: { form: "8-K", q: "material agreement", limit: 10 } },
      { tool: "sections.get", purpose: "Item 1.01 deal terms", exampleArgs: { ticker: "MSFT", form: "8-K", sectionKey: "item_1_01" } },
      { tool: "entities.resolve", purpose: "Resolve target entity", exampleArgs: { name: "Activision Blizzard" } },
      { tool: "comp.compare", purpose: "Acquirer exec-comp comparison", exampleArgs: { ticker: "MSFT", limit: 10 } },
    ],
    expectedOutput: "Press-release-ready brief with deal terms + target profile + comp implications.",
    difficulty: "intermediate",
  },
  {
    id: "pr-firm-press-release-disclosure-cross-check",
    persona: "pr-firm",
    status: "v1",
    title: "Release-to-filing cross-check",
    category: "Reg FD compliance",
    oneLiner:
      "Validate that draft press release content aligns with latest Reg FD 8-K disclosure.",
    prompt:
      "Compare this draft text: [PASTE TEXT] against [TICKER]'s latest 8-K and 10-Q/10-K sections on [TOPIC]. List statements that are directly supported, unsupported, or need a source check, with filing citations. This is a factual comparison only, not a Regulation FD or legal compliance opinion. Use filings.search, filings.latest, sections.search, sections.get, and filings.render.",
    expectedToolChain: [
      { tool: "filings.search", purpose: "Find recent 8-K Item 7.01 filings", exampleArgs: { ticker: "DIS", form: "8-K", limit: 10 } },
      { tool: "sections.get", purpose: "Item 7.01 Reg FD text", exampleArgs: { ticker: "DIS", form: "8-K", sectionKey: "item_7_01" } },
      { tool: "filings.render", purpose: "Render 8-K to markdown for diff", exampleArgs: { ticker: "DIS", form: "8-K" } },
      { tool: "intelligence.query", purpose: "Semantic alignment check", exampleArgs: { query: "Reg FD disclosure consistency check", entities: ["DIS"] } },
    ],
    expectedOutput: "Reg FD compliance review with claim-by-claim alignment table.",
    difficulty: "advanced",
  },
  {
    id: "pr-firm-results-announcement-prep",
    persona: "pr-firm",
    status: "v1",
    title: "Earnings announcement source pack",
    category: "Earnings comms",
    oneLiner:
      "Pull results, trend context, and MD&A for an earnings press release.",
    prompt:
      "For [TICKER] and quarter [FISCAL QUARTER], retrieve the relevant income statement, 10-Q MD&A, and earnings-related 8-K. Make a table of reported revenue, margins, cash-flow measures, and management discussion with fiscal labels. Do not write forward-looking language or reconcile non-GAAP measures unless the issuer disclosure supplies it. Use companies.income_statements, companies.cash_flow_statements, sections.get, filings.search, and entities.resolve.",
    expectedToolChain: [
      { tool: "entities.resolve", purpose: "Resolve issuer", exampleArgs: { ticker: "AAPL" } },
      { tool: "companies.income_statements", purpose: "Recent quarterly income", exampleArgs: { ticker: "AAPL", period: "quarterly", limit: 4 } },
      { tool: "sections.get", purpose: "Item 2.02 results-of-operations text", exampleArgs: { ticker: "AAPL", form: "8-K", sectionKey: "item_2_02" } },
    ],
    expectedOutput: "Press-release outline with framing + 3 bullets + draft mgmt quote.",
    difficulty: "intermediate",
  },
  {
    id: "pr-firm-shareholder-meeting-narrative",
    persona: "pr-firm",
    status: "v1",
    title: "Shareholder-meeting narrative record",
    category: "Proxy season",
    oneLiner:
      "Build a post-meeting narrative for IR's annual letter using voting results + comp + 8-K text.",
    prompt:
      "For [TICKER]'s [DATE] meeting, reconcile structured voting results, Item 5.07, and the applicable DEF 14A. Prepare a concise outcome record with proposal titles, reported vote outcomes, and citations. Do not claim shareholder sentiment beyond the disclosed vote. Use events.voting_results, sections.get, filings.search, comp.list, and entities.resolve.",
    expectedToolChain: [
      { tool: "events.voting_results", purpose: "Structured voting outcomes", exampleArgs: { ticker: "DIS", meeting_type: "annual", limit: 5 } },
      { tool: "comp.list", purpose: "Same-cycle comp", exampleArgs: { ticker: "DIS", limit: 10 } },
      { tool: "sections.get", purpose: "Item 5.07 8-K narrative", exampleArgs: { ticker: "DIS", form: "8-K", sectionKey: "item_5_07" } },
      { tool: "intelligence.query", purpose: "External commentary signal", exampleArgs: { query: "shareholder meeting outcome analyst response", entities: ["DIS"] } },
    ],
    expectedOutput: "1-page post-meeting narrative for the IR annual letter.",
    difficulty: "intermediate",
  },
  {
    id: "pr-firm-board-composition-change",
    persona: "pr-firm",
    status: "v1",
    title: "Board-change watchlist",
    category: "Governance comms",
    oneLiner:
      "Detect 8-K Item 5.02 board changes and pull supporting comp + ownership context.",
    prompt:
      "For [TICKER LIST] in [DATE RANGE], retrieve Item 5.02 disclosures and list appointments and departures exactly as filed. Add current compensation and institutional-holder data only as dated context. Use `owners.institutional_holders` with each issuer ticker or issuer CIK; do not pass an issuer identifier to the manager-specific 13F holdings tool, which requires a manager CIK. Do not infer governance quality or a rationale for the change. Use filings.search, sections.search, sections.get, comp.compare, and owners.institutional_holders. For a date window, MCP `filings.search` and `sections.search` do not filter by date: fetch candidate records, then post-filter the returned `filingDate` locally before selecting sections or reporting results.",
    expectedToolChain: [
      { tool: "filings.search", purpose: "Recent 8-K filings", exampleArgs: { form: "8-K", limit: 100 } },
      { tool: "sections.get", purpose: "Item 5.02 text per match", exampleArgs: { ticker: "DIS", form: "8-K", sectionKey: "item_5_02" } },
      { tool: "comp.compare", purpose: "Comp comparison context", exampleArgs: { ticker: "DIS", limit: 10 } },
      { tool: "owners.institutional_holders", purpose: "Institutional-holder snapshot for the issuer", exampleArgs: { ticker: "DIS", limit: 20 } },
    ],
    expectedOutput: "Governance-comms digest with appointee profiles + comp context per match.",
    difficulty: "intermediate",
  },
  {
    id: "pr-firm-segment-disclosure-narrative",
    persona: "pr-firm",
    status: "v1",
    title: "Segment roadshow source note",
    category: "Roadshow prep",
    oneLiner:
      "Walk segment footnotes + segment income for an IR roadshow narrative.",
    prompt:
      "For [TICKER], retrieve the latest segment footnote, annual income statement, and Item 8 financial-statement section. Build three discussion points that restate disclosed segment trends and label their fiscal period. Do not create segment margins or future claims not in the filing. Use intelligence.footnotes, companies.income_statements, sections.get, filings.search, and entities.resolve.",
    expectedToolChain: [
      { tool: "intelligence.footnotes", purpose: "Segment-disclosure footnote", exampleArgs: { ticker: "AMZN", form: "10-K", topics: ["segment"] } },
      { tool: "companies.income_statements", purpose: "Segmented income statement", exampleArgs: { ticker: "AMZN", period: "annual", limit: 3 } },
      { tool: "sections.get", purpose: "Item 8 financial-statement narrative", exampleArgs: { ticker: "AMZN", form: "10-K", sectionKey: "item_8" } },
      { tool: "entities.resolve", purpose: "Resolve issuer", exampleArgs: { ticker: "AMZN" } },
    ],
    expectedOutput: "Roadshow narrative + 3 segment-level talking points.",
    difficulty: "intermediate",
  },
  {
    id: "pr-firm-stakeholder-sentiment-pulse",
    persona: "pr-firm",
    status: "v1",
    title: "Stakeholder-context briefing",
    category: "Sentiment monitoring",
    oneLiner:
      "Triangulate stakeholder sentiment using factor peers + ownership rotation + intelligence query.",
    prompt:
      "For [TICKER], create a dated context brief from factor-similar peers, intelligence-query leads for [TOPIC], and the latest reported changes for named 13F managers [13F MANAGER CIK LIST]. `owners.compare_13f` requires each manager CIK; use `owners.institutional_holders` first when you need to discover managers for an issuer. Separate analytics and delayed ownership reports from primary filing evidence. Do not present the output as real-time sentiment, media monitoring, or investor intent. Use entities.resolve, factors.related_stocks, owners.compare_13f, intelligence.query, and filings.search.",
    expectedToolChain: [
      { tool: "entities.resolve", purpose: "Resolve client", exampleArgs: { ticker: "DIS" } },
      { tool: "factors.related_stocks", purpose: "Factor-similar peer cohort", exampleArgs: { symbol: "DIS", limit: 10 } },
      { tool: "owners.compare_13f", purpose: "Cohort rotation signal", exampleArgs: { cik: "0001744489" } },
      { tool: "intelligence.query", purpose: "Analyst sentiment semantic signal", exampleArgs: { query: "analyst sentiment streaming media past 60 days", entities: ["DIS", "NFLX"] } },
    ],
    expectedOutput: "1-page stakeholder-sentiment briefing with 3 takeaways.",
    difficulty: "advanced",
  },

  // ----------------------------------------------------------------------------
  // SOPHISTICATED-INVESTOR (8 v1, 4 v2-pending)
  // ----------------------------------------------------------------------------
  {
    id: "sophisticated-investor-equity-comp-burn-rate",
    persona: "sophisticated-investor",
    status: "v1",
    title: "Equity-compensation dilution review",
    category: "Equity comp forensics",
    oneLiner:
      "Walk equity comp grants vs cash flow vs shares outstanding to surface dilution-via-comp risk.",
    prompt:
      "Test the equity-compensation dilution hypothesis for [TICKER] across fiscal years [FY FROM]-[FY TO]. Retrieve cash-flow statements, income statements, the latest proxy compensation disclosures, and XBRL facts for share-based compensation and weighted-average shares when available. Show the reported values by period, define every calculation, and distinguish expense, grants, and share count. Cite form, fiscal period, accession, and fact tag. Do not invent a burn-rate denominator when the facts are not comparable or treat accounting expense as cash dilution. Use companies.cash_flow_statements, companies.income_statements, comp.list, facts.get, and sections.get. For a date window, MCP `filings.search` and `sections.search` do not filter by date: fetch candidate records, then post-filter the returned `filingDate` locally before selecting sections or reporting results.",
    expectedToolChain: [
      { tool: "comp.list", purpose: "Named-executive comp baseline", exampleArgs: { ticker: "SNOW", limit: 10 } },
      { tool: "companies.cash_flow_statements", purpose: "5-year share-based comp cash flow line", exampleArgs: { ticker: "SNOW", period: "annual", limit: 5 } },
      { tool: "facts.get", purpose: "ShareBasedCompensation XBRL fact", exampleArgs: { ticker: "SNOW", tag: "ShareBasedCompensation", form: "10-K" } },
      { tool: "companies.income_statements", purpose: "Revenue context for burn rate", exampleArgs: { ticker: "SNOW", period: "annual", limit: 5 } },
    ],
    expectedOutput: "Forensic memo + burn-rate table (% revenue, % shares-out).",
    difficulty: "advanced",
  },
  {
    id: "sophisticated-investor-debt-covenant-headroom",
    persona: "sophisticated-investor",
    status: "v1",
    title: "Covenant and liquidity reading",
    category: "Credit forensics",
    oneLiner:
      "Pull debt-covenant footnote + balance sheet to estimate covenant headroom.",
    prompt:
      "For [TICKER] and its latest [10-K OR 10-Q], retrieve debt-covenant footnotes, the balance sheet, cash-flow statement, and MD&A. Extract only disclosed covenant tests, thresholds, amendments, waivers, and stated compliance status. Build a liquidity table from reported cash, debt, and operating cash flow, with period labels. If a covenant ratio cannot be reconstructed from disclosed definitions, say so rather than estimating headroom. Cite each result to its filing source. Use intelligence.footnotes, companies.balance_sheets, companies.cash_flow_statements, sections.get, and companies.ratios.",
    expectedToolChain: [
      { tool: "intelligence.footnotes", purpose: "Debt-covenant footnote text", exampleArgs: { ticker: "HTZ", form: "10-K", topics: ["debt_covenant"] } },
      { tool: "companies.balance_sheets", purpose: "Debt + cash snapshot", exampleArgs: { ticker: "HTZ", period: "quarterly", limit: 1 } },
      { tool: "companies.ratios", purpose: "Leverage + interest coverage", exampleArgs: { ticker: "HTZ", period: "quarterly", limit: 4 } },
      { tool: "sections.get", purpose: "MD&A covenant amendment language", exampleArgs: { ticker: "HTZ", form: "10-K", sectionKey: "item_7" } },
    ],
    expectedOutput: "Covenant headroom % + 3-paragraph risk summary.",
    difficulty: "advanced",
  },
  {
    id: "sophisticated-investor-tax-position-stress",
    persona: "sophisticated-investor",
    status: "v1",
    title: "Tax-position sensitivity",
    category: "Tax forensics",
    oneLiner:
      "Surface uncertain tax positions and stress-test against income statement.",
    prompt:
      "Review [TICKER]'s tax disclosures for fiscal years [FY FROM]-[FY TO]. Retrieve the tax footnote, relevant deferred-tax XBRL facts, income statements, and MD&A. List the reported uncertain-tax-position and valuation-allowance disclosures separately. Model [25/50/100]% changes only as an explicitly hypothetical sensitivity, using the reported base amount and showing the arithmetic. Do not present a scenario as a forecast or assume a tax asset is collectible. Cite form, period, accession, footnote topic, and fact tag. Use intelligence.footnotes, facts.get, companies.income_statements, and sections.get. For a date window, MCP `filings.search` and `sections.search` do not filter by date: fetch candidate records, then post-filter the returned `filingDate` locally before selecting sections or reporting results.",
    expectedToolChain: [
      { tool: "intelligence.footnotes", purpose: "Tax footnote text", exampleArgs: { ticker: "GOOGL", form: "10-K", topics: ["tax"] } },
      { tool: "facts.get", purpose: "DeferredTaxAssetsNet XBRL fact", exampleArgs: { ticker: "GOOGL", tag: "DeferredTaxAssetsNet", form: "10-K" } },
      { tool: "companies.income_statements", purpose: "Effective-tax-rate trajectory", exampleArgs: { ticker: "GOOGL", period: "annual", limit: 3 } },
      { tool: "sections.get", purpose: "MD&A tax discussion", exampleArgs: { ticker: "GOOGL", form: "10-K", sectionKey: "item_7" } },
    ],
    expectedOutput: "Tax forensics memo + 25/50/100% write-down scenario table.",
    difficulty: "advanced",
  },
  {
    id: "sophisticated-investor-revenue-recognition-forensics",
    persona: "sophisticated-investor",
    status: "v1",
    title: "Revenue-quality cross-check",
    category: "Revenue forensics",
    oneLiner:
      "Compare deferred revenue + revenue footnote + income statement for revenue-recognition aggression.",
    prompt:
      "For [TICKER], compare reported revenue, deferred-revenue facts, and the revenue-recognition footnote over [FY FROM]-[FY TO]. Retrieve MD&A passages that explain material period changes. Produce a period-aligned table and identify disclosed changes in contract timing, performance obligations, or policy. Mark any ratio as a researcher-created diagnostic, not a GAAP metric. Do not call a divergence aggressive accounting without a source-supported explanation. Cite each number and excerpt to the underlying filing. Use intelligence.footnotes, facts.get, companies.income_statements, sections.get, and filings.search. For a date window, MCP `filings.search` and `sections.search` do not filter by date: fetch candidate records, then post-filter the returned `filingDate` locally before selecting sections or reporting results.",
    expectedToolChain: [
      { tool: "intelligence.footnotes", purpose: "Revenue-recognition footnote text", exampleArgs: { ticker: "NOW", form: "10-K", topics: ["revenue"] } },
      { tool: "facts.get", purpose: "DeferredRevenue XBRL fact 5-year", exampleArgs: { ticker: "NOW", tag: "DeferredRevenueCurrent", form: "10-K" } },
      { tool: "companies.income_statements", purpose: "5-year revenue trajectory", exampleArgs: { ticker: "NOW", period: "annual", limit: 5 } },
      { tool: "sections.get", purpose: "MD&A revenue discussion", exampleArgs: { ticker: "NOW", form: "10-K", sectionKey: "item_7" } },
    ],
    expectedOutput: "Revenue forensic memo + billings-vs-revenue ratio table.",
    difficulty: "advanced",
  },
  {
    id: "sophisticated-investor-13f-divergence-thesis",
    persona: "sophisticated-investor",
    status: "v1",
    title: "Ownership disagreement map",
    category: "Smart-money signals",
    oneLiner:
      "Surface 13F filers diverging on a name and cross-reference with insider trades + comp.",
    prompt:
      "For [TICKER], first use `owners.institutional_holders` to identify reported institutional holders, then compare the latest two 13F reporting periods only for selected managers [13F MANAGER CIK LIST]. `owners.get_13f` and `owners.compare_13f` require a manager CIK, not the issuer ticker or issuer CIK. Name the largest reported increases and decreases, their reporting dates, and the insiders' transaction codes and values. Keep institutional holdings and insider activity in separate columns; they have different reporting timing and do not show intent. Return a hypothesis ledger with evidence for, evidence against, and unresolved questions. Use owners.institutional_holders, owners.get_13f, owners.compare_13f, insiders.list, entities.resolve, and comp.compare.",
    expectedToolChain: [
      { tool: "owners.institutional_holders", purpose: "Reported institutional holders for the issuer", exampleArgs: { ticker: "GME", limit: 20 } },
      { tool: "owners.get_13f", purpose: "Holdings for a selected 13F manager", exampleArgs: { cik: "0001067983" } },
      { tool: "owners.compare_13f", purpose: "Quarter-over-quarter delta for that manager", exampleArgs: { cik: "0001067983" } },
      { tool: "insiders.list", purpose: "Insider Form 4 history", exampleArgs: { ticker: "GME", limit: 50 } },
      { tool: "comp.compare", purpose: "Comp comparison for executive alignment", exampleArgs: { ticker: "GME", limit: 10 } },
    ],
    expectedOutput: "Divergence memo + long/short thesis validation table.",
    difficulty: "advanced",
  },
  {
    id: "sophisticated-investor-going-concern-sweep",
    persona: "sophisticated-investor",
    status: "v1",
    title: "Going-concern research queue",
    category: "Solvency forensics",
    oneLiner:
      "Find substantial-doubt and going-concern language across small caps and estimate runway.",
    prompt:
      "For [TICKER LIST] in [DATE RANGE], search 10-K and 10-Q sections for \"going concern\" and \"substantial doubt.\" Retrieve the matching disclosure, current balance sheet, and recent cash-flow statements. Make a source queue showing reported cash, recent operating cash flow, and management's stated plan. If you calculate a simple runway proxy, label assumptions and do not treat it as liquidity guidance. Cite form, period, accession, and section. Use sections.search, sections.get, companies.balance_sheets, companies.cash_flow_statements, and filings.search. For a date window, MCP `filings.search` and `sections.search` do not filter by date: fetch candidate records, then post-filter the returned `filingDate` locally before selecting sections or reporting results.",
    expectedToolChain: [
      { tool: "sections.search", purpose: "Going-concern keyword sweep", exampleArgs: { q: "going concern substantial doubt", form: "10-K", limit: 50 } },
      { tool: "sections.get", purpose: "Item 9A internal-controls text", exampleArgs: { ticker: "MULN", form: "10-K", sectionKey: "item_9a" } },
      { tool: "companies.balance_sheets", purpose: "Latest balance sheet for runway", exampleArgs: { ticker: "MULN", period: "quarterly", limit: 1 } },
      { tool: "companies.cash_flow_statements", purpose: "Burn-rate context", exampleArgs: { ticker: "MULN", period: "quarterly", limit: 4 } },
    ],
    expectedOutput: "Runway-ranked alert table + 1-line risk summary per name.",
    difficulty: "intermediate",
  },
  {
    id: "sophisticated-investor-lease-obligations-forensics",
    persona: "sophisticated-investor",
    status: "v1",
    title: "Lease-adjusted leverage worksheet",
    category: "Off-balance-sheet",
    oneLiner:
      "Walk lease footnote + balance sheet + XBRL lease tags to estimate true leverage.",
    prompt:
      "For [TICKER], retrieve lease footnotes, lease-liability facts, the latest balance sheet, and cash-flow statement. Reconcile the reported lease liability to the disclosure before calculating any researcher-defined adjusted leverage measure. State the capitalization multiple [MULTIPLE] and why it is an assumption; provide reported leverage beside the adjusted view. Do not imply that the issuer reports the adjusted result. Cite all inputs to form, period, accession, footnote, or fact tag. Use intelligence.footnotes, facts.get, companies.balance_sheets, companies.cash_flow_statements, and companies.ratios.",
    expectedToolChain: [
      { tool: "intelligence.footnotes", purpose: "Lease footnote text", exampleArgs: { ticker: "M", form: "10-K", topics: ["lease"] } },
      { tool: "facts.get", purpose: "OperatingLeaseLiability XBRL fact", exampleArgs: { ticker: "M", tag: "OperatingLeaseLiabilityCurrent", form: "10-K" } },
      { tool: "companies.balance_sheets", purpose: "Reported balance sheet", exampleArgs: { ticker: "M", period: "annual", limit: 3 } },
      { tool: "companies.cash_flow_statements", purpose: "Lease cash flows", exampleArgs: { ticker: "M", period: "annual", limit: 3 } },
    ],
    expectedOutput: "Lease-adjusted leverage memo + reported-vs-adjusted comparison table.",
    difficulty: "advanced",
  },
  {
    id: "sophisticated-investor-segment-aggregation-forensics",
    persona: "sophisticated-investor",
    status: "v1",
    title: "Segment-disclosure challenge",
    category: "Segment forensics",
    oneLiner:
      "Surface segment-aggregation choices and compare to peer disclosure granularity.",
    prompt:
      "For [TICKER], retrieve the latest segment footnote, income statement, and financial-statement section. Propose up to [10] factor-similar peers, then compare only their disclosed segment count, revenue concentration, and stated reporting structure. Separate reported segments from an analyst's preferred disaggregation. Output a citation table and a list of questions the filing does and does not answer. Do not assert concealment from aggregation alone. Use intelligence.footnotes, companies.income_statements, sections.get, factors.related_stocks, and entities.resolve.",
    expectedToolChain: [
      { tool: "intelligence.footnotes", purpose: "Segment-disclosure footnote", exampleArgs: { ticker: "GE", form: "10-K", topics: ["segment"] } },
      { tool: "companies.income_statements", purpose: "Segmented income", exampleArgs: { ticker: "GE", period: "annual", limit: 3 } },
      { tool: "sections.get", purpose: "Item 8 financial-statement segment narrative", exampleArgs: { ticker: "GE", form: "10-K", sectionKey: "item_8" } },
      { tool: "factors.related_stocks", purpose: "Peer-set comparison", exampleArgs: { symbol: "GE", limit: 5 } },
    ],
    expectedOutput: "Segment-aggregation forensic memo + peer disclosure granularity comparison.",
    difficulty: "advanced",
  },
  // v2-pending
  {
    id: "sophisticated-investor-warrants-overhang",
    persona: "sophisticated-investor",
    status: "v2-pending",
    title: "Surface warrant + convertible overhang for dilution thesis",
    category: "Dilution forensics (v2)",
    oneLiner:
      "Walk warrants, convertibles, and shares outstanding to estimate dilution overhang.",
    prompt:
      "For a low-float small cap with active capital raises, pull the dilution.warrants_query for outstanding warrants, dilution.convertibles for convertible debt, dilution.cash_position for runway, and cross-reference with the latest balance sheet + named-executive comp. Compute share-overhang at exercise and probability-weighted dilution at 12m horizon.",
    expectedToolChain: [
      { tool: "dilution.warrants_query", purpose: "Outstanding warrant inventory (FUTURE)", exampleArgs: { ticker: "MULN" } },
      { tool: "dilution.convertibles", purpose: "Convertible debt inventory (FUTURE)", exampleArgs: { ticker: "MULN" } },
      { tool: "dilution.cash_position", purpose: "Runway + burn (FUTURE)", exampleArgs: { ticker: "MULN" } },
      { tool: "companies.balance_sheets", purpose: "Reported balance sheet", exampleArgs: { ticker: "MULN", period: "quarterly", limit: 1 } },
    ],
    expectedOutput: "Dilution-overhang memo + 12m probability-weighted share-count scenario table.",
    blockedBy: ["OMNI-3071", "OMNI-3079", "OMNI-3087"],
    difficulty: "advanced",
  },
  {
    id: "sophisticated-investor-atm-program-tracking",
    persona: "sophisticated-investor",
    status: "v2-pending",
    title: "Track ATM program activity for dilution-velocity signal",
    category: "Dilution forensics (v2)",
    oneLiner:
      "Detect ATM program issuance velocity and cross-reference with insider trading.",
    prompt:
      "For an issuer with an active ATM (at-the-market) program, pull dilution.events for the latest ATM issuance, dilution.cash_position for runway impact, and insiders.list for any insider trading around the ATM dates. For ownership changes, first identify institutional holders for the issuer, then use owners.compare_13f only with each selected [13F MANAGER CIK]. Output a dilution-velocity dashboard.",
    expectedToolChain: [
      { tool: "dilution.events", purpose: "ATM issuance events (FUTURE)", exampleArgs: { ticker: "MULN" } },
      { tool: "dilution.cash_position", purpose: "Runway impact (FUTURE)", exampleArgs: { ticker: "MULN" } },
      { tool: "owners.compare_13f", purpose: "Institutional response for a selected 13F manager", exampleArgs: { cik: "0001067983" } },
      { tool: "insiders.list", purpose: "Insider trades around ATM dates", exampleArgs: { ticker: "MULN", limit: 20 } },
    ],
    expectedOutput: "Dilution-velocity dashboard.",
    blockedBy: ["OMNI-3071", "OMNI-3079", "OMNI-3087"],
    difficulty: "advanced",
  },
  {
    id: "sophisticated-investor-convertible-overhang-stress",
    persona: "sophisticated-investor",
    status: "v2-pending",
    title: "Stress-test convertible overhang against share price scenarios",
    category: "Dilution forensics (v2)",
    oneLiner:
      "Walk convertible inventory + price-based conversion mechanics for dilution risk.",
    prompt:
      "For an issuer with toxic convertibles, pull dilution.convertibles for the inventory + conversion mechanics (variable-reset, full-ratchet), dilution.warrants_query for any associated warrants, and stress-test share-count at -25%/-50% price scenarios. Cross-reference with companies.balance_sheets for cash + debt.",
    expectedToolChain: [
      { tool: "dilution.convertibles", purpose: "Convertible inventory + mechanics (FUTURE)", exampleArgs: { ticker: "MULN" } },
      { tool: "dilution.warrants_query", purpose: "Associated warrant inventory (FUTURE)", exampleArgs: { ticker: "MULN" } },
      { tool: "dilution.cash_position", purpose: "Cash + runway (FUTURE)", exampleArgs: { ticker: "MULN" } },
      { tool: "companies.balance_sheets", purpose: "Reported balance sheet", exampleArgs: { ticker: "MULN", period: "quarterly", limit: 1 } },
    ],
    expectedOutput: "Convertible stress-test memo + scenario share-count table.",
    blockedBy: ["OMNI-3071", "OMNI-3079", "OMNI-3087"],
    difficulty: "advanced",
  },
  {
    id: "sophisticated-investor-cash-runway-forensics",
    persona: "sophisticated-investor",
    status: "v2-pending",
    title: "Cash runway forensics with corporate-action overlay",
    category: "Dilution forensics (v2)",
    oneLiner:
      "Compute cash runway and overlay reverse-split/de-SPAC corporate-action history.",
    prompt:
      "For a small-cap with cash burn concerns, pull dilution.cash_position for runway, dilution.corporate_actions for any reverse splits or de-SPACs in the past 24 months, dilution.ratings for the composite risk score, and cross-reference with companies.cash_flow_statements. Output a runway forensics memo.",
    expectedToolChain: [
      { tool: "dilution.cash_position", purpose: "Cash + burn + runway (FUTURE)", exampleArgs: { ticker: "MULN" } },
      { tool: "dilution.corporate_actions", purpose: "Reverse-split / de-SPAC history (FUTURE)", exampleArgs: { ticker: "MULN" } },
      { tool: "dilution.ratings", purpose: "Composite dilution risk score (FUTURE)", exampleArgs: { ticker: "MULN" } },
      { tool: "companies.cash_flow_statements", purpose: "Burn-rate context", exampleArgs: { ticker: "MULN", period: "quarterly", limit: 4 } },
    ],
    expectedOutput: "Cash runway forensics memo with corporate-action overlay.",
    blockedBy: ["OMNI-3071", "OMNI-3079", "OMNI-3087"],
    difficulty: "advanced",
  },

  // ----------------------------------------------------------------------------
  // INSURANCE (6 v1, 6 v2-pending)
  // ----------------------------------------------------------------------------
  {
    id: "insurance-d-and-o-underwriting-profile",
    persona: "insurance",
    status: "v1",
    title: "D&O renewal profile",
    category: "D&O underwriting",
    oneLiner:
      "Compile board comp, ownership concentration, and insider activity for D&O risk pricing.",
    prompt:
      "Build a D&O renewal research note for [TICKER] as of [DATE]. Resolve the issuer, retrieve its latest 10-K and relevant 8-Ks, then read Item 1A risk factors and Item 7 MD&A. Add current named-executive compensation, recent Form 4 activity, and the latest available institutional-holder context. Use `owners.institutional_holders` with the issuer ticker or issuer CIK; the manager-specific 13F holdings tool requires a named manager CIK. Separate facts from underwriting interpretation. Cite each finding with form, filing date, accession number, and section or transaction reference. Flag only disclosed auditor changes, restatement language, control weaknesses, executive departures, or unusually concentrated ownership; do not infer fraud, claim likelihood, or coverage. Use entities.resolve, filings.search, sections.get, comp.list, insiders.list, and owners.institutional_holders.",
    expectedToolChain: [
      { tool: "comp.list", purpose: "Named-executive comp baseline", exampleArgs: { ticker: "WFC", limit: 10 } },
      { tool: "owners.institutional_holders", purpose: "Institutional-holder context for the issuer", exampleArgs: { ticker: "WFC", limit: 20 } },
      { tool: "insiders.list", purpose: "Officer/director Form 4 history", exampleArgs: { ticker: "WFC", limit: 50 } },
      { tool: "comp.compare", purpose: "Year-over-year comp comparison", exampleArgs: { ticker: "WFC", limit: 10 } },
    ],
    expectedOutput: "D&O underwriting memo + scorecard + requestId citations.",
    caveats: [
      "AAER (Accounting and Auditing Enforcement Releases) enrichment is keyword-search based.",
    ],
    difficulty: "intermediate",
  },
  {
    id: "insurance-auditor-change-keyword-scan",
    persona: "insurance",
    status: "v1",
    title: "Auditor-change review",
    category: "Auditor monitoring",
    oneLiner:
      "Detect auditor changes by keyword-searching 8-K Item 4.01 disclosures.",
    prompt:
      "For [TICKER LIST] during [START DATE] through [END DATE], search 8-K sections for Item 4.01 and phrases such as \"certifying accountant.\" For each candidate, retrieve the issuer's Item 4.01 section and report the predecessor, successor, stated reason, disagreements if disclosed, and filing accession. Search the same issuer's latest 10-K and 10-K/A for material-weakness language. Deliver a triage table with a direct filing link or accession for every row. This is a keyword-led disclosure review: absence of a result is not proof that no auditor event occurred. Use sections.search, sections.get, filings.search, and intelligence.query only as a secondary lead. For a date window, MCP `filings.search` and `sections.search` do not filter by date: fetch candidate records, then post-filter the returned `filingDate` locally before selecting sections or reporting results.",
    expectedToolChain: [
      { tool: "sections.search", purpose: "Item 4.01 keyword search", exampleArgs: { form: "8-K", q: "Item 4.01 auditor change Changes in Registrant Certifying Accountant", limit: 50 } },
      { tool: "sections.get", purpose: "Item 4.01 text per match", exampleArgs: { ticker: "WFC", form: "8-K", sectionKey: "item_4_01" } },
      { tool: "filings.search", purpose: "Recent 8-K filings", exampleArgs: { form: "8-K", limit: 100 } },
      { tool: "intelligence.query", purpose: "Material-weakness corroboration", exampleArgs: { query: "material weakness internal controls auditor change", entities: ["WFC"] } },
    ],
    expectedOutput: "Watchlist alert table ranked by claim-trigger likelihood.",
    caveats: [
      "Keyword-search-based auditor-change detection.",
    ],
    difficulty: "intermediate",
  },
  {
    id: "insurance-material-weakness-semantic-scan",
    persona: "insurance",
    status: "v1",
    title: "Internal-control disclosure sweep",
    category: "Internal-control risk",
    oneLiner:
      "Use semantic intelligence query to find material-weakness language across recent filings.",
    prompt:
      "Review [TICKER LIST] for disclosures filed in the last [12 MONTHS]. Search 10-K and 10-Q sections for \"material weakness\" and \"internal control over financial reporting,\" then retrieve the applicable control discussion from the source filing. Check for amended annual reports and summarize remediation language, affected period, and whether management states the weakness remains open. Output a source table followed by a short issuer-by-issuer note. Quote only the minimum necessary text and attach form, fiscal period, filing date, accession, and section key. Do not convert disclosure language into a severity score or an audit opinion. Use sections.search, sections.get, filings.search, and companies.overview. For a date window, MCP `filings.search` and `sections.search` do not filter by date: fetch candidate records, then post-filter the returned `filingDate` locally before selecting sections or reporting results.",
    expectedToolChain: [
      { tool: "intelligence.query", purpose: "Semantic material-weakness signal", exampleArgs: { query: "material weakness internal control over financial reporting", lookback: 365 } },
      { tool: "sections.search", purpose: "Find Item 9A disclosures", exampleArgs: { q: "material weakness", form: "10-K", limit: 50 } },
      { tool: "sections.get", purpose: "Item 9A text per match", exampleArgs: { ticker: "WFC", form: "10-K", sectionKey: "item_9a" } },
      { tool: "filings.search", purpose: "10-K/A inventory", exampleArgs: { form: "10-K/A", limit: 20 } },
    ],
    expectedOutput: "Material-weakness watchlist with severity ranking.",
    difficulty: "intermediate",
  },
  {
    id: "insurance-restatement-detection-renewal-book",
    persona: "insurance",
    status: "v1",
    title: "Restatement disclosure review",
    category: "Restatement risk",
    oneLiner:
      "Sweep renewal book for 10-K/A restatement filings + supporting context.",
    prompt:
      "For [TICKER LIST] and the last [24 MONTHS], locate 10-K/A and 10-Q/A filings, then search those filings and the related original reports for \"restatement,\" \"revision,\" and \"non-reliance.\" For every match, identify the financial periods affected, the issuer's stated reason, any Item 4.02 or Item 9A disclosure, and the accession numbers for both original and amendment where available. Produce a review queue sorted by filing date, not an actuarial or claims ranking. State clearly when an amendment does not itself establish a restatement. Use filings.search, sections.search, sections.get, and companies.financials. For a date window, MCP `filings.search` and `sections.search` do not filter by date: fetch candidate records, then post-filter the returned `filingDate` locally before selecting sections or reporting results.",
    expectedToolChain: [
      { tool: "filings.search", purpose: "10-K/A inventory", exampleArgs: { form: "10-K/A", limit: 50 } },
      { tool: "sections.search", purpose: "Restatement language search", exampleArgs: { q: "restatement", form: "10-K/A", limit: 50 } },
      { tool: "intelligence.query", purpose: "Analyst commentary signal", exampleArgs: { query: "restatement analyst response severity", lookback: 90 } },
      { tool: "sections.get", purpose: "Item 9A text per match", exampleArgs: { ticker: "WFC", form: "10-K", sectionKey: "item_9a" } },
    ],
    expectedOutput: "Restatement-risk ranked alert table for renewal pricing.",
    difficulty: "intermediate",
  },
  {
    id: "insurance-officer-departure-claims-trigger",
    persona: "insurance",
    status: "v1",
    title: "Executive-transition alert",
    category: "Claims monitoring",
    oneLiner:
      "Surface 8-K Item 5.02 officer departures for D&O claims-trigger alerts.",
    prompt:
      "Monitor [TICKER LIST] for [DATE RANGE]. Find 8-K Item 5.02 disclosures, retrieve the full section for each event, and classify the disclosed event as appointment, retirement, resignation, termination, board change, or other. Add the latest proxy compensation record and the reporting person's Form 4 activity only when the identity can be matched confidently. Provide an alert digest with exact filing evidence and a separate \"questions for review\" column. Do not label a routine transition a claims trigger or speculate about undisclosed reasons. Use filings.search, sections.search, sections.get, comp.list, and insiders.list. For a date window, MCP `filings.search` and `sections.search` do not filter by date: fetch candidate records, then post-filter the returned `filingDate` locally before selecting sections or reporting results.",
    expectedToolChain: [
      { tool: "filings.search", purpose: "Recent 8-K filings", exampleArgs: { form: "8-K", limit: 100 } },
      { tool: "sections.get", purpose: "Item 5.02 text per match", exampleArgs: { ticker: "WFC", form: "8-K", sectionKey: "item_5_02" } },
      { tool: "comp.compare", purpose: "Departing officer's comp history", exampleArgs: { ticker: "WFC", limit: 10 } },
      { tool: "insiders.list", purpose: "Recent Form 4 trades", exampleArgs: { ticker: "WFC", limit: 30 } },
    ],
    expectedOutput: "Claims-trigger alert digest with departure profile per match.",
    difficulty: "intermediate",
  },
  {
    id: "insurance-peer-benchmark-renewal-pricing",
    persona: "insurance",
    status: "v1",
    title: "Peer context for renewal discussion",
    category: "Pricing benchmarking",
    oneLiner:
      "Build a factor-similar peer set for renewal pricing context.",
    prompt:
      "For [TICKER], create a public-disclosure peer context note. Use factors.related_stocks to propose up to [10] comparable names, then retrieve each company's latest annual financial statements and named-executive compensation. For the subject and peers, identify disclosed control weaknesses, restatements, or auditor-change filings in [LOOKBACK]. Present the raw measures and citations; explain why a factor-similar peer is only a screening cohort, not an underwriting comparable. Do not recommend premium, retention, limits, or terms. Use factors.related_stocks, companies.financials, comp.list, filings.search, and sections.search. For a date window, MCP `filings.search` and `sections.search` do not filter by date: fetch candidate records, then post-filter the returned `filingDate` locally before selecting sections or reporting results.",
    expectedToolChain: [
      { tool: "factors.related_stocks", purpose: "Factor-similar peer cohort", exampleArgs: { symbol: "WFC", limit: 10 } },
      { tool: "companies.financials", purpose: "Peer fundamentals", exampleArgs: { ticker: "JPM", period: "annual", limit: 1 } },
      { tool: "comp.list", purpose: "Peer named-executive comp", exampleArgs: { ticker: "JPM", limit: 5 } },
      { tool: "intelligence.query", purpose: "Peer-specific risk events", exampleArgs: { query: "regulatory risk events past 12 months", entities: ["JPM"] } },
    ],
    expectedOutput: "Renewal pricing context table.",
    difficulty: "intermediate",
  },
  // v2-pending
  {
    id: "insurance-aaer-enrichment-respondent-profile",
    persona: "insurance",
    status: "v2-pending",
    title: "Enrich AAER respondent profile for D&O claims investigation",
    category: "AAER enrichment (v2)",
    oneLiner:
      "Pull typed AAER metadata + respondent comp + ownership for claims investigation.",
    prompt:
      "For an AAER respondent (Accounting and Auditing Enforcement Release), pull events.enforcement for the typed AAER record, comp.list for the respondent's comp history, owners.institutional_holders for issuer-level institutional context, and insiders.list for trading activity in the AAER window. Output an enriched respondent profile.",
    expectedToolChain: [
      { tool: "events.enforcement", purpose: "Typed AAER metadata (FUTURE)", exampleArgs: { ticker: "WFC" } },
      { tool: "comp.list", purpose: "Respondent comp history", exampleArgs: { ticker: "WFC", limit: 10 } },
      { tool: "owners.institutional_holders", purpose: "Issuer-level institutional context", exampleArgs: { ticker: "WFC", limit: 20 } },
      { tool: "insiders.list", purpose: "Trading activity in AAER window", exampleArgs: { ticker: "WFC", limit: 30 } },
    ],
    expectedOutput: "Enriched AAER respondent profile.",
    blockedBy: ["AAER-MCP-WRAP"],
    difficulty: "advanced",
  },
  {
    id: "insurance-aaer-timeline-enforcement",
    persona: "insurance",
    status: "v2-pending",
    title: "Build an AAER enforcement timeline for an issuer",
    category: "AAER enrichment (v2)",
    oneLiner:
      "Walk all AAERs for an issuer and build a typed enforcement timeline.",
    prompt:
      "For an issuer with multiple AAER findings, pull events.enforcement to enumerate all AAERs in the past 5 years, cross-reference with filings.search for any related 8-K disclosures, and pull the latest 10-K Item 9A. Output a typed enforcement timeline + AAER-to-disclosure mapping.",
    expectedToolChain: [
      { tool: "events.enforcement", purpose: "AAER enumeration (FUTURE)", exampleArgs: { ticker: "WFC", limit: 20 } },
      { tool: "filings.search", purpose: "Related 8-K disclosures", exampleArgs: { ticker: "WFC", form: "8-K", limit: 50 } },
      { tool: "sections.get", purpose: "Item 9A internal-controls text", exampleArgs: { ticker: "WFC", form: "10-K", sectionKey: "item_9a" } },
      { tool: "intelligence.query", purpose: "Cross-period analyst commentary", exampleArgs: { query: "enforcement timeline analyst commentary", entities: ["WFC"] } },
    ],
    expectedOutput: "Typed AAER enforcement timeline + AAER-to-disclosure mapping.",
    blockedBy: ["AAER-MCP-WRAP"],
    difficulty: "advanced",
  },
  {
    id: "insurance-aaer-enforcement-match",
    persona: "insurance",
    status: "v2-pending",
    title: "Match an insured's filings to historical AAER fact patterns",
    category: "AAER enrichment (v2)",
    oneLiner:
      "Compare insured's disclosure language to historical AAER cases for risk scoring.",
    prompt:
      "For an insured, pull the latest 10-K, run intelligence.query against the AAER corpus to find the 5 most similar historical AAER cases via events.enforcement, and produce an AAER-similarity risk score. Cross-reference with comp.list for executive context.",
    expectedToolChain: [
      { tool: "intelligence.query", purpose: "Semantic AAER similarity", exampleArgs: { query: "AAER fact pattern match", entities: ["WFC"] } },
      { tool: "events.enforcement", purpose: "Historical AAER cases (FUTURE)", exampleArgs: { limit: 5 } },
      { tool: "sections.get", purpose: "Insured's latest 10-K Item 9A", exampleArgs: { ticker: "WFC", form: "10-K", sectionKey: "item_9a" } },
      { tool: "comp.list", purpose: "Executive context", exampleArgs: { ticker: "WFC", limit: 10 } },
    ],
    expectedOutput: "AAER-similarity risk score + 5 most-similar historical cases.",
    blockedBy: ["AAER-MCP-WRAP"],
    difficulty: "advanced",
  },
  {
    id: "insurance-typed-auditor-change-event",
    persona: "insurance",
    status: "v2-pending",
    title: "Use typed auditor-change events for renewal monitoring",
    category: "Auditor monitoring (v2)",
    oneLiner:
      "Replace keyword search with a typed auditor-change MCP event stream.",
    prompt:
      "For a renewal book, pull events.auditor_changes for typed auditor-change events in the past 90 days. For each event, fetch the predecessor and successor auditor, the related 8-K filing, and any 10-K/A amendments. Output a typed auditor-change watchlist.",
    expectedToolChain: [
      { tool: "events.auditor_changes", purpose: "Typed auditor-change stream (FUTURE)", exampleArgs: { limit: 50 } },
      { tool: "filings.search", purpose: "Related 8-K filings", exampleArgs: { form: "8-K", limit: 50 } },
      { tool: "sections.get", purpose: "Item 4.01 corroboration", exampleArgs: { ticker: "WFC", form: "8-K", sectionKey: "item_4_01" } },
      { tool: "filings.search", purpose: "Related 10-K/A inventory", exampleArgs: { form: "10-K/A", limit: 20 } },
    ],
    expectedOutput: "Typed auditor-change watchlist.",
    blockedBy: ["TYPED-AUDIT-CHANGE-MCP"],
    difficulty: "intermediate",
  },
  {
    id: "insurance-form-144-monitoring",
    persona: "insurance",
    status: "v2-pending",
    title: "Monitor Form 144 affiliate-sale notices",
    category: "Form 144 monitoring (v2)",
    oneLiner:
      "Track Form 144 (Notice of Proposed Sale of Securities) filings across renewal book.",
    prompt:
      "For a renewal book, pull forms.144 for the past 30 days of Form 144 affiliate-sale notices. For each notice, identify the filer, the planned sale size, and cross-reference with insiders.list for actual transactions. Output a Form 144 watchlist with planned-vs-actual sale tracking.",
    expectedToolChain: [
      { tool: "forms.144", purpose: "Form 144 affiliate-sale notices (FUTURE)", exampleArgs: { limit: 50 } },
      { tool: "insiders.list", purpose: "Actual Form 4 transactions", exampleArgs: { ticker: "WFC", limit: 30 } },
      { tool: "comp.list", purpose: "Filer comp context", exampleArgs: { ticker: "WFC", limit: 10 } },
      { tool: "entities.resolve", purpose: "Resolve filer identifier", exampleArgs: { ticker: "WFC" } },
    ],
    expectedOutput: "Form 144 watchlist with planned-vs-actual sale tracking.",
    blockedBy: ["OMNI-3084"],
    difficulty: "intermediate",
  },
  {
    id: "insurance-subsidiaries-discovery",
    persona: "insurance",
    status: "v2-pending",
    title: "Map insured's subsidiaries for coverage scope",
    category: "Subsidiaries discovery (v2)",
    oneLiner:
      "Pull subsidiaries graph for an insured to scope D&O coverage correctly.",
    prompt:
      "For an insured, pull companies.subsidiaries for the full subsidiaries graph, cross-reference with filings.search for any subsidiary-level filings, and pull comp comparison context for the parent. Output a subsidiaries map + coverage-scope scenario.",
    expectedToolChain: [
      { tool: "companies.subsidiaries", purpose: "Subsidiaries graph (FUTURE)", exampleArgs: { ticker: "WFC" } },
      { tool: "filings.search", purpose: "Subsidiary-level filings", exampleArgs: { ticker: "WFC", limit: 20 } },
      { tool: "entities.resolve", purpose: "Resolve subsidiary entities", exampleArgs: { ticker: "WFC" } },
      { tool: "comp.compare", purpose: "Parent comp comparison context", exampleArgs: { ticker: "WFC", limit: 10 } },
    ],
    expectedOutput: "Subsidiaries map + coverage-scope scenario.",
    blockedBy: ["OMNI-3084"],
    difficulty: "intermediate",
  },
] as const

// `expectedToolChain` is the authored contract. Prompt copy can mention tools
// as exclusions or alternatives, so deriving the API response from body
// substrings would advertise tools that the workflow explicitly forbids.
export const AGENT_PROMPT_LIBRARY: readonly AgentPrompt[] = RAW_AGENT_PROMPT_LIBRARY

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

export function listPromptsByPersona(
  persona: AgentPromptPersona,
  opts?: { includeV2Pending?: boolean },
): AgentPrompt[] {
  const includeV2 = opts?.includeV2Pending ?? false
  return AGENT_PROMPT_LIBRARY.filter((entry) => {
    if (entry.persona !== persona) return false
    if (!includeV2 && entry.status === "v2-pending") return false
    return true
  })
}

export function getPrompt(id: string): AgentPrompt | undefined {
  return AGENT_PROMPT_LIBRARY.find((entry) => entry.id === id)
}

export function v1Count(): number {
  return AGENT_PROMPT_LIBRARY.filter((entry) => entry.status === "v1").length
}

export function v2PendingCount(): number {
  return AGENT_PROMPT_LIBRARY.filter((entry) => entry.status === "v2-pending").length
}

export function v1CountByPersona(): Record<AgentPromptPersona, number> {
  const out = Object.fromEntries(
    AGENT_PROMPT_PERSONAS.map((slug) => [slug, 0]),
  ) as Record<AgentPromptPersona, number>
  for (const entry of AGENT_PROMPT_LIBRARY) {
    if (entry.status === "v1") out[entry.persona] += 1
  }
  return out
}

export function v2PendingCountByPersona(): Record<AgentPromptPersona, number> {
  const out = Object.fromEntries(
    AGENT_PROMPT_PERSONAS.map((slug) => [slug, 0]),
  ) as Record<AgentPromptPersona, number>
  for (const entry of AGENT_PROMPT_LIBRARY) {
    if (entry.status === "v2-pending") out[entry.persona] += 1
  }
  return out
}

/**
 * Per-persona v1 distribution committed by OMNI-3085 plan (D2).
 * The structural validator asserts `v1CountByPersona()` matches this exactly.
 */
export const EXPECTED_V1_DISTRIBUTION: Record<AgentPromptPersona, number> = {
  "investment-manager": 12,
  "law-firm": 12,
  "pr-firm": 12,
  "sophisticated-investor": 8,
  insurance: 6,
}
