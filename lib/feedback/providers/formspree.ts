import { FEEDBACK_SUBMIT_ERROR } from '@/lib/feedback/errors'
import { formatFeedbackMessage } from '@/lib/feedback/format-message'
import { FEEDBACK_CATEGORY_LABELS } from '@/lib/feedback/schema'
import type { FeedbackPayload, FeedbackProvider, FeedbackSubmitResult } from '@/types/feedback'

function formspreeEndpoint(formId: string): string {
	const id = formId.replace(/^https:\/\/formspree\.io\/f\//, '').replace(/\/$/, '')
	return `https://formspree.io/f/${id}`
}

export function createFormspreeFeedbackProvider(formId: string): FeedbackProvider {
	return {
		id: 'formspree',
		async submit(payload: FeedbackPayload): Promise<FeedbackSubmitResult> {
			const categoryLabel = FEEDBACK_CATEGORY_LABELS[payload.category].label

			try {
				const response = await fetch(formspreeEndpoint(formId), {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json'
					},
					body: JSON.stringify({
						_subject: `[${payload.appName}] ${categoryLabel}`,
						email: payload.email,
						message: formatFeedbackMessage(payload),
						app_slug: payload.appSlug,
						app_name: payload.appName,
						category: payload.category,
						page_url: payload.pageUrl,
						submitted_at: payload.submittedAt
					})
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
