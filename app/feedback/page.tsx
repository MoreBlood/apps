import { redirect } from 'next/navigation'

const defaultAppSlug = 'rawclinic'

export default function FeedbackRedirect() {
	redirect(`/${defaultAppSlug}/feedback`)
}
