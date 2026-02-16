import Link from 'next/link'
import AppName from '@/components/AppName'
import Contact from '@/components/Contact'
import Container from '@/components/Container'
import Important from '@/components/Important'
import LastUpdated from '@/components/LastUpdated'
import type { TermsContentProps } from '@/config'

export default function DefaultTermsContent({ app, appSlug }: TermsContentProps) {
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
				<li>All photos and content you process through the App</li>
				<li>Backing up your photos before editing</li>
				<li>Complying with all applicable laws when using the App</li>
			</ul>

			<h2>4. Intellectual Property</h2>
			<p>
				<strong>Your Content:</strong> You retain all rights to photos and content you create or edit using the App. We
				do not claim any ownership rights to your content.
			</p>
			<p>
				<strong>Our Content:</strong> The App itself, including its code, design, features, and documentation, is
				protected by copyright and other intellectual property laws. You may not copy, modify, distribute, or
				reverse-engineer the App.
			</p>

			<h2>5. Limitations of Liability</h2>
			<Important>
				<strong>Important:</strong> {app.appName} is provided "as is" without warranties of any kind.
			</Important>
			<p>We are not liable for:</p>
			<ul>
				<li>Loss or corruption of photos or data</li>
				<li>Device performance issues</li>
				<li>Any damages arising from use or inability to use the App</li>
				<li>Results of photo editing operations</li>
			</ul>
			<p>
				<strong>We strongly recommend backing up your photos before editing them.</strong>
			</p>

			<h2>6. Photo Editing</h2>
			<p>The App provides tools for editing RAW photos. The quality and results of edits depend on:</p>
			<ul>
				<li>The quality and format of the original photo</li>
				<li>Your device's capabilities</li>
				<li>The settings and adjustments you apply</li>
			</ul>
			<p>We do not guarantee any specific results from photo editing operations.</p>

			<h2>7. Privacy</h2>
			<p>
				Your use of the App is also governed by our
				<Link href={`/${appSlug}/privacy`}> Privacy Policy</Link>, which explains how we handle your information
				(spoiler: we don't collect any personal data).
			</p>

			<h2>8. Updates and Changes</h2>
			<p>
				We may update the App from time to time to add features, fix bugs, or improve performance. We may also modify
				these Terms of Service. Continued use of the App after updates constitutes acceptance of any changes.
			</p>

			<h2>9. Termination</h2>
			<p>
				You may stop using the App at any time by deleting it from your device. We reserve the right to terminate or
				restrict access to the App for any reason, including violation of these terms.
			</p>

			<h2>10. Third-Party Content</h2>
			<p>
				The App may allow you to import third-party content such as LUT files. You are responsible for ensuring you have
				the right to use any third-party content with the App.
			</p>

			<h2>11. Apple App Store</h2>
			<p>
				Your use of the App is also subject to Apple's App Store Terms of Service. In case of conflict between these
				terms and Apple's terms, Apple's terms take precedence.
			</p>

			<h2>12. Governing Law</h2>
			<p>
				These Terms of Service are governed by the laws of your jurisdiction. Any disputes shall be resolved in
				accordance with applicable local laws.
			</p>

			<h2>13. Severability</h2>
			<p>
				If any provision of these terms is found to be unenforceable, the remaining provisions will remain in full force
				and effect.
			</p>

			<h2>14. Entire Agreement</h2>
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
