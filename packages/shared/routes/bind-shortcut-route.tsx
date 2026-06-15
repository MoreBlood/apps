import type { Metadata } from 'next'
import type { ReactElement } from 'react'
import { appRouteParams } from '@/lib/app-params'

export type AppRouteProps = { params: Promise<{ appSlug: string }> }

export type AppRouteModule = {
	default: (props: AppRouteProps) => Promise<ReactElement> | ReactElement
	generateMetadata?: (props: AppRouteProps) => Promise<Metadata>
}

export function bindShortcutRoute(module: AppRouteModule) {
	async function generateMetadata() {
		return (await module.generateMetadata?.({ params: appRouteParams() })) ?? {}
	}

	async function Page() {
		const Component = module.default
		return <Component params={appRouteParams()} />
	}

	return { generateMetadata, default: Page }
}
