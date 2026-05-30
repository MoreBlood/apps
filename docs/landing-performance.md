# Landing performance

How we keep Lighthouse / LCP healthy when adding sections — without one-off hacks.

## Load tiers

| Tier | When to use | Examples |
|------|-------------|----------|
| `server` | Static HTML, no client JS | Hero title, lead, CTAs in `LandingHeroStatic` |
| `critical` | Small client island in first paint | `LandingHeroShowcase`, nav height sync |
| `eager` | Code-split, mount immediately | Highlights, quotes, text grids, CTA copy |
| `viewport` | Code-split, mount near viewport | Photo bands, primary grid, feature stages, blog |
| `idle` | After `requestIdleCallback` | Lenis (`LandingScrollProvider`), debug tuner |

Policies live in `lib/landing-performance/tiers.ts`.

## Adding a new section

1. **Choose a tier** from the table above.
2. **Markup** — prefer server components for copy-only blocks.
3. **Heavy block** — wrap with `LandingLazySection`:

```tsx
<LandingLazySection
  tier="viewport"
  minHeight="24rem"
  load={() => import('./MyNewSection')}
  props={{ ... }}
/>
```

4. **Above-the-fold layout** — if the block affects CLS/LCP, add a small rule to `lib/landing-performance/critical-css.ts` and include it via `LandingCriticalStyles`.
5. **LCP images** — use `OptimizedImage` with `priority` or add paths to `getLandingLcpPreloads()` in `preloads.ts`.
6. **Animations** — below-fold only; never on hero LCP text (`LandingHeroReveal` is for home only).

## File map

| Concern | Location |
|---------|----------|
| Critical CSS registry | `lib/landing-performance/critical-css.ts` |
| `<style>` injector | `components/landing/LandingCriticalStyles.tsx` |
| Lazy section wrapper | `components/landing/LandingLazySection.tsx` |
| LCP `preload()` list | `lib/landing-performance/preloads.ts` → `app/[appSlug]/page.tsx` |
| App route shell | `app/[appSlug]/page.tsx` (RSC hero + client body) |
| Below-fold composition | `components/landing/AppLandingPage.tsx` |

## Route shell (`/[appSlug]/`)

```
RSC page.tsx
├── preload LCP images (getLandingLcpPreloads)
├── LandingCriticalStyles (hero + nav blocks)
├── LandingHeroStatic (server)
└── AppLandingPage (client, lazy viewport sections)
```

Do **not** duplicate inline `<style>` strings in components — extend `critical-css.ts` instead.

## What we avoid

- Splitting hero into arbitrary static/client files without updating the registry
- Importing device stages / compare carousel / blog in the main `AppLandingPage` chunk
- `useId()` / Radix on SSR-critical paths (use stable ids — see `lib/stable-dom-id.ts`)
- Enter animations on LCP elements

## Audits

```bash
npm run build
npx serve out -l 3456
npm run lighthouse:audit
npm run lighthouse:compare    # scores.json vs scores.baseline.json
npm run lighthouse:baseline   # promote scores.json → scores.baseline.json
```

See `lighthouse-reports/SUMMARY.md` for baseline scores. Pre-commit runs `lighthouse:compare` automatically — see `docs/pre-commit.md`.
