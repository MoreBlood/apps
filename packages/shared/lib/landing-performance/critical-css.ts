/**
 * Inline critical CSS for first paint. Rules live in styles/critical/*.css
 * and are also @imported from SCSS so nothing is duplicated by hand.
 */
import heroShowcaseCss from '../../styles/critical/hero-showcase.css'
import navShellCss from '../../styles/critical/nav-shell.css'

export const LANDING_CRITICAL_CSS_BLOCKS = {
	heroShowcase: heroShowcaseCss,
	navShell: navShellCss
} as const

export type LandingCriticalCssBlock = keyof typeof LANDING_CRITICAL_CSS_BLOCKS

export function getLandingCriticalCss(blocks: LandingCriticalCssBlock[]): string {
	return blocks.map((key) => LANDING_CRITICAL_CSS_BLOCKS[key]).join('')
}

export const LANDING_NAV_CRITICAL_CSS = getLandingCriticalCss(['navShell'])
export const LANDING_HERO_CRITICAL_CSS = getLandingCriticalCss(['heroShowcase'])
/** @deprecated Use `LANDING_NAV_CRITICAL_CSS` + `LANDING_HERO_CRITICAL_CSS` separately. */
export const APP_LANDING_CRITICAL_CSS = getLandingCriticalCss(['navShell', 'heroShowcase'])
