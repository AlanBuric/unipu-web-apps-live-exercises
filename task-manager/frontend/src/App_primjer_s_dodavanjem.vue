<script setup>
import { ref } from "vue";

const naslovZadatka = ref("");
const opisZadatka = ref("");
const editing = ref(false);
const tasks = ref([]);

function dodajZadatak() {
  if (naslovZadatka.value.trim() && opisZadatka.value.trim()) {
    tasks.value.unshift({
      naslov: naslovZadatka.value,
      opis: opisZadatka.value,
    });
    naslovZadatka.value = "";
    opisZadatka.value = "";
    editing.value = false;
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-4">
    <!-- Header -->
    <header
      class="flex justify-between items-center bg-white p-4 shadow rounded-md mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Task Manager</h1>
      <button
        class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        @click="editing = true">
        Dodaj zadatak
      </button>
    </header>
    <!--/Header-->

    <!-- Editable Input Section -->
    <div v-if="editing" class="bg-white p-4 shadow rounded-md mb-6">
      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-2" for="naslov"
          >Naslov zadatka:</label
        >
        <input
          id="naslov"
          type="text"
          v-model="naslovZadatka"
          class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          placeholder="Unesite naslov zadatka" />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-2" for="opis"
          >Opis zadatka:</label
        >
        <textarea
          id="opis"
          v-model="opisZadatka"
          rows="3"
          class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          placeholder="Unesite opis zadatka"></textarea>
      </div>
      <div class="flex space-x-4">
        <button
          class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          @click="dodajZadatak">
          Spremi zadatak
        </button>
        <button
          class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          @click="editing = false">
          Odustani
        </button>
      </div>
    </div>
    <!--/Editable Input Section-->

    <!-- Task List -->
    <div class="bg-white p-4 shadow rounded-md">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Vaši zadaci</h2>
      <ul class="space-y-4">
        <li
          v-for="(task, index) in tasks"
          :key="index"
          class="flex justify-between items-center p-4 bg-gray-50 rounded-md shadow">
          <div>
            <p class="text-lg font-medium text-gray-800">{{ task.naslov }}</p>
            <p class="text-sm text-gray-600">{{ task.opis }}</p>
          </div>
          <div class="flex space-x-2">
            <button
              class="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600">
              Dovršeno
            </button>
            <button
              class="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
              @click="tasks.splice(index, 1)">
              Obriši
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
