import axiosConfig from '../config/AxiosConfig';

export const ordersService = {
  // Crear orden
  async create(data) {
    return await axiosConfig.doPost('/api/orders', data);
  },

  // Obtener orden por ID
  async getById(id) {
    return await axiosConfig.doGet(`/api/orders/${id}`);
  },

  // Listar todas las órdenes
  async getAll(customerId = null) {
    if (customerId) {
      return await axiosConfig.doGet(`/api/orders?customerId=${customerId}`);
    }
    return await axiosConfig.doGet('/api/orders');
  },

  // Listar órdenes por cliente
  async getByCustomer(customerId) {
    return await axiosConfig.doGet(`/api/orders/customer/${customerId}`);
  },

  // Cambiar estado de orden (PATCH)
  async updateStatus(id, status) {
    return await axiosConfig.doPut(`/api/orders/${id}/status`, { status });
  },

  // Actualizar orden
  async update(id, data) {
    return await axiosConfig.doPut(`/api/orders/${id}`, data);
  },

  // Cancelar orden
  async cancel(id) {
    return await axiosConfig.doDelete(`/api/orders/${id}`, {});
  }
};

