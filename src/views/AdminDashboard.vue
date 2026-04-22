<template>
  <AdminLayout title="Muebles" subtitle="Gestiona tu inventario de productos" icon="bi-box-seam">
    <template #actions>
      <button @click="openCreateForm" class="btn-primary">
        <i class="bi bi-plus-circle"></i> Agregar Mueble
      </button>
      <button @click="openCreateCategory" class="btn-secondary">
        <i class="bi bi-tags"></i> Nueva Categoría
      </button>
    </template>

    <!-- Loading -->
    <div v-if="loading" class="admin-loading">
      <div class="admin-spinner"></div>
      <p>Cargando muebles...</p>
    </div>

    <div v-else>
      <!-- Métricas -->
      <div class="admin-stats">
        <div class="admin-stat-card">
          <div class="admin-stat-icon">
            <i class="bi bi-box-seam"></i>
          </div>
          <div class="admin-stat-info">
            <div class="admin-stat-value">{{ activeProducts }}</div>
            <div class="admin-stat-label">Productos Activos</div>
          </div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-icon" style="background:#fef3c7;color:#b45309;">
            <i class="bi bi-exclamation-triangle"></i>
          </div>
          <div class="admin-stat-info">
            <div class="admin-stat-value">{{ criticalStock }}</div>
            <div class="admin-stat-label">Stock Crítico</div>
          </div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-icon" style="background:#dbeafe;color:#1d4ed8;">
            <i class="bi bi-bag"></i>
          </div>
          <div class="admin-stat-info">
            <div class="admin-stat-value">{{ ordersToday }}</div>
            <div class="admin-stat-label">Órdenes Hoy</div>
          </div>
        </div>
      </div>

      <!-- Acceso rápido a configuración del Home -->
      <div class="admin-card" style="margin-bottom:1.5rem;padding:1.25rem 1.5rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;">
        <div>
          <h3 style="margin:0 0 0.25rem;font-size:1rem;color:#860734;"><i class="bi bi-house-gear"></i> Configuración del Home</h3>
          <p style="margin:0;font-size:0.85rem;color:#999;">Actualiza banners, galería de inspiración y testimonios del sitio público.</p>
        </div>
        <router-link to="/admin-home-settings" class="btn-primary" style="white-space:nowrap;text-decoration:none;">
          <i class="bi bi-pencil-square"></i> Editar Home
        </router-link>
      </div>

      <!-- Sección de categorías -->
      <div class="admin-card categories-section">
        <div class="section-header">
          <h2>Categorías</h2>
          <p class="muted">Gestiona las categorías disponibles en el catálogo</p>
        </div>
        <div v-if="categories.length" class="categories-grid">
          <div v-for="cat in categories" :key="cat.id" class="category-card-mini">
            <div class="cat-icon">
              <i class="bi bi-tags"></i>
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
        <div v-else class="admin-empty" style="padding:32px 0 8px;">
          <i class="bi bi-inbox"></i>
          <h3>No hay categorías</h3>
          <p>Agrega categorías para organizar tus muebles</p>
          <button class="btn-primary" @click="openCreateCategory">Crear Categoría</button>
        </div>
      </div>

      <!-- Tabla de productos -->
      <div v-if="furnitureList.length" class="admin-table-wrap">
        <table class="admin-table">
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
            <tr v-for="item in furnitureList" :key="item.id">
              <td class="img-cell">
                <div class="img-wrapper">
                  <img v-if="getMainImage(item)" :src="getMainImage(item)" :alt="`Imagen de ${item.name}`" />
                  <div v-else class="no-image" aria-label="Sin imagen disponible">
                    <i class="bi bi-image" aria-hidden="true"></i>
                  </div>
                </div>
              </td>
              <td>{{ item.name }}</td>
              <td>${{ item.price.toLocaleString('es-MX') }}</td>
              <td>
                <span class="badge badge-gray">{{ item.categoryName || getCategoryLabel(item.categoryId || item.category_id || item.category) }}</span>
              </td>
              <td>
                <span :class="['badge', getStockBadgeClass(item.stock)]">{{ item.stock }}</span>
              </td>
              <td>{{ item.brandName || item.brand || '-' }}</td>
              <td>
                <span class="color-dot" :style="{ background: item.color || '#ccc' }"></span>
                {{ item.color || '-' }}
              </td>
              <td>{{ item.material || '-' }}</td>
              <td>{{ item.dimensions || '-' }}</td>
              <td>
                <div class="row-actions">
                  <button @click="openEditForm(item)" class="btn-icon btn-edit" title="Editar">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button @click="deleteFurniture(item.id)" class="btn-icon btn-delete" title="Eliminar">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Estado vacío -->
      <div v-else class="admin-empty admin-card">
        <i class="bi bi-inbox"></i>
        <h3>No hay muebles registrados</h3>
        <p>Comienza agregando tu primer producto</p>
        <button @click="openCreateForm" class="btn-primary">
          <i class="bi bi-plus-circle"></i> Agregar Mueble
        </button>
      </div>
    </div>

    <!-- Modal Mueble -->
    <FurnitureFormModal
      :is-open="showForm"
      :is-editing="isEditing"
      :furniture-data="form"
      :categories="categories"
      @close="showForm = false"
      @success="handleFurnitureSuccess"
      @open-category-form="openCreateCategory"
    />

    <!-- Modal Categoría -->
    <CategoryFormModal
      :is-open="showCategoryForm"
      :is-editing="isEditingCategory"
      :category-data="categoryForm"
      @close="showCategoryForm = false"
      @success="handleCategorySuccess"
    />
  </AdminLayout>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axiosConfig from '../config/AxiosConfig.js';
import * as categoriesService from '../services/categories';
import FurnitureFormModal from '../components/FurnitureFormModal.vue';
import CategoryFormModal from '../components/CategoryFormModal.vue';
import AdminLayout from '../components/AdminLayout.vue';

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
  images: [],
  stock: 0,
  brand: '',
  color: '',
  material: '',
  dimensions: ''
});

const categories = ref([]);
const activeProducts = computed(() => furnitureList.value.length);
const criticalStock = computed(() => {
  return furnitureList.value.filter(item => {
    const minStock = item.minStock || item.min_stock || 0;
    return item.stock < minStock;
  }).length;
});
const ordersToday = ref(0);

const showCategoryForm = ref(false);
const isEditingCategory = ref(false);
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

async function fetchFurniture() {
  loading.value = true;
  try {
    const res = await axiosConfig.doGet('/api/products');
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
  await fetchCategories();
  Object.assign(form, {
    id: null, name: '', description: '', price: 0,
    category_id: null, images: [], stock: 0,
    brand: '', color: '', material: '', dimensions: ''
  });
  showForm.value = true;
}

function openEditForm(item) {
  isEditing.value = true;
  const catId = item.categoryId || item.category_id || (item.category && (item.category.id || item.category));
  let itemImages = [];
  if (item.images && Array.isArray(item.images) && item.images.length > 0) {
    itemImages = item.images.map(img => (typeof img === 'string' ? img : (img.img_base64 || img.url || img))).filter(Boolean);
  } else if (item.imageUrl) {
    itemImages = [item.imageUrl];
  } else if (item.img_base64) {
    itemImages = [item.img_base64];
  }
  Object.assign(form, {
    ...item, category_id: catId,
    costPrice: item.costPrice || item.cost_price || 0,
    minStock: item.minStock || item.min_stock || 0,
    imageUrl: item.imageUrl || '',
    images: itemImages
  });
  showForm.value = true;
}

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

async function handleCategorySuccess() {
  showCategoryForm.value = false;
  await fetchCategories();
}

function confirmDeleteCategory(cat) {
  if (!confirm(`Eliminar la categoría "${cat.name}"?`)) return;
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

async function handleFurnitureSuccess() {
  showForm.value = false;
  await fetchFurniture();
}

async function deleteFurniture(id) {
  if (!confirm('¿Seguro que deseas eliminar este mueble?')) return;
  try {
    await axiosConfig.doDelete(`/api/products/${id}`);
    axiosConfig.ToastSuccess('Éxito', 'Mueble eliminado correctamente.');
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
  if (!value && value !== 0) return '-';
  if (typeof value === 'object') return value.name || value.categoryName || '-';
  const id = Number(value);
  const cat = categories.value.find(c => Number(c.id) === id);
  return cat ? cat.name : String(value);
}

function getStockBadgeClass(stock) {
  if (stock === undefined || stock === null) return 'badge-gray';
  if (stock === 0) return 'badge-red';
  if (stock > 0 && stock <= 5) return 'badge-yellow';
  return 'badge-green';
}

function getMainImage(item) {
  if (item.imageUrl) return item.imageUrl;
  if (item.images && Array.isArray(item.images) && item.images.length > 0) {
    const firstImage = item.images[0];
    return typeof firstImage === 'string' ? firstImage : (firstImage.img_base64 || firstImage.url || null);
  }
  if (item.img_base64) return item.img_base64;
  return null;
}
</script>

<style scoped>
/* Categories section */
.categories-section {
  margin-bottom: 20px;
}

.section-header {
  margin-bottom: 16px;
}

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
  gap: 12px;
}

.category-card-mini {
  background: var(--canvas-lifted);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: border-color .15s;
  cursor: default;
}
.category-card-mini:hover { border-color: var(--ink); }

.cat-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--canvas);
  color: var(--slate);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.cat-mid {
  flex: 1;
  min-width: 0;
}

.cat-name {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  letter-spacing: -0.01em;
}

.muted.small {
  font-size: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.cat-actions { display: flex; gap: 4px; }

/* Product table details */
.row-actions { display: flex; gap: 4px; }

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
  align-items: center;
  justify-content: center;
  background: var(--canvas);
  border-radius: 10px;
  color: var(--dust);
  font-size: 1rem;
}

.color-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 6px;
  border: 1px solid var(--border);
  vertical-align: middle;
}

@media (max-width: 768px) {
  .categories-grid { grid-template-columns: 1fr; }
}
</style>
