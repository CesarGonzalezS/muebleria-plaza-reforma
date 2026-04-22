<template>
  <router-link
    class="product-card"
    :to="productLink"
    @click="handleClick"
  >
    <div class="product-image-wrap">
      <img :src="imgSrc" :alt="product.name || 'Producto'" class="product-image" loading="lazy" />
      <FavoriteButton :product="product" class="fav-btn-corner" />
      <div class="product-overlay" aria-hidden="true">
        <span class="product-overlay-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          Ver detalle
        </span>
      </div>
    </div>
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="price">${{ product.price?.toLocaleString('es-MX') || '0' }}</p>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import FavoriteButton from './FavoriteButton.vue';
const props = defineProps({ product: Object });
const router = useRouter();

const imgSrc = computed(() => {
  if (props.product?.images && Array.isArray(props.product.images) && props.product.images.length > 0) {
    const firstImage = props.product.images[0];
    return typeof firstImage === 'string' ? firstImage : (firstImage.img_base64 || firstImage.url || '/assets/img/products/default.jpg');
  }
  return props.product?.img || props.product?.img_base64 || '/assets/img/products/default.jpg';
});

const productLink = computed(() => {
  const id = props.product?.id ?? props.product?._id ?? props.product?.product_id;
  if (id !== undefined && id !== null && id !== '') {
    return { name: 'ProductoDetalle', params: { id } };
  }
  return { name: 'ProductosList' };
});

function handleClick(event) {
  const id = props.product?.id ?? props.product?._id ?? props.product?.product_id;
  if (id === undefined || id === null || id === '') {
    event.preventDefault();
    router.push({ name: 'ProductosList' });
  }
}
</script>

<style scoped>
.product-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(134, 7, 52, 0.07);
  overflow: hidden;
  transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 1px solid rgba(134, 7, 52, 0.07);
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
}

.product-card:hover {
  box-shadow: 0 16px 44px rgba(134, 7, 52, 0.14);
  transform: translateY(-4px);
}

.product-image-wrap {
  position: relative;
  overflow: hidden;
  aspect-ratio: 4/3;
  background: #f9f4f5;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: block;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-overlay {
  position: absolute;
  inset: 0;
  background: rgba(134, 7, 52, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.28s ease;
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.product-overlay-btn {
  background: #fff;
  color: #860734;
  border-radius: 50px;
  padding: 0.65rem 1.4rem;
  font-size: 0.9rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transform: translateY(8px);
  transition: transform 0.28s ease;
}

.product-card:hover .product-overlay-btn {
  transform: translateY(0);
}

.product-info {
  padding: 1rem 1.1rem 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.product-name {
  font-size: 0.98rem;
  color: #1a1a1a;
  font-weight: 600;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.price {
  color: #860734;
  font-weight: 800;
  font-size: 1.15rem;
  margin: 0;
}

.fav-btn-corner {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
}
</style>
