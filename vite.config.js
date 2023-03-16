import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  server: { https: true, proxy: {
    "/api": "http://localhost:5000/"
  } },
  plugins: [react(), mkcert()],
  base: '/WebAuthn/',
})

