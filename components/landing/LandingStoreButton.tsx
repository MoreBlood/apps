import NextLink from 'next/link'
import clsx from 'clsx'
import { Link } from '@radix-ui/themes'
import type { LandingAppInfo } from '@/config'
import AppleLogoIcon from './AppleLogoIcon'

type Props = {
	app: LandingAppInfo
	label?: string
	size?: 'default' | 'large'
}

export default function LandingStoreButton({
	app,
	label = 'Download on the App Store',
	size = 'default'
}: Props) {
	if (!app.storeLink) return null
	return (
		<div className="landing-store-btn-wrap">
			<Link asChild>
				<NextLink
					href={app.storeLink}
					className={clsx('landing-store-btn', size === 'large' && 'landing-store-btn--large')}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={label}
				>
					<span className="landing-store-btn__label">
						<span className="landing-store-btn__label-full">{label}</span>
						<span className="landing-store-btn__label-short">Download</span>
					</span>
					<AppleLogoIcon />
				</NextLink>
			</Link>
		</div>
	)
}
