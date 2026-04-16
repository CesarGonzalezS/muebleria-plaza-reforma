<template>
  <div class="low-stock-container">
    <div class="low-stock-header">
      <h1>
        <i class="bi bi-exclamation-triangle"></i>
        Productos con Stock Bajo
      </h1>
      <p>Admin Panel - Productos que necesitan reposiciÃ³n</p>
    </div>

    <nav class="admin-nav">
      <router-link to="/admin" class="admin-nav-item"><i class="bi bi-house-door"></i> Muebles</router-link>
      <router-link to="/admin-orders" class="admin-nav-item"><i class="bi bi-bag-check"></i> Ã“rdenes</router-link>
      <router-link to="/customers" class="admin-nav-item"><i class="bi bi-people"></i> Clientes</router-link>
      <router-link to="/reports" class="admin-nav-item"><i class="bi bi-graph-up"></i> Reportes</router-link>
      <router-link to="/inventory-adjust" class="admin-nav-item"><i class="bi bi-boxes"></i> Inventario</router-link>
      <router-link to="/low-stock" class="admin-nav-item"><i class="bi bi-exclamation-triangle"></i> Stock Bajo</router-link>
    </nav>

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
      <i class="bi bi-check-circle"></i>
      <h2>Â¡Todo bien!</h2>
      <p>No hay productos con stock bajo</p>
    </div>

    <!-- Lista de productos -->
    <div v-else class="products-grid">
      <div v-for="product in products" :key="product.id" class="product-card">
        <div class="card-header">
          <h3>{{ product.name }}</h3>
          <span class="low-stock-badge">
            <i class="bi bi-exclamation-triangle"></i>
            Stock: {{ product.stock }} / Min: {{ product.minStock }}
          </span>
        </div>

        <div class="card-body">
          <div class="info-row">
            <label>ID:</label>
            <span>{{ product.id }}</span>
          </div>
          <div class="info-row">
            <label>Precio:</label>
            <span class="price">${{ formatPrice(product.price) }}</span>
          </div>
          <div class="info-row">
            <label>Stock Actual:</label>
            <span :class="['stock-value', product.stock <= product.minStock ? 'critical' : '']">
              {{ product.stock }} unidades
            </span>
          </div>
          <div class="info-row">
            <label>Stock MÃ­nimo:</label>
            <span>{{ product.minStock }} unidades</span>
          </div>
          <div class="info-row">
            <label>Falta por Reabastecer:</label>
            <span class="needed">{{ product.minStock - product.stock }} unidades</span>
          </div>
        </div>

        <div class="card-footer">
          <button class="btn-restock">
            <i class="bi bi-arrow-repeat"></i> Reabastecer
          </button>
          <router-link :to="`/producto-detalle/${product.id}`" class="btn-view">
            <i class="bi bi-eye"></i> Ver
          </router-link>
        </div>
      </div>
    </div>

    <!-- Resumen -->
    <div v-if="products.length > 0" class="summary">
      <div class="summary-item">
        <span class="label">Total de productos bajo stock:</span>
        <span class="value">{{ products.length }}</span>
      </div>
      <div class="summary-item">
        <span class="label">Total de unidades faltantes:</span>
        <span class="value">{{ calculateTotalNeeded() }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { productService } from '../services/products';
import { authService } from '../services/auth';

const router = useRouter();
const products = ref([]);
const loading = ref(false);
const error = ref('');

onMounted(() => {
  // Verificar que sea admin
  if (!authService.isAuthenticated()) {
    router.push('/login');
    return;
  }

  fetchProducts();
});

async function fetchProducts() {
  loading.value = true;
  error.value = '';

  try {
    const response = await productService.getLowStockProducts();
    if (response.data.success) {
      products.value = response.data.data || [];
    } else {
      error.value = 'No se pudieron cargar los productos';
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al cargar productos con stock bajo';
  } finally {
    loading.value = false;
  }
}

function formatPrice(price) {
  return parseFloat(price).toFixed(2);
}

function calculateTotalNeeded() {
  return products.value.reduce((total, product) => {
    const needed = Math.max(0, product.minStock - product.stock);
    return total + needed;
  }, 0);
}
</script>

<style scoped>
.low-stock-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.low-stock-header {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 12px;
  border-left: 4px solid #f59e0b;
}

.low-stock-header h1 {
  font-size: 1.8rem;
  color: #92400e;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.low-stock-header h1 i {
  font-size: 2rem;
}

.low-stock-header p {
  color: #b45309;
  margin: 0.5rem 0 0;
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
  color: #f59e0b;
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

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  background: #d1fae5;
  border-radius: 12px;
  text-align: center;
  color: #065f46;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state h2 {
  margin: 0;
  font-size: 1.5rem;
}

.empty-state p {
  margin: 0.5rem 0 0;
  opacity: 0.8;
}

/* Grid de productos */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.product-card {
  background: var(--white);
  border: 2px solid #fca;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
  border-color: #f59e0b;
}

.card-header {
  background: #fef3c7;
  padding: 1rem;
  border-bottom: 1px solid #fde68a;
}

.card-header h3 {
  margin: 0;
  color: #92400e;
  font-size: 1.1rem;
}

.low-stock-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #fed7aa;
  color: #92400e;
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: 0.5rem;
}

.card-body {
  padding: 1rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border);
}

.info-row:last-child {
  border-bottom: none;
}

.info-row label {
  color: var(--slate);
  font-weight: 600;
  font-size: 0.9rem;
}

.info-row span {
  color: var(--ink);
  font-weight: 600;
}

.price {
  color: var(--ink);
  font-size: 1.1rem;
}

.stock-value {
  color: #10b981;
  font-size: 1rem;
}

.stock-value.critical {
  color: #dc2626;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.needed {
  background: #fee;
  color: #c33;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 700;
}

.card-footer {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--canvas-lifted);
  border-top: 1px solid #e5e7eb;
}

.btn-restock,
.btn-view {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  text-decoration: none;
}

.btn-restock {
  background: #f59e0b;
  color: white;
}

.btn-restock:hover {
  background: #d97706;
}

.btn-view {
  background: #e5e7eb;
  color: var(--ink);
}

.btn-view:hover {
  background: #d1d5db;
}

/* Summary */
.summary {
  background: var(--white);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  border-top: 4px solid #f59e0b;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summary-item .label {
  color: var(--slate);
  font-size: 0.9rem;
  font-weight: 600;
}

.summary-item .value {
  color: var(--ink);
  font-size: 1.5rem;
  font-weight: 700;
  color: #f59e0b;
}

@media (max-width: 768px) {
  .low-stock-container { padding: 1rem; }
  .low-stock-header h1 { font-size: 1.3rem; }
  .products-grid { grid-template-columns: 1fr; }
}
.admin-nav { display:flex; gap:.25rem; padding:.75rem 2rem; background:#fff; border-bottom:2px solid #e9ecef; flex-wrap:wrap; }
.admin-nav-item { display:flex; align-items:center; gap:.4rem; padding:.5rem 1rem; border-radius:8px; color:#555; font-weight:500; font-size:.9rem; text-decoration:none; transition:all .2s; }
.admin-nav-item:hover { background:#f0f4ff; color:#007bff; }
.admin-nav-item.router-link-active { background:#007bff; color:#fff; }
</style>

