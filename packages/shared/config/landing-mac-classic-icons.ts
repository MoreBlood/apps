import type { CrackDesktopIconKind } from '@/config/landing-crack-desktop'

/** Mac OS 9 icon pack (NazoraioiSkadinaujo / bearz314 MacOS9-icons), 1–92 (63 missing). */
export type MacClassic9IconId = number

export const MAC_CLASSIC9_ICON_BASE = '/landing/mac-classic-9'

/** Default desktop glyph per Win9x-style `kind` on Mac skin. */
export const MAC_CLASSIC9_KIND_ICON: Record<Exclude<CrackDesktopIconKind, 'app'>, MacClassic9IconId> = {
	folder: 24,
	exe: 21,
	txt: 79,
	bat: 28,
	cfg: 14,
	dll: 23,
	lnk: 40,
	sys: 1,
	url: 69
}

/** Per desktop icon id overrides (Macintosh HD, keys, etc.). */
export const MAC_CLASSIC9_DESKTOP_ICON_BY_ID: Record<string, MacClassic9IconId> = {
	'finder-hd': 4,
	'on-device': 47
}

/** Finder list row icons. */
export const MAC_CLASSIC9_FINDER_ICON = {
	folder: 24,
	parent: 24,
	txt: 79,
	jpg: 77
} as const

/** Dock / shell chrome. */
export const MAC_CLASSIC9_SHELL_ICON = {
	finder: 64
} as const

export function macClassic9IconSrc(id: MacClassic9IconId): string {
	return `${MAC_CLASSIC9_ICON_BASE}/${id}.png`
}

export function getMacClassic9DesktopIconId(
	kind: CrackDesktopIconKind,
	desktopIconId: string
): MacClassic9IconId | null {
	if (kind === 'app') return null
	const byId = MAC_CLASSIC9_DESKTOP_ICON_BY_ID[desktopIconId]
	if (byId != null) return byId
	return MAC_CLASSIC9_KIND_ICON[kind]
}

export function getMacClassic9FinderIconId(kind: 'folder' | 'parent' | 'txt' | 'jpg'): MacClassic9IconId {
	return MAC_CLASSIC9_FINDER_ICON[kind]
}
