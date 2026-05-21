import { z } from "zod"

/**
 * Schema version for the agent-chat WebSocket auth ticket envelope.
 *
 * Bump on any breaking change to the envelope shape. Verifiers reject mismatched versions.
 */
export const AGENT_CHAT_TICKET_VERSION = 1 as const

/**
 * Service principals authorized to mint and present an agent-chat ticket.
 *
 * - `browser`: end-user WebSocket session bridged from a WorkOS principal via
 *   `POST /v1/agent-chat/tickets`. Short TTL (60s); single redemption guarded
 *   by the replay cache.
 * - `eval`: server-to-server eval harness routing through agent-chat (OMNI-3286).
 *   Extended TTL (1h) so a single ticket spans a canary-25 + bridge-50 run.
 *   The harness re-mints per question (UUID `ticketId`) so the replay cache
 *   does not collide; the security model relies on the secret never leaving
 *   the harness process.
 *
 * Tickets minted before OMNI-3286 (no `servicePrincipal` field) decode with
 * the schema's `.default('browser')` and verify unchanged. No envelope version
 * bump is required because the addition is structurally a superset.
 */
export const AGENT_CHAT_TICKET_SERVICE_PRINCIPALS = ["browser", "eval"] as const
export type AgentChatTicketServicePrincipal = (typeof AGENT_CHAT_TICKET_SERVICE_PRINCIPALS)[number]

/**
 * HMAC-signed envelope minted by datastream-api (`POST /v1/agent-chat/tickets`
 * for browser principals) and verified by agent-chat (`/ws?token=<envelope>`,
 * or `Authorization: Bearer <envelope>` on the OMNI-3286 eval HTTP endpoints)
 * to bridge a WorkOS browser session or an eval-harness service principal onto
 * the chat WebSocket / eval HTTP surface.
 *
 * Single-use within the cache window: once verified, the `ticketId` is added
 * to a replay cache (TTL = `AGENT_CHAT_TICKET_REPLAY_CACHE_TTL_SECONDS`,
 * currently 90s — set 30s longer than the issue TTL to absorb clock skew) so
 * the same envelope cannot be redeemed twice. Lives under
 * `STREAM_TICKET_HMAC_SECRET_PRIMARY` (with `_PREVIOUS` accepted during
 * rotation overlap).
 */
export const agentChatTicketEnvelopeSchema = z.object({
  v: z.literal(AGENT_CHAT_TICKET_VERSION),
  userId: z.string().min(1),
  sessionId: z.string().min(1).optional(),
  ticketId: z.string().min(1),
  exp: z.number().int().positive(),
  servicePrincipal: z.enum(AGENT_CHAT_TICKET_SERVICE_PRINCIPALS).default("browser"),
})

export type AgentChatTicketEnvelope = z.infer<typeof agentChatTicketEnvelopeSchema>

/**
 * Default ticket lifetime in seconds for browser-principal tickets. Short on
 * purpose — even if a ticket leaks, the window for replay is small. Verifiers
 * also enforce single-use post-redemption within the replay cache window.
 */
export const AGENT_CHAT_TICKET_DEFAULT_TTL_SECONDS = 60

/**
 * Default ticket lifetime in seconds for eval-principal tickets (OMNI-3286).
 * 1 hour comfortably spans a full canary-25 + bridge-50 run end-to-end with
 * headroom for tool-call retries; the harness re-mints per question to keep
 * each `ticketId` single-use against the replay cache.
 */
export const AGENT_CHAT_TICKET_EVAL_TTL_SECONDS = 3600

/**
 * Replay-cache TTL after a ticket is redeemed. Set 30s longer than the
 * default issue TTL so that even if the verifier's clock lags ~30s behind
 * the minter, the replay cache still holds the ticketId until the envelope's
 * `exp` is unambiguously past on both clocks (closes the brief skew window
 * that would otherwise allow a leaked ticket to be replayed once the cache
 * eviction races the `exp` check).
 */
export const AGENT_CHAT_TICKET_REPLAY_CACHE_TTL_SECONDS = 90

/**
 * Mint result returned to the browser. The `token` is the `<base64payload>.<signature>`
 * string passed in `?token=<envelope>` to agent-chat's WebSocket. (agent-chat's
 * existing query parser reads `?token=` for both JWTs and tickets; the verifier
 * dispatches by envelope shape.)
 */
export const agentChatTicketResponseSchema = z.object({
  token: z.string().min(1),
  expiresAt: z.string().datetime(),
})

export type AgentChatTicketResponse = z.infer<typeof agentChatTicketResponseSchema>

/**
 * Optional request body for `POST /v1/agent-chat/tickets`. Carries a
 * sessionId for resumption flows; the route is cookie-authed and derives `userId`
 * from the WorkOS principal.
 */
export const agentChatTicketRequestSchema = z.object({
  sessionId: z.string().min(1).optional(),
})

export type AgentChatTicketRequest = z.infer<typeof agentChatTicketRequestSchema>
