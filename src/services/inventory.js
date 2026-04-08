import axios from '../config/AxiosConfig';

export const inventoryService = {
  // Obtener movimientos de inventario
  getMovements(productId) {
    return axios.doGet(`/api/inventory/movements/${productId}`);
  },

  // Ajustar stock manualmente
  adjustStock(productId, newQuantity, reason) {
    return axios.doPost('/api/inventory/adjust', null, {
      params: {
        productId,
        newQuantity,
        reason
      }
    });
  },

  // Agregar stock
  addStock(productId, quantity, referenceType = 'MANUAL', notes = '') {
    return axios.doPost('/api/inventory/add-stock', null, {
      params: {
        productId,
        quantity,
        referenceType,
        notes: notes || undefined
      }
    });
  },

  // Remover stock
  removeStock(productId, quantity, reason) {
    return axios.doPost('/api/inventory/remove-stock', null, {
      params: {
        productId,
        quantity,
        reason
      }
    });
  },

  // Obtener stock disponible
  getAvailableStock(productId) {
    return axios.doGet(`/api/inventory/available-stock/${productId}`);
  }
};

