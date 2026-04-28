<template>
  <div class="favorites-page">
    <Navbar />

    <main class="favorites-main">
      <div class="favorites-container">
        <div class="favorites-header">
          <h1 class="favorites-title">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#860734" stroke="#860734" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            Mis Favoritos
          </h1>
          <p class="favorites-subtitle">{{ favStore.count }} producto{{ favStore.count !== 1 ? 's' : '' }} guardado{{ favStore.count !== 1 ? 's' : '' }}</p>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="fav-loading">
          <div class="fav-spinner"></div>
          <p>Verificando disponibilidad...</p>
        </div>

        <!-- Empty state -->
        <div v-else-if="!favStore.count" class="fav-empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d1c4ca" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <h2>Aún no tienes favoritos</h2>
          <p>Guarda los productos que te gusten con el corazón en cualquier producto del catálogo.</p>
          <router-link to="/productos" class="btn-primary-link">Ver catálogo</router-link>
        </div>

        <!-- Sold-out banner -->
        <div v-if="soldOutItems.length && !loading" class="sold-out-banner">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{{ soldOutItems.length }} producto{{ soldOutItems.length !== 1 ? 's' : '' }} de tu lista {{ soldOutItems.length !== 1 ? 'están agotados' : 'está agotado' }}</span>
          <button @click="removeAllSoldOut" class="sold-out-clear-btn">Eliminar agotados</button>
        </div>

        <!-- Grid -->
        <div v-if="favStore.count && !loading" class="fav-grid">
          <div
            v-for="item in enrichedItems"
            :key="item.id"
            class="fav-card"
            :class="{ 'fav-card--soldout': item.soldOut }"
          >
            <!-- Sold-out badge -->
            <div v-if="item.soldOut" class="soldout-overlay" aria-label="Producto agotado">
              <span class="soldout-badge">Agotado</span>
            </div>

            <!-- Image -->
            <router-link :to="{ name: 'ProductoDetalle', params: { id: item.id } }" class="fav-card__img-link">
              <img
                :src="item.displayImage"
                :alt="item.name"
                class="fav-card__img"
                loading="lazy"
                @error="handleImageError(item.id)"
              />
            </router-link>

            <!-- Info -->
            <div class="fav-card__body">
              <router-link :to="{ name: 'ProductoDetalle', params: { id: item.id } }" class="fav-card__name">
                {{ item.name }}
              </router-link>
              <p class="fav-card__price">${{ formatPrice(item.price) }}</p>
              <p v-if="item.soldOut" class="fav-card__stock-msg">Sin existencias</p>
            </div>

            <!-- Actions -->
            <div class="fav-card__actions">
              <button
                v-if="!item.soldOut"
                @click="addToCart(item)"
                class="fav-card__btn-cart"
                title="Agregar al carrito"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                Agregar al carrito
              </button>
              <button @click="favStore.remove(item.id)" class="fav-card__btn-remove" title="Quitar de favoritos" aria-label="Quitar de favoritos">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Navbar from '../components/Navbar.vue';
import { useFavoritesStore } from '../stores/favoritesStore';
import { useMainStore } from '../stores/main';
import { productService } from '../services/products';
import axiosConfig from '../config/AxiosConfig';

const favStore = useFavoritesStore();
const mainStore = useMainStore();
const loading = ref(false);
const liveStockMap = ref({});
const liveImagesMap = ref({});
const failedImages = ref(new Set());

const enrichedItems = computed(() =>
  favStore.items.map(item => ({
    ...item,
    soldOut: liveStockMap.value[item.id] === 0,
    // Usar la imagen en vivo si está disponible, sino la del item guardado
    displayImage: liveImagesMap.value[item.id] || getImg(item),
  }))
);

const soldOutItems = computed(() =>
  enrichedItems.value.filter(i => i.soldOut)
);

async function fetchLiveStock() {
  if (!favStore.count) return;
  loading.value = true;
  try {
    const results = await Promise.allSettled(
      favStore.items.map(item => productService.getProductById(item.id))
    );
    results.forEach((result, idx) => {
      const id = favStore.items[idx].id;
      if (result.status === 'fulfilled') {
        const p = result.value.data?.data || result.value.data || {};
        liveStockMap.value[id] = p.stock ?? 1;

        // Guardar las imágenes en vivo
        if (p.imageUrl) {
          liveImagesMap.value[id] = p.imageUrl;
        } else if (p.images && Array.isArray(p.images) && p.images.length) {
          const first = p.images[0];
          if (typeof first === 'string') {
            liveImagesMap.value[id] = first;
          } else if (first.url) {
            liveImagesMap.value[id] = first.url;
          } else if (first.img_base64) {
            liveImagesMap.value[id] = first.img_base64;
          }
        }
      } else {
        liveStockMap.value[id] = 1;
      }
    });
  } finally {
    loading.value = false;
  }
}

async function addToCart(product) {
  await mainStore.addToCart({ ...product, quantity: 1 });
  axiosConfig.ToastSuccess('Agregado', `${product.name} se agregó al carrito`);
}

function removeAllSoldOut() {
  soldOutItems.value.forEach(item => favStore.remove(item.id));
}

function handleImageError(productId) {
  // Marcar imagen como fallida
  failedImages.value.add(productId);
  // Force re-render
  failedImages.value = new Set(failedImages.value);
}

function getImg(product) {
  // Buscar en múltiples propiedades
  if (product.imageUrl) return product.imageUrl;
  if (product.img) return product.img;
  if (product.img_base64) return product.img_base64;

  // Buscar en arrays de imágenes
  if (product.images && Array.isArray(product.images) && product.images.length) {
    const first = product.images[0];
    if (typeof first === 'string') return first;
    if (first.url) return first.url;
    if (first.img_base64) return first.img_base64;
  }

  if (product.imageUrls && Array.isArray(product.imageUrls) && product.imageUrls.length) {
    const first = product.imageUrls[0];
    if (typeof first === 'string') return first;
    if (first.url) return first.url;
  }

  if (product.product_images && Array.isArray(product.product_images) && product.product_images.length) {
    const first = product.product_images[0];
    if (typeof first === 'string') return first;
    if (first.url) return first.url;
    if (first.img_base64) return first.img_base64;
  }

  // Default fallback
  return '/assets/img/products/default.jpg';
}

function formatPrice(val) {
  if (!val && val !== 0) return '0';
  return parseFloat(val).toLocaleString('es-MX');
}

onMounted(fetchLiveStock);
</script>

<style scoped>
.favorites-page {
  min-height: 100vh;
  background: #faf7f4;
}

.favorites-main {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

.favorites-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.favorites-header {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  flex-wrap: wrap;
}

.favorites-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #141413;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin: 0;
}

.favorites-subtitle {
  font-size: 0.9rem;
  color: #7a6570;
  margin: 0;
}

.fav-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem 0;
  color: #7a6570;
}

.fav-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #e0d0e0;
  border-top-color: #860734;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.fav-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 5rem 1rem;
  text-align: center;
  color: #7a6570;
}

.fav-empty h2 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #141413;
  margin: 0;
}

.fav-empty p {
  font-size: 0.95rem;
  max-width: 360px;
  margin: 0;
  line-height: 1.6;
}

.btn-primary-link {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.75rem;
  background: #860734;
  color: #fff;
  border-radius: 50px;
  font-weight: 700;
  text-decoration: none;
  margin-top: 0.5rem;
  transition: background 0.2s, transform 0.15s;
}

.btn-primary-link:hover {
  background: #6a052a;
  transform: translateY(-2px);
}

.sold-out-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  background: #fff3cd;
  border: 1px solid #ffd270;
  border-radius: 12px;
  color: #92400e;
  font-size: 0.9rem;
  font-weight: 500;
  flex-wrap: wrap;
}

.sold-out-clear-btn {
  margin-left: auto;
  background: none;
  border: 1px solid #92400e;
  color: #92400e;
  border-radius: 8px;
  padding: 0.35rem 0.875rem;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}

.sold-out-clear-btn:hover {
  background: rgba(146, 64, 14, 0.08);
}

.fav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.25rem;
}

.fav-card {
  position: relative;
  background: #fff;
  border-radius: 16px;
  border: 1px solid rgba(134, 7, 52, 0.07);
  box-shadow: 0 2px 12px rgba(134, 7, 52, 0.07);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.25s, transform 0.25s;
}

.fav-card:hover {
  box-shadow: 0 8px 28px rgba(134, 7, 52, 0.13);
  transform: translateY(-3px);
}

.fav-card--soldout {
  opacity: 0.75;
}

.soldout-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.45);
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 0.75rem;
  pointer-events: none;
}

.soldout-badge {
  background: #dc2626;
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.fav-card__img-link {
  display: block;
  aspect-ratio: 4/3;
  overflow: hidden;
  background: #f9f4f5;
}

.fav-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
}

.fav-card:hover .fav-card__img {
  transform: scale(1.04);
}

.fav-card__body {
  padding: 0.875rem 1rem 0.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.fav-card__name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #141413;
  text-decoration: none;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.fav-card__name:hover { color: #860734; }

.fav-card__price {
  color: #860734;
  font-weight: 800;
  font-size: 1.05rem;
  margin: 0;
}

.fav-card__stock-msg {
  font-size: 0.78rem;
  color: #dc2626;
  font-weight: 500;
  margin: 0;
}

.fav-card__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem 0.875rem;
}

.fav-card__btn-cart {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  background: #860734;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 0.55rem 1rem;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.fav-card__btn-cart:hover { background: #6a052a; }

.fav-card__btn-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid #e0d0e0;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
  flex-shrink: 0;
}

.fav-card__btn-remove:hover {
  color: #dc2626;
  border-color: #fca5a5;
  background: #fff1f1;
}

@media (max-width: 640px) {
  .favorites-main { padding: 1.5rem 1rem 3rem; }
  .fav-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 0.875rem; }
  .fav-card__btn-cart { font-size: 0.75rem; padding: 0.5rem 0.625rem; }
}
</style>
