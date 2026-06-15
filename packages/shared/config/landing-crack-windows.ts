import type { CrackWindowId } from '@/lib/landing-crack-window-manager'

export type CrackWindowFrameVariant = 'document' | 'audio-mac' | 'audio-bar'

export type CrackDockIcon = 'app' | 'quicktime' | 'finder'

export type CrackWindowDef = {
	id: CrackWindowId
	frameVariant: CrackWindowFrameVariant
	/** Win taskbar label (audio: RAD TRACKER) */
	shellLabel: string
	/** Mac dock / taskbar when different from shellLabel */
	macShellLabel?: string
	dockIcon?: CrackDockIcon
	supportsMinimize: boolean
	supportsMaximize: boolean
	supportsResize: boolean
	supportsClose: boolean
}

export const CRACK_WINDOW_REGISTRY: Record<CrackWindowId, CrackWindowDef> = {
	main: {
		id: 'main',
		frameVariant: 'document',
		shellLabel: 'Setup',
		dockIcon: 'app',
		supportsMinimize: true,
		supportsMaximize: true,
		supportsResize: true,
		supportsClose: true
	},
	audio: {
		id: 'audio',
		frameVariant: 'audio-mac',
		shellLabel: '♫ RAD TRACKER',
		macShellLabel: 'QuickTime Player',
		dockIcon: 'quicktime',
		supportsMinimize: true,
		supportsMaximize: false,
		supportsResize: false,
		supportsClose: false
	},
	finder: {
		id: 'finder',
		frameVariant: 'document',
		shellLabel: 'Finder',
		macShellLabel: 'Finder',
		dockIcon: 'finder',
		supportsMinimize: true,
		supportsMaximize: true,
		supportsResize: true,
		supportsClose: true
	},
	preview: {
		id: 'preview',
		frameVariant: 'document',
		shellLabel: 'Preview',
		macShellLabel: 'Preview',
		supportsMinimize: true,
		supportsMaximize: false,
		supportsResize: true,
		supportsClose: true
	},
	reader: {
		id: 'reader',
		frameVariant: 'document',
		shellLabel: 'Notepad',
		macShellLabel: 'TextEdit',
		supportsMinimize: true,
		supportsMaximize: true,
		supportsResize: true,
		supportsClose: true
	}
}

/** All windows — taskbar / shell restore. */
export const CRACK_WINDOW_ORDER: CrackWindowId[] = ['main', 'audio', 'finder', 'preview', 'reader']

/** Dock icons only (preview opens from Finder, not pinned). */
export const CRACK_DOCK_WINDOW_ORDER: CrackWindowId[] = ['main', 'audio', 'finder']

export function getCrackWindowDef(id: CrackWindowId): CrackWindowDef {
	return CRACK_WINDOW_REGISTRY[id]
}

export function getCrackShellLabel(
	id: CrackWindowId,
	skin: 'win' | 'mac',
	mainTitle?: string,
	appName?: string
): string {
	const def = getCrackWindowDef(id)
	if (id === 'main') {
		if (skin === 'mac') return appName ?? def.shellLabel
		return mainTitle ?? def.shellLabel
	}
	if (id === 'finder') return skin === 'mac' ? (def.macShellLabel ?? def.shellLabel) : def.shellLabel
	if (id === 'preview' || id === 'reader') {
		return skin === 'mac' ? (def.macShellLabel ?? def.shellLabel) : def.shellLabel
	}
	return skin === 'mac' ? (def.macShellLabel ?? def.shellLabel) : def.shellLabel
}
