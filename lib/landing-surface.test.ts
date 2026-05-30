import { describe, expect, it } from 'vitest'
import { landingSurfaceClassName } from './landing-surface'

describe('landingSurfaceClassName', () => {
	it('includes apple corners and radius by default', () => {
		expect(landingSurfaceClassName({ metal: true })).toContain('landing-surface--apple-corners')
		expect(landingSurfaceClassName({ metal: true })).toContain('landing-surface--radius-card')
	})

	it('can disable apple corners', () => {
		const cn = landingSurfaceClassName({ metal: true, appleCorners: false })
		expect(cn).not.toContain('landing-surface--apple-corners')
	})

	it('supports tile radius preset', () => {
		expect(landingSurfaceClassName({ metal: true, radius: 'tile' })).toContain('landing-surface--radius-tile')
	})
})
