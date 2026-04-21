<template>


  <div class="admin-shell">


    <!-- Header -->


    <header class="admin-header">


      <div class="admin-header__inner">


        <div class="admin-header__brand">


          <i class="bi bi-shop"></i>


          <div>


            <h1>Mueblería Plaza Reforma</h1>


            <p>Panel de Administración</p>


          </div>


        </div>


        <button class="admin-logout" @click="handleLogout">


          <i class="bi bi-box-arrow-right"></i>


          Cerrar sesión


        </button>


      </div>


    </header>





    <!-- Navegación -->


    <nav class="admin-nav">


      <router-link to="/admin" class="admin-nav__item">


        <i class="bi bi-house-door"></i>


        <span>Muebles</span>


      </router-link>


      <router-link to="/admin-orders" class="admin-nav__item">


        <i class="bi bi-bag-check"></i>


        <span>Órdenes</span>


      </router-link>


      <router-link to="/customers" class="admin-nav__item">


        <i class="bi bi-people"></i>


        <span>Clientes</span>


      </router-link>


      <router-link to="/reports" class="admin-nav__item">


        <i class="bi bi-graph-up"></i>


        <span>Reportes</span>


      </router-link>


      <router-link to="/inventory-adjust" class="admin-nav__item">


        <i class="bi bi-boxes"></i>


        <span>Inventario</span>


      </router-link>


      <router-link to="/low-stock" class="admin-nav__item">


        <i class="bi bi-exclamation-triangle"></i>


        <span>Stock Bajo</span>


      </router-link>


    </nav>





    <!-- Contenido -->


    <main class="admin-main">


      <!-- Título de página -->


      <div class="admin-page-header" v-if="title">


        <div class="admin-page-header__left">


          <i v-if="icon" :class="`bi ${icon}`"></i>


          <div>


            <h2>{{ title }}</h2>


            <p v-if="subtitle">{{ subtitle }}</p>


          </div>


        </div>


        <div class="admin-page-header__actions">


          <slot name="actions" />


        </div>


      </div>





      <!-- Slot principal -->


      <slot />


    </main>


  </div>


</template>





<script setup>


import { useRouter } from 'vue-router';


import { removeToken } from '../config/AxiosConfig';





defineProps({


  title: String,


  subtitle: String,


  icon: String,


});





const router = useRouter();





function handleLogout() {


  removeToken();


  router.push('/login');


}


</script>





<style scoped>


/* ¢¢ Shell ¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢ */


.admin-shell {


  min-height: 100vh;


  background: var(--canvas, #F3F0EE);


  font-family: var(--font, 'Inter', Arial, sans-serif);


}





/* ¢¢ Header ¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢ */


.admin-header {


  position: sticky;


  top: 0;


  z-index: 100;


  background: #fff;


  border-bottom: 1px solid var(--border, rgba(20,20,19,.14));


}





.admin-header__inner {


  max-width: 1400px;


  margin: 0 auto;


  padding: 0 24px;


  height: 64px;


  display: flex;


  align-items: center;


  justify-content: space-between;


}





.admin-header__brand {


  display: flex;


  align-items: center;


  gap: 12px;


}





.admin-header__brand > i {


  font-size: 1.5rem;


  color: var(--ink, #141413);


}





.admin-header__brand h1 {


  font-size: 1rem;


  font-weight: 600;


  color: var(--ink, #141413);


  margin: 0;


  letter-spacing: -0.02em;


}





.admin-header__brand p {


  font-size: 0.75rem;


  color: var(--slate, #696969);


  margin: 0;


}





.admin-logout {


  display: flex;


  align-items: center;


  gap: 6px;


  padding: 8px 16px;


  border: 1px solid var(--border, rgba(20,20,19,.14));


  border-radius: 20px;


  background: transparent;


  color: var(--slate, #696969);


  font-size: 0.875rem;


  cursor: pointer;


  transition: all .15s;


}





.admin-logout:hover {


  background: var(--canvas, #F3F0EE);


  color: var(--ink, #141413);


}





/* ¢¢ Nav ¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢ */


.admin-nav {


  background: #fff;


  border-bottom: 1px solid var(--border, rgba(20,20,19,.14));


  display: flex;


  align-items: center;


  gap: 4px;


  padding: 0 24px;


  overflow-x: auto;


  max-width: 100%;


}





.admin-nav__item {


  display: flex;


  align-items: center;


  gap: 6px;


  padding: 14px 16px;


  font-size: 0.875rem;


  font-weight: 500;


  color: var(--slate, #696969);


  text-decoration: none;


  border-bottom: 2px solid transparent;


  white-space: nowrap;


  transition: color .15s, border-color .15s;


}





.admin-nav__item:hover {


  color: var(--ink, #141413);


}





.admin-nav__item.router-link-active {


  color: var(--ink, #141413);


  border-bottom-color: var(--ink, #141413);


}





/* ¢¢ Main ¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢ */


.admin-main {


  max-width: 1400px;


  margin: 0 auto;


  padding: 32px 24px;


}





/* ¢¢ Page Header ¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢ */


.admin-page-header {


  display: flex;


  align-items: center;


  justify-content: space-between;


  margin-bottom: 28px;


  gap: 16px;


  flex-wrap: wrap;


}





.admin-page-header__left {


  display: flex;


  align-items: center;


  gap: 12px;


}





.admin-page-header__left > i {


  font-size: 1.5rem;


  color: var(--ink, #141413);


}





.admin-page-header__left h2 {


  font-size: 1.25rem;


  font-weight: 600;


  color: var(--ink, #141413);


  margin: 0;


  letter-spacing: -0.02em;


}





.admin-page-header__left p {


  font-size: 0.8125rem;


  color: var(--slate, #696969);


  margin: 0;


}





.admin-page-header__actions {


  display: flex;


  align-items: center;


  gap: 8px;


  flex-wrap: wrap;


}





/* ¢¢ Responsive ¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢ */


@media (max-width: 768px) {


  .admin-header__inner { padding: 0 16px; }


  .admin-header__brand h1 { font-size: 0.875rem; }


  .admin-main { padding: 20px 16px; }


  .admin-nav { padding: 0 12px; }


}


</style>


