import { createRouter, createWebHistory } from 'vue-router';

// Lazy loading para todas las vistas - mejora el initial bundle size
const HomeView = () => import('../views/HomeView.vue');
const ProductsView = () => import('../views/ProductsView.vue');
const ProductDetail = () => import('../components/ProductDetail.vue');
const ContactView = () => import('../views/ContactView.vue');
const LoginView = () => import('../views/LoginView.vue');
const AdminDashboard = () => import('../views/AdminDashboard.vue');
const NotFound = () => import('../views/NotFound.vue');

const routes = [
  { path: '/', component: HomeView, meta: { title: 'Inicio' } },
  { path: '/productos', name: 'ProductosList', component: ProductsView, meta: { title: 'Productos' } },
  { path: '/producto/:id', component: ProductDetail, name: 'ProductoDetalle', meta: { title: 'Detalle del Producto' } },
  { path: '/contacto', component: ContactView, meta: { title: 'Contacto' } },
  { path: '/login', component: LoginView, meta: { title: 'Iniciar Sesión' } },
  { path: '/admin', component: AdminDashboard, meta: { requiresAuth: true, title: 'Panel de Administración' } },
  {
    path: '/productos/:categoria',
    name: 'Productos',
    component: ProductsView,
    props: true,
    meta: { title: 'Productos por Categoría' }
  },
  { path: '/:pathMatch(.*)*', component: NotFound, meta: { title: 'Página no encontrada' } }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Scroll behavior mejorado para mejor UX
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else if (to.hash) {
      return { el: to.hash, behavior: 'smooth' };
    } else {
      return { top: 0, behavior: 'smooth' };
    }
  },
});

router.beforeEach((to, from, next) => {
  // Actualizar título de la página
  document.title = to.meta.title ? `${to.meta.title} - Mueblería Plaza Reforma` : 'Mueblería Plaza Reforma';

  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else if (to.path.startsWith('/admin') && userRole !== 'admin') {
    next('/');
  } else {
    next();
  }
});

export default router;
