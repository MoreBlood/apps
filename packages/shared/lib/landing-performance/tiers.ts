/**
 * Load tiers for landing sections. Pick one when adding a block — see docs/landing-performance.md.
 *
 * - server: RSC / static HTML (hero copy, layout shell)
 * - critical: tiny client island in first paint (hero stage scale)
 * - eager: code-split chunk, mount on first client render
 * - viewport: code-split chunk, mount near viewport (IntersectionObserver)
 * - idle: code-split chunk, mount after idle (smooth scroll, debug tools)
 */

export type LandingLoadTier = 'server' | 'critical' | 'eager' | 'viewport' | 'idle'

export type LandingLoadPolicy = {
	defer: boolean
	rootMargin: string
	idleTimeoutMs?: number
}

export const LANDING_LOAD_POLICIES: Record<LandingLoadTier, LandingLoadPolicy> = {
	server: { defer: false, rootMargin: '0px' },
	critical: { defer: false, rootMargin: '0px' },
	eager: { defer: false, rootMargin: '0px' },
	viewport: { defer: true, rootMargin: '280px 0px' },
	idle: { defer: false, rootMargin: '0px', idleTimeoutMs: 2500 }
}
