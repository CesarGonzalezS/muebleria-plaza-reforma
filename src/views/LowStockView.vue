<template>
  <div>
  <AdminLayout title="Stock Bajo" subtitle="Productos que necesitan reposicion" icon="bi-exclamation-triangle">
    <template #actions>
      <button @click="fetchProducts" class="btn-secondary">
        <i class="bi bi-arrow-clockwise"></i> Refrescar
      </button>
    </template>

    <!-- Loading -->
    <div v-if="loading" class="admin-loading">
      <div class="admin-spinner"></div>
      <p>Cargando...</p>
    </div>

    <!-- Todo bien -->
    <div v-else-if="products.length === 0" class="admin-empty">
      <i class="bi bi-check-circle" style="color:#059669"></i>
      <h3>Todo en orden</h3>
      <p>No hay productos con stock bajo en este momento.</p>
    </div>

    <!-- Tabla de productos con stock bajo -->
    <div v-else class="admin-table-wrap">
      <div class="alert-banner">
        <i class="bi bi-exclamation-triangle-fill"></i>
        {{ products.length }} producto(s) necesitan reposicion de stock
      </div>

      <table class="admin-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Categoria</th>
            <th>Stock Actual</th>
            <th>Stock Minimo</th>
            <th>Estado</th>
            <th>Accion</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id" :class="rowClass(product)">
            <td>
              <div class="product-name">{{ product.name }}</div>
            </td>
            <td>{{ product.categoryName || '—' }}</td>
            <td>
              <span class="stock-badge" :class="stockBadgeClass(product)">
                {{ product.stock ?? 0 }} uds.
              </span>
            </td>
            <td class="min-stock">{{ product.minStock ?? 5 }} uds.</td>
            <td>
              <span :class="['badge', product.stock === 0 ? 'badge-danger' : 'badge-warning']">
                {{ product.stock === 0 ? 'Agotado' : 'Stock bajo' }}
              </span>
            </td>
            <td>
              <button @click="openRestock(product)" class="btn-restock">
                <i class="bi bi-plus-lg"></i> Reponer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </AdminLayout>

  <!-- Modal de reposicion -->
  <Teleport to="body">
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-box modal-sm">
        <div class="modal-header">
          <h2><i class="bi bi-plus-circle"></i> Reponer Stock</h2>
          <button @click="closeModal" class="modal-close"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="modal-body">
          <p class="modal-product-name">{{ selectedProduct?.name }}</p>
          <p class="modal-current-stock">
            Stock actual: <strong :class="selectedProduct?.stock === 0 ? 'text-danger' : 'text-warning'">
              {{ selectedProduct?.stock ?? 0 }} uds.
            </strong>
          </p>

          <div class="form-group">
            <label>Cantidad a agregar *</label>
            <input
              v-model.number="quantity"
              type="number"
              class="form-control"
              min="1"
              placeholder="Ej: 10"
            />
          </div>
          <div class="form-group">
            <label>Motivo</label>
            <select v-model="reason" class="form-control">
              <option value="Compra de mercancia">Compra de mercancia</option>
              <option value="Devolucion de cliente">Devolucion de cliente</option>
              <option value="Ajuste de inventario">Ajuste de inventario</option>
            </select>
          </div>

          <div class="stock-preview preview-add">
            <span>Nuevo stock:</span>
            <strong>{{ (selectedProduct?.stock ?? 0) + (quantity || 0) }} uds.</strong>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeModal" class="btn-secondary">Cancelar</button>
          <button @click="applyRestock" :disabled="saving" class="btn-primary">
            <span v-if="saving"><i class="bi bi-hourglass-split"></i> Guardando...</span>
            <span v-else><i class="bi bi-check-lg"></i> Confirmar</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminLayout from '@/components/AdminLayout.vue';
import axiosConfig from '@/config/AxiosConfig.js';
import { inventoryService } from '@/services/inventory.js';

const products = ref([]);
const loading = ref(false);
const showModal = ref(false);
const selectedProduct = ref(null);
const quantity = ref(1);
const reason = ref('Compra de mercancia');
const saving = ref(false);

function rowClass(product) {
  return product.stock === 0 ? 'row-danger' : 'row-warning';
}

function stockBadgeClass(product) {
  return product.stock === 0 ? 'stock-zero' : 'stock-low';
}

async function fetchProducts() {
  loading.value = true;
  try {
    const res = await axiosConfig.doGet('/api/products/low-stock');
    products.value = res.data.data || res.data || [];
  } catch (e) {
    console.error('Error cargando stock bajo:', e);
    products.value = [];
  } finally {
    loading.value = false;
  }
}

function openRestock(product) {
  selectedProduct.value = product;
  quantity.value = 1;
  reason.value = 'Compra de mercancia';
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  selectedProduct.value = null;
}

async function applyRestock() {
  if (!quantity.value || quantity.value < 1) {
    alert('La cantidad debe ser al menos 1');
    return;
  }
  saving.value = true;
  try {
    await inventoryService.addStock(selectedProduct.value.id, quantity.value, 'MANUAL', reason.value);
    await fetchProducts();
    closeModal();
  } catch (e) {
    alert('Error al reponer stock: ' + (e.response?.data?.message || e.message));
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

.alert-banner {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1rem;
  background: rgba(220, 38, 38, 0.08);
  border: 1px solid rgba(220, 38, 38, 0.25);
  border-radius: 10px;
  color: #dc2626;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.row-danger { background: rgba(220, 38, 38, 0.03); }
.row-warning { background: rgba(217, 119, 6, 0.03); }

.product-name {
  font-weight: 600;
  color: #141413;
}

.stock-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.75rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.9rem;
}

.stock-zero {
  background: rgba(220, 38, 38, 0.12);
  color: #dc2626;
}

.stock-low {
  background: rgba(217, 119, 6, 0.12);
  color: #d97706;
}

.min-stock {
  color: #999;
  font-size: 0.9rem;
}

.btn-restock {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.9rem;
  background: #860734;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-restock:hover {
  background: #6a0529;
}

/* Modal */
.modal-sm { max-width: 420px; }

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

.text-danger { color: #dc2626; }
.text-warning { color: #d97706; }

.stock-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-top: 0.75rem;
}

.preview-add {
  background: rgba(5, 150, 105, 0.1);
  color: #059669;
}

.preview-add strong {
  font-size: 1.4rem;
  font-weight: 800;
}
</style>
