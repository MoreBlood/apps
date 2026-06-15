import type { LandingCrackSkin } from '@/lib/landing-crack-skin'
import type { CrackWindowId } from '@/lib/landing-crack-window-manager'

export type CrackContextMenuItem =
	| { type: 'item'; id: string; label: string; disabled?: boolean; onSelect: () => void }
	| { type: 'separator'; id: string }

export type CrackContextMenuDeps = {
	skin: LandingCrackSkin
	appName: string
	openFinder: (path: string) => void
	arrangeDesktopIcons: () => void
	deselectDesktop: () => void
	minimizeAllWindows: () => void
	activateWindow: (id: CrackWindowId) => void
	minimizeWindow: (id: CrackWindowId) => void
	closeWindow: (id: CrackWindowId) => void
	isWindowRunning: (id: CrackWindowId) => boolean
	supportsMinimize: (id: CrackWindowId) => boolean
	supportsClose: (id: CrackWindowId) => boolean
}

export function buildDesktopContextMenu(deps: CrackContextMenuDeps): CrackContextMenuItem[] {
	const { skin, openFinder, arrangeDesktopIcons, deselectDesktop } = deps

	if (skin === 'mac') {
		return [
			{
				type: 'item',
				id: 'new-folder',
				label: 'New Folder',
				onSelect: () => openFinder('/')
			},
			{
				type: 'item',
				id: 'open-finder',
				label: 'Open Finder',
				onSelect: () => openFinder('/')
			},
			{ type: 'separator', id: 'sep-1' },
			{
				type: 'item',
				id: 'clean-up',
				label: 'Clean Up',
				onSelect: arrangeDesktopIcons
			},
			{
				type: 'item',
				id: 'show-desktop',
				label: 'Hide All Windows',
				onSelect: () => {
					deselectDesktop()
					deps.minimizeAllWindows()
				}
			},
			{ type: 'separator', id: 'sep-2' },
			{
				type: 'item',
				id: 'get-info',
				label: 'Get Info',
				disabled: true,
				onSelect: () => {}
			}
		]
	}

	return [
		{
			type: 'item',
			id: 'arrange',
			label: 'Arrange Icons',
			onSelect: arrangeDesktopIcons
		},
		{
			type: 'item',
			id: 'refresh',
			label: 'Refresh',
			onSelect: arrangeDesktopIcons
		},
		{ type: 'separator', id: 'sep-1' },
		{
			type: 'item',
			id: 'new-folder',
			label: 'New → Folder',
			onSelect: () => openFinder('/')
		},
		{
			type: 'item',
			id: 'paste',
			label: 'Paste',
			disabled: true,
			onSelect: () => {}
		},
		{ type: 'separator', id: 'sep-2' },
		{
			type: 'item',
			id: 'properties',
			label: 'Properties',
			disabled: true,
			onSelect: () => {}
		}
	]
}

export function buildDockContextMenu(windowId: CrackWindowId, deps: CrackContextMenuDeps): CrackContextMenuItem[] {
	const {
		skin,
		appName,
		activateWindow,
		minimizeWindow,
		closeWindow,
		isWindowRunning,
		supportsMinimize,
		supportsClose
	} = deps
	const running = isWindowRunning(windowId)
	const isMac = skin === 'mac'
	const items: CrackContextMenuItem[] = []

	if (!running) {
		items.push({
			type: 'item',
			id: 'open',
			label: isMac ? 'Open' : 'Open',
			onSelect: () => activateWindow(windowId)
		})
	} else {
		items.push({
			type: 'item',
			id: 'show',
			label: isMac ? 'Show' : 'Restore',
			onSelect: () => activateWindow(windowId)
		})
		if (supportsMinimize(windowId)) {
			items.push({
				type: 'item',
				id: 'hide',
				label: isMac ? 'Hide' : 'Minimize',
				onSelect: () => minimizeWindow(windowId)
			})
		}
	}

	if (windowId === 'finder') {
		items.push({
			type: 'item',
			id: 'show-finder',
			label: isMac ? 'Show in Finder' : 'Open Folder',
			onSelect: () => deps.openFinder('/')
		})
	}

	if (supportsClose(windowId)) {
		if (items.length > 0) items.push({ type: 'separator', id: 'sep-close' })
		const quitLabel =
			windowId === 'main' ? (isMac ? `Quit ${appName}` : `Close ${appName} Setup`) : isMac ? 'Quit' : 'Close'
		items.push({
			type: 'item',
			id: 'quit',
			label: quitLabel,
			onSelect: () => closeWindow(windowId)
		})
	}

	if (isMac) {
		items.push({ type: 'separator', id: 'sep-dock' })
		items.push({
			type: 'item',
			id: 'keep-in-dock',
			label: 'Keep in Dock',
			disabled: true,
			onSelect: () => {}
		})
	}

	return items
}
