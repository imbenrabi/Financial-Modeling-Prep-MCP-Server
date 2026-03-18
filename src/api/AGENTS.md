# API Layer

HTTP clients for Financial Modeling Prep API. All clients extend FMPClient base class.

## Key Rules

- API key ALWAYS goes as `?apikey=` query parameter — never in headers (FMP API requirement)
- Token precedence: Context > Instance > Environment (session can override server token)

## Anti-patterns

- Never put API key in Authorization header — FMP API will reject it
- Never assume HTTP status indicates error — FMP returns errors in response body with 200 status

## Pitfalls

- Missing API key throws synchronously from `getApiKey()` — not a rejected promise
- `response.data.message` contains FMP error details, not `error.message`
