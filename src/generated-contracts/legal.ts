/**
 * Canonical legal-document identity and version constants.
 *
 * Single source of truth for:
 *  - the operating legal entity named in user-facing legal documents, and
 *  - the version stamped on a user's Terms of Service / Privacy Policy
 *    acceptance record at signup (see `terms_acceptances` table).
 *
 * The marketing site renders the same version/effective-date strings in
 * `apps/docs/content/site/marketing-pages.ts` (which does not depend on this
 * package). When you cut a new version of the Terms or Privacy Policy, bump the
 * matching constant HERE and the mirrored literal there together — both files
 * cross-reference each other in comments. Keeping the acceptance record and the
 * displayed document version in lockstep is what makes "the user accepted v1.0
 * on this date" provable.
 */

/** Legal entity that operates secapi.ai. */
export const LEGAL_ENTITY_NAME = "Arcade Group, Inc."
/** How the entity is presented to users (entity + brand). */
export const LEGAL_ENTITY_DISPLAY = "Arcade Group, Inc. (operating as secapi.ai)"
/** State of incorporation / principal place of business. */
export const LEGAL_ENTITY_DOMICILE = "Wyoming, United States"
/**
 * Governing law for the Terms of Service (chosen Jun 2026). The entity is
 * Wyoming-domiciled but the Terms are governed by Delaware law — an intentional,
 * common split (Delaware's deeper body of business law). The published Terms
 * carry the matching governing-law + arbitration clause; this constant is the
 * single source of truth for it.
 */
export const LEGAL_GOVERNING_LAW = "State of Delaware, United States"

/** Contact endpoints referenced across the legal documents. */
export const LEGAL_CONTACTS = {
  /** Legal notices, arbitration notices, Terms questions. */
  legal: "legal@secapi.ai",
  /** Commercial, billing, and general support. */
  support: "support@secapi.ai",
  /** Security disclosures, privacy / DPO function, data-subject requests. */
  privacy: "security@secapi.ai",
} as const

/** Documents a user accepts at signup. */
export type LegalDocument = "tos" | "privacy"

/** Current published version of the Terms of Service. */
export const LEGAL_TERMS_VERSION = "1.1"
/** Current published version of the Privacy Policy. */
export const LEGAL_PRIVACY_VERSION = "1.0"

/** Version stamped on an acceptance record, keyed by document. */
export const LEGAL_DOCUMENT_VERSIONS: Record<LegalDocument, string> = {
  tos: LEGAL_TERMS_VERSION,
  privacy: LEGAL_PRIVACY_VERSION,
}

/** Human-readable effective date shown on the documents and at signup. */
export const LEGAL_EFFECTIVE_DATE = "June 19, 2026"
