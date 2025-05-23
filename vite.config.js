import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base for gh-pages
export default defineConfig({
  // base: '/Mapbox_geojson/',
  base: '/',
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    host: true, // needed for the Docker Container port mapping to work
    strictPort: true,
    port: 5173, // you can replace this port with any port
  }
  
})
