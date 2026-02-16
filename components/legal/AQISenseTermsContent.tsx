import Link from 'next/link'
import AppName from '@/components/AppName'
import Contact from '@/components/Contact'
import Container from '@/components/Container'
import Important from '@/components/Important'
import LastUpdated from '@/components/LastUpdated'
import type { TermsContentProps } from '@/config'

export default function AQISenseTermsContent({ app, appSlug }: TermsContentProps) {
	return (
		<Container>
			<h1>Terms of Service</h1>
			<AppName>{app.appName}</AppName>
			<LastUpdated>Last updated: {app.lastUpdated}</LastUpdated>

			<h2>1. Acceptance of Terms</h2>
			<p>
				By downloading, installing, or using {app.appName} ("the App"), you agree to be bound by these Terms of Service.
				If you do not agree to these terms, please do not use the App.
			</p>

			<h2>2. License</h2>
			<p>
				We grant you a limited, non-exclusive, non-transferable, revocable license to use {app.appName} for personal,
				non-commercial purposes in accordance with these Terms of Service and applicable laws.
			</p>

			<h2>3. User Responsibilities</h2>
			<p>You are responsible for:</p>
			<ul>
				<li>Maintaining the security of your device and the App</li>
				<li>Using the App and any air quality information for personal reference only</li>
				<li>Complying with all applicable laws when using the App</li>
			</ul>

			<h2>4. Intellectual Property</h2>
			<p>
				<strong>Our Content:</strong> The App, including its code, design, and documentation, is protected by copyright
				and other intellectual property laws. You may not copy, modify, distribute, or reverse-engineer the App.
			</p>
			<p>
				Air quality data displayed in the App is provided by third-party sources (e.g. WAQI, Sensor.Community,
				OpenSenseMap). Their data remains subject to their respective terms and licenses.
			</p>

			<h2>5. Limitations of Liability</h2>
			<Important>
				<strong>Important:</strong> {app.appName} is provided "as is" without warranties of any kind.
			</Important>
			<p>We are not liable for:</p>
			<ul>
				<li>Accuracy, completeness, or timeliness of air quality data (which comes from third parties)</li>
				<li>Decisions you make based on AQI or pollutant readings</li>
				<li>Any damages arising from use or inability to use the App</li>
				<li>Unavailability of third-party data sources</li>
			</ul>
			<p>
				Air quality data is for informational purposes only. Do not rely on it as the sole basis for health or safety
				decisions.
			</p>

			<h2>6. Third-Party Data</h2>
			<p>
				The App shows data from WAQI, Sensor.Community, and OpenSenseMap. We do not guarantee availability or accuracy
				of that data. Your use of the App may involve requests to these providers; their terms apply to that use.
			</p>

			<h2>7. Privacy</h2>
			<p>
				Your use of the App is also governed by our
				<Link href={`/${appSlug}/privacy`}> Privacy Policy</Link>, which explains how we handle your information.
			</p>

			<h2>8. Updates and Changes</h2>
			<p>
				We may update the App and these Terms of Service from time to time. Continued use after updates constitutes
				acceptance of the changes.
			</p>

			<h2>9. Termination</h2>
			<p>
				You may stop using the App at any time by deleting it from your device. We reserve the right to terminate or
				restrict access for any reason, including violation of these terms.
			</p>

			<h2>10. Apple App Store</h2>
			<p>
				Your use of the App is also subject to Apple's App Store Terms of Service. In case of conflict, Apple's terms
				take precedence.
			</p>

			<h2>11. Governing Law</h2>
			<p>
				These Terms of Service are governed by the laws of your jurisdiction. Any disputes shall be resolved in
				accordance with applicable local laws.
			</p>

			<h2>12. Severability</h2>
			<p>
				If any provision of these terms is found to be unenforceable, the remaining provisions will remain in full force
				and effect.
			</p>

			<h2>13. Entire Agreement</h2>
			<p>
				These Terms of Service, together with our Privacy Policy, constitute the entire agreement between you and us
				regarding use of the App.
			</p>

			<Contact>
				<h2>Contact Us</h2>
				<p>If you have any questions about these Terms of Service, please contact us at:</p>
				<p>
					<strong>Email: </strong>
					<a href={`mailto:${app.contactEmail}`}>{app.contactEmail}</a>
				</p>
			</Contact>
		</Container>
	)
}
