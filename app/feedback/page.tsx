import Container from '@/components/Container'
import { config } from '@/config'
import styles from '../../components/Container/Container.module.scss'

export default function Feedback() {
	return (
		<Container className={styles.feedbackContainer}>
			<iframe
				src={config.feedbackFormUrl}
				width="100%"
				height="1480px"
				frameBorder="0"
				marginHeight={0}
				marginWidth={0}
				title="Raw Clinic Feedback Form"
			>
				Loading…
			</iframe>
		</Container>
	)
}
