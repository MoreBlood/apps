import { defaultAppParams } from '@/lib/default-app-slug'
import Page, { generateMetadata as generateAppPrivacyMetadata } from '../[appSlug]/privacy/page'

export async function generateMetadata() {
	return generateAppPrivacyMetadata({ params: defaultAppParams() })
}

export default function PrivacyPage() {
	return <Page params={defaultAppParams()} />
}
