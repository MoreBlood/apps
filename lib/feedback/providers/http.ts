import { FEEDBACK_SUBMIT_ERROR } from '@/lib/feedback/errors'
import type { FeedbackPayload, FeedbackProvider, FeedbackSubmitResult } from '@/types/feedback'

export function createHttpFeedbackProvider(endpoint: string): FeedbackProvider {
	return {
		id: 'http',
		async submit(payload: FeedbackPayload): Promise<FeedbackSubmitResult> {
			try {
				const response = await fetch(endpoint, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json'
					},
					body: JSON.stringify(payload)
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
