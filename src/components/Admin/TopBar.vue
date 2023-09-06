<script lang="ts" setup>
import {Tab, useTabsStore} from "@/stores/admin/tabs.ts";
import BarItem from "@/components/Admin/BarItem.vue";
import {onUpdated, ref} from "vue";
import {useAdminHomeStore} from "@/stores/admin/home.ts";

const tabsStore = useTabsStore();
const homeStore = useAdminHomeStore();

const homeTab = ref();
const settingsTab = ref();

const openTabs = ref<Tab[] | null>();

homeTab.value = tabsStore.getTabs.find((tab: Tab) => tab.name === "Home");
settingsTab.value = tabsStore.getTabs.find((tab: Tab) => tab.name === "Settings");


onUpdated(() => {
  homeTab.value = tabsStore.getOpenTabs.find((tab: Tab) => tab.name === "Home");
  settingsTab.value = tabsStore.getOpenTabs.find((tab: Tab) => tab.name === "Settings");
});

const openModal = () => {
  homeStore.openCreateDialog();
}
</script>

<template>
  <div class="z-30 bg-neutral-100 flex flex-row w-full overflow-hidden">
    <div class="border-b p-2"></div>
    <div class="px-3 py-2 flex flex-row items-center justify-start bg-neutral-100 border-y">
      <h6 class="text-base font-semibold">
        M-Zawadi
      </h6>
    </div>
    <!-- Let's have the first default tab -->
    <!--    <BarItem title="Home" icon="home" to="home" name="Home" active/>-->
    <!-- Let's loop through the opened tabs -->
    <BarItem v-if="homeTab" :active="homeTab.active" :icon="homeTab.icon" :name="homeTab.name"
             :page-id="homeTab.pageId"
             :title="homeTab.title" :to="homeTab.to"/>
    <div class="flex flex-row w-8/12 overflow-auto">
      <template v-for="(tab) in tabsStore.getOpenTabs">
        <BarItem v-if="tab.name !== 'Settings' && tab.name !== 'Home'" :key="tab.name" :active="tab.active"
                 :icon="tab.icon" :name="tab.name"
                 :page-id="tab.pageId" :title="tab.title" :to="tab.to"/>
      </template>
    </div>
    <div class="flex flex-row items-center justify-start bg-neutral-100 grow border-y border-l">
      <div class="p-3 flex items-center justify-center">
        <button class="btn btn-xs btn-square btn-ghost" @click="openModal">
          <i class="material-icons text-neutral-400 !text-base">add</i>
        </button>
      </div>
    </div>
    <BarItem :active="settingsTab.active" :icon="settingsTab.icon" :name="settingsTab.name"
             :page-id="settingsTab.pageId"
             :title="settingsTab.title" :to="settingsTab.to"/>
    <div class="border-l border-b p-2"></div>
  </div>
</template>

<style scoped>

</style>