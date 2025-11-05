import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/proizvodi",
      name: "popis-proizvoda",
      component: HomeView
    },
    {
      path: "/proizvodi/:productId",
      name: "proizvod",
      component: () => import("@/views/ProductView.vue")
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/proizvodi"
    }
  ]
});

export default router;
