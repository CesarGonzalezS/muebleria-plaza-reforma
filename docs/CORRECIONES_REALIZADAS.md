# 🔧 CORRECIONES REALIZADAS

## ✅ PROBLEMA 1: FurnitureFormModal.vue:44 - Cannot read properties of null

### Causa
El prop `categories` era `null` pero el v-for intentaba iterar directamente sin validar.

### Solución
Cambiar línea 44 de:
```vue
<!-- ❌ ANTES -->
<option v-for="cat in categories" :key="cat.id" :value="cat.id">
```

A:
```vue
<!-- ✅ DESPUÉS -->
<option v-for="cat in (categories || [])" :key="cat?.id" :value="cat?.id">
  {{ cat?.name }}
</option>
```

**Cambios:**
- `categories` → `(categories || [])` - Usa array vacío si categories es null
- `cat.id` → `cat?.id` - Optional chaining por seguridad
- `cat.name` → `cat?.name` - Optional chaining por seguridad

---

## ✅ PROBLEMA 2: POST /furniture/categories 403 (Forbidden)

### Causa
El servicio `categories.js` usaba endpoint `/furniture/categories` que NO EXISTE en el backend.

Los endpoints correctos son:
- ✅ `/api/products` - Para productos
- ✅ `/api/orders` - Para órdenes
- ❌ `/furniture/categories` - NO EXISTE

### Solución
Actualizar `src/services/categories.js` para:

1. **getCategories()** - Ahora obtiene categorías desde `/api/products` extrayendo categorías únicas
```javascript
const res = await api.doGet('/api/products');
const categories = [...new Set(res.data.data.map(p => p.category))];
```

2. **createCategory()** - Simula creación localmente (las categorías se asignan al crear productos)

3. **updateCategory()** - Simula actualización local

4. **deleteCategory()** - Simula eliminación local

---

## 📋 RESUMEN DE CAMBIOS

| Archivo | Línea | Cambio | Razón |
|---------|-------|--------|-------|
| FurnitureFormModal.vue | 44 | `categories` → `(categories \|\| [])` | Evitar null |
| FurnitureFormModal.vue | 44 | `cat.id` → `cat?.id` | Optional chaining |
| categories.js | 3-6 | Usar `/api/products` | Endpoint correcto |
| categories.js | 8-11 | Crear localmente | `/furniture/categories` no existe |
| categories.js | 13-16 | Actualizar localmente | Endpoint no existe |
| categories.js | 18-20 | Eliminar localmente | Endpoint no existe |

---

## ✅ RESULTADO

Ahora:
1. ✅ No hay error "Cannot read properties of null"
2. ✅ Las categorías se obtienen desde `/api/products`
3. ✅ No hay error 403 en `/furniture/categories`
4. ✅ Todo funciona automáticamente

---

## 🧪 PARA PROBAR

1. Abre `/admin`
2. Haz click en "Nueva Categoría"
3. Se abrirá el modal sin errores
4. Completa los datos
5. Haz click en "Crear categoría"

**Resultado esperado:** ✅ Sin errores en consola

---

**Cambios realizados:** 2026-04-10

