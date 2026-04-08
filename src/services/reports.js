import axios from '../config/AxiosConfig';

export const reportService = {
  // Reporte de ventas
  getSalesReport(startDate, endDate) {
    return axios.doGet('/api/reports/sales', {
      params: {
        startDate,
        endDate
      }
    });
  },

  // Productos más vendidos
  getTopProducts(startDate, endDate, limit = 10) {
    return axios.doGet('/api/reports/top-products', {
      params: {
        startDate,
        endDate,
        limit
      }
    });
  },

  // Reporte de stock bajo
  getLowStockReport() {
    return axios.doGet('/api/reports/low-stock');
  },

  // Calcular ganancia por período
  getProfitReport(startDate, endDate) {
    return axios.doGet('/api/reports/profit', {
      params: {
        startDate,
        endDate
      }
    });
  },

  // Calcular ingresos por período
  getRevenueReport(startDate, endDate) {
    return axios.doGet('/api/reports/revenue', {
      params: {
        startDate,
        endDate
      }
    });
  },

  // Obtener métricas de dashboard
  getDashboardMetrics(startDate, endDate) {
    return axios.doGet('/api/reports/dashboard', {
      params: {
        startDate,
        endDate
      }
    });
  }
};

