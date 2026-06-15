/** Env-only; safe to read during SSR (same on server and client). */
export function isFeedbackDebugFailFromEnv(): boolean {
	const flag = process.env.NEXT_PUBLIC_FEEDBACK_DEBUG_FAIL?.trim().toLowerCase()
	return flag === '1' || flag === 'true'
}

/** URL param; client-only — use after mount to avoid hydration mismatch. */
export function isFeedbackDebugFailFromUrl(): boolean {
	if (typeof window === 'undefined') return false
	const params = new URLSearchParams(window.location.search)
	return params.get('feedback_fail') === '1'
}

/** Full check for submit handlers (runs on client only). */
export function isFeedbackDebugFail(): boolean {
	return isFeedbackDebugFailFromEnv() || isFeedbackDebugFailFromUrl()
}
