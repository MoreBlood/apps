import { formatFeedbackMessage } from '@/lib/feedback/format-message'
import { FEEDBACK_CATEGORY_LABELS } from '@/lib/feedback/schema'
import type { FeedbackPayload } from '@/types/feedback'

export function buildFeedbackMailto(contactEmail: string, payload: FeedbackPayload): string {
	const categoryLabel = FEEDBACK_CATEGORY_LABELS[payload.category].label
	const subject = encodeURIComponent(`[${payload.appName}] ${categoryLabel}`)
	const body = encodeURIComponent(formatFeedbackMessage(payload))
	return `mailto:${contactEmail}?subject=${subject}&body=${body}`
}

export function getFeedbackDraftText(payload: FeedbackPayload): string {
	return formatFeedbackMessage(payload)
}
