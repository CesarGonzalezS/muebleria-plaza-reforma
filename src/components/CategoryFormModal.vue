<template>
  <Transition name="modal">
    <div v-if="isOpen" class="modal-overlay" role="dialog" aria-modal="true" @click.self="closeModal">
      <div class="modal-card" role="document">
        <form @submit.prevent="handleSubmit" novalidate>
          <header class="modal-header">
            <div class="header-content">
              <div class="icon-wrapper" aria-hidden="true">
                <i class="bi bi-folder-plus"></i>
              </div>
              <h2 class="modal-title">{{ isEditing ? 'Editar categoría' : 'Crear categoría' }}</h2>
              <p class="modal-subtitle" v-if="isEditing">Actualiza los datos de la categoría</p>
            </div>

            <button type="button" class="close-btn" @click="closeModal" aria-label="Cerrar formulario">
              <i class="bi bi-x-lg" aria-hidden="true"></i>
            </button>
          </header>

          <main class="modal-body">
            <div class="form-grid">
              <div class="form-group">
                <label for="category-name">
                  Nombre <span class="required" aria-hidden="true">*</span>
                </label>
                <input
                  id="category-name"
                  v-model="formData.name"
                  type="text"
                  placeholder="Ej: Tecnología, Hogar, etc."
                  required
                  aria-required="true"
                />
              </div>

              <div class="form-group">
                <label for="category-description">Descripción</label>
                <textarea
                  id="category-description"
                  v-model="formData.description"
                  rows="4"
                  placeholder="Describe esta categoría (opcional)"
                ></textarea>
              </div>
            </div>
          </main>

          <footer class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary">
              <i class="bi" :class="isEditing ? 'bi-check-lg' : 'bi-plus-lg'" aria-hidden="true"></i>
              <span class="btn-text">{{ isEditing ? 'Guardar cambios' : 'Crear categoría' }}</span>
            </button>
          </footer>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue';
import * as categoriesService from '../services/categories';
import axiosConfig from '../config/AxiosConfig';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  categoryData: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['close', 'success']);

const formData = ref({
  id: null,
  name: '',
  description: ''
});

const errors = ref([]);
const isSubmitting = ref(false);

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.isEditing && props.categoryData) {
      formData.value = { ...props.categoryData };
    } else {
      resetForm();
    }
    errors.value = [];
  }
});

function resetForm() {
  formData.value = {
    id: null,
    name: '',
    description: ''
  };
}

function closeModal() {
  emit('close');
}

function validateForm() {
  errors.value = [];

  if (!formData.value.name || !formData.value.name.trim()) {
    errors.value.push('El nombre de la categoría es obligatorio');
    return false;
  }

  if (formData.value.name.trim().length < 2) {
    errors.value.push('El nombre debe tener al menos 2 caracteres');
    return false;
  }

  return true;
}

async function handleSubmit() {
  if (!validateForm()) {
    axiosConfig.ToastWarning('Validación', errors.value[0]);
    return;
  }

  if (isSubmitting.value) return;

  isSubmitting.value = true;

  const payload = {
    name: formData.value.name.trim(),
    description: formData.value.description?.trim() || ''
  };

  try {
    if (props.isEditing && formData.value.id) {
      // Actualizar categoría existente
      await categoriesService.updateCategory(formData.value.id, payload);
      axiosConfig.ToastSuccess('¡Éxito!', 'Categoría actualizada correctamente');
    } else {
      // Crear nueva categoría
      await categoriesService.createCategory(payload);
      axiosConfig.ToastSuccess('¡Éxito!', 'Categoría creada correctamente');
    }

    emit('success');
    closeModal();
  } catch (err) {
    console.error('Error al guardar categoría:', err);

    if (err.response && err.response.status === 409) {
      axiosConfig.ToastWarning('Conflicto', 'Ya existe una categoría con ese nombre');
    } else if (err.response && err.response.data) {
      const errorMsg = err.response.data.detail || JSON.stringify(err.response.data);
      axiosConfig.ToastError('Error', errorMsg);
    } else {
      axiosConfig.ToastError('Error', 'No se pudo guardar la categoría');
    }
  } finally {
    isSubmitting.value = false;
  }
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

/* Modal Card */
.modal-card {
  background: #fff;
  border-radius: 16px;
  max-width: 550px;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  animation: scaleIn 0.3s ease;
  /* permitir que el modal sea alto y el body haga scroll en pantallas pequeñas */
  max-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
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

.modal-card form {
  display: flex;
  flex-direction: column;
  /* asegurar que el contenido principal pueda crecer y el body haga scroll */
  min-height: 0;
}

/* Modal Header */
.modal-header {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: #fff;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.modal-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.modal-header .header-content {
  position: relative;
  z-index: 1;
}

.modal-header .icon-wrapper {
  width: 3.5rem;
  height: 3.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.modal-header .icon-wrapper i {
  font-size: 1.75rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.5px;
}

.modal-subtitle {
  font-size: 0.95rem;
  margin: 0;
  opacity: 0.9;
  font-weight: 400;
}

.modal-header .close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  z-index: 2;
}

.modal-header .close-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: rotate(90deg) scale(1.1);
  border-color: rgba(255, 255, 255, 0.5);
}

/* Modal Body */
.modal-body {
  padding: 2rem;
  background: linear-gradient(to bottom, #fafbfc, #ffffff);
  /* Hacer la zona central scrollable si el contenido desborda */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* Mantener el footer fijo al final pero dentro del modal */
.modal-footer {
  padding: 1.5rem 2rem;
  background: linear-gradient(to top, #f8f9fa, #ffffff);
  border-top: 2px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
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
  .modal-card {
    max-width: 95%;
  }

  .modal-header {
    padding: 1.5rem;
  }

  .modal-header .icon-wrapper {
    width: 3rem;
    height: 3rem;
  }

  .modal-header .icon-wrapper i {
    font-size: 1.5rem;
  }

  .modal-title {
    font-size: 1.35rem;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .modal-footer {
    padding: 1.25rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .modal-card {
    max-width: 98%;
  }

  .modal-header {
    padding: 1.25rem 1rem;
  }

  .modal-header::before {
    width: 150px;
    height: 150px;
  }

  .modal-header .icon-wrapper {
    width: 2.75rem;
    height: 2.75rem;
    margin-bottom: 0.75rem;
  }

  .modal-header .icon-wrapper i {
    font-size: 1.35rem;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .modal-subtitle {
    font-size: 0.9rem;
  }

  .modal-header .close-btn {
    top: 1rem;
    right: 1rem;
    width: 2rem;
    height: 2rem;
    font-size: 0.9rem;
  }

  .modal-body {
    padding: 1.25rem 1rem;
  }

  .modal-body .form-grid {
    gap: 1.25rem;
  }

  .modal-body .form-group label {
    font-size: 0.9rem;
  }

  .modal-body .form-group input,
  .modal-body .form-group textarea {
    padding: 0.75rem 0.875rem;
    font-size: 0.95rem;
  }

  .modal-footer {
    padding: 1rem;
    flex-direction: column;
    gap: 0.75rem;
  }

  .modal-footer .btn {
    width: 100%;
    justify-content: center;
    padding: 0.875rem 1.5rem;
  }
}
</style>
