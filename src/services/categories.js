import api from '../config/AxiosConfig';

export async function getCategories() {
  const res = await api.doGet('/furniture/categories');
  return res.data;
}

export async function createCategory(data) {
  const res = await api.doPost('/furniture/categories', data);
  return res.data;
}

export async function updateCategory(id, data) {
  const res = await api.doPut(`/furniture/categories/${id}`, data);
  return res.data;
}

export async function deleteCategory(id) {
  await api.doDelete(`/furniture/categories/${id}`);
}
