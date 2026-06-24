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

/** Attribution options for the onboarding "where did you hear about us?" step. */
export const ONBOARDING_ATTRIBUTION_OPTIONS = [
  "x_twitter",
  "linkedin",
  "youtube",
  "newsletter",
  "conference",
  "friend_colleague",
  "google",
  "ai_assistant",
  "other",
] as const
export type OnboardingAttribution = (typeof ONBOARDING_ATTRIBUTION_OPTIONS)[number]

export type OnboardingType = "individual" | "organization"
export type OnboardingStatus = "pending" | "complete"

/** Persisted onboarding-wizard state (org metadata.dashboardSettings.onboarding). */
export type OnboardingState = {
  status: OnboardingStatus
  step?: string
  choseType?: OnboardingType
  attribution?: OnboardingAttribution
  paymentDeferred?: boolean
  completedAt?: string | null
  updatedAt?: string
}

/** Org roles assignable via invitation (owner is reserved for the creator). */
export const ORG_INVITE_ROLES = ["admin", "member"] as const
export type OrgInviteRole = (typeof ORG_INVITE_ROLES)[number]

/** POST /v1/onboarding/organization — create a WorkOS-backed team org. */
export const orgCreateBodySchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    invites: z.array(z.string().trim().email().max(254)).max(20).optional(),
  })
  .strict()
export type OrgCreateBody = z.infer<typeof orgCreateBodySchema>

/** POST /v1/organization/invitations — invite teammates to the current org. */
export const orgSendInvitationsBodySchema = z
  .object({
    emails: z.array(z.string().trim().email().max(254)).min(1).max(20),
    role: z.enum(ORG_INVITE_ROLES).optional(),
  })
  .strict()
export type OrgSendInvitationsBody = z.infer<typeof orgSendInvitationsBodySchema>

/** POST /v1/invitations/accept — accept an invitation by its token. */
export const orgAcceptInvitationBodySchema = z
  .object({
    token: z.string().trim().min(1).max(512),
  })
  .strict()
export type OrgAcceptInvitationBody = z.infer<typeof orgAcceptInvitationBodySchema>

/** PATCH /v1/organization/members/:userId body — change a member's role. */
export const orgMemberRoleBodySchema = z
  .object({
    role: z.enum(ORG_INVITE_ROLES),
  })
  .strict()
export type OrgMemberRoleBody = z.infer<typeof orgMemberRoleBodySchema>

/** PATCH /v1/onboarding body — partial wizard-progress update. */
export const accountUpdateOnboardingBodySchema = z
  .object({
    step: z.string().trim().max(40).optional(),
    choseType: z.enum(["individual", "organization"]).optional(),
    attribution: z.enum(ONBOARDING_ATTRIBUTION_OPTIONS).optional(),
    paymentDeferred: z.boolean().optional(),
    status: z.enum(["pending", "complete"]).optional(),
  })
  .strict()
export type AccountUpdateOnboardingBody = z.infer<typeof accountUpdateOnboardingBodySchema>
