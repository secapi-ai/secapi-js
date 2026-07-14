/**
 * Fund-letters freshness-canary payload contract (OMNI-5389).
 *
 * Writer-side zod validator for the report emitted by
 * scripts/ops/check_fund_letters_freshness.ts and read back by the Dagster
 * asset `fund_letter_freshness_canary` via the REPORT_PATH sentinel. The
 * Pydantic mirror is
 * pipelines/sec-pipeline/sec_pipeline/contracts/payloads_fund_letters_canary.py
 * (TolerantArtifact — keep field names camelCase and in lockstep).
 *
 * Lives in its own module (not fund-letters-pipeline.ts) so the ops-canary
 * track merges cleanly alongside the ingestion track's contract edits.
 */
import { z } from "zod"

export const fundLetterFreshnessCheckSchema = z.object({
  kind: z.string(),
  state: z.enum(["ok", "fault", "lane_dormant", "idle"]),
  detail: z.string().optional(),
  count: z.number().int().nonnegative().optional(),
  oldestAgeHours: z.number().nonnegative().optional(),
  ageHours: z.number().nonnegative().optional(),
  ageDays: z.number().nonnegative().optional(),
})

export const fundLetterFreshnessFailureSchema = z.object({
  kind: z.enum([
    "discovery_never_ran",
    "discovery_stalled",
    "fetch_backlog_stalled",
    "render_backlog_stalled",
    "pages_extraction_stalled",
    "llm_extraction_stalled",
    "corpus_stale",
  ]),
  detail: z.string(),
  count: z.number().int().nonnegative().optional(),
  oldestAgeHours: z.number().nonnegative().optional(),
  thresholdHours: z.number().positive().optional(),
  ageDays: z.number().nonnegative().optional(),
  thresholdDays: z.number().positive().optional(),
  lastError: z.string().nullable().optional(),
})

export const fundLetterFreshnessCanaryPayloadSchema = z.object({
  object: z.literal("fund_letter_freshness_canary"),
  generatedAt: z.string(),
  /** pass | fail | skipped — skipped is the dormant-plane healthy no-op. */
  status: z.enum(["pass", "fail", "skipped"]),
  /** Why the canary deliberately did not assert (dormant flag / empty corpus). */
  skipReason: z.string().nullable().optional(),
  letterCount: z.number().int().nonnegative().default(0),
  failureCount: z.number().int().nonnegative().default(0),
  checks: z.array(fundLetterFreshnessCheckSchema).default([]),
  failures: z.array(fundLetterFreshnessFailureSchema).default([]),
  /** Whether the freshness_observations row write succeeded. */
  observationRecorded: z.boolean().default(false),
  durationMs: z.number().nonnegative().default(0),
})
export type FundLetterFreshnessCanaryPayload = z.infer<typeof fundLetterFreshnessCanaryPayloadSchema>
