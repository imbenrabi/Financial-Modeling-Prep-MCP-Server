import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TipRanksClient } from '../../../../src/api/tipranks/TipRanksClient.js';
import { FMPClient } from '../../../../src/api/FMPClient.js';

vi.mock('../FMPClient.js');

describe('TipRanksClient', () => {
  let client: TipRanksClient;
  let mockGet: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockGet = vi.fn().mockResolvedValue([]);
    (FMPClient.prototype as any).get = mockGet;
    client = new TipRanksClient('test-api-key');
  });

  it('searchAnalystRatings passes its filters', async () => {
    await client.searchAnalystRatings({
      symbol: 'AAPL',
      expertUID: 'abc',
      from: '2026-01-01',
      to: '2026-03-31',
      nonadjusted: true,
      limit: 10,
      page: 1,
    });

    expect(mockGet).toHaveBeenCalledWith('/tipranks-search', {
      symbol: 'AAPL',
      expertUID: 'abc',
      from: '2026-01-01',
      to: '2026-03-31',
      nonadjusted: true,
      limit: 10,
      page: 1,
    });
  });

  it('searchAnalystRatings works without filters', async () => {
    await client.searchAnalystRatings();

    expect(mockGet).toHaveBeenCalledWith('/tipranks-search', {});
  });

  it('getPointInTimeBySymbol passes the symbol and as-of date', async () => {
    await client.getPointInTimeBySymbol('AAPL', { date: '2026-06-30', nonadjusted: true });

    expect(mockGet).toHaveBeenCalledWith('/tipranks-pit-symbol', {
      symbol: 'AAPL',
      date: '2026-06-30',
      nonadjusted: true,
    });
  });

  it('getPointInTimeByAnalyst passes the expertUID', async () => {
    await client.getPointInTimeByAnalyst('abc', { limit: 5 });

    expect(mockGet).toHaveBeenCalledWith('/tipranks-pit-analyst', { expertUID: 'abc', limit: 5 });
  });

  it.each([
    ['getSymbolSummary', '/tipranks-symbol-summary', 'symbol', 'AAPL'],
    ['getAnalystSummary', '/tipranks-analyst-summary', 'expertUID', 'abc'],
    ['getFirmSummary', '/tipranks-firm-summary', 'firmName', 'Morgan Stanley'],
  ] as const)('%s passes its key and date window', async (method, path, key, value) => {
    await client[method](value, { from: '2026-01-01', to: '2026-03-31' });

    expect(mockGet).toHaveBeenCalledWith(path, { [key]: value, from: '2026-01-01', to: '2026-03-31' });
  });

  it('lookupAnalyst passes the analyst name', async () => {
    await client.lookupAnalyst('Andrew Marok');

    expect(mockGet).toHaveBeenCalledWith('/tipranks-analysts', { analystName: 'Andrew Marok' });
  });

  it('propagates API errors', async () => {
    mockGet.mockRejectedValue(new Error('API Error'));

    await expect(client.lookupAnalyst('x')).rejects.toThrow('API Error');
  });
});
