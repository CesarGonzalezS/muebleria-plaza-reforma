<template>
  <div class="reports-container">
    <div class="reports-header">
      <h1>
        <i class="bi bi-graph-up"></i>
        Reportes
      </h1>
      <p>Análisis y métricas de negocio</p>
    </div>

    <!-- Tabs de reportes -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="['tab-btn', activeTab === tab.id ? 'active' : '']"
      >
        <i :class="tab.icon"></i>
        {{ tab.label }}
      </button>
    </div>

    <!-- Reporte de Ventas -->
    <div v-if="activeTab === 'sales'" class="tab-pane">
      <h2>Reporte de Ventas</h2>

      <div class="filters">
        <div class="form-group">
          <label>Fecha Inicial</label>
          <input v-model="filters.sales.startDate" type="date" />
        </div>
        <div class="form-group">
          <label>Fecha Final</label>
          <input v-model="filters.sales.endDate" type="date" />
        </div>
        <button @click="loadSalesReport" class="btn-filter">
          <i class="bi bi-search"></i> Generar Reporte
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading.sales" class="loading">
        <i class="bi bi-arrow-repeat"></i> Cargando...
      </div>

      <!-- Error -->
      <div v-else-if="errors.sales" class="error-message">
        {{ errors.sales }}
      </div>

      <!-- Chart placeholder -->
      <div v-else-if="salesReport.length > 0" class="report-content">
        <div class="chart-container">
          <div class="chart-placeholder">
            <i class="bi bi-bar-chart"></i>
            Gráfico de Ventas (Integrar Chart.js o similar)
          </div>
        </div>

        <!-- Tabla de datos -->
        <table class="report-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Total de Ventas</th>
              <th>Cantidad de Órdenes</th>
              <th>Valor Promedio</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in salesReport" :key="row.date">
              <td>{{ formatDate(row.date) }}</td>
              <td class="amount">${{ formatPrice(row.totalSales) }}</td>
              <td class="center">{{ row.ordersCount }}</td>
              <td class="amount">${{ formatPrice(row.averageOrderValue) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Resumen -->
        <div class="summary-stats">
          <div class="stat-card">
            <span class="label">Total Ventas</span>
            <span class="value">${{ formatPrice(calculateTotalSales()) }}</span>
          </div>
          <div class="stat-card">
            <span class="label">Total Órdenes</span>
            <span class="value">{{ calculateTotalOrders() }}</span>
          </div>
          <div class="stat-card">
            <span class="label">Promedio Diario</span>
            <span class="value">${{ formatPrice(calculateAverageSales()) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Productos Más Vendidos -->
    <div v-if="activeTab === 'topProducts'" class="tab-pane">
      <h2>Productos Más Vendidos</h2>

      <div class="filters">
        <div class="form-group">
          <label>Fecha Inicial</label>
          <input v-model="filters.topProducts.startDate" type="date" />
        </div>
        <div class="form-group">
          <label>Fecha Final</label>
          <input v-model="filters.topProducts.endDate" type="date" />
        </div>
        <div class="form-group">
          <label>Límite</label>
          <input v-model.number="filters.topProducts.limit" type="number" min="1" max="50" />
        </div>
        <button @click="loadTopProducts" class="btn-filter">
          <i class="bi bi-search"></i> Generar Reporte
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading.topProducts" class="loading">
        <i class="bi bi-arrow-repeat"></i> Cargando...
      </div>

      <!-- Error -->
      <div v-else-if="errors.topProducts" class="error-message">
        {{ errors.topProducts }}
      </div>

      <!-- Resultados -->
      <div v-else-if="topProductsReport.length > 0" class="report-content">
        <div class="products-ranking">
          <div v-for="product in topProductsReport" :key="product.productId" class="ranking-item">
            <div class="rank-badge">{{ product.rank }}</div>
            <div class="product-info">
              <h3>{{ product.productName }}</h3>
              <p class="product-id">ID: {{ product.productId }}</p>
            </div>
            <div class="product-stats">
              <div class="stat">
                <span class="label">Vendidos</span>
                <span class="value">{{ product.quantitySold }}</span>
              </div>
              <div class="stat">
                <span class="label">Ingresos</span>
                <span class="value">${{ formatPrice(product.totalRevenue) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stock Bajo -->
    <div v-if="activeTab === 'lowStock'" class="tab-pane">
      <h2>Reporte de Stock Bajo</h2>

      <button @click="loadLowStockReport" class="btn-filter">
        <i class="bi bi-search"></i> Cargar Reporte
      </button>

      <!-- Loading -->
      <div v-if="loading.lowStock" class="loading">
        <i class="bi bi-arrow-repeat"></i> Cargando...
      </div>

      <!-- Error -->
      <div v-else-if="errors.lowStock" class="error-message">
        {{ errors.lowStock }}
      </div>

      <!-- Resultados -->
      <div v-else-if="lowStockReport.length > 0" class="report-content">
        <div class="stock-alerts">
          <div v-for="product in lowStockReport" :key="product.productId" class="alert-item" :class="product.stockStatus.toLowerCase()">
            <div class="alert-icon">
              <i class="bi bi-exclamation-triangle"></i>
            </div>
            <div class="alert-info">
              <h3>{{ product.productName }}</h3>
              <p class="product-id">ID: {{ product.productId }}</p>
              <div class="stock-info">
                <span>Stock Actual: <strong>{{ product.currentStock }}</strong></span>
                <span>Stock Mínimo: <strong>{{ product.minStock }}</strong></span>
                <span>Falta: <strong>{{ product.minStock - product.currentStock }}</strong></span>
              </div>
            </div>
            <div class="status-badge" :class="product.stockStatus.toLowerCase()">
              {{ product.stockStatus }}
            </div>
          </div>
        </div>

        <!-- Resumen -->
        <div class="summary-stats">
          <div class="stat-card">
            <span class="label">Productos con Stock Bajo</span>
            <span class="value">{{ lowStockReport.length }}</span>
          </div>
          <div class="stat-card">
            <span class="label">Stock Total Bajo</span>
            <span class="value">{{ calculateTotalLowStock() }}</span>
          </div>
        </div>
      </div>

      <div v-else-if="!loading.lowStock && lowStockReport.length === 0" class="empty-message">
        <i class="bi bi-check-circle"></i>
        <p>Todos los productos tienen stock adecuado</p>
      </div>
    </div>

    <!-- Métricas Dashboard -->
    <div v-if="activeTab === 'metrics'" class="tab-pane">
      <h2>Métricas del Dashboard</h2>

      <div class="filters">
        <div class="form-group">
          <label>Fecha Inicial</label>
          <input v-model="filters.sales.startDate" type="date" />
        </div>
        <div class="form-group">
          <label>Fecha Final</label>
          <input v-model="filters.sales.endDate" type="date" />
        </div>
        <button @click="loadMetrics" class="btn-filter">
          <i class="bi bi-search"></i> Cargar Métricas
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading.metrics" class="loading">
        <i class="bi bi-arrow-repeat"></i> Cargando métricas...
      </div>

      <!-- Error -->
      <div v-else-if="errors.metrics" class="error-message">
        {{ errors.metrics }}
      </div>

      <!-- Métricas Grid -->
      <div v-else class="report-content">
        <div class="metrics-grid">
          <div class="metric-card primary">
            <div class="metric-icon">
              <i class="bi bi-cash-coin"></i>
            </div>
            <div class="metric-info">
              <span class="label">Ingresos Totales</span>
              <span class="value">${{ formatPrice(metricsData.totalSales) }}</span>
            </div>
          </div>

          <div class="metric-card success">
            <div class="metric-icon">
              <i class="bi bi-graph-up"></i>
            </div>
            <div class="metric-info">
              <span class="label">Ganancia Total</span>
              <span class="value">${{ formatPrice(metricsData.totalProfit) }}</span>
            </div>
          </div>

          <div class="metric-card info">
            <div class="metric-icon">
              <i class="bi bi-receipt"></i>
            </div>
            <div class="metric-info">
              <span class="label">Total de Órdenes</span>
              <span class="value">{{ metricsData.ordersCount }}</span>
            </div>
          </div>

          <div class="metric-card warning">
            <div class="metric-icon">
              <i class="bi bi-percent"></i>
            </div>
            <div class="metric-info">
              <span class="label">Ticket Promedio</span>
              <span class="value">${{ formatPrice(metricsData.averageOrderValue) }}</span>
            </div>
          </div>

          <div class="metric-card secondary">
            <div class="metric-icon">
              <i class="bi bi-star"></i>
            </div>
            <div class="metric-info">
              <span class="label">Producto Top</span>
              <span class="value">{{ metricsData.topProduct || '-' }}</span>
            </div>
          </div>

          <div class="metric-card danger">
            <div class="metric-icon">
              <i class="bi bi-exclamation-triangle"></i>
            </div>
            <div class="metric-info">
              <span class="label">Alertas de Stock</span>
              <span class="value">{{ metricsData.lowStockAlerts }}</span>
            </div>
          </div>

          <div class="metric-card dark">
            <div class="metric-icon">
              <i class="bi bi-people"></i>
            </div>
            <div class="metric-info">
              <span class="label">Clientes Únicos</span>
              <span class="value">{{ metricsData.customerCount }}</span>
            </div>
          </div>
        </div>

        <!-- Análisis y KPIs -->
        <div class="analysis-section">
          <h3>Análisis Clave</h3>
          <div class="kpi-items">
            <div class="kpi-item">
              <span class="kpi-label">Margen de Ganancia</span>
              <span class="kpi-value">{{ calculateProfitMargin() }}%</span>
            </div>
            <div class="kpi-item">
              <span class="kpi-label">Costo Total de Bienes</span>
              <span class="kpi-value">${{ formatPrice(metricsData.totalSales - metricsData.totalProfit) }}</span>
            </div>
            <div class="kpi-item">
              <span class="kpi-label">Promedio de Clientes por Orden</span>
              <span class="kpi-value">{{ calculateCustomersPerOrder() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { reportService } from '../services/reports';

const activeTab = ref('sales');

const tabs = [
  { id: 'sales', label: 'Ventas', icon: 'bi bi-graph-up' },
  { id: 'topProducts', label: 'Productos Top', icon: 'bi bi-star' },
  { id: 'lowStock', label: 'Stock Bajo', icon: 'bi bi-exclamation-triangle' },
  { id: 'metrics', label: 'Métricas', icon: 'bi bi-graph-up' }
];

const filters = ref({
  sales: {
    startDate: '2026-04-01',
    endDate: '2026-04-30'
  },
  topProducts: {
    startDate: '2026-04-01',
    endDate: '2026-04-30',
    limit: 10
  }
});

const loading = ref({
  sales: false,
  topProducts: false,
  lowStock: false,
  metrics: false
});

const errors = ref({
  sales: '',
  topProducts: '',
  lowStock: '',
  metrics: ''
});

const salesReport = ref([]);
const topProductsReport = ref([]);
const lowStockReport = ref([]);
const metricsData = ref({
  totalSales: 0,
  totalProfit: 0,
  ordersCount: 0,
  averageOrderValue: 0,
  topProduct: '',
  lowStockAlerts: 0,
  customerCount: 0
});

async function loadSalesReport() {
  loading.value.sales = true;
  errors.value.sales = '';

  try {
    const response = await reportService.getSalesReport(
      filters.value.sales.startDate,
      filters.value.sales.endDate
    );
    if (response.data.success) {
      salesReport.value = response.data.data || [];
    }
  } catch (err) {
    errors.value.sales = 'Error al cargar reporte de ventas';
  } finally {
    loading.value.sales = false;
  }
}

async function loadTopProducts() {
  loading.value.topProducts = true;
  errors.value.topProducts = '';

  try {
    const response = await reportService.getTopProducts(
      filters.value.topProducts.startDate,
      filters.value.topProducts.endDate,
      filters.value.topProducts.limit
    );
    if (response.data.success) {
      topProductsReport.value = response.data.data || [];
    }
  } catch (err) {
    errors.value.topProducts = 'Error al cargar reporte de productos';
  } finally {
    loading.value.topProducts = false;
  }
}

async function loadLowStockReport() {
  loading.value.lowStock = true;
  errors.value.lowStock = '';

  try {
    const response = await reportService.getLowStockReport();
    if (response.data.success) {
      lowStockReport.value = response.data.data || [];
    }
  } catch (err) {
    errors.value.lowStock = 'Error al cargar reporte de stock';
  } finally {
    loading.value.lowStock = false;
  }
}

function calculateTotalSales() {
  return salesReport.value.reduce((sum, row) => sum + (row.totalSales || 0), 0);
}

function calculateTotalOrders() {
  return salesReport.value.reduce((sum, row) => sum + (row.ordersCount || 0), 0);
}

function calculateAverageSales() {
  if (salesReport.value.length === 0) return 0;
  return calculateTotalSales() / salesReport.value.length;
}

function calculateTotalLowStock() {
  return lowStockReport.value.reduce((sum, product) => sum + product.currentStock, 0);
}

async function loadMetrics() {
  loading.value.metrics = true;
  errors.value.metrics = '';

  try {
    const response = await reportService.getDashboardMetrics(
      filters.value.sales.startDate,
      filters.value.sales.endDate
    );
    if (response.data.success) {
      metricsData.value = response.data.data;
    }
  } catch (err) {
    errors.value.metrics = 'Error al cargar métricas';
  } finally {
    loading.value.metrics = false;
  }
}

function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES');
}

function formatPrice(price) {
  return parseFloat(price).toFixed(2);
}

function calculateProfitMargin() {
  if (metricsData.value.totalSales === 0) return 0;
  const margin = (metricsData.value.totalProfit / metricsData.value.totalSales) * 100;
  return margin.toFixed(1);
}

function calculateCustomersPerOrder() {
  if (metricsData.value.ordersCount === 0) return 0;
  const ratio = metricsData.value.customerCount / metricsData.value.ordersCount;
  return ratio.toFixed(2);
}
</script>

<style scoped>
.reports-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.reports-header {
  margin-bottom: 2rem;
  text-align: center;
}

.reports-header h1 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: #1f2937;
  margin: 0;
  font-size: 2rem;
}

.reports-header h1 i {
  color: #667eea;
}

.reports-header p {
  color: #6b7280;
  margin: 0.5rem 0 0;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e5e7eb;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  padding: 1rem;
  color: #6b7280;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
}

.tab-btn:hover {
  color: #1f2937;
}

.tab-btn.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

/* Pane */
.tab-pane {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.tab-pane h2 {
  color: #1f2937;
  margin: 0 0 1.5rem;
  font-size: 1.3rem;
}

/* Filters */
.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 8px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.form-group {
  flex: 1;
  min-width: 150px;
}

.form-group label {
  display: block;
  color: #374151;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.9rem;
  box-sizing: border-box;
  transition: all 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.btn-filter {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-filter:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

/* Loading */
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem;
  color: #6b7280;
  font-size: 0.95rem;
}

.loading i {
  animation: spin 1s linear infinite;
  font-size: 1.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error */
.error-message {
  background: #fee;
  border: 1px solid #fca;
  color: #c33;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}

/* Report Content */
.report-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Chart */
.chart-container {
  margin-bottom: 2rem;
}

.chart-placeholder {
  background: #f3f4f6;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 3rem;
  text-align: center;
  color: #9ca3af;
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.chart-placeholder i {
  font-size: 2.5rem;
  opacity: 0.5;
}

/* Table */
.report-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.report-table thead {
  background: #f3f4f6;
  border-bottom: 2px solid #e5e7eb;
}

.report-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
}

.report-table td {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  color: #1f2937;
}

.report-table tbody tr:hover {
  background: #f9fafb;
}

.report-table .amount,
.report-table .center {
  text-align: right;
}

.report-table .center {
  text-align: center;
}

/* Ranking */
.products-ranking {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ranking-item {
  display: grid;
  grid-template-columns: 60px 1fr 1fr;
  gap: 1.5rem;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  border-left: 4px solid #667eea;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.rank-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  font-weight: 700;
  font-size: 1.2rem;
}

.product-info h3 {
  margin: 0 0 0.25rem;
  color: #1f2937;
  font-size: 1rem;
}

.product-id {
  margin: 0;
  color: #9ca3af;
  font-size: 0.85rem;
}

.product-stats {
  display: flex;
  gap: 1.5rem;
  justify-content: flex-end;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.stat .label {
  color: #9ca3af;
  font-size: 0.85rem;
  font-weight: 600;
}

.stat .value {
  color: #667eea;
  font-weight: 700;
  font-size: 1.1rem;
}

/* Stock Alerts */
.stock-alerts {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.alert-item {
  display: grid;
  grid-template-columns: 50px 1fr 150px;
  gap: 1.5rem;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  border-left: 4px solid #f59e0b;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.alert-item.critical {
  border-left-color: #dc2626;
  background: #fef2f2;
}

.alert-icon {
  font-size: 1.5rem;
}

.alert-item.critical .alert-icon {
  color: #dc2626;
}

.alert-item:not(.critical) .alert-icon {
  color: #f59e0b;
}

.alert-info h3 {
  margin: 0 0 0.25rem;
  color: #1f2937;
  font-size: 1rem;
}

.stock-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #6b7280;
}

.stock-info strong {
  color: #1f2937;
  font-weight: 600;
}

.status-badge {
  display: inline-flex;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
}

.status-badge.critical {
  background: #fecaca;
  color: #991b1b;
}

.status-badge:not(.critical) {
  background: #fde68a;
  color: #92400e;
}

/* Summary Stats */
.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding-top: 2rem;
  border-top: 2px solid #e5e7eb;
}

.stat-card {
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #667eea;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-card .label {
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 600;
}

.stat-card .value {
  color: #667eea;
  font-size: 1.5rem;
  font-weight: 700;
}

/* Empty Message */
.empty-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: #f9fafb;
  border-radius: 8px;
  text-align: center;
  color: #9ca3af;
}

.empty-message i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #10b981;
}

@media (max-width: 768px) {
  .reports-container {
    padding: 1rem;
  }

  .filters {
    flex-direction: column;
  }

  .form-group {
    width: 100%;
    min-width: unset;
  }

  .btn-filter {
    width: 100%;
  }

  .ranking-item,
  .alert-item {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .product-stats,
  .alert-item:nth-child(3) {
    justify-content: flex-start;
  }

  .report-table {
    font-size: 0.9rem;
  }

  .report-table th,
  .report-table td {
    padding: 0.75rem;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  border-left: 4px solid #667eea;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.metric-card.primary {
  border-left-color: #667eea;
}

.metric-card.success {
  border-left-color: #10b981;
}

.metric-card.info {
  border-left-color: #0ea5e9;
}

.metric-card.warning {
  border-left-color: #f59e0b;
}

.metric-card.secondary {
  border-left-color: #8b5cf6;
}

.metric-card.danger {
  border-left-color: #dc2626;
}

.metric-card.dark {
  border-left-color: #6b7280;
}

.metric-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 8px;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.metric-card.primary .metric-icon {
  background: #dbeafe;
  color: #1e40af;
}

.metric-card.success .metric-icon {
  background: #d1fae5;
  color: #065f46;
}

.metric-card.info .metric-icon {
  background: #cffafe;
  color: #0c4a6e;
}

.metric-card.warning .metric-icon {
  background: #fef3c7;
  color: #92400e;
}

.metric-card.secondary .metric-icon {
  background: #ede9fe;
  color: #5b21b6;
}

.metric-card.danger .metric-icon {
  background: #fee2e2;
  color: #991b1b;
}

.metric-card.dark .metric-icon {
  background: #f3f4f6;
  color: #374151;
}

.metric-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.metric-info .label {
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.metric-info .value {
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 700;
}

/* Analysis Section */
.analysis-section {
  background: #f9fafb;
  padding: 2rem;
  border-radius: 8px;
  border-left: 4px solid #667eea;
  margin-top: 2rem;
}

.analysis-section h3 {
  color: #1f2937;
  margin: 0 0 1.5rem;
  font-size: 1.1rem;
}

.kpi-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.kpi-item {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border: 1px solid #e5e7eb;
}

.kpi-label {
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 600;
}

.kpi-value {
  color: #667eea;
  font-size: 1.3rem;
  font-weight: 700;
}
</style>

