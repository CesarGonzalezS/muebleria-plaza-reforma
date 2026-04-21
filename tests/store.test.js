import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useMainStore } from '../src/stores/main';

describe('Pinia Main Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('Auth State', () => {
    it('should initialize auth state', () => {
      const store = useMainStore();

      expect(store.user).toBeNull();
      expect(store.isAuthenticated).toBe(false);
      expect(store.token).toBeNull();
      expect(store.userRole).toBeNull();
    });

    it('should set auth data', async () => {
      const store = useMainStore();

      await store.setAuth({
        accessToken: 'test-token-123',
        user: { id: 1, username: 'testuser', email: 'test@example.com' }
      });

      expect(store.isAuthenticated).toBe(true);
      expect(store.token).toBe('test-token-123');
      expect(store.user.username).toBe('testuser');
    });

    it('should extract role from token', async () => {
      const store = useMainStore();

      // Mock token with role claim
      const mockToken = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyIiwicm9sZSI6IkFETUlOIn0.sig';

      await store.setAuth({
        accessToken: mockToken,
        user: { id: 1, username: 'admin', role: 'ADMIN' }
      });

      expect(store.userRole).toBeDefined();
    });

    it('should clear auth on logout', async () => {
      const store = useMainStore();

      await store.setAuth({
        accessToken: 'test-token',
        user: { id: 1, username: 'testuser' }
      });

      expect(store.isAuthenticated).toBe(true);

      await store.logout();

      expect(store.isAuthenticated).toBe(false);
      expect(store.token).toBeNull();
      expect(store.user).toBeNull();
    });
  });

  describe('Computed: isAdmin', () => {
    it('should return true when role is ADMIN', async () => {
      const store = useMainStore();

      store.userRole = 'ADMIN';

      expect(store.isAdmin).toBe(true);
    });

    it('should return false when role is not ADMIN', async () => {
      const store = useMainStore();

      store.userRole = 'CUSTOMER';

      expect(store.isAdmin).toBe(false);
    });
  });

  describe('Computed: isCustomer', () => {
    it('should return true when role is CUSTOMER', async () => {
      const store = useMainStore();

      store.userRole = 'CUSTOMER';

      expect(store.isCustomer).toBe(true);
    });

    it('should return false when role is not CUSTOMER', async () => {
      const store = useMainStore();

      store.userRole = 'ADMIN';

      expect(store.isCustomer).toBe(false);
    });
  });

  describe('Cart State', () => {
    it('should initialize cart as empty', () => {
      const store = useMainStore();

      expect(Array.isArray(store.cartItems)).toBe(true);
      expect(store.cartItems.length).toBe(0);
      expect(store.cartCount).toBe(0);
      expect(store.cartTotal).toBe(0);
    });

    it('should add item to cart', async () => {
      const store = useMainStore();
      const product = {
        id: 1,
        name: 'Silla',
        price: 100,
        quantity: 1
      };

      await store.addToCart(product);

      expect(store.cartItems.length).toBe(1);
      expect(store.cartItems[0].id).toBe(1);
      expect(store.cartCount).toBe(1);
      expect(store.cartTotal).toBe(100);
    });

    it('should increase quantity on duplicate add', async () => {
      const store = useMainStore();
      const product = {
        id: 1,
        name: 'Silla',
        price: 100,
        quantity: 1
      };

      await store.addToCart(product);
      await store.addToCart(product);

      expect(store.cartItems.length).toBe(1);
      expect(store.cartItems[0].quantity).toBe(2);
      expect(store.cartCount).toBe(2);
      expect(store.cartTotal).toBe(200);
    });

    it('should remove item from cart', async () => {
      const store = useMainStore();

      await store.addToCart({ id: 1, name: 'Silla', price: 100, quantity: 1 });
      expect(store.cartItems.length).toBe(1);

      await store.removeFromCart(1);

      expect(store.cartItems.length).toBe(0);
      expect(store.cartCount).toBe(0);
      expect(store.cartTotal).toBe(0);
    });

    it('should update item quantity', async () => {
      const store = useMainStore();

      await store.addToCart({ id: 1, name: 'Silla', price: 100, quantity: 1 });
      await store.updateCartItem(1, 5);

      expect(store.cartItems[0].quantity).toBe(5);
      expect(store.cartCount).toBe(5);
      expect(store.cartTotal).toBe(500);
    });

    it('should remove item when quantity becomes 0', async () => {
      const store = useMainStore();

      await store.addToCart({ id: 1, name: 'Silla', price: 100, quantity: 1 });
      await store.updateCartItem(1, 0);

      expect(store.cartItems.length).toBe(0);
    });

    it('should clear entire cart', async () => {
      const store = useMainStore();

      await store.addToCart({ id: 1, name: 'Silla', price: 100, quantity: 1 });
      await store.addToCart({ id: 2, name: 'Mesa', price: 200, quantity: 1 });

      expect(store.cartItems.length).toBe(2);

      await store.clearCart();

      expect(store.cartItems.length).toBe(0);
      expect(store.cartCount).toBe(0);
      expect(store.cartTotal).toBe(0);
    });
  });

  describe('UI State', () => {
    it('should initialize UI state', () => {
      const store = useMainStore();

      expect(store.loading).toBe(false);
      expect(store.sidebarOpen).toBe(false);
      expect(store.theme).toBe('light');
    });

    it('should toggle sidebar', () => {
      const store = useMainStore();

      expect(store.sidebarOpen).toBe(false);

      store.toggleSidebar();
      expect(store.sidebarOpen).toBe(true);

      store.toggleSidebar();
      expect(store.sidebarOpen).toBe(false);
    });

    it('should set theme', () => {
      const store = useMainStore();

      store.setTheme('dark');

      expect(store.theme).toBe('dark');

      store.setTheme('light');

      expect(store.theme).toBe('light');
    });

    it('should set loading state', () => {
      const store = useMainStore();

      expect(store.loading).toBe(false);

      store.setLoading(true);

      expect(store.loading).toBe(true);

      store.setLoading(false);

      expect(store.loading).toBe(false);
    });
  });

  describe('Cart Calculations', () => {
    it('should calculate total with multiple items', async () => {
      const store = useMainStore();

      await store.addToCart({ id: 1, name: 'Silla', price: 100, quantity: 2 });
      await store.addToCart({ id: 2, name: 'Mesa', price: 250, quantity: 1 });
      await store.addToCart({ id: 3, name: 'Lámpara', price: 50, quantity: 3 });

      // (100*2) + (250*1) + (50*3) = 200 + 250 + 150 = 600
      expect(store.cartTotal).toBe(600);
      // 2 + 1 + 3 = 6
      expect(store.cartCount).toBe(6);
    });
  });

  describe('Store Persistence', () => {
    it('should maintain state across mutations', async () => {
      const store = useMainStore();

      await store.setAuth({
        accessToken: 'token-123',
        user: { id: 1, username: 'user' }
      });

      await store.addToCart({ id: 1, name: 'Product', price: 100, quantity: 1 });

      expect(store.isAuthenticated).toBe(true);
      expect(store.cartItems.length).toBe(1);
      expect(store.cartTotal).toBe(100);
    });
  });
});
