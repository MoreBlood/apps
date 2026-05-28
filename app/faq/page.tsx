import { redirect } from 'next/navigation'

const defaultAppSlug = 'rawclinic'

export default function FAQRedirect() {
	redirect(`/${defaultAppSlug}/faq`)
}
