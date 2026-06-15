import type { AppRoadmapConfig } from '@/types/roadmap'

const RAWCLINIC_COLUMNS: AppRoadmapConfig['columns'] = [
	{ id: 'released', label: 'Shipped', subtitle: 'In the App Store', kind: 'released' },
	{ id: '2026-q2', label: 'Q2 2026', subtitle: 'Apr–Jun', kind: 'quarter' },
	{ id: '2026-q3', label: 'Q3 2026', subtitle: 'Jul–Sep', kind: 'quarter' },
	{ id: '2026-q4', label: 'Q4 2026', subtitle: 'Oct–Dec', kind: 'quarter' },
	{ id: 'later', label: 'Later', subtitle: 'Exploring', kind: 'later' }
]

const AQI_COLUMNS: AppRoadmapConfig['columns'] = [
	{ id: 'released', label: 'Shipped', subtitle: 'In the App Store', kind: 'released' },
	{ id: '2026-q2', label: 'Q2 2026', subtitle: 'Apr–Jun', kind: 'quarter' },
	{ id: '2026-q3', label: 'Q3 2026', subtitle: 'Jul–Sep', kind: 'quarter' },
	{ id: '2026-q4', label: 'Q4 2026', subtitle: 'Oct–Dec', kind: 'quarter' },
	{ id: 'later', label: 'Later', subtitle: 'Exploring', kind: 'later' }
]

export const roadmapBySlug: Record<string, AppRoadmapConfig> = {
	rawclinic: {
		intro:
			'What we have shipped, what we are building now, and what is on the horizon for RAW Clinic. Timelines are estimates and may shift as we learn from your feedback.',
		lastUpdated: 'May 2026',
		columns: RAWCLINIC_COLUMNS,
		currentQuarterId: '2026-q2',
		items: [
			{
				title: 'RAW import from Photos',
				description: 'Open common camera RAW formats from your library and start editing in seconds.',
				status: 'shipped'
			},
			{
				title: 'Exposure, contrast, and tone',
				description: 'Core adjustments tuned for RAW dynamic range, including highlight and shadow recovery.',
				status: 'shipped'
			},
			{
				title: 'Color and white balance',
				description: 'Saturation, temperature, and tint controls with live preview while you edit.',
				status: 'shipped'
			},
			{
				title: 'Nondestructive workflow',
				description: 'Experiment freely — your original RAW file stays intact on device.',
				status: 'shipped'
			},
			{
				title: '100% on-device processing',
				description: 'No cloud upload required; edits and previews run locally on iPhone and iPad.',
				status: 'shipped'
			},
			{
				title: 'Export to Photos library',
				description: 'Save finished edits back to your library when you are ready to share or archive.',
				status: 'shipped'
			},
			{
				title: 'Native SwiftUI for iOS',
				description: 'Fluid gestures, sharp previews, and a focused mobile editing experience.',
				status: 'shipped'
			},
			{
				title: 'Curves and advanced tone',
				description: 'Finer control over tonal response beyond basic sliders.',
				status: 'in_progress',
				quarterId: '2026-q2'
			},
			{
				title: 'Batch export',
				description: 'Apply your last settings and export multiple edited shots in one pass.',
				status: 'in_progress',
				quarterId: '2026-q2'
			},
			{
				title: 'Histogram and clipping indicators',
				description: 'See where highlights and shadows clip while you adjust exposure.',
				status: 'planned',
				quarterId: '2026-q3'
			},
			{
				title: 'Looks and presets',
				description: 'Save and reuse favorite grading starting points across similar scenes.',
				status: 'planned',
				quarterId: '2026-q4'
			},
			{
				title: 'Shortcuts actions',
				description: 'Open recent RAW files or run export from the Shortcuts app.',
				status: 'planned',
				quarterId: 'later'
			},
			{
				title: 'iPad multi-window',
				description: 'Compare two edits side by side or reference a contact sheet while you work.',
				status: 'planned',
				quarterId: 'later'
			}
		]
	},
	'aqi-sense': {
		intro:
			'Our public plan for AQI Sense — live data, maps, and alerts. Priorities change based on provider APIs and community feedback.',
		lastUpdated: 'May 2026',
		columns: AQI_COLUMNS,
		currentQuarterId: '2026-q2',
		items: [
			{
				title: 'Live AQI feed',
				description: 'Saved stations and nearby sensors in one pull-to-refresh list with pollutant breakdown.',
				status: 'shipped'
			},
			{
				title: 'Interactive map',
				description: 'Clustered markers, pan and zoom, and tap-through to full station details.',
				status: 'shipped'
			},
			{
				title: 'Station details and forecasts',
				description: 'PM2.5, PM10, O₃, NO₂, and multi-day forecast charts when the provider supplies them.',
				status: 'shipped'
			},
			{
				title: 'Multiple data providers',
				description: 'WAQI, Sensor.Community, and OpenSenseMap selectable in Settings.',
				status: 'shipped'
			},
			{
				title: 'Regional AQI scales',
				description: 'US EPA, China (HJ 633-2012), and European CAQI in one app.',
				status: 'shipped'
			},
			{
				title: 'Search and favorites',
				description: 'Find stations by place name and keep frequent locations with SwiftData.',
				status: 'shipped'
			},
			{
				title: 'Onboarding and settings',
				description: 'First-launch tour and per-provider preferences.',
				status: 'shipped'
			},
			{
				title: 'Home Screen widgets',
				description: 'Glanceable AQI for your top saved stations without opening the app.',
				status: 'in_progress',
				quarterId: '2026-q2'
			},
			{
				title: 'AQI threshold alerts',
				description: 'Optional notifications when air quality crosses levels you care about.',
				status: 'in_progress',
				quarterId: '2026-q2'
			},
			{
				title: 'Apple Watch complications',
				description: 'Current AQI on your wrist for a chosen favorite station.',
				status: 'planned',
				quarterId: '2026-q3'
			},
			{
				title: 'Shareable station cards',
				description: 'Export a readable snapshot of today’s reading for messages or social posts.',
				status: 'planned',
				quarterId: '2026-q4'
			},
			{
				title: 'Historical trends',
				description: 'Longer-range charts for saved stations when data history is available.',
				status: 'planned',
				quarterId: 'later'
			},
			{
				title: 'Lock Screen Live Activities',
				description: 'Follow a station’s AQI during outdoor plans without reopening the app.',
				status: 'planned',
				quarterId: 'later'
			}
		]
	}
}

export function getRoadmapBySlug(slug: string): AppRoadmapConfig | null {
	return roadmapBySlug[slug] ?? null
}
