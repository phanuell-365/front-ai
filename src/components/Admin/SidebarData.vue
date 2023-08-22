<script setup lang="ts">
import {
  Tab,
  Input,
  Select,
  Ripple,
  Sidenav,
  initTE,
} from "tw-elements";
import {onMounted, onUnmounted, reactive, ref, watch} from "vue";
import {usePageDataStore} from "@/router/admin/page-data.ts";

interface PageData {
  chatbotName: string;
  chatbotId: string;
  greetingType: 'static' | 'generated';
  staticGreeting: string;
  generatedGreeting: string;
  promptPlaceholder: string;
  directive: string;
  model: string;
  maxResponseLength: number;
  creativity: number;
  displayClosureMessage: boolean;
}

interface SidebarDataProps {
  pageData: PageData;
}

const props = defineProps<SidebarDataProps>();

const pageDataStore = usePageDataStore();

const activePageDataItem = ref(props.pageData);

const thisPageDataItem = reactive<PageData>({
  chatbotName: activePageDataItem.value.chatbotName,
  chatbotId: activePageDataItem.value.chatbotId,
  greetingType: activePageDataItem.value.greetingType,
  staticGreeting: activePageDataItem.value.staticGreeting,
  generatedGreeting: activePageDataItem.value.generatedGreeting,
  promptPlaceholder: activePageDataItem.value.promptPlaceholder,
  directive: activePageDataItem.value.directive,
  model: activePageDataItem.value.model,
  maxResponseLength: activePageDataItem.value.maxResponseLength,
  creativity: activePageDataItem.value.creativity,
  displayClosureMessage: activePageDataItem.value.displayClosureMessage,
});

const newGreetingTextAreaText = ref("");

// let's also subscribe to page data store changes
watch(() => pageDataStore.activePageDataItem, (newVal) => {
  activePageDataItem.value = newVal;

  thisPageDataItem.chatbotName = activePageDataItem.value.chatbotName;
  thisPageDataItem.chatbotId = activePageDataItem.value.chatbotId;
  thisPageDataItem.greetingType = activePageDataItem.value.greetingType;
  console.log(activePageDataItem.value.greetingType)
  thisPageDataItem.staticGreeting = activePageDataItem.value.staticGreeting;
  thisPageDataItem.generatedGreeting = activePageDataItem.value.generatedGreeting;
  thisPageDataItem.promptPlaceholder = activePageDataItem.value.promptPlaceholder;
  thisPageDataItem.directive = activePageDataItem.value.directive;
  thisPageDataItem.model = activePageDataItem.value.model;
  thisPageDataItem.maxResponseLength = activePageDataItem.value.maxResponseLength;
  thisPageDataItem.creativity = activePageDataItem.value.creativity;
  thisPageDataItem.displayClosureMessage = activePageDataItem.value.displayClosureMessage;

  if (activePageDataItem.value.greetingType === 'static') {
    newGreetingTextAreaText.value = activePageDataItem.value.staticGreeting;
  } else {
    const newName = activePageDataItem.value.chatbotName[0].toUpperCase() + activePageDataItem.value.chatbotName.slice(1);
    newGreetingTextAreaText.value = `Say I am ${newName}, how can I help you today?`;
  }
});

const isInitialized = ref(false);

onMounted(() => {
  initTE({Sidenav, Tab, Input, Select, Ripple}, true);

  isInitialized.value = true;
});

const onGreetingSelectChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value;

  if (value === 'static') {
    newGreetingTextAreaText.value = activePageDataItem.value.staticGreeting;
  }

  if (value === 'generated') {
    const newName = activePageDataItem.value.chatbotName[0].toUpperCase() + activePageDataItem.value.chatbotName.slice(1);
    newGreetingTextAreaText.value = `Say I am ${newName}, how can I help you today?`;
  }
};
</script>

<template>
  <!-- Sidenav -->
  <nav
      id="sidebar-data"
      class="absolute right-0 top-0 z-[1035] h-full !w-4/12 translate-x-full overflow-hidden bg-white shadow-[0_4px_12px_0_rgba(0,0,0,0.07),_0_2px_4px_rgba(0,0,0,0.05)] data-[te-sidenav-hidden='false']:-translate-x-0 dark:bg-zinc-800"
      data-te-sidenav-init
      data-te-sidenav-position="absolute"
      data-te-sidenav-hidden="true"
      data-te-sidenav-right="true">
    <div class="flex flex-col">

      <!--Tabs navigation-->
      <ul
          class="flex list-none flex-row flex-wrap border-b-0 pl-0"
          role="tablist"
          data-te-nav-ref>
        <li role="presentation" class="flex-grow basis-0 text-center">
          <a
              href="#tabs-home02"
              class="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs md:text-sm font-bold leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
              data-te-toggle="pill"
              data-te-target="#tabs-home02"
              data-te-nav-active
              role="tab"
              aria-controls="tabs-home02"
              aria-selected="true"
          >Content</a
          >
        </li>
        <li role="presentation" class="flex-grow basis-0 text-center">
          <a
              href="#tabs-profile02"
              class="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs md:text-sm font-bold leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
              data-te-toggle="pill"
              data-te-target="#tabs-profile02"
              role="tab"
              aria-controls="tabs-profile02"
              aria-selected="false"
          >Data</a
          >
        </li>
      </ul>

      <!--Tabs content-->
      <div class="overflow-auto flex-1">
        <div
            class="hidden opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block h-screen"
            id="tabs-home02"
            role="tabpanel"
            aria-labelledby="tabs-home-tab02"
            data-te-tab-active>
          <div class="grid grid-cols-1 gap-4 p-5">
            <div>
              <div class="relative mb-3" data-te-input-wrapper-init>
                <input
                    v-model="thisPageDataItem.chatbotName"
                    type="text"
                    class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                    id="chatbot-name"
                    placeholder="Chatbot name"/>
                <label
                    for="chatbot-name"
                    class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[1.15rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                >
                  Chatbot name
                </label>
              </div>
            </div>
            <div>
              <select @change="onGreetingSelectChange" class="w-full"
                      data-te-select-init data-te-select-size="lg" v-model="thisPageDataItem.greetingType">
                <option value="generated">
                  Generated
                </option>
                <option value="static">
                  Static
                </option>
              </select>
              <label data-te-select-label-ref>
                Greeting
              </label>
            </div>
            <div class="relative mb-3" data-te-input-wrapper-init>
              <textarea
                  class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                  id="exampleFormControlTextarea1"
                  rows="3"
                  v-model="newGreetingTextAreaText"
                  placeholder="Your message"></textarea>
            </div>
          </div>
        </div>
        <div
            class="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
            id="tabs-profile02"
            role="tabpanel"
            aria-labelledby="tabs-profile-tab02">
          Tab 2 content
        </div>
      </div>
    </div>
  </nav>
  <!-- Sidenav -->
</template>

<style scoped>

</style>