import { notFound } from 'next/navigation'
import Container from '@/components/Container'
import styles from '@/components/Container/Container.module.scss'
import { getAppBySlug } from '@/config'

export default async function Feedback({ params }: { params: Promise<{ appSlug: string }> }) {
	const { appSlug } = await params
	const app = getAppBySlug(appSlug)
	if (!app) notFound()

	return (
		<Container className={styles.feedbackContainer}>
			<iframe
				src={app.feedbackFormUrl}
				width="100%"
				height="1480px"
				frameBorder="0"
				marginHeight={0}
				marginWidth={0}
				title={`${app.appName} Feedback Form`}
			>
				Loading…
			</iframe>
		</Container>
	)
}
