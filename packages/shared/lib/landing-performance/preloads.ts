import { resolveOptimizedImage } from '@/lib/optimized-image'
import type { AppLandingConfig } from '@/types/landing'

export type LandingPreloadAsset = {
	href: string
	as: 'image'
	fetchPriority: 'high' | 'low' | 'auto'
}

/** LCP candidates for hero device stage — call from RSC `page.tsx` via `preload()`. */
export function getLandingLcpPreloads(landing: AppLandingConfig): LandingPreloadAsset[] {
	const { hero } = landing.screenshots
	const assets: LandingPreloadAsset[] = [
		{ href: resolveOptimizedImage(hero.iphone).src, as: 'image', fetchPriority: 'high' },
		{ href: resolveOptimizedImage(hero.ipad).src, as: 'image', fetchPriority: 'high' }
	]
	if (hero.iphoneSecondary) {
		assets.push({
			href: resolveOptimizedImage(hero.iphoneSecondary).src,
			as: 'image',
			fetchPriority: 'high'
		})
	}
	return assets
}
