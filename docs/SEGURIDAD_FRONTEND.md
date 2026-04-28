# 🔒 Guía de Seguridad Frontend - Mueblería Plaza Reforma

## Mejoras de Seguridad Implementadas

Este documento describe las mejoras implementadas para proteger tu aplicación frontend y hacer que el código no sea fácil de ver al inspeccionar en el navegador.

---

## 1. **Minificación y Ofuscación de Código**

### ✅ Implementado en: `vite.config.js`

#### Características:
- **Minificación agresiva con esbuild**: Reduce el tamaño del código y lo hace difícil de leer
- **Eliminar todos los console.log**: Se eliminan todos los mensajes de consola en producción
- **Eliminar debugger statements**: Se remover todas las declaraciones de debugging
- **Mangling de nombres de variables**: Los nombres de variables se acortan a letras aleatorias
- **Deshabilitar source maps en producción**: No se generan archivos `.map` que permitan ver el código original

#### Comandos:
```bash
# Construir para producción
npm run build

# El código resultante estará en /dist y será completamente minificado
```

---

## 2. **Desabilitar Vue DevTools en Producción**

### ✅ Implementado en: `vite.config.js`

**Antes:**
```javascript
plugins: [vue(), vueDevTools()]
```

**Ahora:**
```javascript
plugins: [
  vue(),
  process.env.NODE_ENV === 'development' && vueDevTools(),
].filter(Boolean)
```

**Beneficio:** Vue DevTools solo se carga en desarrollo, no en producción.

---

## 3. **Protección contra Debugging**

### ✅ Implementado en: `src/config/security.js`

Este archivo proporciona varias capas de protección:

#### A. **Detección de DevTools**
```javascript
detectDevTools() // Detecta si el usuario abre DevTools
```

Monitorea:
- Cambios en el tamaño de la ventana
- Ejecución de statements de debugging
- Acceso a funciones de inspección

#### B. **Desabilitar Console**
```javascript
// En producción, se desabilitarán:
console.log()
console.warn()
console.error()
console.info()
console.debug()
```

#### C. **Proteger Objetos Globales**
```javascript
// Prevenir acceso a window.chrome y otras propiedades de debugging
Object.defineProperty(window, 'chrome', { ... })
```

#### D. **Opcionales (puedes habilitarlas si lo deseas)**
```javascript
// Deshabilitar clic derecho
disableRightClick: true

// Deshabilitar atajos de teclado (F12, Ctrl+Shift+I, etc.)
disableDevToolsShortcuts: true
```

### Cómo activar opciones adicionales:

En `src/main.js`, modifica:

```javascript
initSecurityProtections({
  detectDevTools: true,
  disableConsole: true,
  protectGlobals: true,
  disableRightClick: true,  // ← Cambiar a true
  disableDevToolsShortcuts: true,  // ← Cambiar a true
});
```

---

## 4. **Headers de Seguridad HTTP**

### ✅ Implementado en: `nginx.conf`

#### Headers agregados:

| Header | Propósito |
|--------|-----------|
| **X-Content-Type-Options: nosniff** | Previene que el navegador interprete archivos incorrectamente |
| **X-Frame-Options: SAMEORIGIN** | Previene clickjacking (iframe embebido en otros sitios) |
| **X-XSS-Protection: 1; mode=block** | Protección contra XSS en navegadores antiguos |
| **Referrer-Policy** | Controla qué información se envía cuando el usuario navega a otros sitios |
| **Content-Security-Policy** | Define qué recursos pueden cargarse (scripts, estilos, imágenes, etc.) |
| **Permissions-Policy** | Controla qué características del navegador pueden usarse (cámara, micrófono, etc.) |

#### Content Security Policy (CSP):
```
default-src 'self';
script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https:;
connect-src 'self' http://localhost:8080;
```

**Beneficio:** Solo permite cargar recursos de fuentes confiables.

---

## 5. **Caché Inteligente**

### ✅ Implementado en: `nginx.conf`

```nginx
# Archivos estáticos (con hash en el nombre) se cachean por 1 año
location ~* \.(js|css|png|jpg|...)$ {
    expires 1y;
}

# Archivos HTML no se cachean (siempre se obtiene la última versión)
location ~* \.html$ {
    expires -1;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

**Beneficio:** Los nombres de los archivos incluyen hashes, así que cuando se actualiza el código, el navegador descarga automáticamente la nueva versión.

---

## 6. **Bloquear Acceso a Archivos Sensibles**

### ✅ Implementado en: `nginx.conf`

```nginx
# Denegar acceso a archivos ocultos (.env, .git, etc.)
location ~ /\. {
    deny all;
}

# Denegar acceso a archivos de respaldo (~)
location ~ ~$ {
    deny all;
}
```

---

## 7. **Compresión GZIP**

### ✅ Implementado en: `nginx.conf`

```nginx
gzip on;
gzip_comp_level 6;  # Nivel de compresión (1-9)
gzip_types text/plain text/css application/json application/javascript ...
```

**Beneficio:** Reduce el tamaño de los archivos transferidos en ~70%, haciendo más difícil leer el código.

---

## 📊 Resumen de Mejoras

| Mejora | Beneficio | Ubicación |
|--------|-----------|-----------|
| ✅ Minificación | Código ilegible | `vite.config.js` |
| ✅ Sin Source Maps | No se puede mapear a código original | `vite.config.js` |
| ✅ Sin Console | No hay pistas en la consola | `security.js` |
| ✅ Sin DevTools | No se puede inspeccionar en Chrome | `vite.config.js` + `security.js` |
| ✅ Headers de Seguridad | Protección contra XSS, Clickjacking, etc. | `nginx.conf` |
| ✅ CSP | Solo recursos confiables | `nginx.conf` |
| ✅ GZIP | Código comprimido y más pequeño | `nginx.conf` |

---

## 🚀 Cómo Construir para Producción

```bash
# 1. Construir la aplicación
npm run build

# 2. El resultado estará en /dist
# - Código minificado y ofuscado
# - Sin source maps
# - Sin DevTools
# - Sin console.log

# 3. Usar nginx.conf para servir los archivos
# Los headers de seguridad se añadirán automáticamente
```

---

## ⚠️ Importante

### Versión de Desarrollo vs Producción

**DESARROLLO:**
- ✅ Vue DevTools habilitado
- ✅ Console logs habilitado
- ✅ Source maps habilitado (para debugging)
- ✅ Código legible

**PRODUCCIÓN:**
- ❌ Vue DevTools deshabilitado
- ❌ Console logs deshabilitado
- ❌ Source maps deshabilitado
- ❌ Código minificado y ofuscado
- ✅ Headers de seguridad agregados
- ✅ Protección contra debugging

---

## 🔐 Opciones Avanzadas

Si quieres aún más seguridad, puedes habilitar:

### 1. **Deshabilitar Clic Derecho**
```javascript
// En src/main.js
disableRightClick: true
```

### 2. **Deshabilitar F12 y otros atajos**
```javascript
// En src/main.js
disableDevToolsShortcuts: true
```

### 3. **HTTPS y HSTS**
Si usas HTTPS, descomenta en `nginx.conf`:
```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```

### 4. **Protección contra WAF (Web Application Firewall)**
Considera usar servicios como:
- Cloudflare
- AWS WAF
- Sucuri

---

## 🧪 Cómo Verificar que Funciona

### 1. **Minificación:**
```bash
npm run build
# Abre /dist/js/main-[hash].js en un editor
# Verás que el código es ilegible
```

### 2. **Sin Console:**
```bash
npm run build
npm run preview  # Abre en navegador
# Abre DevTools (F12)
# Verás que console.log() no funciona
```

### 3. **Headers de Seguridad:**
```bash
# En el navegador, abre Network en DevTools
# Haz una solicitud
# Ve a la pestaña "Response Headers"
# Verás los headers de seguridad
```

---

## ❓ Preguntas Frecuentes

### ¿Puedo ver el código si desactivo JavaScript?
**No**, el HTML no contiene el código JavaScript, solo referencias a archivos minificados.

### ¿Puedo ver el código si descargo el archivo .js?
**Parcialmente**, porque está minificado y ofuscado, pero podrías intentar deofuscarlo con herramientas especializadas. Por eso es importante no poner datos sensibles en el frontend.

### ¿Debo poner tokens/contraseñas en el frontend?
**NO**, NUNCA. Siempre usa:
- Headers de autorización
- Cookies seguras
- Llamadas al backend para datos sensibles

### ¿Los headers de seguridad son suficientes?
**No**, es una capa más de seguridad. La verdadera seguridad está en el backend.

---

## 📝 Mejores Prácticas Adicionales

1. **NUNCA guardes datos sensibles en el frontend:**
   - ❌ Tokens
   - ❌ Contraseñas
   - ❌ Claves de API
   - ❌ Información de clientes

2. **SIEMPRE valida en el backend:**
   - No confíes en validaciones del frontend
   - Todos los datos pueden ser modificados

3. **Usa HTTPS en producción:**
   - Protege los datos en tránsito

4. **Mantén las dependencias actualizadas:**
   - Revisa vulnerabilidades regularmente
   - Usa `npm audit` y `npm audit fix`

5. **Configura CORS correctamente:**
   - Solo permite orígenes confiables
   - No uses `*` en producción

---

## 📞 Soporte

Si tienes preguntas sobre la seguridad, consulta:
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN - Security](https://developer.mozilla.org/es/docs/Web/Security)
- [Content Security Policy](https://developer.mozilla.org/es/docs/Web/HTTP/CSP)

---

**Última actualización:** 2026-04-28
**Aplicación:** Mueblería Plaza Reforma

