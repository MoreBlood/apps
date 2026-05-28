import { redirect } from 'next/navigation'

const defaultAppSlug = 'rawclinic'

export default function RoadmapRedirect() {
	redirect(`/${defaultAppSlug}/roadmap`)
}
