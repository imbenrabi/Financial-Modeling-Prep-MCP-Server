# Smoke Tests

Integration tests that spawn the full server as a child process and exercise MCP protocol over HTTP.

## Key Rules

- Always run `npm run build` before smoke tests — they execute `dist/index.js`, not `src/`
- Always call `resetSession()` between tests — `clientId` and `sessionId` are global module state

## Anti-patterns

- Never rely on axios throwing on HTTP errors — `validateStatus: () => true` accepts all status codes
- Never parse `response.data` directly as JSON — MCP responses use SSE format (`event: message\ndata: {json}`)
