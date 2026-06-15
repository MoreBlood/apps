'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { getAppSlugFromPathname } from '@/lib/site-paths'

type Props = {
	appSlug: string
}

/**
 * Safari applies Smart App Banner only on full document load. Next.js client
 * navigations between /{appSlug}/ pages update <meta> but not the native banner.
 */
export default function SafariAppBannerSync({ appSlug }: Props) {
	const pathname = usePathname()
	const previousAppSlug = useRef<string | null>(null)

	useEffect(() => {
		if (getAppSlugFromPathname(pathname) !== appSlug) return

		const prev = previousAppSlug.current
		if (prev != null && prev !== appSlug) {
			window.location.reload()
			return
		}
		previousAppSlug.current = appSlug
	}, [appSlug, pathname])

	return null
}
