<script setup lang="ts">
interface PostTypesWithMemeType {
  created_at: Date
  id: number
  meme_type_id: number
  post_id: number
  updated_at: Date
  meme_type: MemeType
}
interface MemeType {
  id: number
  created_at: Date
  name: string
  background_color: string
  text_color: string
  updated_at: Date
}

defineProps<{
  post_types: PostTypesWithMemeType[]
}>()
</script>
<template>
  <span
    v-for="post_type in post_types"
    :key="post_type.id"
    class="bg-gray-200 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded"
    >{{ post_type.meme_type.name }}</span
  >
</template>
