# API Layer

## Key Rules

- API key ALWAYS goes as `?apikey=` query parameter — never in headers (FMP API requirement)
- Token precedence for API calls: Context > Instance > Environment (session can override server token)

## Anti-patterns

- Never put API key in Authorization header — FMP API will reject it
- Never assume HTTP status indicates success — the code does not parse FMP error bodies, so a 200 response containing an error payload will be returned as success

## Pitfalls

- Missing API key throws synchronously from `getApiKey()` — not a rejected promise
- FMP error bodies use the key `"Error Message"`; `FMPClient` reads that first, then falls back to `response.data.message`, then to the Axios error message
