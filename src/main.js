import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import scrollAnimate from './directives/v-scroll-animate';
import router from './router';
import { initSecurityProtections } from './config/security';
import './assets/styles.css';
import './assets/compatibility.css';
import './assets/admin.css';

// Inicializar protecciones de seguridad
initSecurityProtections({
  detectDevTools: true,
  disableConsole: true,
  protectGlobals: true,
  disableRightClick: false, // Cambiar a true si lo deseas
  disableDevToolsShortcuts: false, // Cambiar a true si lo deseas
});

const app = createApp(App);
const pinia = createPinia();

app.directive('scroll-animate', scrollAnimate);
app.use(pinia);
app.use(router);

// Initialize store on app start
import { useMainStore } from './stores/main';
import { useFavoritesStore } from './stores/favoritesStore';
const mainStore = useMainStore();
mainStore.init().catch(() => {
  // Error de inicialización silencioso
});
useFavoritesStore().load();

app.mount('#app');
