<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup>
// Registrar Service Worker para PWA (opcional)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Service worker no disponible
    });
  });
}
</script>

<style>
/* CSS Reset optimizado */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body, #app {
  margin: 0 !important;
  padding: 0 !important;
  width: 100vw !important;
  min-height: 100vh !important;
  max-width: none !important;
  background: #fff !important;
  display: block !important;
  overflow-x: hidden;
}

/* Optimización de rendering con CSS containment */
#app {
  contain: layout style paint;
}

/* Mejorar performance de animaciones */
.before-enter {
  opacity: 0;
  transform: translateX(60px);
  transition: opacity 0.7s cubic-bezier(.4,0,.2,1), transform 0.7s cubic-bezier(.4,0,.2,1);
  will-change: opacity, transform;
}

.enter {
  opacity: 1;
  transform: translateX(0);
}

/* Transiciones de ruta optimizadas */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Optimización para imágenes */
img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Reducir motion para usuarios con preferencia */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
</style>
