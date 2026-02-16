import type { DescriptionContentProps } from '@/config'

export default function RawClinicDescriptionContent({ app }: DescriptionContentProps) {
	return (
		<>
			<p>
				{app.appName} is a powerful mobile application for editing <b>RAW</b> photo files directly on your iOS device.
				All processing happens locally on your device, ensuring your photos remain private and secure.
			</p>
			<ul>
				<li>Edit RAW photos with professional tools</li>
				<li>
					<b>100% local processing</b> — no data collection
				</li>
				<li>Support for various RAW formats</li>
				<li>Save edited photos to your library</li>
			</ul>
		</>
	)
}
