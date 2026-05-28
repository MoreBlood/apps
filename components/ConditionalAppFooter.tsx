'use client'

import { usePathname } from 'next/navigation'
import AppFooter from '@/components/AppFooter'

const ROOT_STATIC_SEGMENTS = new Set(['faq', 'feedback', 'privacy', 'terms', 'roadmap'])

function isAppLandingPath(pathname: string | null): boolean {
	if (!pathname) return false
	const match = pathname.match(/^\/([^/]+)\/?$/)
	if (!match) return false
	return !ROOT_STATIC_SEGMENTS.has(match[1])
}

/** Site footer is hidden on `/{appSlug}` landing pages — they use `landing-footer` instead. */
export default function ConditionalAppFooter() {
	const pathname = usePathname()

	if (isAppLandingPath(pathname)) return null

	return <AppFooter />
}
