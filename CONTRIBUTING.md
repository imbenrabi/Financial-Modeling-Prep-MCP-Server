# Contributing

## Prerequisites

- Node.js >= 25.3.0
- npm >= 11.11.0

## Setup

```bash
git clone https://github.com/imbenrabi/Financial-Modeling-Prep-MCP-Server
cd Financial-Modeling-Prep-MCP-Server
npm install
npm run build
```

## Development

| Command | Purpose |
|---|---|
| `npm run dev` | Watch mode (tsx watch) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled server |

## Testing

| Command | Purpose |
|---|---|
| `npm run test:run` | Run unit tests (Vitest) |
| `npm run typecheck` | TypeScript check without emit |
| `npm run test` | Vitest watch mode |

## Before Submitting

1. `npm run build`
2. `npm run test:run`
3. `npm run typecheck`

## Version Sync

Keep `package.json`, `server.json`, and other tracked files in sync:

- `npm run version:validate` — check versions match
- `npm run version:sync` — bump and sync versions

## Project Structure

| Directory | Contents |
|---|---|
| `src/api` | HTTP clients |
| `src/tools` | MCP tool registrations |
| `src/toolception-adapters` | Framework integration |
| `src/server-mode-enforcer` | Mode configuration |
| `src/constants` | Tool sets and defaults |
| `src/endpoints` | HTTP endpoints |
| `src/prompts` | MCP prompts |

## License

Apache-2.0
