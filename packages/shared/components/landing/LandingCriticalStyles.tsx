import {
	getLandingCriticalCss,
	LANDING_HERO_CRITICAL_CSS,
	type LandingCriticalCssBlock
} from '@/lib/landing-performance'

type Props = {
	/** Named blocks from `LANDING_CRITICAL_CSS_BLOCKS`. Defaults to hero showcase. */
	blocks?: LandingCriticalCssBlock[]
	/** Raw CSS override (prefer named `blocks`). */
	css?: string
}

/** Inline layout-critical CSS before the main stylesheet (LCP / CLS). */
export default function LandingCriticalStyles({ blocks, css: cssOverride }: Props) {
	const css = cssOverride ?? (blocks ? getLandingCriticalCss(blocks) : LANDING_HERO_CRITICAL_CSS)
	if (!css) return null

	return (
		<style
			// biome-ignore lint/security/noDangerouslySetInnerHtml: small fixed critical layout rules
			dangerouslySetInnerHTML={{ __html: css }}
		/>
	)
}
