<script setup></script>

<template>
  <div class="max-w-4xl mx-auto p-4">
    <!-- Header -->
    <header
      class="flex justify-between items-center bg-white p-4 shadow rounded-md mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Task Manager</h1>
      <button
        class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
        Dodaj zadatak
      </button>
    </header>
    <!--/Header-->

    <!-- Task List -->
    <div class="bg-white p-4 shadow rounded-md">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Vaši zadaci</h2>
      <ul class="space-y-4">
        <!-- Task Item -->
        <li
          class="flex justify-between items-center p-4 bg-gray-50 rounded-md shadow">
          <div>
            <p class="text-lg font-medium text-gray-800">Naslov zadatka</p>
            <p class="text-sm text-gray-600">Opis zadatka</p>
          </div>
          <!-- Task Actions -->
          <div class="flex space-x-2">
            <button
              class="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600">
              Dovršeno
            </button>
            <button
              class="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
              Obriši
            </button>
          </div>
          <!--/Task Actions-->
        </li>
        <!--/Task Item-->
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
