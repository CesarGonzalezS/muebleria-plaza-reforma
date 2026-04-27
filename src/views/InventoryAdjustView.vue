<template>
  <div>
  <AdminLayout title="Inventario" subtitle="Entradas y salidas de stock" icon="bi-boxes">
    <template #actions>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar producto..."
        class="filter-input"
      />
      <button @click="fetchProducts" class="btn-secondary">
        <i class="bi bi-arrow-clockwise"></i> Refrescar
      </button>
    </template>

    <!-- Stats -->
    <div class="inv-stats" v-if="!loading">
      <div class="inv-stat">
        <span class="inv-stat__value">{{ products.length }}</span>
        <span class="inv-stat__label">Total productos</span>
      </div>
      <div class="inv-stat inv-stat--ok">
        <span class="inv-stat__value">{{ statsInStock }}</span>
        <span class="inv-stat__label">En stock</span>
      </div>
      <div class="inv-stat inv-stat--warn">
        <span class="inv-stat__value">{{ statsLowStock }}</span>
        <span class="inv-stat__label">Stock bajo</span>
      </div>
      <div class="inv-stat inv-stat--danger">
        <span class="inv-stat__value">{{ statsOutOfStock }}</span>
        <span class="inv-stat__label">Agotados</span>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="admin-loading">
      <div class="admin-spinner"></div>
      <p>Cargando inventario...</p>
    </div>

    <!-- Tabla de inventario -->
    <div v-else class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Stock actual</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredProducts" :key="product.id">
            <td data-label="Producto">
              <div class="product-name">{{ product.name }}</div>
              <div class="product-sku" v-if="product.sku">SKU: {{ product.sku }}</div>
            </td>
            <td data-label="Categoría">{{ product.categoryName || '—' }}</td>
            <td data-label="Stock actual">
              <span class="stock-number" :class="stockClass(product)">
                {{ product.stock ?? 0 }} uds.
              </span>
            </td>
            <td data-label="Estado">
              <span :class="['badge', stockBadgeClass(product)]">
                {{ stockLabel(product) }}
              </span>
            </td>
            <td data-label="Acciones" class="actions-cell">
              <button @click="openModal(product, 'add')" class="btn-icon btn-success" title="Agregar stock">
                <i class="bi bi-plus-lg"></i>
              </button>
              <button @click="openModal(product, 'remove')" class="btn-icon btn-danger" title="Quitar stock" :disabled="(product.stock ?? 0) <= 0">
                <i class="bi bi-dash-lg"></i>
              </button>
            </td>
          </tr>
          <tr v-if="filteredProducts.length === 0">
            <td colspan="5" style="text-align:center;padding:2rem;color:#999">
              No se encontraron productos.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Historial reciente -->
    <div class="movements-section" v-if="movements.length > 0">
      <h3 class="section-title"><i class="bi bi-clock-history"></i> Últimos movimientos</h3>
      <div class="movements-list">
        <div v-for="m in movements" :key="m.id" class="movement-item">
          <span :class="['movement-icon', m.type === 'ENTRADA' ? 'movement-add' : 'movement-remove']">
            <i :class="m.type === 'ENTRADA' ? 'bi bi-arrow-up-circle-fill' : 'bi bi-arrow-down-circle-fill'"></i>
          </span>
          <div class="movement-info">
            <span class="movement-product">{{ m.productName }}</span>
            <span class="movement-reason">{{ m.reason || 'Sin motivo' }}</span>
          </div>
          <span :class="['movement-qty', m.type === 'ENTRADA' ? 'movement-add' : 'movement-remove']">
            {{ m.type === 'ENTRADA' ? '+' : '-' }}{{ m.quantity }}
          </span>
          <span class="movement-date">{{ formatDate(m.createdAt) }}</span>
        </div>
      </div>
    </div>
  </AdminLayout>

  <!-- Modal de ajuste -->
  <Teleport to="body">
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-box modal-sm">
        <div class="modal-header">
          <h2>
            <i :class="modalType === 'add' ? 'bi bi-plus-circle' : 'bi bi-dash-circle'"></i>
            {{ modalType === 'add' ? 'Agregar Stock' : 'Quitar Stock' }}
          </h2>
          <button @click="closeModal" class="modal-close"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="modal-body">
          <p class="modal-product-name">{{ selectedProduct?.name }}</p>
          <p class="modal-current-stock">Stock actual: <strong>{{ selectedProduct?.stock ?? 0 }}</strong></p>

          <div class="form-group">
            <label>Cantidad *</label>
            <input
              v-model.number="adjustForm.quantity"
              type="number"
              class="form-control"
              min="1"
              :max="modalType === 'remove' ? selectedProduct?.stock : undefined"
            />
          </div>
          <div class="form-group">
            <label>Motivo</label>
            <select v-model="adjustForm.reason" class="form-control">
              <option value="">Seleccionar motivo...</option>
              <template v-if="modalType === 'add'">
                <option value="Compra de mercancía">Compra de mercancía</option>
                <option value="Devolución de cliente">Devolución de cliente</option>
                <option value="Ajuste de inventario">Ajuste de inventario</option>
                <option value="Otro">Otro</option>
              </template>
              <template v-else>
                <option value="Venta">Venta</option>
                <option value="Daño o pérdida">Daño o pérdida</option>
                <option value="Ajuste de inventario">Ajuste de inventario</option>
                <option value="Muestra o display">Muestra o display</option>
                <option value="Otro">Otro</option>
              </template>
            </select>
          </div>
          <div class="form-group" v-if="adjustForm.reason === 'Otro'">
            <label>Especificar motivo</label>
            <input v-model="adjustForm.customReason" type="text" class="form-control" placeholder="Describe el motivo..." />
          </div>

          <div class="stock-preview" :class="modalType === 'add' ? 'preview-add' : 'preview-remove'">
            <span>Nuevo stock:</span>
            <strong>{{ newStockPreview }}</strong>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeModal" class="btn-secondary">Cancelar</button>
          <button @click="applyAdjust" :disabled="saving" :class="modalType === 'add' ? 'btn-success' : 'btn-danger'">
            <span v-if="saving"><i class="bi bi-hourglass-split"></i> Guardando...</span>
            <span v-else>{{ modalType === 'add' ? 'Agregar' : 'Quitar' }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';
import AdminLayout from '@/components/AdminLayout.vue';
import axiosConfig from '@/config/AxiosConfig.js';
import { inventoryService } from '@/services/inventory.js';

const products = ref([]);
const movements = ref([]);
const loading = ref(false);
const searchQuery = ref('');
const showModal = ref(false);
const selectedProduct = ref(null);
const modalType = ref('add');
const saving = ref(false);

const adjustForm = ref({ quantity: 1, reason: '', customReason: '' });

const filteredProducts = computed(() => {
  if (!searchQuery.value.trim()) return products.value;
  const q = searchQuery.value.toLowerCase();
  return products.value.filter(p =>
    p.name?.toLowerCase().includes(q) ||
    p.categoryName?.toLowerCase().includes(q) ||
    p.sku?.toLowerCase().includes(q)
  );
});

const statsInStock  = computed(() => products.value.filter(p => (p.stock ?? 0) > (p.minStock ?? 5)).length);
const statsLowStock = computed(() => products.value.filter(p => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= (p.minStock ?? 5)).length);
const statsOutOfStock = computed(() => products.value.filter(p => (p.stock ?? 0) === 0).length);

const newStockPreview = computed(() => {
  const current = selectedProduct.value?.stock ?? 0;
  const qty = adjustForm.value.quantity || 0;
  return modalType.value === 'add' ? current + qty : Math.max(0, current - qty);
});

function stockClass(product) {
  const stock = product.stock ?? 0;
  const min = product.minStock ?? 5;
  if (stock === 0) return 'stock-zero';
  if (stock <= min) return 'stock-low';
  return 'stock-ok';
}

function stockBadgeClass(product) {
  const stock = product.stock ?? 0;
  const min = product.minStock ?? 5;
  if (stock === 0) return 'badge-danger';
  if (stock <= min) return 'badge-warning';
  return 'badge-success';
}

function stockLabel(product) {
  const stock = product.stock ?? 0;
  const min = product.minStock ?? 5;
  if (stock === 0) return 'Agotado';
  if (stock <= min) return 'Stock bajo';
  return 'En stock';
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

async function fetchProducts() {
  loading.value = true;
  try {
    const res = await axiosConfig.doGet('/api/products');
    products.value = res.data.data || res.data || [];
  } catch (e) {
    console.error('Error cargando productos:', e);
  } finally {
    loading.value = false;
  }
}

async function fetchMovements(productId) {
  if (!productId) return;
  try {
    const res = await inventoryService.getMovements(productId);
    movements.value = res.data.data?.content || res.data.data || res.data || [];
  } catch {
    movements.value = [];
  }
}

function openModal(product, type) {
  selectedProduct.value = product;
  modalType.value = type;
  adjustForm.value = { quantity: 1, reason: '', customReason: '' };
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  selectedProduct.value = null;
}

async function applyAdjust() {
  if (!adjustForm.value.quantity || adjustForm.value.quantity < 1) {
    Swal.fire({ icon: 'warning', title: 'Cantidad inválida', text: 'La cantidad debe ser al menos 1', confirmButtonColor: '#860734' });
    return;
  }
  if (modalType.value === 'remove' && adjustForm.value.quantity > (selectedProduct.value?.stock ?? 0)) {
    Swal.fire({ icon: 'warning', title: 'Stock insuficiente', text: 'No puedes quitar más stock del disponible', confirmButtonColor: '#860734' });
    return;
  }

  saving.value = true;
  try {
    const reason = adjustForm.value.reason === 'Otro'
      ? (adjustForm.value.customReason || 'Ajuste manual')
      : (adjustForm.value.reason || 'Ajuste manual');

    const productId = selectedProduct.value.id;
    const productName = selectedProduct.value.name;
    const qty = adjustForm.value.quantity;

    if (modalType.value === 'add') {
      await inventoryService.addStock(productId, qty, 'MANUAL', reason);
    } else {
      await inventoryService.removeStock(productId, qty, reason);
    }
    closeModal();
    await fetchProducts();
    await fetchMovements(productId);
    Swal.fire({
      icon: 'success',
      title: modalType.value === 'add' ? 'Stock agregado' : 'Stock reducido',
      text: `${productName}: ${modalType.value === 'add' ? '+' : '-'}${qty} unidades.`,
      timer: 2000,
      showConfirmButton: false
    });
  } catch (e) {
    Swal.fire({ icon: 'error', title: 'Error', text: e.response?.data?.message || e.message || 'No se pudo ajustar el stock', confirmButtonColor: '#860734' });
  } finally {
    saving.value = false;
  }
}

onMounted(fetchProducts);
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

.product-name {
  font-weight: 600;
  color: #141413;
}

.product-sku {
  font-size: 0.78rem;
  color: #999;
  margin-top: 2px;
}

.stock-number {
  font-size: 1.2rem;
  font-weight: 700;
}

.stock-zero { color: #dc2626; }
.stock-low  { color: #d97706; }
.stock-ok   { color: #059669; }

.filter-input {
  padding: 0.5rem 0.9rem;
  border: 1px solid #e0d0e0;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}

.filter-input:focus {
  border-color: #860734;
}

/* Movements */
.movements-section {
  margin-top: 2rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: #860734;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.movements-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.movement-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: white;
  border-radius: 10px;
  border: 1px solid #f0e0e8;
}

.movement-icon {
  font-size: 1.3rem;
}

.movement-add  { color: #059669; }
.movement-remove { color: #dc2626; }

.movement-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.movement-product {
  font-weight: 600;
  font-size: 0.9rem;
  color: #141413;
}

.movement-reason {
  font-size: 0.78rem;
  color: #999;
}

.movement-qty {
  font-weight: 700;
  font-size: 1rem;
  min-width: 40px;
  text-align: right;
}

.movement-date {
  font-size: 0.78rem;
  color: #999;
  white-space: nowrap;
}

/* Modal */
.modal-sm {
  max-width: 440px;
}

.modal-product-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #141413;
  margin: 0 0 0.25rem;
}

.modal-current-stock {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 1.25rem;
}

.stock-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.95rem;
  margin-top: 0.75rem;
}

.preview-add {
  background: rgba(5, 150, 105, 0.1);
  color: #059669;
}

.preview-remove {
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
}

.preview-add strong,
.preview-remove strong {
  font-size: 1.4rem;
  font-weight: 800;
}

.btn-success {
  background: #059669;
  color: white;
  border: none;
  padding: 0.55rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-success:hover:not(:disabled) {
  background: #047857;
}

.btn-danger {
  background: #dc2626;
  color: white;
  border: none;
  padding: 0.55rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-danger:hover:not(:disabled) {
  background: #b91c1c;
}

.btn-icon.btn-success {
  padding: 0.35rem 0.6rem;
  font-size: 0.9rem;
}

.btn-icon.btn-danger {
  padding: 0.35rem 0.6rem;
  font-size: 0.9rem;
}

.btn-icon:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ── Stats cards ── */
.inv-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.inv-stat {
  background: #fff;
  border: 1px solid rgba(134,7,52,0.1);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.inv-stat__value {
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1;
  color: #141413;
}

.inv-stat__label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.inv-stat--ok    { border-left: 3px solid #059669; }
.inv-stat--ok .inv-stat__value    { color: #059669; }
.inv-stat--warn  { border-left: 3px solid #d97706; }
.inv-stat--warn .inv-stat__value  { color: #d97706; }
.inv-stat--danger{ border-left: 3px solid #dc2626; }
.inv-stat--danger .inv-stat__value{ color: #dc2626; }

/* ── Responsive ── */
@media (max-width: 900px) {
  .inv-stats { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .inv-stats { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-bottom: 1rem; }
  .inv-stat { padding: 0.875rem 1rem; }
  .inv-stat__value { font-size: 1.4rem; }

  /* Table → card layout */
  .admin-table thead { display: none; }

  .admin-table tbody,
  .admin-table tr { display: block; width: 100%; }

  .admin-table tr {
    background: #fff;
    border-radius: 12px;
    border: 1px solid rgba(134,7,52,0.1);
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    margin-bottom: 0.875rem;
    padding: 0.75rem 1rem;
  }

  .admin-table td {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.4rem 0;
    border: none;
    font-size: 0.875rem;
    gap: 0.5rem;
  }

  .admin-table td::before {
    content: attr(data-label);
    font-weight: 600;
    color: #6b7280;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    flex-shrink: 0;
    min-width: 85px;
  }

  .admin-table td.actions-cell {
    flex-direction: column;
    align-items: flex-start;
    border-top: 1px solid #f0e8f0;
    padding-top: 0.6rem;
    margin-top: 0.25rem;
  }

  .admin-table td.actions-cell::before { display: none; }

  .actions-cell {
    gap: 0.5rem;
    width: 100%;
  }

  .btn-icon.btn-success,
  .btn-icon.btn-danger {
    flex: 1;
    padding: 0.6rem;
    justify-content: center;
    border-radius: 8px;
    font-size: 1rem;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  /* Movements list */
  .movement-item {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .movement-date { width: 100%; margin-left: 2.5rem; }

  /* Modal → bottom sheet */
  .modal-overlay { align-items: flex-end; padding: 0; }
  .modal-box, .modal-sm {
    max-width: 100%;
    border-radius: 20px 20px 0 0;
    max-height: 90vh;
  }
}

@media (max-width: 480px) {
  .inv-stats { grid-template-columns: repeat(2, 1fr); gap: 0.5rem; }
  .inv-stat__value { font-size: 1.25rem; }
  .modal-body, .modal-header, .modal-footer { padding-left: 1rem; padding-right: 1rem; }
}
</style>
