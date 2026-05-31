import type { LandingCrackScene } from '@/config/landing-crack-content'

const MAC_MASCOT_SHARED = [
	'Tip: ⌘Q quits. Premium landings quit slower — usually after the third scroll-jacking section.',
	'This is Tips, not Clippy. macOS Sonoma would like you to know you are in the honest A/B branch.',
	'Drag to Trash only works on shortcuts. Your Adobe subscription needs a phone call.',
	'The glass hero is still in memory above. Activity Monitor shows “Vibes” at 240%.',
	'Designer tip: one more gradient mesh and Finder will suggest “Reduce Transparency”.'
]

const MAC_MASCOT_BY_SLUG: Record<string, string[]> = {
	rawclinic: [
		'ProRAW on device. Lightroom subscription sold separately — by Adobe, not us.',
		'Download opens the App Store. No .dmg, no Gatekeeper panic, no “app from internet”.',
		'Deep Fusion already edited your file. We only admit it on this desktop.',
		...MAC_MASCOT_SHARED
	],
	'aqi-sense': [
		'WAQI feed online. No “mindful breathing” copy in this build.',
		'Pin stations. iCloud optional; guilt trip not included.',
		'AQI is a number. Not a wellness subscription.',
		...MAC_MASCOT_SHARED
	]
}

export type LandingCrackMacCopy = {
	crackedBanner: string
	progressLabel: string
	windowSuffix: string
	notepadSuffix: string
	serialLabel: string
	mascotTitle: string
	mascotAria: string
	mascotNextLabel: string
}

const MAC_COPY: LandingCrackMacCopy = {
	crackedBanner: 'Notarized by Honest Users Group — no malware, only truth',
	progressLabel: 'Installing package contents…',
	windowSuffix: '— Honest Edition.pkg',
	notepadSuffix: '— TextEdit',
	serialLabel: 'Apple ID:',
	mascotTitle: 'Tips',
	mascotAria: 'macOS Tips',
	mascotNextLabel: 'Show another tip'
}

export function getLandingCrackMacCopy(): LandingCrackMacCopy {
	return MAC_COPY
}

export function getLandingCrackMacMascotTips(appSlug: string): string[] {
	return MAC_MASCOT_BY_SLUG[appSlug] ?? MAC_MASCOT_SHARED
}

export function applyMacSceneCopy(scene: LandingCrackScene): LandingCrackScene {
	return {
		...scene,
		downloadLabel: scene.downloadLabel
			.replace('[ >>> ', '')
			.replace(' <<< ]', '')
			.replace('GET ', 'Download on the ')
			.trim(),
		scrollTicker: scene.scrollTicker.replace(/\*\*\*/g, '•').replace(/GREETZ/g, 'GREETINGS')
	}
}
