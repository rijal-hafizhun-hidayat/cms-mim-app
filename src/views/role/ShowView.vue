<script setup lang="ts">
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import TextInput from '@/components/base/TextInput.vue'
import InputLabel from '@/components/base/InputLabel.vue'
import PrimaryButton from '@/components/base/PrimaryButton.vue'
import { onMounted, reactive } from 'vue'
import type { AxiosError, AxiosResponse } from 'axios'
import api from '@/plugins/api'
import { SweetAlertUtils } from '@/utils/sweetalert'
import { useRoute, useRouter } from 'vue-router'

interface Form {
  name: string
}
interface Fetch {
  statusCode: number
  message: string
  data: Role
}
interface Role {
  created_at: Date
  id: number
  name: string
  updated_at: Date
}

const router = useRouter()
const route = useRoute()
const form: Form = reactive({
  name: '',
})

onMounted(async () => {
  try {
    const result: AxiosResponse<Fetch> = await api.get<Fetch>(`role/${route.params.roleId}`)
    form.name = result.data.data.name
  } catch (error) {
    const err = error as AxiosError
    console.log(err)
  }
})

const send = async () => {
  try {
    const result: AxiosResponse<Fetch> = await api.put<Fetch>(`role/${route.params.roleId}`, {
      name: form.name,
    })

    SweetAlertUtils.successAlert(result.data.message)
    router.push({
      name: 'role.index',
    })
  } catch (error) {
    const err = error as AxiosError
    console.log(err)
  }
}
</script>
<template>
  <DashboardLayout>
    <template #header>
      <div class="flex justify-between">
        <div>
          <h2 class="font-semibold text-xl text-gray-800 leading-tight">Add Role</h2>
        </div>
      </div>
    </template>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white mt-10 px-4 py-6 rounded shadow-md overflow-x-auto">
        <form @submit.prevent="send()" class="space-y-4">
          <div>
            <InputLabel>name</InputLabel>
            <TextInput class="block w-full mt-1" v-model="form.name" />
          </div>
          <div>
            <PrimaryButton type="submit">submit</PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  </DashboardLayout>
</template>
