import { afterEach, describe, expect, it, vi } from 'vitest'
import { resolveFeedbackProviderConfig } from '@/lib/feedback/config'

vi.mock('@/config', () => ({
	getAppBySlug: vi.fn((slug: string) => {
		if (slug === 'rawclinic') {
			return { slug: 'rawclinic', web3formsAccessKey: 'app-raw-key' }
		}
		return null
	})
}))

const FEEDBACK_ENV_KEYS = [
	'NEXT_PUBLIC_FEEDBACK_PROVIDER',
	'NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY',
	'NEXT_PUBLIC_FORMSPREE_FORM_ID',
	'NEXT_PUBLIC_SUPABASE_URL',
	'NEXT_PUBLIC_SUPABASE_ANON_KEY',
	'NEXT_PUBLIC_SUPABASE_FEEDBACK_TABLE',
	'NEXT_PUBLIC_FEEDBACK_ENDPOINT',
	'NODE_ENV'
] as const

describe('resolveFeedbackProviderConfig', () => {
	afterEach(() => {
		vi.unstubAllEnvs()
	})

	function clearFeedbackEnv() {
		for (const key of FEEDBACK_ENV_KEYS) {
			vi.stubEnv(key, undefined)
		}
	}

	it('uses explicit web3forms with env key when app has no key', () => {
		clearFeedbackEnv()
		vi.stubEnv('NEXT_PUBLIC_FEEDBACK_PROVIDER', 'web3forms')
		vi.stubEnv('NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY', 'key-123')
		expect(resolveFeedbackProviderConfig('unknown-app')).toEqual({
			kind: 'web3forms',
			accessKey: 'key-123'
		})
	})

	it('auto-detects web3forms from app config when env is empty', () => {
		clearFeedbackEnv()
		expect(resolveFeedbackProviderConfig('rawclinic')).toEqual({
			kind: 'web3forms',
			accessKey: 'app-raw-key'
		})
	})

	it('auto-detects supabase when url and anon key are set and app has no web3 key', () => {
		clearFeedbackEnv()
		vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://abc.supabase.co')
		vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'anon-key')
		expect(resolveFeedbackProviderConfig('unknown-app')).toEqual({
			kind: 'supabase',
			url: 'https://abc.supabase.co',
			anonKey: 'anon-key',
			table: 'feedback'
		})
	})

	it('prefers explicit provider over auto-detect', () => {
		clearFeedbackEnv()
		vi.stubEnv('NEXT_PUBLIC_FEEDBACK_PROVIDER', 'formspree')
		vi.stubEnv('NEXT_PUBLIC_FORMSPREE_FORM_ID', 'abc123')
		vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://abc.supabase.co')
		vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'anon-key')
		expect(resolveFeedbackProviderConfig('rawclinic')).toEqual({
			kind: 'formspree',
			formId: 'abc123'
		})
	})

	it('returns unconfigured when explicit provider lacks credentials', () => {
		clearFeedbackEnv()
		vi.stubEnv('NEXT_PUBLIC_FEEDBACK_PROVIDER', 'web3forms')
		const config = resolveFeedbackProviderConfig('unknown-app')
		expect(config.kind).toBe('unconfigured')
		if (config.kind === 'unconfigured') {
			expect(config.reason).toContain('web3forms')
		}
	})
})
