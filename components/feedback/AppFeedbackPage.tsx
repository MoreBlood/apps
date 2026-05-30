import { Box, Container } from '@radix-ui/themes'
import AppContactCta from '@/components/AppContactCta'
import FeedbackForm from '@/components/feedback/FeedbackForm'
import SitePageHero from '@/components/shared/SitePageHero'
import type { AppConfig } from '@/config'

type Props = {
	app: AppConfig
	appSlug: string
}

export default function AppFeedbackPage({ app, appSlug }: Props) {
	return (
		<Container size="2" className="feedback-page">
			<SitePageHero
				className="site-page-hero--section"
				eyebrow={app.appName}
				title="Feedback"
				lead={`Share a bug, idea, or question. Your message helps us improve ${app.appName}.`}
			/>

			<Box className="feedback-page__panel">
				<FeedbackForm appSlug={appSlug} appName={app.appName} contactEmail={app.contactEmail} />
			</Box>

			<AppContactCta
				appSlug={appSlug}
				contactEmail={app.contactEmail}
				title="Prefer email?"
				lead="You can also reach us directly at the address below."
				showFeedback={false}
			/>
		</Container>
	)
}
