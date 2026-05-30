/** `default` — hero, closing, etc. Feature rows alternate `iphone-left` / `ipad-left`. */
export type LandingStageLayoutKey = 'default' | 'iphone-left' | 'ipad-left'

export type StageDeviceId = 'ipad' | 'iphone' | 'iphone-secondary'

/** Design-space reference; slot offsets are px from this artboard center. */
export type StageArtboard = { readonly w: number; readonly h: number }

export type StageAnchoredDevice = {
	w: number
	h: number
	/** Px from artboard center (+ = right). */
	x?: number
	/** Px from artboard center (+ = down). */
	y?: number
	/** @deprecated Use `x` (px). Legacy fraction of artboard width. */
	left?: number
	/** @deprecated Use `-x`. Legacy fraction of artboard width. */
	right?: number
	/** @deprecated Use `y` (px). Legacy fraction of artboard height. */
	top?: number
	scaleMult?: number
	zIndex?: number
}

export type StageDeviceSlot = StageAnchoredDevice & {
	id: StageDeviceId
	rotate: number
}

export type PlacedStageDevice = {
	id: StageDeviceId
	/** Px from composition top-left to device center. */
	x: number
	y: number
	w: number
	h: number
	rotate: number
	scaleMult: number
	zIndex: number
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
	bbox: { minX: number; minY: number; maxX: number; maxY: number } | null
	constraints: { label: string; scale: number }[]
}

export type ComputeStageScaleOptions = {
	padding?: number
	shadowPad?: number
	/** @deprecated Merged into `padding`. */
	filterBleed?: number
	fitMargin?: number
	/** Multiplier applied after auto-fit (e.g. 1.2 = 20% larger). */
	clusterScaleMult?: number
	minScale?: number
	maxScale?: number
	debugLabel?: string
	layoutKey?: LandingStageLayoutKey
	scaleOverride?: number
}

export type LandingStageLayoutOptions = {
	/** Deep feature row index (0 = Capture …). Alternates iphone-left / ipad-left. */
	featureIndex?: number
}
