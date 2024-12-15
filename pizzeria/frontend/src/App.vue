<script setup lang="ts">
  import { computed, reactive, ref } from "vue";
  import type { Pizza, PizzaSize } from "@shared-types/database-types";
  import type { UserPizzaOrder } from "@shared-types/data-transfer-objects.ts";

  const pizzas = ref<(Pizza & { _id: string })[]>([]);
  const sizes = ref<PizzaSize[]>([]);

  const pizzaStates = reactive<{ size: PizzaSize; count: number; }[]>([]);

  const order = reactive<UserPizzaOrder>({
    order: [],
    surname: "",
    address: "",
    telephoneNumber: ""
  });
  const totalPrice = ref<number>();
  const canSendOrder = computed<boolean>(() => Boolean(order.surname && order.address && order.telephoneNumber && order.order.length));

  const addToOrder = (index: number) => {
    const pizzaState = pizzaStates[index];

    if (pizzaState.count) {
      const id = pizzas.value[index]._id;

      order.order.push({
        id,
        size: pizzaState.size,
        count: pizzaState.count
      });
    }
  };

  const sendOrder = async () => {
    if (canSendOrder.value) {
      fetch("http://localhost:3000/order", {
        method: "POST",
        body: JSON.stringify(order),
        headers: { "Content-Type": "application/json" }
      }).then(async (response) => {
        if (response.ok) {
          totalPrice.value = (await response.json()).totalPrice;
        }
      });
    }
  };

  fetch("http://localhost:3000/pizza/sizes").then(async (response) => {
    if (response.ok) {
      sizes.value = await response.json();
    }
  }).then(() => fetch("http://localhost:3000/pizza").then(async (response) => {
    if (response.ok) {
      pizzas.value = await response.json();
      Object.assign(pizzaStates, Array(pizzas.value.length).fill(null).map(() => ({
        size: sizes.value[0],
        count: undefined
      })));
    }
  }));
</script>

<template>
  <div class="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-bold text-center text-gray-800 mb-8">Pizzeria</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
      <div v-for="(pizza, index) in pizzas" :key="pizza.name"
           class="bg-white rounded-lg shadow-md overflow-hidden  flex flex-col">
        <img
          :src="pizza.imageUrl"
          :alt="pizza.name"
          class="w-full h-48 object-cover object-center flex-initial"
        />
        <div class="p-4 flex-1 flex flex-col">
          <h2 class="text-xl font-semibold text-gray-800">{{ pizza.name }}</h2>
          <p class="text-gray-600 text-sm mb-2">{{ pizza.ingredients.join(", ") }}</p>
          <p class="text-gray-800 font-bold mt-auto mb-4">€{{ pizza.price.toFixed(2) }}</p>

          <div class="w-full flex gap-x-2">
            <select name="size" id="size" class="border rounded-md" v-model="pizzaStates[index].size">
              <option v-for="size in sizes" :value="size" :key="size">
                {{ size.charAt(0).toUpperCase() + size.slice(1) }}
              </option>
            </select>
            <input type="number" min="0" placeholder="Amount..." class="border rounded-md p-1 max-w-40"
                   v-model="pizzaStates[index].count">
            <button
              @click="addToOrder(index)"
              class="w-full bg-amber-500 hover:bg-orange-500 text-white font-medium py-2 px-3 rounded-md transition duration-200"
            >
              Add to order
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Your order</h2>
      <ul v-if="order.order.length" class="mb-3">
        <li
          v-for="(entry, index) in order.order"
          :key="index"
          class="flex justify-between items-center py-2 border-b last:border-b-0"
        >
          <span class="text-gray-800">
            {{ entry.size.charAt(0).toUpperCase() + entry.size.slice(1)
            }} {{ pizzas.find(pizza => pizza._id === entry.id)?.name }} x{{ entry.count }}
          </span>
          <span
            class="text-gray-800 font-semibold">€{{ (pizzas.find(pizza => pizza._id === entry.id)!.price * entry.count).toFixed(2)
            }}</span>
        </li>
      </ul>
      <p v-else class="text-gray-400 mb-3">No pizzas have been selected yet.</p>

      <div class="flex flex-col gap-y-2 mb-4">
        <div>
          <label class="block text-gray-700 font-medium mb-1">Surname:</label>
          <input
            v-model="order.surname"
            type="text"
            placeholder="Enter your surname"
            class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-gray-700 font-medium mb-1">Address:</label>
          <input
            v-model="order.address"
            type="text"
            placeholder="Enter your address"
            class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-gray-700 font-medium mb-1">Telephone number:</label>
          <input
            v-model="order.telephoneNumber"
            type="tel"
            placeholder="Enter your phone number"
            class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <p v-if="totalPrice" class="text-gray-800 font-semibold mb-4">Total price: €{{ totalPrice.toFixed(2) }}</p>
      <p v-else class="text-gray-800 mb-4">Your total price will be calculated once the order is submitted.</p>

      <button
        @click="sendOrder"
        class="bg-lime-500 disabled:bg-gray-400 enabled:hover:bg-lime-400 text-white font-medium py-2 px-3 rounded-md transition duration-200"
        :disabled="!canSendOrder"
      >
        Send Order
      </button>
    </div>
  </div>
</template>

<style scoped>
  /* Custom styles if needed */
</style>
