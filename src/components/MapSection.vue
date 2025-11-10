<template>
  <section class="map-section">
    <div class="container d-flex justify-content-center align-items-center">
      <div class="map-card shadow">
        <div class="map-icon mx-auto mb-2">
          <!-- Bootstrap icon (o FontAwesome, según tengas) -->
          <i class="bi bi-geo-alt-fill"></i>
        </div>
        <h3 class="map-title">¿Dónde estamos?</h3>
        <p class="map-subtitle">Ven a conocer nuestra sucursal o contáctanos para envío a domicilio.</p>
        <div class="map-frame-wrap">
          <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d290.5875214312986!2d-99.39904287960339!3d18.728494685995052!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85cdcfbaf63ba957%3A0x93f721af2123d9fb!2sMuebler%C3%ADa%20Plaza%20Reforma%20S.A.%20de%20C.V.!5e1!3m2!1ses!2smx!4v1761155359709!5m2!1ses!2smx"
                  width="100%"
                  height="340"
                  style="border:0;"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="strict-origin-when-cross-origin"
                  title="Ubicación de Mueblería Plaza Reforma en Google Maps"></iframe>
        </div>
        <div class="d-flex justify-content-center mt-3">
          <a href="https://goo.gl/maps/9m4Mu6cA6Xw8odtn6" target="_blank" class="btn btn-outline-primary map-btn">
            <i class="bi bi-geo-alt"></i> Ver en Google Maps
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import './assets/styles.css';
</script>

<style scoped>

</style>
