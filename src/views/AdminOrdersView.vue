<template>
  <AdminLayout title="Órdenes" subtitle="Gestión de órdenes" icon="bi-bag-check">
    <template #actions>
      <select v-model="selectedStatus" class="filter-select">
        <option value="">Todos los estados</option>
        <option value="PENDING">Pendiente</option>
        <option value="PROCESSING">Procesando</option>
        <option value="SHIPPED">Enviado</option>
        <option value="DELIVERED">Entregado</option>
        <option value="CANCELLED">Cancelado</option>
      </select>
      <button @click="fetchOrders" class="btn-secondary">
        <i class="bi bi-arrow-clockwise"></i> Refrescar
      </button>
    </template>

    <!-- Loading -->
    <div v-if="loading" class="admin-loading">
      <div class="admin-spinner"></div>
      <p>Cargando órdenes...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="admin-empty">
      <i class="bi bi-exclamation-circle" style="color:#dc2626"></i>
      <h3>{{ error }}</h3>
    </div>

    <!-- Tabla de órdenes -->
    <div v-else-if="filteredOrders.length > 0" class="admin-table-wrap">
      <table class="admin-table">
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
            <td class="id-cell">#{{ order.id }}</td>
            <td>ID: {{ order.customerId }}</td>
            <td><strong>${{ formatPrice(order.totalAmount) }}</strong></td>
            <td>
              <span :class="['badge', statusBadgeClass(order.status)]">
                {{ formatStatus(order.status) }}
              </span>
            </td>
            <td>{{ formatDate(order.createdAt) }}</td>
            <td>
              <div class="row-actions">
                <button @click="openStatusModal(order)" class="btn-icon btn-edit" title="Cambiar estado">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button @click="deleteOrder(order.id)" class="btn-icon btn-delete" title="Cancelar orden">
                  <i class="bi bi-trash"></i>
                </button>
                <router-link :to="`/order-detail/${order.id}`" class="btn-icon btn-view" title="Ver detalles">
                  <i class="bi bi-eye"></i>
                </router-link>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty -->
    <div v-else class="admin-empty">
      <i class="bi bi-inbox"></i>
      <h3>No hay órdenes para mostrar</h3>
      <p>Las órdenes aparecerán aquí cuando los clientes realicen compras</p>
    </div>

    <!-- Modal cambiar estado -->
    <div v-if="showStatusModal" class="admin-modal-overlay" @click.self="closeModal">
      <div class="admin-modal">
        <div class="admin-modal__header">
          <h3>Cambiar Estado — Orden #{{ selectedOrder?.id }}</h3>
          <button @click="closeModal" class="btn-icon"><i class="bi bi-x"></i></button>
        </div>
        <div class="admin-modal__body">
          <div class="form-group">
            <label>Nuevo Estado</label>
            <select v-model="newStatus">
              <option value="">Seleccionar estado</option>
              <option v-for="status in validNextStates" :key="status" :value="status">
                {{ formatStatus(status) }}
              </option>
            </select>
            <p v-if="validNextStates.length === 0" class="info-msg">
              Este pedido no puede cambiar de estado (ya está en estado final)
            </p>
          </div>
          <div v-if="statusError" class="error-msg">{{ statusError }}</div>
        </div>
        <div class="admin-modal__footer">
          <button @click="closeModal" class="btn-secondary">Cancelar</button>
          <button @click="updateOrderStatus" class="btn-primary" :disabled="statusLoading || !newStatus">
            <i class="bi bi-check-circle"></i>
            {{ statusLoading ? 'Procesando...' : 'Actualizar' }}
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { orderService } from '../services/orders';
import AdminLayout from '../components/AdminLayout.vue';

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

const validTransitions = {
  'PENDING': ['PROCESSING', 'CANCELLED'],
  'PROCESSING': ['SHIPPED', 'CANCELLED'],
  'SHIPPED': ['DELIVERED'],
  'DELIVERED': [],
  'CANCELLED': []
};

function canTransitionTo(fromStatus, toStatus) {
  if (fromStatus === toStatus) return false;
  return (validTransitions[fromStatus] || []).includes(toStatus);
}

const validNextStates = computed(() => {
  return selectedOrder.value ? (validTransitions[selectedOrder.value.status] || []) : [];
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
  newStatus.value = '';
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

  if (!canTransitionTo(selectedOrder.value.status, newStatus.value)) {
    statusError.value = `Transición no permitida: ${selectedOrder.value.status} → ${newStatus.value}`;
    return;
  }

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

function statusBadgeClass(status) {
  const map = {
    'PENDING': 'badge-yellow',
    'PROCESSING': 'badge-blue',
    'SHIPPED': 'badge-gray',
    'DELIVERED': 'badge-green',
    'CANCELLED': 'badge-red'
  };
  return map[status] || 'badge-gray';
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
  return new Date(dateString).toLocaleDateString('es-ES');
}

function formatPrice(price) {
  return parseFloat(price).toFixed(2);
}

fetchOrders();
</script>

<style scoped>
.filter-select {
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 0.875rem;
  font-family: var(--font);
  background: #fff;
  color: var(--ink);
  transition: border-color .15s;
}
.filter-select:focus { outline: none; border-color: var(--ink); }

.id-cell { font-weight: 600; font-family: monospace; font-size: 0.8125rem; color: var(--charcoal); }

.row-actions { display: flex; gap: 4px; }

.btn-view {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  width: 32px;
  height: 32px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: transparent;
  color: var(--slate);
  font-size: 0.875rem;
  transition: all .15s;
  cursor: pointer;
}
.btn-view:hover { background: #dcfce7; color: #16a34a; border-color: #86efac; }

.error-msg {
  background: #fee2e2;
  border: 1px solid #fca5a5;
  color: #dc2626;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 0.875rem;
}

.info-msg {
  color: #0ea5e9;
  font-size: 0.8125rem;
  margin: 4px 0 0;
  padding: 8px 10px;
  background: rgba(14,165,233,0.08);
  border-radius: 6px;
}
</style>
