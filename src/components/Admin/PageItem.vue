<script setup lang="ts">
import {
  Dropdown,
  Ripple,
  initTE,
} from "tw-elements";
import {onMounted} from "vue";
import {useRouter} from "vue-router";
import {useTabsStore} from "@/router/admin/tabs.ts";

interface PageItem {
  name: string;
  path: string;
}

onMounted(() => {
  initTE({Dropdown, Ripple});
});

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
      class="overflow-hidden flex flex-col rounded-lg bg-white border shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 h-48 md:h-52">
    <div data-te-ripple-init
         data-te-ripple-color="#38bdf8"
         data-te-ripple-unbound="true"
         @click="onClick"
         class="h-40 flex items-center justify-center bg-sky-100">
      <img
          class="rounded-t-lg w-14 md:w-20 drop-shadow-lg"
          src="@/assets/imgs/template.png"
          alt="template-image"/>
    </div>
    <div class="relative px-2 md:px-4 py-2 flex items-center justify-between w-full" data-te-dropdown-position="dropup">
      <h6
          class="text-xs font-semibold leading-tight tracking-wide text-neutral-800 dark:text-neutral-50">
        {{ props.page.name }}
      </h6>
      <span
          data-te-dropdown-toggle-ref
          aria-expanded="false"
          data-te-ripple-init
          data-te-ripple-unbound="true"
          class="material-icons-round text-neutral-500 dark:text-neutral-300 text-xs p-2 rounded-full">
          more_vert
      </span>
      <ul
          class="absolute z-[50] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg dark:bg-neutral-700 [&[data-te-dropdown-show]]:block"
          aria-labelledby="dropdownMenuButton1e"
          data-te-dropdown-menu-ref>
        <li v-for="(item) in dropdownItems" :key="item.name">
          <a
              class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-xs font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-600"
              href="#"
              data-te-dropdown-item-ref
          >
            {{ item.name }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>

</style>