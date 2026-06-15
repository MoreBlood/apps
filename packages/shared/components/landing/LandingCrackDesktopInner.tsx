'use client'

import clsx from 'clsx'
import NextLink from 'next/link'
import { type CSSProperties, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import AppIcon from '@/components/AppIcon'
import type { LandingAppInfo } from '@/config'
import { getLandingCrackScene } from '@/config/landing-crack-content'
import { getLandingCrackDesktopIcon } from '@/config/landing-crack-desktop'
import { applyMacSceneCopy, getLandingCrackMacCopy } from '@/config/landing-crack-mac'
import { openDesktopIcon } from '@/lib/landing-crack-desktop-open'
import type { InstallPhase } from '@/lib/landing-crack-install-flow'
import {
	buildInstallInitLines,
	buildInstallLogLines,
	logLandingCrackAsciiToConsole
} from '@/lib/landing-crack-install-log'
import type { LandingCrackSkin } from '@/lib/landing-crack-skin'
import CrackWindowFrame from './CrackWindowFrame'
import LandingCrackAudio from './LandingCrackAudio'
import { LandingCrackContextMenuProvider } from './LandingCrackContextMenu'
import LandingCrackDesktop from './LandingCrackDesktop'
import LandingCrackDock from './LandingCrackDock'
import LandingCrackFinder from './LandingCrackFinder'
import { useLandingCrackFinder } from './LandingCrackFinderContext'
import LandingCrackMascot from './LandingCrackMascot'
import LandingCrackPhotoViewer from './LandingCrackPhotoViewer'
import { useLandingCrackShell } from './LandingCrackShellContext'
import LandingCrackTaskbar from './LandingCrackTaskbar'
import LandingCrackTextReader from './LandingCrackTextReader'

type Props = {
	app: LandingAppInfo
	skin?: LandingCrackSkin
}

export default function LandingCrackDesktopInner({ app, skin = 'win' }: Props) {
	const wm = useLandingCrackShell()
	const finderNav = useLandingCrackFinder()
	const titleId = useId()
	const progressId = useId()
	const mainWindowId = useId()
	const isMac = skin === 'mac'
	const macCopy = getLandingCrackMacCopy()
	const rawScene = getLandingCrackScene(app.slug)
	const scene = useMemo(() => (rawScene && isMac ? applyMacSceneCopy(rawScene) : rawScene), [rawScene, isMac])
	const initLogLines = useMemo(() => (scene ? buildInstallInitLines(scene) : []), [scene])
	const installLogLines = useMemo(() => (scene ? buildInstallLogLines(scene) : []), [scene])
	const terminalRef = useRef<HTMLDivElement>(null)
	const installerTimersRef = useRef<ReturnType<typeof globalThis.setInterval>[]>([])
	const [phase, setPhase] = useState<InstallPhase>('init')
	const [progress, setProgress] = useState(0)
	const [visibleLogs, setVisibleLogs] = useState(0)
	const [selectedDesktopId, setSelectedDesktopId] = useState('app')

	const installLabel = isMac ? macCopy.installLabel : '[ Install ]'
	const completeLabel = isMac ? macCopy.completeLabel : '[ OK ] Installation complete.'
	const showInstallerBody = phase === 'ready' || phase === 'installing' || phase === 'complete'
	const showProgress = phase === 'installing' || phase === 'complete'
	const showDownload = phase === 'complete'
	const logStreaming =
		(phase === 'init' && visibleLogs < initLogLines.length) ||
		(phase === 'installing' && visibleLogs < installLogLines.length)

	const mainChrome = wm.getChrome('main')
	const showWinRestoreIcon = !wm.isVisible('main') || mainChrome === 'minimized'

	const installerIcon = getLandingCrackDesktopIcon(app.slug, 'app')
	const panel = installerIcon?.panel
	const panelTitle = app.appName
	const panelTagline = panel?.tagline ?? app.tagline
	const panelFootnote = panel?.footnote ?? scene?.footnote

	const windowTitle = isMac
		? `${app.appName} ${macCopy.windowSuffix}`
		: `${app.appName} Setup — Licensed to: YOU (honest edition)`

	const handleOpenDesktopIcon = useCallback(
		(id: string) => {
			const icon = getLandingCrackDesktopIcon(app.slug, id)
			if (!icon) return
			openDesktopIcon(app.slug, icon, {
				openFinder: finderNav.openFinder,
				openReader: finderNav.openReader,
				openInstaller: () => wm.activate('main')
			})
		},
		[app.slug, finderNav, wm]
	)

	useEffect(() => {
		if (!scene) return
		logLandingCrackAsciiToConsole(scene, app.appName)
	}, [app.appName, scene])

	const clearInstallerTimers = useCallback(() => {
		for (const id of installerTimersRef.current) {
			globalThis.clearInterval(id)
		}
		installerTimersRef.current = []
	}, [])

	const resetInstallerProgress = useCallback(() => {
		if (!scene) return
		clearInstallerTimers()
		setPhase('init')
		setVisibleLogs(0)
		setProgress(0)
		setSelectedDesktopId('app')

		let tick = 0
		const logTimer = globalThis.setInterval(() => {
			tick += 1
			setVisibleLogs(tick)
			if (tick >= initLogLines.length) {
				globalThis.clearInterval(logTimer)
				installerTimersRef.current = installerTimersRef.current.filter((id) => id !== logTimer)
				setPhase('ready')
			}
		}, 280)
		installerTimersRef.current.push(logTimer)
	}, [clearInstallerTimers, initLogLines.length, scene])

	useEffect(() => {
		resetInstallerProgress()
		return () => clearInstallerTimers()
	}, [resetInstallerProgress, clearInstallerTimers])

	useEffect(() => {
		if (mainChrome !== 'closed') return
		resetInstallerProgress()
	}, [mainChrome, resetInstallerProgress])

	useEffect(() => {
		if (phase !== 'installing' || !scene) return

		let tick = initLogLines.length
		const logTimer = globalThis.setInterval(() => {
			tick += 1
			setVisibleLogs(tick)
			if (tick >= installLogLines.length) {
				globalThis.clearInterval(logTimer)
				installerTimersRef.current = installerTimersRef.current.filter((id) => id !== logTimer)
			}
		}, 220)
		installerTimersRef.current.push(logTimer)

		let p = 0
		const progTimer = globalThis.setInterval(() => {
			p += 4
			const next = Math.min(p, 100)
			setProgress(next)
			if (next >= 100) {
				globalThis.clearInterval(progTimer)
				installerTimersRef.current = installerTimersRef.current.filter((id) => id !== progTimer)
				setPhase('complete')
			}
		}, 90)
		installerTimersRef.current.push(progTimer)

		return () => {
			globalThis.clearInterval(logTimer)
			globalThis.clearInterval(progTimer)
			installerTimersRef.current = installerTimersRef.current.filter((id) => id !== logTimer && id !== progTimer)
		}
	}, [phase, initLogLines.length, installLogLines.length, scene])

	const startInstall = () => {
		if (phase !== 'ready') return
		setPhase('installing')
		setProgress(0)
	}

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
		if (mainChrome !== 'maximized') return
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') wm.setChrome('main', 'normal')
		}
		globalThis.addEventListener('keydown', onKey)
		return () => globalThis.removeEventListener('keydown', onKey)
	}, [mainChrome, wm])

	if (!scene || !app.storeLink) {
		return (
			<section className="landing-ab-minimal landing-ab-minimal--fallback" aria-labelledby={titleId}>
				<h1 id={titleId}>{app.appName}</h1>
				<p>{app.tagline}</p>
			</section>
		)
	}

	return (
		<LandingCrackContextMenuProvider app={app} skin={skin} onDeselectDesktop={() => setSelectedDesktopId('')}>
			{({ openDesktopMenu, desktopLayoutKey }) => (
				<section className={clsx('landing-crack', isMac && 'landing-crack--mac')} aria-labelledby={titleId}>
					<div className="landing-crack__workarea" aria-hidden />
					<button
						type="button"
						className="landing-crack__desktop-surface"
						aria-label="Desktop background"
						onClick={() => setSelectedDesktopId('')}
						onContextMenu={openDesktopMenu}
					/>
					<div className="landing-crack__desktop" aria-hidden />
					<LandingCrackDesktop
						key={desktopLayoutKey}
						appSlug={app.slug}
						skin={skin}
						selectedId={selectedDesktopId}
						onSelect={setSelectedDesktopId}
						onOpen={handleOpenDesktopIcon}
					/>
					<LandingCrackAudio className="landing-crack__audio" skin={skin} />
					<LandingCrackFinder appSlug={app.slug} skin={skin} />
					<LandingCrackPhotoViewer appSlug={app.slug} skin={skin} />
					<LandingCrackTextReader appSlug={app.slug} skin={skin} />
					<CrackWindowFrame
						windowId="main"
						skin={skin}
						title={windowTitle}
						rootId={mainWindowId}
						footer={
							<div className="landing-crack__ticker" aria-hidden>
								<div
									className={clsx('landing-crack__ticker-track', 'landing-crack__ticker-track--scroll')}
									style={{ '--crack-ticker-chars': scene.scrollTicker.length } as CSSProperties}
								>
									<span>{scene.scrollTicker}</span>
									<span>{scene.scrollTicker}</span>
								</div>
							</div>
						}
					>
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
								{installLogLines.slice(0, visibleLogs).map((line) => (
									<p
										key={line.id}
										className={clsx(
											line.kind === 'spacer' && 'landing-crack__log-line--spacer',
											line.kind === 'ascii' && 'landing-crack__log-line--ascii'
										)}
									>
										{line.kind === 'spacer' ? '\u00a0' : line.text}
									</p>
								))}
								{logStreaming && (
									<p className="landing-crack__cursor">
										<span>_</span>
									</p>
								)}
							</div>

							{phase === 'ready' && (
								<button type="button" className="landing-crack__install" onClick={startInstall}>
									{installLabel}
								</button>
							)}

							{showProgress && (
								<>
									<label className="landing-crack__progress-label" htmlFor={progressId}>
										{isMac ? macCopy.progressLabel : 'Installing truth...'}
									</label>
									<progress id={progressId} className="landing-crack__progress" max={100} value={progress} />
									<p className="landing-crack__percent">{progress}%</p>
								</>
							)}

							{phase === 'complete' && <p className="landing-crack__complete">{completeLabel}</p>}

							{showInstallerBody && (
								<>
									<div className="landing-crack__panel" key="installer">
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
								</>
							)}

							{showDownload && app.storeLink && (
								<>
									<NextLink
										href={app.storeLink}
										className="landing-crack__download"
										target="_blank"
										rel="noopener noreferrer"
									>
										{scene.downloadLabel}
									</NextLink>
									<p className="landing-crack__legal">{scene.paywallNote}</p>
								</>
							)}
						</div>
					</CrackWindowFrame>
					<LandingCrackMascot appSlug={app.slug} skin={skin} />
					{isMac ? (
						<LandingCrackDock appSlug={app.slug} appName={app.appName} />
					) : (
						showWinRestoreIcon && (
							<button
								type="button"
								className="landing-crack__dock-icon"
								aria-label={`Restore ${windowTitle}`}
								onClick={() => wm.activate('main')}
							>
								<span className="landing-crack__dock-icon-glyph" aria-hidden>
									<AppIcon slug={app.slug} />
								</span>
								<span className="landing-crack__dock-icon-label">{app.appName}</span>
							</button>
						)
					)}
					!isMac && <LandingCrackTaskbar skin={skin} appName={app.appName} mainTitle={windowTitle} />
				</section>
			)}
		</LandingCrackContextMenuProvider>
	)
}
