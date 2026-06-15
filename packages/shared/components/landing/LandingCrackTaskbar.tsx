'use client'

import clsx from 'clsx'
import { CRACK_WINDOW_ORDER, getCrackShellLabel } from '@/config/landing-crack-windows'
import type { LandingCrackSkin } from '@/lib/landing-crack-skin'
import { useLandingCrackContextMenu } from './LandingCrackContextMenu'
import { useLandingCrackShell } from './LandingCrackShellContext'

type Props = {
	skin: LandingCrackSkin
	appName: string
	mainTitle: string
}

export default function LandingCrackTaskbar({ skin, appName, mainTitle }: Props) {
	const wm = useLandingCrackShell()
	const { openDockMenu } = useLandingCrackContextMenu()
	const isMac = skin === 'mac'

	return (
		<div
			className={clsx('landing-crack-taskbar', isMac && 'landing-crack-taskbar--mac')}
			role="toolbar"
			aria-label="Taskbar"
		>
			{CRACK_WINDOW_ORDER.map((id) => {
				const visible = wm.isVisible(id)
				const running = wm.isRunning(id)
				const active = wm.isActive(id)
				const minimized = visible && wm.getChrome(id) === 'minimized'

				return (
					<button
						key={id}
						type="button"
						className={clsx(
							'landing-crack-taskbar__btn',
							running && active && 'landing-crack-taskbar__btn--active',
							minimized && 'landing-crack-taskbar__btn--minimized'
						)}
						aria-pressed={running && active}
						onClick={() => wm.activate(id)}
						onContextMenu={(e) => openDockMenu(e, id)}
					>
						{getCrackShellLabel(id, skin, mainTitle, appName)}
					</button>
				)
			})}
		</div>
	)
}
