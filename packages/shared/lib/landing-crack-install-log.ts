import type { LandingCrackScene } from '@/config/landing-crack-content'

export type InstallLogLine = {
	id: string
	text: string
	kind: 'ascii' | 'status' | 'spacer'
}

/** Box art + “wizard ready” lines — auto-plays on open. */
export function buildInstallInitLines(scene: LandingCrackScene): InstallLogLine[] {
	const lines: InstallLogLine[] = []
	for (const [index, text] of scene.ascii.split('\n').entries()) {
		lines.push({ id: `ascii-${index}`, text, kind: 'ascii' })
	}
	lines.push({ id: 'init-gap', text: '', kind: 'spacer' })
	lines.push({ id: 'init-1', text: '[*] Setup wizard initialized.', kind: 'status' })
	lines.push({ id: 'init-2', text: '[*] Click Install to continue.', kind: 'status' })
	return lines
}

/** Status lines streamed after the user clicks Install. */
export function buildInstallRunLines(scene: LandingCrackScene): InstallLogLine[] {
	return scene.logLines.map((text, index) => ({
		id: `run-${index}`,
		text,
		kind: 'status' as const
	}))
}

export function buildInstallLogLines(scene: LandingCrackScene): InstallLogLine[] {
	return [...buildInstallInitLines(scene), ...buildInstallRunLines(scene)]
}

/** Easter egg for devtools — honest edition banner in monospace green. */
export function logLandingCrackAsciiToConsole(scene: LandingCrackScene, appName: string): void {
	if (typeof console === 'undefined') return

	const banner = `${scene.ascii}\n\n[${scene.group}] ${appName} · honest edition · ?landing_ab=anti`
	const style =
		'font-family: "Courier New", Courier, "Lucida Console", monospace; font-size: 11px; line-height: 1.25; color: #00ff00;'

	console.log(`%c${banner}`, style)
}
