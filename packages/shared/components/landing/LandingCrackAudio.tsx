'use client'

import clsx from 'clsx'
import { type CSSProperties, useEffect, useId, useRef, useState } from 'react'
import { getCrackShellLabel } from '@/config/landing-crack-windows'
import { assetPath } from '@/lib/basePath'
import type { LandingCrackSkin } from '@/lib/landing-crack-skin'
import CrackWindowFrame from './CrackWindowFrame'

const TRACK = assetPath('/audio/landing-crack-loop.mp3')
const MAC_TRACK_TITLE = 'Chiploop.mod — Honest Edition'

type Props = {
	className?: string
	skin?: LandingCrackSkin
}

export default function LandingCrackAudio({ className, skin = 'win' }: Props) {
	const audioRef = useRef<HTMLAudioElement>(null)
	const volumeId = useId()
	const [playing, setPlaying] = useState(false)
	const [paused, setPaused] = useState(false)
	const [blocked, setBlocked] = useState(false)
	const [muted, setMuted] = useState(false)
	const [volume, setVolume] = useState(0.42)

	const isMac = skin === 'mac'
	const vizActive = playing && !paused && !muted
	const title = getCrackShellLabel('audio', skin)

	useEffect(() => {
		const reduced = globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
		if (reduced) return

		const el = audioRef.current
		if (!el) return

		el.volume = volume
		el.loop = true

		void el.play().then(
			() => {
				setPlaying(true)
				setPaused(false)
				setBlocked(false)
			},
			() => setBlocked(true)
		)
	}, [])

	useEffect(() => {
		const el = audioRef.current
		if (el) el.volume = volume
	}, [volume])

	const startMusic = () => {
		const el = audioRef.current
		if (!el) return
		void el.play().then(
			() => {
				setPlaying(true)
				setPaused(false)
				setBlocked(false)
			},
			() => setBlocked(true)
		)
	}

	const togglePlay = () => {
		const el = audioRef.current
		if (!el) return
		if (blocked) {
			startMusic()
			return
		}
		if (el.paused) {
			void el.play().then(
				() => {
					setPlaying(true)
					setPaused(false)
				},
				() => setBlocked(true)
			)
		} else {
			el.pause()
			setPaused(true)
		}
	}

	const toggleMute = () => {
		const el = audioRef.current
		if (!el) return
		el.muted = !el.muted
		setMuted(el.muted)
	}

	const onVolumeChange = (value: number) => {
		const next = Math.min(1, Math.max(0, value))
		setVolume(next)
		const el = audioRef.current
		if (el) {
			el.volume = next
			if (next > 0 && el.muted) {
				el.muted = false
				setMuted(false)
			}
		}
	}

	const macBody = (
		<>
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
		</>
	)

	const winBar = (
		<div className="landing-crack-audio__bar-body">
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
	)

	return (
		<div className={clsx(className, isMac && 'landing-crack-audio--mac')}>
			<audio ref={audioRef} src={TRACK} preload="auto" aria-label="Background chiptune loop">
				<track kind="captions" label="No speech" />
			</audio>

			<CrackWindowFrame windowId="audio" skin={skin} title={title} ariaLabel={isMac ? title : undefined}>
				{isMac ? macBody : winBar}
			</CrackWindowFrame>
		</div>
	)
}
