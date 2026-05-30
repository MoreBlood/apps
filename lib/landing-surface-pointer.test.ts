import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { onLandingSurfacePointerLeave, onLandingSurfacePointerMove } from './landing-surface-pointer'

function mockSurface(rect: { left: number; top: number; width: number; height: number }) {
	const style = {
		props: {} as Record<string, string>,
		setProperty(key: string, value: string) {
			this.props[key] = value
		},
		getPropertyValue(key: string) {
			return this.props[key] ?? ''
		}
	}

	return {
		style,
		dataset: {} as DOMStringMap & { pointerActive?: string },
		getBoundingClientRect: () => rect as DOMRect
	} as unknown as HTMLElement
}

describe('landing-surface-pointer', () => {
	beforeEach(() => {
		vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
			cb(0)
			return 1
		})
		vi.stubGlobal('cancelAnimationFrame', vi.fn())
	})

	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('sets pointer CSS variables from mouse position', () => {
		const surface = mockSurface({ left: 100, top: 50, width: 200, height: 100 })

		onLandingSurfacePointerMove({
			currentTarget: surface,
			clientX: 150,
			clientY: 75
		} as React.MouseEvent<HTMLElement>)

		expect(surface.style.getPropertyValue('--landing-pointer-x')).toBe('25%')
		expect(surface.style.getPropertyValue('--landing-pointer-y')).toBe('25%')
		expect(surface.dataset.pointerActive).toBe('true')
	})

	it('clears pointer active state on leave', () => {
		const surface = mockSurface({ left: 0, top: 0, width: 100, height: 100 })
		surface.dataset.pointerActive = 'true'

		onLandingSurfacePointerLeave({
			currentTarget: surface
		} as React.MouseEvent<HTMLElement>)

		expect(surface.dataset.pointerActive).toBe('false')
	})

	it('ignores move when surface has zero size', () => {
		const surface = mockSurface({ left: 0, top: 0, width: 0, height: 0 })
		const setProperty = vi.spyOn(surface.style, 'setProperty')

		onLandingSurfacePointerMove({
			currentTarget: surface,
			clientX: 10,
			clientY: 10
		} as React.MouseEvent<HTMLElement>)

		expect(setProperty).not.toHaveBeenCalled()
	})
})
