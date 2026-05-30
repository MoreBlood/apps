/**
 * Inline critical CSS for first paint. Keep small; full rules live in SCSS.
 * Add a named block here when a new above-the-fold element needs stable layout before app CSS.
 */

export const LANDING_CRITICAL_CSS_BLOCKS = {
	heroShowcase: [
		'.landing-hero__showcase{display:grid;width:100%;max-width:40rem;margin-inline:auto;aspect-ratio:1;overflow:hidden}',
		'.landing-hero__showcase>*{grid-area:1/1;width:100%;height:100%;min-height:0;aspect-ratio:unset;overflow:hidden}',
		'.landing-hero__showcase .landing-stage{min-height:0;aspect-ratio:unset}',
		'.landing-stage__cluster{visibility:hidden;opacity:0}',
		'.landing-stage__glow{opacity:0}'
	].join(''),
	navShell: [
		':root{--app-nav-bar-height:2.75rem}',
		'@media(min-width:1024px){:root{--app-nav-bar-height:3.25rem}}',
		'.app-nav-shell{--app-nav-offset-top:max(1rem,env(safe-area-inset-top,0px));min-height:calc(var(--app-nav-offset-top) + var(--app-nav-bar-height))}'
	].join('')
} as const

export type LandingCriticalCssBlock = keyof typeof LANDING_CRITICAL_CSS_BLOCKS

export function getLandingCriticalCss(blocks: LandingCriticalCssBlock[]): string {
	return blocks.map((key) => LANDING_CRITICAL_CSS_BLOCKS[key]).join('')
}

export const LANDING_NAV_CRITICAL_CSS = getLandingCriticalCss(['navShell'])
export const LANDING_HERO_CRITICAL_CSS = getLandingCriticalCss(['heroShowcase'])
/** @deprecated Use `LANDING_NAV_CRITICAL_CSS` + `LANDING_HERO_CRITICAL_CSS` separately. */
export const APP_LANDING_CRITICAL_CSS = getLandingCriticalCss(['navShell', 'heroShowcase'])
