import NextImage from 'next/image'

interface AppStoreBadgeProps {
	storeLink: string
}

export default function AppStoreBadge({ storeLink }: AppStoreBadgeProps) {
	return (
		<a
			href={storeLink}
			target="_blank"
			rel="noopener noreferrer"
			aria-label="Download on the App Store"
			style={{ display: 'inline-block', lineHeight: 0 }}
		>
			<NextImage
				src="/app-store.svg"
				alt="Download on the App Store"
				width={135}
				height={40}
				style={{ height: 40, width: 'auto' }}
			/>
		</a>
	)
}
