# Crate Check

## What This Is

A record valuator web app that identifies vinyl records from photos or text search, fetches Discogs pricing + market data via an n8n webhook, and saves records to a personal collection stored in Instant.

## Tech Stack

- **Framework:** Next.js 16 + TypeScript + Tailwind v4
- **Database:** Instant (`@instantdb/react`) — real-time, no auth
- **Backend:** n8n Cloud webhook (proxied via `/api/valuate`)
- **Deployment:** Vercel

## Architecture

```
User → Photo/Text → /api/valuate (Next.js route) → n8n webhook → Claude Sonnet 4 + Discogs API → JSON response
User → "Save" → Instant DB (real-time)
User → /collection → Instant useQuery (real-time subscription)
```

## Key Files

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Valuate page — photo upload or text search |
| `src/app/collection/page.tsx` | Collection grid with sorting |
| `src/app/api/valuate/route.ts` | Proxy to n8n webhook (keeps URL private) |
| `src/lib/db.ts` | Instant client init |
| `instant.schema.ts` | Database schema |
| `src/components/` | PhotoUpload, TextInput, ValuationResult, RecordCard, DemandBadge |

## Environment Variables

| Variable | Where | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_INSTANT_APP_ID` | `.env.local` + Vercel | From Instant dashboard |
| `N8N_WEBHOOK_URL` | `.env.local` + Vercel | From n8n Cloud (server-side only) |

## Design System

- Dark theme (#0a0a0a background)
- Amber accent (#f59e0b) for CTAs and branding
- Demand badges: green (High), blue (Good), yellow (Medium), red (Low)
- Geist font family
- Mobile-first responsive layout
