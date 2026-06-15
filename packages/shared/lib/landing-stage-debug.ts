/** Env flag; readable during SSR. */
export function isLandingStageDebugFromEnv(): boolean {
	const flag = process.env.NEXT_PUBLIC_LANDING_STAGE_DEBUG?.trim().toLowerCase()
	return flag === '1' || flag === 'true'
}

/** URL param; client-only. */
export function isLandingStageDebugFromUrl(): boolean {
	if (typeof window === 'undefined') return false
	return new URLSearchParams(window.location.search).get('landing_stage_debug') === '1'
}

export function isLandingStageDebug(): boolean {
	return isLandingStageDebugFromEnv() || isLandingStageDebugFromUrl()
}
