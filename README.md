# Financial Modeling Prep MCP Server

[![npm version](https://img.shields.io/npm/v/financial-modeling-prep-mcp-server.svg)](https://www.npmjs.com/package/financial-modeling-prep-mcp-server)
[![license](https://img.shields.io/npm/l/financial-modeling-prep-mcp-server.svg)](LICENSE)
[![Listed on LightNow](https://lightnow.ai/badge/io.github.imbenrabi/financial-modeling-prep-mcp-server?variant=listed)](https://lightnow.ai/servers/io.github.imbenrabi/financial-modeling-prep-mcp-server)

A Model Context Protocol (MCP) server for the [Financial Modeling Prep](https://financialmodelingprep.com/) API, exposing 267 financial data tools to AI assistants.

## Features

- **267 Financial Tools** across 24 toolsets — stocks, ETFs, crypto, forex, commodities, economics, and more
- **Dynamic Tool Management** — built on [toolception](https://www.npmjs.com/package/toolception) for runtime enable/disable of toolsets via meta-tools
- **Three Server Modes** — Dynamic (5 meta-tools), Static (pre-loaded toolsets), or All Tools (default)
- **Flexible Deployment** — use the hosted instance or self-host via npm, Docker (built from source), or source
- **Streamable HTTP Transport** — compatible with Claude.ai, Claude Desktop, and MCP registries

## Quick Start

### Hosted Instance (Fastest)

No installation required. Connect directly:

```
https://financial-modeling-prep-mcp-server-production.up.railway.app/mcp
```

The hosted instance runs in Dynamic mode: it starts with 5 meta-tools that load toolsets on demand. Pass your FMP API key as `FMP_ACCESS_TOKEN` in the `?config=` session configuration (see [Usage](docs/USAGE.md#session-configuration)).

### Self-Hosted (One-Liner)

```bash
npx financial-modeling-prep-mcp-server --fmp-token=YOUR_FMP_API_KEY
```

Or install globally:

```bash
npm install -g financial-modeling-prep-mcp-server
fmp-mcp --fmp-token=YOUR_FMP_API_KEY
```

> Get your API key at [financialmodelingprep.com](https://site.financialmodelingprep.com/).

## Table of Contents

- [Installation](docs/INSTALLATION.md)
- [Configuration](docs/CONFIGURATION.md)
- [Usage](docs/USAGE.md)
- [API Reference](docs/API_REFERENCE.md)
- [Registries](docs/REGISTRIES.md)
- [Contributing](CONTRIBUTING.md)
- [License](LICENSE)

## Installation

**Prerequisites:** Node.js 25.3.0 or higher (for v2.6.0+). For older versions (v2.5.x and below), Node.js 20+ is required.

Choose the method that fits your workflow:

- **NPM** — `npm install -g financial-modeling-prep-mcp-server`
- **Docker** — build the image from source (no pre-built image is published)
- **Source** — clone and run with `npm install && npm run build`

See [docs/INSTALLATION.md](docs/INSTALLATION.md) for detailed steps per method.

## Configuration

The server supports three operational modes controlled via CLI arguments or environment variables:

| Mode | How to Enable | Description |
|------|---------------|-------------|
| **Dynamic** | `DYNAMIC_TOOL_DISCOVERY=true` | Starts with 5 meta-tools; load toolsets at runtime |
| **Static** | `FMP_TOOL_SETS=search,company` | Pre-loads specified toolsets on session creation |
| **All Tools (default)** | *(default)* | Loads all 267 tools immediately |

Precedence: for mode and tool sets, CLI args > Environment variables > Defaults. A session `?config=` token overrides the server's `FMP_ACCESS_TOKEN` for that session.

See [docs/CONFIGURATION.md](docs/CONFIGURATION.md) for the full configuration reference.

## Usage

Connect to the server over streamable HTTP:

- **Claude.ai / Claude Desktop** — add as a remote connector (Settings > Connectors)
- **Custom clients** — POST to `/mcp`: send `initialize` first, then the `mcp-session-id` it returns on every later request
- **MCP registries** — Glama.ai and the official MCP Registry

See [docs/USAGE.md](docs/USAGE.md) for client-specific setup, session headers, and request examples.

## Available Tools

24 toolsets covering:

Search · Directory & Symbol Lists · Company Information · Financial Statements · Financial Metrics & Analysis · Technical Indicators · Quotes & Price Data · Market Indexes & Performance · Market Data · News & Press Releases · SEC Filings · Insider & Institutional Trading · ETFs & Funds · Government Trading · Cryptocurrency & Forex · Earnings · Special Data Sets · Commodities · Economics · Bulk Data Tools

See [docs/API_REFERENCE.md](docs/API_REFERENCE.md) for the complete tool catalog.

## Registries

This server is listed on multiple MCP registries for easy discovery:

- [MCP Registry](https://registry.modelcontextprotocol.io/servers/io.github.imbenrabi/financial-modeling-prep-mcp-server)
- [Glama.ai](https://glama.ai/mcp/servers/imbenrabi/Financial-Modeling-Prep-MCP-Server)

See [docs/REGISTRIES.md](docs/REGISTRIES.md) for registry-specific setup instructions.

## Contributing

Contributions are welcome. Please see [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, testing, and pull request guidelines.

## License

[Apache-2.0](LICENSE)
