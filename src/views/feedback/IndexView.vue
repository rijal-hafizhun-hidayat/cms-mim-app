<script setup lang="ts">
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import TextInput from '@/components/base/TextInput.vue'
import PrimaryButton from '@/components/base/PrimaryButton.vue'
import api from '@/plugins/api'
import { Timestamp } from '@/utils/timestamp'
import type { AxiosError, AxiosResponse } from 'axios'
import { onMounted, reactive, ref, type Ref } from 'vue'

interface Fetch {
  statusCode: number
  message: string
  data: Feedback[]
}
interface Feedback {
  id: number
  feedback: string
  created_at: Date
  updated_at: Date
}
interface Search {
  feedback: string
}

const feedbacks: Ref<Feedback[]> = ref([])
const isLoading: Ref<boolean> = ref(false)
const search: Search = reactive({
  feedback: '',
})

onMounted(async () => {
  try {
    isLoading.value = true
    const result: AxiosResponse<Fetch> = await api.get<Fetch>('feedback')
    feedbacks.value = result.data.data
  } catch (error) {
    const err = error as AxiosError
    console.log(err)
  } finally {
    isLoading.value = false
  }
})

const searchFeedback = async () => {
  try {
    isLoading.value = true
    const result: AxiosResponse<Fetch> = await api.get<Fetch>('feedback', {
      params: {
        feedback: search.feedback,
      },
    })

    feedbacks.value = result.data.data
  } catch (error) {
    const err = error as AxiosError
    console.log(err)
  } finally {
    isLoading.value = false
  }
}
</script>
<template>
  <DashboardLayout>
    <template #header>
      <div class="flex justify-between">
        <div>
          <h2 class="font-semibold text-xl text-gray-800 leading-tight">Feedback</h2>
        </div>
      </div>
    </template>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white mt-10 px-4 py-6 rounded shadow-md overflow-x-auto">
        <form @submit.prevent="searchFeedback()" class="grid grid-rows-1 sm:grid-cols-2 gap-3">
          <div>
            <TextInput v-model="search.feedback" placeholder="find feedback" class="block w-full" />
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
              <th class="pb-4 pt-6 px-6">Feedback</th>
              <th class="pb-4 pt-6 px-6">Created At</th>
              <th class="pb-4 pt-6 px-6">Updated At</th>
            </tr>
          </thead>
          <tbody v-if="feedbacks.length > 0">
            <tr v-for="(feedback, index) in feedbacks" :key="feedback.id" class="hover:bg-gray-100">
              <td class="border-t items-center px-6 py-4">
                {{ index + 1 }}
              </td>
              <td class="border-t items-center px-6 py-4">
                {{ feedback.feedback }}
              </td>
              <td class="border-t items-center px-6 py-4">
                {{ Timestamp.formatTimestamp(feedback.created_at) }}
              </td>
              <td class="border-t items-center px-6 py-4">
                {{ Timestamp.formatTimestamp(feedback.updated_at) }}
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
