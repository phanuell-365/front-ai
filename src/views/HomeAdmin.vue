<script lang="ts" setup>
import TopBar from "@/components/Admin/TopBar.vue";
import {useAdminHomeStore} from "@/stores/admin/home.ts";
import DialogModal from "@/components/DialogModal.vue";
import {useRouter} from "vue-router";
import {useTabsStore} from "@/stores/admin/tabs.ts";
import {usePageContentStore} from "@/stores/admin/page-data.ts";
import {useField} from "vee-validate";

const router = useRouter();
const tabsStore = useTabsStore();
const pageContentStore = usePageContentStore();
const homeStore = useAdminHomeStore();

// by grace before we get here, the pages have already been fetched

const allPageNames = homeStore.getPages.map((page) => page.name.toLowerCase());

const pageNameValidator = (value: string) => {
  if (!value) {
    return "Page name is required";
  }

  if (value.length < 3) {
    return "Page name must be at least 3 characters long";
  }

  if (value.length > 50) {
    return "Page name must not exceed 50 characters";
  }

  if (allPageNames.includes(value.toLowerCase())) {
    return "Page name already exists";
  }

  if (value.toLowerCase() === "home" || value.toLowerCase() === "settings") {
    return "Page name is reserved";
  }

  return true;
}

const {
  value: pageName,
  errorMessage: pageNameErrorMessage,
  meta: pageNameMeta,
} = useField("pageName", pageNameValidator);

const closeModal = () => {
  homeStore.closeCreateDialog();
}

const createPage = async () => {
  if (pageNameMeta.valid) {

    const page = await homeStore.createNewPage(pageName.value);

    console.log(page);
    const newPage = pageContentStore.createNewPageContentItem(pageName.value);

    if (newPage) {
      const newTab = tabsStore.createTabFromPageContent(newPage);

      if (newTab) {

        const page = homeStore.createPageFromData(newPage);

        if (page) {
          tabsStore.setActiveTabByPageName(page.name);

          pageContentStore.setActivePageContentItem(page.name);

          homeStore.closeCreateDialog();

          // reset the page name field
          pageName.value = "";
          pageNameMeta.valid = false;
          pageNameMeta.validated = false;
          pageNameMeta.touched = false;

          await router.push({name: "DynamicPage", params: {page: page.path}});
        }
      }
    }
  }
}

</script>

<template>
  <div class="flex flex-col h-screen bg-blue-50">
    <Suspense>
      <TopBar/>
    </Suspense>
    <RouterView #default="{ Component, route }">
      <Suspense>
        <component :is="Component" :key="route.fullPath"/>
        <template #fallback>
          <div class="flex flex-col items-center justify-center h-full">
            <div class="flex flex-col items-center justify-center space-y-2">
              <div class="w-16 h-16 rounded-full bg-primary-100 animate-pulse"/>
              <div class="w-16 h-4 rounded-full bg-primary-100 animate-pulse"/>
            </div>
          </div>
        </template>
      </Suspense>
    </RouterView>
    <Teleport to="body">
      <DialogModal :is-open="homeStore.createDialog.isOpen" @closeModal="closeModal">
        <template #title>
          <span class="text-lg font-semibold">
            Create a new page
          </span>
        </template>

        <template #body>
          <div class="grid grid-cols-1 gap-3">
            <div class="flex flex-col space-y-2">
              <label class="label text-xs font-semibold" for="chatbot-name">
                Page Name
              </label>
              <input
                  id="page-name"
                  v-model="pageName"
                  :class="{'input-error': pageNameMeta.validated && !pageNameMeta.valid, 'input-primary': pageNameMeta.validated && pageNameMeta.valid}"
                  class="input input-bordered input-primary w-full text-sm" placeholder="Page Name"
                  type="text"
              />
              <small v-if="pageNameMeta.validated && !pageNameMeta.valid"
                     class="text-xs text-rose-500">
                {{ pageNameErrorMessage }}
              </small>
              <small class="text-xs text-gray-500">
                This will be used as the page title. More configurations will be shown after creating the page.
              </small>
            </div>
          </div>
        </template>

        <template #footer>
          <div class="flex flex-row items-center space-x-2 w-full">
            <button class="grow btn btn-sm md:btn-md btn-ghost normal-case border border-1 border-gray-400"
                    @click="closeModal">
              Cancel
            </button>
            <button class="grow btn btn-sm md:btn-md btn-primary normal-case" @click="createPage">
              Create
            </button>
          </div>
        </template>
      </DialogModal>
    </Teleport>
  </div>
</template>

<style scoped>

</style>