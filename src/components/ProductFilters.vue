<template>
  <div class="filters-container">
    <div class="filters-header">
      <h2><i class="bi bi-funnel"></i> Filtrar productos</h2>
      <button
        v-if="hasActiveFilters"
        class="clear-all-btn"
        @click="$emit('clear-filters')"
        title="Limpiar todos los filtros"
      >
        <i class="bi bi-x-circle"></i>
        Limpiar todo
      </button>
    </div>

    <div class="filters-content">
      <!-- Búsqueda -->
      <div class="filter-item search-filter">
        <label><i class="bi bi-search"></i> Buscar</label>
        <div class="search-wrapper">
          <input
            type="text"
            class="search-input"
            placeholder="Nombre del producto..."
            v-model="localSearchTerm"
          />
          <button
            v-if="localSearchTerm"
            class="clear-search-btn"
            @click="clearSearch"
            title="Limpiar búsqueda"
          >
            <i class="bi bi-x"></i>
          </button>
        </div>
      </div>

      <!-- Categoría -->
      <div class="filter-item">
        <label for="category-filter"><i class="bi bi-tag"></i> Categoría</label>
        <select
          id="category-filter"
          name="category"
          v-model="localSelectedCategory"
          class="filter-select"
          aria-label="Filtrar por categoría">
          <option value="">Todas las categorías</option>
          <option v-for="cat in categories" :key="cat.value" :value="cat.value">
            {{ cat.icon }} {{ cat.label }}
          </option>
        </select>
      </div>

      <!-- Rango de Precio -->
      <div class="filter-item price-filter">
        <label><i class="bi bi-cash-stack"></i> Rango de precio</label>
        <div class="price-inputs">
          <input
            type="number"
            id="price-min"
            name="priceMin"
            class="price-input"
            placeholder="Mínimo"
            title="Precio mínimo"
            aria-label="Precio mínimo"
            v-model.number="localMinPrice"
            min="0"
          />
          <span class="price-separator">—</span>
          <input
            type="number"
            id="price-max"
            name="priceMax"
            class="price-input"
            placeholder="Máximo"
            title="Precio máximo"
            aria-label="Precio máximo"
            v-model.number="localMaxPrice"
            min="0"
          />
        </div>
      </div>

      <button class="apply-filters-btn" @click="applyFilters">
        <i class="bi bi-search"></i> Aplicar filtros
      </button>
    </div>
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue';

export default {
  name: 'ProductFilters',
  props: {
    searchTerm: String,
    selectedCategory: {
      type: [String, Number],
      required: false
    },
    minPrice: [String, Number],
    maxPrice: [String, Number],
    categories: {
      type: Array,
      required: true
    }
  },
  emits: ['update:searchTerm', 'update:selectedCategory', 'update:minPrice', 'update:maxPrice', 'apply-filters', 'clear-filters'],
  setup(props, { emit }) {
    const localSearchTerm = ref(props.searchTerm);
    const localSelectedCategory = ref(props.selectedCategory);
    const localMinPrice = ref(props.minPrice);
    const localMaxPrice = ref(props.maxPrice);

    watch(localSearchTerm, (newVal) => emit('update:searchTerm', newVal));
    watch(localSelectedCategory, (newVal) => emit('update:selectedCategory', newVal));
    watch(localMinPrice, (newVal) => emit('update:minPrice', newVal));
    watch(localMaxPrice, (newVal) => emit('update:maxPrice', newVal));

    const clearSearch = () => {
      localSearchTerm.value = '';
    };

    const applyFilters = () => {
      emit('apply-filters');
    };

    const hasActiveFilters = computed(() => {
      return (
        localSearchTerm.value ||
        localSelectedCategory.value ||
        localMinPrice.value ||
        localMaxPrice.value
      );
    });

    return {
      localSearchTerm,
      localSelectedCategory,
      localMinPrice,
      localMaxPrice,
      clearSearch,
      applyFilters,
      hasActiveFilters
    };
  }
};
</script>

<style scoped>
.filters-container {
  background: #ffffff;
  border-radius: 24px;
  padding: 2rem;
  margin-bottom: 3rem;
  box-shadow:
    0 10px 40px rgba(134, 7, 52, 0.08),
    0 2px 12px rgba(134, 7, 52, 0.04);
  border: 1px solid rgba(134, 7, 52, 0.05);
}

.filters-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0e8f0;
}

.filters-header h2 {
  color: #860734;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.clear-all-btn {
  background: #f0e8f0;
  color: #860734;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.clear-all-btn:hover {
  background: #860734;
  color: #ffffff;
  transform: translateY(-2px);
}

.filters-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr;
  gap: 1.5rem;
  align-items: end;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-item label {
  color: #860734;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 0.85rem 2.75rem 0.85rem 1rem;
  border-radius: 12px;
  font-size: 1rem;
  border: 2px solid #e0d0e0;
  background: #fafafa;
  color: #3a223a;
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #860734;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(134, 7, 52, 0.1);
}

.clear-search-btn {
  position: absolute;
  right: 0.75rem;
  background: transparent;
  border: none;
  color: #999;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.clear-search-btn:hover {
  color: #860734;
}

.filter-select {
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  font-size: 1rem;
  border: 2px solid #e0d0e0;
  background: #fafafa;
  color: #3a223a;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-select:focus {
  border-color: #860734;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(134, 7, 52, 0.1);
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.price-input {
  flex: 1;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  font-size: 1rem;
  border: 2px solid #e0d0e0;
  background: #fafafa;
  color: #3a223a;
  outline: none;
  transition: all 0.3s ease;
}

.price-input:focus {
  border-color: #860734;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(134, 7, 52, 0.1);
}

.price-separator {
  color: #860734;
  font-weight: 700;
  font-size: 1.25rem;
}

.apply-filters-btn {
  background: #860734;
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.apply-filters-btn:hover {
  background: #a91d4d;
  transform: translateY(-2px);
}
</style>
