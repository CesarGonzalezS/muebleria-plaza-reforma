<template>
  <AdminLayout title="Movimientos" subtitle="Historial de movimientos de inventario" icon="bi-arrow-left-right">

    <div v-if="loading" class="admin-loading">
      <div class="admin-spinner"></div>
      <p>Cargando movimientos...</p>
    </div>

    <div v-else-if="error" class="error-box">
      <i class="bi bi-exclamation-circle"></i>
      {{ error }}
      <button @click="fetchMovements" class="retry-btn">Reintentar</button>
    </div>

    <div v-else-if="movements.length === 0" class="admin-empty">
      <i class="bi bi-inbox"></i>
      <p>No hay movimientos registrados para este producto.</p>
    </div>

    <template v-else>
      <!-- Summary chips -->
      <div class="mov-summary">
        <div class="mov-chip">
          <span class="mov-chip__val">{{ movements.length }}</span>
          <span class="mov-chip__lbl">Movimientos</span>
        </div>
        <div class="mov-chip mov-chip--green">
          <span class="mov-chip__val">{{ totalEntradas }}</span>
          <span class="mov-chip__lbl">Entradas</span>
        </div>
        <div class="mov-chip mov-chip--red">
          <span class="mov-chip__val">{{ totalSalidas }}</span>
          <span class="mov-chip__lbl">Salidas</span>
        </div>
      </div>

      <div class="movements-table-wrapper">
        <table class="movements-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Cantidad</th>
              <th>Razón</th>
              <th>Referencia</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="movement in movements" :key="movement.id" :class="getMovementClass(movement.movementType)">
              <td class="id-cell" data-label="ID">{{ movement.id }}</td>
              <td class="type-cell" data-label="Tipo">
                <span :class="['badge', movement.movementType.toLowerCase()]">
                  {{ formatMovementType(movement.movementType) }}
                </span>
              </td>
              <td :class="['quantity-cell', getQuantityClass(movement.movementType)]" data-label="Cantidad">
                {{ isNegative(movement.movementType) ? '-' : '+' }}{{ movement.quantity }}
              </td>
              <td class="reason-cell" data-label="Razón">{{ movement.reason || '-' }}</td>
              <td class="reference-cell" data-label="Referencia">{{ movement.reference || '-' }}</td>
              <td class="date-cell" data-label="Fecha">{{ formatDate(movement.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { inventoryService } from '../services/inventory';
import AdminLayout from '../components/AdminLayout.vue';

const props = defineProps({
  productId: { type: [String, Number], required: true }
});

const movements = ref([]);
const loading = ref(false);
const error = ref('');

const NEGATIVE_TYPES = new Set(['SALE', 'ADJUSTMENT_DOWN', 'DAMAGE']);

const totalEntradas = computed(() => movements.value.filter(m => !NEGATIVE_TYPES.has(m.movementType)).length);
const totalSalidas  = computed(() => movements.value.filter(m =>  NEGATIVE_TYPES.has(m.movementType)).length);

function isNegative(type) { return NEGATIVE_TYPES.has(type); }

onMounted(fetchMovements);

async function fetchMovements() {
  loading.value = true;
  error.value = '';
  try {
    const res = await inventoryService.getMovements(props.productId);
    movements.value = res.data?.data || res.data || [];
  } catch {
    error.value = 'Error al cargar los movimientos';
  } finally {
    loading.value = false;
  }
}

function formatMovementType(type) {
  const map = {
    PURCHASE: 'Compra', SALE: 'Venta',
    ADJUSTMENT_UP: 'Ajuste +', ADJUSTMENT_DOWN: 'Ajuste -',
    RETURN: 'Devolución', TRANSFER: 'Transferencia',
    DAMAGE: 'Daño', INVENTORY_CHECK: 'Verificación'
  };
  return map[type] || type;
}

function getMovementClass(type) { return `movement-${type.toLowerCase()}`; }
function getQuantityClass(type) { return isNegative(type) ? 'negative' : 'positive'; }

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
</script>

<style scoped>
/* Summary chips */
.mov-summary {
  display: flex;
  gap: 0.875rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}

.mov-chip {
  background: #fff;
  border: 1px solid rgba(134,7,52,0.1);
  border-radius: 10px;
  padding: 0.75rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 90px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}

.mov-chip__val {
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1;
  color: #141413;
}

.mov-chip__lbl {
  font-size: 0.72rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.mov-chip--green { border-left: 3px solid #059669; }
.mov-chip--green .mov-chip__val { color: #059669; }
.mov-chip--red   { border-left: 3px solid #dc2626; }
.mov-chip--red .mov-chip__val   { color: #dc2626; }

/* Error */
.error-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 1rem 1.25rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
}

.retry-btn {
  margin-left: auto;
  background: #dc2626;
  color: #fff;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}
.retry-btn:hover { background: #b91c1c; }

/* Table */
.movements-table-wrapper {
  background: #fff;
  border-radius: 12px;
  border: 1px solid rgba(20,20,19,0.1);
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.movements-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.movements-table thead {
  background: #f9f6f7;
  border-bottom: 1px solid #e0d0e0;
}

.movements-table th {
  padding: 0.875rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.8rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.movements-table tbody tr { border-bottom: 1px solid rgba(20,20,19,0.06); transition: background 0.15s; }
.movements-table tbody tr:last-child { border-bottom: none; }
.movements-table tbody tr:hover { background: #fdf8fa; }
.movements-table td { padding: 0.875rem 1rem; color: #262627; vertical-align: middle; }

.id-cell        { color: #9ca3af; font-family: monospace; font-size: 0.8rem; }
.quantity-cell  { font-weight: 700; font-size: 1rem; }
.quantity-cell.positive { color: #059669; }
.quantity-cell.negative { color: #dc2626; }
.reason-cell    { color: #6b7280; font-size: 0.85rem; }
.reference-cell { font-family: monospace; font-size: 0.8rem; color: #374151; }
.date-cell      { color: #9ca3af; font-size: 0.82rem; white-space: nowrap; }

/* Badges */
.badge {
  display: inline-flex;
  padding: 0.3rem 0.65rem;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  white-space: nowrap;
}
.badge.purchase       { background: #dbeafe; color: #1e40af; }
.badge.sale           { background: #fee2e2; color: #991b1b; }
.badge.adjustment_up  { background: #d1fae5; color: #065f46; }
.badge.adjustment_down{ background: #fef3c7; color: #92400e; }
.badge.return         { background: #e9d5ff; color: #6b21a8; }
.badge.transfer       { background: #dbeafe; color: #1e40af; }
.badge.damage         { background: #fecdd3; color: #831010; }
.badge.inventory_check{ background: #c7d2fe; color: #312e81; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .mov-chip { min-width: 80px; padding: 0.625rem 1rem; }
  .mov-chip__val { font-size: 1.25rem; }

  .movements-table-wrapper { overflow: visible; border: none; background: transparent; box-shadow: none; }
  .movements-table thead { display: none; }
  .movements-table tbody,
  .movements-table tr { display: block; width: 100%; }

  .movements-table tr {
    background: #fff;
    border-radius: 12px;
    border: 1px solid rgba(134,7,52,0.1);
    box-shadow: 0 2px 6px rgba(0,0,0,0.04);
    margin-bottom: 0.75rem;
    padding: 0.75rem 1rem;
  }

  .movements-table td {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.35rem 0;
    border: none;
    font-size: 0.875rem;
    gap: 0.5rem;
  }

  .movements-table td::before {
    content: attr(data-label);
    font-weight: 600;
    color: #6b7280;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    flex-shrink: 0;
    min-width: 80px;
  }

  .date-cell { color: #9ca3af; font-size: 0.8rem; }
  .id-cell   { border-top: none; }
}

@media (max-width: 480px) {
  .mov-summary { gap: 0.5rem; }
  .mov-chip { padding: 0.5rem 0.875rem; }
}
</style>
