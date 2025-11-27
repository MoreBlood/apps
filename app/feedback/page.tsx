import { config } from '@/config'

export default function Feedback() {
	return (
		<iframe
			src={config.feedbackFormUrl}
			width="100%"
			height="1600px"
			frameBorder="0"
			marginHeight={0}
			marginWidth={0}
			title="Raw Clinic Feedback Form"
		>
			Loading…
		</iframe>
	)
}
