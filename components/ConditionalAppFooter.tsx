'use client'

import { usePathname } from 'next/navigation'
import AppFooter from '@/components/AppFooter'
import { isAppLandingPath } from '@/lib/site-paths'

/** Site footer is hidden on `/{appSlug}` landing pages — they use `landing-footer` instead. */
export default function ConditionalAppFooter() {
	const pathname = usePathname()

	if (isAppLandingPath(pathname)) return null

	return <AppFooter />
}
