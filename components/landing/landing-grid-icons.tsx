import type { ComponentType } from 'react'
import type { IconProps } from '@radix-ui/react-icons/dist/types'
import {
	ActivityLogIcon,
	BarChartIcon,
	ColorWheelIcon,
	CounterClockwiseClockIcon,
	DrawingPinIcon,
	GlobeIcon,
	HeartIcon,
	LayersIcon,
	LockClosedIcon,
	MagnifyingGlassIcon,
	MixerHorizontalIcon,
	MobileIcon,
	RadiobuttonIcon,
	ReaderIcon,
	Share1Icon,
	StarIcon,
	SunIcon,
	TokensIcon,
	UploadIcon
} from '@radix-ui/react-icons'
import type { LandingGridIconId } from '@/types/landing'

type GridIcon = ComponentType<IconProps>

const GRID_ICONS: Record<LandingGridIconId, GridIcon> = {
	upload: UploadIcon,
	sun: SunIcon,
	mixer: MixerHorizontalIcon,
	curves: ActivityLogIcon,
	layers: LayersIcon,
	'color-wheel': ColorWheelIcon,
	history: CounterClockwiseClockIcon,
	device: MobileIcon,
	export: Share1Icon,
	globe: GlobeIcon,
	sensor: RadiobuttonIcon,
	pin: DrawingPinIcon,
	star: StarIcon,
	scale: TokensIcon,
	search: MagnifyingGlassIcon,
	chart: BarChartIcon,
	heart: HeartIcon,
	lock: LockClosedIcon
}

export function getLandingGridIcon(iconId: LandingGridIconId): GridIcon {
	return GRID_ICONS[iconId] ?? ReaderIcon
}
