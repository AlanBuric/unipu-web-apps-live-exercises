<script setup lang="ts">
  import type { ProductPreview } from "@shared-types/data-transfer-objects";

  defineProps<{ product: ProductPreview }>();
</script>

<template>
  <div class="group relative bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg">
    <img
      :src="product.imageUrl"
      :alt="product.name"
      class="aspect-square object-cover object-center transition-transform duration-200 group-hover:scale-105"
    />
    <div class="p-4">
      <h3 class="text-sm font-medium text-gray-900 truncate">{{ product.name }}</h3>
      <p class="text-sm font-medium text-gray-500 mt-1">{{ product.price.toFixed(2) }}€</p>
    </div>
  </div>
</template>
