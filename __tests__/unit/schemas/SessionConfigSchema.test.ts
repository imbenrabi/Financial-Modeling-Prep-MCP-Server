import { describe, it, expect } from 'vitest';
import { SessionConfigSchema } from '../../../src/schemas/session/SessionConfigSchema.js';
import { QuotesClient } from '../../../src/api/quotes/QuotesClient.js';
import type { FMPContext } from '../../../src/types/index.js';

describe('SessionConfigSchema', () => {
  it('accepts configuration without FMP_ACCESS_TOKEN', () => {
    const parsed = SessionConfigSchema.parse({});
    expect(parsed).toBeDefined();
    expect(parsed.FMP_ACCESS_TOKEN).toBeUndefined();
  });

  it('accepts configuration with optional fields', () => {
    const parsed = SessionConfigSchema.parse({
      FMP_TOOL_SETS: 'search,quotes',
      DYNAMIC_TOOL_DISCOVERY: 'true',
    });
    expect(parsed.FMP_TOOL_SETS).toBe('search,quotes');
    expect(parsed.DYNAMIC_TOOL_DISCOVERY).toBe('true');
  });
});

describe('FMP token requirement at call time', () => {
  it('throws when calling a client operation without a token', async () => {
    const client = new QuotesClient();
    const context: FMPContext = { config: {} };
    await expect(
      client.getQuote({ symbol: 'AAPL' }, { context })
    ).rejects.toThrow(/FMP_ACCESS_TOKEN is required/);
  });
});


