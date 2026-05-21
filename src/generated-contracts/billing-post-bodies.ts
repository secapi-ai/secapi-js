import { z } from "zod"

export const billingPaygActivateBodySchema = z
  .object({
    successUrl: z.string().nullish(),
    cancelUrl: z.string().nullish(),
  })
  .passthrough()

/** Python SDK (and others) JSON-encode `None` as `null` for every key — use nullish, not optional-only. */
export const billingQuoteBodySchema = z
  .object({
    planKey: z.string().nullish(),
    meterClass: z.string().nullish(),
    path: z.string().nullish(),
    method: z.string().nullish(),
    units: z.number().nullish(),
  })
  .passthrough()

export const billingBudgetPutBodySchema = z
  .object({
    spendCapCents: z.union([z.number(), z.null()]).optional(),
    softCapCents: z.union([z.number(), z.null()]).optional(),
    approvalThresholdCents: z.union([z.number(), z.null()]).optional(),
  })
  .passthrough()

export const billingCheckoutBodySchema = z
  .object({
    planKey: z.string().nullish(),
    successUrl: z.string().nullish(),
    cancelUrl: z.string().nullish(),
  })
  .passthrough()

export const billingPortalBodySchema = z
  .object({
    returnUrl: z.string().nullish(),
  })
  .passthrough()
