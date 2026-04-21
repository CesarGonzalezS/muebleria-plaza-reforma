# Marketplace Products View Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rediseñar `/productos` al estilo Mercado Libre: sidebar de filtros (categoría + precio), sort bar, conteo de resultados, cards mejoradas con badges, y drawer móvil.

**Architecture:** Tres capas — `ProductsView.vue` orquesta el layout de dos columnas (sidebar + contenido), `ProductFilters.vue` se refactoriza a panel vertical con checkboxes y rangos de precio, `ProductCard.vue` se mejora con badges de oferta y envío gratis. Filtros sincronizados con `computed` reactivos; sin peticiones extra a la API.

**Tech Stack:** Vue 3 Composition API (`<script setup>`), CSS custom properties existentes (`#860734` brand), Bootstrap Icons, Rubik font (ya cargada).

---

## File Map

| Archivo | Acción | Responsabilidad |
|---------|--------|----------------|
| `src/views/ProductsView.vue` | Modificar | Layout sidebar+grid, sort bar, conteo, drawer móvil |
| `src/components/ProductFilters.vue` | Refactorizar | Sidebar vertical: categorías checklist, rangos precio |
| `src/components/ProductCard.vue` | Mejorar | Badge oferta %, badge envío gratis, texto meses sin intereses |

---

## Task 1: Sidebar Filters — Categorías como checklist

**Files:**
- Modify: `src/components/ProductFilters.vue`

Reemplazar el `<select>` de categorías por checkboxes verticales con conteo de productos por categoría. El componente pasa de ser una barra horizontal a un panel vertical.

- [ ] **Step 1: Reemplazar template de ProductFilters con diseño sidebar**

```vue
<!-- src/components/ProductFilters.vue -->
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
        <!-- Rangos predefinidos -->
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

        <!-- Precio personalizado -->
        <div class="filter-price-custom">
          <span class="filter-price-custom__title">Personalizado</span>
          <div class="filter-price-inputs">
            <input
              type="number"
              class="filter-price-input"
              placeholder="Mín"
              v-model.number="localMin"
              min="0"
              @input="activePriceRange = 'custom'"
            />
            <span class="filter-price-sep">—</span>
            <input
              type="number"
              class="filter-price-input"
              placeholder="Máx"
              v-model.number="localMax"
              min="0"
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

    <!-- Botón cerrar (móvil) -->
    <button class="filters-panel__close-mobile" @click="$emit('close')" type="button">
      Ver resultados
    </button>
  </aside>
</template>
```

- [ ] **Step 2: Reemplazar script de ProductFilters**

```vue
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
  localSearch.value || localCategory.value || localMin.value !== '' || localMax.value !== ''
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
  emit('update:minPrice', localMin.value);
  emit('update:maxPrice', localMax.value);
  emit('apply-filters');
}

watch(() => props.searchTerm, v => { localSearch.value = v; });
watch(() => props.selectedCategory, v => { localCategory.value = v; });
watch(() => props.minPrice, v => { localMin.value = v; });
watch(() => props.maxPrice, v => { localMax.value = v; });
</script>
```

- [ ] **Step 3: Reemplazar estilos de ProductFilters**

```vue
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

/* Búsqueda */
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

/* Checkboxes */
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

/* Precio personalizado */
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

/* Botón cerrar móvil */
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

/* Móvil */
@media (max-width: 768px) {
  .filters-panel {
    position: fixed;
    top: 0;
    left: 0;
    width: 300px;
    height: 100vh;
    border-radius: 0;
    z-index: 200;
    overflow-y: auto;
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
```

- [ ] **Step 4: Verificar manualmente que el panel aparece correcto**

Abrir `http://localhost:5173/productos` y confirmar que los filtros de categoría muestran checkboxes (no dropdown) y el precio tiene rangos predefinidos.

- [ ] **Step 5: Commit**

```bash
git add src/components/ProductFilters.vue
git commit -m "refactor(ProductFilters): sidebar vertical con checkboxes y rangos de precio"
```

---

## Task 2: Refactorizar ProductsView — Layout sidebar + grid + sort bar

**Files:**
- Modify: `src/views/ProductsView.vue`

Cambiar layout de una columna a dos columnas (sidebar izquierda + contenido derecho). Agregar sort bar con dropdown y contador de resultados. Agregar overlay y botón hamburger para móvil.

- [ ] **Step 1: Reemplazar template de ProductsView**

Sustituir el `<template>` completo con este nuevo layout:

```vue
<template>
  <div class="products-view">
    <Navbar />

    <!-- Hero compacto -->
    <section class="products-hero">
      <div class="products-hero__inner">
        <h1 class="products-hero__title">Catálogo de Muebles</h1>
        <p class="products-hero__sub">{{ totalCount }} productos disponibles</p>
      </div>
    </section>

    <main class="products-main">
      <!-- Overlay móvil para cerrar drawer -->
      <Transition name="fade">
        <div
          v-if="filtersOpen"
          class="filters-overlay"
          @click="filtersOpen = false"
          aria-hidden="true"
        ></div>
      </Transition>

      <!-- Sidebar de filtros -->
      <ProductFilters
        :searchTerm="searchTerm"
        :selectedCategory="selectedCategory"
        :minPrice="minPrice"
        :maxPrice="maxPrice"
        :categories="categoriesWithCount"
        :isOpen="filtersOpen"
        @update:searchTerm="v => { searchTerm = v; currentPage = 1; }"
        @update:selectedCategory="v => { selectedCategory = v; currentPage = 1; }"
        @update:minPrice="v => { minPrice = v; currentPage = 1; }"
        @update:maxPrice="v => { maxPrice = v; currentPage = 1; }"
        @apply-filters="currentPage = 1"
        @clear-filters="clearFilters"
        @close="filtersOpen = false"
      />

      <!-- Contenido principal -->
      <div class="products-content">

        <!-- Sort bar -->
        <div class="sort-bar">
          <!-- Botón abrir filtros (móvil) -->
          <button class="sort-bar__filter-btn" @click="filtersOpen = true" type="button">
            <i class="bi bi-sliders"></i>
            Filtros
            <span v-if="activeFilterCount > 0" class="sort-bar__filter-badge">{{ activeFilterCount }}</span>
          </button>

          <!-- Contador de resultados -->
          <span class="sort-bar__count">
            <strong>{{ filteredProducts.length }}</strong>
            {{ filteredProducts.length === 1 ? 'resultado' : 'resultados' }}
          </span>

          <!-- Active filter tags -->
          <div class="sort-bar__tags">
            <span v-if="selectedCategory" class="filter-tag">
              {{ getCategoryLabel(selectedCategory) }}
              <button @click="selectedCategory = ''" class="filter-tag__remove" type="button" aria-label="Quitar filtro">
                <i class="bi bi-x"></i>
              </button>
            </span>
            <span v-if="minPrice || maxPrice" class="filter-tag">
              ${{ minPrice || '0' }} – ${{ maxPrice || '∞' }}
              <button @click="minPrice = ''; maxPrice = ''" class="filter-tag__remove" type="button" aria-label="Quitar filtro">
                <i class="bi bi-x"></i>
              </button>
            </span>
          </div>

          <!-- Sort dropdown -->
          <div class="sort-bar__sort">
            <label for="sort-select" class="sort-bar__sort-label">Ordenar:</label>
            <select id="sort-select" v-model="sortBy" class="sort-select">
              <option value="default">Más relevantes</option>
              <option value="price_asc">Menor precio</option>
              <option value="price_desc">Mayor precio</option>
              <option value="name_asc">A–Z</option>
              <option value="name_desc">Z–A</option>
            </select>
          </div>
        </div>

        <!-- Loading skeleton -->
        <div v-if="loadingProducts" class="products-grid products-grid--skeleton" aria-busy="true" aria-label="Cargando">
          <div v-for="n in 12" :key="n" class="skeleton-card">
            <div class="skeleton-img"></div>
            <div class="skeleton-body">
              <div class="skeleton-line skeleton-line--sm"></div>
              <div class="skeleton-line skeleton-line--lg"></div>
              <div class="skeleton-line skeleton-line--md"></div>
            </div>
          </div>
        </div>

        <!-- Grid de productos -->
        <div v-else-if="paginatedProducts.length > 0" class="products-grid">
          <ProductCard
            v-for="product in paginatedProducts"
            :key="product.id"
            :product="product"
          />
        </div>

        <!-- Sin resultados -->
        <div v-else class="empty-state">
          <i class="bi bi-search" style="font-size:3rem; color:#d0c0d0;"></i>
          <h3>Sin resultados</h3>
          <p>Prueba con otros filtros o busca otra palabra.</p>
          <button class="empty-state__btn" @click="clearFilters" type="button">Ver todos los productos</button>
        </div>

        <!-- Paginación -->
        <nav v-if="totalPages > 1" class="pagination" aria-label="Páginas">
          <button
            class="page-btn"
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            aria-label="Anterior"
          >
            <i class="bi bi-chevron-left"></i>
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            :class="['page-btn', { 'page-btn--active': page === currentPage }]"
            @click="goToPage(page)"
            :aria-current="page === currentPage ? 'page' : null"
          >
            {{ page }}
          </button>
          <button
            class="page-btn"
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            aria-label="Siguiente"
          >
            <i class="bi bi-chevron-right"></i>
          </button>
        </nav>
      </div>
    </main>

    <Footer />
  </div>
</template>
```

- [ ] **Step 2: Reemplazar script de ProductsView**

```vue
<script setup>
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import ProductFilters from '../components/ProductFilters.vue';
import ProductCard from '../components/ProductCard.vue';
import { ref, computed, onMounted, watch } from 'vue';
import axiosConfig from '../config/AxiosConfig.js';
import { useRouter, useRoute } from 'vue-router';
import { getCategories } from '../services/categories';

const router = useRouter();
const route = useRoute();

// State
const products = ref([]);
const loadingProducts = ref(false);
const categories = ref([]);
const filtersOpen = ref(false);
const searchTerm = ref('');
const selectedCategory = ref('');
const minPrice = ref('');
const maxPrice = ref('');
const sortBy = ref('default');
const currentPage = ref(1);
const itemsPerPage = 12;

// API
async function fetchProducts() {
  loadingProducts.value = true;
  try {
    const res = await axiosConfig.doGet('/api/products');
    products.value = res.data.map(item => {
      let img = '/assets/img/products/default.jpg';
      if (item.images?.length > 0) {
        const first = item.images[0];
        img = typeof first === 'string' ? first : (first.img_base64 || first.url || img);
      } else if (item.img_base64) {
        img = item.img_base64;
      }
      return {
        id: item.id,
        name: item.name,
        price: parseFloat(item.price) || 0,
        category: item.category_name || '',
        img,
        images: item.images || []
      };
    });
  } catch {
    products.value = [];
  } finally {
    loadingProducts.value = false;
  }
}

async function fetchCategories() {
  try {
    const data = await getCategories();
    categories.value = data.map(cat => ({
      value: cat.name.toLowerCase(),
      label: cat.name,
      id: cat.id
    }));
  } catch {
    categories.value = [];
  }
}

// Categorías con conteo de productos
const categoriesWithCount = computed(() =>
  categories.value.map(cat => ({
    ...cat,
    count: products.value.filter(p =>
      String(p.category).toLowerCase() === String(cat.value).toLowerCase()
    ).length
  }))
);

// Filtrado
const filteredProducts = computed(() => {
  let list = products.value;

  if (searchTerm.value.trim()) {
    const q = searchTerm.value.toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(q));
  }
  if (selectedCategory.value) {
    list = list.filter(p =>
      String(p.category).toLowerCase() === String(selectedCategory.value).toLowerCase()
    );
  }
  if (minPrice.value !== '') {
    list = list.filter(p => p.price >= Number(minPrice.value));
  }
  if (maxPrice.value !== '') {
    list = list.filter(p => p.price <= Number(maxPrice.value));
  }

  // Sort
  if (sortBy.value === 'price_asc') list = [...list].sort((a, b) => a.price - b.price);
  else if (sortBy.value === 'price_desc') list = [...list].sort((a, b) => b.price - a.price);
  else if (sortBy.value === 'name_asc') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
  else if (sortBy.value === 'name_desc') list = [...list].sort((a, b) => b.name.localeCompare(a.name));

  return list;
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredProducts.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() =>
  Math.ceil(filteredProducts.value.length / itemsPerPage)
);

const totalCount = computed(() => products.value.length);

const visiblePages = computed(() => {
  const pages = [];
  const max = 5;
  let start = Math.max(1, currentPage.value - Math.floor(max / 2));
  let end = Math.min(totalPages.value, start + max - 1);
  if (end - start < max - 1) start = Math.max(1, end - max + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
});

const activeFilterCount = computed(() => {
  let n = 0;
  if (selectedCategory.value) n++;
  if (minPrice.value !== '' || maxPrice.value !== '') n++;
  if (searchTerm.value.trim()) n++;
  return n;
});

function getCategoryLabel(value) {
  return categories.value.find(c => c.value === value)?.label || value;
}

function clearFilters() {
  searchTerm.value = '';
  selectedCategory.value = '';
  minPrice.value = '';
  maxPrice.value = '';
  sortBy.value = 'default';
  currentPage.value = 1;
}

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Sync desde URL
onMounted(() => {
  fetchProducts();
  fetchCategories();
  if (route.query.buscar) searchTerm.value = route.query.buscar;
  if (route.params.categoria) selectedCategory.value = route.params.categoria;
});

watch(() => route.query.buscar, v => {
  if (v) { searchTerm.value = v; currentPage.value = 1; }
});

watch(() => route.params.categoria, v => {
  if (v) { selectedCategory.value = v; currentPage.value = 1; }
});

watch(sortBy, () => { currentPage.value = 1; });
</script>
```

- [ ] **Step 3: Reemplazar estilos de ProductsView**

```vue
<style scoped>
.products-view {
  min-height: 100vh;
  background: #f8f4f8;
}

/* Hero */
.products-hero {
  background: linear-gradient(135deg, #860734 0%, #a91d4d 100%);
  padding: 2.5rem 1.5rem;
}

.products-hero__inner {
  max-width: 1400px;
  margin: 0 auto;
}

.products-hero__title {
  color: #fff;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  margin: 0 0 0.4rem;
  letter-spacing: -0.02em;
}

.products-hero__sub {
  color: rgba(255,255,255,0.85);
  font-size: 1rem;
  margin: 0;
}

/* Main layout */
.products-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

/* Overlay móvil */
.filters-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  z-index: 199;
  backdrop-filter: blur(2px);
}

.fade-enter-active,
.fade-leave-active { transition: opacity 0.25s; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

/* Content */
.products-content {
  flex: 1;
  min-width: 0;
}

/* Sort bar */
.sort-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
  padding: 0.875rem 1.25rem;
  background: #fff;
  border-radius: 12px;
  border: 1px solid rgba(134,7,52,0.07);
  box-shadow: 0 2px 8px rgba(134,7,52,0.04);
}

.sort-bar__filter-btn {
  display: none;
  align-items: center;
  gap: 0.4rem;
  background: #860734;
  color: #fff;
  border: none;
  padding: 0.55rem 1rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  position: relative;
}

.sort-bar__filter-badge {
  background: #ffd700;
  color: #860734;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.7rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sort-bar__count {
  font-size: 0.92rem;
  color: #5a4a5a;
  white-space: nowrap;
}

.sort-bar__count strong {
  color: #860734;
  font-weight: 700;
}

.sort-bar__tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  flex: 1;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: rgba(134,7,52,0.08);
  color: #860734;
  padding: 0.3rem 0.6rem 0.3rem 0.85rem;
  border-radius: 20px;
  font-size: 0.82rem;
  font-weight: 600;
}

.filter-tag__remove {
  background: none;
  border: none;
  color: #860734;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  font-size: 1rem;
  opacity: 0.7;
}

.filter-tag__remove:hover { opacity: 1; }

.sort-bar__sort {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
}

.sort-bar__sort-label {
  font-size: 0.85rem;
  color: #888;
  white-space: nowrap;
}

.sort-select {
  border: 2px solid #e8e0e8;
  border-radius: 8px;
  padding: 0.4rem 0.6rem;
  font-size: 0.88rem;
  color: #141413;
  cursor: pointer;
  outline: none;
  background: #fafafa;
}

.sort-select:focus { border-color: #860734; }

/* Product grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* Skeleton */
.products-grid--skeleton {}

.skeleton-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(134,7,52,0.05);
}

.skeleton-img {
  aspect-ratio: 4/3;
  background: linear-gradient(90deg, #f0e8ec 25%, #f8f2f5 50%, #f0e8ec 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}

.skeleton-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-line {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, #f0e8ec 25%, #f8f2f5 50%, #f0e8ec 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}

.skeleton-line--sm { width: 40%; }
.skeleton-line--lg { width: 85%; }
.skeleton-line--md { width: 55%; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-state h3 {
  color: #141413;
  font-size: 1.4rem;
  font-weight: 700;
  margin: 1rem 0 0.5rem;
}

.empty-state p {
  color: #888;
  margin: 0 0 1.5rem;
}

.empty-state__btn {
  background: #860734;
  color: #fff;
  border: none;
  padding: 0.75rem 1.75rem;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.empty-state__btn:hover { background: #a91d4d; }

/* Paginación */
.pagination {
  display: flex;
  justify-content: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.page-btn {
  min-width: 40px;
  height: 40px;
  border: 2px solid #e0d0e0;
  background: #fff;
  color: #860734;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  background: #f0e8f0;
  border-color: #860734;
}

.page-btn--active {
  background: #860734;
  color: #fff;
  border-color: #860734;
}

.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .products-main {
    padding: 1.5rem 1rem 3rem;
    gap: 0;
  }

  .sort-bar__filter-btn {
    display: flex;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .products-hero { padding: 1.75rem 1rem; }
  .products-main { padding: 1rem 0.75rem 2.5rem; }

  .products-grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-img,
  .skeleton-line { animation: none; background: #f0e8ec; }
  .filters-overlay { transition: none; }
}
</style>
```

- [ ] **Step 4: Verificar layout en navegador**

Abrir `http://localhost:5173/productos`. Confirmar:
- Sidebar visible en desktop a la izquierda
- Grid de productos a la derecha con columnas automáticas
- Sort dropdown funcional (cambia orden sin recargar)
- Contador de resultados actualiza al filtrar

- [ ] **Step 5: Commit**

```bash
git add src/views/ProductsView.vue
git commit -m "feat(ProductsView): layout sidebar+grid estilo marketplace con sort y filter tags"
```

---

## Task 3: Mejorar ProductCard — badges y más info

**Files:**
- Modify: `src/components/ProductCard.vue`

Agregar badge de "Envío gratis" (si precio > 3000), badge "Oferta" (si precio < 3000), categoría visible en la card, y texto de MSI (meses sin intereses).

- [ ] **Step 1: Reemplazar template de ProductCard**

```vue
<template>
  <router-link class="product-card" :to="productLink" @click="handleClick">
    <!-- Badges -->
    <div class="product-card__badges">
      <span v-if="product.price >= 3000" class="badge badge--shipping">
        <i class="bi bi-truck"></i> Envío gratis
      </span>
      <span v-if="product.price < 3000" class="badge badge--offer">
        Oferta
      </span>
    </div>

    <!-- Imagen -->
    <div class="product-card__img-wrap">
      <img
        :src="imgSrc"
        :alt="product.name || 'Producto'"
        class="product-card__img"
        loading="lazy"
      />
      <div class="product-card__overlay" aria-hidden="true">
        <span class="product-card__overlay-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          Ver detalle
        </span>
      </div>
    </div>

    <!-- Info -->
    <div class="product-card__info">
      <span v-if="product.category" class="product-card__category">{{ product.category }}</span>
      <h3 class="product-card__name">{{ product.name }}</h3>
      <p class="product-card__price">${{ formattedPrice }}</p>
      <p class="product-card__msi">en 12 meses sin intereses</p>
    </div>
  </router-link>
</template>
```

- [ ] **Step 2: Reemplazar script de ProductCard**

```vue
<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({ product: Object });
const router = useRouter();

const imgSrc = computed(() => {
  if (props.product?.images?.length > 0) {
    const first = props.product.images[0];
    return typeof first === 'string' ? first : (first.img_base64 || first.url || '/assets/img/products/default.jpg');
  }
  return props.product?.img || props.product?.img_base64 || '/assets/img/products/default.jpg';
});

const productLink = computed(() => {
  const id = props.product?.id ?? props.product?._id ?? props.product?.product_id;
  return id != null && id !== '' ? { name: 'ProductoDetalle', params: { id } } : { name: 'ProductosList' };
});

const formattedPrice = computed(() =>
  (props.product?.price ?? 0).toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
);

function handleClick(event) {
  const id = props.product?.id ?? props.product?._id ?? props.product?.product_id;
  if (id == null || id === '') {
    event.preventDefault();
    router.push({ name: 'ProductosList' });
  }
}
</script>
```

- [ ] **Step 3: Reemplazar estilos de ProductCard**

```vue
<style scoped>
.product-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(134,7,52,0.07);
  box-shadow: 0 2px 10px rgba(134,7,52,0.06);
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: box-shadow 0.22s ease, transform 0.22s ease;
  position: relative;
}

.product-card:hover {
  box-shadow: 0 12px 32px rgba(134,7,52,0.13);
  transform: translateY(-4px);
}

/* Badges */
.product-card__badges {
  position: absolute;
  top: 0.7rem;
  left: 0.7rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  z-index: 2;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.6rem;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 700;
}

.badge--shipping {
  background: #d1fae5;
  color: #065f46;
}

.badge--offer {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #860734;
}

/* Imagen */
.product-card__img-wrap {
  position: relative;
  overflow: hidden;
  aspect-ratio: 4/3;
  background: #f4eef4;
}

.product-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
  display: block;
}

.product-card:hover .product-card__img {
  transform: scale(1.06);
}

.product-card__overlay {
  position: absolute;
  inset: 0;
  background: rgba(134,7,52,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.22s ease;
}

.product-card:hover .product-card__overlay {
  opacity: 1;
}

.product-card__overlay-btn {
  background: #fff;
  color: #860734;
  border-radius: 50px;
  padding: 0.55rem 1.2rem;
  font-size: 0.85rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transform: translateY(6px);
  transition: transform 0.22s ease;
}

.product-card:hover .product-card__overlay-btn {
  transform: translateY(0);
}

/* Info */
.product-card__info {
  padding: 0.9rem 1rem 1.1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.product-card__category {
  font-size: 0.72rem;
  font-weight: 700;
  color: #860734;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.product-card__name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #141413;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-card__price {
  font-size: 1.3rem;
  font-weight: 800;
  color: #141413;
  margin: 0.2rem 0 0;
  letter-spacing: -0.02em;
}

.product-card__msi {
  font-size: 0.75rem;
  color: #22c55e;
  font-weight: 600;
  margin: 0;
}

@media (prefers-reduced-motion: reduce) {
  .product-card,
  .product-card__img { transition: none; }
}
</style>
```

- [ ] **Step 4: Verificar cards en navegador**

Confirmar que:
- Cards con precio ≥ $3,000 muestran "Envío gratis" en verde
- Cards con precio < $3,000 muestran badge "Oferta" en dorado
- Categoría visible debajo del nombre en texto pequeño rojo
- Texto "en 12 meses sin intereses" en verde visible

- [ ] **Step 5: Commit**

```bash
git add src/components/ProductCard.vue
git commit -m "feat(ProductCard): badges envío gratis/oferta, categoría y MSI"
```

---

## Task 4: Verificación final y cleanup

**Files:**
- Review: `src/views/ProductsView.vue`, `src/components/ProductFilters.vue`, `src/components/ProductCard.vue`

- [ ] **Step 1: Checklist visual en navegador (desktop 1440px)**

Verificar en `http://localhost:5173/productos`:
- [ ] Sidebar fijo a la izquierda, sticky al hacer scroll
- [ ] Checkboxes de categoría con conteo correcto por categoría
- [ ] Rangos de precio predefinidos funcionan (click → productos filtrados)
- [ ] Precio personalizado con "Aplicar" funciona
- [ ] Sort dropdown reordena el grid sin recargar
- [ ] Tags de filtros activos aparecen en sort bar con botón X funcional
- [ ] Contador de resultados actualiza en tiempo real
- [ ] Paginación correcta (12 items/página)

- [ ] **Step 2: Checklist visual en navegador (móvil 375px)**

- [ ] Sidebar no visible — solo botón "Filtros" en sort bar
- [ ] Click en "Filtros" abre drawer desde la izquierda con overlay oscuro
- [ ] Click en overlay cierra el drawer
- [ ] "Ver resultados" dentro del drawer lo cierra
- [ ] Badge numérico en botón Filtros muestra cantidad de filtros activos
- [ ] Grid de 1 columna en 375px, 2 columnas en 640px

- [ ] **Step 3: Verificar prefers-reduced-motion**

En DevTools (F12) → Rendering → Emulate CSS media `prefers-reduced-motion: reduce`. Confirmar que:
- Skeleton cards sin animación shimmer
- Transición de drawer sin animate

- [ ] **Step 4: Commit final**

```bash
git add src/views/ProductsView.vue src/components/ProductFilters.vue src/components/ProductCard.vue
git commit -m "feat: marketplace products view completo con sidebar, sort y cards mejoradas"
```

---

## Self-Review

### Spec coverage
| Requisito | Task |
|-----------|------|
| Vista grid tipo ML | Task 2 |
| Filtro por categorías | Task 1 |
| Filtro por precio con rangos | Task 1 |
| Sort de productos | Task 2 |
| Cards mejoradas | Task 3 |
| Móvil: drawer de filtros | Task 1 + Task 2 |
| Active filter tags | Task 2 |
| Conteo de resultados | Task 2 |
| Skeleton loading | Task 2 |

### Tipos consistentes
- `categories` prop: `Array<{ value: string, label: string, count?: number }>` — definido en Task 1, consumido en Task 2 como `categoriesWithCount`
- `product`: `{ id, name, price: number, category: string, img: string, images: [] }` — mismo shape en Task 2 (fetch) y Task 3 (ProductCard)
- Emits de ProductFilters: `update:searchTerm`, `update:selectedCategory`, `update:minPrice`, `update:maxPrice`, `apply-filters`, `clear-filters`, `close` — definidos en Task 1, bindeados en Task 2

### Placeholders
Ninguno encontrado. Todos los steps tienen código completo.
