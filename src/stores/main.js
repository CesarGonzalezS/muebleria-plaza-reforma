import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { cartStorage } from '../config/cartStorage';
import axiosConfig from '../config/AxiosConfig';

export const useMainStore = defineStore('main', () => {
  // ===== AUTH STATE =====
  const user = ref(null);
  const isAuthenticated = ref(false);
  const token = ref(null);
  const userRole = ref(null);

  // ===== CART STATE =====
  const cartItems = ref([]);
  const cartCount = ref(0);
  const cartTotal = ref(0);

  // ===== UI STATE =====
  const loading = ref(false);
  const sidebarOpen = ref(false);
  const theme = ref(localStorage.getItem('theme') || 'light');

  // ===== COMPUTED =====
  const isAdmin = computed(() => userRole.value === 'ADMIN');
  const isCustomer = computed(() => userRole.value === 'CUSTOMER');

  // ===== AUTH ACTIONS =====
  async function setAuth(authData) {
    if (authData.accessToken) {
      token.value = authData.accessToken;
      await axiosConfig.saveToken(authData.accessToken);
    }

    if (authData.user) {
      user.value = authData.user;
      if (authData.user.role) {
        userRole.value = authData.user.role;
      }
    }

    isAuthenticated.value = true;
  }

  async function logout() {
    user.value = null;
    isAuthenticated.value = false;
    token.value = null;
    userRole.value = null;
    await axiosConfig.removeToken();
    await clearCart();
  }

  async function checkAuth() {
    const auth = await axiosConfig.isAuthenticated();
    if (auth) {
      const storedToken = await axiosConfig.getToken();
      if (storedToken) {
        token.value = storedToken;
        isAuthenticated.value = true;
        // Decode role from token
        try {
          const decoded = JSON.parse(atob(storedToken.split('.')[1]));
          if (decoded.role) {
            userRole.value = decoded.role;
          }
        } catch (e) {
          // Error silencioso
        }
      }
    }
    return auth;
  }

  // ===== CART ACTIONS =====
  async function loadCart() {
    try {
      const items = await cartStorage.getAllItems();
      cartItems.value = items;
      updateCartMeta();
    } catch (e) {
      // Error silencioso
    }
  }

  async function addToCart(product) {
    try {
      const existing = cartItems.value.find(item => item.id === product.id);

      if (existing) {
        existing.quantity = (existing.quantity || 1) + (product.quantity || 1);
      } else {
        cartItems.value.push({
          ...product,
          quantity: product.quantity || 1
        });
      }

      await cartStorage.setItem(product.id, cartItems.value.find(item => item.id === product.id));
      updateCartMeta();
    } catch (e) {
      // Error silencioso
    }
  }

  async function removeFromCart(productId) {
    try {
      cartItems.value = cartItems.value.filter(item => item.id !== productId);
      await cartStorage.removeItem(productId);
      updateCartMeta();
    } catch (e) {
      // Error silencioso
    }
  }

  async function updateCartItem(productId, quantity) {
    try {
      const item = cartItems.value.find(item => item.id === productId);
      if (item) {
        if (quantity <= 0) {
          await removeFromCart(productId);
        } else {
          item.quantity = quantity;
          await cartStorage.setItem(productId, item);
          updateCartMeta();
        }
      }
    } catch (e) {
      // Error silencioso
    }
  }

  async function clearCart() {
    try {
      cartItems.value = [];
      await cartStorage.clear();
      updateCartMeta();
    } catch (e) {
      // Error silencioso
    }
  }

  function updateCartMeta() {
    cartCount.value = cartItems.value.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartTotal.value = cartItems.value.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
  }

  // ===== UI ACTIONS =====
  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value;
  }

  function setTheme(newTheme) {
    theme.value = newTheme;
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }

  function setLoading(value) {
    loading.value = value;
  }

  // ===== INIT =====
  async function init() {
    await checkAuth();
    await loadCart();
    setTheme(theme.value);
  }

  return {
    // Auth state & actions
    user,
    isAuthenticated,
    token,
    userRole,
    isAdmin,
    isCustomer,
    setAuth,
    logout,
    checkAuth,

    // Cart state & actions
    cartItems,
    cartCount,
    cartTotal,
    loadCart,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,

    // UI state & actions
    loading,
    sidebarOpen,
    theme,
    toggleSidebar,
    setTheme,
    setLoading,

    // Init
    init
  };
});
