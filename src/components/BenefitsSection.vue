<template>
  <section class="benefits-section" aria-label="Beneficios de comprar con nosotros">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">
          <i class="bi bi-gift"></i>
          Beneficios exclusivos
        </h2>
        <p class="section-subtitle">Conoce por qué miles de clientes confían en nosotros</p>
      </div>

      <div class="benefits-grid">
        <article
          v-for="(item, idx) in benefits"
          :key="idx"
          class="benefit-card"
          :style="{ '--delay': `${idx * 0.15}s` }"
        >
          <div class="card-wrapper">
            <div class="icon-container">
              <div class="icon-background"></div>
              <div class="benefit-icon" v-html="item.icon"></div>
            </div>

            <div class="card-content">
              <h3 class="benefit-title">{{ item.title }}</h3>
              <p class="benefit-desc">{{ item.desc }}</p>
            </div>

            <div class="card-shine"></div>
          </div>
        </article>
      </div>

      <div class="trust-badge">
        <i class="bi bi-shield-fill-check"></i>
        <span>Garantía de satisfacción 100%</span>
      </div>
    </div>
  </section>
</template>

<script setup>
const benefits = [
  {
    icon: `
      <svg width="64" height="64" fill="none" viewBox="0 0 64 64">
        <rect x="8" y="18" width="48" height="22" rx="4" stroke="#860734" stroke-width="3" fill="#fff9e6"/>
        <circle cx="18" cy="48" r="4" fill="#860734"/>
        <circle cx="46" cy="48" r="4" fill="#860734"/>
        <rect x="28" y="12" width="8" height="8" rx="2" fill="#ffd700"/>
        <path d="M32 15 L28 20 L36 20 Z" fill="#860734"/>
      </svg>
    `,
    title: 'PAGO SEGURO',
    desc: 'Realiza de manera segura tus compras, contamos con protección 3D Secure gracias a la tecnología de VISA y Mercado Pago.'
  },
  {
    icon: `
      <svg width="64" height="64" fill="none" viewBox="0 0 64 64">
        <rect x="10" y="22" width="44" height="20" rx="8" stroke="#860734" stroke-width="3" fill="#fff9e6"/>
        <circle cx="18" cy="48" r="4" fill="#860734"/>
        <circle cx="46" cy="48" r="4" fill="#860734"/>
        <rect x="26" y="14" width="12" height="10" rx="2" stroke="#860734" stroke-width="2" fill="#ffd700"/>
        <path d="M20 28 L24 32 L28 28" stroke="#ffd700" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `,
    title: 'ENVÍOS A TODO MÉXICO',
    desc: 'Entregas gratuitas en zona local. A toda la zona sur por solo el 5% del valor. Envíos nacionales mediante fleteras aliadas.'
  },
  {
    icon: `
      <svg width="64" height="64" fill="none" viewBox="0 0 64 64">
        <rect x="16" y="20" width="32" height="26" rx="3" stroke="#860734" stroke-width="3" fill="#fff9e6"/>
        <rect x="26" y="46" width="6" height="10" rx="2" fill="#860734"/>
        <rect x="36" y="46" width="6" height="10" rx="2" fill="#860734"/>
        <rect x="20" y="14" width="24" height="10" rx="3" stroke="#860734" stroke-width="2" fill="#ffd700"/>
        <circle cx="28" cy="28" r="2" fill="#ffd700"/>
        <circle cx="36" cy="28" r="2" fill="#ffd700"/>
        <path d="M28 34 Q32 38 36 34" stroke="#ffd700" stroke-width="2" fill="none"/>
      </svg>
    `,
    title: 'OFERTAS INCREÍBLES',
    desc: 'Descubre las mejores ofertas en nuestros modelos. Recibe garantía de 1 año al comprar cualquier producto.'
  },
  {
    icon: `
      <svg width="64" height="64" fill="none" viewBox="0 0 64 64">
        <rect x="12" y="28" width="40" height="18" rx="4" stroke="#860734" stroke-width="3" fill="#fff9e6"/>
        <rect x="16" y="16" width="32" height="18" rx="3" stroke="#860734" stroke-width="2" fill="#ffd700"/>
        <rect x="16" y="32" width="8" height="10" rx="2" fill="#860734"/>
        <rect x="40" y="32" width="8" height="10" rx="2" fill="#860734"/>
        <circle cx="32" cy="22" r="3" fill="#860734"/>
        <path d="M26 22 L32 28 L38 22" stroke="#860734" stroke-width="2" fill="none"/>
      </svg>
    `,
    title: '+20 AÑOS DE EXPERIENCIA',
    desc: 'Más de 20 años ofreciendo muebles de calidad a precios justos. Sucursales en Morelos con atención personalizada.'
  },
];
</script>

<style scoped>
.benefits-section {
  padding: 5rem 0;
  background: linear-gradient(135deg, #ffffff 0%, #fdfbff 50%, #f8f4fc 100%);
  position: relative;
  overflow: hidden;
}

.benefits-section::before {
  content: '';
  position: absolute;
  top: -10%;
  right: -5%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(134, 7, 52, 0.04) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.benefits-section::after {
  content: '';
  position: absolute;
  bottom: -15%;
  left: -8%;
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.06) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.section-title i {
  font-size: 0.85em;
  color: #ffd700;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.section-subtitle {
  color: #a0616f;
  font-size: clamp(1rem, 2vw, 1.2rem);
  font-weight: 500;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.benefit-card {
  opacity: 0;
  animation: fadeInUp 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  animation-delay: var(--delay, 0s);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-wrapper {
  background: linear-gradient(145deg, #ffffff 0%, #fffcfe 100%);
  border-radius: 24px;
  padding: 2.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 12px 40px rgba(134, 7, 52, 0.1),
    0 4px 12px rgba(134, 7, 52, 0.05);
  border: 2px solid rgba(134, 7, 52, 0.08);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, #860734 0%, #ffd700 50%, #860734 100%);
  background-size: 200% 100%;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.benefit-card:hover .card-wrapper {
  transform: translateY(-16px) scale(1.02);
  box-shadow:
    0 24px 60px rgba(134, 7, 52, 0.18),
    0 8px 24px rgba(255, 215, 0, 0.12);
  border-color: rgba(134, 7, 52, 0.15);
}

.benefit-card:hover .card-wrapper::before {
  transform: scaleX(1);
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.card-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 70%
  );
  transform: translateX(-100%) translateY(-100%) rotate(45deg);
  transition: transform 0.6s;
}

.benefit-card:hover .card-shine {
  transform: translateX(100%) translateY(100%) rotate(45deg);
}

.icon-container {
  position: relative;
  margin-bottom: 2rem;
  z-index: 2;
}

.icon-background {
  position: absolute;
  inset: -15px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.benefit-card:hover .icon-background {
  opacity: 1;
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.15); opacity: 1; }
}

.benefit-icon {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.benefit-card:hover .benefit-icon {
  transform: scale(1.1) rotate(-3deg);
}

.benefit-icon :deep(svg) {
  filter: drop-shadow(0 4px 8px rgba(134, 7, 52, 0.15));
}

.card-content {
  flex: 1;
}

.benefit-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #860734;
  margin-bottom: 1rem;
  letter-spacing: 0.5px;
  line-height: 1.3;
}

.benefit-desc {
  color: #5a3d52;
  font-size: 1.05rem;
  font-weight: 500;
  line-height: 1.7;
}

.trust-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #860734 0%, #a8084a 100%);
  color: #fff;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  box-shadow:
    0 8px 24px rgba(134, 7, 52, 0.3),
    inset 0 -2px 8px rgba(0, 0, 0, 0.2);
  margin: 0 auto;
  display: flex;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.trust-badge::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: slide-shine 3s ease-in-out infinite;
}

@keyframes slide-shine {
  0% { left: -100%; }
  50%, 100% { left: 200%; }
}

.trust-badge i {
  font-size: 1.5rem;
  animation: check-pulse 2s ease-in-out infinite;
}

@keyframes check-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

/* Responsive */
@media (max-width: 1200px) {
  .benefits-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.75rem;
  }
}

@media (max-width: 900px) {
  .benefits-section {
    padding: 4rem 0;
  }

  .section-header {
    margin-bottom: 3rem;
  }

  .benefits-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .card-wrapper {
    padding: 2rem 1.75rem;
  }

  .container {
    padding: 0 1rem;
  }

  .benefit-title {
    font-size: 1.25rem;
  }

  .benefit-desc {
    font-size: 1rem;
  }

  .trust-badge {
    font-size: 1rem;
    padding: 0.85rem 1.75rem;
  }
}

@media (max-width: 600px) {
  .benefits-section {
    padding: 3rem 0;
  }

  .section-title {
    flex-direction: column;
    gap: 0.5rem;
  }

  .section-header {
    margin-bottom: 2rem;
  }

  .benefits-grid {
    gap: 1.25rem;
  }

  .card-wrapper {
    padding: 1.75rem 1.25rem;
    border-radius: 18px;
  }

  .icon-container {
    margin-bottom: 1.5rem;
  }

  .benefit-icon {
    min-height: 64px;
  }

  .benefit-icon :deep(svg) {
    width: 56px;
    height: 56px;
  }

  .trust-badge {
    font-size: 0.95rem;
    padding: 0.75rem 1.5rem;
  }

  .trust-badge i {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .benefits-section {
    padding: 2rem 0;
  }

  .container {
    padding: 0 0.5rem;
  }

  .section-title {
    font-size: 1.3rem;
    gap: 0.4rem;
    flex-direction: column;
  }

  .section-header {
    margin-bottom: 1.2rem;
  }

  .section-subtitle {
    font-size: 0.95rem;
  }

  .benefits-grid {
    gap: 0.75rem;
  }

  .benefit-card {
    min-width: 0;
  }

  .card-wrapper {
    padding: 1.1rem 0.5rem;
    border-radius: 12px;
  }

  .icon-container {
    margin-bottom: 1rem;
  }

  .benefit-icon {
    min-height: 40px;
  }

  .benefit-icon :deep(svg) {
    width: 40px;
    height: 40px;
  }

  .benefit-title {
    font-size: 1.05rem;
    margin-bottom: 0.5rem;
  }

  .benefit-desc {
    font-size: 0.92rem;
  }

  .trust-badge {
    font-size: 0.85rem;
    padding: 0.5rem 1rem;
    border-radius: 30px;
    gap: 0.5rem;
  }

  .trust-badge i {
    font-size: 1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .benefit-card,
  .card-wrapper,
  .benefit-icon,
  .section-title i,
  .card-shine,
  .trust-badge::before,
  .trust-badge i,
  .icon-background {
    animation: none;
    transition: none;
  }

  .benefit-card {
    opacity: 1;
  }
}
</style>
