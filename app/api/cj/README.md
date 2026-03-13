# CJ Affiliate API

## Authentication

All requests use a Bearer token in the `Authorization` header.

**Required env vars:**
- `CJ_API_TOKEN` — Personal Access Token from CJ Account Manager > API Credentials
- `CJ_WEBSITE_ID` — Your Publisher CID (Website ID) from the CJ dashboard

**Base URL:** `https://advertiser-lookup.api.cj.com`

**Note:** Always include `Accept: application/json` — the API returns XML by default otherwise.

---

## Endpoints

### `GET /api/cj/advertisers`

Upstream: `GET /v2/advertiser-lookup?website-id={cid}&advertiser-ids=joined`

**Data scope:** All advertisers your account has joined. The upstream `advertiser` field is normalised to an array before returning (CJ returns a bare object when only one advertiser is joined).

**Response shape (per item):**
| Field | Description |
|---|---|
| `advertiser-id` | Unique numeric advertiser ID |
| `advertiser-name` | Display name |
| `primary-category.parent` | Top-level category |
| `primary-category.child` | Sub-category |
| `seven-day-epc` | 7-day earnings per click |
| `three-month-epc` | 3-month earnings per click |
| `commission-terms` | Human-readable commission description (e.g. `8% per sale`) |
| `network-rank` | CJ star rating (e.g. `5-star`) |
