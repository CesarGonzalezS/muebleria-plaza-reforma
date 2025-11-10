<template>

  <header class="navbar">
    <!-- Barra principal de navegación -->
    <div class="navbar__main">
      <div class="navbar__inner">
        <div class="navbar__brand-wrap">
          <router-link to="/" class="navbar__brand">
            <span class="navbar__logo">
              <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_6_330)">
                  <path clip-rule="evenodd" d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" fill="#860734" fill-rule="evenodd"/>
                </g>
                <defs><clipPath id="clip0_6_330"><rect fill="white" height="48" width="48"></rect></clipPath></defs>
              </svg>
            </span>
            <div class="brand-text">
              <span class="navbar__title">Mueblería Plaza Reforma</span>
              <span class="navbar__subtitle">Calidad y estilo para tu hogar</span>
            </div>
          </router-link>
        </div>

        <nav class="navbar__nav" :class="{ 'nav-open': mobileMenuOpen }">
          <button class="nav-close" @click="mobileMenuOpen = false" aria-label="Cerrar menú">
            <i class="bi bi-x-lg"></i>
          </button>
          <router-link
              v-for="item in nav"
              :key="item.label"
              :to="item.to"
              class="navbar__link"
              :class="{ active: isActive(item) }"
              @click="mobileMenuOpen = false"
          >
            <i v-if="item.icon" :class="item.icon"></i>
            {{ item.label }}
          </router-link>
        </nav>

        <div class="navbar__actions">
          <form @submit.prevent="handleSearch" class="navbar__search">
            <button type="submit" class="search-submit" aria-label="Buscar">
              <i class="bi bi-search"></i>
            </button>
            <input
                type="search"
                id="search-input"
                name="search"
                class="navbar__search-input"
                placeholder="Buscar productos..."
                title="Buscar productos"
                aria-label="Buscar productos"
                v-model="searchQuery"
                @focus="searchFocused = true"
                @blur="searchFocused = false"
            />
            <button
                v-if="searchQuery"
                type="button"
                class="navbar__search-clear"
                @click="clearSearch"
                title="Limpiar búsqueda"
            >
              <i class="bi bi-x-circle-fill"></i>
            </button>
          </form>

          <button class="mobile-menu-toggle" @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Abrir menú">
            <i class="bi bi-list"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Overlay para menú móvil -->
    <Transition name="overlay">
      <div v-if="mobileMenuOpen" class="nav-overlay" @click="mobileMenuOpen = false"></div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const searchQuery = ref('');
const mobileMenuOpen = ref(false);
const searchFocused = ref(false);

// Sincronizar el input con el query param de la URL
watch(() => route.query.buscar, (newSearch) => {
  if (newSearch) {
    searchQuery.value = newSearch;
  } else if (route.name !== 'ProductosList' && route.name !== 'Productos') {
    searchQuery.value = '';
  }
}, { immediate: true });

// Cerrar menú móvil al cambiar de ruta
watch(() => route.path, () => {
  mobileMenuOpen.value = false;
});

const nav = [
  { label: 'Inicio', to: '/', icon: 'bi bi-house-door-fill' },
  { label: 'Sala de estar', to: { name: 'Productos', params: { categoria: 'sala de estar' } }, icon: 'bi bi-flower1' },
  { label: 'Dormitorio', to: { name: 'Productos', params: { categoria: 'dormitorio' } }, icon: 'bi bi-moon-stars-fill' },
  { label: 'Comedor', to: { name: 'Productos', params: { categoria: 'comedor' } }, icon: 'bi bi-cup-hot-fill' },
  { label: 'Oficiona', to: { name: 'Productos', params: { categoria: 'oficina' } }, icon: 'bi bi-briefcase-fill' },
  { label: 'Productos', to: { name: 'ProductosList' }, icon: 'bi bi-grid-3x3-gap-fill' },
  { label: 'Contacto', to: '/contacto', icon: 'bi bi-envelope-fill' },
];

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({
      name: 'ProductosList',
      query: { buscar: searchQuery.value.trim() }
    });
    searchQuery.value = '';
  }
}

function clearSearch() {
  searchQuery.value = '';
  if (route.name === 'ProductosList' || route.name === 'Productos') {
    router.push({ name: 'ProductosList' });
  }
}

function isActive(item) {
  if (!route || !route.path) return false;
  if (typeof item.to === 'string') {
    if (item.to === '/') return route.path === '/';
    return route.path === item.to || route.path.startsWith(item.to + '/');
  }
  if (typeof item.to === 'object' && item.to.name) {
    if (route.name !== item.to.name) return false;
    if (item.to.params && item.to.params.categoria) {
      return String(route.params.categoria || '').toLowerCase() === String(item.to.params.categoria).toLowerCase();
    }
    return true;
  }
  return false;
}
</script>

<style scoped>
/* Variables mejoradas */
:root {
  --nav-primary: #860734;
  --nav-primary-dark: #6a0529;
  --nav-primary-light: #a91d4d;
  --nav-bg: #ffffff;
  --nav-text: #1f2937;
  --nav-text-light: #6b7280;
  --nav-border: #e5e7eb;
  --nav-hover: #f9fafb;
  --nav-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Top Bar - Barra superior elegante */
.navbar__top-bar {
  background: linear-gradient(135deg, var(--nav-primary) 0%, var(--nav-primary-dark) 100%);
  color: white;
  font-size: 0.875rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.navbar__top-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0.5rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.contact-info {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  text-decoration: none;
  transition: all 0.3s;
  opacity: 0.9;
}

.contact-link:hover {
  opacity: 1;
  transform: translateY(-1px);
}

.contact-link i {
  font-size: 0.9rem;
}

.social-links {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.social-link {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  color: white;
  text-decoration: none;
  transition: all 0.3s;
  font-size: 1rem;
}

.social-link:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px) scale(1.05);
}

.social-link.whatsapp:hover {
  background: #25d366;
}

/* Main Navbar - Barra principal mejorada */
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: var(--nav-shadow);
}

.navbar__main {
  background: var(--nav-bg);
  border-bottom: 1px solid var(--nav-border);
}

.navbar__inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  min-height: 80px;
}

/* Brand mejorado */
.navbar__brand-wrap {
  flex-shrink: 0;
}

.navbar__brand {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  transition: transform 0.3s;
}

.navbar__brand:hover {
  transform: scale(1.02);
}

.navbar__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, rgba(134, 7, 52, 0.1) 0%, rgba(134, 7, 52, 0.05) 100%);
  border-radius: 12px;
  transition: all 0.3s;
}

.navbar__brand:hover .navbar__logo {
  background: linear-gradient(135deg, rgba(134, 7, 52, 0.15) 0%, rgba(134, 7, 52, 0.1) 100%);
  box-shadow: 0 4px 12px rgba(134, 7, 52, 0.2);
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.navbar__title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--nav-primary);
  line-height: 1.2;
}

.navbar__subtitle {
  font-size: 0.75rem;
  color: var(--nav-text-light);
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* Navigation mejorada */
.navbar__nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.nav-close {
  display: none;
}

.navbar__link {
  padding: 0.625rem 1.25rem;
  border-radius: 10px;
  color: var(--nav-text);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.navbar__link i {
  font-size: 1rem;
  opacity: 0.8;
}

.navbar__link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 80%;
  height: 3px;
  background: var(--nav-primary);
  border-radius: 10px 10px 0 0;
  transition: transform 0.3s;
}

.navbar__link:hover {
  background: var(--nav-hover);
  color: var(--nav-primary);
}

.navbar__link:hover::after {
  transform: translateX(-50%) scaleX(1);
}

.navbar__link.active {
  background: linear-gradient(135deg, rgba(134, 7, 52, 0.12) 0%, rgba(134, 7, 52, 0.08) 100%);
  color: var(--nav-primary);
}

.navbar__link.active::after {
  transform: translateX(-50%) scaleX(1);
}

/* Search mejorado */
.navbar__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.navbar__search {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--nav-hover);
  border: 2px solid var(--nav-border);
  border-radius: 25px;
  padding: 0.5rem 1rem;
  transition: all 0.3s;
  min-width: 280px;
}

.navbar__search:focus-within {
  border-color: var(--nav-primary);
  background: white;
  box-shadow: 0 0 0 4px rgba(134, 7, 52, 0.1);
  transform: translateY(-2px);
}

.search-submit {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  color: var(--nav-text-light);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
  font-size: 1.1rem;
  transition: all 0.3s;
}

.search-submit:hover {
  color: var(--nav-primary);
  transform: scale(1.1);
}

.navbar__search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.95rem;
  color: var(--nav-text);
  font-family: inherit;
  font-weight: 500;
}

.navbar__search-input::placeholder {
  color: var(--nav-text-light);
  font-weight: 400;
}

.navbar__search-clear {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  color: var(--nav-text-light);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.5rem;
  font-size: 1.1rem;
  transition: all 0.3s;
}

.navbar__search-clear:hover {
  color: #ef4444;
  transform: rotate(90deg);
}

.mobile-menu-toggle {
  display: none;
  background: var(--nav-primary);
  color: #040404;
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1.5rem;
  transition: all 0.3s;
  align-items: center;
  justify-content: center;
}

.mobile-menu-toggle:hover {
  background: var(--nav-primary-dark);
  transform: scale(1.05);
}

.nav-overlay {
  display: none;
}

/* Animaciones */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

/* Responsive mejorado */
@media (max-width: 1024px) {
  .navbar__inner {
    gap: 1rem;
  }

  .navbar__nav {
    gap: 0.25rem;
  }

  .navbar__link {
    padding: 0.5rem 0.875rem;
    font-size: 0.9rem;
  }

  .navbar__search {
    min-width: 220px;
  }

  .brand-text {
    display: none;
  }
}

@media (max-width: 768px) {
  .navbar__top-bar {
    display: none;
  }

  .navbar__inner {
    min-height: 70px;
    padding: 0 1rem;
  }

  .navbar__logo {
    width: 45px;
    height: 45px;
  }

  .mobile-menu-toggle {
    display: flex;

  }

  .navbar__nav {
    position: fixed;
    top: 0;
    right: -100%;
    width: 280px;
    height: 100vh;
    background: white;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 1.5rem;
    box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
    transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow-y: auto;
    z-index: 1001;
  }

  .navbar__nav.nav-open {
    right: 0;
  }

  .nav-close {
    display: flex;
    align-self: flex-end;
    background: transparent;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    color: var(--nav-text);
    font-size: 1.5rem;
    cursor: pointer;
    margin-bottom: 1rem;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
  }

  .nav-close:hover {
    background: var(--nav-hover);
    color: var(--nav-primary);
  }

  .navbar__link {
    padding: 1rem;
    border-radius: 10px;
    margin-bottom: 0.5rem;
    justify-content: flex-start;
  }

  .navbar__link::after {
    display: none;
  }

  .nav-overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 1000;
  }

  .navbar__search {
    min-width: 0;
    flex: 1;
  }
}

@media (max-width: 480px) {
  .navbar__inner {
    padding: 0 0.75rem;
  }

  .contact-info span {
    display: none;
  }

  .navbar__search {
    padding: 0.4rem 0.75rem;
  }

  .navbar__search-input {
    font-size: 0.875rem;
  }
}
</style>