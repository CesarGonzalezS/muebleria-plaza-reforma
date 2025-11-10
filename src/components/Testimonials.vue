<template>
  <section class="testimonials-section" aria-label="Sección de testimonios de clientes">
    <div class="container">
      <h2 class="testimonials-title">Lo que dicen nuestros clientes</h2>
      <p class="testimonials-subtitle">Experiencias reales de quienes confían en nosotros</p>

      <div class="testimonial-carousel">
        <button
          class="arrow left"
          @click="prev"
          @keydown.enter="prev"
          @keydown.space.prevent="prev"
          aria-label="Ver testimonios anteriores"
          :disabled="totalPages <= 1"
        >
          <i class="bi bi-chevron-left"></i>
        </button>

        <div class="testimonial-wrapper">
          <TransitionGroup
            name="slide-fade"
            tag="div"
            class="testimonial-list"
            mode="out-in"
          >
            <article
              v-for="(testimonial, idx) in visibleTestimonials"
              :key="`${page}-${idx}`"
              class="testimonial-card"
              role="article"
              :aria-label="`Testimonio de ${testimonial.name}`"
            >
              <div class="card-header">
                <div class="testimonial-icon" aria-hidden="true">
                  <i class="bi bi-person-circle"></i>
                </div>
                <div class="rating" role="img" aria-label="Calificación 5 estrellas">
                  <i v-for="star in 5" :key="star" class="bi bi-star-fill" aria-hidden="true"></i>
                </div>
              </div>

              <blockquote class="testimonial-text">
                <span class="quote-mark opening" aria-hidden="true">"</span>
                {{ testimonial.text }}
                <span class="quote-mark closing" aria-hidden="true">"</span>
              </blockquote>

              <footer class="testimonial-footer">
                <div class="testimonial-author">{{ testimonial.name }}</div>
                <div class="testimonial-role" v-if="testimonial.role">{{ testimonial.role }}</div>
              </footer>
            </article>
          </TransitionGroup>
        </div>

        <button
          class="arrow right"
          @click="next"
          @keydown.enter="next"
          @keydown.space.prevent="next"
          aria-label="Ver siguientes testimonios"
          :disabled="totalPages <= 1"
        >
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>

      <nav class="carousel-dots" aria-label="Navegación de testimonios" v-if="totalPages > 1">
        <button
          v-for="idx in totalPages"
          :key="idx"
          :class="{ active: idx - 1 === page }"
          @click="goTo(idx - 1)"
          :aria-label="`Ir a página ${idx} de ${totalPages}`"
          :aria-current="idx - 1 === page ? 'true' : 'false'"
        ></button>
      </nav>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

// Datos de testimonios (podrías moverlos a src/data/testimonials.js)
const testimonials = ref([
  {
    name: "Laura Gómez",
    role: "Cliente frecuente",
    text: "Excelente atención y muebles de calidad excepcional. La entrega fue puntual y el equipo muy profesional. Totalmente recomendados.",
  },
  {
    name: "Pedro Martínez",
    role: "Diseñador de interiores",
    text: "Me encantó la variedad y el servicio postventa. Siempre encuentro lo que necesito para mis proyectos.",
  },
  {
    name: "Alejandra Ruiz",
    role: "Propietaria de hogar",
    text: "La mejor experiencia de compra que he tenido en muebles. El personal me asesoró perfectamente y el resultado superó mis expectativas.",
  },
  {
    name: "José Pérez",
    role: "Empresario",
    text: "Entrega rápida y productos de gran calidad. Amueblé toda mi oficina con ellos y quedé fascinado con el resultado.",
  },
  {
    name: "Carlos Ramírez",
    role: "Arquitecto",
    text: "Precios muy competitivos sin sacrificar calidad. La atención personalizada hace toda la diferencia.",
  },
  {
    name: "Marta Espinoza",
    role: "Decoradora",
    text: "Me ayudaron a personalizar mi sala con opciones que ni imaginaba. El equipo tiene un ojo increíble para el diseño.",
  },
]);

const page = ref(0);
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024);

// Responsive: 1 en móvil, 2 en tablet, 3 en desktop
const perPage = computed(() => {
  if (windowWidth.value < 640) return 1;
  if (windowWidth.value < 1024) return 2;
  return 3;
});

const totalPages = computed(() =>
  Math.ceil(testimonials.value.length / perPage.value)
);

const visibleTestimonials = computed(() => {
  const start = page.value * perPage.value;
  return testimonials.value.slice(start, start + perPage.value);
});

function goTo(idx) {
  page.value = idx;
  stopAutoSlide();
  startAutoSlide();
}

function next() {
  page.value = (page.value + 1) % totalPages.value;
}

function prev() {
  page.value = (page.value - 1 + totalPages.value) % totalPages.value;
}

let interval = null;
function startAutoSlide() {
  stopAutoSlide();
  interval = setInterval(next, 6000);
}

function stopAutoSlide() {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
}

function handleResize() {
  windowWidth.value = window.innerWidth;
  if (page.value >= totalPages.value) {
    page.value = Math.max(0, totalPages.value - 1);
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', handleResize);
    startAutoSlide();
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleResize);
  }
  stopAutoSlide();
});

watch(perPage, () => {
  if (page.value >= totalPages.value) {
    page.value = Math.max(0, totalPages.value - 1);
  }
});
</script>

<style scoped>
.testimonials-section {
  background: linear-gradient(135deg, #fdfbff 0%, #f8f4fc 50%, #f3ebf7 100%);
  border-radius: 2rem;
  margin: 3rem auto;
  box-shadow:
    0 10px 40px rgba(134, 7, 52, 0.08),
    0 2px 12px rgba(134, 7, 52, 0.04);
  padding: 3.5rem 1.5rem;
  position: relative;
  overflow: hidden;
}

.testimonials-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.08) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.testimonials-title {
  color: #860734;
  font-weight: 800;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  text-align: center;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.testimonials-subtitle {
  color: #a0616f;
  font-size: clamp(0.95rem, 2vw, 1.1rem);
  text-align: center;
  margin-bottom: 2.5rem;
  font-weight: 500;
}

.testimonial-carousel {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  position: relative;
}

.arrow {
  background: linear-gradient(135deg, #ffffff 0%, #fdf5f9 100%);
  border: 2px solid rgba(134, 7, 52, 0.15);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #860734;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(134, 7, 52, 0.1);
}

.arrow:hover:not(:disabled) {
  background: linear-gradient(135deg, #860734 0%, #a8084a 100%);
  color: #fff;
  border-color: #860734;
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(134, 7, 52, 0.25);
}

.arrow:active:not(:disabled) {
  transform: scale(1.05);
}

.arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.arrow:focus-visible {
  outline: 3px solid rgba(134, 7, 52, 0.4);
  outline-offset: 2px;
}

.testimonial-wrapper {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.testimonial-list {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  align-items: stretch;
  min-height: 320px;
}

.testimonial-card {
  background: linear-gradient(145deg, #ffffff 0%, #fffcfe 100%);
  border-radius: 1.25rem;
  box-shadow:
    0 8px 24px rgba(134, 7, 52, 0.12),
    0 2px 8px rgba(134, 7, 52, 0.06);
  padding: 2rem 1.75rem;
  min-width: 240px;
  max-width: 240px; /* Fijar el ancho para evitar ajustes dinámicos */
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(134, 7, 52, 0.08);
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
  position: relative;
  overflow: hidden;
}

.testimonial-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #860734 0%, #ffd700 100%);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.testimonial-card:hover {
  box-shadow: 0 12px 36px rgba(134, 7, 52, 0.15);
  transform: none; /* Mantener la posición estable */
}

.testimonial-card:hover::before {
  transform: scaleX(1);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.testimonial-icon {
  color: #ffd700;
  font-size: 2.5rem;
  background: linear-gradient(135deg, #fff9e6 0%, #ffe8b3 100%);
  border-radius: 50%;
  box-shadow:
    0 4px 12px rgba(255, 215, 0, 0.2),
    inset 0 2px 4px rgba(255, 215, 0, 0.1);
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.rating {
  display: flex;
  gap: 0.25rem;
  color: #ffd700;
  font-size: 0.9rem;
}

.rating i {
  filter: drop-shadow(0 1px 2px rgba(255, 215, 0, 0.3));
}

.testimonial-text {
  font-size: 1rem;
  color: #4a3440;
  margin-bottom: 1.5rem;
  font-weight: 500;
  line-height: 1.7;
  position: relative;
  flex: 1;
  font-style: italic;
}

.quote-mark {
  font-size: 2.5rem;
  color: #e94e77;
  opacity: 0.25;
  font-family: Georgia, serif;
  font-weight: bold;
  line-height: 0;
}

.quote-mark.opening {
  position: relative;
  top: 0.4rem;
  margin-right: 0.25rem;
}

.quote-mark.closing {
  position: relative;
  top: 0.4rem;
  margin-left: 0.25rem;
}

.testimonial-footer {
  border-top: 1px solid rgba(134, 7, 52, 0.08);
  padding-top: 1rem;
  margin-top: auto;
}

.testimonial-author {
  color: #860734;
  font-weight: 700;
  font-size: 1.05rem;
  letter-spacing: 0.02em;
  margin-bottom: 0.25rem;
}

.testimonial-role {
  color: #a0616f;
  font-size: 0.875rem;
  font-weight: 500;
}

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 2rem;
}

.carousel-dots button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(134, 7, 52, 0.2);
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0;
  position: relative;
}

.carousel-dots button::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 2px solid transparent;
  transition: border-color 0.3s;
}

.carousel-dots button:hover::after {
  border-color: rgba(134, 7, 52, 0.3);
}

.carousel-dots button.active {
  background: #860734;
  transform: scale(1.3);
  box-shadow: 0 2px 8px rgba(134, 7, 52, 0.35);
}

.carousel-dots button:focus-visible {
  outline: 2px solid rgba(134, 7, 52, 0.5);
  outline-offset: 4px;
}

/* Transiciones suaves */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Responsive */
@media (max-width: 1024px) {
  .testimonials-section {
    padding: 2.5rem 1rem;
  }

  .testimonial-list {
    gap: 1rem;
    min-height: 340px;
  }

  .testimonial-card {
    min-width: 240px;
    max-width: 240px;
  }

  .arrow {
    width: 44px;
    height: 44px;
    font-size: 1.3rem;
  }
}

@media (max-width: 768px) {
  .testimonials-section {
    padding: 2rem 1rem;
    border-radius: 1.5rem;
  }

  .testimonials-subtitle {
    margin-bottom: 2rem;
  }

  .testimonial-carousel {
    gap: 0.75rem;
  }

  .testimonial-list {
    min-height: 360px;
  }

  .testimonial-card {
    min-width: 240px;
    max-width: 240px;
    padding: 1.75rem 1.5rem;
  }

  .testimonial-icon {
    width: 55px;
    height: 55px;
    margin-bottom: 1rem;
  }

  .testimonial-icon i {
    font-size: 2.2rem;
  }

  .testimonial-text {
    font-size: 0.95rem;
  }

  .arrow {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }

  .carousel-dots {
    margin-top: 1.5rem;
  }
}

@media (max-width: 640px) {
  .testimonials-section {
    padding: 1.75rem 0.75rem;
    margin: 2rem auto;
  }

  .testimonial-carousel {
    gap: 0.5rem;
  }

  .arrow {
    width: 36px;
    height: 36px;
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .testimonial-card {
    padding: 1.5rem 1.25rem;
    border-radius: 1rem;
  }
}

@media (max-width: 480px) {
  .testimonials-section {
    padding: 1.5rem 0.5rem;
    border-radius: 1rem;
  }

  .testimonials-title {
    font-size: 1.5rem;
  }

  .testimonials-subtitle {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }

  .testimonial-carousel {
    gap: 0.35rem;
  }

  .arrow {
    width: 32px;
    height: 32px;
    font-size: 1rem;
    border-width: 1.5px;
  }

  .testimonial-list {
    min-height: 320px;
  }

  .testimonial-card {
    min-width: 240px;
    max-width: 240px;
    padding: 1.25rem 1rem;
  }

  .card-header {
    margin-bottom: 1rem;
    flex-direction: column;
    gap: 0.75rem;
  }

  .testimonial-icon {
    width: 50px;
    height: 50px;
  }

  .testimonial-icon i {
    font-size: 2rem;
  }

  .rating {
    font-size: 0.85rem;
  }

  .testimonial-text {
    font-size: 0.9rem;
    margin-bottom: 1.25rem;
    line-height: 1.6;
  }

  .quote-mark {
    font-size: 2rem;
  }

  .testimonial-author {
    font-size: 1rem;
  }

  .testimonial-role {
    font-size: 0.8rem;
  }

  .carousel-dots {
    gap: 0.5rem;
    margin-top: 1.25rem;
  }

  .carousel-dots button {
    width: 10px;
    height: 10px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .testimonial-card,
  .arrow,
  .carousel-dots button,
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    animation: none;
    transition: none;
  }
}
</style>
