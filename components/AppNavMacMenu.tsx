'use client'

import * as Menubar from '@radix-ui/react-menubar'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import AppIcon from '@/components/AppIcon'
import { siteName } from '@/config'
import type { CrackNavMenuEntry, CrackNavMenuGroup } from '@/lib/site-nav'
import { isSiteNavItemActive } from '@/lib/site-paths'

type ThemeValue = 'light' | 'dark' | 'system'

type Props = {
	pathname: string
	appSlug: string | null
	appName: string
	menuGroups: CrackNavMenuGroup[]
}

function MacMenubarLinkItem({ href, label, pathname }: { href: string; label: string; pathname: string }) {
	const isActive = isSiteNavItemActive(pathname, href)
	return (
		<Menubar.Item asChild>
			<NextLink
				href={href}
				className="app-nav-mac__dropdown-item"
				data-active={isActive || undefined}
				aria-current={isActive ? 'page' : undefined}
			>
				{label}
			</NextLink>
		</Menubar.Item>
	)
}

function MacMenubarEntries({
	entries,
	pathname,
	scope
}: {
	entries: CrackNavMenuEntry[]
	pathname: string
	scope: string
}) {
	let separatorCount = 0
	return entries.map((entry) => {
		if (entry.type === 'separator') {
			separatorCount += 1
			return <Menubar.Separator key={`${scope}-separator-${separatorCount}`} className="app-nav-mac__separator" />
		}
		if (entry.type === 'sub') {
			return (
				<Menubar.Sub key={entry.label}>
					<Menubar.SubTrigger className="app-nav-mac__dropdown-item app-nav-mac__sub-trigger">
						{entry.label}
					</Menubar.SubTrigger>
					<Menubar.Portal>
						<Menubar.SubContent className="app-nav-mac__dropdown app-nav-mac__dropdown--sub" alignOffset={-4}>
							{entry.items.map((item) => (
								<MacMenubarLinkItem key={item.href} href={item.href} label={item.label} pathname={pathname} />
							))}
						</Menubar.SubContent>
					</Menubar.Portal>
				</Menubar.Sub>
			)
		}
		return <MacMenubarLinkItem key={entry.href} href={entry.href} label={entry.label} pathname={pathname} />
	})
}

function MacMenubarMenu({ group, pathname }: { group: CrackNavMenuGroup; pathname: string }) {
	return (
		<Menubar.Menu>
			<Menubar.Trigger className="app-nav-mac__menu-trigger">{group.label}</Menubar.Trigger>
			<Menubar.Portal>
				<Menubar.Content className="app-nav-mac__dropdown" align="start" sideOffset={0} alignOffset={-1}>
					<MacMenubarEntries entries={group.entries} pathname={pathname} scope={group.ariaLabel} />
				</Menubar.Content>
			</Menubar.Portal>
		</Menubar.Menu>
	)
}

export default function AppNavMacMenu({ pathname, appSlug, appName, menuGroups }: Props) {
	const router = useRouter()
	const { theme, setTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => setMounted(true), [])

	const currentTheme = ((theme as ThemeValue | undefined) ?? 'system') as ThemeValue

	return (
		<nav aria-label="Main navigation" className="app-nav app-nav--mac">
			<Menubar.Root className="app-nav-mac" loop>
				<Menubar.Menu>
					<Menubar.Trigger className="app-nav-mac__apple" aria-label="Apple menu">
						<span className="app-nav-mac__apple-glyph" aria-hidden />
					</Menubar.Trigger>
					<Menubar.Portal>
						<Menubar.Content className="app-nav-mac__dropdown" align="start" sideOffset={0}>
							<Menubar.Item className="app-nav-mac__dropdown-item" onSelect={() => router.push('/')}>
								{siteName}…
							</Menubar.Item>
							<Menubar.Separator className="app-nav-mac__separator" />
							<Menubar.Item className="app-nav-mac__dropdown-item" disabled>
								About Honest Edition…
							</Menubar.Item>
						</Menubar.Content>
					</Menubar.Portal>
				</Menubar.Menu>

				{menuGroups.map((group) => (
					<MacMenubarMenu key={group.ariaLabel} group={group} pathname={pathname} />
				))}

				<Menubar.Menu>
					<Menubar.Trigger className="app-nav-mac__menu-trigger">View</Menubar.Trigger>
					<Menubar.Portal>
						<Menubar.Content className="app-nav-mac__dropdown" align="start" sideOffset={0}>
							<Menubar.RadioGroup
								value={mounted ? currentTheme : 'system'}
								onValueChange={(value) => setTheme(value as ThemeValue)}
							>
								<Menubar.RadioItem className="app-nav-mac__dropdown-item app-nav-mac__radio-item" value="light">
									<Menubar.ItemIndicator className="app-nav-mac__radio-dot">✓</Menubar.ItemIndicator>
									Light
								</Menubar.RadioItem>
								<Menubar.RadioItem className="app-nav-mac__dropdown-item app-nav-mac__radio-item" value="dark">
									<Menubar.ItemIndicator className="app-nav-mac__radio-dot">✓</Menubar.ItemIndicator>
									Dark
								</Menubar.RadioItem>
								<Menubar.RadioItem className="app-nav-mac__dropdown-item app-nav-mac__radio-item" value="system">
									<Menubar.ItemIndicator className="app-nav-mac__radio-dot">✓</Menubar.ItemIndicator>
									System
								</Menubar.RadioItem>
							</Menubar.RadioGroup>
						</Menubar.Content>
					</Menubar.Portal>
				</Menubar.Menu>

				<div className="app-nav-mac__title" aria-hidden>
					{appSlug && (
						<span className="app-nav-mac__title-icon">
							<AppIcon slug={appSlug} />
						</span>
					)}
					<span className="app-nav-mac__title-text">{appName} — Honest Edition</span>
				</div>
			</Menubar.Root>
		</nav>
	)
}
