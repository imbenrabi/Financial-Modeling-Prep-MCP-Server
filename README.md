# Financial Modeling Prep MCP (Model Context Protocol) Server

[![smithery badge](https://smithery.ai/badge/@imbenrabi/financial-modeling-prep-mcp-server)](https://smithery.ai/server/@imbenrabi/financial-modeling-prep-mcp-server)
[![npm version](https://img.shields.io/npm/v/financial-modeling-prep-mcp-server.svg)](https://www.npmjs.com/package/financial-modeling-prep-mcp-server)

A Model Context Protocol (MCP) implementation for Financial Modeling Prep, enabling AI assistants to access and analyze financial data, stock information, company fundamentals, and market insights.

## Table of Contents

- [Server Architecture](#server-architecture)
- [Configuration & Mode Enforcement](#configuration--mode-enforcement)
  - [Server Modes](#server-modes)
  - [Configuration Precedence](#configuration-precedence)
- [Usage](#usage)
  - [Registries](#registries)
    - [MCP Registry](#mcp-registry)
    - [Quick Start Guide for Registry Users](#quick-start-guide-for-registry-users)
    - [AI Platform Integration](#ai-platform-integration)
    - [Smithery.ai](#smitheryai)
    - [Glama.ai](#glamaai)
    - [Contexaai.com](#contexaaicom)
  - [Installation Methods](#installation-methods)
    - [NPM Installation](#npm-installation)
    - [Docker Installation](#docker-installation)
    - [Source Installation](#source-installation)
    - [Environment Variables](#environment-variables)
    - [Verification](#verification)
    - [Troubleshooting](#troubleshooting)
  - [HTTP Server & Local Development](#http-server--local-development)
  - [Example System Prompts](#example-system-prompts)
- [Making HTTP Requests](#making-http-requests)
  - [Session Configuration](#session-configuration)
  - [Request Examples](#request-examples)
- [Selective Tool Loading](#selective-tool-loading)
- [Dynamic Toolset Management (BETA)](#dynamic-toolset-management-beta)
- [Available Tools](#available-tools)
  - [Search Tools](#search-tools)
  - [Directory and Symbol Lists](#directory-and-symbol-lists)
  - [Company Information](#company-information)
  - [Financial Statements](#financial-statements)
  - [Financial Metrics and Analysis](#financial-metrics-and-analysis)
  - [Technical Indicators](#technical-indicators)
  - [Quotes and Price Data](#quotes-and-price-data)
  - [Market Indexes and Performance](#market-indexes-and-performance)
  - [Market Data](#market-data)
  - [News and Press Releases](#news-and-press-releases)
  - [SEC Filings](#sec-filings)
  - [Insider and Institutional Trading](#insider-and-institutional-trading)
  - [ETFs and Funds](#etfs-and-funds)
  - [Government Trading](#government-trading)
  - [Cryptocurrency and Forex](#cryptocurrency-and-forex)
  - [Earnings](#earnings)
  - [Special Data Sets](#special-data-sets)
  - [Commodities](#commodities)
  - [Economics](#economics)
  - [Fundraisers](#fundraisers)
  - [Bulk Data Tools](#bulk-data-tools)
- [Obtaining a Financial Modeling Prep Access Token](#obtaining-a-financial-modeling-prep-access-token)
- [Contributing](#contributing)
  - [Development Setup](#development-setup)
  - [Running Tests](#running-tests)
- [Issues and Bug Reports](#issues-and-bug-reports)
- [License](#license)

## Quick Start

Choose your deployment option:

### 🚀 Option 1: Use Our Hosted Instance (Fastest)

**No installation required!**

1. **Get FMP API Key**: [Sign up at FMP](https://financialmodelingprep.com/developer/docs)
2. **Connect via Smithery**: [View on Smithery.ai](https://smithery.ai/server/@imbenrabi/financial-modeling-prep-mcp-server)
3. **Provide API key** in session configuration
4. **Start using** 5 meta-tools to load toolsets dynamically

**Our hosted instance endpoint:**
```
https://financial-modeling-prep-mcp-server-production.up.railway.app/mcp
```

**Example session config:**
```json
{
  "FMP_ACCESS_TOKEN": "your_fmp_api_key_here"
}
```

---

### 🏠 Option 2: Self-Host Your Own Instance (Full Control)

**Choose your mode and deploy:**

**NPM Installation:**
```bash
npm install -g financial-modeling-prep-mcp-server
export FMP_ACCESS_TOKEN=your_token_here
export DYNAMIC_TOOL_DISCOVERY=true  # or choose static/legacy
fmp-mcp
```

**Docker:**
```bash
docker run -p 8080:8080 \
  -e FMP_ACCESS_TOKEN=your_token_here \
  -e DYNAMIC_TOOL_DISCOVERY=true \
  ghcr.io/imbenrabi/financial-modeling-prep-mcp-server:latest
```

See [Installation Methods](#installation-methods) for detailed self-hosting options.

---

## Features

- **Powered by Toolception**: Built on [toolception](https://www.npmjs.com/package/toolception) for robust server orchestration and dynamic tool management
- **5 Meta-Tools in Dynamic Mode**: `enable_toolset`, `disable_toolset`, `list_toolsets`, `describe_toolset`, `list_tools`
- **Comprehensive Coverage**: Access to 253+ financial tools across 24 categories
- **Flexible Deployment**: Use our hosted instance or self-host with full control
- **Tool Set Filtering**: Load only the tools you need to reduce complexity and improve performance
- **Dynamic Tool Loading**: Runtime enable/disable of tool categories via meta-tools
- **Real-time Data**: Live stock quotes, market data, and financial information
- **Financial Statements**: Income statements, balance sheets, cash flow statements, and financial ratios
- **Market Analysis**: Technical indicators, analyst estimates, and market performance metrics
- **Economic Data**: Treasury rates, economic indicators, and macroeconomic information
- **Alternative Data**: ESG scores, insider trading, congressional trading, and social sentiment

## Deployment Options

This server can be used in two ways:

### 📡 **Using Our Hosted Instance** (Recommended for Quick Start)

Our hosted instance is available via:
- **Smithery.ai**: [View on Smithery](https://smithery.ai/server/@imbenrabi/financial-modeling-prep-mcp-server)
- **Direct Access**: `https://financial-modeling-prep-mcp-server-production.up.railway.app/mcp`

**Configuration:**
- Runs in **dynamic mode** (5 meta-tools: `enable_toolset`, `disable_toolset`, `list_toolsets`, `describe_toolset`, `list_tools`)
- Requires FMP API key in **session configuration** (not server environment)
- No server-side setup needed - just connect and use

### 🏠 **Self-Hosting Your Own Instance** (Full Control)

Deploy your own instance for complete control:
- **Choose any mode**: Dynamic, Static, or Legacy
- **Configure via**: Environment variables or CLI arguments
- **Deployment options**: NPM, Docker, or from source
- See [Installation Methods](#installation-methods) below

---

## Server Architecture

This MCP server leverages **[toolception](https://www.npmjs.com/package/toolception)** - a dynamic MCP server toolkit for runtime toolset management with Fastify transport and meta-tools. Toolception provides complete server orchestration including HTTP transport, session management, and tool lifecycle.

### Key Features:

- **Powered by Toolception**: Uses [toolception v0.5.1](https://www.npmjs.com/package/toolception) for server orchestration and dynamic tool management
- **Client-level Caching**: Toolception's `ClientResourceCache` maintains isolated sessions per client with LRU/TTL eviction
- **Session Isolation**: Each client gets their own MCP server instance with independent tool state
- **Stateful Management**: Sessions maintain their state across multiple requests via toolception's session management
- **Mode Enforcement**: Server-level configurations can override session-level settings
- **HTTP-based Protocol**: Communicates via HTTP with JSON-RPC formatted messages using Fastify transport
- **Dynamic Tool Management**: Tools can be loaded/unloaded at runtime per session using toolception's DynamicToolManager

### Request Flow:

1. **Client Request** → HTTP POST to `/` endpoint
2. **Session Management** → Toolception creates or retrieves session based on client ID (caching via `ClientResourceCache`)
3. **Mode Resolution** → Server determines operational mode (Dynamic/Static/Legacy)
4. **Tool Registration** → Toolception's `ModuleResolver` lazy-loads tools based on resolved mode
5. **Request Processing** → MCP request is processed with available tools via toolception's orchestrator
6. **Response** → JSON-RPC response sent back to client

### Available HTTP Endpoints:

- `POST /` - Main MCP protocol endpoint (JSON-RPC formatted messages)
- `GET /mcp` - Server information endpoint
- `GET /healthz` - Health check endpoint (returns `{"ok": true}`)
- `GET /tools` - Tool manager status endpoint
- `GET /.well-known/mcp-config` - MCP configuration schema endpoint

## Configuration & Mode Enforcement

The server supports multiple configuration methods with a clear precedence hierarchy to ensure predictable behavior.

### Understanding Server Modes

The server supports three operational modes. **The mode you use depends on your deployment scenario:**

#### **Using Our Hosted Instance** (Smithery/Railway)
- **Fixed Mode**: Dynamic mode (5 meta-tools)
- **Configuration**: Pass `FMP_ACCESS_TOKEN` in session config
- **Use Case**: Quick start without deployment

#### **Self-Hosting Your Own Instance**
- **Your Choice**: Select any mode via environment variables or CLI arguments
- **Configuration**: Set at server startup
- **Use Case**: Full control over tools and configuration

---

### Available Modes

#### 1. **🔀 Dynamic Mode** (`DYNAMIC_TOOL_DISCOVERY=true`)

Starts with only **5 meta-tools**:
- `enable_toolset` - Enable a toolset by name
- `disable_toolset` - Disable a toolset by name
- `list_toolsets` - List available toolsets with active status
- `describe_toolset` - Describe a toolset with details and tools
- `list_tools` - List currently registered tool names

**When to Use:**
- ✅ Using our hosted instance (default)
- ✅ Building flexible workflows where tool needs change
- ✅ Minimizing initial overhead
- ✅ Multi-tenant deployments where users need different tools

**Our Hosted Instance:** This is the default mode

**Self-Hosted:** Set via `DYNAMIC_TOOL_DISCOVERY=true` or `--dynamic-tool-discovery`

#### 2. **🔧 Static Mode** (`FMP_TOOL_SETS=search,company,quotes`)

Pre-loads specific toolsets at session creation. All specified tools available immediately.

**When to Use:**
- ✅ Self-hosted with known, consistent tool requirements
- ✅ Predictable usage patterns
- ✅ Faster tool access (no runtime loading)

**Our Hosted Instance:** Not available (we use dynamic mode)

**Self-Hosted:** Set via `FMP_TOOL_SETS=search,company,quotes` or `--fmp-tool-sets=search,company,quotes`

#### 3. **📚 Legacy Mode** (no specific configuration)

Loads all 253+ tools at session creation. Maximum compatibility with all features.

**When to Use:**
- ✅ Self-hosted with full feature access requirements
- ✅ No configuration complexity needed
- ✅ Not concerned about initial load time

**Our Hosted Instance:** Not available (we use dynamic mode)

**Self-Hosted:** Default when no mode is configured, or set `DYNAMIC_TOOL_DISCOVERY=false`

### Configuration Precedence (Self-Hosted Only)

When self-hosting, configuration follows this strict precedence hierarchy:

```
🥇 CLI Arguments (highest priority)
   ↓
🥈 Environment Variables
   ↓
🥉 Session Configuration (lowest priority)
```

**Note:** Our hosted instance mode configuration is fixed to dynamic tool exploration and cannot be changed via session config.

#### ⚠️ **Important Mode Enforcement Behavior (Self-Hosted)**

When **server-level** configurations are set (CLI arguments or environment variables), they **override** all session-level configurations for **ALL** sessions. This ensures consistent behavior across the entire server instance.

**Example Override Scenario:**

```bash
# Server started with CLI argument
npm run dev -- --dynamic-tool-discovery

# ALL session requests will use Dynamic Mode, regardless of session config
# Session config like {"FMP_TOOL_SETS": "search,company"} will be IGNORED
```

#### Configuration Methods:

1. **CLI Arguments** (Server-level - overrides everything)

   ```bash
   npm run dev -- --fmp-token=TOKEN --dynamic-tool-discovery
   npm run dev -- --fmp-token=TOKEN --fmp-tool-sets=search,company,quotes
   npm run dev -- --port=4000 --fmp-token=TOKEN
   ```

2. **Environment Variables** (Server-level - overrides session configs)

   ```bash
   DYNAMIC_TOOL_DISCOVERY=true npm run dev
   FMP_TOOL_SETS=search,company,quotes npm run dev
   ```

3. **Session Configuration** (Session-level - via HTTP query parameter)
   ```bash
   # Base64 encoded JSON config in query parameter
   curl -X POST "http://localhost:8080/mcp?config=eyJEWU5BTUlDX1RPT0xfRElTQ09WRVJZIjoidHJ1ZSJ9"
   ```

#### ⚠️ **Configuration Warnings**

- **Server-level modes are GLOBAL**: They affect all sessions on the server instance
- **Session configs are IGNORED** when server-level modes are active
- **No mixing**: You cannot have different modes for different sessions when server-level enforcement is active
- **Restart required**: Changing server-level configurations requires server restart

## Selective Tool Loading

While MCP clients can filter tools automatically, large tool sets may impact performance. To optimize your experience, you can specify which tool categories to load instead of loading all 253 tools at once:

### Available Tool Sets

| Tool Set               | Description            | Example Tools                                         |
| ---------------------- | ---------------------- | ----------------------------------------------------- |
| `search`               | Search & Directory     | Search stocks, company lookup, symbol directories     |
| `company`              | Company Profile & Info | Company profiles, executives, employee count          |
| `quotes`               | Real-time Quotes       | Live stock prices, market data, price changes         |
| `statements`           | Financial Statements   | Income statements, balance sheets, cash flow, ratios  |
| `calendar`             | Financial Calendar     | Earnings calendar, dividends, IPOs, stock splits      |
| `charts`               | Price Charts & History | Historical prices, technical charts, market movements |
| `news`                 | Financial News         | Market news, press releases, financial articles       |
| `analyst`              | Analyst Coverage       | Price targets, ratings, analyst estimates             |
| `market-performance`   | Market Performance     | Sector performance, gainers, losers, most active      |
| `insider-trades`       | Insider Trading        | Corporate insider activity, ownership changes         |
| `institutional`        | Institutional Holdings | 13F filings, fund holdings, institutional ownership   |
| `indexes`              | Market Indexes         | S&P 500, NASDAQ, Dow Jones, index constituents        |
| `economics`            | Economic Data          | Treasury rates, GDP, inflation, economic indicators   |
| `crypto`               | Cryptocurrency         | Crypto prices, market data, digital assets            |
| `forex`                | Foreign Exchange       | Currency pairs, exchange rates, forex data            |
| `commodities`          | Commodities            | Gold, oil, agricultural products, futures             |
| `etf-funds`            | ETFs & Mutual Funds    | Fund holdings, performance, fund information          |
| `esg`                  | ESG & Sustainability   | Environmental, social, governance ratings             |
| `technical-indicators` | Technical Indicators   | RSI, SMA, EMA, MACD, Bollinger Bands                  |
| `senate`               | Government Trading     | Congressional and Senate trading disclosures          |
| `sec-filings`          | SEC Filings            | 10-K, 10-Q, 8-K filings, regulatory documents         |
| `earnings`             | Earnings & Transcripts | Earnings reports, call transcripts                    |
| `dcf`                  | DCF Valuation          | Discounted cash flow models, valuations               |
| `bulk`                 | Bulk Data              | Large-scale data downloads for analysis               |

## Dynamic Toolset Management (BETA)

**🚧 This feature is currently in BETA. API and behavior may change in future versions.**

The Dynamic Toolset Management feature allows you to enable and disable tool categories at runtime instead of pre-configuring them at startup. This provides more flexibility and can help optimize performance by loading only the tools you need when you need them.

### How It Works

When dynamic toolset management is enabled, each session starts with only **5 meta-tools**:

- `enable_toolset` - Enable a toolset by name
- `disable_toolset` - Disable a toolset by name (state only)
- `list_toolsets` - List available toolsets with active status and definitions
- `describe_toolset` - Describe a toolset with definition, active status and tools
- `list_tools` - List currently registered tool names (best effort)

AI assistants can then use these meta-tools to dynamically load and unload specific tool categories as needed for different tasks within their session.

### Configuration Options

#### Server-Level Configuration (Affects All Sessions)

**Command Line Arguments:**

```bash
# Enable dynamic toolset management for all sessions
npm run dev -- --fmp-token=YOUR_TOKEN --dynamic-tool-discovery

# Production deployment
node dist/index.js --fmp-token=YOUR_TOKEN --dynamic-tool-discovery
```

**Environment Variables:**

```bash
# Set environment variable
export DYNAMIC_TOOL_DISCOVERY=true
export FMP_ACCESS_TOKEN=YOUR_TOKEN
npm run dev

# Or inline
DYNAMIC_TOOL_DISCOVERY=true FMP_ACCESS_TOKEN=YOUR_TOKEN npm start
```

**Docker:**

```yaml
# docker-compose.yml
version: "3.8"
services:
  fmp-mcp:
    image: your-image-name
    ports:
      - "8080:8080"
    environment:
      - FMP_ACCESS_TOKEN=YOUR_FMP_ACCESS_TOKEN
      - DYNAMIC_TOOL_DISCOVERY=true # Enable for all sessions
```

#### Session-Level Configuration (When No Server Override)

When no server-level dynamic mode is set, individual sessions can request dynamic mode:

```bash
# Base64 encode: {"DYNAMIC_TOOL_DISCOVERY":"true"}
CONFIG_BASE64=$(echo -n '{"DYNAMIC_TOOL_DISCOVERY":"true"}' | base64)
curl -X POST "http://localhost:8080/mcp?config=${CONFIG_BASE64}" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize",...}'
```

### Example Workflow

1. **Start server with dynamic mode:**

   ```bash
   DYNAMIC_TOOL_DISCOVERY=true npm start
   ```

2. **AI assistant initializes session and gets meta-tools:**

   ```json
   // Response includes only 5 meta-tools:
   {
     "tools": [
       { "name": "enable_toolset", "description": "Enable a toolset by name" },
       { "name": "disable_toolset", "description": "Disable a toolset by name (state only)" },
       { "name": "list_toolsets", "description": "List available toolsets with active status and definitions" },
       { "name": "describe_toolset", "description": "Describe a toolset with definition, active status and tools" },
       { "name": "list_tools", "description": "List currently registered tool names (best effort)" }
     ]
   }
   ```

3. **AI assistant enables needed toolsets:**

   ```json
   // Enable search toolset
   {"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"enable_toolset","arguments":{"toolset":"search"}}}

   // Enable quotes toolset
   {"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"enable_toolset","arguments":{"toolset":"quotes"}}}
   ```

4. **AI assistant uses the enabled tools:**

   ```json
   // Now can use search and quotes tools
   {"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"searchSymbol","arguments":{"query":"AAPL"}}}
   {"jsonrpc":"2.0","id":5,"method":"tools/call","params":{"name":"getQuote","arguments":{"symbol":"AAPL"}}}
   ```

5. **AI assistant can disable unused toolsets:**
   ```json
   {
     "jsonrpc": "2.0",
     "id": 6,
     "method": "tools/call",
     "params": {
       "name": "disable_toolset",
       "arguments": { "toolset": "search" }
     }
   }
   ```

### Benefits

- **Performance**: Start faster with fewer tools loaded initially per session
- **Flexibility**: Load only the tools needed for current tasks
- **Resource Efficiency**: Reduce memory usage by disabling unused toolsets per session
- **Task-Oriented**: Perfect for AI assistants that work on specific financial analysis tasks
- **Session Isolation**: Each session can have different active toolsets

## Usage

### Registries

For production environments, you can use this MCP server through various registries that provide hosted and managed MCP servers:

## MCP Registry

The Financial Modeling Prep MCP Server is available through the official Model Context Protocol Registry, providing standardized installation and discovery for AI platforms.

### Quick Start from Registry

**NPM Installation:**

```bash
npm install financial-modeling-prep-mcp-server
npx fmp-mcp --fmp-token=YOUR_TOKEN
```

**Docker Installation:**

```bash
docker run -p 8080:8080 -e FMP_ACCESS_TOKEN=YOUR_TOKEN \
  ghcr.io/imbenrabi/financial-modeling-prep-mcp-server:latest
```

**From Source:**

```bash
git clone https://github.com/imbenrabi/Financial-Modeling-Prep-MCP-Server
cd Financial-Modeling-Prep-MCP-Server
npm install && npm run build
npm start -- --fmp-token=YOUR_TOKEN
```

### Registry Installation Methods

The server supports multiple installation methods through the MCP Registry:

| Method     | Command                                                           | Best For                        |
| ---------- | ----------------------------------------------------------------- | ------------------------------- |
| **NPM**    | `npm install financial-modeling-prep-mcp-server`                  | Development and local testing   |
| **Docker** | `docker run ghcr.io/imbenrabi/financial-modeling-prep-mcp-server` | Production deployments          |
| **Source** | `git clone && npm install`                                        | Customization and contributions |

### Quick Start Guide for Registry Users

**1. Choose Your Installation Method:**

```bash
# Option A: NPM (recommended for development)
npm install financial-modeling-prep-mcp-server
npx fmp-mcp --fmp-token=YOUR_TOKEN

# Option B: Docker (recommended for production)
docker run -p 8080:8080 -e FMP_ACCESS_TOKEN=YOUR_TOKEN \
  ghcr.io/imbenrabi/financial-modeling-prep-mcp-server:latest

# Option C: From source (for customization)
git clone https://github.com/imbenrabi/Financial-Modeling-Prep-MCP-Server
cd Financial-Modeling-Prep-MCP-Server && npm install && npm run build
npm start -- --fmp-token=YOUR_TOKEN
```

**2. Get Your FMP API Token:**

- Visit [Financial Modeling Prep](https://financialmodelingprep.com/developer/docs)
- Sign up for a free account
- Copy your API key from the dashboard

**3. Test the Installation:**

```bash
# Health check
curl http://localhost:8080/healthz

# List available tools
curl -X POST http://localhost:8080/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

**4. Connect to Your AI Platform:**

- Configure your MCP client to connect to `http://localhost:8080/mcp`
- Use the server in your AI conversations for financial analysis
- Refer to your platform's MCP integration documentation

### AI Platform Integration

This server is compatible with AI platforms that support the Model Context Protocol:

- **ChatGPT** (with MCP support)
- **Claude** (via MCP clients)
- **Perplexity** (via MCP integration)
- **Custom AI Applications** (using MCP SDK)

For platform-specific integration instructions, refer to your AI platform's MCP documentation.

## Installation Methods

The Financial Modeling Prep MCP Server supports multiple installation methods to fit different deployment scenarios and development workflows.

### NPM Installation

**Prerequisites:**

- Node.js ≥20.0.0
- NPM or Yarn package manager
- Financial Modeling Prep API token

**Install globally:**

```bash
npm install -g financial-modeling-prep-mcp-server
fmp-mcp --fmp-token=YOUR_TOKEN
```

**Install locally in project:**

```bash
npm install financial-modeling-prep-mcp-server
npx fmp-mcp --fmp-token=YOUR_TOKEN
```

**With configuration options:**

```bash
# Custom port and dynamic mode
npx fmp-mcp --fmp-token=YOUR_TOKEN --port=4000 --dynamic-tool-discovery

# Static toolset mode
npx fmp-mcp --fmp-token=YOUR_TOKEN --fmp-tool-sets=search,company,quotes
```

### Docker Installation

**Prerequisites:**

- Docker Engine
- Financial Modeling Prep API token

**Basic Docker run:**

```bash
docker run -p 8080:8080 \
  -e FMP_ACCESS_TOKEN=YOUR_TOKEN \
  ghcr.io/imbenrabi/financial-modeling-prep-mcp-server:latest
```

**With custom configuration:**

```bash
# Dynamic mode with custom port
docker run -p 4000:4000 \
  -e FMP_ACCESS_TOKEN=YOUR_TOKEN \
  -e PORT=4000 \
  -e DYNAMIC_TOOL_DISCOVERY=true \
  ghcr.io/imbenrabi/financial-modeling-prep-mcp-server:latest

# Static toolset mode
docker run -p 8080:8080 \
  -e FMP_ACCESS_TOKEN=YOUR_TOKEN \
  -e FMP_TOOL_SETS=search,company,quotes \
  ghcr.io/imbenrabi/financial-modeling-prep-mcp-server:latest
```

**Docker Compose:**

```yaml
version: "3.8"
services:
  fmp-mcp:
    image: ghcr.io/imbenrabi/financial-modeling-prep-mcp-server:latest
    ports:
      - "8080:8080"
    environment:
      - FMP_ACCESS_TOKEN=YOUR_FMP_ACCESS_TOKEN
      - PORT=8080
      # Optional: Choose server mode
      - DYNAMIC_TOOL_DISCOVERY=true
      # OR: - FMP_TOOL_SETS=search,company,quotes
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/healthz"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Source Installation

**Prerequisites:**

- Node.js ≥20.0.0
- Git
- NPM or Yarn package manager
- Financial Modeling Prep API token

**Clone and build:**

```bash
# Clone repository
git clone https://github.com/imbenrabi/Financial-Modeling-Prep-MCP-Server.git
cd Financial-Modeling-Prep-MCP-Server

# Install dependencies
npm install

# Build TypeScript
npm run build

# Start server
npm start -- --fmp-token=YOUR_TOKEN
```

**Development mode:**

```bash
# Run with hot reload
npm run dev -- --fmp-token=YOUR_TOKEN

# Run tests
npm test

# Run with coverage
npm run test:coverage

# Verify installation methods
npm run verify:installation

# Type checking
npm run typecheck
```

**Custom build configuration:**

```bash
# Build with specific target
npx tsc --target ES2022

# Build and watch for changes
npx tsc --watch

# Clean build
rm -rf dist && npm run build
```

### Environment Variables

These apply when **self-hosting your own instance**. Our hosted instance has fixed configuration.

| Variable                 | Description                       | Self-Host Default | Our Hosted Instance | Notes |
| ------------------------ | --------------------------------- | ----------------- | ------------------- | ----- |
| `FMP_ACCESS_TOKEN`       | Financial Modeling Prep API token | -                 | Not set             | **Our hosted:** Pass via session config |
| `PORT`                   | Server port                       | `8080`            | Railway-managed     | |
| `DYNAMIC_TOOL_DISCOVERY` | Enable dynamic toolset mode       | `false`           | `true` (fixed)      | **Our hosted:** Always dynamic mode |
| `FMP_TOOL_SETS`          | Static toolsets (comma-separated) | -                 | Not applicable      | **Our hosted:** Dynamic mode only |
| `NODE_ENV`               | Node.js environment               | `development`     | `production`        | |

**Deployment Scenarios:**

**Using Our Hosted Instance (Smithery/Railway):**
- ✅ No environment variables needed on your end
- ✅ Pass `FMP_ACCESS_TOKEN` in session config
- ✅ Dynamic mode enabled by default

**Self-Hosting Your Own Instance:**
```bash
# Example: Dynamic mode with server-level API key
export FMP_ACCESS_TOKEN=your_token_here
export DYNAMIC_TOOL_DISCOVERY=true
export PORT=8080
npm start

# Example: Static mode with specific toolsets
export FMP_ACCESS_TOKEN=your_token_here
export FMP_TOOL_SETS=search,company,quotes
npm start

# Example: Legacy mode (all tools)
export FMP_ACCESS_TOKEN=your_token_here
npm start
```

### Verification

After installation, verify the server is working:

**Health check:**

```bash
curl http://localhost:8080/healthz
```

**MCP capabilities:**

```bash
curl -X POST http://localhost:8080/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05",
      "clientInfo": {"name": "test", "version": "1.0.0"},
      "capabilities": {}
    }
  }'
```

**List available tools:**

```bash
curl -X POST http://localhost:8080/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}'
```

### Troubleshooting

**Common issues and solutions:**

1. **Port already in use:**

   ```bash
   # Use different port
   PORT=4000 npm start -- --fmp-token=YOUR_TOKEN
   ```

2. **Invalid API token:**

   ```bash
   # Verify token at https://financialmodelingprep.com/developer/docs
   curl "https://financialmodelingprep.com/api/v3/profile/AAPL?apikey=YOUR_TOKEN"
   ```

3. **Memory issues with all tools:**

   ```bash
   # Use dynamic mode or specific toolsets
   npm start -- --fmp-token=YOUR_TOKEN --dynamic-tool-discovery
   ```

4. **Docker permission issues:**
   ```bash
   # Run with user permissions
   docker run --user $(id -u):$(id -g) -p 8080:8080 \
     -e FMP_ACCESS_TOKEN=YOUR_TOKEN \
     ghcr.io/imbenrabi/financial-modeling-prep-mcp-server:latest
   ```

#### Smithery.ai

[![smithery badge](https://smithery.ai/badge/@imbenrabi/financial-modeling-prep-mcp-server)](https://smithery.ai/server/@imbenrabi/financial-modeling-prep-mcp-server)

**[🚀 View on Smithery.ai](https://smithery.ai/server/@imbenrabi/financial-modeling-prep-mcp-server)**

The Financial Modeling Prep MCP Server is available on Smithery via **our hosted instance**.

##### Important Update: Smithery Hosting Changes (March 2026)

On March 1st, 2026, Smithery discontinued their free hosting service. As a result:

- ✅ **Our hosted instance is still available** - We deployed our own server to Railway and expose it via Smithery
- ✅ **No server setup required** - Just connect and provide your FMP API key
- ❌ **No Smithery-hosted version** - The server runs on our infrastructure, not Smithery's

##### Using Our Hosted Instance

**Server Configuration:**
- **Mode**: Dynamic (5 meta-tools only)
- **Endpoint**: `https://financial-modeling-prep-mcp-server-production.up.railway.app/mcp`
- **API Key**: You must provide your FMP API key in session configuration

**Session Configuration Requirements:**

You **must** pass your FMP API key in the session configuration. The server does not have an API key configured at the environment level.

**Example Session Configuration (via Smithery/MCP Client):**

```json
{
  "FMP_ACCESS_TOKEN": "your_fmp_api_key_here"
}
```

**Alternative Configurations:**

```json
// Explicitly request dynamic mode (already the default)
{
  "FMP_ACCESS_TOKEN": "your_fmp_api_key_here",
  "DYNAMIC_TOOL_DISCOVERY": "true"
}

// Note: Static/Legacy modes are NOT SUPPORTED on our hosted instance
// Server-level configuration overrides session requests
{
  "FMP_ACCESS_TOKEN": "your_fmp_api_key_here",
  "FMP_TOOL_SETS": "search,company,quotes"  // This will be ignored
}
```

**Important Notes:**
- 🔒 **Your API key is required** - We don't store API keys on the server
- 🚀 **Dynamic mode only** - Our instance is configured for dynamic mode
- 🔧 **Meta-tools available** - Use them to load toolsets as needed
- 💡 **Session isolation** - Your tools and state are isolated from other users

##### Getting Your FMP API Key

1. Visit [Financial Modeling Prep](https://financialmodelingprep.com/developer/docs)
2. Sign up for a free account
3. Copy your API key from the dashboard
4. Use it in your session configuration

##### Want Different Configuration?

If you need static or legacy mode, or want full control over the server configuration:

**Self-Host Your Own Instance:**
- Follow the [Installation Methods](#installation-methods) guide
- Choose any mode (dynamic, static, or legacy)
- Configure environment variables as needed
- Deploy to your preferred platform

**Then Register with Smithery (Optional):**
- Deploy your instance with a public URL
- Register the external URL with Smithery (free)
- Full configuration control

For Smithery integration documentation, visit [smithery.ai/docs](https://smithery.ai/docs).

#### Glama.ai

**[Use on Glama.ai](https://glama.ai/mcp/servers/@imbenrabi/Financial-Modeling-Prep-MCP-Server)**

#### Contexaai.com

**[Use on Contexaai.com](https://platform.contexaai.com/mcp/financial-modeling-typescript-imbenrabi)**

### HTTP Server & Local Development

The server runs as an HTTP server that exposes a Model Context Protocol endpoint. Each request can include session-specific configuration via query parameters.

#### Basic Server Setup

**Local Development:**

```bash
# Clone and setup
git clone https://github.com/imbenrabi/Financial-Modeling-Prep-MCP-Server
cd Financial-Modeling-Prep-MCP-Server
npm install
npm run build

# Run in development
FMP_ACCESS_TOKEN=YOUR_TOKEN npm run dev

# Or with CLI arguments
npm run dev -- --fmp-token=YOUR_TOKEN
npm run dev -- --port=4000 --fmp-token=YOUR_TOKEN
```

#### Server-Level Mode Configuration

**🔐 Server-Level Dynamic Mode (All Sessions Use Dynamic Mode):**

```bash
# CLI argument (highest priority)
npm run dev -- --fmp-token=YOUR_TOKEN --dynamic-tool-discovery

# Environment variable
DYNAMIC_TOOL_DISCOVERY=true FMP_ACCESS_TOKEN=YOUR_TOKEN npm run dev


```

**🔧 Server-Level Static Mode (All Sessions Use Specified Toolsets):**

```bash
# CLI argument (highest priority)
npm run dev -- --fmp-token=YOUR_TOKEN --fmp-tool-sets=search,company,quotes

# Environment variable
FMP_TOOL_SETS=search,company,quotes FMP_ACCESS_TOKEN=YOUR_TOKEN npm run dev


```

**📚 Server-Level Legacy Mode (All Sessions Get All Tools):**

```bash
# Default behavior - no specific configuration
npm run dev -- --fmp-token=YOUR_TOKEN
FMP_ACCESS_TOKEN=YOUR_TOKEN npm run dev
```

#### Custom Port Configuration

```bash
# Change server port via environment variable
PORT=4000 npm run dev -- --fmp-token=YOUR_TOKEN

# Change server port via CLI argument
npm run dev -- --port=4000 --fmp-token=YOUR_TOKEN


```

### Example System Prompts

The following system prompts are designed to help AI assistants effectively use this MCP server for financial analysis tasks. Choose the appropriate prompt based on your server configuration mode.

#### For Dynamic Toolset Mode

```
You are an expert financial analyst AI with access to comprehensive market data tools.

CORE RULES:
- Always use tools for current market data; never rely on outdated information or estimates
- Check conversation history to avoid redundant tool calls
- Provide concise, data-driven responses
- Always include: "This is not financial advice"

DYNAMIC TOOLSET MANAGEMENT:
Your tools are organized into categories ("toolsets") that must be enabled before use.

Available toolsets: search, company, quotes, statements, calendar, charts, news, analyst, market-performance, insider-trades, institutional, indexes, economics, crypto, forex, commodities, etf-funds, esg, technical-indicators, senate, sec-filings, earnings, dcf, bulk

EXECUTION WORKFLOW:
1. DISCOVER: Use list_toolsets to see available toolset categories and their status
2. ENABLE: Use enable_toolset for required categories based on the user's query
3. VERIFY: Use list_tools to confirm the tools you need are available
4. EXECUTE: Call specific tools from enabled toolsets
5. CLEAN UP: Consider disabling unused toolsets when switching to different analysis types

FAILURE PROTOCOL:
If tools fail repeatedly or data is unavailable, state: "I cannot find the requested information with the available tools" and stop attempting.

Begin each analysis by enabling the appropriate toolsets for the user's request.
```

#### For Static Toolset Mode

```
You are an expert financial analyst AI with access to comprehensive market data tools.

CORE RULES:
- Always use tools for current market data; never rely on outdated information or estimates
- Check conversation history to avoid redundant tool calls
- Provide concise, data-driven responses
- Always include: "This is not financial advice"

STATIC TOOLSET CONFIGURATION:
Your tools are pre-loaded and immediately available. All configured toolsets remain active throughout the session.

EXECUTION WORKFLOW:
1. IDENTIFY: Determine which tools from your available toolsets best address the user's query
2. EXECUTE: Call the appropriate tools directly - no toolset management needed
3. ANALYZE: Process the data and provide insights based on the results

TOOL CATEGORIES:
Your available tools span multiple categories including company profiles, financial statements, market quotes, technical analysis, news sentiment, and economic indicators. Use the most relevant tools for each analysis.

FAILURE PROTOCOL:
If tools fail repeatedly or data is unavailable, state: "I cannot find the requested information with the available tools" and stop attempting.

Proceed directly to analysis using your available tools based on the user's request.
```

#### Usage Tips

- **Dynamic Mode**: Best for exploratory analysis where tool requirements change frequently. The AI assistant will manage toolsets based on the current task.
- **Static Mode**: Best for consistent, predictable workflows where the same types of analysis are performed repeatedly.
- **Legacy Mode**: Use the Static Mode prompt when all tools are pre-loaded (default configuration).

## Human-Friendly Capabilities Prompt

This server provides a human-friendly prompt to list capabilities in one shot.

- Name: `list_mcp_assets`
- Output sections: `Server Capabilities`, `Prompts`, `Tools` (mode-aware), `Resources` (health snapshot), `Quick Start`
- Exposed only as an MCP prompt (no tool alias)

### List assets via prompts

```bash
# 1) Initialize (example: dynamic mode session)
CONFIG_BASE64=$(echo -n '{"DYNAMIC_TOOL_DISCOVERY":"true"}' | base64)
curl -X POST "http://localhost:8080/mcp?config=${CONFIG_BASE64}" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": { "protocolVersion": "2024-11-05", "clientInfo": {"name": "client", "version": "1.0.0"}, "capabilities": {} }
  }'

# 2) List prompts
curl -X POST "http://localhost:8080/mcp?config=${CONFIG_BASE64}" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":2,"method":"prompts/list","params":{}}'

# 3) Get the capabilities prompt
curl -X POST "http://localhost:8080/mcp?config=${CONFIG_BASE64}" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":3,"method":"prompts/get","params":{"name":"list_mcp_assets","arguments":{}}}'
```

Notes:

- The `Tools` section adapts to the effective mode (Dynamic/Static/Legacy). In legacy mode, it summarizes categories instead of listing all 250+ tools.
- In Static mode, toolsets shown are the authoritative list from the server’s mode enforcer (single source of truth). Session `FMP_TOOL_SETS` may request Static mode, but server-level configuration controls the final toolsets.
- The `Resources` section includes a lightweight health snapshot (uptime, memory summary, version, mode).

## Making HTTP Requests

The server exposes a Model Context Protocol endpoint at `/mcp` that accepts JSON-RPC formatted requests. Each request can include optional session configuration via query parameters.

### Endpoint Format

```
POST http://localhost:8080/mcp[?config=BASE64_ENCODED_CONFIG]
```

### Required Headers

```http
Content-Type: application/json
Accept: application/json, text/event-stream
```

### Session Configuration

Session configurations are passed as Base64-encoded JSON in the `config` query parameter.

#### Connecting to Our Hosted Instance

When connecting to our hosted instance (via Smithery or directly), you **must** provide your FMP API key:

```bash
# Configuration: {"FMP_ACCESS_TOKEN":"your_fmp_api_key_here"}
CONFIG_BASE64=$(echo -n '{"FMP_ACCESS_TOKEN":"your_fmp_api_key_here"}' | base64)

# Make request to our hosted instance
curl -X POST "https://financial-modeling-prep-mcp-server-production.up.railway.app/mcp?config=${CONFIG_BASE64}" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","clientInfo":{"name":"client","version":"1.0.0"},"capabilities":{}}}'
```

**Note:** Our hosted instance runs in dynamic mode. Static/legacy mode configurations will be ignored.

#### Self-Hosting Configuration Examples

When self-hosting, you can use session-level configuration (if no server-level override is set):

**1. Dynamic Mode Session:**

```bash
# Configuration: {"DYNAMIC_TOOL_DISCOVERY":"true"}
CONFIG_BASE64=$(echo -n '{"DYNAMIC_TOOL_DISCOVERY":"true"}' | base64)
# Result: eyJEWU5BTUlDX1RPT0xfRElTQ09WRVJZIjoidHJ1ZSJ9
```

**2. Static Mode Session:**

```bash
# Configuration: {"FMP_TOOL_SETS":"search,company,quotes"}
CONFIG_BASE64=$(echo -n '{"FMP_TOOL_SETS":"search,company,quotes"}' | base64)
# Result: eyJGTVBfVE9PTF9TRVRTIjoic2VhcmNoLGNvbXBhbnkscXVvdGVzIn0=
```

**3. With API Key (if not set server-side):**

```bash
# Configuration: {"FMP_ACCESS_TOKEN":"your_key","DYNAMIC_TOOL_DISCOVERY":"true"}
CONFIG_BASE64=$(echo -n '{"FMP_ACCESS_TOKEN":"your_key","DYNAMIC_TOOL_DISCOVERY":"true"}' | base64)
```

**4. Legacy Mode Session:**

```bash
# Configuration: {} (empty object for default legacy mode)
CONFIG_BASE64=$(echo -n '{}' | base64)
# Result: e30=
```

### Request Examples

#### 1. Initialize a Dynamic Mode Session

```bash
CONFIG_BASE64=$(echo -n '{"DYNAMIC_TOOL_DISCOVERY":"true"}' | base64)
curl -X POST "http://localhost:8080/mcp?config=${CONFIG_BASE64}" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05",
      "clientInfo": {
        "name": "my-client",
        "version": "1.0.0"
      },
      "capabilities": {}
    }
  }'
```

**Expected Response:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2024-11-05",
    "capabilities": {
      "tools": {
        "listChanged": true
      }
    },
    "serverInfo": {
      "name": "fmp-mcp-server",
      "version": "1.0.0"
    }
  }
}
```

#### 2. List Available Tools

```bash
CONFIG_BASE64=$(echo -n '{"DYNAMIC_TOOL_DISCOVERY":"true"}' | base64)
curl -X POST "http://localhost:8080/mcp?config=${CONFIG_BASE64}" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/list",
    "params": {}
  }'
```

**Expected Response (Dynamic Mode):**

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "tools": [
      {
        "name": "enable_toolset",
        "description": "Enable a toolset by name",
        "inputSchema": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "description": "Toolset name"
            }
          },
          "required": ["name"]
        }
      },
      {
        "name": "disable_toolset",
        "description": "Disable a toolset by name (state only)"
      },
      {
        "name": "list_toolsets",
        "description": "List available toolsets with active status and definitions"
      },
      {
        "name": "describe_toolset",
        "description": "Describe a toolset with definition, active status and tools"
      },
      {
        "name": "list_tools",
        "description": "List currently registered tool names (best effort)"
      }
    ]
  }
}
```

#### 3. Enable a Toolset (Dynamic Mode)

```bash
CONFIG_BASE64=$(echo -n '{"DYNAMIC_TOOL_DISCOVERY":"true"}' | base64)
curl -X POST "http://localhost:8080/mcp?config=${CONFIG_BASE64}" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "enable_toolset",
      "arguments": {
        "toolset": "search"
      }
    }
  }'
```

#### 4. Call a Financial Tool

```bash
CONFIG_BASE64=$(echo -n '{"FMP_TOOL_SETS":"search,quotes"}' | base64)
curl -X POST "http://localhost:8080/mcp?config=${CONFIG_BASE64}" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 4,
    "method": "tools/call",
    "params": {
      "name": "searchSymbol",
      "arguments": {
        "query": "Apple"
      }
    }
  }'
```

#### 5. Get Stock Quote

```bash
CONFIG_BASE64=$(echo -n '{"FMP_TOOL_SETS":"quotes"}' | base64)
curl -X POST "http://localhost:8080/mcp?config=${CONFIG_BASE64}" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 5,
    "method": "tools/call",
    "params": {
      "name": "getQuote",
      "arguments": {
        "symbol": "AAPL"
      }
    }
  }'
```

### Session and Client Behavior

- **Session Persistence**: Each unique `config` parameter creates a separate session (SDK-managed)
- **Tool State**: In dynamic mode, enabled/disabled toolsets may be reused for the same `clientId` across requests
- **Isolation**: Sessions don't interfere with each other's tool configurations; caching is keyed by `clientId`
- **Caching**: Client storage (LRU + TTL) maintains one `McpServer`/`DynamicToolsetManager` per `clientId`

#### Cache Reuse Policy (Session-Config Aware)

- For the same `clientId` (derived from token), the server compares each request’s desired mode and static tool sets against the cached instance.
- If there is a difference and there is NO server-level mode enforcement, a new `McpServer` instance is created and the cache entry is replaced.
- If a server-level mode is enforced (via CLI/env), session-level changes are ignored and the cached instance is reused.
- Static tool set comparison is order-insensitive (e.g., `search,company` equals `company,search`).

### Error Handling

Common error responses:

```json
// Invalid configuration
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32000,
    "message": "Bad Request: Invalid configuration"
  },
  "id": null
}

// Tool not available
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32601,
    "message": "Tool not found: toolName"
  },
  "id": 1
}

// Missing required parameters
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32602,
    "message": "Missing required parameter: symbol"
  },
  "id": 2
}
```

## Available Tools

> **⚠️ Important: Mode Enforcement Behavior**
>
> **Server-Level Configurations Override Session Configurations:**
>
> - When CLI arguments (`--dynamic-tool-discovery`, `--fmp-tool-sets`) are used, they apply to **ALL** sessions
> - When environment variables (`DYNAMIC_TOOL_DISCOVERY`, `FMP_TOOL_SETS`) are set, they apply to **ALL** sessions
> - Session-level configurations via query parameters are **IGNORED** when server-level modes are active
> - This ensures consistent behavior across all sessions on a server instance
>
> **Configuration Precedence:** CLI Arguments > Environment Variables > Session Configuration
>
> **Example:** If server started with `--dynamic-tool-discovery`, ALL sessions will use dynamic mode even if they request `{"FMP_TOOL_SETS":"search,company"}` in their session config.

This MCP provides the following tools for AI assistants to access financial data:

### Search Tools

- **searchSymbol**: Search for stock symbols by name or ticker
- **searchName**: Search for companies by name
- **searchCIK**: Search for companies by CIK number
- **searchCUSIP**: Search for securities by CUSIP number
- **searchISIN**: Search for securities by ISIN number
- **stockScreener**: Screen stocks based on various criteria
- **searchExchangeVariants**: Search for symbol variants across different exchanges
- **searchCompaniesByName**: Search for companies by name
- **searchCompaniesBySymbol**: Search for companies by symbol
- **searchCompaniesByCIK**: Search for companies by CIK number

### Directory and Symbol Lists

- **getCompanySymbols**: Get a list of all company symbols
- **getFinancialStatementSymbols**: Get a list of companies with available financial statements
- **getCIKList**: Get a list of CIK numbers for SEC-registered entities
- **getSymbolChanges**: Get a list of stock symbol changes
- **getETFList**: Get a list of ETFs
- **getActivelyTradingList**: Get a list of actively trading companies
- **getEarningsTranscriptList**: Get a list of companies with earnings transcripts
- **getAvailableExchanges**: Get a list of available exchanges
- **getAvailableSectors**: Get a list of available sectors
- **getAvailableIndustries**: Get a list of available industries
- **getAvailableCountries**: Get a list of available countries
- **getAvailableTranscriptSymbols**: Get a list of symbols with available transcripts
- **getAllIndustryClassification**: Get all industry classifications
- **getIndustryClassificationList**: Get a list of industry classifications

### Company Information

- **getCompanyProfile**: Get detailed company profile information
- **getCompanyExecutives**: Get information about company executives
- **getCompanyDescription**: Get company description
- **getCompanyOutlook**: Get company outlook information
- **getCompanyRating**: Get company rating information
- **getHistoricalRating**: Get historical company ratings
- **getCompanyUpgradesDowngrades**: Get company upgrades and downgrades
- **getCompanyGrade**: Get company grade information
- **getCompanyPeers**: Get companies similar to a given company
- **getMarketCap**: Get company market capitalization
- **getHistoricalMarketCap**: Get historical market capitalization
- **getSharesFloat**: Get company shares float information
- **getHistoricalSharesFloat**: Get historical shares float information
- **getEarningsSurprises**: Get historical earnings surprises
- **getEarningCallTranscript**: Get specific earnings call transcript
- **getEarningCallTranscriptsBySymbol**: Get all earnings call transcripts for a symbol
- **getCompanyNotes**: Get company notes
- **getCompanyProfileByCIK**: Get company profile by CIK
- **getCompanySECProfile**: Get company SEC profile
- **getDelistedCompanies**: Get a list of delisted companies
- **getEmployeeCount**: Get employee count for a company
- **getHistoricalEmployeeCount**: Get historical employee count
- **getBatchMarketCap**: Get batch market cap data
- **getAllShareFloat**: Get all share float data
- **getLatestMergersAcquisitions**: Get latest mergers and acquisitions
- **searchMergersAcquisitions**: Search mergers and acquisitions
- **getExecutiveCompensation**: Get executive compensation data
- **getExecutiveCompensationBenchmark**: Get executive compensation benchmark data
- **getAcquisitionOwnership**: Get acquisition ownership data

### Financial Statements

- **getIncomeStatement**: Get company income statements
- **getBalanceSheet**: Get company balance sheet statements
- **getBalanceSheetStatement**: Get company balance sheet statements
- **getCashFlowStatement**: Get company cash flow statements
- **getIncomeStatementAsReported**: Get income statements as reported
- **getBalanceSheetAsReported**: Get balance sheet statements as reported
- **getBalanceSheetStatementAsReported**: Get balance sheet statements as reported
- **getCashFlowStatementAsReported**: Get cash flow statements as reported
- **getFullFinancialStatementAsReported**: Get full financial statements as reported
- **getFinancialStatementFullAsReported**: Get full financial statements as reported
- **getFinancialReportDates**: Get dates of available financial reports
- **getFinancialReportsDates**: Get dates of available financial reports
- **getLatestFinancialStatements**: Get latest financial statements
- **getIncomeStatementTTM**: Get trailing twelve months income statements
- **getBalanceSheetStatementTTM**: Get trailing twelve months balance sheet statements
- **getCashFlowStatementTTM**: Get trailing twelve months cash flow statements
- **getIncomeStatementGrowth**: Get income statement growth
- **getBalanceSheetStatementGrowth**: Get balance sheet statement growth
- **getCashFlowStatementGrowth**: Get cash flow statement growth
- **getFinancialStatementGrowth**: Get financial statement growth
- **getFinancialReportJSON**: Get financial report in JSON format
- **getFinancialReportXLSX**: Get financial report in XLSX format
- **getRevenueProductSegmentation**: Get revenue product segmentation
- **getRevenueGeographicSegmentation**: Get revenue geographic segmentation

### Financial Metrics and Analysis

- **getKeyMetrics**: Get key financial metrics for a company
- **getKeyMetricsTTM**: Get key metrics for trailing twelve months
- **getRatios**: Get financial ratios for a company
- **getFinancialRatios**: Get financial ratios for a company
- **getFinancialRatiosTTM**: Get financial ratios for trailing twelve months
- **getFinancialGrowth**: Get financial growth metrics
- **getIncomeStatementGrowth**: Get income statement growth metrics
- **getBalanceSheetGrowth**: Get balance sheet growth metrics
- **getCashFlowStatementGrowth**: Get cash flow statement growth metrics
- **getDCFValuation**: Get DCF (Discounted Cash Flow) valuation for a stock
- **getLeveredDCFValuation**: Get levered DCF valuation for a stock
- **calculateCustomDCF**: Calculate custom DCF valuation with user-defined parameters
- **calculateCustomLeveredDCF**: Calculate custom levered DCF valuation with user-defined parameters
- **getEnterpriseValue**: Get enterprise value for a company
- **getFinancialScore**: Get financial score for a company
- **getFinancialScores**: Get financial scores for a company
- **getOwnerEarnings**: Get owner earnings for a company

### Technical Indicators

- **getSMA**: Get Simple Moving Average (SMA) indicator
- **getEMA**: Get Exponential Moving Average (EMA) indicator
- **getWMA**: Get Weighted Moving Average (WMA) indicator
- **getDEMA**: Get Double Exponential Moving Average (DEMA) indicator
- **getTEMA**: Get Triple Exponential Moving Average (TEMA) indicator
- **getWilliams**: Get Williams %R indicator
- **getADX**: Get Average Directional Index (ADX) indicator
- **getStandardDeviation**: Get Standard Deviation indicator
- **getRSI**: Get Relative Strength Index (RSI) indicator

### Quotes and Price Data

- **getQuote**: Get current stock quote information
- **getBatchQuotes**: Get quotes for multiple symbols
- **getQuoteShort**: Get abbreviated stock quote information
- **getBatchQuotesShort**: Get abbreviated quotes for multiple symbols
- **getHistoricalPrice**: Get historical price data
- **getHistoricalPriceChart**: Get historical price chart data
- **getHistoricalDailyPrice**: Get historical daily price data
- **getHistoricalStockSplits**: Get historical stock splits
- **getHistoricalDividends**: Get historical dividends
- **getTechnicalIndicator**: Get technical indicators for a stock
- **getLightChart**: Get light version of price chart
- **getFullChart**: Get full version of price chart
- **getUnadjustedChart**: Get unadjusted price chart
- **getDividendAdjustedChart**: Get dividend-adjusted price chart
- **getIntradayChart**: Get intraday price chart
- **getAftermarketQuote**: Get aftermarket quote
- **getAftermarketTrade**: Get aftermarket trade data
- **getBatchAftermarketQuote**: Get batch aftermarket quotes
- **getBatchAftermarketTrade**: Get batch aftermarket trade data
- **getStockPriceChange**: Get stock price change information

### Market Indexes and Performance

- **getIndexList**: Get a list of all market indexes
- **getIndexQuotes**: Get quotes for market indexes
- **getIndexQuote**: Get quote for a specific index
- **getIndexShortQuote**: Get abbreviated quote for an index
- **getAllIndexQuotes**: Get quotes for all market indexes
- **getSP500Constituents**: Get S&P 500 constituent companies
- **getHistoricalSP500Changes**: Get historical S&P 500 changes
- **getNasdaqConstituents**: Get NASDAQ constituent companies
- **getDowJonesConstituents**: Get Dow Jones constituent companies
- **getHistoricalNasdaqChanges**: Get historical NASDAQ changes
- **getHistoricalDowJonesChanges**: Get historical Dow Jones changes
- **getSectorPerformance**: Get sector performance data
- **getHistoricalSectorPerformance**: Get historical sector performance
- **getBiggestGainers**: Get biggest gaining stocks
- **getBiggestLosers**: Get biggest losing stocks
- **getMostActiveStocks**: Get most active stocks
- **getHistoricalIndexFullChart**: Get historical index full chart
- **getHistoricalIndexLightChart**: Get historical index light chart
- **getIndex1MinuteData**: Get 1-minute index data
- **getIndex5MinuteData**: Get 5-minute index data
- **getIndex1HourData**: Get 1-hour index data
- **getSectorPerformanceSnapshot**: Get sector performance snapshot
- **getSectorPESnapshot**: Get sector PE ratio snapshot
- **getIndustryPerformanceSnapshot**: Get industry performance snapshot
- **getIndustryPerformanceSummary**: Get industry performance summary
- **getIndustryPESnapshot**: Get industry PE ratio snapshot
- **getHistoricalIndustryPerformance**: Get historical industry performance
- **getHistoricalIndustryPE**: Get historical industry PE ratios
- **getHistoricalSectorPE**: Get historical sector PE ratios

### Market Data

- **getMarketHours**: Get market hours for a specific exchange
- **getExchangeMarketHours**: Get market hours for a specific exchange
- **getHolidaysByExchange**: Get holidays for a specific exchange with optional date range filtering
- **getAllExchangeMarketHours**: Get market hours for all exchanges
- **getEarningsCalendar**: Get earnings announcement calendar
- **getIPOCalendar**: Get initial public offering calendar
- **getStockSplitCalendar**: Get stock split calendar
- **getDividendCalendar**: Get dividend calendar
- **getEconomicCalendar**: Get economic events calendar
- **getIPODisclosures**: Get IPO disclosures
- **getIPOProspectuses**: Get IPO prospectuses

### News and Press Releases

- **getFMPArticles**: Get financial news articles from FMP
- **getGeneralNews**: Get general financial news
- **getStockNews**: Get news for specific stocks
- **getStockNewsSentiment**: Get news with sentiment analysis
- **getPressReleases**: Get company press releases
- **searchStockNews**: Search stock news
- **searchPressReleases**: Search press releases
- **getCryptoNews**: Get cryptocurrency news
- **searchCryptoNews**: Search cryptocurrency news
- **getForexNews**: Get forex news
- **searchForexNews**: Search forex news

### SEC Filings

- **getLatestFinancialFilings**: Get latest financial filings
- **getFilingsBySymbol**: Get filings by symbol
- **getFilingsByCIK**: Get filings by CIK
- **getFilingsByFormType**: Get filings by form type
- **getLatest8KFilings**: Get latest 8-K filings
- **getSecFilingExtract**: Get SEC filing extract
- **getFilingExtractAnalyticsByHolder**: Get filing extract analytics by holder

### Insider and Institutional Trading

- **getInsiderTrading**: Get insider trading data
- **getInsiderRoster**: Get insider roster for a company
- **getInsiderRosterStatistics**: Get statistics on insider roster
- **getInsiderTransactionTypes**: Get types of insider transactions
- **getInsiderOwnership**: Get insider ownership information
- **getInstitutionalOwnership**: Get institutional ownership data
- **getInstitutionalHolders**: Get institutional holders for a company
- **getInstitutionalHoldersList**: Get list of institutional holders
- **getInstitutionalHolderPortfolioDates**: Get portfolio dates for institutional holders
- **get13FFilings**: Get 13F filings
- **get13FDates**: Get dates of 13F filings
- **getForm13FFilingDates**: Get 13F filing dates
- **getLatestInsiderTrading**: Get latest insider trading data
- **searchInsiderTrades**: Search insider trades
- **searchInsiderTradesByReportingName**: Search insider trades by reporting name
- **getInsiderTradeStatistics**: Get insider trade statistics
- **getLatestInstitutionalFilings**: Get latest institutional filings
- **getHolderPerformanceSummary**: Get holder performance summary
- **getHolderIndustryBreakdown**: Get holder industry breakdown
- **getPositionsSummary**: Get positions summary

### ETFs and Funds

- **getETFHolder**: Get ETF holder information
- **getETFSectorWeighting**: Get ETF sector weightings
- **getETFCountryWeighting**: Get ETF country weightings
- **getETFExposure**: Get ETF exposure to stocks
- **getFundInfo**: Get fund information
- **getFundHolder**: Get fund holder information
- **getFundSectorWeighting**: Get fund sector weightings
- **getFundHoldings**: Get fund holdings
- **getFundCountryAllocation**: Get fund country allocation
- **getFundAssetExposure**: Get fund asset exposure
- **getDisclosure**: Get latest fund disclosure holders information
- **getFundDisclosure**: Get comprehensive fund disclosure data by year/quarter
- **searchFundDisclosures**: Search fund disclosures by holder name
- **getFundDisclosureDates**: Get fund disclosure dates (with optional CIK)
- **getETFHoldersBulk**: Get ETF holders in bulk
- **getETFQuotes**: Get ETF quotes
- **getMutualFundQuotes**: Get mutual fund quotes

### Government Trading

- **getGovernmentTradingList**: Get government trading list
- **getSenateTrading**: Get senate trading data
- **getHouseTrading**: Get house trading data
- **getSenateTrades**: Get senate trades
- **getSenateTradesByName**: Get senate trades by name
- **getHouseTrades**: Get house trades
- **getHouseTradesByName**: Get house trades by name
- **getLatestSenateDisclosures**: Get latest senate disclosures
- **getLatestHouseDisclosures**: Get latest house disclosures

### Cryptocurrency and Forex

- **getCryptocurrencyList**: Get a list of cryptocurrencies
- **getCryptocurrencyQuote**: Get cryptocurrency quote
- **getCryptocurrencyShortQuote**: Get abbreviated cryptocurrency quote
- **getCryptocurrencyBatchQuotes**: Get quotes for multiple cryptocurrencies
- **getCryptocurrencyHistoricalLightChart**: Get light historical cryptocurrency chart
- **getCryptocurrencyHistoricalFullChart**: Get full historical cryptocurrency chart
- **getCryptocurrency1MinuteData**: Get 1-minute cryptocurrency data
- **getCryptocurrency5MinuteData**: Get 5-minute cryptocurrency data
- **getCryptocurrency1HourData**: Get 1-hour cryptocurrency data
- **getForexList**: Get a list of forex pairs
- **getForexQuote**: Get forex pair quote
- **getForexShortQuote**: Get abbreviated forex quote
- **getForexBatchQuotes**: Get quotes for multiple forex pairs with optional short format
- **getForexHistoricalLightChart**: Get light historical forex chart with optional date range
- **getForexHistoricalFullChart**: Get full historical forex chart with optional date range
- **getForex1MinuteData**: Get 1-minute forex data with optional date range
- **getForex5MinuteData**: Get 5-minute forex data with optional date range
- **getForex1HourData**: Get 1-hour forex data with optional date range

### Earnings

- **getEarningsReports**: Get earnings reports
- **getEarningsTranscript**: Get earnings transcript
- **getEarningsTranscriptDates**: Get earnings transcript dates
- **getLatestEarningsTranscripts**: Get latest earnings transcripts
- **getEarningsSurprisesBulk**: Get bulk earnings surprises

### Special Data Sets

- **getCOTList**: Get Commitment of Traders (COT) list
- **getCOTReports**: Get COT reports for a specific symbol with optional date range filtering
- **getCOTAnalysis**: Get COT analysis for a specific symbol with optional date range filtering
- **getGovernmentTradingList**: Get government trading list
- **getSenateTrading**: Get senate trading data
- **getHouseTrading**: Get house trading data
- **getESGDisclosures**: Get ESG disclosures for a specific symbol
- **getESGRatings**: Get ESG ratings for a specific symbol
- **getESGBenchmarks**: Get ESG benchmark data with optional year filtering

### Commodities

- **listCommodities**: Get a list of all available commodities with their symbols, names, exchanges, trade months, and currencies

### Economics

- **getTreasuryRates**: Get treasury rates with optional date range filtering
- **getEconomicIndicators**: Get economic indicators by name with optional date range filtering
- **getEconomicCalendar**: Get economic events calendar with optional date range filtering
- **getMarketRiskPremium**: Get market risk premium data

### Fundraisers

- **getLatestCrowdfundingCampaigns**: Get latest crowdfunding campaigns
- **searchCrowdfundingCampaigns**: Search crowdfunding campaigns
- **getCrowdfundingCampaignsByCIK**: Get crowdfunding campaigns by CIK
- **getLatestEquityOfferings**: Get latest equity offerings
- **searchEquityOfferings**: Search equity offerings
- **getEquityOfferingsByCIK**: Get equity offerings by CIK

### Bulk Data Tools

**Important Note**: All bulk endpoints return data in CSV format as raw strings rather than parsed JSON objects. This endpoint returns the response as a CSV file. The provided sample response represents an individual record. This design preserves the original FMP API format and provides better performance for large datasets.

- **getCompanyProfilesBulk**: Get bulk company profiles (CSV format)
- **getStockRatingsBulk**: Get bulk stock ratings (CSV format)
- **getDCFValuationsBulk**: Get bulk DCF valuations (CSV format)
- **getFinancialScoresBulk**: Get bulk financial scores (CSV format)
- **getPriceTargetSummariesBulk**: Get bulk price target summaries (CSV format)
- **getUpgradesDowngradesConsensusBulk**: Get bulk upgrades/downgrades consensus (CSV format)
- **getKeyMetricsTTMBulk**: Get bulk key metrics TTM (CSV format)
- **getRatiosTTMBulk**: Get bulk ratios TTM (CSV format)
- **getStockPeersBulk**: Get bulk stock peers (CSV format)
- **getEODDataBulk**: Get bulk end-of-day price data (CSV format)
- **getIncomeStatementsBulk**: Get bulk income statements (CSV format)
- **getIncomeStatementGrowthBulk**: Get bulk income statement growth data (CSV format)
- **getBalanceSheetStatementsBulk**: Get bulk balance sheet statements (CSV format)
- **getBalanceSheetGrowthBulk**: Get bulk balance sheet growth data (CSV format)
- **getCashFlowStatementsBulk**: Get bulk cash flow statements (CSV format)
- **getCashFlowGrowthBulk**: Get bulk cash flow growth data (CSV format)
- **getFinancialRatiosBulk**: Get bulk financial ratios (CSV format)
- **getKeyMetricsBulk**: Get bulk key metrics (CSV format)
- **getFinancialGrowthBulk**: Get bulk financial growth data (CSV format)

## Obtaining a Financial Modeling Prep Access Token

To get a Financial Modeling Prep access token:

1. Visit the [Financial Modeling Prep website](https://site.financialmodelingprep.com/)
2. Click on "Sign Up" to create an account
3. Verify your email address
4. After signing in, navigate to your Dashboard to find your API key
5. For more data access, consider upgrading to a paid plan (Starter, Premium, Ultimate, or Enterprise)

Financial Modeling Prep offers different pricing tiers with varying levels of data access and API call limits. For more information, visit the [FMP Pricing page](https://site.financialmodelingprep.com/pricing).

## Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Every pull request triggers a GitHub Actions workflow that verifies the build process.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/imbenrabi/Financial-Modeling-Prep-MCP-Server
cd Financial-Modeling-Prep-MCP-Server

# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode with your API key
FMP_ACCESS_TOKEN=your_api_key npm run dev

# Or specify the API key directly via CLI argument
npm run dev -- --fmp-token=your_api_key
```

The development server will start on port 8080 by default. You can configure the port using the PORT environment variable:

```bash
PORT=4000 FMP_ACCESS_TOKEN=your_api_key npm run dev
```

#### Development with Server-Level Mode Enforcement

**Server-Level Static Mode (All Sessions Use Specific Toolsets):**

```bash
# Environment variable approach
FMP_TOOL_SETS=search,company,quotes FMP_ACCESS_TOKEN=your_api_key npm run dev

# CLI argument approach (higher precedence)
npm run dev -- --fmp-token=your_api_key --fmp-tool-sets=search,company,quotes
```

**Server-Level Dynamic Mode (All Sessions Start with Meta-Tools):**

```bash
# Environment variable approach
DYNAMIC_TOOL_DISCOVERY=true FMP_ACCESS_TOKEN=your_api_key npm run dev

# CLI argument approach (higher precedence)
npm run dev -- --fmp-token=your_api_key --dynamic-tool-discovery
```

**Session-Level Configuration (Default - No Server Enforcement):**

```bash
# Start server without mode enforcement
npm run dev -- --fmp-token=your_api_key

# Individual sessions can then specify their own configurations via HTTP requests
```

#### Testing Different Configurations

When developing, you can test different configuration scenarios:

1. **Test Session-Level Configurations:**

```bash
# Start server without enforcement
npm run dev -- --fmp-token=your_api_key

# Test dynamic mode session
CONFIG_BASE64=$(echo -n '{"DYNAMIC_TOOL_DISCOVERY":"true"}' | base64)
curl -X POST "http://localhost:8080/mcp?config=${CONFIG_BASE64}" -d '...'

# Test static mode session
CONFIG_BASE64=$(echo -n '{"FMP_TOOL_SETS":"search,quotes"}' | base64)
curl -X POST "http://localhost:8080/mcp?config=${CONFIG_BASE64}" -d '...'
```

2. **Test Server-Level Enforcement:**

```bash
# Start with server-level dynamic mode
npm run dev -- --fmp-token=your_api_key --dynamic-tool-discovery

# ALL sessions will use dynamic mode regardless of session config
curl -X POST "http://localhost:8080/mcp?config=${CONFIG_BASE64}" -d '...'
```

### Running Tests

The project uses Vitest for testing. You can run tests in several ways:

```bash
# Run tests in watch mode (for development)
npm test

# Run tests once
npm run test:run

# Run tests with coverage report
npm run test:coverage
```

The coverage report will be generated in the `coverage/` directory and displayed in the terminal. You can open `coverage/index.html` in your browser to view a detailed HTML coverage report.

## Issues and Bug Reports

If you encounter any bugs, have feature requests, or need help with the project, please open an issue on GitHub:

**[📝 Open an Issue](https://github.com/imbenrabi/Financial-Modeling-Prep-MCP-Server/issues)**

When reporting issues, please include:

- A clear description of the problem or feature request
- Steps to reproduce the issue (if applicable)
- Your environment details (Node.js version, operating system)
- Any relevant error messages or logs
- Expected vs. actual behavior

This helps us understand and resolve issues more quickly.

## License

This project is licensed under [Apache License Version 2.0](http://www.apache.org/licenses/LICENSE-2.0)
