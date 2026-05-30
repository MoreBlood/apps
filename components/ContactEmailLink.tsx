import { Link } from '@radix-ui/themes'
import type { ComponentProps } from 'react'
import { contactEmailMailto, formatContactEmailDisplay } from '@/lib/contact-email'

type Props = { email: string } & Omit<ComponentProps<typeof Link>, 'href' | 'children'>

export default function ContactEmailLink({ email, ...props }: Props) {
	const display = formatContactEmailDisplay(email)

	return (
		<Link href={contactEmailMailto(email)} aria-label={display !== email ? email : undefined} {...props}>
			{display}
		</Link>
	)
}
