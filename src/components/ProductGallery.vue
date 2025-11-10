<template>
  <div class="product-gallery">
    <div v-for="product in products" :key="product.id" class="product-item">
      <ProductCard :product="product" />
    </div>
  </div>
</template>

<script setup>
import './assets/styles.css';

import ProductCard from './ProductCard.vue'
defineProps({ products: Array })
</script>

<style scoped>
.product-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 2rem;
}

.product-item {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-item:hover {
  transform: translateY(-10px) scale(1.025);
  z-index: 2;
}

/* Responsive */
@media (max-width: 1024px) {
  .product-gallery {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .product-gallery {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.25rem;
  }
}

@media (max-width: 640px) {
  .product-gallery {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .product-gallery {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0 0.5rem;
  }

  .product-item:hover {
    transform: translateY(-5px) scale(1.01);
  }
}
</style>
