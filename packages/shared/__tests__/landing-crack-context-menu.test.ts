import { describe, expect, it, vi } from 'vitest'
import { buildDesktopContextMenu, buildDockContextMenu } from '@/config/landing-crack-context-menu'
import { getLandingCrackDesktopIcon } from '@/config/landing-crack-desktop'
import { openDesktopIcon } from '@/lib/landing-crack-desktop-open'

const baseDeps = {
	skin: 'mac' as const,
	appName: 'RAW Clinic',
	openFinder: vi.fn(),
	arrangeDesktopIcons: vi.fn(),
	deselectDesktop: vi.fn(),
	minimizeAllWindows: vi.fn(),
	activateWindow: vi.fn(),
	minimizeWindow: vi.fn(),
	closeWindow: vi.fn(),
	isWindowRunning: () => true,
	supportsMinimize: () => true,
	supportsClose: () => true
}

describe('landing-crack-context-menu', () => {
	it('builds mac desktop menu with clean up', () => {
		const items = buildDesktopContextMenu(baseDeps)
		const cleanUp = items.find((i) => i.type === 'item' && i.id === 'clean-up')
		expect(cleanUp?.type).toBe('item')
		if (cleanUp?.type === 'item') cleanUp.onSelect()
		expect(baseDeps.arrangeDesktopIcons).toHaveBeenCalled()
	})

	it('opens desktop icons via reader or finder without installer hook', () => {
		const openFinder = vi.fn()
		const openReader = vi.fn()
		const openInstaller = vi.fn()
		const folder = getLandingCrackDesktopIcon('rawclinic', 'before-after')
		expect(folder).toBeTruthy()
		if (!folder) return
		openDesktopIcon('rawclinic', folder, { openFinder, openReader, openInstaller })
		expect(openFinder).toHaveBeenCalledWith('/Before_After')
		expect(openInstaller).not.toHaveBeenCalled()

		const exe = getLandingCrackDesktopIcon('rawclinic', 'deep-fusion')
		if (!exe) return
		openDesktopIcon('rawclinic', exe, { openFinder, openReader, openInstaller })
		expect(openReader).toHaveBeenCalledWith('desktop:deep-fusion')
	})

	it('builds dock menu with quit for main', () => {
		const items = buildDockContextMenu('main', baseDeps)
		const quit = items.find((i) => i.type === 'item' && i.id === 'quit')
		expect(quit?.type).toBe('item')
		if (quit?.type === 'item') expect(quit.label).toContain('RAW Clinic')
	})
})
