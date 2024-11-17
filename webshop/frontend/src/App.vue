<script setup lang="ts">
  import { RouterView } from "vue-router";
  import ShoppingCart from "@/components/icons/ShoppingCart.vue";
  import { useOrderStore } from "@/store/order";
  import type { OrderRequest } from "@shared-types/data-transfer-objects";

  const orderStore = useOrderStore();

  function sendOrder() {
    const order: OrderRequest = { items: orderStore.shoppingCart };

    return fetch("http://localhost:3000/order", {
      method: "POST",
      body: JSON.stringify(order),
      headers: { "Content-Type": "application/json" }
    }).then((response) => response.ok && orderStore.clearShoppingCart());
  }

</script>

<template>
  <nav class="max-w-full text-gray-100 px-3 py-2 shadow-md bg-gray-600 flex items-center">
    <div class="flex-1">
      <RouterLink to="/proizvodi">
        <span class="text-2xl hover:underline" title="Povratak na početnu stranicu">Webshop</span>
      </RouterLink>
    </div>
    <div class="flex-initial rounded-xl bg-gray-700 p-2 flex gap-2 items-center self-end">
      <ShoppingCart />
      <span class="text-base">{{ orderStore.shoppingCart.reduce((acc, orderItem) => acc + orderItem.amount, 0)
        }} proizvoda</span>
      <button class="bg-indigo-600 px-2 py-1 rounded-md hover:bg-indigo-700" @click="sendOrder">Naruči</button>
      <button class="bg-amber-400 px-2 py-1 rounded-md hover:bg-amber-500 text-gray-900"
              @click="useOrderStore().clearShoppingCart()">
        Obriši
      </button>
    </div>
  </nav>
  <RouterView />
</template>
