<script lang="ts" setup>
import {useRouter} from "vue-router";
import {useTabsStore} from "@/stores/admin/tabs.ts";

interface PageItem {
  name: string;
  path: string;
  id: string;
}

const props = defineProps<{
  page: PageItem;
}>();

const router = useRouter();

const tabsStore = useTabsStore();

const onClick = () => {
  setTimeout(async () => {
    try {

      // activate the tab
      await tabsStore.updateActiveTab(props.page.name);

      if (props.page.name === "Home") {
        await router.push({name: "AdminHome", params: {page: props.page.path}, query: {pageId: props.page.id}});
        return;
      } else if (props.page.name === "Settings") {
        await router.push({name: "AdminSettingsTab", params: {tab: "general"}, query: {pageId: props.page.id}});
        return;
      }

      await router.push({name: "DynamicPage", params: {page: props.page.path}, query: {pageId: props.page.id}});
    } catch (e) {
      console.error(e);
    }
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

const onDropdownItemClick = (_e: Event, item: { name: string; path: string }) => {
  console.log(item);

  if (item.name === "Edit") {
    handleEditClick();
  } else if (item.name === "Delete") {
    handleDeleteClick();
  }
};

const handleEditClick = () => {
  router.push({name: "DynamicPage", params: {page: props.page.path}, query: {pageId: props.page.id, editPage: 'true'}});
};

const handleDeleteClick = () => {
  console.log('delete');
};

</script>

<template>
  <div
      class="card card-compact shadow rounded-lg overflow-hidden hover:shadow-lg hover:border-2 border-primary transition duration-300 ease-in-out h-48 md:h-52">
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
                @click.stop="onDropdownItemClick($event, item)"
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