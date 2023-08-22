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

</script>

<template>
  <div data-te-ripple-init
       data-te-ripple-color="black"
       @click="onClick"
       :class="props.active ? 'bg-white text-neutral-800' : 'bg-neutral-100 border-b text-neutral-400' "
       class="p-3 space-x-2 flex flex-row items-center justify-center border-l cursor-pointer group-bar-item">
    <div class="flex items-center justify-center">
      <i class="material-icons">{{ props.icon }}</i>
    </div>

    <div class="" v-if="props.name !== 'Home'">
      <h6 :class="props.active ? 'text-neutral-800 dark:text-neutral-50' : 'text-neutral-400 dark:text-neutral-300'"
          class="text-xs font-semibold leading-tight tracking-wide group-hover/bar-item:text-neutral-800 group-hover/bar-item:dark:text-neutral-50">
        {{ props.title }}
      </h6>
    </div>
    <div v-if="props.name !== 'Home'" class="inline-flex items-center justify-center">
      <i class="material-icons md-18 text-neutral-400 !text-base">
        close
      </i>
    </div>
  </div>
</template>

<style scoped>

</style>