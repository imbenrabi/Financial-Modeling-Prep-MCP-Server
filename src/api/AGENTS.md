# API Layer

HTTP clients for the Financial Modeling Prep API. All clients extend `FMPClient` base class.

## Architecture

```
FMPClient (base)
├── AnalystClient
├── BulkClient
├── CalendarClient
├── ChartClient
├── CommodityClient
├── CompanyClient
├── CotClient
├── CryptoClient
├── DcfClient
├── DirectoryClient
├── EarningsTranscriptClient
├── EconomicsClient
├── EsgClient
├── ForexClient
├── Form13FClient
├── FundClient
├── FundraisersClient
├── GovernmentTradingClient
├── IndexesClient
├── InsiderTradesClient
├── MarketHoursClient
├── MarketPerformanceClient
├── NewsClient
├── QuotesClient
├── SearchClient
├── SecFilingsClient
├── StatementsClient
└── TechnicalIndicatorsClient
```

## FMPClient Base Class

Location: `FMPClient.ts`

```typescript
class FMPClient {
  private readonly apiKey?: string;
  private readonly baseUrl = "https://financialmodelingprep.com/stable";

  constructor(apiKey?: string)

  protected async get<T>(endpoint, params?, options?): Promise<T>
  protected async getCSV(endpoint, params?, options?): Promise<string>
  protected async post<T>(endpoint, data, params?, options?): Promise<T>
}
```

## API Key Resolution

**Three-tier fallback (highest to lowest priority):**

```typescript
// 1. Context-provided key (per-request override)
context?.config?.FMP_ACCESS_TOKEN

// 2. Constructor parameter (instance-level)
this.apiKey

// 3. Environment variable (global fallback)
process.env.FMP_ACCESS_TOKEN
```

Throws error if none available.

## Critical Invariant

**API key is ALWAYS passed as a query parameter, never in headers:**

```typescript
// Correct (how FMP API works)
GET /stable/profile/AAPL?apikey=YOUR_KEY

// Wrong (would fail)
GET /stable/profile/AAPL
Authorization: Bearer YOUR_KEY
```

This is enforced in `FMPClient.get()` which appends `apikey` to params.

## Method Signatures

All client methods follow this pattern:

```typescript
async methodName(
  requiredParam: string,
  optionalParam?: number,
  options?: {
    signal?: AbortSignal;      // Request cancellation
    context?: FMPContext;      // Per-request API key override
  }
): Promise<ResponseType>
```

## FMPContext Type

```typescript
type FMPContext = {
  config?: {
    FMP_ACCESS_TOKEN?: string;
  };
};
```

## Error Handling

```typescript
try {
  const response = await this.client.get(endpoint, { params });
  return response.data;
} catch (error) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message;
    throw new Error(`FMP API Error: ${message}`);
  }
  throw error;
}
```

## CSV Bulk Endpoints

Some bulk endpoints return CSV instead of JSON:

```typescript
// In BulkClient
async getBulkProfiles(options?): Promise<string> {
  return this.getCSV('/bulk/profiles', {}, options);
}
```

`getCSV` uses `responseType: 'text'` in Axios config.

## Domain Client Examples

### CompanyClient Methods
- `getProfile(symbol)` - Company profile
- `getProfileByCIK(cik)` - Profile by CIK number
- `getPeers(symbol)` - Similar companies
- `getExecutives(symbol, active?)` - Company executives
- `getMarketCap(symbol)` - Market capitalization

### QuotesClient Methods
- `getQuote(symbol)` - Real-time quote
- `getQuotes(symbols)` - Multiple quotes
- `getHistoricalPrice(symbol, from?, to?)` - Historical prices

### SearchClient Methods
- `searchSymbol(query, limit?, exchange?)` - Search by symbol/name
- `searchCIK(query, limit?)` - Search by CIK
- `searchCUSIP(query)` - Search by CUSIP

## Directory Structure

Each domain client has:
```
src/api/{domain}/
├── {Domain}Client.ts    # Client implementation
├── types.ts             # TypeScript interfaces
└── index.ts             # Re-exports
```

## Adding a New Client

1. Create `src/api/{domain}/{Domain}Client.ts` extending `FMPClient`
2. Define response types in `types.ts`
3. Export from `index.ts`
4. Create corresponding tool registration in `src/tools/{domain}.ts`
