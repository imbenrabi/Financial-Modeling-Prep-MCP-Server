# Installation

## Prerequisites

- Node.js >= 25.3.0
- npm >= 11.11.0
- A Financial Modeling Prep API key

## NPM (Recommended)

Install globally and run:

    npm install -g financial-modeling-prep-mcp-server
    fmp-mcp --fmp-token=YOUR_FMP_API_KEY

Or use npx without installing:

    npx financial-modeling-prep-mcp-server --fmp-token=YOUR_FMP_API_KEY

With options:

    # Custom port
    fmp-mcp --fmp-token=YOUR_KEY --port=4000

    # Dynamic mode
    fmp-mcp --fmp-token=YOUR_KEY --dynamic-tool-discovery

    # Static mode with specific toolsets
    fmp-mcp --fmp-token=YOUR_KEY --fmp-tool-sets=search,company,quotes

## Docker

Build from source:

    git clone https://github.com/imbenrabi/Financial-Modeling-Prep-MCP-Server.git
    cd Financial-Modeling-Prep-MCP-Server
    docker build -t fmp-mcp-server .
    docker run -p 8080:8080 -e FMP_ACCESS_TOKEN=YOUR_KEY fmp-mcp-server

Docker Compose example:

    services:
      fmp-mcp:
        build: .
        ports:
          - "8080:8080"
        environment:
          - FMP_ACCESS_TOKEN=YOUR_KEY
          - PORT=8080
          - DYNAMIC_TOOL_DISCOVERY=true
        restart: unless-stopped
        healthcheck:
          test: ["CMD", "curl", "-f", "http://localhost:8080/healthz"]
          interval: 30s
          timeout: 10s
          retries: 3

## From Source

    git clone https://github.com/imbenrabi/Financial-Modeling-Prep-MCP-Server.git
    cd Financial-Modeling-Prep-MCP-Server
    npm install
    npm run build
    npm start -- --fmp-token=YOUR_KEY

Development mode:

    npm run dev -- --fmp-token=YOUR_KEY

## Verification

Check the server is running:

    curl http://localhost:8080/healthz

Expected: {"status":"ok"}

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port already in use | PORT=4000 fmp-mcp --fmp-token=YOUR_KEY |
| Invalid API token | Verify at financialmodelingprep.com/developer/docs |
| Memory issues with all tools | Use --dynamic-tool-discovery or --fmp-tool-sets |
