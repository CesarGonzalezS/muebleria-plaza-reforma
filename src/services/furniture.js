import api from '../config/AxiosConfig';

// --- CRUD principal via /api/products ---

export async function getFurniture() {
  const res = await api.doGet('/api/products');
  return res.data; // { success, data: [{id, name, price, categoryId, categoryName, brandId, brandName, ...}] }
}

export async function getFurnitureById(id) {
  const res = await api.doGet(`/api/products/${id}`);
  return res.data;
}

export async function createFurniture(data) {
  const res = await api.doPost('/api/products', data);
  return res.data;
}

export async function updateFurniture(id, data) {
  const res = await api.doPut(`/api/products/${id}`, data);
  return res.data;
}

export async function deleteFurniture(id) {
  const res = await api.doDelete(`/api/products/${id}`);
  return res.data;
}

// --- Categorías via /furniture/categories (SIN CAMBIOS) ---

export async function getFurnitureCategories() {
  const res = await api.doGet('/furniture/categories');
  return res.data;
}

// --- Marcas via /furniture/brands (SIN CAMBIOS) ---

export async function getFurnitureBrands() {
  const res = await api.doGet('/furniture/brands');
  return res.data;
}

// --- Búsqueda y filtros ---

export async function getFurniturePaginated(skip = 0, limit = 20) {
  const res = await api.doGet(`/api/products?skip=${skip}&limit=${limit}`);
  return res.data;
}

export async function getFurnitureByCategory(categoryId) {
  const res = await api.doGet(`/api/products?categoryId=${categoryId}`);
  return res.data;
}

export async function searchFurniture(term = '', categoryId = '', minPrice = '', maxPrice = '', skip = 0, limit = 20) {
  let url = `/api/products?skip=${skip}&limit=${limit}`;
  if (term) url += `&search=${encodeURIComponent(term)}`;
  if (categoryId) url += `&categoryId=${categoryId}`;
  if (minPrice) url += `&minPrice=${minPrice}`;
  if (maxPrice) url += `&maxPrice=${maxPrice}`;
  const res = await api.doGet(url);
  return res.data;
}

// --- Nuevos endpoints disponibles ---

export async function getLowStockProducts() {
  const res = await api.doGet('/api/products/low-stock');
  return res.data;
}

export async function getRelatedProducts(id, limit = 5) {
  const res = await api.doGet(`/api/products/${id}/related?limit=${limit}`);
  return res.data;
}

