<template>
  <div>
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
                    <label for="brand">
                      <i class="bi bi-award"></i>
                      Marca
                    </label>
                    <div class="category-select-controls">
                      <select id="brand" v-model="formData.brandId">
                        <option :value="null">Sin marca</option>
                        <option v-for="b in brands" :key="b.id" :value="b.id">{{ b.name }}</option>
                      </select>
                      <button type="button" class="btn-icon small" title="Crear marca" @click="quickCreateBrand">
                        <i class="bi bi-plus-lg"></i>
                      </button>
                    </div>
                  </div>
                </div>

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

                  <div class="form-section-images">
                    <h3>
                      <i class="bi bi-images"></i>
                      Imágenes del mueble
                      <span v-if="formData.imageUrls.length > 0" class="img-count">{{ formData.imageUrls.length }}/10</span>
                    </h3>

                    <div v-if="formData.imageUrl || formData.imageUrls.length > 0" class="image-preview-current">
                      <img :src="formData.imageUrl || formData.imageUrls[0]" alt="Imagen principal" />
                      <span class="primary-label"><i class="bi bi-star-fill"></i> Principal</span>
                    </div>

                    <div v-if="formData.imageUrls.length > 0" class="image-gallery-grid">
                      <div
                        v-for="(url, idx) in formData.imageUrls"
                        :key="idx"
                        class="gallery-thumb"
                        :class="{ 'is-primary': url === formData.imageUrl }"
                      >
                        <img :src="url" :alt="`Imagen ${idx + 1}`" @click="formData.imageUrl = url" />
                        <div class="thumb-actions">
                          <button type="button" class="thumb-btn thumb-set-primary" v-if="url !== formData.imageUrl" @click="formData.imageUrl = url" title="Principal">
                            <i class="bi bi-star"></i>
                          </button>
                          <button type="button" class="thumb-btn thumb-remove" @click="removeImage(idx)" title="Eliminar">
                            <i class="bi bi-x"></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div
                      class="image-drop-area"
                      :class="{ 'uploading': isUploadingImage }"
                      @dragover.prevent
                      @drop.prevent="handleDrop"
                      @click="$refs.fileInput.click()"
                    >
                      <template v-if="isUploadingImage">
                        <i class="bi bi-arrow-repeat spin"></i>
                        <p>Subiendo imagen(es)...</p>
                      </template>
                      <template v-else>
                        <i class="bi bi-cloud-upload"></i>
                        <p>Arrastra imágenes o haz clic para seleccionar</p>
                        <span class="hint">JPG, PNG, WEBP · máx. 5 MB · hasta 10 imágenes</span>
                      </template>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
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
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import Swal from 'sweetalert2';
import * as furnitureService from '../services/furniture';
import { brandsService } from '../services/brands';
import axiosConfig from '../config/AxiosConfig';
import axios from 'axios';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  isEditing: { type: Boolean, default: false },
  furnitureData: { type: Object, default: () => ({}) },
  categories: { type: Array, default: () => [] },
  brands: { type: Array, default: () => [] }
});

const emit = defineEmits(['close', 'success', 'open-category-form', 'brand-created']);

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
  imageUrls: [],
  images: [],
  stock: 0,
  minStock: 0,
  brandId: null,
  color: '',
  material: '',
  dimensions: ''
});

const imageErrors = ref([]);

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.isEditing && props.furnitureData) {
      const normalizedData = { ...props.furnitureData };
      if (normalizedData.categoryId && !normalizedData.category_id) {
        normalizedData.category_id = normalizedData.categoryId;
      } else if (normalizedData.category && typeof normalizedData.category === 'object') {
        normalizedData.category_id = normalizedData.category.id;
      }
      normalizedData.costPrice = normalizedData.costPrice || normalizedData.cost_price || 0;
      normalizedData.minStock = normalizedData.minStock || normalizedData.min_stock || 0;
      normalizedData.imageUrl = normalizedData.imageUrl || '';
      normalizedData.brandId = normalizedData.brandId || normalizedData.brand_id || (typeof normalizedData.brand === 'object' ? normalizedData.brand?.id : null) || null;
      normalizedData.color = normalizedData.color || '';
      normalizedData.material = normalizedData.material || '';
      normalizedData.dimensions = normalizedData.dimensions || '';
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
      let imageUrls = [];
      if (normalizedData.imageUrls && Array.isArray(normalizedData.imageUrls)) {
        imageUrls = normalizedData.imageUrls.filter(Boolean);
      } else if (normalizedData.product_images && Array.isArray(normalizedData.product_images)) {
        imageUrls = normalizedData.product_images.map(img =>
          typeof img === 'string' ? img : (img.url || img.img_base64 || '')
        ).filter(Boolean);
      }
      if (imageUrls.length === 0 && normalizedData.imageUrl) {
        imageUrls = [normalizedData.imageUrl];
      }
      normalizedData.imageUrls = imageUrls;
      formData.value = normalizedData;
    } else {
      resetForm();
    }
    imageErrors.value = [];
  }
});

function resetForm() {
  formData.value = {
    id: null, name: '', description: '', price: 0, costPrice: 0,
    category_id: null, imageUrl: '', imageUrls: [], images: [], stock: 0, minStock: 0,
    brandId: null, color: '', material: '', dimensions: ''
  };
}

function closeModal() { emit('close'); }

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
  const dataToSend = {
    name: formData.value.name.trim(),
    description: formData.value.description || '',
    price: parseFloat(formData.value.price),
    costPrice: parseFloat(formData.value.costPrice) || 0,
    stock: parseInt(formData.value.stock) || 0,
    minStock: parseInt(formData.value.minStock) || 0,
    categoryId: formData.value.category_id ? parseInt(formData.value.category_id) : undefined,
    brandId: formData.value.brandId ? parseInt(formData.value.brandId) : undefined,
    imageUrl: formData.value.imageUrl || (formData.value.imageUrls && formData.value.imageUrls[0]) || (formData.value.images && formData.value.images[0]) || undefined,
    imageUrls: formData.value.imageUrls?.length > 0 ? formData.value.imageUrls : undefined,
    color: formData.value.color || undefined,
    material: formData.value.material || undefined,
    dimensions: formData.value.dimensions || undefined,
  };
  try {
    if (props.isEditing && formData.value.id) {
      await furnitureService.updateFurniture(formData.value.id, dataToSend);
      axiosConfig.ToastSuccess('¡Éxito!', 'Mueble actualizado correctamente');
    } else {
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

async function quickCreateBrand() {
  const result = await Swal.fire({
    title: 'Nueva Marca',
    input: 'text',
    inputPlaceholder: 'Nombre de la marca',
    showCancelButton: true,
    confirmButtonText: 'Crear',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#860734',
    inputValidator: (v) => v.trim() ? null : 'El nombre es obligatorio'
  });
  if (!result.isConfirmed) return;
  try {
    const res = await brandsService.createBrand({ name: result.value.trim() });
    const newBrand = res.data?.data || res.data;
    emit('brand-created', newBrand);
    formData.value.brandId = newBrand.id;
    axiosConfig.ToastSuccess('Marca creada', newBrand.name);
  } catch (e) {
    axiosConfig.ToastError('Error', e.response?.data?.message || 'No se pudo crear la marca');
  }
}

async function uploadImageFiles(files) {
  const errors = [];
  const validFiles = Array.from(files).filter(f => {
    if (!f.type.startsWith('image/')) { errors.push(`${f.name} no es imagen válida.`); return false; }
    if (f.size > maxFileSizeMB * 1024 * 1024) { errors.push(`${f.name} supera ${maxFileSizeMB} MB.`); return false; }
    return true;
  });
  if (errors.length) imageErrors.value = errors;
  if (!validFiles.length) return;
  const remaining = 10 - (formData.value.imageUrls?.length || 0);
  if (remaining <= 0) {
    imageErrors.value = ['Máximo 10 imágenes por producto.'];
    return;
  }
  imageErrors.value = [];
  isUploadingImage.value = true;
  try {
    const fd = new FormData();
    validFiles.slice(0, remaining).forEach(f => fd.append('files', f));
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    const { data } = await axios.post('/api/images/upload-multiple', fd, {
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    const urls = Array.isArray(data?.data) ? data.data : [];
    if (urls.length > 0) {
      const newUrls = [...(formData.value.imageUrls || []), ...urls];
      formData.value.imageUrls = newUrls;
      if (!formData.value.imageUrl) formData.value.imageUrl = newUrls[0];
      axiosConfig.ToastSuccess('Imágenes subidas', `${urls.length} imagen(es) subida(s)`);
    } else {
      imageErrors.value = ['El servidor no devolvió URLs válidas.'];
    }
  } catch (err) {
    console.error('Error al subir imágenes:', err);
    imageErrors.value = ['No se pudieron subir las imágenes.'];
  } finally {
    isUploadingImage.value = false;
  }
}

async function handleImageUpload(e) {
  const files = e.target.files;
  if (!files?.length) return;
  await uploadImageFiles(files);
  e.target.value = '';
}

async function handleDrop(e) {
  const files = e.dataTransfer.files;
  if (!files?.length) return;
  await uploadImageFiles(files);
}

function removeImage(idx) {
  const url = formData.value.imageUrls[idx];
  formData.value.imageUrls.splice(idx, 1);
  if (formData.value.imageUrl === url) {
    formData.value.imageUrl = formData.value.imageUrls[0] || '';
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(20,20,19,0.45);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: var(--s3);
  overflow-y: auto;
}

.modal-form {
  background: var(--white);
  border-radius: var(--r-hero);
  max-width: 900px;
  width: 100%;
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.modal-form form {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 92vh;
  overflow: hidden;
}

.form-header {
  background: var(--white);
  border-bottom: 1px solid var(--border);
  padding: var(--s3) var(--s4);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.form-header h2 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--ink);
}

.form-header h2 i { color: var(--slate); font-size: 0.9375rem; }

.close-btn {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--slate);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  font-size: 0.875rem;
}
.close-btn:hover { background: var(--canvas); color: var(--ink); }

.form-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--s4);
  background: var(--canvas-lifted);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--s3);
}

.form-column {
  display: flex;
  flex-direction: column;
  gap: var(--s2);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-weight: 500;
  color: var(--charcoal);
  font-size: 0.8125rem;
  display: flex;
  align-items: center;
  gap: 5px;
}

.form-group label i { color: var(--slate); }

.form-group input,
.form-group select,
.form-group textarea {
  padding: 9px 14px;
  border: 1px solid var(--dust);
  border-radius: 10px;
  font-size: 0.9375rem;
  font-family: var(--font);
  background: var(--white);
  color: var(--ink);
  transition: border-color 0.15s;
  outline: none;
  width: 100%;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus { border-color: var(--ink); }

.form-group textarea { resize: vertical; min-height: 90px; }

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--s2);
}

.form-row-compact { gap: var(--s1); }

.form-group-small { display: flex; flex-direction: column; gap: 6px; }

.category-select-controls { display: flex; gap: 6px; align-items: stretch; }
.category-select-controls select { flex: 1; }
.category-select-controls .btn-icon {
  width: 38px;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ink);
  color: var(--canvas);
  border: 1.5px solid var(--ink);
  border-radius: 10px;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: opacity 0.15s;
  flex-shrink: 0;
}
.category-select-controls .btn-icon:hover { opacity: 0.85; }

.form-section-images {
  display: flex;
  flex-direction: column;
  gap: var(--s2);
  padding: var(--s3);
  background: var(--white);
  border: 1px dashed var(--dust);
  border-radius: var(--r-card);
}

.form-section-images h3 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--ink);
  margin: 0;
  letter-spacing: -0.01em;
}

.image-preview-current {
  position: relative;
  width: 100%;
  max-height: 160px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.image-preview-current img {
  width: 100%;
  max-height: 160px;
  object-fit: cover;
  display: block;
}

.btn-remove-img {
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(220,53,69,0.88);
  color: white;
  border: none;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.15s;
}
.btn-remove-img:hover { background: #dc2626; }

.image-drop-area {
  border: 1px dashed var(--dust);
  border-radius: 10px;
  padding: var(--s3) var(--s2);
  text-align: center;
  background: var(--canvas-lifted);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.image-drop-area:hover,
.image-drop-area:focus { border-color: var(--ink); background: var(--white); }

.image-drop-area.uploading { pointer-events: none; opacity: 0.7; }

.image-drop-area i { font-size: 1.5rem; color: var(--slate); }

.image-drop-area p { margin: 0; color: var(--charcoal); font-size: 0.875rem; }

.image-drop-area .hint { font-size: 0.75rem; color: var(--slate); }

.spin { animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.hidden-file-input { display: none; }

.error-messages { display: flex; flex-direction: column; gap: 6px; }

.error-message {
  background: #fef2f2;
  color: #dc2626;
  padding: 8px 14px;
  border-radius: var(--r-card);
  font-size: 0.8125rem;
  display: flex;
  align-items: center;
  gap: 6px;
  border-left: 3px solid #dc2626;
}

.form-footer {
  padding: var(--s3) var(--s4);
  background: var(--white);
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
  gap: var(--s2);
  flex-shrink: 0;
}

.btn-secondary {
  background: var(--white);
  color: var(--ink);
  border: 1.5px solid var(--ink);
  padding: 8px 24px;
  border-radius: var(--r-btn);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.15s;
  font-family: var(--font);
  letter-spacing: -0.02em;
}
.btn-secondary:hover { background: var(--canvas); }

.btn-primary {
  background: var(--ink);
  color: var(--canvas);
  border: 1.5px solid var(--ink);
  padding: 8px 24px;
  border-radius: var(--r-btn);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: opacity 0.15s;
  font-family: var(--font);
  letter-spacing: -0.02em;
}
.btn-primary:hover { opacity: 0.85; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.img-count {
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--slate);
  margin-left: 6px;
}

.primary-label {
  position: absolute;
  bottom: 6px;
  left: 6px;
  background: rgba(0,0,0,0.6);
  color: #ffd700;
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.image-gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
  gap: 6px;
}

.gallery-thumb {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid var(--dust);
  cursor: pointer;
  aspect-ratio: 1;
  transition: border-color 0.15s;
}

.gallery-thumb.is-primary { border-color: var(--ink); }

.gallery-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.thumb-actions {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  gap: 3px;
  padding: 4px;
  background: rgba(0,0,0,0.4);
  opacity: 0;
  transition: opacity 0.15s;
}

.gallery-thumb:hover .thumb-actions { opacity: 1; }

.thumb-btn {
  background: rgba(255,255,255,0.9);
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.65rem;
  color: var(--ink);
  padding: 0;
}

.thumb-remove { color: #dc2626; }

.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .form-grid { grid-template-columns: 1fr; }
  .form-body { padding: var(--s3); }
  .form-footer { padding: var(--s2) var(--s3); }
}

@media (max-width: 480px) {
  .modal-form { border-radius: var(--r-card); }
  .form-row { grid-template-columns: 1fr 1fr; gap: var(--s1); }
  .form-footer { flex-direction: column; }
  .form-footer button { width: 100%; justify-content: center; }
}
</style>
