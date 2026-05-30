export type RoadmapItemStatus = 'shipped' | 'in_progress' | 'planned'

export type RoadmapColumnKind = 'released' | 'quarter' | 'later'

/** One column on the board, ordered left → right (time). */
export type RoadmapColumn = {
	id: string
	label: string
	subtitle?: string
	kind: RoadmapColumnKind
}

export type RoadmapItem = {
	title: string
	description: string
	status: RoadmapItemStatus
	/** Column id from `columns`; if omitted, inferred from status and `eta`. */
	quarterId?: string
	/** Optional note when target differs from the column label. */
	eta?: string
}

export type AppRoadmapConfig = {
	intro: string
	lastUpdated: string
	/** Board columns, oldest → newest. First column should be `released`. */
	columns: RoadmapColumn[]
	/** Default column for in-progress items without `quarterId`. */
	currentQuarterId: string
	items: RoadmapItem[]
}
