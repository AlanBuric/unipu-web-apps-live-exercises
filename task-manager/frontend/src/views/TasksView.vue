<script setup lang="ts">
  import { reactive, ref } from "vue";
  import type { Task } from "@shared-types/database-types.ts";

  const editing = ref(-1);
  const tasks = reactive<Task[]>([]);

  function startEditingTask(index: number) {
    editing.value = index;
  }

  function stopEditingTask() {
    editing.value = -1;
  }

  function isEditingTask() {
    return editing.value >= 0;
  }

  function getTaskBeingEdited() {
    return tasks[editing.value];
  }

  function addTask() {
    tasks.push({
      name: "",
      description: "",
      done: false,
      tagIds: []
    });

    startEditingTask(tasks.length - 1);
  }

  function removeTask(index: number) {
    tasks.splice(index, 1);
  }

  function finishTask(index: number) {
    tasks[index].done = true;
  }
</script>

<template>
  <div class="max-w-4xl mx-auto p-4">
    <header
      class="flex justify-between items-center bg-white p-4 shadow rounded-md mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Task Manager</h1>
      <button
        class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        @click="addTask">
        Dodaj zadatak
      </button>
    </header>

    <!-- Editable Input Section -->
    <div v-if="isEditingTask()" class="bg-white p-4 shadow rounded-md mb-6">
      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-2" for="naslov"
        >Naslov zadatka:</label
        >
        <input
          id="naslov"
          type="text"
          v-model="getTaskBeingEdited().name"
          class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          placeholder="Unesite naslov zadatka" />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-2" for="opis"
        >Opis zadatka:</label
        >
        <textarea
          id="opis"
          v-model="getTaskBeingEdited().description"
          rows="3"
          class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          placeholder="Unesite opis zadatka"></textarea>
      </div>
      <div class="flex space-x-4">
        <button
          class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          @click="stopEditingTask">
          Spremi zadatak
        </button>
        <button
          class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          @click="stopEditingTask">
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
            <p class="text-lg font-medium text-gray-800">{{ task.name }}</p>
            <p class="text-sm text-gray-600">{{ task.description }}</p>
          </div>
          <div class="flex space-x-2">
            <button
              v-if="!task.done"
              class="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
              @click="finishTask(index)">
              Dovršeno
            </button>
            <button
              class="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
              @click="removeTask(index)">
              Obriši
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
