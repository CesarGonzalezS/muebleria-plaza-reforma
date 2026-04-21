// Mock IndexedDB for Vitest
import { vi } from 'vitest';

class MockIDBRequest {
  constructor(value, executor) {
    this.result = value;
    this.error = null;
    this.onsuccess = null;
    this.onerror = null;

    // Defer execution until next tick so handlers can be attached
    if (executor) {
      Promise.resolve().then(() => {
        executor((val) => {
          this.result = val;
          if (this.onsuccess) {
            this.onsuccess({ target: this });
          }
        }, (err) => {
          this.error = err;
          if (this.onerror) {
            this.onerror({ target: this });
          }
        });
      });
    }
  }
}

class MockIDBStore {
  constructor(name, options = {}) {
    this.name = name;
    this.keyPath = options.keyPath || null;
    this.data = new Map();
    this.indexes = {};
  }

  put(value, key) {
    // If keyPath is set, extract key from value, otherwise use provided key
    const actualKey = this.keyPath ? value[this.keyPath] : (key || value.id);
    this.data.set(actualKey, value);
    return new MockIDBRequest(actualKey, (resolve) => {
      resolve(actualKey);
    });
  }

  get(key) {
    const value = this.data.get(key);
    return new MockIDBRequest(value, (resolve) => {
      resolve(value);
    });
  }

  delete(key) {
    this.data.delete(key);
    return new MockIDBRequest(undefined, (resolve) => {
      resolve();
    });
  }

  getAll() {
    const items = Array.from(this.data.values());
    return new MockIDBRequest(items, (resolve) => {
      resolve(items);
    });
  }

  clear() {
    this.data.clear();
    return new MockIDBRequest(undefined, (resolve) => {
      resolve();
    });
  }

  createIndex(name, keyPath, options = {}) {
    if (!this.indexes[name]) {
      this.indexes[name] = {
        name,
        keyPath,
        unique: options.unique || false,
        getAll: () => {
          const items = Array.from(this.data.values());
          return new MockIDBRequest(items, (resolve) => {
            resolve(items);
          });
        }
      };
    }
    return this.indexes[name];
  }

  index(name) {
    if (!this.indexes[name]) {
      this.indexes[name] = {
        getAll: () => {
          const items = Array.from(this.data.values());
          return new MockIDBRequest(items, (resolve) => {
            resolve(items);
          });
        }
      };
    }
    return this.indexes[name];
  }
}

class MockObjectStoreNames {
  constructor(stores) {
    this.stores = stores;
  }

  contains(name) {
    return this.stores.has(name);
  }
}

class MockIDBDatabase {
  constructor(name, version) {
    this.name = name;
    this.version = version;
    this.stores = new Map();
    this._objectStoreNames = new MockObjectStoreNames(this.stores);
  }

  createObjectStore(name, options = {}) {
    if (!this.stores.has(name)) {
      const store = new MockIDBStore(name, options);
      this.stores.set(name, store);
    }
    return this.stores.get(name);
  }

  get objectStoreNames() {
    return this._objectStoreNames;
  }

  transaction(storeNames, mode) {
    const stores = Array.isArray(storeNames) ? storeNames : [storeNames];
    const storeList = stores.map(name => {
      if (!this.stores.has(name)) {
        const store = new MockIDBStore(name);
        this.stores.set(name, store);
      }
      return this.stores.get(name);
    });

    return {
      objectStore: (name) => {
        if (!this.stores.has(name)) {
          const store = new MockIDBStore(name);
          this.stores.set(name, store);
        }
        return this.stores.get(name);
      },
      oncomplete: null,
      onerror: null,
      onabort: null
    };
  }
}

class MockIDBOpenRequest extends Promise {
  constructor(dbName, version, dbInstance = null) {
    let resolvePromise, rejectPromise;

    super((resolve, reject) => {
      resolvePromise = resolve;
      rejectPromise = reject;
    });

    // Use provided dbInstance or create new one
    this.result = dbInstance || new MockIDBDatabase(dbName, version);
    this.error = null;
    this.onsuccess = null;
    this.onerror = null;
    this.onupgradeneeded = null;
    this._resolve = resolvePromise;
    this._reject = rejectPromise;

    // Simulate async execution
    Promise.resolve().then(() => {
      if (this.onupgradeneeded) {
        try {
          this.onupgradeneeded({ target: { result: this.result } });
        } catch (e) {
          this._reject(e);
        }
      }
      if (this.onsuccess) {
        try {
          this.onsuccess({ target: { result: this.result } });
          this._resolve(this.result);
        } catch (e) {
          this._reject(e);
        }
      } else {
        this._resolve(this.result);
      }
    });
  }
}

class MockIndexedDB {
  constructor() {
    this.databases = new Map();
  }

  open(name, version) {
    // Return existing database or create new one
    if (!this.databases.has(name)) {
      this.databases.set(name, new MockIDBDatabase(name, version));
    }
    const dbInstance = this.databases.get(name);
    const request = new MockIDBOpenRequest(name, version, dbInstance);
    return request;
  }

  deleteDatabase(name) {
    this.databases.delete(name);
    return { onsuccess: null, onerror: null };
  }

  // For testing - clear all databases
  _clearAll() {
    this.databases.clear();
  }
}

// Global setup
global.indexedDB = new MockIndexedDB();
global.localStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
    key: (index) => Object.keys(store)[index] || null,
    get length() { return Object.keys(store).length; }
  };
})();

global.sessionStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
    key: (index) => Object.keys(store)[index] || null,
    get length() { return Object.keys(store).length; }
  };
})();

// Mock console methods to avoid clutter
global.console = {
  ...console,
  warn: vi.fn(),
  error: vi.fn()
};

// Mock document
if (typeof document === 'undefined') {
  global.document = {
    createElement: (tag) => ({ setAttribute: vi.fn(), appendChild: vi.fn(), innerHTML: '' }),
    querySelector: (selector) => null,
    querySelectorAll: (selector) => [],
    addEventListener: vi.fn()
  };
}
