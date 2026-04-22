<template>
  <div>
  <AdminLayout title="Ventas" subtitle="Gestión de ventas y reservaciones" icon="bi-bag-check">
    <template #actions>
      <select v-model="selectedStatus" class="filter-select">
        <option value="">Todos los estados</option>
        <option value="PENDIENTE">Pendiente</option>
        <option value="CONFIRMADA">Confirmada</option>
        <option value="CANCELADA">Cancelada</option>
      </select>
      <button @click="showNewSaleModal = true" class="btn-primary">
        <i class="bi bi-plus-lg"></i> Nueva Venta
      </button>
      <button @click="fetchOrders" class="btn-secondary">
        <i class="bi bi-arrow-clockwise"></i> Refrescar
      </button>
    </template>

    <!-- Loading -->
    <div v-if="loading" class="admin-loading">
      <div class="admin-spinner"></div>
      <p>Cargando ventas...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="admin-empty">
      <i class="bi bi-exclamation-circle" style="color:#dc2626"></i>
      <h3>{{ error }}</h3>
    </div>

    <!-- Tabla de ventas -->
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
            <td>{{ order.customerName || `Cliente #${order.customerId}` }}</td>
            <td><strong>${{ formatPrice(order.totalAmount) }}</strong></td>
            <td>
              <span :class="['badge', statusBadgeClass(order.status)]">
                {{ formatStatus(order.status) }}
              </span>
            </td>
            <td>{{ formatDate(order.createdAt) }}</td>
            <td class="actions-cell">
              <button @click="downloadPDF(order)" class="btn-icon" title="Descargar nota de venta">
                <i class="bi bi-file-earmark-pdf"></i>
              </button>
              <button
                v-if="order.status === 'PENDIENTE'"
                @click="confirmOrder(order.id)"
                class="btn-icon btn-success"
                title="Confirmar entrega"
              >
                <i class="bi bi-check-lg"></i>
              </button>
              <button
                v-if="order.status !== 'CANCELADA' && order.status !== 'CONFIRMADA'"
                @click="cancelOrder(order.id)"
                class="btn-icon btn-danger"
                title="Cancelar"
              >
                <i class="bi bi-x-lg"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty -->
    <div v-else class="admin-empty">
      <i class="bi bi-bag-x"></i>
      <h3>Sin ventas</h3>
      <p>No hay ventas registradas aún.</p>
      <button @click="showNewSaleModal = true" class="btn-primary">Registrar primera venta</button>
    </div>
  </AdminLayout>

  <!-- Modal: Nueva Venta -->
  <Teleport to="body">
    <div v-if="showNewSaleModal" class="modal-overlay" @click.self="closeNewSaleModal">
      <div class="modal-box">
        <div class="modal-header">
          <h2><i class="bi bi-bag-plus"></i> Nueva Venta</h2>
          <button @click="closeNewSaleModal" class="modal-close"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="modal-body">
          <!-- Producto -->
          <div class="form-group">
            <label>Producto *</label>
            <select v-model="newSale.productId" @change="onProductChange" class="form-control" required>
              <option value="">Seleccionar producto</option>
              <option v-for="p in products" :key="p.id" :value="p.id">
                {{ p.name }} — ${{ formatPrice(p.price) }} (Stock: {{ p.stock }})
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Precio de venta *</label>
            <input v-model.number="newSale.price" type="number" class="form-control" min="0" step="0.01" />
          </div>
          <div class="form-group">
            <label>Cantidad *</label>
            <input v-model.number="newSale.quantity" type="number" class="form-control" min="1" />
          </div>
          <div class="sale-total" v-if="newSale.price && newSale.quantity">
            Total: <strong>${{ formatPrice(newSale.price * newSale.quantity) }}</strong>
          </div>

          <hr class="divider" />

          <!-- Cliente -->
          <div class="form-group">
            <label>Buscar cliente existente</label>
            <input
              v-model="customerSearch"
              @input="searchCustomers"
              type="text"
              class="form-control"
              placeholder="Nombre o teléfono..."
            />
            <ul v-if="customerResults.length > 0" class="customer-dropdown">
              <li
                v-for="c in customerResults"
                :key="c.id"
                @click="selectCustomer(c)"
              >
                {{ c.name }} — {{ c.phone || 'Sin teléfono' }}
              </li>
            </ul>
          </div>

          <div class="form-row" v-if="!newSale.customerId">
            <div class="form-group">
              <label>Nombre del cliente *</label>
              <input v-model="newSale.customerName" type="text" class="form-control" placeholder="Nombre completo" />
            </div>
            <div class="form-group">
              <label>Teléfono</label>
              <input v-model="newSale.customerPhone" type="text" class="form-control" placeholder="Teléfono" />
            </div>
          </div>
          <div v-else class="selected-customer">
            <i class="bi bi-person-check"></i>
            Cliente seleccionado: <strong>{{ newSale.customerName }}</strong>
            <button @click="clearCustomer" class="btn-link">Cambiar</button>
          </div>

          <div class="form-group">
            <label>Notas</label>
            <textarea v-model="newSale.notes" class="form-control" rows="2" placeholder="Notas adicionales..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeNewSaleModal" class="btn-secondary">Cancelar</button>
          <button @click="createSale" :disabled="savingOrder" class="btn-primary">
            <span v-if="savingOrder"><i class="bi bi-hourglass-split"></i> Guardando...</span>
            <span v-else><i class="bi bi-check-lg"></i> Registrar Venta</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import AdminLayout from '@/components/AdminLayout.vue';
import axiosConfig from '@/config/AxiosConfig.js';
import { generateSalesPDF } from '@/utils/pdfGenerator.js';

const orders = ref([]);
const loading = ref(false);
const error = ref('');
const selectedStatus = ref('');
const showNewSaleModal = ref(false);
const savingOrder = ref(false);
const products = ref([]);
const customerSearch = ref('');
const customerResults = ref([]);

const newSale = ref({
  productId: '',
  price: 0,
  quantity: 1,
  customerId: null,
  customerName: '',
  customerPhone: '',
  notes: ''
});

const filteredOrders = computed(() => {
  if (!selectedStatus.value) return orders.value;
  return orders.value.filter(o => o.status === selectedStatus.value);
});

function formatPrice(val) {
  return (val || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 });
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatStatus(status) {
  const map = {
    PENDIENTE: 'Pendiente',
    CONFIRMADA: 'Confirmada',
    ENVIADA: 'Enviada',
    ENTREGADA: 'Entregada',
    CANCELADA: 'Cancelada'
  };
  return map[status] || status;
}

function statusBadgeClass(status) {
  const map = {
    PENDIENTE: 'badge-warning',
    CONFIRMADA: 'badge-success',
    ENVIADA: 'badge-info',
    ENTREGADA: 'badge-success',
    CANCELADA: 'badge-danger'
  };
  return map[status] || 'badge-secondary';
}

async function fetchOrders() {
  loading.value = true;
  error.value = '';
  try {
    const res = await axiosConfig.doGet('/api/orders');
    orders.value = res.data.data || res.data || [];
  } catch (e) {
    error.value = 'No se pudieron cargar las ventas';
  } finally {
    loading.value = false;
  }
}

async function fetchProducts() {
  try {
    const res = await axiosConfig.doGet('/api/products');
    products.value = res.data.data || res.data || [];
  } catch (e) {
    console.error('Error cargando productos:', e);
  }
}

function onProductChange() {
  const product = products.value.find(p => p.id === newSale.value.productId);
  if (product) {
    newSale.value.price = product.price || 0;
  }
}

async function searchCustomers() {
  if (customerSearch.value.length < 2) {
    customerResults.value = [];
    return;
  }
  try {
    const res = await axiosConfig.doGet(`/api/customers?search=${encodeURIComponent(customerSearch.value)}`);
    customerResults.value = (res.data.data || res.data || []).slice(0, 5);
  } catch {
    customerResults.value = [];
  }
}

function selectCustomer(c) {
  newSale.value.customerId = c.id;
  newSale.value.customerName = c.name;
  newSale.value.customerPhone = c.phone || '';
  customerSearch.value = '';
  customerResults.value = [];
}

function clearCustomer() {
  newSale.value.customerId = null;
  newSale.value.customerName = '';
  newSale.value.customerPhone = '';
  customerSearch.value = '';
  customerResults.value = [];
}

function closeNewSaleModal() {
  showNewSaleModal.value = false;
  newSale.value = { productId: '', price: 0, quantity: 1, customerId: null, customerName: '', customerPhone: '', notes: '' };
  customerSearch.value = '';
  customerResults.value = [];
}

async function createSale() {
  if (!newSale.value.productId) { alert('Selecciona un producto'); return; }
  if (!newSale.value.customerName.trim()) { alert('Ingresa el nombre del cliente'); return; }
  if (newSale.value.quantity < 1) { alert('La cantidad debe ser al menos 1'); return; }

  savingOrder.value = true;
  try {
    let customerId = newSale.value.customerId;

    // Si no hay cliente seleccionado, crear uno nuevo
    if (!customerId) {
      const cRes = await axiosConfig.doPost('/api/customers', {
        name: newSale.value.customerName,
        phone: newSale.value.customerPhone
      });
      customerId = (cRes.data.data || cRes.data).id;
    }

    const payload = {
      customerId,
      items: [{
        productId: newSale.value.productId,
        quantity: newSale.value.quantity,
        price: newSale.value.price
      }],
      notes: newSale.value.notes
    };

    await axiosConfig.doPost('/api/orders', payload);
    await fetchOrders();
    closeNewSaleModal();
  } catch (e) {
    alert('Error al registrar la venta: ' + (e.response?.data?.message || e.message));
  } finally {
    savingOrder.value = false;
  }
}

async function confirmOrder(id) {
  if (!confirm('¿Confirmar entrega de esta venta?')) return;
  try {
    await axiosConfig.doPut(`/api/orders/${id}/status?status=CONFIRMADA`);
    await fetchOrders();
  } catch (e) {
    alert('Error al confirmar la venta');
  }
}

async function cancelOrder(id) {
  if (!confirm('¿Cancelar esta venta?')) return;
  try {
    await axiosConfig.doDelete(`/api/orders/${id}`);
    await fetchOrders();
  } catch (e) {
    alert('Error al cancelar la venta');
  }
}

function downloadPDF(order) {
  try {
    generateSalesPDF(order);
  } catch (e) {
    alert('Error al generar PDF: ' + e.message);
  }
}

onMounted(async () => {
  await Promise.all([fetchOrders(), fetchProducts()]);
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-box {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 640px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e0d0e0;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #860734;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  color: #999;
  padding: 0.25rem;
}

.modal-close:hover { color: #141413; }

.modal-body {
  padding: 1.25rem 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e0d0e0;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.form-control {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e0d0e0;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}

.form-control:focus { border-color: #860734; }

.sale-total {
  background: #faf7f4;
  border: 1px solid #e0d0e0;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: #141413;
  margin-top: -0.5rem;
}

.sale-total strong {
  color: #860734;
  font-size: 1.2rem;
}

.divider {
  border: none;
  border-top: 1px solid #e0d0e0;
  margin: 1rem 0;
}

.customer-dropdown {
  list-style: none;
  padding: 0;
  margin: 0.25rem 0 0;
  border: 1px solid #e0d0e0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.customer-dropdown li {
  padding: 0.6rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.15s;
}

.customer-dropdown li:hover {
  background: #faf7f4;
}

.selected-customer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(37, 211, 102, 0.08);
  border: 1px solid rgba(37, 211, 102, 0.3);
  border-radius: 8px;
  font-size: 0.9rem;
  color: #059669;
}

.btn-link {
  background: none;
  border: none;
  color: #860734;
  cursor: pointer;
  font-size: 0.85rem;
  text-decoration: underline;
  margin-left: auto;
  padding: 0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
