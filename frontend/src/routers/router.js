import AppVue from "@/App.vue";
import PlannerVue from "@/components/Planner.vue";
import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../components/HomePage.vue";

const routes = [
  {
    path: "/",
    name: "Redirect",
    redirect: "/login"
  },
  {
    path: "/login",
    name: "App.vue",
    component: AppVue,
  },
  {
    path: "/home",
    name: "HomePage",
    component: HomePage,
  },
  {
    path: "/planner",
    name: "Planner",
    component: PlannerVue,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;