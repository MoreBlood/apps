import type { AppLandingConfig } from '@/types/landing'

export const landingBySlug: Record<string, AppLandingConfig> = {
	rawclinic: {
		heroEyebrow: 'ProRAW · iPhone & iPad',
		heroTitle: 'Apple Pro RAW is not dead.',
		heroLead:
			'Edit ProRAW on your phone like on a desktop — without copying files or opening a laptop. Dial back what Deep Fusion baked in until the photo looks natural again.',
		pillars: [
			{ value: 'No PC', label: 'Full workflow' },
			{ value: 'ProRAW', label: 'Apple RAW' }
		],
		showcase: {
			quote:
				'Humans can develop photos better than Deep Fusion — if you reduce sharpening, edge contrast, and the rest of what Apple embedded in the preview.'
		},
		photoMoments: [
			{
				id: 'raw-spotlight',
				layout: 'spotlight',
				eyebrow: 'ProRAW in the wild',
				title: 'Embedded JPEG vs your grade',
				caption:
					'The same ProRAW frame — Apple\'s embedded preview on the left, a finish from RAW Clinic on the right. Less crunch, more natural light.',
				compareSet: 'rawclinic',
				compareLabels: { primary: 'Embedded JPEG', secondary: 'RAW Clinic' },
				compareIntervalMs: 5000
			}
		],
		features: [
			{
				eyebrow: 'Develop',
				title: 'Finish what Apple started — your way.',
				description:
					'Use Embedded, Balanced, or Neutral as a baseline, then pull back over-sharpening and edge contrast and shape exposure, color, and detail — non-destructive, with compare to the embedded preview.',
				bullets: ['Built on Apple\'s on-device RAW pipeline — not a cloud workaround.'],
				visualOnLeft: true,
				visual: 'color'
			},
			{
				eyebrow: 'Workflow',
				title: 'Shoot with Apple Camera. Edit in RAW Clinic.',
				description:
					'iPhone still wins in low light and hand-held shots. Capture ProRAW in the native camera, import into your queue, and grade without a computer — or use any RAW your library can read.',
				bullets: ['In-app RAW camera when you want capture and edit in one place.'],
				visual: 'devices'
			},
			{
				eyebrow: 'Queue',
				title: 'A focused RAW workspace.',
				description:
					'Sort, filter, copy grades between frames, and export to Photos only when a shot is ready — the queue persists between sessions.',
				visualOnLeft: true,
				visual: 'editor'
			}
		],
		grid: {
			title: 'Professional RAW editing, pocket size.',
			lead: 'Free on iPhone and iPad — the workflow I use every time I develop ProRAW on the go.',
			primary: [
				{
					icon: 'sun',
					title: 'Finish what Apple started',
					description:
						'Embedded, Balanced, or Neutral baselines — then dial back Deep Fusion and shape exposure, color, and detail.'
				},
				{
					icon: 'device',
					title: 'Shoot with Apple Camera',
					description:
						'Capture ProRAW in the native camera, import into your queue, and grade without a computer.'
				},
				{
					icon: 'layers',
					title: 'A focused RAW workspace',
					description:
						'Sort, filter, copy grades between frames, and export to Photos when a shot is ready.'
				},
				{
					icon: 'mixer',
					title: 'Film & Fuji LUTs',
					description: 'Reset, grade, then film looks — or import your own .cube LUT.'
				},
				{
					icon: 'color-wheel',
					title: 'Compare while you edit',
					description: 'Toggle against Apple\'s embedded JPEG preview until the grade looks natural.'
				},
				{
					icon: 'export',
					title: 'Export when ready',
					description: 'JPG, HEIC, or TIFF to Photos or Share when the frame is finished.'
				}
			],
			items: []
		},
		blog: {},
		closingTitle: 'Your RAW journey starts now.',
		closingLead:
			'Try RAW Clinic on your iPhone or iPad — every frame stays flexible until you export.',
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
