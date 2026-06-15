'use client'

import clsx from 'clsx'
import { useCallback, useEffect, useRef, useState } from 'react'
import AppIcon from '@/components/AppIcon'
import { type CrackDesktopIcon, getLandingCrackDesktopIcons } from '@/config/landing-crack-desktop'
import { getMacClassic9DesktopIconId } from '@/config/landing-mac-classic-icons'
import {
	type DesktopIconPosition,
	initialDesktopPositions,
	isDesktopIconClick,
	parseCssPercent,
	toCssPercent
} from '@/lib/landing-crack-desktop-drag'
import type { LandingCrackSkin } from '@/lib/landing-crack-skin'
import MacClassic9Icon from './MacClassic9Icon'

type Props = {
	appSlug: string
	skin?: LandingCrackSkin
	selectedId: string
	onSelect: (id: string) => void
	onOpen: (id: string) => void
}

export default function LandingCrackDesktop({ appSlug, skin = 'win', selectedId, onSelect, onOpen }: Props) {
	const icons = getLandingCrackDesktopIcons(appSlug)
	const containerRef = useRef<HTMLDivElement>(null)
	const [positions, setPositions] = useState<Record<string, DesktopIconPosition>>({})

	const isMac = skin === 'mac'

	useEffect(() => {
		setPositions(initialDesktopPositions(getLandingCrackDesktopIcons(appSlug)))
	}, [appSlug])

	const updatePosition = useCallback((id: string, next: DesktopIconPosition) => {
		setPositions((prev) => ({ ...prev, [id]: next }))
	}, [])

	if (icons.length === 0) return null

	return (
		<div ref={containerRef} className={clsx('landing-crack-desktop', isMac && 'landing-crack-desktop--mac')}>
			{icons.map((icon) => (
				<DesktopIconButton
					key={icon.id}
					icon={icon}
					appSlug={appSlug}
					isMac={isMac}
					containerRef={containerRef}
					position={positions[icon.id] ?? { left: icon.left, top: icon.top }}
					selected={selectedId === icon.id && selectedId !== ''}
					onSelect={() => onSelect(icon.id)}
					onOpen={() => onOpen(icon.id)}
					onMove={(next) => updatePosition(icon.id, next)}
				/>
			))}
		</div>
	)
}

function DesktopIconButton({
	icon,
	appSlug,
	isMac,
	containerRef,
	position,
	selected,
	onSelect,
	onOpen,
	onMove
}: {
	icon: CrackDesktopIcon
	appSlug: string
	isMac: boolean
	containerRef: React.RefObject<HTMLDivElement | null>
	position: DesktopIconPosition
	selected: boolean
	onSelect: () => void
	onOpen: () => void
	onMove: (next: DesktopIconPosition) => void
}) {
	const label = icon.label.replace('\n', ' ')
	const macIconId = isMac ? getMacClassic9DesktopIconId(icon.kind, icon.id) : null
	const dragRef = useRef<{
		pointerId: number
		startClientX: number
		startClientY: number
		startLeftPx: number
		startTopPx: number
		moved: number
	} | null>(null)

	const endDrag = useCallback(
		(target: HTMLElement, pointerId: number) => {
			if (dragRef.current?.pointerId === pointerId) {
				if (isDesktopIconClick(dragRef.current.moved)) onSelect()
				dragRef.current = null
			}
			target.releasePointerCapture(pointerId)
			target.classList.remove('landing-crack-desktop__icon--dragging')
		},
		[onSelect]
	)

	const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
		if (e.button !== 0) return
		const container = containerRef.current
		if (!container) return

		const rect = container.getBoundingClientRect()
		const el = e.currentTarget
		const startLeftPx = parseCssPercent(position.left, rect.width)
		const startTopPx = parseCssPercent(position.top, rect.height)

		dragRef.current = {
			pointerId: e.pointerId,
			startClientX: e.clientX,
			startClientY: e.clientY,
			startLeftPx,
			startTopPx,
			moved: 0
		}
		el.setPointerCapture(e.pointerId)
		el.classList.add('landing-crack-desktop__icon--dragging')
		e.preventDefault()
	}

	const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
		const drag = dragRef.current
		const container = containerRef.current
		if (!drag || drag.pointerId !== e.pointerId || !container) return

		const rect = container.getBoundingClientRect()
		const dx = e.clientX - drag.startClientX
		const dy = e.clientY - drag.startClientY
		drag.moved = Math.max(drag.moved, Math.hypot(dx, dy))

		const el = e.currentTarget
		const maxLeft = rect.width - el.offsetWidth
		const maxTop = rect.height - el.offsetHeight
		const leftPx = Math.min(maxLeft, Math.max(0, drag.startLeftPx + dx))
		const topPx = Math.min(maxTop, Math.max(0, drag.startTopPx + dy))

		onMove({
			left: toCssPercent(leftPx, rect.width),
			top: toCssPercent(topPx, rect.height)
		})
	}

	const onPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
		endDrag(e.currentTarget, e.pointerId)
	}

	const onPointerCancel = (e: React.PointerEvent<HTMLButtonElement>) => {
		endDrag(e.currentTarget, e.pointerId)
	}

	return (
		<button
			type="button"
			className={clsx(
				'landing-crack-desktop__icon',
				isMac && 'landing-crack-desktop__icon--square',
				selected && 'landing-crack-desktop__icon--selected'
			)}
			style={{ left: position.left, top: position.top }}
			aria-label={label}
			aria-pressed={selected}
			onDoubleClick={(e) => {
				e.preventDefault()
				onOpen()
			}}
			onPointerDown={onPointerDown}
			onPointerMove={onPointerMove}
			onPointerUp={onPointerUp}
			onPointerCancel={onPointerCancel}
		>
			<span className="landing-crack-desktop__tile">
				{icon.kind === 'app' ? (
					<span className="landing-crack-desktop__glyph landing-crack-desktop__glyph--app">
						<AppIcon slug={appSlug} />
					</span>
				) : macIconId != null ? (
					<span
						className={clsx(
							'landing-crack-desktop__glyph',
							'landing-crack-desktop__glyph--raster',
							`landing-crack-desktop__glyph--${icon.kind}`
						)}
					>
						<MacClassic9Icon id={macIconId} alt="" />
					</span>
				) : (
					<span className={`landing-crack-desktop__glyph landing-crack-desktop__glyph--${icon.kind}`} />
				)}
			</span>
			<span className="landing-crack-desktop__label">
				{icon.label.split('\n').map((line) => (
					<span key={line} className="landing-crack-desktop__label-line">
						{line}
					</span>
				))}
			</span>
		</button>
	)
}
