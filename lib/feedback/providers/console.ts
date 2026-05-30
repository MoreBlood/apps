import type { FeedbackPayload, FeedbackProvider, FeedbackSubmitResult } from '@/types/feedback'

export function createConsoleFeedbackProvider(): FeedbackProvider {
	return {
		id: 'console',
		async submit(payload: FeedbackPayload): Promise<FeedbackSubmitResult> {
			console.info('[feedback]', payload)
			await new Promise((resolve) => setTimeout(resolve, 400))
			return { ok: true }
		}
	}
}
