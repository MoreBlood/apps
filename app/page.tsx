import AppCard from '@/components/AppCard'
import Container from '@/components/Container'
import { getApps } from '@/config'

export default function Home() {
	const apps = getApps()
	return (
		<Container>
			<h1>Our Apps</h1>
			<ul
				style={{
					listStyle: 'none',
					padding: 0,
					margin: 0,
					display: 'flex',
					flexDirection: 'column',
					gap: 'var(--spacing-xl)'
				}}
			>
				{apps.map((app) => (
					<li key={app.slug}>
						<AppCard app={app} />
					</li>
				))}
			</ul>
		</Container>
	)
}
