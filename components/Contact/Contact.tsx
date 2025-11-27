import { type ReactNode } from 'react'
import styles from './Contact.module.scss'

interface ContactProps {
	children: ReactNode
}

export default function Contact({ children }: ContactProps) {
	return <div className={styles.contact}>{children}</div>
}

