# Intent Layer

Sparse hierarchy of files capturing non-obvious architectural knowledge — pitfalls, anti-patterns, invariants — that agents cannot infer from reading code alone.

## Design Principles

1. **Progressive Disclosure** — Start with minimum context; drill into detail via downlinks as needed
2. **Token Efficiency** — Each AGENTS.md under 600 words (FLOW.md files stay as short); if obvious from code, delete it
3. **LCA Optimization** — Place shared knowledge at lowest common ancestor; never duplicate across siblings
4. **Hierarchical Loading** — When a node loads, all ancestors load too (T-shaped view)
5. **Root-only Bootstrap** — Only `CLAUDE.md` and this file sit at the repo root; every other node is reached by downlink from here

## Maintenance Rules

- If you change behavior documented in an AGENTS.md or FLOW.md, update that file in the same PR
- If you add a new major directory with distinct concerns, add an AGENTS.md at its mirror path, wire it into the navigation below, `CLAUDE.md`, and the path table in `.claude/skills/code-review/SKILL.md`
- If a node goes stale, fix or delete the claim; never leave an unverified claim in place

## Authoring Constraints

- Under 600 words per AGENTS.md (`wc -w`, whole file)
- No facts derivable from reading code
- No fact repeated within a file or in a sibling node
- No teaching/procedural content (that goes in GUIDE.md)
- Nodes live under `docs/` and mirror the source path they describe (`src/api` → `docs/src/api`, `scripts` → `docs/scripts`, `__tests__/smoke` → `docs/tests/smoke`); a FLOW.md sits beside its AGENTS.md
- Positive framing in Key Rules, negative in Anti-patterns

## Control Flow Scoring

| Points | Criterion |
|--------|-----------|
| +0 | Pure procedural step (code shows it) |
| +1 | Ordering dependency code enforces |
| +2 | Non-obvious ordering code does NOT enforce |
| +1 | Failure blast radius beyond immediate operation |
| +1 | Side-effect an agent wouldn't expect |
| +1 | Environment-dependent behavior |

Score 0-1: Delete. Score 2: Keep gotcha sentence. Score 3-4: FLOW.md. Score 5: Inline in AGENTS.md.

## Navigation

| Node | Non-obvious Knowledge |
|------|----------------------|
| [`docs/src/AGENTS.md`](docs/src/AGENTS.md) | Startup sequence dependencies, custom Fastify app pitfall, layer rules |
| [`docs/src/api/AGENTS.md`](docs/src/api/AGENTS.md) | API key as query param, token precedence, error surface |
| [`docs/src/tools/AGENTS.md`](docs/src/tools/AGENTS.md) | Never-throw pattern |
| [`docs/src/toolception-adapters/AGENTS.md`](docs/src/toolception-adapters/AGENTS.md) | Session context, swallowed loader failures, adapter chunking |
| [`docs/src/server-mode-enforcer/AGENTS.md`](docs/src/server-mode-enforcer/AGENTS.md) | Singleton init order, mode resolution order, fail-fast on invalid toolsets |
| [`docs/src/constants/AGENTS.md`](docs/src/constants/AGENTS.md) | Tool set catalog uniqueness and lockstep |
| [`docs/src/prompts/AGENTS.md`](docs/src/prompts/AGENTS.md) | Silent prompt no-op, prompt text vs runtime |
| [`docs/src/endpoints/AGENTS.md`](docs/src/endpoints/AGENTS.md) | Server-card registry coupling, schema/runtime divergence |
| [`docs/src/utils/AGENTS.md`](docs/src/utils/AGENTS.md) | Helpers that are not wired into the runtime |
| [`docs/scripts/AGENTS.md`](docs/scripts/AGENTS.md) | Release pipeline, version sync, toolception verification |
| [`docs/tests/smoke/AGENTS.md`](docs/tests/smoke/AGENTS.md) | Smoke test requirements: build first, SSE parsing, global session state |
| [`docs/GUIDE.md`](docs/GUIDE.md) | Procedural guides for adding tools, modules, tool sets, and intent nodes |
