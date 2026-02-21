import NextLink from 'next/link'
import { Box, Container, Flex, Link, Text } from '@radix-ui/themes'
import { siteName } from '@/config'

export default function AppFooter() {
	const year = new Date().getFullYear()
	return (
		<Box mt="8" pt="6" style={{ borderTop: '1px solid var(--gray-a6)' }}>
			<footer>
				<Container size="2">
					<Flex gap="4" wrap="wrap" align="center" justify="between">
						<Text size="2" color="gray">
							© {year} {siteName}
						</Text>
						<Link asChild size="2">
							<NextLink href="/">{siteName}</NextLink>
						</Link>
					</Flex>
				</Container>
			</footer>
		</Box>
	)
}
