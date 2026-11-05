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
| `npm run lint` | Lint with Oxlint (warnings fail) |
| `npm run knip` | Find unused exports and dependencies |
| `npm run test` | Vitest watch mode |

The smoke tests start the compiled server, so run `npm run build` before `npm run test:run`.

## Before Submitting

1. `npm run build`
2. `npm run typecheck`
3. `npm run lint`
4. `npm run test:run`

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
| `src/utils` | Version, validation and help helpers |

Each area has a short note on its pitfalls under `docs/src/`, indexed in [`AGENTS.md`](AGENTS.md). Step-by-step guides for adding a tool, module or tool set are in [`docs/GUIDE.md`](docs/GUIDE.md).

## License

Apache-2.0
