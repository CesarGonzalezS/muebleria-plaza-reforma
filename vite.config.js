import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // Vue DevTools solo en desarrollo
    process.env.NODE_ENV === 'development' && vueDevTools(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    // Minificación más agresiva
    minify: 'esbuild',
    target: 'es2015',

    // Opciones avanzadas de esbuild para ofuscación
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      mangle: true,
      output: {
        comments: false,
      },
    },

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

    // Reportar archivo minificado
    reportCompressedSize: false,
  },
  // Optimizaciones para server de desarrollo
  server: {
    port: 5173,
    open: false,
    host: true,
    // No mostrar la versión de Vite en los headers
    middlewareMode: false,
    // Proxy evita que el navegador trate las peticiones como cross-origin
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
