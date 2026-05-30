export type ComparePair = {
	id: string
	/** Embedded / Apple preview (left). */
	embeddedSrc: string
	/** RAW Clinic export (right). */
	rawClinicSrc: string
	alt: string
}

/** Pairs in `public/compare/` — `*-orig.*` vs graded export. */
export const rawClinicComparePairs: ComparePair[] = [
	{
		id: 'koleso',
		embeddedSrc: '/compare/koleso-orig.png',
		rawClinicSrc: '/compare/koleso.JPG',
		alt: 'Ferris wheel at sunset — ProRAW comparison'
	},
	{
		id: 'cat',
		embeddedSrc: '/compare/cat-orig.png',
		rawClinicSrc: '/compare/cat.JPG',
		alt: 'Cat portrait — ProRAW comparison'
	},
	{
		id: 'dom',
		embeddedSrc: '/compare/dom-orig.png',
		rawClinicSrc: '/compare/dom.JPG',
		alt: 'Cathedral interior — ProRAW comparison'
	}
]

const compareSets: Record<string, ComparePair[]> = {
	rawclinic: rawClinicComparePairs
}

export function getComparePairs(setId: string): ComparePair[] {
	return compareSets[setId] ?? []
}
