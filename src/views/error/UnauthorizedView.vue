<script setup lang="ts">
import DashboardLayout from '@/layouts/DashboardLayout.vue'
</script>
<template>
  <DashboardLayout>
    <template #header>
      <div class="flex justify-between">
        <div>
          <h2 class="font-semibold text-xl text-gray-800 leading-tight">Un Authorized</h2>
        </div>
      </div>
    </template>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white mt-10 px-4 py-6 rounded shadow-md overflow-x-auto">
        <p>you are not authorized access this page, please logout first and then login</p>
      </div>
    </div>
  </DashboardLayout>
</template>
