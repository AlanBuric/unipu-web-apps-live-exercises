<script setup lang="ts">
  import { onMounted, ref } from "vue";
  import type { ProductPreview } from "@shared-types/data-transfer-objects";
  import ProductCard from "@/components/ProductCard.vue";
  import LoadingAnimation from "@/components/LoadingAnimation.vue";

  const products = ref<ProductPreview[]>([]);

  onMounted(async () => {
    products.value = await fetch(`http://localhost:3000/product`)
      .then(response => response.ok ? response.json() : [])
      .catch(() => []);
  });
</script>

<template>
  <div v-if="products.length" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 py-4 px-5">
    <RouterLink :to="`/proizvodi/${product.id}`" v-for="product in products" :key="product.id">
      <ProductCard :product="product" />
    </RouterLink>
  </div>
  <div v-else class="w-full flex flex-col items-center">
    <LoadingAnimation />
  </div>
</template>
