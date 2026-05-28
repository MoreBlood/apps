import clsx from 'clsx'
import { getAppIconPath } from '@/lib/app-icon'
import { assetPath } from '@/lib/basePath'

type Props = {
	slug: string
	className?: string
}

export default function AppIcon({ slug, className }: Props) {
	return (
		// biome-ignore lint/performance/noImgElement: static export; icons are local assets
		<img src={assetPath(getAppIconPath(slug))} alt="" className={clsx('app-icon', className)} />
	)
}
