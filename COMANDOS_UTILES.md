# 🛠️ Comandos Útiles - Seguridad Frontend

## 🚀 Comandos de Desarrollo

### Iniciar el servidor de desarrollo
```bash
npm run dev
```
- ✅ Vue DevTools habilitado
- ✅ Console visible para debugging
- ✅ Recarga automática
- 🌐 Acceso: http://localhost:5173

### Construir para producción
```bash
npm run build
```
- ❌ Vue DevTools deshabilitado
- ❌ Console deshabilitado
- ✅ Código minificado y ofuscado
- ✅ Sin source maps
- 📁 Resultado en carpeta `/dist`

### Preview de la build
```bash
npm run preview
```
- Prueba la versión de producción localmente
- 🌐 Acceso: http://localhost:5173

---

## 🧪 Comandos de Testing

### Ejecutar tests
```bash
npm run test
```

### Ejecutar tests en UI
```bash
npm run test:ui
```

### Coverage de tests
```bash
npm run test:coverage
```

---

## 🔍 Verificación de Seguridad

### Auditar dependencias
```bash
npm audit
```
- Busca vulnerabilidades conocidas
- Muestra reporte detallado

### Corregir vulnerabilidades automáticamente
```bash
npm audit fix
```

---

## 🐳 Comandos Docker

### Construir imagen Docker
```bash
docker build -t muebleria-plaza-reforma:latest .
```

### Ejecutar contenedor Docker
```bash
docker run -p 80:80 muebleria-plaza-reforma:latest
```

### Acceder: http://localhost

---

## 📊 Análisis de Bundle

### Analizar tamaño de chunks
```bash
npm run build -- --analyze
```
(Requiere instalar: `npm install --save-dev rollup-plugin-visualizer`)

---

## 🔐 Verificar Headers de Seguridad

### Con curl
```bash
curl -I http://localhost:5173
# Verá:
# X-Content-Type-Options: nosniff
# X-Frame-Options: SAMEORIGIN
# Content-Security-Policy: ...
```

### Con Edge/Chrome DevTools
1. Abrir DevTools (F12)
2. Ir a Network
3. Hacer una solicitud
4. Ver pestaña "Response Headers"

---

## 📝 Inspeccionar Build

### Ver archivos generados
```bash
ls -la dist/
```

### Ver contenido del archivo JS minificado
```bash
cat dist/js/main-*.js | head -1
```

### Contar líneas de código
```bash
wc -l dist/js/main-*.js
```

---

## 🧹 Limpieza

### Limpiar caché npm
```bash
npm cache clean --force
```

### Eliminar node_modules
```bash
rm -r node_modules
npm install
```

### Limpiar carpeta dist
```bash
rm -r dist
npm run build
```

---

## 🔧 Configuración de Seguridad

### Habilitar restricciones adicionales

**Archivo:** `src/main.js`

```javascript
// Cambiar opciones según necesidad
initSecurityProtections({
  detectDevTools: true,           // Detectar DevTools
  disableConsole: true,           // Deshabilitar console
  protectGlobals: true,           // Proteger objetos globales
  disableRightClick: false,       // ← Cambiar a true
  disableDevToolsShortcuts: false // ← Cambiar a true
});
```

---

## 📋 Variables de Entorno

### Crear archivo .env.local
```bash
cp .env.example .env.local
```

### Variables disponibles
```
NODE_ENV=production
VITE_API_URL=http://localhost:8080
VITE_DEBUG_MODE=false
VITE_ENABLE_DEVTOOLS_DETECTION=true
```

---

## 🚚 Deploymentmente

### Con Vercel
```bash
# Instalar CLI
npm i -g vercel

# Deploy
vercel
```

### Con Netlify
```bash
# Instalar CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir dist
```

### Con GitHub Pages
```bash
# Construir
npm run build

# Push a rama gh-pages
git subtree push --prefix dist origin gh-pages
```

### Con Docker (Nginx)
```bash
# Ya configurado en Dockerfile y nginx.conf
docker build -t app:latest .
docker run -p 80:80 app:latest
```

---

## 🐛 Debug

### Verificar que minificación funciona
```bash
npm run build
# Abrir: dist/js/main-*.js en editor
# Debe ser código en 1 línea, ilegible
```

### Verificar que Console está deshabilitado
```bash
npm run preview
# F12 → Console
# Escribir: console.log("test")
# Debe NO mostrar nada
```

### Verificar que DevTools es detectado
```bash
npm run preview
# F12 (abrir DevTools)
# Debe mostrar: "⚠️ ADVERTENCIA DE SEGURIDAD" en console
```

### Logs de errores
```bash
npm run dev 2>&1 | tee build.log
```

---

## 📞 Solución de Problemas

### Error: "Cannot find module 'security.js'"
```bash
npm install
npm run dev
```

### Error: "Port 5173 already in use"
```bash
npm run dev -- --port 5174
```

### Build incompleta
```bash
rm -rf dist
npm run build
```

### DevTools sigue visible
```bash
# 1. Limpiar caché del navegador (Ctrl+Shift+Del)
# 2. Reconstruir: npm run build
# 3. Abrir en navegador privado
```

---

## 📚 Documentación

- **SEGURIDAD_FRONTEND.md** - Guía completa
- **GUIA_RAPIDA_SEGURIDAD.md** - Resumen rápido
- **RESUMEN_SEGURIDAD_IMPLEMENTADA.md** - Checklist

---

## ⚡ Tips Profesionales

### 1. Usar npm scripts personalizados
```json
{
  "scripts": {
    "build:prod": "NODE_ENV=production npm run build",
    "analyze": "npm run build -- --analyze",
    "secure": "npm audit && npm run build"
  }
}
```

### 2. Pre-deploy checklist
```bash
npm audit          # Verificar seguridad
npm run test       # Correr tests
npm run build      # Construir
npm run preview    # Preview local
```

### 3. Monitorear en producción
- Usar Sentry para errores
- Usar LogRocket para reproducción
- Usar Datadog para performance

---

**Última actualización:** 2026-04-28
**Versión:** 1.0.0
Mueblería Plaza Reforma

