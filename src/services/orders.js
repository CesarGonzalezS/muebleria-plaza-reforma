import axios from '../config/AxiosConfig';

export const orderService = {
  // Crear orden
  createOrder(orderData) {
    return axios.doPost('/api/orders', orderData);
  },

  // Obtener orden por ID
  getOrderById(id) {
    return axios.doGet(`/api/orders/${id}`);
  },

  // Listar órdenes (customerId es opcional)
  listOrders(customerId = null) {
    const url = customerId ? `/api/orders?customerId=${customerId}` : '/api/orders';
    return axios.doGet(url);
  },

  // Actualizar estado de orden (Admin)
  updateOrderStatus(id, status) {
    return axios.doPut(`/api/orders/${id}/status?status=${encodeURIComponent(status)}`);
  },

  // Cancelar orden (Admin)
  cancelOrder(id) {
    return axios.doDelete(`/api/orders/${id}`);
  }
};
