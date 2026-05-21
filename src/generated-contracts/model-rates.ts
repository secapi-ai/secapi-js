/**
 * Anthropic Claude per-token rates (USD per 1 million tokens).
 *
 * Source of truth for the chat front-end's running cost meter.
 * Hard-coded; refresh on a quarterly cadence as Anthropic publishes new
 * tiers. `effectiveAt` lets callers reason about historical rates without
 * needing a full time-series store today.
 *
 * If `claude-haiku-4-5-20251001` ships under a different priced SKU at
 * publish time, update both the constant and `effectiveAt`.
 */

export interface ModelRate {
  modelId: string
  inputUsdPerMillion: number
  outputUsdPerMillion: number
  cacheReadUsdPerMillion?: number
  cacheCreationUsdPerMillion?: number
  effectiveAt: string
}

export interface UsageBreakdown {
  inputTokens?: number
  outputTokens?: number
  cacheReadTokens?: number
  cacheCreationTokens?: number
}

export const MODEL_RATES: Record<string, ModelRate> = {
  "claude-opus-4-7": {
    modelId: "claude-opus-4-7",
    inputUsdPerMillion: 15,
    outputUsdPerMillion: 75,
    cacheReadUsdPerMillion: 1.5,
    cacheCreationUsdPerMillion: 18.75,
    effectiveAt: "2026-04-01",
  },
  "claude-opus-4-6": {
    modelId: "claude-opus-4-6",
    inputUsdPerMillion: 15,
    outputUsdPerMillion: 75,
    cacheReadUsdPerMillion: 1.5,
    cacheCreationUsdPerMillion: 18.75,
    effectiveAt: "2026-01-01",
  },
  "claude-sonnet-4-6": {
    modelId: "claude-sonnet-4-6",
    inputUsdPerMillion: 3,
    outputUsdPerMillion: 15,
    cacheReadUsdPerMillion: 0.3,
    cacheCreationUsdPerMillion: 3.75,
    effectiveAt: "2026-01-01",
  },
  "claude-sonnet-4-5": {
    // Sonnet 4.5 is the canonical eval-loop + free-text-judge model
    // (`OMNI_EVAL_AGENT_MODEL` / `OMNI_EVAL_JUDGE_MODEL` default in
    // scripts/eval/run_evals.py and scripts/evals/judge_free_text.py).
    // OMNI-3286 added it here so the agent-chat eval endpoint's
    // server-side `computeCostUsd` resolves a real rate rather than
    // falling through to the warning-emitting fallback.
    modelId: "claude-sonnet-4-5",
    inputUsdPerMillion: 3,
    outputUsdPerMillion: 15,
    cacheReadUsdPerMillion: 0.3,
    cacheCreationUsdPerMillion: 3.75,
    effectiveAt: "2025-09-01",
  },
  "claude-haiku-4-5-20251001": {
    modelId: "claude-haiku-4-5-20251001",
    inputUsdPerMillion: 1,
    outputUsdPerMillion: 5,
    cacheReadUsdPerMillion: 0.1,
    cacheCreationUsdPerMillion: 1.25,
    effectiveAt: "2025-10-01",
  },
}

/**
 * Conservative fallback rate for unknown models — sized at the Sonnet rates.
 * Logs a warning the first time it's used so we can spot drift early.
 */
const FALLBACK_RATE: ModelRate = {
  modelId: "fallback",
  inputUsdPerMillion: 3,
  outputUsdPerMillion: 15,
  cacheReadUsdPerMillion: 0.3,
  cacheCreationUsdPerMillion: 3.75,
  effectiveAt: "2026-01-01",
}

const warnedFallbackModels = new Set<string>()

export function getModelRate(modelId: string): ModelRate {
  const direct = MODEL_RATES[modelId]
  if (direct) return direct
  if (typeof console !== "undefined" && !warnedFallbackModels.has(modelId)) {
    warnedFallbackModels.add(modelId)
    console.warn(`[model-rates] no rate registered for "${modelId}", using fallback`)
  }
  return FALLBACK_RATE
}

/**
 * Compute USD cost for a usage breakdown against a given model's rate table.
 * Missing token fields are treated as zero. Cache tokens are billed against
 * cache rates when available, otherwise against the input rate (a conservative
 * upper bound).
 */
export function computeCostUsd(usage: UsageBreakdown, modelId: string): number {
  const rate = getModelRate(modelId)
  const input = usage.inputTokens ?? 0
  const output = usage.outputTokens ?? 0
  const cacheRead = usage.cacheReadTokens ?? 0
  const cacheCreation = usage.cacheCreationTokens ?? 0

  const inputCost = (input * rate.inputUsdPerMillion) / 1_000_000
  const outputCost = (output * rate.outputUsdPerMillion) / 1_000_000
  const cacheReadCost =
    (cacheRead * (rate.cacheReadUsdPerMillion ?? rate.inputUsdPerMillion)) / 1_000_000
  const cacheCreationCost =
    (cacheCreation * (rate.cacheCreationUsdPerMillion ?? rate.inputUsdPerMillion)) /
    1_000_000

  return inputCost + outputCost + cacheReadCost + cacheCreationCost
}

/**
 * Display formatter for the cost meter.
 * Low values render with 4 decimals (`$0.0042`), higher with 2 (`$0.42`).
 */
export function formatCostUsd(usd: number): string {
  if (usd <= 0) return "$0.0000"
  if (usd < 0.1) return `$${usd.toFixed(4)}`
  return `$${usd.toFixed(2)}`
}
