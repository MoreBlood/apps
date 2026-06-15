'use client'

import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { type FinderListItem, getFinderPathTitle, listFinderPath } from '@/config/landing-crack-finder'
import { getMacClassic9FinderIconId } from '@/config/landing-mac-classic-icons'
import type { LandingCrackSkin } from '@/lib/landing-crack-skin'
import CrackWindowFrame from './CrackWindowFrame'
import { useLandingCrackFinder } from './LandingCrackFinderContext'
import MacClassic9Icon from './MacClassic9Icon'

type Props = {
	appSlug: string
	skin: LandingCrackSkin
}

function itemKey(item: FinderListItem): string {
	return `${item.kind}-${item.path}-${item.kind === 'image' ? `${item.pairId}-${item.variant}` : item.kind === 'text' ? item.docId : item.name}`
}

export default function LandingCrackFinder({ appSlug, skin }: Props) {
	const finder = useLandingCrackFinder()
	const isMac = skin === 'mac'
	const items = listFinderPath(finder.path, appSlug)
	const title = isMac ? getFinderPathTitle(finder.path) : `Finder — ${getFinderPathTitle(finder.path)}`
	const [selectedKey, setSelectedKey] = useState<string | null>(null)

	useEffect(() => {
		setSelectedKey(null)
	}, [finder.path])

	const openItem = (item: FinderListItem) => {
		if (item.kind === 'parent' || item.kind === 'folder') {
			finder.navigate(item.path)
			return
		}
		if (item.kind === 'text') {
			finder.openReader(item.docId)
			return
		}
		finder.openPhoto(item.pairId, item.variant)
	}

	return (
		<CrackWindowFrame windowId="finder" skin={skin} title={title} className="landing-crack-finder-wrap">
			<div className={clsx('landing-crack-finder', isMac && 'landing-crack-finder--mac')}>
				<nav className="landing-crack-finder__toolbar" aria-label="Finder navigation">
					<button
						type="button"
						className="landing-crack-finder__tool"
						disabled={finder.path === '/'}
						onClick={() => {
							const parent = items.find((i) => i.kind === 'parent')
							if (parent?.kind === 'parent') finder.navigate(parent.path)
						}}
					>
						{isMac ? '◀ Back' : '◀'}
					</button>
					<span className="landing-crack-finder__path" aria-live="polite">
						{finder.path}
					</span>
				</nav>
				<ul className="landing-crack-finder__list" aria-label="Folder contents">
					{items.map((item) => {
						const key = itemKey(item)
						const selected = selectedKey === key

						return (
							<li key={key}>
								<button
									type="button"
									className={clsx(
										'landing-crack-finder__row',
										item.kind === 'folder' && 'landing-crack-finder__row--folder',
										item.kind === 'image' && 'landing-crack-finder__row--image',
										item.kind === 'text' && 'landing-crack-finder__row--text',
										selected && 'landing-crack-finder__row--selected'
									)}
									aria-pressed={selected}
									onClick={() => setSelectedKey(key)}
									onDoubleClick={() => openItem(item)}
								>
									{isMac ? (
										<MacClassic9Icon
											className="landing-crack-finder__icon landing-crack-finder__icon--raster"
											id={getMacClassic9FinderIconId(
												item.kind === 'image'
													? 'jpg'
													: item.kind === 'text'
														? 'txt'
														: item.kind === 'folder'
															? 'folder'
															: 'parent'
											)}
											size={16}
											alt=""
										/>
									) : (
										<span
											className={clsx(
												'landing-crack-finder__icon',
												`landing-crack-finder__icon--${
													item.kind === 'image'
														? 'jpg'
														: item.kind === 'text'
															? 'txt'
															: item.kind === 'folder'
																? 'folder'
																: 'parent'
												}`
											)}
											aria-hidden
										/>
									)}
									<span className="landing-crack-finder__name">{item.name}</span>
									{item.kind === 'image' && (
										<span className="landing-crack-finder__meta">
											{item.variant === 'before' ? 'Embedded' : 'RAW Clinic'}
										</span>
									)}
								</button>
							</li>
						)
					})}
				</ul>
				{finder.path === '/Fuji_LUTs' && (
					<p className="landing-crack-finder__hint">Film looks live in the app — this folder is decorative.</p>
				)}
			</div>
		</CrackWindowFrame>
	)
}
