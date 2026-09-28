import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // exposes on 0.0.0.0 so localhost, 127.0.0.1 and network work 100% reliably
    port: 5175,
  },
})
