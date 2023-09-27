import {defineStore} from "pinia";
import {PageContent, PageOptions, usePageContentStore} from "./page-data.ts";
import {computed, ref} from "vue";
import {useTabsStore} from "./tabs.ts";
import {useAppHomeStore} from "../home";
import {useNotificationsStore} from "../notifications.ts";

const BASE_URL = import.meta.env.VITE_API_URL as string;

export interface Page {
    id: string
    name: string;
    path: string;
    title: string;
}

export const useAdminHomeStore = defineStore('adminHomeStore', () => {

    // state

    const pages = ref<Page[]>([]);
    const createDialog = ref({
        isOpen: false,
    });
    const deleteDialog = ref({
        isOpen: false,
    });
    // will be set when the user clicks the delete button
    const pageIdToDelete = ref<string>('');

    const pageContentStore = usePageContentStore();
    const tabsStore = useTabsStore();

    // getters

    const getPages = computed(() => pages.value);
    const getPageByPath = computed(() => (path: string) => {
        return pages.value.find(page => page.path === path);
    });
    const getPageById = computed(() => (id: string) => {
        return pages.value.find(page => page.id === id);
    });

    // actions

    function createPageFromData(pageContent: PageContent) {
        // let's check first if the page name is already taken
        const pageNameExists = pages.value.some(page => page.name === pageContent.chatbotName);

        if (pageNameExists) {
            // if the page name is already taken, we'll just append the word "copy" to the page name
            pageContent.chatbotName = `${pageContent.chatbotName} copy`;
        }
        const page = {
            id: pages.value.length + 1,
            name: pageContent.chatbotName,
            path: pageContent.chatbotId.toLowerCase().replace(' ', '-'),
            title: pageContent.chatbotName,
        };
        pages.value.push(page);

        return page;
    }

    function addPage(page: any) {
        pages.value.push(page);
    }

    async function fetchPages() {
        const appHomeStore = useAppHomeStore();
        const notificationStore = useNotificationsStore();

        appHomeStore.setIsAppFetching(true);

        try {
            const response = await fetch(`${BASE_URL}/pages/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const res = await response.json();

            const {options: pages} = res.data;

            // set the pages
            setPages(pages)

        } catch (error) {
            console.error(error);

            notificationStore.addNotification('An error occurred while fetching pages', 'error');
        } finally {
            setTimeout(() => {
                appHomeStore.setIsAppFetching(false);
            }, 500);
            // appHomeStore.setIsAppFetching(false);
        }
    }

    async function createNewPage(pageName: string) {
        const appHomeStore = useAppHomeStore();
        const notificationStore = useNotificationsStore();

        appHomeStore.setIsAppFetching(true);

        try {
            const response = await fetch(`${BASE_URL}/pages/`, {
                method: 'POST',
                body: JSON.stringify({
                    pageName,
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const page = await response.json();

                const {data} = page;

                const {content, options, tab} = data;

                const [pageContent] = content;

                const [pageOption] = options;

                const newPageContent = pageContentStore.addNewPageContentItem(pageOption, pageContent);
                tabsStore.setActiveTab(tab['TabName']);

                await fetchPages();

                notificationStore.addNotification('Page created successfully', 'success');

                return newPageContent;
            }
        } catch (e) {
            console.error(e);

            notificationStore.addNotification('An error occurred while creating a new page', 'error');
        } finally {
            setTimeout(() => {
                appHomeStore.setIsAppFetching(false);
            }, 500);
            // appHomeStore.setIsAppFetching(false);
        }
    }

    function setPages(pagesArr: any) {
        pages.value = pagesArr.map((page: any) => {
            return {
                id: page.pageId,
                name: page.pageName,
                path: page.pageUrl,
                title: page.pageTitle,
            }
        });
    }

    function updatePageOptions(rawPage: any) {
        // const page = {
        //     id: rawPage.pageId,
        //     name: rawPage.pageName,
        //     path: rawPage.pageUrl,
        //     title: rawPage.pageTitle,
        // }
        //
        // pages.value[pages.value.indexOf(getPageById.value(page.id))] = page;
        //
        // return page;

        // we'll opt for find and update instead of the above code
        const page = pages.value.find((page) => page.id === rawPage.pageId);

        if (page) {
            page.name = rawPage.pageName;
            page.path = rawPage.pageUrl;
            page.title = rawPage.pageTitle;
        }

        return page;
    }

    function removePage(page: any) {
        pages.value.splice(pages.value.indexOf(page), 1);
    }

    async function updatePage(pageOptions: Page) {
        const newPageOptions: PageOptions = {
            pageId: pageOptions.id.toString(),
            pageName: pageOptions.name,
            pageTitle: pageOptions.title,
            pageUrl: pageOptions.path,
        }

        const appHomeStore = useAppHomeStore();
        const notificationStore = useNotificationsStore();

        appHomeStore.setIsAppFetching(true);

        try {
            const response = await fetch(`${BASE_URL}/pages/${newPageOptions.pageId}/options/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPageOptions),
            });

            const {data} = await response.json();

            const {options} = data;

            const [pageOption] = options;

            await fetchPages();

            notificationStore.addNotification('Page updated successfully', 'success');

            return updatePageOptions(pageOption);

        } catch (error) {
            console.error(error);

            notificationStore.addNotification('An error occurred while updating the page', 'error');
        } finally {
            setTimeout(() => {
                appHomeStore.setIsAppFetching(false);
            }, 500);
            // appHomeStore.setIsAppFetching(false);
        }
    }

    async function deletePage() {
        const appHomeStore = useAppHomeStore();
        const notificationStore = useNotificationsStore();

        appHomeStore.setIsAppFetching(true);

        try {
            const response = await fetch(`${BASE_URL}/pages/${pageIdToDelete.value}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const {data} = await response.json();

                const {pageId} = data;

                const page = getPageById.value(pageId);

                removePage(page);

                await fetchPages();

                notificationStore.addNotification('Page deleted successfully', 'success');

                return page;
            }
        } catch (error) {
            console.error(error);

            notificationStore.addNotification('An error occurred while deleting the page', 'error');
        } finally {
            setTimeout(() => {
                appHomeStore.setIsAppFetching(false);
            }, 500);
            // appHomeStore.setIsAppFetching(false);
        }
    }

    function openCreateDialog() {
        createDialog.value.isOpen = true;
    }

    function closeCreateDialog() {
        createDialog.value.isOpen = false;
    }

    function openDeleteDialog() {
        // reset the pageIdToDelete
        pageIdToDelete.value = '';
        // then open the dialog
        deleteDialog.value.isOpen = true;
    }

    function closeDeleteDialog() {
        deleteDialog.value.isOpen = false;
    }

    function setPageToDelete(pageId: string) {
        pageIdToDelete.value = pageId;
    }

    return {
        pages,
        createDialog,
        deleteDialog,
        pageIdToDelete,
        getPages,
        getPageByPath,
        getPageById,
        createPageFromData,
        addPage,
        fetchPages,
        createNewPage,
        setPages,
        removePage,
        updatePage,
        openCreateDialog,
        closeCreateDialog,
        openDeleteDialog,
        closeDeleteDialog,
        setPageToDelete,
        deletePage,
    }
});
