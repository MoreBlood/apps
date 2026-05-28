import { describe, expect, it } from 'vitest'
import { MOCKUP_IPAD, MOCKUP_IPHONE } from '@/lib/device-mockup-sizes'
import { formatLandingStageLayoutSnippet } from '@/lib/landing-stage-tuner'

describe('formatLandingStageLayoutSnippet', () => {
	it('formats device slots for pasting into LAYOUTS', () => {
		const text = formatLandingStageLayoutSnippet('feature', [
			{ id: 'ipad', ...MOCKUP_IPAD, left: 0.02, top: 0.06, rotate: -4 },
			{
				id: 'iphone',
				...MOCKUP_IPHONE,
				left: 0.52,
				top: 0.1,
				rotate: 6,
				scaleMult: 0.9,
				zIndex: 3
			}
		])
		expect(text).toContain("LAYOUTS['feature']")
		expect(text).toContain("id: 'ipad'")
		expect(text).toContain('left: 0.02')
		expect(text).toContain('scaleMult: 0.9')
		expect(text).toContain('zIndex: 3')
	})

	it('exports cluster fit as padding + fitMargin only', () => {
		const text = formatLandingStageLayoutSnippet(
			'hero',
			[{ id: 'ipad', ...MOCKUP_IPAD, left: 0, top: 0.02, rotate: -5 }],
			{
				manualClusterScale: true,
				scaleOverride: 0.34,
				fitMargin: 1.1,
				padding: 32
			}
		)
		expect(text).toContain('padding: 32')
		expect(text).toContain('fitMargin: 1.1')
		expect(text).not.toContain('shadowPad')
		expect(text).not.toContain('filterBleed')
		expect(text).toContain('0.34')
	})

	it('exports cluster fit with zero padding', () => {
		const text = formatLandingStageLayoutSnippet('feature', [], {
			padding: 0,
			fitMargin: 1
		})
		expect(text).toContain("LANDING_STAGE_SCALE_OPTIONS['feature']")
		expect(text).toContain('padding: 0')
		expect(text).toContain('fitMargin: 1')
	})
})
