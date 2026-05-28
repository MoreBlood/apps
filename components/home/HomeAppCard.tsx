import NextLink from 'next/link'
import type { HomeAppCardData } from '@/config/home-content'

type Props = {
	app: HomeAppCardData
}

function initials(name: string) {
	return name.replace(/\s+/g, '').slice(0, 2).toUpperCase()
}

export default function HomeAppCard({ app }: Props) {
	return (
		<NextLink href={`/${app.slug}`} className="home-app-card" data-accent={app.accentColor}>
			<div className="home-app-card__glow" aria-hidden />
			<div className="home-app-card__inner">
				<div className="home-app-card__main">
					<div className="home-app-card__icon" aria-hidden>
						<span>{initials(app.appName)}</span>
					</div>
					<p className="home-app-card__eyebrow">{app.eyebrow}</p>
					<h2 className="home-app-card__title">{app.appName}</h2>
					<p className="home-app-card__tagline">{app.tagline}</p>
					<p className="home-app-card__excerpt">{app.excerpt}</p>
					<span className="home-app-card__cta">
						Explore app
						<span aria-hidden> →</span>
					</span>
				</div>
				<div className="home-app-card__visual" aria-hidden>
					<div className="home-app-card__screen" />
				</div>
			</div>
		</NextLink>
	)
}
