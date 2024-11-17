<script setup lang="ts">
  import { onMounted, ref } from "vue";
  import type { Product } from "@shared-types/database-types";
  import { useRoute } from "vue-router";
  import LoadingAnimation from "@/components/LoadingAnimation.vue";
  import { useOrderStore } from "@/store/order";

  const productId = useRoute().params.productId as string;
  const product = ref<Product>();

  const selectedColor = ref<string>();
  const selectedSize = ref<string>();

  function canOrderThisProduct() {
    return selectedSize.value && selectedColor.value;
  }

  function orderThisProduct() {
    if (!canOrderThisProduct()) {
      return false;
    }

    return useOrderStore().addOrderItem({
      productId,
      size: selectedSize.value!,
      color: selectedColor.value!,
      amount: 1
    });
  }

  onMounted(async () => {
    product.value = await fetch(`http://localhost:3000/product/${productId}`)
      .then(response => response.ok ? response.json() : null)
      .catch(() => null);
  });
</script>

<template>
  <div v-if="product" class="bg-white pt-6">
    <nav aria-label="Breadcrumb">
      <ol role="list" class="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <li>
          <div class="flex items-center">
            <RouterLink to="/proizvodi">
              <span class="text-sm font-medium text-gray-900">Odjeća</span>
            </RouterLink>
          </div>
        </li>
        <li><span class="text-gray-300 pointer-events-none select-none">\</span></li>
        <li class="text-sm">
          <a href="#" aria-current="page" class="font-medium text-gray-500 hover:text-gray-600">{{ product.name
            }}</a>
        </li>
      </ol>
    </nav>

    <div class="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
      <div class="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
        <img :src="product.imageUrls[0] ?? 'https://placehold.co/300x400'"
             class="h-full w-full object-cover object-center" alt="" />
      </div>
      <div class="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
        <div class="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
          <img :src="product.imageUrls[1] ?? 'https://placehold.co/600x300'"
               class="h-full w-full object-cover object-center" alt="" />
        </div>
        <div class="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
          <img :src="product.imageUrls[2] ?? 'https://placehold.co/400x400'"
               class="h-full w-full object-cover object-center" alt="" />
        </div>
      </div>
      <div class="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
        <img :src="product.imageUrls[3] ?? 'https://placehold.co/300x400'"
             class="h-full w-full object-cover object-center" alt="" />
      </div>
    </div>

    <div
      class="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
      <div class="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{{ product.name }}</h1>
      </div>

      <div class="mt-4 lg:row-span-3 lg:mt-0">
        <h2 class="sr-only">Product information</h2>
        <h3 class="text-3xl tracking-tight text-gray-900">{{ product.price.toFixed(2) }}€</h3>

        <form class="mt-10" @submit.prevent="orderThisProduct()">
          <div>
            <h3 class="text-sm font-medium text-gray-900">Boje</h3>

            <fieldset aria-label="Choose a color" class="mt-4">
              <div class="flex items-center space-x-3">
                <label v-for="color in product.colors" @click="selectedColor = color.name" :aria-label="color.name"
                       :key="color.name" title="Click to choose this color"
                       class="relative -m-0.5 flex flex-col cursor-pointer items-center justify-center rounded-full p-0.5 ring-gray-400 focus:outline-none">
                  <input type="radio" name="color-choice" :value="color.name" class="sr-only" />
                  <span aria-hidden="true"
                        class="h-8 w-8 rounded-full border border-black border-opacity-10"
                        :style="{background: `#${color.hex}`}" />
                  <span :class="{'underline': selectedColor == color.name}">{{ color.name }}</span>
                </label>
              </div>
            </fieldset>
          </div>

          <div class="mt-10">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-medium text-gray-900">Veličina</h3>
            </div>

            <fieldset aria-label="Choose a size" class="mt-4">
              <div class="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                <label v-if="!product.sizes"
                       class="group relative flex cursor-not-allowed items-center justify-center rounded-md border bg-gray-50 px-4 py-3 text-sm font-medium uppercase text-gray-200 hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6">
                  <input type="radio" name="size-choice" value="_" disabled class="sr-only" />
                  <span>_</span>
                  <span aria-hidden="true"
                        class="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200">
                                            <svg class="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                                 viewBox="0 0 100 100" preserveAspectRatio="none" stroke="currentColor">
                                                <line x1="0" y1="100" x2="100" y2="0"
                                                      vector-effect="non-scaling-stroke" />
                                            </svg>
                                        </span>
                </label>
                <label v-else v-for="size in product.sizes" :key="size" @click="selectedSize = size"
                       :class="{'group relative flex cursor-pointer items-center justify-center rounded-md border px-4 py-3 text-sm font-medium uppercase text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6': true,
                       'bg-gray-50': selectedSize == size, 'bg-white': selectedSize != size}">
                  <input type="radio" name="size-choice" :value="size" class="sr-only" />
                  <span :class="{'underline': selectedSize == size}">{{ size }}</span>
                  <span class="pointer-events-none absolute -inset-px rounded-md" aria-hidden="true"></span>
                </label>
              </div>
            </fieldset>
          </div>

          <div class="mt-8 space-y-2">
            <p class="text-sm">Select a size and color to add this product to your shopping cart.</p>
            <button type="submit" :disabled="!canOrderThisProduct()"
                    :class="{'flex w-full items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2': true,
                  'bg-indigo-600 hover:bg-indigo-700': canOrderThisProduct(), 'bg-indigo-300': !canOrderThisProduct()}">
              Dodaj u košaricu
            </button>
          </div>
        </form>
      </div>

      <div class="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
        <div>
          <h3 class="sr-only">Opis</h3>

          <div class="space-y-6">
            <p class="text-base text-gray-900">
              {{ product.description }}
            </p>
          </div>
        </div>

        <div class="mt-10">
          <h3 class="text-sm font-medium text-gray-900">Karakteristike</h3>

          <div class="mt-2">
            <ul role="list" class="list-disc pl-4 text-sm">
              <li v-for="(characteristic, index) in product.characteristics" :key="index" class="text-gray-400">
                <span class="text-gray-600">{{ characteristic }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="mt-10">
          <h2 class="text-sm font-medium text-gray-900">Detalji</h2>

          <div class="mt-2 space-y-6">
            <p class="text-sm text-gray-600">{{ product.details }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="w-full flex flex-col items-center">
    <LoadingAnimation />
  </div>
</template>
