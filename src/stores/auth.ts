import api from '@/plugins/api'
import type { AxiosError, AxiosResponse } from 'axios'
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
  role: Role
}
interface Role {
  id: number
  name: string
  created_at: Date
  updated_at: Date
}
interface Fetch {
  statusCode: number
  message: string
  data: Token | Auth
}
interface Token {
  token: string
}

export const useAuthStore = defineStore('auth', () => {
  const auth: Ref<Auth | null> = ref(null)
  const token: Ref<string | null> = ref(null)

  async function login(form: FormLogin) {
    const result: AxiosResponse<Fetch> = await api.post<Fetch>('login', {
      email: form.email,
      password: form.password,
    })

    const data = result.data.data as Token
    token.value = data.token
    sessionStorage.setItem('token', data.token)
  }

  async function currentUser() {
    try {
      const result: AxiosResponse<Fetch> = await api.get<Fetch>('current_user')
      auth.value = result.data.data as Auth
    } catch (error) {
      const err = error as AxiosError
      console.log(err)
    }
  }

  function logout() {
    sessionStorage.clear()
    auth.value = null
    token.value = null
  }

  async function hasRoleAdmin(roles: string[]) {
    if (auth.value === null) {
      await currentUser()
    }

    return roles.includes(auth.value!.role.name)
  }

  return {
    auth,
    login,
    logout,
    currentUser,
    hasRoleAdmin,
  }
})
