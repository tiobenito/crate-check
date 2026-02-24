# Crate Check

Instant vinyl record valuations powered by AI vision and Discogs market data.

## What It Does

Snap a photo of a record or type in an album name to get:
- Artist, album, year, label identification (via Claude Sonnet 4 vision)
- Discogs marketplace pricing in USD, MXN, and EUR
- Market demand data (have/want ratio, supply count)
- One-click save to a personal collection

## Tech Stack

- **Next.js** + TypeScript + Tailwind CSS
- **Instant** for real-time database
- **n8n** for AI + Discogs pipeline
- **Vercel** for deployment

Built with [Claude Code](https://claude.ai/code).

## Getting Started

```bash
npm install
npm run dev
```

Set your environment variables in `.env.local`:

```
NEXT_PUBLIC_INSTANT_APP_ID=your_instant_app_id
N8N_WEBHOOK_URL=your_n8n_webhook_url
```

## Live Demo

[Coming soon]
