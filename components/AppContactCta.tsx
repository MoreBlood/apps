import NextLink from 'next/link'
import clsx from 'clsx'
import { ChatBubbleIcon, EnvelopeClosedIcon } from '@radix-ui/react-icons'
import { Heading, Text } from '@radix-ui/themes'

type Props = {
	appSlug: string
	contactEmail: string
	title?: string
	lead?: string
	/** When false, only the email action is shown (e.g. on the feedback page). */
	showFeedback?: boolean
	className?: string
}

export default function AppContactCta({
	appSlug,
	contactEmail,
	title = 'Still have questions?',
	lead = 'We are happy to help. Email us directly or send feedback through the form.',
	showFeedback = true,
	className
}: Props) {
	const titleId = `${appSlug}-contact-cta-title`

	return (
		<aside className={clsx('contact-cta', 'contact-cta--section', className)} aria-labelledby={titleId}>
			<div className="contact-cta__card">
				<Heading size="5" mb="2" as="h2" id={titleId} className="contact-cta__title">
					{title}
				</Heading>
				<Text as="p" size="3" color="gray" className="contact-cta__lead">
					{lead}
				</Text>
				<div
					className={clsx('contact-cta__actions', !showFeedback && 'contact-cta__actions--single')}
				>
					<a className="contact-cta__action" href={`mailto:${contactEmail}`}>
						<span className="contact-cta__action-icon contact-cta__action-icon--email" aria-hidden>
							<EnvelopeClosedIcon />
						</span>
						<span className="contact-cta__action-body">
							<span className="contact-cta__action-label">Email</span>
							<span className="contact-cta__action-value">{contactEmail}</span>
						</span>
					</a>
					{showFeedback && (
						<NextLink className="contact-cta__action" href={`/${appSlug}/feedback/`}>
							<span className="contact-cta__action-icon contact-cta__action-icon--feedback" aria-hidden>
								<ChatBubbleIcon />
							</span>
							<span className="contact-cta__action-body">
								<span className="contact-cta__action-label">Feedback</span>
								<span className="contact-cta__action-value">Open feedback form</span>
							</span>
						</NextLink>
					)}
				</div>
			</div>
		</aside>
	)
}
