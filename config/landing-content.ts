import type { AppLandingConfig } from '@/types/landing'

export const landingBySlug: Record<string, AppLandingConfig> = {
	rawclinic: {
		heroEyebrow: 'ProRAW · iPhone & iPad',
		heroTitle: 'Your iPhone shoots great photos.\nMake them greater.',
		heroLead:
			'Develop ProRAW on iPhone or iPad — dial back crunchy Deep Fusion, keep your library private, and skip the laptop and the Lightroom subscription.',
		pillars: [
			{ value: 'Free', label: 'No subscription' },
			{ value: 'Private', label: 'On your device' }
		],
		showcase: {
			quote:
				'You can often finish ProRAW more naturally than Apple\'s embedded preview — easing sharpening, edge contrast, and the polish baked in along the way.'
		},
		photoMoments: [
			{
				id: 'raw-spotlight',
				layout: 'spotlight',
				eyebrow: 'ProRAW in the wild',
				title: 'Ever notice something off about your photos?',
				caption:
					'Phone cameras keep getting bigger and smarter, yet the images often feel no better — sometimes harsher. Processing tuned to please everyone doesn\'t always look right to you.',
				compareSet: 'rawclinic',
				compareLabels: { primary: 'Embedded JPEG', secondary: 'RAW Clinic' },
				compareIntervalMs: 5000
			}
		],
		features: [
			{
				eyebrow: 'Shoot',
				title: 'Capture in Apple Camera or in-app.',
				description:
					'Use Apple Camera when you want the best hand-held ProRAW, or shoot inside RAW Clinic when capture and edit should stay in one app.',
				visual: 'devices'
			},
			{
				eyebrow: 'Queue',
				title: 'Import, organize, and grade.',
				description:
					'Bring in ProRAW from Photos or Files. Sort your queue, copy grades between shots, and develop with baselines that ease Deep Fusion — plus film LUTs, exposure, color, and embedded preview compare.',
				bullets: ['Built on Apple\'s on-device RAW pipeline.'],
				visualOnLeft: true,
				visual: 'editor'
			},
			{
				eyebrow: 'Export',
				title: 'Export when ready. Repeat.',
				description:
					'Save JPG, HEIC, or TIFF to Photos or Share, then move on. No desktop round trip and no paid editor required — your queue waits for the next session.',
				visual: 'color'
			}
		],
		grid: {
			title: 'ProRAW editing, pocket size.',
			lead: 'For photographers and anyone tired of over-processed iPhone shots — free, private, and on your device.',
			primary: [
				{
					icon: 'sun',
					title: 'Dial back Deep Fusion',
					description: 'Embedded, Balanced, or Neutral baselines.'
				},
				{
					icon: 'color-wheel',
					title: 'Embedded preview compare',
					description:
						'See what Apple baked in while you grade. ProRAW and most camera RAW your library can open.'
				},
				{
					icon: 'mixer',
					title: 'Film & Fuji LUTs',
					description: 'Built-in looks. Import .cube LUTs.'
				},
				{
					icon: 'layers',
					title: 'Copy grades',
					description: 'Paste your look across similar shots.'
				},
				{
					icon: 'history',
					title: 'Nondestructive',
					description: 'Your original RAW stays intact.'
				},
				{
					icon: 'lock',
					title: 'On your device only',
					description: 'Private. No cloud. No account.'
				}
			],
			items: []
		},
		blog: {
			roadmapEyebrow: 'Product',
			roadmapTitle: 'See the roadmap'
		},
		closingTitle: 'Better ProRAW. Still on your phone.',
		closingLead:
			'Free on the App Store — develop naturally, keep your photos private, and leave the subscription editor behind.',
		platformsLine: 'Free on the App Store'
	},
	'aqi-sense': {
		heroEyebrow: 'Air quality · iOS',
		heroTitle: 'Know the air you breathe — near you and around the world.',
		heroLead:
			'Live AQI from WAQI, Sensor.Community, and OpenSenseMap. Favorites, map, and regional scales.',
		pillars: [
			{ value: '3', label: 'Data sources' },
			{ value: 'Live', label: 'Station readings' }
		],
		photoMoments: [
			{
				id: 'aqi-spotlight',
				layout: 'spotlight',
				eyebrow: 'Live AQI',
				caption: 'Photo placeholder — set src / srcSecondary when ready.'
			}
		],
		features: [
			{
				eyebrow: 'Feed',
				title: 'AQI at a glance.',
				description: 'Saved and nearby stations in one list. Pull to refresh.',
				bullets: ['Dominant pollutant on each card.'],
				visualOnLeft: true,
				visual: 'feed'
			},
			{
				eyebrow: 'Map',
				title: 'Explore stations on a map.',
				description: 'Clustered markers, station details, and search by place.',
				bullets: ['Forecasts and pollutant breakdown when available.'],
				visual: 'map'
			},
			{
				eyebrow: 'Settings',
				title: 'Your provider, your scale.',
				description: 'WAQI, Sensor.Community, or OpenSenseMap — US EPA, China, or European CAQI.',
				visualOnLeft: true,
				visual: 'settings'
			}
		],
		grid: {
			title: 'Open data, one calm app.',
			primary: [
				{
					icon: 'globe',
					title: 'WAQI',
					description: 'Global city coverage with dominant pollutant on each card.'
				},
				{
					icon: 'sensor',
					title: 'Sensor.Community',
					description: 'Community sensors nearby — pull to refresh your feed.'
				},
				{
					icon: 'pin',
					title: 'OpenSenseMap',
					description: 'Citizen science stations on the map with search by place.'
				},
				{
					icon: 'scale',
					title: 'Your AQI scale',
					description: 'US EPA, China, or European CAQI — pick the scale you prefer.'
				},
				{
					icon: 'heart',
					title: 'Favorites',
					description: 'Pin places you check daily.'
				},
				{
					icon: 'chart',
					title: 'Forecasts',
					description: 'Pollutant breakdown when the provider has forecast data.'
				}
			],
			items: []
		},
		closingTitle: 'Get AQI Sense',
		closingLead: 'Download AQI Sense for iPhone and iPad.',
		platformsLine: 'Available on the App Store.'
	}
}

export function getLandingBySlug(slug: string): AppLandingConfig | null {
	return landingBySlug[slug] ?? null
}
