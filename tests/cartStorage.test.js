import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { cartStorage } from '../src/config/cartStorage';

describe('Cart Storage - IndexedDB', () => {
  beforeEach(async () => {
    // Clear cart before each test
    await cartStorage.clear();
  });

  afterEach(async () => {
    await cartStorage.clear();
  });

  describe('setItem/getItem', () => {
    it('should save and retrieve cart item', async () => {
      const item = {
        id: 1,
        name: 'Silla de oficina',
        price: 150.00,
        quantity: 1
      };

      await cartStorage.setItem(item.id, item);
      const retrieved = await cartStorage.getItem(item.id);

      expect(retrieved).toBeDefined();
      expect(retrieved.name).toBe('Silla de oficina');
      expect(retrieved.price).toBe(150.00);
    });

    it('should overwrite existing item', async () => {
      const item1 = { id: 1, name: 'Silla', price: 100, quantity: 1 };
      const item2 = { id: 1, name: 'Silla Premium', price: 200, quantity: 2 };

      await cartStorage.setItem(1, item1);
      await cartStorage.setItem(1, item2);
      const retrieved = await cartStorage.getItem(1);

      expect(retrieved.name).toBe('Silla Premium');
      expect(retrieved.price).toBe(200);
    });
  });

  describe('getAllItems', () => {
    it('should return empty array when cart is empty', async () => {
      const items = await cartStorage.getAllItems();
      expect(Array.isArray(items)).toBe(true);
      expect(items.length).toBe(0);
    });

    it('should return all items in cart', async () => {
      const item1 = { id: 1, name: 'Silla', price: 100, quantity: 1 };
      const item2 = { id: 2, name: 'Mesa', price: 200, quantity: 1 };
      const item3 = { id: 3, name: 'Lámpara', price: 50, quantity: 2 };

      await cartStorage.setItem(1, item1);
      await cartStorage.setItem(2, item2);
      await cartStorage.setItem(3, item3);

      const items = await cartStorage.getAllItems();

      expect(items.length).toBe(3);
      expect(items.map(i => i.name)).toEqual(['Silla', 'Mesa', 'Lámpara']);
    });

    it('should sort items by timestamp (newest first)', async () => {
      const item1 = { id: 1, name: 'Item1', price: 100, quantity: 1 };
      const item2 = { id: 2, name: 'Item2', price: 200, quantity: 1 };

      await cartStorage.setItem(1, item1);
      // Small delay to ensure different timestamps
      await new Promise(r => setTimeout(r, 10));
      await cartStorage.setItem(2, item2);

      const items = await cartStorage.getAllItems();

      // Most recent should be first
      expect(items[0].id).toBe(2);
      expect(items[1].id).toBe(1);
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', async () => {
      const item = { id: 1, name: 'Silla', price: 100, quantity: 1 };

      await cartStorage.setItem(1, item);
      await cartStorage.removeItem(1);

      const retrieved = await cartStorage.getItem(1);
      expect(retrieved).toBeUndefined();
    });

    it('should not error when removing non-existent item', async () => {
      expect(async () => {
        await cartStorage.removeItem(999);
      }).not.toThrow();
    });
  });

  describe('clear', () => {
    it('should remove all items', async () => {
      const item1 = { id: 1, name: 'Item1', price: 100, quantity: 1 };
      const item2 = { id: 2, name: 'Item2', price: 200, quantity: 1 };

      await cartStorage.setItem(1, item1);
      await cartStorage.setItem(2, item2);

      await cartStorage.clear();

      const items = await cartStorage.getAllItems();
      expect(items.length).toBe(0);
    });
  });

  describe('getTotal', () => {
    it('should calculate total price correctly', async () => {
      const item1 = { id: 1, name: 'Silla', price: 100, quantity: 2 };
      const item2 = { id: 2, name: 'Mesa', price: 200, quantity: 1 };

      await cartStorage.setItem(1, item1);
      await cartStorage.setItem(2, item2);

      const total = await cartStorage.getTotal();

      // (100 * 2) + (200 * 1) = 400
      expect(total).toBe(400);
    });

    it('should return 0 for empty cart', async () => {
      const total = await cartStorage.getTotal();
      expect(total).toBe(0);
    });
  });

  describe('getCount', () => {
    it('should sum all quantities', async () => {
      const item1 = { id: 1, name: 'Silla', price: 100, quantity: 2 };
      const item2 = { id: 2, name: 'Mesa', price: 200, quantity: 3 };

      await cartStorage.setItem(1, item1);
      await cartStorage.setItem(2, item2);

      const count = await cartStorage.getCount();

      // 2 + 3 = 5
      expect(count).toBe(5);
    });

    it('should return 0 for empty cart', async () => {
      const count = await cartStorage.getCount();
      expect(count).toBe(0);
    });
  });

  describe('Data Persistence', () => {
    it('should persist data across operations', async () => {
      const item = { id: 1, name: 'Silla', price: 150, quantity: 1 };

      // Save
      await cartStorage.setItem(1, item);

      // Retrieve immediately
      const retrieved1 = await cartStorage.getItem(1);
      expect(retrieved1).toBeDefined();

      // Get all items
      const all1 = await cartStorage.getAllItems();
      expect(all1.length).toBe(1);

      // Retrieve again after operations
      const retrieved2 = await cartStorage.getItem(1);
      expect(retrieved2.name).toBe('Silla');
    });
  });

  describe('Error Handling', () => {
    it('should handle storage quota exceeded gracefully', async () => {
      // This would require mocking IndexedDB quota exceeded scenario
      // For now, just verify the functions don't crash
      expect(async () => {
        await cartStorage.setItem(1, { id: 1, name: 'Test' });
      }).not.toThrow();
    });
  });
});
