<template>
  <div>
    <!-- Indicador de carga -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando categorías...</p>
    </div>

    <!-- Error message -->
    <div v-else-if="error" class="error-message">
      <i class="bi bi-exclamation-circle"></i>
      <p>{{ error }}</p>
      <button @click="fetchCategories" class="retry-button">
        <i class="bi bi-arrow-clockwise"></i> Reintentar
      </button>
    </div>

    <!-- Categories grid -->
    <ul v-else class="categories-grid" role="list">
      <li
        v-for="(item, idx) in displayItems"
        :key="item.id || idx"
        class="category-item"
        tabindex="0"
        @click="onClick(item)"
        @keydown.enter="onClick(item)"
        @keydown.space.prevent="onClick(item)"
      >
        <div class="tile">
          <div class="icon-box" aria-hidden="true" v-html="item.icon || defaultIcon"></div>
        </div>
        <div class="label">{{ item.name }}</div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { getCategories } from '../services/categories';

const props = defineProps({
  items: { type: Array, default: () => [] },
  autoLoad: { type: Boolean, default: false }
});

const emit = defineEmits(['select', 'loaded', 'error']);

// Estado local
const localItems = ref([]);
const loading = ref(false);
const error = ref(null);

// Icono predeterminado para categorías sin icono
const defaultIcon = `<i class="bi bi-grid"></i>`;

// Determinar qué items mostrar (props o datos locales)
const displayItems = computed(() => {
  return props.items.length > 0 ? props.items : localItems.value;
});

// Función para obtener categorías
async function fetchCategories() {
  if (!props.autoLoad && props.items.length > 0) {
    return; // No cargar si no es autoload y ya tenemos items
  }

  try {
    loading.value = true;
    error.value = null;
    const data = await getCategories();
    localItems.value = data;
    emit('loaded', data);
  } catch (err) {
    console.error('Error al cargar las categorías:', err);
    error.value = 'No se pudieron cargar las categorías. Por favor, intente nuevamente.';
    emit('error', err);
  } finally {
    loading.value = false;
  }
}

function onClick(item) {
  emit('select', item);
}

// Cargar categorías al montar si autoLoad está activado
onMounted(() => {
  if (props.autoLoad) {
    fetchCategories();
  }
});

// Observar cambios en la prop autoLoad
watch(() => props.autoLoad, (newValue) => {
  if (newValue && localItems.value.length === 0) {
    fetchCategories();
  }
});

// Exponer funciones para uso externo
defineExpose({
  refresh: fetchCategories
});
</script>

<style scoped>
.categories-grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  align-items: start;
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-item {
  text-align: center;
  cursor: pointer;
  outline: none;
  transition: transform 0.2s ease;
}

.category-item:focus {
  outline: 2px solid rgba(134, 7, 52, 0.4);
  outline-offset: 3px;
  border-radius: 10px;
}

.category-item:active {
  transform: scale(0.98);
}

.tile {
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #efebe6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px auto;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #111827;
  border: 1px solid rgba(15, 23, 42, 0.05);
}

.category-item:hover .tile {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(2, 6, 23, 0.08);
}

.icon-box {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-box svg {
  width: 56px;
  height: 56px;
  color: #111827;
  opacity: 0.95;
}

.icon-box i {
  font-size: 2.5rem;
  color: #4a3440;
  opacity: 0.85;
  transition: all 0.3s ease;
}

.category-item:hover .icon-box i {
  color: #860734;
  opacity: 1;
  transform: scale(1.05);
}

.label {
  font-size: 0.9rem;
  font-weight: 700;
  color: #111827;
  max-width: 120px;
  margin: 0 auto;
  line-height: 1.3;
  transition: color 0.3s ease;
}

.category-item:hover .label {
  color: #860734;
}

@media (min-width: 1200px) {
  .categories-grid {
    grid-template-columns: repeat(7, 1fr);
  }

  .label {
    max-width: none;
  }
}

@media (max-width: 640px) {
  .categories-grid {
    gap: 10px;
    grid-template-columns: repeat(3, 1fr);
  }

  .icon-box svg,
  .icon-box i {
    width: 44px;
    height: 44px;
    font-size: 2rem;
  }

  .label {
    font-size: 0.8rem;
  }
}

/* Estilos para el indicador de carga */
.loading-container {
  text-align: center;
  padding: 2rem;
  color: #4a3440;
}

.spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid rgba(134, 7, 52, 0.2);
  border-radius: 50%;
  border-top-color: #860734;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Estilos para mensajes de error */
.error-message {
  text-align: center;
  padding: 2rem;
  color: #860734;
  background: rgba(134, 7, 52, 0.1);
  border-radius: 8px;
  margin: 1rem 0;
}

.error-message i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.retry-button {
  background: #860734;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  margin-top: 1rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s ease;
}

</style>

