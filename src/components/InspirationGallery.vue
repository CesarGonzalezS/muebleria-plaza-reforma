¯»¿<template>
  <section class="gallery-section py-5">
    <div class="container">
      <h3 class="mb-4 text-center gallery-title">
        <i class="fas fa-images"></i> Ambientes que inspiran
      </h3>
      <!-- Desktop: grid, Mobile: swiper -->
      <div v-if="!isMobile" class="gallery-grid">
        <div class="gallery-item" v-for="(img, i) in galleryImages" :key="i">
          <img :src="img" :alt="'Ambiente ' + (i + 1)" @click="openModal(img)" />
        </div>
      </div>
      <swiper
        v-else
        class="gallery-swiper"
        :slides-per-view="1"
        :space-between="14"
        :pagination="{ clickable: true }"
      >
        <swiper-slide v-for="(img, i) in galleryImages" :key="i">
          <div class="gallery-item">
            <img :src="img" :alt="'Ambiente ' + (i + 1)" @click="openModal(img)" />
          </div>
        </swiper-slide>
      </swiper>
      <!-- Modal Imagen -->
      <div v-if="showModal" class="modal-backdrop" @click="closeModal">
        <div class="modal-img-content" @click.stop>
          <img
            :src="modalImg"
            :alt="'Imagen seleccionada'"
            class="modal-img"
            @wheel.prevent="zoom"
            @touchmove="onPinch"
            ref="modalImgRef"
          />
          <button class="close-btn" @click="closeModal"><i class="fas fa-times"></i></button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";

const props = defineProps({
  images: { type: Array, default: () => [] }
});
const galleryImages = computed(() => props.images);

// Detectar mobile
const isMobile = ref(false);
onMounted(() => {
  isMobile.value = window.innerWidth < 800;
  window.addEventListener("resize", handleResize);
});
onUnmounted(() => window.removeEventListener("resize", handleResize));
function handleResize() {
  isMobile.value = window.innerWidth < 800;
}

// Modal de imagen
const showModal = ref(false);
const modalImg = ref("");
const modalImgRef = ref(null);

function openModal(img) {
  modalImg.value = img;
  showModal.value = true;
}
function closeModal() {
  showModal.value = false;
  modalImg.value = "";
  if (modalImgRef.value) {
    modalImgRef.value.style.transform = "";
    scale.value = 1;
  }
  lastDist = 0; // Reiniciar la distancia para evitar problemas con el gesto de "pinch"
}

// Zoom con la rueda del mouse o "pinch" móvil
const scale = ref(1);
function zoom(e) {
  e.preventDefault();
  const zoomStep = 0.1;
  const maxScale = 3;
  const minScale = 1;

  // Ajustar el nivel de zoom
  scale.value += e.deltaY < 0 ? zoomStep : -zoomStep;
  scale.value = Math.max(minScale, Math.min(maxScale, scale.value));

  // Aplicar transformación a la imagen
  if (modalImgRef.value) {
    modalImgRef.value.style.transform = `scale(${scale.value})`;
  }
}

// Mejorar el manejo de "pinch" en dispositivos táctiles
let lastDist = 0;
function onPinch(e) {
  if (e.touches && e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (lastDist !== 0) {
      let diff = dist - lastDist;
      scale.value += diff / 200;
      scale.value = Math.max(1, Math.min(3, scale.value));
      if (modalImgRef.value) {
        modalImgRef.value.style.transform = `scale(${scale.value})`;
      }
    }
    lastDist = dist;
  } else {
    lastDist = 0; // Reiniciar si no hay dos puntos de contacto
  }
}

// Reiniciar la distancia al finalizar el "pinch"
function resetPinch() {
  lastDist = 0;
}

// Asegurar que el evento de "touchend" reinicie el estado del "pinch"
window.addEventListener("touchend", resetPinch);
</script>

<style scoped>
/* ... tus estilos previos ... */

/* Carrousel Swiper (mobile) */
.gallery-swiper {
  width: 98vw;
  margin: 0 auto;
  padding: 0 0.2rem;
}
.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
}

/* Modal Imagen */
.modal-backdrop {
  position: fixed;
  z-index: 9999;
  inset: 0;
  background: rgba(30, 6, 30, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-img-content {
  position: relative;
  max-width: 92vw;
  max-height: 88vh;
  background: var(--white);
  border-radius: 18px;
  box-shadow: 0 4px 38px #8607346e;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.8em;
  overflow: hidden;
}
.modal-img {
  max-width: 86vw;
  max-height: 74vh;
  border-radius: 13px;
  transition: transform 0.23s;
  object-fit: contain;
}
.close-btn {
  position: absolute;
  top: 8px; right: 8px;
  background: transparent;
  color: #a81552;
  border: none;
  border-radius: 50%;
  width: 34px;
  height: 34px;
  font-size: 1.5rem;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  box-shadow: none;
  transition: color 0.16s;
}
.close-btn:hover { color: #860734; background: transparent; }
</style>
