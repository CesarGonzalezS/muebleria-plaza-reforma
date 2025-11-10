<template>
  <!-- Usamos router-link para que toda la tarjeta sea clicable y navegue al detalle -->
  <router-link
    class="product-card"
    :to="productLink"
    @click="handleClick"
  >
    <img :src="imgSrc" :alt="product.name || 'Producto'" class="product-image" />
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="price">${{ product.price?.toLocaleString('es-MX') || '0' }}</p>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
const props = defineProps({ product: Object });
const router = useRouter();

// Fallback para la imagen: puede venir como img o img_base64
const imgSrc = computed(() => {
  // Primero intentar obtener del array de imágenes
  if (props.product?.images && Array.isArray(props.product.images) && props.product.images.length > 0) {
    const firstImage = props.product.images[0];
    // La imagen puede venir como string o como objeto con img_base64
    return typeof firstImage === 'string' ? firstImage : (firstImage.img_base64 || firstImage.url || '/assets/img/products/default.jpg');
  }
  // Fallback a img o img_base64 por compatibilidad
  return props.product?.img || props.product?.img_base64 || '/assets/img/products/default.jpg';
});

// Construir un `to` seguro: si no hay id navegamos a la lista de productos
const productLink = computed(() => {
  const id = props.product?.id ?? props.product?._id ?? props.product?.product_id;
  if (id !== undefined && id !== null && id !== '') {
    return { name: 'ProductoDetalle', params: { id } };
  }
  // Fallback: ir a la lista de productos si no hay id
  return { name: 'ProductosList' };
});

function handleClick(event) {
  const id = props.product?.id ?? props.product?._id ?? props.product?.product_id;
  console.log('[ProductCard] click, product id =', id);

  if (id === undefined || id === null || id === '') {
    // Si no hay id prevenimos la navegación por defecto y redirigimos a lista
    event.preventDefault();
    router.push({ name: 'ProductosList' });
  }
  // Si hay id, dejamos que router-link realice la navegación por defecto
}
</script>

<style scoped>
.product-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(134, 7, 52, 0.08);
  overflow: hidden;
  transition: box-shadow 0.25s, transform 0.22s;
  cursor: pointer;
  border: 1px solid #eee;
  display: flex;
  flex-direction: column;
  text-decoration: none; /* prevenir subrayado de enlace */
  color: inherit; /* heredar color para evitar estilo de enlace */
}

.product-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  background: #faf6fa;
  border-bottom: 1px solid #f1e0ea;
  transition: filter 0.3s;
}

.product-card:hover .product-image {
  filter: brightness(0.94) saturate(1.12);
}

.product-info {
  padding: 1rem 0.8rem 1.5rem 0.8rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 0.4rem;
  font-weight: 600;
}

.price {
  color: #860734;
  font-weight: bold;
  font-size: 1.17rem;
  margin-top: 0.2rem;
}
</style>
