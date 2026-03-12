# Impact API

## Authentication

All requests use HTTP Basic Auth — Account SID as the username and Auth Token as the password.

**Required env vars:**
- `IMPACT_ACCOUNT_SID` — Numeric Account SID from Impact dashboard (Settings > API)
- `IMPACT_AUTH_TOKEN` — Auth Token from the same page

**Base URL:** `https://api.impact.com`

**Publisher endpoint prefix:** `/Mediapartners/{AccountSID}/`

**Note:** Credentials are combined as `base64(AccountSID:AuthToken)` and sent as `Authorization: Basic {credentials}`. All requests must also include `Accept: application/json` — without it the API returns XML and responds with 403.

---

## Endpoints

### `GET /api/impact/contracts`

Upstream: `GET /Mediapartners/{sid}/Contracts?Status=Activated`

**Data scope:** Active advertiser partnerships your account has joined.

---

### `GET /api/impact/ads`

Upstream: `GET /Mediapartners/{sid}/Ads`

**Data scope:** Ad creatives (banners, text links, etc.) available to your account.

**Optional query param:**
- `?CampaignId=` — forwarded to Impact to filter by advertiser campaign

---

### `GET /api/impact/actions`

Upstream: `GET /Mediapartners/{sid}/Actions`

**Data scope:** Your account's conversions/transactions for the last 30 days.

**Query params sent to Impact:**
| Param | Value |
|---|---|
| `StartDate` | 30 days ago (`YYYY-MM-DD`) |
| `EndDate` | Today (`YYYY-MM-DD`) |

---

### `GET /api/impact/reports/adv-performance`

Upstream: `GET /Mediapartners/{sid}/Reports/adv_performance`

**Data scope:** Advertiser performance report for your account over the last 30 days.

**Query params sent to Impact:**
| Param | Value |
|---|---|
| `StartDate` | 30 days ago (`YYYY-MM-DD`) |
| `EndDate` | Today (`YYYY-MM-DD`) |

---

### `GET /api/impact/catalogs`

Upstream: `GET /Mediapartners/{sid}/Catalogs`

**Data scope:** List of product catalogs available to your account. Items are not included in the list response.

---

### `GET /api/impact/catalogs/[id]`

Upstream: `GET /Mediapartners/{sid}/Catalogs/{id}/Items`

**Data scope:** All items in a single product catalog.
