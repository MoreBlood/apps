'use client'

import { DesktopIcon, HamburgerMenuIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons'
import {
	Box,
	Dialog,
	Flex,
	IconButton,
	SegmentedControl,
	Separator,
	Text
} from '@radix-ui/themes'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useEffect, useMemo, useState } from 'react'
import {
	ROOT_STATIC_SEGMENTS,
	getAppSlugFromPathname,
	normalizeSitePath
} from '@/lib/site-paths'

type NavItem = { href: string; label: string }

function dedupeNavItems(items: NavItem[]): NavItem[] {
	const seen = new Set<string>()
	return items.filter((item) => {
		if (seen.has(item.href)) return false
		seen.add(item.href)
		return true
	})
}

const navItems = (appSlug: string | null): NavItem[] => {
	const base: NavItem[] = [
		{ href: '/', label: 'Home' },
		{ href: '/blog', label: 'Blog' }
	]
	if (!appSlug || ROOT_STATIC_SEGMENTS.has(appSlug)) return base
	return dedupeNavItems([
		...base,
		{ href: `/${appSlug}`, label: 'Overview' },
		{ href: `/${appSlug}/roadmap`, label: 'Roadmap' },
		{ href: `/${appSlug}/faq`, label: 'FAQ' },
		{ href: `/${appSlug}/privacy`, label: 'Privacy' },
		{ href: `/${appSlug}/terms`, label: 'Terms' },
		{ href: `/${appSlug}/feedback`, label: 'Feedback' }
	])
}

type ThemeValue = 'light' | 'dark' | 'system'

function ThemeSwitcher({ mounted }: { mounted: boolean }) {
	const { theme, setTheme } = useTheme()
	if (!mounted) return null
	return (
		<Box data-theme-switcher>
			<SegmentedControl.Root
				value={(theme as ThemeValue) ?? 'system'}
				onValueChange={(v) => v && setTheme(v as ThemeValue)}
				size="1"
				variant="classic"
				aria-label="Theme"
			>
				<SegmentedControl.Item value="light" title="Light">
					<Flex align="center" justify="center">
						<SunIcon />
					</Flex>
				</SegmentedControl.Item>
				<SegmentedControl.Item value="dark" title="Dark">
					<Flex align="center" justify="center">
						<MoonIcon />
					</Flex>
				</SegmentedControl.Item>
				<SegmentedControl.Item value="system" title="System">
					<Flex align="center" justify="center">
						<DesktopIcon />
					</Flex>
				</SegmentedControl.Item>
			</SegmentedControl.Root>
		</Box>
	)
}

export default function AppNav() {
	const pathname = usePathname()
	const router = useRouter()
	const [mounted, setMounted] = useState(false)
	const [mobileOpen, setMobileOpen] = useState(false)

	const normalizedPath = useMemo(() => normalizeSitePath(pathname ?? '/'), [pathname])
	const appSlug = useMemo(() => getAppSlugFromPathname(pathname), [pathname])
	const items = useMemo(() => dedupeNavItems(navItems(appSlug)), [appSlug])
	const navValue = useMemo(() => {
		const match = items.find((i) => normalizeSitePath(i.href) === normalizedPath)
		return match ? match.href : normalizedPath
	}, [items, normalizedPath])

	useEffect(() => setMounted(true), [])

	const goTo = (href: string) => {
		router.push(href)
		setMobileOpen(false)
	}

	return (
		<Box asChild mb="6" pb="3" style={{ borderBottom: '1px solid var(--gray-a6)' }}>
			<nav aria-label="Main navigation">
				<Flex gap="4" wrap="wrap" align="center" justify="between">
				<Box display={{ initial: 'none', lg: 'block' }} className="app-nav-desktop" style={{ minWidth: 0, flex: '1 1 auto' }}>
					<SegmentedControl.Root value={navValue} onValueChange={(v) => v && router.push(v)} size="2">
						{items.map(({ href, label }) => (
							<SegmentedControl.Item key={`${href}:${label}`} value={href}>
								{label}
							</SegmentedControl.Item>
						))}
					</SegmentedControl.Root>
				</Box>

				<Box display={{ initial: 'block', lg: 'none' }}>
					<Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
						<Dialog.Trigger>
							<IconButton variant="soft" size="3" aria-label="Open menu">
								<HamburgerMenuIcon />
							</IconButton>
						</Dialog.Trigger>
						<Dialog.Content size="2" className="app-nav-dialog">
							<Dialog.Title>Menu</Dialog.Title>
							<Flex direction="column" gap="3" mt="3">
								{items.map(({ href, label }) => {
									const isActive = normalizedPath === normalizeSitePath(href)
									return (
										<Dialog.Close key={`${href}:${label}`}>
											<Box
												asChild
												style={{
													cursor: 'pointer',
													minHeight: '2.75rem',
													display: 'flex',
													alignItems: 'center',
													padding: 'var(--space-2) var(--space-3)',
													borderRadius: 'var(--radius-2)',
													background: isActive ? 'var(--accent-9)' : 'transparent',
													color: isActive ? 'white' : undefined
												}}
												onClick={() => goTo(href)}
											>
												<Text size="3" weight={isActive ? 'medium' : 'regular'}>
													{label}
												</Text>
											</Box>
										</Dialog.Close>
									)
								})}
								<Separator size="4" />
								<Text size="2" color="gray" mb="1">
									Theme
								</Text>
								<ThemeSwitcher mounted={mounted} />
							</Flex>
						</Dialog.Content>
					</Dialog.Root>
				</Box>

				<Box display={{ initial: 'none', lg: 'block' }} flexShrink="0">
					<ThemeSwitcher mounted={mounted} />
				</Box>
			</Flex>
			</nav>
		</Box>
	)
}
