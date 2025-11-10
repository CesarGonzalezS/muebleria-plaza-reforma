import api from '../config/AxiosConfig';

export async function getFurniture(skip = 0, limit = 20, category = '') {
  let url = `/furniture?skip=${skip}&limit=${limit}`;
  if (category) url += `&category=${category}`;
  const res = await api.doGet(url);
  return res.data;
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
  await api.doDelete(`/furniture/${id}`);
}

export async function getFurnitureCategories() {
  const res = await api.doGet('/furniture/categories');
  return res.data;
}

export async function searchFurniture(term = '', category = '', min_price = '', max_price = '', skip = 0, limit = 20) {
  let url = `/furniture/search?term=${term}&skip=${skip}&limit=${limit}`;
  if (category) url += `&category=${category}`;
  if (min_price) url += `&min_price=${min_price}`;
  if (max_price) url += `&max_price=${max_price}`;
  const res = await api.doGet(url);
  return res.data;
}

export async function getFurniturePaginated(skip = 0, limit = 20) {
  const url = `/furniture/?skip=${skip}&limit=${limit}`;
  const res = await api.doGet(url);
  return res.data;
}

export async function getFurnitureByCategory(categoryId) {
  const url = `/furniture/?category_id=${categoryId}`;
  const res = await api.doGet(url);
  return res.data;
}

export async function getFurnitureByCategories(categoryIds = [], limit = 50) {
  const query = categoryIds.map(id => `category_ids=${id}`).join('&');
  const url = `/furniture/?${query}&limit=${limit}`;
  const res = await api.doGet(url);
  return res.data;
}

export async function searchFurnitureWithFilters({
  term = '',
  categoryIds = [],
  minPrice = '',
  maxPrice = '',
  orderBy = '',
  skip = 0,
  limit = 20
}) {
  let url = `/furniture/search?term=${term}&skip=${skip}&limit=${limit}`;

  if (categoryIds.length > 0) {
    url += `&${categoryIds.map(id => `category_ids=${id}`).join('&')}`;
  }
  if (minPrice) url += `&min_price=${minPrice}`;
  if (maxPrice) url += `&max_price=${maxPrice}`;
  if (orderBy) url += `&order_by=${orderBy}`;

  const res = await api.doGet(url);
  return res.data;
}

export async function getFurnitureSorted(orderBy = '-price') {
  const url = `/furniture/?order_by=${orderBy}`;
  const res = await api.doGet(url);
  return res.data;
}
