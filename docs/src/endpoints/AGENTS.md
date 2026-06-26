# Endpoints

HTTP endpoints mounted alongside the MCP route.

## Key Rules

- The `/.well-known/mcp/server-card.json` endpoint is the registry-discovery surface (SEP-1649); Smithery and similar registries read it instead of probing the stateful MCP endpoint

## Pitfalls

- `server-card.json` diverges from runtime: it marks `FMP_ACCESS_TOKEN` as required and lists a fixed dynamic-mode surface that does not reflect actual enablement state

## Flow Reference

See [FLOW.md](FLOW.md) — server-card construction, registry coupling, and schema/runtime divergence
