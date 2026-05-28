import type { FeedbackPayload, FeedbackProvider, FeedbackSubmitResult } from '@/types/feedback'

export function createConsoleFeedbackProvider(): FeedbackProvider {
	return {
		id: 'console',
		async submit(payload: FeedbackPayload): Promise<FeedbackSubmitResult> {
			// biome-ignore lint/suspicious/noConsole: dev/default sink until a real provider is wired
			console.info('[feedback]', payload)
			await new Promise((resolve) => setTimeout(resolve, 400))
			return { ok: true }
		}
	}
}
