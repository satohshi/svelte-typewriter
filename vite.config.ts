import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import packageJson from './package.json' with { type: 'json' }

export default defineConfig({
	define: {
		__VERSION__: JSON.stringify(packageJson.version),
	},
	plugins: [tailwindcss(), sveltekit()],
})
