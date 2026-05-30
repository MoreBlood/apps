import { defaultAppParams } from '@/lib/default-app-slug'
import Page, { generateMetadata as generateAppFaqMetadata } from '../[appSlug]/faq/page'

export async function generateMetadata() {
	return generateAppFaqMetadata({ params: defaultAppParams() })
}

export default function FaqPage() {
	return <Page params={defaultAppParams()} />
}
