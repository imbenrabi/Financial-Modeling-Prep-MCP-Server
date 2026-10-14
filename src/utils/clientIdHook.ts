import { createHash } from 'node:crypto';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import { SessionClientIds, onSessionIdIssued } from './sessionClientIds.js';

/**
 * Generate a stable client ID from request properties when mcp-client-id header is missing.
 * This fixes issues with MCP clients (like Glama, Smithery) that don't send the header.
 *
 * Uses a hash of: IP address + User-Agent
 * This provides reasonable stability across requests from the same client.
 * Note: Accept header is intentionally excluded as it can vary between requests.
 * @param ip - The request's source IP.
 * @param userAgent - The request's User-Agent header.
 * @returns The client ID, `auto-` followed by 16 hex characters.
 */
function generateStableClientId(ip: string, userAgent: string): string {
  const fingerprint = `${ip}|${userAgent}`;
  const hash = createHash('sha256').update(fingerprint).digest('hex').slice(0, 16);
  return `auto-${hash}`;
}

/**
 * Checks whether a request already carries a non-blank `mcp-client-id` header.
 * @param request - The incoming request.
 * @returns `true` if the client sent its own client ID.
 */
function hasClientId(request: FastifyRequest): boolean {
  const existingClientId = request.headers['mcp-client-id'];
  return Boolean(existingClientId) && !(typeof existingClientId === 'string' && existingClientId.trim() === '');
}

/**
 * Derives the fingerprint client ID for a request from its IP and User-Agent.
 * @param request - The incoming request.
 * @returns The fingerprint client ID.
 */
function fingerprintClientId(request: FastifyRequest): string {
  const ip = request.ip || request.headers['x-forwarded-for'] || 'unknown';
  const userAgent = request.headers['user-agent'] || '';

  return generateStableClientId(
    typeof ip === 'string' ? ip : Array.isArray(ip) ? ip[0] : 'unknown',
    typeof userAgent === 'string' ? userAgent : ''
  );
}

/**
 * Creates the Fastify `preHandler` hook that fills in a missing `mcp-client-id`, which
 * toolception requires on every `/mcp` request.
 *
 * A request of a known session gets the client ID the session's `initialize` was given.
 * Any other request gets the IP + User-Agent fingerprint, and an `initialize` records the
 * session it opens under that ID.
 * @param sessionClientIds - Where the client ID of each session is recorded.
 * @returns The hook to register with `app.addHook('preHandler', ...)`.
 */
export function createClientIdHook(
  sessionClientIds: SessionClientIds = new SessionClientIds()
): (request: FastifyRequest, reply: FastifyReply) => Promise<void> {
  return async (request, reply) => {
    if (hasClientId(request)) {
      return;
    }

    // Behind a proxy the IP can change between requests of one session, so reuse the
    // client ID the session was opened with instead of re-hashing this request's IP
    const sessionId = request.headers['mcp-session-id'];
    const sessionClientId = typeof sessionId === 'string' ? sessionClientIds.get(sessionId) : undefined;
    if (sessionClientId) {
      request.headers['mcp-client-id'] = sessionClientId;
      return;
    }

    const stableId = fingerprintClientId(request);

    // Inject the header so toolception sees it
    request.headers['mcp-client-id'] = stableId;

    if (request.method === 'POST' && sessionId === undefined && isInitializeRequest(request.body)) {
      onSessionIdIssued(reply.raw, (issuedSessionId) => sessionClientIds.set(issuedSessionId, stableId));
    }

    // Log for debugging - same stableId will appear for requests from same client
    console.log(`[FMP MCP Server] Auto-generated mcp-client-id: ${stableId} for client without header`);
  };
}
