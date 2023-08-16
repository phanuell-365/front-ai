<script setup lang="ts">
import {
  Ripple,
  initTE,
} from "tw-elements";
import {onMounted} from "vue";
import {useAdminHomeStore} from "@/router/admin/home.ts";
import PageItem from "@/components/Admin/PageItem.vue";

onMounted(() => {
  initTE({Ripple});
});

const adminHome = useAdminHomeStore();


</script>

<template>
  <section class="px-5 md:px-8">
    <header class="py-3 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700">
      <div class="flex items-center space-x-2">
        <span class="material-icons-round">home</span>
        <h4 class="text-lg font-semibold">
          Home
        </h4>
      </div>

      <button
          type="button"
          class="inline-flex items-center justify-between space-x-3 rounded border-2 border-primary px-3 py-1.5 text-xs font-medium leading-normal text-primary transition duration-150 ease-in-out hover:border-primary-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-primary-600 focus:border-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:border-primary-700 active:text-primary-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
          data-te-ripple-init>
        <span class="material-icons-round text-5xl">add</span> Create Page
      </button>
    </header>
    <section class="mt-5 space-y-4">
      <div aria-labelledby="pages" class="my-3 bg-neutral-100 rounded-xl py-5 px-6">
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