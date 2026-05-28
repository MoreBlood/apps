import { createFeedbackProviderFromConfig } from '@/lib/feedback/create-provider'
import { resolveFeedbackProviderConfig } from '@/lib/feedback/config'
import { isFeedbackDebugFail } from '@/lib/feedback/debug'
import { createDebugFailFeedbackProvider } from '@/lib/feedback/providers/debug-fail'
import type { FeedbackProvider } from '@/types/feedback'

export function getFeedbackProvider(appSlug: string, contactEmail: string): FeedbackProvider {
	if (isFeedbackDebugFail()) {
		return createDebugFailFeedbackProvider()
	}

	const config = resolveFeedbackProviderConfig(appSlug)
	return createFeedbackProviderFromConfig(config, contactEmail)
}
