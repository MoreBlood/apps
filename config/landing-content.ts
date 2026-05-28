import type { AppLandingConfig } from '@/types/landing'

export const landingBySlug: Record<string, AppLandingConfig> = {
	rawclinic: {
		heroEyebrow: 'RAW photo editing · iOS',
		heroTitle: 'The professional RAW editor for iPhone and iPad.',
		heroLead:
			'RAW Clinic brings desktop-grade editing to your pocket. Recover highlight and shadow detail, shape color with precision, and export finished shots — with every pixel processed locally on your device.',
		pillars: [
			{ value: '100%', label: 'On-device processing' },
			{ value: 'RAW', label: 'Native format support' },
			{ value: 'Pro', label: 'Color & tone tools' }
		],
		showcase: {
			quote:
				'Serious photographers shouldn’t have to leave iOS to respect their RAW files. RAW Clinic is built for that moment between capture and share — fast, private, and uncompromising.',
			attribution: 'Built for photographers who shoot RAW'
		},
		highlights: [
			{
				title: 'Edit RAW with confidence',
				description:
					'Open RAW files from your library and work with the full dynamic range your camera captured.'
			},
			{
				title: 'Privacy by architecture',
				description: 'No cloud pipeline. Your images never leave your device for processing.'
			},
			{
				title: 'Nondestructive workflow',
				description: 'Experiment freely while your original file stays untouched.'
			},
			{
				title: 'Export where you need it',
				description: 'Save edited photos straight back to your Photos library.'
			}
		],
		features: [
			{
				eyebrow: 'RAW workflow',
				title: 'Unlock the full potential of RAW photos.',
				description:
					'Every adjustment in RAW Clinic is designed around extended-range sensor data. Recover detail in crushed shadows and blown highlights, then fine-tune color with the accuracy RAW demands — without sending files to a server.',
				bullets: [
					'Open and edit RAW images directly on iPhone and iPad.',
					'Highlight and shadow recovery tuned for extended dynamic range.',
					'Support for common camera RAW formats available on iOS.'
				],
				visualOnLeft: true,
				visual: 'editor'
			},
			{
				eyebrow: 'Color & tone',
				title: 'Change the look and feel with powerful adjustments.',
				description:
					'From essential exposure and white balance to curves and selective control, shape the character of your image with tools that feel immediate on a touch display.',
				bullets: [
					'Exposure, contrast, saturation, and white balance at your fingertips.',
					'Curves and advanced tone control for enthusiasts.',
					'Live preview so every move is visible instantly.'
				],
				visual: 'color'
			},
			{
				eyebrow: 'Privacy',
				title: 'Your photos stay yours — always.',
				description:
					'RAW Clinic was designed for photographers who treat their library as personal. Processing runs entirely on-device; we don’t operate a cloud rendering farm for your files.',
				bullets: [
					'No upload required to edit.',
					'Works offline once photos are on your device.',
					'No account needed to start editing.'
				],
				visualOnLeft: true,
				visual: 'shield'
			},
			{
				eyebrow: 'Native iOS',
				title: 'Designed exclusively for iPhone and iPad.',
				description:
					'A focused SwiftUI experience with fluid gestures, sharp previews, and integration with the Photos library — so the app feels at home on Apple hardware.',
				bullets: [
					'Optimized layouts for phone and tablet.',
					'Save finished edits back to your library.',
					'A calm, distraction-free editing environment.'
				],
				visual: 'devices'
			},
			{
				eyebrow: 'Finish & share',
				title: 'From edit to export in a single flow.',
				description:
					'When you’re happy with the grade, export at the quality you need and keep moving. RAW Clinic respects the pace of a mobile workflow without sacrificing control.',
				bullets: [
					'Export to Photos when you’re done.',
					'Consistent preview while you dial in the look.',
					'Built for sessions on the go — travel, street, and field work.'
				],
				visualOnLeft: true,
				visual: 'editor'
			}
		],
		grid: {
			title: 'Everything you need for mobile RAW editing.',
			lead: 'A deliberate toolset — no bloat, no subscriptions for core editing. Just the controls RAW shooters reach for first.',
			items: [
				{
					title: 'RAW import',
					description: 'Open RAW files from your library and start editing in seconds.'
				},
				{
					title: 'Exposure & tone',
					description: 'Balance brightness, contrast, and tonal range with precision.'
				},
				{
					title: 'White balance',
					description: 'Correct color temperature and tint for natural skin and skies.'
				},
				{
					title: 'Curves',
					description: 'Sculpt light and color with point-based curve control.'
				},
				{
					title: 'Detail recovery',
					description: 'Pull back information in shadows and highlights.'
				},
				{
					title: 'Saturation & vibrance',
					description: 'Control color intensity without crushing skin tones.'
				},
				{
					title: 'Nondestructive edits',
					description: 'Your original RAW remains the source of truth.'
				},
				{
					title: 'Local processing',
					description: 'The edit pipeline runs on your device only.'
				},
				{
					title: 'Photos export',
					description: 'Deliver finished images back to your library.'
				}
			]
		},
		tech: {
			title: 'Native technologies. Serious performance.',
			lead: 'RAW Clinic is built with modern Apple frameworks so large files stay responsive under your fingers.',
			items: [
				{
					title: 'SwiftUI',
					description: 'Fluid, adaptive interface across iPhone and iPad form factors.'
				},
				{
					title: 'On-device pipeline',
					description: 'Image processing stays local — tuned for mobile thermals and battery.'
				},
				{
					title: 'Photos integration',
					description: 'Import and export through the library you already use.'
				}
			]
		},
		closingTitle: 'Make every RAW shot your best.',
		closingLead:
			'Download RAW Clinic and edit with the confidence that your files never leave your device.',
		platformsLine: 'One app for iPhone and iPad · Available on the App Store.'
	},
	'aqi-sense': {
		heroEyebrow: 'Air quality · iOS',
		heroTitle: 'Know the air you breathe — near you and around the world.',
		heroLead:
			'AQI Sense brings together live readings from WAQI, Sensor.Community, and OpenSenseMap. Follow saved stations, explore the map, and interpret AQI using US, China, or European scales.',
		pillars: [
			{ value: '3', label: 'Data providers' },
			{ value: '3', label: 'AQI scale standards' },
			{ value: 'Live', label: 'Station readings' }
		],
		showcase: {
			quote:
				'Air quality is hyperlocal and personal. AQI Sense puts open sensor networks and global indices in one calm, native app — so you can decide when to open a window, run, or keep kids inside.',
			attribution: 'Built for families, runners, and travelers'
		},
		highlights: [
			{
				title: 'Live AQI at a glance',
				description:
					'Your feed surfaces saved and nearby stations with the latest index, dominant pollutant, and update time.'
			},
			{
				title: 'Map-first exploration',
				description: 'Pan regions with clustered markers and drill into any station in one tap.'
			},
			{
				title: 'Pollutant breakdown',
				description: 'See PM2.5, PM10, O₃, NO₂, and more — not just a single number.'
			},
			{
				title: 'Scales you recognize',
				description: 'Switch between US EPA, China HJ 633, and European CAQI in Settings.'
			}
		],
		features: [
			{
				eyebrow: 'Your feed',
				title: 'See the air you breathe at a glance.',
				description:
					'The home feed unifies favorites and nearby sensors. Pull to refresh, scan AQI categories at a glance, and jump into detail when a reading needs context.',
				bullets: [
					'Saved stations and nearby locations in one list.',
					'Pull to refresh for the latest measurements.',
					'Dominant pollutant and timestamp on every card.'
				],
				visualOnLeft: true,
				visual: 'feed'
			},
			{
				eyebrow: 'Explore',
				title: 'Browse stations on an interactive map.',
				description:
					'Zoom from neighborhood to continent. Clustered markers keep dense cities readable; tap through to forecasts, pollutant charts, and a location preview.',
				bullets: [
					'Marker clustering for busy regions.',
					'Station sheet with charts and mini-map.',
					'Search by place name or keyword.'
				],
				visual: 'map'
			},
			{
				eyebrow: 'Depth',
				title: 'Station details and multi-day forecasts.',
				description:
					'Go beyond the headline AQI. Inspect particulates and gases individually, review forecast curves when providers supply them, and understand conditions before you head out.',
				bullets: [
					'PM2.5, PM10, O₃, NO₂, and related metrics.',
					'Forecast for O₃, PM10, PM25, and UVI when available.',
					'Embedded map for sensor location.'
				],
				visualOnLeft: true,
				visual: 'chart'
			},
			{
				eyebrow: 'Control',
				title: 'Choose your data source and AQI scale.',
				description:
					'Different regions speak different AQI dialects. Pick the provider and standard that match how you think about air quality — then keep favorites synced locally.',
				bullets: [
					'WAQI, Sensor.Community, or OpenSenseMap.',
					'US EPA, China HJ 633-2012, or European CAQI.',
					'Short onboarding on first launch.'
				],
				visual: 'settings'
			},
			{
				eyebrow: 'Favorites',
				title: 'Save the stations that matter to you.',
				description:
					'Home, office, school, travel destinations — pin them once and return to the same trusted readings every day.',
				bullets: [
					'Persistent favorites with SwiftData.',
					'Fast return to places you monitor daily.',
					'Works alongside search and map discovery.'
				],
				visualOnLeft: true,
				visual: 'feed'
			}
		],
		grid: {
			title: 'Tap into the power of open air-quality data.',
			lead: 'Community sensors and global indices together — interpreted the way your region expects.',
			items: [
				{
					title: 'WAQI',
					description: 'World Air Quality Index coverage for cities worldwide.'
				},
				{
					title: 'Sensor.Community',
					description: 'Hyperlocal community sensor network readings.'
				},
				{
					title: 'OpenSenseMap',
					description: 'Citizen science stations from the open sensor map.'
				},
				{
					title: 'US EPA scale',
					description: 'Categories familiar across the United States.'
				},
				{
					title: 'China HJ 633',
					description: 'National standard scale for China.'
				},
				{
					title: 'European CAQI',
					description: 'Common Air Quality Index for Europe.'
				},
				{
					title: 'Search',
					description: 'Find stations by place or keyword.'
				},
				{
					title: 'Forecasts',
					description: 'Plan ahead with provider-supplied outlooks.'
				},
				{
					title: 'Favorites',
					description: 'Pin stations you check every day.'
				}
			]
		},
		tech: {
			title: 'SwiftUI native. Data when you need it.',
			lead: 'AQI Sense is built with SwiftUI and SwiftData for a fast feed, smooth map, and reliable offline access to your saved stations.',
			items: [
				{
					title: 'SwiftUI',
					description: 'Responsive layouts and fluid navigation on iPhone and iPad.'
				},
				{
					title: 'SwiftData',
					description: 'Favorites and preferences stored on-device.'
				},
				{
					title: 'Open APIs',
					description: 'Live readings from trusted public data providers.'
				}
			]
		},
		closingTitle: 'Breathe easier with better information.',
		closingLead:
			'Download AQI Sense and keep the air around you — and places you care about — one refresh away.',
		platformsLine: 'One app for iPhone and iPad · Available on the App Store.'
	}
}

export function getLandingBySlug(slug: string): AppLandingConfig | null {
	return landingBySlug[slug] ?? null
}
