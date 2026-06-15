'use client'

import { type RefObject, useCallback, useEffect, useState } from 'react'
import type { CrackContextMenuItem } from '@/config/landing-crack-context-menu'

export type CrackContextMenuState = {
	x: number
	y: number
	items: CrackContextMenuItem[]
}

const MENU_PAD = 8

function clampMenuPosition(x: number, y: number, width: number, height: number) {
	const maxX = Math.max(MENU_PAD, globalThis.innerWidth - width - MENU_PAD)
	const maxY = Math.max(MENU_PAD, globalThis.innerHeight - height - MENU_PAD)
	return {
		x: Math.min(maxX, Math.max(MENU_PAD, x)),
		y: Math.min(maxY, Math.max(MENU_PAD, y))
	}
}

export function useCrackContextMenu(menuRef: RefObject<HTMLElement | null>) {
	const [menu, setMenu] = useState<CrackContextMenuState | null>(null)

	const close = useCallback(() => setMenu(null), [])

	const open = useCallback((e: React.MouseEvent, items: CrackContextMenuItem[]) => {
		e.preventDefault()
		e.stopPropagation()
		if (items.length === 0) return
		setMenu({ x: e.clientX, y: e.clientY, items })
	}, [])

	useEffect(() => {
		if (!menu) return

		const onPointerDown = (e: PointerEvent) => {
			if (menuRef.current?.contains(e.target as Node)) return
			close()
		}
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') close()
		}
		const onScroll = () => close()

		globalThis.addEventListener('pointerdown', onPointerDown, true)
		globalThis.addEventListener('keydown', onKey)
		globalThis.addEventListener('scroll', onScroll, true)

		return () => {
			globalThis.removeEventListener('pointerdown', onPointerDown, true)
			globalThis.removeEventListener('keydown', onKey)
			globalThis.removeEventListener('scroll', onScroll, true)
		}
	}, [close, menu, menuRef])

	useEffect(() => {
		if (!menu || !menuRef.current) return
		const el = menuRef.current
		const { x, y } = clampMenuPosition(menu.x, menu.y, el.offsetWidth, el.offsetHeight)
		if (x !== menu.x || y !== menu.y) {
			setMenu((prev) => (prev ? { ...prev, x, y } : prev))
		}
	}, [menu, menuRef])

	return { menu, open, close }
}
