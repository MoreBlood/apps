/** Deterministic HTML/SVG id — avoids React useId() SSR/client tree drift. */
export function stableDomId(...parts: (string | number | undefined)[]): string {
	return parts
		.filter((p): p is string | number => p !== undefined && p !== '')
		.join('-')
		.replace(/[^a-zA-Z0-9_-]/g, '-')
		.replace(/-+/g, '-')
}
