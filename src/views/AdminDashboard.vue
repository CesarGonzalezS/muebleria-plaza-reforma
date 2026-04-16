<template>
  <div class="admin-dashboard">
    <!-- Header del Dashboard -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="header-title-section">
          <i class="bi bi-speedometer2"></i>
          <div>
            <h1>Panel de AdministraciÃ³n</h1>
            <p>Gestiona tu inventario de muebles</p>
          </div>
        </div>
        <button @click="logout" class="logout-btn">
          <i class="bi bi-box-arrow-right"></i>
          Cerrar sesiÃ³n
        </button>
      </div>
    </div>

    <!-- NavegaciÃ³n rÃ¡pida entre secciones admin -->
    <nav class="admin-nav">
      <router-link to="/admin" class="admin-nav-item active">
        <i class="bi bi-house-door"></i> Muebles
      </router-link>
      <router-link to="/admin-orders" class="admin-nav-item">
        <i class="bi bi-bag-check"></i> Ã“rdenes
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

      <!-- Content cuando no estÃ¡ cargando -->
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
              Nueva CategorÃ­a
            </button>
          </div>
          <div class="stats-summary">
            <div class="stat-item">
              <i class="bi bi-box-seam"></i>
              <span>{{ furnitureList.length }} productos</span>
            </div>
          </div>
        </div>

        <!-- SecciÃ³n de categorÃ­as integrada -->
        <div class="categories-section">
          <div class="section-header">
            <h2>CategorÃ­as</h2>
            <p class="muted">Gestiona las categorÃ­as disponibles en el catÃ¡logo</p>
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
            <h4>No hay categorÃ­as</h4>
            <p>AÃ±ade categorÃ­as para organizar tus muebles</p>
            <button class="btn-primary" @click="openCreateCategory">Crear CategorÃ­a</button>
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
              <th>CategorÃ­a</th>
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
              <td data-label="CategorÃ­a">
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

        <!-- Estado vacÃ­o -->
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

    <!-- Modal del formulario (CategorÃ­a) -->
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
  images: [], // Array de imÃ¡genes en base64
  stock: 0,
  brand: '',
  color: '',
  material: '',
  dimensions: ''
});


const categories = ref([]);

// --- NUEVO: estados y formulario para categorÃ­as integradas ---
const showCategoryForm = ref(false);
const isEditingCategory = ref(false);
// Removed icon_base64 from categoryForm
const categoryForm = reactive({ id: null, name: '', description: '' });

async function fetchCategories() {
  try {
    const res = await categoriesService.getCategories();
    const data = res?.data;
    categories.value = Array.isArray(data) ? data : [];
  } catch (e) {
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
    const res = await axiosConfig.doGet('/furniture/');
    const data = res?.data?.data;
    furnitureList.value = Array.isArray(data) ? data : [];
  } catch (e) {
    error.value = 'Error al cargar productos';
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

  // Normalizar imÃ¡genes: soporta imageUrl (nueva API) y arrays de imÃ¡genes (formato antiguo)
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

// --- NUEVO: funciones para CRUD de categorÃ­as dentro del dashboard ---
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

// El modal ahora maneja la API directamente, solo necesitamos recargar las categorÃ­as
async function handleCategorySuccess() {
  showCategoryForm.value = false;
  await fetchCategories();
  // Si hay un formulario de mueble abierto, actualizar su lista de categorÃ­as tambiÃ©n
  if (showForm.value) {
    // Las categorÃ­as ya estÃ¡n actualizadas en categories.value
  }
}

function confirmDeleteCategory(cat) {
  if (!confirm(`Â¿Eliminar la categorÃ­a "${cat.name}"?`)) return;
  deleteCategoryRequest(cat.id);
}

async function deleteCategoryRequest(id) {
  try {
    await categoriesService.deleteCategory(id);
    axiosConfig.ToastSuccess('Eliminado', 'CategorÃ­a eliminada correctamente');
    fetchCategories();
  } catch (err) {
    console.error(err);
    if (err.response && err.response.status === 400) {
      axiosConfig.ToastWarning('No se puede eliminar', 'La categorÃ­a tiene muebles asociados');
    } else {
      axiosConfig.ToastError('Error', 'No se pudo eliminar la categorÃ­a');
    }
  }
}


// El modal ahora maneja la API directamente, solo necesitamos recargar los muebles
async function handleFurnitureSuccess() {
  showForm.value = false;
  await fetchFurniture();
}

async function deleteFurniture(id) {
  if (!confirm('Â¿Seguro que deseas eliminar este mueble?')) return;
  try {
    await axiosConfig.doDelete(`/furniture/${id}`);
    axiosConfig.ToastSuccess('Â¡Ã‰xito!', 'Mueble eliminado correctamente.');
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
  // Soporta array de imÃ¡genes (formato antiguo)
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
  background: var(--canvas);
  font-family: var(--font);
  color: var(--ink);
}

/* Header */
.dashboard-header {
  background: var(--white);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px var(--s3);
  max-width: 1400px;
  margin: 0 auto;
}

.header-title-section {
  display: flex;
  align-items: center;
  gap: var(--s2);
}

.header-title-section i { font-size: 1rem; color: var(--slate); }

.header-title-section h1 {
  font-size: 0.9375rem;
  font-weight: 600;
  margin: 0;
  letter-spacing: -0.02em;
}

.header-title-section p {
  margin: 2px 0 0;
  font-size: 0.75rem;
  color: var(--slate);
}

.logout-btn {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--ink);
  padding: 6px 16px;
  border-radius: var(--r-pill);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.15s;
  font-family: var(--font);
}
.logout-btn:hover { background: var(--canvas); }

/* Admin nav */
.admin-nav {
  background: var(--white);
  border-bottom: 1px solid var(--border);
  display: flex;
  gap: 0;
  overflow-x: auto;
  padding: 0 var(--s3);
  max-width: 100%;
}

.admin-nav-item {
  padding: 10px 16px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--slate);
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  transition: color 0.15s, border-color 0.15s;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 6px;
}
.admin-nav-item:hover { color: var(--ink); }
.admin-nav-item.active,
.admin-nav-item.router-link-active { color: var(--ink); border-bottom-color: var(--ink); }

/* Content */
.dashboard-content {
  padding: var(--s3);
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--s3);
}

/* Loading */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--s2);
  padding: var(--s7);
  color: var(--slate);
  font-size: 0.875rem;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid var(--dust);
  border-top-color: var(--ink);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Actions bar */
.actions-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--s2);
  flex-wrap: wrap;
}

.actions-left {
  display: flex;
  align-items: center;
  gap: var(--s2);
  flex-wrap: wrap;
}

.btn-primary {
  background: var(--ink);
  color: var(--canvas);
  border: 1.5px solid var(--ink);
  padding: 7px 20px;
  border-radius: var(--r-btn);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: opacity 0.15s;
  font-family: var(--font);
  letter-spacing: -0.02em;
}
.btn-primary:hover { opacity: 0.85; }

.btn-secondary {
  background: var(--white);
  color: var(--ink);
  border: 1.5px solid var(--ink);
  padding: 7px 20px;
  border-radius: var(--r-btn);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: background 0.15s;
  font-family: var(--font);
  letter-spacing: -0.02em;
}
.btn-secondary:hover { background: var(--canvas); }

.stats-summary { display: flex; align-items: center; gap: var(--s1); }

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  color: var(--slate);
}

/* Categories section */
.categories-section {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--r-card);
  padding: var(--s3);
}

.section-header { margin-bottom: var(--s2); }

.section-header h2 {
  font-size: 0.9375rem;
  font-weight: 600;
  margin: 0 0 3px;
  letter-spacing: -0.02em;
}

.muted { color: var(--slate); font-size: 0.8125rem; }

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--s2);
}

.category-card-mini {
  background: var(--canvas-lifted);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px var(--s2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--s2);
  transition: border-color 0.15s;
}
.category-card-mini:hover { border-color: var(--ink); }

.cat-left { display: flex; align-items: center; gap: 10px; }

.icon-area-small {
  width: 32px;
  height: 32px;
  border-radius: var(--r-card);
  background: var(--canvas);
  color: var(--slate);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.cat-mid { flex: 1; min-width: 0; }

.cat-name {
  font-weight: 600;
  font-size: 0.875rem;
  margin: 0;
  color: var(--ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  letter-spacing: -0.01em;
}

.muted.small {
  font-size: 0.75rem;
  color: var(--slate);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.cat-actions { display: flex; gap: 4px; }

.btn-icon {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--slate);
  cursor: pointer;
  font-size: 0.8125rem;
  width: 28px;
  height: 28px;
  border-radius: var(--r-card);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
  font-family: var(--font);
}
.btn-icon:hover { background: var(--canvas); color: var(--ink); }
.btn-icon.btn-delete:hover { background: #fee2e2; color: #dc2626; border-color: #fecaca; }

/* Table */
.table-container {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--r-card);
  overflow-x: auto;
}

.furniture-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.furniture-table th,
.furniture-table td {
  padding: 10px var(--s2);
  text-align: left;
  border-bottom: 1px solid var(--border);
}

.furniture-table th {
  background: var(--canvas-lifted);
  font-weight: 600;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--slate);
}

.furniture-table tbody tr:last-child td { border-bottom: none; }
.furniture-table tbody tr:hover { background: var(--canvas-lifted); }

.img-cell { width: 70px; }
.img-wrapper {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--border);
}
.img-wrapper img { width: 100%; height: 100%; object-fit: cover; }

.no-image {
  width: 52px;
  height: 52px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--canvas);
  border-radius: 10px;
  color: var(--dust);
  font-size: 1rem;
  border: 1px solid var(--border);
}

.category-badge {
  display: inline-block;
  padding: 2px 10px;
  background: var(--canvas);
  color: var(--charcoal);
  border-radius: var(--r-pill);
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid var(--border);
}

.stock-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: var(--r-pill);
  font-size: 0.75rem;
  font-weight: 600;
}
.stock-empty  { background: #fee2e2; color: #dc2626; }
.stock-low    { background: #fef3c7; color: #b45309; }
.stock-medium { background: #dbeafe; color: #1e40af; }
.stock-high   { background: #dcfce7; color: #16a34a; }

.color-dot { display: inline-block; width: 12px; height: 12px; border-radius: 50%; margin-right: 6px; border: 1px solid var(--border); vertical-align: middle; }
.actions-cell { white-space: nowrap; }
.btn-edit { color: var(--slate); }
.btn-edit:hover { background: var(--canvas); color: var(--ink); }

.empty-state {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--r-card);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--s7) var(--s4);
  color: var(--slate);
  gap: var(--s2);
}
.empty-state i { font-size: 1.5rem; color: var(--dust); }
.empty-state h3 { font-size: 0.9375rem; font-weight: 600; color: var(--ink); letter-spacing: -0.02em; }
.empty-state h4 { font-size: 0.875rem; font-weight: 600; color: var(--ink); }
.empty-state p { font-size: 0.8125rem; max-width: 320px; }
.empty-state.small { padding: var(--s4) var(--s3); }

.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .header-content { flex-wrap: wrap; gap: var(--s2); }
  .dashboard-content { padding: var(--s2); }
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
