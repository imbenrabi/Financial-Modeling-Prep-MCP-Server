# Financial Modeling Prep MCP Server

MCP server providing 253+ financial data tools via Financial Modeling Prep API.

## Documentation

**For users**: See [README.md](./README.md) for installation, configuration, and usage.

**For AI agents**: See [AGENTS.md](./AGENTS.md) for Intent Layer documentation - architecture, patterns, and invariants.

## Quick Reference

- **Architecture**: Toolception framework + 28 modules + 27 API clients
- **Modes**: ALL_TOOLS (default) | STATIC_TOOL_SETS | DYNAMIC_TOOL_DISCOVERY
- **Tool Sets**: 24 high-level sets mapping to 253+ tools
- **Key Invariant**: API key always in query param, never in headers

## Intent Layer Structure

```
AGENTS.md (root)                           # Entry point for AI agents
├── src/api/AGENTS.md                      # API layer patterns
├── src/tools/AGENTS.md                    # Tool registration
├── src/toolception-adapters/AGENTS.md     # Framework bridge
├── src/server-mode-enforcer/AGENTS.md     # Mode configuration
└── src/constants/AGENTS.md                # Tool sets and defaults
```
