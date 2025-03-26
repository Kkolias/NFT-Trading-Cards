import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminCraftView from '@/views/AdminCraftView.vue'
import MyCardsView from '@/views/MyCardsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/admin/craft-cards',
      name: 'carft-cards',
      component: AdminCraftView,
    },
    {
      path: '/my-cards',
      name: 'my-cards',
      component: MyCardsView,
    },
  ],
})

export default router
