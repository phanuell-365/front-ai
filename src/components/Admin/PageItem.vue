<script lang="ts" setup>
import {useRouter} from "vue-router";
import {useTabsStore} from "@/stores/admin/tabs.ts";

interface PageItem {
  name: string;
  path: string;
}

const props = defineProps<{
  page: PageItem;
}>();

const router = useRouter();

const tabsStore = useTabsStore();

const onClick = () => {
  setTimeout(() => {
    // activate the tab
    tabsStore.setActiveTab(props.page.name);

    if (props.page.name === "Home") {
      router.push({name: "AdminHome"});
      return;
    } else if (props.page.name === "Settings") {
      router.push({name: "AdminSettingsTab", params: {tab: "general"}});
      return;
    }

    router.push({name: "DynamicPage", params: {page: props.page.path}});
  }, 300);
};

const dropdownItems = [
  {
    name: "Edit",
    path: "#",
  },
  {
    name: "Delete",
    path: "#",
  },
];

</script>

<template>
  <div
      class="card card-compact shadow-lg rounded-lg overflow-hidden hover:shadow-2xl hover:border hover:border-1 transition duration-300 ease-in-out h-48 md:h-52">
    <div
        class="flex items-center justify-center bg-sky-100 h-40"
        @click="onClick">
      <img
          alt="template-image"
          class="rounded-t-lg w-20 drop-shadow-lg"
          src="@/assets/imgs/template.png"/>
    </div>
    <div class="py-3 px-4 flex flex-row w-full justify-between items-center">
      <h6
          class="text-xs font-semibold leading-tight tracking-wide text-neutral-800 dark:text-neutral-50">
        {{ props.page.name }}
      </h6>
      <div class="dropdown dropdown-top dropdown-end">
        <label class="btn btn-circle btn-xs btn-ghost m-1" tabindex="0">
        <span
            aria-expanded="false"
            class="material-icons-round text-gray-400">
            more_vert
        </span>
        </label>
        <ul class="z-30 shadow menu dropdown-content bg-base-100 rounded-box w-24" tabindex="0">
          <li v-for="(item) in dropdownItems" :key="item.name">
            <a
                class="menu-item text-xs"
                href="#"
            >
              {{ item.name }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>