<script setup lang="ts">
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import TextInput from '@/components/base/TextInput.vue'
import InputLabel from '@/components/base/InputLabel.vue'
import PrimaryButton from '@/components/base/PrimaryButton.vue'
import FileUpload from '@/components/base/FileUpload.vue'
import Multiselect from 'vue-multiselect'
import { onMounted, reactive, ref, type Ref } from 'vue'
import type { AxiosError, AxiosResponse } from 'axios'
import api from '@/plugins/api'
import { SweetAlertUtils } from '@/utils/sweetalert'
import apiStorage from '@/plugins/api-storage'
import { useRouter } from 'vue-router'

interface Form {
  name: string
  content: string
  meme_types: MemeTypes[]
  file: File | string
}
interface MemeTypes {
  background_color: string
  created_at: Date
  id: number
  name: string
  text_color: string
  updated_at: Date
}
interface FetchMemeTypes {
  statusCode: number
  message: string
  data: MemeTypes[]
}
interface Fetch {
  statusCode: number
  message: string
  data: Post
}
interface Post {
  id: number
  name: string
  content: string
  created_at: Date
  updated_at: Date
}
interface FileUpload {
  file: string | File
  name: string
  size: number
  type: string
  fileExtention: string
  url: string
  isImage: boolean
  isUploaded: boolean
}

const router = useRouter()
const isLoadingMultiSelect: Ref<boolean> = ref(false)
const memeTypes: Ref<MemeTypes[]> = ref([])
const isLoading: Ref<boolean> = ref(false)
const form: Form = reactive({
  name: '',
  content: '',
  meme_types: [],
  file: '',
})

onMounted(async () => {
  try {
    isLoadingMultiSelect.value = true
    const result: AxiosResponse<FetchMemeTypes> = await api.get<FetchMemeTypes>('meme_type')
    memeTypes.value = result.data.data as MemeTypes[]
  } catch (error) {
    const err = error as AxiosError
    console.log(err)
  } finally {
    isLoadingMultiSelect.value = false
  }
})

const getUploadData = (dataFile: FileUpload) => {
  if (dataFile.size > 0) {
    form.file = dataFile.file as File
  } else {
    form.file = ''
  }
}

const send = async () => {
  try {
    const result: AxiosResponse<Fetch> = await api.post<Fetch>('post', {
      name: form.name,
      content: form.content,
      meme_types: form.meme_types,
    })

    if (form.file) {
      const formData = new FormData()
      formData.append('file', form.file)

      await apiStorage.post(`storage/post/${result.data.data.id}/post_file`, formData)
    }
    SweetAlertUtils.successAlert(result.data.message)
    router.push({
      name: 'post.index',
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
          <h2 class="font-semibold text-xl text-gray-800 leading-tight">Add Post</h2>
        </div>
      </div>
    </template>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white mt-10 px-4 py-6 rounded shadow-md overflow-x-auto">
        <form @submit.prevent="send()" class="space-y-4">
          <div>
            <InputLabel>sender</InputLabel>
            <TextInput class="block w-full mt-1" v-model="form.name" />
          </div>
          <div>
            <InputLabel>content</InputLabel>
            <TextInput class="block w-full mt-1" v-model="form.content" />
          </div>
          <div>
            <InputLabel>Meme Types</InputLabel>
            <Multiselect
              :close-on-select="false"
              :clear-on-select="false"
              :disabled="isLoadingMultiSelect"
              class="block mt-1 w-full"
              v-model="form.meme_types"
              tag-placeholder="Add this as new tag"
              placeholder="Search or add a tag"
              label="name"
              track-by="id"
              :options="memeTypes"
              :multiple="true"
              :taggable="true"
            ></Multiselect>
          </div>
          <div>
            <InputLabel>Upload Photo Profile</InputLabel>
            <FileUpload
              :maxSize="2"
              :accept="'png,jpg,jpeg,mkv,mp4'"
              class="block mt-1 w-full"
              @file-upload="getUploadData"
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
