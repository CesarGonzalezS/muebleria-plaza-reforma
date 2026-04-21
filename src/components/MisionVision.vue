¯»¿<template>
  <section class="mision-vision-section">
    <div class="container mision-vision-row">
      <div class="mv-card mv-mision">
        <div class="mv-icon"><i class="bi bi-bullseye"></i></div>
        <h3>Misión</h3>
        <p>
          Nuestra misión es ofrecer muebles de alta calidad, funcionales y con diseño ºnico, que mejoren la vida de nuestros clientes y creen espacios inolvidables en sus hogares y oficinas.
        </p>
      </div>
      <div class="mv-card mv-vision">
        <div class="mv-icon"><i class="bi bi-eye"></i></div>
        <h3>Visión</h3>
        <p>
          Ser la marca de referencia en muebles a nivel nacional, reconocida por la innovación, excelencia en el servicio y compromiso con la satisfacción total de nuestros clientes.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
// Sin lógica extra por ahora
</script>

<style scoped>
.mision-vision-section {
  background: linear-gradient(120deg, #faf6fa 80%, #f7e6ef 100%);
  border-radius: 24px;
  box-shadow: 0 6px 28px #8607340a;
  margin-bottom: 2.7rem;
  padding: 2.2rem 0 2.7rem 0;
}

.mision-vision-row {
  display: flex;
  justify-content: center;
  gap: 2.6rem;
  flex-wrap: wrap;
}

.mv-card {
  background: var(--white);
  border-radius: 20px;
  box-shadow: 0 2px 24px #86073413;
  max-width: 410px;
  min-width: 260px;
  flex: 1 1 330px;
  padding: 2rem 2.1rem 1.4rem 2.1rem;
  text-align: center;
  border: 1.5px solid #ffe4f8;
  transition: transform 0.14s, box-shadow 0.14s;
  position: relative;
}

.mv-card:hover {
  transform: translateY(-7px) scale(1.03);
  box-shadow: 0 7px 28px #8607341b;
  border: 1.5px solid #ffd70055;
  z-index: 2;
}

.mv-icon {
  font-size: 2.7rem;
  color: #860734;
  background: linear-gradient(135deg, #ffd70022 40%, #fff 100%);
  border-radius: 50%;
  width: 62px;
  height: 62px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.2rem auto;
  box-shadow: 0 2px 9px #ffd70013;
}

.mv-card h3 {
  color: #860734;
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
}

.mv-card p {
  color: #412140;
  font-size: 1.06rem;
  font-weight: 500;
  line-height: 1.55;
}

@media (max-width: 800px) {
  .mision-vision-row {
    flex-direction: column;
    gap: 1.2rem;
    align-items: center;
  }
  .mv-card {
    max-width: 95vw;
    min-width: 180px;
    padding: 1.1rem 0.7rem;
  }
  .mv-icon { width: 44px; height: 44px; font-size: 1.8rem; margin-bottom: 0.7rem; }
  .mv-card h3 { font-size: 1.04rem; }
  .mv-card p { font-size: 0.93rem; }
}
</style>
