import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { inspect } from 'node:util';
import axios, { AxiosError } from 'axios';
import { registerStatementsTools } from '../../../src/tools/statements.js';

vi.mock('axios', async (importOriginal) => {
  const actual = await importOriginal<typeof import('axios')>();
  return { ...actual, default: { ...actual.default, create: vi.fn() } };
});

const API_KEY = 'SECRET_TEST_KEY_123';

type Handler = (args: Record<string, unknown>) => Promise<{
  isError?: boolean;
  content: { text: string }[];
}>;

describe('statements tools error logging', () => {
  const handlers = new Map<string, Handler>();
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    handlers.clear();

    // Mirror what a failed FMP request carries: the key sits in the request URL
    const url = `https://financialmodelingprep.com/stable/x?symbol=AAPL&apikey=${API_KEY}`;
    const axiosError = new AxiosError(
      'Request failed with status code 500',
      'ERR_BAD_RESPONSE',
      { url, params: { apikey: API_KEY } } as never,
      { _header: `GET ${url} HTTP/1.1`, path: url }
    );
    const rejecting = vi.fn().mockRejectedValue(axiosError);
    vi.mocked(axios.create).mockReturnValue({ get: rejecting, post: rejecting } as never);

    const server = {
      tool: (name: string, _desc: string, _schema: unknown, handler: Handler) => {
        handlers.set(name, handler);
      },
    };
    registerStatementsTools(server as never, API_KEY);

    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  it('registers handlers to check', () => {
    expect(handlers.size).toBeGreaterThan(0);
  });

  it('never writes the API key to the log when a client call fails', async () => {
    for (const [name, handler] of handlers) {
      errorSpy.mockClear();

      const result = await handler({ symbol: 'AAPL', year: 2023, period: 'FY' });

      expect(result.isError, name).toBe(true);
      expect(result.content[0].text, name).not.toContain(API_KEY);
      for (const call of errorSpy.mock.calls) {
        expect(inspect(call, { depth: null }), name).not.toContain(API_KEY);
      }
    }
  });
});
