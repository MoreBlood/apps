import { Box, Container, Flex, Heading, Text } from '@radix-ui/themes'
import AppContactCta from '@/components/AppContactCta'
import FAQAccordionItem from '@/components/faq/FAQAccordionItem'
import { getFAQSectionIcon } from '@/components/faq/faq-icons'
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
		<Container size="2">
			<Heading size="8" mb="2" as="h1">
				FAQ
			</Heading>
			<Heading size="5" mb="2" as="h2">
				{app.appName}
			</Heading>
			{faq.intro && (
				<Text as="p" size="3" color="gray" mb="6">
					{faq.intro}
				</Text>
			)}

			{faq.sections.map((section) => (
				<FAQSectionBlock key={section.id} section={section} />
			))}

			<AppContactCta appSlug={appSlug} contactEmail={app.contactEmail} />
		</Container>
	)
}
