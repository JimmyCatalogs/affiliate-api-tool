# Awin API

## Authentication

All requests use a Bearer token in the `Authorization` header.

**Required env vars:**
- `AWIN_API_TOKEN` — Bearer token from https://ui.awin.com/awin-api
- `AWIN_PUBLISHER_ID` — Numeric publisher ID from the Awin dashboard

**Base URL:** `https://api.awin.com`

**Rate limit:** 20 requests/min

---

## Endpoints

### `GET /api/awin/programmes`

Upstream: `GET /publishers/{publisherId}/programmes?relationship=joined`

**Data scope:** Joined programmes only — returns only the advertiser programmes your account has joined.

---

### `GET /api/awin/promotions`

Upstream: `POST /publisher/{publisherId}/promotions`

**Data scope:** Joined + active promotions only — filters by `membership: 'joined'` and `status: 'active'`.

**Request body sent to Awin:**
```json
{ "filters": { "membership": "joined", "status": "active" } }
```

**Response:** Unwraps nested `data.data` if present.

---

### `GET /api/awin/transactions`

Upstream: `GET /publishers/{publisherId}/transactions/`

**Data scope:** Your account's transactions for the last 30 days.

**Query params sent to Awin:**
| Param | Value |
|---|---|
| `startDate` | 30 days ago (ISO 8601, e.g. `2025-02-10T00:00:00Z`) |
| `endDate` | Now (ISO 8601) |
| `timezone` | `UTC` |
| `dateType` | `transaction` |

**Response:** Unwraps nested `data.data` if present (handles both array and object responses).

---

### `GET /api/awin/reports/advertiser`

Upstream: `GET /publishers/{publisherId}/reports/advertiser`

**Data scope:** Your account's advertiser performance report for the last 30 days.

**Query params sent to Awin:**
| Param | Value |
|---|---|
| `startDate` | 30 days ago (`YYYY-MM-DD`) |
| `endDate` | Today (`YYYY-MM-DD`) |
| `region` | `US` |
| `timezone` | `UTC` |
| `dateType` | `transaction` |

**Response:** Unwraps nested `data.data` if present (handles both array and object responses).
