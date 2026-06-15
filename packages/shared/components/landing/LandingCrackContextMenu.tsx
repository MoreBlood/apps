'use client'

import {
	createContext,
	type MouseEvent,
	type ReactNode,
	useCallback,
	useContext,
	useMemo,
	useRef,
	useState
} from 'react'
import type { LandingAppInfo } from '@/config'
import {
	buildDesktopContextMenu,
	buildDockContextMenu,
	type CrackContextMenuDeps
} from '@/config/landing-crack-context-menu'
import { getCrackWindowDef } from '@/config/landing-crack-windows'
import type { LandingCrackSkin } from '@/lib/landing-crack-skin'
import type { CrackWindowId } from '@/lib/landing-crack-window-manager'
import CrackContextMenu from './CrackContextMenu'
import { useLandingCrackFinder } from './LandingCrackFinderContext'
import { useLandingCrackShell } from './LandingCrackShellContext'
import { useCrackContextMenu } from './useCrackContextMenu'

type ContextValue = {
	openDesktopMenu: (e: MouseEvent) => void
	openDockMenu: (e: MouseEvent, windowId: CrackWindowId) => void
	desktopLayoutKey: number
}

const LandingCrackContextMenuContext = createContext<ContextValue | null>(null)

type ProviderProps = {
	app: LandingAppInfo
	skin: LandingCrackSkin
	onDeselectDesktop: () => void
	children: ReactNode | ((ctx: ContextValue) => ReactNode)
}

export function LandingCrackContextMenuProvider({ app, skin, children, onDeselectDesktop }: ProviderProps) {
	const wm = useLandingCrackShell()
	const finderNav = useLandingCrackFinder()
	const menuRef = useRef<HTMLDivElement>(null)
	const { menu, open, close } = useCrackContextMenu(menuRef)
	const [desktopLayoutGeneration, setDesktopLayoutGeneration] = useState(0)

	const bumpDesktopLayout = useCallback(() => {
		setDesktopLayoutGeneration((n) => n + 1)
	}, [])

	const minimizeAllWindows = useCallback(() => {
		for (const id of ['main', 'audio', 'finder', 'preview', 'reader'] as const) {
			if (!wm.isVisible(id)) continue
			if (wm.getChrome(id) === 'minimized') continue
			if (!getCrackWindowDef(id).supportsMinimize) continue
			wm.setChrome(id, 'minimized')
		}
	}, [wm])

	const menuDeps = useMemo<CrackContextMenuDeps>(
		() => ({
			skin,
			appName: app.appName,
			openFinder: finderNav.openFinder,
			arrangeDesktopIcons: bumpDesktopLayout,
			deselectDesktop: onDeselectDesktop,
			minimizeAllWindows,
			activateWindow: (id) => wm.activate(id),
			minimizeWindow: (id) => wm.setChrome(id, 'minimized'),
			closeWindow: (id) => {
				if (id === 'preview') {
					finderNav.closePhoto()
					return
				}
				if (id === 'reader') {
					finderNav.closeReader()
					return
				}
				wm.setChrome(id, 'closed')
			},
			isWindowRunning: (id) => wm.isRunning(id),
			supportsMinimize: (id) => getCrackWindowDef(id).supportsMinimize,
			supportsClose: (id) => getCrackWindowDef(id).supportsClose
		}),
		[app.appName, bumpDesktopLayout, finderNav, minimizeAllWindows, onDeselectDesktop, skin, wm]
	)

	const openDesktopMenu = useCallback(
		(e: React.MouseEvent) => {
			open(e, buildDesktopContextMenu(menuDeps))
		},
		[menuDeps, open]
	)

	const openDockMenu = useCallback(
		(e: React.MouseEvent, windowId: CrackWindowId) => {
			open(e, buildDockContextMenu(windowId, menuDeps))
		},
		[menuDeps, open]
	)

	const value = useMemo(
		() => ({ openDesktopMenu, openDockMenu, desktopLayoutKey: desktopLayoutGeneration }),
		[desktopLayoutGeneration, openDesktopMenu, openDockMenu]
	)

	return (
		<LandingCrackContextMenuContext.Provider value={value}>
			{typeof children === 'function' ? children(value) : children}
			{menu && (
				<CrackContextMenu skin={skin} x={menu.x} y={menu.y} items={menu.items} menuRef={menuRef} onClose={close} />
			)}
		</LandingCrackContextMenuContext.Provider>
	)
}

export function useLandingCrackContextMenu(): ContextValue {
	const ctx = useContext(LandingCrackContextMenuContext)
	if (!ctx) {
		throw new Error('useLandingCrackContextMenu must be used within LandingCrackContextMenuProvider')
	}
	return ctx
}
