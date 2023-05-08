import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from "@/components/LoginPage.vue"
import PlannerVue from "@/components/Planner.vue";
import HomePage from "@/components/HomePage.vue";

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/home",
    name: "Home",
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
