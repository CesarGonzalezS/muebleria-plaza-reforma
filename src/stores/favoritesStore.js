import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { favoritesStorage } from '../config/favoritesStorage';

export const useFavoritesStore = defineStore('favorites', () => {
  const items = ref([]);

  const count = computed(() => items.value.length);

  function isFavorite(productId) {
    return items.value.some(item => item.id === productId);
  }

  async function load() {
    try {
      items.value = await favoritesStorage.getAll();
    } catch (e) {
      console.error('[FavoritesStore] Error loading:', e);
    }
  }

  async function toggle(product) {
    if (isFavorite(product.id)) {
      items.value = items.value.filter(i => i.id !== product.id);
      await favoritesStorage.remove(product.id);
    } else {
      const item = { id: product.id, ...product, timestamp: Date.now() };
      items.value.unshift(item);
      await favoritesStorage.add(item);
    }
  }

  async function remove(productId) {
    items.value = items.value.filter(i => i.id !== productId);
    await favoritesStorage.remove(productId);
  }

  async function clear() {
    items.value = [];
    await favoritesStorage.clear();
  }

  return { items, count, isFavorite, load, toggle, remove, clear };
});
