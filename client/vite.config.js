import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    host: '0.0.0.0',     // ← Exposes the dev server on your local network
    port: 5173           // ← You can change this if needed
  }
})