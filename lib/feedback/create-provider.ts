import type { FeedbackProviderConfig } from '@/lib/feedback/config'
import { createConsoleFeedbackProvider } from '@/lib/feedback/providers/console'
import { createFormspreeFeedbackProvider } from '@/lib/feedback/providers/formspree'
import { createHttpFeedbackProvider } from '@/lib/feedback/providers/http'
import { createSupabaseFeedbackProvider } from '@/lib/feedback/providers/supabase'
import { createUnconfiguredFeedbackProvider } from '@/lib/feedback/providers/unconfigured'
import { createWeb3FormsFeedbackProvider } from '@/lib/feedback/providers/web3forms'
import type { FeedbackProvider } from '@/types/feedback'

export function createFeedbackProviderFromConfig(
	config: FeedbackProviderConfig,
	contactEmail: string
): FeedbackProvider {
	switch (config.kind) {
		case 'console':
			return createConsoleFeedbackProvider()
		case 'web3forms':
			return createWeb3FormsFeedbackProvider(config.accessKey)
		case 'formspree':
			return createFormspreeFeedbackProvider(config.formId)
		case 'supabase':
			return createSupabaseFeedbackProvider(config.url, config.anonKey, config.table)
		case 'http':
			return createHttpFeedbackProvider(config.endpoint)
		case 'unconfigured':
			return createUnconfiguredFeedbackProvider(contactEmail, config.reason)
	}
}
