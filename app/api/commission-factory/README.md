# Commission Factory API

## Authentication

All requests pass the API key as a query parameter on every request.

**Required env var:**
- `COMMISSION_FACTORY_API_KEY` — From Account Settings > API in the CF dashboard

**Base URL:** `https://api.commissionfactory.com`

**Note:** All responses are inherently scoped to your affiliate account — the API key determines which account's data is returned.

---

## Endpoints

### `GET /api/commission-factory/merchants`

Upstream: `GET /V1/Affiliate/Merchants?apiKey={key}`

**Data scope:** Your account's merchants (all statuses by default).

**Optional query param:**
- `?status=` — forwarded directly to CF to filter by merchant status (e.g. `active`, `pending`)

---

### `GET /api/commission-factory/datafeeds`

Upstream: `GET /V1/Affiliate/DataFeeds?apiKey={key}`

**Data scope:** Your account's datafeeds (list view).

**Note:** The `Items` property is `null` in the list response. To get product items, fetch a single datafeed by ID.

---

### `GET /api/commission-factory/datafeeds/[id]`

Upstream: `GET /V1/Affiliate/DataFeeds/{id}?apiKey={key}`

**Data scope:** Single datafeed with full product data.

**Note:** `Items` array is populated here (unlike the list endpoint).

---

### `GET /api/commission-factory/banners`

Upstream: `GET /V1/Affiliate/Banners?apiKey={key}`

**Data scope:** Your account's available banners. Direct passthrough from CF.

---

### `GET /api/commission-factory/coupons`

Upstream: `GET /V1/Affiliate/Coupons?apiKey={key}`

**Data scope:** Your account's available coupons. Direct passthrough from CF.

---

### `GET /api/commission-factory/promotions`

Upstream: `GET /V1/Affiliate/Promotions?apiKey={key}`

**Data scope:** Your account's available promotions. Direct passthrough from CF.

---

### `GET /api/commission-factory/transactions`

Upstream: `GET /V1/Affiliate/Transactions?apiKey={key}&fromDate=2000-01-01&toDate={today}`

**Data scope:** All account transactions ever — fetches from `2000-01-01` up to today (`YYYY-MM-DD`).
