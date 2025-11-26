import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
const getBasePath = () => {
	if (process.env.BASE_PATH) {
		return process.env.BASE_PATH
	}

	if (process.env.GITHUB_REPOSITORY) {
		const repoName = process.env.GITHUB_REPOSITORY.split('/')[1]
		// Для username.github.io используем '/', иначе '/repo-name/'
		return repoName.endsWith('.github.io') ? '/' : `/${repoName}/`
	}

	return '/'
}

export default defineConfig({
	plugins: [react()],
	base: getBasePath(),
	build: {
		outDir: 'dist'
	}
})
