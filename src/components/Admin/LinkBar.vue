<script setup lang="ts">
interface LinkBar {
  name: string;
  url: string;
}

const props = defineProps<LinkBar>();
</script>

<template>
  <div class="z-30 px-3 py-4 bg-white flex flex-row w-full !space-x-4 border-b">
    <div class="flex flex-row">
      <h6 class="text-base font-semibold">
        {{ props.name }}
      </h6>

      <div class="text-sm text-neutral-400 ml-2 flex flex-row items-center justify-center">
        <i class="material-icons !text-sm transition transform rotate-[135deg]">link</i>

        <a :href="props.url" target="_blank"
           class="text-xs text-neutral-400 ml-2 hover:text-neutral-600 hover:underline">
          {{ props.url }}
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>