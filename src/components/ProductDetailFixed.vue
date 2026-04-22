<template>
  <div class="product-detail">
    <Navbar />
    <Header />
    <main class="detail-page">
      <div class="container">
        <!-- Breadcrumb -->
        <nav class="breadcrumb">
          <router-link to="/">Inicio</router-link>
          <span class="separator">/</span>
          <router-link to="/productos">Productos</router-link>
          <span class="separator">/</span>
          <span class="current">{{ product.name }}</span>
        </nav>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="spinner">Cargando...</div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <i class="bi bi-exclamation-circle"></i>
          <h3>{{ error }}</h3>
          <router-link to="/productos" class="back-btn">
            <i class="bi bi-arrow-left"></i> Volver a productos
          </router-link>
        </div>

        <!-- Product Content -->
        <div v-else class="product-container">
          <!-- Imagen Principal -->
          <section class="gallery">
            <div class="main-image-wrap">
              <img
                v-if="currentImage"
                :src="currentImage"
                :alt="product.name"
                class="main-image"
              />
              <div v-else class="placeholder-image">
                <i class="bi bi-image"></i>
              </div>
            </div>
          </section>

          <!-- Detalles del Producto -->
          <aside class="details">
            <h1 class="title">{{ product.name }}</h1>

            <div class="price-section">
              <span class="price-label">Precio:</span>
              <p class="price">${{ (product.price || 0).toLocaleString('es-MX') }}</p>
            </div>

            <div class="stock-indicator" :class="{ 'in-stock': product.inStock, 'out-of-stock': !product.inStock }">
              <i :class="product.inStock ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill'"></i>
              <span>{{ product.inStock ? 'En stock' : 'Agotado' }}</span>
            </div>

            <p v-if="product.description" class="description">{{ product.description }}</p>

            <div class="features" v-if="product.features.length > 0">
              <h3>Características</h3>
              <ul>
                <li v-for="(f, idx) in product.features" :key="idx">
                  <i class="bi bi-check"></i> {{ f }}
                </li>
              </ul>
            </div>

            <div class="actions-section">
              <button class="cta-button primary" :disabled="!product.inStock" @click="reserveProduct">
                <i class="bi bi-whatsapp"></i> Apartar por WhatsApp
              </button>
              <button class="cta-button secondary" @click="contactUs">
                <i class="bi bi-telephone"></i> Llamar
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axiosConfig from '../config/AxiosConfig.js';
import Navbar from '@/components/Navbar.vue';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

const route = useRoute();

const product = ref({
  id: route.params.id,
  name: '',
  price: 0,
  inStock: true,
  description: '',
  imageUrl: '',
  features: []
});

const currentImage = ref('');
const loading = ref(true);
const error = ref('');

async function fetchProduct() {
  loading.value = true;
  error.value = '';
  try {
    const res = await axiosConfig.doGet(`/api/products/${route.params.id}`);
    const item = res.data;

    product.value = {
      id: item.id,
      name: item.name,
      price: item.price || 0,
      inStock: (item.stock || 0) > 0,
      description: item.description || '',
      imageUrl: item.imageUrl || '',
      stock: item.stock || 0,
      features: [
        item.brandName ? `Marca: ${item.brandName}` : null,
        `Stock: ${item.stock || 0} unidades`,
        item.categoryName ? `Categoría: ${item.categoryName}` : null
      ].filter(Boolean)
    };

    // Usar la URL de imagen del backend
    currentImage.value = item.imageUrl || '/assets/img/products/default.jpg';
  } catch (e) {
    error.value = 'No se pudo cargar el producto';
    console.error('Error:', e);
  } finally {
    loading.value = false;
  }
}

function reserveProduct() {
  const phone = '5217341532692';
  const msg = `Hola, quiero apartar: ${product.value.name} - $${(product.value.price || 0).toLocaleString('es-MX')}`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
}

function contactUs() {
  window.open('tel:+5217341532692');
}

onMounted(fetchProduct);
</script>

<style scoped>
.detail-page {
  background: linear-gradient(135deg, #faf7f4 0%, #f5f0f3 100%);
  padding: 2rem 0 4rem;
  min-height: 80vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.breadcrumb a {
  color: #860734;
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.product-container {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 3rem;
  align-items: flex-start;
}

.gallery {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.main-image-wrap {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(134, 7, 52, 0.12);
  background: white;
  height: 400px;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
}

.placeholder-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #f0e8ec;
  color: #860734;
  font-size: 4rem;
  opacity: 0.3;
}

.details {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(134, 7, 52, 0.12);
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.title {
  font-size: 2rem;
  color: #860734;
  margin: 0;
  font-weight: 800;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #faf7f4;
  border-radius: 12px;
}

.price-label {
  color: #666;
  font-size: 0.9rem;
  font-weight: 600;
}

.price {
  font-size: 2rem;
  color: #860734;
  font-weight: 900;
  margin: 0;
}

.stock-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  font-weight: 700;
  width: fit-content;
}

.stock-indicator.in-stock {
  background: rgba(37, 211, 102, 0.15);
  color: #059669;
}

.stock-indicator.out-of-stock {
  background: rgba(239, 68, 68, 0.15);
  color: #dc2626;
}

.description {
  color: #4a3440;
  line-height: 1.8;
  margin: 0;
}

.features {
  border-top: 1px solid #e0d0e0;
  padding-top: 1.5rem;
}

.features h3 {
  color: #860734;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}

.features ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.features li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #4a3440;
}

.features i {
  color: #25d366;
  font-weight: 700;
}

.actions-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.cta-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.cta-button.primary {
  background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
  color: white;
}

.cta-button.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(37, 211, 102, 0.3);
}

.cta-button.primary:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.cta-button.secondary {
  background: white;
  color: #860734;
  border: 2px solid #860734;
}

.cta-button.secondary:hover {
  background: #860734;
  color: white;
}

.error-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
}

.error-state i {
  font-size: 4rem;
  color: #860734;
  opacity: 0.5;
  margin-bottom: 1rem;
}

.error-state h3 {
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #860734;
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
}

.back-btn:hover {
  background: #6a0529;
}

/* Responsive */
@media (max-width: 768px) {
  .product-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .main-image-wrap {
    height: 300px;
  }

  .title {
    font-size: 1.5rem;
  }

  .price {
    font-size: 1.8rem;
  }
}
</style>
