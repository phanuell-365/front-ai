<script setup lang="ts">
import {useTabsStore} from "@/router/admin/tabs.ts";
import {onMounted, ref, watch} from "vue";
import LinkBar from "@/components/Admin/LinkBar.vue";
import {onBeforeRouteUpdate, useRoute, useRouter} from "vue-router";
import SidebarData from "@/components/Admin/SidebarData.vue";
import {usePageDataStore} from "@/router/admin/page-data.ts";
import ChatbotBubble from "@/components/Chat/ChatbotBubble.vue";
import UserBubble from "@/components/Chat/UserBubble.vue";
import UserInput from "@/components/Chat/UserInput.vue";

onMounted(() => {
  pageDataStore.setActivePageDataItem(page.value);

  tabsStore.setActiveTabByPageName(page.value);
});

const route = useRoute();
const tabsStore = useTabsStore();
const pageDataStore = usePageDataStore();

const page = ref(route.params.page);
const tab = ref(tabsStore.getTabByTo(page.value));
const pageData = ref(pageDataStore.getPageDataByTo(page.value));

onBeforeRouteUpdate((to, _from, next) => {
  page.value = to.params.page;

  tabsStore.setActiveTabByPageName(page.value);
  tab.value = tabsStore.getTabByTo(page.value);
  pageData.value = pageDataStore.getPageDataByTo(page.value);

  pageDataStore.setActivePageDataItem(page.value);

  next();
});

const isSidebarDataOpen = ref(false);

const toggleSidebarData = () => {
  isSidebarDataOpen.value = !isSidebarDataOpen.value;
};

const onCloseSidebarData = () => {
  isSidebarDataOpen.value = false;
};

const chatbotName = ref(pageData.value.chatbotName);

</script>

<template>
  <div class="flex-1 overflow-hidden">
    <LinkBar :name="tab.name" :url="`mydomain.com/${tab.to}`"/>
    <div class="relative flex flex-col h-full">
      <div class="flex-1 overflow-auto h-screen">
        <SidebarData :page-data="pageData" :is-open="isSidebarDataOpen" @closeSidebarData="onCloseSidebarData"/>
        <div class="container pl-16 sm:pl-28 md:pl-32 lg:pl-36 pr-16 md:pr-20 py-14 flex flex-col items-center">
          <div class="grid grid-cols-1 gap-5 w-9/12 mx-auto">
            <ChatbotBubble :chatbot-name="chatbotName"
                           :chatbot-message="`Hi, I'm ${ chatbotName }. I'm here to help you with your queries.`"/>
            <UserBubble :user-message="`What kind of nonsense is this?`" user-name="John Doe" />
            <ChatbotBubble :chatbot-name="chatbotName"
                           :chatbot-message="`Sorry! I can't help you with that at the moment. Please try again later.`"/>

            <UserInput :prompt-placeholder="pageData.promptPlaceholder" user-input="" disabled />
          </div>

          <!-- Toggler -->
          <button @click="toggleSidebarData"
                  class="mt-10 inline-block rounded bg-primary px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg"
                  aria-controls="#sidebar-data"
                  aria-haspopup="true">
            <i class="block [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-white">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="h-5 w-5">
                <path
                    fill-rule="evenodd"
                    d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                    clip-rule="evenodd"/>
              </svg>
            </i>
          </button>

        </div>

      </div>

    </div>
  </div>
</template>

<style scoped></style>