import {defineStore} from "pinia";
import {PageData} from "./page-data.ts";
import {computed, ref} from "vue";

const BASE_URL = import.meta.env.VITE_API_URL as string;

// export const useAdminHomeStore = defineStore({
//     id: 'adminHome',
//     state: () => ({
//         // pages: [
//         //     {
//         //         id: 1,
//         //         name: 'Habahaba',
//         //         path: 'habahaba',
//         //         title: 'Habahaba'
//         //     },
//         //     {
//         //         id: 2,
//         //         name: 'Salesforce',
//         //         path: 'salesforce',
//         //         title: 'Salesforce'
//         //     },
//         //     {
//         //         id: 3,
//         //         name: 'Google',
//         //         path: 'google',
//         //         title: 'Google'
//         //     },
//         //     {
//         //         id: 4,
//         //         name: 'Facebook',
//         //         path: 'facebook',
//         //         title: 'Facebook'
//         //     }
//         // ],
//         pages: [],
//         createDialog: {
//             isOpen: false,
//         },
//     }),
//     getters: {
//         getPages: (state) => state.pages,
//         getPageByPath: (state) => (path: string) => {
//             return state.pages.find(page => page.path === path);
//         }
//     },
//     actions: {
//         createPageFromData(pageData: PageData) {
//             // let's check first if the page name is already taken
//             const pageNameExists = this.pages.some(page => page.name === pageData.chatbotName);
//
//             if (pageNameExists) {
//                 // if the page name is already taken, we'll just append the word "copy" to the page name
//                 pageData.chatbotName = `${pageData.chatbotName} copy`;
//             }
//             const page = {
//                 id: this.pages.length + 1,
//                 name: pageData.chatbotName,
//                 path: pageData.chatbotId.toLowerCase().replace(' ', '-'),
//                 title: pageData.chatbotName,
//             };
//             this.pages.push(page);
//
//             return page;
//         },
//         addPage(page: any) {
//             this.pages.push(page);
//         },
//         async fetchPages() {
//             try {
//                 const response = await fetch(`${BASE_URL}/pages/`, {
//                     method: 'GET',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     }
//                 });
//                 const res = await response.json();
//                 console.log('res', res)
//                 const {pages, tabs, openTabs} = res.data;
//
//                 // set the pages
//                 this.setPages(pages)
//
//                 // set the page data items
//                 this.setPageDataItems(pages);
//
//                 // set the tabs
//                 this.setTabs(tabs);
//
//                 // set the open tabs
//                 const active = this.setOpenTabs(tabs, openTabs);
//
//                 console.log('active', active)
//
//                 return active as Tab;
//             } catch (error) {
//                 console.error(error)
//             }
//         },
//         async createNewPage(pageName: string) {
//             try {
//                 const response = await fetch(`${BASE_URL}/pages/`, {
//                     method: 'POST',
//                     body: JSON.stringify({
//                         pageName,
//                     }),
//                     headers: {
//                         'Content-Type': 'application/json'
//                     }
//                 });
//
//                 if (response.ok) {
//                     const page = await response.json();
//
//                     await this.fetchPages();
//
//                     return page;
//                 }
//             } catch (e) {
//                 console.error(e);
//             }
//         },
//         setPages(pages: any) {
//             this.pages = pages.map((page: any) => {
//                 return {
//                     id: page.PageId,
//                     name: page.PageName,
//                     path: page.PageSlug,
//                     title: page.PageTitle,
//                 }
//             });
//         },
//         setPageDataItems(pageDataItems: object[]) {
//             return pageDataStore.setPageDataItems(pageDataItems.map((pageDataItem: any) => {
//                 return {
//                     chatbotId: pageDataItem.PageSlug as string,
//                     chatbotName: pageDataItem.ChatbotName as string,
//                     greetingType: pageDataItem.GreetingType === 0 ? 'static' : 'generated',
//                     staticGreeting: 'Hello, how can I help you?',
//                     generatedGreeting: pageDataItem.Greeting as string,
//                     promptPlaceholder: pageDataItem.PlaceholderContent as string,
//                     directive: pageDataItem.ChatbotDirective as string,
//                     model: pageDataItem.GptModel as string,
//                     maxResponseLength: 200 as number,
//                     creativity: pageDataItem.ChatbotCreativity as number,
//                     displayClosureMessage: pageDataItem.DisplayClosureMessage as boolean,
//                     closureMessage: pageDataItem.ClosureMessage as string,
//                 } as PageData;
//             }));
//         },
//         setTabs(tabs: any) {
//             return tabsStore.setTabs(tabs.map((tab: any) => {
//                 return {
//                     name: tab.TabName,
//                     title: tab.TabName,
//                     to: tab.TabName.toLowerCase().replace(' ', '-'),
//                     active: false,
//                     id: tab.TabId,
//                 } as Tab;
//             }));
//         },
//         setOpenTabs(tabs: any, openTabs: any) {
//             // create a new array of tabs from the tabs whose id is in the openTabs array
//             let newTabs = tabs.filter((tab: any) => openTabs.some((openTab: any) => tab.TabId === openTab.TabId));
//
//             // add the Active property to the tabs that is in the openTabs array
//             newTabs = newTabs.map((tab: any) => {
//                 return {
//                     ...tab,
//                     Active: openTabs.find((openTab: any) => tab.TabId === openTab.TabId).Active,
//                 }
//             });
//
//             // set the open tabs
//             const newOpenTabs = newTabs.map((tab: any) => {
//                 return {
//                     name: tab.TabName,
//                     title: tab.TabName,
//                     to: tab.TabName.toLowerCase().replace(' ', '-'),
//                     active: tab.Active === 1,
//                     id: tab.TabId,
//                 } as Tab;
//             });
//
//             // set the open tabs
//             tabsStore.setOpenTabs(newOpenTabs);
//
//             const activeTab = tabsStore.getActiveTab;
//
//             if (activeTab) {
//                 // set the active page data item
//                 pageDataStore.setActivePageDataItem(activeTab.to);
//             }
//
//             return activeTab;
//         },
//         removePage(page: any) {
//             this.pages.splice(this.pages.indexOf(page), 1);
//         },
//         updatePage(page: any) {
//             this.pages[this.pages.indexOf(page)] = page;
//         },
//         openCreateDialog() {
//             this.createDialog.isOpen = true;
//         },
//         closeCreateDialog() {
//             this.createDialog.isOpen = false;
//         }
//     }
// });

//// OLD CODE ABOVE ////

// we need to convert the adminHome store from using Options API to using Composition API

export const useAdminHomeStore = defineStore('adminHomeStore', () => {

    // state

    const pages = ref([]);
    const createDialog = ref({
        isOpen: false,
    });

    // getters

    const getPages = computed(() => pages.value);
    const getPageByPath = computed(() => (path: string) => {
        return pages.value.find(page => page.path === path);
    });

// actions

    function createPageFromData(pageData: PageData) {
        // let's check first if the page name is already taken
        const pageNameExists = pages.value.some(page => page.name === pageData.chatbotName);

        if (pageNameExists) {
            // if the page name is already taken, we'll just append the word "copy" to the page name
            pageData.chatbotName = `${pageData.chatbotName} copy`;
        }
        const page = {
            id: pages.value.length + 1,
            name: pageData.chatbotName,
            path: pageData.chatbotId.toLowerCase().replace(' ', '-'),
            title: pageData.chatbotName,
        };
        pages.value.push(page);

        return page;
    }

    function addPage(page: any) {
        pages.value.push(page);
    }

    async function fetchPages() {
        try {
            const response = await fetch(`${BASE_URL}/pages/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const res = await response.json();

            const {pages} = res.data;

            // set the pages
            setPages(pages)

        } catch (error) {
            console.error(error)
        }
    }

    async function createNewPage(pageName: string) {
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

                await fetchPages();

                return page;
            }
        } catch (e) {
            console.error(e);
        }
    }

    function setPages(pagesArr: any) {
        pages.value = pagesArr.map((page: any) => {
            return {
                id: page.PageId,
                name: page.PageName,
                path: page.PageSlug,
                title: page.PageTitle,
            }
        });
    }

    function removePage(page: any) {
        pages.value.splice(pages.value.indexOf(page), 1);
    }

    function updatePage(page: any) {
        pages.value[pages.value.indexOf(page)] = page;
    }

    function openCreateDialog() {
        createDialog.value.isOpen = true;
    }

    function closeCreateDialog() {
        createDialog.value.isOpen = false;
    }

    return {
        pages,
        createDialog,
        getPages,
        getPageByPath,
        createPageFromData,
        addPage,
        fetchPages,
        createNewPage,
        setPages,
        removePage,
        updatePage,
        openCreateDialog,
        closeCreateDialog,
    }
});
