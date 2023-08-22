<script setup lang="ts">
import {useTabsStore} from "@/router/admin/tabs.ts";
import BarItem from "@/components/Admin/BarItem.vue";

const tabsStore = useTabsStore();

</script>

<template>
  <div class="z-30 bg-neutral-100 flex flex-row w-full">
    <div class="px-3 py-2 flex flex-row items-center justify-start bg-neutral-100 border-y">
      Company Name
    </div>
    <!-- Let's have the first default tab -->
<!--    <BarItem title="Home" icon="home" to="home" name="Home" active/>-->
    <!-- Let's loop through the opened tabs -->
    <BarItem v-for="(tab) in tabsStore.getOpenTabs" :key="tab.name" :title="tab.title" :icon="tab.icon" :to="tab.to"
             :active="tab.active" :name="tab.name"/>
    <div class="flex flex-row items-center justify-start bg-neutral-100 grow border-y border-l">
      <div class="p-3 flex items-center justify-center cursor-pointer">
        <i class="material-icons text-neutral-400 !text-base">add</i>
      </div>
    </div>

  </div>
</template>

<style scoped>

</style>