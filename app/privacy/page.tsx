import { config } from '@/config'

export default function Privacy() {
	return (
		<div className="container">
			<h1>Privacy Policy</h1>
			<div className="app-name">{config.appName}</div>
			<div className="last-updated">Last updated: {config.lastUpdated}</div>

			<h2>Introduction</h2>
			<p>
				Welcome to {config.appName}. We respect your privacy and are committed to protecting your personal data. This
				privacy policy explains how we handle your information when you use our mobile application.
			</p>

			<h2>Data Collection</h2>
			<p>
				<strong>{config.appName} does not collect, store, or transmit any personal data.</strong>
				The app operates entirely on your device and does not communicate with external servers.
			</p>

			<h2>Photo Access</h2>
			<p>{config.appName} requires access to your photo library to:</p>
			<ul>
				<li>Load RAW photo files for editing</li>
				<li>Save edited photos back to your library</li>
			</ul>
			<p>
				All photo processing happens locally on your device. Your photos are never uploaded to any server or shared with
				third parties.
			</p>

			<h2>Data Storage</h2>
			<p>The app may store:</p>
			<ul>
				<li>User preferences (such as language selection)</li>
				<li>Temporary editing data while you work on a photo</li>
			</ul>
			<p>All data is stored locally on your device and is never transmitted externally.</p>

			<h2>Third-Party Services</h2>
			<p>
				{config.appName} does not integrate with any third-party analytics, advertising, or tracking services. We do not
				share your data with any third parties because we do not collect it in the first place.
			</p>

			<h2>iCloud</h2>
			<p>
				If you use iCloud Photos, the app may access photos stored in iCloud through Apple's standard PhotoKit
				framework. This is handled entirely by Apple's systems, and we do not have access to your iCloud credentials or
				data.
			</p>

			<h2>Children's Privacy</h2>
			<p>
				{config.appName} is suitable for all ages. Since we do not collect any personal information, there are no
				additional considerations regarding children's use of the app.
			</p>

			<h2>Changes to This Policy</h2>
			<p>
				We may update this privacy policy from time to time. We will notify you of any changes by posting the new
				privacy policy in the app and updating the "Last updated" date.
			</p>

			<h2>Your Rights</h2>
			<p>
				Since we do not collect any personal data, there is no data for you to access, modify, or delete. You maintain
				complete control over your photos through iOS system settings.
			</p>

			<div className="contact">
				<h2>Contact Us</h2>
				<p>If you have any questions about this privacy policy, please contact us at:</p>
				<p>
					<strong>Email:</strong>
					<a href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a>
				</p>
			</div>
		</div>
	)
}

