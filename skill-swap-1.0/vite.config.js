import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    optimizeDeps: {
      include: [] // Puedes dejar esto vacío para desactivar optimizaciones
    }
  },
});