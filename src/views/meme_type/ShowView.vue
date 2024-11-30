<script setup lang="ts">
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import TextInput from '@/components/base/TextInput.vue'
import InputLabel from '@/components/base/InputLabel.vue'
import InputError from '@/components/base/InputError.vue'
import PrimaryButton from '@/components/base/PrimaryButton.vue'
import { onMounted, reactive, ref, type Ref } from 'vue'
import type { AxiosError, AxiosResponse } from 'axios'
import api from '@/plugins/api'
import { SweetAlertUtils } from '@/utils/sweetalert'
import { useRoute, useRouter } from 'vue-router'

interface Form {
  name: string
  background_color: string
  text_color: string
}
interface Fetch {
  statusCode: number
  message: string
  data: MemeType
}
interface MemeType {
  background_color: string
  created_at: Date
  id: number
  name: string
  text_color: string
  updated_at: Date
}
interface Validation {
  statusCode: number
  errors: Record<string, string[]>
}

const router = useRouter()
const route = useRoute()
const validation: Ref<Validation | null> = ref(null)
const isLoading: Ref<boolean> = ref(false)
const form: Form = reactive({
  name: '',
  background_color: '',
  text_color: '',
})

onMounted(async () => {
  try {
    const result: AxiosResponse<Fetch> = await api.get<Fetch>(
      `meme_type/${route.params.memeTypeId}`,
    )

    form.name = result.data.data.name
    form.background_color = result.data.data.background_color
    form.text_color = result.data.data.text_color
  } catch (error) {
    const err = error as AxiosError
    console.log(err)
  }
})

const send = async () => {
  try {
    isLoading.value = true
    const result: AxiosResponse<Fetch> = await api.put<Fetch>(
      `meme_type/${route.params.memeTypeId}`,
      {
        name: form.name,
        background_color: form.background_color,
        text_color: form.text_color,
      },
    )
    SweetAlertUtils.successAlert(result.data.message)
    router.push({
      name: 'meme_type.index',
    })
  } catch (error) {
    const err = error as AxiosError
    //console.log(err)
    if (err.response?.status === 400) {
      validation.value = err.response.data as Validation
    } else {
      console.log(err)
    }
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
          <h2 class="font-semibold text-xl text-gray-800 leading-tight">Add Meme Type</h2>
        </div>
      </div>
    </template>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white mt-10 px-4 py-6 rounded shadow-md overflow-x-auto">
        <form @submit.prevent="send()" class="space-y-4">
          <div>
            <InputLabel>name</InputLabel>
            <TextInput class="block w-full mt-1" v-model="form.name" />
            <InputError
              v-if="validation && validation.statusCode === 400 && validation.errors.name"
              :message="validation.errors.name[0]"
            />
          </div>
          <div>
            <InputLabel>background color</InputLabel>
            <TextInput class="block w-full mt-1" v-model="form.background_color" />
            <InputError
              v-if="
                validation && validation.statusCode === 400 && validation.errors.background_color
              "
              :message="validation.errors.background_color[0]"
            />
          </div>
          <div>
            <InputLabel>text color</InputLabel>
            <TextInput class="block w-full mt-1" v-model="form.text_color" />
            <InputError
              v-if="validation && validation.statusCode === 400 && validation.errors.text_color"
              :message="validation.errors.text_color[0]"
            />
          </div>
          <div>
            <PrimaryButton :disabled="isLoading" type="submit">submit</PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  </DashboardLayout>
</template>
