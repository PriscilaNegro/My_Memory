import { createRouter, createWebHistory } from "vue-router";
import Register from "../views/Register.vue";
//import Login from "../views/Login.vue";


const routes = [
   { 
    path: "/",          // rota raiz
    name: "Home",
    component: Register // ou outro componente 
  },
  { path: "/register", 
    name: "Register",
    component: Register }
  //{ path: "/login", component: Login },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
