## Summary

<!-- What changed and why. One paragraph max. Link issues with "Closes #". -->

Closes #

## Scope

<!-- Check ALL areas this PR touches. Reviewers and CI use this to gauge blast radius. -->

- [ ] `src/` — SDK source (client, types, resources)
- [ ] `test/` — Test suite
- [ ] `examples/` — Example programs
- [ ] `package.json` / dependencies
- [ ] `tsconfig.json` / `tsconfig.build.json` — TS config
- [ ] `README.md` / docs
- [ ] `.github/` — CI/CD workflows
- [ ] Build / publish config

## Changes

<!-- Bullet points grouped by area. Be specific — diffs are for code, this is for intent. -->

-
-

## Verification

<!-- What you ran locally. Paste actual commands and their outcomes. -->

```bash
bun install         # ✅ / ❌
bun run typecheck   # ✅ / ❌
bun run test        # ✅ / ❌
bun run build       # ✅ / ❌
```

<details>
<summary>Additional verification (expand if applicable)</summary>

```bash
# Run an example end-to-end
SECAPI_API_KEY=... bun examples/<example>.ts

# Package size / contents
npm pack --dry-run

# Type-only smoke
bun build src/index.ts --outdir /tmp/sdk-out --target node
```

</details>

## Deployment Impact

<!-- Skip this section entirely for code-only changes with no release impact. -->

- [ ] New version bump in `package.json`
- [ ] Breaking API change (semver major)
- [ ] npm publish required
- [ ] Docs (README / examples) updated to match
- [ ] Companion docs PR in secapi-ai org docs site

## Completion Attestation

<!-- You MUST select one. This is a binding statement of delivery status. -->

- [ ] **100% complete, 100% functional.** All code is written, tested, typechecks, builds cleanly, and works end-to-end against live SEC API. No outstanding work remains.
- [ ] **Not fully complete or functional.** Deltas listed below.

### Deltas (only if attesting incomplete)

<!-- Short bullets. Items intentionally deferred from this PR's stated scope. -->

-

## Screenshots / Demo

<!-- Terminal output, CLI snippets, or API response examples. Delete section if not applicable. -->

---

<details>
<summary>Agent Context</summary>

<!-- This section is for AI coding agents that may continue or review this work.
     Fill in what's relevant; delete what isn't. -->

**Key files to read first:**
<!-- List the 3-5 most important files for understanding this PR's changes. -->
- `src/index.ts`
-

**Decisions made:**
<!-- Non-obvious choices and why. Agents should not re-litigate these. -->
-

**Relevant docs:**
- `README.md`
- https://docs.secapi.ai

**Conventions applied:**
<!-- TS conventions, Zod schemas, error handling, response metadata fields. -->
-

</details>
