<template>
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
            <h1>¿Tienes dudas?</h1>
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
      <span class="whatsapp-tooltip">¡Chatea con nosotros!</span>
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
/* Reset y variables */
* {
  box-sizing: border-box;
}

.contact-view {
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
}

/* Header mejorado */
.contact-header {
  background: linear-gradient(135deg, #860734 0%, #a91d4d 100%);
  padding: 4rem 1rem 5rem;
  position: relative;
  overflow: hidden;
}

.contact-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.1;
}

.header-content {
  text-align: center;
  color: white;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.header-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  border: 3px solid rgba(255, 255, 255, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.contact-header h1 {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  margin: 0 0 1rem;
  text-shadow: 0 2px 10px rgb(255, 255, 255);
}

.contact-header p {
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  opacity: 0.95;
  margin: 0;
  line-height: 1.6;
}

/* Main container */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.contact-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: -3rem;
  padding-bottom: 4rem;
  position: relative;
  z-index: 2;
}

/* Secciones */
.contact-form-col,
.contact-info-col {
  display: flex;
  flex-direction: column;
  gap: 7rem; /* Reducido de 7rem a 2rem */
}

.section-header {
  text-align: center;
  margin-bottom: 1rem;
}

.section-header i {
  font-size: 2.5rem;
  color: #860734;
  margin-bottom: 0.5rem;
  display: block;
}

.section-header h2 {
  color: #860734;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  margin: 0 0 0.5rem;
}

.section-header p {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
}

/* Tarjetas */
.form-card {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(134, 7, 52, 0.1);
  border: 1px solid rgba(134, 7, 52, 0.05);
}

.info-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-card {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(134, 7, 52, 0.08);
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: all 0.3s;
  border: 1px solid rgba(134, 7, 52, 0.05);
}

.info-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(134, 7, 52, 0.15);
}

.info-icon {
  width: 50px;
  height: 50px;
  min-width: 50px;
  background: linear-gradient(135deg, #860734 0%, #a91d4d 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 4px 15px rgba(134, 7, 52, 0.3);
}

.info-content {
  flex: 1;
}

.info-content h3 {
  color: #860734;
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
}

.info-content p {
  color: #4b5563;
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.6;
}

.info-content a {
  color: #860734;
  text-decoration: none;
  transition: color 0.2s;
  font-weight: 600;
}

.info-content a:hover {
  color: #a91d4d;
  text-decoration: underline;
}

/* Mapa */
.map-card {
  margin-top: -6rem; /* Ajustado para mover hacia arriba */
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 10px 10px rgba(134, 7, 52, 0.1);
  border: 1px solid rgba(134, 7, 52, 0.05);
}

.map-card h3 {
  color: #860734;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.map-container {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.map-container iframe {
  display: block;
  width: 100%;
}

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

/* Responsive */
@media (max-width: 1024px) {
  .contact-main {
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-top: -2rem;
  }

  .contact-form-col,
  .contact-info-col {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .contact-header {
    padding: 3rem 1rem 4rem;
  }

  .header-icon {
    width: 70px;
    height: 70px;
    font-size: 2rem;
  }

  .contact-main {
    gap: 1.5rem;
    margin-top: -1.5rem;
    padding-bottom: 3rem;
  }

  .info-cards {
    gap: 0.75rem;
  }

  .info-card {
    padding: 1.25rem;
  }

  .info-icon {
    width: 45px;
    height: 45px;
    min-width: 45px;
    font-size: 1.3rem;
  }

  .map-card {
    padding: 1rem;
  }
}

@media (max-width: 640px) {
  .contact-header {
    padding: 2.5rem 1rem 3.5rem;
  }

  .header-content h1 {
    font-size: 1.75rem;
  }

  .header-content p {
    font-size: 0.95rem;
  }

  .contact-main {
    gap: 1.25rem;
    padding-bottom: 2.5rem;
  }

  .section-header h2 {
    font-size: 1.5rem;
  }

  .info-card {
    padding: 1rem;
    border-radius: 12px;
  }

  .info-content h3 {
    font-size: 1rem;
  }

  .info-content p {
    font-size: 0.9rem;
  }

  .map-card h3 {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .contact-header {
    padding: 2rem 0.75rem 3rem;
  }

  .header-icon {
    width: 60px;
    height: 60px;
    font-size: 1.75rem;
    margin-bottom: 1rem;
  }

  .header-content h1 {
    font-size: 1.5rem;
    margin-bottom: 0.75rem;
  }

  .header-content p {
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .container {
    padding: 0 0.5rem;
  }

  .contact-main {
    gap: 1rem;
    margin-top: -1rem;
    padding-bottom: 2rem;
  }

  .section-header i {
    font-size: 2rem;
  }

  .section-header h2 {
    font-size: 1.3rem;
  }

  .section-header p {
    font-size: 0.9rem;
  }

  .info-cards {
    gap: 0.65rem;
  }

  .info-card {
    padding: 0.85rem;
    border-radius: 10px;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .info-icon {
    width: 42px;
    height: 42px;
    min-width: 42px;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }

  .info-content h3 {
    font-size: 0.95rem;
    margin-bottom: 0.35rem;
  }

  .info-content p {
    font-size: 0.85rem;
    line-height: 1.5;
  }

  .info-content a {
    font-size: 0.85rem;
  }

  .map-card {
    padding: 1.25rem;
    border-radius: 12px;
  }

  .map-card h3 {
    font-size: 1rem;
    margin-bottom: 0.75rem;
  }

  .map-container {
    border-radius: 8px;
  }

  .map-container iframe {
    height: 250px;
  }

  .whatsapp-float {
    width: 50px;
    height: 50px;
    bottom: 16px;
    right: 16px;
  }

  .whatsapp-float i {
    font-size: 1.5rem;
  }

  .whatsapp-tooltip {
    display: none;
  }
}

/* Accesibilidad */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
