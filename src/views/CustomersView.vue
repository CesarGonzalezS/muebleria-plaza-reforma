<template>
  <div>
  <AdminLayout title="Clientes" subtitle="Gestión de clientes registrados" icon="bi-people">
    <template #actions>
      <button @click="openCreate" class="btn-primary">
        <i class="bi bi-person-plus"></i> Nuevo Cliente
      </button>
    </template>

    <!-- Loading -->
    <div v-if="loading" class="admin-loading">
      <div class="admin-spinner"></div>
      <p>Cargando clientes...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="admin-empty">
      <i class="bi bi-exclamation-circle" style="color:#dc2626"></i>
      <h3>{{ error }}</h3>
      <button @click="fetchCustomers" class="btn-secondary">Reintentar</button>
    </div>

    <!-- Lista vacía -->
    <div v-else-if="!customers.length" class="admin-empty">
      <i class="bi bi-people"></i>
      <h3>No hay clientes registrados</h3>
      <p>Agrega el primer cliente usando el botón de arriba</p>
    </div>

    <!-- Tabla -->
    <div v-else class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Ciudad</th>
            <th>Órdenes</th>
            <th>Total Gastado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in customers" :key="c.id">
            <td class="id-cell">{{ c.id }}</td>
            <td>{{ c.name }}</td>
            <td>{{ c.email }}</td>
            <td>{{ c.phone || '-' }}</td>
            <td>{{ c.city || '-' }}</td>
            <td><span class="badge badge-blue">{{ c.totalOrders ?? '-' }}</span></td>
            <td>${{ formatPrice(c.totalSpent) }}</td>
            <td>
              <div class="row-actions">
                <button @click="openEdit(c)" class="btn-icon btn-edit" title="Editar">
                  <i class="bi bi-pencil"></i>
                </button>
                <button @click="openHistory(c)" class="btn-icon btn-view" title="Ver historial de compras">
                  <i class="bi bi-clock-history"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal crear/editar -->
    <Transition name="modal">
      <div v-if="showModal" class="admin-modal-overlay" @click.self="closeModal">
        <div class="admin-modal" style="max-width:600px;">
          <div class="admin-modal__header">
            <h3>{{ editing ? 'Editar Cliente' : 'Nuevo Cliente' }}</h3>
            <button @click="closeModal" class="btn-icon"><i class="bi bi-x-lg"></i></button>
          </div>
          <form @submit.prevent="handleSubmit" class="admin-modal__body">
            <div class="form-grid">
              <div class="form-group">
                <label>Nombre *</label>
                <input v-model="form.name" required placeholder="Juan Pérez" />
              </div>
              <div class="form-group">
                <label>Email</label>
                <input v-model="form.email" type="email" placeholder="juan@email.com (opcional)" />
              </div>
              <div class="form-group">
                <label>Teléfono</label>
                <input v-model="form.phone" placeholder="+52 55 5555 1234" />
              </div>
              <div class="form-group">
                <label>Dirección</label>
                <input v-model="form.address" placeholder="Calle 123" />
              </div>
              <div class="form-group">
                <label>Ciudad</label>
                <input v-model="form.city" placeholder="CDMX" />
              </div>
              <div class="form-group">
                <label>Estado</label>
                <input v-model="form.state" placeholder="Ciudad de México" />
              </div>
              <div class="form-group">
                <label>Código Postal</label>
                <input v-model="form.postalCode" placeholder="06600" />
              </div>
            </div>
            <div class="admin-modal__footer" style="border-top:1px solid var(--border);padding-top:16px;">
              <button type="button" @click="closeModal" class="btn-secondary">Cancelar</button>
              <button type="submit" class="btn-primary" :disabled="saving">
                <i class="bi bi-check-circle"></i>
                {{ saving ? 'Guardando...' : (editing ? 'Guardar cambios' : 'Crear cliente') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </AdminLayout>

  <!-- Modal: Historial de compras -->
  <Teleport to="body">
    <div v-if="showHistory" class="modal-overlay" @click.self="closeHistory">
      <div class="modal-box">
        <div class="modal-header">
          <h2><i class="bi bi-clock-history"></i> Historial — {{ historyCustomer?.name }}</h2>
          <button @click="closeHistory" class="modal-close"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="modal-body">
          <div v-if="historyLoading" class="admin-loading" style="padding:2rem 0">
            <div class="admin-spinner"></div>
          </div>
          <div v-else-if="historyOrders.length === 0" class="history-empty">
            <i class="bi bi-bag-x"></i>
            <p>Este cliente no tiene ventas registradas.</p>
          </div>
          <div v-else>
            <p class="history-summary">
              <strong>{{ historyOrders.length }}</strong> venta(s) &nbsp;·&nbsp;
              Total: <strong>${{ formatPrice(historyTotal) }}</strong>
            </p>
            <table class="admin-table" style="margin-top:0.75rem">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="o in historyOrders" :key="o.id">
                  <td class="id-cell">#{{ o.id }}</td>
                  <td><strong>${{ formatPrice(o.totalAmount) }}</strong></td>
                  <td>
                    <span :class="['badge', historyStatusClass(o.status)]">
                      {{ historyStatusLabel(o.status) }}
                    </span>
                  </td>
                  <td>{{ formatDate(o.createdAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeHistory" class="btn-secondary">Cerrar</button>
        </div>
      </div>
    </div>
  </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { customersService } from '../services/customers';
import axiosConfig from '../config/AxiosConfig';
import AdminLayout from '../components/AdminLayout.vue';

const customers = ref([]);
const loading = ref(false);
const error = ref('');
const showModal = ref(false);
const editing = ref(false);
const saving = ref(false);

// History
const showHistory = ref(false);
const historyCustomer = ref(null);
const historyOrders = ref([]);
const historyLoading = ref(false);
const historyTotal = computed(() =>
  historyOrders.value.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
);

const emptyForm = () => ({ id: null, name: '', email: '', phone: '', address: '', city: '', state: '', postalCode: '' });
const form = ref(emptyForm());

onMounted(fetchCustomers);

async function fetchCustomers() {
  loading.value = true;
  error.value = '';
  try {
    const res = await customersService.getAll();
    customers.value = res?.data?.data || res?.data || [];
  } catch (e) {
    error.value = 'Error al cargar clientes';
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  editing.value = false;
  form.value = emptyForm();
  showModal.value = true;
}

function openEdit(c) {
  editing.value = true;
  form.value = { ...c };
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

async function handleSubmit() {
  saving.value = true;
  try {
    const payload = {
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone || undefined,
      address: form.value.address || undefined,
      city: form.value.city || undefined,
      state: form.value.state || undefined,
      postalCode: form.value.postalCode || undefined,
    };
    if (editing.value && form.value.id) {
      await customersService.update(form.value.id, payload);
      axiosConfig.ToastSuccess('¡Éxito!', 'Cliente actualizado correctamente');
    } else {
      await customersService.create(payload);
      axiosConfig.ToastSuccess('¡Éxito!', 'Cliente creado correctamente');
    }
    closeModal();
    await fetchCustomers();
  } catch (e) {
    axiosConfig.ToastError('Error', 'No se pudo guardar el cliente');
  } finally {
    saving.value = false;
  }
}

function formatPrice(val) {
  if (!val && val !== 0) return '0.00';
  return parseFloat(val).toLocaleString('es-MX', { minimumFractionDigits: 2 });
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}

function historyStatusLabel(status) {
  const map = { PENDIENTE: 'Pendiente', CONFIRMADA: 'Confirmada', CANCELADA: 'Cancelada', ENTREGADA: 'Entregada' };
  return map[status] || status;
}

function historyStatusClass(status) {
  const map = { PENDIENTE: 'badge-warning', CONFIRMADA: 'badge-success', CANCELADA: 'badge-danger', ENTREGADA: 'badge-success' };
  return map[status] || 'badge-secondary';
}

async function openHistory(customer) {
  historyCustomer.value = customer;
  showHistory.value = true;
  historyOrders.value = [];
  historyLoading.value = true;
  try {
    const res = await axiosConfig.doGet(`/api/orders?customerId=${customer.id}`);
    historyOrders.value = res.data.data || res.data || [];
  } catch (e) {
    historyOrders.value = [];
  } finally {
    historyLoading.value = false;
  }
}

function closeHistory() {
  showHistory.value = false;
  historyCustomer.value = null;
  historyOrders.value = [];
}
</script>

<style scoped>
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
.btn-view:hover { background: #dbeafe; color: #2563eb; border-color: #bfdbfe; }

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.modal-enter-active, .modal-leave-active { transition: opacity .2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

/* History modal */
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
}

.history-empty {
  text-align: center;
  padding: 2rem;
  color: #999;
}

.history-empty i {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 0.75rem;
}

.history-summary {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 0.5rem;
  padding: 0.75rem 1rem;
  background: #faf7f4;
  border-radius: 8px;
}

.history-summary strong {
  color: #141413;
}

@media (max-width: 600px) {
  .form-grid { grid-template-columns: 1fr; }
}
</style>
