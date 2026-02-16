import { redirect } from 'next/navigation'

const defaultAppSlug = 'rawclinic'

export default function TermsRedirect() {
	redirect(`/${defaultAppSlug}/terms`)
}
