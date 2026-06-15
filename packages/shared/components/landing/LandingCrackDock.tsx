'use client'

import clsx from 'clsx'
import AppIcon from '@/components/AppIcon'
import { CRACK_DOCK_WINDOW_ORDER, getCrackShellLabel, getCrackWindowDef } from '@/config/landing-crack-windows'
import { MAC_CLASSIC9_SHELL_ICON } from '@/config/landing-mac-classic-icons'
import { useLandingCrackContextMenu } from './LandingCrackContextMenu'
import { useLandingCrackShell } from './LandingCrackShellContext'
import MacClassic9Icon from './MacClassic9Icon'

type Props = {
	appSlug: string
	appName: string
}

export default function LandingCrackDock({ appSlug, appName }: Props) {
	const wm = useLandingCrackShell()
	const { openDockMenu } = useLandingCrackContextMenu()

	return (
		<nav className="landing-crack-dock landing-crack-dock--aqua" aria-label="Dock">
			<div className="landing-crack-dock__tray" role="toolbar">
				{CRACK_DOCK_WINDOW_ORDER.map((id) => {
					const def = getCrackWindowDef(id)
					const open = wm.isVisible(id)
					const active = wm.isActive(id)
					const minimized = open && wm.getChrome(id) === 'minimized'
					const label = getCrackShellLabel(id, 'mac', undefined, appName)

					return (
						<button
							key={id}
							type="button"
							className={clsx(
								'landing-crack-dock__item',
								open && 'landing-crack-dock__item--running',
								active && 'landing-crack-dock__item--active'
							)}
							aria-label={minimized ? (id === 'main' ? `Restore ${appName}` : `Restore ${label}`) : label}
							aria-pressed={active}
							onClick={() => wm.activate(id)}
							onContextMenu={(e) => openDockMenu(e, id)}
						>
							{def.dockIcon === 'app' ? (
								<span className="landing-crack-dock__icon landing-crack-dock__icon--app">
									<AppIcon slug={appSlug} />
								</span>
							) : def.dockIcon === 'finder' ? (
								<span className="landing-crack-dock__icon landing-crack-dock__icon--finder landing-crack-dock__icon--raster">
									<MacClassic9Icon id={MAC_CLASSIC9_SHELL_ICON.finder} size={42} alt="" />
								</span>
							) : (
								<span className="landing-crack-dock__icon landing-crack-dock__icon--quicktime" aria-hidden />
							)}
							{open && <span className="landing-crack-dock__indicator" aria-hidden />}
						</button>
					)
				})}
			</div>
		</nav>
	)
}
