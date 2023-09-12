<script lang="ts" setup>

</script>

<template>
  <div class="flex flex-col h-screen bg-requested-color relative">
    <RouterView #default="{ Component, route }">
      <component :is="Component" :key="route.fullPath"/>
    </RouterView>
  </div>
  <Teleport to="body"></Teleport>
</template>

<style scoped>

</style>
