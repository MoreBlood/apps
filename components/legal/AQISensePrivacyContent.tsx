import AppName from '@/components/AppName'
import Contact from '@/components/Contact'
import Container from '@/components/Container'
import LastUpdated from '@/components/LastUpdated'
import type { PrivacyContentProps } from '@/config'

export default function AQISensePrivacyContent({ app }: PrivacyContentProps) {
	return (
		<Container>
			<h1>Privacy Policy</h1>
			<AppName>{app.appName}</AppName>
			<LastUpdated>Last updated: {app.lastUpdated}</LastUpdated>

			<h2>Introduction</h2>
			<p>
				Welcome to {app.appName}. We respect your privacy and are committed to protecting your personal data. This
				privacy policy explains how we handle your information when you use our mobile application.
			</p>

			<h2>Data Collection</h2>
			<p>
				<strong>{app.appName} does not collect, store, or transmit any personal data to our servers.</strong>
				The app fetches air quality data from third-party providers (WAQI, Sensor.Community, OpenSenseMap) to display
				readings to you. Your use of those services may be subject to their respective privacy policies.
			</p>

			<h2>Location</h2>
			<p>
				{app.appName} may use your device location to show air quality stations near you and to sort the feed by
				proximity. Location is used only on your device or sent to the data providers you choose (e.g. to request nearby
				stations). We do not collect or store your location on our own servers.
			</p>

			<h2>Data Storage</h2>
			<p>The app may store locally on your device:</p>
			<ul>
				<li>Your saved and favorite stations</li>
				<li>Settings (data provider, AQI scale, preferences)</li>
			</ul>
			<p>This data stays on your device and is not transmitted to us.</p>

			<h2>Third-Party Data Sources</h2>
			<p>
				Air quality data is provided by WAQI, Sensor.Community, and OpenSenseMap. When the app requests data from these
				providers, their terms and privacy policies apply to that data flow. We do not control and are not responsible
				for their practices.
			</p>

			<h2>Analytics and Tracking</h2>
			<p>
				{app.appName} does not integrate with third-party analytics, advertising, or tracking services. We do not share
				your data with any third parties for marketing purposes.
			</p>

			<h2>Children's Privacy</h2>
			<p>{app.appName} is suitable for all ages. We do not knowingly collect personal information from children.</p>

			<h2>Changes to This Policy</h2>
			<p>
				We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy
				in the app and updating the "Last updated" date.
			</p>

			<h2>Your Rights</h2>
			<p>
				Since we do not collect personal data on our servers, there is no data held by us for you to access, modify, or
				delete. You can manage location access and delete the app and its local data at any time via iOS settings.
			</p>

			<Contact>
				<h2>Contact Us</h2>
				<p>If you have any questions about this privacy policy, please contact us at:</p>
				<p>
					<strong>Email: </strong>
					<a href={`mailto:${app.contactEmail}`}>{app.contactEmail}</a>
				</p>
			</Contact>
		</Container>
	)
}
