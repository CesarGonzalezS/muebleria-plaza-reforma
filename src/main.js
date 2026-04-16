import { createApp } from 'vue';
import App from './App.vue';
import scrollAnimate from './directives/v-scroll-animate';
import router from './router';
import './assets/styles.css';
import './assets/compatibility.css';

const app = createApp(App);
app.directive('scroll-animate', scrollAnimate);
app.use(router).mount('#app');
