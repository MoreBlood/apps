export type CrackDesktopIconKind = 'app' | 'exe' | 'folder' | 'dll' | 'bat' | 'txt' | 'cfg' | 'lnk' | 'sys' | 'url'

export type CrackDesktopPanel = {
	title?: string
	tagline?: string
	lines: string[]
	footnote?: string
}

export type CrackDesktopIcon = {
	id: string
	/** Win9x-style label under icon (use \n for second line) */
	label: string
	kind: CrackDesktopIconKind
	left: string
	top: string
	panel: CrackDesktopPanel
}

const rawclinicDesktop: CrackDesktopIcon[] = [
	{
		id: 'app',
		label: 'RAW Clinic',
		kind: 'app',
		left: '4%',
		top: '14%',
		panel: {
			tagline: 'Edit Apple ProRAW on iPhone',
			lines: [
				'Develop Apple ProRAW on device. Queue, grade, export.',
				'No three-act landing. No wellness copy. No parallax fog.',
				'Free on App Store. Support the author if you like it.',
				'RAW Clinic develops Apple ProRAW on your iPhone and iPad — dial back the baked-in Deep Fusion look, work through a queue, export when you’re done.'
			],
			footnote: 'NFO: We already rendered the fancy page above. Industry regulations.'
		}
	},
	{
		id: 'deep-fusion',
		label: 'Dial_Back\nDeepFusion.exe',
		kind: 'exe',
		left: '4%',
		top: '28%',
		panel: {
			title: 'Dial_Back DeepFusion.exe',
			tagline: 'Embedded · Balanced · Neutral',
			lines: [
				'Apple’s pipeline bakes sharpening and contrast into every ProRAW.',
				'Pick a baseline and pull the look back before you export — without a Lightroom subscription.',
				'This is the feature the premium landing would call “material honesty”.'
			],
			footnote: 'No machined aluminum was harmed.'
		}
	},
	{
		id: 'queue',
		label: 'ProRAW\nQueue.lnk',
		kind: 'lnk',
		left: '4%',
		top: '42%',
		panel: {
			title: 'ProRAW Queue',
			tagline: 'Import · sort · grade',
			lines: [
				'Add shots from Photos or Files. Work the list shot by shot.',
				'Paste a grade from a reference frame when the light matched.',
				'Your originals stay intact — the queue is just a to-do list, not a sermon.'
			]
		}
	},
	{
		id: 'export',
		label: 'Export_FINAL.bat',
		kind: 'bat',
		left: '4%',
		top: '56%',
		panel: {
			title: 'Export_FINAL.bat',
			tagline: 'JPG · HEIC · TIFF',
			lines: [
				'Export when ready. Save to Photos or Share.',
				'Run this batch after you stop pretending you need a cinematic scroll to understand export.',
				'Repeat for the next session.'
			]
		}
	},
	{
		id: 'luts',
		label: 'Fuji_LUTs',
		kind: 'folder',
		left: '16%',
		top: '18%',
		panel: {
			title: 'Fuji_LUTs/',
			tagline: 'Film looks + .cube import',
			lines: [
				'Built-in Fuji-inspired looks. Bring your own .cube LUTs.',
				'No “curated palette journey” — just files in a folder, like adults.'
			]
		}
	},
	{
		id: 'copy-grade',
		label: 'Copy_Grade.clip',
		kind: 'dll',
		left: '16%',
		top: '32%',
		panel: {
			title: 'Copy_Grade.clip',
			tagline: 'Paste look across shots',
			lines: [
				'Copy adjustments from one frame and paste to similar shots in the queue.',
				'Faster than re-reading six metal cards about the same idea.'
			]
		}
	},
	{
		id: 'no-sub',
		label: 'No_Subscription.sys',
		kind: 'sys',
		left: '16%',
		top: '46%',
		panel: {
			title: 'No_Subscription.sys',
			tagline: 'Driver loaded',
			lines: [
				'Free on the App Store. No account. No cloud pipeline upsell.',
				'Your photos stay on your device. Revolutionary, we know.'
			]
		}
	},
	{
		id: 'roll',
		label: 'My_Roll.DNG',
		kind: 'folder',
		left: '16%',
		top: '60%',
		panel: {
			title: 'My_Roll.DNG',
			tagline: 'ProRAW on disk',
			lines: [
				'Shoot in Apple Camera or in-app when you want capture and edit in one place.',
				'Hand-held ProRAW still loves Apple Camera. We are honest about that too.'
			]
		}
	},
	{
		id: 'premium-bak',
		label: 'premium_landing.bak',
		kind: 'txt',
		left: '4%',
		top: '70%',
		panel: {
			title: 'premium_landing.bak',
			tagline: 'Archive · do not execute',
			lines: [
				'The fancy scroll version is still in memory above this window.',
				'You already saw the hero, grids, and machined aluminum. Industry regulations.',
				'This file is a backup of vibes you survived.'
			]
		}
	},
	{
		id: 'readme',
		label: 'README\nHONEST.txt',
		kind: 'txt',
		left: '16%',
		top: '74%',
		panel: {
			title: 'README_HONEST.txt',
			tagline: 'Plain text edition',
			lines: [
				'It’s a photo app. It works on your device. It’s free.',
				'That’s the pitch. Close other windows if you miss gradients.'
			]
		}
	},
	{
		id: 'cfg',
		label: 'DeepFusion_OFF.cfg',
		kind: 'cfg',
		left: '28%',
		top: '22%',
		panel: {
			title: 'DeepFusion_OFF.cfg',
			lines: ['[baseline]', 'neutral=1', 'crunchy_marketing_copy=0', 'parallax_fog=0']
		}
	},
	{
		id: 'camera',
		label: 'Apple_Camera.shoot',
		kind: 'exe',
		left: '28%',
		top: '38%',
		panel: {
			title: 'Apple_Camera.shoot',
			tagline: 'Best hand-held ProRAW',
			lines: [
				'Use Apple Camera when you want the best hand-held ProRAW.',
				'RAW Clinic is where the queue and grade live — not a replacement sermon.'
			]
		}
	},
	{
		id: 'on-device',
		label: 'OnDeviceOnly.key',
		kind: 'sys',
		left: '28%',
		top: '54%',
		panel: {
			title: 'OnDeviceOnly.key',
			lines: [
				'License key: PRIVATE-NO-CLOUD-OK',
				'Processing uses Apple’s on-device RAW pipeline. Nothing uploaded for “AI enhancement”.'
			]
		}
	}
]

const aqiSenseDesktop: CrackDesktopIcon[] = [
	{
		id: 'app',
		label: 'AQI Sense',
		kind: 'app',
		left: '4%',
		top: '14%',
		panel: {
			tagline: 'Air quality near you and worldwide',
			lines: [
				'Live AQI from WAQI, Sensor.Community, and OpenSenseMap.',
				'Feed, map, favorites, your scale. That is the app.',
				'No hero quote about mindfulness. Revolutionary.'
			],
			footnote: 'NFO: Polished landing still exists upstairs. Your choice.'
		}
	},
	{
		id: 'waqi',
		label: 'WAQI_Feed.exe',
		kind: 'exe',
		left: '4%',
		top: '28%',
		panel: {
			title: 'WAQI_Feed.exe',
			tagline: 'Global city coverage',
			lines: [
				'WAQI when you need context away from home.',
				'Saved and nearby stations in one list. Pull to refresh — not a lifestyle ritual.'
			]
		}
	},
	{
		id: 'map',
		label: 'Map_Clusters.dll',
		kind: 'dll',
		left: '4%',
		top: '42%',
		panel: {
			title: 'Map_Clusters.dll',
			tagline: 'Markers · search · details',
			lines: [
				'Clustered markers, station details, search by place.',
				'Forecasts and pollutant breakdown when the provider has them.',
				'No parallax fog required to find a number.'
			]
		}
	},
	{
		id: 'pin',
		label: 'Pin_Station.lnk',
		kind: 'lnk',
		left: '4%',
		top: '56%',
		panel: {
			title: 'Pin_Station.lnk',
			tagline: 'Favorites',
			lines: ['Pin places you check daily.', 'Dominant pollutant on each card when available.']
		}
	},
	{
		id: 'scale',
		label: 'EPA_Scale.cfg',
		kind: 'cfg',
		left: '16%',
		top: '18%',
		panel: {
			title: 'EPA_Scale.cfg',
			lines: ['[aqi_scale]', 'choice=US_EPA', '; or China, or European CAQI', 'breathe_easy_copy=deleted']
		}
	},
	{
		id: 'sensor',
		label: 'Sensor.Community',
		kind: 'url',
		left: '16%',
		top: '32%',
		panel: {
			title: 'Sensor.Community',
			tagline: 'Hyperlocal sensors',
			lines: ['Community sensors for readings near you.', 'Open data — not a wellness brand.']
		}
	},
	{
		id: 'opensense',
		label: 'OpenSenseMap',
		kind: 'url',
		left: '16%',
		top: '46%',
		panel: {
			title: 'OpenSenseMap',
			tagline: 'Citizen science stations',
			lines: ['Explore citizen science stations on the map.', 'Same app. Less ceremony.']
		}
	},
	{
		id: 'favorites',
		label: 'Favorites',
		kind: 'folder',
		left: '16%',
		top: '60%',
		panel: {
			title: 'Favorites/',
			lines: ['Stations you pinned. No account sync lecture.', 'SwiftData on device. Refresh when you care.']
		}
	},
	{
		id: 'breathe-del',
		label: 'BreatheEasy.exe.del',
		kind: 'txt',
		left: '4%',
		top: '70%',
		panel: {
			title: 'BreatheEasy.exe.del',
			tagline: 'File not found',
			lines: [
				'Deleted wellness manifesto.',
				'AQI is three letters and a number — not a meditation app.',
				'The polished landing upstairs may still imply otherwise.'
			]
		}
	},
	{
		id: 'aqi-now',
		label: 'AQI_Now.bat',
		kind: 'bat',
		left: '16%',
		top: '74%',
		panel: {
			title: 'AQI_Now.bat',
			lines: [
				'@echo off',
				'check_aqi',
				'if errorlevel 150 goto stay_inside',
				'exit /b 0',
				'REM: no three-act story required'
			]
		}
	},
	{
		id: 'forecast',
		label: 'Forecast.chart',
		kind: 'dll',
		left: '28%',
		top: '22%',
		panel: {
			title: 'Forecast.chart',
			lines: [
				'Pollutant breakdown and forecast when the provider ships data.',
				'Chart, not an infographic about breathing.'
			]
		}
	},
	{
		id: 'refresh',
		label: 'PullToRefresh.sys',
		kind: 'sys',
		left: '28%',
		top: '38%',
		panel: {
			title: 'PullToRefresh.sys',
			lines: ['Gesture: pull list. Action: fetch latest readings.', 'No cinematic scroll to refresh.']
		}
	},
	{
		id: 'trash',
		label: 'WellnessCopy\nTRASH.txt',
		kind: 'txt',
		left: '28%',
		top: '54%',
		panel: {
			title: 'WellnessCopy TRASH.txt',
			lines: [
				'Discarded: “breathe easy with premium air quality”.',
				'Kept: numbers, map, pins, scales.',
				'Empty file. Zero bytes of lifestyle.'
			]
		}
	}
]

export const landingCrackDesktopBySlug: Record<string, CrackDesktopIcon[]> = {
	rawclinic: rawclinicDesktop,
	'aqi-sense': aqiSenseDesktop
}

export function getLandingCrackDesktopIcons(slug: string): CrackDesktopIcon[] {
	return landingCrackDesktopBySlug[slug] ?? []
}

export function getLandingCrackDesktopIcon(slug: string, id: string): CrackDesktopIcon | null {
	return getLandingCrackDesktopIcons(slug).find((icon) => icon.id === id) ?? null
}
