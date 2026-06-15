import { FEEDBACK_CATEGORY_LABELS } from '@/lib/feedback/schema'
import type { FeedbackPayload } from '@/types/feedback'

export function formatFeedbackMessage(payload: FeedbackPayload): string {
	const categoryLabel = FEEDBACK_CATEGORY_LABELS[payload.category].label
	const screenshotNote =
		payload.screenshots && payload.screenshots.length > 0 ? `Screenshots: ${payload.screenshots.length} attached` : null

	const lines = [
		`App: ${payload.appName} (${payload.appSlug})`,
		`Category: ${categoryLabel}`,
		payload.email ? `Email: ${payload.email}` : 'Email: (not provided)',
		`Submitted: ${payload.submittedAt}`,
		payload.pageUrl ? `Page: ${payload.pageUrl}` : null,
		screenshotNote,
		'',
		payload.message
	]

	return lines.filter((line) => line !== null).join('\n')
}

/** Short preview for the finish screen (mailto/copy still use full format). */
export function formatFeedbackDraftPreview(payload: FeedbackPayload): string {
	const categoryLabel = FEEDBACK_CATEGORY_LABELS[payload.category].label
	const parts = [categoryLabel]

	if (payload.email) {
		parts.push(`Your email: ${payload.email}`)
	}

	parts.push('', payload.message)

	return parts.join('\n')
}
