import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
	parseLandingCrackSkinOverride,
	resolveLandingCrackSkin,
	writeLandingCrackSkinStorage
} from '@/lib/landing-crack-skin'

function mockSessionStorage() {
	const store = new Map<string, string>()
	vi.stubGlobal('sessionStorage', {
		getItem: (key: string) => store.get(key) ?? null,
		setItem: (key: string, value: string) => {
			store.set(key, value)
		},
		removeItem: (key: string) => {
			store.delete(key)
		},
		clear: () => {
			store.clear()
		}
	} as Storage)
}

describe('landing-crack-skin', () => {
	beforeEach(() => {
		mockSessionStorage()
	})
	it('parses mac and win overrides', () => {
		expect(parseLandingCrackSkinOverride('mac')).toBe('mac')
		expect(parseLandingCrackSkinOverride('system7')).toBe('mac')
		expect(parseLandingCrackSkinOverride('win')).toBe('win')
		expect(parseLandingCrackSkinOverride('nope')).toBeNull()
	})

	it('defaults to win without override', () => {
		sessionStorage.clear()
		expect(resolveLandingCrackSkin(null)).toBe('win')
	})

	it('persists query override to session storage', () => {
		sessionStorage.clear()
		expect(resolveLandingCrackSkin('mac')).toBe('mac')
		expect(resolveLandingCrackSkin(null)).toBe('mac')
		writeLandingCrackSkinStorage('win')
		expect(resolveLandingCrackSkin(null)).toBe('win')
	})
})
