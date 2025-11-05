<script setup lang="ts">
  import { computed, reactive, ref } from "vue";
  import TaskComponent from "@/components/TaskComponent.vue";
  import EditingTaskComponent from "@/components/EditingTaskComponent.vue";
  import type { Tag, Task, WithId } from "@shared-types/database-types.ts";
  import type { TasksResponse } from "@shared-types/data-transfer-objects.ts";
  import { getAuthHeaders } from "@/utils";

  const NEW_TASK_ID = "new";

  const tasks = reactive<Record<string, TasksResponse["tasks"][number]>>({});
  const tags = reactive<Record<string, TasksResponse["tags"][number]>>({});

  const editing = ref({ _id: "", isNew: false });
  const hasTasks = computed(() => Object.keys(tasks).length > 0);

  fetch("http://localhost:3000/api/tasks", { headers: getAuthHeaders() })
    .then((response) => response.json())
    .then((body: TasksResponse) => {
      body.tasks.forEach((task) => (tasks[task._id] = task));
      body.tags.forEach((tag) => (tags[tag._id] = tag));
    });

  function startEditingTask(_id: string) {
    if (tasks[editing.value._id]) {
      const stopEditing = confirm(
        "Jeste li sigurni da želite odbaciti trenutno nespremljene promjene?",
      );

      if (!stopEditing) {
        return;
      } else if (editing.value._id === NEW_TASK_ID) {
        delete tasks[NEW_TASK_ID];
      }
    }

    editing.value = { _id, isNew: false };
  }

  function resetEditing() {
    editing.value = { _id: "", isNew: false };
  }

  function cancelEdit() {
    if (editing.value.isNew) {
      delete tasks[editing.value._id];
    }

    resetEditing();
  }

  function saveTask(task: WithId<Task>) {
    fetch(`http://localhost:3000/api/tasks/${task._id}`, {
      method: "PATCH",
      body: JSON.stringify(task),
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    }).then((response) => {
      if (response.ok) {
        tasks[editing.value._id] = task;
        resetEditing();
      } else {
        response.json().then((body) => alert(`Couldn't save the task. ${body?.error}`));
      }
    });
  }

  function createNewTask(task: WithId<Task>) {
    fetch(`http://localhost:3000/api/tasks`, {
      method: "POST",
      body: JSON.stringify(task),
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    })
      .then((response) => Promise.all([response.ok, response.json()]))
      .then(([isOk, body]) => {
        if (isOk) {
          resetEditing();

          task._id = body;
          delete tasks[NEW_TASK_ID];
          tasks[task._id] = task;
        } else {
          alert(`Couldn't create a new task. ${body?.error}`);
        }
      });
  }

  function isEditingTask(_id: string) {
    return editing.value._id === _id;
  }

  function addTask() {
    tasks[NEW_TASK_ID] = {
      _id: NEW_TASK_ID,
      name: "",
      description: "",
      done: false,
      tagIds: [],
    };

    editing.value = { _id: NEW_TASK_ID, isNew: true };
  }

  function addTag(tag: Tag) {
    fetch(`http://localhost:3000/api/tags`, {
      method: "POST",
      body: JSON.stringify(tag),
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    })
      .then((response) => Promise.all([response.ok, response.json()]))
      .then(([isOk, body]) => {
        if (isOk) {
          tags[body] = { _id: body, ...tag };
        } else {
          alert(`Couldn't create a new tag. ${body?.error}`);
        }
      });
  }

  function removeTask(_id: string) {
    const task = tasks[_id];

    fetch(`http://localhost:3000/api/tasks/${task._id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    }).then((response) => {
      if (response.ok) {
        delete tasks[_id];
      } else {
        response.json().then((body) => alert(`Couldn't delete the task. ${body?.error}`));
      }
    });
  }

  function finishTask(_id: string) {
    const task = tasks[_id];

    fetch(`http://localhost:3000/api/tasks/${task._id}`, {
      method: "PATCH",
      body: JSON.stringify({ done: true }),
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    }).then((response) => {
      if (response.ok) {
        tasks[_id].done = true;
      } else {
        response.json().then((body) => alert(`Couldn't finish the task. ${body?.error}`));
      }
    });
  }
</script>

<template>
  <div class="max-w-4xl mx-auto p-4">
    <header class="flex justify-between items-center bg-white p-4 shadow rounded-md mb-6">
      <h1 class="text-2xl font-bold text-emerald-800">Task Manager</h1>
      <button
        class="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600"
        @click="addTask"
      >
        Dodaj zadatak
      </button>
    </header>

    <div class="bg-white p-4 shadow rounded-md">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Vaši zadaci</h2>
      <ul v-if="hasTasks" class="space-y-4">
        <li v-for="task in tasks" :key="task._id">
          <EditingTaskComponent
            v-if="isEditingTask(task._id)"
            :task="task"
            :tags="tags"
            :is-new="task._id == 'new'"
            @save="saveTask"
            @create="createNewTask"
            @cancel-edit="cancelEdit"
            @add-tag="addTag"
          />
          <TaskComponent
            v-else
            :task="task"
            :_id="task._id"
            :tags="tags"
            @edit="startEditingTask"
            @remove="removeTask"
            @finish="finishTask"
          />
        </li>
      </ul>
      <p v-else class="text-gray-400 text-center">Trenutno nemate zadataka.</p>
    </div>
  </div>
</template>
