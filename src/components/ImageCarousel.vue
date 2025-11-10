<template>
  <section class="split-slider" aria-label="Carrusel de imágenes promocionales">
    <div class="split-left">
      <div class="content-wrapper">
        <span class="badge-promo" aria-label="Promoción especial">✨ Oferta Especial</span>
        <h2 class="split-title">
          El mejor regalo para mamá
          <span class="highlight">encuéntralo en nuestra sucursal</span>
        </h2>
        <p class="split-description">
          Descubre muebles hechos a mano que transforman tu espacio en un verdadero hogar.
          Calidad excepcional y diseños únicos.
        </p>
        <div class="cta-group">
          <router-link to="/productos" class="btn-split-primary">
            <span>Descubre más</span>
            <i class="bi bi-arrow-right"></i>
          </router-link>
          <button class="btn-split-secondary" @click="scrollToContact">
            Contáctanos
          </button>
        </div>

        <!-- Progress indicators -->
        <div class="slider-progress">
          <button
            v-for="i in indices"
            :key="i"
            :class="['progress-bar', { active: i === current }]"
            @click="goTo(i)"
            :aria-label="`Ir a imagen ${i + 1}`"
            :aria-current="i === current"
          >
            <span class="progress-fill" :style="{ width: i === current ? progress + '%' : '0%' }"></span>
          </button>
        </div>
      </div>
    </div>

    <div
      class="split-right"
      @mousedown="startDrag"
      @mousemove="onDrag"
      @mouseup="endDrag"
      @mouseleave="endDrag"
      @touchstart="startDrag"
      @touchmove="onDrag"
      @touchend="endDrag"
      role="region"
      aria-label="Galería de imágenes deslizable"
    >
      <!-- Navigation arrows -->
      <button
        class="nav-arrow prev"
        @click="prev"
        aria-label="Imagen anterior"
        :disabled="current === 0"
      >
        <i class="bi bi-chevron-left"></i>
      </button>
      <button
        class="nav-arrow next"
        @click="next"
        aria-label="Siguiente imagen"
        :disabled="current === images.length - 1"
      >
        <i class="bi bi-chevron-right"></i>
      </button>

      <div class="slider-track" :style="{ transform: `translateX(-${current * 100}%)` }">
        <div
          v-for="i in indices"
          :key="i"
          class="slider-img"
          :class="{ active: i === current }"
        >
          <img
            :src="images[i]"
            :alt="`Imagen promocional ${i + 1}`"
            :title="`Promoción ${i + 1}`"
            loading="lazy"
            @load="onImageLoad(i)"
          />
          <div class="image-overlay"></div>
        </div>
      </div>

      <!-- Dots navigation -->
      <nav class="slider-dots" aria-label="Navegación de imágenes">
        <button
          v-for="i in indices"
          :key="`dot-${i}`"
          :class="['dot', { active: i === current }]"
          @click="goTo(i)"
          :aria-label="`Ver imagen ${i + 1}`"
          :aria-current="i === current"
        ></button>
      </nav>

      <!-- Play/Pause control -->
      <button class="play-pause-btn" @click="toggleAutoplay" :aria-label="isPlaying ? 'Pausar' : 'Reproducir'">
        <i :class="isPlaying ? 'bi bi-pause-fill' : 'bi bi-play-fill'"></i>
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const images = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1460518451285-97b6aa326961?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80",
];

// índice reutilizable para iterar en plantillas y evitar advertencias del analizador
const indices = images.map((_, i) => i);

const current = ref(0);
const progress = ref(0);
const isPlaying = ref(true);
const loadedImages = ref(new Set());

// Navigation functions
function goTo(i) {
  if (i >= 0 && i < images.length) {
    current.value = i;
    progress.value = 0;
  }
}

function next() {
  if (current.value < images.length - 1) {
    current.value++;
    progress.value = 0;
  }
}

function prev() {
  if (current.value > 0) {
    current.value--;
    progress.value = 0;
  }
}

function scrollToContact() {
  const contactSection = document.querySelector('#contacto');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// Drag/Swipe logic
let startX = 0;
let dragging = false;

function startDrag(e) {
  dragging = true;
  startX = e.touches ? e.touches[0].clientX : e.clientX;
  if (isPlaying.value) {
    isPlaying.value = false;
  }
}

function onDrag(e) {
  if (!dragging) return;
  const x = e.touches ? e.touches[0].clientX : e.clientX;
  const diff = x - startX;

  if (Math.abs(diff) > 80) {
    if (diff < 0) {
      next();
    } else {
      prev();
    }
    dragging = false;
  }
}

function endDrag() {
  dragging = false;
}

// Autoplay
let autoplayInterval = null;
let progressInterval = null;

function startAutoplay() {
  if (autoplayInterval) return;

  autoplayInterval = setInterval(() => {
    if (current.value < images.length - 1) {
      current.value++;
    } else {
      current.value = 0;
    }
    progress.value = 0;
  }, 5000);

  progressInterval = setInterval(() => {
    if (progress.value < 100) {
      progress.value += 2;
    }
  }, 100);
}

function stopAutoplay() {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
    autoplayInterval = null;
  }
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
}

function toggleAutoplay() {
  isPlaying.value = !isPlaying.value;
  if (isPlaying.value) {
    startAutoplay();
  } else {
    stopAutoplay();
  }
}

function onImageLoad(index) {
  loadedImages.value.add(index);
}

// Lifecycle
onMounted(() => {
  if (isPlaying.value) {
    startAutoplay();
  }
});

onUnmounted(() => {
  stopAutoplay();
});
</script>

<style scoped>
.split-slider {
  display: grid;
  grid-template-columns: 45% 75%; /* más ancho para las imágenes */
  height: 760px; /* altura fija en pantallas grandes para evitar que aumente */
  background: linear-gradient(135deg, #fdfbff 0%, #f8f4fc 100%);
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow:
    0 10px 40px rgba(134, 7, 52, 0.1),
    0 2px 12px rgba(134, 7, 52, 0.06);
  margin: 2rem auto;
  max-width: 1500px; /* aumentar un poco el ancho total */
  position: relative;
}

/* Left side - Content */
.split-left {
  padding: 1.6rem 1.2rem; /* aún menos padding para ganar ancho visible */
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #ffffff 0%, #faf8fc 100%);
  position: relative;
  z-index: 2;
}

.split-left::before {
  content: '';
  position: absolute;
  top: -20%;
  left: -10%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.08) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.content-wrapper {
  max-width: 500px;
}

.badge-promo {
  display: inline-block;
  background: linear-gradient(135deg, #fff9e6 0%, #ffe8b3 100%);
  color: #860734;
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.2);
}

.split-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  color: #860734;
  line-height: 1.2;
  margin-bottom: 1.25rem;
  letter-spacing: -0.02em;
}

.highlight {
  display: block;
  background: linear-gradient(120deg, #ffd700 0%, #ffed4e 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-top: 0.5rem;
}

.split-description {
  font-size: 1.05rem;
  color: #5a3d52;
  line-height: 1.7;
  margin-bottom: 2rem;
  font-weight: 500;
}

.cta-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

.btn-split-primary,
.btn-split-secondary {
  padding: 0.9rem 1.8rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.95rem;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.btn-split-primary {
  background: linear-gradient(135deg, #860734 0%, #a8084a 100%);
  color: #fff;
  box-shadow: 0 4px 16px rgba(134, 7, 52, 0.3);
}

.btn-split-primary:hover {
  background: linear-gradient(135deg, #a8084a 0%, #860734 100%);
  box-shadow: 0 6px 24px rgba(134, 7, 52, 0.4);
  transform: translateY(-2px);
}

.btn-split-secondary {
  background: transparent;
  color: #860734;
  border: 2px solid #860734;
}

.btn-split-secondary:hover {
  background: #860734;
  color: #fff;
  transform: translateY(-2px);
}

/* Progress indicators */
.slider-progress {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: rgba(134, 7, 52, 0.15);
  border-radius: 2px;
  border: none;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  padding: 0;
  transition: all 0.3s ease;
}

.progress-bar:hover {
  background: rgba(134, 7, 52, 0.25);
  transform: scaleY(1.5);
}

.progress-bar.active {
  background: rgba(134, 7, 52, 0.2);
}

.progress-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: linear-gradient(90deg, #860734 0%, #ffd700 100%);
  transition: width 0.1s linear;
}

/* Right side - Images */
.split-right {
  position: relative;
  overflow: hidden;
  background: #1a1a1a;
  height: 100%; /* ocupar la altura fija del contenedor */
}

.slider-track {
  display: flex;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.slider-img {
  min-width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center; /* centrar verticalmente la imagen */
  justify-content: center;
}

.slider-img img {
  width: 100%;            /* llenar el ancho de la columna */
  height: auto;           /* mantener aspecto */
  max-height: calc(100% - 32px); /* dejar margen para progress/dots sin crecer */
  object-fit: cover;      /* recortar si es necesario */
  transition: transform 0.35s ease, opacity 0.2s ease;
  border-radius: 6px;
}

.slider-img.active img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.2) 100%);
  pointer-events: none;
}

/* Navigation arrows */
.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.95);
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #860734;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.nav-arrow:hover:not(:disabled) {
  background: #860734;
  color: #fff;
  transform: translateY(-50%) scale(1.1);
}

.nav-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.nav-arrow.prev {
  left: 1.5rem;
}

.nav-arrow.next {
  right: 1.5rem;
}

/* Dots navigation */
.slider-dots {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.75rem;
  z-index: 10;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.dot:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: scale(1.2);
}

.dot.active {
  background: #fff;
  width: 32px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.5);
}

/* Play/Pause button */
.play-pause-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #860734;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.play-pause-btn:hover {
  background: #860734;
  color: #fff;
  transform: scale(1.1);
}

/* Responsive */
@media (max-width: 1024px) {
  .split-slider {
    grid-template-columns: 1fr;
    height: auto; /* volver a comportamiento flexible en pantallas pequeñas */
  }

  .split-left {
    padding: 1.6rem 1rem;
  }

  .split-right {
    min-height: 320px; /* ligeramente menor para pantallas medianas */
  }

  .content-wrapper {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .split-slider {
    margin: 1rem;
    border-radius: 1rem;
  }

  .split-left {
    padding: 2rem 1.25rem;
  }

  .split-right {
    min-height: 260px;
  }

  .split-title {
    font-size: 1.5rem;
  }

  .split-description {
    font-size: 0.95rem;
  }

  .cta-group {
    flex-direction: column;
  }

  .btn-split-primary,
  .btn-split-secondary {
    width: 100%;
    justify-content: center;
  }

  .nav-arrow {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }

  .nav-arrow.prev {
    left: 1rem;
  }

  .nav-arrow.next {
    right: 1rem;
  }
}

@media (max-width: 480px) {
  .split-left {
    padding: 1.5rem 1rem;
  }

  .split-right {
    min-height: 220px;
  }

  .badge-promo {
    font-size: 0.75rem;
    padding: 0.4rem 1rem;
  }

  .slider-progress {
    gap: 0.35rem;
  }

  .progress-bar {
    height: 3px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .slider-track,
  .slider-img img,
  .nav-arrow,
  .btn-split-primary,
  .btn-split-secondary,
  .dot,
  .progress-bar {
    transition: none;
  }
}
</style>
