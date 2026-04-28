<template>
  <AdminLayout title="Reportes" subtitle="Resumen del negocio" icon="bi-graph-up">
    <template #actions>
      <select v-model="selectedPeriod" @change="fetchAll" class="filter-select">
        <option value="7">Últimos 7 días</option>
        <option value="30">Últimos 30 días</option>
        <option value="90">Últimos 90 días</option>
        <option value="365">Este año</option>
      </select>
      <button @click="fetchAll" class="btn-secondary">
        <i class="bi bi-arrow-clockwise"></i> Actualizar
      </button>
    </template>

    <!-- Loading -->
    <div v-if="loading" class="admin-loading">
      <div class="admin-spinner"></div>
      <p>Cargando reportes...</p>
    </div>

    <template v-else>
      <!-- Tarjetas de resumen -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon stat-icon--blue">
            <i class="bi bi-bag-check-fill"></i>
          </div>
          <div class="stat-body">
            <p class="stat-label">Total Ventas</p>
            <p class="stat-value">${{ formatNum(stats.totalRevenue) }}</p>
            <p class="stat-sub">{{ stats.totalOrders }} ventas registradas</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon--green">
            <i class="bi bi-check-circle-fill"></i>
          </div>
          <div class="stat-body">
            <p class="stat-label">Ventas Confirmadas</p>
            <p class="stat-value">{{ stats.confirmedOrders }}</p>
            <p class="stat-sub">de {{ stats.totalOrders }} totales</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon--yellow">
            <i class="bi bi-hourglass-split"></i>
          </div>
          <div class="stat-body">
            <p class="stat-label">Pendientes</p>
            <p class="stat-value">{{ stats.pendingOrders }}</p>
            <p class="stat-sub">por confirmar entrega</p>
          </div>
        </div>

        <div class="stat-card" :class="{ 'stat-card--alert': stats.lowStockCount > 0 }">
          <div class="stat-icon" :class="stats.lowStockCount > 0 ? 'stat-icon--red' : 'stat-icon--green'">
            <i class="bi bi-exclamation-triangle-fill"></i>
          </div>
          <div class="stat-body">
            <p class="stat-label">Stock Bajo</p>
            <p class="stat-value">{{ stats.lowStockCount }}</p>
            <p class="stat-sub">productos con stock bajo</p>
          </div>
        </div>
      </div>

      <!-- Top Productos -->
      <div class="section-card" v-if="topProducts.length > 0">
        <h3 class="section-title"><i class="bi bi-trophy-fill"></i> Productos más vendidos</h3>
        <div class="top-products-list">
          <div v-for="(p, idx) in topProducts" :key="p.productId" class="top-product-item">
            <span class="rank" :class="`rank-${idx + 1}`">{{ idx + 1 }}</span>
            <span class="top-product-name">{{ p.productName || `Producto #${p.productId}` }}</span>
            <span class="top-product-qty">{{ p.totalQuantity }} uds.</span>
            <span class="top-product-revenue">${{ formatNum(p.totalRevenue) }}</span>
          </div>
        </div>
      </div>

      <!-- Ventas recientes -->
      <div class="section-card" v-if="recentOrders.length > 0">
        <h3 class="section-title"><i class="bi bi-clock-history"></i> Ventas recientes</h3>
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in recentOrders" :key="order.id">
              <td class="id-cell">#{{ order.id }}</td>
              <td>{{ order.customerName || `Cliente #${order.customerId}` }}</td>
              <td><strong>${{ formatNum(order.totalAmount) }}</strong></td>
              <td>
                <span :class="['badge', statusBadgeClass(order.status)]">
                  {{ formatStatus(order.status) }}
                </span>
              </td>
              <td>{{ formatDate(order.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Sin datos -->
      <div v-if="recentOrders.length === 0 && topProducts.length === 0" class="admin-empty">
        <i class="bi bi-graph-up"></i>
        <h3>Sin datos en este período</h3>
        <p>No hay ventas registradas en los últimos {{ selectedPeriod }} días.</p>
      </div>
    </template>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminLayout from '@/components/AdminLayout.vue';
import axiosConfig from '@/config/AxiosConfig.js';

const loading = ref(false);
const selectedPeriod = ref('30');

const stats = ref({
  totalRevenue: 0,
  totalOrders: 0,
  confirmedOrders: 0,
  pendingOrders: 0,
  lowStockCount: 0
});

const topProducts = ref([]);
const recentOrders = ref([]);
const customersMap = ref({});
const productsMap = ref({});

function normalizeOrder(order) {
  const customer = order.customer || {};
  const cId = order.customerId ?? customer.id;
  const cached = customersMap.value[cId] || {};
  const items = (order.items || order.orderItems || []).map(item => {
    const product = item.product || {};
    const pId = item.productId ?? product.id;
    const cachedP = productsMap.value[pId] || {};
    return {
      ...item,
      productId: pId,
      productName: item.productName ?? product.name ?? cachedP.name ?? item.name,
      price: item.price ?? item.unitPrice ?? product.price ?? cachedP.price ?? 0,
      quantity: item.quantity ?? 1,
    };
  });
  return {
    ...order,
    customerId: cId,
    customerName: order.customerName ?? customer.name ?? cached.name,
    items,
  };
}

function formatNum(val) {
  return (val || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 });
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatStatus(status) {
  const map = { PENDIENTE: 'Pendiente', CONFIRMADA: 'Confirmada', CANCELADA: 'Cancelada', ENVIADA: 'Enviada', ENTREGADA: 'Entregada' };
  return map[status] || status;
}

function statusBadgeClass(status) {
  const map = { PENDIENTE: 'badge-warning', CONFIRMADA: 'badge-success', CANCELADA: 'badge-danger', ENVIADA: 'badge-info', ENTREGADA: 'badge-success' };
  return map[status] || 'badge-secondary';
}

async function fetchAll() {
  loading.value = true;
  try {
    const [ordersRes, lowStockRes, customersRes, productsRes] = await Promise.allSettled([
      axiosConfig.doGet('/api/orders'),
      axiosConfig.doGet('/api/products/low-stock'),
      axiosConfig.doGet('/api/customers'),
      axiosConfig.doGet('/api/products'),
    ]);

    if (customersRes.status === 'fulfilled') {
      const list = customersRes.value.data.data || customersRes.value.data || [];
      customersMap.value = Object.fromEntries(list.map(c => [c.id, c]));
    }
    if (productsRes.status === 'fulfilled') {
      const list = productsRes.value.data.data || productsRes.value.data || [];
      productsMap.value = Object.fromEntries(list.map(p => [p.id, p]));
    }

    const rawOrders = ordersRes.status === 'fulfilled'
      ? (ordersRes.value.data.data || ordersRes.value.data || [])
      : [];
    const orders = rawOrders.map(normalizeOrder);

    const lowStock = lowStockRes.status === 'fulfilled'
      ? (lowStockRes.value.data.data || lowStockRes.value.data || [])
      : [];

    // Filtrar por período
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - parseInt(selectedPeriod.value));
    const periodOrders = orders.filter(o => o.createdAt && new Date(o.createdAt) >= cutoff);

    // Calcular estadísticas
    const confirmed = periodOrders.filter(o => o.status === 'CONFIRMADA' || o.status === 'ENTREGADA');
    const pending = periodOrders.filter(o => o.status === 'PENDIENTE');

    stats.value = {
      totalRevenue: confirmed.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
      totalOrders: periodOrders.length,
      confirmedOrders: confirmed.length,
      pendingOrders: pending.length,
      lowStockCount: lowStock.length
    };

    // Top productos — agrupar por productId de los items
    const productMap = {};
    periodOrders.forEach(order => {
      const items = order.items || order.orderItems || [];
      items.forEach(item => {
        const key = item.productId;
        if (!productMap[key]) {
          productMap[key] = { productId: key, productName: item.productName || item.name, totalQuantity: 0, totalRevenue: 0 };
        }
        productMap[key].totalQuantity += item.quantity || 1;
        productMap[key].totalRevenue += (item.price || 0) * (item.quantity || 1);
      });
    });
    topProducts.value = Object.values(productMap)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 5);

    // Ventas recientes (últimas 10)
    recentOrders.value = [...periodOrders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

  } catch (e) {
    // Error silencioso
  } finally {
    loading.value = false;
  }
}

onMounted(fetchAll);
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 14px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  border: 1px solid #f0e0e8;
  box-shadow: 0 2px 8px rgba(134, 7, 52, 0.06);
  transition: box-shadow 0.2s;
}

.stat-card:hover {
  box-shadow: 0 4px 16px rgba(134, 7, 52, 0.12);
}

.stat-card--alert {
  border-color: rgba(220, 38, 38, 0.3);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
}

.stat-icon--blue   { background: rgba(59, 130, 246, 0.12); color: #2563eb; }
.stat-icon--green  { background: rgba(5, 150, 105, 0.12);  color: #059669; }
.stat-icon--yellow { background: rgba(217, 119, 6, 0.12);  color: #d97706; }
.stat-icon--red    { background: rgba(220, 38, 38, 0.12);  color: #dc2626; }

.stat-body {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.stat-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.stat-value {
  font-size: 1.6rem;
  font-weight: 800;
  color: #141413;
  margin: 0;
  line-height: 1.2;
}

.stat-sub {
  font-size: 0.8rem;
  color: #aaa;
  margin: 0;
}

/* Section cards */
.section-card {
  background: white;
  border-radius: 14px;
  padding: 1.5rem;
  border: 1px solid #f0e0e8;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: #860734;
  margin: 0 0 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Top products */
.top-products-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.top-product-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  background: #faf7f4;
}

.rank {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.85rem;
  color: white;
  flex-shrink: 0;
  background: #aaa;
}

.rank-1 { background: #f59e0b; }
.rank-2 { background: #9ca3af; }
.rank-3 { background: #b45309; }

.top-product-name {
  flex: 1;
  font-weight: 600;
  font-size: 0.9rem;
  color: #141413;
}

.top-product-qty {
  font-size: 0.85rem;
  color: #666;
  white-space: nowrap;
}

.top-product-revenue {
  font-weight: 700;
  color: #860734;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 400px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
