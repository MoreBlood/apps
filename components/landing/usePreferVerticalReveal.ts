'use client'

import { useEffect, useState } from 'react'

const QUERY = '(max-width: 899px)'

/** Mobile/tablet: vertical reveal only (avoids horizontal overflow from slide-in). */
export function usePreferVerticalReveal() {
	const [vertical, setVertical] = useState(true)

	useEffect(() => {
		const mq = window.matchMedia(QUERY)
		const update = () => setVertical(mq.matches)
		update()
		mq.addEventListener('change', update)
		return () => mq.removeEventListener('change', update)
	}, [])

	return vertical
}
