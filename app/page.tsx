import HomePage from '@/components/home/HomePage'
import { getHomeAppCards } from '@/lib/home-apps'

export default function Home() {
	return <HomePage apps={getHomeAppCards()} />
}
