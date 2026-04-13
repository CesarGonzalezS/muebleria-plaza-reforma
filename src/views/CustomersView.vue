<template>
  <div class="customers-page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-left">
        <i class="bi bi-people"></i>
        <div>
          <h1>Clientes</h1>
          <p>Gestión de clientes registrados</p>
        </div>
      </div>
      <button @click="openCreate" class="btn-primary">
        <i class="bi bi-person-plus"></i> Nuevo Cliente
      </button>
    </div>

    <!-- Admin nav -->
    <nav class="admin-nav">
      <router-link to="/admin" class="admin-nav-item"><i class="bi bi-house-door"></i> Muebles</router-link>
      <router-link to="/admin-orders" class="admin-nav-item"><i class="bi bi-bag-check"></i> Órdenes</router-link>
      <router-link to="/customers" class="admin-nav-item"><i class="bi bi-people"></i> Clientes</router-link>
      <router-link to="/reports" class="admin-nav-item"><i class="bi bi-graph-up"></i> Reportes</router-link>
      <router-link to="/inventory-adjust" class="admin-nav-item"><i class="bi bi-boxes"></i> Inventario</router-link>
      <router-link to="/low-stock" class="admin-nav-item"><i class="bi bi-exclamation-triangle"></i> Stock Bajo</router-link>
    </nav>

    <!-- Loading -->
    <div v-if="loading" class="state-box">
      <i class="bi bi-arrow-repeat spin"></i>
      <p>Cargando clientes...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="state-box error">
      <i class="bi bi-exclamation-circle"></i>
      <p>{{ error }}</p>
      <button @click="fetchCustomers" class="btn-retry">Reintentar</button>
    </div>

    <!-- Lista vacía -->
    <div v-else-if="!customers.length" class="state-box">
      <i class="bi bi-people"></i>
      <p>No hay clientes registrados</p>
      <button @click="openCreate" class="btn-primary">Registrar primer cliente</button>
    </div>

    <!-- Tabla -->
    <div v-else class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Ciudad</th>
            <th>Órdenes</th>
            <th>Total gastado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in customers" :key="c.id">
            <td>{{ c.id }}</td>
            <td>{{ c.name }}</td>
            <td>{{ c.email }}</td>
            <td>{{ c.phone || '-' }}</td>
            <td>{{ c.city || '-' }}</td>
            <td><span class="badge">{{ c.totalOrders ?? '-' }}</span></td>
            <td>${{ formatPrice(c.totalSpent) }}</td>
            <td class="actions-cell">
              <button @click="openEdit(c)" class="btn-icon" title="Editar">
                <i class="bi bi-pencil"></i>
              </button>
              <router-link :to="`/customer-stats/${c.id}`" class="btn-icon" title="Estadísticas">
                <i class="bi bi-bar-chart"></i>
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal crear/editar -->
    <Transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-card">
          <div class="modal-header">
            <h2>{{ editing ? 'Editar Cliente' : 'Nuevo Cliente' }}</h2>
            <button @click="closeModal" class="close-btn"><i class="bi bi-x-lg"></i></button>
          </div>
          <form @submit.prevent="handleSubmit" class="modal-body">
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
            <div class="modal-footer">
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { customersService } from '../services/customers';
import axiosConfig from '../config/AxiosConfig';

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
.customers-page {
  min-height: 100vh;
  background: #f4f7fa;
}

.page-header {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: #fff;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-left i { font-size: 2.2rem; }
.header-left h1 { margin: 0; font-size: 1.5rem; }
.header-left p { margin: 0; opacity: 0.85; font-size: 0.9rem; }

.admin-nav {
  display: flex;
  gap: 0.25rem;
  padding: 0.75rem 2rem;
  background: #fff;
  border-bottom: 2px solid #e9ecef;
  flex-wrap: wrap;
}

.admin-nav-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: #555;
  font-weight: 500;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.2s;
}

.admin-nav-item:hover { background: #f0f4ff; color: #007bff; }
.admin-nav-item.router-link-active { background: #007bff; color: #fff; }

.state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
  color: #6c757d;
}

.state-box i { font-size: 3rem; }
.state-box.error { color: #dc3545; }

.spin { animation: spin 0.9s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.btn-retry {
  padding: 0.5rem 1.5rem;
  background: #dc3545;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.table-wrapper {
  padding: 2rem;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.data-table th {
  background: #007bff;
  color: #fff;
  padding: 0.9rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.88rem;
  white-space: nowrap;
}

.data-table td {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.9rem;
  color: #333;
}

.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: #f8f9ff; }

.badge {
  background: #e3f0ff;
  color: #007bff;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
}

.actions-cell { display: flex; gap: 0.4rem; }

.btn-icon {
  width: 32px; height: 32px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  background: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  color: #555;
  font-size: 0.9rem;
  transition: all 0.2s;
  text-decoration: none;
}

.btn-icon:hover { background: #007bff; color: #fff; border-color: #007bff; }

.btn-primary {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.4rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.2s;
}

.btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,123,255,0.3); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-secondary {
  background: #fff;
  color: #555;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  padding: 0.6rem 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover { border-color: #aaa; }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: 1rem;
}

.modal-card {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 560px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0,0,0,0.2);
  animation: pop 0.25s ease;
}

@keyframes pop {
  from { transform: scale(0.92); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-header {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: #fff;
  padding: 1.25rem 1.5rem;
  display: flex; align-items: center; justify-content: space-between;
}

.modal-header h2 { margin: 0; font-size: 1.25rem; }

.close-btn {
  background: rgba(255,255,255,0.15);
  border: none; color: #fff;
  width: 32px; height: 32px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 1rem;
  transition: all 0.2s;
}

.close-btn:hover { background: rgba(255,255,255,0.3); transform: rotate(90deg); }

.modal-body { padding: 1.5rem; }

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-group label {
  font-size: 0.88rem;
  font-weight: 600;
  color: #444;
}

.form-group input {
  padding: 0.6rem 0.85rem;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  font-size: 0.92rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
  margin-top: 1rem;
}

.modal-enter-active, .modal-leave-active { transition: opacity 0.25s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

@media (max-width: 600px) {
  .form-grid { grid-template-columns: 1fr; }
  .page-header { flex-direction: column; gap: 1rem; align-items: flex-start; }
  .table-wrapper { padding: 1rem; }
}
</style>

