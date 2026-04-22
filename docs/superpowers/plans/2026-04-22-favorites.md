# Favorites (Wishlist) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow users to save products as favorites, view them on a dedicated page, and see real-time stock status (out-of-stock badge + removal option).

**Architecture:** Favorites persist in IndexedDB (same `MuebleriaDB` as cart) under a new `favorites` object store. A separate Pinia store manages state. `ProductCard` gets a heart toggle button. `FavoritesView` fetches live product data on load to detect sold-out items. No backend required — purely client-side.

**Tech Stack:** Vue 3 Composition API, Pinia, IndexedDB, Vue Router, Bootstrap Icons

---

## Critical Pre-fix: IndexedDB Version Conflict

`cartStorage.js` opens `MuebleriaDB` at version **2**. `AxiosConfig.js` now opens it at version **3**. If `cartStorage.js` runs after `AxiosConfig.js` has already upgraded the DB to v3, the browser throws `VersionError` (cannot open DB at a lower version than current). This is already broken. All three DB openers must use the same version.

**Rule:** Every file that opens `MuebleriaDB` must use version **4** and must include ALL store creation logic in `onupgradeneeded`.

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/config/favoritesStorage.js` | IndexedDB CRUD for favorites store |
| Create | `src/stores/favoritesStore.js` | Pinia store: favorites state + actions |
| Create | `src/views/FavoritesView.vue` | Favorites page with stock status |
| Create | `src/components/FavoriteButton.vue` | Reusable heart toggle button |
| Modify | `src/config/cartStorage.js` | Bump DB version 2 → 4, add all stores in upgrade |
| Modify | `src/config/AxiosConfig.js` | Bump DB version 3 → 4, add all stores in upgrade |
| Modify | `src/components/ProductCard.vue` | Add FavoriteButton overlay |
| Modify | `src/components/Navbar.vue` | Add heart icon with favorites count badge |
| Modify | `src/router/index.js` | Add `/favoritos` route |
| Modify | `src/main.js` | Init favorites store on app start |

---

## Task 1: Fix IndexedDB Version Conflict

**Files:**
- Modify: `src/config/cartStorage.js`
- Modify: `src/config/AxiosConfig.js`

The shared upgrade handler (used in both files):
```js
function upgradeDB(db) {
  if (!db.objectStoreNames.contains('cart')) {
    const s = db.createObjectStore('cart', { keyPath: 'id' });
    s.createIndex('timestamp', 'timestamp', { unique: false });
  }
  if (!db.objectStoreNames.contains('auth')) {
    db.createObjectStore('auth');
  }
  if (!db.objectStoreNames.contains('favorites')) {
    const s = db.createObjectStore('favorites', { keyPath: 'id' });
    s.createIndex('timestamp', 'timestamp', { unique: false });
  }
}
```

- [ ] **Step 1: Update `cartStorage.js` version + upgrade handler**

In `src/config/cartStorage.js`, replace:
```js
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
```
With:
```js
const request = indexedDB.open(DB_NAME, 4);
request.onerror = () => reject(request.error);
request.onsuccess = () => resolve(request.result);
request.onupgradeneeded = (e) => {
  const db = e.target.result;
  if (!db.objectStoreNames.contains('cart')) {
    const s = db.createObjectStore('cart', { keyPath: 'id' });
    s.createIndex('timestamp', 'timestamp', { unique: false });
  }
  if (!db.objectStoreNames.contains('auth')) {
    db.createObjectStore('auth');
  }
  if (!db.objectStoreNames.contains('favorites')) {
    const s = db.createObjectStore('favorites', { keyPath: 'id' });
    s.createIndex('timestamp', 'timestamp', { unique: false });
  }
};
```

- [ ] **Step 2: Update `AxiosConfig.js` version + upgrade handler**

In `src/config/AxiosConfig.js`, replace:
```js
const request = indexedDB.open(DB_NAME, 3);
request.onerror = () => reject(request.error);
request.onsuccess = () => resolve(request.result);
request.onupgradeneeded = (e) => {
  const db = e.target.result;
  if (!db.objectStoreNames.contains(STORE_NAME)) {
    db.createObjectStore(STORE_NAME);
  }
};
```
With:
```js
const request = indexedDB.open(DB_NAME, 4);
request.onerror = () => reject(request.error);
request.onsuccess = () => resolve(request.result);
request.onupgradeneeded = (e) => {
  const db = e.target.result;
  if (!db.objectStoreNames.contains('cart')) {
    const s = db.createObjectStore('cart', { keyPath: 'id' });
    s.createIndex('timestamp', 'timestamp', { unique: false });
  }
  if (!db.objectStoreNames.contains('auth')) {
    db.createObjectStore('auth');
  }
  if (!db.objectStoreNames.contains('favorites')) {
    const s = db.createObjectStore('favorites', { keyPath: 'id' });
    s.createIndex('timestamp', 'timestamp', { unique: false });
  }
};
```

- [ ] **Step 3: Commit**
```bash
git add src/config/cartStorage.js src/config/AxiosConfig.js
git commit -m "fix(idb): unify MuebleriaDB version to 4, add favorites store to upgrade handler"
```

---

## Task 2: Create `favoritesStorage.js`

**Files:**
- Create: `src/config/favoritesStorage.js`

- [ ] **Step 1: Create the file**

```js
// src/config/favoritesStorage.js
const DB_NAME = 'MuebleriaDB';
const STORE_NAME = 'favorites';

async function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 4);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('cart')) {
        const s = db.createObjectStore('cart', { keyPath: 'id' });
        s.createIndex('timestamp', 'timestamp', { unique: false });
      }
      if (!db.objectStoreNames.contains('auth')) {
        db.createObjectStore('auth');
      }
      if (!db.objectStoreNames.contains('favorites')) {
        const s = db.createObjectStore('favorites', { keyPath: 'id' });
        s.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

async function addFavorite(product) {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const item = { ...product, timestamp: Date.now() };
    return new Promise((resolve, reject) => {
      const req = store.put(item);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve();
    });
  } catch (e) {
    console.error('[FavoritesStorage] Error adding:', e);
  }
}

async function removeFavorite(productId) {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
      const req = store.delete(productId);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve();
    });
  } catch (e) {
    console.error('[FavoritesStorage] Error removing:', e);
  }
}

async function getAllFavorites() {
  try {
    const db = await initDB();
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
    const db = await initDB();
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
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
      const req = store.clear();
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve();
    });
  } catch (e) {
    console.error('[FavoritesStorage] Error clearing:', e);
  }
}

export const favoritesStorage = {
  add: addFavorite,
  remove: removeFavorite,
  getAll: getAllFavorites,
  isFavorite,
  clear: clearFavorites,
};
```

- [ ] **Step 2: Commit**
```bash
git add src/config/favoritesStorage.js
git commit -m "feat(favorites): add IndexedDB storage for favorites"
```

---

## Task 3: Create Pinia favorites store

**Files:**
- Create: `src/stores/favoritesStore.js`

- [ ] **Step 1: Create the file**

```js
// src/stores/favoritesStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { favoritesStorage } from '../config/favoritesStorage';

export const useFavoritesStore = defineStore('favorites', () => {
  const items = ref([]);

  const count = computed(() => items.value.length);

  const isFavorite = (productId) =>
    items.value.some(item => item.id === productId);

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
      const item = { ...product, timestamp: Date.now() };
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
```

- [ ] **Step 2: Initialize store in `src/main.js`**

Find the `app.mount` call or store init in `main.js`. Add favorites store init:

```js
// After createApp and before mount, add:
import { useFavoritesStore } from './stores/favoritesStore';

// Inside the async init block (after app.use(pinia)):
const favoritesStore = useFavoritesStore();
await favoritesStore.load();
```

Exact location — find in `main.js` where `useMainStore().init()` or cart load happens and add after it:
```js
const { useFavoritesStore } = await import('./stores/favoritesStore');
const favoritesStore = useFavoritesStore();
await favoritesStore.load();
```

Or statically at top of main.js:
```js
import { useFavoritesStore } from './stores/favoritesStore';
```
And in the init block:
```js
useFavoritesStore().load();
```

- [ ] **Step 3: Commit**
```bash
git add src/stores/favoritesStore.js src/main.js
git commit -m "feat(favorites): add Pinia store and init on app start"
```

---

## Task 4: Create `FavoriteButton` component

**Files:**
- Create: `src/components/FavoriteButton.vue`

- [ ] **Step 1: Create the component**

```vue
<!-- src/components/FavoriteButton.vue -->
<template>
  <button
    :class="['fav-btn', { 'fav-btn--active': active }]"
    @click.prevent.stop="handleClick"
    :aria-label="active ? 'Quitar de favoritos' : 'Agregar a favoritos'"
    :title="active ? 'Quitar de favoritos' : 'Agregar a favoritos'"
    type="button"
  >
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      :fill="active ? 'currentColor' : 'none'"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  </button>
</template>

<script setup>
import { useFavoritesStore } from '../stores/favoritesStore';

const props = defineProps({
  product: { type: Object, required: true },
});

const favStore = useFavoritesStore();
const active = computed(() => favStore.isFavorite(props.product.id));

function handleClick() {
  favStore.toggle(props.product);
}
</script>

<script>
import { computed } from 'vue';
</script>

<style scoped>
.fav-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.92);
  color: #9ca3af;
  cursor: pointer;
  transition: color 0.2s, background 0.2s, transform 0.15s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  backdrop-filter: blur(4px);
}

.fav-btn:hover {
  color: #860734;
  background: #fff;
  transform: scale(1.1);
}

.fav-btn--active {
  color: #860734;
  background: #fff;
}

.fav-btn--active:hover {
  transform: scale(1.1);
}
</style>
```

Note: The `<script setup>` block needs `computed` imported. Merge both script blocks:

```vue
<script setup>
import { computed } from 'vue';
import { useFavoritesStore } from '../stores/favoritesStore';

const props = defineProps({
  product: { type: Object, required: true },
});

const favStore = useFavoritesStore();
const active = computed(() => favStore.isFavorite(props.product.id));

function handleClick() {
  favStore.toggle(props.product);
}
</script>
```

- [ ] **Step 2: Commit**
```bash
git add src/components/FavoriteButton.vue
git commit -m "feat(favorites): add FavoriteButton heart toggle component"
```

---

## Task 5: Add FavoriteButton to ProductCard

**Files:**
- Modify: `src/components/ProductCard.vue`

- [ ] **Step 1: Import and add FavoriteButton**

In `src/components/ProductCard.vue`, add import in `<script setup>`:
```js
import FavoriteButton from './FavoriteButton.vue';
```

In the template, add the button inside `.product-image-wrap` (top-right corner, outside the overlay so it's always visible):

Replace:
```html
<div class="product-image-wrap">
  <img :src="imgSrc" :alt="product.name || 'Producto'" class="product-image" loading="lazy" />
  <div class="product-overlay" aria-hidden="true">
```
With:
```html
<div class="product-image-wrap">
  <img :src="imgSrc" :alt="product.name || 'Producto'" class="product-image" loading="lazy" />
  <FavoriteButton :product="product" class="fav-btn-corner" />
  <div class="product-overlay" aria-hidden="true">
```

Add the positioning style in `<style scoped>`:
```css
.fav-btn-corner {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
}
```

- [ ] **Step 2: Commit**
```bash
git add src/components/ProductCard.vue
git commit -m "feat(favorites): add heart button to ProductCard"
```

---

## Task 6: Create FavoritesView page

**Files:**
- Create: `src/views/FavoritesView.vue`

- [ ] **Step 1: Create the view**

```vue
<!-- src/views/FavoritesView.vue -->
<template>
  <div class="favorites-page">
    <Navbar />

    <main class="favorites-main">
      <div class="favorites-container">
        <div class="favorites-header">
          <h1 class="favorites-title">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#860734" stroke="#860734" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            Mis Favoritos
          </h1>
          <p class="favorites-subtitle">{{ favStore.count }} producto{{ favStore.count !== 1 ? 's' : '' }} guardado{{ favStore.count !== 1 ? 's' : '' }}</p>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="fav-loading">
          <div class="fav-spinner"></div>
          <p>Verificando disponibilidad...</p>
        </div>

        <!-- Empty state -->
        <div v-else-if="!favStore.count" class="fav-empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d1c4ca" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <h2>Aún no tienes favoritos</h2>
          <p>Guarda los productos que te gusten con el ❤ en cualquier producto del catálogo.</p>
          <router-link to="/productos" class="btn-primary-link">Ver catálogo</router-link>
        </div>

        <!-- Sold-out banner -->
        <div v-if="soldOutItems.length && !loading" class="sold-out-banner">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{{ soldOutItems.length }} producto{{ soldOutItems.length !== 1 ? 's' : '' }} de tu lista {{ soldOutItems.length !== 1 ? 'están agotados' : 'está agotado' }}</span>
          <button @click="removeAllSoldOut" class="sold-out-clear-btn">Eliminar agotados</button>
        </div>

        <!-- Grid -->
        <div v-if="favStore.count && !loading" class="fav-grid">
          <div
            v-for="item in enrichedItems"
            :key="item.id"
            class="fav-card"
            :class="{ 'fav-card--soldout': item.soldOut }"
          >
            <!-- Sold-out overlay -->
            <div v-if="item.soldOut" class="soldout-overlay" aria-label="Producto agotado">
              <span class="soldout-badge">Agotado</span>
            </div>

            <!-- Image -->
            <router-link :to="{ name: 'ProductoDetalle', params: { id: item.id } }" class="fav-card__img-link">
              <img :src="getImg(item)" :alt="item.name" class="fav-card__img" loading="lazy" />
            </router-link>

            <!-- Info -->
            <div class="fav-card__body">
              <router-link :to="{ name: 'ProductoDetalle', params: { id: item.id } }" class="fav-card__name">
                {{ item.name }}
              </router-link>
              <p class="fav-card__price">${{ formatPrice(item.price) }}</p>
              <p v-if="item.soldOut" class="fav-card__stock-msg">Sin existencias</p>
            </div>

            <!-- Actions -->
            <div class="fav-card__actions">
              <button
                v-if="!item.soldOut"
                @click="addToCart(item)"
                class="fav-card__btn-cart"
                title="Agregar al carrito"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                Agregar al carrito
              </button>
              <button @click="favStore.remove(item.id)" class="fav-card__btn-remove" title="Quitar de favoritos" aria-label="Quitar de favoritos">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Navbar from '../components/Navbar.vue';
import { useFavoritesStore } from '../stores/favoritesStore';
import { useMainStore } from '../stores/main';
import { productService } from '../services/products';
import axiosConfig from '../config/AxiosConfig';

const favStore = useFavoritesStore();
const mainStore = useMainStore();
const loading = ref(false);
const liveStockMap = ref({});

const enrichedItems = computed(() =>
  favStore.items.map(item => ({
    ...item,
    soldOut: liveStockMap.value[item.id] === 0,
  }))
);

const soldOutItems = computed(() =>
  enrichedItems.value.filter(i => i.soldOut)
);

async function fetchLiveStock() {
  if (!favStore.count) return;
  loading.value = true;
  try {
    const results = await Promise.allSettled(
      favStore.items.map(item => productService.getProductById(item.id))
    );
    results.forEach((result, idx) => {
      const id = favStore.items[idx].id;
      if (result.status === 'fulfilled') {
        const p = result.value.data?.data || result.value.data || {};
        liveStockMap.value[id] = p.stock ?? 1;
      } else {
        liveStockMap.value[id] = 1;
      }
    });
  } finally {
    loading.value = false;
  }
}

async function addToCart(product) {
  await mainStore.addToCart({ ...product, quantity: 1 });
  axiosConfig.ToastSuccess('Agregado', `${product.name} se agregó al carrito`);
}

function removeAllSoldOut() {
  soldOutItems.value.forEach(item => favStore.remove(item.id));
}

function getImg(product) {
  if (product.images && Array.isArray(product.images) && product.images.length) {
    const first = product.images[0];
    return typeof first === 'string' ? first : (first.img_base64 || first.url || '/assets/img/products/default.jpg');
  }
  return product.img || product.img_base64 || '/assets/img/products/default.jpg';
}

function formatPrice(val) {
  if (!val && val !== 0) return '0';
  return parseFloat(val).toLocaleString('es-MX');
}

onMounted(fetchLiveStock);
</script>

<style scoped>
.favorites-page {
  min-height: 100vh;
  background: #faf7f4;
}

.favorites-main {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

.favorites-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.favorites-header {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  flex-wrap: wrap;
}

.favorites-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #141413;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin: 0;
}

.favorites-subtitle {
  font-size: 0.9rem;
  color: #7a6570;
  margin: 0;
}

/* Loading */
.fav-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem 0;
  color: #7a6570;
}

.fav-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #e0d0e0;
  border-top-color: #860734;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Empty */
.fav-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 5rem 1rem;
  text-align: center;
  color: #7a6570;
}

.fav-empty h2 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #141413;
  margin: 0;
}

.fav-empty p {
  font-size: 0.95rem;
  max-width: 360px;
  margin: 0;
  line-height: 1.6;
}

.btn-primary-link {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.75rem;
  background: #860734;
  color: #fff;
  border-radius: 50px;
  font-weight: 700;
  text-decoration: none;
  margin-top: 0.5rem;
  transition: background 0.2s, transform 0.15s;
}

.btn-primary-link:hover {
  background: #6a052a;
  transform: translateY(-2px);
}

/* Sold-out banner */
.sold-out-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  background: #fff3cd;
  border: 1px solid #ffd270;
  border-radius: 12px;
  color: #92400e;
  font-size: 0.9rem;
  font-weight: 500;
  flex-wrap: wrap;
}

.sold-out-clear-btn {
  margin-left: auto;
  background: none;
  border: 1px solid #92400e;
  color: #92400e;
  border-radius: 8px;
  padding: 0.35rem 0.875rem;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}

.sold-out-clear-btn:hover {
  background: rgba(146, 64, 14, 0.08);
}

/* Grid */
.fav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.25rem;
}

/* Card */
.fav-card {
  position: relative;
  background: #fff;
  border-radius: 16px;
  border: 1px solid rgba(134, 7, 52, 0.07);
  box-shadow: 0 2px 12px rgba(134, 7, 52, 0.07);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.25s, transform 0.25s;
}

.fav-card:hover {
  box-shadow: 0 8px 28px rgba(134, 7, 52, 0.13);
  transform: translateY(-3px);
}

.fav-card--soldout {
  opacity: 0.75;
}

/* Sold-out overlay */
.soldout-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.45);
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 0.75rem;
  pointer-events: none;
}

.soldout-badge {
  background: #dc2626;
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* Image */
.fav-card__img-link {
  display: block;
  aspect-ratio: 4/3;
  overflow: hidden;
  background: #f9f4f5;
}

.fav-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
}

.fav-card:hover .fav-card__img {
  transform: scale(1.04);
}

/* Body */
.fav-card__body {
  padding: 0.875rem 1rem 0.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.fav-card__name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #141413;
  text-decoration: none;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.fav-card__name:hover { color: #860734; }

.fav-card__price {
  color: #860734;
  font-weight: 800;
  font-size: 1.05rem;
  margin: 0;
}

.fav-card__stock-msg {
  font-size: 0.78rem;
  color: #dc2626;
  font-weight: 500;
  margin: 0;
}

/* Actions */
.fav-card__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem 0.875rem;
}

.fav-card__btn-cart {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  background: #860734;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 0.55rem 1rem;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.fav-card__btn-cart:hover { background: #6a052a; }

.fav-card__btn-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid #e0d0e0;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
  flex-shrink: 0;
}

.fav-card__btn-remove:hover {
  color: #dc2626;
  border-color: #fca5a5;
  background: #fff1f1;
}

@media (max-width: 640px) {
  .favorites-main { padding: 1.5rem 1rem 3rem; }
  .fav-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 0.875rem; }
  .fav-card__btn-cart { font-size: 0.75rem; padding: 0.5rem 0.625rem; }
}
</style>
```

- [ ] **Step 2: Commit**
```bash
git add src/views/FavoritesView.vue
git commit -m "feat(favorites): add FavoritesView with stock status and sold-out detection"
```

---

## Task 7: Add route + Navbar entry

**Files:**
- Modify: `src/router/index.js`
- Modify: `src/components/Navbar.vue`

- [ ] **Step 1: Add route to router**

In `src/router/index.js`, add import:
```js
const FavoritesView = () => import('../views/FavoritesView.vue');
```

Add route inside the `routes` array (after `/cart`):
```js
{ path: '/favoritos', component: FavoritesView, meta: { title: 'Mis Favoritos' } },
```

Note: No `requiresAuth` — favorites work without login (stored locally).

- [ ] **Step 2: Add heart icon to Navbar**

In `src/components/Navbar.vue`, find the imports or script setup block and add:
```js
import { useFavoritesStore } from '../stores/favoritesStore';
const favStore = useFavoritesStore();
```

In the template, inside `.navbar__actions` (next to the cart/logout buttons), add:
```html
<router-link to="/favoritos" class="navbar__action-btn" title="Mis favoritos" aria-label="Mis favoritos">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
  <span v-if="favStore.count" class="navbar__badge">{{ favStore.count }}</span>
</router-link>
```

Add styles in the Navbar `<style scoped>` block:
```css
.navbar__action-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: #141413;
  text-decoration: none;
  transition: color 0.2s, background 0.2s;
}

.navbar__action-btn:hover {
  color: #860734;
  background: rgba(134, 7, 52, 0.06);
}

.navbar__badge {
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 16px;
  height: 16px;
  background: #860734;
  color: #fff;
  font-size: 0.62rem;
  font-weight: 700;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
  line-height: 1;
}
```

- [ ] **Step 3: Commit**
```bash
git add src/router/index.js src/components/Navbar.vue
git commit -m "feat(favorites): add /favoritos route and heart icon in Navbar"
```

---

## Self-Review

**Spec coverage:**
- ✅ User can save products as favorites → `FavoriteButton` on `ProductCard`
- ✅ User can view their favorites → `FavoritesView` at `/favoritos`
- ✅ Out-of-stock detection → `fetchLiveStock()` on mount, `soldOut` computed
- ✅ Sold-out visual → badge overlay + "Sin existencias" text + banner
- ✅ Remove sold-out items → "Eliminar agotados" button + individual remove
- ✅ Persistence across page refresh → IndexedDB via `favoritesStorage`
- ✅ Count badge in Navbar → `favStore.count` reactive
- ✅ Add to cart from favorites → `addToCart` action

**Type consistency:**
- `favStore.items` → array of product objects with `id`, `name`, `price`, `images`
- `favStore.toggle(product)` called from `FavoriteButton` with full product object
- `favStore.remove(productId)` called with just the ID from `FavoritesView`
- `favStore.count` is a computed number used in `Navbar` and `FavoritesView`
- `liveStockMap[id]` is `number | undefined` — default to 1 (available) if undefined

**DB version:** All 4 files (`cartStorage`, `AxiosConfig`, `favoritesStorage`, plus new storage) open at version 4 with identical upgrade handlers. ✅

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-22-favorites.md`.

**Two execution options:**

**1. Subagent-Driven (recommended)** — fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
