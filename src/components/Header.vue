<template>
  <section class="hero" aria-label="Bienvenida">
    <div class="hero__bg-shape" aria-hidden="true"></div>
    <div class="hero__bg-dots" aria-hidden="true"></div>

    <div class="hero__inner">
      <!-- Left: copy -->
      <div class="hero__copy">
        <span class="hero__eyebrow">Mueblería Plaza Reforma</span>
        <h1 class="hero__title">
          Muebles de calidad<br />
          <span class="hero__title-accent">para tu hogar</span>
        </h1>
        <p class="hero__subtitle">
          Diseño, durabilidad y estilo en cada pieza. Envío gratuito,
          crédito sin buró y atención personalizada.
        </p>

        <div class="hero__actions">
          <router-link to="/productos" class="hero__btn hero__btn--primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            Ver catálogo
          </router-link>
          <a :href="whatsappUrl" target="_blank" rel="noopener" class="hero__btn hero__btn--secondary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Contáctanos
          </a>
        </div>

        <div class="hero__stats" aria-label="Indicadores de confianza">
          <div class="hero__stat">
            <span class="hero__stat-value">15+</span>
            <span class="hero__stat-label">Años de experiencia</span>
          </div>
          <div class="hero__stat-divider" aria-hidden="true"></div>
          <div class="hero__stat">
            <span class="hero__stat-value">500+</span>
            <span class="hero__stat-label">Productos</span>
          </div>
          <div class="hero__stat-divider" aria-hidden="true"></div>
          <div class="hero__stat">
            <span class="hero__stat-value">100%</span>
            <span class="hero__stat-label">Clientes satisfechos</span>
          </div>
        </div>
      </div>

      <!-- Right: visual -->
      <div class="hero__visual" aria-hidden="true">
        <div class="hero__visual-card hero__visual-card--main">
          <svg class="hero__room-icon" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Floor -->
            <rect x="0" y="130" width="200" height="30" rx="4" fill="#E8DDD5"/>
            <!-- Sofa body -->
            <rect x="20" y="80" width="160" height="55" rx="12" fill="#860734"/>
            <!-- Sofa back -->
            <rect x="20" y="58" width="160" height="30" rx="10" fill="#6A0529"/>
            <!-- Sofa cushions -->
            <rect x="30" y="83" width="60" height="45" rx="8" fill="#A0093D"/>
            <rect x="110" y="83" width="60" height="45" rx="8" fill="#A0093D"/>
            <!-- Sofa legs -->
            <rect x="28" y="128" width="10" height="10" rx="3" fill="#5A0422"/>
            <rect x="162" y="128" width="10" height="10" rx="3" fill="#5A0422"/>
            <!-- Pillow left -->
            <rect x="35" y="88" width="28" height="22" rx="6" fill="#FFD700" opacity="0.9"/>
            <!-- Pillow right -->
            <rect x="137" y="88" width="28" height="22" rx="6" fill="#FFD700" opacity="0.9"/>
            <!-- Side table -->
            <rect x="168" y="100" width="28" height="30" rx="6" fill="#C4A882"/>
            <rect x="170" y="90" width="24" height="12" rx="4" fill="#D4B896"/>
            <!-- Lamp on table -->
            <rect x="178" y="68" width="4" height="22" fill="#B89A6E"/>
            <ellipse cx="180" cy="66" rx="10" ry="7" fill="#FFF3CD"/>
            <!-- Plant left -->
            <rect x="0" y="110" width="16" height="22" rx="4" fill="#8B7355"/>
            <ellipse cx="8" cy="106" rx="14" ry="18" fill="#5A8C3E" opacity="0.9"/>
            <ellipse cx="4" cy="98" rx="8" ry="12" fill="#4A7A2E"/>
            <ellipse cx="12" cy="96" rx="9" ry="13" fill="#6AAA44"/>
          </svg>
        </div>

        <div class="hero__visual-badge hero__visual-badge--1">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#860734" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
          <span>Envío gratis</span>
        </div>
        <div class="hero__visual-badge hero__visual-badge--2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#860734" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>Sin buró</span>
        </div>
      </div>
    </div>

    <!-- Scroll hint -->
    <div class="hero__scroll-hint" aria-hidden="true">
      <div class="hero__scroll-line"></div>
    </div>
  </section>
</template>

<script setup>
const whatsappUrl = "https://wa.me/7513960035?text=Hola,%20quiero%20informes%20sobre%20los%20productos.";
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 88vh;
  background: linear-gradient(150deg, #FAF7F4 0%, #F3ECEC 60%, #F5F0F3 100%);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Decorative background shapes */
.hero__bg-shape {
  position: absolute;
  top: -120px;
  right: -120px;
  width: 50px;
  height: 520px;
  background: radial-gradient(circle, rgba(134, 7, 52, 0.07) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.hero__bg-dots {
  position: absolute;
  bottom: 40px;
  left: 5%;
  width: 180px;
  height: 180px;
  background-image: radial-gradient(circle, rgba(134, 7, 52, 0.12) 1.5px, transparent 1.5px);
  background-size: 18px 18px;
  pointer-events: none;
  opacity: 0.7;
}

.hero__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 5rem 2rem 4rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  width: 100%;
}

/* --- Copy --- */
.hero__copy {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #860734;
  background: rgba(134, 7, 52, 0.08);
  padding: 0.4rem 1rem;
  border-radius: 999px;
  width: fit-content;
}

.hero__title {
  font-size: clamp(2.4rem, 5vw, 3.6rem);
  font-weight: 800;
  line-height: 1.1;
  color: #141413;
  letter-spacing: -0.03em;
}

.hero__title-accent {
  color: #860734;
  position: relative;
}

.hero__title-accent::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #860734, #FFD700);
  border-radius: 2px;
}

.hero__subtitle {
  font-size: 1.1rem;
  color: #5a4a52;
  line-height: 1.7;
  max-width: 480px;
}

/* --- Actions --- */
.hero__actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.9rem 1.8rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
}

.hero__btn--primary {
  background: linear-gradient(135deg, #860734 0%, #a8084a 100%);
  color: #fff;
  box-shadow: 0 8px 28px rgba(134, 7, 52, 0.32);
}

.hero__btn--primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 36px rgba(134, 7, 52, 0.42);
}

.hero__btn--secondary {
  background: #fff;
  color: #860734;
  border: 2px solid rgba(134, 7, 52, 0.25);
  box-shadow: 0 4px 16px rgba(134, 7, 52, 0.08);
}

.hero__btn--secondary:hover {
  border-color: #860734;
  background: rgba(134, 7, 52, 0.04);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(134, 7, 52, 0.15);
}

/* --- Stats --- */
.hero__stats {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding-top: 0.5rem;
}

.hero__stat {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.hero__stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #860734;
  line-height: 1;
}

.hero__stat-label {
  font-size: 0.75rem;
  color: #7a6570;
  font-weight: 500;
  white-space: nowrap;
}

.hero__stat-divider {
  width: 1px;
  height: 36px;
  background: rgba(134, 7, 52, 0.2);
  flex-shrink: 0;
}

/* --- Visual --- */
.hero__visual {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero__visual-card {
  background: #fff;
  border-radius: 28px;
  box-shadow:
    0 20px 60px rgba(134, 7, 52, 0.1),
    0 8px 24px rgba(0,0,0,0.06);
  padding: 2rem;
  width: 100%;
  max-width: 420px;
  aspect-ratio: 4/3;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(134, 7, 52, 0.08);
}

.hero__room-icon {
  width: 100%;
  height: auto;
  max-height: 200px;
}

/* Floating badges */
.hero__visual-badge {
  position: absolute;
  background: #fff;
  border-radius: 50px;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  font-weight: 700;
  color: #141413;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  white-space: nowrap;
  animation: float 4s ease-in-out infinite;
}

.hero__visual-badge--1 {
  top: 10%;
  right: -8px;
  animation-delay: 0s;
}

.hero__visual-badge--2 {
  bottom: 12%;
  left: -12px;
  animation-delay: 2s;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

/* Scroll hint */
.hero__scroll-hint {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
}

.hero__scroll-line {
  width: 2px;
  height: 40px;
  background: linear-gradient(to bottom, rgba(134, 7, 52, 0.5), transparent);
  margin: 0 auto;
  animation: scrollPulse 2s ease-in-out infinite;
}

@keyframes scrollPulse {
  0%, 100% { opacity: 1; transform: scaleY(1); }
  50% { opacity: 0.4; transform: scaleY(0.6); }
}

/* --- Responsive --- */
@media (max-width: 1024px) {
  .hero__inner {
    gap: 2.5rem;
    padding: 4rem 1.5rem 3rem;
  }
}

@media (max-width: 768px) {
  .hero {
    min-height: auto;
  }

  .hero__inner {
    grid-template-columns: 1fr;
    padding: 3.5rem 1.25rem 2.5rem;
    gap: 2.5rem;
  }

  .hero__title {
    font-size: clamp(2rem, 8vw, 2.8rem);
  }

  .hero__subtitle {
    font-size: 1rem;
  }

  .hero__visual {
    order: -1;
  }

  .hero__visual-card {
    max-width: 320px;
    border-radius: 20px;
  }

  .hero__visual-badge--1 {
    right: 0;
  }

  .hero__visual-badge--2 {
    left: 0;
  }

  .hero__scroll-hint {
    display: none;
  }
}

@media (max-width: 480px) {
  .hero__inner {
    padding: 2.5rem 1rem 2rem;
    gap: 2rem;
  }

  .hero__stats {
    gap: 1rem;
  }

  .hero__stat-value {
    font-size: 1.25rem;
  }

  .hero__actions {
    flex-direction: column;
  }

  .hero__btn {
    justify-content: center;
  }
}

@media (max-width: 375px) {
  .hero__inner {
    padding: 2rem 0.75rem 1.75rem;
  }

  .hero__title {
    font-size: 1.85rem;
  }

  .hero__subtitle {
    font-size: 0.92rem;
  }

  .hero__stat-value {
    font-size: 1.1rem;
  }

  .hero__stat-label {
    font-size: 0.68rem;
  }

  .hero__btn {
    font-size: 0.9rem;
    padding: 0.8rem 1.2rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__visual-badge,
  .hero__scroll-line {
    animation: none;
  }
}
</style>
