import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import scrollAnimate from './directives/v-scroll-animate';
import router from './router';
import './assets/styles.css';
import './assets/compatibility.css';
import './assets/admin.css';

const app = createApp(App);
const pinia = createPinia();

app.directive('scroll-animate', scrollAnimate);
app.use(pinia);
app.use(router);

// Initialize store on app start
import { useMainStore } from './stores/main';
const mainStore = useMainStore();
mainStore.init().catch(e => console.error('[App] Init error:', e));

app.mount('#app');
