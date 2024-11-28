import { createRouter, createWebHistory } from 'vue-router'
import AuthIndexView from '@/views/auth/IndexView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AuthIndexView,
    },
  ],
})

export default router
