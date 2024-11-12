<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'

const products = await fetch("http://localhost:3000/proizvod");
</script>

<template>
  <main>
    <Product v-for="product in products" product="product"/>
  </main>
</template>
