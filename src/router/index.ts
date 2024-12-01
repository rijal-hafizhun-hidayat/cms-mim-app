import { createRouter, createWebHistory } from 'vue-router'
import AuthIndexView from '@/views/auth/IndexView.vue'
import MemeTypeIndexView from '@/views/meme_type/IndexView.vue'
import MemeTypeCreateView from '@/views/meme_type/CreateView.vue'
import MemeTypeShowView from '@/views/meme_type/ShowView.vue'
import PostIndexView from '@/views/post/IndexView.vue'
import PostCreateView from '@/views/post/CreateView.vue'
import PostShowView from '@/views/post/ShowView.vue'

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
    {
      path: '/post',
      children: [
        {
          path: '',
          name: 'post.index',
          component: PostIndexView,
        },
        {
          path: 'create',
          name: 'post.create',
          component: PostCreateView,
        },
        {
          path: ':postId',
          name: 'post.show',
          component: PostShowView,
        },
      ],
    },
  ],
})

export default router
