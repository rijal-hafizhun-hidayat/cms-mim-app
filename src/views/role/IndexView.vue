<script setup lang="ts">
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import PrimaryButton from '@/components/base/PrimaryButton.vue'
import DangerButton from '@/components/base/DangerButton.vue'
import { onMounted, ref, type Ref } from 'vue'
import type { AxiosError, AxiosResponse } from 'axios'
import api from '@/plugins/api'
import { Timestamp } from '@/utils/timestamp'
import { useRouter } from 'vue-router'
import { SweetAlertUtils } from '@/utils/sweetalert'

interface Fetch {
  statusCode: number
  message: string
  data: Role[]
}
interface Role {
  id: number
  name: string
  updated_at: Date
  created_at: Date
}

const roles: Ref<Role[]> = ref([])
const isLoading: Ref<boolean> = ref(false)
const router = useRouter()

onMounted(async () => {
  try {
    isLoading.value = true
    const result: AxiosResponse<Fetch> = await api.get<Fetch>('role')
    roles.value = result.data.data
    console.log(roles.value)
  } catch (error) {
    const err = error as AxiosError
    console.log(err)
  } finally {
    isLoading.value = false
  }
})

const toRoleCreateView = () => {
  router.push({
    name: 'role.create',
  })
}

const toRoleShowView = (roleId: number) => {
  router.push({
    name: 'role.show',
    params: {
      roleId: roleId,
    },
  })
}

const destroyRoleByRoleId = async (roleId: number) => {
  try {
    const result: AxiosResponse<Fetch> = await api.delete<Fetch>(`role/${roleId}`)
    SweetAlertUtils.successAlert(result.data.message)
    roles.value = roles.value.filter((role) => role.id !== roleId)
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
          <h2 class="font-semibold text-xl text-gray-800 leading-tight">Role</h2>
        </div>
        <div>
          <PrimaryButton @click="toRoleCreateView()" type="button">Add Role</PrimaryButton>
        </div>
      </div>
    </template>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white mt-10 px-4 py-6 rounded shadow-md overflow-x-auto">
        <table class="w-full whitespace-nowrap">
          <thead>
            <tr class="text-left font-bold">
              <th class="pb-4 pt-6 px-6">#</th>
              <th class="pb-4 pt-6 px-6">Name</th>
              <th class="pb-4 pt-6 px-6">Created At</th>
              <th class="pb-4 pt-6 px-6">Updated At</th>
              <th class="pb-4 pt-6 px-6">Action</th>
            </tr>
          </thead>
          <tbody v-if="roles.length > 0">
            <tr v-for="(role, index) in roles" :key="role.id" class="hover:bg-gray-100">
              <td class="border-t items-center px-6 py-4">
                {{ index + 1 }}
              </td>
              <td class="border-t items-center px-6 py-4">
                {{ role.name }}
              </td>
              <td class="border-t items-center px-6 py-4">
                {{ Timestamp.formatTimestamp(role.created_at) }}
              </td>
              <td class="border-t items-center px-6 py-4">
                {{ Timestamp.formatTimestamp(role.updated_at) }}
              </td>
              <td class="border-t items-center px-6 py-4 flex justify-start space-x-4">
                <div>
                  <PrimaryButton @click="toRoleShowView(role.id)" type="button">Ubah</PrimaryButton>
                </div>
                <div>
                  <DangerButton @click="destroyRoleByRoleId(role.id)" type="button"
                    >Hapus</DangerButton
                  >
                </div>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr class="hover:bg-gray-100">
              <td class="border-t items-center px-6 py-4 text-center" colspan="5">
                <span v-if="isLoading === true">loading ...</span>
                <span v-else>data not found</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </DashboardLayout>
</template>
