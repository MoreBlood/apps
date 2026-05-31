export const LANDING_CRACK_SKIN_QUERY = 'landing_skin'
export const LANDING_CRACK_SKIN_STORAGE = 'rc_landing_crack_skin_v1'

export type LandingCrackSkin = 'win' | 'mac'

const VALID: LandingCrackSkin[] = ['win', 'mac']

export function isLandingCrackSkin(value: string | undefined): value is LandingCrackSkin {
	return VALID.includes(value as LandingCrackSkin)
}

export function parseLandingCrackSkinOverride(raw: string | null | undefined): LandingCrackSkin | null {
	if (!raw) return null
	const v = raw.trim().toLowerCase()
	if (v === 'mac' || v === 'macintosh' || v === 'osx' || v === 'system7') return 'mac'
	if (v === 'win' || v === 'windows' || v === 'win9x' || v === 'pc') return 'win'
	return null
}

export function readLandingCrackSkinStorage(): LandingCrackSkin | null {
	if (typeof sessionStorage === 'undefined') return null
	const value = sessionStorage.getItem(LANDING_CRACK_SKIN_STORAGE)
	return isLandingCrackSkin(value ?? undefined) ? (value as LandingCrackSkin) : null
}

export function writeLandingCrackSkinStorage(skin: LandingCrackSkin): void {
	if (typeof sessionStorage === 'undefined') return
	sessionStorage.setItem(LANDING_CRACK_SKIN_STORAGE, skin)
}

export function resolveLandingCrackSkin(searchOverride?: string | null): LandingCrackSkin {
	const fromQuery = parseLandingCrackSkinOverride(searchOverride ?? null)
	if (fromQuery) {
		writeLandingCrackSkinStorage(fromQuery)
		return fromQuery
	}
	return readLandingCrackSkinStorage() ?? 'win'
}
