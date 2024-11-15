<script setup lang="ts">
import Product from "@/components/Product.vue";
import { onMounted, ref } from "vue";
import LoadingAnimation from "@/components/LoadingAnimation.vue";
import { Proizvod } from "@shared-types/types";

const products = ref<Proizvod[]>([]);

onMounted(async () => {
  products.value = await fetch("http://localhost:3000/proizvod")
    .then(response => response.ok ? response.json() : null)
    .catch(() => null);
});
</script>

<template>
  <main class="w-full">
    <Product v-for="product in products" :proizvod="product" :key="product.id" />
    <LoadingAnimation v-if="!products.length" />
  </main>
</template>
