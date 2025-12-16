# Revz.ME Payment Gateway

Minimal reference implementation of the **Revz.ME Payment Gateway**. It contains:

- Express backend with API key protection, slip verification hook (Planaria), and TrueMoney redemption helper.
- Optional PostgreSQL persistence (falls back to in-memory storage when `DATABASE_URL` is not provided).
- Next.js (shadcn-inspired) frontend shell with Thai UI text and basic pages.

> Language: TH (Thai). Theme: minimalist, Anuphan font, Lucide icons.

## Backend (Express + PostgreSQL)

```bash
cd backend
cp .env.example .env   # adjust values
npm install
npm run dev            # starts on PORT (default 4000)
```

### Key endpoints (all require `x-api-key`):

- `POST /v1/transactions/create` – body: `{ "method": 0|1, "amount": number, "callback": "https://..." }`
  - Method `0` slip-verify (min 5 THB), method `1` TrueMoney wallet (min 10 THB).
  - Returns `id`, `paymentUrl`, and `tokenChecksum`.
- `GET /v1/transactions/:id` – transaction info + checksum.
- `GET /v1/transactions/:id/isPaid` – paid status.
- `POST /v1/transactions/:id/verify-slip` – body: `{ "qrcode_text": "..." }` (validates receiver name).
- `POST /v1/transactions/:id/redeem` – body: `{ "voucher_link": "...", "phone_number": "08xxxxxxxx" }`.
- `GET /v1/settings` / `PUT /v1/settings` – runtime configuration such as receiver phone, Planaria key, receiver name, bank info.

Transactions expire after **10 minutes** (configurable via `TRANSACTION_EXPIRY_MINUTES`). When `DATABASE_URL` is set, data is persisted in PostgreSQL; otherwise, an in-memory store is used.

## Frontend (Next.js 14 + Tailwind)

```bash
cd frontend
npm install
npm run dev   # http://localhost:3000
```

Pages include Register, Login, User Dashboard, Admin Dashboard, Settings, Statistics, and Payment page shells styled with Tailwind/shadcn-inspired components, Anuphan font, and Lucide icons.

The payment page expects `NEXT_PUBLIC_API_BASE_URL` (e.g., `http://localhost:4000`) to fetch transaction details.

## Notes

- Slip verification uses Planaria (`PLANARIA_API_KEY`) and validates receiver name (`RECEIVER_NAME_MATCH_MODE` exact/contains).
- TrueMoney redemption follows the official voucher redeem endpoint; configure `TRUEMONEY_RECEIVER_PHONE`.
- Keep your `.env` files out of version control. A starter `.env.example` is provided.
