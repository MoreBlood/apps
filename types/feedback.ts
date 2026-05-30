export const FEEDBACK_CATEGORIES = ['bug', 'feature', 'question', 'other'] as const

export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number]

export type FeedbackPayload = {
	appSlug: string
	appName: string
	category: FeedbackCategory
	email?: string
	message: string
	submittedAt: string
	pageUrl?: string
}

export type FeedbackSubmitResult = { ok: true } | { ok: false; error: string }

export interface FeedbackProvider {
	readonly id: string
	submit(payload: FeedbackPayload): Promise<FeedbackSubmitResult>
}
