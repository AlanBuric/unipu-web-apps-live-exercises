<script setup lang="ts">
import Product from "@/components/Product.vue";
import { onMounted, ref } from "vue";

const products = ref<{
  id: string,
  naziv: string;
  cijena: number;
  velicine: string[];
}[]>([]);

onMounted(async () => {
  products.value = await fetch("http://localhost:3000/proizvod")
    .then(response => response.ok ? response.json() : null)
    .catch(() => null);
});
</script>

<template>
  <main>
    <Product v-if="products" v-for="product in products" :proizvod="product" />
  </main>
</template>
