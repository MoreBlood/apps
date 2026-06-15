import clsx from 'clsx'
import { type MacClassic9IconId, macClassic9IconSrc } from '@/config/landing-mac-classic-icons'

type Props = {
	id: MacClassic9IconId
	/** Pixel size on screen (source PNGs are 64×64). */
	size?: number
	className?: string
	alt?: string
}

export default function MacClassic9Icon({ id, size = 48, className, alt = '' }: Props) {
	return (
		// biome-ignore lint/performance/noImgElement: fixed 64px Mac OS 9 sprites
		<img
			className={clsx('mac-classic-9-icon', className)}
			src={macClassic9IconSrc(id)}
			width={size}
			height={size}
			alt={alt}
			loading="lazy"
			decoding="async"
			draggable={false}
		/>
	)
}
