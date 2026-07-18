import { createRouter, createWebHistory } from "vue-router";
import ContactBook from "@/views/ContactBook.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import authService from "@/services/auth.service";

const routes = [
  { path: "/", redirect: "/contacts" },
  {
    path: "/contacts",
    name: "contactbook",
    component: ContactBook,
    meta: { requiresAuth: true },
  },
  { path: "/login", name: "login", component: Login },
  { path: "/register", name: "register", component: Register },
  {
    path: "/contacts/add",
    name: "contact.add",
    component: () => import("@/views/ContactAdd.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/contacts/:id",
    name: "contact.edit",
    component: () => import("@/views/ContactEdit.vue"),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: () => import("@/views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const token = authService.getToken();
    if (!token) {
      next({ name: "login" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
