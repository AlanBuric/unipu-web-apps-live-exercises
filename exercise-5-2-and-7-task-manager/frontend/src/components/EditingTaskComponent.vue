<script setup lang="ts">
  import { reactive, ref } from "vue";
  import type { TagsResponse, TasksResponse } from "@shared-types/data-transfer-objects.ts";
  import { convertRgb24ToCssHexString } from "@/utils";
  import type { EditingTask } from "@/types/types.ts";

  const DEFAULT_TAG = { name: "", color: "#000000" };

  const props = defineProps<{
    task: TasksResponse["tasks"][number],
    tags: Record<string, TagsResponse[number]>,
    isNew: boolean
  }>();
  const emits = defineEmits(["save", "create", "cancelEdit", "addTag"]);

  const task = reactive<EditingTask>({ ...props.task, tagIds: new Set(props.task.tagIds) });
  const newTag = ref({ ...DEFAULT_TAG });
  const selectedTagId = ref("");

  function addNewTag() {
    if (newTag.value.name.trim()) {
      emits("addTag", {
        name: newTag.value.name,
        color: parseInt(newTag.value.color.slice(1), 16)
      });

      newTag.value = { ...DEFAULT_TAG };
    } else {
      alert("Tag name can't be empty.");
    }
  }

  function removeTag(_id: string) {
    task.tagIds.delete(_id);
  }

  function assignTag() {
    if (selectedTagId.value) {
      task.tagIds.add(selectedTagId.value);
    }
  }

  function handleSave() {
    emits(props.isNew ? "create" : "save", { ...task, tagIds: [...task.tagIds] });
  }

  function handleCancel() {
    emits("cancelEdit");
  }
</script>

<template>
  <div class="bg-white p-4 shadow rounded-md mb-6">
    <div class="mb-4">
      <label class="block text-emerald-700 font-medium mb-2" for="task-name">Naslov zadatka:</label>
      <input
        id="task-name"
        type="text"
        v-model="task.name"
        class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-emerald-200"
        placeholder="Unesite naslov zadatka"
      />
    </div>
    <div class="mb-4">
      <label class="block text-emerald-700 font-medium mb-2" for="task-desc">Opis zadatka:</label>
      <textarea
        id="task-desc"
        v-model="task.description"
        rows="3"
        class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-emerald-200"
        placeholder="Unesite opis zadatka"
      />
    </div>
    <div class="mb-4">
      <label class="block text-emerald-700 font-medium mb-2" for="tags">Tagovi:</label>
      <div class="flex flex-wrap gap-2">
        <select v-model="selectedTagId" id="tags"
                class="border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-emerald-200">
          <option value="" disabled>Odaberite tag...</option>
          <option
            v-for="tag in tags"
            :value="tag._id"
            :key="tag._id"
            :disabled="task.tagIds.has(tag._id)">
            {{ tag.name }}
          </option>
        </select>
        <button
          class="bg-emerald-500 text-white px-3 py-2 rounded-md hover:bg-emerald-600"
          @click="assignTag"
        >
          Dodaj
        </button>
        <div
          v-for="tag in [...task.tagIds].map(tagId => tags[tagId])"
          :key="tag._id"
          class="text-white px-3 py-2 rounded-md space-x-1"
          :style="{'background-color': convertRgb24ToCssHexString(tag.color)}"
        >
          <span>
            {{ tag.name }}
          </span>
          <button class="text-red-500" @click="removeTag(tag._id)">×</button>
        </div>
      </div>
    </div>
    <div class="mb-4">
      <h3 class="text-emerald-700 font-medium mb-2">Dodaj novi tag:</h3>
      <div class="flex items-center space-x-2">
        <input
          type="text"
          v-model="newTag.name"
          class="flex-grow px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-emerald-200"
          placeholder="Ime taga"
        />
        <input
          type="color"
          v-model="newTag.color"
          class="w-12 h-12 border rounded-md"
        />
        <button
          class="bg-emerald-500 text-white px-3 py-2 rounded-md hover:bg-emerald-600"
          @click="addNewTag"
        >
          Dodaj
        </button>
      </div>
    </div>
    <div class="flex space-x-2">
      <button
        class="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600"
        @click="handleSave"
      >
        Spremi zadatak
      </button>
      <button
        class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        @click="handleCancel"
      >
        Odustani
      </button>
    </div>
  </div>
</template>
