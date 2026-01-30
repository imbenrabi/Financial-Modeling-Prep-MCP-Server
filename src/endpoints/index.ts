/**
 * Custom HTTP endpoints for the MCP server
 *
 * These endpoints are registered alongside the main MCP protocol endpoint.
 */

export { pingEndpoint } from './ping.js';
export { healthCheckEndpoint } from './healthcheck.js';
export { serverCardEndpoint } from './server-card.js';
