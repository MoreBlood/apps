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
	const title = app.appName
	const description = `${app.appName} - ${app.tagline}. ${app.description}`
	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: 'website',
			locale: 'en'
		},
		twitter: {
			card: 'summary',
			title,
			description
		},
		alternates: {
			canonical: `/${appSlug}/`
		}
	}
}

export function generateStaticParams() {
	return getApps().map((app) => ({ appSlug: app.slug }))
}

export default function AppSlugLayout({ children }: Props) {
	return <>{children}</>
}
