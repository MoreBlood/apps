import { describe, expect, it } from 'vitest'
import { MOCKUP_IPAD, MOCKUP_IPHONE } from '@/lib/device-mockup-sizes'
import { formatLandingStageLayoutSnippet } from '@/lib/landing-stage-tuner'

describe('formatLandingStageLayoutSnippet', () => {
	it('formats device slots for pasting into LAYOUTS', () => {
		const text = formatLandingStageLayoutSnippet('iphone-left', [
			{ id: 'ipad', ...MOCKUP_IPAD, x: 24, y: 45, rotate: -4 },
			{
				id: 'iphone',
				...MOCKUP_IPHONE,
				x: -120,
				y: 75,
				rotate: 6,
				scaleMult: 0.9,
				zIndex: 3
			}
		])
		expect(text).toContain("LANDING_STAGE_LAYOUTS['iphone-left']")
		expect(text).toContain("id: 'ipad'")
		expect(text).toContain('x: 24')
		expect(text).toContain('y: 45')
		expect(text).toContain('scaleMult: 0.9')
		expect(text).toContain('zIndex: 3')
	})

	it('exports cluster fit as padding + fitMargin only', () => {
		const text = formatLandingStageLayoutSnippet('default', [{ id: 'ipad', ...MOCKUP_IPAD, x: 0, y: 15, rotate: -5 }], {
			manualClusterScale: true,
			scaleOverride: 0.34,
			fitMargin: 1.1,
			padding: 32
		})
		expect(text).toContain('padding: 32')
		expect(text).toContain('fitMargin: 1.1')
		expect(text).not.toContain('shadowPad')
		expect(text).not.toContain('filterBleed')
		expect(text).toContain('0.34')
	})

	it('exports cluster fit with zero padding', () => {
		const text = formatLandingStageLayoutSnippet('ipad-left', [], {
			padding: 0,
			fitMargin: 1
		})
		expect(text).toContain('LANDING_STAGE_SCALE_OPTIONS')
		expect(text).toContain('padding: 0')
		expect(text).toContain('fitMargin: 1')
	})
})
