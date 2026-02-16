import { notFound } from 'next/navigation'
import AppStoreBadge from '@/components/AppStoreBadge'
import Contact from '@/components/Contact'
import Container from '@/components/Container'
import Content from '@/components/Content'
import DescriptionText from '@/components/DescriptionText'
import Subtitle from '@/components/Subtitle'
import { getAppBySlug } from '@/config'

export default async function AppLanding({ params }: { params: Promise<{ appSlug: string }> }) {
	const { appSlug } = await params
	const app = getAppBySlug(appSlug)
	if (!app) notFound()

	return (
		<Container>
			<h1>{app.appName}</h1>
			<Subtitle>{app.tagline}</Subtitle>
			{app.storeLink && (
				<p style={{ marginTop: 'var(--spacing-xl)', marginBottom: 0 }}>
					<AppStoreBadge storeLink={app.storeLink} />
				</p>
			)}

			<Content>
				<h2>About</h2>
				{app.DescriptionContent ? <app.DescriptionContent app={app} /> : <DescriptionText text={app.description} />}

				<Contact>
					<h2>Contact Us</h2>
					<p>If you have any questions, please contact us at:</p>
					<p>
						<strong>Email: </strong>
						<a href={`mailto:${app.contactEmail}`}>{app.contactEmail}</a>
					</p>
				</Contact>
			</Content>
		</Container>
	)
}
