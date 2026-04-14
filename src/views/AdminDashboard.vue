<template>
  <div class="admin-dashboard">
    <!-- Header del Dashboard -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="header-title-section">
          <i class="bi bi-speedometer2"></i>
          <div>
            <h1>Panel de Administración</h1>
            <p>Gestiona tu inventario de muebles</p>
          </div>
        </div>
        <button @click="logout" class="logout-btn">
          <i class="bi bi-box-arrow-right"></i>
          Cerrar sesión
        </button>
      </div>
    </div>

    <!-- Navegación rápida entre secciones admin -->
    <nav class="admin-nav">
      <router-link to="/admin" class="admin-nav-item active">
        <i class="bi bi-house-door"></i> Muebles
      </router-link>
      <router-link to="/admin-orders" class="admin-nav-item">
        <i class="bi bi-bag-check"></i> Órdenes
      </router-link>
      <router-link to="/customers" class="admin-nav-item">
        <i class="bi bi-people"></i> Clientes
      </router-link>
      <router-link to="/reports" class="admin-nav-item">
        <i class="bi bi-graph-up"></i> Reportes
      </router-link>
      <router-link to="/inventory-adjust" class="admin-nav-item">
        <i class="bi bi-boxes"></i> Inventario
      </router-link>
      <router-link to="/low-stock" class="admin-nav-item">
        <i class="bi bi-exclamation-triangle"></i> Stock Bajo
      </router-link>
    </nav>

    <!-- Contenedor principal -->
    <div class="dashboard-content">
      <!-- Loading state -->
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Cargando muebles...</p>
      </div>

      <!-- Content cuando no está cargando -->
      <div v-else class="content-wrapper">
        <!-- Barra de acciones -->
        <div class="actions-bar">
          <div class="actions-left">
            <button @click="openCreateForm" class="btn-primary">
              <i class="bi bi-plus-circle"></i>
              Agregar Mueble
            </button>
            <button @click="openCreateCategory" class="btn-secondary" style="margin-left:0.75rem">
              <i class="bi bi-tags"></i>
              Nueva Categoría
            </button>
          </div>
          <div class="stats-summary">
            <div class="stat-item">
              <i class="bi bi-box-seam"></i>
              <span>{{ furnitureList.length }} productos</span>
            </div>
          </div>
        </div>

        <!-- Sección de categorías integrada -->
        <div class="categories-section">
          <div class="section-header">
            <h2>Categorías</h2>
            <p class="muted">Gestiona las categorías disponibles en el catálogo</p>
          </div>

          <div v-if="categories.length" class="categories-grid">
            <div v-for="cat in categories" :key="cat.id" class="category-card-mini">
              <div class="cat-left">
                <div class="icon-area-small">
                  <div class="no-icon-small"><i class="bi bi-tags"></i></div>
                </div>
              </div>
              <div class="cat-mid">
                <strong class="cat-name">{{ cat.name }}</strong>
                <div class="muted small">{{ cat.description || '-' }}</div>
              </div>
              <div class="cat-actions">
                <button class="btn-icon" @click="openEditCategory(cat)"><i class="bi bi-pencil"></i></button>
                <button class="btn-icon btn-delete" @click="confirmDeleteCategory(cat)"><i class="bi bi-trash"></i></button>
              </div>
            </div>
          </div>

          <div v-else class="empty-state small">
            <i class="bi bi-inbox"></i>
            <h4>No hay categorías</h4>
            <p>Añade categorías para organizar tus muebles</p>
            <button class="btn-primary" @click="openCreateCategory">Crear Categoría</button>
          </div>
        </div>

        <!-- Tabla de productos -->
        <div v-if="furnitureList.length" class="table-container">
          <table class="furniture-table">
            <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Marca</th>
              <th>Color</th>
              <th>Material</th>
              <th>Dimensiones</th>
              <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in furnitureList" :key="item.id" class="table-row">
              <td data-label="Imagen" class="img-cell">
                <div class="img-wrapper">
                  <img v-if="getMainImage(item)" :src="getMainImage(item)" :alt="`Imagen de ${item.name}`" :title="`Imagen de ${item.name}`" />
                  <div v-else class="no-image" role="img" aria-label="Sin imagen disponible">
                    <i class="bi bi-image" aria-hidden="true"></i>
                  </div>
                </div>
              </td>
              <td data-label="Nombre" class="name-cell">{{ item.name }}</td>
              <td data-label="Precio" class="price-cell">${{ item.price.toLocaleString('es-MX') }}</td>
              <td data-label="Categoría">
                <span class="category-badge">{{ item.categoryName || getCategoryLabel(item.categoryId || item.category_id || item.category) }}</span>
              </td>
              <td data-label="Stock">
                  <span :class="['stock-badge', getStockClass(item.stock)]">
                    {{ item.stock }}
                  </span>
              </td>
              <td data-label="Marca">{{ item.brandName || item.brand || '-' }}</td>
              <td data-label="Color">
                <span class="color-dot" :style="{ background: item.color || '#ccc' }"></span>
                {{ item.color || '-' }}
              </td>
              <td data-label="Material">{{ item.material || '-' }}</td>
              <td data-label="Dimensiones">{{ item.dimensions || '-' }}</td>
              <td data-label="Acciones" class="actions-cell">
                <button @click="openEditForm(item)" class="btn-icon btn-edit" title="Editar">
                  <i class="bi bi-pencil"></i>
                </button>
                <button @click="deleteFurniture(item.id)" class="btn-icon btn-delete" title="Eliminar">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- Estado vacío -->
        <div v-else class="empty-state">
          <i class="bi bi-inbox"></i>
          <h3>No hay muebles registrados</h3>
          <p>Comienza agregando tu primer producto</p>
          <button @click="openCreateForm" class="btn-primary">
            <i class="bi bi-plus-circle"></i>
            Agregar Mueble
          </button>
        </div>
      </div>
    </div>

    <!-- Modal del formulario (Mueble) -->
    <FurnitureFormModal
      :is-open="showForm"
      :is-editing="isEditing"
      :furniture-data="form"
      :categories="categories"
      @close="showForm = false"
      @success="handleFurnitureSuccess"
      @open-category-form="openCreateCategory"
    />

    <!-- Modal del formulario (Categoría) -->
    <CategoryFormModal
      :is-open="showCategoryForm"
      :is-editing="isEditingCategory"
      :category-data="categoryForm"
      @close="showCategoryForm = false"
      @success="handleCategorySuccess"
    />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import axiosConfig from '../config/AxiosConfig.js';
import { ref, reactive, onMounted } from 'vue';
import * as categoriesService from '../services/categories';
import FurnitureFormModal from '../components/FurnitureFormModal.vue';
import CategoryFormModal from '../components/CategoryFormModal.vue';

const router = useRouter();
const furnitureList = ref([]);
const loading = ref(false);
const error = ref('');
const showForm = ref(false);
const isEditing = ref(false);
const form = reactive({
  id: null,
  name: '',
  description: '',
  price: 0,
  category_id: null,
  images: [], // Array de imágenes en base64
  stock: 0,
  brand: '',
  color: '',
  material: '',
  dimensions: ''
});


const categories = ref([]);

// --- NUEVO: estados y formulario para categorías integradas ---
const showCategoryForm = ref(false);
const isEditingCategory = ref(false);
// Removed icon_base64 from categoryForm
const categoryForm = reactive({ id: null, name: '', description: '' });

async function fetchCategories() {
  try {
    console.log('📂 Cargando categorías...');
    const res = await categoriesService.getCategories();
    // res = { success: true, data: [{id, name, ...}] }
    const data = res?.data;
    categories.value = Array.isArray(data) ? data : [];
    console.log('✅ Categorías cargadas:', categories.value.length);
  } catch (e) {
    console.error('❌ Error cargando categorías:', {
      status: e.response?.status,
      message: e.response?.data?.message,
      error: e.message
    });
    categories.value = [];
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
  router.push('/login');
}

async function fetchFurniture() {
  loading.value = true;
  try {
    console.log('📦 Cargando muebles...');
    const res = await axiosConfig.doGet('/furniture/');
    const data = res?.data?.data;
    furnitureList.value = Array.isArray(data) ? data : [];
    console.log('✅ Muebles cargados:', furnitureList.value.length);
  } catch (e) {
    error.value = 'Error al cargar productos';
    console.error('❌ Error al cargar muebles:', {
      status: e.response?.status,
      message: e.response?.data?.message,
      error: e.message
    });
  } finally {
    loading.value = false;
  }
}

async function openCreateForm() {
  isEditing.value = false;
  // Ensure categories are up-to-date before opening the form
  await fetchCategories();
  Object.assign(form, {
    id: null,
    name: '',
    description: '',
    price: 0,
    category_id: null,
    images: [],
    stock: 0,
    brand: '',
    color: '',
    material: '',
    dimensions: ''
  });
  showForm.value = true;
}

function openEditForm(item) {
  isEditing.value = true;
  // Soporta categoryId (nueva API /furniture/) y category_id (formato antiguo)
  const catId = item.categoryId || item.category_id || (item.category && (item.category.id || item.category));

  // Normalizar imágenes: soporta imageUrl (nueva API) y arrays de imágenes (formato antiguo)
  let itemImages = [];
  if (item.images && Array.isArray(item.images) && item.images.length > 0) {
    itemImages = item.images.map(img => (typeof img === 'string' ? img : (img.img_base64 || img.url || img))).filter(Boolean);
  } else if (item.imageUrl) {
    itemImages = [item.imageUrl];
  } else if (item.img_base64) {
    itemImages = [item.img_base64];
  }

  Object.assign(form, {
    ...item,
    category_id: catId,
    costPrice: item.costPrice || item.cost_price || 0,
    minStock: item.minStock || item.min_stock || 0,
    imageUrl: item.imageUrl || '',
    images: itemImages
  });
  showForm.value = true;
}

// --- NUEVO: funciones para CRUD de categorías dentro del dashboard ---
function openCreateCategory() {
  isEditingCategory.value = false;
  Object.assign(categoryForm, { id: null, name: '', description: '' });
  showCategoryForm.value = true;
}

function openEditCategory(cat) {
  isEditingCategory.value = true;
  Object.assign(categoryForm, { id: cat.id, name: cat.name, description: cat.description || '' });
  showCategoryForm.value = true;
}

// El modal ahora maneja la API directamente, solo necesitamos recargar las categorías
async function handleCategorySuccess() {
  showCategoryForm.value = false;
  await fetchCategories();
  // Si hay un formulario de mueble abierto, actualizar su lista de categorías también
  if (showForm.value) {
    // Las categorías ya están actualizadas en categories.value
  }
}

function confirmDeleteCategory(cat) {
  if (!confirm(`¿Eliminar la categoría "${cat.name}"?`)) return;
  deleteCategoryRequest(cat.id);
}

async function deleteCategoryRequest(id) {
  try {
    await categoriesService.deleteCategory(id);
    axiosConfig.ToastSuccess('Eliminado', 'Categoría eliminada correctamente');
    fetchCategories();
  } catch (err) {
    console.error(err);
    if (err.response && err.response.status === 400) {
      axiosConfig.ToastWarning('No se puede eliminar', 'La categoría tiene muebles asociados');
    } else {
      axiosConfig.ToastError('Error', 'No se pudo eliminar la categoría');
    }
  }
}


// El modal ahora maneja la API directamente, solo necesitamos recargar los muebles
async function handleFurnitureSuccess() {
  showForm.value = false;
  await fetchFurniture();
}

async function deleteFurniture(id) {
  if (!confirm('¿Seguro que deseas eliminar este mueble?')) return;
  try {
    await axiosConfig.doDelete(`/furniture/${id}`);
    axiosConfig.ToastSuccess('¡Éxito!', 'Mueble eliminado correctamente.');
    fetchFurniture();
  } catch (e) {
    console.error('Error al eliminar:', e);
  }
}


onMounted(() => {
  fetchFurniture();
  fetchCategories();
});

function getCategoryLabel(value) {
  // Si nos pasan un objeto category, devolver su nombre
  if (!value && value !== 0) return '-';
  if (typeof value === 'object') {
    return value.name || value.categoryName || '-';
  }
  // value puede venir como id (number/string)
  const id = Number(value);
  const cat = categories.value.find(c => Number(c.id) === id);
  return cat ? cat.name : String(value);
}

function getStockClass(stock) {
  if (stock === undefined || stock === null) return '';
  if (stock === 0) return 'stock-empty';
  if (stock > 0 && stock <= 5) return 'stock-low';
  if (stock > 5 && stock <= 20) return 'stock-medium';
  if (stock > 20) return 'stock-high';
  return '';
}

// Helper para obtener la primera imagen de un mueble
function getMainImage(item) {
  // Soporta imageUrl (nueva API /furniture/)
  if (item.imageUrl) return item.imageUrl;
  // Soporta array de imágenes (formato antiguo)
  if (item.images && Array.isArray(item.images) && item.images.length > 0) {
    const firstImage = item.images[0];
    return typeof firstImage === 'string' ? firstImage : (firstImage.img_base64 || firstImage.url || null);
  }
  if (item.img_base64) return item.img_base64;
  return null;
}
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: #f9fafb;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #111827;
}

/* Header */
.dashboard-header {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

.header-title-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-title-section i {
  font-size: 1.25rem;
  color: #6b7280;
}

.header-title-section h1 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: #111827;
}

.header-title-section p {
  margin: 0.1rem 0 0;
  font-size: 0.8125rem;
  color: #6b7280;
}

.logout-btn {
  background: transparent;
  border: 1px solid #e5e7eb;
  color: #374151;
  padding: 0.4375rem 0.875rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  transition: background 0.15s, border-color 0.15s;
  font-family: inherit;
}
.logout-btn:hover { background: #f3f4f6; border-color: #d1d5db; }

/* Dashboard content */
.dashboard-content {
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Loading */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem;
  color: #6b7280;
}

.spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #e5e7eb;
  border-top-color: #111827;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Actions bar */
.actions-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.actions-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn-primary {
  background: #111827;
  color: #fff;
  border: 1px solid #111827;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  transition: background 0.15s;
  font-family: inherit;
}
.btn-primary:hover { background: #374151; border-color: #374151; }

.btn-secondary {
  background: #ffffff;
  color: #374151;
  border: 1px solid #e5e7eb;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  transition: background 0.15s;
  font-family: inherit;
}
.btn-secondary:hover { background: #f9fafb; }

.stats-summary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

/* Categories section */
.categories-section {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.25rem;
}

.section-header {
  margin-bottom: 1rem;
}

.section-header h2 {
  font-size: 0.9375rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  color: #111827;
}

.muted { color: #6b7280; }

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 0.75rem;
}

.category-card-mini {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 0.875rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}
.category-card-mini:hover { border-color: #d1d5db; background: #f9fafb; }

.cat-left { display: flex; align-items: center; gap: 0.625rem; }

.icon-area-small {
  width: 2rem;
  height: 2rem;
  border-radius: 6px;
  background: #f3f4f6;
  color: #6b7280;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
}

.cat-mid { flex: 1; min-width: 0; }

.cat-name {
  font-weight: 600;
  font-size: 0.875rem;
  margin: 0;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.muted.small {
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.cat-actions { display: flex; gap: 0.375rem; }

.btn-icon {
  background: transparent;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  cursor: pointer;
  font-size: 0.875rem;
  width: 1.875rem;
  height: 1.875rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  font-family: inherit;
}
.btn-icon:hover { background: #f3f4f6; color: #111827; }
.btn-icon.btn-delete:hover { background: #fee2e2; color: #dc2626; border-color: #fca5a5; }

/* Table */

.table-container {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow-x: auto;
}

.furniture-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.furniture-table th,
.furniture-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.furniture-table th {
  background: #f9fafb;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #6b7280;
}

.furniture-table tbody tr:hover { background: #f9fafb; }

.img-cell { width: 70px; }
.img-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}
.img-wrapper img { width: 100%; height: 100%; object-fit: cover; }

.no-image {
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f3f4f6;
  border-radius: 6px;
  color: #9ca3af;
  font-size: 1.25rem;
  border: 1px solid #e5e7eb;
}

.table-row { }
.table-row:hover { background: #f9fafb; }

.category-badge {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  background: #f3f4f6;
  color: #374151;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.stock-badge { display: inline-block; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
.stock-empty  { background: #fee2e2; color: #dc2626; }
.stock-low    { background: #fef3c7; color: #b45309; }
.stock-medium { background: #dbeafe; color: #1e40af; }
.stock-high   { background: #dcfce7; color: #16a34a; }

.color-dot { display: inline-block; width: 0.875rem; height: 0.875rem; border-radius: 50%; margin-right: 0.375rem; border: 1px solid #e5e7eb; vertical-align: middle; }
.actions-cell { white-space: nowrap; }
.btn-edit { color: #6b7280; }
.btn-edit:hover { background: #f3f4f6; color: #111827; }

.empty-state {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 1.5rem;
  color: #6b7280;
  gap: 0.75rem;
}
.empty-state i { font-size: 2rem; }
.empty-state h3 { font-size: 1rem; font-weight: 600; margin: 0; color: #374151; }
.empty-state h4 { font-size: 0.9375rem; font-weight: 600; margin: 0; color: #374151; }
.empty-state p { margin: 0; font-size: 0.875rem; max-width: 320px; }
.empty-state.small { padding: 1.5rem; }

.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .header-content { flex-wrap: wrap; }
  .dashboard-content { padding: 1rem; }
  .actions-bar { flex-direction: column; align-items: stretch; }
  .actions-left { flex-direction: column; }
  .btn-primary, .btn-secondary { width: 100%; justify-content: center; }
  .furniture-table { min-width: 700px; }
  .categories-grid { grid-template-columns: 1fr; }
}
</style>

<style scoped>
.modal-card, .modal-form { max-height: calc(100vh - 80px); overflow-y: auto; }
</style>