<script lang="ts" setup>
import {RouterView} from "vue-router";
</script>

<template>
  <RouterView #default="{ Component, route }">
    <Suspense>
      <template #default>
        <component :is="Component" :key="route.fullPath"/>
      </template>
      <template #fallback>
        <div class="flex flex-col items-center justify-center h-screen">
          <div class="flex flex-col items-center justify-center mx-auto space-y-2">
            <div class="w-16 h-16 rounded-full bg-primary-100 animate-pulse"/>
            <div class="w-16 h-4 rounded-full bg-primary-100 animate-pulse"/>
            <p class="text-sm text-neutral-500 dark:text-neutral-400">
              Loading...
            </p>
          </div>
        </div>
      </template>
    </Suspense>
  </RouterView>
</template>

<style scoped></style>
