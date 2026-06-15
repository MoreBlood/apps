'use client'

import clsx from 'clsx'
import type { CrackContextMenuItem } from '@/config/landing-crack-context-menu'
import type { LandingCrackSkin } from '@/lib/landing-crack-skin'

type Props = {
	skin: LandingCrackSkin
	x: number
	y: number
	items: CrackContextMenuItem[]
	menuRef: React.RefObject<HTMLDivElement | null>
	onClose: () => void
}

export default function CrackContextMenu({ skin, x, y, items, menuRef, onClose }: Props) {
	return (
		<div
			ref={menuRef}
			className={clsx('landing-crack-context-menu', skin === 'mac' && 'landing-crack-context-menu--mac')}
			style={{ left: x, top: y }}
			role="menu"
			aria-label={skin === 'mac' ? 'Contextual menu' : 'Context menu'}
			onContextMenu={(e) => e.preventDefault()}
		>
			{items.map((entry) => {
				if (entry.type === 'separator') {
					return <hr key={entry.id} className="landing-crack-context-menu__sep" />
				}

				return (
					<button
						key={entry.id}
						type="button"
						role="menuitem"
						className="landing-crack-context-menu__item"
						disabled={entry.disabled}
						onClick={() => {
							if (entry.disabled) return
							entry.onSelect()
							onClose()
						}}
					>
						{entry.label}
					</button>
				)
			})}
		</div>
	)
}
