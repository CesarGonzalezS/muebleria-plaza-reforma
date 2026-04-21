# DEBUG: Error 401 Unauthorized al Crear Muebles

## El Problema
Al intentar crear/actualizar muebles, recibes: **401 Unauthorized - Token inválido o expirado**

## Solución Paso a Paso

### 1. Verificar que el Token se Guarda Después de Login
Abre **DevTools (F12)** → **Console** y ejecuta:
```javascript
console.log('AccessToken:', localStorage.getItem('accessToken'));
console.log('Token:', localStorage.getItem('token'));
```

Deberías ver algo como:
```
AccessToken: eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJjZXNhcmBleGFtcGxlLmNvbSIs...
Token: (si no aparece, es normal)
```

**Si no aparece nada**, significa que el token NO se guardó después del login.

### 2. Verificar que el Token se Envía en las Peticiones
Abre **DevTools** → **Network** y realiza una petición (ej: Crear Mueble).

Haz clic en la petición POST a `/furniture/` y ve a:
- **Headers** → busca `Authorization: Bearer eyJhbGc...`

Si está ahí ✓, el token SÍ se envía.
Si NO está, el frontend no está agregando el token.

### 3. Revisar los Logs del Console Frontend
En **DevTools** → **Console** deberías ver:

**Antes de hacer petición:**
```
📡 [REQUEST] POST http://localhost:8080/furniture/
   Token en localStorage: ✓ presente
   ✓ Authorization header establecido
   Token (primeros 50 caracteres): eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJjZXNhcmBl...
   Formato: ✓ JWT válido
   ✅ Token enviado en header: true
```

**Después de respuesta:**
```
❌ [401 ERROR] /furniture/ | Error: {success: false, message: 'Token inválido o expirado...', status: 401}
⚠️  Token inválido o expirado. Limpiando datos locales...
```

### 4. Si Ves el Error 401, el Problema es en el Backend

**Esto significa:**
- El frontend SÍ envía el token correctamente ✓
- El backend NO lo reconoce como válido ✗

**Soluciones:**
1. **Verifica que el token en el backend coincida con el que enviaste**
   - Copia el token del console
   - Decodifícalo en https://jwt.io/
   - Verifica que expire_at sea futuro (no pasado)

2. **Sincroniza la hora entre frontend y backend**
   - Backend: `date` o verificar reloj del sistema
   - Frontend: `new Date().toISOString()` en console

3. **Verifica que el backend está usando la misma SECRET_KEY**
   - Si cambiaste la SECRET_KEY en backend, TODOS los tokens antiguos son inválidos
   - Solución: Haz login nuevamente para obtener un nuevo token

4. **Reinicia el servidor backend**
   ```bash
   # Detén el backend (Ctrl+C)
   # Reinicialo
   mvn spring-boot:run
   ```

### 5. Checklist Rápido

- [ ] ¿El token aparece en localStorage después de login?
- [ ] ¿El token aparece en Network Headers?
- [ ] ¿El token comienza con `eyJ` (JWT válido)?
- [ ] ¿El reloj del sistema está sincronizado?
- [ ] ¿El backend se reinició después de cambios?
- [ ] ¿Los logs del backend muestran que recibe el token?

### 6. Test Rápido con curl

Ejecuta en terminal (reemplaza TOKEN con el token real):
```bash
curl -X POST http://localhost:8080/furniture/ \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "price": 100,
    "costPrice": 50,
    "categoryId": 1
  }'
```

Si recibes 401 aquí también, el problema es 100% del backend.
Si funciona, el problema es cómo el frontend envía el token.

### 7. Autofix Implementado

Se ha actualizado el `AxiosConfig.js` para:
- ✅ Mostrar más detalles en logs
- ✅ Limpiar tokens si recibe 401
- ✅ Redirigir a login automáticamente
- ✅ Verificar que el token se envía en headers

**Acción:** Recarga la página (Ctrl+F5) para cargar el nuevo código.

---

## Próximos Pasos

1. **Refresca la página** (Ctrl+F5)
2. **Haz login** nuevamente
3. **Intenta crear un mueble** mientras tienes DevTools abierto
4. **Comparte los logs** de la consola si sigues teniendo problemas

