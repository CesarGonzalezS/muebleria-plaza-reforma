import axios from '../config/AxiosConfig';

export const reportService = {
  // Reporte de ventas
  getSalesReport(startDate, endDate) {
    return axios.doGet(`/api/reports/sales?startDate=${startDate}&endDate=${endDate}`);
  },

  // Productos más vendidos
  getTopProducts(startDate, endDate, limit = 10) {
    return axios.doGet(`/api/reports/top-products?startDate=${startDate}&endDate=${endDate}&limit=${limit}`);
  },

  // Reporte de stock bajo
  getLowStockReport() {
    return axios.doGet('/api/reports/low-stock');
  },

  // Calcular ganancia por período
  getProfitReport(startDate, endDate) {
    return axios.doGet(`/api/reports/profit?startDate=${startDate}&endDate=${endDate}`);
  },

  // Calcular ingresos por período
  getRevenueReport(startDate, endDate) {
    return axios.doGet(`/api/reports/revenue?startDate=${startDate}&endDate=${endDate}`);
  },

  // Obtener métricas de dashboard
  getDashboardMetrics(startDate, endDate) {
    return axios.doGet(`/api/reports/dashboard?startDate=${startDate}&endDate=${endDate}`);
  }
};
