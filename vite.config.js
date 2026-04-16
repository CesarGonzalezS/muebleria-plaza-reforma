import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    // Usar esbuild en lugar de terser (más rápido y sin problemas de permisos en Windows)
    minify: 'esbuild',
    // Configuración de esbuild para optimización
    target: 'es2015',
    // Code splitting óptimo
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendor chunks grandes
          'vendor-vue': ['vue', 'vue-router'],
        },
        // Nombres de chunks con hash para cache busting
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(png|jpe?g|svg|gif|webp|avif)$/i.test(assetInfo.name)) {
            return `img/[name]-[hash].${ext}`;
          }
          if (/\.css$/i.test(assetInfo.name)) {
            return `css/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        },
      },
    },
    // Optimizar tamaño de chunks
    chunkSizeWarningLimit: 600,
    // Deshabilitar source maps en producción
    sourcemap: false,
  },
  // Optimizaciones para server de desarrollo
  server: {
    port: 5173,
    open: false,
    host: true,
    // Proxy evita que el navegador trate las peticiones como cross-origin
    // (resuelve el bloqueo de localStorage por Tracking Prevention de Edge)
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/furniture': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  // Configuración adicional para evitar problemas en Windows
  optimizeDeps: {
    exclude: ['vue-demi']
  },
})
