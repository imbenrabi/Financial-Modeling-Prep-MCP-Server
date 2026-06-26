---
name: code-review
description: >
  Review a PR or working diff against this repo's intent layer (the AGENTS.md
  hierarchy), toolception pitfalls, and core invariants. Use when reviewing code,
  auditing a PR, or checking changes before merge in the Financial Modeling Prep
  MCP server. Triggers on: "review", "code review", "review this PR",
  "review the diff", "audit", "check this diff", "before merge",
  "pull request review", "PR review".
allowed-tools: Read, Grep, Glob, Bash(git:*), Bash(gh pr:*), Bash(gh api:*), Bash(gh search:*), Skill
---

# Code Review — FMP MCP Server

You are reviewing changes to this repository. This server exposes 253+ read-only
financial-data tools over MCP (HTTP/SSE) using `toolception` + Fastify. Most of the
load-bearing rules here are **non-obvious** and live in the **intent layer** (the
`AGENTS.md` hierarchy), not in the code. A generic review misses them. Your job is to
catch real bugs **and** any violation of this repo's documented invariants.

Work through the steps in order. Do not skip step 1 or step 3 — nor step 4 when the diff
touches the toolception integration surface.

## 1. Load behavioral guidelines

Invoke the `karpathy-guidelines` skill first (via the Skill tool) and review through its
four lenses:

- **Surgical changes** — every changed line should trace to the PR's stated purpose. Flag
  drive-by refactors, reformatting, or "improvements" to untouched code.
- **Simplicity** — flag speculative abstraction, unused config/flexibility, and error
  handling for impossible states.
- **Surfaced assumptions** — flag silent decisions where multiple interpretations existed.
- **Verifiable success** — flag behavior changes that arrive without a test proving them.

## 2. Scope the diff

Determine what changed.

- **Given a PR reference** — CI passes it as `owner/repo/pull/N`. Extract the number `N` and
  run `gh pr diff N` (the repo is inferred from the checkout); a full PR URL also works.
- **Otherwise** (local working branch) — diff against `main`:

```
git diff --merge-base main --stat
git diff --merge-base main
```

List the changed files and collapse them to the **source directories touched** — that set
drives step 3.

## 3. Load the intent layer (live read — do not rely on memory)

**Always** read the root `AGENTS.md` (it defines the intent layer and its maintenance
rules). Then, for each touched directory, read its matching doc. Read the area's `FLOW.md`
too when one exists. Loading is hierarchical and T-shaped: root + the specific node.

| Changed path | Read |
|---|---|
| `src/` (startup, `index.ts`, Fastify wiring) | `docs/src/AGENTS.md`, `docs/src/FLOW.md` |
| `src/api/**` | `docs/src/api/AGENTS.md` |
| `src/tools/**` | `docs/src/tools/AGENTS.md` |
| `src/toolception-adapters/**` | `docs/src/toolception-adapters/AGENTS.md` |
| `src/server-mode-enforcer/**` | `docs/src/server-mode-enforcer/AGENTS.md` |
| `src/endpoints/**` | `docs/src/endpoints/AGENTS.md`, `docs/src/endpoints/FLOW.md` |
| `__tests__/smoke/**` | `docs/tests/smoke/AGENTS.md` |
| Adding a tool/module/tool set | `docs/GUIDE.md` (the procedure to follow) |

Directories without their own doc (`src/constants`, `src/prompts`, `src/schemas`,
`src/types`, `src/utils`) inherit the root `AGENTS.md` plus the nearest parent that does
have one — review them on general dimensions (step 5) and the invariants in scope.

The rules you cite in findings come from the docs you just read — **quote the actual Key
Rule / Anti-pattern / Pitfall**, do not paraphrase from this skill.

## 4. Toolception deep-check (only when the diff touches the integration surface)

`toolception` is the core MCP layer, but `node_modules/toolception` ships **compiled `dist/`
only** — the readable source and the real API contracts live upstream at the **public** repo
`code-rabi/toolception`. When the diff touches the integration surface, verify it against the
**actual upstream source**, not memory.

**Trigger** when the diff touches any of: `src/toolception-adapters/**`, `src/index.ts` (the
`createMcpServer` config), `src/endpoints/*.ts` (`defineEndpoint`), `src/prompts/**` (the
`McpServer.prompt()` extension), **or** bumps `toolception` in `package.json` /
`package-lock.json`.

**Fetch the source with `gh`, pinned to the installed version:**

1. Read the installed version from `node_modules/toolception/package.json` (`version`). Tags
   are `v<version>` (e.g. `v0.6.3`).
2. Pull the relevant source — raw, no base64 decode:

```
V=v$(node -p "require('./node_modules/toolception/package.json').version")  # bare 'toolception/package.json' is blocked by its exports map
gh api -H "Accept: application/vnd.github.raw" "/repos/code-rabi/toolception/contents/src/index.ts?ref=$V"
gh api "/repos/code-rabi/toolception/contents/src/<area>?ref=$V" --jq '.[].name'   # list a dir
gh search code --repo code-rabi/toolception "<symbol>"                              # locate a symbol
```

Offline fallback for the type contracts: `node_modules/toolception/dist/index.d.ts`.

**Fetch the area that matches the change:**

| Diff touches | Fetch from toolception `src/` |
|---|---|
| `createMcpServer` config (`src/index.ts`) | `src/index.ts`, `src/server/**`, `src/types/**` |
| startup mode / toolsets (`ModeConfigMapper`) | `src/mode/**` |
| exposure policy / namespacing / allowlist / `maxActiveToolsets` | `src/permissions/**` |
| session config / `config` query param / cache key | `src/session/**` |
| `defineEndpoint` / custom endpoints / Fastify app | `src/http/**` |
| `ModuleLoader` / `McpToolDefinition` shapes | `src/types/**` |
| `McpServer.prompt()` extension (`src/prompts/**`) | `src/server/**` |
| meta-tools (enable/disable/list toolsets) | `src/meta/**` |

**Verify the diff against the fetched contracts:**
- The config this repo passes to `createMcpServer` (`catalog`, `moduleLoaders`,
  `startup{mode, toolsets}`, `context`, `sessionContext{queryParam}`,
  `exposurePolicy{namespaceToolsWithSetKey, maxActiveToolsets?, allowlist?}`, `createServer`,
  `http`) still matches the upstream `CreateMcpServerOptions` type — flag renamed/removed/
  retyped keys.
- `ModuleLoader` is still `(context?) => Promise<McpToolDefinition[]>` and the
  `McpToolDefinition` shape the adapters / `ToolCollector` emit still matches upstream.
- `McpServer.prompt()` still exists upstream — a runtime extension reached via type cast that
  **silently no-ops if dropped** (`list_mcp_assets` then vanishes with no error).
- **On a `toolception` version bump:** fetch the **new** tag's source and re-verify every
  contract above. Flag any breaking rename/removal/retype (precedent: `initialToolsets` →
  `toolsets` in 0.5.1).

**Don't restate the intent layer** — `docs/src/toolception-adapters/AGENTS.md` and
`docs/src/AGENTS.md` / `FLOW.md` already hold this repo's toolception pitfalls; cite them.
Upstream `toolception` ships its own `AGENTS.md` files too (e.g. `src/session/AGENTS.md`) —
fetch them for its documented intent when a change is subtle.

## 5. Review across dimensions

For each, cite the specific source (`file:line` for code, and the exact rule from the
loaded `AGENTS.md` for invariants).

**A. General correctness & security.** Logic bugs, unhandled edge cases and error paths,
secret/token exposure in logs or responses, injection, and obvious performance traps. This
makes the skill a complete reviewer, not just an overlay.

**B. Intent-layer invariants & toolception pitfalls.** Validate the diff against the rules
in the docs loaded in step 3. The recurring high-cost ones to anchor on:
- **API key** travels as the `?apikey=` query param — never a header (`docs/src/api/AGENTS.md`).
- **Token precedence** is Context > Instance > Environment; don't invert it.
- **Tools never throw** — handlers return `{ content: [...], isError: true }`, message
  formatted `Error: ${message}` (`docs/src/tools/AGENTS.md`).
- **Tool names are globally unique** across all modules — a duplicate silently overwrites.
- **Toolception** integration pitfalls (session cache key, base64 `config` query param,
  `MODULE_ADAPTERS` ↔ `TOOL_SETS` sync, no session-level toolset config) live in
  `docs/src/toolception-adapters/AGENTS.md` — and when the integration surface is touched,
  run the **step 4 deep-check** against upstream source.
- **Startup order** (`docs/src/AGENTS.md` / `FLOW.md`): the `preHandler` hook is registered
  before `createMcpServer()`; a custom Fastify app must call `app.listen()`.
- **Server-mode enforcer**: `initialize()` precedes `getInstance()`; invalid tool sets
  fail-fast via `process.exit(1)`.
- Don't infer request success from HTTP status — FMP returns error bodies with HTTP 200.

**C. AGENTS.md sync.** The intent layer's own maintenance rule (root `AGENTS.md`): if the
diff changes behavior documented in an `AGENTS.md`, that file must be updated in the **same
PR**. If a touched area's documented rule no longer matches the code and its `AGENTS.md` is
untouched, flag it. (Also: a new major directory with distinct concerns should add an
`AGENTS.md` wired into the navigation table.)

**D. TypeScript standards.** Invoke the `typescript-standards` skill (Skill tool) and apply
it to the changed `.ts` files; report what it flags. It covers no-`any` (prefer `unknown`),
TSDoc on exports, pure functions / single responsibility, `readonly`, and preferring
`interface` — defer to the skill for the exact rules rather than restating them here.

**E. Test expectations.** Per `docs/tests/smoke/AGENTS.md`: smoke tests run `dist/` so a
build must precede them; responses are SSE (`event: message\ndata: {json}`) — never parsed
as raw JSON; `resetSession()` runs between tests (global `clientId`/`sessionId`). New tools
or modules should ship with tests.

## 6. Output

Report high-signal findings only. For each:

- **Severity** — Blocker / High / Medium / Low.
- **Location** — `file:line`.
- **Rule** — the exact invariant or bug, with its citation (e.g.
  `docs/src/tools/AGENTS.md → never-throw`).
- **Fix** — concrete and minimal.

Do not raise nits that trace to neither a documented rule nor a real defect. If the diff is
clean, say so and name what you checked. Group findings by severity, Blockers first.
