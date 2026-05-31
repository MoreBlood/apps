export const LANDING_AB_COOKIE = 'rc_landing_ab_v1'
export const LANDING_AB_QUERY = 'landing_ab'

export type LandingAbVariant = 'control' | 'anti'

const VALID: LandingAbVariant[] = ['control', 'anti']

export function parseLandingAbOverride(raw: string | null | undefined): LandingAbVariant | null {
	if (!raw) return null
	const v = raw.trim().toLowerCase()
	if (v === 'anti' || v === 'b' || v === '1') return 'anti'
	if (v === 'control' || v === 'a' || v === '0') return 'control'
	return null
}

export function isLandingAbVariant(value: string | undefined): value is LandingAbVariant {
	return VALID.includes(value as LandingAbVariant)
}

/** Share of traffic for random assignment (0–100). Default 0 — use `?landing_ab=anti` instead. */
export function getLandingAbAntiSplitPercent(): number {
	const raw = process.env.NEXT_PUBLIC_LANDING_AB_ANTI_PERCENT?.trim()
	if (!raw) return 0
	const n = Number.parseInt(raw, 10)
	if (!Number.isFinite(n)) return 0
	return Math.min(100, Math.max(0, n))
}

export function isLandingAbExperimentEnabled(): boolean {
	return getLandingAbAntiSplitPercent() > 0
}

export function pickLandingAbVariant(): LandingAbVariant {
	const split = getLandingAbAntiSplitPercent()
	if (split <= 0) return 'control'
	if (split >= 100) return 'anti'
	return Math.random() * 100 < split ? 'anti' : 'control'
}

export function readLandingAbCookie(): LandingAbVariant | null {
	if (typeof document === 'undefined') return null
	const match = document.cookie.match(new RegExp(`(?:^|; )${LANDING_AB_COOKIE}=([^;]*)`))
	const value = match?.[1] ? decodeURIComponent(match[1]) : undefined
	return isLandingAbVariant(value) ? value : null
}

export function writeLandingAbCookie(variant: LandingAbVariant): void {
	if (typeof document === 'undefined') return
	const maxAge = 60 * 60 * 24 * 90
	// biome-ignore lint/suspicious/noDocumentCookie: static export — client-side A/B assignment only
	document.cookie = `${LANDING_AB_COOKIE}=${variant}; path=/; max-age=${maxAge}; samesite=lax`
}

/** Query-only for now: `?landing_ab=anti` | `control`. No cookie or random split. */
export function resolveLandingAbVariant(searchOverride?: string | null): LandingAbVariant {
	return parseLandingAbOverride(searchOverride ?? null) ?? 'control'
}
