<template>
  <section class="cta-section">
    <div class="cta-container">
      <div class="cta-card shadow">
        <h3 class="cta-title">¿Listo para renovar tu hogar?</h3>
        <p class="cta-subtitle">Contáctanos y obtén tu cotización sin compromiso.</p>
        <a
          href="https://wa.me/7513960035"
          class="cta-btn"
          target="_blank"
        >
          <i class="fab fa-whatsapp"></i>
          Escríbenos por WhatsApp
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import './assets/styles.css';
</script>

<style scoped>
.cta-section {
  padding: 3rem 1rem;
  background: linear-gradient(135deg, #fdfbff 0%, #f8f4fc 100%);
  position: relative;
  overflow: hidden;
}

.cta-section::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.08) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.cta-container {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.cta-card {
  background: linear-gradient(135deg, #860734 0%, #a91d4d 100%);
  border-radius: 24px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow:
    0 20px 60px rgba(134, 7, 52, 0.25),
    0 8px 24px rgba(134, 7, 52, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.cta-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.1;
  pointer-events: none;
}

.cta-title {
  color: #ffffff;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  margin: 0 0 1rem;
  letter-spacing: -0.02em;
  position: relative;
}

.cta-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: clamp(1rem, 2vw, 1.2rem);
  margin: 0 0 2rem;
  font-weight: 500;
  line-height: 1.6;
  position: relative;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: #25d366;
  color: #ffffff;
  padding: 1rem 2.5rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 700;
  text-decoration: none;
  box-shadow:
    0 8px 24px rgba(37, 211, 102, 0.4),
    0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.cta-btn i {
  font-size: 1.5rem;
}

.cta-btn:hover {
  background: #20bd5a;
  transform: translateY(-4px) scale(1.05);
  box-shadow:
    0 12px 32px rgba(37, 211, 102, 0.5),
    0 6px 16px rgba(0, 0, 0, 0.3);
}

.cta-btn:active {
  transform: translateY(-2px) scale(1.02);
}

/* Responsive */
@media (max-width: 768px) {
  .cta-section {
    padding: 2.5rem 1rem;
  }

  .cta-card {
    padding: 2.5rem 1.5rem;
    border-radius: 20px;
  }

  .cta-btn {
    padding: 0.9rem 2rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .cta-section {
    padding: 1.5rem 0.5rem; /* Reducir padding para pantallas pequeñas */
  }

  .cta-card {
    padding: 2rem 1rem; /* Ajustar padding interno */
    border-radius: 16px; /* Reducir el radio de borde */
  }

  .cta-title {
    font-size: 1.5rem; /* Reducir tamaño de fuente del título */
  }

  .cta-subtitle {
    font-size: 0.9rem; /* Reducir tamaño de fuente del subtítulo */
    margin-bottom: 1.5rem; /* Ajustar margen inferior */
  }

  .cta-btn {
    padding: 0.8rem 1.5rem; /* Reducir padding del botón */
    font-size: 0.9rem; /* Reducir tamaño de fuente del botón */
  }

  .cta-btn i {
    font-size: 1.2rem; /* Ajustar tamaño del ícono */
  }
}
</style>
