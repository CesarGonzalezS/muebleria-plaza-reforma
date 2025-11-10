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

    <section class="featured-section" v-scroll-animate>
      <div class="container">
        <h2 class="featured-title">Productos Destacados</h2>
        <div v-if="loadingFeatured">Cargando productos...</div>
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
    <!-- Botón flotante de WhatsApp -->


      <!-- WhatsApp flotante mejorado -->
      <a
          :href="whatsAppUrl"
          class="whatsapp-float"
          target="_blank"
          aria-label="WhatsApp"
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
import axiosConfig from '../config/AxiosConfig.js';
import Gallery from "@/components/assets/Gallery.vue";



// Ejemplo de datos para los props
const carouselImages = [
  '/assets/img/banner1.jpg',
  '/assets/img/banner2.jpg',
  '/assets/img/banner3.jpg'
]



const galleryImages = [
  '/assets/img/inspiracion1.jpg',
  '/assets/img/inspiracion2.jpg',
  '/assets/img/inspiracion3.jpg'
]

const testimonialsList = [
  {
    name: 'Laura Gómez',
    text: 'Excelente atención y muebles de calidad. Recomiendo mucho la tienda.',
    img: '/assets/img/testimonios/laura.jpg'
  },
  {
    name: 'Pedro Martínez',
    text: 'Me encantó la variedad y el servicio postventa, ¡gracias!',
    img: '/assets/img/testimonios/pedro.jpg'
  }
]

const featuredProducts = ref([]);
const loadingFeatured = ref(false);

async function fetchFeaturedProducts() {
  loadingFeatured.value = true;
  try {
    const res = await axiosConfig.doGet('/furniture/');
    // Puedes filtrar aquí si quieres solo algunos destacados, por ahora muestra los primeros 6
    featuredProducts.value = res.data.slice(0, 6).map(item => {
      // Obtener la primera imagen del array o usar fallback
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
        img: mainImage,
        images: item.images || [] // Mantener el array completo para uso futuro
      };
    });
  } catch (e) {
    featuredProducts.value = [];
  } finally {
    loadingFeatured.value = false;
  }
}

onMounted(fetchFeaturedProducts);

const whatsAppUrl = "https://wa.me/7513960035?text=Hola,%20quiero%20informes%20sobre%20los%20productos.";
</script>

<style scoped>


/* WhatsApp flotante mejorado */
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
  transition: all 0.3s;
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
  border-radius: 8px;
  white-space: nowrap;
  font-size: 0.9rem;
  font-weight: 600;
  opacity: 0;
  transform: translateX(0);
  transition: all 0.3s;
  visibility: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.whatsapp-tooltip::after {
  content: '';
  position: absolute;
  right: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 8px 0 8px 8px;
  border-color: transparent transparent transparent #1f2937;
}




/* Responsive mejorado */
@media (max-width: 768px) {
  .featured-section {
    padding: 2rem 0;
  }

  .featured-title {
    font-size: 1.75rem;
    margin-bottom: 1.5rem;
  }

  .whatsapp-float {
    width: 54px;
    height: 54px;
    bottom: 16px;
    right: 14px;
  }

  .whatsapp-float img {
    width: 32px;
    height: 32px;
  }
}

@media (max-width: 480px) {
  .featured-section {
    padding: 1.5rem 0;
  }

  .featured-title {
    font-size: 1.5rem;
    margin-bottom: 1.25rem;
  }

  .container {
    padding: 0 0.75rem;
  }

  .whatsapp-float {
    width: 50px;
    height: 50px;
    bottom: 14px;
    right: 12px;
  }

  .whatsapp-float img {
    width: 28px;
    height: 28px;
  }
}
@keyframes waPop {
  0% { transform: scale(0.5) translateY(40px); opacity: 0;}
  100% { transform: scale(1) translateY(0); opacity: 1;}
}
</style>
