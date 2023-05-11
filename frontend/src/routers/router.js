import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from "@/components/LoginPage.vue"
import PlannerVue from "@/components/Planner.vue";
import HomePage from "@/components/HomePage.vue";
import ReportPageVue from '@/components/ReportPage.vue';
import DetailedReportPage from '@/components/DetailedReportPage.vue'
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
  },
  {
    path: "/report",
    name: "Report",
    component: ReportPageVue,
  },
  {
    path: "/detailed-inform",
    name: "DetailedReport",
    component: DetailedReportPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;