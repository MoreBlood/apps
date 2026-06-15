import type { FinderImageVariant } from '@/config/landing-crack-finder'
import { computePreviewLayout } from '@/lib/landing-crack-preview-size'
import {
	centerPanelPosition,
	FLOATING_WINDOW_DEFAULT_SIZE,
	type SavedWindowGeometry
} from '@/lib/landing-crack-window-geometry'
import type { CrackWindowId } from '@/lib/landing-crack-window-manager'

type StoredWindowGeometry = SavedWindowGeometry & { customized: boolean }

/** Finder opens on the photo roll folder. */
export const INITIAL_FINDER_PATH = '/Before_After'

export const INITIAL_PREVIEW_PAIR_ID = 'koleso'
export const INITIAL_PREVIEW_VARIANT: FinderImageVariant = 'before'

export const INITIAL_READER_DOC_ID = 'readme'

const PREVIEW_NATURAL = { width: 1200, height: 1600 }

const STAGGER_PX = 34

function staggeredGeometry(
	id: CrackWindowId,
	size: { width: number; height: number },
	slot: number
): StoredWindowGeometry {
	const centered = centerPanelPosition(size.width, size.height, null)
	const offset = slot * STAGGER_PX
	return {
		position: { x: centered.x + offset, y: centered.y + offset * 0.65 },
		size,
		customized: false
	}
}

/** Default positions for aux windows on first load (not user-customized). */
export function createInitialFloatingGeometry(): Partial<Record<CrackWindowId, StoredWindowGeometry>> {
	const previewLayout = computePreviewLayout(PREVIEW_NATURAL.width, PREVIEW_NATURAL.height)

	return {
		finder: staggeredGeometry('finder', FLOATING_WINDOW_DEFAULT_SIZE.finder!, -1),
		reader: staggeredGeometry('reader', FLOATING_WINDOW_DEFAULT_SIZE.reader!, 0),
		preview: staggeredGeometry('preview', previewLayout.window, 1)
	}
}

/** Bottom → top; installer (main) stays on top by default. */
export const INITIAL_WINDOW_STACK: CrackWindowId[] = ['audio', 'reader', 'finder', 'preview', 'main']
