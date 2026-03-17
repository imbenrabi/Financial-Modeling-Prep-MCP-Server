# Intent Layer

Sparse hierarchy of files capturing non-obvious architectural knowledge — pitfalls, anti-patterns, invariants — that agents cannot infer from reading code alone.

## Design Principles

1. **Progressive Disclosure** — Start with minimum context; drill into detail via downlinks as needed
2. **Token Efficiency** — Each file under 600 words; if obvious from code, delete it
3. **LCA Optimization** — Place shared knowledge at lowest common ancestor; never duplicate across siblings
4. **Hierarchical Loading** — When a node loads, all ancestors load too (T-shaped view)

## Maintenance Rules

- If you change behavior documented in an AGENTS.md, update that file in the same PR
- If you add a new major directory with distinct concerns, add an AGENTS.md and wire it into navigation

## Authoring Constraints

- Under 600 words per file
- No facts derivable from reading code
- No teaching/procedural content (that goes in GUIDE.md if needed)
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
| [`src/AGENTS.md`](src/AGENTS.md) | Startup sequence dependencies, custom Fastify app pitfall |
| [`src/api/AGENTS.md`](src/api/AGENTS.md) | API key as query param (never headers), token precedence |
| [`src/tools/AGENTS.md`](src/tools/AGENTS.md) | Never-throw pattern, global tool name uniqueness |
| [`src/toolception-adapters/AGENTS.md`](src/toolception-adapters/AGENTS.md) | Session cache key formula, fingerprint algorithm |
| [`src/server-mode-enforcer/AGENTS.md`](src/server-mode-enforcer/AGENTS.md) | Singleton init order, fail-fast on invalid toolsets |
