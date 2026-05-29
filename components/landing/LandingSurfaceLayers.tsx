import type { LandingSurfaceEffects } from '@/lib/landing-surface'
import { landingSurfaceHasTexture } from '@/lib/landing-surface'

type Props = {
	effects: LandingSurfaceEffects
}

export default function LandingSurfaceLayers({ effects }: Props) {
	return (
		<>
			{landingSurfaceHasTexture(effects) ? (
				<span className="landing-surface__texture" aria-hidden />
			) : null}
			{effects.pointer ? <span className="landing-surface__pointer" aria-hidden /> : null}
		</>
	)
}
