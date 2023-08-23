<script setup lang="ts">
import {onMounted, onUnmounted, reactive, ref, watch} from "vue";
import {usePageDataStore} from "@/router/admin/page-data.ts";
import anime from "animejs";
import MyListBox from "@/components/form/MyListBox.vue";
import {useHomeStore} from "@/stores/home";

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

interface Page {
  id: string;
  name: string;
  path: string;
  title: string;
}

interface SidebarDataProps {
  pageData: PageData;
  currentPage: Page;
  isOpen: boolean;
}

interface Option {
  name: string;
  value: string;
}

const props = defineProps<SidebarDataProps>();

const pageDataStore = usePageDataStore();

const activePageDataItem = ref(props.pageData);

const greetingTypes = [
  {
    name: 'Generated',
    value: 'generated',
  },
  {
    name: 'Static',
    value: 'static',
  },
] as Option[];

const thisPage = reactive<Page>({
  id: props.currentPage.id,
  name: props.currentPage.name,
  path: props.currentPage.path,
  title: props.currentPage.title,
});

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

onMounted(() => {
  thisPageDataItem.chatbotName = activePageDataItem.value.chatbotName;
  thisPageDataItem.chatbotId = activePageDataItem.value.chatbotId;
  thisPageDataItem.greetingType = activePageDataItem.value.greetingType;
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

  const foundType = greetingTypes.find((item) => item.value === activePageDataItem.value.greetingType);

  if (foundType) {
    newGreetingType.value = foundType;
  }
});

const newGreetingTextAreaText = ref("");
const newGreetingType = ref<Option | null>(greetingTypes[0]);

// let's also subscribe to page data store changes
watch(() => pageDataStore.activePageDataItem, (newVal) => {
  activePageDataItem.value = newVal;

  thisPageDataItem.chatbotName = activePageDataItem.value.chatbotName;
  thisPageDataItem.chatbotId = activePageDataItem.value.chatbotId;
  thisPageDataItem.greetingType = activePageDataItem.value.greetingType;
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
  isInitialized.value = true;
});

const emit = defineEmits<{
  (event: 'close-sidebar-data'): void;
}>();

const sidebarTabs = ref([
  {
    name: 'Options',
    value: 'options',
  },
  {
    name: 'Content',
    value: 'content',
  },
  {
    name: 'Data',
    value: 'data',
  },
] as Option[]);

const activeSidebarDataTab = ref('options');

function toggleTab(tab: string) {
  if (activeSidebarDataTab.value !== tab) {
    const tabIn = `#${tab}-tab`
    const tabOut = `#${activeSidebarDataTab.value}-tab`

    console.log('tabIn', tabIn)

    anime({
      targets: tabOut,
      opacity: 0,
      duration: 300,
      easing: 'easeInOutQuad',
      complete: () => {
        activeSidebarDataTab.value = tab;

        anime({
          targets: tabIn,
          opacity: 1,
          duration: 300,
          easing: 'easeInOutQuad',
        });
      },
    });
  }
}

const onGreetingTypeChange = (option: Option) => {
  // newGreetingType.value = greetingTypes.find((item) => item.value === option);
  thisPageDataItem.greetingType = option.value as 'static' | 'generated';

  if (option.value === 'static') {
    newGreetingTextAreaText.value = activePageDataItem.value.staticGreeting;
  }

  if (option.value === 'generated') {
    const newName = activePageDataItem.value.chatbotName[0].toUpperCase() + activePageDataItem.value.chatbotName.slice(1);
    newGreetingTextAreaText.value = `Say I am ${newName}, how can I help you today?`;
  }
}

watch(() => newGreetingTextAreaText.value, (newVal) => {
  if (thisPageDataItem.greetingType === 'static') {
    thisPageDataItem.staticGreeting = newVal;
  }
});

const pageUrlInputHasFocus = ref(false);

</script>

<template>
  <!-- Sidenav -->
  <!-- Let's create an overlay that will cover the entire screen when the sidebar is open -->
  <div
      v-if="props.isOpen"
      class="absolute inset-0 z-30 bg-black bg-opacity-10 cursor-pointer"
      aria-hidden="true"
      @click="emit('close-sidebar-data')"
      @keyup.esc="emit('close-sidebar-data')"
  ></div>
  <nav
      id="sidebar-data"
      :class="props.isOpen ? 'translate-x-0' : 'translate-x-full'"
      class="absolute right-0 top-0 z-40 h-full w-10/12 sm:w-8/12 md:w-6/12 lg:w-5/12 overflow-hidden bg-white dark:bg-neutral-900 shadow-lg transition duration-300 ease-in-out transform-gpu">
    <div class="flex flex-col overflow-auto flex-1 sidebar-con">

      <!--Tabs navigation-->
      <ul
          class="tabs flex flex-row font-semibold sticky top-0 z-10 bg-white"
          role="tablist"
      >
        <li v-for="(tab) in sidebarTabs" :key="tab.name" role="presentation"
            class="tab tab-bordered grow h-8 sm:h-10 md:h-12 lg:h-14"
            :class="activeSidebarDataTab === tab.value ? 'tab-active border-primary' : ''"
            @click="toggleTab(tab.value)">
          <p>{{ tab.name }}</p>
        </li>
      </ul>

      <!--Tabs content-->
      <div class="pt-5 pb-10">
        <Transition name="slide" mode="out-in">
          <div
              v-if="activeSidebarDataTab === 'options'"
              class="tab-options px-5 grow h-full"
              ref="dataRef" id="data-tab"
              role="tabpanel"
              aria-labelledby="tabs-profile-tab02">
            <div class="grid grid-cols-1 gap-3 py-3">
              <div>
                <label class="label text-xs font-semibold" for="page-name">
                  Page Name
                </label>
                <input
                    id="page-name"
                    v-model="thisPage.name"
                    type="text" placeholder="Page Name" class="input input-bordered input-primary w-full text-sm"/>
                <small class="text-xs text-gray-500">This is the name that will appear on the sidebar, and on the
                  navigation bar. It should be short and descriptive. </small>
              </div>
              <div>
                <label class="label text-xs font-semibold" for="meta-title">
                  Meta Title
                </label>
                <input
                    id="meta-title"
                    v-model="thisPage.title"
                    type="text" placeholder="Meta Title" class="input input-bordered input-primary w-full text-sm"/>
                <small class="text-xs text-gray-500">This is the title that will appear on the browser tab.</small>
              </div>
              <div>
                <label class="label text-xs font-semibold" for="page-url">
                  Page Url
                </label>
                <div :class="[pageUrlInputHasFocus ? 'ring-2 ring-primary ring-offset-2' : '']"
                     class="rounded-md border border-primary flex flex-col">
                  <div class="bg-stone-200 text-black px-2 py-1 rounded-t-md">
                  <span class="text-xs">
                    https://mydomain.com/
                  </span>
                  </div>
                  <input
                      id="page-url"
                      @focus="pageUrlInputHasFocus = true" @blur="pageUrlInputHasFocus = false"
                      v-model="thisPage.path"
                      type="text" placeholder="page-url"
                      class="bg-transparent focus:outline-none input w-full text-sm"/>
                </div>
                <small class="text-xs text-gray-500">
                  This is the url that will be used to access the chatbot page. For example, if you enter "about" here,
                  the chatbot page will be accessible at https://mydomain.com/about
                </small>
              </div>
              <div
                  class="sticky bottom-0 z-30 h-24 flex flex-col justify-between items-center w-full">
                <div class="py-3 bg-gradient-to-t from-white block basis-2/12 w-full"></div>
                <div
                    class="bg-white w-full px-4 md:px-6 basis-10/12 flex flex-row justify-between items-center space-x-4">
                  <button class="btn btn-primary btn-sm md:btn-md normal-case text-xs md:text-sm basis-1/2">
                    Save Changes
                  </button>

                  <button class="btn btn-outline btn-sm md:btn-md normal-case text-xs md:text-sm basis-1/2">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
              v-else-if="activeSidebarDataTab === 'content'"
              class="tab-content px-5 grow h-full"
              role="tabpanel"
              ref="contentRef" id="content-tab"
          >
            <div class="grid grid-cols-1 gap-3 py-3">
              <div>
                <label class="label text-xs font-semibold" for="chatbot-name">
                  Chatbot name
                </label>
                <input
                    id="chatbot-name"
                    v-model="thisPageDataItem.chatbotName"
                    type="text" placeholder="Chatbot Name" class="input input-bordered input-primary w-full text-sm"/>
                <small class="text-xs text-gray-500">This is the name that will appear on the chatbot bubble.</small>
                <div>
                </div>
              </div>
              <div>
                <label class="label text-xs font-semibold">
                  Greeting
                </label>
                <MyListBox :options="greetingTypes" @change="onGreetingTypeChange"
                           :selected-value="thisPageDataItem.greetingType"/>
                <small class="text-xs text-gray-500">This is the greeting that will appear on the chatbot
                  bubble.</small>
              </div>
              <div class="">
                <textarea
                    v-model="newGreetingTextAreaText"
                    class="textarea textarea-primary w-full resize-y" placeholder="Bio"></textarea>
              </div>
              <div>
                <label class="label text-xs font-semibold" for="prompt-placeholder">
                  Prompt placeholder
                </label>
                <input
                    id="chatbot-name"
                    v-model="thisPageDataItem.promptPlaceholder"
                    type="text" placeholder="Chatbot Name" class="input input-bordered input-primary w-full text-sm"/>
                <small class="text-xs text-gray-500">This is the placeholder that will appear on the user input.</small>
              </div>
              <hr class="my-3"/>
              <div>
                <label class="label text-xs font-semibold" for="directive">
                  Directive
                </label>
                <textarea
                    v-model="thisPageDataItem.directive"
                    class="textarea textarea-primary w-full resize-y" placeholder="Add new directive..."></textarea>
                <small class="text-xs text-gray-500">
                  This is the directive that will be used to generate the chatbot's response.
                </small>
              </div>
              <div>
                <label class="label text-xs font-semibold" for="creativity">
                  Creativity
                </label>
                <input type="range" id="creativity" min="1" max="10" v-model="thisPageDataItem.creativity"
                       class="range range-xs" step="1"/>
                <div class="w-full flex justify-between text-xs px-2">
                  <span>0</span>
                  <span class="text-sm font-semibold">
                    {{ thisPageDataItem.creativity / 10 }}
                  </span>
                  <span>1</span>
                </div>
                <div class="w-full flex justify-between text-xs px-2">
                  <span>
                    Predictable
                  </span>
                  <span>
                    Creative
                  </span>
                </div>
                <small class="text-xs text-gray-500">
                  This is the creativity level that will be used to generate the chatbot's response.
                </small>
              </div>
              <div
                  class="sticky bottom-0 z-30 h-24 flex flex-col justify-between items-center w-full">
                <div class="py-3 bg-gradient-to-t from-white block basis-2/12 w-full"></div>
                <div class="bg-white w-full px-4 md:px-6 basis-10/12">
                  <button class="btn btn-primary btn-outline btn-sm md:btn-md normal-case text-xs md:text-sm w-full">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
              v-else-if="activeSidebarDataTab === 'data'"
              class="tab-data"
              ref="dataRef" id="data-tab"
              role="tabpanel"
              aria-labelledby="tabs-profile-tab02">
            Tab 2 content
          </div>
        </Transition>
      </div>
    </div>
  </nav>
  <!-- Sidenav -->
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.2s;
}

.slide-enter, .slide-leave-to /* .slide-leave-active in <2.1.8 */
{
  transform: translateX(0);
}

.sidebar-con {
  height: calc(100% - 3.5rem);
}
</style>