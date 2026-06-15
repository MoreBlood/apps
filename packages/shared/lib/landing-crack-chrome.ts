'use client'

import { useEffect, useState } from 'react'
import { type LandingCrackSkin, readLandingCrackSkinStorage } from '@/lib/landing-crack-skin'

export const LANDING_CRACK_CHROME_ATTR = 'data-landing-crack-chrome'
export const LANDING_CRACK_SKIN_ATTR = 'data-landing-crack-skin'

export type LandingCrackChromeState = {
	active: boolean
	skin: LandingCrackSkin
}

export function setLandingCrackChrome(active: boolean, skin: LandingCrackSkin = 'win'): void {
	if (typeof document === 'undefined') return
	if (active) {
		document.documentElement.setAttribute(LANDING_CRACK_CHROME_ATTR, '')
		document.documentElement.setAttribute(LANDING_CRACK_SKIN_ATTR, skin)
	} else {
		document.documentElement.removeAttribute(LANDING_CRACK_CHROME_ATTR)
		document.documentElement.removeAttribute(LANDING_CRACK_SKIN_ATTR)
	}
}

function readChromeState(): LandingCrackChromeState {
	if (typeof document === 'undefined') {
		return { active: false, skin: 'win' }
	}
	const active = document.documentElement.hasAttribute(LANDING_CRACK_CHROME_ATTR)
	const attr = document.documentElement.getAttribute(LANDING_CRACK_SKIN_ATTR)
	const skin: LandingCrackSkin = attr === 'mac' ? 'mac' : (readLandingCrackSkinStorage() ?? 'win')
	return { active, skin }
}

export function useLandingCrackChrome(): LandingCrackChromeState {
	const [state, setState] = useState<LandingCrackChromeState>({ active: false, skin: 'win' })

	useEffect(() => {
		const sync = () => setState(readChromeState())
		sync()
		const observer = new MutationObserver(sync)
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: [LANDING_CRACK_CHROME_ATTR, LANDING_CRACK_SKIN_ATTR]
		})
		return () => observer.disconnect()
	}, [])

	return state
}
