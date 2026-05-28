import { FEEDBACK_SUBMIT_ERROR } from '@/lib/feedback/errors'
import { formatFeedbackMessage } from '@/lib/feedback/format-message'
import { FEEDBACK_CATEGORY_LABELS } from '@/lib/feedback/schema'
import type { FeedbackPayload, FeedbackProvider, FeedbackSubmitResult } from '@/types/feedback'

const WEB3FORMS_URL = 'https://api.web3forms.com/submit'

export function createWeb3FormsFeedbackProvider(accessKey: string): FeedbackProvider {
	return {
		id: 'web3forms',
		async submit(payload: FeedbackPayload): Promise<FeedbackSubmitResult> {
			const categoryLabel = FEEDBACK_CATEGORY_LABELS[payload.category].label

			try {
				const response = await fetch(WEB3FORMS_URL, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json'
					},
					body: JSON.stringify({
						access_key: accessKey,
						subject: `[${payload.appName}] ${categoryLabel}`,
						from_name: payload.email ?? 'Anonymous',
						email: payload.email ?? 'noreply@feedback.local',
						message: formatFeedbackMessage(payload),
						app_slug: payload.appSlug,
						category: payload.category
					})
				})

				const data = (await response.json()) as { success?: boolean }
				if (!response.ok || !data.success) {
					return { ok: false, error: FEEDBACK_SUBMIT_ERROR }
				}

				return { ok: true }
			} catch {
				return { ok: false, error: FEEDBACK_SUBMIT_ERROR }
			}
		}
	}
}
