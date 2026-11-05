# MCP Registry Listings

Where this server is published.

## MCP Registry
- **URL:** https://registry.modelcontextprotocol.io/servers/io.github.imbenrabi/financial-modeling-prep-mcp-server
- **Published from:** `server.json`, by the release workflow when a `v*` tag is pushed.
- **Entry:** an npm package run with `npx` over streamable HTTP, plus the hosted instance as a remote. Arguments: `--fmp-token`, `--port`, `--dynamic-tool-discovery`, `--fmp-tool-sets`. Environment variables: `FMP_ACCESS_TOKEN`, `PORT`, `DYNAMIC_TOOL_DISCOVERY`, `FMP_TOOL_SETS`.
- **Tools list:** the registry entry has a `remotes` URL, so registries and clients that read tools from a running server can list them. Registries that only read the npm package see no tools, because tools are registered at runtime.

## Glama.ai
- **URL:** https://glama.ai/mcp/servers/imbenrabi/Financial-Modeling-Prep-MCP-Server
- **Configuration:** `glama.json`, maintained by `imbenrabi` and `NitayRabi`.

## LightNow
- **URL:** https://lightnow.ai/servers/io.github.imbenrabi/financial-modeling-prep-mcp-server
- **README badge:** "Listed on LightNow". It does not show tool counts, because the available tools depend on the server mode.

## mcptry
- **URL:** https://mcptry.com/servers/io.github.imbenrabi/financial-modeling-prep-mcp-server
- **README badge:** `https://mcptry.com/badge/io.github.imbenrabi/financial-modeling-prep-mcp-server`

## mcprush
- **URL:** https://mcprush.com/to/financial-modeling-prep-mcp?ref=badge
- **README badge:** `https://mcprush.com/badge/financial-modeling-prep-mcp/score.svg`
- **Tools list:** reads tools from the `remotes` URL in `server.json`. See the MCP Registry entry above.

## Smithery.ai
- **Status:** not currently listed. The repo still has a `smithery.yaml` (a container build from the `Dockerfile`), but there is no live Smithery listing to link to.
