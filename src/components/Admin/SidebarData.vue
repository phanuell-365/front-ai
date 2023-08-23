<script setup lang="ts">
import {onMounted, onUnmounted, reactive, ref, watch} from "vue";
import {usePageDataStore} from "@/router/admin/page-data.ts";
import anime from "animejs";
import MyListBox from "@/components/form/MyListBox.vue";

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

const activeSidebarDataTab = ref('content');

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
        <li role="presentation" class="tab tab-bordered grow h-8 sm:h-10 md:h-12 lg:h-14" @click="toggleTab('content')"
            :class="activeSidebarDataTab === 'content' ? 'tab-active border-primary' : ''">
          <p>Content</p>
        </li>
        <li role="presentation" class="tab tab-bordered grow h-8 sm:h-10 md:h-12 lg:h-14" @click="toggleTab('data')"
            :class="activeSidebarDataTab === 'data' ? 'tab-active border-primary' : ''">
          <p>Data</p>
        </li>
      </ul>

      <!--Tabs content-->
      <div class="pt-5 pb-10">
        <Transition name="slide" mode="out-in">
          <div
              v-if="activeSidebarDataTab === 'content'"
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
                <div>
                </div>
              </div>
              <div>
                <label class="label text-xs font-semibold">
                  Greeting
                </label>
                <MyListBox :options="greetingTypes" @change="onGreetingTypeChange"
                           :selected-value="thisPageDataItem.greetingType"/>
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
              </div>
              <hr class="my-3"/>
              <div>
                <label class="label text-xs font-semibold" for="directive">
                  Directive
                </label>
                <textarea
                    v-model="thisPageDataItem.directive"
                    class="textarea textarea-primary w-full resize-y" placeholder="Add new directive..."></textarea>
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
              </div>
            </div>
          </div>
          <div
              v-else
              class="tab-content"
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