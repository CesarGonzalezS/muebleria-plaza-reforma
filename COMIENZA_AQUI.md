# 🚀 SIGUIENTE PASO - EMPEZAR A USAR

## ✅ Todo Está Listo

Todas las pantallas están implementadas y funcionando con los endpoints correctos.

---

## 🎬 PARA COMENZAR

### 1. Asegurar que el Backend esté corriendo
```bash
# El backend debe estar en: http://localhost:8080
# Si está en otro puerto, actualiza VITE_API_URL en vite.config.js
```

### 2. Ejecutar el Frontend
```bash
npm run dev
# Abrirá en http://localhost:5173
```

### 3. Ir a la Pantalla de Bienvenida
```
http://localhost:5173
```

---

## 📱 PRIMEROS PASOS RECOMENDADOS

### Opción A: Crear cuenta nueva
1. Click en "Registrarse" en la home
2. O ir a `/register`
3. Llenar datos:
   - Nombre
   - Email
   - Contraseña (mín. 8 caracteres)
   - Teléfono (opcional)
4. Hacer click en "Registrarse"
5. Automáticamente te redirige a `/login`
6. Ingresar con las credenciales creadas

### Opción B: Usar cuenta existente
1. Ir a `/login`
2. Ingresar email y contraseña
3. Los tokens se guardan automáticamente

---

## 🗺️ MAPA DE NAVEGACIÓN

### Después de Iniciar Sesión
- Ir a `/api-test` para ver todos los links disponibles
- O navegar manualmente:

#### Para USUARIOS (USER):
- `/productos-lista` - Ver productos
- `/cart` - Comprar
- `/my-orders` - Ver compras
- `/profile` - Mi perfil
- `/change-password` - Cambiar contraseña

#### Para ADMIN:
- `/admin` - Dashboard
- `/productos-manager` - Gestionar productos
- `/low-stock` - Alertas de stock
- `/inventory-adjust` - Ajustar inventario
- `/admin-orders` - Gestionar órdenes
- `/reports` - Reportes

---

## 🧪 PROBAR LAS APIS

### Con Postman
1. Abrir Postman
2. Crear solicitud POST a `http://localhost:8080/api/auth/login`
3. Body (JSON):
```json
{
  "email": "tu@email.com",
  "password": "tu_contraseña"
}
```
4. Copiar el `accessToken` de la respuesta
5. En el siguiente request, agregar header:
```
Authorization: Bearer {tu_token_aqui}
```

### Con cURL
```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"tu@email.com","password":"tu_contraseña"}'

# Usar token
curl -X GET http://localhost:8080/api/products \
  -H "Authorization: Bearer {tu_token}"
```

---

## 📋 CHECKLIST DE VALIDACIÓN

- [ ] Backend corriendo en http://localhost:8080
- [ ] Frontend corriendo en http://localhost:5173
- [ ] Puedo registrar usuario
- [ ] Puedo iniciar sesión
- [ ] Veo `/api-test` con todos los links
- [ ] Puedo ver productos en `/productos-lista`
- [ ] Puedo hacer compras en `/cart`
- [ ] Si soy ADMIN, veo `/admin`
- [ ] Si soy ADMIN, puedo gestionar productos
- [ ] Los tokens se guardan en `localStorage`

---

## 🐛 SI ALGO NO FUNCIONA

### Error 401 (No autorizado)
- Verifica que estés logueado
- El token puede estar expirado (24 horas)
- Intenta logout y login nuevamente

### Error 403 (Acceso denegado)
- Solo ADMIN pueden acceder a ciertas pantallas
- Contacta al administrador para dar permisos

### Error de conexión
- Verifica que el backend esté corriendo
- Revisa que esté en `http://localhost:8080`
- Si está en otro puerto, actualiza `.env`

### Tokens no se guardan
- Abre DevTools (F12)
- Revisa localStorage
- Debe haber `accessToken` y `refreshToken`

---

## 📚 DOCUMENTACIÓN

Tenemos 4 documentos de ayuda:

1. **GUIA_APIS.txt** - Resumen de todas las APIs y pantallas
2. **GUIA_PRUEBAS.md** - Ejemplos detallados con cURL y Postman
3. **INSTRUCCIONES_PANTALLAS.md** - Guía de qué hace cada pantalla
4. **RESUMEN_IMPLEMENTACION.md** - Detalles técnicos de la implementación
5. **STATUS_FINAL.md** - Estado actual y mapeo completo

---

## 🎯 PRÓXIMOS PASOS OPCIONALES

### Si quieres agregar funcionalidades:
1. Las pantallas son básicas (estilos simples)
2. Puedes agregar más estilos en `<style scoped>`
3. Agregar gráficos en `/reports` (Chart.js, etc.)
4. Agregar validaciones más complejas

### Si quieres cambiar endpoints:
1. Actualizar `src/services/` según sea necesario
2. Las pantallas están diseñadas para ser fáciles de modificar
3. Cada pantalla es independiente

---

## 💡 TIPS

1. **LocalStorage**: Los tokens se guardan automáticamente
   - `localStorage.accessToken` - Token de acceso (24 horas)
   - `localStorage.refreshToken` - Token para refrescar

2. **Axios Config**: Los interceptors manejan:
   - Agregar tokens automáticamente
   - Mostrar errores con SweetAlert2
   - Redirigir a login si token expira

3. **Rutas Protegidas**: Las pantallas con `meta: { requiresAuth: true }`
   - No se pueden acceder sin token
   - Se redirigen automáticamente a `/login`

4. **Estilos**: Usa los colores principales:
   - Primario: `#667eea`
   - Secundario: `#764ba2`
   - Success: `#10b981`
   - Error: `#dc2626`

---

## 📞 SOPORTE RÁPIDO

| Problema | Solución |
|----------|----------|
| No puedo iniciar sesión | Verifica email/contraseña. Si es nuevo, regístrate primero |
| Token expirado | Cierra sesión y vuelve a iniciar |
| No tengo acceso a pantallas ADMIN | Pide al admin que cambie tu rol en la BD |
| No ves datos | Verifica que el backend esté corriendo y en puerto 8080 |
| Botones no responden | Abre DevTools (F12) y revisa errores en consola |

---

## 🎉 ¡LISTO!

Todo está configurado y listo para usar. 

**Próximo paso:** Abre http://localhost:5173 en tu navegador y comienza a explorar.

---

**Fecha:** 2026-04-10  
**Estado:** ✅ Completado y Listo

