import type { FeedbackPayload, FeedbackProvider, FeedbackSubmitResult } from '@/types/feedback'

export function createUnconfiguredFeedbackProvider(
	contactEmail: string,
	reason?: string
): FeedbackProvider {
	return {
		id: 'unconfigured',
		async submit(_payload: FeedbackPayload): Promise<FeedbackSubmitResult> {
			const detail = reason ? ` ${reason}` : ''
			return {
				ok: false,
				error: `Feedback delivery is not configured yet.${detail} Please email ${contactEmail} instead.`
			}
		}
	}
}
