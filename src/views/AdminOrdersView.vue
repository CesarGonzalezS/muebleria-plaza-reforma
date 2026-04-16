<template>
  <div class="admin-orders-container">
    <div class="admin-header">
      <h1>
        <i class="bi bi-inbox"></i>
        GestiÃ³n de Ã“rdenes
      </h1>
      <p>Panel de administraciÃ³n de Ã³rdenes</p>
    </div>

    <nav class="admin-nav">
      <router-link to="/admin" class="admin-nav-item"><i class="bi bi-house-door"></i> Muebles</router-link>
      <router-link to="/admin-orders" class="admin-nav-item"><i class="bi bi-bag-check"></i> Ã“rdenes</router-link>
      <router-link to="/customers" class="admin-nav-item"><i class="bi bi-people"></i> Clientes</router-link>
      <router-link to="/reports" class="admin-nav-item"><i class="bi bi-graph-up"></i> Reportes</router-link>
      <router-link to="/inventory-adjust" class="admin-nav-item"><i class="bi bi-boxes"></i> Inventario</router-link>
      <router-link to="/low-stock" class="admin-nav-item"><i class="bi bi-exclamation-triangle"></i> Stock Bajo</router-link>
    </nav>

    <!-- Filtros -->
    <div class="filters">
      <div class="form-group">
        <label>Filtrar por Estado</label>
        <select v-model="selectedStatus">
          <option value="">Todos</option>
          <option value="PENDING">Pendiente</option>
          <option value="PROCESSING">Procesando</option>
          <option value="SHIPPED">Enviado</option>
          <option value="DELIVERED">Entregado</option>
          <option value="CANCELLED">Cancelado</option>
        </select>
      </div>
      <button @click="fetchOrders" class="btn-refresh">
        <i class="bi bi-arrow-clockwise"></i> Refrescar
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading">
      <i class="bi bi-arrow-repeat"></i> Cargando Ã³rdenes...
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- Tabla de Ã³rdenes -->
    <div v-else-if="filteredOrders.length > 0" class="orders-table-wrapper">
      <table class="orders-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id">
            <td class="id-cell">{{ order.id }}</td>
            <td>ID: {{ order.customerId }}</td>
            <td class="amount">${{ formatPrice(order.totalAmount) }}</td>
            <td>
              <span :class="['status-badge', order.status.toLowerCase()]">
                {{ formatStatus(order.status) }}
              </span>
            </td>
            <td>{{ formatDate(order.createdAt) }}</td>
            <td class="actions">
              <button @click="openStatusModal(order)" class="btn-change-status" title="Cambiar estado">
                <i class="bi bi-pencil-square"></i>
              </button>
              <button @click="deleteOrder(order.id)" class="btn-delete" title="Cancelar orden">
                <i class="bi bi-trash"></i>
              </button>
              <router-link :to="`/order-detail/${order.id}`" class="btn-view" title="Ver detalles">
                <i class="bi bi-eye"></i>
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty -->
    <div v-else class="empty-state">
      <i class="bi bi-inbox"></i>
      <p>No hay Ã³rdenes para mostrar</p>
    </div>

    <!-- Modal de cambiar estado -->
    <div v-if="showStatusModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button @click="closeModal" class="close-btn">
          <i class="bi bi-x"></i>
        </button>

        <h2>Cambiar Estado de Orden</h2>
        <p class="order-info">Orden #{{ selectedOrder?.id }}</p>

        <div class="form-group">
          <label>Nuevo Estado *</label>
          <select v-model="newStatus" required>
            <option value="">Seleccionar estado</option>
            <option value="PENDING">Pendiente</option>
            <option value="PROCESSING">Procesando</option>
            <option value="SHIPPED">Enviado</option>
            <option value="DELIVERED">Entregado</option>
            <option value="CANCELLED">Cancelado</option>
          </select>
        </div>

        <div v-if="statusError" class="error-message">
          {{ statusError }}
        </div>

        <div class="modal-actions">
          <button @click="updateOrderStatus" class="btn-submit" :disabled="statusLoading || !newStatus">
            <span v-if="!statusLoading">
              <i class="bi bi-check-circle"></i> Actualizar
            </span>
            <span v-else>
              <i class="bi bi-arrow-repeat"></i> Procesando...
            </span>
          </button>
          <button @click="closeModal" class="btn-cancel">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { orderService } from '../services/orders';

const orders = ref([]);
const loading = ref(false);
const error = ref('');
const selectedStatus = ref('');

const showStatusModal = ref(false);
const selectedOrder = ref(null);
const newStatus = ref('');
const statusLoading = ref(false);
const statusError = ref('');

const filteredOrders = computed(() => {
  if (!selectedStatus.value) return orders.value;
  return orders.value.filter(o => o.status === selectedStatus.value);
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
    error.value = 'Error al cargar Ã³rdenes';
  } finally {
    loading.value = false;
  }
}

function openStatusModal(order) {
  selectedOrder.value = order;
  newStatus.value = order.status;
  showStatusModal.value = true;
  statusError.value = '';
}

function closeModal() {
  showStatusModal.value = false;
  selectedOrder.value = null;
  newStatus.value = '';
  statusError.value = '';
}

async function updateOrderStatus() {
  if (!selectedOrder.value || !newStatus.value) return;

  statusError.value = '';
  statusLoading.value = true;

  try {
    await orderService.updateOrderStatus(selectedOrder.value.id, newStatus.value);
    closeModal();
    await fetchOrders();
  } catch (err) {
    statusError.value = err.response?.data?.message || 'Error al actualizar estado';
  } finally {
    statusLoading.value = false;
  }
}

async function deleteOrder(orderId) {
  if (!confirm('Â¿EstÃ¡s seguro de que deseas cancelar esta orden?')) return;

  loading.value = true;
  error.value = '';

  try {
    await orderService.cancelOrder(orderId);
    await fetchOrders();
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al cancelar orden';
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

function formatPrice(price) {
  return parseFloat(price).toFixed(2);
}

// Cargar Ã³rdenes al montar
fetchOrders();
</script>

<style scoped>
.admin-orders-container {
  min-height: 100vh;
  background: var(--canvas-lifted);
  font-family: var(--font);
  color: var(--ink);
}

.admin-header {
  background: var(--white);
  border-bottom: 1px solid var(--border);
  padding: 0.875rem 1.5rem;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 0.2rem;
}

.admin-header h1 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--ink);
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.admin-header h1 i { color: var(--slate); font-size: 1rem; }
.admin-header p { color: var(--slate); margin: 0; font-size: 0.8125rem; }

.filters {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: var(--white);
  border-bottom: 1px solid var(--border);
  align-items: flex-end;
  flex-wrap: wrap;
}

.form-group { display: flex; flex-direction: column; gap: 0.375rem; min-width: 150px; flex: 1; }

.form-group label { font-size: 0.8125rem; font-weight: 500; color: var(--charcoal); }

.form-group select {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 0.875rem;
  font-family: inherit;
  background: var(--white);
  color: var(--ink);
  transition: border-color 0.15s;
}
.form-group select:focus { outline: none; border-color: var(--ink); }

.btn-refresh {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: #111827;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
  font-family: inherit;
  white-space: nowrap;
}
.btn-refresh:hover { background: #374151; }

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem;
  color: var(--slate);
  font-size: 0.875rem;
}

.error-message {
  background: #fee2e2;
  border: 1px solid #fca5a5;
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  margin: 1rem 1.5rem;
  font-size: 0.875rem;
}

.orders-table-wrapper {
  margin: 1.5rem;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--r-card);
  overflow-x: auto;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.orders-table thead { background: var(--canvas-lifted); }
.orders-table th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--slate);
  border-bottom: 1px solid var(--border);
}

.orders-table tbody tr { border-bottom: 1px solid var(--border); }
.orders-table tbody tr:hover { background: var(--canvas-lifted); }
.orders-table td { padding: 0.75rem 1rem; color: var(--ink); vertical-align: middle; }

.id-cell { font-weight: 600; font-family: monospace; font-size: 0.8125rem; color: var(--charcoal); }
.amount { font-weight: 600; }

.status-badge {
  display: inline-flex;
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}
.status-badge.pending   { background: #fef3c7; color: #b45309; }
.status-badge.processing { background: #dbeafe; color: #1e40af; }
.status-badge.shipped   { background: #ede9fe; color: #6d28d9; }
.status-badge.delivered { background: #dcfce7; color: #16a34a; }
.status-badge.cancelled { background: #fee2e2; color: #dc2626; }

.actions { display: flex; gap: 0.375rem; }

.btn-change-status, .btn-delete, .btn-view {
  background: transparent;
  border: 1px solid var(--border);
  width: 2rem;
  height: 2rem;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-size: 0.875rem;
  color: var(--slate);
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  font-family: inherit;
}
.btn-change-status:hover { background: #dbeafe; color: #1e40af; border-color: #93c5fd; }
.btn-delete:hover        { background: #fee2e2; color: #dc2626; border-color: #fca5a5; }
.btn-view:hover          { background: #dcfce7; color: #16a34a; border-color: #86efac; }

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  margin: 1.5rem;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--r-card);
  text-align: center;
  color: var(--slate);
  gap: 0.75rem;
}
.empty-state i { font-size: 1.75rem; }
.empty-state p { margin: 0; font-size: 0.875rem; }

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--r-card);
  padding: 1.5rem;
  max-width: 440px;
  width: 100%;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 0.875rem;
  right: 0.875rem;
  background: var(--canvas);
  border: 1px solid var(--border);
  width: 2rem;
  height: 2rem;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--slate);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  font-family: inherit;
}
.close-btn:hover { background: #e5e7eb; }

.modal-content h2 { color: var(--ink); margin: 0 0 0.375rem; font-size: 1rem; font-weight: 600; }
.order-info { color: var(--slate); margin: 0 0 1.25rem; font-size: 0.8125rem; }

.form-group { margin-bottom: 1rem; }

.form-group input, .form-group select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 0.875rem;
  font-family: inherit;
  box-sizing: border-box;
  transition: border-color 0.15s;
  color: var(--ink);
}
.form-group input:focus, .form-group select:focus { outline: none; border-color: var(--ink); }

.modal-actions { display: flex; gap: 0.75rem; margin-top: 1.25rem; }

.btn-submit, .btn-cancel {
  flex: 1;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  transition: background 0.15s;
  font-family: inherit;
}
.btn-submit { background: #111827; color: #fff; }
.btn-submit:hover:not(:disabled) { background: #374151; }
.btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-cancel { background: var(--canvas); color: var(--charcoal); border: 1px solid var(--border); }
.btn-cancel:hover { background: #e5e7eb; }

@media (max-width: 768px) {
  .orders-table-wrapper { margin: 1rem; }
  .filters { padding: 0.75rem 1rem; flex-direction: column; }
  .form-group { width: 100%; }
  .btn-refresh { width: 100%; justify-content: center; }
}
</style>
