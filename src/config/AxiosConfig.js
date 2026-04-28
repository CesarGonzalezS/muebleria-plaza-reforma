import axios from "axios";
import Swal from "sweetalert2";
import { getDB } from './db.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

// ===== IN-MEMORY FALLBACK (Firefox Tracking Prevention) =====
// If IndexedDB/localStorage blocked, token lives in memory for session duration
const memoryStore = {};

function safeLocalGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function safeLocalSet(key, value) {
  try { localStorage.setItem(key, value); } catch { /* blocked */ }
}
function safeLocalRemove(key) {
  try { localStorage.removeItem(key); } catch { /* blocked */ }
}

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===== IndexedDB HELPERS =====
const STORE_NAME = 'auth';

async function setInDB(key, value) {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
      const req = store.put(value, key);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve();
    });
  } catch (e) {
    // Error silencioso
  }
}

async function getFromDB(key) {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
      const req = store.get(key);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve(req.result);
    });
  } catch (e) {
    return null;
  }
}

async function removeFromDB(key) {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
      const req = store.delete(key);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve();
    });
  } catch (e) {
    // Error silencioso
  }
}

// ===== TOAST HELPERS =====
const ToastError = (title, message) =>
    Swal.fire({ icon: "error", title, text: message });

const ToastWarning = (title, message) =>
    Swal.fire({ icon: "warning", title, text: message });

const ToastSuccess = (title, message) =>
    Swal.fire({ icon: "success", title, text: message, timer: 2000, showConfirmButton: false });

// ===== TOKEN MANAGEMENT (ASYNC with memory fallback) =====
export async function getToken() {
  // 1. Check memory (fastest, immune to tracking prevention)
  if (memoryStore.accessToken) return memoryStore.accessToken;
  // 2. Try localStorage
  const local = safeLocalGet('accessToken') || safeLocalGet('token');
  if (local) { memoryStore.accessToken = local; return local; }
  // 3. Try IndexedDB
  try {
    const token = await getFromDB('accessToken');
    if (token) { memoryStore.accessToken = token; return token; }
  } catch (e) {
    // IndexedDB no disponible
  }
  return null;
}

export async function saveToken(token) {
  if (!token) return;
  // Save to all available stores
  memoryStore.accessToken = token;
  safeLocalSet('accessToken', token);
  safeLocalSet('token', token);
  try {
    await setInDB('accessToken', token);
  } catch (e) {
    // IndexedDB no disponible
  }
}

export async function removeToken() {
  delete memoryStore.accessToken;
  safeLocalRemove('accessToken');
  safeLocalRemove('token');
  safeLocalRemove('role');
  safeLocalRemove('user');
  try {
    await Promise.all([
      removeFromDB('accessToken'),
      removeFromDB('token'),
      removeFromDB('user'),
      removeFromDB('userData')
    ]);
  } catch (e) {
    console.warn('[API] IndexedDB unavailable during removeToken');
  }
}

export async function isAuthenticated() {
  const token = await getToken();
  return !!token && token.length > 0;
}

// Testing utility - reset memory store between tests
export function __resetMemoryStore() {
  memoryStore.accessToken = undefined;
}

// ===== TOKEN EXPIRATION CHECK (SYNC FALLBACK) =====
// Decode JWT without async (used in sync contexts)
function decodeToken(tokenStr) {
  if (!tokenStr) return null;
  try {
    const decoded = JSON.parse(atob(tokenStr.split('.')[1]));
    return decoded;
  } catch {
    return null;
  }
}

// Cache for token to avoid repeated decoding
let tokenCache = null;
let tokenCacheTime = 0;

export function getTokenExpirationSync(tokenStr = null) {
  try {
    const decoded = decodeToken(tokenStr);
    if (!decoded || !decoded.exp) return null;
    return decoded.exp * 1000;
  } catch {
    return null;
  }
}

export function isTokenExpired() {
  // This is called from interceptor, needs sync check
  // Will be updated when token is loaded
  return false; // Default: token not expired until proven otherwise
}

export async function getTokenExpiration() {
  const token = await getToken();
  if (!token) return null;
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return null;
  return decoded.exp * 1000;
}

export async function getTokenExpiresIn() {
  const expiration = await getTokenExpiration();
  if (!expiration) return null;
  const ms = expiration - Date.now();
  return ms > 0 ? ms : null;
}

// ===== AXIOS INTERCEPTORS =====
// REQUEST: Agregar token + verificar expiracion
instance.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    const method = config.method.toUpperCase();
    const path = config.url;

    // Check token expiration
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const expiresAt = decoded.exp * 1000;

      if (Date.now() >= expiresAt) {
        console.warn("[API] Token expirado - limpiando");
        await removeToken();
        ToastWarning("Sesion expirada", "Por favor inicia sesion nuevamente.");
        window.location.href = "/login";
        return Promise.reject(new Error('Token expirado'));
      }

      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[API] ${method} ${path} - Token enviado`);
    } else {
      console.log(`[API] ${method} ${path} - Sin token`);
    }

    // Add CSRF token if available
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
                      sessionStorage.getItem('csrfToken');
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    return config;
  },
  (error) => {
    console.error("[API] Error en request:", error);
    return Promise.reject(error);
  }
);

// RESPONSE: Manejar errores
instance.interceptors.response.use(
  (response) => {
    const { status } = response;
    console.log(`[API] Respuesta exitosa - Status: ${status}`);
    return response;
  },
  async (error) => {
    if (!error.response) {
      console.error("[API] Error de conexion:", error.message);
      ToastError("Error de conexion", "No se pudo conectar con el servidor.");
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    const url = error.config?.url || '';
    const method = error.config?.method?.toUpperCase() || 'UNKNOWN';

    console.error(`[API] Error ${status} en ${method} ${url}:`, data);

    if (status === 401) {
      const isPublicCatalog = method === 'GET' && (
        /\/api\/products(\/|$|\?)/.test(url) ||
        url.includes('/api/settings/home')
      );

      if (!url.includes('/api/auth/') && !isPublicCatalog) {
        console.warn("[API] Token invalido o expirado - Limpiando sesion");
        await removeToken();

        if (window.location.pathname !== "/login") {
          ToastError("Sesion expirada", "Por favor inicia sesion nuevamente.");
          setTimeout(() => {
            window.location.href = "/login";
          }, 800);
        }
      }
      return Promise.reject(error);
    }

    if (status === 403) {
      ToastWarning("Acceso denegado", "No tienes permisos para esta accion.");
      return Promise.reject(error);
    }

    if (status === 400) {
      const message = data?.message || data?.error || "Verifica la informacion ingresada.";
      ToastWarning("Datos incorrectos", message);
      return Promise.reject(error);
    }

    if (status === 404) {
      ToastWarning("No encontrado", "El recurso solicitado no existe.");
      return Promise.reject(error);
    }

    if (status === 500) {
      ToastError("Error del servidor", "Ocurrio un error. Intentalo mas tarde.");
      return Promise.reject(error);
    }

    ToastError("Error", data?.message || "Ocurrio un error inesperado");
    return Promise.reject(error);
  }
);

export default {
  async doDelete(url, data) { return await instance.delete(url, { data }); },
  async doPost(url, data, config = {}) { return await instance.post(url, data, config); },
  async doGet(url, config = {}) { return await instance.get(url, config); },
  async doPut(url, data, config = {}) { return await instance.put(url, data, config); },
  async doPostFile(url, data) {
    return await instance.post(url, data, { headers: { "Content-Type": "multipart/form-data" } });
  },
  async doPutFile(url, data) {
    return await instance.put(url, data, { headers: { "Content-Type": "multipart/form-data" } });
  },
  ToastSuccess,
  ToastError,
  ToastWarning,
  getToken,
  saveToken,
  removeToken,
  isAuthenticated,
  getTokenExpiration,
  isTokenExpired,
  getTokenExpiresIn,
  __resetMemoryStore
};
