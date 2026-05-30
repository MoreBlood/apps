# Lighthouse audit

Aggregated scores (for CI / pre-commit): `scores.json` and `scores.baseline.json`.  
Full reports are written to `.cache/` when running `npm run lighthouse:audit` (gitignored).

# Lighthouse audit (history)

**Last run:** `/rawclinic/` production build (`npm run build` → `serve out` → `node scripts/lighthouse-perf-loop.mjs`)

## `/rawclinic/` Performance

| Metric | Before (start) | Best after optimizations |
|--------|----------------|---------------------------|
| **Perf score** | 64 | **89** |
| LCP | ~6.6 s | ~3.7–3.9 s |
| FCP | ~1.8 s | ~1.5–1.7 s |

## Why not 100?

Lighthouse 100 on this stack would need **LCP &lt; 2.5 s** with no render-blocking CSS/JS. This app is a **Next.js client-heavy landing** (Radix Theme, Framer Motion, Lenis, device mockups). Remaining bottlenecks:

- **Render-blocking CSS** (~4 Radix/app chunks, ~900 ms)
- **React hydration** before hero text fully paints (~3 s render delay on LCP text)
- **Below-fold content** still pulls client chunks during audit navigation prefetch

Pushing further needs architectural changes (mostly-static landing route, lighter nav, or hosted on Vercel with image CDN + less client JS)—not more image tweaks alone.

## Changes made for perf

- Build-time WebP + blur (`scripts/generate-image-assets.mjs`)
- App icons optimized (were **1.5 MB PNG** in nav — major LCP regression)
- Server hero with native `<img fetchpriority="high">` + client mockups after idle
- Viewport-gated images (`useDeferUntilVisible`), compare carousel loads active slide only
- Lenis deferred via `requestIdleCallback`
- Hero enter animations removed; `optimizePackageImports` + `optimizeCss`

## Re-run

```bash
npm run build
npx serve out -l 3456
npm run lighthouse:audit
# or rawclinic only:
node scripts/lighthouse-perf-loop.mjs
```
