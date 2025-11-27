import { type ReactNode } from 'react'
import styles from './Content.module.scss'

interface ContentProps {
	children: ReactNode
}

export default function Content({ children }: ContentProps) {
	return <div className={styles.content}>{children}</div>
}

