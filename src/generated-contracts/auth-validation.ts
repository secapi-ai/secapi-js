import { z } from "zod"

/**
 * Shared authentication input validation.
 *
 * Single source of truth for email + password policy used by BOTH the
 * datastream-api self-hosted auth routes (server-side enforcement) and the
 * apps/site inline signup/login UI (client-side UX). WorkOS enforces its own
 * password policy as a backstop; this layer gives consistent, friendly,
 * pre-flight feedback and a firm minimum bar before we ever call WorkOS.
 *
 * Keep this dependency-light: it is imported into the browser bundle.
 */

/** Minimum password length we accept before delegating to WorkOS. */
export const PASSWORD_MIN_LENGTH = 12
/** Upper bound to bound work / avoid abuse (well under any hash input cap). */
export const PASSWORD_MAX_LENGTH = 128
/** Max length for an optional first/last name field. */
export const NAME_MAX_LENGTH = 80
/** Length of the WorkOS email-verification one-time code. */
export const VERIFICATION_CODE_LENGTH = 6
/** Max accepted email length (RFC 5321 practical limit). */
export const EMAIL_MAX_LENGTH = 254

export type FieldValidation<T> = { ok: true; value: T } | { ok: false; reason: string }

/** Normalize an email for storage / comparison: trimmed + lowercased. */
export function normalizeEmail(raw: string | null | undefined): string {
  return (raw ?? "").trim().toLowerCase()
}

// Pragmatic email shape check. We intentionally do NOT attempt full RFC 5322
// parsing — WorkOS + the verification email are the real proof of validity.
//
// Implemented with indexOf/slice + a single linear character-class test rather
// than a structural regex: a pattern like `[^\s@]+\.[^\s@]+` has ambiguous
// overlapping quantifiers (the literal dot is also matched by `[^\s@]`) which
// is polynomial-ReDoS-prone (flagged by CodeQL js/polynomial-redos). This
// version has no backtracking.
function isPlausibleEmail(email: string): boolean {
  if (/[\s"]/.test(email)) return false // no whitespace or quotes (linear char class)
  const at = email.indexOf("@")
  if (at <= 0) return false // need a non-empty local part before exactly one '@'
  if (email.indexOf("@", at + 1) !== -1) return false
  const domain = email.slice(at + 1)
  const dot = domain.lastIndexOf(".")
  // a dot that is neither the first nor the last domain character
  return dot > 0 && dot < domain.length - 1
}

export function validateEmail(raw: string | null | undefined): FieldValidation<string> {
  const email = normalizeEmail(raw)
  if (!email) return { ok: false, reason: "Enter your email address." }
  if (email.length > EMAIL_MAX_LENGTH) return { ok: false, reason: "Email address is too long." }
  if (!isPlausibleEmail(email)) return { ok: false, reason: "Enter a valid email address." }
  return { ok: true, value: email }
}

// A small denylist of the most-abused base words. This is a fast local UX gate,
// not a substitute for WorkOS's breached-password protection — it stops the
// laziest "<word> + digits/symbols" choices (which sail past a naive
// length+complexity rule) from ever reaching the API.
//
// Entries are letter-only "base words"; we reduce a candidate password to its
// base word (strip leading/trailing non-letters, de-leet, drop remaining
// non-letters) and reject on an exact base-word match. Exact match (not
// substring) keeps false-positives near zero for legitimate passphrases.
const COMMON_PASSWORD_BASES = new Set([
  "password", "passwordone", "qwerty", "qwertyuiop", "iloveyou", "letmein",
  "monkey", "dragon", "football", "baseball", "sunshine", "princess",
  "changeme", "secret", "trustno", "whatever", "starwars", "admin",
  "welcome", "login", "master", "superman", "batman", "secapi", "secapikey",
])

// Strip leading/trailing non-letters with a linear two-pointer scan. A regex
// (e.g. /^[^a-z]+|[^a-z]+$/g) would trip CodeQL's polynomial-ReDoS detector on
// the anchored `+$` alternation; this is allocation-light and backtrack-free.
// Input is already lower-cased by the caller, so "letter" means a-z.
function trimNonLetters(value: string): string {
  let start = 0
  let end = value.length
  const isLetter = (ch: string) => ch >= "a" && ch <= "z"
  while (start < end && !isLetter(value[start]!)) start += 1
  while (end > start && !isLetter(value[end - 1]!)) end -= 1
  return value.slice(start, end)
}

/** Reduce a password to a comparable base word for the common-word gate. */
export function passwordBaseWord(password: string): string {
  const core = trimNonLetters(password.toLowerCase())
  const deLeet = core
    .replace(/[@4]/g, "a")
    .replace(/3/g, "e")
    .replace(/[1!|]/g, "i")
    .replace(/0/g, "o")
    .replace(/[$5]/g, "s")
    .replace(/7/g, "t")
  return deLeet.replace(/[^a-z]/g, "")
}

function characterClassCount(password: string): number {
  let classes = 0
  if (/[a-z]/.test(password)) classes += 1
  if (/[A-Z]/.test(password)) classes += 1
  if (/[0-9]/.test(password)) classes += 1
  if (/[^A-Za-z0-9]/.test(password)) classes += 1
  return classes
}

/**
 * Password policy: at least PASSWORD_MIN_LENGTH chars and either 3+ character
 * classes, or 2+ classes for a longer (16+) passphrase. Rejects single-character
 * repeats, the common-password denylist, and passwords containing the user's
 * email local-part.
 */
export function validatePassword(
  raw: string | null | undefined,
  opts: { email?: string | null } = {},
): FieldValidation<string> {
  const password = raw ?? ""
  if (password.length < PASSWORD_MIN_LENGTH) {
    return { ok: false, reason: `Use at least ${PASSWORD_MIN_LENGTH} characters.` }
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return { ok: false, reason: `Use at most ${PASSWORD_MAX_LENGTH} characters.` }
  }
  if (/^(.)\1+$/.test(password)) {
    return { ok: false, reason: "Choose a less predictable password." }
  }
  const classes = characterClassCount(password)
  const meetsComplexity = classes >= 3 || (password.length >= 16 && classes >= 2)
  if (!meetsComplexity) {
    return { ok: false, reason: "Mix uppercase, lowercase, numbers, and symbols (or use a longer passphrase)." }
  }
  if (COMMON_PASSWORD_BASES.has(passwordBaseWord(password))) {
    return { ok: false, reason: "That password is too common. Choose something harder to guess." }
  }
  const localPart = normalizeEmail(opts.email).split("@")[0]
  if (localPart && localPart.length >= 4 && password.toLowerCase().includes(localPart)) {
    return { ok: false, reason: "Password must not contain your email address." }
  }
  return { ok: true, value: password }
}

/** Normalize an optional display-name field; empty/whitespace becomes null. */
export function normalizeOptionalName(raw: string | null | undefined): string | null {
  const trimmed = (raw ?? "").trim()
  if (!trimmed) return null
  return trimmed.slice(0, NAME_MAX_LENGTH)
}

const optionalName = z
  .string()
  .max(NAME_MAX_LENGTH, `Keep names under ${NAME_MAX_LENGTH} characters.`)
  .nullish()

const optionalToken = z.string().max(4096).nullish()
const optionalNext = z.string().max(2048).nullish()

// Email fields normalize (trim+lowercase) at the schema boundary so the server
// and client never disagree, and callers can store `data.email` directly.
const normalizedEmail = z.string().transform(normalizeEmail)

/** POST /auth/workos/register */
export const authRegisterBodySchema = z
  .object({
    email: normalizedEmail,
    password: z.string(),
    firstName: optionalName,
    lastName: optionalName,
    // Clickwrap: must be affirmatively true. Gates every signup method.
    agreed: z.boolean(),
    next: optionalNext,
    turnstileToken: optionalToken,
  })
  .strict()
  .superRefine((val, ctx) => {
    const email = validateEmail(val.email)
    if (!email.ok) ctx.addIssue({ code: "custom", path: ["email"], message: email.reason })
    const password = validatePassword(val.password, { email: val.email })
    if (!password.ok) ctx.addIssue({ code: "custom", path: ["password"], message: password.reason })
    if (val.agreed !== true) {
      ctx.addIssue({ code: "custom", path: ["agreed"], message: "Accept the Terms of Service and Privacy Policy to continue." })
    }
  })

/** POST /auth/workos/login (password policy is NOT applied to logins) */
export const authLoginBodySchema = z
  .object({
    email: normalizedEmail,
    password: z.string().min(1, "Enter your password."),
    next: optionalNext,
    turnstileToken: optionalToken,
  })
  .strict()
  .superRefine((val, ctx) => {
    const email = validateEmail(val.email)
    if (!email.ok) ctx.addIssue({ code: "custom", path: ["email"], message: email.reason })
  })

/** POST /auth/workos/verify-email (pendingToken comes from the signed cookie) */
export const authVerifyEmailBodySchema = z
  .object({
    code: z
      .string()
      .trim()
      .regex(new RegExp(`^\\d{${VERIFICATION_CODE_LENGTH}}$`), `Enter the ${VERIFICATION_CODE_LENGTH}-digit code.`),
    turnstileToken: optionalToken,
  })
  .strict()

/** POST /auth/workos/resend-verification (identity comes from the signed cookie) */
export const authResendVerificationBodySchema = z
  .object({
    turnstileToken: optionalToken,
  })
  .strict()

/** POST /auth/workos/forgot-password */
export const authForgotPasswordBodySchema = z
  .object({
    email: normalizedEmail,
    turnstileToken: optionalToken,
  })
  .strict()
  .superRefine((val, ctx) => {
    const email = validateEmail(val.email)
    if (!email.ok) ctx.addIssue({ code: "custom", path: ["email"], message: email.reason })
  })

/** POST /auth/workos/reset-password (token is the WorkOS reset token from email) */
export const authResetPasswordBodySchema = z
  .object({
    token: z.string().min(1, "This reset link is invalid or has expired."),
    password: z.string(),
    turnstileToken: optionalToken,
  })
  .strict()
  .superRefine((val, ctx) => {
    const password = validatePassword(val.password)
    if (!password.ok) ctx.addIssue({ code: "custom", path: ["password"], message: password.reason })
  })

export type AuthRegisterBody = z.infer<typeof authRegisterBodySchema>
export type AuthLoginBody = z.infer<typeof authLoginBodySchema>
export type AuthVerifyEmailBody = z.infer<typeof authVerifyEmailBodySchema>
export type AuthResendVerificationBody = z.infer<typeof authResendVerificationBodySchema>
export type AuthForgotPasswordBody = z.infer<typeof authForgotPasswordBodySchema>
export type AuthResetPasswordBody = z.infer<typeof authResetPasswordBodySchema>
