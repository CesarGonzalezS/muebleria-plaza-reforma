/**
 * Cart Storage - IndexedDB persistence for shopping cart
 * Survives page refresh, browser restart, and Firefox Tracking Prevention
 */

const DB_NAME = 'MuebleriaDB';
const STORE_NAME = 'cart';

async function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 2); // Version 2 to add cart store
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      // Create/update cart store
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

async function setCartItem(productId, item) {
  try {
    const db = await initDB();
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
        console.log(`[CartStorage] Guardado artículo: ${productId}`);
        resolve();
      };
    });
  } catch (e) {
    console.error('[CartStorage] Error guardando:', e);
  }
}

async function getCartItem(productId) {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
      const req = store.get(productId);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve(req.result);
    });
  } catch (e) {
    console.error('[CartStorage] Error leyendo:', e);
    return null;
  }
}

async function getAllCartItems() {
  try {
    const db = await initDB();
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
    console.error('[CartStorage] Error leyendo todos:', e);
    return [];
  }
}

async function removeCartItem(productId) {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
      const req = store.delete(productId);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => {
        console.log(`[CartStorage] Eliminado artículo: ${productId}`);
        resolve();
      };
    });
  } catch (e) {
    console.error('[CartStorage] Error eliminando:', e);
  }
}

async function clearCart() {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
      const req = store.clear();
      req.onerror = () => reject(req.error);
      req.onsuccess = () => {
        console.log('[CartStorage] Carrito limpiado');
        resolve();
      };
    });
  } catch (e) {
    console.error('[CartStorage] Error limpiando:', e);
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
