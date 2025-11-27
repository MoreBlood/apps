const GOOGLE_FORMS_URL =
	'https://docs.google.com/forms/d/e/1FAIpQLSfddrmPd8al4Gnbs8gezfCQ-zna6U1ZIE2tpBH1WWLHwxoxqg/viewform?embedded=true'

export default function Feedback() {
	return (
		<iframe
			src={GOOGLE_FORMS_URL}
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
