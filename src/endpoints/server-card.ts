import { defineEndpoint } from 'toolception';
import { z } from 'zod';
import { getServerVersion } from '../utils/getServerVersion.js';

/**
 * MCP Server Card endpoint for Smithery/registry discovery (SEP-1649)
 *
 * This endpoint provides static metadata about the server's capabilities,
 * configuration schema, and available tools. This prevents Smithery from
 * needing to scan the stateful server, which would fail due to session
 * management requirements.
 *
 * @see https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1649
 * @see https://smithery.ai/docs/build/publish
 */
export const serverCardEndpoint = defineEndpoint({
  method: 'GET',
  path: '/.well-known/mcp/server-card.json',
  responseSchema: z.object({
    $schema: z.string(),
    version: z.string(),
    protocolVersion: z.string(),
    serverInfo: z.object({
      name: z.string(),
      title: z.string().optional(),
      version: z.string(),
      description: z.string().optional(),
      iconUrl: z.string().optional(),
      documentationUrl: z.string().optional(),
    }),
    configSchema: z.object({
      type: z.string(),
      properties: z.record(z.any()),
      required: z.array(z.string()).optional(),
    }).optional(),
    tools: z.array(z.object({
      name: z.string(),
      description: z.string(),
      inputSchema: z.record(z.any()),
    })).optional(),
    resources: z.array(z.any()).optional(),
    prompts: z.array(z.any()).optional(),
  }),
  handler: async () => ({
    $schema: 'https://modelcontextprotocol.io/schemas/server-card/1.0',
    version: '1.0',
    protocolVersion: '2025-11-25',
    serverInfo: {
      name: 'financial-modeling-prep-mcp-server',
      title: 'Financial Modeling Prep MCP Server',
      version: getServerVersion(),
      description: 'MCP server providing 250+ financial data tools using meta tools via Financial Modeling Prep API',
      documentationUrl: 'https://github.com/imbenrabi/Financial-Modeling-Prep-MCP-Server',
    },
    // Session configuration schema for Smithery UI
    // Note: Config is passed as base64-encoded JSON in the 'config' query parameter
    configSchema: {
      type: 'object',
      properties: {
        FMP_ACCESS_TOKEN: {
          type: 'string',
          title: 'FMP API Key',
          description: 'Your Financial Modeling Prep API access token (required)',
        },
        DYNAMIC_TOOL_DISCOVERY: {
          type: 'string',
          title: 'Dynamic Tool Discovery',
          description: 'Enable dynamic toolset management: "true" for meta-tools only, "false" for all tools',
          default: 'true',
        },
        FMP_TOOL_SETS: {
          type: 'string',
          title: 'Tool Sets',
          description: 'Comma-separated list of tool sets to load (e.g., "search,company,quotes"). Only used when DYNAMIC_TOOL_DISCOVERY is false.',
        },
      },
      required: ['FMP_ACCESS_TOKEN'],
    },
    // Meta-tools available in DYNAMIC mode (default)
    // When DYNAMIC_TOOL_DISCOVERY=true, only these 5 meta-tools are exposed initially.
    // Use enable_toolset to load specific toolsets on demand.
    tools: [
      {
        name: 'enable_toolset',
        description: 'Enable a toolset by name to make its tools available',
        inputSchema: {
          type: 'object',
          properties: {
            toolset: {
              type: 'string',
              description: 'Name of the toolset to enable (e.g., "search", "company", "quotes")',
            },
          },
          required: ['toolset'],
        },
      },
      {
        name: 'disable_toolset',
        description: 'Disable a toolset by name (state tracking only)',
        inputSchema: {
          type: 'object',
          properties: {
            toolset: {
              type: 'string',
              description: 'Name of the toolset to disable',
            },
          },
          required: ['toolset'],
        },
      },
      {
        name: 'list_toolsets',
        description: 'List all available toolsets with their active status and definitions',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'describe_toolset',
        description: 'Describe a toolset with its definition, active status, and tools',
        inputSchema: {
          type: 'object',
          properties: {
            toolset: {
              type: 'string',
              description: 'Name of the toolset to describe',
            },
          },
          required: ['toolset'],
        },
      },
      {
        name: 'list_tools',
        description: 'List currently registered tool names',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
    resources: [],
    prompts: [],
  })
});
