export type LandingHighlight = {
	title: string
	description: string
}

export type LandingPillar = {
	value: string
	label: string
}

export type LandingFeatureVisual =
	| 'editor'
	| 'color'
	| 'shield'
	| 'devices'
	| 'feed'
	| 'map'
	| 'chart'
	| 'settings'

/** Paths under `public/` for device stage mockups. */
export type LandingSectionScreenshots = {
	iphone: string
	ipad: string
	/** Second iPhone layer in hero stage only. */
	iphoneSecondary?: string
}

export type LandingScreenshotsConfig = {
	hero: LandingSectionScreenshots
	/** Closing CTA stage (`variant="compact"`). */
	closing?: LandingSectionScreenshots
}

export type LandingFeature = {
	eyebrow?: string
	title: string
	description: string
	bullets?: string[]
	visualOnLeft?: boolean
	visual: LandingFeatureVisual
	screenshots: LandingSectionScreenshots
}

export type LandingGridIconId =
	| 'upload'
	| 'sun'
	| 'mixer'
	| 'curves'
	| 'layers'
	| 'color-wheel'
	| 'history'
	| 'device'
	| 'export'
	| 'globe'
	| 'sensor'
	| 'pin'
	| 'star'
	| 'scale'
	| 'search'
	| 'chart'
	| 'heart'
	| 'lock'

export type LandingGridItem = {
	icon: LandingGridIconId
	title: string
	description: string
}

export type LandingShowcase = {
	quote: string
	attribution?: string
}

export type LandingBlogSection = {
	/** Default: "Read our blog". */
	title?: string
	/** Default: `/blog`. */
	href?: string
	/** Optional roadmap teaser (second column). */
	roadmapEyebrow?: string
	roadmapTitle?: string
	/** Default: `/{appSlug}/roadmap`. */
	roadmapHref?: string
}

export type LandingTechItem = {
	title: string
	description: string
}

/** Editorial photo block — set `src` when marketing still is ready. */
export type LandingPhotoMoment = {
	id: string
	layout: 'spotlight' | 'cinema' | 'split'
	eyebrow?: string
	title?: string
	caption: string
	/** Primary image (also used as left slot in spotlight). */
	src?: string
	/** Right slot for spotlight layout only. */
	srcSecondary?: string
	alt?: string
	/** Labels under each image in spotlight comparison (primary = left, secondary = right). */
	compareLabels?: { primary: string; secondary: string }
	/** Cycle through pairs from `config/compare-content.ts`. */
	compareSet?: string
	/** Autoplay interval for compare carousel (ms). Default 5000. */
	compareIntervalMs?: number
	/** Insert split moment after this feature index (0-based). */
	afterFeature?: number
}

export type AppLandingConfig = {
	heroEyebrow: string
	heroTitle: string
	heroLead: string
	/** Paths under `public/` for hero, features, and closing stages. */
	screenshots: LandingScreenshotsConfig
	pillars: LandingPillar[]
	showcase?: LandingShowcase
	/** Halide-style photo bands — placeholders until assets are added. */
	photoMoments?: LandingPhotoMoment[]
	highlights?: LandingHighlight[]
	features: LandingFeature[]
	grid: {
		/** Headline above the primary 2×2 grid. */
		title?: string
		lead?: string
		/** Halide-style 2×2 hero feature cards (typically four). */
		primary?: LandingGridItem[]
		/** Headline above the smaller secondary grid. */
		secondaryTitle?: string
		secondaryLead?: string
		items: LandingGridItem[]
	}
	tech?: {
		title: string
		lead: string
		items: LandingTechItem[]
	}
	blog?: LandingBlogSection
	closingTitle: string
	closingLead: string
	platformsLine: string
}
