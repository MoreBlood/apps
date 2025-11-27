import Contact from '@/components/Contact'
import Container from '@/components/Container'
import Content from '@/components/Content'
import Subtitle from '@/components/Subtitle'
import { config } from '@/config'

export default function Home() {
	return (
		<Container>
			<h1>{config.appName}</h1>
			<Subtitle>Professional RAW photo editing for iOS</Subtitle>

			<Content>
				<h2>About</h2>
				<p>
					{config.appName} is a powerful mobile application for editing RAW photo files directly on your iOS device. All
					processing happens locally on your device, ensuring your photos remain private and secure.
				</p>

				<h2>Features</h2>
				<ul>
					<li>Edit RAW photos with professional tools</li>
					<li>100% local processing - no data collection</li>
					<li>Support for various RAW formats</li>
					<li>Save edited photos to your library</li>
				</ul>

				<Contact>
					<h2>Contact Us</h2>
					<p>If you have any questions, please contact us at:</p>
					<p>
						<strong>Email: </strong>
						<a href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a>
					</p>
				</Contact>
			</Content>
		</Container>
	)
}
