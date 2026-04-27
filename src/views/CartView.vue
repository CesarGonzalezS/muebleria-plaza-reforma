<template>
  <div class="cart-page">
    <Navbar />
    <div class="cart-container">
    <h1>Carrito de Compras</h1>

    <!-- Carrito vacío -->
    <div v-if="store.cartItems.length === 0" class="empty-cart">
      <i class="bi bi-cart-x"></i>
      <p>Tu carrito está vacío</p>
      <router-link to="/productos-lista" class="btn-continue">
        <i class="bi bi-arrow-left"></i> Continuar comprando
      </router-link>
    </div>

    <!-- Carrito con items -->
    <div v-else class="cart-content">
      <div class="cart-items">
        <h2>Items ({{ store.cartItems.length }})</h2>

        <div v-for="item in store.cartItems" :key="item.id" class="cart-item">
          <div class="item-info">
            <h3>{{ item.name || item.productName }}</h3>
            <p class="item-id">ID: {{ item.id }}</p>
          </div>

          <div class="item-quantity">
            <button @click="decreaseQuantity(item.id)" class="qty-btn">-</button>
            <input :value="item.quantity" @change="(e) => updateQuantity(item.id, parseInt(e.target.value))" type="number" min="1" class="qty-input" />
            <button @click="increaseQuantity(item.id)" class="qty-btn">+</button>
          </div>

          <div class="item-price">
            <span class="unit-price">${{ formatPrice(item.price || item.unitPrice) }}</span>
            <span class="total-price">${{ formatPrice((item.quantity || 1) * (item.price || item.unitPrice)) }}</span>
          </div>

          <button @click="removeItem(item.id)" class="btn-remove">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>

      <!-- Resumen y checkout -->
      <div class="cart-summary">
        <h2>Resumen de Orden</h2>

        <div class="summary-row">
          <span>Subtotal:</span>
          <span>${{ formatPrice(subtotal) }}</span>
        </div>

        <div class="summary-row">
          <span>Impuesto (10%):</span>
          <span>${{ formatPrice(tax) }}</span>
        </div>

        <div class="summary-row total">
          <span>Total:</span>
          <span>${{ formatPrice(total) }}</span>
        </div>

        <!-- Datos de envío -->
        <div class="shipping-section">
          <h3>Dirección de Envío</h3>

          <div class="form-group">
            <label>Dirección *</label>
            <textarea
              v-model="shippingAddress"
              placeholder="Ingresa tu dirección completa"
              rows="3"
              required
            ></textarea>
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <button @click="handleCheckout" class="btn-checkout" :disabled="loading || !shippingAddress.trim()">
            <span v-if="!loading">
              <i class="bi bi-credit-card"></i> Realizar Compra
            </span>
            <span v-else>
              <i class="bi bi-arrow-repeat"></i> Procesando...
            </span>
          </button>

          <button @click="handleClearCart" class="btn-clear">
            <i class="bi bi-trash"></i> Limpiar Carrito
          </button>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { useMainStore } from '../stores/main';
import { orderService } from '../services/orders';
import Navbar from '../components/Navbar.vue';

const store = useMainStore();
const router = useRouter();

const shippingAddress = ref('');
const error = ref('');
const loading = ref(false);

const subtotal = computed(() => {
  return store.cartItems.reduce((sum, item) => sum + ((item.quantity || 1) * (item.price || item.unitPrice || 0)), 0);
});

const tax = computed(() => {
  return subtotal.value * 0.1;
});

const total = computed(() => {
  return subtotal.value + tax.value;
});

function increaseQuantity(productId) {
  const item = store.cartItems.find(i => i.id === productId);
  if (item) {
    store.updateCartItem(productId, (item.quantity || 1) + 1);
  }
}

function decreaseQuantity(productId) {
  const item = store.cartItems.find(i => i.id === productId);
  if (item && (item.quantity || 1) > 1) {
    store.updateCartItem(productId, (item.quantity || 1) - 1);
  }
}

function updateQuantity(productId, newQuantity) {
  if (newQuantity > 0) {
    store.updateCartItem(productId, newQuantity);
  }
}

async function removeItem(productId) {
  await store.removeFromCart(productId);
}

async function handleClearCart() {
  const result = await Swal.fire({
    icon: 'warning',
    title: '¿Limpiar carrito?',
    text: 'Se eliminarán todos los productos del carrito.',
    showCancelButton: true,
    confirmButtonText: 'Sí, limpiar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280'
  });
  if (result.isConfirmed) {
    await store.clearCart();
    shippingAddress.value = '';
  }
}

async function handleCheckout() {
  error.value = '';

  if (!shippingAddress.value.trim()) {
    error.value = 'Por favor ingresa una dirección de envío';
    return;
  }

  if (shippingAddress.value.trim().length < 10) {
    error.value = 'La dirección debe tener al menos 10 caracteres';
    return;
  }

  if (store.cartItems.length === 0) {
    error.value = 'El carrito está vacío';
    return;
  }

  loading.value = true;

  try {
    const orderData = {
      customerId: store.user?.id || 1,
      shippingAddress: shippingAddress.value,
      items: store.cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity || 1,
        unitPrice: item.price || item.unitPrice
      }))
    };

    const response = await orderService.createOrder(orderData);

    if (response.data.success) {
      await store.clearCart();
      shippingAddress.value = '';
      router.push(`/order-detail/${response.data.data.id}`);
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al procesar la compra';
  } finally {
    loading.value = false;
  }
}

function formatPrice(price) {
  return parseFloat(price || 0).toFixed(2);
}
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  background: #faf7f4;
}

.cart-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.cart-container h1 {
  color: var(--ink);
  margin-bottom: 2rem;
  font-size: 2rem;
}

/* Empty Cart */
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: var(--canvas-lifted);
  border-radius: 12px;
  text-align: center;
  color: #9ca3af;
}

.empty-cart i {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.3;
}

.empty-cart p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.btn-continue {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--canvas);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: var(--r-card);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-continue:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

/* Cart Content */
.cart-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

.cart-items {
  background: var(--white);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.cart-items h2 {
  color: var(--ink);
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 1fr 120px 100px 40px;
  gap: 1rem;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border);
}

.cart-item:last-child {
  border-bottom: none;
}

.item-info h3 {
  margin: 0 0 0.25rem;
  color: var(--ink);
  font-size: 1rem;
}

.item-id {
  margin: 0;
  color: #9ca3af;
  font-size: 0.85rem;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--canvas);
  padding: 0.4rem;
  border-radius: 10px;
}

.qty-btn {
  background: #e5e7eb;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.qty-btn:hover {
  background: #d1d5db;
}

.qty-input {
  width: 40px;
  border: none;
  background: transparent;
  text-align: center;
  font-weight: 600;
  font-size: 1rem;
}

.qty-input:focus {
  outline: none;
}

.item-price {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: right;
}

.unit-price {
  color: #9ca3af;
  font-size: 0.9rem;
  text-decoration: line-through;
}

.total-price {
  color: var(--ink);
  font-weight: 700;
  font-size: 1.1rem;
}

.btn-remove {
  background: #fee2e2;
  color: #dc2626;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove:hover {
  background: #fecaca;
}

/* Summary */
.cart-summary {
  background: var(--white);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 2rem;
}

.cart-summary h2 {
  color: var(--ink);
  margin: 0 0 1.5rem;
  font-size: 1.1rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border);
  color: var(--slate);
  font-weight: 500;
}

.summary-row.total {
  padding: 1rem 0;
  border-bottom: none;
  border-top: 2px solid #e5e7eb;
  color: var(--ink);
  font-size: 1.2rem;
  font-weight: 700;
}

.summary-row span:last-child {
  text-align: right;
}

.shipping-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e5e7eb;
}

.shipping-section h3 {
  color: var(--ink);
  margin: 0 0 1rem;
  font-size: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  color: var(--charcoal);
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.9rem;
  font-family: inherit;
  box-sizing: border-box;
  resize: vertical;
  transition: all 0.2s;
}

.form-group textarea:focus {
  outline: none;
  border-color: var(--ink);
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.error-message {
  background: #fee;
  border: 1px solid #fca;
  color: #c33;
  padding: 0.75rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.btn-checkout,
.btn-clear {
  width: 100%;
  padding: 0.875rem;
  border: none;
  border-radius: var(--r-card);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.btn-checkout {
  background: var(--canvas);
  color: white;
}

.btn-checkout:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.btn-checkout:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-clear {
  background: var(--canvas);
  color: var(--slate);
}

.btn-clear:hover {
  background: #e5e7eb;
}

@media (max-width: 1024px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-summary {
    position: static;
  }
}

@media (max-width: 768px) {
  .cart-container {
    padding: 1rem;
  }

  .cart-item {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .item-quantity,
  .item-price,
  .btn-remove {
    width: 100%;
  }

  .item-price {
    text-align: left;
  }
}
</style>
