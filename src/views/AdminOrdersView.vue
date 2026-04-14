<template>
  <div class="admin-orders-container">
    <div class="admin-header">
      <h1>
        <i class="bi bi-inbox"></i>
        Gestión de Órdenes
      </h1>
      <p>Panel de administración de órdenes</p>
    </div>

    <nav class="admin-nav">
      <router-link to="/admin" class="admin-nav-item"><i class="bi bi-house-door"></i> Muebles</router-link>
      <router-link to="/admin-orders" class="admin-nav-item"><i class="bi bi-bag-check"></i> Órdenes</router-link>
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
      <i class="bi bi-arrow-repeat"></i> Cargando órdenes...
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- Tabla de órdenes -->
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
      <p>No hay órdenes para mostrar</p>
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
    error.value = 'Error al cargar órdenes';
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
  if (!confirm('¿Estás seguro de que deseas cancelar esta orden?')) return;

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

// Cargar órdenes al montar
fetchOrders();
</script>

<style scoped>
.admin-orders-container {
  min-height: 100vh;
  background: #f9fafb;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #111827;
}

.admin-header {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
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
  color: #111827;
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.admin-header h1 i { color: #6b7280; font-size: 1rem; }
.admin-header p { color: #6b7280; margin: 0; font-size: 0.8125rem; }

.filters {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  align-items: flex-end;
  flex-wrap: wrap;
}

.form-group { display: flex; flex-direction: column; gap: 0.375rem; min-width: 150px; flex: 1; }

.form-group label { font-size: 0.8125rem; font-weight: 500; color: #374151; }

.form-group select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  font-family: inherit;
  background: #fff;
  color: #111827;
  transition: border-color 0.15s;
}
.form-group select:focus { outline: none; border-color: #111827; }

.btn-refresh {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: #111827;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
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
  color: #6b7280;
  font-size: 0.875rem;
}

.error-message {
  background: #fee2e2;
  border: 1px solid #fca5a5;
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  margin: 1rem 1.5rem;
  font-size: 0.875rem;
}

.orders-table-wrapper {
  margin: 1.5rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow-x: auto;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.orders-table thead { background: #f9fafb; }
.orders-table th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
}

.orders-table tbody tr { border-bottom: 1px solid #e5e7eb; }
.orders-table tbody tr:hover { background: #f9fafb; }
.orders-table td { padding: 0.75rem 1rem; color: #111827; vertical-align: middle; }

.id-cell { font-weight: 600; font-family: monospace; font-size: 0.8125rem; color: #374151; }
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
  border: 1px solid #e5e7eb;
  width: 2rem;
  height: 2rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-size: 0.875rem;
  color: #6b7280;
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
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  text-align: center;
  color: #6b7280;
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
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  max-width: 440px;
  width: 100%;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 0.875rem;
  right: 0.875rem;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  width: 2rem;
  height: 2rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  font-family: inherit;
}
.close-btn:hover { background: #e5e7eb; }

.modal-content h2 { color: #111827; margin: 0 0 0.375rem; font-size: 1rem; font-weight: 600; }
.order-info { color: #6b7280; margin: 0 0 1.25rem; font-size: 0.8125rem; }

.form-group { margin-bottom: 1rem; }

.form-group input, .form-group select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  font-family: inherit;
  box-sizing: border-box;
  transition: border-color 0.15s;
  color: #111827;
}
.form-group input:focus, .form-group select:focus { outline: none; border-color: #111827; }

.modal-actions { display: flex; gap: 0.75rem; margin-top: 1.25rem; }

.btn-submit, .btn-cancel {
  flex: 1;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
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
.btn-cancel { background: #f3f4f6; color: #374151; border: 1px solid #e5e7eb; }
.btn-cancel:hover { background: #e5e7eb; }

@media (max-width: 768px) {
  .orders-table-wrapper { margin: 1rem; }
  .filters { padding: 0.75rem 1rem; flex-direction: column; }
  .form-group { width: 100%; }
  .btn-refresh { width: 100%; justify-content: center; }
}
</style>



.admin-header h1 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #1f2937;
  margin: 0;
  font-size: 1.8rem;
}

.admin-header h1 i {
  color: #667eea;
}

.admin-header p {
  color: #6b7280;
  margin: 0.5rem 0 0;
}

/* Filtros */
.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 8px;
  align-items: flex-end;
}

.form-group {
  flex: 1;
  min-width: 150px;
}

.form-group label {
  display: block;
  color: #374151;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.9rem;
  box-sizing: border-box;
}

.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-refresh:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

/* Loading */
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem 2rem;
  color: #6b7280;
}

.loading i {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error */
.error-message {
  background: #fee;
  border: 1px solid #fca;
  color: #c33;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 2rem;
}

/* Tabla */
.orders-table-wrapper {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.orders-table thead {
  background: #f3f4f6;
  border-bottom: 2px solid #e5e7eb;
}

.orders-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
}

.orders-table tbody tr {
  border-bottom: 1px solid #e5e7eb;
  transition: background 0.2s;
}

.orders-table tbody tr:hover {
  background: #f9fafb;
}

.orders-table td {
  padding: 1rem;
  color: #1f2937;
}

.id-cell {
  color: #667eea;
  font-weight: 600;
  font-family: monospace;
}

.amount {
  font-weight: 600;
  color: #667eea;
}

.status-badge {
  display: inline-flex;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
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

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-change-status,
.btn-delete,
.btn-view {
  background: transparent;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-size: 1rem;
}

.btn-change-status {
  background: #dbeafe;
  color: #1e40af;
}

.btn-change-status:hover {
  background: #bfdbfe;
}

.btn-delete {
  background: #fee2e2;
  color: #dc2626;
}

.btn-delete:hover {
  background: #fecaca;
}

.btn-view {
  background: #d1fae5;
  color: #065f46;
}

.btn-view:hover {
  background: #a7f3d0;
}

/* Empty */
.empty-state {
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

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #f3f4f6;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.5rem;
  color: #6b7280;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #e5e7eb;
}

.modal-content h2 {
  color: #1f2937;
  margin: 0 0 0.5rem;
}

.order-info {
  color: #9ca3af;
  margin: 0 0 1.5rem;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  box-sizing: border-box;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-submit,
.btn-cancel {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-cancel {
  background: #f3f4f6;
  color: #1f2937;
}

.btn-cancel:hover {
  background: #e5e7eb;
}

@media (max-width: 768px) {
  .admin-orders-container {
    padding: 1rem;
  }

  .filters {
    flex-direction: column;
  }

  .form-group {
    width: 100%;
  }

  .btn-refresh {
    width: 100%;
  }

  .orders-table {
    font-size: 0.85rem;
  }

  .orders-table th,
  .orders-table td {
    padding: 0.75rem 0.5rem;
  }
}
.admin-nav { display:flex; gap:.25rem; padding:.75rem 2rem; background:#fff; border-bottom:2px solid #e9ecef; flex-wrap:wrap; }
.admin-nav-item { display:flex; align-items:center; gap:.4rem; padding:.5rem 1rem; border-radius:8px; color:#555; font-weight:500; font-size:.9rem; text-decoration:none; transition:all .2s; }
.admin-nav-item:hover { background:#f0f4ff; color:#007bff; }
.admin-nav-item.router-link-active { background:#007bff; color:#fff; }
</style>

