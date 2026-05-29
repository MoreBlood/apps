import type { AppLandingConfig } from '@/types/landing'

export const landingBySlug: Record<string, AppLandingConfig> = {
	rawclinic: {
		heroEyebrow: 'ProRAW · iPhone & iPad',
		heroTitle: 'Your iPhone shoots great photos.\nMake them greater.',
		heroLead:
			'Develop ProRAW on iPhone or iPad. Ease off crunchy Deep Fusion and skip the laptop and Lightroom subscription.',
		pillars: [
			{ value: 'Free', label: 'No subscription' },
			{ value: 'Private', label: 'On your device' }
		],
		photoMoments: [
			{
				id: 'raw-spotlight',
				layout: 'spotlight',
				eyebrow: 'ProRAW in the wild',
				title: 'Ever notice something off about your photos?',
				caption:
					'Bigger sensors and smarter pipelines do not always mean better files, often just heavier sharpening and contrast baked in for everyone.',
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
					'Add ProRAW from Photos or Files, sort your queue, and apply your look shot to shot, or paste a grade from a reference frame.',
				bullets: ['Built on Apple\'s on-device RAW pipeline.'],
				visualOnLeft: true,
				visual: 'editor'
			},
			{
				eyebrow: 'Export',
				title: 'Export when ready. Repeat.',
				description:
					'Save JPG, HEIC, or TIFF to Photos or Share. Your originals stay untouched; the queue is ready for the next session.',
				visual: 'color'
			}
		],
		grid: {
			title: 'ProRAW editing, pocket size.',
			lead: 'Six tools that stay with your library on iPhone and iPad.',
			primary: [
				{
					icon: 'sun',
					title: 'Dial back Deep Fusion',
					description: 'Embedded, Balanced, or Neutral baselines.'
				},
				{
					icon: 'device',
					title: 'Built-in RAW camera',
					description:
						'Shoot DNG in-app on iPhone or iPad. Capture and grade without leaving RAW Clinic.'
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
			'Open a roll from Photos and see how far you can push ProRAW before you export.',
		platformsLine: 'Free on the App Store'
	},
	'aqi-sense': {
		heroEyebrow: 'Air quality · iOS',
		heroTitle: 'Know the air you breathe, near you and around the world.',
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
				caption:
					'Live readings from open networks, with favorites, map, and regional scales in one calm app.'
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
				description: 'WAQI, Sensor.Community, or OpenSenseMap: US EPA, China, or European CAQI.',
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
					description: 'Global city coverage when you need context away from home.'
				},
				{
					icon: 'sensor',
					title: 'Sensor.Community',
					description: 'Community sensors for hyperlocal readings.'
				},
				{
					icon: 'pin',
					title: 'OpenSenseMap',
					description: 'Citizen science stations you can explore on the map.'
				},
				{
					icon: 'scale',
					title: 'Your AQI scale',
					description: 'US EPA, China, or European CAQI. Pick the scale you prefer.'
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
		closingLead: 'Pin the stations you check daily and open the map when you travel.',
		platformsLine: 'Available on the App Store'
	}
}

export function getLandingBySlug(slug: string): AppLandingConfig | null {
	return landingBySlug[slug] ?? null
}
