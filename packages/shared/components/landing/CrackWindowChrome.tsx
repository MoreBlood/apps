'use client'

import clsx from 'clsx'
import { getCrackWindowDef } from '@/config/landing-crack-windows'
import type { LandingCrackSkin } from '@/lib/landing-crack-skin'
import type { CrackWindowId } from '@/lib/landing-crack-window-manager'
import type { useCrackWindow } from './useCrackWindow'

type Win = ReturnType<typeof useCrackWindow>

type Props = {
	windowId: CrackWindowId
	skin: LandingCrackSkin
	win: Win
}

function MacAudioTraffic({ win, def }: { win: Win; def: ReturnType<typeof getCrackWindowDef> }) {
	const dot = (kind: 'close' | 'min' | 'zoom', onClick?: () => void, label?: string) => {
		const className = clsx('landing-crack-audio__dot', `landing-crack-audio__dot--${kind}`)
		if (onClick) {
			return <button type="button" className={className} aria-label={label} onClick={onClick} />
		}
		return <span className={className} aria-hidden />
	}

	return (
		<span className="landing-crack-audio__traffic">
			{def.supportsClose ? dot('close', win.close, 'Close window') : dot('close')}
			{def.supportsMinimize ? dot('min', win.minimize, 'Minimize window') : dot('min')}
			{def.supportsMaximize
				? dot('zoom', win.toggleMaximize, win.isMaximized ? 'Exit full screen' : 'Enter full screen')
				: dot('zoom')}
		</span>
	)
}

export default function CrackWindowChrome({ windowId, skin, win }: Props) {
	const def = getCrackWindowDef(windowId)
	const isMac = skin === 'mac'

	if (isMac && windowId === 'audio') {
		return <MacAudioTraffic win={win} def={def} />
	}

	if (isMac) {
		return (
			<span className="landing-crack__traffic">
				{def.supportsClose && (
					<button
						type="button"
						className="landing-crack__traffic-dot landing-crack__traffic-dot--close"
						aria-label="Close window"
						onClick={win.close}
					/>
				)}
				{def.supportsMinimize && (
					<button
						type="button"
						className="landing-crack__traffic-dot landing-crack__traffic-dot--min"
						aria-label="Minimize window"
						onClick={win.minimize}
					/>
				)}
				{def.supportsMaximize && (
					<button
						type="button"
						className="landing-crack__traffic-dot landing-crack__traffic-dot--zoom"
						aria-label={win.isMaximized ? 'Exit full screen' : 'Enter full screen'}
						aria-pressed={win.isMaximized}
						onClick={win.toggleMaximize}
					/>
				)}
			</span>
		)
	}

	return (
		<span className="landing-crack__titlebar-btns">
			{def.supportsMinimize && (
				<button
					type="button"
					className="landing-crack__titlebar-btn"
					aria-label="Minimize window"
					onClick={win.minimize}
				>
					_
				</button>
			)}
			{def.supportsMaximize && (
				<button
					type="button"
					className="landing-crack__titlebar-btn"
					aria-label={win.isMaximized ? 'Restore window' : 'Maximize window'}
					aria-pressed={win.isMaximized}
					onClick={win.toggleMaximize}
				>
					□
				</button>
			)}
			{def.supportsClose && (
				<button
					type="button"
					className="landing-crack__titlebar-btn landing-crack__titlebar-btn--close"
					aria-label="Close window"
					onClick={win.close}
				>
					×
				</button>
			)}
		</span>
	)
}
