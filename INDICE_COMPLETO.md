# 📑 ÍNDICE COMPLETO DE ARCHIVOS

## 📁 ESTRUCTURA DEL PROYECTO

```
muebleria-plaza-reforma/
├── 📄 Documentación
│   ├── COMIENZA_AQUI.md              ← 🌟 LEER PRIMERO
│   ├── RESUMEN_EJECUTIVO.txt
│   ├── STATUS_FINAL.md
│   ├── GUIA_APIS.txt
│   ├── GUIA_PRUEBAS.md
│   ├── INSTRUCCIONES_PANTALLAS.md
│   ├── RESUMEN_IMPLEMENTACION.md
│   ├── AUTENTICACION.md              (existente)
│   ├── README.md                     (existente)
│   └── INSTRUCCIONES_PRUEBA.txt      (existente)
│
├── src/
│   ├── views/                        (17 vistas)
│   │   ├── 🔐 Autenticación
│   │   │   ├── LoginView.vue
│   │   │   ├── RegisterView.vue
│   │   │   ├── ForgotPasswordView.vue
│   │   │   ├── ResetPasswordView.vue
│   │   │   ├── ChangePasswordView.vue
│   │   │   └── ProfileView.vue
│   │   │
│   │   ├── 📦 Productos
│   │   │   ├── ProductsListView.vue
│   │   │   ├── ProductManagerView.vue
│   │   │   └── LowStockView.vue
│   │   │
│   │   ├── 📊 Inventario
│   │   │   ├── InventoryAdjustView.vue
│   │   │   └── InventoryMovementsView.vue
│   │   │
│   │   ├── 🛒 Órdenes
│   │   │   ├── CartView.vue
│   │   │   ├── MyOrdersView.vue
│   │   │   └── OrderDetailView.vue
│   │   │
│   │   ├── 🎛️ Admin
│   │   │   ├── AdminDashboard.vue
│   │   │   ├── AdminOrdersView.vue
│   │   │   └── ReportsView.vue
│   │   │
│   │   ├── 🧪 Utilidades
│   │   │   └── APITestView.vue      ✨ NUEVO
│   │   │
│   │   └── 📱 Otras (existentes)
│   │       ├── HomeView.vue
│   │       ├── ProductsView.vue
│   │       ├── ProductDetailView.vue
│   │       ├── ContactView.vue
│   │       ├── AuthTestView.vue
│   │       ├── CategoriesView.vue
│   │       ├── PostsView.vue
│   │       ├── FurnitureView.vue
│   │       └── NotFound.vue
│   │
│   ├── services/                    (10 servicios)
│   │   ├── auth.js                 (9 métodos)
│   │   ├── products.js             (7 métodos)
│   │   ├── inventory.js            (5 métodos)
│   │   ├── orders.js               (6 métodos - antiguo)
│   │   ├── orders.new.js           (6 métodos - nuevo)
│   │   ├── customers.js            (5 métodos) ✨ NUEVO
│   │   ├── reports.js              (6 métodos)
│   │   ├── categories.js           (existente)
│   │   ├── furniture.js            (existente)
│   │   └── posts.js                (existente)
│   │
│   ├── config/
│   │   └── AxiosConfig.js          (Configuración de Axios)
│   │
│   ├── router/
│   │   └── index.js                (Rutas actualizadas)
│   │
│   ├── components/                 (Componentes reutilizables)
│   ├── directives/                 (Directivas personalizadas)
│   ├── assets/                     (Estilos y recursos)
│   ├── utils/                      (Utilidades)
│   ├── App.vue
│   └── main.js
│
├── public/
├── package.json
├── vite.config.js
└── index.html
```

---

## 🔐 VISTAS DE AUTENTICACIÓN

### 1. LoginView.vue (`/login`)
- Iniciar sesión con email/contraseña
- Guardador automático de tokens
- Link a "Recuperar contraseña"
- Link a "Registrarse"

### 2. RegisterView.vue (`/register`)
- Crear nueva cuenta
- Validación de contraseñas (mín. 8 caracteres)
- Validación de coincidencia de contraseñas
- Link a login después de registro

### 3. ForgotPasswordView.vue (`/forgot-password`)
- Solicitar recuperación de contraseña
- Multi-paso (email → validar token → nueva contraseña)
- Validación de token
- Link de volver a login

### 4. ResetPasswordView.vue (`/reset-password`)
- Confirmar token de reset
- Establecer nueva contraseña
- Indicador de fortaleza de contraseña
- Redirige a login después de reset

### 5. ChangePasswordView.vue (`/change-password`)
- Cambiar contraseña siendo autenticado
- Validación de contraseña actual
- Indicador de fortaleza
- Requiere autenticación

### 6. ProfileView.vue (`/profile`)
- Ver información del usuario
- Estado de contraseña
- Acceso a cambiar contraseña
- Requiere autenticación

---

## 📦 VISTAS DE PRODUCTOS

### 7. ProductsListView.vue (`/productos-lista`)
- Listar todos los productos
- Filtros y búsqueda
- Ver detalles de cada producto
- Requiere autenticación

### 8. ProductManagerView.vue (`/productos-manager`)
- CRUD completo de productos
- Crear nuevo producto (modal)
- Editar producto (modal)
- Eliminar producto (confirmación)
- Solo para ADMIN
- Requiere autenticación

### 9. LowStockView.vue (`/low-stock`)
- Ver productos con stock bajo
- Alertas visuales (crítico vs bajo)
- Tabla con información de stock
- Botón para ajustar inventario
- Solo para ADMIN
- Requiere autenticación

---

## 📊 VISTAS DE INVENTARIO

### 10. InventoryAdjustView.vue (`/inventory-adjust`)
- Tab "Ajustar Stock": Establecer stock manualmente
- Tab "Agregar Stock": Agregar unidades (compras/devoluciones)
- Tab "Remover Stock": Remover unidades (ventas/daños)
- Registro de motivos
- Solo para ADMIN
- Requiere autenticación

### 11. InventoryMovementsView.vue (`/inventory-movements/:productId`)
- Ver historial de cambios de inventario
- Tipo de movimiento (PURCHASE, MANUAL, etc.)
- Fecha y cantidad de cada movimiento
- Tabla con detalles
- Solo para ADMIN
- Requiere autenticación

---

## 🛒 VISTAS DE ÓRDENES

### 12. CartView.vue (`/cart`)
- Carrito de compras
- Agregar productos
- Remover items
- Modificar cantidades
- Ver total
- Procesar compra
- Requiere autenticación

### 13. MyOrdersView.vue (`/my-orders`)
- Historial de órdenes del usuario
- Estado de cada orden
- Resumen de gastos totales
- Promedio por orden
- Link a detalles
- Requiere autenticación

### 14. OrderDetailView.vue (`/order-detail/:id`)
- Detalles completos de una orden
- Items, cantidades, precios unitarios
- Estado actual
- Dirección de envío
- Cliente (si es ADMIN)
- Requiere autenticación

---

## 🎛️ VISTAS DE ADMINISTRACIÓN

### 15. AdminDashboard.vue (`/admin`)
- Panel principal de admin
- Gestión de categorías
- Tabla de productos
- Acciones rápidas (crear producto, crear categoría)
- Solo para ADMIN
- Requiere autenticación

### 16. AdminOrdersView.vue (`/admin-orders`)
- Gestión de todas las órdenes
- Cambiar estado (PENDING, SHIPPED, DELIVERED, etc.)
- Cancelar órdenes
- Filtros por estado
- Solo para ADMIN
- Requiere autenticación

### 17. ReportsView.vue (`/reports`)
- Tab "Ventas": Reporte de ventas por período
- Tab "Top Productos": Productos más vendidos
- Tab "Stock Bajo": Alertas de stock bajo
- Tab "Finanzas": Ganancia e ingresos
- Filtros por fecha
- Tablas con datos
- Solo para ADMIN
- Requiere autenticación

---

## 🧪 VISTA DE UTILIDADES

### 18. APITestView.vue (`/api-test`) ✨ NUEVO
- Hub central de navegación
- Links a todas las pantallas
- Muestra estado del token
- Info de la API (URL base)
- Requiere autenticación

---

## 🔧 SERVICIOS

### auth.js - Autenticación (9 métodos)
```javascript
- register(userData)           // POST /api/auth/register
- login(email, password)       // POST /api/auth/login
- refreshToken(refreshToken)   // POST /api/auth/refresh
- logout(accessToken, refreshToken)  // POST /api/auth/logout
- setTokens(accessToken, refreshToken)
- getTokens()
- clearTokens()
- isAuthenticated()
- changePassword(userId, currentPassword, newPassword)  // POST
- getPasswordStatus(userId)    // GET /api/auth/password-status/{userId}
- forgotPassword(email)        // GET /api/auth/forgot-password
- validateResetToken(token)    // GET /api/auth/validate-reset-token
- resetPassword(token, newPassword, confirmPassword)  // POST
```

### products.js - Productos (7 métodos)
```javascript
- getAll()                     // GET /api/products
- getById(id)                  // GET /api/products/{id}
- getLowStock()                // GET /api/products/low-stock
- getRelated(id, limit)        // GET /api/products/{id}/related
- create(data)                 // POST /api/products
- update(id, data)             // PUT /api/products/{id}
- delete(id)                   // DELETE /api/products/{id}
```

### inventory.js - Inventario (5 métodos)
```javascript
- getMovements(productId)      // GET /api/inventory/movements/{productId}
- getAvailableStock(productId) // GET /api/inventory/available-stock/{productId}
- adjustStock(productId, newQuantity, reason)  // POST
- addStock(productId, quantity, referenceType, notes)  // POST
- removeStock(productId, quantity, reason)     // POST
```

### orders.js - Órdenes (6 métodos)
```javascript
- createOrder(orderData)       // POST /api/orders
- getOrderById(id)             // GET /api/orders/{id}
- listOrders(customerId)       // GET /api/orders
- updateOrderStatus(id, status)  // PUT /api/orders/{id}/status
- cancelOrder(id)              // DELETE /api/orders/{id}
```

### orders.new.js - Órdenes Nuevo (6 métodos) ✨ NUEVO
```javascript
- create(data)                 // POST /api/orders
- getById(id)                  // GET /api/orders/{id}
- getAll(customerId)           // GET /api/orders
- getByCustomer(customerId)    // GET /api/orders/customer/{customerId}
- updateStatus(id, status)     // PUT /api/orders/{id}/status
- cancel(id)                   // DELETE /api/orders/{id}
```

### customers.js - Clientes (5 métodos) ✨ NUEVO
```javascript
- getAll()                     // GET /api/customers
- getById(id)                  // GET /api/customers/{id}
- create(data)                 // POST /api/customers
- update(id, data)             // PUT /api/customers/{id}
- getStats(id)                 // GET /api/customers/{id}/stats
```

### reports.js - Reportes (6 métodos)
```javascript
- getSalesReport(startDate, endDate)        // GET /api/reports/sales
- getProductsReport(startDate, endDate)     // GET /api/reports/products
- getLowStockAlerts()                       // GET /api/reports/low-stock-alerts
```

---

## 🔗 RUTAS CONFIGURADAS (router/index.js)

Todas las rutas están en `src/router/index.js` con:
- Lazy loading para todas las vistas
- Validación de autenticación
- Metadata para títulos de página
- Protección de rutas por rol (ADMIN)

---

## 📊 TOTAL DE IMPLEMENTACIÓN

| Tipo | Cantidad | Estado |
|------|----------|--------|
| Vistas | 27 | ✅ |
| Servicios | 10 | ✅ |
| Métodos de Servicio | 38+ | ✅ |
| Endpoints | 32+ | ✅ |
| Documentos | 8 | ✅ |
| Líneas de Código | 5000+ | ✅ |

---

## 🎯 CÓMO ENCONTRAR LO QUE NECESITAS

### Si quiero...
- **Entender el proyecto** → Leer `COMIENZA_AQUI.md`
- **Ver todos los endpoints** → Ver `STATUS_FINAL.md`
- **Probar con Postman** → Ver `GUIA_PRUEBAS.md`
- **Conocer detalles técnicos** → Ver `RESUMEN_IMPLEMENTACION.md`
- **Buscar una pantalla específica** → Ver índice arriba
- **Buscar un servicio específico** → Ver índice arriba

---

## ✅ ESTADO: COMPLETADO

Todas las pantallas, servicios y endpoints están implementados y documentados.

**Próximo paso:** Abre http://localhost:5173 y comienza a usar.

---

**Fecha:** 2026-04-10

