// src/config/db.js
const DB_NAME = 'MuebleriaDB';
const DB_VERSION = 4;

let dbPromise = null;

export function getDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => {
      dbPromise = null;
      reject(request.error);
    };
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('cart')) {
        const s = db.createObjectStore('cart', { keyPath: 'id' });
        s.createIndex('timestamp', 'timestamp', { unique: false });
      }
      if (!db.objectStoreNames.contains('auth')) {
        // key-value store, no keyPath by design
        db.createObjectStore('auth');
      }
      if (!db.objectStoreNames.contains('favorites')) {
        const s = db.createObjectStore('favorites', { keyPath: 'id' });
        s.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
  return dbPromise;
}
