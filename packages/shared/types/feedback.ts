export const FEEDBACK_CATEGORIES = ['bug', 'feature', 'question', 'other'] as const

export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number]

export type FeedbackScreenshot = {
	name: string
	type: string
	/** Base64 payload without data-URL prefix. */
	data: string
}

export type FeedbackPayload = {
	appSlug: string
	appName: string
	category: FeedbackCategory
	email?: string
	message: string
	screenshots?: FeedbackScreenshot[]
	submittedAt: string
	pageUrl?: string
}

export type FeedbackSubmitResult = { ok: true } | { ok: false; error: string }

export interface FeedbackProvider {
	readonly id: string
	submit(payload: FeedbackPayload): Promise<FeedbackSubmitResult>
}
