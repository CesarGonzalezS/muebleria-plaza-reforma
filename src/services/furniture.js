import api from '../config/AxiosConfig';

// --- CRUD principal via /furniture/ ---

export async function getFurniture() {
  const res = await api.doGet('/furniture/');
  return res.data; // { success, data: [{id, name, price, categoryId, categoryName, brandId, brandName, ...}] }
}

export async function getFurnitureById(id) {
  const res = await api.doGet(`/furniture/${id}`);
  return res.data;
}

export async function createFurniture(data) {
  const res = await api.doPost('/furniture/', data);
  return res.data;
}

export async function updateFurniture(id, data) {
  const res = await api.doPut(`/furniture/${id}`, data);
  return res.data;
}

export async function deleteFurniture(id) {
  const res = await api.doDelete(`/furniture/${id}`);
  return res.data;
}

// --- Categorías via /furniture/categories ---

export async function getFurnitureCategories() {
  const res = await api.doGet('/furniture/categories');
  return res.data;
}

// --- Marcas via /furniture/brands ---

export async function getFurnitureBrands() {
  const res = await api.doGet('/furniture/brands');
  return res.data;
}

// --- Búsqueda y filtros (compatibilidad con vistas de catálogo) ---

export async function getFurniturePaginated(skip = 0, limit = 20) {
  const res = await api.doGet(`/furniture/?skip=${skip}&limit=${limit}`);
  return res.data;
}

export async function getFurnitureByCategory(categoryId) {
  const res = await api.doGet(`/furniture/?categoryId=${categoryId}`);
  return res.data;
}

export async function searchFurniture(term = '', categoryId = '', minPrice = '', maxPrice = '', skip = 0, limit = 20) {
  let url = `/furniture/?skip=${skip}&limit=${limit}`;
  if (term) url += `&search=${encodeURIComponent(term)}`;
  if (categoryId) url += `&categoryId=${categoryId}`;
  if (minPrice) url += `&minPrice=${minPrice}`;
  if (maxPrice) url += `&maxPrice=${maxPrice}`;
  const res = await api.doGet(url);
  return res.data;
}
