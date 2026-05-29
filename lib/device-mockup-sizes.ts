/** Figma SVG viewBox / native frame dimensions. */
export const MOCKUP_IPAD = { w: 1575, h: 2208 } as const
export const MOCKUP_IPHONE = { w: 769, h: 1603 } as const

/** Screen slot geometry inside each frame (replaces #FF0090 placeholder). */
export const MOCKUP_SCREEN_IPAD = { x: 180.095, y: 148.281, w: 1210, h: 1842 } as const
export const MOCKUP_SCREEN_IPHONE = { x: 33.2393, y: 36.7373, w: 703.271, h: 1529, rx: 99.7175 } as const

/** Pair width/height while preserving native aspect ratio. */
export function resolveMockupSize(
	native: { w: number; h: number },
	width?: number,
	height?: number
): { width?: number; height?: number } {
	if (width == null && height == null) {
		return {}
	}
	if (width != null && height != null) {
		return { width, height }
	}
	if (width != null) {
		return { width, height: Math.round((width / native.w) * native.h) }
	}
	return { width: Math.round((height! / native.h) * native.w), height: height! }
}
