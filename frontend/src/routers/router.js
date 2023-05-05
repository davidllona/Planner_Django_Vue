import { createRouter, createWebHistory } from 'vue-router'
import AppVue from "@/App.vue";
import PlannerVue from "@/components/Planner.vue";
import HomePage from "@/components/HomePage.vue";
import auth from "@/auth";

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    name: "Login",
    component: AppVue,
  },
  {
    path: "/home",
    name: "Home",
    component: HomePage,
    meta: { requiresAuth: true }
  },
  {
    path: "/planner",
    name: "Planner",
    component: PlannerVue,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!auth.getUserLogged()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
