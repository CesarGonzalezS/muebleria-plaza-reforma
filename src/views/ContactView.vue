¯»¿<template>
  <div class="contact-view">
    <Navbar />
    <Header />

    <main>
      <!-- Título y subtítulo mejorado -->
      <section class="contact-header">
        <div class="container">
          <div class="header-content">
            <div class="header-icon">
              <i class="bi bi-question-circle"></i>
            </div>
            <h1>¿Tienes dudas?</h1>
            <p>Estamos aquí para ayudarte. Contáctanos por el medio que prefieras</p>
          </div>
        </div>
      </section>

      <!-- Contenido principal mejorado -->
      <div class="container contact-main">
        <!-- Columna del formulario -->
        <section class="contact-form-col">
            <ContactForm />
        </section>

        <!-- Columna de información -->
        <section class="contact-info-col">
          <div class="section-header">
          </div>

          <div class="info-cards">
            <div class="info-card">
              <div class="info-icon">
                <i class="bi bi-geo-alt-fill"></i>
              </div>
              <div class="info-content">
                <h3>Dirección</h3>
                <p>No Reelección Sn, Tetecala.<br> 62620 Tetecala, Morelos</p>
              </div>
            </div>

            <div class="info-card">
              <div class="info-icon">
                <i class="bi bi-telephone-fill"></i>
              </div>
              <div class="info-content">
                <h3>Teléfono</h3>
                <p><a href="tel:+523411223344">+52 751 396 0035</a></p>
              </div>
            </div>

            <div class="info-card">
              <div class="info-icon">
                <i class="bi bi-envelope-fill"></i>
              </div>
              <div class="info-content">
                <h3>Correo electrónico</h3>
                <p><a href="mailto:contacto@plazareforma.com">contacto@plazareforma.com</a></p>
              </div>
            </div>

            <div class="info-card">
              <div class="info-icon">
                <i class="bi bi-clock-fill"></i>
              </div>
              <div class="info-content">
                <h3>Horario</h3>
                <p>Lun - Sáb: 8:00 AM - 8:00 PM<br>Dom: 8:00 AM - 8:00 PM</p>
              </div>
            </div>
          </div>

          <!-- Mapa -->
          <div class="map-card">
            <h3><i class="bi bi-map"></i> Encuéntranos</h3>
            <div class="map-container">

              <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1382.2723339199551!2d-99.39990252639842!3d18.728819667257643!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85cdcfbaf63ba957%3A0x93f721af2123d9fb!2sMuebler%C3%ADa%20Plaza%20Reforma%20S.A.%20de%20C.V.!5e1!3m2!1ses!2smx!4v1761155962689!5m2!1ses!2smx" 
              width="100%"
              height="300"
              style="border:0;" 
              allowfullscreen="" 
              loading="lazy" 
              referrerpolicy="no-referrer-when-downgrade">
            </iframe>
              
            </div>
          </div>
        </section>
      </div>
    </main>

    <Footer />

    <!-- WhatsApp flotante mejorado -->
    <a
      :href="whatsAppUrl"
      class="whatsapp-float"
      target="_blank"
      aria-label="WhatsApp"
    >
      <i class="bi bi-whatsapp"></i>
      <span class="whatsapp-tooltip">¡Chatea con nosotros!</span>
    </a>
  </div>
</template>

<script setup>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import ContactForm from '../components/ContactForm.vue';
import Navbar from '../components/Navbar.vue';

const whatsAppUrl = "https://wa.me/7513960035?text=Hola,%20quiero%20informes%20de%20muebles";
</script>

<style scoped>
* { box-sizing: border-box; }

.contact-view {
  width: 100%;
  overflow-x: hidden;
  background: #faf7f4;
}

/* Header */
.contact-header {
  position: relative;
  background: linear-gradient(135deg, #860734 0%, #a91d4d 100%);
  padding: 4rem 1.5rem 4.5rem;
  overflow: hidden;
}

.contact-header::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.15;
}

.header-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.header-icon {
  width: 52px;
  height: 52px;
  margin: 0 auto 1.25rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.625rem;
  color: #ffffff;
}

.contact-header h1 {
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 0.75rem;
  letter-spacing: -0.03em;
  line-height: 1.1;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
}

.contact-header p {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  line-height: 1.65;
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.contact-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2.5rem;
  padding-bottom: 0;
  position: relative;
  z-index: 2;
  align-items: start;
}

.contact-form-col,
.contact-info-col {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.section-header { display: none; }

/* Info Cards */
.info-cards {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-card {
  background: #ffffff;
  padding: 1.125rem 1.375rem;
  border-radius: 14px;
  border: 1px solid rgba(134, 7, 52, 0.07);
  box-shadow: 0 2px 12px rgba(134, 7, 52, 0.04);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
  cursor: default;
}

.info-card:hover {
  box-shadow: 0 8px 24px rgba(134, 7, 52, 0.10);
  transform: translateY(-2px);
}

.info-icon {
  width: 44px;
  height: 44px;
  min-width: 44px;
  background: rgba(134, 7, 52, 0.08);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #860734;
  font-size: 1.2rem;
}

.info-content h3 {
  color: #141413;
  font-size: 0.75rem;
  font-weight: 600;
  margin: 0 0 0.2rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.info-content p {
  color: #4b5563;
  font-size: 0.9375rem;
  margin: 0;
  line-height: 1.5;
}

.info-content a {
  color: #860734;
  text-decoration: none;
  font-weight: 500;
}

.info-content a:hover { text-decoration: underline; }

/* Mapa */
.map-card {
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid rgba(134, 7, 52, 0.07);
  box-shadow: 0 2px 12px rgba(134, 7, 52, 0.04);
  overflow: hidden;
}

.map-card h3 {
  color: #141413;
  font-size: 0.9375rem;
  font-weight: 600;
  padding: 1.125rem 1.375rem 0.75rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid rgba(134, 7, 52, 0.07);
}

.map-card h3 i { color: #860734; }

.map-container { display: block; }
.map-container iframe { display: block; width: 100%; }

/* WhatsApp */
.whatsapp-float {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 54px;
  height: 54px;
  background: #25d366;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.625rem;
  box-shadow: 0 4px 18px rgba(37, 211, 102, 0.4);
  z-index: 1000;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-decoration: none;
}

.whatsapp-float:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 24px rgba(37, 211, 102, 0.55);
}

.whatsapp-float:hover .whatsapp-tooltip {
  opacity: 1;
  transform: translateX(-8px);
  visibility: visible;
}

.whatsapp-tooltip {
  position: absolute;
  right: 64px;
  background: #141413;
  color: white;
  padding: 0.4rem 0.875rem;
  border-radius: 8px;
  white-space: nowrap;
  font-size: 0.875rem;
  font-weight: 500;
  opacity: 0;
  transform: translateX(0);
  transition: all 0.2s ease;
  visibility: hidden;
}

.whatsapp-tooltip::after {
  content: '';
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  border: 6px solid transparent;
  border-left-color: #141413;
  border-right-width: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .contact-main { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .contact-header { padding: 3rem 1.25rem 3.5rem; }
  .contact-main { margin-top: 2rem; }
}

@media (max-width: 480px) {
  .contact-header { padding: 2.5rem 1rem 3rem; }
  .container { padding: 0 0.75rem; }
  .contact-main { gap: 1rem; }
  .info-card { padding: 1rem; }
  .whatsapp-float { width: 48px; height: 48px; bottom: 1rem; right: 1rem; font-size: 1.375rem; }
  .whatsapp-tooltip { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .info-card, .whatsapp-float { transition: none; }
}
</style>
