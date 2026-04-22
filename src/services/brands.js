import api from '../config/AxiosConfig';

export async function getBrands() {
  const res = await api.doGet('/furniture/brands');
  return res.data;
}

export async function getBrandById(id) {
  const res = await api.doGet(`/furniture/brands/${id}`);
  return res.data;
}

export async function createBrand(data) {
  const res = await api.doPost('/furniture/brands', data);
  return res.data;
}

export async function updateBrand(id, data) {
  const res = await api.doPut(`/furniture/brands/${id}`, data);
  return res.data;
}

export async function deleteBrand(id) {
  const res = await api.doDelete(`/furniture/brands/${id}`);
  return res.data;
}
