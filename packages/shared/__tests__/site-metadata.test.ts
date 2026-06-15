import { describe, expect, it } from 'vitest'
import { buildRootMetadata } from '@/lib/site-metadata'

describe('buildRootMetadata', () => {
	it('includes Safari Smart App Banner meta on single-app sites', () => {
		const prevMode = process.env.NEXT_PUBLIC_SITE_MODE
		const prevSlug = process.env.NEXT_PUBLIC_SINGLE_APP_SLUG
		process.env.NEXT_PUBLIC_SITE_MODE = 'single-app'
		process.env.NEXT_PUBLIC_SINGLE_APP_SLUG = 'rawclinic'
		process.env.NEXT_PUBLIC_SITE_URL = 'https://www.rawclinic.click'

		try {
			const metadata = buildRootMetadata()
			expect(metadata.other?.['apple-itunes-app']).toBe('app-id=6755300857, app-argument=https://www.rawclinic.click/')
		} finally {
			if (prevMode === undefined) delete process.env.NEXT_PUBLIC_SITE_MODE
			else process.env.NEXT_PUBLIC_SITE_MODE = prevMode
			if (prevSlug === undefined) delete process.env.NEXT_PUBLIC_SINGLE_APP_SLUG
			else process.env.NEXT_PUBLIC_SINGLE_APP_SLUG = prevSlug
			delete process.env.NEXT_PUBLIC_SITE_URL
		}
	})
})
