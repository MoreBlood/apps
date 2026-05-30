'use client'

import { useEffect, useRef, useState } from 'react'

type Options = {
	/** When false, always treated as visible (e.g. LCP / priority). */
	defer?: boolean
	rootMargin?: string
}

/**
 * Gate heavy media until near the viewport. Fixes lazy-loading inside SVG foreignObject.
 */
export function useDeferUntilVisible({ defer = true, rootMargin = '120px 0px' }: Options = {}) {
	const ref = useRef<HTMLDivElement>(null)
	const [visible, setVisible] = useState(!defer)

	useEffect(() => {
		if (!defer) return
		const node = ref.current
		if (!node) return

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVisible(true)
					observer.disconnect()
				}
			},
			{ rootMargin, threshold: 0.01 }
		)
		observer.observe(node)
		return () => observer.disconnect()
	}, [defer, rootMargin])

	return { ref, visible }
}
