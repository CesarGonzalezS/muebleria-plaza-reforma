import axios from '../config/AxiosConfig';

export const brandsService = {
  getBrands() {
    return axios.doGet('/api/brands');
  },
  createBrand(data) {
    return axios.doPost('/api/brands', data);
  },
  deleteBrand(id) {
    return axios.doDelete(`/api/brands/${id}`);
  }
};
