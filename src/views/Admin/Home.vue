<script setup lang="ts">
import {onMounted} from "vue";
import {useAdminHomeStore} from "@/router/admin/home.ts";
import PageItem from "@/components/Admin/PageItem.vue";
import {useTabsStore} from "@/router/admin/tabs.ts";

onMounted(() => {
  tabsStore.setActiveTabByPageName('home');
});

const tabsStore = useTabsStore();
const adminHome = useAdminHomeStore();


</script>

<template>
  <section class="px-5 md:px-8 bg-white flex-1 overflow-hidden">
    <header class="py-3 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700">
      <div class="flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
        <h4 class="text-lg font-semibold">
          Home
        </h4>
      </div>

      <button
          type="button"
          class="btn btn-sm md:btn-md normal-case text-xs md:text-sm btn-primary btn-outline"
          >
        <span class="material-icons-round text-5xl">add</span> Create Page
      </button>
    </header>
    <section class="mt-5 space-y-4">
      <div aria-labelledby="pages" class="my-3 bg-stone-50 rounded-xl py-5 px-6">
        <h1 id="pages" class="text-2xl font-extrabold text-neutral-800 dark:text-neutral-300">
          Pages
        </h1>

        <div
            v-if="!adminHome.pages.length"
            class="my-4 bg-neutral-200 rounded-xl p-4 flex items-center justify-center">
          <p class="text-neutral-500 dark:text-neutral-300 text-xs flex items-center justify-center">
            <span class="material-icons-round mr-2">description</span>
            Created pages will appear here
          </p>
        </div>
        <ul v-else class="my-4 p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <PageItem v-for="(page) in adminHome.pages" :key="page.id" :page="page"/>
        </ul>

      </div>
    </section>
  </section>
</template>

<style scoped>

</style>