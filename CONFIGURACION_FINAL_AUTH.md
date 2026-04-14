# Configuración Final: Sistema de Autenticación y Muebles

## Estado Actual ✅

### 1. API Consumo (Confirmado Correcto)
✅ Endpoint: `POST http://localhost:8080/furniture/`
✅ Autenticación: Token JWT en header `Authorization: Bearer <token>`
✅ Estructura: Exactamente como se documentó en la wiki de la API

### 2. Frontend - Flujo de Autenticación

#### A. Login (LoginView.vue)
1. Usuario ingresa email y contraseña
2. Frontend POST a `/auth/login`
3. Backend retorna: `{accessToken, refreshToken, user}`
4. **Se guarda en localStorage:**
   ```javascript
   localStorage.setItem('accessToken', token)
   localStorage.setItem('user', JSON.stringify(user))
   ```
5. Se redirige a `/admin`

#### B. AxiosConfig (Interceptor Automático)
**En cada petición HTTP:**
1. Lee token de localStorage
2. Agrega header automáticamente:
   ```
   Authorization: Bearer <token>
   ```
3. Si recibe 401:
   - Limpia localStorage
   - Redirige a /login
   - Muestra mensaje

### 3. Crear Mueble (Flow Completo)

```
[Usuario] → [FurnitureFormModal]
              ↓
         [handleSubmit()]
              ↓
         Valida datos
              ↓
         [furnitureService.createFurniture()]
              ↓
         [AxiosConfig] Agrega Authorization header
              ↓
         POST /furniture/ (CON TOKEN)
              ↓
         [Backend - Spring Boot]
              ↓
         Verifica token
              ↓
         Si válido: Crea mueble ✅
         Si expirado: 401 ❌
              ↓
         [Frontend] Recibe respuesta
              ↓
         Si error 401: Limpia token + redirige a login
         Si éxito: Muestra ToastSuccess + recarga lista
```

## Cambios Implementados Recientemente

### AxiosConfig.js
```
✅ Mejor logging de tokens
✅ Verifica que Authorization header se agrega
✅ Al recibir 401: limpia localStorage automáticamente
✅ Al recibir 401: redirige a /login automáticamente
```

### Furniture Service
```
✅ Agregado logging completo en createFurniture()
✅ Agregado logging completo en updateFurniture()
✅ Logs muestran: datos enviados, respuesta, errores
```

## Cómo Usar Esta Información

### Si Todo Funciona ✅
- Login → Dashboard → Crear Mueble → Éxito
- Los logs mostrarán el flujo completo

### Si Falla con 401 ❌
1. Abre DevTools (F12)
2. Ve a Console
3. Busca: `📡 [REQUEST] POST /furniture/`
4. Verifica:
   - ¿Aparece `✓ Authorization header establecido`?
   - ¿El token comienza con `eyJ`?
   - ¿Dice `✅ Token enviado en header: true`?

5. Si todo eso está bien, ve a Network:
   - Haz clic en la petición POST /furniture/
   - Ve a Headers
   - Busca `Authorization: Bearer ...`
   - Si está ahí pero recibió 401, el problema es backend

### Archivo de Debug Disponible
Revisa `DEBUG_TOKEN_401.md` para instrucciones detalladas

## Próximas Acciones Recomendadas

1. **Recarga la página** (Ctrl+F5) para cargar los cambios
2. **Haz login** nuevamente para obtener un token fresco
3. **Intenta crear un mueble** mientras observas DevTools Console
4. **Comparte los logs** si aún tienes problemas

## Checklist de Verificación

- [ ] ¿Recargaste la página? (Ctrl+F5)
- [ ] ¿Hiciste logout + login?
- [ ] ¿El token aparece en localStorage?
- [ ] ¿El token aparece en Request Headers?
- [ ] ¿Tienes DevTools abierto para ver logs?
- [ ] ¿Verificaste que categoryId existe?
- [ ] ¿El backend está corriendo en puerto 8080?

## Ejemplo de Logs Correctos (Esperados)

```
🚀 [Furniture Service] Creando mueble con datos: {name: "Silla", price: 1500, ...}
📡 [REQUEST] POST http://localhost:8080/furniture/
   Token en localStorage: ✓ presente
   ✓ Authorization header establecido
   Token (primeros 50 caracteres): eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJjZX...
   Formato: ✓ JWT válido
   ✅ Token enviado en header: true
✅ [Furniture Service] Mueble creado exitosamente: {id: 42, name: "Silla", ...}
```

## Ejemplo de Logs de Error (Si Problema)

```
🚀 [Furniture Service] Creando mueble con datos: {name: "Silla", ...}
📡 [REQUEST] POST http://localhost:8080/furniture/
   Token en localStorage: ✓ presente
   ✓ Authorization header establecido
❌ [401 ERROR] /furniture/ | Error: {success: false, message: 'Token inválido o expirado...'}
⚠️  Token inválido o expirado. Limpiando datos locales...
❌ [Furniture Service] Error al crear mueble: AxiosError...
   Status: 401
   Message: Token inválido o expirado
```

---

**Fecha de última actualización:** 14 de Abril 2026
**Cambios:** Mejorado logging, autofix de 401, validaciones frontend

