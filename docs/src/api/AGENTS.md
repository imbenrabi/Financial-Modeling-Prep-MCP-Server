# API Layer

## Key Rules

- API key ALWAYS goes as the `apikey` query parameter — `FMPClient` adds it in `get`, `getCSV` and `post`; never move it into headers
- Token precedence for API calls: constructor token > `FMP_ACCESS_TOKEN` env read at call time. Both the server-level and the session token arrive via the constructor, so a token is fixed per loaded client, not per request (session-vs-server order: [adapters FLOW](../toolception-adapters/FLOW.md))

## Anti-patterns

- Never assume HTTP status indicates success — `FMPClient` returns `response.data` unparsed on any 2xx, so a 200 carrying an error payload is returned as success
- Never log or serialize a caught client error object — `FMPClient` rethrows with the `AxiosError` as `cause`, and its request config holds the `apikey` param, so `console.error(err)` or `util.inspect(err)` prints the user's key. Log `err.message` only

## Pitfalls

- A missing key does not surface as a synchronous throw: `getApiKey()` throws inside each method's `try`, so callers get a rejected promise with `Unexpected error: FMP_ACCESS_TOKEN is required...` (not the `FMP API Error:` prefix)
- Error text for a failed response comes from the body key `"Error Message"`, then `message`, then the Axios message
- Bulk endpoints use `getCSV` (`responseType: 'text'`); the tools then `JSON.stringify` that string, so clients receive a quoted, escaped CSV
