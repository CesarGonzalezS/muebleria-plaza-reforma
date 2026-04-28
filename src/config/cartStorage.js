/**
 * Cart Storage - IndexedDB persistence for shopping cart
 * Survives page refresh, browser restart, and Firefox Tracking Prevention
 */

import { getDB } from './db.js';

const STORE_NAME = 'cart';

async function setCartItem(productId, item) {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const cartItem = {
      id: productId,
      ...item,
      timestamp: Date.now()
    };
    return new Promise((resolve, reject) => {
      const req = store.put(cartItem);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => {
        resolve();
      };
    });
  } catch (e) {
    // Error silencioso
  }
}

async function getCartItem(productId) {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
      const req = store.get(productId);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve(req.result);
    });
  } catch (e) {
    return null;
  }
}

async function getAllCartItems() {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onerror = () => reject(req.error);
      req.onsuccess = () => {
        const items = req.result;
        // Sort by timestamp (newest first)
        items.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        resolve(items);
      };
    });
  } catch (e) {
    return [];
  }
}

async function removeCartItem(productId) {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
      const req = store.delete(productId);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => {
        resolve();
      };
    });
  } catch (e) {
    // Error silencioso
  }
}

async function clearCart() {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
      const req = store.clear();
      req.onerror = () => reject(req.error);
      req.onsuccess = () => {
        resolve();
      };
    });
  } catch (e) {
    // Error silencioso
  }
}

async function getCartTotal() {
  const items = await getAllCartItems();
  return items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
}

async function getCartCount() {
  const items = await getAllCartItems();
  return items.reduce((sum, item) => sum + (item.quantity || 1), 0);
}

export const cartStorage = {
  setItem: setCartItem,
  getItem: getCartItem,
  getAllItems: getAllCartItems,
  removeItem: removeCartItem,
  clear: clearCart,
  getTotal: getCartTotal,
  getCount: getCartCount
};
