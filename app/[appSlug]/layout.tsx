import type { Metadata } from 'next'
import { getAppBySlug, getApps } from '@/config'

type Props = {
	children: React.ReactNode
	params: Promise<{ appSlug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { appSlug } = await params
	const app = getAppBySlug(appSlug)
	if (!app) {
		return { title: 'App not found' }
	}
	return {
		title: app.appName,
		description: `${app.appName} - ${app.tagline}. ${app.description}`
	}
}

export function generateStaticParams() {
	return getApps().map((app) => ({ appSlug: app.slug }))
}

export default function AppSlugLayout({ children }: Props) {
	return <>{children}</>
}
