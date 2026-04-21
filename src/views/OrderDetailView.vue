<template>
  <div class="order-detail-container">
    <router-link to="/my-orders" class="back-link">
      <i class="bi bi-arrow-left"></i> Volver a Mis Ã“rdenes
    </router-link>

    <!-- Loading -->
    <div v-if="loading" class="loading">
      <div class="spinner">
        <i class="bi bi-arrow-repeat"></i>
      </div>
      <p>Cargando orden...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-message">
      <i class="bi bi-exclamation-circle"></i>
      {{ error }}
      <button @click="fetchOrder" class="retry-btn">Reintentar</button>
    </div>

    <!-- Detalle -->
    <div v-else-if="order" class="order-detail">
      <!-- Header -->
      <div class="detail-header">
        <div class="header-info">
          <h1>Orden #{{ order.id }}</h1>
          <div class="header-meta">
            <span :class="['status-badge', order.status.toLowerCase()]">
              {{ formatStatus(order.status) }}
            </span>
            <span class="date">{{ formatDate(order.createdAt) }}</span>
          </div>
        </div>
        <div class="header-total">
          <span class="label">Monto Total</span>
          <span class="amount">${{ formatPrice(order.totalAmount) }}</span>
        </div>
      </div>

      <!-- InformaciÃ³n General -->
      <div class="info-section">
        <h2>InformaciÃ³n de la Orden</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">ID de Orden</span>
            <span class="value">{{ order.id }}</span>
          </div>
          <div class="info-item">
            <span class="label">ID de Cliente</span>
            <span class="value">{{ order.customerId }}</span>
          </div>
          <div class="info-item">
            <span class="label">Estado</span>
            <span class="value">{{ formatStatus(order.status) }}</span>
          </div>
          <div class="info-item">
            <span class="label">Fecha de CreaciÃ³n</span>
            <span class="value">{{ formatDateTime(order.createdAt) }}</span>
          </div>
        </div>
      </div>

      <!-- DirecciÃ³n de EnvÃ­o -->
      <div v-if="order.shippingAddress" class="address-section">
        <h2>DirecciÃ³n de EnvÃ­o</h2>
        <div class="address-box">
          <i class="bi bi-geo-alt"></i>
          <p>{{ order.shippingAddress }}</p>
        </div>
      </div>

      <!-- Items -->
      <div class="items-section">
        <h2>Items de la Orden ({{ order.items?.length || 0 }})</h2>

        <div v-if="order.items && order.items.length > 0" class="items-cards">
          <div v-for="item in order.items" :key="item.productId" class="item-card">
            <div class="item-header">
              <h3>{{ productNames[item.productId] || `Producto ${item.productId}` }}</h3>
              <span class="item-id">ID: {{ item.productId }}</span>
            </div>
            <div class="item-details">
              <div class="detail-row">
                <span class="label">Cantidad:</span>
                <span class="value">{{ item.quantity }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Precio Unitario:</span>
                <span class="value">${{ formatPrice(item.unitPrice) }}</span>
              </div>
              <div class="detail-row subtotal">
                <span class="label">Subtotal:</span>
                <span class="value">${{ formatPrice(item.quantity * item.unitPrice) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-items">
          <p>No hay items en esta orden</p>
        </div>
      </div>

      <!-- Resumen Financiero -->
      <div class="summary-section">
        <h2>Resumen Financiero</h2>
        <div class="summary-box">
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>${{ formatPrice(calculateSubtotal()) }}</span>
          </div>
          <div class="summary-row">
            <span>Impuesto (10%):</span>
            <span>${{ formatPrice(calculateTax()) }}</span>
          </div>
          <div class="summary-row total">
            <span>Total:</span>
            <span>${{ formatPrice(order.totalAmount) }}</span>
          </div>
        </div>
      </div>

      <!-- Acciones -->
      <div class="actions-section">
        <button class="btn-print">
          <i class="bi bi-printer"></i> Imprimir
        </button>
        <button class="btn-download">
          <i class="bi bi-download"></i> Descargar PDF
        </button>
        <button v-if="order.status === 'PENDING'" class="btn-cancel">
          <i class="bi bi-x-circle"></i> Cancelar Orden
        </button>
      </div>
    </div>

    <!-- No encontrado -->
    <div v-else class="not-found">
      <i class="bi bi-inbox"></i>
      <p>Orden no encontrada</p>
      <router-link to="/my-orders" class="btn-back">
        Volver a Mis Ã“rdenes
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { orderService } from '../services/orders';
import axiosConfig from '../config/AxiosConfig';

const route = useRoute();
const router = useRouter();

const order = ref(null);
const loading = ref(false);
const error = ref('');
const productNames = ref({});

onMounted(() => {
  fetchOrder();
});

async function fetchOrder() {
  const orderId = route.params.id;

  if (!orderId) {
    error.value = 'ID de orden no vÃ¡lido';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const response = await orderService.getOrderById(orderId);
    if (response.data.success) {
      order.value = response.data.data;
      await loadProductNames();
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al cargar la orden';
  } finally {
    loading.value = false;
  }
}

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

function formatDateTime(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('es-ES');
}

function formatPrice(price) {
  return parseFloat(price).toFixed(2);
}

async function loadProductNames() {
  if (!order.value?.items) return;
  
  for (const item of order.value.items) {
    if (!productNames.value[item.productId]) {
      try {
        const response = await axiosConfig.doGet(`/furniture/${item.productId}`);
        if (response.data.success) {
          productNames.value[item.productId] = response.data.data?.name || `Producto ${item.productId}`;
        } else {
          productNames.value[item.productId] = `Producto ${item.productId}`;
        }
      } catch (err) {
        productNames.value[item.productId] = `Producto ${item.productId}`;
      }
    }
  }
}

function calculateSubtotal() {
  if (!order.value?.items) return 0;
  return order.value.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
}

function calculateTax() {
  return calculateSubtotal() * 0.1;
}
</script>

<style scoped>
.order-detail-container {
  max-width: 900px;
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

.retry-btn {
  margin-left: auto;
  background: #c33;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}

/* Detail */
.order-detail {
  background: var(--white);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 2rem;
  border-bottom: 2px solid #e5e7eb;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-radius: 12px 12px 0 0;
}

.header-info h1 {
  margin: 0 0 0.75rem;
  color: var(--ink);
  font-size: 1.8rem;
}

.header-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.status-badge {
  display: inline-flex;
  padding: 0.4rem 0.75rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
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

.date {
  color: var(--slate);
  font-size: 0.9rem;
}

.header-total {
  text-align: right;
}

.header-total .label {
  display: block;
  color: #9ca3af;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.header-total .amount {
  display: block;
  color: var(--ink);
  font-size: 2rem;
  font-weight: 700;
}

/* Sections */
.info-section,
.address-section,
.items-section,
.summary-section {
  padding: 2rem;
  border-bottom: 1px solid var(--border);
}

.info-section:last-of-type,
.address-section:last-of-type,
.items-section:last-of-type,
.summary-section:last-of-type {
  border-bottom: none;
}

.info-section h2,
.address-section h2,
.items-section h2,
.summary-section h2,
.actions-section h2 {
  color: var(--ink);
  margin: 0 0 1.5rem;
  font-size: 1.1rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item .label {
  color: #9ca3af;
  font-size: 0.85rem;
  font-weight: 600;
}

.info-item .value {
  color: var(--ink);
  font-weight: 500;
  word-break: break-all;
}

.address-box {
  display: flex;
  gap: 1rem;
  background: var(--canvas-lifted);
  padding: 1.5rem;
  border-radius: var(--r-card);
  border-left: 4px solid #667eea;
}

.address-box i {
  color: var(--ink);
  font-size: 1.5rem;
  flex-shrink: 0;
}

.address-box p {
  margin: 0;
  color: var(--ink);
  line-height: 1.6;
}

/* Items Table */
.items-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.item-card {
  background: white;
  padding: 1.5rem;
  border-radius: var(--r-card);
  border-left: 4px solid #667eea;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.item-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.item-header {
  margin-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
}

.item-header h3 {
  margin: 0 0 0.5rem;
  color: var(--ink);
  font-size: 1.1rem;
  font-weight: 600;
}

.item-id {
  color: #9ca3af;
  font-size: 0.85rem;
  font-family: monospace;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-row .label {
  color: var(--slate);
  font-weight: 500;
  font-size: 0.9rem;
}

.detail-row .value {
  color: var(--ink);
  font-weight: 600;
  font-size: 1rem;
}

.detail-row.subtotal {
  border-top: 1px solid #e5e7eb;
  padding-top: 0.75rem;
  margin-top: 0.5rem;
}

.detail-row.subtotal .label {
  font-weight: 700;
  color: var(--ink);
}

.detail-row.subtotal .value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #667eea;
}

.empty-items {
  text-align: center;
  padding: 2rem;
  color: #9ca3af;
}

/* Summary */
.summary-box {
  background: var(--canvas-lifted);
  padding: 1.5rem;
  border-radius: var(--r-card);
  border-left: 4px solid #667eea;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  color: var(--slate);
  font-weight: 500;
}

.summary-row.total {
  padding: 1rem 0;
  border-top: 2px solid #e5e7eb;
  color: var(--ink);
  font-size: 1.2rem;
  font-weight: 700;
  margin-top: 0.5rem;
}

/* Actions */
.actions-section {
  padding: 2rem;
  display: flex;
  gap: 1rem;
  background: var(--canvas-lifted);
  border-radius: 0 0 12px 12px;
}

.btn-print,
.btn-download,
.btn-cancel {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--r-card);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.95rem;
}

.btn-print {
  background: #dbeafe;
  color: #1e40af;
}

.btn-print:hover {
  background: #bfdbfe;
}

.btn-download {
  background: #d1fae5;
  color: #065f46;
}

.btn-download:hover {
  background: #a7f3d0;
}

.btn-cancel {
  background: #fee2e2;
  color: #991b1b;
  margin-left: auto;
}

.btn-cancel:hover {
  background: #fecaca;
}

/* Not Found */
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  background: var(--canvas-lifted);
  border-radius: 12px;
  text-align: center;
  color: #9ca3af;
}

.not-found i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.btn-back {
  display: inline-block;
  background: var(--canvas);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: var(--r-card);
  text-decoration: none;
  font-weight: 600;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .order-detail-container {
    padding: 1rem;
  }

  .detail-header {
    flex-direction: column;
    gap: 1rem;
  }

  .items-header,
  .items-row {
    grid-template-columns: 1fr;
  }

  .actions-section {
    flex-direction: column;
  }

  .btn-cancel {
    margin-left: 0;
  }
}
</style>

