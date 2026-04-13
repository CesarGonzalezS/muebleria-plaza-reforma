<template>
  <Transition name="modal">
    <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-form">
        <form @submit.prevent="handleSubmit">
          <div class="form-header">
            <h2>
              <i :class="isEditing ? 'bi bi-pencil-square' : 'bi bi-plus-square'"></i>
              {{ isEditing ? 'Editar Mueble' : 'Nuevo Mueble' }}
            </h2>
            <button type="button" @click="closeModal" class="close-btn">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <div class="form-body">
            <div class="form-grid">
              <!-- Columna izquierda -->
              <div class="form-column">
                <div class="form-group">
                  <label for="name">
                    <i class="bi bi-card-heading"></i>
                    Nombre del mueble *
                  </label>
                  <input id="name" v-model="formData.name" placeholder="Ej: Silla ergonómica" required />
                </div>

                <div class="form-row form-row-compact">
                  <div class="form-group form-group-small">
                    <label for="price">
                      <i class="bi bi-currency-dollar"></i>
                      Precio venta *
                    </label>
                    <input id="price" v-model.number="formData.price" type="number" min="0" step="0.01" placeholder="1500" required />
                  </div>

                  <div class="form-group form-group-small">
                    <label for="costPrice">
                      <i class="bi bi-cash-coin"></i>
                      Precio costo *
                    </label>
                    <input id="costPrice" v-model.number="formData.costPrice" type="number" min="0" step="0.01" placeholder="900" required />
                  </div>
                </div>

                <div class="form-group">
                  <label for="category">
                    <i class="bi bi-tags"></i>
                    Categoría *
                  </label>
                  <div class="category-select-controls">
                    <select id="category" v-model="formData.category_id" required>
                      <option :value="null" disabled>Selecciona una categoría</option>
                      <option
                        v-for="cat in (Array.isArray(categories) ? categories : []).filter(c => c != null)"
                        :key="cat.id"
                        :value="cat.id"
                      >
                        {{ cat.name }}
                      </option>
                    </select>
                    <button type="button" class="btn-icon small" title="Crear categoría" @click="$emit('open-category-form')">
                      <i class="bi bi-plus-lg"></i>
                    </button>
                  </div>
                </div>

                <div class="form-row form-row-compact">
                  <div class="form-group form-group-small">
                    <label for="stock">
                      <i class="bi bi-box"></i>
                      Stock actual
                    </label>
                    <input id="stock" v-model.number="formData.stock" type="number" min="0" placeholder="20" />
                  </div>

                  <div class="form-group form-group-small">
                    <label for="minStock">
                      <i class="bi bi-exclamation-triangle"></i>
                      Stock mínimo
                    </label>
                    <input id="minStock" v-model.number="formData.minStock" type="number" min="0" placeholder="5" />
                  </div>
                </div>

                <div class="form-group">
                  <label for="imageUrl">
                    <i class="bi bi-link-45deg"></i>
                    URL de imagen
                  </label>
                  <input id="imageUrl" v-model="formData.imageUrl" type="text" placeholder="https://... o sube un archivo abajo" />
                </div>

                <div class="form-group">
                  <label for="brand">
                    <i class="bi bi-award"></i>
                    Marca
                  </label>
                  <input id="brand" v-model="formData.brand" placeholder="IKEA" />
                </div>
              </div>

              <!-- Columna derecha -->
              <div class="form-column sidebar">
                <div class="form-row">
                  <div class="form-group">
                    <label for="color">
                      <i class="bi bi-palette"></i>
                      Color
                    </label>
                    <input id="color" v-model="formData.color" placeholder="Blanco" />
                  </div>

                  <div class="form-group">
                    <label for="material">
                      <i class="bi bi-tree"></i>
                      Material
                    </label>
                    <input id="material" v-model="formData.material" placeholder="Madera" />
                  </div>
                </div>

                <div class="form-group">
                  <label for="dimensions">
                    <i class="bi bi-rulers"></i>
                    Dimensiones
                  </label>
                  <input id="dimensions" v-model="formData.dimensions" placeholder="120x60x80 cm" />
                </div>

                <div class="form-group">
                  <label for="description">
                    <i class="bi bi-text-paragraph"></i>
                    Descripción
                  </label>
                  <textarea id="description" v-model="formData.description" placeholder="Describe las características del mueble..." rows="3"></textarea>
                </div>

                <!-- Sección de imagen con upload real -->
                <div class="form-section-images">
                  <h3>
                    <i class="bi bi-images"></i>
                    Imagen del mueble
                  </h3>

                  <!-- Preview de imagen actual -->
                  <div v-if="formData.imageUrl" class="image-preview-current">
                    <img :src="formData.imageUrl" alt="Imagen del mueble" />
                    <button type="button" class="btn-remove-img" @click="formData.imageUrl = ''" title="Quitar imagen">
                      <i class="bi bi-x-circle-fill"></i>
                    </button>
                  </div>

                  <!-- Drop zone para upload -->
                  <div
                    class="image-drop-area"
                    :class="{ 'uploading': isUploadingImage }"
                    @dragover.prevent
                    @drop.prevent="handleDrop"
                    @click="$refs.fileInput.click()"
                  >
                    <template v-if="isUploadingImage">
                      <i class="bi bi-arrow-repeat spin"></i>
                      <p>Subiendo imagen...</p>
                    </template>
                    <template v-else>
                      <i class="bi bi-cloud-upload"></i>
                      <p>Arrastra una imagen o haz clic para seleccionar</p>
                      <span class="hint">JPG, PNG, WEBP · máx. 5 MB</span>
                    </template>
                    <input
                      type="file"
                      accept="image/*"
                      ref="fileInput"
                      class="hidden-file-input"
                      @change="handleImageUpload"
                    />
                  </div>

                  <div v-if="imageErrors.length" class="error-messages">
                    <div v-for="(err, index) in imageErrors" :key="index" class="error-message">
                      <i class="bi bi-exclamation-circle"></i>
                      {{ err }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="form-footer">
            <button type="button" @click="closeModal" class="btn-secondary">
              <i class="bi bi-x-circle"></i>
              Cancelar
            </button>
            <button type="submit" class="btn-primary">
              <i class="bi bi-check-circle"></i>
              {{ isEditing ? 'Guardar Cambios' : 'Crear Mueble' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue';
import * as furnitureService from '../services/furniture';
import axiosConfig from '../config/AxiosConfig';
import axios from 'axios';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  furnitureData: {
    type: Object,
    default: () => ({})
  },
  categories: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['close', 'success', 'open-category-form']);

const maxFileSizeMB = 5;
const isSubmitting = ref(false);
const isUploadingImage = ref(false);

const formData = ref({
  id: null,
  name: '',
  description: '',
  price: 0,
  costPrice: 0,
  category_id: null,
  imageUrl: '',
  images: [],
  stock: 0,
  minStock: 0,
  brand: '',
  color: '',
  material: '',
  dimensions: ''
});

const imageErrors = ref([]);

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.isEditing && props.furnitureData) {
      // Normalizar los datos del mueble al editar
      const normalizedData = { ...props.furnitureData };

      // Normalizar category_id: soporta categoryId (nueva API) y category_id (formato antiguo)
      if (normalizedData.categoryId && !normalizedData.category_id) {
        normalizedData.category_id = normalizedData.categoryId;
      } else if (normalizedData.category && typeof normalizedData.category === 'object') {
        normalizedData.category_id = normalizedData.category.id;
      }

      // Normalizar campos de la nueva API
      normalizedData.costPrice = normalizedData.costPrice || normalizedData.cost_price || 0;
      normalizedData.minStock = normalizedData.minStock || normalizedData.min_stock || 0;
      normalizedData.imageUrl = normalizedData.imageUrl || '';

      // Normalizar imágenes
      let itemImages = [];
      if (normalizedData.images && Array.isArray(normalizedData.images) && normalizedData.images.length > 0) {
        itemImages = normalizedData.images.map(img =>
          typeof img === 'string' ? img : (img.img_base64 || img.url || img)
        ).filter(Boolean);
      } else if (normalizedData.imageUrl) {
        itemImages = [normalizedData.imageUrl];
      } else if (normalizedData.img_base64) {
        itemImages = [normalizedData.img_base64];
      }
      normalizedData.images = itemImages;

      formData.value = normalizedData;
    } else {
      resetForm();
    }
    imageErrors.value = [];
  }
});

function resetForm() {
  formData.value = {
    id: null,
    name: '',
    description: '',
    price: 0,
    costPrice: 0,
    category_id: null,
    imageUrl: '',
    images: [],
    stock: 0,
    minStock: 0,
    brand: '',
    color: '',
    material: '',
    dimensions: ''
  };
}

function closeModal() {
  emit('close');
}

function validateForm() {
  imageErrors.value = [];

  if (!formData.value.name || !formData.value.name.trim()) {
    imageErrors.value.push('El nombre del mueble es obligatorio');
    return false;
  }

  if (!formData.value.price || formData.value.price <= 0) {
    imageErrors.value.push('El precio de venta debe ser mayor a 0');
    return false;
  }

  if (formData.value.costPrice == null || formData.value.costPrice < 0) {
    imageErrors.value.push('El precio de costo no puede ser negativo');
    return false;
  }

  if (!formData.value.category_id) {
    imageErrors.value.push('La categoría es obligatoria');
    return false;
  }

  if (formData.value.stock < 0) {
    imageErrors.value.push('El stock no puede ser negativo');
    return false;
  }

  return true;
}

async function handleSubmit() {
  if (!validateForm()) {
    axiosConfig.ToastWarning('Validación', imageErrors.value[0]);
    return;
  }

  if (isSubmitting.value) return;

  isSubmitting.value = true;

  // Preparar los datos para la API /furniture/ (camelCase)
  const dataToSend = {
    name: formData.value.name.trim(),
    description: formData.value.description || '',
    price: parseFloat(formData.value.price),
    costPrice: parseFloat(formData.value.costPrice) || 0,
    stock: parseInt(formData.value.stock) || 0,
    minStock: parseInt(formData.value.minStock) || 0,
    categoryId: formData.value.category_id ? parseInt(formData.value.category_id) : undefined,
    imageUrl: formData.value.imageUrl || (formData.value.images && formData.value.images[0]) || undefined,
  };

  try {
    if (props.isEditing && formData.value.id) {
      // Actualizar mueble existente
      await furnitureService.updateFurniture(formData.value.id, dataToSend);
      axiosConfig.ToastSuccess('¡Éxito!', 'Mueble actualizado correctamente');
    } else {
      // Crear nuevo mueble
      await furnitureService.createFurniture(dataToSend);
      axiosConfig.ToastSuccess('¡Éxito!', 'Mueble creado correctamente');
    }

    emit('success');
    closeModal();
  } catch (err) {
    console.error('Error al guardar mueble:', err);

    if (err.response && err.response.data) {
      const errorMsg = err.response.data.detail || JSON.stringify(err.response.data);
      axiosConfig.ToastError('Error', errorMsg);
    } else {
      axiosConfig.ToastError('Error', 'No se pudo guardar el mueble');
    }
  } finally {
    isSubmitting.value = false;
  }
}


// ── Upload de imagen al backend ─────────────────────────────────
async function uploadImageFile(file) {
  // Validar tipo
  if (!file.type.startsWith('image/')) {
    imageErrors.value = [`${file.name} no es una imagen válida.`];
    return;
  }
  // Validar tamaño
  if (file.size > maxFileSizeMB * 1024 * 1024) {
    imageErrors.value = [`${file.name} supera el tamaño máximo de ${maxFileSizeMB} MB.`];
    return;
  }

  imageErrors.value = [];
  isUploadingImage.value = true;

  try {
    const fd = new FormData();
    fd.append('file', file);

    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    const { data } = await axios.post('/api/images/upload', fd, {
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });

    // El backend devuelve { success: true, data: "http://...url..." }
    const url = data?.data || data?.url || data;
    if (typeof url === 'string' && url.startsWith('http')) {
      formData.value.imageUrl = url;
      axiosConfig.ToastSuccess('Imagen subida', 'La imagen se subió correctamente');
    } else {
      imageErrors.value = ['La respuesta del servidor no contiene una URL válida.'];
    }
  } catch (err) {
    console.error('Error al subir imagen:', err);
    imageErrors.value = ['No se pudo subir la imagen. Verifica tu conexión o ingresa una URL manualmente.'];
  } finally {
    isUploadingImage.value = false;
  }
}

async function handleImageUpload(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  await uploadImageFile(file);
  // Limpiar el input para poder volver a seleccionar el mismo archivo
  e.target.value = '';
}

async function handleDrop(e) {
  const file = e.dataTransfer.files?.[0];
  if (!file) return;
  await uploadImageFile(file);
}
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
  overflow-y: auto;
}

/* Modal Form */
.modal-form {
  background: #fff;
  border-radius: 16px;
  max-width: 1100px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  animation: scaleIn 0.3s ease;
  -webkit-overflow-scrolling: touch;
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-form form {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 90vh;
  overflow: hidden;
}

/* Form Header */
.form-header {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: #fff;
  padding: 1.75rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.form-header h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.form-header h2 i {
  font-size: 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem;
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.close-btn {
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.1rem;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: rotate(90deg) scale(1.1);
}

/* Form Body */
.form-body {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  background: linear-gradient(to bottom, #fafbfc, #ffffff);
  -webkit-overflow-scrolling: touch;
}

.form-body::-webkit-scrollbar {
  width: 8px;
}

.form-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.form-body::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #007bff, #0056b3);
  border-radius: 10px;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.form-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Form Groups */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-group label i {
  color: #007bff;
  font-size: 1rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.875rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.3s ease;
  background: #fff;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.1);
  transform: translateY(-1px);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

/* Form Row */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-row-compact {
  gap: 1rem;
}

.form-group-small {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Category Select Controls */
.category-select-controls {
  display: flex;
  gap: 0.5rem;
  align-items: stretch;
}

.category-select-controls select {
  flex: 1;
}

.category-select-controls .btn-icon {
  width: 2.75rem;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-select-controls .btn-icon:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.25);
}

/* Form Section Images */
.form-section-images {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: #fff;
  border: 2px dashed #e9ecef;
  border-radius: 12px;
}

.form-section-images h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-section-images h3 i {
  color: #007bff;
}

/* Preview de imagen actual */
.image-preview-current {
  position: relative;
  width: 100%;
  max-height: 180px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e9ecef;
}

.image-preview-current img {
  width: 100%;
  max-height: 180px;
  object-fit: cover;
  display: block;
}

.btn-remove-img {
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(220, 53, 69, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn-remove-img:hover {
  background: #dc3545;
  transform: scale(1.1);
}

/* Drop area */
.image-drop-area {
  border: 2px dashed #ccc;
  border-radius: 10px;
  padding: 1.5rem 1rem;
  text-align: center;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
}

.image-drop-area:hover,
.image-drop-area:focus {
  border-color: #007bff;
  background: rgba(0,123,255,0.04);
}

.image-drop-area.uploading {
  pointer-events: none;
  border-color: #007bff;
  background: rgba(0,123,255,0.06);
}

.image-drop-area i {
  font-size: 2rem;
  color: #007bff;
}

.image-drop-area p {
  margin: 0;
  color: #555;
  font-size: 0.9rem;
}

.image-drop-area .hint {
  font-size: 0.78rem;
  color: #999;
}

.spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.hidden-file-input {
  display: none;
}

/* Error Messages */
.error-messages {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.error-message {
  background: linear-gradient(135deg, #fee2e2 0%, #fef2f2 100%);
  color: #dc3545;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-left: 4px solid #dc3545;
}

.error-message i {
  font-size: 1.1rem;
}

/* Form Footer */
.form-footer {
  padding: 1.5rem 2rem;
  background: linear-gradient(to top, #f8f9fa, #ffffff);
  border-top: 2px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.form-footer button {
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  border: none;
}

.btn-secondary {
  background: #fff;
  color: #333;
  border: 2px solid #e9ecef;
}

.btn-secondary:hover {
  background: #f8f9fa;
  border-color: #6c757d;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.25);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 123, 255, 0.35);
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .modal-form {
    max-width: 95%;
  }

  .form-header {
    padding: 1.5rem;
  }

  .form-body {
    padding: 1.5rem;
  }

  .form-footer {
    flex-direction: row;
  }

  .form-footer button {
    flex: 1;
  }
}

@media (max-width: 480px) {
  .modal-form {
    max-width: 98%;
  }

  .form-header {
    padding: 1.25rem 1rem;
  }

  .form-header h2 {
    font-size: 1.25rem;
  }

  .form-body {
    padding: 1rem;
  }

  .form-footer {
    padding: 1rem;
    flex-direction: column;
  }

  .form-footer button {
    width: 100%;
  }

  .image-list {
    gap: 0.75rem;
  }

  .image-item {
    width: 85px;
    height: 85px;
  }
}

/* Responsive tweaks for mobile */
@media (max-width: 520px) {
  .modal-form { max-width: 100%; width: calc(100% - 1rem); border-radius: 12px; }
  .form-header { padding: 1rem; }
  .form-body { padding: 1rem; }
  .form-section-images { padding: 1rem; }
  .image-item { width: 80px; height: 80px; }
  .form-grid { gap: 1rem; grid-template-columns: 1fr; }
  .form-row { grid-template-columns: 1fr 1fr; gap: 0.75rem; }
}
</style>
