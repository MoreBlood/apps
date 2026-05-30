import clsx from 'clsx'
import OptimizedImage from '@/components/shared/OptimizedImage'
import { getAppIconPath } from '@/lib/app-icon'

type Props = {
	slug: string
	className?: string
	/** Nav / hero marks (default lazy). */
	priority?: boolean
	/** Fill a sized parent (e.g. `.landing-icon`). */
	fill?: boolean
}

export default function AppIcon({ slug, className, priority = false, fill: fillParent = false }: Props) {
	const path = getAppIconPath(slug)

	if (fillParent) {
		return (
			<OptimizedImage
				src={path}
				alt=""
				fill
				className={clsx('app-icon', className)}
				imgClassName="app-icon__img"
				sizes="(max-width: 900px) 92px, 128px"
				priority={priority}
				deferUntilVisible={!priority}
			/>
		)
	}

	return (
		<OptimizedImage
			src={path}
			alt=""
			className={clsx('app-icon', className)}
			width={64}
			height={64}
			sizes="64px"
			priority={priority}
			deferUntilVisible={!priority}
		/>
	)
}
