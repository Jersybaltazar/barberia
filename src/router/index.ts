import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import LoginPage from '../pages/LoginPage.vue';
import RegisterPage from '../pages/RegisterPage.vue';
import HomePage from '../pages/HomePage.vue';
import BarberPage from '../pages/BarberPage.vue';
import DateAndTimeSelection from '../pages/DateAndTimeSelection.vue';
import ProductList from '../pages/ProductList.vue';
import Perfil from '../pages/Perfil.vue';
import Reservas from '../pages/Reservas.vue';
import Servicios from '../pages/Servicios.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/barberos',
    name: 'Barberos',
    component: BarberPage,
  },
  {
    path: '/barberos/reserva',
    name: 'DateAndTimeSelection',
    component: DateAndTimeSelection,
  },
  {
    path: '/productos',
    name: 'Productos',
    component: ProductList,
  },
  {
    path: '/perfil',
    name: 'Perfil',
    component: Perfil, 
  },
  {
    path: '/reservas',
    name: 'Reservas',
    component: Reservas,
  },
  {
    path: '/servicios',
    name: 'Servicios',
    component: Servicios,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
