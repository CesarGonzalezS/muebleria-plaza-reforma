# 📚 Guía de Integración de APIs - Mueblería Plaza Reforma

Este documento describe cómo consumir todas las APIs del backend en el frontend de Vue.

---

## 🔐 **1. Autenticación**

### Base de URL
```
http://localhost:8080
```

### Endpoints

#### Registro
```javascript
import axiosConfig from '@/config/AxiosConfig.js';

const userData = {
  name: "Juan Pérez",
  email: "juan@example.com",
  password: "SecurePass123!",
  phone: "+52 5555551234",
  address: "Calle 123",
  city: "CDMX",
  state: "DF",
  postalCode: "01234"
};

const res = await axiosConfig.doPost('/api/auth/register', userData);
// Respuesta: { success: true, data: { id, name, email, ... } }
```

#### Login
```javascript
const loginData = {
  email: "juan@example.com",
  password: "SecurePass123!"
};

const res = await axiosConfig.doPost('/api/auth/login', loginData);
// Respuesta: { success: true, data: { accessToken, refreshToken, tokenType, expiresIn, ... } }

// Los tokens se guardan automáticamente en localStorage
```

#### Logout
```javascript
await axiosConfig.doPost('/api/auth/logout');
// Se limpian automáticamente los tokens de localStorage
```

#### Refrescar Token
```javascript
const refreshToken = localStorage.getItem('refreshToken');
const res = await axiosConfig.doPost('/api/auth/refresh', null, {
  params: { refreshToken }
});
```

---

## 🛍️ **2. Productos**

### Servicio Disponible
```javascript
// Importar el servicio
import { 
  getFurniture,
  getFurnitureById,
  createFurniture,
  updateFurniture,
  deleteFurniture,
  getLowStockProducts,
  getRelatedProducts
} from '@/services/furniture.js';

// O usar el servicio alternativo
import { productService } from '@/services/products.js';
```

### Endpoints

#### Obtener Todos los Productos
```javascript
// Opción 1: Usando servicio furniture.js (recomendado)
const productos = await getFurniture();
// Respuesta: { success: true, data: [{ id, name, price, stock, ... }] }

// Opción 2: Usando llamada directa
import axiosConfig from '@/config/AxiosConfig.js';
const res = await axiosConfig.doGet('/api/products');
```

**Ejemplo en HomeView**:
```javascript
import { getFurniture } from '../services/furniture.js';
import { ref, onMounted } from 'vue';

const featuredProducts = ref([]);
const loadingFeatured = ref(false);

async function fetchFeaturedProducts() {
  loadingFeatured.value = true;
  try {
    const res = await getFurniture();
    const productsData = Array.isArray(res) ? res : (res.data || []);
    featuredProducts.value = productsData.slice(0, 6).map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      img: item.images?.[0]?.url || '/assets/img/products/default.jpg'
    }));
  } catch (error) {
    console.error('Error cargando productos:', error);
    featuredProducts.value = [];
  } finally {
    loadingFeatured.value = false;
  }
}

onMounted(fetchFeaturedProducts);
```

#### Obtener Producto por ID
```javascript
const producto = await getFurnitureById(1);
// Respuesta: { success: true, data: { id, name, price, description, ... } }
```

#### Productos con Stock Bajo
```javascript
const lowStockProducts = await getLowStockProducts();
// Respuesta: array de productos con stock <= minStock
```

#### Productos Relacionados
```javascript
const related = await getRelatedProducts(1, 5); // id del producto, límite
// Respuesta: array de 5 productos relacionados
```

#### Crear Producto (ADMIN)
```javascript
const newProduct = {
  name: "Silla de Oficina",
  description: "Silla ergonómica de oficina",
  price: 1500,
  costPrice: 800,
  stock: 20,
  minStock: 5,
  imageUrl: "https://...",
  categoryId: 1,
  brandId: 1
};

const res = await createFurniture(newProduct);
```

#### Actualizar Producto (ADMIN)
```javascript
const updatedData = {
  name: "Silla de Oficina Premium",
  price: 1800,
  stock: 25
};

const res = await updateFurniture(1, updatedData);
```

#### Eliminar Producto (ADMIN)
```javascript
await deleteFurniture(1);
```

---

## 📂 **3. Categorías**

### Servicio Disponible
```javascript
import { 
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '@/services/categories.js';
```

### Endpoints

#### Obtener Todas las Categorías
```javascript
const categorias = await getCategories();
// Respuesta: { success: true, data: [{ id, name, description, ... }] }
```

**Ejemplo en ProductsView**:
```javascript
import { getCategories } from '@/services/categories.js';

const categories = ref([]);

async function fetchCategories() {
  try {
    const categoriesData = await getCategories();
    categories.value = categoriesData.map(cat => ({
      value: cat.name.toLowerCase(),
      label: cat.name,
      id: cat.id
    }));
  } catch (error) {
    console.error('Error cargando categorías:', error);
    categories.value = [];
  }
}
```

#### Obtener Categoría por ID
```javascript
const categoria = await getCategoryById(1);
```

#### Crear Categoría (ADMIN)
```javascript
const newCategory = {
  name: "Sillas",
  description: "Categoría de sillas"
};

const res = await createCategory(newCategory);
```

#### Actualizar Categoría (ADMIN)
```javascript
const updated = await updateCategory(1, { name: "Sillas Premium" });
```

#### Eliminar Categoría (ADMIN)
```javascript
await deleteCategory(1);
```

---

## 🏢 **4. Marcas**

### Servicio Disponible
```javascript
import { 
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand
} from '@/services/brands.js';
```

### Endpoints

#### Obtener Todas las Marcas
```javascript
const marcas = await getBrands();
// Respuesta: { success: true, data: [{ id, name, ... }] }
```

#### Obtener Marca por ID
```javascript
const marca = await getBrandById(1);
```

#### Crear Marca (ADMIN)
```javascript
const newBrand = {
  name: "Hermès",
  description: "Muebles de lujo francés"
};

const res = await createBrand(newBrand);
```

#### Actualizar Marca (ADMIN)
```javascript
const updated = await updateBrand(1, { name: "Hermès Premium" });
```

#### Eliminar Marca (ADMIN)
```javascript
await deleteBrand(1);
```

---

## 📦 **5. Órdenes**

### Servicio Disponible
```javascript
import { 
  orderService 
} from '@/services/orders.js';
```

### Endpoints

#### Crear Orden
```javascript
const orderData = {
  customerId: 1,
  items: [
    { productId: 1, quantity: 2 },
    { productId: 3, quantity: 1 }
  ]
};

const res = await orderService.createOrder(orderData);
// Respuesta: { success: true, data: { id, customerId, items, status, ... } }
```

#### Obtener Orden por ID
```javascript
const orden = await orderService.getOrderById(1);
```

#### Listar Órdenes
```javascript
// Todas las órdenes
const allOrders = await orderService.listOrders();

// Órdenes de un cliente específico
const customerOrders = await orderService.listOrders(1);
```

#### Actualizar Estado de Orden (ADMIN)
```javascript
await orderService.updateOrderStatus(1, 'PENDIENTE');
// Estados posibles: PENDIENTE, PROCESANDO, ENVIADO, ENTREGADO, CANCELADA
```

#### Cancelar Orden (ADMIN)
```javascript
await orderService.cancelOrder(1);
```

---

## 📊 **6. Inventario**

### Servicio Disponible
```javascript
import { 
  inventoryService 
} from '@/services/inventory.js';
```

### Endpoints (ADMIN)

#### Obtener Movimientos de Inventario
```javascript
const movements = await inventoryService.getMovements(1); // productId
// Respuesta: array de movimientos de stock
```

#### Obtener Stock Disponible
```javascript
const stock = await inventoryService.getAvailableStock(1); // productId
// Respuesta: { success: true, data: 25 }
```

#### Ajustar Stock
```javascript
await inventoryService.adjustStock(1, 30, 'Restock manual');
// Establece el stock en 30 unidades
```

#### Agregar Stock
```javascript
await inventoryService.addStock(
  1,           // productId
  10,          // cantidad
  'COMPRA',    // tipo de referencia
  'Compra a proveedor'  // notas
);
```

#### Remover Stock
```javascript
await inventoryService.removeStock(1, 5, 'Devolución de cliente');
```

---

## ⚙️ **7. Configuración de Axios**

### Archivo: `src/config/AxiosConfig.js`

El cliente Axios está configurado con:
- ✅ Base URL: `http://localhost:8080`
- ✅ Interceptores de request para agregar JWT token automáticamente
- ✅ Manejo de errores 401, 403, 400, 404, 500
- ✅ Guardado de tokens en localStorage e IndexedDB
- ✅ Notificaciones con SweetAlert2

### Métodos Disponibles

```javascript
import axiosConfig from '@/config/AxiosConfig.js';

// GET
const res = await axiosConfig.doGet('/api/products');

// POST
const res = await axiosConfig.doPost('/api/orders', orderData);

// PUT
const res = await axiosConfig.doPut('/api/products/1', updatedData);

// DELETE
const res = await axiosConfig.doDelete('/api/products/1');

// POST con archivo
const formData = new FormData();
formData.append('file', file);
const res = await axiosConfig.doPostFile('/api/upload', formData);

// Utilidades de token
const token = await axiosConfig.getToken();
const isAuth = await axiosConfig.isAuthenticated();
await axiosConfig.removeToken();

// Notificaciones
axiosConfig.ToastSuccess('Éxito', 'Operación exitosa');
axiosConfig.ToastError('Error', 'Algo salió mal');
axiosConfig.ToastWarning('Advertencia', 'Verifica esto');
```

---

## 🎯 **8. Flujos de Ejemplo**

### Ejemplo: Mostrar Productos en HomeView
```vue
<template>
  <div v-if="loadingFeatured" class="skeleton-loader">
    <!-- Skeleton -->
  </div>
  <div v-else class="products-grid">
    <div v-for="product in featuredProducts" :key="product.id">
      <h3>{{ product.name }}</h3>
      <p>${{ product.price }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getFurniture } from '@/services/furniture.js';

const featuredProducts = ref([]);
const loadingFeatured = ref(false);

async function fetchFeaturedProducts() {
  loadingFeatured.value = true;
  try {
    const res = await getFurniture();
    const productsData = Array.isArray(res) ? res : (res.data || []);
    featuredProducts.value = productsData.slice(0, 6);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    loadingFeatured.value = false;
  }
}

onMounted(fetchFeaturedProducts);
</script>
```

### Ejemplo: Filtrar Productos en ProductsView
```javascript
import { getFurniture } from '@/services/furniture.js';
import { getCategories } from '@/services/categories.js';

const searchTerm = ref('');
const selectedCategory = ref('');
const minPrice = ref('');
const maxPrice = ref('');

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.value.toLowerCase());
    
    const matchesCategory = !selectedCategory.value ||
      product.category_name?.toLowerCase() === selectedCategory.value.toLowerCase();
    
    const matchesMinPrice = !minPrice.value || 
      product.price >= Number(minPrice.value);
    
    const matchesMaxPrice = !maxPrice.value || 
      product.price <= Number(maxPrice.value);
    
    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
  });
});
```

### Ejemplo: Crear una Orden
```javascript
import { orderService } from '@/services/orders.js';
import axiosConfig from '@/config/AxiosConfig.js';

async function createOrder(items) {
  try {
    const orderData = {
      customerId: 1,
      items: items // [ { productId, quantity }, ... ]
    };
    
    const res = await orderService.createOrder(orderData);
    axiosConfig.ToastSuccess('Orden creada', 'Tu orden se ha creado exitosamente');
    
    return res.data;
  } catch (error) {
    axiosConfig.ToastError('Error', 'No pudimos crear tu orden');
    throw error;
  }
}
```

---

## 🚨 **9. Manejo de Errores**

### Ejemplo: Try-Catch con Manejo de Errores
```javascript
async function fetchProducts() {
  loadingProducts.value = true;
  try {
    const res = await getFurniture();
    products.value = res.data || [];
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('Token expirado, redirigiendo a login...');
      // El interceptor maneja esto automáticamente
    } else if (error.response?.status === 403) {
      console.log('No tienes permisos para esta acción');
    } else if (error.response?.status === 404) {
      console.log('Recurso no encontrado');
    } else {
      console.error('Error desconocido:', error);
    }
    products.value = [];
  } finally {
    loadingProducts.value = false;
  }
}
```

---

## 📋 **10. Estructura de Respuestas**

### Respuesta Exitosa
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Producto",
    "price": 1500
  },
  "message": "Operación exitosa"
}
```

### Respuesta de Error
```json
{
  "success": false,
  "data": null,
  "message": "Error al obtener producto",
  "errorCode": 400
}
```

---

## 🔑 **11. Autenticación con JWT**

### Cómo Funciona
1. Al hacer login, se reciben `accessToken` y `refreshToken`
2. El `accessToken` se envía automáticamente en el header `Authorization: Bearer <token>`
3. Si el token expira (error 401), se intenta refrescarlo automáticamente
4. Si el refresh también falla, se redirige a login

### Verificar Autenticación
```javascript
import axiosConfig from '@/config/AxiosConfig.js';

// Verificar si está autenticado
const isAuth = await axiosConfig.isAuthenticated();

// Obtener token actual
const token = await axiosConfig.getToken();

// Obtener tiempo de expiración
const expiresIn = await axiosConfig.getTokenExpiresIn();
```

---

## ✅ **12. Checklist para Nuevas Funcionalidades**

Cuando agregues una nueva funcionalidad que consuma APIs:

- [ ] Crear un servicio en `src/services/` si es necesario
- [ ] Importar el servicio en el componente Vue
- [ ] Usar `ref()` para datos reactivos
- [ ] Usar `onMounted()` para cargar datos iniciales
- [ ] Implementar try-catch con manejo de errores
- [ ] Mostrar skeleton loader mientras carga
- [ ] Mostrar mensaje de error si falla
- [ ] Validar estructura de respuestas del backend
- [ ] Probar en navegador (Network tab en DevTools)
- [ ] Revisar console.log para depuración

---

## 📞 **Soporte**

Para más información sobre los endpoints del backend:
- Revisar `openapi.yaml` en el proyecto backend
- Ver `src/main/java/com/mx/mbrl/controller/` para las implementaciones
- Consultar `docs/services.example.js` para ejemplos completos

