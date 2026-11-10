import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-heroui': ['@heroui/react'],
          'vendor-icons': ['lucide-react'],
          'vendor-pocketbase': ['pocketbase', 'swr']
        }
      }
    }
  }
});
