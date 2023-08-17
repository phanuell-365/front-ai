<script setup lang="ts">
import {useTabsStore} from "@/router/admin/tabs.ts";
import {onMounted} from "vue";

const props = defineProps<{
  page: string
}>();


const tabsStore = useTabsStore();

onMounted(() => {
  tabsStore.setActiveTabByPageName(props.page);
});
</script>

<template>
  <h1 class="text-3xl">
    This is the {{ props.page }} page
  </h1>
</template>

<style scoped>

</style>