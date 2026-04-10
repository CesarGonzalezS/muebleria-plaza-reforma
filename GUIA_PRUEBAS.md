# 🧪 Guía de Prueba - Todas las APIs

## ⚡ Inicio Rápido

### 1. Registrar Usuario
```
GET/POST: http://localhost:8080/api/auth/register
```
**Datos de prueba:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "SecurePass123!",
  "phone": "+52 5555551234"
}
```

**En la app:** `/register`

---

### 2. Iniciar Sesión
```
POST: http://localhost:8080/api/auth/login
```
**Datos:**
```json
{
  "email": "juan@example.com",
  "password": "SecurePass123!"
}
```

**Respuesta (guarda tokens):**
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "tokenType": "Bearer",
  "expiresIn": 86400
}
```

**En la app:** `/login`

---

### 3. Cambiar Contraseña
```
POST: http://localhost:8080/api/auth/change-password?userId=1
```
**Headers:**
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Datos:**
```json
{
  "currentPassword": "SecurePass123!",
  "newPassword": "NewPass456!",
  "confirmPassword": "NewPass456!"
}
```

**En la app:** `/change-password`

---

### 4. Recuperar Contraseña
```
GET: http://localhost:8080/api/auth/forgot-password?email=juan@example.com
```

**En la app:** `/forgot-password`

---

### 5. Listar Productos
```
GET: http://localhost:8080/api/products
```
**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Sofá de Cuero",
      "description": "Sofá cómodo",
      "price": 1299.99,
      "costPrice": 800.00,
      "stock": 15,
      "minStock": 5,
      "imageUrl": "https://...",
      "brand": "Marca Premium",
      "category": "Sofás",
      "isActive": true
    }
  ]
}
```

**En la app:** `/productos-lista`

---

### 6. Crear Producto (ADMIN)
```
POST: http://localhost:8080/api/products
```
**Headers:**
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Datos:**
```json
{
  "name": "Sofá Moderno",
  "description": "Sofá de diseño moderno",
  "price": 1599.99,
  "costPrice": 900.00,
  "stock": 20,
  "minStock": 5,
  "imageUrl": "https://...",
  "brandId": 1,
  "categoryId": 1
}
```

**En la app:** `/productos-manager` → "Nuevo Producto"

---

### 7. Productos con Stock Bajo (ADMIN)
```
GET: http://localhost:8080/api/products/low-stock
```
**Headers:**
```
Authorization: Bearer {accessToken}
```

**En la app:** `/low-stock`

---

### 8. Ajustar Stock (ADMIN)
```
POST: http://localhost:8080/api/inventory/adjust?productId=1&newQuantity=30&reason=Inventario+físico
```
**Headers:**
```
Authorization: Bearer {accessToken}
```

**En la app:** `/inventory-adjust` → Tab "Ajustar Stock"

---

### 9. Agregar Stock (ADMIN)
```
POST: http://localhost:8080/api/inventory/add-stock?productId=1&quantity=10&referenceType=MANUAL&notes=Reposición
```
**Headers:**
```
Authorization: Bearer {accessToken}
```

**En la app:** `/inventory-adjust` → Tab "Agregar Stock"

---

### 10. Remover Stock (ADMIN)
```
POST: http://localhost:8080/api/inventory/remove-stock?productId=1&quantity=5&reason=Daño
```
**Headers:**
```
Authorization: Bearer {accessToken}
```

**En la app:** `/inventory-adjust` → Tab "Remover Stock"

---

### 11. Movimientos de Inventario (ADMIN)
```
GET: http://localhost:8080/api/inventory/movements/1
```
**Headers:**
```
Authorization: Bearer {accessToken}
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "productId": 1,
      "movementType": "PURCHASE",
      "quantity": 10,
      "reason": "Compra inicial",
      "reference": "PO-123",
      "createdAt": "2026-04-08T10:00:00"
    }
  ]
}
```

**En la app:** `/inventory-movements/1`

---

### 12. Crear Orden
```
POST: http://localhost:8080/api/orders
```
**Headers:**
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Datos:**
```json
{
  "customerId": 1,
  "shippingAddress": "Calle 123, Apt 4B",
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "unitPrice": 1299.99
    }
  ]
}
```

**En la app:** `/cart` → "Procesar Compra"

---

### 13. Listar Órdenes del Usuario
```
GET: http://localhost:8080/api/orders
```
**Headers:**
```
Authorization: Bearer {accessToken}
```

**En la app:** `/my-orders`

---

### 14. Ver Detalle de Orden
```
GET: http://localhost:8080/api/orders/100
```
**Headers:**
```
Authorization: Bearer {accessToken}
```

**En la app:** `/order-detail/100`

---

### 15. Cambiar Estado de Orden (ADMIN)
```
PUT: http://localhost:8080/api/orders/100/status?status=SHIPPED
```
**Headers:**
```
Authorization: Bearer {accessToken}
```

**Estados válidos:**
- PENDING
- CONFIRMED
- SHIPPED
- DELIVERED
- CANCELLED

**En la app:** `/admin-orders` → "Cambiar Estado"

---

### 16. Listar Todas las Órdenes (ADMIN)
```
GET: http://localhost:8080/api/orders
```
**Headers:**
```
Authorization: Bearer {accessToken}
```

**En la app:** `/admin-orders`

---

### 17. Reporte de Ventas (ADMIN)
```
GET: http://localhost:8080/api/reports/sales?startDate=2026-04-01&endDate=2026-04-30
```
**Headers:**
```
Authorization: Bearer {accessToken}
```

**En la app:** `/reports` → Tab "Ventas"

---

### 18. Productos Más Vendidos (ADMIN)
```
GET: http://localhost:8080/api/reports/top-products?limit=10&startDate=2026-04-01&endDate=2026-04-30
```
**Headers:**
```
Authorization: Bearer {accessToken}
```

**En la app:** `/reports` → Tab "Top Productos"

---

### 19. Reporte Stock Bajo (ADMIN)
```
GET: http://localhost:8080/api/reports/low-stock
```
**Headers:**
```
Authorization: Bearer {accessToken}
```

**En la app:** `/reports` → Tab "Stock Bajo"

---

### 20. Ganancia por Período (ADMIN)
```
GET: http://localhost:8080/api/reports/profit?startDate=2026-04-01&endDate=2026-04-30
```
**Headers:**
```
Authorization: Bearer {accessToken}
```

**En la app:** `/reports` → Tab "Finanzas"

---

## 📊 Con Postman/cURL

### Obtener Token
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "SecurePass123!"
  }'
```

### Usar Token en Solicitud
```bash
curl -X GET http://localhost:8080/api/products \
  -H "Authorization: Bearer eyJ..."
```

---

## ✅ Checklist de Pruebas

### Autenticación
- [ ] Registro exitoso
- [ ] Login exitoso
- [ ] Token se guarda en localStorage
- [ ] Cambiar contraseña funciona
- [ ] Recuperar contraseña funciona

### Productos
- [ ] Listar productos
- [ ] Crear producto (ADMIN)
- [ ] Editar producto (ADMIN)
- [ ] Eliminar producto (ADMIN)
- [ ] Ver stock bajo (ADMIN)

### Inventario
- [ ] Ajustar stock
- [ ] Agregar stock
- [ ] Remover stock
- [ ] Ver movimientos

### Órdenes
- [ ] Crear orden
- [ ] Ver mis órdenes
- [ ] Ver detalle de orden
- [ ] Cambiar estado (ADMIN)
- [ ] Ver todas las órdenes (ADMIN)

### Reportes
- [ ] Reporte de ventas (ADMIN)
- [ ] Top productos (ADMIN)
- [ ] Stock bajo (ADMIN)
- [ ] Ganancia (ADMIN)

---

## 🚨 Errores Comunes

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Refresh token inválido o expirado",
  "errorCode": 401
}
```
**Solución:** Vuelve a hacer login

### 403 Forbidden
```json
{
  "success": false,
  "message": "Acceso denegado",
  "errorCode": 403
}
```
**Solución:** Necesitas ser ADMIN para este endpoint

### 400 Bad Request
```json
{
  "success": false,
  "message": "Error de validación",
  "errorCode": 400
}
```
**Solución:** Revisa que los datos sean válidos

### 404 Not Found
```json
{
  "success": false,
  "message": "Recurso no encontrado",
  "errorCode": 404
}
```
**Solución:** Verifica el ID o que el recurso exista

---

## 📝 Notas

1. **Dates Format:** `YYYY-MM-DD` (e.g., `2026-04-01`)
2. **Prices:** Usar decimales con punto (e.g., `1299.99`)
3. **Quantities:** Números enteros positivos
4. **Emails:** Formato válido
5. **Passwords:** Mínimo 8 caracteres

---

**¡Listo para probar!** 🚀

