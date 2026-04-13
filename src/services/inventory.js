import axios from '../config/AxiosConfig';

export const inventoryService = {
  // Obtener movimientos de inventario
  getMovements(productId) {
    return axios.doGet(`/api/inventory/movements/${productId}`);
  },

  // Ajustar stock manualmente
  adjustStock(productId, newQuantity, reason) {
    return axios.doPost(
      `/api/inventory/adjust?productId=${productId}&newQuantity=${newQuantity}&reason=${encodeURIComponent(reason)}`
    );
  },

  // Agregar stock
  addStock(productId, quantity, referenceType = 'MANUAL', notes = '') {
    let url = `/api/inventory/add-stock?productId=${productId}&quantity=${quantity}&referenceType=${referenceType}`;
    if (notes) url += `&notes=${encodeURIComponent(notes)}`;
    return axios.doPost(url);
  },

  // Remover stock
  removeStock(productId, quantity, reason) {
    return axios.doPost(
      `/api/inventory/remove-stock?productId=${productId}&quantity=${quantity}&reason=${encodeURIComponent(reason)}`
    );
  },

  // Obtener stock disponible
  getAvailableStock(productId) {
    return axios.doGet(`/api/inventory/available-stock/${productId}`);
  }
};
