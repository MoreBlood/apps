import SitePageHero from '@/components/shared/SitePageHero'
import type { AppConfig } from '@/config'

type Props = {
	app: AppConfig
	title: string
}

export default function AppLegalHero({ app, title }: Props) {
	return (
		<SitePageHero
			eyebrow={app.appName}
			title={title}
			meta={`Last updated: ${app.lastUpdated}`}
			className="site-page-hero--section"
		/>
	)
}
