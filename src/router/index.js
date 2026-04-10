import { createRouter, createWebHistory } from 'vue-router';

// Lazy loading para todas las vistas - mejora el initial bundle size
const HomeView = () => import('../views/HomeView.vue');
const ProductsView = () => import('../views/ProductsView.vue');
const ProductDetail = () => import('../components/ProductDetail.vue');
const ContactView = () => import('../views/ContactView.vue');
const LoginView = () => import('../views/LoginView.vue');
const RegisterView = () => import('../views/RegisterView.vue');
const ChangePasswordView = () => import('../views/ChangePasswordView.vue');
const ForgotPasswordView = () => import('../views/ForgotPasswordView.vue');
const ResetPasswordView = () => import('../views/ResetPasswordView.vue');
const ProfileView = () => import('../views/ProfileView.vue');
const AuthTestView = () => import('../views/AuthTestView.vue');
const APITestView = () => import('../views/APITestView.vue');
const ProductsListView = () => import('../views/ProductsListView.vue');
const ProductDetailView = () => import('../views/ProductDetailView.vue');
const ProductManagerView = () => import('../views/ProductManagerView.vue');
const LowStockView = () => import('../views/LowStockView.vue');
const InventoryMovementsView = () => import('../views/InventoryMovementsView.vue');
const InventoryAdjustView = () => import('../views/InventoryAdjustView.vue');
const CartView = () => import('../views/CartView.vue');
const MyOrdersView = () => import('../views/MyOrdersView.vue');
const OrderDetailView = () => import('../views/OrderDetailView.vue');
const ReportsView = () => import('../views/ReportsView.vue');
const AdminOrdersView = () => import('../views/AdminOrdersView.vue');
const AdminDashboard = () => import('../views/AdminDashboard.vue');
const NotFound = () => import('../views/NotFound.vue');

const routes = [
  { path: '/', component: HomeView, meta: { title: 'Inicio' } },
  { path: '/productos', name: 'ProductosList', component: ProductsView, meta: { title: 'Productos' } },
  { path: '/producto/:id', component: ProductDetail, name: 'ProductoDetalle', meta: { title: 'Detalle del Producto' } },
  { path: '/contacto', component: ContactView, meta: { title: 'Contacto' } },
  { path: '/login', component: LoginView, meta: { title: 'Iniciar Sesión' } },
  { path: '/register', component: RegisterView, meta: { title: 'Crear Cuenta' } },
  { path: '/forgot-password', component: ForgotPasswordView, meta: { title: 'Recuperar Contraseña' } },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPasswordView, meta: { title: 'Resetear Contraseña' } },
  { path: '/change-password', component: ChangePasswordView, meta: { requiresAuth: true, title: 'Cambiar Contraseña' } },
  { path: '/profile', component: ProfileView, meta: { requiresAuth: true, title: 'Mi Perfil' } },
  { path: '/auth-test', component: AuthTestView, meta: { title: 'Test de Autenticación' } },
  { path: '/api-test', component: APITestView, meta: { requiresAuth: true, title: 'Test de APIs' } },
  { path: '/productos-lista', component: ProductsListView, meta: { requiresAuth: true, title: 'Productos' } },
  { path: '/producto-detalle/:id', component: ProductDetailView, meta: { requiresAuth: true, title: 'Detalle del Producto' } },
  { path: '/productos-manager', component: ProductManagerView, meta: { requiresAuth: true, title: 'Gestión de Productos' } },
  { path: '/low-stock', component: LowStockView, meta: { requiresAuth: true, title: 'Productos con Stock Bajo' } },
  { path: '/inventory-movements/:productId', component: InventoryMovementsView, meta: { requiresAuth: true, title: 'Movimientos de Inventario' } },
  { path: '/inventory-adjust', component: InventoryAdjustView, meta: { requiresAuth: true, title: 'Ajustar Inventario' } },
  { path: '/cart', component: CartView, meta: { requiresAuth: true, title: 'Carrito de Compras' } },
  { path: '/my-orders', component: MyOrdersView, meta: { requiresAuth: true, title: 'Mis Órdenes' } },
  { path: '/order-detail/:id', component: OrderDetailView, meta: { requiresAuth: true, title: 'Detalle de Orden' } },
  { path: '/reports', component: ReportsView, meta: { requiresAuth: true, title: 'Reportes' } },
  { path: '/admin-orders', component: AdminOrdersView, meta: { requiresAuth: true, title: 'Gestión de Órdenes' } },
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

  const token = localStorage.getItem('accessToken');

  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else if (to.path.startsWith('/admin') && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;
