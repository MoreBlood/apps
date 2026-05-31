'use client'

import clsx from 'clsx'
import { type CSSProperties, useEffect, useId, useRef, useState } from 'react'
import { assetPath } from '@/lib/basePath'
import type { LandingCrackSkin } from '@/lib/landing-crack-skin'
import { useDraggablePanel } from '@/lib/landing-crack-window-drag'
import { useLandingCrackShell } from './LandingCrackShellContext'

const TRACK = assetPath('/audio/landing-crack-loop.mp3')
const MAC_TRACK_TITLE = 'Chiploop.mod — Honest Edition'

type Props = {
	className?: string
	skin?: LandingCrackSkin
}

export default function LandingCrackAudio({ className, skin = 'win' }: Props) {
	const { focusWindow, getWindowZIndex, isWindowFocused } = useLandingCrackShell()
	const audioRef = useRef<HTMLAudioElement>(null)
	const volumeId = useId()
	const [playing, setPlaying] = useState(false)
	const [paused, setPaused] = useState(false)
	const [blocked, setBlocked] = useState(false)
	const [muted, setMuted] = useState(false)
	const [volume, setVolume] = useState(0.42)

	const isMac = skin === 'mac'
	const vizActive = playing && !paused && !muted
	const audioFocused = isWindowFocused('audio')
	const audioDrag = useDraggablePanel(false, {
		zIndex: getWindowZIndex('audio'),
		zIndexDragging: getWindowZIndex('audio', true),
		onInteraction: () => focusWindow('audio')
	})
	const shellZ = getWindowZIndex('audio', audioDrag.dragging)
	const audioPanelStyle: CSSProperties = {
		...audioDrag.panelStyle,
		zIndex: shellZ
	}

	useEffect(() => {
		const reduced = globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
		if (reduced) return

		const audio = audioRef.current
		if (!audio) return

		audio.volume = volume
		audio.loop = true

		void audio.play().then(
			() => {
				setPlaying(true)
				setPaused(false)
				setBlocked(false)
			},
			() => setBlocked(true)
		)
	}, [])

	useEffect(() => {
		const audio = audioRef.current
		if (audio) audio.volume = volume
	}, [volume])

	const startMusic = () => {
		const audio = audioRef.current
		if (!audio) return
		void audio.play().then(
			() => {
				setPlaying(true)
				setPaused(false)
				setBlocked(false)
			},
			() => setBlocked(true)
		)
	}

	const togglePlay = () => {
		const audio = audioRef.current
		if (!audio) return
		if (blocked) {
			startMusic()
			return
		}
		if (audio.paused) {
			void audio.play().then(
				() => {
					setPlaying(true)
					setPaused(false)
				},
				() => setBlocked(true)
			)
		} else {
			audio.pause()
			setPaused(true)
		}
	}

	const toggleMute = () => {
		const audio = audioRef.current
		if (!audio) return
		audio.muted = !audio.muted
		setMuted(audio.muted)
	}

	const onVolumeChange = (value: number) => {
		const next = Math.min(1, Math.max(0, value))
		setVolume(next)
		const audio = audioRef.current
		if (audio) {
			audio.volume = next
			if (next > 0 && audio.muted) {
				audio.muted = false
				setMuted(false)
			}
		}
	}

	return (
		<div
			className={clsx(className, isMac && 'landing-crack-audio--mac')}
			style={{ position: 'relative', zIndex: shellZ }}
		>
			<audio ref={audioRef} src={TRACK} preload="auto" aria-label="Background chiptune loop">
				<track kind="captions" label="No speech" />
			</audio>

			{isMac ? (
				<section aria-label="QuickTime Player" onPointerDown={() => focusWindow('audio')}>
					<div
						ref={audioDrag.panelRef}
						style={audioPanelStyle}
						className={clsx(
							'landing-crack-audio__player',
							audioFocused && 'landing-crack-audio__player--focused',
							audioDrag.isFloating && 'landing-crack-audio__player--floating',
							audioDrag.dragging && 'landing-crack-audio__player--dragging'
						)}
					>
						<div
							className={clsx(
								'landing-crack-audio__titlebar',
								audioDrag.dragging && 'landing-crack-audio__titlebar--dragging'
							)}
							{...audioDrag.handleProps}
						>
							<span className="landing-crack-audio__traffic" aria-hidden>
								<span className="landing-crack-audio__dot landing-crack-audio__dot--close" />
								<span className="landing-crack-audio__dot landing-crack-audio__dot--min" />
								<span className="landing-crack-audio__dot landing-crack-audio__dot--zoom" />
							</span>
							<span className="landing-crack-audio__window-title">QuickTime Player</span>
						</div>

						<div className="landing-crack-audio__body">
							<button
								type="button"
								className="landing-crack-audio__play"
								aria-label={paused || blocked ? 'Play' : 'Pause'}
								onClick={togglePlay}
							>
								{paused || blocked ? (
									<span className="landing-crack-audio__play-icon" aria-hidden />
								) : (
									<span className="landing-crack-audio__pause-icon" aria-hidden />
								)}
							</button>

							<div className="landing-crack-audio__lcd" aria-live="polite">
								<span className="landing-crack-audio__lcd-scroll">{MAC_TRACK_TITLE}</span>
							</div>

							<div
								className={clsx('landing-crack-audio__meters', vizActive && 'landing-crack-audio__meters--live')}
								aria-hidden
							>
								{[0, 1, 2, 3, 4].map((i) => (
									<span key={i} className="landing-crack-audio__meter" style={{ '--meter-i': i } as CSSProperties} />
								))}
							</div>
						</div>

						<div className="landing-crack-audio__footer">
							<button
								type="button"
								className="landing-crack-audio__mute"
								aria-pressed={muted}
								aria-label={muted ? 'Unmute' : 'Mute'}
								onClick={toggleMute}
								disabled={!playing || blocked}
							>
								<span aria-hidden>{muted ? '🔇' : '🔈'}</span>
							</button>
							<label className="landing-crack-audio__volume" htmlFor={volumeId}>
								<span className="visually-hidden">Volume</span>
								<input
									id={volumeId}
									type="range"
									min={0}
									max={100}
									value={Math.round(volume * 100)}
									onChange={(e) => onVolumeChange(Number(e.target.value) / 100)}
								/>
							</label>
							{blocked && (
								<button type="button" className="landing-crack-audio__enable" onClick={startMusic}>
									Click to play
								</button>
							)}
						</div>
					</div>
				</section>
			) : (
				<div
					ref={audioDrag.panelRef}
					className={clsx(
						'landing-crack-audio__bar',
						audioFocused && 'landing-crack-audio__bar--focused',
						audioDrag.isFloating && 'landing-crack-audio__bar--floating',
						audioDrag.dragging && 'landing-crack-audio__bar--dragging'
					)}
					style={{ ...audioPanelStyle, ...audioDrag.handleProps.style }}
					onPointerDown={(e) => {
						focusWindow('audio')
						audioDrag.handleProps.onPointerDown(e)
					}}
					onPointerMove={audioDrag.handleProps.onPointerMove}
					onPointerUp={audioDrag.handleProps.onPointerUp}
					onPointerCancel={audioDrag.handleProps.onPointerCancel}
				>
					<span className="landing-crack-audio__label" aria-hidden>
						♫ RAD TRACKER v3.11
					</span>
					{blocked && !playing && (
						<button type="button" className="landing-crack-audio__btn" onClick={startMusic}>
							[ Enable keygen soundtrack ]
						</button>
					)}
					{playing && (
						<button type="button" className="landing-crack-audio__btn" onClick={toggleMute} aria-pressed={muted}>
							{muted ? '[ Unmute ]' : '[ Mute ]'}
						</button>
					)}
					<span className="landing-crack-audio__viz" aria-hidden>
						{vizActive ? '▁▃▅▇▅▃▁' : '·······'}
					</span>
				</div>
			)}
		</div>
	)
}
