import { MOCKUP_IPAD, MOCKUP_IPHONE } from '@/lib/device-mockup-sizes'

export type LandingStageLayoutKey = 'hero' | 'hero-mobile' | 'compact' | 'feature'

export type StageDeviceId = 'ipad' | 'iphone' | 'iphone-secondary'

export type StageAnchoredDevice = {
	w: number
	h: number
	top: number
	left?: number
	right?: number
	scaleMult?: number
	zIndex?: number
}

export type StageDeviceSlot = StageAnchoredDevice & {
	id: StageDeviceId
	rotate: number
}

export const DEFAULT_STAGE_DEVICE_Z: Record<StageDeviceId, number> = {
	ipad: 1,
	iphone: 2,
	'iphone-secondary': 1
}

export function getStageDeviceZIndex(slot: Pick<StageDeviceSlot, 'id' | 'zIndex'>) {
	return slot.zIndex ?? DEFAULT_STAGE_DEVICE_Z[slot.id]
}

export type PlacedStageDevice = {
	id: StageDeviceId
	x: number
	y: number
	w: number
	h: number
	rotate: number
	scaleMult: number
	zIndex: number
}

/** Default design canvas — slot positions are fractions of this box. */
export const LANDING_STAGE_DESIGN_CANVAS = { w: 640, h: 400 } as const

const LAYOUT_CANVAS: Record<LandingStageLayoutKey, { w: number; h: number }> = {
	hero: { w: 1000, h: 480 },
	'hero-mobile': { w: 760, h: 440 },
	compact: { w: 900, h: 420 },
	feature: { w: 900, h: 420 }
}

const LAYOUTS: Record<LandingStageLayoutKey, StageDeviceSlot[]> = {
	hero: [
		{
			id: 'ipad',
			...MOCKUP_IPAD,
			left: 0.77,
			top: -0.06,
			rotate: 0,
			scaleMult: 1.2,
			zIndex: 2
		},
		{
			id: 'iphone',
			...MOCKUP_IPHONE,
			left: 0.615,
			top: 0.5,
			rotate: 0,
			zIndex: 2
		},
		{
			id: 'iphone-secondary',
			...MOCKUP_IPHONE,
			left: 1,
			top: 0.5,
			rotate: 0,
			zIndex: 0
		}
	],
	'hero-mobile': [
		{ id: 'ipad', ...MOCKUP_IPAD, left: 0, top: 0, rotate: 0 },
		{ id: 'iphone', ...MOCKUP_IPHONE, left: 0, top: 0, rotate: 0 }
	],
	compact: [
		{
			id: 'ipad',
			...MOCKUP_IPAD,
			left: 0,
			top: 0.18,
			rotate: 4,
			scaleMult: 1.2,
			zIndex: 1
		},
		{
			id: 'iphone',
			...MOCKUP_IPHONE,
			left: -0.2,
			top: 0.815,
			rotate: -4,
			zIndex: 2
		}
	],
	feature: [
		{
			id: 'ipad',
			...MOCKUP_IPAD,
			left: 0,
			top: -0.2,
			rotate: -4,
			scaleMult: 1.07,
			zIndex: 1
		},
		{
			id: 'iphone',
			...MOCKUP_IPHONE,
			left: 0.49,
			top: 0.165,
			rotate: 7,
			zIndex: 2
		}
	]
}

export function getLandingStageDesignCanvas(layoutKey: LandingStageLayoutKey) {
	return LAYOUT_CANVAS[layoutKey] ?? LANDING_STAGE_DESIGN_CANVAS
}

export type LandingStageScaleResult = {
	scale: number
	layoutKey: LandingStageLayoutKey
	label: string
	container: { w: number; h: number }
	raw: number
	padding: number
	minScale: number
	maxScale: number
	composition: { w: number; h: number }
	placed: PlacedStageDevice[]
	/** Scaled bbox after centering the cluster in the container. */
	bbox: { minX: number; minY: number; maxX: number; maxY: number } | null
	constraints: { label: string; scale: number }[]
}

export type ComputeStageScaleOptions = {
	/** Inset from stage edges when fitting the cluster (px per side). */
	padding?: number
	/** Extra px around each device when measuring composition size (shadows/rotation). */
	shadowPad?: number
	/**
	 * @deprecated Merged into `padding` at runtime. Prefer a single `padding` value.
	 */
	filterBleed?: number
	/** Scale divisor: &gt;1 shrinks the cluster (e.g. 1.06 ≈ 6% smaller). */
	fitMargin?: number
	minScale?: number
	maxScale?: number
	debugLabel?: string
	layoutKey?: LandingStageLayoutKey
	/** When set, skips auto-fit and uses this cluster scale (--device-scale). */
	scaleOverride?: number
}

export const LANDING_STAGE_SCALE_OPTIONS: Partial<
	Record<LandingStageLayoutKey, Omit<ComputeStageScaleOptions, 'debugLabel' | 'layoutKey'>>
> = {
	hero: { padding: 6, shadowPad: 12, fitMargin: 1, maxScale: 0.74 },
	'hero-mobile': { padding: 8, shadowPad: 14, fitMargin: 1 },
	compact: { padding: 8, shadowPad: 48, fitMargin: 1, maxScale: 0.44 },
	feature: { padding: 0, shadowPad: 0, fitMargin: 1.13, maxScale: 0.46 }
}

function nativeSize(device: StageAnchoredDevice) {
	const mult = device.scaleMult ?? 1
	return { w: device.w * mult, h: device.h * mult }
}

function deviceRect(
	canvasW: number,
	canvasH: number,
	device: StageAnchoredDevice,
	scale: number
) {
	const { w: nw, h: nh } = nativeSize(device)
	const w = nw * scale
	const h = nh * scale
	const x =
		device.left != null ? device.left * canvasW : canvasW - device.right! * canvasW - w
	const y = device.top * canvasH
	return { x, y, w, h, x2: x + w, y2: y + h }
}

/** Axis-aligned bounds of a rectangle rotated around its center (matches CSS transform-origin: center). */
function rotatedBoundsAroundCenter(w: number, h: number, rotateDeg: number) {
	const rad = (Math.abs(rotateDeg) * Math.PI) / 180
	return {
		w: Math.abs(w * Math.cos(rad)) + Math.abs(h * Math.sin(rad)),
		h: Math.abs(w * Math.sin(rad)) + Math.abs(h * Math.cos(rad))
	}
}

function layoutCompositionBounds(
	canvasW: number,
	canvasH: number,
	slots: StageDeviceSlot[],
	deviceScale: number,
	shadowPad: number
) {
	let minX = Number.POSITIVE_INFINITY
	let minY = Number.POSITIVE_INFINITY
	let maxX = Number.NEGATIVE_INFINITY
	let maxY = Number.NEGATIVE_INFINITY

	for (const slot of slots) {
		const rect = deviceRect(canvasW, canvasH, slot, deviceScale)
		const cx = rect.x + rect.w / 2
		const cy = rect.y + rect.h / 2
		const bound = rotatedBoundsAroundCenter(rect.w, rect.h, slot.rotate)
		const x0 = cx - bound.w / 2 - shadowPad
		const y0 = cy - bound.h / 2 - shadowPad
		const x1 = cx + bound.w / 2 + shadowPad
		const y1 = cy + bound.h / 2 + shadowPad
		minX = Math.min(minX, x0)
		minY = Math.min(minY, y0)
		maxX = Math.max(maxX, x1)
		maxY = Math.max(maxY, y1)
	}

	return {
		minX,
		minY,
		maxX,
		maxY,
		compositionW: maxX - minX,
		compositionH: maxY - minY
	}
}

function round4(n: number) {
	return Number(n.toFixed(4))
}

export function getLandingStageLayoutKey(
	variant: 'hero' | 'compact' | string,
	containerWidth: number
): LandingStageLayoutKey {
	if (variant === 'hero') {
		return containerWidth <= 520 ? 'hero-mobile' : 'hero'
	}
	if (variant === 'compact') return 'compact'
	return 'feature'
}

export function getLandingStageDevices(layoutKey: LandingStageLayoutKey): StageDeviceSlot[] {
	return LAYOUTS[layoutKey]
}

export function cloneLandingStageSlots(slots: StageDeviceSlot[]): StageDeviceSlot[] {
	return slots.map((slot) => ({ ...slot }))
}

/**
 * Fit the device composition (design canvas) into the stage and center it via CSS cluster transform.
 */
export function computeLandingStageScaleResult(
	containerW: number,
	containerH: number,
	slots: StageDeviceSlot[],
	options: ComputeStageScaleOptions = {}
): LandingStageScaleResult {
	const padding = (options.padding ?? 12) + (options.filterBleed ?? 0)
	const shadowPad = options.shadowPad ?? 24
	const fitMargin = options.fitMargin ?? 1.06
	const inset = padding
	const minScale = options.minScale ?? 0.22
	const maxScale = options.maxScale ?? 0.56
	const layoutKey = options.layoutKey ?? 'feature'
	const label = options.debugLabel ?? `landing-stage:${layoutKey}`
	const { w: canvasW, h: canvasH } = getLandingStageDesignCanvas(layoutKey)

	if (containerW <= 0 || containerH <= 0 || slots.length === 0) {
		return {
			scale: minScale,
			layoutKey,
			label,
			container: { w: Math.round(containerW), h: Math.round(containerH) },
			raw: minScale,
			padding,
			minScale,
			maxScale,
			composition: { w: 0, h: 0 },
			placed: [],
			bbox: null,
			constraints: []
		}
	}

	const layoutBounds = layoutCompositionBounds(canvasW, canvasH, slots, 1, shadowPad)
	const { minX, minY, compositionW, compositionH } = layoutBounds
	const rects = slots.map((slot) => deviceRect(canvasW, canvasH, slot, 1))

	const scaleW = (containerW - inset * 2) / compositionW
	const scaleH = (containerH - inset * 2) / compositionH
	const constraints = [
		{ label: 'fit composition width', scale: scaleW },
		{ label: 'fit composition height', scale: scaleH }
	]
	const raw = Math.min(scaleW, scaleH)
	const autoScale = Math.min(maxScale, Math.max(minScale, raw / fitMargin))
	const scale =
		options.scaleOverride != null
			? Math.min(maxScale, Math.max(minScale, options.scaleOverride))
			: autoScale

	const placed: PlacedStageDevice[] = slots.map((slot, i) => {
		const mult = slot.scaleMult ?? 1
		// CSS scales from center on native mockup size; shift top-left to match layout bbox.
		const anchorX = (slot.w * (mult - 1)) / 2
		const anchorY = (slot.h * (mult - 1)) / 2
		return {
			id: slot.id,
			x: Math.round(rects[i].x - minX + anchorX),
			y: Math.round(rects[i].y - minY + anchorY),
			w: slot.w,
			h: slot.h,
			rotate: slot.rotate,
			scaleMult: mult,
			zIndex: getStageDeviceZIndex(slot)
		}
	})

	const scaledW = compositionW * scale
	const scaledH = compositionH * scale
	const offsetX = (containerW - scaledW) / 2
	const offsetY = (containerH - scaledH) / 2

	return {
		scale,
		layoutKey,
		label,
		container: { w: Math.round(containerW), h: Math.round(containerH) },
		raw: round4(raw),
		padding,
		minScale,
		maxScale,
		composition: { w: Math.round(compositionW), h: Math.round(compositionH) },
		placed,
		bbox: {
			minX: Math.round(offsetX),
			minY: Math.round(offsetY),
			maxX: Math.round(offsetX + scaledW),
			maxY: Math.round(offsetY + scaledH)
		},
		constraints: constraints
			.sort((a, b) => a.scale - b.scale)
			.map((c) => ({ label: c.label, scale: round4(c.scale) }))
	}
}

export function applyLandingStageLayout(el: HTMLElement, result: LandingStageScaleResult) {
	el.style.setProperty('--device-scale', String(result.scale))
	el.style.setProperty('--composition-w', `${result.composition.w}px`)
	el.style.setProperty('--composition-h', `${result.composition.h}px`)

	for (const device of result.placed) {
		const prefix = `--device-${device.id}`
		el.style.setProperty(`${prefix}-x`, `${device.x}px`)
		el.style.setProperty(`${prefix}-y`, `${device.y}px`)
		el.style.setProperty(`${prefix}-rotate`, `${device.rotate}deg`)
		el.style.setProperty(`${prefix}-mult`, String(device.scaleMult))
		el.style.setProperty(`${prefix}-z`, String(device.zIndex))
	}
}

export function computeLandingStageScale(
	containerW: number,
	containerH: number,
	slots: StageDeviceSlot[],
	options: ComputeStageScaleOptions = {}
): number {
	return computeLandingStageScaleResult(containerW, containerH, slots, options).scale
}

export function formatLandingStageScaleReport(result: LandingStageScaleResult): string {
	const lines = [
		'=== landing-stage scale debug ===',
		`label: ${result.label}`,
		`layout: ${result.layoutKey}`,
		`container: ${result.container.w} x ${result.container.h} px`,
		`design canvas: ${getLandingStageDesignCanvas(result.layoutKey).w} x ${getLandingStageDesignCanvas(result.layoutKey).h} px`,
		`composition: ${result.composition.w} x ${result.composition.h} px`,
		`padding: ${result.padding} px`,
		`scale: ${round4(result.scale)} (raw ${result.raw}, fit margin applied, clamp ${result.minScale}–${result.maxScale})`,
		''
	]

	if (result.placed.length > 0) {
		lines.push('devices in composition (px, before cluster scale):')
		for (const d of result.placed) {
			lines.push(
				`  ${d.id}: x=${d.x} y=${d.y} ${d.w}x${d.h} rotate=${d.rotate} mult=${d.scaleMult} z=${d.zIndex}`
			)
		}
		lines.push('')
	}

	if (result.bbox) {
		lines.push(
			'cluster bbox in container (centered):',
			`  x: ${result.bbox.minX} … ${result.bbox.maxX} (span ${result.bbox.maxX - result.bbox.minX})`,
			`  y: ${result.bbox.minY} … ${result.bbox.maxY} (span ${result.bbox.maxY - result.bbox.minY})`,
			''
		)
	}

	if (result.constraints.length > 0) {
		lines.push('constraints (tightest first):')
		for (const c of result.constraints) {
			const marker = c.scale === round4(result.raw) ? '  ← limits scale' : ''
			lines.push(`  ${c.scale}\t${c.label}${marker}`)
		}
	}

	lines.push('', '=== end ===')
	return lines.join('\n')
}
