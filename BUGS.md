# Crate Check — Bug Ledger

Production fixes. Cluster on the Root Cause column to spot trends.

| # | Date | Incident/Shipment | Symptom | Root Cause | Fix (+patch file) | Status |
|---|------|-------------------|---------|------------|-------------------|--------|
| B-1 | 2026-06-22 | commit 2e7b04f | Photo scan returned 500 ("Valuation failed. Please try again.") for every upload; text search worked fine | Hardcoded Anthropic model `claude-sonnet-4-20250514` retired 2026-06-15. Messages API now returns 404 (model not found); `extractFromPhoto` threw, caught as generic 500. Text path never calls Claude, so it was unaffected. | Swapped model id to current same-tier `claude-sonnet-4-6` in `src/app/api/valuate/route.ts:35`. Request shape unchanged. | done |

## Trend Review Log

- _(none yet)_
