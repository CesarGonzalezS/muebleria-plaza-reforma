<template>
  <div class="inventory-adjust-container">
    <div class="adjust-header">
      <h1>
        <i class="bi bi-calculator"></i>
        Ajustar Inventario
      </h1>
      <p>Manejo de stock manual y movimientos</p>
    </div>

    <nav class="admin-nav">
      <router-link to="/admin" class="admin-nav-item"><i class="bi bi-house-door"></i> Muebles</router-link>
      <router-link to="/admin-orders" class="admin-nav-item"><i class="bi bi-bag-check"></i> Órdenes</router-link>
      <router-link to="/customers" class="admin-nav-item"><i class="bi bi-people"></i> Clientes</router-link>
      <router-link to="/reports" class="admin-nav-item"><i class="bi bi-graph-up"></i> Reportes</router-link>
      <router-link to="/inventory-adjust" class="admin-nav-item"><i class="bi bi-boxes"></i> Inventario</router-link>
      <router-link to="/low-stock" class="admin-nav-item"><i class="bi bi-exclamation-triangle"></i> Stock Bajo</router-link>
    </nav>

    <!-- Tabs -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="['tab-btn', activeTab === tab.id ? 'active' : '']"
      >
        <i :class="tab.icon"></i>
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <!-- Ajustar Stock -->
      <div v-if="activeTab === 'adjust'" class="tab-pane">
        <h2>Ajustar Stock Manualmente</h2>
        <form @submit.prevent="handleAdjust">
          <div class="form-group">
            <label>ID del Producto *</label>
            <input
              v-model.number="adjust.productId"
              type="number"
              placeholder="1"
              required
            />
          </div>

          <div class="form-group">
            <label>Nueva Cantidad de Stock *</label>
            <input
              v-model.number="adjust.newQuantity"
              type="number"
              placeholder="100"
              min="0"
              required
            />
          </div>

          <div class="form-group">
            <label>Motivo del Ajuste *</label>
            <select v-model="adjust.reason" required>
              <option value="">Seleccionar motivo</option>
              <option value="Inventario físico">Inventario físico</option>
              <option value="Corrección de error">Corrección de error</option>
              <option value="Daño detectado">Daño detectado</option>
              <option value="Robo/Pérdida">Robo/Pérdida</option>
              <option value="Ajuste administrativo">Ajuste administrativo</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div v-if="errors.adjust" class="error-message">
            {{ errors.adjust }}
          </div>

          <button type="submit" class="btn-submit" :disabled="loading.adjust">
            <i class="bi bi-check-circle"></i>
            {{ loading.adjust ? 'Procesando...' : 'Ajustar Stock' }}
          </button>
        </form>
      </div>

      <!-- Agregar Stock -->
      <div v-if="activeTab === 'add'" class="tab-pane">
        <h2>Agregar Stock</h2>
        <form @submit.prevent="handleAdd">
          <div class="form-group">
            <label>ID del Producto *</label>
            <input
              v-model.number="add.productId"
              type="number"
              placeholder="1"
              required
            />
          </div>

          <div class="form-group">
            <label>Cantidad a Agregar *</label>
            <input
              v-model.number="add.quantity"
              type="number"
              placeholder="50"
              min="1"
              required
            />
          </div>

          <div class="form-group">
            <label>Tipo de Referencia</label>
            <select v-model="add.referenceType">
              <option value="MANUAL">Manual</option>
              <option value="PURCHASE_ORDER">Orden de Compra</option>
              <option value="RETURN">Devolución</option>
              <option value="TRANSFER">Transferencia</option>
              <option value="PRODUCTION">Producción</option>
            </select>
          </div>

          <div class="form-group">
            <label>Notas Adicionales</label>
            <textarea
              v-model="add.notes"
              placeholder="Notas sobre este movimiento"
              rows="3"
            ></textarea>
          </div>

          <div v-if="errors.add" class="error-message">
            {{ errors.add }}
          </div>

          <button type="submit" class="btn-submit success" :disabled="loading.add">
            <i class="bi bi-plus-circle"></i>
            {{ loading.add ? 'Procesando...' : 'Agregar Stock' }}
          </button>
        </form>
      </div>

      <!-- Remover Stock -->
      <div v-if="activeTab === 'remove'" class="tab-pane">
        <h2>Remover Stock</h2>
        <form @submit.prevent="handleRemove">
          <div class="form-group">
            <label>ID del Producto *</label>
            <input
              v-model.number="remove.productId"
              type="number"
              placeholder="1"
              required
            />
          </div>

          <div class="form-group">
            <label>Cantidad a Remover *</label>
            <input
              v-model.number="remove.quantity"
              type="number"
              placeholder="25"
              min="1"
              required
            />
          </div>

          <div class="form-group">
            <label>Motivo de la Remoción *</label>
            <select v-model="remove.reason" required>
              <option value="">Seleccionar motivo</option>
              <option value="Venta">Venta</option>
              <option value="Devolución de cliente">Devolución de cliente</option>
              <option value="Daño o deterioro">Daño o deterioro</option>
              <option value="Transferencia a otra sucursal">Transferencia a otra sucursal</option>
              <option value="Robo/Pérdida">Robo/Pérdida</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div v-if="errors.remove" class="error-message">
            {{ errors.remove }}
          </div>

          <button type="submit" class="btn-submit danger" :disabled="loading.remove">
            <i class="bi bi-dash-circle"></i>
            {{ loading.remove ? 'Procesando...' : 'Remover Stock' }}
          </button>
        </form>
      </div>
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="success-notification">
      <i class="bi bi-check-circle"></i>
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { inventoryService } from '../services/inventory';

const activeTab = ref('adjust');
const successMessage = ref('');

const tabs = [
  { id: 'adjust', label: 'Ajustar', icon: 'bi bi-calculator' },
  { id: 'add', label: 'Agregar', icon: 'bi bi-plus-circle' },
  { id: 'remove', label: 'Remover', icon: 'bi bi-dash-circle' }
];

const adjust = ref({
  productId: null,
  newQuantity: null,
  reason: ''
});

const add = ref({
  productId: null,
  quantity: null,
  referenceType: 'MANUAL',
  notes: ''
});

const remove = ref({
  productId: null,
  quantity: null,
  reason: ''
});

const loading = ref({
  adjust: false,
  add: false,
  remove: false
});

const errors = ref({
  adjust: '',
  add: '',
  remove: ''
});

async function handleAdjust() {
  errors.value.adjust = '';
  loading.value.adjust = true;

  try {
    await inventoryService.adjustStock(
      adjust.value.productId,
      adjust.value.newQuantity,
      adjust.value.reason
    );

    showSuccess('Stock ajustado exitosamente');
    adjust.value = { productId: null, newQuantity: null, reason: '' };
  } catch (err) {
    errors.value.adjust = err.response?.data?.message || 'Error al ajustar stock';
  } finally {
    loading.value.adjust = false;
  }
}

async function handleAdd() {
  errors.value.add = '';
  loading.value.add = true;

  try {
    await inventoryService.addStock(
      add.value.productId,
      add.value.quantity,
      add.value.referenceType,
      add.value.notes
    );

    showSuccess('Stock agregado exitosamente');
    add.value = { productId: null, quantity: null, referenceType: 'MANUAL', notes: '' };
  } catch (err) {
    errors.value.add = err.response?.data?.message || 'Error al agregar stock';
  } finally {
    loading.value.add = false;
  }
}

async function handleRemove() {
  errors.value.remove = '';
  loading.value.remove = true;

  try {
    await inventoryService.removeStock(
      remove.value.productId,
      remove.value.quantity,
      remove.value.reason
    );

    showSuccess('Stock removido exitosamente');
    remove.value = { productId: null, quantity: null, reason: '' };
  } catch (err) {
    errors.value.remove = err.response?.data?.message || 'Error al remover stock';
  } finally {
    loading.value.remove = false;
  }
}

function showSuccess(message) {
  successMessage.value = message;
  setTimeout(() => {
    successMessage.value = '';
  }, 3000);
}
</script>

<style scoped>
.inventory-adjust-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.adjust-header {
  margin-bottom: 2rem;
  text-align: center;
}

.adjust-header h1 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: #1f2937;
  margin: 0;
  font-size: 2rem;
}

.adjust-header h1 i {
  color: #667eea;
}

.adjust-header p {
  color: #6b7280;
  margin: 0.5rem 0 0;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e5e7eb;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  padding: 1rem;
  color: #6b7280;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
}

.tab-btn:hover {
  color: #1f2937;
}

.tab-btn.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.tab-btn i {
  font-size: 1.2rem;
}

/* Tab Content */
.tab-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.tab-pane {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tab-pane h2 {
  color: #1f2937;
  margin: 0 0 1.5rem;
  font-size: 1.3rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  color: #374151;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
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
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.error-message {
  background: #fee;
  border: 1px solid #fca;
  color: #c33;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.btn-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.btn-submit.success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.btn-submit.success:hover:not(:disabled) {
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
}

.btn-submit.danger {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
}

.btn-submit.danger:hover:not(:disabled) {
  box-shadow: 0 10px 25px rgba(220, 38, 38, 0.3);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Success Notification */
.success-notification {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #d1fae5;
  color: #065f46;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #10b981;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(500px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.success-notification i {
  font-size: 1.5rem;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .inventory-adjust-container {
    padding: 1rem;
  }

  .adjust-header h1 {
    font-size: 1.5rem;
  }

  .tabs {
    gap: 0.5rem;
  }

  .tab-btn {
    padding: 0.75rem;
    font-size: 0.9rem;
  }

  .tab-btn span {
    display: none;
  }

  .tab-content {
    padding: 1.5rem;
  }

  .success-notification {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
  }
}
.admin-nav { display:flex; gap:.25rem; padding:.75rem 2rem; background:#fff; border-bottom:2px solid #e9ecef; flex-wrap:wrap; }
.admin-nav-item { display:flex; align-items:center; gap:.4rem; padding:.5rem 1rem; border-radius:8px; color:#555; font-weight:500; font-size:.9rem; text-decoration:none; transition:all .2s; }
.admin-nav-item:hover { background:#f0f4ff; color:#007bff; }
.admin-nav-item.router-link-active { background:#007bff; color:#fff; }
</style>

