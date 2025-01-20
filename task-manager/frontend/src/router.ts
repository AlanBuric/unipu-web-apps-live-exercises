import { createRouter, createWebHistory } from "vue-router";
import LoginView from '@/views/LoginView.vue';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    avoidIfAuthed?: boolean;
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'login',
      path: '/',
      component: LoginView,
      meta: {
        avoidIfAuthed: true
      }
    },
    {
      path: "/tasks",
      name: "tasks",
      component: () => import('@/views/TasksView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/"
    },
  ]
});

router.beforeEach(async (to) => {
  const accessToken = localStorage.getItem("accessToken");

  if (to.meta.requiresAuth && !accessToken) {
    return {
      name: 'login',
      query: {
        redirect: to.fullPath
      }
    };
  } else if (to.meta.avoidIfAuthed && accessToken) {
    return {
      name: 'tasks'
    };
  }
});

export default router;
