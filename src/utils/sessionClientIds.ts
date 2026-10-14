import type { ServerResponse } from 'node:http';

const SESSION_ID_HEADER = 'mcp-session-id';
const DEFAULT_MAX_ENTRIES = 1000;

/**
 * Remembers which auto-generated `mcp-client-id` opened each MCP session.
 *
 * Toolception finds a session through the client ID, and the auto-generated ID hashes the
 * request IP. Behind a reverse proxy the IP is whichever proxy hop forwarded the request, so
 * later requests of one session can hash to a different ID and get "Session not found".
 * Looking the ID up by `mcp-session-id` keeps every request of a session on one client ID.
 *
 * Bounded: once full, the least recently used session is forgotten, and its requests fall
 * back to the IP-based fingerprint.
 */
export class SessionClientIds {
  readonly #clientIds = new Map<string, string>();
  readonly #maxEntries: number;

  /**
   * @param maxEntries - How many sessions to remember before forgetting the least recently used.
   */
  constructor(maxEntries: number = DEFAULT_MAX_ENTRIES) {
    this.#maxEntries = maxEntries;
  }

  /**
   * Returns the client ID that opened a session, and marks the session as recently used.
   * @param sessionId - The `mcp-session-id` the request carries.
   * @returns The client ID recorded for the session, or `undefined` if none is known.
   */
  get(sessionId: string): string | undefined {
    const clientId = this.#clientIds.get(sessionId);
    if (clientId !== undefined) {
      this.#clientIds.delete(sessionId);
      this.#clientIds.set(sessionId, clientId);
    }
    return clientId;
  }

  /**
   * Records the client ID that opened a session.
   * @param sessionId - The `mcp-session-id` the server issued.
   * @param clientId - The client ID the session's `initialize` request carried.
   */
  set(sessionId: string, clientId: string): void {
    this.#clientIds.delete(sessionId);
    if (this.#clientIds.size >= this.#maxEntries) {
      this.#forgetLeastRecentlyUsed();
    }
    this.#clientIds.set(sessionId, clientId);
  }

  /**
   * Drops the session that was used least recently.
   */
  #forgetLeastRecentlyUsed(): void {
    const oldest = this.#clientIds.keys().next();
    if (!oldest.done) {
      this.#clientIds.delete(oldest.value);
    }
  }
}

/**
 * Reads the `mcp-session-id` header from the arguments of a `writeHead` call.
 * @param res - The response being written.
 * @param args - The arguments passed to `writeHead`.
 * @returns The session ID, or `undefined` if the response carries none.
 */
function readSessionIdHeader(res: ServerResponse, args: readonly unknown[]): string | undefined {
  const headers = args.find(
    (arg): arg is Record<string, unknown> => typeof arg === 'object' && arg !== null && !Array.isArray(arg)
  );
  const sessionId = headers?.[SESSION_ID_HEADER] ?? res.getHeader(SESSION_ID_HEADER);
  return typeof sessionId === 'string' ? sessionId : undefined;
}

/**
 * Calls back with the `mcp-session-id` a response issues, once its headers are written.
 *
 * The MCP SDK transport writes the session ID straight to the raw Node response via
 * `writeHead`, so Fastify reply hooks never see it.
 * @param res - The raw response of an `initialize` request.
 * @param onSessionId - Receives the issued session ID.
 */
export function onSessionIdIssued(res: ServerResponse, onSessionId: (sessionId: string) => void): void {
  const writeHead = res.writeHead;
  res.writeHead = function (this: ServerResponse, ...args: unknown[]): ServerResponse {
    const sessionId = readSessionIdHeader(this, args);
    if (sessionId !== undefined) {
      onSessionId(sessionId);
    }
    return writeHead.apply(this, args as Parameters<ServerResponse['writeHead']>);
  } as ServerResponse['writeHead'];
}
