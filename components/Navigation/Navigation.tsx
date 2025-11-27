'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import styles from './Navigation.module.scss'

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
		<div className={styles.navigation}>
			<button
				className={styles.menuToggle}
				onClick={toggleMenu}
				type="button"
				aria-label="Toggle menu"
				aria-expanded={isMenuOpen}
			>
				<span className={styles.menuIcon}>
					<span className={isMenuOpen ? styles.open : ''}></span>
					<span className={isMenuOpen ? styles.open : ''}></span>
					<span className={isMenuOpen ? styles.open : ''}></span>
				</span>
			</button>
			<nav className={`${styles.navMenu} ${isMenuOpen ? styles.open : ''}`}>
				<Link href="/" className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`} onClick={closeMenu}>
					Home
				</Link>
				<Link
					href="/privacy"
					className={`${styles.navLink} ${pathname === '/privacy/' ? styles.active : ''}`}
					onClick={closeMenu}
				>
					Privacy Policy
				</Link>
				<Link
					href="/terms"
					className={`${styles.navLink} ${pathname === '/terms/' ? styles.active : ''}`}
					onClick={closeMenu}
				>
					Terms of Service
				</Link>
				<Link
					href="/feedback"
					className={`${styles.navLink} ${pathname === '/feedback/' ? styles.active : ''}`}
					onClick={closeMenu}
				>
					Feedback
				</Link>
			</nav>
		</div>
	)
}
