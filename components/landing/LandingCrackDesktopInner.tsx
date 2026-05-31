'use client'

import clsx from 'clsx'
import NextLink from 'next/link'
import { type CSSProperties, useEffect, useId, useMemo, useRef, useState } from 'react'
import AppIcon from '@/components/AppIcon'
import type { LandingAppInfo } from '@/config'
import { getLandingCrackScene } from '@/config/landing-crack-content'
import { getLandingCrackDesktopIcon } from '@/config/landing-crack-desktop'
import { applyMacSceneCopy, getLandingCrackMacCopy } from '@/config/landing-crack-mac'
import type { LandingCrackSkin } from '@/lib/landing-crack-skin'
import { clampPosition, useDraggablePanel } from '@/lib/landing-crack-window-drag'
import type { CrackWindowId } from '@/lib/landing-crack-window-stack'
import LandingCrackAudio from './LandingCrackAudio'
import LandingCrackDesktop from './LandingCrackDesktop'
import LandingCrackDock from './LandingCrackDock'
import LandingCrackMascot from './LandingCrackMascot'
import { useLandingCrackShell } from './LandingCrackShellContext'
import LandingCrackTaskbar from './LandingCrackTaskbar'

type Props = {
	app: LandingAppInfo
	skin?: LandingCrackSkin
}

type WindowChromeState = 'normal' | 'minimized' | 'maximized' | 'closed'

export default function LandingCrackDesktopInner({ app, skin = 'win' }: Props) {
	const { focusWindow, getWindowZIndex, isWindowFocused } = useLandingCrackShell()
	const titleId = useId()
	const progressId = useId()
	const mainWindowId = useId()
	const isMac = skin === 'mac'
	const macCopy = getLandingCrackMacCopy()
	const rawScene = getLandingCrackScene(app.slug)
	const scene = useMemo(() => (rawScene && isMac ? applyMacSceneCopy(rawScene) : rawScene), [rawScene, isMac])
	const terminalRef = useRef<HTMLDivElement>(null)
	const [progress, setProgress] = useState(0)
	const [visibleLogs, setVisibleLogs] = useState(0)
	const [selectedDesktopId, setSelectedDesktopId] = useState('app')
	const [windowState, setWindowState] = useState<WindowChromeState>('normal')

	const showWindow = windowState !== 'closed'
	const showDock = windowState === 'minimized' || windowState === 'closed'
	const isMaximized = windowState === 'maximized'
	const mainFocused = isWindowFocused('main')

	const restoreWindow = () => {
		setWindowState('normal')
		focusWindow('main')
	}
	const minimizeWindow = () => setWindowState('minimized')
	const closeWindow = () => setWindowState('closed')
	const toggleMaximize = () =>
		setWindowState((prev) => {
			const next = prev === 'maximized' ? 'normal' : 'maximized'
			if (next === 'maximized' || next === 'normal') focusWindow('main')
			return next
		})

	const canDragWindow = showWindow && windowState === 'normal'
	const mainWindowDrag = useDraggablePanel(!canDragWindow, {
		zIndex: getWindowZIndex('main'),
		zIndexDragging: getWindowZIndex('main', true),
		onInteraction: () => focusWindow('main')
	})

	const onMainTitlebarPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		focusWindow('main')
		if (isMaximized) {
			const panel = mainWindowDrag.panelRef.current
			if (panel) {
				const rect = panel.getBoundingClientRect()
				mainWindowDrag.setPosition(
					clampPosition(e.clientX - rect.width * 0.35, e.clientY - 14, rect.width, rect.height)
				)
			}
			setWindowState('normal')
			return
		}
		mainWindowDrag.handleProps.onPointerDown(e)
	}

	const onMainTitlebarDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if ((e.target as HTMLElement).closest('button')) return
		toggleMaximize()
	}

	const onTaskbarActivate = (id: CrackWindowId) => {
		if (id === 'main') restoreWindow()
	}

	const effectiveDesktopId = selectedDesktopId || 'app'
	const selectedIcon = getLandingCrackDesktopIcon(app.slug, effectiveDesktopId)
	const panel = selectedIcon?.panel
	const panelTitle = panel?.title ?? app.appName
	const panelTagline = panel?.tagline ?? app.tagline
	const panelFootnote = panel?.footnote ?? scene?.footnote

	const windowTitle =
		selectedIcon && effectiveDesktopId !== 'app'
			? isMac
				? `${panelTitle}${macCopy.notepadSuffix}`
				: `${panelTitle} — Notepad`
			: isMac
				? `${app.appName} ${macCopy.windowSuffix}`
				: `${app.appName} Setup — Licensed to: YOU (honest edition)`

	const mainWindowStyle: CSSProperties = {
		...(isMaximized ? {} : mainWindowDrag.panelStyle),
		zIndex: getWindowZIndex('main', mainWindowDrag.dragging)
	}

	useEffect(() => {
		if (!scene) return
		const lines = scene.logLines.length
		let logTick = 0
		const logTimer = globalThis.setInterval(() => {
			logTick += 1
			setVisibleLogs(logTick)
			if (logTick >= lines) globalThis.clearInterval(logTimer)
		}, 220)

		let p = 0
		const progTimer = globalThis.setInterval(() => {
			p += 4
			setProgress(Math.min(p, 100))
			if (p >= 100) globalThis.clearInterval(progTimer)
		}, 90)

		return () => {
			globalThis.clearInterval(logTimer)
			globalThis.clearInterval(progTimer)
		}
	}, [scene])

	useEffect(() => {
		const terminal = terminalRef.current
		if (!terminal || visibleLogs === 0) return
		const scroll = () => {
			terminal.scrollTop = terminal.scrollHeight
		}
		scroll()
		const raf = globalThis.requestAnimationFrame(scroll)
		return () => globalThis.cancelAnimationFrame(raf)
	}, [visibleLogs])

	useEffect(() => {
		if (windowState !== 'maximized') return
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setWindowState('normal')
		}
		globalThis.addEventListener('keydown', onKey)
		return () => globalThis.removeEventListener('keydown', onKey)
	}, [windowState])

	if (!scene || !app.storeLink) {
		return (
			<section className="landing-ab-minimal landing-ab-minimal--fallback" aria-labelledby={titleId}>
				<h1 id={titleId}>{app.appName}</h1>
				<p>{app.tagline}</p>
			</section>
		)
	}

	return (
		<section className={clsx('landing-crack', isMac && 'landing-crack--mac')} aria-labelledby={titleId}>
			<button
				type="button"
				className="landing-crack__desktop-surface"
				aria-label="Desktop background"
				onClick={() => setSelectedDesktopId('')}
			/>
			<div className="landing-crack__desktop" aria-hidden />

			<LandingCrackDesktop
				appSlug={app.slug}
				skin={skin}
				selectedId={effectiveDesktopId}
				onSelect={(id) => {
					setSelectedDesktopId(id)
					restoreWindow()
				}}
			/>

			<LandingCrackAudio className="landing-crack__audio" skin={skin} />

			{showWindow && (
				<div
					ref={mainWindowDrag.panelRef}
					style={mainWindowStyle}
					className={clsx(
						'landing-crack__window',
						mainFocused && 'landing-crack__window--focused',
						mainWindowDrag.isFloating && 'landing-crack__window--floating',
						mainWindowDrag.dragging && 'landing-crack__window--dragging',
						windowState === 'minimized' && 'landing-crack__window--minimized',
						isMaximized && 'landing-crack__window--maximized'
					)}
					id={mainWindowId}
					onPointerDown={() => focusWindow('main')}
				>
					<header
						className={clsx('landing-crack__titlebar', mainWindowDrag.dragging && 'landing-crack__titlebar--dragging')}
						style={mainWindowDrag.handleProps.style}
						role="toolbar"
						aria-label="Window title bar"
						onPointerDown={onMainTitlebarPointerDown}
						onPointerMove={mainWindowDrag.handleProps.onPointerMove}
						onPointerUp={mainWindowDrag.handleProps.onPointerUp}
						onPointerCancel={mainWindowDrag.handleProps.onPointerCancel}
						onDoubleClick={onMainTitlebarDoubleClick}
					>
						{isMac ? (
							<span className="landing-crack__traffic">
								<button
									type="button"
									className="landing-crack__traffic-dot landing-crack__traffic-dot--close"
									aria-label="Close window"
									onClick={closeWindow}
								/>
								<button
									type="button"
									className="landing-crack__traffic-dot landing-crack__traffic-dot--min"
									aria-label="Minimize window"
									onClick={minimizeWindow}
								/>
								<button
									type="button"
									className="landing-crack__traffic-dot landing-crack__traffic-dot--zoom"
									aria-label={isMaximized ? 'Exit full screen' : 'Enter full screen'}
									aria-pressed={isMaximized}
									onClick={toggleMaximize}
								/>
							</span>
						) : (
							<span className="landing-crack__titlebar-btns">
								<button
									type="button"
									className="landing-crack__titlebar-btn"
									aria-label="Minimize window"
									onClick={minimizeWindow}
								>
									_
								</button>
								<button
									type="button"
									className="landing-crack__titlebar-btn"
									aria-label={isMaximized ? 'Restore window' : 'Maximize window'}
									aria-pressed={isMaximized}
									onClick={toggleMaximize}
								>
									□
								</button>
								<button
									type="button"
									className="landing-crack__titlebar-btn landing-crack__titlebar-btn--close"
									aria-label="Close window"
									onClick={closeWindow}
								>
									×
								</button>
							</span>
						)}
						<span className="landing-crack__titlebar-text">{windowTitle}</span>
						{isMac && <span className="landing-crack__titlebar-spacer" aria-hidden />}
					</header>

					<div className="landing-crack__client" data-lenis-prevent>
						<p className="landing-crack__cracked">
							{isMac
								? `${macCopy.crackedBanner} (${scene.group})`
								: `*** Cracked by ${scene.group} — ${new Date().getFullYear()} ***`}
						</p>
						<pre className="landing-crack__ascii">{scene.ascii}</pre>

						<div
							ref={terminalRef}
							className="landing-crack__terminal"
							role="log"
							aria-live="polite"
							aria-relevant="additions"
						>
							{scene.logLines.slice(0, visibleLogs).map((line) => (
								<p key={line}>{line}</p>
							))}
							{visibleLogs < scene.logLines.length && (
								<p className="landing-crack__cursor">
									<span>_</span>
								</p>
							)}
						</div>

						<label className="landing-crack__progress-label" htmlFor={progressId}>
							{isMac ? macCopy.progressLabel : 'Installing truth...'}
						</label>
						<progress id={progressId} className="landing-crack__progress" max={100} value={progress} />
						<p className="landing-crack__percent">{progress}%</p>

						<div className="landing-crack__panel" key={effectiveDesktopId}>
							<h1 className="landing-crack__name" id={titleId}>
								{panelTitle}
							</h1>
							{panelTagline && <p className="landing-crack__tag">{panelTagline}</p>}
							{panel?.lines.map((line) => (
								<p
									key={line}
									className={clsx(
										'landing-crack__line',
										line.startsWith('[') || line.startsWith(';') || line.startsWith('@')
											? 'landing-crack__line--mono'
											: undefined
									)}
								>
									{line}
								</p>
							))}
							{panelFootnote && <p className="landing-crack__nfo">{panelFootnote}</p>}
						</div>

						<div className="landing-crack__serial">
							<span>{isMac ? macCopy.serialLabel : 'Serial:'}</span>
							<code>FREE-{app.slug.toUpperCase().replace(/-/g, '')}-2026-OK</code>
						</div>

						<NextLink
							href={app.storeLink}
							className="landing-crack__download"
							target="_blank"
							rel="noopener noreferrer"
						>
							{scene.downloadLabel}
						</NextLink>

						<p className="landing-crack__legal">{scene.paywallNote}</p>
					</div>
				</div>
			)}

			<LandingCrackMascot appSlug={app.slug} skin={skin} />

			{isMac ? (
				<LandingCrackDock
					appSlug={app.slug}
					appName={app.appName}
					mainOpen={showWindow}
					mainMinimized={windowState === 'minimized'}
					onActivateMain={restoreWindow}
					onActivateAudio={() => focusWindow('audio')}
				/>
			) : (
				showDock && (
					<button
						type="button"
						className="landing-crack__dock-icon"
						aria-label={`Restore ${windowTitle}`}
						onClick={restoreWindow}
					>
						<span className="landing-crack__dock-icon-glyph" aria-hidden>
							<AppIcon slug={app.slug} />
						</span>
						<span className="landing-crack__dock-icon-label">{app.appName}</span>
					</button>
				)
			)}

			{!isMac && (
				<LandingCrackTaskbar
					skin={skin}
					appName={app.appName}
					mainTitle={windowTitle}
					mainOpen={showWindow}
					mainMinimized={windowState === 'minimized'}
					onActivate={onTaskbarActivate}
				/>
			)}

			<div className="landing-crack__ticker" aria-hidden>
				<div
					className={clsx('landing-crack__ticker-track', 'landing-crack__ticker-track--scroll')}
					style={{ '--crack-ticker-chars': scene.scrollTicker.length } as CSSProperties}
				>
					<span>{scene.scrollTicker}</span>
					<span>{scene.scrollTicker}</span>
				</div>
			</div>
		</section>
	)
}
