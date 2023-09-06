<script lang="ts" setup>
import {useTabsStore} from "@/stores/admin/tabs.ts";
import {onMounted, ref} from "vue";
import LinkBar from "@/components/Admin/LinkBar.vue";
import {onBeforeRouteUpdate, useRoute, useRouter} from "vue-router";
import SidebarData from "@/components/Admin/SidebarData.vue";
import {PageContent, PageOptions, usePageContentStore} from "@/stores/admin/page-data.ts";
import ChatbotBubble from "@/components/Chat/ChatbotBubble.vue";
import UserBubble from "@/components/Chat/UserBubble.vue";
import UserInput from "@/components/Chat/UserInput.vue";
import {useAdminHomeStore} from "@/stores/admin/home.ts";

onMounted(() => {

});

const route = useRoute();
const router = useRouter();
const tabsStore = useTabsStore();
const pageContentStore = usePageContentStore();
const adminHomeStore = useAdminHomeStore();

await pageContentStore.fetchPageContentItems();
await adminHomeStore.fetchPages();
await tabsStore.fetchTabs();

onBeforeRouteUpdate(async (to, _from, next) => {
  await tabsStore.updateActiveTab(page.value);

  page.value = to.params.page;
  next();
});

const isSidebarDataOpen = ref(false);

const toggleSidebarData = () => {
  isSidebarDataOpen.value = !isSidebarDataOpen.value;
};

const onCloseSidebarData = () => {
  isSidebarDataOpen.value = false;
};

const showEditButton = ref(false);

const onMainContainerMouseOver = () => {
  showEditButton.value = true;
};

const onMainContainerMouseLeave = () => {
  showEditButton.value = false;
};

const page = ref(route.params.page);
const pageId = ref(route.query.pageId as string);

pageContentStore.setActivePageContentItem(page.value);

tabsStore.setActiveTabByPageName(page.value);

const tab = ref(tabsStore.getTabByTo(page.value));
const pageContent = ref(pageContentStore.getPageContentByPageId(pageId.value));
console.log('pageId', pageId.value)
// if there's no page content, automatically redirect to home
if (!pageContent.value) {
  router.replace({name: "AdminHome"});
}

const currentPage = ref(adminHomeStore.getPageById(pageId.value));

const chatbotName = ref(pageContent.value.chatbotName);
const promptPlaceholder = ref(pageContent.value.promptPlaceholder);
const staticGreeting = ref(pageContent.value.staticGreeting);

const handleSavePageOptions = (pageOptions: PageOptions) => {
  pageContentStore.savePageOptions(pageOptions);
};

const handleSavePageContent = (pageContent: PageContent) => {
  pageContentStore.savePageContent(pageContent);
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

const sidebarDataChanged = ref(false);

const handleSidebarDataChanged = (value: boolean) => {
  sidebarDataChanged.value = value;
}

const url = ref(`${import.meta.env.VITE_APP_BASE_URL}/chat/${currentPage.value.path}?pageId=${currentPage.value.id}`);
</script>

<template>
  <div class="flex-1 overflow-hidden">
    <LinkBar :name="currentPage.name" :text="`chat/${currentPage.path}`" :url="url"/>
    <div class="relative flex flex-col h-full">
      <div class="flex-1 overflow-auto h-screen">
        <SidebarData :current-page="currentPage" :is-open="isSidebarDataOpen" :page-content="pageContent"
                     @closeSidebarData="onCloseSidebarData" @chatbot-name-change="handleChatbotNameChange"
                     @prompt-placeholder-change="handlePromptPlaceholderChange"
                     @greeting-change="handleStaticGreetingChange" @save-page-options="handleSavePageOptions"
                     @save-page-content="handleSavePageContent"
                     @sidebar-data-changed="handleSidebarDataChanged"
        />
        <div :class="[showEditButton ? 'cursor-pointer': '']"
             class="container mx-auto px-10 md:px-18 lg:px-24 py-14 flex flex-col items-center relative"
             @click="toggleSidebarData" @mouseleave="onMainContainerMouseLeave" @mouseover="onMainContainerMouseOver">
          <div class="grid grid-cols-1 gap-7 w-9/12 mx-auto">
            <ChatbotBubble :key="1" :chatbot-message="staticGreeting"
                           :chatbot-name="chatbotName"/>
            <UserBubble :user-message="`What is this?`" user-name="John Doe"/>
            <ChatbotBubble :key="2"
                           :chatbot-message="`Sorry! I can't help you with that at the moment. Please try again later.`"
                           :chatbot-name="chatbotName"
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

<style scoped></style>