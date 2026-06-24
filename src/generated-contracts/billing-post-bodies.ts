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

/**
 * POST /v1/billing/credits/topup body. `amountUsd` is the dollar amount the
 * caller wants credited to their wallet (validated against the configured
 * min/max in computeTopupCharge). `paymentMethodType` is an optional Stripe
 * PaymentMethod type hint used only for fee-waiver computation in the quote;
 * the actual payment method is chosen client-side in the Payment Element.
 */
export const billingCreditsTopupBodySchema = z
  .object({
    amountUsd: z.number(),
    paymentMethodType: z.string().nullish(),
  })
  .passthrough()

/**
 * POST /v1/billing/credits/refund body (Phase 5). `paymentIntentId` identifies
 * the specific top-up lot to refund. The refund covers only that lot's UNSPENT
 * remainder, within the 24h window, and excludes the non-refundable platform fee.
 */
export const billingCreditsRefundBodySchema = z
  .object({
    paymentIntentId: z.string(),
  })
  .passthrough()

/**
 * PUT /v1/billing/credits/auto-topup body (Phase 3). `enabled` toggles
 * auto-top-up; when enabled, `thresholdCents` (refill when balance drops below)
 * and `amountCents` (how much to add) are required and validated server-side
 * against the configured min/max top-up band. When disabled the threshold /
 * amount may be omitted (the stored values are cleared).
 */
export const billingAutoTopupPutBodySchema = z
  .object({
    enabled: z.boolean(),
    thresholdCents: z.number().int().positive().nullish(),
    amountCents: z.number().int().positive().nullish(),
  })
  .passthrough()

/**
 * PUT /v1/billing/payment-methods/:id body (Phase 3): set a saved method
 * primary and/or change its fallback priority. At least one field should be
 * present; both optional so a caller can update either independently.
 */
export const billingPaymentMethodUpdateBodySchema = z
  .object({
    isPrimary: z.boolean().optional(),
    priority: z.number().int().positive().optional(),
  })
  .strict()

/** POST /v1/billing/payment-methods/setup-intent — no body fields required. */
export const billingPaymentMethodSetupIntentBodySchema = z.object({}).strict()
