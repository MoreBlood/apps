'use client'

import clsx from 'clsx'
import AppIcon from '@/components/AppIcon'
import type { CrackWindowId } from '@/lib/landing-crack-window-stack'
import { useLandingCrackShell } from './LandingCrackShellContext'

type Props = {
	appSlug: string
	appName: string
	mainOpen: boolean
	mainMinimized: boolean
	onActivateMain: () => void
	onActivateAudio: () => void
}

export default function LandingCrackDock({
	appSlug,
	appName,
	mainOpen,
	mainMinimized,
	onActivateMain,
	onActivateAudio
}: Props) {
	const { focusWindow, isWindowFocused } = useLandingCrackShell()

	const mainRunning = mainOpen && !mainMinimized
	const mainActive = mainRunning && isWindowFocused('main')
	const audioActive = isWindowFocused('audio')

	const activate = (id: CrackWindowId) => {
		focusWindow(id)
		if (id === 'main') onActivateMain()
		else onActivateAudio()
	}

	return (
		<nav className="landing-crack-dock landing-crack-dock--aqua" aria-label="Dock">
			<div className="landing-crack-dock__tray" role="toolbar">
				<button
					type="button"
					className={clsx(
						'landing-crack-dock__item',
						mainRunning && 'landing-crack-dock__item--running',
						mainActive && 'landing-crack-dock__item--active'
					)}
					aria-label={mainMinimized ? `Restore ${appName}` : appName}
					aria-pressed={mainActive}
					onClick={() => activate('main')}
				>
					<span className="landing-crack-dock__icon landing-crack-dock__icon--app">
						<AppIcon slug={appSlug} />
					</span>
					{mainRunning && <span className="landing-crack-dock__indicator" aria-hidden />}
				</button>

				<button
					type="button"
					className={clsx(
						'landing-crack-dock__item',
						'landing-crack-dock__item--running',
						audioActive && 'landing-crack-dock__item--active'
					)}
					aria-label="QuickTime Player"
					aria-pressed={audioActive}
					onClick={() => activate('audio')}
				>
					<span className="landing-crack-dock__icon landing-crack-dock__icon--quicktime" aria-hidden />
					<span className="landing-crack-dock__indicator" aria-hidden />
				</button>
			</div>
		</nav>
	)
}
