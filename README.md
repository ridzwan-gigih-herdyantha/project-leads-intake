# [NAMA AGENCY] — Lead capture site

Minimal Next.js (App Router) + TypeScript + Tailwind lead-capture landing page. Submissions are validated with zod and forwarded server-side to an n8n webhook.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- zod for shared client/server validation
- Deploy target: Vercel

## Setup

```bash
npm install
cp .env.example .env.local
# then edit .env.local and set your real n8n webhook URL + secret
```

## Environment variables

Both are server-only (no `NEXT_PUBLIC_` prefix). Never expose these to the client.

| Name                  | Description                                                            |
| --------------------- | ---------------------------------------------------------------------- |
| `N8N_WEBHOOK_URL`     | URL of the n8n webhook that receives lead submissions.                 |
| `N8N_WEBHOOK_SECRET`  | Shared secret sent as the `X-Webhook-Secret` header; verify it in n8n. |

## Run locally

```bash
npm run dev
```

Then open http://localhost:3000.

## Deploy to Vercel

1. Push the repo to GitHub / GitLab / Bitbucket.
2. In Vercel, **New Project** → import the repo.
3. Under **Environment Variables**, add `N8N_WEBHOOK_URL` and `N8N_WEBHOOK_SECRET` for Production (and Preview if needed).
4. Deploy. Vercel auto-detects Next.js — no extra config required.

## How it works

- The single page (`app/page.tsx`) renders the hero, three service cards, and the contact form section (`#contact`).
- `components/ContactForm.tsx` is a client component: it validates with `leadSchema` client-side, shows inline errors and a loading state, then POSTs JSON to `/api/lead`.
- `app/api/lead/route.ts` re-validates the payload with the same schema (`lib/lead-schema.ts`), forwards a flat JSON body to n8n with a 10-second timeout, and returns `200 { ok: true }` on success or `502` with a generic message on any upstream failure.
