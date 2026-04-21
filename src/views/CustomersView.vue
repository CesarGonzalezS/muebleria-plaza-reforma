<template>
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
                <router-link :to="`/customer-stats/${c.id}`" class="btn-icon btn-view" title="Estadísticas">
                  <i class="bi bi-bar-chart"></i>
                </router-link>
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
                <label>Email *</label>
                <input v-model="form.email" type="email" required placeholder="juan@email.com" />
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
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { customersService } from '../services/customers';
import axiosConfig from '../config/AxiosConfig';
import AdminLayout from '../components/AdminLayout.vue';

const customers = ref([]);
const loading = ref(false);
const error = ref('');
const showModal = ref(false);
const editing = ref(false);
const saving = ref(false);

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

@media (max-width: 600px) {
  .form-grid { grid-template-columns: 1fr; }
}
</style>
