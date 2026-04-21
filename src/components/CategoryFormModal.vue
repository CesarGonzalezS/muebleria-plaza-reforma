¯»¿<template>
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
      axiosConfig.ToastSuccess('¡xito!', 'Categoría actualizada correctamente');
    } else {
      // Crear nueva categoría
      await categoriesService.createCategory(payload);
      axiosConfig.ToastSuccess('¡xito!', 'Categoría creada correctamente');
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

.modal-card {
  background: var(--white);
  border-radius: var(--r-hero);
  max-width: 500px;
  width: 100%;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  max-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
}

.modal-card form { display: flex; flex-direction: column; min-height: 0; }

.modal-header {
  background: var(--white);
  border-bottom: 1px solid var(--border);
  padding: var(--s3) var(--s4);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  flex-shrink: 0;
}

.modal-header .header-content { display: flex; flex-direction: column; gap: 2px; }

.modal-header .icon-wrapper { display: none; }

.modal-title {
  font-size: 0.9375rem;
  font-weight: 600;
  margin: 0;
  letter-spacing: -0.02em;
  color: var(--ink);
}

.modal-subtitle {
  font-size: 0.75rem;
  color: var(--slate);
  margin: 0;
}

.close-btn {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--slate);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  font-size: 0.8125rem;
  flex-shrink: 0;
}
.close-btn:hover { background: var(--canvas); color: var(--ink); }

.modal-body {
  padding: var(--s4);
  background: var(--canvas-lifted);
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: var(--s3) var(--s4);
  background: var(--white);
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
  gap: var(--s2);
  flex-shrink: 0;
}

.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

/* Buttons inherit from global but need local overrides */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 24px;
  border-radius: var(--r-btn);
  font-family: var(--font);
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  cursor: pointer;
  border: 1.5px solid transparent;
  transition: opacity 0.15s, background 0.15s;
}

.btn-primary {
  background: var(--ink);
  color: var(--canvas);
  border-color: var(--ink);
}
.btn-primary:hover { opacity: 0.85; }

.btn-secondary {
  background: var(--white);
  color: var(--ink);
  border-color: var(--ink);
}
.btn-secondary:hover { background: var(--canvas); }

@media (max-width: 480px) {
  .modal-card { border-radius: var(--r-card); }
  .modal-body { padding: var(--s3); }
  .modal-footer { flex-direction: column; padding: var(--s2) var(--s3); }
}
</style>
