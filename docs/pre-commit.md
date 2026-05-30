# Pre-commit hooks

[Husky](https://typicode.github.io/husky/) runs `scripts/pre-commit.mjs` on every `git commit`.

## Checks

| Step | Command | Notes |
|------|---------|--------|
| TypeScript | `tsc --noEmit` | Whole project |
| Biome | `npm run lint:staged` | Only staged files |
| Lighthouse | `lighthouse-compare.mjs` | `scores.json` vs `scores.baseline.json` |

## Lighthouse workflow

Pre-commit does **not** run Lighthouse (too slow). It compares aggregated scores to the baseline.

**Committed files:**
- `lighthouse-reports/scores.json` — last audit (compact)
- `lighthouse-reports/scores.baseline.json` — accepted minimum

Full Lighthouse JSON → `lighthouse-reports/.cache/` (gitignored).

1. `npm run build && npx serve out -l 3456`
2. `npm run lighthouse:audit` — refresh `scores.json`
3. `npm run lighthouse:compare` — verify no regression
4. If scores improved: `npm run lighthouse:baseline` — copy to `scores.baseline.json` and commit both JSON files

### Skip / tune

```bash
SKIP_LIGHTHOUSE=1 git commit -m "..."     # skip Lighthouse compare
LIGHTHOUSE_SCORE_TOLERANCE=1 git commit … # allow 1pt category drop (flake)
LIGHTHOUSE_METRIC_RATIO=1.08 git commit … # allow 8% metric regression
```

## Manual run

```bash
npm run precommit
npm run lint:staged       # biome on staged files (same as pre-commit)
npm run lint:staged:fix   # auto-fix staged files before commit
npm run check             # tsc + biome on entire repo
npm run typecheck
```

## First-time setup

```bash
pnpm install   # runs `prepare` → husky
```
