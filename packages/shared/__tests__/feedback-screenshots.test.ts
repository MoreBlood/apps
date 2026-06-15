import { describe, expect, it } from 'vitest'
import { formatFeedbackFileSize } from '@/lib/feedback/screenshots'

describe('formatFeedbackFileSize', () => {
	it('formats bytes, kilobytes, and megabytes', () => {
		expect(formatFeedbackFileSize(512)).toBe('512 B')
		expect(formatFeedbackFileSize(2048)).toBe('2 KB')
		expect(formatFeedbackFileSize(1536)).toBe('1.5 KB')
		expect(formatFeedbackFileSize(2.5 * 1024 * 1024)).toBe('2.5 MB')
	})
})
