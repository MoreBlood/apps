import { getAppBySlug } from '@/config'
import type { FeedbackProviderConfig } from '@/lib/feedback/config'
import { createFeedbackProviderFromConfig } from '@/lib/feedback/create-provider'
import type { FeedbackPayload, FeedbackSubmitResult } from '@/types/feedback'

function trimEnv(name: string): string | undefined {
	const value = process.env[name]?.trim()
	return value || undefined
}

function serverFeedbackConfig(appSlug: string): FeedbackProviderConfig {
	const app = getAppBySlug(appSlug)
	const accessKey = trimEnv('WEB3FORMS_ACCESS_KEY') ?? app?.web3formsAccessKey?.trim()
	if (accessKey) {
		return { kind: 'web3forms', accessKey }
	}

	const formId = trimEnv('FORMSPREE_FORM_ID')
	if (formId) {
		return { kind: 'formspree', formId }
	}

	const url = trimEnv('SUPABASE_URL')
	const anonKey = trimEnv('SUPABASE_ANON_KEY')
	if (url && anonKey) {
		return {
			kind: 'supabase',
			url,
			anonKey,
			table: trimEnv('SUPABASE_FEEDBACK_TABLE') ?? 'feedback'
		}
	}

	const endpoint = trimEnv('FEEDBACK_ENDPOINT')
	if (endpoint) {
		return { kind: 'http', endpoint }
	}

	if (process.env.NODE_ENV === 'development') {
		return { kind: 'console' }
	}

	return { kind: 'unconfigured', reason: 'Server feedback credentials are not configured.' }
}

export async function submitFeedbackOnServer(payload: FeedbackPayload): Promise<FeedbackSubmitResult> {
	const app = getAppBySlug(payload.appSlug)
	if (!app) {
		return { ok: false, error: 'Unknown app.' }
	}

	const config = serverFeedbackConfig(payload.appSlug)
	const provider = createFeedbackProviderFromConfig(config, app.contactEmail)
	return provider.submit(payload)
}
