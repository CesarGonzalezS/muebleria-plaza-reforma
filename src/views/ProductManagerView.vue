¯»¿<template>
  <div class="product-manager-container">
    <div class="manager-header">
      <h1>
        <i class="bi bi-tools"></i>
        Gestión de Productos
      </h1>
      <button @click="showFormModal = true" class="btn-create">
        <i class="bi bi-plus-circle"></i> Nuevo Producto
      </button>
    </div>

    <!-- Modal de Crear/Editar -->
    <div v-if="showFormModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button @click="closeModal" class="close-btn">
          <i class="bi bi-x"></i>
        </button>

        <h2>{{ isEditing ? 'Editar Producto' : 'Crear Nuevo Producto' }}</h2>

        <form @submit.prevent="saveProduct">
          <!-- Nombre -->
          <div class="form-group">
            <label>Nombre del Producto *</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Nombre del producto"
              required
            />
          </div>

          <!-- Descripción -->
          <div class="form-group">
            <label>Descripción *</label>
            <textarea
              v-model="form.description"
              placeholder="Descripción del producto"
              rows="3"
              required
            ></textarea>
          </div>

          <!-- Marca -->
          <div class="form-group">
            <label>Marca *</label>
            <input
              v-model="form.brandId"
              type="text"
              placeholder="ID de la marca"
              required
            />
          </div>

          <!-- Categoría -->
          <div class="form-group">
            <label>Categoría *</label>
            <input
              v-model="form.categoryId"
              type="text"
              placeholder="ID de la categoría"
              required
            />
          </div>

          <!-- Precios y Stock -->
          <div class="form-row">
            <div class="form-group">
              <label>Precio de Venta *</label>
              <input
                v-model.number="form.price"
                type="number"
                step="0.01"
                placeholder="1299.99"
                required
              />
            </div>
            <div class="form-group">
              <label>Precio de Costo *</label>
              <input
                v-model.number="form.costPrice"
                type="number"
                step="0.01"
                placeholder="800.00"
                required
              />
            </div>
          </div>

          <!-- Stock -->
          <div class="form-row">
            <div class="form-group">
              <label>Stock Actual *</label>
              <input
                v-model.number="form.stock"
                type="number"
                placeholder="15"
                required
              />
            </div>
            <div class="form-group">
              <label>Stock Mínimo *</label>
              <input
                v-model.number="form.minStock"
                type="number"
                placeholder="5"
                required
              />
            </div>
          </div>

          <!-- URL de Imagen -->
          <div class="form-group">
            <label>URL de Imagen</label>
            <input
              v-model="form.imageUrl"
              type="url"
              placeholder="https://..."
            />
          </div>

          <!-- Errores -->
          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <!-- Botones -->
          <div class="form-actions">
            <button type="submit" class="btn-submit" :disabled="loading">
              <span v-if="!loading">
                <i class="bi bi-check-circle"></i>
                {{ isEditing ? 'Actualizar' : 'Crear' }}
              </span>
              <span v-else>
                <i class="bi bi-arrow-repeat"></i> Procesando...
              </span>
            </button>
            <button type="button" @click="closeModal" class="btn-cancel">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loadingList" class="loading">
      <div class="spinner">
        <i class="bi bi-arrow-repeat"></i>
      </div>
      <p>Cargando productos...</p>
    </div>

    <!-- Error -->
    <div v-else-if="errorList" class="error-message">
      <i class="bi bi-exclamation-circle"></i>
      {{ errorList }}
      <button @click="fetchProducts" class="retry-btn">Reintentar</button>
    </div>

    <!-- Lista de productos -->
    <div v-else-if="products.length > 0" class="products-grid">
      <div v-for="product in products" :key="product.id" class="product-card">
        <div v-if="product.imageUrl" class="card-image">
          <img :src="product.imageUrl" :alt="product.name" />
        </div>
        <div v-else class="card-image-placeholder">
          <i class="bi bi-image"></i>
        </div>

        <div class="card-content">
          <h3>{{ product.name }}</h3>
          <p class="description">{{ product.description }}</p>

          <div class="info-row">
            <span class="label">Precio:</span>
            <span class="value">${{ formatPrice(product.price) }}</span>
          </div>

          <div class="info-row">
            <span class="label">Stock:</span>
            <span :class="['value', product.stock <= product.minStock ? 'low' : '']">
              {{ product.stock }}
            </span>
          </div>

          <div class="card-actions">
            <button @click="editProduct(product)" class="btn-edit">
              <i class="bi bi-pencil"></i> Editar
            </button>
            <button @click="deleteProductConfirm(product.id)" class="btn-delete">
              <i class="bi bi-trash"></i> Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <i class="bi bi-inbox"></i>
      <p>No hay productos</p>
      <button @click="showFormModal = true" class="btn-create">
        <i class="bi bi-plus-circle"></i> Crear Primer Producto
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { productService } from '../services/products';

const products = ref([]);
const showFormModal = ref(false);
const isEditing = ref(false);
const editingId = ref(null);
const loading = ref(false);
const loadingList = ref(false);
const error = ref('');
const errorList = ref('');

const form = ref({
  name: '',
  description: '',
  price: null,
  costPrice: null,
  stock: null,
  minStock: null,
  imageUrl: '',
  brandId: '',
  categoryId: ''
});

onMounted(() => {
  fetchProducts();
});

async function fetchProducts() {
  loadingList.value = true;
  errorList.value = '';

  try {
    const response = await productService.getAllProducts();
    if (response.data.success) {
      products.value = response.data.data || [];
    }
  } catch (err) {
    errorList.value = 'Error al cargar productos';
  } finally {
    loadingList.value = false;
  }
}

function editProduct(product) {
  isEditing.value = true;
  editingId.value = product.id;
  form.value = { ...product };
  showFormModal.value = true;
}

async function saveProduct() {
  error.value = '';
  loading.value = true;

  try {
    if (isEditing.value) {
      await productService.updateProduct(editingId.value, form.value);
    } else {
      await productService.createProduct(form.value);
    }

    closeModal();
    await fetchProducts();
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al guardar producto';
  } finally {
    loading.value = false;
  }
}

async function deleteProductConfirm(id) {
  if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
    try {
      await productService.deleteProduct(id);
      await fetchProducts();
    } catch (err) {
      errorList.value = 'Error al eliminar producto';
    }
  }
}

function closeModal() {
  showFormModal.value = false;
  isEditing.value = false;
  editingId.value = null;
  form.value = {
    name: '',
    description: '',
    price: null,
    costPrice: null,
    stock: null,
    minStock: null,
    imageUrl: '',
    brandId: '',
    categoryId: ''
  };
  error.value = '';
}

function formatPrice(price) {
  return parseFloat(price).toFixed(2);
}
</script>

<style scoped>
.product-manager-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.manager-header h1 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--ink);
  margin: 0;
  font-size: 1.8rem;
}

.btn-create {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--canvas);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--r-card);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-create:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
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
  background: var(--white);
  border-radius: 12px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--canvas);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: var(--r-card);
  cursor: pointer;
  font-size: 1.5rem;
  color: var(--slate);
  transition: all 0.2s;
}

.close-btn:hover {
  background: #e5e7eb;
  color: var(--ink);
}

.modal-content h2 {
  color: var(--ink);
  margin: 0 0 1.5rem;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  color: var(--charcoal);
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  font-family: inherit;
  box-sizing: border-box;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--ink);
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.error-message {
  background: #fee;
  border: 1px solid #fca;
  color: #c33;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-submit,
.btn-cancel {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-submit {
  background: var(--canvas);
  color: white;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  background: var(--canvas);
  color: var(--ink);
}

.btn-cancel:hover {
  background: #e5e7eb;
}

/* Loading */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  color: var(--slate);
}

.spinner {
  font-size: 3rem;
  color: var(--ink);
  margin-bottom: 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.product-card {
  background: var(--white);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
}

.card-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: var(--canvas);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-image-placeholder {
  width: 100%;
  height: 200px;
  background: var(--canvas);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #d1d5db;
}

.card-content {
  padding: 1rem;
}

.card-content h3 {
  margin: 0 0 0.5rem;
  color: var(--ink);
  font-size: 1.1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.description {
  color: var(--slate);
  font-size: 0.85rem;
  margin: 0 0 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 0.9rem;
}

.info-row .label {
  color: var(--slate);
  font-weight: 600;
}

.info-row .value {
  color: var(--ink);
  font-weight: 600;
}

.info-row .value.low {
  color: #dc2626;
}

.card-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.btn-edit,
.btn-delete {
  flex: 1;
  padding: 0.6rem;
  border: none;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
}

.btn-edit {
  background: #dbeafe;
  color: #1e40af;
}

.btn-edit:hover {
  background: #bfdbfe;
}

.btn-delete {
  background: #fee2e2;
  color: #991b1b;
}

.btn-delete:hover {
  background: #fecaca;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  background: var(--canvas-lifted);
  border-radius: 12px;
  text-align: center;
  color: #9ca3af;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

@media (max-width: 768px) {
  .manager-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .modal-content {
    padding: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>

