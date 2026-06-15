'use client'

import type { LandingAppInfo } from '@/config'
import type { LandingCrackSkin } from '@/lib/landing-crack-skin'
import LandingCrackDesktopInner from './LandingCrackDesktopInner'
import { LandingCrackShellProvider } from './LandingCrackShellContext'

type Props = {
	app: LandingAppInfo
	skin?: LandingCrackSkin
}

export default function LandingAntiMinimal({ app, skin = 'win' }: Props) {
	return (
		<LandingCrackShellProvider>
			<LandingCrackDesktopInner app={app} skin={skin} />
		</LandingCrackShellProvider>
	)
}
