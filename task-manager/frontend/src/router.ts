import { createRouter, createWebHistory } from "vue-router";
import TasksView from "@/views/TasksView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "tasks",
      component: TasksView
    },
    {
      path: "/create",
      name: "create",
      component: () => import("@/views/CreateTaskView.vue")
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/tasks"
    }
  ]
});

export default router;
