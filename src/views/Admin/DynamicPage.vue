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
import {useHomeStore} from "@/stores/home";
import {useAdminHomeStore} from "@/router/admin/home.ts";

onMounted(() => {
  pageDataStore.setActivePageDataItem(page.value);

  tabsStore.setActiveTabByPageName(page.value);
});

const route = useRoute();
const tabsStore = useTabsStore();
const pageDataStore = usePageDataStore();
const adminHomeStore = useAdminHomeStore();

const page = ref(route.params.page);
const tab = ref(tabsStore.getTabByTo(page.value));
const pageData = ref(pageDataStore.getPageDataByTo(page.value));
const currentPage = ref(adminHomeStore.getPageByPath(page.value));

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

const showEditButton = ref(false);

const onMainContainerMouseOver = () => {
  showEditButton.value = true;
};

const onMainContainerMouseLeave = () => {
  showEditButton.value = false;
};

const chatbotName = ref(pageData.value.chatbotName);

</script>

<template>
  <div class="flex-1 overflow-hidden">
    <LinkBar :name="tab.name" :url="`mydomain.com/${tab.to}`"/>
    <div class="relative flex flex-col h-full">
      <div class="flex-1 overflow-auto h-screen">
        <SidebarData :page-data="pageData" :is-open="isSidebarDataOpen" @closeSidebarData="onCloseSidebarData" :current-page="currentPage"/>
        <div :class="[showEditButton ? 'cursor-pointer': '']"
             class="container mx-auto px-10 md:px-18 lg:px-24 py-14 flex flex-col items-center relative"
          @mouseover="onMainContainerMouseOver" @mouseleave="onMainContainerMouseLeave" @click="toggleSidebarData">
          <div class="grid grid-cols-1 gap-5 w-9/12 mx-auto">
            <ChatbotBubble :chatbot-name="chatbotName"
                           :chatbot-message="`Hi, I'm ${ chatbotName }. I'm here to help you with your queries.`"/>
            <UserBubble :user-message="`What kind of nonsense is this?`" user-name="John Doe"/>
            <ChatbotBubble :chatbot-name="chatbotName"
                           :chatbot-message="`Sorry! I can't help you with that at the moment. Please try again later.`"/>

            <UserInput :prompt-placeholder="pageData.promptPlaceholder" user-input="" disabled/>
          </div>

          <!-- Toggler -->
          <button @click="toggleSidebarData" v-if="showEditButton" type="button"
                  class="absolute top-10 right-5 md:right-36 btn btn-primary btn-sm normal-case text-xs md:text-sm">
            <span class="material-icons-round text-xs">edit</span> Edit
          </button>
        </div>

      </div>

    </div>
  </div>
</template>

<style scoped></style>