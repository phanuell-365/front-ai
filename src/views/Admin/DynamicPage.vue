<script lang="ts" setup>
import {useTabsStore} from "../../stores/admin/tabs.ts";
import {computed, onBeforeMount, ref} from "vue";
import LinkBar from "../../components/Admin/LinkBar.vue";
import {onBeforeRouteUpdate, useRoute, useRouter} from "vue-router";
import SidebarData from "../../components/Admin/SidebarData.vue";
import {PageContent, PageOptions, usePageContentStore} from "../../stores/admin/page-data.ts";
import ChatbotBubble from "../../components/Chat/ChatbotBubble.vue";
import UserBubble from "../../components/Chat/UserBubble.vue";
import UserInput from "../../components/Chat/UserInput.vue";
import {Page, useAdminHomeStore} from "../../stores/admin/home.ts";
import LoadingOverlay from "../../components/LoadingOverlay.vue";

interface DynamicPageProps {
  page?: string;
  pageId?: string;
}

const props = defineProps<DynamicPageProps>();

const route = useRoute();
const router = useRouter();
const tabsStore = useTabsStore();
const pageContentStore = usePageContentStore();
const adminHomeStore = useAdminHomeStore();

const appIsFetching = ref(true);

const page = computed(() => props.page ?? route.params.page);
const pageId = computed(() => props.pageId ?? route.query?.pageId as string);

const editPage = ref(route.query?.editPage as string | undefined);
const isSidebarDataOpen = ref(false);

const showEditButton = ref(false);

setTimeout(() => {
  if (editPage.value === "true") {
    isSidebarDataOpen.value = true;
  }
}, 1000);

const currentPage = ref<Page | null>(null);

const pageContent = ref<PageContent | null>(null);
const chatbotName = ref<string | null>(null);
const promptPlaceholder = ref<string | null>(null);
const staticGreeting = ref<string | null>(null);

const tab = ref(null);

const sidebarDataChanged = ref(false);

const url = ref<string | null>(null);

onBeforeMount(() => {
  pageContentStore.fetchPageContentItems().then(() => {
    adminHomeStore.fetchPages().then(() => {
      tabsStore.fetchTabs().then(() => {
        if (typeof page.value === "string") {
          pageContentStore.setActivePageContentItem(page.value);
        }

        if (typeof page.value === "string") {
          tabsStore.setActiveTabByPageName(page.value);
        }

        currentPage.value = adminHomeStore.getPageById(pageId.value);

        console.log('Page Id => ', pageId.value);

        if (!currentPage.value) {
          router.replace({name: "not-found"});
        }

        pageContent.value = pageContentStore.getPageContentByPageId(pageId.value);
        chatbotName.value = pageContent.value?.chatbotName;
        promptPlaceholder.value = pageContent.value?.promptPlaceholder;
        staticGreeting.value = pageContent.value?.staticGreeting;

        tab.value = tabsStore.getTabByTo(page.value as string);

        url.value = `${import.meta.env.VITE_APP_BASE_URL}/chat/${currentPage.value?.path}?pageId=${currentPage.value.id}`;

        if (!pageContent.value) {
          router.replace({name: "not-found"});
        }

        setTimeout(() => {
          appIsFetching.value = false;
        }, 500);
      })
    });
  })
});

onBeforeRouteUpdate(async (_to, _from, next) => {
  if (typeof page.value === "string") {
    await tabsStore.updateActiveTab(page.value);
  }

  // page.value = to.params.page;
  next();
});
const toggleSidebarData = () => {
  isSidebarDataOpen.value = !isSidebarDataOpen.value;
};

const onCloseSidebarData = () => {
  isSidebarDataOpen.value = false;
};
const onMainContainerMouseOver = () => {
  showEditButton.value = true;
};

const onMainContainerMouseLeave = () => {
  showEditButton.value = false;
};

const handleSavePageOptions = async (pageOptions: PageOptions) => {
  const newOption = await adminHomeStore.updatePage(pageOptions as any as Page);
  console.log(newOption)
  await tabsStore.fetchTabs();
  tabsStore.setActiveTabByPageName(newOption.path);
  currentPage.value = newOption;
};

const handleSavePageContent = async (pageContentArg: PageContent) => {
  pageContent.value = await pageContentStore.savePageContent(pageContentArg);
};

const handleFileUpload = async (file: File, pageId: string) => {
  const url = await pageContentStore.uploadFile(file, pageId);
  console.log(url);
};
const handleChatbotNameChange = (value) => {
  chatbotName.value = value;
}
const handlePromptPlaceholderChange = (value) => {
  promptPlaceholder.value = value;
}
const handleStaticGreetingChange = (value) => {
  staticGreeting.value = value;
}
const handleSidebarDataChanged = (value: boolean) => {
  sidebarDataChanged.value = value;
}

</script>

<template>
  <Transition mode="out-in" name="slide-in">
    <template v-if="!appIsFetching">
      <div class="flex-1 overflow-hidden">
        <LinkBar :name="currentPage?.name" :text="`chat/${currentPage?.path}`" :url="url"/>
        <div class="relative flex flex-col h-full">
          <div class="flex-1 overflow-auto h-screen">
            <SidebarData :current-page="currentPage" :is-open="isSidebarDataOpen" :page-content="pageContent"
                         @closeSidebarData="onCloseSidebarData" @chatbot-name-change="handleChatbotNameChange"
                         @prompt-placeholder-change="handlePromptPlaceholderChange"
                         @greeting-change="handleStaticGreetingChange" @save-page-options="handleSavePageOptions"
                         @save-page-content="handleSavePageContent"
                         @sidebar-data-changed="handleSidebarDataChanged"
                         @file-upload="handleFileUpload"
            />
            <div :class="[showEditButton ? 'cursor-pointer': '']"
                 class="container mx-auto px-10 md:px-18 lg:px-24 py-14 flex flex-col items-center relative"
                 @click="toggleSidebarData" @mouseleave="onMainContainerMouseLeave"
                 @mouseover="onMainContainerMouseOver">
              <div class="grid grid-cols-1 gap-7 w-9/12 mx-auto">
                <ChatbotBubble :key="1" :chatbot-message="staticGreeting" :chatbot-name="chatbotName"
                               :disclosure-message="pageContent?.closureMessage"
                               :has-disclosure-message="pageContent?.displayClosureMessage"
                               :is-typing="false"/>
                <UserBubble :user-message="`What is this?`" user-name="John Doe"/>
                <ChatbotBubble :key="2"
                               :chatbot-message="`Sorry! I can't help you with that at the moment. Please try again later.`"
                               :chatbot-name="chatbotName"
                               :disclosure-message="pageContent?.closureMessage"
                               :has-disclosure-message="pageContent?.displayClosureMessage"
                               :is-typing="false"
                               is-copyable/>

                <UserInput :prompt-placeholder="promptPlaceholder" disabled user-input=""/>
              </div>

              <!-- Toggler -->
              <button v-if="showEditButton"
                      class="absolute top-10 right-5 md:right-36 btn btn-primary btn-sm normal-case text-xs md:text-sm"
                      type="button"
                      @click.stop="toggleSidebarData">
                <span class="material-icons-round text-xs">edit</span> Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="appIsFetching">
      <LoadingOverlay :show="appIsFetching"/>
    </template>
  </Transition>
</template>

<style scoped></style>