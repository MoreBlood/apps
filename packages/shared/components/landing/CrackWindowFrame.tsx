'use client'

import clsx from 'clsx'
import { type ReactNode, useRef } from 'react'
import { getCrackWindowDef } from '@/config/landing-crack-windows'
import type { LandingCrackSkin } from '@/lib/landing-crack-skin'
import type { CrackWindowId } from '@/lib/landing-crack-window-manager'
import CrackWindowChrome from './CrackWindowChrome'
import { CrackWindowFrameProvider } from './CrackWindowFrameContext'
import { unmaximizeFromTitlebarDrag, useCrackWindow } from './useCrackWindow'

type Props = {
	windowId: CrackWindowId
	skin: LandingCrackSkin
	title: string
	children: ReactNode
	footer?: ReactNode
	rootId?: string
	className?: string
	/** Override registry frame variant */
	variant?: 'document' | 'audio-mac' | 'audio-bar'
	/** Mac QuickTime outer section */
	ariaLabel?: string
}

export default function CrackWindowFrame({
	windowId,
	skin,
	title,
	children,
	footer,
	rootId,
	className,
	variant: variantProp,
	ariaLabel
}: Props) {
	const isMac = skin === 'mac'
	const win = useCrackWindow(windowId)
	const def = getCrackWindowDef(windowId)
	const variant = variantProp ?? (windowId === 'audio' && !isMac ? 'audio-bar' : def.frameVariant)
	const titlebarGestureRef = useRef<'none' | 'unmaximized-drag'>('none')

	if (!win.visible) return null

	const onTitlebarPointerDown = (e: React.PointerEvent<HTMLElement>) => {
		win.activate()
		if (win.isMaximized) {
			unmaximizeFromTitlebarDrag(windowId, e, win.wm, win.drag)
			titlebarGestureRef.current = 'unmaximized-drag'
		} else {
			titlebarGestureRef.current = 'none'
		}
		win.drag.handleProps.onPointerDown(e)
	}

	const onTitlebarPointerUp = (e: React.PointerEvent<HTMLElement>) => {
		win.drag.handleProps.onPointerUp(e)
		if (titlebarGestureRef.current === 'unmaximized-drag') {
			globalThis.setTimeout(() => {
				if (titlebarGestureRef.current === 'unmaximized-drag') {
					titlebarGestureRef.current = 'none'
				}
			}, 400)
		}
	}

	const onTitlebarDoubleClick = (e: React.MouseEvent<HTMLElement>) => {
		if ((e.target as HTMLElement).closest('button')) return
		if (!def.supportsMaximize) return

		if (titlebarGestureRef.current === 'unmaximized-drag') {
			titlebarGestureRef.current = 'none'
			win.drag.setPosition(null)
			return
		}

		if (win.isMaximized) {
			win.setChrome('normal')
			win.drag.setPosition(null)
			return
		}

		win.toggleMaximize()
	}

	const frameClass = (() => {
		if (variant === 'audio-mac') {
			return clsx(
				'landing-crack-audio__player',
				win.focused && 'landing-crack-audio__player--focused',
				win.drag.isFloating && 'landing-crack-audio__player--floating',
				win.drag.dragging && 'landing-crack-audio__player--dragging',
				win.isMinimized && 'landing-crack-audio__player--minimized'
			)
		}
		if (variant === 'audio-bar') {
			return clsx(
				'landing-crack-audio__bar',
				win.focused && 'landing-crack-audio__bar--focused',
				win.drag.isFloating && 'landing-crack-audio__bar--floating',
				win.drag.dragging && 'landing-crack-audio__bar--dragging',
				win.isMinimized && 'landing-crack-audio__bar--minimized'
			)
		}
		return clsx(
			'landing-crack__window',
			win.focused && 'landing-crack__window--focused',
			win.drag.isFloating && 'landing-crack__window--floating',
			win.drag.dragging && 'landing-crack__window--dragging',
			win.resize.resizing && 'landing-crack__window--resizing',
			win.hasPanelSize && 'landing-crack__window--sized',
			win.isMinimized && 'landing-crack__window--minimized',
			win.isMaximized && 'landing-crack__window--maximized'
		)
	})()

	const rootStyle = win.panelStyle

	const titlebarClass =
		variant === 'audio-mac'
			? 'landing-crack-audio__titlebar'
			: variant === 'audio-bar'
				? 'landing-crack-audio__bar-titlebar'
				: 'landing-crack__titlebar'

	const titleClass =
		variant === 'audio-mac'
			? 'landing-crack-audio__window-title'
			: variant === 'audio-bar'
				? 'landing-crack-audio__bar-title'
				: 'landing-crack__titlebar-text'

	const root = (
		<div
			ref={win.drag.panelRef}
			id={rootId}
			style={rootStyle}
			className={frameClass}
			onPointerDown={() => win.activate()}
		>
			<header
				className={clsx(titlebarClass, win.drag.dragging && `${titlebarClass}--dragging`)}
				style={win.drag.handleProps.style}
				role="toolbar"
				aria-label={variant === 'document' ? 'Window title bar' : undefined}
				onPointerDown={onTitlebarPointerDown}
				onPointerMove={win.drag.handleProps.onPointerMove}
				onPointerUp={onTitlebarPointerUp}
				onPointerCancel={win.drag.handleProps.onPointerCancel}
				onDoubleClick={def.supportsMaximize ? onTitlebarDoubleClick : undefined}
			>
				<CrackWindowChrome windowId={windowId} skin={skin} win={win} />
				<span className={titleClass}>{title}</span>
				{variant === 'document' && isMac && <span className="landing-crack__titlebar-spacer" aria-hidden />}
			</header>
			<CrackWindowFrameProvider value={win}>{children}</CrackWindowFrameProvider>
			{footer}
			{def.supportsResize && !win.isMaximized && !win.isMinimized && (
				<div
					className="landing-crack__resize-handle"
					aria-hidden
					style={win.resize.handleProps.style}
					onPointerDown={win.resize.handleProps.onPointerDown}
					onPointerMove={win.resize.handleProps.onPointerMove}
					onPointerUp={win.resize.handleProps.onPointerUp}
					onPointerCancel={win.resize.handleProps.onPointerCancel}
				/>
			)}
		</div>
	)

	if (variant === 'audio-mac' && ariaLabel) {
		return (
			<section
				className={clsx(className, win.isMinimized && 'landing-crack-audio__shell--minimized')}
				aria-label={ariaLabel}
				onPointerDown={() => win.activate()}
			>
				{root}
			</section>
		)
	}

	const wrapStyle = className ? ({ zIndex: win.zIndex } as const) : undefined

	return (
		<div className={className} style={wrapStyle}>
			{root}
		</div>
	)
}
