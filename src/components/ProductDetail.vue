<template>
  <div class="product-detail">
    <Navbar />
    <Header />

    <main class="detail-page">
      <div class="container">
        <!-- Breadcrumb -->
        <nav class="breadcrumb" v-scroll-animate="'fade-in-up'">
          <router-link to="/">Inicio</router-link>
          <span class="separator">/</span>
          <router-link to="/productos">Productos</router-link>
          <span class="separator">/</span>
          <span class="current">{{ product.name }}</span>
        </nav>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="skeleton-loader">
            <div class="skeleton-gallery">
              <div class="skeleton-main-image"></div>
              <div class="skeleton-thumbs">
                <div class="skeleton-thumb"></div>
                <div class="skeleton-thumb"></div>
                <div class="skeleton-thumb"></div>
                <div class="skeleton-thumb"></div>
              </div>
            </div>
            <div class="skeleton-details">
              <div class="skeleton-title"></div>
              <div class="skeleton-price"></div>
              <div class="skeleton-badges">
                <div class="skeleton-badge"></div>
                <div class="skeleton-badge"></div>
                <div class="skeleton-badge"></div>
              </div>
              <div class="skeleton-text"></div>
              <div class="skeleton-text"></div>
              <div class="skeleton-button"></div>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state" v-scroll-animate="'fade-in'">
          <i class="fas fa-exclamation-circle"></i>
          <h3>{{ error }}</h3>
          <router-link to="/productos" class="back-btn">
            <i class="fas fa-arrow-left"></i>
            Volver a productos
          </router-link>
        </div>

        <!-- Product Content -->
        <div v-else class="product-container">
          <!-- Galería de imágenes -->
          <section class="gallery" v-scroll-animate="'fade-in-left'">
            <div class="main-image-wrap">
              <div class="image-badges">
                <span v-if="product.inStock" class="badge-stock">
                  <i class="fas fa-check-circle"></i> Disponible
                </span>
                <span v-else class="badge-out">
                  <i class="fas fa-times-circle"></i> Agotado
                </span>
              </div>
              <img
                :src="currentImage"
                :alt="product.name"
                class="main-image"
                @mousemove="onZoom"
                @mouseleave="resetZoom"
                @click="openImageModal"
                ref="zoomImg"
              />
              <div class="zoom-hint">
                <i class="fas fa-search-plus"></i>
                Click para ampliar | Hover para zoom
              </div>
              <button class="fullscreen-btn" @click="openImageModal" title="Ver en pantalla completa">
                <i class="fas fa-expand"></i>
              </button>
            </div>
            <div class="thumbs-wrap" v-if="product.images.length > 1">
              <button
                class="thumb-arrow left"
                @click="scrollThumbs(-1)"
                :disabled="currentImageIdx <= 0"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              <div class="thumbnails" ref="thumbs" @scroll="updateThumbScroll">
                <img
                  v-for="(img, i) in product.images"
                  :key="i"
                  :src="img"
                  :class="{ active: currentImageIdx === i }"
                  @click="setCurrentImage(i)"
                  :alt="`Vista ${i + 1}`"
                />
              </div>
              <button
                class="thumb-arrow right"
                @click="scrollThumbs(1)"
                :disabled="currentImageIdx >= product.images.length - 1"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </section>

          <!-- Detalles del producto -->
          <aside class="details" v-scroll-animate="'fade-in-right'">
            <div class="details-header">
              <h1 class="title">{{ product.name }}</h1>
              <button class="favorite-btn" @click="toggleFavorite" :class="{ 'is-favorite': isFavorite }">
                <i :class="isFavorite ? 'fas fa-heart' : 'far fa-heart'"></i>
                <span class="favorite-tooltip">{{ isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos' }}</span>
              </button>
            </div>

            <div class="price-section">
              <div class="price-wrapper">
                <span class="price-label">Precio:</span>
                <p class="price">${{ product.price.toLocaleString('es-MX') }}</p>
              </div>
              <div class="stock-indicator" :class="{ 'in-stock': product.inStock, 'out-of-stock': !product.inStock }">
                <i :class="product.inStock ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
                <span>{{ product.inStock ? 'En stock' : 'Agotado' }}</span>
              </div>
            </div>

            <div class="trust-badges">
              <div class="badge-item">
                <i class="fas fa-truck"></i>
                <div>
                  <strong>Entrega rápida</strong>
                  <span>3-5 días hábiles</span>
                </div>
              </div>
              <div class="badge-item">
                <i class="fas fa-shield-alt"></i>
                <div>
                  <strong>Compra segura</strong>
                  <span>Protección garantizada</span>
                </div>
              </div>
              <div class="badge-item">
                <i class="fas fa-hand-holding-usd"></i>
                <div>
                  <strong>Sin anticipo</strong>
                  <span>Aparta sin pagar</span>
                </div>
              </div>
            </div>

            <div class="description-section">
              <h3><i class="fas fa-align-left"></i> Descripción</h3>
              <p class="description">{{ product.description || 'Producto de excelente calidad.' }}</p>
            </div>

            <div class="features" v-if="product.features.length">
              <h3><i class="fas fa-list-ul"></i> Características</h3>
              <ul>
                <li v-for="(f, idx) in product.features" :key="idx">
                  <i class="fas fa-check"></i>
                  <span>{{ f }}</span>
                </li>
              </ul>
            </div>

            <!-- Acciones -->
            <div class="actions-section">
              <button
                class="cta-button primary whatsapp-btn"
                :disabled="!product.inStock"
                @click="reserveProduct"
              >
                <i class="fab fa-whatsapp"></i>
                <span>{{ product.inStock ? 'Apartar por WhatsApp' : 'No disponible' }}</span>
              </button>

              <button class="cta-button secondary" @click="contactUs">
                <i class="fas fa-phone-alt"></i>
                <span>Llamar ahora</span>
              </button>
            </div>

            <div v-if="product.inStock" class="info-box">
              <i class="fas fa-info-circle"></i>
              <div>
                <strong>Aparta sin compromiso</strong>
                <p>Un asesor te contactará para confirmar tu pedido y resolver tus dudas.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <!-- Productos Relacionados -->
      <section v-if="!loading && !error && relatedProducts.length > 0" class="related-products-section">
        <div class="container">
          <div class="section-header" v-scroll-animate="'fade-in-up'">
            <h2>
              <i class="fas fa-tag"></i>
              Productos Relacionados
            </h2>
            <p>Otros productos que podrían interesarte</p>
          </div>

          <div v-if="loadingRelated" class="related-loading">
            <div class="skeleton-product-card" v-for="i in 4" :key="i">
              <div class="skeleton-product-image"></div>
              <div class="skeleton-product-info">
                <div class="skeleton-product-title"></div>
                <div class="skeleton-product-price"></div>
              </div>
            </div>
          </div>

          <div v-else class="related-products-grid" v-scroll-animate="'fade-in-up'">
            <div
              v-for="item in relatedProducts"
              :key="item.id"
              class="related-product-card"
              @click="goToProduct(item.id)"
            >
              <div class="related-product-image">
                <img :src="item.img_base64 || '/assets/img/products/default.jpg'" :alt="item.name" />
                <div class="related-product-overlay">
                  <i class="fas fa-eye"></i>
                  <span>Ver Detalles</span>
                </div>
              </div>
              <div class="related-product-info">
                <h3>{{ item.name }}</h3>
                <p class="related-product-price">${{ item.price.toLocaleString('es-MX') }}</p>
                <span v-if="item.stock > 0" class="related-stock-badge">
                  <i class="fas fa-check-circle"></i> Disponible
                </span>
                <span v-else class="related-stock-badge out">
                  <i class="fas fa-times-circle"></i> Agotado
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Modal de imagen ampliada -->
    <Transition name="modal">
      <div v-if="showImageModal" class="image-modal-overlay" @click="closeImageModal">
        <div class="image-modal-content" @click.stop>
          <button class="modal-close" @click="closeImageModal">
            <i class="fas fa-times"></i>
          </button>
          <img :src="currentImage" :alt="product.name" class="modal-image" />
          <div class="modal-nav" v-if="product.images.length > 1">
            <button @click="previousImage" class="modal-nav-btn">
              <i class="fas fa-chevron-left"></i>
            </button>
            <span class="modal-counter">{{ currentImageIndex + 1 }} / {{ product.images.length }}</span>
            <button @click="nextImage" class="modal-nav-btn">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Footer />
  </div>
</template>

<script setup>
import axiosConfig from '../config/AxiosConfig.js';
import { getFurniture } from '../services/furniture.js';
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

const route = useRoute();
const router = useRouter();
const product = ref({
  id: route.params.id,
  name: '',
  price: 0,
  inStock: true,
  description: '',
  images: [],
  features: [],
  category: ''
});
const currentImage = ref('');
const thumbs = ref(null);
const zoomImg = ref(null);
const loading = ref(true);
const error = ref('');
const isFavorite = ref(false);
const thumbScrollLeft = ref(0);
const thumbScrollRight = ref(false);
const showImageModal = ref(false);
const relatedProducts = ref([]);
const loadingRelated = ref(false);
const currentImageIdx = ref(0);

const currentImageIndex = computed(() => {
  return product.value.images.findIndex(img => img === currentImage.value);
});

watch(() => product.value.images, (imgs) => {
  if (imgs && imgs.length > 0) {
    currentImageIdx.value = 0;
    currentImage.value = imgs[0];
  }
});

async function fetchProduct() {
  loading.value = true;
  try {
    const res = await axiosConfig.doGet(`/furniture/${route.params.id}`);
    const item = res.data;

    // Normalizar imágenes: convertir a array
    let itemImages = [];
    if (item.images && Array.isArray(item.images) && item.images.length > 0) {
      itemImages = item.images.map(img => {
        // La imagen puede venir como string o como objeto con img_base64
        return typeof img === 'string' ? img : (img.img_base64 || img.url || '/assets/img/products/default.jpg');
      }).filter(Boolean);
    } else if (item.img_base64) {
      itemImages = [item.img_base64];
    } else {
      itemImages = ['/assets/img/products/default.jpg'];
    }

    product.value = {
      id: item.id,
      name: item.name,
      price: item.price,
      inStock: item.stock > 0,
      description: item.description,
      images: itemImages,
      category: item.category || '',
      features: [
        item.brand ? `Marca: ${item.brand}` : null,
        item.color ? `Color: ${item.color}` : null,
        item.material ? `Material: ${item.material}` : null,
        item.dimensions ? `Dimensiones: ${item.dimensions}` : null,
        item.category ? `Categoría: ${item.category}` : null,
        `Stock disponible: ${item.stock} unidades`
      ].filter(Boolean)
    };
    currentImage.value = product.value.images[0];

    // Cargar productos relacionados
    if (item.category) {
      fetchRelatedProducts(item.category, item.id);
    }
  } catch (e) {
    error.value = 'No se pudo cargar el producto. Por favor, intenta nuevamente.';
  } finally {
    loading.value = false;
  }
}

async function fetchRelatedProducts(category, currentProductId) {
  loadingRelated.value = true;
  try {
    const data = await getFurniture(0, 8, category);
    // Filtrar el producto actual y limitar a 4 productos
    relatedProducts.value = data
      .filter(item => item.id !== currentProductId)
      .slice(0, 4);
  } catch (e) {
    console.error('Error al cargar productos relacionados:', e);
  } finally {
    loadingRelated.value = false;
  }
}

function goToProduct(productId) {
  // Scroll al inicio
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // Navegar al nuevo producto - CORREGIDO: debe ser /producto/:id no /productos/:id
  router.push({ name: 'ProductoDetalle', params: { id: productId } });
  // Recargar el producto
  setTimeout(() => {
    fetchProduct();
  }, 300);
}

onMounted(fetchProduct);

function setCurrentImage(idx) {
  currentImageIdx.value = idx;
  currentImage.value = product.value.images[idx];
}

function nextImage() {
  if (currentImageIdx.value < product.value.images.length - 1) {
    setCurrentImage(currentImageIdx.value + 1);
  }
}

function previousImage() {
  if (currentImageIdx.value > 0) {
    setCurrentImage(currentImageIdx.value - 1);
  }
}

// Reemplazar scrollThumbs para cambiar imagen
function scrollThumbs(direction) {
  if (direction === 1) {
    nextImage();
  } else if (direction === -1) {
    previousImage();
  }
}

function onZoom(e) {
  const img = zoomImg.value;
  if (!img) return;
  const rect = img.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  img.style.transformOrigin = `${x}% ${y}%`;
  img.style.transform = 'scale(2)';
}

function resetZoom() {
  const img = zoomImg.value;
  if (!img) return;
  img.style.transformOrigin = 'center center';
  img.style.transform = 'scale(1)';
}

function openImageModal() {
  resetZoom(); // Siempre resetea el zoom antes de abrir el modal
  showImageModal.value = true;
  document.body.style.overflow = 'hidden';
}

function closeImageModal() {
  resetZoom(); // Siempre resetea el zoom al cerrar el modal
  showImageModal.value = false;
  document.body.style.overflow = '';
}

function reserveProduct() {
  const phone = '5217341532692';
  const msg = `Hola, quiero apartar el producto: ${product.value.name} (ID: ${product.value.id}) - Precio: $${product.value.price.toLocaleString('es-MX')}`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
}

function contactUs() {
  window.open('tel:+5217341532692', '_self');
}

function toggleFavorite() {
  isFavorite.value = !isFavorite.value;
  // Aquí podrías guardar en localStorage o enviar a una API
}
</script>

<style scoped>
/* Variables */
:root {
  --primary: #860734;
  --primary-dark: #6a0529;
  --primary-light: #e94e77;
  --secondary: #ffd700;
  --success: #25D366;
  --text-dark: #1f2937;
  --text-gray: #6b7280;
  --bg-light: #faf6fa;
  --border: #e5e7eb;
}

.detail-page {
  background: linear-gradient(135deg, var(--bg-light) 0%, #f0e8f0 100%);
  padding: 2rem 0 4rem;
  min-height: 80vh;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  font-size: 0.9rem;
  flex-wrap: wrap;
}

.breadcrumb a {
  color: var(--primary);
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb a:hover {
  color: var(--primary-light);
  text-decoration: underline;
}

.breadcrumb .separator {
  color: var(--text-gray);
}

.breadcrumb .current {
  color: var(--text-dark);
  font-weight: 600;
}

/* Loading & Error States */
.loading-state {
  padding: 0;
  background: transparent;
  box-shadow: none;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(134, 7, 52, 0.1);
}

/* Skeleton Loader */
.skeleton-loader {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 3rem;
  animation: fade-in 0.3s ease-in;
}

.skeleton-gallery {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.skeleton-main-image {
  width: 100%;
  height: 500px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 20px;
}

.skeleton-thumbs {
  display: flex;
  gap: 0.75rem;
}

.skeleton-thumb {
  width: 80px;
  height: 80px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 12px;
  flex-shrink: 0;
}

.skeleton-details {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.skeleton-title {
  width: 80%;
  height: 32px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

.skeleton-price {
  width: 50%;
  height: 48px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

.skeleton-badges {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.skeleton-badge {
  height: 60px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 12px;
}

.skeleton-text {
  width: 100%;
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.skeleton-button {
  width: 100%;
  height: 56px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 12px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.error-state i {
  font-size: 4rem;
  color: var(--primary);
  opacity: 0.5;
  margin-bottom: 1rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.error-state h3 {
  color: var(--text-dark);
  margin-bottom: 1.5rem;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--primary);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s;
}

.back-btn:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(134, 7, 52, 0.3);
}

/* Product Container */
.product-container {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 3rem;
  align-items: flex-start;
}

/* Gallery */
.gallery {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: sticky;
  top: 2rem;
}

.main-image-wrap {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(134, 7, 52, 0.12);
  background: white;
  transition: box-shadow 0.3s;
}

.main-image-wrap:hover {
  box-shadow: 0 12px 32px rgba(134, 7, 52, 0.18);
}

.image-badges {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  display: flex;
  gap: 0.5rem;
}

.badge-stock,
.badge-out {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.85rem;
  font-weight: 700;
  backdrop-filter: blur(10px);
  animation: slide-in-right 0.5s ease-out;
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.badge-stock {
  background: rgba(37, 211, 102, 0.95);
  color: white;
  box-shadow: 0 2px 8px rgba(37, 211, 102, 0.3);
}

.badge-out {
  background: rgba(239, 68, 68, 0.95);
  color: white;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.main-image {
  width: 100%;
  height: 500px;
  object-fit: cover;
  border-radius: 20px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.zoom-hint {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 25px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  white-space: nowrap;
}

.main-image-wrap:hover .zoom-hint {
  opacity: 1;
}

.fullscreen-btn {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  color: var(--primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.fullscreen-btn:hover {
  background: white;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.thumbs-wrap {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.thumbnails {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 0.5rem 0;
  flex: 1;
  scrollbar-width: thin;
  scrollbar-color: var(--primary) var(--border);
}

.thumbnails::-webkit-scrollbar {
  height: 6px;
}

.thumbnails::-webkit-scrollbar-track {
  background: var(--border);
  border-radius: 10px;
}

.thumbnails::-webkit-scrollbar-thumb {
  background: var(--primary);
  border-radius: 10px;
}

.thumbnails img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 12px;
  cursor: pointer;
  border: 3px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.thumbnails img:hover {
  border-color: var(--primary-light);
  transform: scale(1.05);
}

.thumbnails img.active {
  border-color: var(--primary);
  box-shadow: 0 4px 12px rgba(134, 7, 52, 0.3);
}

.thumb-arrow {
  background: white;
  border: 2px solid var(--border);
  color: var(--primary);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  flex-shrink: 0;
}

.thumb-arrow:hover:not(:disabled) {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
  transform: scale(1.1);
}

.thumb-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* Details */
.details {
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(134, 7, 52, 0.12);
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.details-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.title {
  font-size: 2rem;
  color: var(--primary);
  margin: 0;
  font-weight: 800;
  line-height: 1.3;
  flex: 1;
}

.favorite-btn {
  background: transparent;
  border: 2px solid var(--border);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  flex-shrink: 0;
  position: relative;
}

.favorite-btn i {
  font-size: 1.3rem;
  color: var(--primary);
  transition: all 0.3s;
}

.favorite-btn:hover {
  border-color: var(--primary);
  transform: scale(1.1);
}

.favorite-btn.is-favorite {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
  animation: heart-beat 0.5s ease;
}

@keyframes heart-beat {
  0%, 100% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.2);
  }
  50% {
    transform: scale(1.1);
  }
}

.favorite-btn i.fas {
  color: #ef4444;
}

.favorite-tooltip {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
  z-index: 10;
}

.favorite-btn:hover .favorite-tooltip {
  opacity: 1;
}

.price-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background: linear-gradient(135deg, #faf6fa 0%, #f0e8f0 100%);
  border-radius: 16px;
  gap: 1rem;
  flex-wrap: wrap;
  border: 2px solid var(--border);
  transition: all 0.3s;
}

.price-section:hover {
  border-color: var(--primary-light);
  box-shadow: 0 4px 12px rgba(134, 7, 52, 0.1);
}

.price-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.price-label {
  font-size: 0.9rem;
  color: var(--text-gray);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.price {
  font-size: 2.5rem;
  color: var(--primary);
  font-weight: 900;
  margin: 0;
  line-height: 1;
  text-shadow: 0 2px 4px rgba(134, 7, 52, 0.1);
}

.stock-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 25px;
  font-weight: 700;
  font-size: 0.95rem;
  animation: slide-in 0.5s ease-out;
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stock-indicator.in-stock {
  background: rgba(37, 211, 102, 0.15);
  color: #059669;
}

.stock-indicator.out-of-stock {
  background: rgba(239, 68, 68, 0.15);
  color: #dc2626;
}

.trust-badges {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.badge-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--bg-light);
  border-radius: 12px;
  border: 1px solid var(--border);
  transition: all 0.3s;
}

.badge-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(134, 7, 52, 0.1);
  border-color: var(--primary-light);
}

.badge-item i {
  font-size: 1.5rem;
  color: var(--secondary);
  flex-shrink: 0;
  filter: drop-shadow(0 2px 4px rgba(255, 215, 0, 0.3));
}

.badge-item div {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.badge-item strong {
  color: var(--text-dark);
  font-size: 0.9rem;
}

.badge-item span {
  color: var(--text-gray);
  font-size: 0.8rem;
}

.description-section h3,
.features h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary);
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
}

.description {
  color: var(--text-gray);
  line-height: 1.8;
  font-size: 1rem;
  margin: 0;
}

.features ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.features li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-dark);
  font-size: 0.95rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s;
}

.features li:hover {
  background: var(--bg-light);
  transform: translateX(5px);
}

.features li i {
  color: var(--success);
  font-size: 0.85rem;
  flex-shrink: 0;
}

/* Actions Section - Improved WhatsApp Button */
.actions-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cta-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.cta-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.cta-button:hover::before {
  width: 300px;
  height: 300px;
}

.cta-button i {
  font-size: 1.3rem;
  position: relative;
  z-index: 1;
}

.cta-button span {
  position: relative;
  z-index: 1;
}

.cta-button.primary {
  background: var(--success);
  color: white;
}

/* Mejora específica para el botón de WhatsApp */
.cta-button.whatsapp-btn {
  background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
  border: 3px solid #1ea952;
  box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4),
              inset 0 -2px 5px rgba(0, 0, 0, 0.1);
  font-weight: 800;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.cta-button.whatsapp-btn i {
  font-size: 1.5rem;
  animation: pulse 2s infinite;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3));
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.cta-button.whatsapp-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #1ea952 0%, #0d7a5f 100%);
  border-color: #0d7a5f;
  transform: translateY(-3px);
  box-shadow: 0 6px 25px rgba(37, 211, 102, 0.5),
              inset 0 -2px 5px rgba(0, 0, 0, 0.15);
}

.cta-button.whatsapp-btn:active:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 3px 15px rgba(37, 211, 102, 0.3);
}

.cta-button.primary:disabled {
  background: var(--text-gray);
  cursor: not-allowed;
  opacity: 0.6;
  border: 3px solid #9ca3af;
}

.cta-button.secondary {
  background: white;
  color: var(--primary);
  border: 2px solid var(--primary);
}

.cta-button.secondary:hover {
  background: var(--primary);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(134, 7, 52, 0.3);
}

/* Related Products Section */
.related-products-section {
  margin-top: 4rem;
  padding: 3rem 0;
  background: white;
  border-radius: 20px 20px 0 0;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-header h2 {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  color: var(--primary);
  font-weight: 800;
  margin: 0 0 0.5rem 0;
}

.section-header h2 i {
  font-size: 1.8rem;
}

.section-header p {
  color: var(--text-gray);
  font-size: 1.1rem;
  margin: 0;
}

/* Related Products Grid */
.related-products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.related-product-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.related-product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(134, 7, 52, 0.15);
}

.related-product-image {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
  background: var(--bg-light);
}

.related-product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.related-product-card:hover .related-product-image img {
  transform: scale(1.1);
}

.related-product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(134, 7, 52, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s;
}

.related-product-card:hover .related-product-overlay {
  opacity: 1;
}

.related-product-overlay i {
  font-size: 2.5rem;
  color: white;
  animation: bounce-icon 0.6s ease-in-out;
}

@keyframes bounce-icon {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.related-product-overlay span {
  color: white;
  font-weight: 700;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.related-product-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.related-product-info h3 {
  font-size: 1.1rem;
  color: var(--text-dark);
  margin: 0;
  font-weight: 700;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 2.8em;
}

.related-product-price {
  font-size: 1.5rem;
  color: var(--primary);
  font-weight: 900;
  margin: 0;
}

.related-stock-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  background: rgba(37, 211, 102, 0.15);
  color: #059669;
  width: fit-content;
}

.related-stock-badge.out {
  background: rgba(239, 68, 68, 0.15);
  color: #dc2626;
}

.related-stock-badge i {
  font-size: 0.75rem;
}

/* Related Products Loading */
.related-loading {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.skeleton-product-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.skeleton-product-image {
  width: 100%;
  height: 250px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-product-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skeleton-product-title {
  width: 100%;
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-product-price {
  width: 60%;
  height: 28px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

/* Animations */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .product-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .skeleton-loader {
    grid-template-columns: 1fr;
  }

  .gallery {
    position: static;
  }

  .main-image {
    height: 400px;
  }

  .skeleton-main-image {
    height: 400px;
  }
}

@media (max-width: 768px) {
  .detail-page {
    padding: 1.5rem 0 3rem;
  }

  .breadcrumb {
    font-size: 0.8rem;
  }

  .title {
    font-size: 1.5rem;
  }

  .price {
    font-size: 2rem;
  }

  .main-image,
  .skeleton-main-image {
    height: 300px;
  }

  .details,
  .skeleton-details {
    padding: 1.5rem;
  }

  .trust-badges {
    grid-template-columns: 1fr;
  }

  .skeleton-badges {
    grid-template-columns: 1fr;
  }

  .price-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .thumbnails img,
  .skeleton-thumb {
    width: 60px;
    height: 60px;
  }

  .modal-content {
    max-width: 95vw;
    padding: 0.5rem;
  }

  .modal-image {
    max-height: 70vh;
  }
}

@media (max-width: 480px) {
  .details-header {
    flex-direction: row;
    align-items: flex-start;
  }

  .title {
    font-size: 1.3rem;
  }

  .favorite-btn {
    width: 40px;
    height: 40px;
  }

  .favorite-btn i {
    font-size: 1.1rem;
  }

  .cta-button {
    font-size: 0.95rem;
    padding: 1rem 1.5rem;
  }

  .price {
    font-size: 1.8rem;
  }

  .badge-item {
    padding: 0.8rem;
  }

  .image-modal {
    padding: 1rem;
  }
}

.image-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.85);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.image-modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.modal-image {
  max-width: 80vw;
  max-height: 80vh;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  background: white;
}
.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0,0,0,0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10001;
}
.modal-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1rem;
}
.modal-nav-btn {
  background: rgba(0,0,0,0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  transition: background 0.2s;
}
.modal-nav-btn:hover {
  background: #860734;
}
.modal-counter {
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  text-shadow: 0 2px 8px rgba(0,0,0,0.5);
}
</style>
