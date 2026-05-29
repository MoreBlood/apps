'use client'

import NextLink from 'next/link'
import { Container } from '@radix-ui/themes'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import AppIcon from '@/components/AppIcon'
import { getAppBySlug, getApps, siteName } from '@/config'
import { homeContent } from '@/config/home-content'
import { dedupeSiteNavItems, getSiteNavItems, splitSiteNavItems } from '@/lib/site-nav'
import { getAppSlugFromPathname, normalizeSitePath } from '@/lib/site-paths'

function FooterNavColumn({
	title,
	items,
	normalizedPath
}: {
	title: string
	items: { href: string; label: string }[]
	normalizedPath: string
}) {
	if (items.length === 0) return null

	return (
		<nav className="site-footer__column" aria-label={title}>
			<h2 className="site-footer__column-title">{title}</h2>
			<ul className="site-footer__links">
				{items.map(({ href, label }) => {
					const isActive = normalizedPath === normalizeSitePath(href)
					return (
						<li key={`${href}:${label}`}>
							<NextLink
								href={href}
								className="site-footer__link"
								data-active={isActive || undefined}
								aria-current={isActive ? 'page' : undefined}
							>
								{label}
							</NextLink>
						</li>
					)
				})}
			</ul>
		</nav>
	)
}

export default function AppFooter() {
	const pathname = usePathname()
	const year = new Date().getFullYear()
	const apps = useMemo(() => getApps(), [])

	const normalizedPath = useMemo(() => normalizeSitePath(pathname ?? '/'), [pathname])
	const appSlug = useMemo(() => getAppSlugFromPathname(pathname), [pathname])
	const currentApp = useMemo(() => (appSlug ? getAppBySlug(appSlug) : undefined), [appSlug])
	const items = useMemo(() => dedupeSiteNavItems(getSiteNavItems(appSlug)), [appSlug])
	const { primary: primaryItems, app: appItems } = useMemo(() => splitSiteNavItems(items), [items])

	return (
		<footer className="site-footer">
			<Container size="3">
				<div className="site-footer__inner">
					<div className="site-footer__brand-col">
						<div className="site-footer__brand">
							<NextLink href="/" className="site-footer__brand-link">
								{siteName}
							</NextLink>
							<p className="site-footer__brand-tagline">{homeContent.heroLead}</p>
						</div>
						<nav className="site-footer__column site-footer__column--apps" aria-label={homeContent.appsTitle}>
							<h2 className="site-footer__column-title">{homeContent.appsTitle}</h2>
							<ul className="site-footer__apps">
								{apps.map((app) => {
									const href = `/${app.slug}`
									const isActive = appSlug === app.slug
									return (
										<li key={app.slug}>
											<NextLink
												href={href}
												className="site-footer__link site-footer__link--app"
												data-accent={app.accentColor}
												data-active={isActive || undefined}
												aria-current={isActive ? 'page' : undefined}
											>
												<span className="site-footer__link-icon" aria-hidden>
													<AppIcon slug={app.slug} />
												</span>
												{app.appName}
											</NextLink>
										</li>
									)
								})}
							</ul>
						</nav>
					</div>

					<div className="site-footer__nav-grid">
						<FooterNavColumn title="Site" items={primaryItems} normalizedPath={normalizedPath} />
						{appItems.length > 0 && (
							<FooterNavColumn
								title={currentApp?.appName ?? 'App'}
								items={appItems}
								normalizedPath={normalizedPath}
							/>
						)}
					</div>
				</div>

				<div className="site-footer__bottom">
					<p className="site-footer__copyright">
						© {year} {siteName}
					</p>
				</div>
			</Container>
		</footer>
	)
}
