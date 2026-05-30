import type { MouseEvent } from 'react'

const POINTER_LERP = 0.12
const POINTER_EPSILON = 0.08

type PointerState = {
	x: number
	y: number
	tx: number
	ty: number
	raf?: number
}

const pointerStateBySurface = new WeakMap<HTMLElement, PointerState>()

function setPointerPosition(surface: HTMLElement, x: number, y: number) {
	surface.style.setProperty('--landing-pointer-x', `${x}%`)
	surface.style.setProperty('--landing-pointer-y', `${y}%`)
}

function stopPointerAnimation(surface: HTMLElement) {
	const state = pointerStateBySurface.get(surface)
	if (!state?.raf) return
	cancelAnimationFrame(state.raf)
	state.raf = undefined
}

function runPointerAnimation(surface: HTMLElement) {
	const state = pointerStateBySurface.get(surface)
	if (!state) return

	const tick = () => {
		if (surface.dataset.pointerActive !== 'true') {
			state.raf = undefined
			return
		}

		state.x += (state.tx - state.x) * POINTER_LERP
		state.y += (state.ty - state.y) * POINTER_LERP
		setPointerPosition(surface, state.x, state.y)

		const delta = Math.hypot(state.tx - state.x, state.ty - state.y)
		if (delta > POINTER_EPSILON) {
			state.raf = requestAnimationFrame(tick)
		} else {
			state.raf = undefined
		}
	}

	if (!state.raf) {
		state.raf = requestAnimationFrame(tick)
	}
}

export function onLandingSurfacePointerMove(event: MouseEvent<HTMLElement>) {
	const surface = event.currentTarget
	const rect = surface.getBoundingClientRect()
	if (rect.width === 0 || rect.height === 0) return

	const tx = ((event.clientX - rect.left) / rect.width) * 100
	const ty = ((event.clientY - rect.top) / rect.height) * 100

	let state = pointerStateBySurface.get(surface)
	if (!state) {
		state = { x: tx, y: ty, tx, ty }
		pointerStateBySurface.set(surface, state)
		setPointerPosition(surface, tx, ty)
	} else {
		state.tx = tx
		state.ty = ty
	}

	surface.dataset.pointerActive = 'true'
	runPointerAnimation(surface)
}

export function onLandingSurfacePointerLeave(event: MouseEvent<HTMLElement>) {
	const surface = event.currentTarget
	surface.dataset.pointerActive = 'false'
	stopPointerAnimation(surface)
}

/** @deprecated Use onLandingSurfacePointerMove */
export const onLandingPrimaryGridCardPointerMove = onLandingSurfacePointerMove

/** @deprecated Use onLandingSurfacePointerLeave */
export const onLandingPrimaryGridCardPointerLeave = onLandingSurfacePointerLeave
