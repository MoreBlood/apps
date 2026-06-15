# Agent guide — AK Apps Web (monorepo)

## Layout

| Path | Deploy | Purpose |
|------|--------|---------|
| `apps/hub` | GitHub Pages (`/apps`) | AK Apps hub — all apps |
| `apps/rawclinic` | Vercel (`rawclinic.click`) | RAW Clinic only + API routes |
| `packages/shared` | — | Shared components, config, lib, styles, `public/` |

Cursor rules in **`.cursor/rules/`** are the style guide. Read them before UI or SCSS work.

| Rule | Scope |
|------|--------|
| `project-overview.mdc` | Always — architecture, shared components, imports |
| `design-tokens-scss.mdc` | `styles/**/*.scss` — tokens, breakpoints, mixins, accent discipline |
| `react-ui-components.mdc` | `components/**`, `app/**` — heroes, grids, theme, reuse |

## Quick reference

- **Tokens**: `styles/_tokens.scss` — `--rc-content-max-*`, `$rc-bp-*`, `--rc-semantic-*`
- **Mixins**: `styles/_mixins.scss` — `page-eyebrow`, `content-panel`, `tinted-icon-chip`
- **Theme**: `config/app-theme.ts` — hub gray, app red/green
- **Global styles entry**: `styles/index.scss`

Do not add raw `rem` content widths or pixel breakpoints in new SCSS. Prefer shared React components over copy-paste layouts.
