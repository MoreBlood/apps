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

const navItems = (appSlug: string | null) => {
	const base = [{ href: '/', label: 'Home' }]
	if (!appSlug) return base
	return [
		...base,
		{ href: `/${appSlug}`, label: 'Overview' },
		{ href: `/${appSlug}/privacy`, label: 'Privacy' },
		{ href: `/${appSlug}/terms`, label: 'Terms' },
		{ href: `/${appSlug}/feedback`, label: 'Feedback' }
	]
}

function normalizePath(p: string) {
	const s = p.replace(/\/$/, '')
	return s || '/'
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

	const normalizedPath = useMemo(() => normalizePath(pathname), [pathname])
	const appSlug = normalizedPath === '/' ? null : (normalizedPath.split('/').filter(Boolean)[0] ?? null)
	const items = useMemo(() => navItems(appSlug), [appSlug])
	const navValue = useMemo(() => {
		const match = items.find((i) => normalizePath(i.href) === normalizedPath)
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
				<Box display={{ initial: 'none', sm: 'block' }} style={{ minWidth: 0, flex: '1 1 auto' }}>
					<SegmentedControl.Root value={navValue} onValueChange={(v) => v && router.push(v)} size="2">
						{items.map(({ href, label }) => (
							<SegmentedControl.Item key={href} value={href}>
								{label}
							</SegmentedControl.Item>
						))}
					</SegmentedControl.Root>
				</Box>

				<Box display={{ initial: 'block', sm: 'none' }}>
					<Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
						<Dialog.Trigger>
							<IconButton variant="soft" size="3" aria-label="Open menu">
								<HamburgerMenuIcon />
							</IconButton>
						</Dialog.Trigger>
						<Dialog.Content size="2" style={{ maxWidth: 320 }}>
							<Dialog.Title>Menu</Dialog.Title>
							<Flex direction="column" gap="3" mt="3">
								{items.map(({ href, label }) => {
									const isActive = normalizedPath === normalizePath(href)
									return (
										<Dialog.Close key={href}>
											<Box
												asChild
												style={{
													cursor: 'pointer',
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

				<Box display={{ initial: 'none', sm: 'block' }}>
					<ThemeSwitcher mounted={mounted} />
				</Box>
			</Flex>
			</nav>
		</Box>
	)
}
