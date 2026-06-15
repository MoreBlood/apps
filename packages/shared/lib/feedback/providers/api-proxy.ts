import { FEEDBACK_SUBMIT_ERROR } from '@/lib/feedback/errors'
import type { FeedbackPayload, FeedbackProvider, FeedbackSubmitResult } from '@/types/feedback'

export function createApiFeedbackProvider(apiPath: string): FeedbackProvider {
	return {
		id: 'api',
		async submit(payload: FeedbackPayload): Promise<FeedbackSubmitResult> {
			try {
				const response = await fetch(apiPath, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
					body: JSON.stringify(payload)
				})

				const data = (await response.json()) as { ok?: boolean; error?: string }
				if (!response.ok || !data.ok) {
					return { ok: false, error: data.error ?? FEEDBACK_SUBMIT_ERROR }
				}

				return { ok: true }
			} catch {
				return { ok: false, error: FEEDBACK_SUBMIT_ERROR }
			}
		}
	}
}
