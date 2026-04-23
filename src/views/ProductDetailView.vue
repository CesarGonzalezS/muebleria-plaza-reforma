<template>
  <div class="product-detail-container">

    <button @click="goBack" class="back-link">
      <i class="bi bi-arrow-left"></i> Volver
    </button>

    <!-- Loading -->
    <div v-if="loading" class="loading">
      <div class="spinner"><i class="bi bi-arrow-repeat"></i></div>
      <p>Cargando producto...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-state">
      <i class="bi bi-exclamation-circle"></i>
      <span>{{ error }}</span>
      <button @click="goBack" class="retry-btn">Volver</button>
    </div>

    <!-- Detalle -->
    <div v-else-if="product" class="product-detail">
      <div class="detail-grid">

        <!-- Galería -->
        <div class="detail-gallery">
          <div class="gallery-main">
            <img
              :src="selectedImage || '/assets/img/products/default.jpg'"
              :alt="product.name"
              class="main-image"
            />
            <span v-if="product.stock === 0" class="gallery-badge badge-out">
              <i class="bi bi-x-circle"></i> Agotado
            </span>
            <span v-else-if="product.stock > 0 && product.stock <= product.minStock" class="gallery-badge badge-low">
              <i class="bi bi-exclamation-circle"></i> Últimas unidades
            </span>
            <span v-if="allImages.length > 1" class="img-counter">{{ allImages.indexOf(selectedImage) + 1 }} / {{ allImages.length }}</span>
          </div>

          <div v-if="allImages.length > 1" class="gallery-thumbs">
            <button
              v-for="(img, idx) in allImages"
              :key="idx"
              type="button"
              class="thumb-btn"
              :class="{ active: img === selectedImage }"
              @click="selectedImage = img"
            >
              <img :src="img" :alt="`Vista ${idx + 1}`" />
            </button>
          </div>
        </div>

        <!-- Info -->
        <div class="detail-info">
          <div class="detail-header">
            <div class="detail-badges">
              <span v-if="product.category" class="badge badge-category">
                <i class="bi bi-tag"></i> {{ product.category }}
              </span>
              <span v-if="product.brand" class="badge badge-brand">
                <i class="bi bi-award"></i> {{ product.brand }}
              </span>
              <span v-if="product.isActive === false" class="badge badge-inactive">Inactivo</span>
            </div>
            <h1>{{ product.name }}</h1>
          </div>

          <p v-if="product.description" class="description">{{ product.description }}</p>

          <!-- Precio -->
          <div class="price-section">
            <div class="price-main">${{ formatPrice(product.price) }}</div>
            <div v-if="product.costPrice" class="price-meta">
              <span class="price-cost">Costo: ${{ formatPrice(product.costPrice) }}</span>
              <span class="price-profit">
                <i class="bi bi-graph-up-arrow"></i> {{ calculateProfit() }}% margen
              </span>
            </div>
          </div>

          <!-- Specs inline -->
          <div class="specs-inline" v-if="product.color || product.material || product.dimensions">
            <div v-if="product.color" class="spec-row">
              <i class="bi bi-palette"></i>
              <span class="spec-lbl">Color</span>
              <span class="spec-val">{{ product.color }}</span>
            </div>
            <div v-if="product.material" class="spec-row">
              <i class="bi bi-tree"></i>
              <span class="spec-lbl">Material</span>
              <span class="spec-val">{{ product.material }}</span>
            </div>
            <div v-if="product.dimensions" class="spec-row">
              <i class="bi bi-rulers"></i>
              <span class="spec-lbl">Dimensiones</span>
              <span class="spec-val">{{ product.dimensions }}</span>
            </div>
          </div>

          <!-- Stock -->
          <div class="stock-section">
            <div class="stock-row">
              <i class="bi bi-box"></i>
              <span :class="['stock-val', product.stock === 0 ? 'out' : product.stock <= product.minStock ? 'low' : 'ok']">
                {{ product.stock }} unidades disponibles
              </span>
            </div>
            <div v-if="product.minStock" class="stock-min">
              <i class="bi bi-exclamation-triangle"></i> Mínimo: {{ product.minStock }} uds.
            </div>
          </div>

          <div class="detail-actions">
            <button class="btn-fav" type="button">
              <i class="bi bi-heart"></i> Guardar en favoritos
            </button>
          </div>
        </div>
      </div>

      <!-- Especificaciones completas -->
      <div class="detail-specs">
        <h3><i class="bi bi-list-ul"></i> Especificaciones del producto</h3>
        <div class="specs-grid">
          <div class="spec-item">
            <span class="spec-label"><i class="bi bi-hash"></i> ID</span>
            <span class="spec-value">{{ product.id }}</span>
          </div>
          <div v-if="product.category" class="spec-item">
            <span class="spec-label"><i class="bi bi-tag"></i> Categoría</span>
            <span class="spec-value">{{ product.category }}</span>
          </div>
          <div v-if="product.brand" class="spec-item">
            <span class="spec-label"><i class="bi bi-award"></i> Marca</span>
            <span class="spec-value">{{ product.brand }}</span>
          </div>
          <div v-if="product.color" class="spec-item">
            <span class="spec-label"><i class="bi bi-palette"></i> Color</span>
            <span class="spec-value">{{ product.color }}</span>
          </div>
          <div v-if="product.material" class="spec-item">
            <span class="spec-label"><i class="bi bi-tree"></i> Material</span>
            <span class="spec-value">{{ product.material }}</span>
          </div>
          <div v-if="product.dimensions" class="spec-item">
            <span class="spec-label"><i class="bi bi-rulers"></i> Dimensiones</span>
            <span class="spec-value">{{ product.dimensions }}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label"><i class="bi bi-box"></i> Stock actual</span>
            <span class="spec-value">{{ product.stock }} uds.</span>
          </div>
          <div v-if="product.minStock" class="spec-item">
            <span class="spec-label"><i class="bi bi-exclamation-triangle"></i> Stock mínimo</span>
            <span class="spec-value">{{ product.minStock }} uds.</span>
          </div>
          <div class="spec-item">
            <span class="spec-label"><i class="bi bi-check-circle"></i> Estado</span>
            <span class="spec-value">{{ product.isActive !== false ? 'Disponible' : 'No disponible' }}</span>
          </div>
        </div>
      </div>

      <RelatedProducts :productId="product.id" :limit="4" />
    </div>

    <!-- No encontrado -->
    <div v-else class="not-found">
      <i class="bi bi-inbox"></i>
      <p>Producto no encontrado</p>
      <button @click="goBack" class="retry-btn">Volver</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { productService } from '../services/products';
import RelatedProducts from '../components/RelatedProducts.vue';

const route = useRoute();
const router = useRouter();

const product = ref(null);
const loading = ref(false);
const error = ref('');
const selectedImage = ref('');
const allImages = ref([]);

onMounted(() => {
  fetchProduct();
});

async function fetchProduct() {
  const productId = route.params.id;
  if (!productId) { error.value = 'ID de producto no válido'; return; }
  loading.value = true;
  error.value = '';
  try {
    const response = await productService.getProductById(productId);
    const raw = response.data?.data || response.data;
    if (!raw) { error.value = 'No se pudo cargar el producto'; return; }

    const p = { ...raw };
    p.category = p.categoryName || p.category_name
      || (typeof p.category === 'object' ? p.category?.name : p.category) || '';
    p.brand = p.brandName || p.brand || '';
    p.costPrice = p.costPrice || p.cost_price || 0;
    p.minStock = p.minStock || p.min_stock || 0;
    p.color = p.color || '';
    p.material = p.material || '';
    p.dimensions = p.dimensions || '';
    p.isActive = p.isActive !== undefined ? p.isActive : (p.is_active !== undefined ? p.is_active : true);

    const imgs = [];
    const addImg = (u) => { if (u && !imgs.includes(u)) imgs.push(u); };
    addImg(p.imageUrl);
    if (Array.isArray(p.imageUrls)) p.imageUrls.forEach(addImg);
    if (Array.isArray(p.product_images)) {
      p.product_images.forEach(img =>
        addImg(typeof img === 'string' ? img : (img.url || img.img_base64 || ''))
      );
    }
    if (Array.isArray(p.images)) {
      p.images.forEach(img =>
        addImg(typeof img === 'string' ? img : (img.url || img.img_base64 || ''))
      );
    }

    product.value = p;
    allImages.value = imgs;
    selectedImage.value = imgs[0] || '';
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al cargar el producto';
  } finally {
    loading.value = false;
  }
}

function formatPrice(price) {
  if (!price) return '0.00';
  return parseFloat(price).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function calculateProfit() {
  if (!product.value?.costPrice || product.value.costPrice <= 0) return '0.0';
  return ((product.value.price - product.value.costPrice) / product.value.costPrice * 100).toFixed(1);
}

function goBack() {
  router.back();
}
</script>

<style scoped>
.product-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Back */
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--ink);
  background: none;
  border: 1.5px solid var(--border);
  padding: 0.45rem 1rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 1.75rem;
  transition: all 0.2s;
  font-family: var(--font);
}
.back-link:hover { background: var(--canvas); border-color: var(--ink); }

/* Loading */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: var(--slate);
  gap: 1rem;
}
.spinner {
  font-size: 2.5rem;
  color: #860734;
  animation: spin 0.9s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Error */
.error-state {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #fff5f5;
  border: 1.5px solid #fca5a5;
  color: #dc2626;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  font-weight: 500;
}
.error-state i { font-size: 1.4rem; }
.retry-btn {
  margin-left: auto;
  background: #860734;
  color: white;
  border: none;
  padding: 0.45rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  font-family: var(--font);
  transition: opacity 0.15s;
}
.retry-btn:hover { opacity: 0.85; }

/* Card */
.product-detail {
  background: var(--white);
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(134, 7, 52, 0.07), 0 1px 4px rgba(0,0,0,0.06);
  padding: 2rem;
}

/* Grid */
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 2.5rem;
  padding-bottom: 2.5rem;
  border-bottom: 1px solid var(--border);
}

/* Gallery */
.detail-gallery {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.gallery-main {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(135deg, #f4e8f4 0%, #e8d8e8 100%);
  aspect-ratio: 4 / 3;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.gallery-main:hover .main-image { transform: scale(1.03); }

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
}
.badge-out { background: rgba(30,30,30,0.75); color: #fff; backdrop-filter: blur(4px); }
.badge-low { background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%); color: #fff; box-shadow: 0 2px 8px rgba(245,158,11,0.35); }

.img-counter {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  background: rgba(0,0,0,0.5);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  backdrop-filter: blur(4px);
}

.gallery-thumbs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.thumb-btn {
  width: 72px;
  height: 72px;
  border: 2px solid var(--dust);
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

/* Info */
.detail-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-header { display: flex; flex-direction: column; gap: 0.75rem; }

.detail-badges { display: flex; gap: 0.5rem; flex-wrap: wrap; }

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.7rem;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 600;
}
.badge-category { background: #f0e8f0; color: #860734; }
.badge-brand { background: #fef9e7; color: #92400e; }
.badge-inactive { background: var(--canvas); color: var(--slate); }

.detail-header h1 {
  color: var(--ink);
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.03em;
  line-height: 1.25;
}

.description {
  color: var(--charcoal);
  line-height: 1.7;
  margin: 0;
  font-size: 0.95rem;
}

/* Price */
.price-section {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, #fdf8ff 0%, #f5eef5 100%);
  border-radius: 14px;
  border: 1px solid rgba(134,7,52,0.1);
}
.price-main {
  font-size: 2.25rem;
  font-weight: 900;
  color: #860734;
  letter-spacing: -0.04em;
}
.price-meta { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
.price-cost { font-size: 0.875rem; color: var(--slate); }
.price-profit {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #059669;
  background: #d1fae5;
  padding: 0.15rem 0.5rem;
  border-radius: 8px;
}

/* Specs inline */
.specs-inline {
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}
.spec-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 1rem;
  border-bottom: 1px solid var(--border);
  font-size: 0.9rem;
}
.spec-row:last-child { border-bottom: none; }
.spec-row i { color: #860734; width: 16px; text-align: center; font-size: 0.875rem; }
.spec-lbl { color: var(--slate); font-weight: 500; min-width: 90px; }
.spec-val { color: var(--ink); font-weight: 600; }

/* Stock */
.stock-section {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.stock-row { display: flex; align-items: center; gap: 0.6rem; }
.stock-row i { color: var(--slate); }
.stock-val { font-weight: 700; font-size: 1rem; }
.stock-val.ok { color: #059669; }
.stock-val.low { color: #d97706; }
.stock-val.out { color: #dc2626; }
.stock-min { font-size: 0.8rem; color: var(--slate); display: flex; align-items: center; gap: 0.35rem; padding-left: 1.4rem; }

/* Actions */
.detail-actions { display: flex; gap: 0.75rem; }
.btn-fav {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1.5px solid var(--ink);
  background: transparent;
  color: var(--ink);
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  font-family: var(--font);
}
.btn-fav:hover { background: var(--canvas); }

/* Specs grid */
.detail-specs { margin-top: 0.5rem; }
.detail-specs h3 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--ink);
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  letter-spacing: -0.02em;
}
.detail-specs h3 i { color: #860734; }

.specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.75rem;
}
.spec-item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.9rem 1rem;
  background: var(--canvas-lifted);
  border-radius: 12px;
  border: 1px solid var(--border);
}
.spec-label {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--slate);
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.spec-label i { color: #860734; font-size: 0.75rem; }
.spec-value { color: var(--ink); font-weight: 700; font-size: 0.95rem; }

/* Not found */
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: var(--slate);
  text-align: center;
  gap: 1rem;
}
.not-found i { font-size: 3rem; opacity: 0.35; }
.not-found p { margin: 0; font-size: 1rem; }

/* Responsive */
@media (max-width: 900px) {
  .detail-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .product-detail-container { padding: 1rem; }
  .product-detail { padding: 1.25rem; }
  .detail-header h1 { font-size: 1.4rem; }
  .price-main { font-size: 1.75rem; }
  .specs-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 480px) {
  .specs-grid { grid-template-columns: 1fr 1fr; }
  .thumb-btn { width: 60px; height: 60px; }
}
</style>
