import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import AuthIndexView from '@/views/auth/IndexView.vue'
import MemeTypeIndexView from '@/views/meme_type/IndexView.vue'
import MemeTypeCreateView from '@/views/meme_type/CreateView.vue'
import MemeTypeShowView from '@/views/meme_type/ShowView.vue'
import PostIndexView from '@/views/post/IndexView.vue'
import PostCreateView from '@/views/post/CreateView.vue'
import PostShowView from '@/views/post/ShowView.vue'
import ErrorUnauthorizedView from '@/views/error/UnauthorizedView.vue'
import { useAuthStore } from '@/stores/auth'
import { SweetAlertUtils } from '@/utils/sweetalert'

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
      meta: {
        requiresAuth: true,
        requiresRoles: ['admin'],
      },
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
      meta: {
        requiresAuth: true,
        requiresRoles: ['admin'],
      },
    },
    {
      path: '/unauthorized',
      name: 'error.unauthorized',
      component: ErrorUnauthorizedView,
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const useAuth = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresRoles = to.meta.requiresRoles as string[] | undefined

  if (requiresAuth && !sessionStorage.getItem('token')) {
    useAuth.logout()
    SweetAlertUtils.errorAlert('unauthorized')
    next('/')
  } else if (requiresRoles && !(await useAuth.hasRoleAdmin(requiresRoles))) {
    next('/unauthorized')
  } else {
    next()
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
