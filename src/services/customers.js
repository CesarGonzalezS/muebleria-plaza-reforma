import axiosConfig from '../config/AxiosConfig';

export const customersService = {
  // Listar todos los clientes
  async getAll() {
    return await axiosConfig.doGet('/api/customers');
  },

  // Obtener cliente por ID
  async getById(id) {
    return await axiosConfig.doGet(`/api/customers/${id}`);
  },

  // Crear cliente
  async create(data) {
    return await axiosConfig.doPost('/api/customers', data);
  },

  // Actualizar cliente
  async update(id, data) {
    return await axiosConfig.doPut(`/api/customers/${id}`, data);
  },

  // Obtener estadísticas del cliente
  async getStats(id) {
    return await axiosConfig.doGet(`/api/customers/${id}/stats`);
  }
};

