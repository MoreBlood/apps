import { formatFeedbackMessage } from '@/lib/feedback/format-message'
import { FEEDBACK_CATEGORY_LABELS } from '@/lib/feedback/schema'
import { feedbackScreenshotsToBlobs } from '@/lib/feedback/screenshots'
import type { FeedbackPayload } from '@/types/feedback'

export function buildFeedbackJsonBody(payload: FeedbackPayload): Record<string, unknown> {
	return {
		app_slug: payload.appSlug,
		app_name: payload.appName,
		category: payload.category,
		email: payload.email,
		message: formatFeedbackMessage(payload),
		page_url: payload.pageUrl,
		submitted_at: payload.submittedAt,
		screenshots: payload.screenshots
	}
}

export function buildFeedbackFormData(payload: FeedbackPayload, extra?: Record<string, string>): FormData {
	const categoryLabel = FEEDBACK_CATEGORY_LABELS[payload.category].label
	const formData = new FormData()

	for (const [key, value] of Object.entries(extra ?? {})) {
		formData.append(key, value)
	}

	formData.append('_subject', `[${payload.appName}] ${categoryLabel}`)
	formData.append('message', formatFeedbackMessage(payload))
	formData.append('app_slug', payload.appSlug)
	formData.append('app_name', payload.appName)
	formData.append('category', payload.category)
	formData.append('submitted_at', payload.submittedAt)

	if (payload.email) {
		formData.append('email', payload.email)
	}
	if (payload.pageUrl) {
		formData.append('page_url', payload.pageUrl)
	}

	const blobs = feedbackScreenshotsToBlobs(payload.screenshots ?? [])
	blobs.forEach((blob, index) => {
		const meta = payload.screenshots?.[index]
		formData.append('attachment', blob, meta?.name ?? `screenshot-${index + 1}.jpg`)
	})

	return formData
}
