import { defaultAppParams } from '@/lib/default-app-slug'
import Page, { generateMetadata as generateAppFeedbackMetadata } from '../[appSlug]/feedback/page'

export async function generateMetadata() {
	return generateAppFeedbackMetadata({ params: defaultAppParams() })
}

export default function FeedbackPage() {
	return <Page params={defaultAppParams()} />
}
