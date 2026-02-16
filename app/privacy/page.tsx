import { redirect } from 'next/navigation'

const defaultAppSlug = 'rawclinic'

export default function PrivacyRedirect() {
	redirect(`/${defaultAppSlug}/privacy`)
}
