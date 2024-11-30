import api from '@/plugins/api'
import type { AxiosResponse } from 'axios'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

interface FormLogin {
  email: string
  password: string
}
interface Auth {
  id: number
  name: string
  email: string
  role: string
}
interface LoginResponse {
  data: Token
}
interface Token {
  token: string
}

export const useAuthStore = defineStore('auth', () => {
  const auth: Ref<Auth | null> = ref(null)

  async function login(form: FormLogin) {
    const result: AxiosResponse<LoginResponse> = await api.post<LoginResponse>('login', {
      email: form.email,
      password: form.password,
    })

    sessionStorage.setItem('token', result.data.data.token)
  }

  function logout() {
    sessionStorage.clear()
    auth.value = null
  }

  return {
    auth,
    login,
    logout,
  }
})
