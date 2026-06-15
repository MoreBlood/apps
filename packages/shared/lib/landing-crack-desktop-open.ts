import type { CrackDesktopIcon } from '@/config/landing-crack-desktop'

export type OpenDesktopIconActions = {
	openFinder: (path: string) => void
	openReader: (docId: string) => void
	openInstaller: () => void
}

/** Double-click / Open — opens Finder, TextEdit, or installer without mutating installer panel state. */
export function openDesktopIcon(slug: string, icon: CrackDesktopIcon, actions: OpenDesktopIconActions): void {
	if (icon.id === 'app') {
		actions.openInstaller()
		return
	}

	const action = icon.action
	if (action?.type === 'finder') {
		actions.openFinder(action.path)
		return
	}
	if (action?.type === 'reader') {
		actions.openReader(action.docId)
		return
	}

	actions.openReader(`desktop:${icon.id}`)
}
