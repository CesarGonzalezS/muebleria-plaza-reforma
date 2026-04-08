<template>
  <div class="orders-container">
    <div class="orders-header">
      <h1>
        <i class="bi bi-receipt"></i>
        Mis Órdenes
      </h1>
      <p>Historial de compras</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading">
      <div class="spinner">
        <i class="bi bi-arrow-repeat"></i>
      </div>
      <p>Cargando órdenes...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-message">
      <i class="bi bi-exclamation-circle"></i>
      {{ error }}
      <button @click="fetchOrders" class="retry-btn">Reintentar</button>
    </div>

    <!-- Sin órdenes -->
    <div v-else-if="orders.length === 0" class="empty-orders">
      <i class="bi bi-inbox"></i>
      <p>No tienes órdenes</p>
      <router-link to="/productos-lista" class="btn-shop">
        <i class="bi bi-bag-plus"></i> Comenzar a comprar
      </router-link>
    </div>

    <!-- Lista de órdenes -->
    <div v-else class="orders-grid">
      <div v-for="order in orders" :key="order.id" class="order-card">
        <div class="order-header">
          <div class="order-id-status">
            <h3>Orden #{{ order.id }}</h3>
            <span :class="['status-badge', order.status.toLowerCase()]">
              {{ formatStatus(order.status) }}
            </span>
          </div>
          <div class="order-amount">
            <span class="label">Total</span>
            <span class="amount">${{ formatPrice(order.totalAmount) }}</span>
          </div>
        </div>

        <div class="order-meta">
          <div class="meta-item">
            <span class="label">Fecha</span>
            <span>{{ formatDate(order.createdAt) }}</span>
          </div>
          <div class="meta-item">
            <span class="label">Cliente</span>
            <span>ID: {{ order.customerId }}</span>
          </div>
          <div class="meta-item">
            <span class="label">Items</span>
            <span>{{ order.items?.length || 0 }}</span>
          </div>
        </div>

        <div class="order-actions">
          <router-link :to="`/order-detail/${order.id}`" class="btn-view">
            <i class="bi bi-eye"></i> Ver Detalles
          </router-link>
        </div>
      </div>
    </div>

    <!-- Resumen -->
    <div v-if="orders.length > 0" class="orders-summary">
      <div class="summary-item">
        <span class="label">Total de Órdenes:</span>
        <span class="value">{{ orders.length }}</span>
      </div>
      <div class="summary-item">
        <span class="label">Monto Total Gastado:</span>
        <span class="value">${{ formatPrice(totalSpent) }}</span>
      </div>
      <div class="summary-item">
        <span class="label">Promedio por Orden:</span>
        <span class="value">${{ formatPrice(averageOrder) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { orderService } from '../services/orders';

const orders = ref([]);
const loading = ref(false);
const error = ref('');

onMounted(() => {
  fetchOrders();
});

async function fetchOrders() {
  loading.value = true;
  error.value = '';

  try {
    const response = await orderService.listOrders();
    if (response.data.success) {
      orders.value = response.data.data || [];
    }
  } catch (err) {
    error.value = 'Error al cargar órdenes';
  } finally {
    loading.value = false;
  }
}

const totalSpent = computed(() => {
  return orders.value.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
});

const averageOrder = computed(() => {
  if (orders.value.length === 0) return 0;
  return totalSpent.value / orders.value.length;
});

function formatStatus(status) {
  const statuses = {
    'PENDING': 'Pendiente',
    'PROCESSING': 'Procesando',
    'SHIPPED': 'Enviado',
    'DELIVERED': 'Entregado',
    'CANCELLED': 'Cancelado'
  };
  return statuses[status] || status;
}

function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES');
}

function formatPrice(price) {
  return parseFloat(price).toFixed(2);
}
</script>

<style scoped>
.orders-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.orders-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.orders-header h1 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #1f2937;
  margin: 0;
  font-size: 1.8rem;
}

.orders-header h1 i {
  color: #667eea;
}

.orders-header p {
  color: #6b7280;
  margin: 0.5rem 0 0;
}

/* Loading */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  color: #6b7280;
}

.spinner {
  font-size: 3rem;
  color: #667eea;
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
  border-radius: 8px;
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
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.retry-btn:hover {
  background: #a00;
}

/* Empty Orders */
.empty-orders {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  background: #f9fafb;
  border-radius: 12px;
  text-align: center;
  color: #9ca3af;
}

.empty-orders i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.btn-shop {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  margin-top: 1rem;
  transition: all 0.3s;
}

.btn-shop:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

/* Orders Grid */
.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.order-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  border-left: 4px solid #667eea;
}

.order-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.order-id-status {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.order-id-status h3 {
  margin: 0;
  color: #1f2937;
  font-size: 1.1rem;
}

.status-badge {
  display: inline-flex;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  width: fit-content;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.processing {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.shipped {
  background: #e0e7ff;
  color: #3730a3;
}

.status-badge.delivered {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.order-amount {
  text-align: right;
}

.order-amount .label {
  display: block;
  color: #9ca3af;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.order-amount .amount {
  display: block;
  color: #667eea;
  font-size: 1.5rem;
  font-weight: 700;
}

.order-meta {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.meta-item .label {
  color: #9ca3af;
  font-size: 0.8rem;
  font-weight: 600;
}

.meta-item span:last-child {
  color: #1f2937;
  font-weight: 500;
}

.order-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-view {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.btn-view:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

/* Summary */
.orders-summary {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  border-top: 4px solid #667eea;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summary-item .label {
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 600;
}

.summary-item .value {
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
}

@media (max-width: 768px) {
  .orders-container {
    padding: 1rem;
  }

  .orders-grid {
    grid-template-columns: 1fr;
  }

  .order-meta {
    grid-template-columns: repeat(2, 1fr);
  }

  .orders-summary {
    grid-template-columns: 1fr;
  }
}
</style>

