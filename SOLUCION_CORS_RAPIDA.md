# Solución Rápida: CORS sin modificar el Backend

## Opción Rápida - Proxy Local en Vite

Si no quieres o no puedes modificar el backend ahora, usa esta solución TEMPORAL:

### Paso 1: Instala http-proxy-middleware

```bash
npm install --save-dev http-proxy-middleware
```

### Paso 2: Crea un middleware personalizado

Crea un archivo `src/server.js`:

```javascript
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

app.use('/api', createProxyMiddleware({
  target: 'http://localhost:8080',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api'
  }
}));

app.listen(3000, () => {
  console.log('Proxy server running on port 3000');
});
```

### Paso 3: Actualiza tu package.json

```json
{
  "scripts": {
    "dev": "concurrently \"npm run proxy\" \"npm run vite\"",
    "proxy": "node src/server.js",
    "vite": "vite"
  }
}
```

### Paso 4: Instala concurrently

```bash
npm install --save-dev concurrently
```

---

## Opción Más Simple - Usa el Proxy de Vite

Ya está configurado en tu `vite.config.js`. 

Solo debes cambiar tu `AxiosConfig.js` para usar URLs relativas:

```javascript
// src/config/AxiosConfig.js
const API_URL = "/api"; // ← Usa URLs relativas

axios.defaults.baseURL = API_URL;
```

Así todas las peticiones a `/api/*` se harán a través del proxy de Vite → `http://localhost:8080/api/*`

---

## Recomendación

**Para desarrollo**: Usa el proxy de Vite (más simple)
**Para producción**: Configura CORS en tu backend (lo correcto)

Elige la opción que prefieras y avísame si necesitas ayuda.

