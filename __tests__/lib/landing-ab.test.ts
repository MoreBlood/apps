import { afterEach, describe, expect, it, vi } from 'vitest'
import {
	getLandingAbAntiSplitPercent,
	isLandingAbExperimentEnabled,
	parseLandingAbOverride,
	pickLandingAbVariant,
	resolveLandingAbVariant
} from '@/lib/landing-ab'

describe('landing-ab', () => {
	afterEach(() => {
		vi.unstubAllEnvs()
	})

	it('parses query overrides', () => {
		expect(parseLandingAbOverride('anti')).toBe('anti')
		expect(parseLandingAbOverride('b')).toBe('anti')
		expect(parseLandingAbOverride('control')).toBe('control')
		expect(parseLandingAbOverride('nope')).toBeNull()
	})

	it('defaults split to 0 (query-only access)', () => {
		expect(getLandingAbAntiSplitPercent()).toBe(0)
		expect(isLandingAbExperimentEnabled()).toBe(false)
	})

	it('reads split percent from env for random assignment helpers', () => {
		vi.stubEnv('NEXT_PUBLIC_LANDING_AB_ANTI_PERCENT', '100')
		expect(getLandingAbAntiSplitPercent()).toBe(100)
		expect(isLandingAbExperimentEnabled()).toBe(true)
		expect(pickLandingAbVariant()).toBe('anti')
	})

	it('resolves variant from query only', () => {
		expect(resolveLandingAbVariant(null)).toBe('control')
		expect(resolveLandingAbVariant('anti')).toBe('anti')
		expect(resolveLandingAbVariant('control')).toBe('control')
		expect(resolveLandingAbVariant('nope')).toBe('control')
	})

	it('assigns anti or control from random split', () => {
		vi.stubEnv('NEXT_PUBLIC_LANDING_AB_ANTI_PERCENT', '50')
		vi.spyOn(Math, 'random').mockReturnValue(0.1)
		expect(pickLandingAbVariant()).toBe('anti')
		vi.spyOn(Math, 'random').mockReturnValue(0.9)
		expect(pickLandingAbVariant()).toBe('control')
	})
})
