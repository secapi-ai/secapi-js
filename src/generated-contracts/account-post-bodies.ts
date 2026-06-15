import { z } from "zod"

export const accountCreateApiKeyBodySchema = z
  .object({
    /** SDK-PY always includes keys; omitted args serialize as JSON `null`. */
    scopes: z.array(z.string()).nullish(),
    livemode: z.boolean().nullish(),
    label: z.string().nullish(),
  })
  .passthrough()

export const accountUpdateDashboardProfileBodySchema = z
  .object({
    displayName: z.string().trim().min(1).max(120).nullable(),
  })
  .strict()

export const accountUpdateDashboardOrganizationBodySchema = z
  .object({
    name: z.string().trim().min(1).max(120),
  })
  .strict()

export const accountUpdateDashboardAppearanceBodySchema = z
  .object({
    theme: z.enum(["dark", "system"]).optional(),
    density: z.enum(["comfortable", "compact"]).optional(),
  })
  .strict()

export const accountRequestDeletionBodySchema = z
  .object({
    reason: z.string().trim().max(500).nullable().optional(),
  })
  .strict()
