'use client'

import { Cross2Icon, DesktopIcon, HamburgerMenuIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { Box, Dialog, IconButton, Text } from '@radix-ui/themes'
import NextLink from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { type CSSProperties, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import AppIcon from '@/components/AppIcon'
import { getAppBySlug, getApps, siteName } from '@/config'
import { homeContent } from '@/config/home-content'
import { useScrollHeader } from '@/hooks/useScrollHeader'
import {
	dedupeSiteNavItems,
	getSiteNavItems,
	getSitePageTitle,
	type SiteNavItem,
	splitSiteNavItems
} from '@/lib/site-nav'
import { getAppSlugFromPathname, normalizeSitePath } from '@/lib/site-paths'

type ThemeValue = 'light' | 'dark' | 'system'

function PillNavLinks({ items, normalizedPath }: { items: SiteNavItem[]; normalizedPath: string }) {
	return items.map(({ href, label }) => {
		const isActive = normalizedPath === normalizeSitePath(href)
		return (
			<NextLink
				key={`${href}:${label}`}
				href={href}
				className="app-nav-pill__item"
				data-active={isActive || undefined}
				aria-current={isActive ? 'page' : undefined}
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
	const [mounted, setMounted] = useState(false)
	const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null)
	const [mobileOpen, setMobileOpen] = useState(false)
	const appsSectionId = 'app-nav-apps-menu'
	const menuApps = useMemo(() => getApps(), [])
	const copyrightYear = new Date().getFullYear()

	const normalizedPath = useMemo(() => normalizeSitePath(pathname ?? '/'), [pathname])
	const appSlug = useMemo(() => getAppSlugFromPathname(pathname), [pathname])
	const items = useMemo(() => dedupeSiteNavItems(getSiteNavItems(appSlug)), [appSlug])
	const { primary: primaryItems, app: appItems } = useMemo(() => splitSiteNavItems(items), [items])
	const currentApp = useMemo(() => (appSlug ? getAppBySlug(appSlug) : undefined), [appSlug])
	const pageTitle = useMemo(() => getSitePageTitle(pathname), [pathname])
	const barRef = useRef<HTMLDivElement>(null)
	const { hideProgress } = useScrollHeader({ disabled: mobileOpen })

	useEffect(() => {
		setMounted(true)
		setPortalRoot(document.querySelector<HTMLElement>('.radix-themes'))
	}, [])

	useLayoutEffect(() => {
		const el = barRef.current
		if (!el) return

		const sync = () => {
			document.documentElement.style.setProperty('--app-nav-bar-height', `${el.offsetHeight}px`)
		}
		sync()

		const observer = new ResizeObserver(sync)
		observer.observe(el)
		return () => observer.disconnect()
	}, [pathname])

	const goTo = (href: string) => {
		router.push(href)
		setMobileOpen(false)
	}

	const nav = (
		<nav
			aria-label="Main navigation"
			className="app-nav"
			data-menu-open={mobileOpen || undefined}
			style={{ '--nav-hide-progress': hideProgress } as CSSProperties}
			aria-hidden={mobileOpen || hideProgress >= 1}
			inert={mobileOpen || hideProgress >= 1 || undefined}
		>
			<div ref={barRef} className="app-nav__bar">
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
											const isActive = normalizedPath === normalizeSitePath(href)
											return (
												<Dialog.Close
													key={`${href}:${label}`}
													className="app-nav-dialog__primary-link"
													data-active={isActive || undefined}
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
												const isActive = normalizedPath === normalizeSitePath(href)
												return (
													<Dialog.Close
														key={`${href}:${label}`}
														className="app-nav-dialog__section-link"
														data-active={isActive || undefined}
														onClick={() => goTo(href)}
													>
														<span>{label}</span>
													</Dialog.Close>
												)
											})}
										</nav>
									)}

									<section className="app-nav-dialog__apps" aria-labelledby={appsSectionId}>
										<h2 className="app-nav-dialog__apps-title" id={appsSectionId}>
											{homeContent.appsTitle}:
										</h2>
										<ul className="app-nav-dialog__apps-list">
											{menuApps.map((app) => (
												<li key={app.slug}>
													<Dialog.Close
														className="app-nav-dialog__app-row"
														data-active={appSlug === app.slug || undefined}
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

				<div className="app-nav__title-wrap">
					<div className="app-nav-pill__track">
						<span className="app-nav__title" aria-current="page">
							{pageTitle}
						</span>
					</div>
				</div>

				<Box display={{ initial: 'none', lg: 'block' }} className="app-nav-desktop">
					<div className="app-nav-pill-row">
						<nav className="app-nav-pill" aria-label="Site">
							<div className="app-nav-pill__track">
								<PillNavLinks items={primaryItems} normalizedPath={normalizedPath} />
							</div>
						</nav>
						{appItems.length > 0 && (
							<nav className="app-nav-pill" aria-label={currentApp?.appName ?? 'App'}>
								<div className="app-nav-pill__track">
									<PillNavLinks items={appItems} normalizedPath={normalizedPath} />
								</div>
							</nav>
						)}
					</div>
				</Box>

				<Box className="app-nav__end" flexShrink="0">
					<ThemeSwitcher mounted={mounted} />
				</Box>
			</div>
		</nav>
	)

	return (
		<>
			<div className="app-nav-shell" />
			{portalRoot ? createPortal(nav, portalRoot) : nav}
		</>
	)
}
