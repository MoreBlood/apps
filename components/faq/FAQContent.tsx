import { Box, Container, Flex, Heading } from '@radix-ui/themes'
import AppContactCta from '@/components/AppContactCta'
import FAQAccordionItem from '@/components/faq/FAQAccordionItem'
import { getFAQSectionIcon } from '@/components/faq/faq-icons'
import SitePageHero from '@/components/shared/SitePageHero'
import type { AppConfig } from '@/config'
import { getFAQBySlug } from '@/config/faq-content'
import type { FAQSection } from '@/types/faq'

export type FAQContentProps = { app: AppConfig; appSlug: string }

function FAQSectionBlock({ section }: { section: FAQSection }) {
	const SectionIcon = getFAQSectionIcon(section.id)

	return (
		<Box asChild mb="6">
			<section aria-labelledby={`faq-${section.id}`}>
				<Heading size="5" mb="3" as="h2" id={`faq-${section.id}`}>
					<Flex align="center" gap="2" className="faq-section__heading">
						<span className={`faq-section__icon faq-section__icon--${section.id}`} aria-hidden>
							<SectionIcon />
						</span>
						{section.title}
					</Flex>
				</Heading>
				<div className="faq-list">
					{section.items.map((item) => (
						<FAQAccordionItem key={item.id} item={item} />
					))}
				</div>
			</section>
		</Box>
	)
}

export default function FAQContent({ app, appSlug }: FAQContentProps) {
	const faq = getFAQBySlug(appSlug)
	if (!faq) return null

	return (
		<Container size="2" className="site-prose">
			<SitePageHero className="site-page-hero--section" eyebrow={app.appName} title="FAQ" lead={faq.intro} />

			{faq.sections.map((section) => (
				<FAQSectionBlock key={section.id} section={section} />
			))}

			<AppContactCta appSlug={appSlug} contactEmail={app.contactEmail} />
		</Container>
	)
}
