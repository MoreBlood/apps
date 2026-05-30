import { FEEDBACK_SUBMIT_ERROR } from '@/lib/feedback/errors'
import type { FeedbackPayload, FeedbackProvider, FeedbackSubmitResult } from '@/types/feedback'

export function createDebugFailFeedbackProvider(): FeedbackProvider {
	return {
		id: 'debug-fail',
		async submit(_payload: FeedbackPayload): Promise<FeedbackSubmitResult> {
			await new Promise((resolve) => setTimeout(resolve, 500))
			return { ok: false, error: FEEDBACK_SUBMIT_ERROR }
		}
	}
}
