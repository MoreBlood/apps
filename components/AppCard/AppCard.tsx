import Link from 'next/link'
import DescriptionText from '@/components/DescriptionText'
import type { AppConfig } from '@/config'
import styles from './AppCard.module.scss'

interface AppCardProps {
	app: AppConfig
}

export default function AppCard({ app }: AppCardProps) {
	return (
		<Link href={`/${app.slug}`} className={styles.card}>
			<h2 className={styles.title}>{app.appName}</h2>
			<p className={styles.tagline}>{app.tagline}</p>
			<div className={styles.description}>
				<DescriptionText text={app.description} as="p" className={styles.descriptionParagraph} />
			</div>
		</Link>
	)
}
