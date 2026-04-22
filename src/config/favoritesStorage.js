// src/config/favoritesStorage.js
import { getDB } from './db.js';

const STORE_NAME = 'favorites';

async function addFavorite(product) {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const item = { id: product.id, ...product, timestamp: Date.now() };
    return new Promise((resolve, reject) => {
      const req = store.put(item);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve();
    });
  } catch (e) {
    console.error('[FavoritesStorage] Error adding:', e);
    throw e;
  }
}

async function removeFavorite(productId) {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
      const req = store.delete(productId);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve();
    });
  } catch (e) {
    console.error('[FavoritesStorage] Error removing:', e);
    throw e;
  }
}

async function getAllFavorites() {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onerror = () => reject(req.error);
      req.onsuccess = () => {
        const items = req.result || [];
        items.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        resolve(items);
      };
    });
  } catch (e) {
    console.error('[FavoritesStorage] Error reading all:', e);
    return [];
  }
}

async function isFavorite(productId) {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
      const req = store.get(productId);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve(!!req.result);
    });
  } catch (e) {
    return false;
  }
}

async function clearFavorites() {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
      const req = store.clear();
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve();
    });
  } catch (e) {
    console.error('[FavoritesStorage] Error clearing:', e);
    throw e;
  }
}

export const favoritesStorage = {
  add: addFavorite,
  remove: removeFavorite,
  getAll: getAllFavorites,
  isFavorite,
  clear: clearFavorites,
};
