<template>
  <div class="product-detail-container">
    <!-- Back Button -->
    <router-link to="/productos-lista" class="back-link">
      <i class="bi bi-arrow-left"></i> Volver a Productos
    </router-link>

    <!-- Loading -->
    <div v-if="loading" class="loading">
      <div class="spinner">
        <i class="bi bi-arrow-repeat"></i>
      </div>
      <p>Cargando producto...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-message">
      <i class="bi bi-exclamation-circle"></i>
      {{ error }}
      <button @click="goBack" class="retry-btn">Volver</button>
    </div>

    <!-- Detalle -->
    <div v-else-if="product" class="product-detail">
      <div class="detail-grid">
        <!-- Imagen -->
        <div class="detail-image">
          <img v-if="product.imageUrl" :src="product.imageUrl" :alt="product.name" />
          <div v-else class="placeholder-image">
            <i class="bi bi-image"></i>
          </div>
        </div>

        <!-- InformaciÃ³n -->
        <div class="detail-info">
          <!-- Nombre y CategorÃ­a -->
          <div class="detail-header">
            <h1>{{ product.name }}</h1>
            <div class="detail-badges">
              <span class="badge category">{{ product.category }}</span>
              <span v-if="!product.isActive" class="badge inactive">Inactivo</span>
              <span v-if="product.stock <= product.minStock" class="badge low-stock">
                Stock bajo
              </span>
            </div>
          </div>

          <!-- DescripciÃ³n -->
          <p class="description">{{ product.description }}</p>

          <!-- Marca -->
          <div class="detail-row" v-if="product.brand">
            <label>Marca:</label>
            <span>{{ product.brand }}</span>
          </div>

          <!-- Precios -->
          <div class="detail-row prices">
            <div class="price-item">
              <label>Precio Venta:</label>
              <span class="price">${{ formatPrice(product.price) }}</span>
            </div>
            <div class="price-item">
              <label>Costo:</label>
              <span class="cost">${{ formatPrice(product.costPrice) }}</span>
            </div>
            <div class="price-item">
              <label>Ganancia:</label>
              <span class="profit">{{ calculateProfit() }}%</span>
            </div>
          </div>

          <!-- Stock -->
          <div class="detail-row stock">
            <label>Stock:</label>
            <div class="stock-info">
              <span :class="['stock-value', product.stock <= product.minStock ? 'low' : '']">
                {{ product.stock }} unidades
              </span>
              <span class="min-stock">MÃ­nimo: {{ product.minStock }}</span>
            </div>
          </div>

          <!-- Botones de acciÃ³n -->
          <div class="detail-actions">
            <button class="btn-primary">
              <i class="bi bi-cart"></i> Agregar al Carrito
            </button>
            <button class="btn-secondary">
              <i class="bi bi-heart"></i> Favorito
            </button>
          </div>
        </div>
      </div>

      <!-- Especificaciones adicionales -->
      <div class="detail-specs">
        <h3>InformaciÃ³n Adicional</h3>
        <div class="specs-grid">
          <div class="spec-item">
            <span class="spec-label">ID del Producto</span>
            <span class="spec-value">{{ product.id }}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">CategorÃ­a</span>
            <span class="spec-value">{{ product.category }}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Estado</span>
            <span class="spec-value">{{ product.isActive ? 'Disponible' : 'No disponible' }}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Stock Total</span>
            <span class="spec-value">{{ product.stock }}</span>
          </div>
        </div>
      </div>

      <!-- Productos relacionados -->
      <RelatedProducts :productId="product.id" :limit="4" />
    </div>

    <!-- No encontrado -->
    <div v-else class="not-found">
      <i class="bi bi-inbox"></i>
      <p>Producto no encontrado</p>
      <router-link to="/productos-lista" class="btn-primary">
        Volver a Productos
      </router-link>
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

onMounted(() => {
  fetchProduct();
});

async function fetchProduct() {
  const productId = route.params.id;

  if (!productId) {
    error.value = 'ID de producto no vÃ¡lido';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const response = await productService.getProductById(productId);
    if (response.data.success) {
      product.value = response.data.data;
    } else {
      error.value = 'No se pudo cargar el producto';
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al cargar el producto';
  } finally {
    loading.value = false;
  }
}

function formatPrice(price) {
  return parseFloat(price).toFixed(2);
}

function calculateProfit() {
  if (!product.value) return 0;
  const profit = ((product.value.price - product.value.costPrice) / product.value.costPrice * 100);
  return profit.toFixed(1);
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

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--ink);
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 2rem;
  transition: all 0.2s;
}

.back-link:hover {
  gap: 1rem;
  color: #764ba2;
}

/* Loading */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  color: var(--slate);
}

.spinner {
  font-size: 3rem;
  color: var(--ink);
  margin-bottom: 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error */
.error-message {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #fee;
  border: 2px solid #fca;
  color: #c33;
  padding: 1rem;
  border-radius: var(--r-card);
  margin-bottom: 2rem;
}

.error-message i {
  font-size: 1.5rem;
}

.retry-btn {
  margin-left: auto;
  background: #c33;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.retry-btn:hover {
  background: #a00;
}

/* Product Detail */
.product-detail {
  background: var(--white);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border);
  padding-bottom: 2rem;
}

.detail-image {
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-image img {
  max-width: 100%;
  height: auto;
  border-radius: var(--r-card);
  object-fit: cover;
}

.placeholder-image {
  width: 300px;
  height: 300px;
  background: var(--canvas);
  border-radius: var(--r-card);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: #d1d5db;
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-header h1 {
  color: var(--ink);
  font-size: 2rem;
  margin: 0;
}

.detail-badges {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
}

.badge.category {
  background: #bfdbfe;
  color: #1e40af;
}

.badge.inactive {
  background: var(--canvas);
  color: var(--slate);
}

.badge.low-stock {
  background: #fee2e2;
  color: #991b1b;
}

.description {
  color: var(--slate);
  line-height: 1.6;
  margin: 0;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border);
}

.detail-row label {
  font-weight: 600;
  color: var(--charcoal);
}

.detail-row span {
  color: var(--ink);
}

.detail-row.prices {
  flex-wrap: wrap;
  gap: 1rem;
}

.price-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 150px;
}

.price-item label {
  font-size: 0.9rem;
  color: var(--slate);
}

.price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--ink);
}

.cost {
  font-size: 1rem;
  color: #9ca3af;
  text-decoration: line-through;
}

.profit {
  font-size: 1rem;
  font-weight: 600;
  color: #10b981;
}

.detail-row.stock {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.stock-info {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.stock-value {
  font-size: 1.2rem;
  font-weight: 600;
  color: #10b981;
}

.stock-value.low {
  color: #dc2626;
}

.min-stock {
  color: #9ca3af;
  font-size: 0.9rem;
}

.detail-actions {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: var(--r-card);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-decoration: none;
}

.btn-primary {
  background: var(--canvas);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: var(--canvas);
  color: var(--charcoal);
  border: 2px solid #e5e7eb;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

/* Specs */
.detail-specs {
  margin-top: 2rem;
}

.detail-specs h3 {
  color: var(--ink);
  margin-bottom: 1rem;
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.spec-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--canvas-lifted);
  border-radius: var(--r-card);
}

.spec-label {
  color: var(--slate);
  font-size: 0.9rem;
  font-weight: 600;
}

.spec-value {
  color: var(--ink);
  font-weight: 600;
}

/* Not Found */
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  color: #9ca3af;
  text-align: center;
}

.not-found i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

@media (max-width: 768px) {
  .product-detail-container {
    padding: 1rem;
  }

  .detail-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .detail-header h1 {
    font-size: 1.5rem;
  }

  .detail-actions {
    flex-direction: column;
  }

  .price-item {
    flex: auto;
  }
}
</style>

