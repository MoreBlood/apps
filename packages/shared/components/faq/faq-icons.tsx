import {
	ActivityLogIcon,
	ExclamationTriangleIcon,
	ImageIcon,
	LayersIcon,
	LockClosedIcon,
	MixerHorizontalIcon,
	ReaderIcon,
	RocketIcon
} from '@radix-ui/react-icons'
import type { IconProps } from '@radix-ui/react-icons/dist/types'
import type { ComponentType } from 'react'

type FAQIcon = ComponentType<IconProps>

const SECTION_ICONS: Record<string, FAQIcon> = {
	'getting-started': RocketIcon,
	editing: ImageIcon,
	privacy: LockClosedIcon,
	troubleshooting: ExclamationTriangleIcon,
	data: ActivityLogIcon,
	'providers-scales': MixerHorizontalIcon,
	features: LayersIcon
}

export function getFAQSectionIcon(sectionId: string): FAQIcon {
	return SECTION_ICONS[sectionId] ?? ReaderIcon
}
