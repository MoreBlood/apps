import type { CSSProperties } from 'react'

/** Figma SVG viewBox / native frame dimensions. */
export const MOCKUP_IPAD = { w: 1415, h: 2048 } as const
export const MOCKUP_IPHONE = { w: 769, h: 1603 } as const

/** Screen slot geometry inside each frame (replaces Figma screen placeholder). */
export const MOCKUP_SCREEN_IPAD = { x: 100.389, y: 100, w: 1210, h: 1842, rx: 35.6418 } as const
export const MOCKUP_SCREEN_IPHONE = { x: 33.2393, y: 36.7373, w: 703.271, h: 1529, rx: 99.7175 } as const

/** Extra px around screen slot — hides subpixel gaps under the bezel (matches svg-mockup-to-tsx.mjs). */
export const MOCKUP_SCREEN_EDGE_BLEED = 3

/** Absolute % inset for HTML screen layer under the SVG frame. */
export function mockupScreenSlotStyle(
	screen: { x: number; y: number; w: number; h: number },
	frame: { w: number; h: number },
	bleed = MOCKUP_SCREEN_EDGE_BLEED
): CSSProperties {
	const x = screen.x - bleed
	const y = screen.y - bleed
	const w = screen.w + bleed * 2
	const h = screen.h + bleed * 2
	return {
		left: `${(x / frame.w) * 100}%`,
		top: `${(y / frame.h) * 100}%`,
		width: `${(w / frame.w) * 100}%`,
		height: `${(h / frame.h) * 100}%`
	}
}

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
	if (height == null) {
		return {}
	}
	return { width: Math.round((height / native.h) * native.w), height }
}
