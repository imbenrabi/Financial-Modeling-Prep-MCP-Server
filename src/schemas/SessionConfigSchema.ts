import { z } from "zod";

/**
 * Zod schema for session configuration used by the stateful server.
 * Note: Token optionality and descriptions may be adapted in a subsequent step.
 */
export const SessionConfigSchema = z.object({
  FMP_ACCESS_TOKEN: z
    .string()
    .optional()
    .describe(
      "Financial Modeling Prep API access token. Optional for server initialization; required to successfully call FMP-backed tools."
    ),
  FMP_TOOL_SETS: z
    .string()
    .optional()
    .describe(
      "Comma-separated list of tool sets to load (e.g., 'search,company,quotes'). If not specified, all tools will be loaded."
    ),
  DYNAMIC_TOOL_DISCOVERY: z
    .string()
    .optional()
    .describe(
      "Enable dynamic toolset management. Set to 'true' to use meta-tools for runtime toolset loading. Default is 'false'."
    ),
});

export type SessionConfigInput = z.infer<typeof SessionConfigSchema>;


