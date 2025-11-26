'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Navigation() {
	const pathname = usePathname()
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}

	const closeMenu = () => {
		setIsMenuOpen(false)
	}

	return (
		<div className="navigation">
			<button
				className="menu-toggle"
				onClick={toggleMenu}
				type="button"
				aria-label="Toggle menu"
				aria-expanded={isMenuOpen}
			>
				<span className="menu-icon">
					<span className={isMenuOpen ? 'open' : ''}></span>
					<span className={isMenuOpen ? 'open' : ''}></span>
					<span className={isMenuOpen ? 'open' : ''}></span>
				</span>
			</button>
			<nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
				<Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`} onClick={closeMenu}>
					Home
				</Link>
				<Link
					href="/privacy"
					className={`nav-link ${pathname === '/privacy' ? 'active' : ''}`}
					onClick={closeMenu}
				>
					Privacy Policy
				</Link>
				<Link href="/terms" className={`nav-link ${pathname === '/terms' ? 'active' : ''}`} onClick={closeMenu}>
					Terms of Service
				</Link>
			</nav>
		</div>
	)
}

