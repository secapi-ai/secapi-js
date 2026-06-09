import { z } from "zod"

/**
 * Request/response contract for the OMNI-3286 agent-chat eval HTTP surface.
 *
 * Two routes:
 *   - `POST /api/eval/answer` — single-shot question→answer with full
 *     tool-call log + usage + preservation evidence
 *   - `GET  /api/eval/preservation-status` — boot-time preservation snapshot
 *     (lightweight pre-flight; no model spend)
 *
 * Both routes are env-gated by `OMNI_AGENT_CHAT_EVAL_ENDPOINT_ENABLED=true`
 * and auth-gated by an HMAC ticket whose envelope's `servicePrincipal` is
 * `eval`. Browser-principal tickets (the existing OMNI-3193 surface)
 * receive 403 even though the ticket itself verifies.
 */

export const EVAL_ENDPOINT_VERSION = 1 as const

/**
 * Boot-time preservation snapshot. Mirrors the OMNI-3309 forensic
 * checkpoints; all four boolean fields are required to be `true` for the
 * harness to consider the agent-chat instance "iteration-preserved".
 *
 * Numeric fields are surfaced for forensic comparison:
 *   - `systemPromptSha256`: stable proxy for "we are running the same
 *     system-prompt code as the OMNI-3309 baseline"
 *   - `toolRegistryCount`: live count from `toolRegistry.getAll().length`
 *   - `toolRegistryBreakdown.{explicit,mcp,stub}Count`: 60+35+26 today
 *   - `financeBenchmarkPresetCount`: tools available in the
 *     `finance_benchmark` preset (union across all 11 families)
 *   - `vendorSkillsSha`: git tree-SHA of `vendor/omni/skills` at boot;
 *     `null` only when .git is unavailable in the runtime image
 *   - `agentChatCommitSha`: `OMNI_GIT_SHA` env or `git rev-parse HEAD`;
 *     `null` only when neither is available
 *   - `bootTimestamp`: ISO-8601; harness asserts unchanged across
 *     successive requests to detect server restarts mid-eval
 */
export const evalPreservationSchema = z.object({
  v: z.literal(1),
  systemPromptLoaded: z.literal(true),
  systemPromptByteLength: z.number().int().positive(),
  systemPromptSha256: z.string().length(64),
  toolRegistryCount: z.number().int().positive(),
  toolRegistryBreakdown: z.object({
    explicitCount: z.number().int().nonnegative(),
    mcpCount: z.number().int().nonnegative(),
    stubCount: z.number().int().nonnegative(),
  }),
  financeBenchmarkPresetCount: z.number().int().positive(),
  financeBenchmarkFamilyCount: z.number().int().positive(),
  financeBenchmarkRoutingLoaded: z.literal(true),
  financialCalculationsEngineLoaded: z.literal(true),
  vendorSkillsResolved: z.literal(true),
  vendorSkillsSha: z.string().length(40).nullable(),
  agentChatCommitSha: z.string().length(40).nullable(),
  bootTimestamp: z.string().datetime(),
})
export type EvalPreservation = z.infer<typeof evalPreservationSchema>

/**
 * Per-tool-call summary captured during a question's run. Args are
 * fingerprinted (sha256 first 16 hex of canonical JSON) rather than echoed
 * verbatim — keeps logs/artifacts small while still identifying retries vs
 * distinct calls.
 */
export const evalToolCallSummarySchema = z.object({
  name: z.string().min(1),
  argFingerprint: z.string().length(16),
  outcome: z.enum(["ok", "error", "gated"]),
  latencyMs: z.number().nonnegative(),
})
export type EvalToolCallSummary = z.infer<typeof evalToolCallSummarySchema>

/**
 * Token usage totals across all turns of one question's agent run.
 * Field names match the existing `AgentEvent.usage` shape emitted by
 * `OmniAgent.chat()` (`services/agent-chat/src/agent/types.ts`); the harness
 * forwards them verbatim into the artifact JSON for downstream cost analysis.
 */
export const evalUsageSchema = z.object({
  inputTokens: z.number().int().nonnegative(),
  outputTokens: z.number().int().nonnegative(),
  cacheCreationTokens: z.number().int().nonnegative(),
  cacheReadTokens: z.number().int().nonnegative(),
})
export type EvalUsage = z.infer<typeof evalUsageSchema>

export const evalAnswerStopReasonSchema = z.enum([
  "end_turn",
  "max_tokens",
  "tool_use",
  "stop_sequence",
  "max_turns",
  "error",
])
export type EvalAnswerStopReason = z.infer<typeof evalAnswerStopReasonSchema>

export const evalAnswerRequestSchema = z.object({
  v: z.literal(1),
  questionId: z.string().min(1).max(128),
  question: z.string().min(1).max(8000),
  /** Optional hint plumbed into TrustedRuntimeContext for finance-benchmark routing. */
  benchmarkFamilyHint: z.string().min(1).max(64).optional(),
  /** Optional FinanceBench question category (financebench_numeric / _section / _multi_hop). */
  benchmarkCategoryHint: z.string().min(1).max(64).optional(),
  /** Per-question canonical tool names extracted from `question.api_calls[]` — biases tool routing toward expected path. Mirrors omni-apps/packages/agent-cli/src/finance-benchmark.ts:643-647 `getExpectedBenchmarkToolHints`. */
  benchmarkExpectedToolHints: z.array(z.string().min(1).max(64)).max(20).optional(),
  /** Hard cap on the agent loop — clamped server-side to [1, 20]. */
  maxTurns: z.number().int().min(1).max(20).default(10),
  /** Override the default chat model (for harness sweep across model families). */
  model: z.string().min(1).max(96).optional(),
  /** Free-form harness metadata (run id, iteration, etc.) — echoed in response for traceability. */
  metadata: z.record(z.string(), z.unknown()).optional(),
})
export type EvalAnswerRequest = z.infer<typeof evalAnswerRequestSchema>

export const evalAnswerResponseSchema = z.object({
  v: z.literal(1),
  questionId: z.string(),
  answer: z.string(),
  toolCalls: z.array(evalToolCallSummarySchema),
  usage: evalUsageSchema,
  /** Server-computed cost using the pinned price table for the actual model used. */
  costUsd: z.number().nonnegative(),
  costModel: z.string(),
  preservation: evalPreservationSchema,
  totalLatencyMs: z.number().nonnegative(),
  stopReason: evalAnswerStopReasonSchema,
  /** Echo of the request `metadata` for harness traceability. */
  metadata: z.record(z.string(), z.unknown()).optional(),
})
export type EvalAnswerResponse = z.infer<typeof evalAnswerResponseSchema>

export const evalPreservationStatusResponseSchema = z.object({
  v: z.literal(1),
  preservation: evalPreservationSchema,
})
export type EvalPreservationStatusResponse = z.infer<typeof evalPreservationStatusResponseSchema>

export const evalErrorResponseSchema = z.object({
  v: z.literal(1),
  error: z.string(),
  code: z.enum([
    "endpoint_disabled",
    "unauthorized",
    "forbidden_principal",
    "invalid_request",
    "internal_error",
    "agent_error",
  ]),
  issues: z.array(z.unknown()).optional(),
})
export type EvalErrorResponse = z.infer<typeof evalErrorResponseSchema>

/**
 * Header name used to mirror the preservation block on `POST /api/eval/answer`
 * responses, so the harness can verify even on body truncation. Value is
 * `base64(JSON.stringify(preservation))` (no padding).
 */
export const EVAL_PRESERVATION_HEADER = "x-secapi-eval-preservation" as const
