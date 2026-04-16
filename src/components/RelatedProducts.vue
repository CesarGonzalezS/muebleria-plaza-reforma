<template>
  <div class="related-products-container">
    <h2 class="section-title">
      <i class="bi bi-link-45deg"></i>
      Productos Relacionados
    </h2>

    <!-- Loading -->
    <div v-if="loading" class="loading-small">
      <i class="bi bi-arrow-repeat"></i>
      Cargando...
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-small">
      {{ error }}
    </div>

    <!-- Grid de productos -->
    <div v-else-if="products.length > 0" class="related-grid">
      <div v-for="product in products" :key="product.id" class="related-card">
        <router-link :to="`/producto-detalle/${product.id}`" class="card-link">
          <div class="card-header">
            <span class="category-badge">{{ product.category }}</span>
            <span v-if="product.stock <= product.minStock" class="stock-badge">
              Stock bajo
            </span>
          </div>

          <h3>{{ product.name }}</h3>

          <div class="card-info">
            <span class="price">${{ formatPrice(product.price) }}</span>
            <span :class="['stock', product.stock > 0 ? 'available' : 'unavailable']">
              {{ product.stock > 0 ? 'Disponible' : 'Sin Stock' }}
            </span>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="empty-related">
      <p>No hay productos relacionados</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { productService } from '../services/products';

const props = defineProps({
  productId: {
    type: [String, Number],
    required: true
  },
  limit: {
    type: Number,
    default: 4
  }
});

const products = ref([]);
const loading = ref(false);
const error = ref('');

onMounted(() => {
  fetchRelated();
});

async function fetchRelated() {
  loading.value = true;
  error.value = '';

  try {
    const response = await productService.getRelatedProducts(props.productId, props.limit);
    if (response.data.success) {
      products.value = response.data.data || [];
    }
  } catch (err) {
    error.value = 'Error al cargar productos relacionados';
  } finally {
    loading.value = false;
  }
}

function formatPrice(price) {
  return parseFloat(price).toFixed(2);
}
</script>

<style scoped>
.related-products-container {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid #e5e7eb;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--ink);
  font-size: 1.3rem;
  margin: 0 0 1.5rem;
}

.section-title i {
  color: var(--ink);
}

/* Loading */
.loading-small {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #9ca3af;
  padding: 2rem 0;
  font-size: 0.9rem;
}

.loading-small i {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error */
.error-small {
  background: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: var(--r-card);
  font-size: 0.9rem;
}

/* Grid */
.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.related-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--r-card);
  overflow: hidden;
  transition: all 0.3s;
}

.related-card:hover {
  border-color: var(--ink);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.card-link {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem;
  text-decoration: none;
  color: inherit;
}

.card-header {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.category-badge {
  display: inline-flex;
  background: #bfdbfe;
  color: #1e40af;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.stock-badge {
  display: inline-flex;
  background: #fef3c7;
  color: #92400e;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.related-card h3 {
  color: var(--ink);
  font-size: 1rem;
  margin: 0 0 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
}

.card-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.price {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--ink);
}

.stock {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.stock.available {
  background: #d1fae5;
  color: #065f46;
}

.stock.unavailable {
  background: #fee2e2;
  color: #991b1b;
}

/* Empty */
.empty-related {
  text-align: center;
  padding: 2rem;
  color: #9ca3af;
}

@media (max-width: 768px) {
  .related-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}
</style>

