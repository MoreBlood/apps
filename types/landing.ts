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

export type LandingFeature = {
	eyebrow?: string
	title: string
	description: string
	bullets?: string[]
	visualOnLeft?: boolean
	visual: LandingFeatureVisual
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

export type LandingGridItem = {
	icon: LandingGridIconId
	title: string
	description: string
}

export type LandingShowcase = {
	quote: string
	attribution: string
}

export type LandingTechItem = {
	title: string
	description: string
}

export type AppLandingConfig = {
	heroEyebrow: string
	heroTitle: string
	heroLead: string
	pillars: LandingPillar[]
	showcase: LandingShowcase
	highlights: LandingHighlight[]
	features: LandingFeature[]
	grid: {
		title: string
		lead: string
		items: LandingGridItem[]
	}
	tech: {
		title: string
		lead: string
		items: LandingTechItem[]
	}
	closingTitle: string
	closingLead: string
	platformsLine: string
}
