import { describe, it, expect, vi, afterEach } from 'vitest';
import { showHelp } from '../../../src/utils/showHelp.js';
import { getAvailableToolSets } from '../../../src/constants/index.js';

function captureHelp(): string {
  const log = vi.spyOn(console, 'log').mockImplementation(() => {});
  showHelp(getAvailableToolSets());
  return log.mock.calls.map((call) => call.join(' ')).join('\n');
}

describe('showHelp', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('names the five meta-tools of dynamic mode', () => {
    expect(captureHelp()).toContain('Starts with 5 meta-tools');
  });

  it('lets a session token beat the server token, as createModuleAdapter does', () => {
    const help = captureHelp();
    const session = help.indexOf('Session configuration (?config= on the /mcp URL)');
    const cli = help.indexOf('CLI argument (--fmp-token)');
    const env = help.indexOf('Environment variable (FMP_ACCESS_TOKEN)');

    expect(session).toBeGreaterThan(-1);
    expect(session).toBeLessThan(cli);
    expect(cli).toBeLessThan(env);
    expect(help).not.toContain('override ALL session-level');
  });
});
