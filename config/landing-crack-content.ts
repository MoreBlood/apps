export type LandingCrackScene = {
	group: string
	ascii: string
	logLines: string[]
	bodyLines: string[]
	footnote: string
	downloadLabel: string
	scrollTicker: string
	/** Ironic fine print under the download button */
	paywallNote: string
	mascotTips: string[]
}

const SHARED_MASCOT_TIPS = [
	'Совет: премиум-лэндос не конвертит лучше, чем chiptune в MP3.',
	'Я — Скобка. Официально Clippy. Неофициально — в отпуске с 2007, но вернулась.',
	'Alt+F4 закрывает окно. Download открывает App Store. Не путай.',
	'Если видишь меня — ты уже в честной ветке A/B. Поздравляю.',
	'Совет дизайнеру: ещё один градиент — и пользователь уйдёт быстрее keygen.exe.'
]

export const landingCrackSceneBySlug: Record<string, LandingCrackScene> = {
	rawclinic: {
		group: 'TEAM NO-SEO',
		ascii: `╔══════════════════════════════════════╗
║  R AW   C L I N I C   v 1 . 0        ║
║  ProRAW editor · iPhone · iPad       ║
╚══════════════════════════════════════╝`,
		logLines: [
			'[+] Mounting honesty.sys ... OK',
			'[+] Patching premium.dll ... SKIPPED (not found)',
			'[+] Removing cinematic scroll ... OK',
			'[+] Loading ProRAW pipeline ... OK',
			'[+] Disabling subscription nag ... OK',
			'[!] Machined aluminum shaders: NOT INSTALLED',
			'[+] Ready. This is the real page.'
		],
		bodyLines: [
			'Develop Apple ProRAW on device. Queue, grade, export.',
			'No three-act landing. No wellness copy. No parallax fog.',
			'Free on App Store. Support the author if you like it.'
		],
		footnote: 'NFO: We already rendered the fancy page above. Industry regulations.',
		downloadLabel: '[ >>> DOWNLOAD FROM APP STORE <<< ]',
		paywallNote:
			'No Pro tier. No “unlock full export” after three edits. The industry ships paywalls; we shipped an app. Apple’s store still wants money — that’s their subscription, not our landing page.',
		scrollTicker: '*** GREETZ TO ALL SCENERS *** NO PREMIUM LANDING WAS HARMED *** SUPPORT DEVS *** RAW OR NOTHING ***',
		mascotTips: [
			'ProRAW на устройстве. Подписка на Lightroom — опциональна, как этот совет.',
			'Совет: Deep Fusion уже намусорил в файле. Мы хотя бы честно об этом пишем.',
			'Жми Download. Это легально. Я бы сама нажала, но я только `]`.',
			...SHARED_MASCOT_TIPS
		]
	},
	'aqi-sense': {
		group: 'TEAM CLEAR-SKY',
		ascii: `╔══════════════════════════════════════╗
║  A Q I   S E N S E   v 1 . 0         ║
║  Air quality · WAQI · Map · Feed     ║
╚══════════════════════════════════════╝`,
		logLines: [
			'[+] Injecting WAQI feed ... OK',
			'[+] Stripping lifestyle manifesto ... OK',
			'[+] Map clusters online ... OK',
			'[+] Breathe-easy copy.exe ... DELETED',
			'[!] Parallax wellness layer: 404',
			'[+] Ready. Check AQI. Leave.'
		],
		bodyLines: [
			'Live AQI from WAQI, Sensor.Community, OpenSenseMap.',
			'Feed, map, favorites, your scale. That is the app.',
			'No hero quote about mindfulness. Revolutionary.'
		],
		footnote: 'NFO: Polished landing still exists upstairs. Your choice.',
		downloadLabel: '[ >>> GET AQI SENSE (LEGAL) <<< ]',
		paywallNote:
			'No “AQI+” weekly pass. No trial that becomes a subscription while you blink. Open data should not need a platinum checklist — paywalls are for features, not for the number 87.',
		scrollTicker:
			'*** FOR EVALUATION ONLY *** PIN YOUR STATIONS *** EPA / CAQI / CHINA SCALE *** STAY INSIDE IF BAD ***',
		mascotTips: [
			'AQI — три буквы. Не lifestyle-бренд. Закрой лэндос, открой карту.',
			'Совет: если AQI красный — не гуляй. Если зелёный — тоже можешь не гулять.',
			'WAQI, Sensor.Community, OpenSenseMap — данные реальные, этот интро — нет.',
			...SHARED_MASCOT_TIPS
		]
	}
}

export function getLandingCrackMascotTips(slug: string): string[] {
	return landingCrackSceneBySlug[slug]?.mascotTips ?? SHARED_MASCOT_TIPS
}

export function getLandingCrackScene(slug: string): LandingCrackScene | null {
	return landingCrackSceneBySlug[slug] ?? null
}
