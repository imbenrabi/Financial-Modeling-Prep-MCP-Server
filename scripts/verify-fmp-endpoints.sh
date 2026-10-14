#!/usr/bin/env bash
#
# Curl-checks the FMP /stable endpoints that the newest tools call, to confirm
# each path exists and returns the expected structure.
#
# Usage:
#   FMP_ACCESS_TOKEN=<key> scripts/verify-fmp-endpoints.sh
#
# Needs curl and jq. The key is read from the environment and is never printed.
# Exits non-zero if any check fails. Endpoints whose row shape is not known are
# only required to return a non-empty JSON array; their field names are printed
# so the TypeScript types can be tightened later.

set -u

BASE="${FMP_BASE_URL:-https://financialmodelingprep.com/stable}"
KEY="${FMP_ACCESS_TOKEN:-}"
if [ -z "$KEY" ]; then
  echo "Set FMP_ACCESS_TOKEN to an FMP API key." >&2
  exit 2
fi

failures=0

# check <label> <path-and-query> <required-keys, comma separated or empty>
check() {
  local label="$1" url="$2" keys="$3" body code
  body="$(mktemp)"
  code="$(curl -sS -m 30 -o "$body" -w '%{http_code}' "$BASE/$url&apikey=$KEY")"
  if [ "$code" != "200" ]; then
    echo "FAIL $label: HTTP $code ($(head -c 200 "$body"))"
    failures=$((failures + 1)); rm -f "$body"; return
  fi
  if ! jq -e 'type == "array" and length > 0' "$body" >/dev/null 2>&1; then
    echo "FAIL $label: expected a non-empty JSON array, got: $(head -c 200 "$body")"
    failures=$((failures + 1)); rm -f "$body"; return
  fi
  if [ -n "$keys" ]; then
    local missing
    missing="$(jq -r --arg keys "$keys" '
      ($keys | split(",")) as $want | (.[0] | keys) as $have | $want - $have | join(",")' "$body")"
    if [ -n "$missing" ]; then
      echo "FAIL $label: first row is missing keys: $missing"
      failures=$((failures + 1)); rm -f "$body"; return
    fi
  fi
  echo "PASS $label: $(jq 'length' "$body") rows; keys: $(jq -r '.[0] | keys | join(",")' "$body")"
  rm -f "$body"
}

# New tools
check getEnterpriseValues       "enterprise-values?symbol=AAPL&limit=2" "symbol,date,stockPrice,numberOfShares,marketCapitalization,minusCashAndCashEquivalents,addTotalDebt,enterpriseValue"
check getSenateProfile          "senate-profile?limit=5" ""
check getSenatePositions        "senate-positions?limit=5" ""
check getSenateTradesById       "senate-trades-by-id?senateID=M001243&limit=5" "symbol,disclosureDate,transactionDate"
check getHouseTradesById        "house-trades-by-id?senateID=P000197&limit=5" "symbol,disclosureDate,transactionDate"
check getSenateNetWorth         "senate-net-worth?senateID=P000197&page=0&limit=5" ""
check getSenateNetWorthAggregated "senate-net-worth-aggregated?senateID=P000197" ""

# Fixed path and new parameters on existing tools
check getEconomicIndicators     "economic-indicators?name=GDP" "name,date,value"
check stockScreener.avgVolume   "company-screener?avgVolumeMoreThan=1000000&limit=5" "symbol,avgVolume"
check getEarningsCalendar.times "earnings-calendar?from=2026-10-01&to=2026-10-31&includeReportTimes=true" "symbol,date"

# House ID parameter name is not documented. An unknown parameter may be ignored
# (HTTP 200 with unfiltered rows), so compare row counts and first-row names.
for p in senateID houseID id; do
  out="$(curl -sS -m 30 "$BASE/house-trades-by-id?$p=P000197&limit=3&apikey=$KEY" \
    | jq -c 'if type == "array" then {rows: length, first: (.[0] | [.firstName, .lastName])} else . end' 2>&1 | head -c 200)"
  echo "INFO house-trades-by-id with $p=P000197: $out"
done

if [ "$failures" -gt 0 ]; then
  echo "$failures check(s) failed"
  exit 1
fi
echo "All checks passed"
