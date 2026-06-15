import type { CrackDesktopIcon } from './landing-crack-desktop'
import { getLandingCrackDesktopIcon } from './landing-crack-desktop'

export type CrackReaderDoc = {
	id: string
	/** Shown in Finder and window title */
	filename: string
	title?: string
	lines: string[]
	footnote?: string
}

const rawclinicDocs: CrackReaderDoc[] = [
	{
		id: 'readme',
		filename: 'README_HONEST.txt',
		title: 'README — Honest Edition',
		lines: [
			'It’s a photo app. It works on your device. It’s free.',
			'That’s the pitch. Close other windows if you miss gradients.',
			'',
			'; No EULA poetry. No machined aluminum.',
			'; Open Before_After/ for embedded vs RAW Clinic samples.'
		]
	},
	{
		id: 'premium-bak',
		filename: 'premium_landing.bak',
		title: 'premium_landing.bak',
		lines: [
			'Archive · do not execute',
			'',
			'The fancy scroll version is still in memory above this window.',
			'You already saw the hero, grids, and machined aluminum.',
			'Industry regulations.',
			'',
			'This file is a backup of vibes you survived.'
		]
	},
	{
		id: 'deepfusion-cfg',
		filename: 'DeepFusion_OFF.cfg',
		lines: ['[baseline]', 'neutral=1', 'crunchy_marketing_copy=0', 'parallax_fog=0', 'honest_mode=1']
	},
	{
		id: 'export-bat',
		filename: 'Export_FINAL.bat',
		lines: [
			'@echo off',
			'REM Export when ready. Save to Photos or Share.',
			'',
			'export /format:JPG,HEIC,TIFF',
			'if errorlevel 1 goto read_more_marketing',
			'exit /b 0',
			'',
			':read_more_marketing',
			'echo You do not need a cinematic scroll to understand export.',
			'pause'
		]
	},
	{
		id: 'fuji-readme',
		filename: 'readme_honest.txt',
		title: 'Fuji_LUTs/readme_honest.txt',
		lines: [
			'Built-in Fuji-inspired looks. Bring your own .cube LUTs.',
			'No “curated palette journey” — just files in a folder, like adults.',
			'',
			'Film looks live in the app. This folder is decorative.'
		]
	},
	{
		id: 'on-device-key',
		filename: 'OnDeviceOnly.key',
		lines: [
			'License key: PRIVATE-NO-CLOUD-OK',
			'Processing uses Apple’s on-device RAW pipeline.',
			'Nothing uploaded for “AI enhancement”.'
		]
	}
]

const aqiSenseDocs: CrackReaderDoc[] = [
	{
		id: 'aqi-scale-cfg',
		filename: 'EPA_Scale.cfg',
		lines: ['[aqi_scale]', 'choice=US_EPA', '; or China, or European CAQI', 'breathe_easy_copy=deleted']
	},
	{
		id: 'aqi-now-bat',
		filename: 'AQI_Now.bat',
		lines: [
			'@echo off',
			'check_aqi',
			'if errorlevel 150 goto stay_inside',
			'exit /b 0',
			'REM: no three-act story required'
		]
	},
	{
		id: 'wellness-trash',
		filename: 'WellnessCopy TRASH.txt',
		lines: [
			'Discarded: “breathe easy with premium air quality”.',
			'Kept: numbers, map, pins, scales.',
			'Empty file. Zero bytes of lifestyle.'
		]
	},
	{
		id: 'breathe-del',
		filename: 'BreatheEasy.exe.del',
		lines: [
			'File not found',
			'',
			'Deleted wellness manifesto.',
			'AQI is three letters and a number — not a meditation app.',
			'The polished landing upstairs may still imply otherwise.'
		]
	}
]

const readerBySlug: Record<string, CrackReaderDoc[]> = {
	rawclinic: rawclinicDocs,
	'aqi-sense': aqiSenseDocs
}

/** Virtual paths where text files appear in Finder. */
const finderTextFiles: Record<string, { path: string; name: string; docId: string }[]> = {
	rawclinic: [
		{ path: '/Documents', name: 'README_HONEST.txt', docId: 'readme' },
		{ path: '/Documents', name: 'premium_landing.bak', docId: 'premium-bak' },
		{ path: '/Documents', name: 'DeepFusion_OFF.cfg', docId: 'deepfusion-cfg' },
		{ path: '/Documents', name: 'Export_FINAL.bat', docId: 'export-bat' },
		{ path: '/Documents', name: 'OnDeviceOnly.key', docId: 'on-device-key' },
		{ path: '/Fuji_LUTs', name: 'readme_honest.txt', docId: 'fuji-readme' }
	],
	'aqi-sense': [
		{ path: '/Documents', name: 'EPA_Scale.cfg', docId: 'aqi-scale-cfg' },
		{ path: '/Documents', name: 'AQI_Now.bat', docId: 'aqi-now-bat' },
		{ path: '/Documents', name: 'WellnessCopy TRASH.txt', docId: 'wellness-trash' },
		{ path: '/Documents', name: 'BreatheEasy.exe.del', docId: 'breathe-del' }
	]
}

export function getReaderDocs(slug: string): CrackReaderDoc[] {
	return readerBySlug[slug] ?? []
}

export function readerDocFromDesktopIcon(icon: CrackDesktopIcon): CrackReaderDoc {
	const filename = icon.label.replace(/\n/g, ' ').trim()
	return {
		id: `desktop:${icon.id}`,
		filename,
		title: icon.panel.title ?? filename,
		lines: icon.panel.lines,
		footnote: icon.panel.footnote
	}
}

export function resolveReaderDocId(slug: string, docId: string): CrackReaderDoc | null {
	if (!docId.startsWith('desktop:')) return null
	const iconId = docId.slice('desktop:'.length)
	const icon = getLandingCrackDesktopIcon(slug, iconId)
	return icon ? readerDocFromDesktopIcon(icon) : null
}

export function getReaderDoc(slug: string, docId: string): CrackReaderDoc | null {
	const found = getReaderDocs(slug).find((d) => d.id === docId)
	if (found) return found
	if (docId.startsWith('desktop:')) return resolveReaderDocId(slug, docId)
	return null
}

export function listFinderTextFiles(slug: string, folderPath: string) {
	return (finderTextFiles[slug] ?? []).filter((f) => f.path === folderPath)
}

export function hasFinderDocumentsFolder(slug: string): boolean {
	return (finderTextFiles[slug] ?? []).some((f) => f.path === '/Documents')
}
