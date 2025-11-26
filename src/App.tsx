import { Route, Routes } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'

function App() {
	return (
		<Routes>
			<Route
				path="/"
				element={
					<>
						<Navigation />
						<Home />
					</>
				}
			/>
			<Route
				path="/privacy"
				element={
					<>
						<Navigation />
						<Privacy />
					</>
				}
			/>
			<Route
				path="/terms"
				element={
					<>
						<Navigation />
						<Terms />
					</>
				}
			/>
		</Routes>
	)
}

export default App
