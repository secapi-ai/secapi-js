/**
 * Fund-letters PIPELINE payload contracts (Track B).
 *
 * These are the subprocess report payloads the Dagster fund-letters assets
 * read back from the TS worker scripts (scripts/ingest/*fund_letter*.ts) via
 * the REPORT_PATH sentinel. Zod is the writer-side validator (each worker
 * validates its payload before writing); the Pydantic mirror in
 * pipelines/sec-pipeline/sec_pipeline/contracts/payloads_fund_letters.py is
 * the reader-side validator (TolerantArtifact — extra keys ignored, missing
 * required keys fail loudly).
 *
 * Keep field names camelCase and in lockstep with the Pydantic mirror.
 * NOT part of the customer-facing API surface (see fund-letters.ts for that).
 */
import { z } from "zod"

const skippedReasonSchema = z.string().nullable().optional()

export const fundLetterSourcesSyncPayloadSchema = z.object({
  object: z.literal("fund_letter_sources_sync"),
  generatedAt: z.string(),
  skipped: skippedReasonSchema,
  sourcesSeen: z.number().int().nonnegative().default(0),
  sourcesUpserted: z.number().int().nonnegative().default(0),
  /** fund_website seeds whose curated manager profile (canonical_name/description/founders/website) was upserted. */
  managerProfilesUpserted: z.number().int().nonnegative().default(0),
  robotsFetched: z.number().int().nonnegative().default(0),
  robotsDisallowedArchives: z.number().int().nonnegative().default(0),
  parkedItemsRequeued: z.number().int().nonnegative().default(0),
  errors: z.array(z.string()).default([]),
})
export type FundLetterSourcesSyncPayload = z.infer<typeof fundLetterSourcesSyncPayloadSchema>

export const fundLetterDiscoveryPayloadSchema = z.object({
  object: z.literal("fund_letter_discovery"),
  generatedAt: z.string(),
  skipped: skippedReasonSchema,
  sourcesCrawled: z.number().int().nonnegative().default(0),
  sourcesNotModified: z.number().int().nonnegative().default(0),
  sourcesFailed: z.number().int().nonnegative().default(0),
  candidatesSeen: z.number().int().nonnegative().default(0),
  enqueued: z.number().int().nonnegative().default(0),
  /** Pre-2025Q1 candidates recorded (NOT fetched) — the depth lever's work-list. */
  discoveredNotFetched: z.number().int().nonnegative().default(0),
  errors: z.array(z.string()).default([]),
})
export type FundLetterDiscoveryPayload = z.infer<typeof fundLetterDiscoveryPayloadSchema>

export const fundLetterFetchPayloadSchema = z.object({
  object: z.literal("fund_letter_fetch"),
  generatedAt: z.string(),
  skipped: skippedReasonSchema,
  claimed: z.number().int().nonnegative().default(0),
  fetched: z.number().int().nonnegative().default(0),
  pdfsStored: z.number().int().nonnegative().default(0),
  htmlQueuedForRender: z.number().int().nonnegative().default(0),
  manifestsUpserted: z.number().int().nonnegative().default(0),
  exactDuplicates: z.number().int().nonnegative().default(0),
  parkedUnregisteredHost: z.number().int().nonnegative().default(0),
  failed: z.number().int().nonnegative().default(0),
  errors: z.array(z.string()).default([]),
})
export type FundLetterFetchPayload = z.infer<typeof fundLetterFetchPayloadSchema>

export const fundLetterRenderPayloadSchema = z.object({
  object: z.literal("fund_letter_render"),
  generatedAt: z.string(),
  skipped: skippedReasonSchema,
  claimed: z.number().int().nonnegative().default(0),
  rendered: z.number().int().nonnegative().default(0),
  manifestsUpserted: z.number().int().nonnegative().default(0),
  exactDuplicates: z.number().int().nonnegative().default(0),
  failed: z.number().int().nonnegative().default(0),
  errors: z.array(z.string()).default([]),
})
export type FundLetterRenderPayload = z.infer<typeof fundLetterRenderPayloadSchema>

export const ncsrLetterSectionsPayloadSchema = z.object({
  object: z.literal("ncsr_letter_sections"),
  generatedAt: z.string(),
  skipped: skippedReasonSchema,
  filingsScanned: z.number().int().nonnegative().default(0),
  /** Filings passing the CEF/interval/tender-offer pre-filter (series-count==0 or N-2 history). */
  candidates: z.number().int().nonnegative().default(0),
  openEndSkipped: z.number().int().nonnegative().default(0),
  lettersMinted: z.number().int().nonnegative().default(0),
  pagesWritten: z.number().int().nonnegative().default(0),
  /** Candidates deferred to the (Track C) LLM classifier seam. */
  ambiguousDeferred: z.number().int().nonnegative().default(0),
  /** Within-filing section_locator collisions disambiguated by ordinal. */
  locatorCollisions: z.number().int().nonnegative().default(0),
  failed: z.number().int().nonnegative().default(0),
  errors: z.array(z.string()).default([]),
})
export type NcsrLetterSectionsPayload = z.infer<typeof ncsrLetterSectionsPayloadSchema>

export const fundDirectoryBackfillPayloadSchema = z.object({
  object: z.literal("fund_directory_backfill"),
  generatedAt: z.string(),
  skipped: skippedReasonSchema,
  /** True when --dry-run: counts are computed but nothing is written. */
  dryRun: z.boolean().default(false),
  /** Distinct 13F filers found in institutional_holder_index. */
  filersSeen: z.number().int().nonnegative().default(0),
  /** Filers matched to an existing manager by adviser CIK (directory columns updated in place — no new row). */
  managersMatchedByCik: z.number().int().nonnegative().default(0),
  /** Filers matched to an existing manager by canonical entity id (no new row). */
  managersMatchedByEntity: z.number().int().nonnegative().default(0),
  /** Filers upserted by normalized_name that landed on an existing row (letter-manager dedup). */
  managersUpdatedByName: z.number().int().nonnegative().default(0),
  /** Brand-new letterless directory managers minted. */
  managersInserted: z.number().int().nonnegative().default(0),
  /** Filers skipped because a DIFFERENT filer/manager already owns the normalized name (no cross-contamination). */
  nameCollisionsSkipped: z.number().int().nonnegative().default(0),
  /** Directory managers whose publishes_letters flag CHANGED this run (recomputed from current eligibility — flips true↔false). */
  publishesLettersMarked: z.number().int().nonnegative().default(0),
  /** Existing letter-managers stamped directory_listed=true. */
  letterManagersListed: z.number().int().nonnegative().default(0),
  errors: z.array(z.string()).default([]),
})
export type FundDirectoryBackfillPayload = z.infer<typeof fundDirectoryBackfillPayloadSchema>

export const fundDirectoryReferencesPayloadSchema = z.object({
  object: z.literal("fund_directory_references"),
  generatedAt: z.string(),
  skipped: skippedReasonSchema,
  managersExamined: z.number().int().nonnegative().default(0),
  /** website set from an already-verified fund-letters crawl host. */
  websitesFromCrawl: z.number().int().nonnegative().default(0),
  /** website set from the adviser's Form ADV disclosure. */
  websitesFromAdv: z.number().int().nonnegative().default(0),
  wikipediaResolved: z.number().int().nonnegative().default(0),
  /** Wikipedia candidates rejected (disambiguation/404/namesake guard). */
  wikipediaRejected: z.number().int().nonnegative().default(0),
  grokipediaVerified: z.number().int().nonnegative().default(0),
  grokipediaProbable: z.number().int().nonnegative().default(0),
  /** Grokipedia candidates rejected (missing page/namesake guard). */
  grokipediaRejected: z.number().int().nonnegative().default(0),
  errors: z.array(z.string()).default([]),
})
export type FundDirectoryReferencesPayload = z.infer<typeof fundDirectoryReferencesPayloadSchema>

export const fundLetterDedupePayloadSchema = z.object({
  object: z.literal("fund_letter_dedupe"),
  generatedAt: z.string(),
  skipped: skippedReasonSchema,
  simhashesComputed: z.number().int().nonnegative().default(0),
  groupsScanned: z.number().int().nonnegative().default(0),
  duplicatesDetected: z.number().int().nonnegative().default(0),
  swapsExecuted: z.number().int().nonnegative().default(0),
  /** Dups whose preferred winner is not fully extracted yet — swap deferred. */
  swapsDeferred: z.number().int().nonnegative().default(0),
  thesesSuperseded: z.number().int().nonnegative().default(0),
  errors: z.array(z.string()).default([]),
})
export type FundLetterDedupePayload = z.infer<typeof fundLetterDedupePayloadSchema>
