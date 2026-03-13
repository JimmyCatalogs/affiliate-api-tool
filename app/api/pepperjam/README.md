# Pepperjam / Ascend API

## Authentication

All requests pass the API key as a query parameter. There are no special headers required.

**Required env vars:**
- `PEPPERJAM_API_KEY` — API key from Ascend account: Resources > API Keys > Generate New Key

**Base URL:** `https://api.pepperjamnetwork.com`

**URL pattern:** `https://api.pepperjamnetwork.com/{version}/{resource}?apiKey={key}&format=json`

**Version:** `20120402`

**Note:** Always include `format=json` — the API returns XML by default otherwise.

**Note:** Query string parameters use camelCase (e.g. `apiKey`) while response fields use snake_case (e.g. `program_id`).

---

## Rate Limits

Daily request limits apply per account tier. The response `meta` object includes a `maximum_requests_per_day` field. Contact support@ascendpartner.com for tier details.

---

## Endpoints

### `GET /api/pepperjam/programs`

Upstream: `GET https://api.pepperjamnetwork.com/20120402/term?apiKey={key}&format=json`

**Data scope:** All programs the publisher has joined (approved relationship status).

**Response shape (per item):**
| Field | Description |
|---|---|
| `id` | Unique program/merchant ID |
| `name` | Program display name |
| `category` | Program category/sector |
| `status` | Relationship status (e.g. `active`) |
| `homepage` | Merchant homepage URL |
| `commission_base` | Base commission rate (numeric string) |
| `commission_type` | Commission type: `percent` or `flat` |

**Wrapper:** Pepperjam wraps all responses as `{ meta: {...}, data: [...] }`. This route unwraps and returns the `data` array directly.
