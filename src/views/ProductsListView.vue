<template>
  <div class="products-list-container">
    <div class="products-header">
      <h1>Productos</h1>
      <p v-if="!authService.isAuthenticated()" class="auth-required">
        <i class="bi bi-lock"></i> Requiere autenticaciÃ³n
      </p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading">
      <div class="spinner">
        <i class="bi bi-arrow-repeat"></i>
      </div>
      <p>Cargando productos...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-message">
      <i class="bi bi-exclamation-circle"></i>
      {{ error }}
      <button @click="fetchProducts" class="retry-btn">Reintentar</button>
    </div>

    <!-- Lista vacÃ­a -->
    <div v-else-if="products.length === 0" class="empty-state">
      <i class="bi bi-inbox"></i>
      <p>No hay productos disponibles</p>
    </div>

    <!-- Tabla de productos -->
    <div v-else class="products-table-wrapper">
      <table class="products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Marca</th>
            <th>CategorÃ­a</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id" :class="{ inactive: !product.isActive }">
            <td class="id-cell">{{ product.id }}</td>
            <td class="name-cell">
              <span class="product-name">{{ product.name }}</span>
              <span v-if="product.stock <= product.minStock" class="low-stock-badge">
                Stock bajo
              </span>
            </td>
            <td>{{ product.brand || '-' }}</td>
            <td>{{ product.category || '-' }}</td>
            <td class="price-cell">${{ formatPrice(product.price) }}</td>
            <td :class="['stock-cell', product.stock <= product.minStock ? 'low' : '']">
              {{ product.stock }}
            </td>
            <td>
              <span :class="['status-badge', product.isActive ? 'active' : 'inactive']">
                {{ product.isActive ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="actions-cell">
              <router-link :to="`/producto-detalle/${product.id}`" class="btn-icon" title="Ver detalles">
                <i class="bi bi-eye"></i>
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { productService } from '../services/products';
import { authService } from '../services/auth';

const products = ref([]);
const loading = ref(false);
const error = ref('');

onMounted(() => {
  fetchProducts();
});

async function fetchProducts() {
  loading.value = true;
  error.value = '';

  try {
    const response = await productService.getAllProducts();
    if (response.data.success) {
      products.value = response.data.data || [];
    } else {
      error.value = 'No se pudieron cargar los productos';
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al cargar productos';
  } finally {
    loading.value = false;
  }
}

function formatPrice(price) {
  return parseFloat(price).toFixed(2);
}
</script>

<style scoped>
.products-list-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.products-header {
  margin-bottom: 2rem;
}

.products-header h1 {
  font-size: 2rem;
  color: var(--ink);
  margin-bottom: 0.5rem;
}

.auth-required {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--ink);
  font-size: 0.9rem;
  font-weight: 600;
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
  flex-shrink: 0;
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

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  color: #9ca3af;
  text-align: center;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

/* Tabla */
.products-table-wrapper {
  background: var(--white);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.products-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.products-table thead {
  background: var(--canvas);
  border-bottom: 2px solid #e5e7eb;
}

.products-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--charcoal);
}

.products-table tbody tr {
  border-bottom: 1px solid var(--border);
  transition: background 0.2s;
}

.products-table tbody tr:hover {
  background: var(--canvas-lifted);
}

.products-table tbody tr.inactive {
  opacity: 0.6;
}

.products-table td {
  padding: 1rem;
  color: var(--ink);
}

.id-cell {
  color: #9ca3af;
  font-family: monospace;
  font-size: 0.9rem;
}

.name-cell {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.product-name {
  font-weight: 600;
  color: var(--ink);
}

.low-stock-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: #fef3c7;
  color: #92400e;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  width: fit-content;
}

.price-cell {
  font-weight: 600;
  color: var(--ink);
}

.stock-cell {
  font-weight: 600;
  color: #10b981;
}

.stock-cell.low {
  color: #dc2626;
}

.status-badge {
  display: inline-flex;
  padding: 0.4rem 0.75rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-badge.active {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.inactive {
  background: var(--canvas);
  color: var(--slate);
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: var(--canvas);
  color: var(--slate);
  transition: all 0.2s;
  cursor: pointer;
  text-decoration: none;
}

.btn-icon:hover {
  background: #667eea;
  color: white;
}

@media (max-width: 768px) {
  .products-list-container {
    padding: 1rem;
  }

  .products-header h1 {
    font-size: 1.5rem;
  }

  .products-table {
    font-size: 0.85rem;
  }

  .products-table th,
  .products-table td {
    padding: 0.75rem 0.5rem;
  }

  .product-name {
    font-size: 0.9rem;
  }
}

@media (max-width: 640px) {
  .products-table-wrapper {
    overflow-x: auto;
  }

  .products-table {
    min-width: 600px;
  }
}
</style>

