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

function CrackMenubarLinkItem({ href, label, pathname }: { href: string; label: string; pathname: string }) {
	const isActive = isSiteNavItemActive(pathname, href)
	return (
		<Menubar.Item asChild>
			<NextLink
				href={href}
				className="app-nav-crack__dropdown-item"
				data-active={isActive || undefined}
				aria-current={isActive ? 'page' : undefined}
			>
				{label}
			</NextLink>
		</Menubar.Item>
	)
}

function CrackMenubarEntries({
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
			return <Menubar.Separator key={`${scope}-separator-${separatorCount}`} className="app-nav-crack__separator" />
		}
		if (entry.type === 'sub') {
			return (
				<Menubar.Sub key={entry.label}>
					<Menubar.SubTrigger className="app-nav-crack__dropdown-item app-nav-crack__sub-trigger">
						{entry.label}
					</Menubar.SubTrigger>
					<Menubar.Portal>
						<Menubar.SubContent className="app-nav-crack__dropdown app-nav-crack__dropdown--sub" alignOffset={-4}>
							{entry.items.map((item) => (
								<CrackMenubarLinkItem key={item.href} href={item.href} label={item.label} pathname={pathname} />
							))}
						</Menubar.SubContent>
					</Menubar.Portal>
				</Menubar.Sub>
			)
		}
		return <CrackMenubarLinkItem key={entry.href} href={entry.href} label={entry.label} pathname={pathname} />
	})
}

function CrackMenubarMenu({ group, pathname }: { group: CrackNavMenuGroup; pathname: string }) {
	return (
		<Menubar.Menu>
			<Menubar.Trigger className="app-nav-crack__menu-trigger">{group.label}</Menubar.Trigger>
			<Menubar.Portal>
				<Menubar.Content className="app-nav-crack__dropdown" align="start" sideOffset={2} alignOffset={-2}>
					<CrackMenubarEntries entries={group.entries} pathname={pathname} scope={group.ariaLabel} />
				</Menubar.Content>
			</Menubar.Portal>
		</Menubar.Menu>
	)
}

export default function AppNavCrackMenu({ pathname, appSlug, appName, menuGroups }: Props) {
	const router = useRouter()
	const { theme, setTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => setMounted(true), [])

	const currentTheme = ((theme as ThemeValue | undefined) ?? 'system') as ThemeValue

	return (
		<nav aria-label="Main navigation" className="app-nav app-nav--crack">
			<div className="app-nav-crack">
				<div className="app-nav-crack__titlebar">
					<div className="app-nav-crack__brand">
						{appSlug ? (
							<>
								<span className="app-nav-crack__icon" aria-hidden>
									<AppIcon slug={appSlug} />
								</span>
								<span className="app-nav-crack__app-name">{appName} — Honest Edition</span>
							</>
						) : (
							<span className="app-nav-crack__app-name">{siteName}</span>
						)}
					</div>
					<div className="app-nav-crack__window-btns" aria-hidden>
						<span>_</span>
						<span>□</span>
						<button
							type="button"
							className="app-nav-crack__close"
							aria-label="Go home"
							onClick={() => router.push('/')}
						>
							×
						</button>
					</div>
				</div>

				<Menubar.Root className="app-nav-crack__menubar" loop>
					{menuGroups.map((group) => (
						<CrackMenubarMenu key={group.ariaLabel} group={group} pathname={pathname} />
					))}
					<Menubar.Menu>
						<Menubar.Trigger className="app-nav-crack__menu-trigger">View</Menubar.Trigger>
						<Menubar.Portal>
							<Menubar.Content className="app-nav-crack__dropdown" align="start" sideOffset={2} alignOffset={-2}>
								<Menubar.RadioGroup
									value={mounted ? currentTheme : 'system'}
									onValueChange={(value) => setTheme(value as ThemeValue)}
								>
									<Menubar.RadioItem className="app-nav-crack__dropdown-item app-nav-crack__radio-item" value="light">
										<Menubar.ItemIndicator className="app-nav-crack__radio-dot">●</Menubar.ItemIndicator>
										Light theme
									</Menubar.RadioItem>
									<Menubar.RadioItem className="app-nav-crack__dropdown-item app-nav-crack__radio-item" value="dark">
										<Menubar.ItemIndicator className="app-nav-crack__radio-dot">●</Menubar.ItemIndicator>
										Dark theme
									</Menubar.RadioItem>
									<Menubar.RadioItem className="app-nav-crack__dropdown-item app-nav-crack__radio-item" value="system">
										<Menubar.ItemIndicator className="app-nav-crack__radio-dot">●</Menubar.ItemIndicator>
										System theme
									</Menubar.RadioItem>
								</Menubar.RadioGroup>
							</Menubar.Content>
						</Menubar.Portal>
					</Menubar.Menu>
				</Menubar.Root>
			</div>
		</nav>
	)
}
