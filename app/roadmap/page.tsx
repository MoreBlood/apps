import { defaultAppParams } from '@/lib/default-app-slug'
import Page, { generateMetadata as generateAppRoadmapMetadata } from '../[appSlug]/roadmap/page'

export async function generateMetadata() {
	return generateAppRoadmapMetadata({ params: defaultAppParams() })
}

export default function RoadmapPage() {
	return <Page params={defaultAppParams()} />
}
