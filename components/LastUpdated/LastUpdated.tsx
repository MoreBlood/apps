import { type ReactNode } from 'react'
import styles from './LastUpdated.module.scss'

interface LastUpdatedProps {
	children: ReactNode
}

export default function LastUpdated({ children }: LastUpdatedProps) {
	return <div className={styles.lastUpdated}>{children}</div>
}

