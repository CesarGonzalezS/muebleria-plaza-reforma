# 🎉 Pantallas Implementadas - Mueblería Plaza Reforma

## ✅ Estado Actual

Se han implementado **17 pantallas** que consumen todos los endpoints de las APIs:

### 🔐 Autenticación (6 pantallas)
- ✅ Registro (`/register`)
- ✅ Login (`/login`)
- ✅ Recuperar Contraseña (`/forgot-password`)
- ✅ Resetear Contraseña (`/reset-password`)
- ✅ Cambiar Contraseña (`/change-password`)
- ✅ Mi Perfil (`/profile`)

### 📦 Productos (3 pantallas)
- ✅ Listado de Productos (`/productos-lista`)
- ✅ Gestor de Productos (`/productos-manager`)
- ✅ Productos con Stock Bajo (`/low-stock`)

### 📊 Inventario (2 pantallas)
- ✅ Ajustar Inventario (`/inventory-adjust`)
- ✅ Movimientos de Inventario (`/inventory-movements/:productId`)

### 🛒 Órdenes (3 pantallas)
- ✅ Carrito (`/cart`)
- ✅ Mis Órdenes (`/my-orders`)
- ✅ Detalles de Orden (`/order-detail/:id`)

### 🎛️ Administración (3 pantallas)
- ✅ Panel de Admin (`/admin`)
- ✅ Gestión de Órdenes (`/admin-orders`)
- ✅ Reportes (`/reports`)

### 🧪 Utilidades (1 pantalla)
- ✅ Test de APIs (`/api-test`)

---

## 🚀 Cómo Usar

### Paso 1: Asegurar que el Backend esté corriendo
```bash
# El backend debe estar en http://localhost:8080
# O configurar VITE_API_URL en vite.config.js
```

### Paso 2: Crear una Cuenta
1. Ir a `/register`
2. Llenar los datos:
   - Nombre
   - Email
   - Contraseña (mín. 8 caracteres)
   - Teléfono (opcional)
3. Hacer clic en "Registrarse"

### Paso 3: Iniciar Sesión
1. Ir a `/login`
2. Ingresar email y contraseña
3. Se guardarán los tokens automáticamente
4. Te redirigirá a `/admin`

### Paso 4: Explorar las Funcionalidades
- **Ir a `/api-test`** para ver todos los links disponibles
- Cada pantalla tiene un propósito específico
- Todas están conectadas con los servicios en `/src/services/`

---

## 📁 Estructura de Archivos

```
src/
├── views/
│   ├── LoginView.vue                  # Login
│   ├── RegisterView.vue               # Registro
│   ├── ForgotPasswordView.vue          # Recuperar contraseña
│   ├── ResetPasswordView.vue           # Resetear contraseña
│   ├── ChangePasswordView.vue          # Cambiar contraseña
│   ├── ProfileView.vue                # Mi perfil
│   ├── ProductsListView.vue           # Listado de productos
│   ├── ProductManagerView.vue         # Gestor de productos
│   ├── LowStockView.vue               # Stock bajo
│   ├── InventoryAdjustView.vue        # Ajustar inventario
│   ├── InventoryMovementsView.vue     # Movimientos
│   ├── CartView.vue                   # Carrito
│   ├── MyOrdersView.vue               # Mis órdenes
│   ├── OrderDetailView.vue            # Detalles de orden
│   ├── AdminDashboard.vue             # Panel de admin
│   ├── AdminOrdersView.vue            # Gestión de órdenes
│   ├── ReportsView.vue                # Reportes
│   └── APITestView.vue                # Test de APIs
├── services/
│   ├── auth.js                        # Servicios de autenticación
│   ├── products.js                    # Servicios de productos
│   ├── inventory.js                   # Servicios de inventario
│   ├── orders.js                      # Servicios de órdenes
│   └── reports.js                     # Servicios de reportes
└── router/
    └── index.js                       # Rutas y configuración
```

---

## 🔧 Configuración de Entorno

En `vite.config.js`, asegurar que esté:

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('http://localhost:8080')
  }
})
```

---

## 🔗 Rutas Rápidas

| Ruta | Descripción | Requiere Auth |
|------|-------------|---------------|
| `/login` | Iniciar sesión | No |
| `/register` | Crear cuenta | No |
| `/forgot-password` | Recuperar contraseña | No |
| `/api-test` | Ver todas las pantallas | Sí |
| `/admin` | Panel de administración | Sí (ADMIN) |
| `/productos-lista` | Ver productos | Sí |
| `/productos-manager` | Gestionar productos | Sí (ADMIN) |
| `/low-stock` | Stock bajo | Sí (ADMIN) |
| `/inventory-adjust` | Ajustar inventario | Sí (ADMIN) |
| `/admin-orders` | Gestionar órdenes | Sí (ADMIN) |
| `/reports` | Ver reportes | Sí (ADMIN) |

---

## 📋 Notas Importantes

1. **Autenticación**: Todos los endpoints requieren el header `Authorization: Bearer <token>`
   - Se incluye automáticamente en todos los servicios
   - El token se guarda en `localStorage.accessToken`

2. **Roles**: 
   - `USER`: Puede ver productos y hacer órdenes
   - `ADMIN`: Acceso completo a todas las funciones

3. **Validaciones**:
   - Contraseñas: Mínimo 8 caracteres
   - Emails: Formato válido
   - Stock: No puede ser negativo

4. **Estilos**: 
   - Bootstrap Icons para iconos
   - Gradientes personalizados
   - Responsive en móvil

---

## 🐛 Troubleshooting

### Error 401 (No autorizado)
- Verifica que hayas iniciado sesión
- El token puede haber expirado (24 horas)
- Intenta hacer logout y login nuevamente

### Error 403 (Acceso denegado)
- Solo usuarios ADMIN pueden acceder a ciertas pantallas
- Verifica tu rol en la base de datos

### Error de conexión
- Asegúrate que el backend esté corriendo
- Verifica la URL en VITE_API_URL
- Revisa CORS en el backend

### Formularios no se envían
- Revisa la consola (F12) para errores específicos
- Asegúrate de llenar todos los campos requeridos
- Valida que los datos tengan el formato correcto

---

## 📞 Soporte

- Revisa `GUIA_APIS.txt` para más detalles
- Todos los servicios están en `/src/services/`
- Las pantallas usan componentes reutilizables

---

**¡Listo para usar!** 🎉

