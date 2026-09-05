import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages project site: assets are served from /<repo-name>/, so the
  // base must match the repository name (keep in sync if the repo is renamed).
  base: '/cache-vs-hatch/',
  plugins: [react(), tailwindcss()],
})

