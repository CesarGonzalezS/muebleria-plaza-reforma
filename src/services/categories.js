import api from '../config/AxiosConfig';

export async function getCategories() {
  // Usar /api/products y extraer categorías únicas
  try {
    const res = await api.doGet('/api/products');
    if (res.data && res.data.data) {
      // Extraer categorías únicas de los productos
      const categories = [...new Set(res.data.data.map(p => p.category))];
      return {
        success: true,
        data: categories.map((cat, idx) => ({ id: idx + 1, name: cat }))
      };
    }
    return { success: true, data: [] };
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return { success: false, data: [], error };
  }
}

export async function createCategory(data) {
  // Las categorías se crean con los productos en /api/products
  // Este es un placeholder que simula la creación
  console.log('Categoría creada localmente:', data);
  return {
    success: true,
    data: { id: Date.now(), ...data }
  };
}

export async function updateCategory(id, data) {
  // Placeholder para editar categoría
  console.log('Categoría actualizada:', id, data);
  return { success: true, data };
}

export async function deleteCategory(id) {
  // Placeholder para eliminar categoría
  console.log('Categoría eliminada:', id);
  return { success: true };
}
