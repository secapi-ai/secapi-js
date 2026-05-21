export type DatabasePoolerMode = "none" | "pgbouncer"

const APP_ONLY_DATABASE_URL_PARAMS = new Set([
  "pgbouncer",
])

export type DatabaseConnectionEnv = {
  DATABASE_URL?: string | null
  DATABASE_DIRECT_URL?: string | null
  POSTGRES_URL?: string | null
  OMNI_DATABASE_POOLER?: string | null
}

export function normalizePostgresConnectionString(connectionString: string): string {
  try {
    new URL(connectionString)
  } catch {
    return connectionString
  }

  const fragmentIndex = connectionString.indexOf("#")
  const beforeFragment = fragmentIndex === -1 ? connectionString : connectionString.slice(0, fragmentIndex)
  const fragment = fragmentIndex === -1 ? "" : connectionString.slice(fragmentIndex)
  const queryIndex = beforeFragment.indexOf("?")
  if (queryIndex === -1) return connectionString

  const prefix = beforeFragment.slice(0, queryIndex)
  const query = beforeFragment.slice(queryIndex + 1)
  const rawParams = query.split("&")
  const keptParams = rawParams.filter((segment) => {
    const separatorIndex = segment.indexOf("=")
    const rawKey = separatorIndex === -1 ? segment : segment.slice(0, separatorIndex)
    return !APP_ONLY_DATABASE_URL_PARAMS.has(decodeQueryParamKey(rawKey))
  })

  if (keptParams.length === rawParams.length) return connectionString
  return `${prefix}${keptParams.length > 0 ? `?${keptParams.join("&")}` : ""}${fragment}`
}

function decodeQueryParamKey(rawKey: string): string {
  try {
    return decodeURIComponent(rawKey.replaceAll("+", " "))
  } catch {
    return rawKey
  }
}

export function databasePoolerModeFromEnv(value: string | null | undefined): DatabasePoolerMode {
  const mode = value?.trim().toLowerCase()
  if (!mode) return "none"
  if (mode === "none" || mode === "pgbouncer") return mode
  throw new Error(`OMNI_DATABASE_POOLER must be "none" or "pgbouncer" (got "${value}")`)
}

export function resolveDatabaseConnectionString(
  env: DatabaseConnectionEnv,
  options: { preferDirect?: boolean; allowPostgresUrl?: boolean } = {},
): string | null {
  const primary = env.DATABASE_URL?.trim()
  const direct = env.DATABASE_DIRECT_URL?.trim()
  const postgres = options.allowPostgresUrl ? env.POSTGRES_URL?.trim() : undefined
  const raw = options.preferDirect
    ? direct || primary || postgres
    : primary || postgres || direct
  return raw ? normalizePostgresConnectionString(raw) : null
}
