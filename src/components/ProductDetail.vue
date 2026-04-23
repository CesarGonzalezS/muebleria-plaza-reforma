<template>
  <div class="product-detail">
    <Navbar />
    <Header />
    <main class="detail-page">
      <div class="container">

        <!-- Breadcrumb -->
        <nav class="breadcrumb">
          <router-link to="/">Inicio</router-link>
          <span class="separator">/</span>
          <router-link to="/productos">Productos</router-link>
          <span class="separator">/</span>
          <span class="current">{{ product.name }}</span>
        </nav>

        <!-- Loading -->
        <div v-if="loading" class="loading-state">
          <div class="spinner"><i class="bi bi-arrow-repeat"></i></div>
          <p>Cargando producto...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="error-state">
          <i class="bi bi-exclamation-circle"></i>
          <h3>{{ error }}</h3>
          <router-link to="/productos" class="back-btn">
            <i class="bi bi-arrow-left"></i> Volver a productos
          </router-link>
        </div>

        <!-- Producto -->
        <div v-else class="product-container">

          <!-- Galería -->
          <section class="gallery">
            <div class="main-image-wrap">
              <img
                v-if="currentImage"
                :src="currentImage"
                :alt="product.name"
                class="main-image"
              />
              <div v-else class="placeholder-image">
                <i class="bi bi-image"></i>
              </div>
              <!-- Badges -->
              <span v-if="product.stock === 0" class="gallery-badge badge-out">
                <i class="bi bi-x-circle"></i> Agotado
              </span>
              <span v-else-if="product.stock > 0 && product.stock <= product.minStock" class="gallery-badge badge-low">
                <i class="bi bi-exclamation-circle"></i> Últimas unidades
              </span>
              <!-- Contador -->
              <span v-if="allImages.length > 1" class="img-counter">
                {{ allImages.indexOf(currentImage) + 1 }} / {{ allImages.length }}
              </span>
            </div>

            <!-- Thumbnails -->
            <div v-if="allImages.length > 1" class="gallery-thumbs">
              <button
                v-for="(img, idx) in allImages"
                :key="idx"
                type="button"
                class="thumb-btn"
                :class="{ active: img === currentImage }"
                @click="currentImage = img"
              >
                <img :src="img" :alt="`Vista ${idx + 1}`" />
              </button>
            </div>
          </section>

          <!-- Detalles -->
          <aside class="details">
            <!-- Badges categoría/marca -->
            <div class="product-badges">
              <span v-if="product.category" class="badge badge-cat">
                <i class="bi bi-tag"></i> {{ product.category }}
              </span>
              <span v-if="product.brand" class="badge badge-brand">
                <i class="bi bi-award"></i> {{ product.brand }}
              </span>
            </div>

            <h1 class="title">{{ product.name }}</h1>

            <!-- Precio -->
            <div class="price-section">
              <p class="price">${{ (product.price || 0).toLocaleString('es-MX') }}</p>
              <div class="stock-badge" :class="product.stock === 0 ? 'out' : product.stock <= product.minStock ? 'low' : 'ok'">
                <i :class="product.stock === 0 ? 'bi bi-x-circle-fill' : 'bi bi-check-circle-fill'"></i>
                {{ product.stock === 0 ? 'Agotado' : product.stock <= product.minStock ? 'Últimas unidades' : 'En stock' }}
              </div>
            </div>

            <p v-if="product.description" class="description">{{ product.description }}</p>

            <!-- Especificaciones -->
            <div class="specs-block" v-if="product.color || product.material || product.dimensions || product.category || product.brand">
              <h3 class="specs-title"><i class="bi bi-list-ul"></i> Especificaciones</h3>
              <div class="specs-list">
                <div v-if="product.category" class="spec-row">
                  <span class="spec-icon"><i class="bi bi-tag"></i></span>
                  <span class="spec-lbl">Categoría</span>
                  <span class="spec-val">{{ product.category }}</span>
                </div>
                <div v-if="product.brand" class="spec-row">
                  <span class="spec-icon"><i class="bi bi-award"></i></span>
                  <span class="spec-lbl">Marca</span>
                  <span class="spec-val">{{ product.brand }}</span>
                </div>
                <div v-if="product.color" class="spec-row">
                  <span class="spec-icon"><i class="bi bi-palette"></i></span>
                  <span class="spec-lbl">Color</span>
                  <span class="spec-val">{{ product.color }}</span>
                </div>
                <div v-if="product.material" class="spec-row">
                  <span class="spec-icon"><i class="bi bi-tree"></i></span>
                  <span class="spec-lbl">Material</span>
                  <span class="spec-val">{{ product.material }}</span>
                </div>
                <div v-if="product.dimensions" class="spec-row">
                  <span class="spec-icon"><i class="bi bi-rulers"></i></span>
                  <span class="spec-lbl">Dimensiones</span>
                  <span class="spec-val">{{ product.dimensions }}</span>
                </div>
                <div class="spec-row">
                  <span class="spec-icon"><i class="bi bi-box"></i></span>
                  <span class="spec-lbl">Disponibles</span>
                  <span class="spec-val">{{ product.stock }} unidades</span>
                </div>
              </div>
            </div>

            <!-- Acciones -->
            <div class="actions-section">
              <button class="cta-button primary" :disabled="product.stock === 0" @click="reserveProduct">
                <i class="bi bi-whatsapp"></i> Apartar por WhatsApp
              </button>
              <button class="cta-button secondary" @click="contactUs">
                <i class="bi bi-telephone"></i> Llamar
              </button>
            </div>
          </aside>
        </div>

      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axiosConfig from '../config/AxiosConfig.js';
import Navbar from '@/components/Navbar.vue';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

const route = useRoute();

const product = ref({
  id: route.params.id,
  name: '',
  price: 0,
  stock: 0,
  minStock: 0,
  description: '',
  imageUrl: '',
  category: '',
  brand: '',
  color: '',
  material: '',
  dimensions: ''
});

const currentImage = ref('');
const allImages = ref([]);
const loading = ref(true);
const error = ref('');

async function fetchProduct() {
  loading.value = true;
  error.value = '';
  try {
    const res = await axiosConfig.doGet(`/api/products/${route.params.id}`);
    const item = res.data?.data || res.data;
    if (!item) { error.value = 'Producto no encontrado'; return; }

    const imgs = [];
    const addImg = (u) => { if (u && !imgs.includes(u)) imgs.push(u); };
    addImg(item.imageUrl);
    if (Array.isArray(item.imageUrls)) item.imageUrls.forEach(addImg);
    if (Array.isArray(item.product_images)) {
      item.product_images.forEach(img =>
        addImg(typeof img === 'string' ? img : (img.url || img.img_base64 || ''))
      );
    }
    if (Array.isArray(item.images)) {
      item.images.forEach(img =>
        addImg(typeof img === 'string' ? img : (img.url || img.img_base64 || ''))
      );
    }

    product.value = {
      id: item.id,
      name: item.name || '',
      price: item.price || 0,
      stock: item.stock ?? 0,
      minStock: item.minStock || item.min_stock || 0,
      description: item.description || '',
      imageUrl: imgs[0] || '',
      category: item.categoryName || item.category_name || (typeof item.category === 'object' ? item.category?.name : item.category) || '',
      brand: item.brandName || item.brand || '',
      color: item.color || '',
      material: item.material || '',
      dimensions: item.dimensions || ''
    };

    allImages.value = imgs;
    currentImage.value = imgs[0] || '/assets/img/products/default.jpg';
  } catch (e) {
    error.value = 'No se pudo cargar el producto';
    console.error('Error:', e);
  } finally {
    loading.value = false;
  }
}

function reserveProduct() {
  const phone = '5217341532692';
  const msg = `Hola, quiero apartar: ${product.value.name} - $${(product.value.price || 0).toLocaleString('es-MX')}`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
}

function contactUs() {
  window.open('tel:+5217341532692');
}

onMounted(fetchProduct);
</script>

<style scoped>
.detail-page {
  background: linear-gradient(135deg, #faf7f4 0%, #f5f0f3 100%);
  padding: 2rem 0 4rem;
  min-height: 80vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  font-size: 0.9rem;
}
.breadcrumb a { color: #860734; text-decoration: none; }
.breadcrumb a:hover { text-decoration: underline; }
.separator { color: #ccc; }
.current { color: #4a3440; font-weight: 600; }

/* Loading */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
  color: #4a3440;
}
.spinner {
  font-size: 2.5rem;
  color: #860734;
  animation: spin 0.9s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Error */
.error-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
}
.error-state i { font-size: 4rem; color: #860734; opacity: 0.5; margin-bottom: 1rem; display: block; }
.error-state h3 { color: #1f2937; margin-bottom: 1.5rem; }
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #860734;
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  transition: background 0.2s;
}
.back-btn:hover { background: #6a0529; }

/* Layout */
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
  gap: 0.75rem;
  position: sticky;
  top: 1.5rem;
}

.main-image-wrap {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(134, 7, 52, 0.12);
  background: white;
  height: 420px;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.main-image-wrap:hover .main-image { transform: scale(1.03); }

.placeholder-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #f0e8ec;
  color: #860734;
  font-size: 4rem;
  opacity: 0.3;
}

.gallery-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.35rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  letter-spacing: 0.02em;
  z-index: 2;
}
.badge-out { background: rgba(30,30,30,0.75); color: #fff; backdrop-filter: blur(4px); }
.badge-low { background: linear-gradient(135deg, #f59e0b, #fbbf24); color: #fff; box-shadow: 0 2px 8px rgba(245,158,11,0.35); }

.img-counter {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  background: rgba(0,0,0,0.5);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.65rem;
  border-radius: 20px;
  backdrop-filter: blur(4px);
  z-index: 2;
}

.gallery-thumbs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.thumb-btn {
  width: 72px;
  height: 72px;
  border: 2px solid #e0d0e0;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  padding: 0;
  background: none;
  transition: border-color 0.15s, transform 0.15s;
  flex-shrink: 0;
}
.thumb-btn img { width: 100%; height: 100%; object-fit: cover; display: block; }
.thumb-btn:hover { border-color: #860734; transform: translateY(-2px); }
.thumb-btn.active { border-color: #860734; box-shadow: 0 0 0 2px rgba(134,7,52,0.2); }

/* Details panel */
.details {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(134, 7, 52, 0.08);
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.product-badges { display: flex; gap: 0.5rem; flex-wrap: wrap; }

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.75rem;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 600;
}
.badge-cat { background: #f0e8f0; color: #860734; }
.badge-brand { background: #fef9e7; color: #92400e; }

.title {
  font-size: 1.85rem;
  color: #1a0a10;
  margin: 0;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.25;
}

/* Price */
.price-section {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #fdf8ff 0%, #f5eef5 100%);
  border-radius: 14px;
  border: 1px solid rgba(134,7,52,0.1);
  flex-wrap: wrap;
}

.price {
  font-size: 2.25rem;
  color: #860734;
  font-weight: 900;
  margin: 0;
  letter-spacing: -0.04em;
}

.stock-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.9rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
}
.stock-badge.ok { background: rgba(5,150,105,0.12); color: #059669; }
.stock-badge.low { background: rgba(245,158,11,0.15); color: #d97706; }
.stock-badge.out { background: rgba(220,38,38,0.1); color: #dc2626; }

.description {
  color: #4a3440;
  line-height: 1.8;
  margin: 0;
  font-size: 0.95rem;
}

/* Specs */
.specs-block {
  border-top: 1px solid #f0e4ec;
  padding-top: 1.25rem;
}

.specs-title {
  color: #860734;
  margin: 0 0 1rem;
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.specs-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid #ede5ed;
  border-radius: 12px;
  overflow: hidden;
}

.spec-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 1rem;
  border-bottom: 1px solid #f0e8f0;
  font-size: 0.9rem;
  background: white;
  transition: background 0.15s;
}
.spec-row:last-child { border-bottom: none; }
.spec-row:hover { background: #fdf8ff; }

.spec-icon { width: 18px; text-align: center; color: #860734; font-size: 0.85rem; flex-shrink: 0; }
.spec-lbl { color: #888; font-weight: 500; min-width: 90px; flex-shrink: 0; }
.spec-val { color: #1a0a10; font-weight: 700; }

/* Actions */
.actions-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 0.5rem;
}

.cta-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s;
  font-family: inherit;
}

.cta-button.primary {
  background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
  color: white;
  box-shadow: 0 4px 14px rgba(37,211,102,0.25);
}
.cta-button.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(37,211,102,0.35);
}
.cta-button.primary:disabled { background: #ccc; cursor: not-allowed; opacity: 0.6; box-shadow: none; }

.cta-button.secondary {
  background: white;
  color: #860734;
  border: 2px solid #860734;
}
.cta-button.secondary:hover { background: #860734; color: white; }

/* Responsive */
@media (max-width: 900px) {
  .product-container { grid-template-columns: 1fr; gap: 2rem; }
  .gallery { position: static; }
}

@media (max-width: 768px) {
  .main-image-wrap { height: 300px; }
  .title { font-size: 1.5rem; }
  .price { font-size: 1.8rem; }
  .details { padding: 1.5rem; }
}

@media (max-width: 480px) {
  .thumb-btn { width: 60px; height: 60px; }
  .price-section { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
}
</style>
