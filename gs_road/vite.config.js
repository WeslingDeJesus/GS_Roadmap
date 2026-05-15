import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  // Agregamos el base path para que los assets apunten a /comite/assets/
  base: '', 
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 2001,
    strictPort: true,
    allowedHosts: true,
    hmr: {
      clientPort: 443,
    },
  },
  build: {
    // Esto asegura que los archivos se generen de forma óptima para producción
    outDir: 'dist',
    assetsDir: 'assets',
  }
})