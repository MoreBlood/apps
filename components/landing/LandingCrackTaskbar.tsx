'use client'

import clsx from 'clsx'
import type { LandingCrackSkin } from '@/lib/landing-crack-skin'
import type { CrackWindowId } from '@/lib/landing-crack-window-stack'
import { useLandingCrackShell } from './LandingCrackShellContext'

type Props = {
	skin: LandingCrackSkin
	appName: string
	mainTitle: string
	mainOpen: boolean
	mainMinimized: boolean
	onActivate: (id: CrackWindowId) => void
}

export default function LandingCrackTaskbar({ skin, appName, mainTitle, mainOpen, mainMinimized, onActivate }: Props) {
	const { isWindowFocused, focusWindow } = useLandingCrackShell()
	const isMac = skin === 'mac'

	const activate = (id: CrackWindowId) => {
		focusWindow(id)
		onActivate(id)
	}

	return (
		<div
			className={clsx('landing-crack-taskbar', isMac && 'landing-crack-taskbar--mac')}
			role="toolbar"
			aria-label="Taskbar"
		>
			<button
				type="button"
				className={clsx(
					'landing-crack-taskbar__btn',
					mainOpen && isWindowFocused('main') && !mainMinimized && 'landing-crack-taskbar__btn--active',
					mainMinimized && 'landing-crack-taskbar__btn--minimized'
				)}
				aria-pressed={mainOpen && isWindowFocused('main') && !mainMinimized}
				onClick={() => activate('main')}
			>
				{isMac ? appName : mainTitle.length > 28 ? `${mainTitle.slice(0, 26)}…` : mainTitle}
			</button>
			<button
				type="button"
				className={clsx('landing-crack-taskbar__btn', isWindowFocused('audio') && 'landing-crack-taskbar__btn--active')}
				aria-pressed={isWindowFocused('audio')}
				onClick={() => activate('audio')}
			>
				{isMac ? 'QuickTime Player' : '♫ RAD TRACKER'}
			</button>
		</div>
	)
}
