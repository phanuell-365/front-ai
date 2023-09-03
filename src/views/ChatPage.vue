<script lang="ts" setup>

</script>

<template>
  <div class="flex flex-col h-screen bg-requested-color relative">
    <RouterView #default="{ Component, route }">
      <Suspense>
        <component :is="Component" :key="route.fullPath"/>
      </Suspense>
    </RouterView>
  </div>
</template>

<style scoped>

</style>
