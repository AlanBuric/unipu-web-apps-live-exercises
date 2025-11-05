<script setup lang="ts">
  import type { Task, WithId } from "@shared-types/database-types.ts";
  import { convertRgb24ToCssHexString } from "@/utils";
  import type { TasksResponse } from "@shared-types/data-transfer-objects.ts";

  const props = defineProps<{ task: WithId<Task>, tags: Record<string, TasksResponse["tags"][number]>, _id: string }>();
  const emits = defineEmits(["edit", "remove", "finish"]);

  function handleEdit() {
    emits("edit", props._id);
  }

  function handleRemove() {
    emits("remove", props._id);
  }

  function handleFinish() {
    emits("finish", props.task._id);
  }
</script>

<template>
  <li class="flex justify-between items-center p-4 bg-gray-50 rounded-md shadow">
    <div>
      <p class="text-lg font-medium text-emerald-800">{{ task.name }} <span v-if="task.done">✔️</span></p>
      <p class="text-sm text-emerald-600 mb-2">{{ task.description }}</p>
      <div class="flex gap-1">
      <span
        v-for="tag in [...task.tagIds].map(tagId => tags[tagId])"
        :key="tag._id"
        class="text-white px-2 py-1 rounded-md space-x-1"
        :style="{'background-color': convertRgb24ToCssHexString(tag.color)}"
      >
        {{ tag.name }}
      </span>
      </div>
    </div>
    <div class="flex space-x-2">
      <button
        v-if="!task.done"
        class="bg-emerald-500 text-white px-3 py-1 rounded-md hover:bg-emerald-600"
        @click="handleFinish"
      >
        Dovršeno
      </button>
      <button
        class="bg-emerald-500 text-white px-3 py-1 rounded-md hover:bg-emerald-600"
        @click="handleEdit"
      >
        Uredi
      </button>
      <button
        class="bg-cyan-600 text-white px-3 py-1 rounded-md hover:bg-cyan-700"
        @click="handleRemove"
      >
        Obriši
      </button>
    </div>
  </li>
</template>
