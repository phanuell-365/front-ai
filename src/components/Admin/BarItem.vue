<script setup lang="ts">
import {useRouter} from "vue-router";
import {useTabsStore} from "@/router/admin/tabs.ts";

interface BarItemProps {
  name: string;
  title: string;
  icon: string;
  to: string;
  active: boolean;
}

const props = defineProps<BarItemProps>();

const router = useRouter();

const tabsStore = useTabsStore();

const onClick = () => {
  // navigate to the tab

  setTimeout(() => {
    // activate the tab
    tabsStore.setActiveTab(props.name);

    if (props.name === "Home") {
      router.replace({name: "AdminHome"});
      // router.go(0);
      return;
    }

    router.replace({name: "DynamicPage", params: {page: props.to}});
    // router.go(0);
  }, 300);
};

const onCloseTabClick = (e: Event) => {
  e.stopPropagation();
  tabsStore.closeTab(props.name);

  // get the new active tab
  const newActiveTab = tabsStore.getActiveTab;

  // if the new active tab is the home tab, navigate to the home page
  if (newActiveTab.name === "Home") {
    router.replace({name: "AdminHome"});
    return;
  } else {
    // otherwise, navigate to the new active tab
    router.replace({name: "DynamicPage", params: {page: newActiveTab.to}});
    return;
  }
};

</script>

<template>
  <div
       @click="onClick"
       :class="props.active ? 'bg-white text-neutral-800' : 'bg-neutral-100 border-b text-neutral-400' "
       class="p-3 space-x-2 flex flex-row items-center justify-center border-l cursor-pointer group/bar-item">
    <div class="flex items-center justify-center">
      <svg v-if="props.name === 'Home'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 group-hover/bar-item:text-gray-800">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
      <svg v-else  :class="props.active ? 'text-primary' : 'text-neutral-400 group-hover/bar-item:text-gray-800'"
           xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 transition-all duration-300 ease-in-out">
        <path fill-rule="evenodd" d="M2.25 6a3 3 0 013-3h13.5a3 3 0 013 3v12a3 3 0 01-3 3H5.25a3 3 0 01-3-3V6zm3.97.97a.75.75 0 011.06 0l2.25 2.25a.75.75 0 010 1.06l-2.25 2.25a.75.75 0 01-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 010-1.06zm4.28 4.28a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clip-rule="evenodd" />
      </svg>
    </div>

    <div class="" v-if="props.name !== 'Home'">
      <h6 :class="props.active ? 'text-neutral-800 dark:text-neutral-50' : 'text-neutral-400 dark:text-neutral-300'"
          class="text-xs font-semibold leading-tight tracking-wide group-hover/bar-item:text-neutral-800 group-hover/bar-item:dark:text-neutral-50 transition-all duration-300 ease-in-out">
        {{ props.title }}
      </h6>
    </div>
    <button v-if="props.name !== 'Home'" class="btn btn-ghost btn-xs btn-square z-30" @click.stop="onCloseTabClick">
      <i class="material-icons md-18 text-neutral-400 !text-base">
        close
      </i>
    </button>
  </div>
</template>

<style scoped>

</style>