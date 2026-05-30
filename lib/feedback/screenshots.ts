import type { FeedbackScreenshot } from '@/types/feedback'

export const FEEDBACK_SCREENSHOT_MAX_COUNT = 3
export const FEEDBACK_SCREENSHOT_MAX_BYTES = 5 * 1024 * 1024
export const FEEDBACK_SCREENSHOT_ACCEPT = 'image/jpeg,image/png,image/webp,image/heic,image/heif'

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'])

function formatUnit(value: number, unit: string): string {
	const rounded = Math.round(value * 10) / 10
	return Number.isInteger(rounded) ? `${rounded} ${unit}` : `${rounded.toFixed(1)} ${unit}`
}

export function formatFeedbackFileSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`
	if (bytes < 1024 * 1024) return formatUnit(bytes / 1024, 'KB')
	return formatUnit(bytes / (1024 * 1024), 'MB')
}

export function validateFeedbackScreenshotFiles(files: File[]): string | null {
	if (files.length > FEEDBACK_SCREENSHOT_MAX_COUNT) {
		return `You can attach up to ${FEEDBACK_SCREENSHOT_MAX_COUNT} screenshots.`
	}

	for (const file of files) {
		if (!ALLOWED_TYPES.has(file.type)) {
			return 'Screenshots must be JPEG, PNG, or WebP.'
		}
		if (file.size > FEEDBACK_SCREENSHOT_MAX_BYTES) {
			return 'Each screenshot must be 5 MB or smaller.'
		}
	}

	return null
}

export async function readFeedbackScreenshots(files: File[]): Promise<FeedbackScreenshot[]> {
	const screenshots: FeedbackScreenshot[] = []

	for (const file of files) {
		const data = await readFileAsBase64(file)
		screenshots.push({ name: file.name, type: file.type, data })
	}

	return screenshots
}

function readFileAsBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => {
			const result = reader.result
			if (typeof result !== 'string') {
				reject(new Error('Could not read screenshot'))
				return
			}
			const comma = result.indexOf(',')
			resolve(comma >= 0 ? result.slice(comma + 1) : result)
		}
		reader.onerror = () => reject(reader.error ?? new Error('Could not read screenshot'))
		reader.readAsDataURL(file)
	})
}

export function feedbackScreenshotsToBlobs(screenshots: FeedbackScreenshot[]): Blob[] {
	return screenshots.map((shot) => {
		const binary = atob(shot.data)
		const bytes = new Uint8Array(binary.length)
		for (let i = 0; i < binary.length; i += 1) {
			bytes[i] = binary.charCodeAt(i)
		}
		return new Blob([bytes], { type: shot.type })
	})
}
