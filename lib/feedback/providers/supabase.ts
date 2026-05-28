import { FEEDBACK_SUBMIT_ERROR } from '@/lib/feedback/errors'
import type { FeedbackPayload, FeedbackProvider, FeedbackSubmitResult } from '@/types/feedback'

type SupabaseRow = {
	app_slug: string
	app_name: string
	category: string
	email: string | null
	message: string
	submitted_at: string
	page_url: string | null
}

function restUrl(supabaseUrl: string, table: string): string {
	const base = supabaseUrl.replace(/\/$/, '')
	return `${base}/rest/v1/${encodeURIComponent(table)}`
}

export function createSupabaseFeedbackProvider(
	supabaseUrl: string,
	anonKey: string,
	table: string
): FeedbackProvider {
	return {
		id: 'supabase',
		async submit(payload: FeedbackPayload): Promise<FeedbackSubmitResult> {
			const row: SupabaseRow = {
				app_slug: payload.appSlug,
				app_name: payload.appName,
				category: payload.category,
				email: payload.email ?? null,
				message: payload.message,
				submitted_at: payload.submittedAt,
				page_url: payload.pageUrl ?? null
			}

			try {
				const response = await fetch(restUrl(supabaseUrl, table), {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						apikey: anonKey,
						Authorization: `Bearer ${anonKey}`,
						Prefer: 'return=minimal'
					},
					body: JSON.stringify(row)
				})

				if (!response.ok) {
					return { ok: false, error: FEEDBACK_SUBMIT_ERROR }
				}

				return { ok: true }
			} catch {
				return { ok: false, error: FEEDBACK_SUBMIT_ERROR }
			}
		}
	}
}
