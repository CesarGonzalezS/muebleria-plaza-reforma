<script setup>
import { ref, onMounted, onUnmounted } from "vue"
import { Swiper, SwiperSlide } from "swiper/vue"
import { Pagination, EffectCoverflow, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/effect-coverflow"

import img1 from "./img/inspiracion1.jpg"
import img2 from "./img/inspiracion2.jpg"
import img3 from "./img/inspiracion3.jpg"

const galleryImages = [img1, img2, img3]

// Detectar mobile
const isMobile = ref(false)
const handleResize = () => { isMobile.value = window.innerWidth < 900 }

onMounted(() => {
  handleResize()
  window.addEventListener("resize", handleResize)
  window.addEventListener("keydown", onKey)
  window.addEventListener("touchend", resetPinch)
})

onUnmounted(() => {
  window.removeEventListener("resize", handleResize)
  window.removeEventListener("keydown", onKey)
  window.removeEventListener("touchend", resetPinch)
})

// Modal
const showModal = ref(false)
const modalImg = ref("")
const modalImgRef = ref(null)
const scale = ref(1)
let lastDist = 0

function openModal(img) {
  modalImg.value = img
  showModal.value = true
  scale.value = 1
  document.body.style.overflow = 'hidden' // prevenir scroll
}

function closeModal() {
  showModal.value = false
  modalImg.value = ""
  lastDist = 0
  scale.value = 1
  document.body.style.overflow = '' // restaurar scroll
  if (modalImgRef.value) modalImgRef.value.style.transform = ""
}

function onKey(e) {
  if (e.key === "Escape" && showModal.value) closeModal()
}

// Zoom: rueda y pinch
function zoom(e) {
  e.preventDefault()
  const step = 0.12
  scale.value += e.deltaY < 0 ? step : -step
  scale.value = Math.max(1, Math.min(3.5, scale.value))
  if (modalImgRef.value) modalImgRef.value.style.transform = `scale(${scale.value})`
}

function onPinch(e) {
  if (!(e.touches && e.touches.length === 2)) {
    lastDist = 0
    return
  }
  const dx = e.touches[0].clientX - e.touches[1].clientX
  const dy = e.touches[0].clientY - e.touches[1].clientY
  const dist = Math.hypot(dx, dy)
  if (lastDist) {
    scale.value += (dist - lastDist) / 200
    scale.value = Math.max(1, Math.min(3.5, scale.value))
    if (modalImgRef.value) modalImgRef.value.style.transform = `scale(${scale.value})`
  }
  lastDist = dist
}

function resetPinch() {
  lastDist = 0
}
</script>

<template>
  <section class="gallery-section" aria-label="Galería de inspiración">
    <div class="container">
      <div class="gallery-header">
        <h3 class="gallery-title">
          <i class="bi bi-images"></i>
          Encuentra lo mejor para tu hogar
        </h3>
        <p class="gallery-subtitle">Descubre ambientes únicos que inspiran</p>
      </div>

      <!-- Desktop Grid -->
      <div v-if="!isMobile" class="gallery-grid">
        <article
          v-for="(img, i) in galleryImages"
          :key="i"
          class="gallery-item"
          @click="openModal(img)"
          @keydown.enter="openModal(img)"
          @keydown.space.prevent="openModal(img)"
          tabindex="0"
          role="button"
          :aria-label="`Ver imagen ${i + 1} en tamaño completo`"
        >
          <div class="image-wrapper">
            <img :src="img" :alt="`Ambiente de inspiración ${i + 1}`" loading="lazy" />
            <div class="image-overlay">
              <div class="overlay-content">
                <i class="bi bi-zoom-in"></i>
                <span>Ver imagen</span>
              </div>
            </div>
          </div>
          <div class="item-label">Ambiente {{ i + 1 }}</div>
        </article>
      </div>

      <!-- Mobile Swiper -->
      <Swiper
        v-else
        class="gallery-swiper"
        :slides-per-view="1.1"
        :space-between="16"
        :centered-slides="true"
        :pagination="{ clickable: true, dynamicBullets: true }"
        :autoplay="{ delay: 4000, disableOnInteraction: false }"
        :effect="'coverflow'"
        :coverflow-effect="{
          rotate: 15,
          stretch: 0,
          depth: 100,
          modifier: 1.5,
          slideShadows: true,
        }"
        :modules="[Pagination, EffectCoverflow, Autoplay]"
      >
        <SwiperSlide v-for="(img, i) in galleryImages" :key="i">
          <article class="gallery-item mobile" @click="openModal(img)">
            <div class="image-wrapper">
              <img :src="img" :alt="`Ambiente de inspiración ${i + 1}`" loading="lazy" />
              <div class="mobile-badge">
                <i class="bi bi-zoom-in"></i>
                Ambiente {{ i + 1 }}
              </div>
            </div>
          </article>
        </SwiperSlide>
      </Swiper>

      <!-- Modal Mejorado -->
      <Transition name="modal-fade">
        <div
          v-if="showModal"
          class="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Vista ampliada de la imagen"
          @click="closeModal"
        >
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <div class="zoom-controls">
                <button
                  class="zoom-btn"
                  @click="scale = Math.max(1, scale - 0.2)"
                  aria-label="Reducir zoom"
                  :disabled="scale <= 1"
                >
                  <i class="bi bi-dash-circle"></i>
                </button>
                <span class="zoom-level">{{ Math.round(scale * 100) }}%</span>
                <button
                  class="zoom-btn"
                  @click="scale = Math.min(3.5, scale + 0.2)"
                  aria-label="Aumentar zoom"
                  :disabled="scale >= 3.5"
                >
                  <i class="bi bi-plus-circle"></i>
                </button>
              </div>
              <button class="close-btn" @click="closeModal" aria-label="Cerrar vista ampliada">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>

            <div class="modal-img-wrapper">
              <img
                :src="modalImg"
                alt="Imagen ampliada"
                class="modal-img"
                ref="modalImgRef"
                @wheel.prevent="zoom"
                @touchmove="onPinch"
                :style="{ transform: `scale(${scale})` }"
              />
            </div>

            <div class="modal-hint">
              <i class="bi bi-mouse"></i>
              <span>Usa la rueda del mouse o pellizca para hacer zoom</span>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </section>
</template>

<style scoped>
.gallery-section {
  padding: 4rem 0;
  background: linear-gradient(135deg, #fdfbff 0%, #f8f4fc 100%);
  position: relative;
  overflow: hidden;
}

.gallery-section::before {
  content: '';
  position: absolute;
  top: -20%;
  right: -10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.06) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  position: relative;
  z-index: 1;
}

.gallery-header {
  text-align: center;
  margin-bottom: 3rem;
}

.gallery-title {
  color: #860734;
  font-weight: 800;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.gallery-title i {
  font-size: 0.9em;
  color: #ffd700;
}

.gallery-subtitle {
  color: #a0616f;
  font-size: clamp(0.95rem, 2vw, 1.1rem);
  font-weight: 500;
}

/* Desktop Grid */
.gallery-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.gallery-item {
  cursor: pointer;
  outline: none;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.gallery-item:hover {
  transform: translateY(-8px);
}

.gallery-item:focus-visible {
  outline: 3px solid rgba(134, 7, 52, 0.4);
  outline-offset: 4px;
  border-radius: 16px;
}

.image-wrapper {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow:
    0 8px 24px rgba(134, 7, 52, 0.12),
    0 2px 8px rgba(134, 7, 52, 0.06);
  background: #fff;
}

.image-wrapper img {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  display: block;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.gallery-item:hover .image-wrapper img {
  transform: scale(1.08);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(134, 7, 52, 0.3) 60%,
    rgba(134, 7, 52, 0.7) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-item:hover .image-overlay {
  opacity: 1;
}

.overlay-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #fff;
  font-weight: 700;
  transform: translateY(10px);
  transition: transform 0.3s ease;
}

.gallery-item:hover .overlay-content {
  transform: translateY(0);
}

.overlay-content i {
  font-size: 2.5rem;
}

.overlay-content span {
  font-size: 0.95rem;
  letter-spacing: 0.5px;
}

.item-label {
  margin-top: 0.75rem;
  text-align: center;
  font-weight: 700;
  color: #860734;
  font-size: 0.95rem;
}

/* Mobile Swiper */
.gallery-swiper {
  width: 100%;
  padding: 2rem 0 3rem;
}

.gallery-item.mobile {
  cursor: pointer;
}

.gallery-item.mobile .image-wrapper {
  border-radius: 14px;
}

.gallery-item.mobile .image-wrapper img {
  aspect-ratio: 3/4;
}

.mobile-badge {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(134, 7, 52, 0.95);
  backdrop-filter: blur(10px);
  color: #fff;
  padding: 0.6rem 1.2rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

/* Modal Mejorado */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(20, 6, 30, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-content {
  position: relative;
  max-width: 95vw;
  max-height: 92vh;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(134, 7, 52, 0.4);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #faf8fc 100%);
  border-bottom: 1px solid rgba(134, 7, 52, 0.1);
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.zoom-btn {
  background: transparent;
  border: 2px solid rgba(134, 7, 52, 0.2);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #860734;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.zoom-btn:hover:not(:disabled) {
  background: #860734;
  color: #fff;
  border-color: #860734;
  transform: scale(1.1);
}

.zoom-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.zoom-level {
  font-weight: 700;
  color: #860734;
  font-size: 0.95rem;
  min-width: 50px;
  text-align: center;
}

.close-btn {
  background: rgba(134, 7, 52, 0.1);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #860734;
  font-size: 1.3rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #860734;
  color: #fff;
  transform: rotate(90deg) scale(1.1);
}

.modal-img-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #1a1a1a;
  padding: 2rem;
  min-height: 400px;
}

.modal-img {
  max-width: 100%;
  max-height: 70vh;
  border-radius: 12px;
  object-fit: contain;
  transition: transform 0.2s ease-out;
  cursor: grab;
}

.modal-img:active {
  cursor: grabbing;
}

.modal-hint {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #faf8fc 0%, #f3ebf7 100%);
  border-top: 1px solid rgba(134, 7, 52, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #a0616f;
  font-size: 0.85rem;
  font-weight: 500;
}

.modal-hint i {
  color: #860734;
}

/* Transiciones del modal */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-active .modal-content,
.modal-fade-leave-active .modal-content {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-content {
  transform: scale(0.95) translateY(20px);
  opacity: 0;
}

.modal-fade-leave-to .modal-content {
  transform: scale(0.95);
  opacity: 0;
}

/* Responsive */
@media (max-width: 900px) {
  .gallery-section {
    padding: 3rem 0;
  }

  .gallery-header {
    margin-bottom: 2rem;
  }

  .modal-content {
    max-width: 98vw;
    max-height: 95vh;
  }

  .modal-header {
    padding: 0.75rem 1rem;
  }

  .zoom-controls {
    gap: 0.5rem;
  }

  .zoom-btn {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }

  .close-btn {
    width: 36px;
    height: 36px;
    font-size: 1.1rem;
  }

  .modal-img-wrapper {
    padding: 1rem;
    min-height: 300px;
  }

  .modal-hint {
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 640px) {
  .gallery-section {
    padding: 2rem 0;
  }

  .gallery-grid {
    gap: 1rem;
    grid-template-columns: 1fr;
  }

  .modal-hint {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .gallery-item,
  .image-wrapper img,
  .modal-fade-enter-active,
  .modal-fade-leave-active,
  .close-btn {
    transition: none;
  }
}
</style>
