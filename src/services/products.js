import axios from '../config/AxiosConfig';

export const productService = {
  // Obtener todos los productos
  getAllProducts() {
    return axios.doGet('/api/products');
  },

  // Obtener producto por ID
  getProductById(id) {
    return axios.doGet(`/api/products/${id}`);
  },

  // Obtener productos con stock bajo (Admin)
  getLowStockProducts() {
    return axios.doGet('/api/products/low-stock');
  },

  // Obtener productos relacionados
  getRelatedProducts(id, limit = 5) {
    return axios.doGet(`/api/products/${id}/related?limit=${limit}`);
  },

  // Crear producto (Admin)
  createProduct(productData) {
    return axios.doPost('/api/products', productData);
  },

  // Actualizar producto (Admin)
  updateProduct(id, productData) {
    return axios.doPut(`/api/products/${id}`, productData);
  },

  // Eliminar producto (Admin)
  deleteProduct(id) {
    return axios.doDelete(`/api/products/${id}`);
  }
};

