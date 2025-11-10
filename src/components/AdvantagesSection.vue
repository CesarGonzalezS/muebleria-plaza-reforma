<template>
  <section class="advantages-section" aria-label="Ventajas de comprar con nosotros">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">¿Por qué elegirnos?</h2>
        <p class="section-subtitle">Beneficios exclusivos que hacen la diferencia</p>
      </div>

      <div class="advantages-grid">
        <article
          v-for="(advantage, index) in advantages"
          :key="index"
          class="advantage-card"
          :style="{ '--delay': `${index * 0.1}s` }"
        >
          <div class="card-inner">
            <div class="icon-wrapper">
              <div class="icon-circle">
                <component :is="advantage.iconComponent" v-if="advantage.iconComponent" />
                <i v-else :class="advantage.icon"></i>
              </div>
              <div class="icon-glow"></div>
            </div>

            <div class="card-content">
              <h3 class="card-title">{{ advantage.title }}</h3>
              <p class="card-description">{{ advantage.description }}</p>
            </div>

            <div class="card-badge" v-if="advantage.badge">
              <i class="bi bi-star-fill"></i>
              <span>{{ advantage.badge }}</span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { h } from 'vue';
import './assets/styles.css';

// Componente SVG para Personalización
const PersonalizationIcon = () => h('svg', {
  width: '40',
  height: '40',
  viewBox: '0 0 40 40',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg'
}, [
  h('circle', { cx: '20', cy: '20', r: '18', fill: '#ffd700', opacity: '0.2' }),
  h('rect', { x: '10', y: '18', width: '20', height: '4', rx: '2', fill: 'currentColor' }),
  h('rect', { x: '18', y: '10', width: '4', height: '20', rx: '2', fill: 'currentColor' })
]);

// Componente SVG para Mercado Pago
const MercadoPagoIcon = () => h('svg', {
  width: '52',
  height: '36',
  viewBox: '0 0 52 36',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg'
}, [
  h('rect', { width: '52', height: '36', rx: '8', fill: '#00579F' }),
  h('ellipse', { cx: '26', cy: '18', rx: '22', ry: '11', fill: '#fff' }),
  h('path', { d: 'M17 18c2-2.5 16-2.5 18 0', fill: 'none', stroke: '#00579F', 'stroke-width': '3' }),
  h('path', { d: 'M21 18c.8-1.8 9.4-1.8 10 0', fill: 'none', stroke: '#00579F', 'stroke-width': '2.5', 'stroke-linecap': 'round' }),
  h('ellipse', { cx: '26', cy: '18', rx: '9', ry: '3.5', fill: '#00579F', opacity: '0.25' })
]);

const advantages = [
  {
    icon: 'bi bi-truck',
    title: 'Envío rápido',
    description: 'Recibe tus muebles en tu domicilio sin complicaciones',
    badge: 'Gratis'
  },
  {
    iconComponent: PersonalizationIcon,
    title: 'Personalización',
    description: 'Colores y medidas adaptados a tu gusto',
    badge: 'Premium'
  },
  {
    icon: 'bi bi-credit-card-2-back',
    title: 'Crédito fácil',
    description: 'Pagos cómodos y flexibles, sin buró',
    badge: 'Popular'
  },
  {
    iconComponent: MercadoPagoIcon,
    title: 'Mercado Pago',
    description: 'Compra 100% segura y protegida',
    badge: 'Seguro'
  }
];
</script>

<style scoped>
.advantages-section {
  padding: 5rem 0;
  background: linear-gradient(135deg, #fdfbff 0%, #f8f4fc 100%);
  position: relative;
  overflow: hidden;
}

.advantages-section::before {
  content: '';
  position: absolute;
  top: -15%;
  left: -10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.08) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  animation: float 8s ease-in-out infinite;
}

.advantages-section::after {
  content: '';
  position: absolute;
  bottom: -20%;
  right: -15%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(134, 7, 52, 0.05) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  animation: float 10s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, 30px) scale(1.1); }
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
  position: relative;
  z-index: 1;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  color: #860734;
  font-weight: 800;
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.section-subtitle {
  color: #a0616f;
  font-size: clamp(1rem, 2vw, 1.2rem);
  font-weight: 500;
}

.advantages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.advantage-card {
  opacity: 0;
  animation: slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  animation-delay: var(--delay, 0s);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-inner {
  background: linear-gradient(145deg, #ffffff 0%, #fefbff 100%);
  border-radius: 20px;
  padding: 2.5rem 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 10px 30px rgba(134, 7, 52, 0.08),
    0 2px 8px rgba(134, 7, 52, 0.04);
  border: 1px solid rgba(134, 7, 52, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-inner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #860734 0%, #ffd700 100%);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.advantage-card:hover .card-inner {
  transform: translateY(-12px);
  box-shadow:
    0 20px 50px rgba(134, 7, 52, 0.15),
    0 8px 20px rgba(255, 215, 0, 0.1);
  border-color: rgba(134, 7, 52, 0.12);
}

.advantage-card:hover .card-inner::before {
  transform: scaleX(1);
}

.icon-wrapper {
  position: relative;
  margin-bottom: 1.5rem;
}

.icon-circle {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #fff9e6 0%, #ffe8b3 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: #860734;
  box-shadow:
    0 8px 24px rgba(255, 215, 0, 0.25),
    inset 0 2px 8px rgba(255, 215, 0, 0.15);
  border: 3px solid rgba(255, 215, 0, 0.3);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 2;
}

.advantage-card:hover .icon-circle {
  transform: scale(1.1) rotate(5deg);
  box-shadow:
    0 12px 32px rgba(255, 215, 0, 0.35),
    inset 0 2px 12px rgba(255, 215, 0, 0.2);
  border-color: rgba(255, 215, 0, 0.5);
}

.icon-glow {
  position: absolute;
  inset: -10px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 1;
}

.advantage-card:hover .icon-glow {
  opacity: 1;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.2); opacity: 0.6; }
}

.card-content {
  flex: 1;
  margin-bottom: 1rem;
}

.card-title {
  color: #860734;
  font-weight: 800;
  font-size: 1.4rem;
  margin-bottom: 0.75rem;
  letter-spacing: -0.01em;
}

.card-description {
  color: #5a3d52;
  font-size: 1rem;
  line-height: 1.6;
  font-weight: 500;
}

.card-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: linear-gradient(135deg, #860734 0%, #a8084a 100%);
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(134, 7, 52, 0.3);
  margin-top: 0.5rem;
}

.card-badge i {
  font-size: 0.75rem;
  animation: sparkle 1.5s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
  50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
}

/* Responsive */
@media (max-width: 1024px) {
  .advantages-section {
    padding: 4rem 0;
  }

  .section-header {
    margin-bottom: 3rem;
  }

  .advantages-grid {
    gap: 1.5rem;
  }

  .card-inner {
    padding: 2rem 1.5rem;
  }

  .icon-circle {
    width: 85px;
    height: 85px;
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .advantages-section {
    padding: 3rem 0;
  }

  .section-header {
    margin-bottom: 2.5rem;
  }

  .advantages-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .card-inner {
    padding: 1.75rem 1.25rem;
  }

  .icon-circle {
    width: 75px;
    height: 75px;
    font-size: 1.75rem;
  }

  .card-title {
    font-size: 1.25rem;
  }

  .card-description {
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .advantages-section {
    padding: 2.5rem 0;
  }

  .container {
    padding: 0 1rem;
  }

  .section-header {
    margin-bottom: 2rem;
  }

  .advantages-grid {
    gap: 1rem;
    grid-template-columns: 1fr;
  }

  .card-inner {
    padding: 1.5rem 1rem;
    border-radius: 16px;
  }

  .icon-wrapper {
    margin-bottom: 1.25rem;
  }

  .icon-circle {
    width: 70px;
    height: 70px;
    font-size: 1.5rem;
  }

  .icon-circle svg {
    width: 36px;
    height: 36px;
  }

  .card-title {
    font-size: 1.15rem;
    margin-bottom: 0.6rem;
  }

  .card-description {
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .card-badge {
    padding: 0.4rem 0.85rem;
    font-size: 0.8rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .advantage-card,
  .card-inner,
  .icon-circle,
  .icon-glow,
  .card-badge i {
    animation: none;
    transition: none;
  }

  .advantage-card {
    opacity: 1;
  }
}
</style>
