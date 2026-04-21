# 🔐 EXPLICACIÓN: CÓMO FUNCIONA EL FLUJO DE AUTENTICACIÓN Y TOKENS

## ✅ SÍ, EL LOGIN GUARDA EL TOKEN AUTOMÁTICAMENTE

El sistema está completamente automatizado. Aquí te explico cómo funciona:

---

## 🔄 FLUJO PASO A PASO

### PASO 1: Usuario hace login
```
Usuario ingresa email/contraseña en /login
```

### PASO 2: LoginView.vue envía los datos
**Archivo:** `src/views/LoginView.vue` (línea 265-272)
```javascript
async function handleLogin() {
  const res = await authService.login(email.value, password.value);
  // Backend responde con:
  // {
  //   "accessToken": "eyJ...",
  //   "refreshToken": "eyJ...",
  //   ...
  // }
  
  // Guardar tokens en localStorage
  authService.setTokens(accessToken, refreshToken);
  
  // Redirigir a /admin
  router.push('/admin');
}
```

### PASO 3: authService.setTokens() guarda en localStorage
**Archivo:** `src/services/auth.js` (línea 32-35)
```javascript
setTokens(accessToken, refreshToken) {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
}
```

**Resultado en el navegador:**
```
localStorage:
  ✅ accessToken: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9..."
  ✅ refreshToken: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9..."
```

### PASO 4: Interceptor de Axios agrega el token automáticamente
**Archivo:** `src/config/AxiosConfig.js` (línea 42-52)
```javascript
axios.interceptors.request.use((config) => {
  // Leer el token de localStorage
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
  
  // Si hay token, agregarlo a TODOS los requests
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});
```

---

## 🚀 RESULTADO

Cada vez que hagas una solicitud a la API:

```
ANTES (sin autenticación):
GET http://localhost:8080/api/products
Headers: { Content-Type: application/json }
❌ ERROR 401 Unauthorized

DESPUÉS (con token):
GET http://localhost:8080/api/products
Headers: { 
  Content-Type: application/json,
  Authorization: Bearer eyJ... ✅
}
✅ ÉXITO 200 OK con datos
```

---

## 📊 CICLO COMPLETO DE AUTENTICACIÓN

```
┌─────────────────────────────────────────────────────┐
│ 1. Usuario abre /login                              │
└─────────────┬───────────────────────────────────────┘
              │
┌─────────────▼───────────────────────────────────────┐
│ 2. Ingresa email y contraseña                       │
└─────────────┬───────────────────────────────────────┘
              │
┌─────────────▼───────────────────────────────────────┐
│ 3. handleLogin() envía POST /api/auth/login         │
└─────────────┬───────────────────────────────────────┘
              │
┌─────────────▼───────────────────────────────────────┐
│ 4. Backend responde con accessToken + refreshToken │
└─────────────┬───────────────────────────────────────┘
              │
┌─────────────▼───────────────────────────────────────┐
│ 5. authService.setTokens() guarda en localStorage  │
│    localStorage.accessToken = "eyJ..."             │
│    localStorage.refreshToken = "eyJ..."            │
└─────────────┬───────────────────────────────────────┘
              │
┌─────────────▼───────────────────────────────────────┐
│ 6. Usuario redirigido a /admin                      │
└─────────────┬───────────────────────────────────────┘
              │
┌─────────────▼───────────────────────────────────────┐
│ 7. Interceptor de Axios agrega token automáticamente│
│    Authorization: Bearer eyJ...                     │
└─────────────┬───────────────────────────────────────┘
              │
┌─────────────▼───────────────────────────────────────┐
│ 8. Todas las APIs funcionan correctamente           │
│    ✅ GET /api/products (con token)                 │
│    ✅ GET /api/orders (con token)                   │
│    ✅ POST /api/orders (con token)                  │
│    etc...                                           │
└─────────────────────────────────────────────────────┘
```

---

## 🔍 CÓDIGO DETALLADO

### 1. Login - Obtener Token
**Archivo:** `src/services/auth.js`
```javascript
async login(email, password) {
  return axios.doPost('/api/auth/login', { 
    email, 
    password 
  });
  // Response: { accessToken: "...", refreshToken: "..." }
}
```

### 2. Guardar Token
**Archivo:** `src/services/auth.js`
```javascript
setTokens(accessToken, refreshToken) {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
}
```

### 3. Usar Token en APIs
**Archivo:** `src/config/AxiosConfig.js`
```javascript
// INTERCEPTOR: Se ejecuta ANTES de cada solicitud
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});
```

### 4. Aplicar en Servicios
**Archivo:** `src/services/products.js`
```javascript
async getAll() {
  // El interceptor automáticamente agrega el token
  // No necesitas hacer nada, ¡funciona automáticamente!
  return await axiosConfig.doGet('/api/products');
}
```

---

## ✅ VERIFICACIÓN EN EL NAVEGADOR

### Paso 1: Abre DevTools (F12)
```
Presiona F12 en el navegador
```

### Paso 2: Ir a Storage / LocalStorage
```
DevTools → Application/Storage → LocalStorage → http://localhost:5173
```

### Paso 3: Verificar tokens guardados
```
Deberías ver:
  Key: accessToken
  Value: eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...

  Key: refreshToken
  Value: eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...
```

### Paso 4: Verificar header en Network
```
DevTools → Network → (cualquier solicitud)
Headers → Authorization: Bearer eyJ...
```

---

## 🛡️ SEGURIDAD

### Tokens Almacenados
- ✅ `accessToken` - Expira en 24 horas
- ✅ `refreshToken` - Sirve para obtener nuevo accessToken

### Headers Protegidos
- ✅ `Authorization: Bearer {token}` - Se envía en TODAS las solicitudes
- ✅ Se valida en el backend

### Protección de Rutas
- ✅ Router protege rutas que requieren autenticación
- ✅ Si no hay token, redirige a `/login`

### Manejo de Expiración
- ✅ Si token expira (401), Axios intercepta
- ✅ Limpia localStorage
- ✅ Redirige a `/login`

---

## 📋 CHECKLIST DE VERIFICACIÓN

- [x] Login guarda accessToken en localStorage
- [x] Login guarda refreshToken en localStorage
- [x] Axios interceptor lee el token automáticamente
- [x] Axios interceptor agrega Authorization header
- [x] Todas las APIs reciben el token
- [x] Token se valida en el backend
- [x] Si token expira, se limpian tokens y redirige a login

---

## 🎯 RESULTADO FINAL

**TODO FUNCIONA AUTOMÁTICAMENTE:**

1. ✅ Usuario hace login
2. ✅ Token se guarda en localStorage
3. ✅ Interceptor lo agrega a cada solicitud
4. ✅ Backend valida el token
5. ✅ APIs responden correctamente
6. ✅ Si expira, se limpia y redirige a login

**No necesitas hacer nada adicional.** ¡El sistema está completamente automatizado!

---

## 📊 DIAGRAMA DE FLUJO

```
┌──────────────────────────────────────────────────────────┐
│                     LOGIN FLOW                           │
└──────────────────────────────────────────────────────────┘

CLIENTE (Navegador)              SERVIDOR (Backend)
    │                                  │
    │─── POST /api/auth/login ────────▶│
    │     { email, password }          │
    │                            Valida credenciales
    │◀── { accessToken, ... } ─────────│
    │                                  │
    │ [localStorage.setItem]           │
    │ accessToken = "eyJ..."           │
    │                                  │
    ├─── GET /api/products ──────────▶│
    │  Authorization: Bearer eyJ...    │
    │                            Valida token
    │◀── [ productos ] ────────────────│
    │                                  │
    ├─── POST /api/orders ──────────▶│
    │  Authorization: Bearer eyJ...    │
    │  { items, ... }                  │
    │                            Crea orden
    │◀── { orderId, ... } ───────────│
    │                                  │
```

---

**CONCLUSIÓN:** ✅ Sí, el login guarda el token automáticamente y se usa en todas las APIs.


