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
                <span class="category-badge">{{ getCategoryLabel(item.category_id || item.category) }}</span>
              </td>
              <td data-label="Stock">
                  <span :class="['stock-badge', getStockClass(item.stock)]">
                    {{ item.stock }}
                  </span>
              </td>
              <td data-label="Marca">{{ item.brand || '-' }}</td>
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
const maxImages = 5;
const maxFileSizeMB = 5;
const imageErrors = ref([]);
const fileInputRef = ref(null);

const categories = ref([]);

// --- NUEVO: estados y formulario para categorías integradas ---
const showCategoryForm = ref(false);
const isEditingCategory = ref(false);
// Removed icon_base64 from categoryForm
const categoryForm = reactive({ id: null, name: '', description: '' });

async function fetchCategories() {
  try {
    categories.value = await categoriesService.getCategories();
  } catch (e) {
    console.error('Error cargando categorías:', e);
  }
}

function logout() {
  localStorage.removeItem('token');
  router.push('/login');
}

async function fetchFurniture() {
  loading.value = true;
  try {
    const res = await axiosConfig.doGet('/furniture/');
    furnitureList.value = res.data;
  } catch (e) {
    error.value = 'Error al cargar muebles';
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
  // Normalizar category: si el item trae un objeto category, usar su id
  const catId = item.category_id || (item.category && (item.category.id || item.category));

  // Normalizar imágenes: convertir a array
  let itemImages = [];
  if (item.images && Array.isArray(item.images) && item.images.length > 0) {
    itemImages = item.images.map(img => (typeof img === 'string' ? img : (img.img_base64 || img.url || img))).filter(Boolean);
  } else if (item.img_base64) {
    itemImages = [item.img_base64];
  }

  Object.assign(form, {
    ...item,
    category_id: catId,
    images: itemImages
  });
  imageErrors.value = [];
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

function validateForm() {
  if (!form.name.trim()) {
    axiosConfig.ToastWarning('Validación', 'El nombre del mueble es obligatorio.');
    return false;
  }
  if (form.price <= 0) {
    axiosConfig.ToastWarning('Validación', 'El precio debe ser mayor a 0.');
    return false;
  }
  if (!form.category_id) {
    axiosConfig.ToastWarning('Validación', 'La categoría es obligatoria.');
    return false;
  }
  // Ensure selected category exists in the loaded categories
  const selId = Number(form.category_id);
  const exists = categories.value.some(c => Number(c.id) === selId);
  if (!exists) {
    axiosConfig.ToastWarning('Validación', 'La categoría seleccionada no es válida. Selecciona una categoría existente.');
    return false;
  }
  if (form.stock < 0) {
    axiosConfig.ToastWarning('Validación', 'El stock no puede ser negativo.');
    return false;
  }
  return true;
}

// El modal ahora maneja la API directamente, solo necesitamos recargar los muebles
async function handleFurnitureSuccess() {
  showForm.value = false;
  await fetchFurniture();
}

async function deleteFurniture(id) {
  if (!confirm('¿Seguro que deseas eliminar este mueble?')) return;
  try {
    await axiosConfig.doDelete(`/furniture/${id}/`);
    axiosConfig.ToastSuccess('¡Éxito!', 'Mueble eliminado correctamente.');
    fetchFurniture();
  } catch (e) {
    console.error('Error al eliminar:', e);
  }
}

function handleImageUpload(e) {
  const files = e.target.files;
  if (!files.length) return;

  // Validar cantidad de imágenes
  if (form.images.length + files.length > maxImages) {
    axiosConfig.ToastWarning('Límite de imágenes', `Solo se permiten hasta ${maxImages} imágenes.`);
    return;
  }

  imageErrors.value = [];

  Array.from(files).forEach(file => {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      imageErrors.value.push(`${file.name} no es una imagen válida.`);
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      imageErrors.value.push(`${file.name} supera el tamaño máximo de ${maxFileSizeMB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      form.images.push(ev.target.result);
    };
    reader.onerror = () => {
      imageErrors.value.push(`Error al leer ${file.name}.`);
    };
    reader.readAsDataURL(file);
  });

  // Limpiar el input para permitir subir el mismo archivo de nuevo
  setTimeout(() => {
    if (fileInputRef.value) {
      fileInputRef.value.value = '';
    }
  }, 0);
}

function removeImage(index) {
  form.images.splice(index, 1);
  imageErrors.value = [];
}

function setAsMainImage(index) {
  if (index === 0) return;
  const [selectedImage] = form.images.splice(index, 1);
  form.images.unshift(selectedImage);
}

// Funciones para drag & drop
function handleDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
}

function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();

  const files = e.dataTransfer.files;
  if (!files.length) return;

  // Validar cantidad de imágenes
  if (form.images.length + files.length > maxImages) {
    axiosConfig.ToastWarning('Límite de imágenes', `Solo se permiten hasta ${maxImages} imágenes.`);
    return;
  }

  imageErrors.value = [];

  Array.from(files).forEach(file => {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      imageErrors.value.push(`${file.name} no es una imagen válida.`);
      return;
    }

    // Validar tamaño
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      imageErrors.value.push(`${file.name} supera el tamaño máximo de ${maxFileSizeMB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      form.images.push(ev.target.result);
    };
    reader.onerror = () => {
      imageErrors.value.push(`Error al leer ${file.name}.`);
    };
    reader.readAsDataURL(file);
  });
}

onMounted(() => {
  fetchFurniture();
  fetchCategories();
});

function getCategoryLabel(value) {
  // Si nos pasan un objeto category, devolver su nombre
  if (!value && value !== 0) return '-';
  if (typeof value === 'object') {
    return value.name || '-';
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
  // Si tiene un array de imágenes, devolver la primera
  if (item.images && Array.isArray(item.images) && item.images.length > 0) {
    const firstImage = item.images[0];
    return typeof firstImage === 'string' ? firstImage : (firstImage.img_base64 || firstImage.url || null);
  }
  // Fallback a img_base64 por compatibilidad
  if (item.img_base64) {
    return item.img_base64;
  }
  return null;
}
</script>

<style scoped>
.admin-dashboard {
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #f4f7fa 0%, #e8ecf1 100%);
  color: #333;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-x: hidden;
}

.dashboard-header {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: #fff;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.header-title-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-title-section i {
  font-size: 2.5rem;
  background: rgba(255, 255, 255, 0.15);
  padding: 0.75rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.header-title-section i:hover {
  transform: scale(1.1) rotate(5deg);
}

.header-title-section h1 {
  font-size: 1.75rem;
  margin: 0;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.header-title-section p {
  margin: 0.25rem 0 0 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  padding: 0.65rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.logout-btn i {
  font-size: 1.1rem;
}

.dashboard-content {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.loading-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.loading-container p {
  color: #6c757d;
  font-size: 1rem;
  font-weight: 500;
}

.spinner {
  border: 4px solid rgba(0, 123, 255, 0.1);
  border-top: 4px solid #007bff;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  animation: fadeInUp 0.5s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.actions-bar {
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, #f8f9fa, #ffffff);
  border-bottom: 2px solid #e9ecef;
}

.actions-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-primary {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.25);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 123, 255, 0.35);
}

.btn-primary i {
  font-size: 1.1rem;
}

.btn-secondary {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.25);
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(108, 117, 125, 0.35);
}

.btn-secondary i {
  font-size: 1.1rem;
}

.stats-summary {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, rgba(0, 123, 255, 0.05), rgba(0, 86, 179, 0.05));
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-item i {
  font-size: 1.75rem;
  color: #007bff;
}

.stat-item span {
  font-weight: 600;
  font-size: 0.95rem;
  color: #333;
}

.categories-section {
  padding: 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.section-header {
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #333;
  letter-spacing: -0.5px;
}

.section-header p {
  margin: 0;
  font-size: 0.95rem;
  color: #6c757d;
}

.muted {
  color: #6c757d;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}

.category-card-mini {
  background: #fff;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.category-card-mini:hover {
  border-color: #007bff;
  box-shadow: 0 4px 16px rgba(0, 123, 255, 0.15);
  transform: translateY(-2px);
}

.cat-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.icon-area-small {
  width: 3rem;
  height: 3rem;
  border-radius: 10px;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.25rem;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.25);
}

.no-icon-small {
  display: flex;
  align-items: center;
  justify-content: center;
}

.cat-mid {
  flex: 1;
  min-width: 0;
}

.cat-name {
  font-weight: 600;
  font-size: 1rem;
  margin: 0 0 0.25rem 0;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.muted.small {
  font-size: 0.875rem;
  color: #6c757d;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cat-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  background: transparent;
  border: 1px solid #e9ecef;
  color: #007bff;
  cursor: pointer;
  font-size: 1.1rem;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-icon:hover {
  background: #007bff;
  color: #fff;
  border-color: #007bff;
  transform: scale(1.1);
}

.btn-icon.btn-delete {
  color: #dc3545;
  border-color: #e9ecef;
}

.btn-icon.btn-delete:hover {
  background: #dc3545;
  color: #fff;
  border-color: #dc3545;
}

.table-container {
  flex: 1;
  overflow-x: auto;
  padding: 0 2rem 2rem 2rem;
}

.furniture-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.furniture-table th,
.furniture-table td {
  padding: 1rem 1.25rem;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.furniture-table th {
  background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #495057;
  position: sticky;
  top: 0;
  z-index: 10;
}

.furniture-table tbody tr {
  transition: all 0.3s ease;
}

.furniture-table tbody tr:hover {
  background: linear-gradient(to right, #f8f9fa, #ffffff);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.img-cell {
  width: 90px;
  height: 90px;
}

.img-wrapper {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.img-wrapper:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
  border-radius: 8px;
  color: #6c757d;
  font-size: 1.5rem;
}

.table-row {
  transition: all 0.3s ease;
}

.table-row:hover {
  background: linear-gradient(to right, rgba(0, 123, 255, 0.03), transparent);
}

.category-badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  background: linear-gradient(135deg, rgba(0, 123, 255, 0.1), rgba(0, 86, 179, 0.1));
  color: #007bff;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
}

.stock-badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
}

.stock-empty {
  background: #f8d7da;
  color: #721c24;
}

.stock-low {
  background: #fff3cd;
  color: #856404;
}

.stock-medium {
  background: #d1ecf1;
  color: #0c5460;
}

.stock-high {
  background: #d4edda;
  color: #155724;
}

.color-dot {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  margin-right: 0.5rem;
  border: 2px solid #dee2e6;
  vertical-align: middle;
}

.actions-cell {
  white-space: nowrap;
}

.btn-edit {
  color: #007bff;
}

.btn-edit:hover {
  background: #007bff;
  color: #fff;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 3rem 1rem;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.empty-state i {
  font-size: 4rem;
  color: #007bff;
  margin-bottom: 1.5rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.empty-state h3 {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.75rem 0;
  color: #333;
}

.empty-state h4 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #333;
}

.empty-state p {
  margin: 0 0 1.5rem 0;
  color: #6c757d;
  font-size: 1rem;
  max-width: 400px;
}

.image-preview-box {
  height: 120px;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  border: 2px solid #e5e7eb;
  transition: all 0.3s;
}

.image-preview-box:hover {
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.2);
}

.image-preview-box img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.image-preview-box:hover img {
  transform: scale(1.05);
}

.image-actions {
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.3s;
}

.image-preview-box:hover .image-actions {
  opacity: 1;
}

.remove-btn,
.main-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(4px);
  font-size: 0.9rem;
}

.remove-btn:hover {
  background-color: #dc3545;
  color: white;
  transform: scale(1.1);
}

.main-btn:hover {
  background-color: #ffc107;
  color: white;
  transform: scale(1.1);
}

/* Transición del modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-form,
.modal-enter-active .modal-card {
  animation: modalSlideIn 0.3s ease;
}

.modal-leave-active .modal-form,
.modal-leave-active .modal-card {
  animation: modalSlideOut 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes modalSlideOut {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-50px);
    opacity: 0;
  }
}

/* === Responsive Design === */
@media (max-width: 1024px) {
  .dashboard-content {
    padding: 1.5rem;
  }

  .categories-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }

  .stats-summary {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .furniture-table {
    font-size: 0.9rem;
  }

  .furniture-table th,
  .furniture-table td {
    padding: 0.75rem 1rem;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    padding: 1.25rem 1.5rem;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .header-title-section {
    width: 100%;
  }

  .header-title-section i {
    font-size: 2rem;
  }

  .header-title-section h1 {
    font-size: 1.5rem;
  }

  .logout-btn {
    width: 100%;
    justify-content: center;
  }

  .dashboard-content {
    padding: 1rem;
  }

  .actions-bar {
    padding: 1.25rem 1.5rem;
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .actions-left {
    flex-direction: column;
    width: 100%;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }

  .stats-summary {
    flex-direction: column;
    width: 100%;
  }

  .stat-item {
    width: 100%;
    justify-content: center;
  }

  .categories-section {
    padding: 1.5rem;
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }

  .section-header h2 {
    font-size: 1.35rem;
  }

  .table-container {
    padding: 0 1rem 1rem 1rem;
  }

  .furniture-table {
    font-size: 0.85rem;
  }

  .furniture-table th,
  .furniture-table td {
    padding: 0.625rem 0.75rem;
  }

  .img-cell {
    width: 70px;
    height: 70px;
  }

  /* Scroll horizontal para tablas */
  .table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .furniture-table {
    min-width: 800px;
  }
}

@media (max-width: 480px) {
  .dashboard-header {
    padding: 1rem;
  }

  .header-title-section i {
    font-size: 1.75rem;
    padding: 0.5rem;
  }

  .header-title-section h1 {
    font-size: 1.25rem;
  }

  .header-title-section p {
    font-size: 0.8rem;
  }

  .dashboard-content {
    padding: 0.75rem;
  }

  .actions-bar {
    padding: 1rem;
  }

  .btn-primary,
  .btn-secondary {
    padding: 0.65rem 1.25rem;
    font-size: 0.9rem;
  }

  .categories-section {
    padding: 1rem;
  }

  .section-header h2 {
    font-size: 1.25rem;
  }

  .category-card-mini {
    padding: 1rem;
    flex-direction: column;
    align-items: flex-start;
  }

  .cat-left {
    width: 100%;
    margin-bottom: 0.75rem;
  }

  .cat-mid {
    width: 100%;
    margin-bottom: 0.75rem;
  }

  .cat-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .icon-area-small {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1rem;
  }

  .table-container {
    padding: 0 0.5rem 0.5rem 0.5rem;
  }

  .furniture-table {
    font-size: 0.8rem;
  }

  .furniture-table th,
  .furniture-table td {
    padding: 0.5rem;
  }

  .img-cell {
    width: 60px;
    height: 60px;
  }

  .empty-state {
    padding: 2rem 1rem;
  }

  .empty-state i {
    font-size: 3rem;
  }

  .empty-state h3,
  .empty-state h4 {
    font-size: 1.25rem;
  }

  .empty-state p {
    font-size: 0.9rem;
  }
}

/* === Mejoras adicionales de accesibilidad === */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* === Utilidades === */
.btn-icon.small {
  width: 2rem;
  height: 2rem;
  font-size: 0.95rem;
}

/* === Mejoras para formularios en columnas (si existen) === */
.dashboard-columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.column {
  background: #fff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  animation: fadeInUp 0.5s ease;
}

.column:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.column h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 1rem;
  border-bottom: 3px solid #007bff;
}

.column h2::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 1.5rem;
  background: linear-gradient(135deg, #007bff, #0056b3);
  border-radius: 2px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  font-size: 0.95rem;
  color: #333;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 0.875rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
  background: #fff;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.1);
  transform: translateY(-1px);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form button[type="submit"] {
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.25);
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.form button[type="submit"]:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 123, 255, 0.35);
}

.form button[type="submit"]:active {
  transform: translateY(0);
}
</style>

<!-- Agregado CSS responsivo adicional para móviles sin tocar lógica ni diseño -->
<style scoped>
/* Asegurar que modales sean scrollables en pantallas pequeñas */
.modal-card,
.modal-form {
  max-height: calc(100vh - 80px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* Mejorar interacción táctil */
.actions-bar .btn-primary,
.actions-bar .btn-secondary,
.btn-icon,
.logout-btn,
.btn-primary,
.btn-secondary {
  touch-action: manipulation;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
}

/* Ajustes para pantallas muy pequeñas */
@media (max-width: 420px) {
  .dashboard-content { padding: 0.6rem; }
  .actions-bar { padding: 0.75rem; gap: 0.5rem; }
  .actions-left { gap: 0.5rem; }
  .btn-primary, .btn-secondary {
    padding: 0.6rem 0.75rem;
    font-size: 0.92rem;
  }
  .header-title-section h1 { font-size: 1.05rem; }
  .header-title-section p { font-size: 0.78rem; }

  /* Mantener tabla desplazable pero reducir min-width para mejor encaje */
  .furniture-table { min-width: 700px; }
  .table-container { padding: 0 0.4rem 0.6rem 0.4rem; }

  /* Ajustes de tarjetas de categoría para mejor lectura */
  .category-card-mini {
    padding: 0.9rem;
    gap: 0.6rem;
  }
  .cat-name { font-size: 0.95rem; }
  .muted.small { font-size: 0.82rem; }

  /* Imagenes más compactas */
  .img-cell { width: 56px; height: 56px; }
  .img-wrapper img { object-position: center center; }

  /* Espaciado en estados vacíos */
  .empty-state { padding: 1.6rem 0.6rem; }
}

/* Pequeño ajuste en tablet para mejor legibilidad */
@media (min-width: 421px) and (max-width: 768px) {
  .furniture-table { min-width: 780px; }
  .dashboard-content { padding: 1rem; }
  .actions-bar { padding: 1rem 1rem; }
}
</style>