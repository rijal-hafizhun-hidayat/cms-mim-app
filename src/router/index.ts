import { createRouter, createWebHistory } from 'vue-router'
import AuthIndexView from '@/views/auth/IndexView.vue'
import MemeTypeIndexView from '@/views/meme_type/IndexView.vue'
import MemeTypeCreateView from '@/views/meme_type/CreateView.vue'
import MemeTypeShowView from '@/views/meme_type/ShowView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login.index',
      component: AuthIndexView,
    },
    {
      path: '/meme-type',
      children: [
        {
          path: '',
          name: 'meme_type.index',
          component: MemeTypeIndexView,
        },
        {
          path: 'create',
          name: 'meme_type.create',
          component: MemeTypeCreateView,
        },
        {
          path: ':memeTypeId',
          name: 'meme_type.show',
          component: MemeTypeShowView,
        },
      ],
    },
  ],
})

export default router
