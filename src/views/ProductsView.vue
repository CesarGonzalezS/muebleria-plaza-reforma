<template>
  <div class="products-view">
    <Navbar />
    <Header />

    <!-- Hero Section -->
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
        <!-- Componente de filtros -->
        <ProductFilters
          :searchTerm="searchTerm"
          :selectedCategory="selectedCategory"
          :minPrice="minPrice"
          :maxPrice="maxPrice"
          :categories="categories"
          @update:searchTerm="value => searchTerm = value"
          @update:selectedCategory="value => selectedCategory = value"
          @update:minPrice="value => minPrice = value"
          @update:maxPrice="value => maxPrice = value"
          @apply-filters="applyFilters"
          @clear-filters="clearFilters"
        />

        <!-- Loading -->
        <div v-if="loadingProducts" class="loading-container">
          <div class="spinner-container">
            <div class="spinner"></div>
            <p>Cargando productos...</p>
          </div>
        </div>

        <!-- Grid de productos -->
        <div v-else-if="filteredProducts.length > 0" class="products-section">
          <div class="gallery-grid">
            <article
              v-for="product in paginatedProducts"
              :key="product.id"
              class="product-card"
              @click="goToProduct(product.id)"
            >
              <!-- Badge de oferta -->
              <div v-if="product.price < 5000" class="product-badge">
                <i class="bi bi-lightning-fill"></i>
                ¡Oferta!
              </div>

              <!-- Imagen -->
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

              <!-- Info -->
              <div class="product-info">
                <div class="product-category-tag">
                  {{ product.category }}
                </div>
                <h3 class="product-name">{{ product.name }}</h3>
                <div class="product-footer">
                  <span class="product-price">
                    ${{ product.price.toLocaleString('es-MX') }}
                  </span>
                  <button class="product-btn" type="button" @click.stop="goToProduct(product.id)">
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

        <!-- Sin resultados -->
        <div v-else class="no-products">
          <div class="no-products-icon">
            <i class="bi bi-inbox"></i>
          </div>
          <h3>No hay productos que coincidan</h3>
          <p>Intenta ajustar los filtros de búsqueda o explora todas las categorías</p>
          <button class="btn-primary" @click="clearFilters">
            <i class="bi bi-arrow-clockwise"></i>
            Ver todos los productos
          </button>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import '../components/assets/Styles.css';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import Navbar from '../components/Navbar.vue';
import ProductFilters from '../components/ProductFilters.vue';
import { ref, computed, onMounted, watch } from 'vue';
import axiosConfig from '../config/AxiosConfig.js';
import { useRouter, useRoute } from 'vue-router';
import { getCategories } from '../services/categories'; // Importamos el servicio de categorías

const router = useRouter();
const route = useRoute();

function goToProduct(id) {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  router.push({ name: 'ProductoDetalle', params: { id } });
}

const products = ref([]);
const loadingProducts = ref(false);
const categories = ref([]); // Ahora es reactivo para cargar desde la API
const loadingCategories = ref(false); // Estado de carga para categorías

function normalizeCategory(cat) {
  if (!cat && cat !== 0) return '';
  if (typeof cat === 'string') return cat;
  if (typeof cat === 'object') {
    return (cat.value || cat.slug || cat.name || cat.label || '') + '';
  }
  return String(cat);
}

async function fetchCategories() {
  loadingCategories.value = true;
  try {
    const categoriesData = await getCategories();
    categories.value = categoriesData.map(cat => ({
      value: cat.name.toLowerCase(),
      label: cat.name,
      description: cat.description || '',
      id: cat.id
    }));
  } catch (error) {
    categories.value = [];
  } finally {
    loadingCategories.value = false;
  }
}

async function fetchProducts() {
  loadingProducts.value = true;
  try {
    const res = await axiosConfig.doGet('/furniture/');

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
        category: item.category_name || '',
        img: mainImage,
        images: item.images || []
      };
    });

  } catch (e) {
    products.value = [];
  } finally {
    loadingProducts.value = false;
  }
}

onMounted(() => {
  fetchProducts().then(() => {
  });
  fetchCategories().then(() => {
  });

  const categoria = ref(route.params.categoria);
  fetchProductosPorCategoria(categoria.value);

  if (route.query.buscar) {
    searchTerm.value = route.query.buscar;
  }
});

watch(() => route.query.buscar, (newSearchQuery) => {
  if (newSearchQuery) {
    searchTerm.value = newSearchQuery;
    selectedCategory.value = '';
    currentPage.value = 1;
  }
});

watch(() => route.params.categoria, (newCategoria) => {
  if (newCategoria) {
    fetchProductosPorCategoria(newCategoria);
  }
});

function fetchProductosPorCategoria(categoria) {
  if (categoria) {
    selectedCategory.value = categoria;
  }
}

function getCategoryLabel(category) {
  if (!category) return 'Sin categoría';
  if (typeof category === 'object' && category.label) {
    return category.label;
  }
  const categoryObj = categories.value.find(c =>
    c.value.toString() === category.toString()
  );
  if (!categoryObj) {
  }
  return categoryObj ? categoryObj.label : 'Categoría desconocida';
}

const selectedCategory = ref('');
const searchTerm = ref('');
const minPrice = ref('');
const maxPrice = ref('');

const currentPage = ref(1);
const itemsPerPage = 12;

const filteredProducts = computed(() => {
  const filtered = products.value.filter(product => {
    const productName = product.name.toLowerCase();
    const searchQuery = searchTerm.value.toLowerCase();
    const matchesSearch = productName.includes(searchQuery);
    const matchesCategory = !selectedCategory.value ||
      String(product.category).toLowerCase() === String(selectedCategory.value).toLowerCase();
    const matchesMinPrice = !minPrice.value || product.price >= Number(minPrice.value);
    const matchesMaxPrice = !maxPrice.value || product.price <= Number(maxPrice.value);

    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
  });

  return filtered;
});

// Agregar registros para depurar paginatedProducts
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredProducts.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage);
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const hasActiveFilters = computed(() => {
  return selectedCategory.value || searchTerm.value || minPrice.value || maxPrice.value;
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

/* Hero Section */
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

.hero-title i {
  font-size: 0.85em;
}

.hero-subtitle {
  color: rgba(255, 255, 255, 0.95);
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  font-weight: 500;
  margin: 0;
}

/* Main Content */
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

/* Filtros Mejorados */
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

/* Barra de resultados */
.results-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #f0e8f0;
}

.results-count {
  color: #4a3440;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.results-count strong {
  color: #860734;
  font-size: 1.25rem;
  font-weight: 700;
}

.active-filter-tag {
  background: linear-gradient(135deg, #860734 0%, #a91d4d 100%);
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.remove-tag {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #ffffff;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
  font-size: 0.875rem;
}

.remove-tag:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

/* Loading */
.loading-container {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner-container {
  text-align: center;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 5px solid #f0e8f0;
  border-top-color: #860734;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner-container p {
  color: #860734;
  font-size: 1.1rem;
  font-weight: 600;
}

/* Grid de Productos Mejorado */
.products-section {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.product-card {
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 4px 20px rgba(134, 7, 52, 0.06),
    0 2px 8px rgba(134, 7, 52, 0.03);
  border: 1px solid rgba(134, 7, 52, 0.05);
  position: relative;
}

.product-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #860734 0%, #ffd700 100%);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.product-card:hover {
  transform: translateY(-12px);
  box-shadow:
    0 20px 50px rgba(134, 7, 52, 0.15),
    0 8px 24px rgba(255, 215, 0, 0.1);
  border-color: rgba(134, 7, 52, 0.12);
}

.product-card:hover::before {
  transform: scaleX(1);
}

.product-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #860734;
  padding: 0.4rem 0.85rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  z-index: 3;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.product-img-wrap {
  position: relative;
  width: 100%;
  height: 280px;
  background: linear-gradient(135deg, #f4e8f4 0%, #e8d8e8 100%);
  overflow: hidden;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:hover .product-img {
  transform: scale(1.15);
}

.img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(134, 7, 52, 0.9) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.4s ease;
  color: #ffffff;
  font-size: 1.25rem;
  font-weight: 600;
}

.img-overlay i {
  font-size: 2rem;
}

.product-card:hover .img-overlay {
  opacity: 1;
}

.product-info {
  padding: 1.5rem;
}

.product-category-tag {
  display: inline-block;
  background: #f0e8f0;
  color: #860734;
  padding: 0.35rem 0.85rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.75rem;
}

.product-name {
  color: #3a223a;
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.4;
  margin: 0 0 1rem;
  min-height: 2.8rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.product-price {
  color: #860734;
  font-size: 1.75rem;
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
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(134, 7, 52, 0.3);
}

.product-btn:hover {
  transform: scale(1.1) rotate(45deg);
  box-shadow: 0 6px 20px rgba(134, 7, 52, 0.4);
}

/* Sin Productos */
.no-products {
  text-align: center;
  padding: 5rem 2rem;
  animation: fadeIn 0.5s ease;
}

.no-products-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  background: linear-gradient(135deg, #f0e8f0 0%, #e8d8e8 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: #860734;
  opacity: 0.3;
}

.no-products h3 {
  color: #860734;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 1rem;
}

.no-products p {
  color: #4a3440;
  font-size: 1.1rem;
  margin: 0 0 2rem;
  opacity: 0.7;
}

.btn-primary {
  background: linear-gradient(135deg, #860734 0%, #a91d4d 100%);
  color: #ffffff;
  border: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(134, 7, 52, 0.3);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(134, 7, 52, 0.4);
}

/* Paginación Mejorada */
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
  background: #ffffff;
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

.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

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

/* Responsive Design */
@media (max-width: 1024px) {
  .filters-content {
    grid-template-columns: 1fr 1fr;
  }

  .filter-item.search-filter {
    grid-column: 1 / -1;
  }

  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .products-hero {
    padding: 3rem 1rem 2.5rem;
  }

  .hero-title {
    flex-direction: column;
    gap: 0.5rem;
  }

  .products-page {
    padding: 1.5rem 0 3rem;
  }

  .container {
    padding: 0 1rem;
  }

  .filters-container {
    padding: 1.5rem;
    border-radius: 20px;
  }

  .filters-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .filters-header h2 {
    font-size: 1.25rem;
  }

  .filters-content {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .filter-item.search-filter {
    grid-column: 1;
  }

  .results-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }

  .product-img-wrap {
    height: 220px;
  }

  .product-info {
    padding: 1.25rem;
  }

  .product-name {
    font-size: 1rem;
    min-height: 2.5rem;
  }

  .product-price {
    font-size: 1.5rem;
  }

  .product-btn {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }

  .page-btn {
    min-width: 40px;
    height: 40px;
    font-size: 0.95rem;
  }
}

@media (max-width: 640px) {
  .products-hero {
    padding: 2.5rem 1rem 2rem;
  }

  .filters-container {
    padding: 1.25rem;
    margin-bottom: 2rem;
  }

  .price-inputs {
    flex-direction: column;
    gap: 0.75rem;
  }

  .price-separator {
    display: none;
  }

  .price-input {
    width: 100%;
  }

  .gallery-grid {
    gap: 1rem;
  }

  .product-card {
    border-radius: 16px;
  }

  .product-img-wrap {
    height: 200px;
  }

  .no-products {
    padding: 3rem 1rem;
  }

  .no-products-icon {
    width: 100px;
    height: 100px;
    font-size: 3rem;
  }

  .pagination {
    gap: 0.35rem;
  }

  .page-btn {
    min-width: 36px;
    height: 36px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .products-hero {
    padding: 2rem 0.75rem 1.75rem;
  }

  .products-page {
    padding: 1rem 0 2rem;
  }

  .container {
    padding: 0 0.75rem;
  }

  .filters-container {
    padding: 1rem;
    border-radius: 16px;
    margin-bottom: 1.5rem;
  }

  .filters-header h2 {
    font-size: 1.1rem;
  }

  .clear-all-btn {
    padding: 0.4rem 0.75rem;
    font-size: 0.85rem;
  }

  .filter-item label {
    font-size: 0.85rem;
  }

  .search-input,
  .filter-select,
  .price-input {
    padding: 0.75rem 0.85rem;
    font-size: 0.95rem;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .product-img-wrap {
    height: 240px;
  }

  .product-info {
    padding: 1rem;
  }

  .product-category-tag {
    font-size: 0.7rem;
    padding: 0.3rem 0.7rem;
  }

  .product-name {
    font-size: 0.95rem;
  }

  .product-price {
    font-size: 1.35rem;
  }

  .product-btn {
    width: 38px;
    height: 38px;
    font-size: 1rem;
  }

  .no-products h3 {
    font-size: 1.35rem;
  }

  .no-products p {
    font-size: 0.95rem;
  }

  .btn-primary {
    padding: 0.85rem 1.5rem;
    font-size: 0.95rem;
  }

  .page-btn {
    min-width: 32px;
    height: 32px;
    font-size: 0.85rem;
  }

  .spinner {
    width: 50px;
    height: 50px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
