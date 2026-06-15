'use client'

import { Cross2Icon, DesktopIcon, HamburgerMenuIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { Box, Dialog, IconButton, Text } from '@radix-ui/themes'
import clsx from 'clsx'
import NextLink from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import AppIcon from '@/components/AppIcon'
import AppNavCrackMenu from '@/components/AppNavCrackMenu'
import AppNavMacMenu from '@/components/AppNavMacMenu'
import { getAppBySlug, getApps, siteName } from '@/config'
import { homeContent } from '@/config/home-content'
import { isSingleAppSite } from '@/config/site-mode'
import { useLandingCrackChrome } from '@/lib/landing-crack-chrome'
import {
	dedupeSiteNavItems,
	getCrackNavMenuGroups,
	getSiteNavItems,
	type SiteNavItem,
	splitSiteNavItems
} from '@/lib/site-nav'
import { getAppSlugFromPathname, isSiteNavItemActive } from '@/lib/site-paths'

type ThemeValue = 'light' | 'dark' | 'system'

function PillNavLinks({ items, pathname }: { items: SiteNavItem[]; pathname: string }) {
	return items.map(({ href, label }) => {
		const isActive = isSiteNavItemActive(pathname, href)
		return (
			<NextLink
				key={`${href}:${label}`}
				href={href}
				className={clsx('app-nav-pill__item', isActive && 'app-nav-pill__item--active')}
				data-active={isActive ? '' : undefined}
				aria-current={isActive ? 'page' : undefined}
				data-label={label}
			>
				{label}
			</NextLink>
		)
	})
}

const THEME_CYCLE: ThemeValue[] = ['light', 'dark', 'system']

const THEME_LABELS: Record<ThemeValue, string> = {
	light: 'Light theme',
	dark: 'Dark theme',
	system: 'System theme'
}

function nextTheme(current: ThemeValue): ThemeValue {
	const index = THEME_CYCLE.indexOf(current)
	return THEME_CYCLE[(index + 1) % THEME_CYCLE.length]
}

function ThemeSwitcher({ mounted }: { mounted: boolean }) {
	const { theme, setTheme } = useTheme()
	const current = ((theme as ThemeValue | undefined) ?? 'system') as ThemeValue
	const next = nextTheme(current)
	// Stable icon until mounted — useTheme() differs between SSR and client
	const ThemeIcon = !mounted ? DesktopIcon : current === 'light' ? SunIcon : current === 'dark' ? MoonIcon : DesktopIcon
	const label = `${THEME_LABELS[current]}. Switch to ${THEME_LABELS[next].toLowerCase()}.`

	return (
		<Box data-theme-switcher className="app-nav-theme" data-ready={mounted || undefined}>
			<IconButton
				className="app-nav-metal-btn"
				variant="soft"
				size="2"
				disabled={!mounted}
				aria-hidden={!mounted || undefined}
				aria-label={mounted ? label : undefined}
				title={mounted ? `${THEME_LABELS[current]} — click for ${THEME_LABELS[next].toLowerCase()}` : undefined}
				onClick={() => setTheme(next)}
			>
				<ThemeIcon width={18} height={18} aria-hidden />
			</IconButton>
		</Box>
	)
}

export default function AppNav() {
	const pathname = usePathname()
	const router = useRouter()
	const { active: crackChrome, skin: crackSkin } = useLandingCrackChrome()
	const [mounted, setMounted] = useState(false)
	const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null)
	const [mobileOpen, setMobileOpen] = useState(false)
	const appsSectionId = 'app-nav-apps-menu'
	const menuApps = useMemo(() => getApps(), [])
	const copyrightYear = new Date().getFullYear()

	const currentPath = pathname ?? '/'
	const appSlug = useMemo(() => getAppSlugFromPathname(currentPath), [currentPath])
	const items = useMemo(() => dedupeSiteNavItems(getSiteNavItems(appSlug)), [appSlug])
	const { primary: primaryItems, app: appItems } = useMemo(() => splitSiteNavItems(items), [items])
	const currentApp = useMemo(() => (appSlug ? getAppBySlug(appSlug) : undefined), [appSlug])
	const crackAppName = currentApp?.appName ?? siteName
	const crackMenuGroups = useMemo(
		() =>
			getCrackNavMenuGroups(items, menuApps, {
				appMenuLabel: currentApp?.appName ?? 'App',
				appsSectionTitle: homeContent.appsTitle
			}),
		[items, menuApps, currentApp?.appName]
	)

	useEffect(() => {
		setMounted(true)
		setPortalRoot(document.querySelector<HTMLElement>('.radix-themes'))
	}, [])

	const goTo = (href: string) => {
		router.push(href)
		setMobileOpen(false)
	}

	const nav = (
		<nav
			aria-label="Main navigation"
			className="app-nav"
			data-menu-open={mobileOpen || undefined}
			aria-hidden={mobileOpen || undefined}
			inert={mobileOpen || undefined}
		>
			<div className="app-nav__bar">
				<Box className="app-nav__start" display={{ initial: 'block', lg: 'none' }}>
					{mounted ? (
						<Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
							<Dialog.Trigger>
								<IconButton className="app-nav-metal-btn" variant="soft" size="2" aria-label="Open menu">
									<HamburgerMenuIcon width={18} height={18} aria-hidden />
								</IconButton>
							</Dialog.Trigger>
							<Dialog.Content className="app-nav-dialog" data-lenis-prevent aria-describedby={undefined}>
								<Dialog.Title className="visually-hidden">Menu</Dialog.Title>
								<div className="app-nav-dialog__inner">
									<header className="app-nav-dialog__header">
										<Dialog.Close className="app-nav-dialog__brand" onClick={() => goTo('/')}>
											<span>{siteName}</span>
										</Dialog.Close>
										<Dialog.Close className="app-nav-dialog__close">
											<span className="app-nav-dialog__close-label">
												<Cross2Icon width={16} height={16} aria-hidden />
												<span>Close</span>
											</span>
										</Dialog.Close>
									</header>

									<nav className="app-nav-dialog__primary" aria-label="Site">
										{primaryItems.map(({ href, label }) => {
											const isActive = isSiteNavItemActive(currentPath, href)
											return (
												<Dialog.Close
													key={`${href}:${label}`}
													className={clsx(
														'app-nav-dialog__primary-link',
														isActive && 'app-nav-dialog__primary-link--active'
													)}
													data-active={isActive ? '' : undefined}
													aria-current={isActive ? 'page' : undefined}
													onClick={() => goTo(href)}
												>
													<span>{label}</span>
												</Dialog.Close>
											)
										})}
									</nav>

									{appItems.length > 0 && (
										<nav className="app-nav-dialog__section" aria-label="Current app">
											{appItems.map(({ href, label }) => {
												const isActive = isSiteNavItemActive(currentPath, href)
												return (
													<Dialog.Close
														key={`${href}:${label}`}
														className="app-nav-dialog__section-link"
														data-active={isActive ? '' : undefined}
														aria-current={isActive ? 'page' : undefined}
														onClick={() => goTo(href)}
													>
														<span>{label}</span>
													</Dialog.Close>
												)
											})}
										</nav>
									)}

									{!isSingleAppSite() && (
										<section className="app-nav-dialog__apps" aria-labelledby={appsSectionId}>
											<h2 className="app-nav-dialog__apps-title" id={appsSectionId}>
												{homeContent.appsTitle}:
											</h2>
											<ul className="app-nav-dialog__apps-list">
												{menuApps.map((app) => (
													<li key={app.slug}>
														<Dialog.Close
															className="app-nav-dialog__app-row"
															data-active={appSlug === app.slug ? '' : undefined}
															aria-current={appSlug === app.slug ? 'page' : undefined}
															onClick={() => goTo(`/${app.slug}`)}
														>
															<span className="app-nav-dialog__app-row-inner">
																<span className="app-nav-dialog__app-icon" aria-hidden>
																	<AppIcon slug={app.slug} />
																</span>
																<span className="app-nav-dialog__app-copy">
																	<span className="app-nav-dialog__app-name">{app.appName}</span>
																	<span className="app-nav-dialog__app-tagline">{app.tagline}</span>
																</span>
															</span>
														</Dialog.Close>
													</li>
												))}
											</ul>
										</section>
									)}

									<footer className="app-nav-dialog__footer">
										<Text as="p" size="1" className="app-nav-dialog__copyright">
											© {copyrightYear} {siteName}
										</Text>
										<div className="app-nav-dialog__theme">
											<ThemeSwitcher mounted={mounted} />
										</div>
									</footer>
								</div>
							</Dialog.Content>
						</Dialog.Root>
					) : (
						<IconButton className="app-nav-metal-btn" variant="soft" size="2" aria-label="Open menu">
							<HamburgerMenuIcon width={18} height={18} aria-hidden />
						</IconButton>
					)}
				</Box>

				<Box display={{ initial: 'none', lg: 'block' }} className="app-nav-desktop">
					<div className="app-nav-pill-row">
						<nav className="app-nav-pill" aria-label="Site">
							<div className="app-nav-pill__track">
								<PillNavLinks items={primaryItems} pathname={currentPath} />
							</div>
						</nav>
						{appItems.length > 0 && (
							<nav className="app-nav-pill" aria-label={currentApp?.appName ?? 'App'}>
								<div className="app-nav-pill__track">
									<PillNavLinks items={appItems} pathname={currentPath} />
								</div>
							</nav>
						)}
					</div>
				</Box>

				<Box className="app-nav__end" flexShrink="0">
					<Box display={{ initial: 'none', lg: 'block' }}>
						<ThemeSwitcher mounted={mounted} />
					</Box>
				</Box>
			</div>
		</nav>
	)

	const crackNav =
		crackSkin === 'mac' ? (
			<AppNavMacMenu pathname={currentPath} appSlug={appSlug} appName={crackAppName} menuGroups={crackMenuGroups} />
		) : (
			<AppNavCrackMenu pathname={currentPath} appSlug={appSlug} appName={crackAppName} menuGroups={crackMenuGroups} />
		)

	return (
		<>
			<div
				className={clsx(
					'app-nav-shell',
					crackChrome && (crackSkin === 'mac' ? 'app-nav-shell--mac' : 'app-nav-shell--crack')
				)}
			/>
			{portalRoot ? createPortal(crackChrome ? crackNav : nav, portalRoot) : crackChrome ? crackNav : nav}
		</>
	)
}
