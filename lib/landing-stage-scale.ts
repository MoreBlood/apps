import { MOCKUP_IPAD, MOCKUP_IPHONE } from '@/lib/device-mockup-sizes'

export type LandingStageLayoutKey = 'hero-mobile' | 'feature'

export type StageDeviceId = 'ipad' | 'iphone' | 'iphone-secondary'

export type StageAnchoredDevice = {
	w: number
	h: number
	/** Fraction of container width offset from viewport center (+ = right). */
	left?: number
	/** Fraction of container height offset from viewport center (+ = down). */
	top: number
	/** @deprecated Use `left` as negative offset from center. */
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
	/** Fraction of container width from center. */
	x: number
	/** Fraction of container height from center. */
	y: number
	w: number
	h: number
	rotate: number
	scaleMult: number
	zIndex: number
}

const LAYOUTS: Record<LandingStageLayoutKey, StageDeviceSlot[]> = {
	'hero-mobile': [
		{ id: 'ipad', left: 0.05, top: 0, rotate: 0, zIndex: 1, ...MOCKUP_IPAD },
		{ id: 'iphone', left: -0.1, top: 0.12, rotate: 0, zIndex: 2, ...MOCKUP_IPHONE }
	],
	feature: [
		{ id: 'ipad', left: 0.05, top: 0, rotate: 0, zIndex: 1, ...MOCKUP_IPAD },
		{ id: 'iphone', left: -0.1, top: 0.07, rotate: 0, zIndex: 2, ...MOCKUP_IPHONE }
	]
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
	/** Scaled bbox of all devices in the container. */
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
	'hero-mobile': { scaleOverride: 0.21 },
	feature: { padding: 0, fitMargin: 1, maxScale: 0.46 }
}

function nativeSize(device: StageAnchoredDevice) {
	const mult = device.scaleMult ?? 1
	return { w: device.w * mult, h: device.h * mult }
}

/** Horizontal fraction from center: +right uses `left`, +left uses `-right`. */
export function stageOffsetXFraction(device: StageAnchoredDevice): number {
	if (device.left != null) return device.left
	if (device.right != null) return -device.right
	return 0
}

/** Device top-left in container px; anchor is device center. */
export function deviceRect(containerW: number, containerH: number, device: StageAnchoredDevice, layoutScale: number) {
	const { w: nw, h: nh } = nativeSize(device)
	const w = nw * layoutScale
	const h = nh * layoutScale
	const cx = containerW / 2 + stageOffsetXFraction(device) * containerW
	const cy = containerH / 2 + device.top * containerH
	const x = cx - w / 2
	const y = cy - h / 2
	return { x, y, w, h, cx, cy, x2: x + w, y2: y + h }
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
	containerW: number,
	containerH: number,
	slots: StageDeviceSlot[],
	deviceScale: number,
	shadowPad: number
) {
	let minX = Number.POSITIVE_INFINITY
	let minY = Number.POSITIVE_INFINITY
	let maxX = Number.NEGATIVE_INFINITY
	let maxY = Number.NEGATIVE_INFINITY

	for (const slot of slots) {
		const rect = deviceRect(containerW, containerH, slot, deviceScale)
		const bound = rotatedBoundsAroundCenter(rect.w, rect.h, slot.rotate)
		const x0 = rect.cx - bound.w / 2 - shadowPad
		const y0 = rect.cy - bound.h / 2 - shadowPad
		const x1 = rect.cx + bound.w / 2 + shadowPad
		const y1 = rect.cy + bound.h / 2 + shadowPad
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

function snapLayoutFraction(value: number) {
	return Math.round(value * 100) / 100
}

const CLUSTER_SCALE_STEP = 0.01

/** How far scaled cluster size / centering deviates from whole pixels (lower is crisper). */
export function clusterPixelSnapScore(
	scale: number,
	compositionW: number,
	compositionH: number,
	containerW: number,
	containerH: number
): number {
	const scaledW = compositionW * scale
	const scaledH = compositionH * scale
	const offsetX = (containerW - scaledW) / 2
	const offsetY = (containerH - scaledH) / 2
	return (
		Math.abs(scaledW - Math.round(scaledW)) +
		Math.abs(scaledH - Math.round(scaledH)) +
		Math.abs(offsetX - Math.round(offsetX)) +
		Math.abs(offsetY - Math.round(offsetY))
	)
}

/**
 * Nudge cluster scale to the nearest 0.01 step that lands composition size and centering on whole pixels.
 */
/** Largest scale where the rotated device bbox stays inside the stage (with padding). */
export function findMaxScaleThatFitsBbox(
	containerW: number,
	containerH: number,
	slots: StageDeviceSlot[],
	shadowPad: number,
	padding: number,
	minScale: number,
	maxScale: number
): number {
	if (slots.length === 0) return minScale

	const fits = (scale: number) => {
		const { minX, minY, maxX, maxY } = layoutCompositionBounds(containerW, containerH, slots, scale, shadowPad)
		return minX >= padding && minY >= padding && maxX <= containerW - padding && maxY <= containerH - padding
	}

	if (fits(maxScale)) return maxScale
	if (!fits(minScale)) return minScale

	let lo = minScale
	let hi = maxScale
	for (let i = 0; i < 24; i++) {
		const mid = (lo + hi) / 2
		if (fits(mid)) lo = mid
		else hi = mid
	}
	return Number(lo.toFixed(4))
}

export function snapClusterScale(
	scale: number,
	compositionW: number,
	compositionH: number,
	containerW: number,
	containerH: number,
	minScale: number,
	maxScale: number,
	maxNudge = 0.03
): number {
	const base = Math.round(scale / CLUSTER_SCALE_STEP) * CLUSTER_SCALE_STEP
	let best = Math.min(maxScale, Math.max(minScale, base))
	let bestScore = clusterPixelSnapScore(best, compositionW, compositionH, containerW, containerH)
	let bestDist = Math.abs(best - scale)

	const steps = Math.ceil(maxNudge / CLUSTER_SCALE_STEP)
	for (let i = -steps; i <= steps; i++) {
		const candidate = Math.min(maxScale, Math.max(minScale, base + i * CLUSTER_SCALE_STEP))
		const score = clusterPixelSnapScore(candidate, compositionW, compositionH, containerW, containerH)
		const dist = Math.abs(candidate - scale)
		if (score < bestScore - 1e-6 || (Math.abs(score - bestScore) < 1e-6 && dist < bestDist)) {
			best = candidate
			bestScore = score
			bestDist = dist
		}
	}

	return Number(best.toFixed(2))
}

export function getLandingStageLayoutKey(
	variant: 'hero' | 'compact' | string,
	containerWidth: number
): LandingStageLayoutKey {
	if (variant === 'hero') {
		return 'hero-mobile'
	}
	return 'feature'
}

export function getLandingStageDevices(layoutKey: LandingStageLayoutKey): StageDeviceSlot[] {
	return LAYOUTS[layoutKey]
}

export function cloneLandingStageSlots(slots: StageDeviceSlot[]): StageDeviceSlot[] {
	return slots.map((slot) => ({ ...slot }))
}

/**
 * Fit mockups into the stage. Positions are % of container W/H from the viewport center.
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
	const minScale = options.minScale ?? 0.05
	const maxScale = options.maxScale ?? 0.56
	const layoutKey = options.layoutKey ?? 'feature'
	const label = options.debugLabel ?? `landing-stage:${layoutKey}`

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

	const layoutBounds = layoutCompositionBounds(containerW, containerH, slots, 1, shadowPad)
	const { compositionW, compositionH } = layoutBounds

	const scaleW = (containerW - inset * 2) / compositionW
	const scaleH = (containerH - inset * 2) / compositionH
	const constraints = [
		{ label: 'fit composition width', scale: scaleW },
		{ label: 'fit composition height', scale: scaleH }
	]
	const raw = Math.min(scaleW, scaleH)
	const bboxFitScale = findMaxScaleThatFitsBbox(
		containerW,
		containerH,
		slots,
		shadowPad,
		inset,
		minScale,
		Math.min(maxScale, raw / fitMargin)
	)
	const autoScale = bboxFitScale
	const unclamped =
		options.scaleOverride != null ? Math.min(maxScale, Math.max(minScale, options.scaleOverride)) : autoScale
	const snapped = snapClusterScale(unclamped, compositionW, compositionH, containerW, containerH, minScale, maxScale)
	const fitted =
		options.scaleOverride != null
			? snapped
			: findMaxScaleThatFitsBbox(containerW, containerH, slots, shadowPad, inset, minScale, snapped)
	let scale = Number(fitted.toFixed(2))
	if (options.scaleOverride == null) {
		const fitsAt = (candidate: number) => {
			const { minX, minY, maxX, maxY } = layoutCompositionBounds(containerW, containerH, slots, candidate, shadowPad)
			return minX >= inset && minY >= inset && maxX <= containerW - inset && maxY <= containerH - inset
		}
		while (scale > minScale && !fitsAt(scale)) {
			scale = Number((scale - CLUSTER_SCALE_STEP).toFixed(2))
		}
	}

	const placed: PlacedStageDevice[] = slots.map((slot) => ({
		id: slot.id,
		x: snapLayoutFraction(stageOffsetXFraction(slot)),
		y: snapLayoutFraction(slot.top),
		w: slot.w,
		h: slot.h,
		rotate: Math.round(slot.rotate),
		scaleMult: slot.scaleMult ?? 1,
		zIndex: getStageDeviceZIndex(slot)
	}))

	const scaledBounds = layoutCompositionBounds(containerW, containerH, slots, scale, shadowPad)

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
			minX: Math.round(scaledBounds.minX),
			minY: Math.round(scaledBounds.minY),
			maxX: Math.round(scaledBounds.maxX),
			maxY: Math.round(scaledBounds.maxY)
		},
		constraints: constraints.sort((a, b) => a.scale - b.scale).map((c) => ({ label: c.label, scale: round4(c.scale) }))
	}
}

export function applyLandingStageLayout(el: HTMLElement, result: LandingStageScaleResult) {
	el.style.setProperty('--device-scale', result.scale.toFixed(2))

	for (const device of result.placed) {
		const prefix = `--device-${device.id}`
		el.style.setProperty(`${prefix}-x`, `${device.x * 100}%`)
		el.style.setProperty(`${prefix}-y`, `${device.y * 100}%`)
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
		`composition (device bounds): ${result.composition.w} x ${result.composition.h} px`,
		`padding: ${result.padding} px`,
		`scale: ${round4(result.scale)} (raw ${result.raw}, fit margin applied, clamp ${result.minScale}–${result.maxScale})`,
		''
	]

	if (result.placed.length > 0) {
		lines.push('devices (offset from viewport center, % of container W/H):')
		for (const d of result.placed) {
			lines.push(
				`  ${d.id}: left=${d.x * 100}% top=${d.y * 100}% ${d.w}x${d.h} rotate=${d.rotate} mult=${d.scaleMult} z=${d.zIndex}`
			)
		}
		lines.push('')
	}

	if (result.bbox) {
		lines.push(
			'scaled bbox in container:',
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
