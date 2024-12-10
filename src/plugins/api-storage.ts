import axios, { AxiosError } from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from '@/router'

const apiStorage = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_API_STORAGE,
  withCredentials: true,
})

apiStorage.interceptors.request.use((config) => {
  NProgress.start()
  //   if (sessionStorage.getItem('token')) {
  //     config.headers['Authorization'] = `Bearer ${sessionStorage.getItem('token')}`
  //   }

  return config
})

apiStorage.interceptors.response.use(
  (response) => {
    NProgress.done()
    return response
  },
  (error) => {
    const err = error as AxiosError
    NProgress.done()
    if (err.response?.status === 403) {
      router.push({
        name: 'login.index',
      })
    }
    return Promise.reject(error)
  },
)

export default apiStorage
