'use client'

type Props = {
	text: string
}

export default function LandingStageDebugPanel({ text }: Props) {
	const copy = async () => {
		try {
			await navigator.clipboard.writeText(text)
		} catch {
			// fallback: select textarea content
		}
	}

	return (
		<div className="landing-stage-debug" data-nosnippet>
			<div className="landing-stage-debug__bar">
				<span className="landing-stage-debug__title">Landing stage debug</span>
				<button type="button" className="landing-stage-debug__copy" onClick={copy}>
					Copy
				</button>
			</div>
			<textarea
				className="landing-stage-debug__text"
				readOnly
				value={text}
				aria-label="Landing stage scale debug report"
				onFocus={(e) => e.currentTarget.select()}
			/>
		</div>
	)
}
