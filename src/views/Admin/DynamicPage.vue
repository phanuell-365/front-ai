<script setup lang="ts">
const props = defineProps<{
  page: string
}>();

</script>

<template>
  <h1 class="bg-red-50 text-3xl">
    This is the {{ props.page }} page
  </h1>
</template>

<style scoped>

</style>