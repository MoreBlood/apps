import { defaultAppParams } from '@/lib/default-app-slug'
import Page, { generateMetadata as generateAppTermsMetadata } from '../[appSlug]/terms/page'

export async function generateMetadata() {
	return generateAppTermsMetadata({ params: defaultAppParams() })
}

export default function TermsPage() {
	return <Page params={defaultAppParams()} />
}
