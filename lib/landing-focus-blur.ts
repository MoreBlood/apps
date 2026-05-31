/** Env flag; readable during SSR. Defaults to enabled. */
export function isLandingFocusBlurEnabledFromEnv(): boolean {
	const flag = process.env.NEXT_PUBLIC_LANDING_FOCUS_BLUR?.trim().toLowerCase()
	return flag == null || flag === '' || flag === '1' || flag === 'true'
}

/** URL param; client-only. `?landing_focus_blur=0` disables focus backdrop blur. */
export function isLandingFocusBlurEnabledFromUrl(): boolean | null {
	if (typeof window === 'undefined') return null
	const flag = new URLSearchParams(window.location.search).get('landing_focus_blur')?.trim().toLowerCase()
	if (flag == null || flag === '') return null
	return flag === '1' || flag === 'true'
}

export function isLandingFocusBlurEnabled(): boolean {
	return isLandingFocusBlurEnabledFromUrl() ?? isLandingFocusBlurEnabledFromEnv()
}
