<template>
  <aside class="filters-panel" :class="{ 'filters-panel--open': isOpen }">
    <div class="filters-panel__header">
      <h2 class="filters-panel__title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
        </svg>
        Filtros
      </h2>
      <button
        v-if="hasActiveFilters"
        class="filters-panel__clear"
        @click="$emit('clear-filters')"
        type="button"
      >
        Limpiar todo
      </button>
    </div>

    <!-- Búsqueda -->
    <div class="filter-group">
      <label class="filter-group__label" for="filter-search">Buscar</label>
      <div class="filter-search-wrap">
        <input
          id="filter-search"
          type="text"
          class="filter-input"
          placeholder="Nombre del producto..."
          v-model="localSearch"
        />
        <button
          v-if="localSearch"
          class="filter-search-clear"
          @click="localSearch = ''"
          type="button"
          aria-label="Limpiar búsqueda"
        >
          <i class="bi bi-x"></i>
        </button>
      </div>
    </div>

    <!-- Categorías -->
    <div class="filter-group">
      <button
        class="filter-group__toggle"
        @click="catOpen = !catOpen"
        :aria-expanded="catOpen"
        type="button"
      >
        <span class="filter-group__label">Categorías</span>
        <i class="bi" :class="catOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
      </button>
      <div class="filter-group__body" v-show="catOpen">
        <label
          v-for="cat in categories"
          :key="cat.value"
          class="filter-checkbox"
          :class="{ 'filter-checkbox--active': localCategory === cat.value }"
        >
          <input
            type="radio"
            name="category"
            :value="cat.value"
            v-model="localCategory"
            class="filter-checkbox__input"
          />
          <span class="filter-checkbox__check"></span>
          <span class="filter-checkbox__label">{{ cat.label }}</span>
          <span class="filter-checkbox__count" v-if="cat.count != null">{{ cat.count }}</span>
        </label>
        <label class="filter-checkbox" :class="{ 'filter-checkbox--active': localCategory === '' }">
          <input
            type="radio"
            name="category"
            value=""
            v-model="localCategory"
            class="filter-checkbox__input"
          />
          <span class="filter-checkbox__check"></span>
          <span class="filter-checkbox__label">Todas</span>
        </label>
      </div>
    </div>

    <!-- Rango de precio -->
    <div class="filter-group">
      <button
        class="filter-group__toggle"
        @click="priceOpen = !priceOpen"
        :aria-expanded="priceOpen"
        type="button"
      >
        <span class="filter-group__label">Precio</span>
        <i class="bi" :class="priceOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
      </button>
      <div class="filter-group__body" v-show="priceOpen">
        <label
          v-for="range in priceRanges"
          :key="range.label"
          class="filter-checkbox"
          :class="{ 'filter-checkbox--active': activePriceRange === range.label }"
        >
          <input
            type="radio"
            name="priceRange"
            :value="range.label"
            v-model="activePriceRange"
            @change="applyPriceRange(range)"
            class="filter-checkbox__input"
          />
          <span class="filter-checkbox__check"></span>
          <span class="filter-checkbox__label">{{ range.label }}</span>
        </label>

        <div class="filter-price-custom">
          <span class="filter-price-custom__title">Personalizado</span>
          <div class="filter-price-inputs">
            <input
              type="number"
              class="filter-price-input"
              placeholder="Mín"
              v-model="localMin"
              min="0"
              aria-label="Precio mínimo"
              @input="activePriceRange = 'custom'"
            />
            <span class="filter-price-sep">—</span>
            <input
              type="number"
              class="filter-price-input"
              placeholder="Máx"
              v-model="localMax"
              min="0"
              aria-label="Precio máximo"
              @input="activePriceRange = 'custom'"
            />
          </div>
          <button
            class="filter-price-apply"
            @click="emitPrices"
            type="button"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>

    <button class="filters-panel__close-mobile" @click="$emit('close')" type="button">
      Ver resultados
    </button>
  </aside>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  searchTerm: { type: String, default: '' },
  selectedCategory: { type: [String, Number], default: '' },
  minPrice: { type: [String, Number], default: '' },
  maxPrice: { type: [String, Number], default: '' },
  categories: { type: Array, required: true },
  isOpen: { type: Boolean, default: false }
});

const emit = defineEmits([
  'update:searchTerm',
  'update:selectedCategory',
  'update:minPrice',
  'update:maxPrice',
  'apply-filters',
  'clear-filters',
  'close'
]);

const catOpen = ref(true);
const priceOpen = ref(true);
const activePriceRange = ref('');

const priceRanges = [
  { label: 'Hasta $2,000', min: 0, max: 2000 },
  { label: '$2,000 – $5,000', min: 2000, max: 5000 },
  { label: '$5,000 – $10,000', min: 5000, max: 10000 },
  { label: '$10,000 – $20,000', min: 10000, max: 20000 },
  { label: 'Más de $20,000', min: 20000, max: '' }
];

const localSearch = ref(props.searchTerm);
const localCategory = ref(props.selectedCategory);
const localMin = ref(props.minPrice);
const localMax = ref(props.maxPrice);

const hasActiveFilters = computed(() =>
  localSearch.value ||
  localCategory.value ||
  (localMin.value !== '' && !isNaN(Number(localMin.value))) ||
  (localMax.value !== '' && !isNaN(Number(localMax.value)))
);

watch(localSearch, v => emit('update:searchTerm', v));
watch(localCategory, v => {
  emit('update:selectedCategory', v);
  emit('apply-filters');
});

function applyPriceRange(range) {
  localMin.value = range.min;
  localMax.value = range.max;
  emit('update:minPrice', range.min);
  emit('update:maxPrice', range.max);
  emit('apply-filters');
}

function emitPrices() {
  const min = localMin.value !== '' ? parseFloat(localMin.value) : '';
  const max = localMax.value !== '' ? parseFloat(localMax.value) : '';
  emit('update:minPrice', min);
  emit('update:maxPrice', max);
  emit('apply-filters');
}

watch(() => props.searchTerm, v => { localSearch.value = v; });
watch(() => props.selectedCategory, v => { localCategory.value = v; });
watch(() => props.minPrice, v => { localMin.value = v; });
watch(() => props.maxPrice, v => { localMax.value = v; });

watch(
  () => [props.minPrice, props.maxPrice],
  ([min, max]) => {
    if (min === '' && max === '') {
      activePriceRange.value = '';
    }
  }
);
</script>

<style scoped>
.filters-panel {
  background: #fff;
  border-radius: 16px;
  border: 1px solid rgba(134, 7, 52, 0.07);
  box-shadow: 0 4px 20px rgba(134, 7, 52, 0.06);
  padding: 1.5rem;
  width: 260px;
  flex-shrink: 0;
  align-self: flex-start;
  position: sticky;
  top: 100px;
}

.filters-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(134, 7, 52, 0.08);
}

.filters-panel__title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #141413;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.filters-panel__clear {
  background: none;
  border: none;
  color: #860734;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
}

.filter-group {
  margin-bottom: 1.25rem;
  border-bottom: 1px solid rgba(134, 7, 52, 0.06);
  padding-bottom: 1.25rem;
}

.filter-group:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
}

.filter-group__toggle {
  width: 100%;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 0;
  margin-bottom: 0.75rem;
}

.filter-group__label {
  font-size: 0.9rem;
  font-weight: 700;
  color: #141413;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.filter-group__toggle i {
  color: #860734;
  font-size: 0.8rem;
}

.filter-group__body {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.filter-search-wrap {
  position: relative;
}

.filter-input {
  width: 100%;
  padding: 0.6rem 2rem 0.6rem 0.75rem;
  border: 2px solid #e8e0e8;
  border-radius: 10px;
  font-size: 0.9rem;
  color: #141413;
  background: #fafafa;
  outline: none;
  transition: border-color 0.2s;
}

.filter-input:focus {
  border-color: #860734;
  background: #fff;
}

.filter-search-clear {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0;
  display: flex;
}

.filter-checkbox {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  padding: 0.45rem 0.5rem;
  border-radius: 8px;
  transition: background 0.15s;
}

.filter-checkbox:hover {
  background: rgba(134, 7, 52, 0.04);
}

.filter-checkbox--active {
  background: rgba(134, 7, 52, 0.07);
}

.filter-checkbox__input {
  display: none;
}

.filter-checkbox__check {
  width: 16px;
  height: 16px;
  border: 2px solid #d0c0d0;
  border-radius: 50%;
  flex-shrink: 0;
  transition: all 0.15s;
  position: relative;
}

.filter-checkbox--active .filter-checkbox__check {
  border-color: #860734;
  background: #860734;
}

.filter-checkbox--active .filter-checkbox__check::after {
  content: '';
  position: absolute;
  width: 6px;
  height: 6px;
  background: #fff;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.filter-checkbox__label {
  font-size: 0.88rem;
  color: #3a223a;
  flex: 1;
}

.filter-checkbox--active .filter-checkbox__label {
  color: #860734;
  font-weight: 600;
}

.filter-checkbox__count {
  font-size: 0.78rem;
  color: #999;
  background: #f0e8f0;
  padding: 0.1rem 0.45rem;
  border-radius: 12px;
}

.filter-price-custom {
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px dashed #e0d0e0;
}

.filter-price-custom__title {
  font-size: 0.78rem;
  color: #999;
  display: block;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.filter-price-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.filter-price-input {
  flex: 1;
  padding: 0.5rem 0.6rem;
  border: 2px solid #e8e0e8;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #141413;
  outline: none;
  min-width: 0;
}

.filter-price-input:focus {
  border-color: #860734;
}

.filter-price-sep {
  color: #999;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.filter-price-apply {
  width: 100%;
  background: #860734;
  color: #fff;
  border: none;
  padding: 0.55rem;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.filter-price-apply:hover {
  background: #a91d4d;
}

.filters-panel__close-mobile {
  display: none;
  width: 100%;
  background: #860734;
  color: #fff;
  border: none;
  padding: 0.9rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 1.5rem;
}

@media (max-width: 900px) {
  .filters-panel {
    position: fixed;
    top: 0;
    left: 0;
    width: 300px;
    height: 100vh;
    border-radius: 0;
    z-index: 200;
    overflow-y: auto;
    overscroll-behavior: contain;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
  }

  .filters-panel--open {
    transform: translateX(0);
  }

  .filters-panel__close-mobile {
    display: block;
  }
}

@media (prefers-reduced-motion: reduce) {
  .filters-panel { transition: none; }
}
</style>
