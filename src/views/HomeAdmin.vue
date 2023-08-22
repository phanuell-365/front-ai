<script setup lang="ts">
import TopBar from "@/components/Admin/TopBar.vue";

</script>

<template>
  <div class="flex flex-col h-screen bg-blue-50">
    <TopBar/>
    <RouterView #default="{ Component, route }">
      <component :is="Component" :key="route.fullPath"/>
    </RouterView>
  </div>
</template>

<style scoped>

</style>