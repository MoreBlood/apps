type LenisLike = {
	scrollTo: (target: number, options?: { duration?: number }) => void
}

export const LANDING_AB_MINIMAL_SCROLL_LOCK = 'landing-ab-minimal-scroll-lock'

/** Reset document scroll after premium → honest transition (Lenis-aware). */
export function scrollLandingAbToTop(options?: { lenis?: LenisLike | null; smooth?: boolean }): void {
	if (typeof document === 'undefined') return

	const smooth = options?.smooth ?? false
	const lenis = options?.lenis

	if (lenis) {
		lenis.scrollTo(0, { duration: smooth ? 0.45 : 0 })
	}

	globalThis.scrollTo({ top: 0, left: 0, behavior: smooth ? 'smooth' : 'auto' })
	document.documentElement.scrollTop = 0
	document.body.scrollTop = 0
}

export function setLandingAbMinimalScrollLock(active: boolean): void {
	if (typeof document === 'undefined') return
	document.documentElement.classList.toggle(LANDING_AB_MINIMAL_SCROLL_LOCK, active)
}
