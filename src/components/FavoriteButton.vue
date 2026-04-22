<template>
  <button
    :class="['fav-btn', { 'fav-btn--active': active }]"
    @click.prevent.stop="handleClick"
    :aria-label="active ? 'Quitar de favoritos' : 'Agregar a favoritos'"
    :title="active ? 'Quitar de favoritos' : 'Agregar a favoritos'"
    type="button"
  >
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      :fill="active ? 'currentColor' : 'none'"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  </button>
</template>

<script setup>
import { computed } from 'vue';
import { useFavoritesStore } from '../stores/favoritesStore';

const props = defineProps({
  product: { type: Object, required: true },
});

const favStore = useFavoritesStore();
const active = computed(() => favStore.isFavorite(props.product.id));

function handleClick() {
  favStore.toggle(props.product);
}
</script>

<style scoped>
.fav-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.92);
  color: #9ca3af;
  cursor: pointer;
  transition: color 0.2s, background 0.2s, transform 0.15s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  backdrop-filter: blur(4px);
  padding: 0;
}

.fav-btn:hover {
  color: #860734;
  background: #fff;
  transform: scale(1.1);
}

.fav-btn--active {
  color: #860734;
  background: #fff;
}

.fav-btn--active:hover {
  transform: scale(1.1);
}
</style>
