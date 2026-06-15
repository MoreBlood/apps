import { getAppBySlug } from '@/config'

export const FEEDBACK_PROVIDER_IDS = [
	'console',
	'web3forms',
	'formspree',
	'supabase',
	'http',
	'api',
	'unconfigured'
] as const

export type FeedbackProviderId = (typeof FEEDBACK_PROVIDER_IDS)[number]

export type FeedbackProviderConfig =
	| { kind: 'console' }
	| { kind: 'web3forms'; accessKey: string }
	| { kind: 'formspree'; formId: string }
	| { kind: 'supabase'; url: string; anonKey: string; table: string }
	| { kind: 'http'; endpoint: string }
	| { kind: 'api'; path: string }
	| { kind: 'unconfigured'; reason?: string }

function trimEnv(name: string): string | undefined {
	const value = process.env[name]?.trim()
	return value || undefined
}

export function isFeedbackProviderId(value: string): value is FeedbackProviderId {
	return (FEEDBACK_PROVIDER_IDS as readonly string[]).includes(value)
}

function web3formsAccessKeyForApp(appSlug: string): string | undefined {
	const fromApp = getAppBySlug(appSlug)?.web3formsAccessKey?.trim()
	return fromApp || trimEnv('NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY')
}

function detectProviderKind(appSlug: string): FeedbackProviderId | null {
	if (web3formsAccessKeyForApp(appSlug)) {
		return 'web3forms'
	}
	if (trimEnv('NEXT_PUBLIC_SUPABASE_URL') && trimEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')) {
		return 'supabase'
	}
	if (trimEnv('NEXT_PUBLIC_FORMSPREE_FORM_ID')) {
		return 'formspree'
	}
	if (trimEnv('NEXT_PUBLIC_FEEDBACK_ENDPOINT')) {
		return 'http'
	}
	return null
}

function configForKind(kind: FeedbackProviderId, appSlug: string): FeedbackProviderConfig | null {
	switch (kind) {
		case 'console':
			return { kind: 'console' }
		case 'web3forms': {
			const accessKey = web3formsAccessKeyForApp(appSlug)
			return accessKey ? { kind: 'web3forms', accessKey } : null
		}
		case 'formspree': {
			const formId = trimEnv('NEXT_PUBLIC_FORMSPREE_FORM_ID')
			return formId ? { kind: 'formspree', formId } : null
		}
		case 'supabase': {
			const url = trimEnv('NEXT_PUBLIC_SUPABASE_URL')
			const anonKey = trimEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
			if (!url || !anonKey) return null
			return {
				kind: 'supabase',
				url,
				anonKey,
				table: trimEnv('NEXT_PUBLIC_SUPABASE_FEEDBACK_TABLE') ?? 'feedback'
			}
		}
		case 'http': {
			const endpoint = trimEnv('NEXT_PUBLIC_FEEDBACK_ENDPOINT')
			return endpoint ? { kind: 'http', endpoint } : null
		}
		case 'api': {
			const path = trimEnv('NEXT_PUBLIC_FEEDBACK_API_PATH')
			return path ? { kind: 'api', path } : null
		}
		case 'unconfigured':
			return { kind: 'unconfigured' }
		default:
			return null
	}
}

/** Resolves which feedback provider to use (per-app config + env). */
export function resolveFeedbackProviderConfig(appSlug: string): FeedbackProviderConfig {
	const apiPath = trimEnv('NEXT_PUBLIC_FEEDBACK_API_PATH')
	if (apiPath) {
		return { kind: 'api', path: apiPath }
	}

	const explicit = trimEnv('NEXT_PUBLIC_FEEDBACK_PROVIDER')?.toLowerCase()

	if (explicit) {
		if (!isFeedbackProviderId(explicit)) {
			return {
				kind: 'unconfigured',
				reason: `Unknown NEXT_PUBLIC_FEEDBACK_PROVIDER: "${explicit}". Use one of: ${FEEDBACK_PROVIDER_IDS.join(', ')}.`
			}
		}

		const config = configForKind(explicit, appSlug)
		if (config) return config

		return {
			kind: 'unconfigured',
			reason: `NEXT_PUBLIC_FEEDBACK_PROVIDER is "${explicit}" but required credentials are missing for "${appSlug}".`
		}
	}

	const detected = detectProviderKind(appSlug)
	if (detected) {
		const config = configForKind(detected, appSlug)
		if (config) return config
	}

	if (process.env.NODE_ENV === 'development') {
		return { kind: 'console' }
	}

	return { kind: 'unconfigured' }
}
