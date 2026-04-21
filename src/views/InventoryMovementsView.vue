¯»¿<template>
  <AdminLayout title="Movimientos" subtitle="Historial de movimientos de inventario" icon="bi-arrow-left-right">
    <!-- Loading -->
    <div v-if="loading" class="loading">
      <div class="spinner">
        <i class="bi bi-arrow-repeat"></i>
      </div>
      <p>Cargando movimientos...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-message">
      <i class="bi bi-exclamation-circle"></i>
      {{ error }}
      <button @click="fetchMovements" class="retry-btn">Reintentar</button>
    </div>

    <!-- Lista vacía -->
    <div v-else-if="movements.length === 0" class="empty-state">
      <i class="bi bi-inbox"></i>
      <p>No hay movimientos registrados</p>
    </div>

    <!-- Tabla de movimientos -->
    <div v-else class="movements-table-wrapper">
      <table class="movements-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tipo de Movimiento</th>
            <th>Cantidad</th>
            <th>Razón/Referencia</th>
            <th>Referencia</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="movement in movements" :key="movement.id" :class="getMovementClass(movement.movementType)">
            <td class="id-cell">{{ movement.id }}</td>
            <td class="type-cell">
              <span :class="['badge', movement.movementType.toLowerCase()]">
                {{ formatMovementType(movement.movementType) }}
              </span>
            </td>
            <td :class="['quantity-cell', getQuantityClass(movement.movementType)]">
              {{ movement.movementType === 'SALE' || movement.movementType === 'ADJUSTMENT_DOWN' ? '-' : '+' }}{{ movement.quantity }}
            </td>
            <td class="reason-cell">{{ movement.reason || '-' }}</td>
            <td class="reference-cell">{{ movement.reference || '-' }}</td>
            <td class="date-cell">{{ formatDate(movement.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Resumen -->
    <div v-if="movements.length > 0" class="movements-summary">
      <div class="summary-item">
        <span class="label">Total de Movimientos:</span>
        <span class="value">{{ movements.length }}</span>
      </div>
      <div class="summary-item">
        <span class="label">Primer Movimiento:</span>
        <span class="value">{{ formatDate(movements[movements.length - 1]?.createdAt) }}</span>
      </div>
      <div class="summary-item">
        <span class="label">ltimo Movimiento:</span>
        <span class="value">{{ formatDate(movements[0]?.createdAt) }}</span>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { inventoryService } from '../services/inventory';
import AdminLayout from '../components/AdminLayout.vue';

const props = defineProps({
  productId: {
    type: [String, Number],
    required: true
  }
});

const movements = ref([]);
const loading = ref(false);
const error = ref('');

onMounted(() => {
  fetchMovements();
});

async function fetchMovements() {
  loading.value = true;
  error.value = '';

  try {
    const response = await inventoryService.getMovements(props.productId);
    if (response.data.success) {
      movements.value = response.data.data || [];
    }
  } catch (err) {
    error.value = 'Error al cargar movimientos';
  } finally {
    loading.value = false;
  }
}

function formatMovementType(type) {
  const types = {
    'PURCHASE': 'Compra',
    'SALE': 'Venta',
    'ADJUSTMENT_UP': 'Ajuste +',
    'ADJUSTMENT_DOWN': 'Ajuste -',
    'RETURN': 'Devolución',
    'TRANSFER': 'Transferencia',
    'DAMAGE': 'Daño',
    'INVENTORY_CHECK': 'Verificación'
  };
  return types[type] || type;
}

function getMovementClass(type) {
  return `movement-${type.toLowerCase()}`;
}

function getQuantityClass(type) {
  if (type === 'SALE' || type === 'ADJUSTMENT_DOWN' || type === 'DAMAGE') {
    return 'negative';
  }
  return 'positive';
}

function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('es-ES');
}
</script>

<style scoped>
/* Loading */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  color: var(--slate);
}

.spinner {
  font-size: 3rem;
  color: var(--ink);
  margin-bottom: 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error */
.error-message {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #fee;
  border: 2px solid #fca;
  color: #c33;
  padding: 1rem;
  border-radius: var(--r-card);
  margin-bottom: 2rem;
}

.error-message i {
  font-size: 1.5rem;
}

.retry-btn {
  margin-left: auto;
  background: #c33;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.retry-btn:hover {
  background: #a00;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  color: #9ca3af;
  text-align: center;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

/* Tabla */
.movements-table-wrapper {
  background: var(--white);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
}

.movements-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.movements-table thead {
  background: var(--canvas);
  border-bottom: 2px solid #e5e7eb;
}

.movements-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--charcoal);
}

.movements-table tbody tr {
  border-bottom: 1px solid var(--border);
  transition: background 0.2s;
}

.movements-table tbody tr:hover {
  background: var(--canvas-lifted);
}

.movements-table td {
  padding: 1rem;
  color: var(--ink);
}

.id-cell {
  color: #9ca3af;
  font-family: monospace;
  font-size: 0.9rem;
}

.type-cell {
  font-weight: 600;
}

.badge {
  display: inline-flex;
  padding: 0.4rem 0.75rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
}

.badge.purchase {
  background: #dbeafe;
  color: #1e40af;
}

.badge.sale {
  background: #fee2e2;
  color: #991b1b;
}

.badge.adjustment_up,
.badge.adjustment_down {
  background: #fef3c7;
  color: #92400e;
}

.badge.return {
  background: #e9d5ff;
  color: #6b21a8;
}

.badge.transfer {
  background: #d1fae5;
  color: #065f46;
}

.badge.damage {
  background: #fecdd3;
  color: #831010;
}

.badge.inventory_check {
  background: #c7d2fe;
  color: #312e81;
}

.quantity-cell {
  font-weight: 700;
  font-size: 1rem;
}

.quantity-cell.positive {
  color: #10b981;
}

.quantity-cell.negative {
  color: #dc2626;
}

.reason-cell,
.reference-cell {
  font-size: 0.9rem;
}

.reason-cell {
  color: var(--slate);
}

.reference-cell {
  font-family: monospace;
  color: var(--ink);
}

.date-cell {
  font-size: 0.9rem;
  color: var(--slate);
}

/* Summary */
.movements-summary {
  background: var(--white);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  border-top: 4px solid #667eea;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summary-item .label {
  color: var(--slate);
  font-size: 0.9rem;
  font-weight: 600;
}

.summary-item .value {
  color: var(--ink);
  font-size: 1.25rem;
  font-weight: 700;
}

@media (max-width: 768px) {
  .inventory-movements-container {
    padding: 1rem;
  }

  .movements-header h1 {
    font-size: 1.3rem;
  }

  .movements-table {
    font-size: 0.85rem;
  }

  .movements-table th,
  .movements-table td {
    padding: 0.75rem 0.5rem;
  }
}

@media (max-width: 640px) {
  .movements-table-wrapper {
    overflow-x: auto;
  }

  .movements-table {
    min-width: 700px;
  }
}
</style>

