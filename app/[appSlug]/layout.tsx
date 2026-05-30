import type { Metadata } from 'next'
import { getAppBySlug, getApps } from '@/config'
import { getBaseUrl } from '@/lib/siteUrl'

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
	const pageUrl = `${getBaseUrl()}/${appSlug}/`
	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: 'website',
			locale: 'en',
			url: pageUrl
		},
		twitter: {
			card: 'summary',
			title,
			description
		},
		alternates: {
			canonical: pageUrl
		}
	}
}

export function generateStaticParams() {
	return getApps().map((app) => ({ appSlug: app.slug }))
}

export default function AppSlugLayout({ children }: Props) {
	return <>{children}</>
}
