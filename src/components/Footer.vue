<template>
  <footer class="footer-section">
    <div class="container footer-row">
      <!-- Dirección y descripción breve -->
      <div class="footer-col footer-brand">
        <h4><i class="fas fa-couch"></i> No Reelección Sn, Tetecala, 62620 Tetecala, Mor.</h4>
        <p><i class="fas fa-map-marker-alt"></i> Mueblería Plaza Reforma S.A. de C.V.</p>
        <p><i class="fas fa-phone"></i>751 396 0035</p>
        <p><i class="fas fa-clock"></i> Lunes a Domingo <span class="footer-horario">(8:00 AM - 8:00 PM)</span></p>
      </div>
      <!-- Beneficios y Métodos de pago -->
      <div class="footer-col footer-benefits">
        <h4><i class="fas fa-star"></i> Beneficios</h4>
        <ul>
          <li><i class="fas fa-couch"></i> Cobertura de entrega</li>
          <li><i class="fas fa-truck"></i> Entrega a domicilio programada</li>
          <li><i class="fas fa-credit-card"></i> Tarjeta, efectivo y meses sin intereses</li>
          <li><i class="fas fa-hand-holding-heart"></i> Garantía de satisfacción</li>
        </ul>
        <div class="payment-section">
          <span class="payment-label"><i class="fas fa-shipping-fast"></i> Métodos de pago:</span>
          <div class="payment-icons">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" title="Visa" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="MasterCard" title="MasterCard" />
          </div>
        </div>
      </div>
      <!-- Descripción -->
      <div class="footer-col footer-description">
        <h4 class="footer-title">
          <i class="fas fa-lightbulb"></i> Diseña la vida que tú quieras
        </h4>
        <p class="footer-text">
          La mueblería de la reforma es la marca mexicana de muebles y accesorios de diseño.<br>
          Compra rápido, fácil y seguro. Sofás, sillas, mesas, escritorios, cómodas, burós, camas, colchones, lámparas y accesorios en diferentes estilos.<br>
          Proponemos diseños simples y modernos adaptados a tu espacio.
        </p>
        <p class="footer-mision">
          <strong>Nuestra misión:</strong> Empoderarte a seguir soñando y diseñar la vida que tú quieras.
        </p>
      </div>
      <!-- Redes sociales -->
      <div class="footer-col footer-social">
        <h4><i class="fas fa-share-alt"></i> Síguenos</h4>
        <div class="footer-social-links">
          <a href="#" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
          <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
          <a href="#" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
        </div>
        <div class="footer-ayuda">
          <h4><i class="fas fa-question-circle"></i> Ayuda</h4>
          <a href="tel:751 396 0035"><i class="fas fa-phone"></i> 751 396 0035</a>
        </div>
      </div>
    </div>
    <!-- Copyright centrado abajo -->
    <div class="footer-copyright">
      &copy; {{ new Date().getFullYear() }} Mueblería Plaza Reforma. Todos los derechos reservados.
    </div>
  </footer>
</template>


<script setup>
</script>

<style scoped>.footer-section {
  background: linear-gradient(120deg, #860734 80%, #440224 100%);
  color: #fff;
  padding: 3rem 0 1rem 0;
  border-radius: 1.5rem 1.5rem 0 0;
  box-shadow: 0 -4px 24px #86073426;
  font-size: 1.07rem;
  margin-top: 3rem;
}

.footer-row {
  display: flex;
  flex-direction: row;      /* <-- siempre en fila en desktop */
  flex-wrap: nowrap;        /* <-- no saltes a otra fila en desktop */
  gap: 1.5rem;
  justify-content: space-between;
  align-items: stretch;     /* <-- iguala la altura de las columnas */
  width: 100%;
}

/* Haz todas las columnas iguales, pero la descripción un poco más ancha */
.footer-col {
  flex: 1 1 240px;
  min-width: 210px;
  max-width: 340px;
  margin-bottom: 1.5rem;
  padding: 1.2rem 1rem 0.8rem 1rem;
  border-radius: 18px;
  background: rgba(255,255,255,0.03);
  box-shadow: 0 2px 18px #86073413;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

/* Solo la descripción: más ancha */
.footer-description {
  flex: 2.2 1 390px !important;
  min-width: 260px;
  max-width: 600px;
  font-size: 1rem;
  line-height: 1.7;
  color: #ffe6f0;
}

.footer-title {
  font-size: 1.2rem;
  margin-bottom: 0.8rem;
  position: relative;
  display: inline-block;
}

.footer-title i {
  color: #ffd700;
  margin-right: 0.4rem;
}

.footer-text {
  margin-bottom: 0.5rem;
}

.footer-mision {
  font-weight: 500;
  font-size: 0.95rem;
  color: #ffe6f0;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  border-left: 4px solid #ffd700;
}

.payment-icons {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 0.4em;
  flex-wrap: wrap;
}

.payment-icons img {
  background: #fff;
  border-radius: 7px;
  box-shadow: 0 1px 6px #0002;
  padding: 3px 8px;
  height: 38px;              /* <-- TAMAÑO MÁXIMO! */
  max-width: 70px;           /* <-- Ajusta el máximo ancho */
  object-fit: contain;
  transition: box-shadow 0.2s, transform 0.16s;
  border: 1px solid #eee;
  margin-bottom: 3px;
}

.payment-icons img:hover {
  box-shadow: 0 2px 16px #ffd70044;
  transform: scale(1.09) rotate(-2deg);
}


@media (max-width: 1150px) {
  .footer-row {
    flex-wrap: wrap;          /* Apila columnas en móvil/tablet */
  }
  .footer-col {
    min-width: 220px;
    max-width: 95vw;
  }
  .footer-description {
    max-width: 98vw;
  }
}
@media (max-width: 850px) {
  .footer-row {
    flex-direction: column;
    align-items: center;
  }
  .footer-col {
    width: 100%;
    max-width: 600px;
    margin-bottom: 1.3rem;
    text-align: center;
  }
  .footer-description {
    width: 100%;
    max-width: 99vw;
    font-size: 0.99rem;
  }
}
@media (max-width: 480px) {
  .footer-section {
    padding: 1.2rem 0 0.5rem 0;
    border-radius: 1rem 1rem 0 0;
    font-size: 0.97rem;
  }
  .footer-row {
    flex-direction: column;
    gap: 0.7rem;
    align-items: stretch;
    padding: 0 0.2rem;
  }
  .footer-col {
    min-width: 0;
    max-width: 100vw;
    width: 100%;
    padding: 0.8rem 0.5rem 0.5rem 0.5rem;
    margin-bottom: 0.7rem;
    font-size: 0.97rem;
    border-radius: 12px;
    text-align: left;
  }
  .footer-description {
    min-width: 0;
    max-width: 100vw;
    font-size: 0.95rem;
    padding: 0.8rem 0.5rem 0.5rem 0.5rem;
  }
  .footer-col h4 {
    font-size: 1.05rem;
    margin-bottom: 0.5rem;
  }
  .footer-col p,
  .footer-col li,
  .footer-col span,
  .footer-col a {
    font-size: 0.95rem;
  }
  .payment-icons img {
    height: 28px;
    max-width: 50px;
    padding: 2px 5px;
  }
  .footer-social-links {
    justify-content: flex-start;
    gap: 0.7rem;
  }
  .footer-social-links a {
    font-size: 1.25rem;
    padding: 0.2rem;
  }
  .footer-ayuda h4 {
    font-size: 1rem;
    margin-bottom: 0.3rem;
  }
  .footer-ayuda a {
    font-size: 0.93rem;
    display: block;
    margin-bottom: 0.2rem;
  }
  .footer-copyright {
    font-size: 0.89rem;
    margin-top: 1.1rem;
    padding: 0 0.2rem;
  }
}

.footer-copyright {
  text-align: center;
  margin-top: 2rem;
  font-size: 1rem;
  color: #ffe6f0;
}
</style>
