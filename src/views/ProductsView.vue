<template>
  <div class="products-view">
    <Navbar />
    <Header />

    <!-- Hero -->
    <section class="products-hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">
          <i class="bi bi-shop"></i>
          Catálogo de Productos
        </h1>
        <p class="hero-subtitle">Descubre nuestros muebles de calidad excepcional</p>
      </div>
    </section>

    <main class="products-page">
      <div class="container">

        <!-- Botón filtros mobile -->
        <button
          class="filters-toggle-btn"
          @click="filtersOpen = true"
          type="button"
          aria-label="Abrir filtros"
        >
          <i class="bi bi-funnel-fill"></i>
          Filtros
          <span v-if="activeFiltersCount > 0" class="filters-badge">{{ activeFiltersCount }}</span>
        </button>

        <!-- Layout sidebar + contenido -->
        <div class="catalog-layout">

          <!-- Overlay mobile -->
          <div
            class="filters-overlay"
            :class="{ 'filters-overlay--visible': filtersOpen }"
            @click="filtersOpen = false"
            aria-hidden="true"
          ></div>

          <!-- Sidebar filtros -->
          <ProductFilters
            :searchTerm="searchTerm"
            :selectedCategory="selectedCategory"
            :minPrice="minPrice"
            :maxPrice="maxPrice"
            :categories="categories"
            :isOpen="filtersOpen"
            @update:searchTerm="value => searchTerm = value"
            @update:selectedCategory="value => selectedCategory = value"
            @update:minPrice="value => minPrice = value"
            @update:maxPrice="value => maxPrice = value"
            @apply-filters="applyFilters"
            @clear-filters="clearFilters"
            @close="filtersOpen = false"
          />

          <!-- Contenido principal -->
          <div class="catalog-content">

            <!-- Skeleton loading -->
            <div v-if="loadingProducts" class="skeleton-grid">
              <div v-for="n in 12" :key="n" class="skeleton-card">
                <div class="skeleton-img"></div>
                <div class="skeleton-info">
                  <div class="skeleton-tag"></div>
                  <div class="skeleton-title"></div>
                  <div class="skeleton-title skeleton-title--short"></div>
                  <div class="skeleton-footer">
                    <div class="skeleton-price"></div>
                    <div class="skeleton-btn"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Barra resultados + ordenamiento -->
            <div v-if="!loadingProducts" class="results-bar">
              <div class="results-left">
                <span class="results-count">
                  <strong>{{ filteredProducts.length }}</strong>
                  {{ filteredProducts.length === 1 ? 'producto' : 'productos' }}
                </span>
                <div class="active-tags" v-if="activeFiltersCount > 0">
                  <span v-if="searchTerm" class="filter-tag">
                    <i class="bi bi-search"></i> {{ searchTerm }}
                    <button @click="searchTerm = ''; applyFilters()" class="tag-remove" aria-label="Quitar búsqueda">
                      <i class="bi bi-x"></i>
                    </button>
                  </span>
                  <span v-if="selectedCategory" class="filter-tag">
                    <i class="bi bi-tag"></i> {{ selectedCategory }}
                    <button @click="selectedCategory = ''; applyFilters()" class="tag-remove" aria-label="Quitar categoría">
                      <i class="bi bi-x"></i>
                    </button>
                  </span>
                  <span v-if="minPrice !== '' || maxPrice !== ''" class="filter-tag">
                    <i class="bi bi-currency-dollar"></i>
                    {{ minPrice !== '' ? '$' + Number(minPrice).toLocaleString('es-MX') : '0' }}
                    –
                    {{ maxPrice !== '' ? '$' + Number(maxPrice).toLocaleString('es-MX') : '∞' }}
                    <button @click="minPrice = ''; maxPrice = ''; applyFilters()" class="tag-remove" aria-label="Quitar rango precio">
                      <i class="bi bi-x"></i>
                    </button>
                  </span>
                </div>
              </div>
              <div class="results-right">
                <label for="sort-select" class="sort-label">Ordenar:</label>
                <select id="sort-select" v-model="sortBy" class="sort-select">
                  <option value="default">Destacados</option>
                  <option value="price-asc">Precio: menor a mayor</option>
                  <option value="price-desc">Precio: mayor a menor</option>
                  <option value="name-asc">Nombre A–Z</option>
                  <option value="name-desc">Nombre Z–A</option>
                </select>
              </div>
            </div>

            <!-- Grid productos -->
            <div v-if="!loadingProducts && sortedProducts.length > 0" class="products-section">
              <div class="gallery-grid">
                <article
                  v-for="product in paginatedSortedProducts"
                  :key="product.id"
                  class="product-card"
                  @click="goToProduct(product.id)"
                >
                  <!-- Badge stock bajo -->
                  <div v-if="product.stock !== null && product.stock <= product.minStock && product.stock > 0" class="product-badge product-badge--stock">
                    <i class="bi bi-exclamation-circle"></i>
                    Últimas unidades
                  </div>
                  <div v-else-if="product.stock === 0" class="product-badge product-badge--out">
                    <i class="bi bi-x-circle"></i>
                    Agotado
                  </div>

                  <div class="product-img-wrap">
                    <img
                      :src="product.img || '/assets/img/products/default.jpg'"
                      :alt="product.name"
                      class="product-img"
                      loading="lazy"
                    />
                    <div class="img-overlay">
                      <i class="bi bi-eye"></i>
                      <span>Ver detalles</span>
                    </div>
                  </div>

                  <div class="product-info">
                    <div class="product-meta">
                      <span v-if="product.category" class="product-category-tag">{{ product.category }}</span>
                      <span v-if="product.brand" class="product-brand">{{ product.brand }}</span>
                    </div>
                    <h3 class="product-name">{{ product.name }}</h3>
                    <div class="product-footer">
                      <span class="product-price">
                        ${{ product.price.toLocaleString('es-MX') }}
                      </span>
                      <button class="product-btn" type="button" @click.stop="goToProduct(product.id)" aria-label="Ver detalle">
                        <i class="bi bi-arrow-right-circle"></i>
                      </button>
                    </div>
                  </div>
                </article>
              </div>

              <!-- Paginación -->
              <nav class="pagination" v-if="totalPages > 1" aria-label="Navegación de productos">
                <button
                  class="page-btn nav-btn"
                  @click="goToPage(currentPage - 1)"
                  :disabled="currentPage === 1"
                  aria-label="Página anterior"
                >
                  <i class="bi bi-chevron-left"></i>
                </button>
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  :class="['page-btn', { active: page === currentPage }]"
                  @click="goToPage(page)"
                  :aria-label="`Ir a página ${page}`"
                  :aria-current="page === currentPage ? 'page' : null"
                >
                  {{ page }}
                </button>
                <button
                  class="page-btn nav-btn"
                  @click="goToPage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  aria-label="Página siguiente"
                >
                  <i class="bi bi-chevron-right"></i>
                </button>
              </nav>
            </div>

            <!-- Sin resultados: catálogo vacío -->
            <div v-if="!loadingProducts && products.length === 0" class="empty-state">
              <div class="empty-state__icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <h3 class="empty-state__title">Catálogo en preparación</h3>
              <p class="empty-state__desc">Pronto tendremos productos disponibles para ti.</p>
            </div>

            <!-- Sin resultados: filtros sin match -->
            <div v-else-if="!loadingProducts && sortedProducts.length === 0 && products.length > 0" class="empty-state empty-state--filtered">
              <div class="empty-state__icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  <line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
              </div>
              <h3 class="empty-state__title">Sin resultados para estos filtros</h3>
              <p class="empty-state__desc">
                No encontramos muebles con
                <template v-if="searchTerm"> "<strong>{{ searchTerm }}</strong>"</template>
                <template v-if="selectedCategory"> en <strong>{{ selectedCategory }}</strong></template>
                <template v-if="minPrice || maxPrice"> en ese rango de precio</template>.
              </p>
              <div class="empty-state__actions">
                <button
                  v-if="searchTerm"
                  class="empty-action-btn"
                  @click="searchTerm = ''; applyFilters()"
                >
                  <i class="bi bi-x"></i> Quitar búsqueda
                </button>
                <button
                  v-if="selectedCategory"
                  class="empty-action-btn"
                  @click="selectedCategory = ''; applyFilters()"
                >
                  <i class="bi bi-x"></i> Quitar categoría
                </button>
                <button
                  v-if="minPrice !== '' || maxPrice !== ''"
                  class="empty-action-btn"
                  @click="minPrice = ''; maxPrice = ''; applyFilters()"
                >
                  <i class="bi bi-x"></i> Quitar precio
                </button>
                <button class="empty-action-btn empty-action-btn--primary" @click="clearFilters">
                  <i class="bi bi-arrow-clockwise"></i> Ver todos
                </button>
              </div>
            </div>

          </div><!-- /catalog-content -->
        </div><!-- /catalog-layout -->

      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import '@/components/assets/styles.css';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import Navbar from '../components/Navbar.vue';
import ProductFilters from '../components/ProductFilters.vue';
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import axiosConfig from '../config/AxiosConfig.js';
import { useRouter, useRoute } from 'vue-router';
import { getCategories } from '../services/categories';

const router = useRouter();
const route = useRoute();

const filtersOpen = ref(false);

watch(filtersOpen, open => {
  document.body.style.overflow = open ? 'hidden' : '';
});

onUnmounted(() => {
  document.body.style.overflow = '';
});

function goToProduct(id) {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  router.push({ name: 'ProductoDetalle', params: { id } });
}

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

const products = ref([]);
const loadingProducts = ref(false);
const categories = ref([]);

async function fetchCategories() {
  try {
    const categoriesData = await getCategories();
    categories.value = categoriesData.map(cat => ({
      value: cat.name.toLowerCase(),
      label: cat.name,
      description: cat.description || '',
      id: cat.id
    }));
  } catch {
    categories.value = [];
  }
}

async function fetchProducts() {
  loadingProducts.value = true;
  try {
    const res = await axiosConfig.doGet('/api/products');
    products.value = res.data.map(item => {
      let mainImage = '/assets/img/products/default.jpg';
      if (item.images && Array.isArray(item.images) && item.images.length > 0) {
        const firstImage = item.images[0];
        mainImage = typeof firstImage === 'string' ? firstImage : (firstImage.img_base64 || firstImage.url || mainImage);
      } else if (item.img_base64) {
        mainImage = item.img_base64;
      }
      return {
        id: item.id,
        name: item.name,
        price: item.price,
        brand: item.brand || '',
        category: item.category_name || '',
        stock: item.stock ?? null,
        minStock: item.min_stock ?? item.minStock ?? 0,
        img: mainImage,
        images: item.images || []
      };
    });
  } catch {
    products.value = [];
  } finally {
    loadingProducts.value = false;
  }
}

onMounted(() => {
  fetchProducts();
  fetchCategories();
  if (route.params.categoria) {
    selectedCategory.value = route.params.categoria;
  }
  if (route.query.buscar) {
    searchTerm.value = route.query.buscar;
  }
});

watch(() => route.query.buscar, newVal => {
  if (newVal) {
    searchTerm.value = newVal;
    selectedCategory.value = '';
    currentPage.value = 1;
  }
});

watch(() => route.params.categoria, newVal => {
  if (newVal) selectedCategory.value = newVal;
});

const selectedCategory = ref('');
const searchTerm = ref('');
const minPrice = ref('');
const maxPrice = ref('');
const sortBy = ref('default');
const currentPage = ref(1);
const itemsPerPage = 12;

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.value.toLowerCase());
    const matchesCategory = !selectedCategory.value ||
      String(product.category).toLowerCase() === String(selectedCategory.value).toLowerCase();
    const matchesMinPrice = !minPrice.value || product.price >= Number(minPrice.value);
    const matchesMaxPrice = !maxPrice.value || product.price <= Number(maxPrice.value);
    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
  });
});

const sortedProducts = computed(() => {
  const list = [...filteredProducts.value];
  switch (sortBy.value) {
    case 'price-asc':  return list.sort((a, b) => a.price - b.price);
    case 'price-desc': return list.sort((a, b) => b.price - a.price);
    case 'name-asc':   return list.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    case 'name-desc':  return list.sort((a, b) => b.name.localeCompare(a.name, 'es'));
    default:           return list;
  }
});

const paginatedSortedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return sortedProducts.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(sortedProducts.value.length / itemsPerPage));

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);
  if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
});

const activeFiltersCount = computed(() => {
  let count = 0;
  if (searchTerm.value) count++;
  if (selectedCategory.value) count++;
  if (minPrice.value !== '' || maxPrice.value !== '') count++;
  return count;
});

function clearFilters() {
  selectedCategory.value = '';
  searchTerm.value = '';
  minPrice.value = '';
  maxPrice.value = '';
  currentPage.value = 1;
}

function applyFilters() {
  currentPage.value = 1;
}
</script>

<style scoped>
.products-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #fdfbff 0%, #f8f4fc 100%);
}

/* Hero */
.products-hero {
  position: relative;
  background: linear-gradient(135deg, #860734 0%, #a91d4d 100%);
  padding: 4rem 1.5rem 3rem;
  text-align: center;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.1;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  color: #ffffff;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
}

.hero-title i { font-size: 0.85em; }

.hero-subtitle {
  color: rgba(255, 255, 255, 0.95);
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  font-weight: 500;
  margin: 0;
}

/* Main */
.products-page {
  padding: 2rem 0 4rem;
  margin-top: -2rem;
  position: relative;
  z-index: 2;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Botón filtros mobile — oculto en desktop */
.filters-toggle-btn {
  display: none;
  align-items: center;
  gap: 0.5rem;
  background: #860734;
  color: #fff;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: background 0.2s;
}

.filters-toggle-btn:hover { background: #a91d4d; }

.filters-badge {
  background: #ffd700;
  color: #860734;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.75rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Overlay mobile */
.filters-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 150;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.filters-overlay--visible {
  opacity: 1;
  pointer-events: auto;
}

/* Layout principal — sidebar + contenido */
.catalog-layout {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.catalog-content {
  flex: 1;
  min-width: 0;
}

/* Skeleton loading */
@keyframes shimmer {
  0%   { background-position: -600px 0; }
  100% { background-position: 600px 0; }
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.75rem;
  margin-bottom: 3rem;
}

.skeleton-card {
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(134, 7, 52, 0.05);
  box-shadow: 0 4px 20px rgba(134, 7, 52, 0.04);
}

.skeleton-img {
  width: 100%;
  height: 240px;
  background: linear-gradient(90deg, #f0e8f0 25%, #faf4fa 50%, #f0e8f0 75%);
  background-size: 600px 100%;
  animation: shimmer 1.4s infinite linear;
}

.skeleton-info {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.skeleton-tag {
  width: 80px;
  height: 22px;
  border-radius: 12px;
  background: linear-gradient(90deg, #f0e8f0 25%, #faf4fa 50%, #f0e8f0 75%);
  background-size: 600px 100%;
  animation: shimmer 1.4s infinite linear;
}

.skeleton-title {
  height: 16px;
  border-radius: 8px;
  background: linear-gradient(90deg, #f0e8f0 25%, #faf4fa 50%, #f0e8f0 75%);
  background-size: 600px 100%;
  animation: shimmer 1.4s infinite linear;
}

.skeleton-title--short { width: 65%; }

.skeleton-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.25rem;
}

.skeleton-price {
  width: 100px;
  height: 28px;
  border-radius: 8px;
  background: linear-gradient(90deg, #f0e8f0 25%, #faf4fa 50%, #f0e8f0 75%);
  background-size: 600px 100%;
  animation: shimmer 1.4s infinite linear;
}

.skeleton-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(90deg, #f0e8f0 25%, #faf4fa 50%, #f0e8f0 75%);
  background-size: 600px 100%;
  animation: shimmer 1.4s infinite linear;
}

.skeleton-card:nth-child(2) .skeleton-img,
.skeleton-card:nth-child(2) .skeleton-tag,
.skeleton-card:nth-child(2) .skeleton-title,
.skeleton-card:nth-child(2) .skeleton-price,
.skeleton-card:nth-child(2) .skeleton-btn { animation-delay: 0.1s; }

.skeleton-card:nth-child(3) .skeleton-img,
.skeleton-card:nth-child(3) .skeleton-tag,
.skeleton-card:nth-child(3) .skeleton-title,
.skeleton-card:nth-child(3) .skeleton-price,
.skeleton-card:nth-child(3) .skeleton-btn { animation-delay: 0.2s; }

.skeleton-card:nth-child(4) .skeleton-img,
.skeleton-card:nth-child(4) .skeleton-tag,
.skeleton-card:nth-child(4) .skeleton-title,
.skeleton-card:nth-child(4) .skeleton-price,
.skeleton-card:nth-child(4) .skeleton-btn { animation-delay: 0.3s; }

.skeleton-card:nth-child(5) .skeleton-img,
.skeleton-card:nth-child(5) .skeleton-tag,
.skeleton-card:nth-child(5) .skeleton-title,
.skeleton-card:nth-child(5) .skeleton-price,
.skeleton-card:nth-child(5) .skeleton-btn { animation-delay: 0.15s; }

.skeleton-card:nth-child(6) .skeleton-img,
.skeleton-card:nth-child(6) .skeleton-tag,
.skeleton-card:nth-child(6) .skeleton-title,
.skeleton-card:nth-child(6) .skeleton-price,
.skeleton-card:nth-child(6) .skeleton-btn { animation-delay: 0.25s; }

/* Grid */
.products-section { animation: fadeIn 0.5s ease; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.75rem;
  margin-bottom: 3rem;
}

.product-card {
  background: var(--white);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(134, 7, 52, 0.06), 0 2px 8px rgba(134, 7, 52, 0.03);
  border: 1px solid rgba(134, 7, 52, 0.05);
  position: relative;
}

.product-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 4px;
  background: linear-gradient(90deg, #860734 0%, #ffd700 100%);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 50px rgba(134, 7, 52, 0.15), 0 8px 24px rgba(255, 215, 0, 0.1);
  border-color: rgba(134, 7, 52, 0.12);
}

.product-card:hover::before { transform: scaleX(1); }

.product-badge {
  position: absolute;
  top: 1rem; left: 1rem;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.product-badge--stock {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  color: #fff;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.35);
}

.product-badge--out {
  background: rgba(30, 30, 30, 0.75);
  color: #fff;
  backdrop-filter: blur(4px);
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}

.product-brand {
  font-size: 0.72rem;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.product-img-wrap {
  position: relative;
  width: 100%;
  height: 240px;
  background: linear-gradient(135deg, #f4e8f4 0%, #e8d8e8 100%);
  overflow: hidden;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:hover .product-img { transform: scale(1.1); }

.img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(134, 7, 52, 0.85) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 600;
}

.img-overlay i { font-size: 1.75rem; }
.product-card:hover .img-overlay { opacity: 1; }

.product-info { padding: 1.25rem; }

.product-category-tag {
  display: inline-flex;
  align-items: center;
  background: #f0e8f0;
  color: #860734;
  padding: 0.28rem 0.65rem;
  border-radius: 12px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.product-name {
  color: #3a223a;
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.4;
  margin: 0 0 0.85rem;
  min-height: 2.6rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.product-price {
  color: #860734;
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: -0.5px;
}

.product-btn {
  background: linear-gradient(135deg, #860734 0%, #a91d4d 100%);
  color: #ffffff;
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(134, 7, 52, 0.3);
  flex-shrink: 0;
}

.product-btn:hover {
  transform: scale(1.1) rotate(45deg);
  box-shadow: 0 6px 20px rgba(134, 7, 52, 0.4);
}

/* Empty states */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  animation: fadeIn 0.4s ease;
}

.empty-state__icon {
  width: 110px;
  height: 110px;
  margin: 0 auto 1.75rem;
  background: linear-gradient(135deg, #f0e8f0 0%, #e8d8e8 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #860734;
  opacity: 0.45;
}

.empty-state__title {
  color: #860734;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.75rem;
}

.empty-state__desc {
  color: #4a3440;
  font-size: 1rem;
  margin: 0 0 1.75rem;
  opacity: 0.75;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.empty-state__desc strong {
  color: #860734;
  font-weight: 700;
}

.empty-state__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  justify-content: center;
}

.empty-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1rem;
  border-radius: 20px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  border: 2px solid rgba(134, 7, 52, 0.25);
  background: transparent;
  color: #860734;
  transition: all 0.2s ease;
}

.empty-action-btn:hover {
  background: rgba(134, 7, 52, 0.06);
  border-color: #860734;
}

.empty-action-btn--primary {
  background: linear-gradient(135deg, #860734 0%, #a91d4d 100%);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 4px 14px rgba(134, 7, 52, 0.28);
}

.empty-action-btn--primary:hover {
  background: linear-gradient(135deg, #a91d4d 0%, #860734 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(134, 7, 52, 0.38);
}

/* Paginación */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.page-btn {
  min-width: 44px;
  height: 44px;
  padding: 0;
  border: 2px solid #e0d0e0;
  background: var(--white);
  color: #860734;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  background: #f0e8f0;
  border-color: #860734;
  transform: translateY(-2px);
}

.page-btn.active {
  background: linear-gradient(135deg, #860734 0%, #a91d4d 100%);
  color: #ffffff;
  border-color: #860734;
  box-shadow: 0 4px 12px rgba(134, 7, 52, 0.3);
}

.page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.nav-btn {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  border-color: #ffd700;
  color: #860734;
  font-size: 1.25rem;
}

.nav-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #ffed4e 0%, #ffd700 100%);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}

/* Results bar */
.results-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(134, 7, 52, 0.08);
}

.results-left {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.results-count {
  color: #4a3440;
  font-size: 0.95rem;
  font-weight: 500;
}

.results-count strong {
  color: #860734;
  font-size: 1.1rem;
  font-weight: 700;
}

.active-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: rgba(134, 7, 52, 0.08);
  color: #860734;
  padding: 0.3rem 0.65rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.filter-tag i { font-size: 0.75rem; }

.tag-remove {
  background: none;
  border: none;
  color: #860734;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  opacity: 0.6;
  transition: opacity 0.15s;
}

.tag-remove:hover { opacity: 1; }

.results-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.sort-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #4a3440;
  white-space: nowrap;
}

.sort-select {
  padding: 0.5rem 0.85rem;
  border: 2px solid #e0d0e0;
  border-radius: 10px;
  font-size: 0.88rem;
  color: #3a223a;
  background: #fff;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
}

.sort-select:focus { border-color: #860734; }

/* Responsive */
@media (max-width: 900px) {
  .filters-toggle-btn {
    display: flex;
  }

  .filters-overlay {
    display: block;
  }

  .catalog-layout {
    display: block;
  }
}

@media (max-width: 768px) {
  .products-hero { padding: 3rem 1rem 2.5rem; }
  .hero-title { flex-direction: column; gap: 0.5rem; }
  .products-page { padding: 1.5rem 0 3rem; }
  .container { padding: 0 1rem; }

  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }

  .product-img-wrap { height: 200px; }
  .product-name { font-size: 0.95rem; }
  .product-price { font-size: 1.35rem; }
  .page-btn { min-width: 40px; height: 40px; }
}

@media (max-width: 480px) {
  .products-page { padding: 1rem 0 2rem; }
  .container { padding: 0 0.75rem; }

  .gallery-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .product-img-wrap { height: 220px; }
  .page-btn { min-width: 36px; height: 36px; font-size: 0.9rem; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
