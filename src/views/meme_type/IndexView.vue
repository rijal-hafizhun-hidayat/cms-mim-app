<script setup lang="ts">
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import PrimaryButton from '@/components/base/PrimaryButton.vue'
import DangerButton from '@/components/base/DangerButton.vue'
import TextInput from '@/components/base/TextInput.vue'
import { onMounted, reactive, ref, type Ref } from 'vue'
import type { AxiosError, AxiosResponse } from 'axios'
import api from '@/plugins/api'
import { Timestamp } from '@/utils/timestamp'
import { SweetAlertUtils } from '@/utils/sweetalert'
import { useRouter } from 'vue-router'

interface Fetch {
  statusCode: number
  message: string
  data: MemeTypes[]
}
interface MemeTypes {
  background_color: string
  created_at: Date
  id: number
  name: string
  text_color: string
  updated_at: Date
}
interface Search {
  name: string
}

const router = useRouter()
const isLoading: Ref<boolean> = ref(false)
const memeTypes: Ref<MemeTypes[]> = ref([])
const search: Search = reactive({
  name: '',
})

onMounted(async () => {
  try {
    isLoading.value = true
    const result: AxiosResponse<Fetch> = await api.get<Fetch>('meme_type')
    memeTypes.value = result.data.data as MemeTypes[]
  } catch (error) {
    const err = error as AxiosResponse
    console.log(err)
  } finally {
    isLoading.value = false
  }
})

const destroyMemeTypeByMemeTypeId = async (memeTypeId: number, memeTypeName: string) => {
  const warning = await SweetAlertUtils.showConfirmationDialog(
    `are you sure destroy ${memeTypeName}`,
  )

  if (warning.isConfirmed) {
    try {
      const result: AxiosResponse<Fetch> = await api.delete<Fetch>(`meme_type/${memeTypeId}`)
      memeTypes.value = memeTypes.value.filter((memeType) => memeType.id !== memeTypeId)
      SweetAlertUtils.successAlert(result.data.message)
    } catch (error) {
      const err = error as AxiosError
      console.log(err)
    }
  }
}

const toMemeTypeCreateView = () => {
  return router.push({
    name: 'meme_type.create',
  })
}

const toMemeTypeShowView = (memeTypeId: number) => {
  return router.push({
    name: 'meme_type.show',
    params: {
      memeTypeId: memeTypeId,
    },
  })
}

const searchMemeTypes = async () => {
  try {
    const result: AxiosResponse<Fetch> = await api.get<Fetch>('meme_type', {
      params: {
        name: search.name,
      },
    })
    memeTypes.value = result.data.data as MemeTypes[]
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
          <h2 class="font-semibold text-xl text-gray-800 leading-tight">Meme Type</h2>
        </div>
        <div>
          <PrimaryButton @click="toMemeTypeCreateView()" type="button">Add Meme Type</PrimaryButton>
        </div>
      </div>
    </template>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white mt-10 px-4 py-6 rounded shadow-md overflow-x-auto">
        <form @submit.prevent="searchMemeTypes()" class="grid grid-rows-1 sm:grid-cols-2 gap-3">
          <div>
            <TextInput
              v-model="search.name"
              placeholder="find name meme type"
              class="block w-full"
            />
          </div>
          <div class="my-auto flex justify-end sm:justify-start">
            <PrimaryButton type="submit">search</PrimaryButton>
          </div>
        </form>
      </div>
    </div>

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
          <tbody v-if="memeTypes.length > 0">
            <tr v-for="(memeType, index) in memeTypes" :key="memeType.id" class="hover:bg-gray-100">
              <td class="border-t items-center px-6 py-4">
                {{ index + 1 }}
              </td>
              <td class="border-t items-center px-6 py-4">
                {{ memeType.name }}
              </td>
              <td class="border-t items-center px-6 py-4">
                {{ Timestamp.formatTimestamp(memeType.created_at) }}
              </td>
              <td class="border-t items-center px-6 py-4">
                {{ Timestamp.formatTimestamp(memeType.updated_at) }}
              </td>
              <td class="border-t items-center px-6 py-4 flex justify-start space-x-4">
                <div>
                  <PrimaryButton @click="toMemeTypeShowView(memeType.id)" type="button"
                    >Ubah</PrimaryButton
                  >
                </div>
                <div>
                  <DangerButton
                    @click="destroyMemeTypeByMemeTypeId(memeType.id, memeType.name)"
                    type="button"
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
