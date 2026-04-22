<template>
  <div>
    <Navbar />
    <div v-scroll-animate>
      <Header />
    </div>
    <div v-scroll-animate>
      <ImageCarousel :images="carouselImages" />
    </div>
    <div v-scroll-animate>
      <Gallery :images="galleryImages" />
    </div>
    <div v-scroll-animate>
      <AdvantagesSection />
    </div>
    <div v-scroll-animate>
      <MisionVision />
    </div>

    <!-- Featured Products -->
    <section class="featured-section" v-scroll-animate>
      <div class="featured-container">
        <div class="featured-header">
          <div class="featured-header__left">
            <span class="featured-eyebrow">Nuestra selección</span>
            <h2 class="featured-title">Productos Destacados</h2>
          </div>
          <router-link :to="{ name: 'ProductosList' }" class="featured-see-all">
            Ver todos
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </router-link>
        </div>

        <!-- Skeleton loader -->
        <div v-if="loadingFeatured" class="product-skeleton-grid" aria-busy="true" aria-label="Cargando productos">
          <div v-for="n in 6" :key="n" class="product-skeleton">
            <div class="skeleton-img"></div>
            <div class="skeleton-body">
              <div class="skeleton-line skeleton-line--long"></div>
              <div class="skeleton-line skeleton-line--short"></div>
            </div>
          </div>
        </div>

        <ProductGallery v-else :products="featuredProducts" />
      </div>
    </section>

    <div v-scroll-animate>
      <InspirationGallery :images="galleryImages" />
    </div>
    <div v-scroll-animate>
      <CtaSection />
    </div>
    <div v-scroll-animate>
      <BenefitsSection />
    </div>
    <div v-scroll-animate>
      <MapSection />
    </div>
    <div v-scroll-animate>
      <Testimonials :testimonials="testimonialsList" />
    </div>
    <div v-scroll-animate>
      <Footer />
    </div>

    <a
      :href="whatsAppUrl"
      class="whatsapp-float"
      target="_blank"
      rel="noopener"
      aria-label="Chatea con nosotros por WhatsApp"
    >
      <i class="bi bi-whatsapp"></i>
      <span class="whatsapp-tooltip">¡Chatea con nosotros!</span>
    </a>
  </div>
</template>

<script setup>
import BenefitsSection from '@/components/BenefitsSection.vue';
import Header from '../components/Header.vue';
import MisionVision from '@/components/MisionVision.vue';
import Footer from '../components/Footer.vue';
import ProductGallery from '../components/ProductGallery.vue';
import Navbar from '../components/Navbar.vue';
import AdvantagesSection from '../components/AdvantagesSection.vue';
import ImageCarousel from '../components/ImageCarousel.vue';
import InspirationGallery from '../components/InspirationGallery.vue';
import Testimonials from '../components/Testimonials.vue';
import CtaSection from '../components/CtaSection.vue';
import MapSection from '../components/MapSection.vue';
import { ref, onMounted } from 'vue';
import { getFurniture } from '../services/furniture.js';
import { homeSettingsService } from '../services/homeSettings.js';
import Gallery from "@/components/assets/Gallery.vue";

const DEFAULT_BANNERS = [
  '/assets/img/banner1.jpg',
  '/assets/img/banner2.jpg',
  '/assets/img/banner3.jpg'
];
const DEFAULT_GALLERY = [
  '/assets/img/inspiracion1.jpg',
  '/assets/img/inspiracion2.jpg',
  '/assets/img/inspiracion3.jpg'
];
const DEFAULT_TESTIMONIALS = [
  { name: 'Laura Gómez', text: 'Excelente atención y muebles de calidad. Recomiendo mucho la tienda.', img: '/assets/img/testimonios/laura.jpg' },
  { name: 'Pedro Martínez', text: 'Me encantó la variedad y el servicio postventa, ¡gracias!', img: '/assets/img/testimonios/pedro.jpg' }
];

const carouselImages = ref(DEFAULT_BANNERS);
const galleryImages = ref(DEFAULT_GALLERY);
const testimonialsList = ref(DEFAULT_TESTIMONIALS);

async function fetchHomeSettings() {
  try {
    const res = await homeSettingsService.getSettings();
    const data = res.data?.data || res.data || {};
    if (data.banners?.length) carouselImages.value = data.banners;
    if (data.gallery?.length) galleryImages.value = data.gallery;
    if (data.testimonials?.length) testimonialsList.value = data.testimonials;
  } catch {
    // fallback to defaults silently
  }
}

const featuredProducts = ref([]);
const loadingFeatured = ref(false);

async function fetchFeaturedProducts() {
  loadingFeatured.value = true;
  try {
    const res = await getFurniture();
    const productsData = Array.isArray(res) ? res : (res.data || []);
    featuredProducts.value = productsData.slice(0, 6).map(item => {
      let mainImage = '/assets/img/products/default.jpg';

      // Usar imageUrl del backend (URL completa como: http://localhost:8080/uploads/images/...)
      if (item.imageUrl) {
        mainImage = item.imageUrl;
      } else if (item.images && Array.isArray(item.images) && item.images.length > 0) {
        const firstImage = item.images[0];
        mainImage = typeof firstImage === 'string' ? firstImage : (firstImage.img_base64 || firstImage.url || mainImage);
      } else if (item.img_base64) {
        mainImage = item.img_base64;
      }

      return {
        id: item.id,
        name: item.name,
        price: item.price,
        img: mainImage,
        images: item.images || []
      };
    });
  } catch (e) {
    featuredProducts.value = [];
  } finally {
    loadingFeatured.value = false;
  }
}

onMounted(() => {
  fetchHomeSettings();
  fetchFeaturedProducts();
});

const whatsAppUrl = "https://wa.me/7513960035?text=Hola,%20quiero%20informes%20sobre%20los%20productos.";
</script>

<style scoped>
/* ---- Featured section ---- */
.featured-section {
  padding: 5rem 0;
  background: linear-gradient(180deg, #faf7f4 0%, #f5f0f3 100%);
}

.featured-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.featured-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  gap: 1rem;
}

.featured-header__left {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.featured-eyebrow {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #860734;
}

.featured-title {
  font-size: clamp(1.6rem, 3.5vw, 2.4rem);
  font-weight: 800;
  color: #141413;
  letter-spacing: -0.02em;
  line-height: 1.15;
  margin: 0;
  padding: 0;
}

.featured-see-all {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.92rem;
  font-weight: 700;
  color: #860734;
  text-decoration: none;
  padding: 0.55rem 1.2rem;
  border: 2px solid rgba(134, 7, 52, 0.25);
  border-radius: 50px;
  transition: all 0.22s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.featured-see-all:hover {
  background: #860734;
  color: #fff;
  border-color: #860734;
}

/* ---- Skeleton ---- */
.product-skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 2rem;
}

.product-skeleton {
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  border: 1px solid rgba(134, 7, 52, 0.06);
}

.skeleton-img {
  aspect-ratio: 4/3;
  background: linear-gradient(90deg, #f0e8ec 25%, #f8f2f5 50%, #f0e8ec 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

.skeleton-body {
  padding: 1rem 1.1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-line {
  height: 14px;
  border-radius: 6px;
  background: linear-gradient(90deg, #f0e8ec 25%, #f8f2f5 50%, #f0e8ec 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

.skeleton-line--long { width: 80%; }
.skeleton-line--short { width: 40%; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ---- WhatsApp float ---- */
.whatsapp-float {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  box-shadow: 0 6px 25px rgba(37, 211, 102, 0.4);
  z-index: 1000;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  text-decoration: none;
  cursor: pointer;
}

.whatsapp-float:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 35px rgba(37, 211, 102, 0.6);
}

.whatsapp-float:hover .whatsapp-tooltip {
  opacity: 1;
  transform: translateX(-10px);
  visibility: visible;
}

.whatsapp-tooltip {
  position: absolute;
  right: 70px;
  background: #1f2937;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  white-space: nowrap;
  font-size: 0.9rem;
  font-weight: 600;
  opacity: 0;
  transform: translateX(0);
  transition: all 0.25s ease;
  visibility: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.whatsapp-tooltip::after {
  content: '';
  position: absolute;
  right: -8px;
  top: 50%;
  transform: translateY(-50%);
  border: 8px solid transparent;
  border-left-color: #1f2937;
  border-right-width: 0;
}

/* ---- Responsive ---- */
@media (max-width: 768px) {
  .featured-section {
    padding: 3rem 0;
  }

  .featured-header {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 1.75rem;
  }

  .product-skeleton-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .whatsapp-float {
    width: 54px;
    height: 54px;
    bottom: 16px;
    right: 14px;
    font-size: 1.75rem;
  }
}

@media (max-width: 480px) {
  .featured-section {
    padding: 2.5rem 0;
  }

  .featured-container {
    padding: 0 0.75rem;
  }

  .product-skeleton-grid {
    grid-template-columns: 1fr;
  }

  .whatsapp-float {
    width: 50px;
    height: 50px;
    bottom: 14px;
    right: 12px;
    font-size: 1.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-img,
  .skeleton-line {
    animation: none;
    background: #f0e8ec;
  }
}
</style>
