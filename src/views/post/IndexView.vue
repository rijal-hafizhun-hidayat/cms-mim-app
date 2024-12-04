<script setup lang="ts">
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import PrimaryButton from '@/components/base/PrimaryButton.vue'
import BadgePost from '@/components/post/BadgePost.vue'
import DangerButton from '@/components/base/DangerButton.vue'
import TextInput from '@/components/base/TextInput.vue'
import CursorPagination from '@/components/post/CursorPagination.vue'
import Multiselect from 'vue-multiselect'
import { onMounted, reactive, ref, type Ref } from 'vue'
import type { AxiosError, AxiosResponse } from 'axios'
import api from '@/plugins/api'
import { Timestamp } from '@/utils/timestamp'
import { useRouter } from 'vue-router'
import { SweetAlertUtils } from '@/utils/sweetalert'

interface Fetch {
  statusCode: number
  message: string
  data: PostWithPostTypesAndPostFile[] | Post | MemeType[]
}
interface Post {
  content: string
  created_at: Date
  id: number
  name: string
  updated_at: Date
}
interface PostWithPostTypesAndPostFile {
  content: string
  created_at: Date
  id: number
  name: string
  updated_at: Date
  post_file: PostFile
  post_types: PostTypes[]
}
interface PostFile {
  id: number
  created_at: Date
  path: string
  post_id: number
  type_file: string
  updated_at: Date
}
interface PostTypes {
  created_at: Date
  id: number
  meme_type_id: number
  post_id: number
  updated_at: Date
  meme_type: MemeType
}
interface MemeType {
  background_color: string
  created_at: Date
  id: number
  name: string
  text_color: string
  updated_at: Date
}
interface FormSearchPost {
  search: string
  meme_types: MemeType[]
}

const router = useRouter()
const posts: Ref<PostWithPostTypesAndPostFile[]> = ref([])
const cursorPagination: Ref<number> = ref(0)
const memeTypes: Ref<MemeType[]> = ref([])
const isLoading: Ref<boolean> = ref(false)
const isLoadingMultiSelect: Ref<boolean> = ref(false)
const formSearchPost: FormSearchPost = reactive({
  search: '',
  meme_types: [],
})

onMounted(async () => {
  try {
    isLoading.value = true
    isLoadingMultiSelect.value = true
    cursorPagination.value = 5
    const result: AxiosResponse<Fetch> = await api.get<Fetch>('post', {
      params: {
        cursor: cursorPagination.value,
      },
    })
    const resultMemeTypes: AxiosResponse<Fetch> = await api.get<Fetch>('meme_type')
    posts.value = result.data.data as PostWithPostTypesAndPostFile[]
    memeTypes.value = resultMemeTypes.data.data as MemeType[]
    console.log(posts.value)
    console.log(memeTypes.value)
  } catch (error) {
    const err = error as AxiosError
    console.log(err)
  } finally {
    isLoading.value = false
    isLoadingMultiSelect.value = false
  }
})

const toPostCreate = () => {
  router.push({
    name: 'post.create',
  })
}

const destroyPostByPostId = async (postId: number) => {
  try {
    const result: AxiosResponse<Fetch> = await api.delete<Fetch>(`post/${postId}`)
    SweetAlertUtils.successAlert(result.data.message)
    posts.value = posts.value.filter((post) => post.id !== postId)
  } catch (error) {
    const err = error as AxiosError
    console.log(err)
  }
}

const toPostShow = (postId: number) => {
  router.push({
    name: 'post.show',
    params: {
      postId: postId,
    },
  })
}

const searchPost = async () => {
  try {
    cursorPagination.value = 5
    const result: AxiosResponse<Fetch> = await api.get<Fetch>('post', {
      params: {
        search: formSearchPost.search,
        meme_types: formSearchPost.meme_types as MemeType[],
        cursor: cursorPagination.value,
      },
    })

    console.log(result)
    posts.value = result.data.data as PostWithPostTypesAndPostFile[]
  } catch (error) {
    const err = error as AxiosError
    console.log(err)
  }
}

const morePost = async () => {
  try {
    const result: AxiosResponse<Fetch> = await api.get<Fetch>('post', {
      params: {
        search: formSearchPost.search,
        meme_types: formSearchPost.meme_types as MemeType[],
        cursor: (cursorPagination.value += 5),
      },
    })

    console.log(result)
    posts.value = result.data.data as PostWithPostTypesAndPostFile[]
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
          <h2 class="font-semibold text-xl text-gray-800 leading-tight">Post</h2>
        </div>
        <div>
          <PrimaryButton @click="toPostCreate()" type="button">Add Post</PrimaryButton>
        </div>
      </div>
    </template>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white mt-10 px-4 py-6 rounded shadow-md">
        <form @submit.prevent="searchPost()" class="grid grid-rows-1 sm:grid-cols-3 gap-3">
          <div>
            <TextInput v-model="formSearchPost.search" class="block w-full" />
          </div>
          <div>
            <Multiselect
              :close-on-select="false"
              :clear-on-select="false"
              :disabled="isLoadingMultiSelect"
              class="block w-full"
              v-model="formSearchPost.meme_types"
              tag-placeholder="Add this as new tag"
              placeholder="Search or add a tag"
              label="name"
              track-by="id"
              :options="memeTypes"
              :multiple="true"
              :taggable="true"
            ></Multiselect>
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
              <th class="pb-4 pt-6 px-6">Sender</th>
              <th class="pb-4 pt-6 px-6">Content</th>
              <th class="pb-4 pt-6 px-6">Meme Type</th>
              <th class="pb-4 pt-6 px-6">Created At</th>
              <th class="pb-4 pt-6 px-6">Updated At</th>
              <th class="pb-4 pt-6 px-6">Action</th>
            </tr>
          </thead>
          <tbody v-if="posts.length > 0">
            <tr v-for="(post, index) in posts" :key="post.id" class="hover:bg-gray-100">
              <td class="border-t items-center px-6 py-4">
                {{ index + 1 }}
              </td>
              <td class="border-t items-center px-6 py-4">
                {{ post.name }}
              </td>
              <td class="border-t items-center px-6 py-4">
                {{ post.content }}
              </td>
              <td class="border-t items-center px-6 py-4">
                <BadgePost :post_types="post.post_types" />
              </td>
              <td class="border-t items-center px-6 py-4">
                {{ Timestamp.formatTimestamp(post.created_at) }}
              </td>
              <td class="border-t items-center px-6 py-4">
                {{ Timestamp.formatTimestamp(post.updated_at) }}
              </td>
              <td class="border-t items-center px-6 py-4 flex justify-start space-x-4">
                <div>
                  <PrimaryButton @click="toPostShow(post.id)" type="button">Ubah</PrimaryButton>
                </div>
                <div>
                  <DangerButton @click="destroyPostByPostId(post.id)" type="button"
                    >Hapus</DangerButton
                  >
                </div>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr class="hover:bg-gray-100">
              <td class="border-t items-center px-6 py-4 text-center" colspan="7">
                <span v-if="isLoading === true">loading ...</span>
                <span v-else>data not found</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <CursorPagination @click="morePost()" />
  </DashboardLayout>
</template>
