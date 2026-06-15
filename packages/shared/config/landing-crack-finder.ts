import { type ComparePair, getComparePairs } from '@/config/compare-content'
import { hasFinderDocumentsFolder, listFinderTextFiles } from '@/config/landing-crack-reader'

export type FinderImageVariant = 'before' | 'after'

export type FinderListItem =
	| { kind: 'parent'; name: string; path: string }
	| { kind: 'folder'; name: string; path: string }
	| { kind: 'image'; name: string; path: string; pairId: string; variant: FinderImageVariant }
	| { kind: 'text'; name: string; path: string; docId: string }

const ROOT = '/'

/** Virtual volumes shown at filesystem root (rawclinic honest desktop). */
const RAWCLINIC_ROOT_FOLDERS = [
	{ name: 'Before_After', path: '/Before_After' },
	{ name: 'My_Roll.DNG', path: '/My_Roll.DNG' },
	{ name: 'Fuji_LUTs', path: '/Fuji_LUTs' }
] as const

function pairsForSlug(slug: string): ComparePair[] {
	return getComparePairs(slug === 'rawclinic' ? 'rawclinic' : '')
}

function pairFolderPath(root: string, pairId: string): string {
	return `${root}/${pairId}`
}

function isPhotoRollRoot(path: string): boolean {
	return path === '/Before_After' || path === '/My_Roll.DNG'
}

function resolvePhotoRollRoot(path: string): string | null {
	if (isPhotoRollRoot(path)) return path
	for (const root of ['/Before_After', '/My_Roll.DNG'] as const) {
		if (path.startsWith(`${root}/`)) return root
	}
	return null
}

export function getFinderPathTitle(path: string): string {
	if (path === ROOT) return 'Macintosh HD'
	const roll = resolvePhotoRollRoot(path)
	if (!roll) {
		const name = path.split('/').filter(Boolean).pop()
		return name ?? path
	}
	const parts = path.slice(roll.length).split('/').filter(Boolean)
	if (parts.length === 0) return roll === '/My_Roll.DNG' ? 'My_Roll.DNG' : 'Before_After'
	return parts.join(' / ')
}

export function getComparePairForSlug(slug: string, pairId: string): ComparePair | null {
	return pairsForSlug(slug).find((p) => p.id === pairId) ?? null
}

export function getFinderImageSrc(pair: ComparePair, variant: FinderImageVariant): string {
	return variant === 'before' ? pair.embeddedSrc : pair.rawClinicSrc
}

export function getFinderImageLabel(variant: FinderImageVariant, skin: 'win' | 'mac'): string {
	if (variant === 'before') return skin === 'mac' ? 'embedded_preview.jpg' : 'EMBEDDED_preview.jpg'
	return skin === 'mac' ? 'RAW_Clinic_export.JPG' : 'RAW_Clinic_export.JPG'
}

export function listFinderPath(path: string, slug: string): FinderListItem[] {
	const pairs = pairsForSlug(slug)
	const items: FinderListItem[] = []

	if (path !== ROOT) {
		const parent = parentPath(path)
		if (parent != null) {
			items.push({ kind: 'parent', name: '..', path: parent })
		}
	}

	if (path === ROOT) {
		if (pairs.length === 0) {
			items.push({
				kind: 'folder',
				name: 'Samples',
				path: '/Samples'
			})
			return items
		}
		if (hasFinderDocumentsFolder(slug)) {
			items.push({ kind: 'folder', name: 'Documents', path: '/Documents' })
		}
		for (const folder of RAWCLINIC_ROOT_FOLDERS) {
			items.push({ kind: 'folder', name: folder.name, path: folder.path })
		}
		return items
	}

	if (path === '/Documents') {
		for (const file of listFinderTextFiles(slug, '/Documents')) {
			items.push({
				kind: 'text',
				name: file.name,
				path: `${file.path}/${file.name}`,
				docId: file.docId
			})
		}
		return items
	}

	if (path === '/Fuji_LUTs') {
		for (const file of listFinderTextFiles(slug, '/Fuji_LUTs')) {
			items.push({
				kind: 'text',
				name: file.name,
				path: `${file.path}/${file.name}`,
				docId: file.docId
			})
		}
		return items
	}

	if (path === '/Samples') {
		return items
	}

	const rollRoot = resolvePhotoRollRoot(path)
	if (rollRoot && path === rollRoot) {
		for (const pair of pairs) {
			items.push({
				kind: 'folder',
				name: pair.id,
				path: pairFolderPath(rollRoot, pair.id)
			})
		}
		return items
	}

	if (rollRoot && path.startsWith(`${rollRoot}/`)) {
		const pairId = path.slice(rollRoot.length + 1).split('/')[0]
		const pair = pairs.find((p) => p.id === pairId)
		if (!pair) return items
		items.push({
			kind: 'image',
			name: getFinderImageLabel('before', 'win'),
			path: `${path}/before`,
			pairId,
			variant: 'before'
		})
		items.push({
			kind: 'image',
			name: getFinderImageLabel('after', 'win'),
			path: `${path}/after`,
			pairId,
			variant: 'after'
		})
		return items
	}

	return items
}

function parentPath(path: string): string | null {
	if (path === ROOT || path === '') return null
	const parts = path.split('/').filter(Boolean)
	if (parts.length <= 1) return ROOT
	return `/${parts.slice(0, -1).join('/')}`
}
