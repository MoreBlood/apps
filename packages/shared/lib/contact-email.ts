/**
 * Plus-addressed contact emails (e.g. user+rawclinic@gmail.com) deliver to the same inbox.
 * UI shows the base address; mailto and delivery keep the full configured value.
 */
export function formatContactEmailDisplay(email: string): string {
	const at = email.lastIndexOf('@')
	if (at <= 0) return email

	const local = email.slice(0, at)
	const plus = local.indexOf('+')
	if (plus === -1) return email

	return `${local.slice(0, plus)}${email.slice(at)}`
}

export function contactEmailMailto(email: string): string {
	return `mailto:${email}`
}
