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

  // Listar órdenes
  listOrders(customerId = null) {
    const params = customerId ? { customerId } : {};
    return axios.doGet('/api/orders', { params });
  },

  // Actualizar estado de orden (Admin)
  updateOrderStatus(id, status) {
    return axios.doPut(`/api/orders/${id}/status`, null, {
      params: { status }
    });
  },

  // Cancelar orden (Admin)
  cancelOrder(id) {
    return axios.doDelete(`/api/orders/${id}`);
  }
};

