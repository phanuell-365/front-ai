// import {defineStore} from "pinia";
// import {PageContent} from "./page-data.ts";
//
// export interface Tab {
//     name: string;
//     title: string;
//     to: string;
//     active: boolean;
//     id: number;
// }
//
// const BASE_URL = import.meta.env.VITE_API_URL as string;
//
// export const useTabsStore = defineStore({
//     id: 'tabs',
//     state: () => ({
//         // tabs: [
//         //     {
//         //         name: 'Home',
//         //         title: 'Home',
//         //         to: 'home',
//         //         active: false,
//         //     },
//         //     // Settings
//         //     {
//         //         name: 'Settings',
//         //         title: 'Settings',
//         //         to: 'settings',
//         //         active: false,
//         //     },
//         //     // Habahaba
//         //     {
//         //         name: 'Habahaba',
//         //         title: 'Habahaba',
//         //         to: 'habahaba',
//         //         active: false,
//         //     },
//         //     // Salesforce
//         //     {
//         //         name: 'Salesforce',
//         //         title: 'Salesforce',
//         //         to: 'salesforce',
//         //         active: false,
//         //     },
//         //     // Google
//         //     {
//         //         name: 'Google',
//         //         title: 'Google',
//         //         to: 'google',
//         //         active: false,
//         //     },
//         //     // Facebook
//         //     {
//         //         name: 'Facebook',
//         //         title: 'Facebook',
//         //         to: 'facebook',
//         //         active: false,
//         //     }
//         // ],
//         tabs: [
//             {
//                 name: 'Home',
//                 title: 'Home',
//                 to: 'home',
//                 active: false,
//                 id: 1,
//             },
//             // Settings
//             {
//                 name: 'Settings',
//                 title: 'Settings',
//                 to: 'settings',
//                 active: false,
//                 id: 2,
//             },
//         ] as Tab[],
//         activeTab: null as Tab | null,
//         openTabs: [
//
//             {
//                 name: 'Home',
//                 title: 'Home',
//                 to: 'home',
//                 active: false,
//                 id: 1,
//             },
//             // Settings
//             {
//                 name: 'Settings',
//                 title: 'Settings',
//                 to: 'settings',
//                 active: false,
//                 id: 2,
//             },
//         ] as Tab[],
//     }),
//     getters: {
//         getTabs: (state) => state.tabs,
//         getActiveTab: (state) => state.activeTab,
//         getOpenTabs: (state) => state.openTabs,
//         getTabByTo: (state) => (to: string) => state.tabs.find((tab) => tab.to === to),
//     },
//     actions: {
//         setTabs(tabs: Tab[]) {
//             const newTabs = new Set([...this.tabs, ...tabs]);
//
//             this.tabs = [...newTabs];
//         },
//         setOpenTabs(tabs: Tab[]) {
//             const newTabs = new Set([...this.openTabs, ...tabs]);
//             // since the active property for one maybe different from the other
//             // we'll use lodash to compare the tabs
//             // const newTabs = new Set([...this.openTabs, ...tabs].filter((tab) => {
//             //     return !this.openTabs.some((openTab) => openTab.id === tab.id);
//             // }));
//             //
//             this.openTabs = [...newTabs];
//
//             // get the active tab
//             const activeTab = this.openTabs.find((tab) => tab.active);
//
//             if (activeTab) {
//                 // set the active tab
//                 this.activeTab = activeTab;
//             }
//         },
//         createTabFromPageContent(pageContent: PageContent) {
//             // let's check first if the page name is already taken
//             const tabNameExists = this.tabs.some((tab) => tab.name === pageContent.chatbotId);
//
//             if (tabNameExists) {
//                 // if the page name is already taken, we'll just append the word "copy" to the page name
//                 pageContent.chatbotId = `${pageContent.chatbotId} copy`;
//             }
//             // create a new tab
//             const tab = {
//                 name: pageContent.chatbotId,
//                 title: pageContent.chatbotName,
//                 to: pageContent.chatbotId.toLowerCase().replace(' ', '-'),
//                 active: false,
//             } as Tab;
//
//             // add the tab to the tabs
//             this.addTab(tab);
//
//             // update the local storage
//             localStorage.setItem('tabs', JSON.stringify(this.tabs));
//
//             return tab;
//             // set the active tab
//             // this.setActiveTab(tab.name);
//         },
//         addTab(tab: Tab) {
//             this.tabs.push(tab);
//
//             console.log('tabs', this.tabs)
//         },
//         removeTab(tab_name: string) {
//             // get the tab by id
//             const tab = this.tabs.find((tab) => tab.name === tab_name);
//
//             if (tab) {
//                 // remove the tab from the open tabs
//                 this.openTabs.splice(this.openTabs.indexOf(tab), 1);
//             }
//         },
//         setActiveTab(tab_name: string) {
//             // get the tab by id
//             const tab: Tab | undefined = this.tabs.find((tab) => tab.name === tab_name);
//
//             // set the active tab by first deactivating all tabs
//             this.tabs.forEach((tab) => tab.active = false);
//
//             // also deactivate all open tabs
//             this.openTabs.forEach((tab) => tab.active = false);
//
//             if (tab) {
//                 // set the active tab
//                 tab.active = true;
//
//                 // set the active tab
//                 this.activeTab = tab as Tab | null;
//
//                 // add the tab to the open tabs if it is not already there
//                 if (!this.openTabs.some((openTab: Tab) => openTab.name === tab.name)) {
//                     this.openTabs.push(tab);
//                 } else {
//                     const openTab = this.openTabs.find((openTab: Tab) => openTab.name === tab.name);
//
//                     if (openTab) {
//                         openTab.active = true;
//                     }
//                 }
//             }
//         },
//         async updateActiveTab(tab_name: string) {
//             // get the tab by id
//             const tab = this.tabs.find((tab) => tab.name === tab_name);
//
//             if (tab) {
//                 // if it's not the 'home' or 'settings' tab
//                 if (tab.name !== 'Home' && tab.name !== 'Settings') {
//                     try {
//                         const response = await fetch(`${BASE_URL}/pages/tabs/`, {
//                             method: 'PATCH',
//                             body: JSON.stringify({
//                                 tabId: tab.id,
//                                 tabName: tab.name,
//                                 tabTitle: tab.title,
//                             }),
//                             headers: {
//                                 'Content-Type': 'application/json'
//                             }
//                         });
//
//                         const res = await response.json();
//
//                         console.log('res', res)
//
//                         if (res.data === 'success') {
//                             // set the active tab
//                             this.setActiveTab(tab.name);
//                         }
//                     } catch (error) {
//                         console.error(error)
//                     }
//                 } else {
//                     // set the active tab
//                     this.setActiveTab(tab.name);
//                 }
//             }
//         },
//         setActiveTabByPageName(page_name: string) {
//             // we need to get the tab by page name
//             const tab = this.tabs.find((tab) => tab.to === page_name);
//
//             if (tab) {
//                 // set the active tab
//                 this.setActiveTab(tab.name);
//             }
//         },
//         closeTab(tab_name: string) {
//             // get the tab by id
//             const tab = this.tabs.find((tab) => tab.name === tab_name);
//
//             // deactivate the tab
//             if (tab) {
//                 tab.active = false;
//
//                 // remove the tab from the open tabs
//                 this.openTabs = this.openTabs.filter((openTab) => openTab.name !== tab.name);
//
//                 // remove the tab from the tabs
//                 this.tabs = this.tabs.filter((tab) => tab.name !== tab.name);
//
//                 // check if only the home and settings tabs are left
//                 if (this.openTabs.length === 2) {
//                     // set the home tab to active
//                     this.activeTab = this.openTabs[0];
//                 } else {
//                     // set the active tab
//                     this.activeTab = this.openTabs[this.openTabs.length - 1];
//                 }
//
//                 // set the open tabs to local storage
//                 localStorage.setItem('openTabs', JSON.stringify(this.openTabs));
//
//                 // call setActiveTab
//                 this.setActiveTab(this.activeTab?.name as string);
//
//             }
//         }
//     },
// });
//

////// OLD CODE //////

// we need to change this store from using the options stores to using the setup stores

import {defineStore} from "pinia";
import {computed, ref} from "vue";

export interface Tab {
    name: string;
    title: string;
    to: string;
    active: boolean;
    id: string;
    pageId: string;
}

const BASE_URL = import.meta.env.VITE_API_URL as string;

export const useTabsStore = defineStore('tabsStore', () => {

    // state

    const tabs = ref<Tab[]>([
        {
            name: 'Home',
            title: 'Home',
            to: 'home',
            active: false,
            id: '1-home',
            pageId: '1',
        },
        // Settings
        {
            name: 'Settings',
            title: 'Settings',
            to: 'settings',
            active: false,
            id: '2-settings',
            pageId: '2',
        },
    ]);

    const activeTab = ref<Tab | null>(null);

    const openTabs = ref<Tab[]>([
        {
            name: 'Home',
            title: 'Home',
            to: 'home',
            active: false,
            id: '1-home',
            pageId: '1',
        },
        // Settings
        {
            name: 'Settings',
            title: 'Settings',
            to: 'settings',
            active: false,
            id: '2-settings',
            pageId: '2',
        },
    ]);


    // getters


    const getTabs = computed(() => tabs.value);
    const getActiveTab = computed(() => activeTab.value);
    const getOpenTabs = computed(() => openTabs.value);
    const getTabByTo = (to: string) => tabs.value.find((tab) => tab.to === to);


    // actions

    async function fetchTabs() {
        try {

            const response = await fetch(`${BASE_URL}/pages/tabs/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const res = await response.json();

            const {tabs, openTabs} = res.data;

            setTabs(tabs);

            setOpenTabs(tabs, openTabs);
        } catch (error) {
            console.error(error);
        }
    }

    function setTabs(tabsArg: Tab[]) {
        const newTabs = tabsArg.map((tab: any) => {
            return {
                name: tab['PageName'],
                title: tab['PageName'],
                to: tab['PageName'].toLowerCase().replace(' ', '-'),
                active: false,
                id: tab['tabId'],
                pageId: tab['PageId'],
            } as Tab;
        });

        // const newUniqueTabs = new Set([...tabs.value, ...newTabs]);

        const newUniqueTabs: Tab[] = [];

        newTabs.forEach((newTab) => {
            if (!tabs.value.some((tab) => tab.id === newTab.id)) {
                newUniqueTabs.push(newTab);
            }
        });

        tabs.value = [...tabs.value, ...newUniqueTabs];
    }

    function addNewTab(rawTab: any) {
        const newTab = {
            name: rawTab['PageName'],
            title: rawTab['PageName'],
            to: rawTab['PageName'].toLowerCase().replace(' ', '-'),
            active: false,
            id: rawTab['tabId'],
            pageId: rawTab['PageId'],
        } as Tab;

        // add the tab to the tabs
        tabs.value.push(newTab);

        // set the active tab
        setActiveTab(newTab.name);

        // update the local storage
        return newTab;
    }

    /**
     * Only use this function when the tabs are already set
     * @param rawTabs
     * @param openTabsArg
     */
    function setOpenTabs(rawTabs: any[], openTabsArg: any[]) {
        // create a new array of tabs from the tabs whose id is in the openTabs array
        let newRawTabs = rawTabs.filter((rawTab: any) => openTabsArg.some((openTab: any) => rawTab['tabId'] === openTab['TabId']));

        // add the Active property to the tabs that is in the openTabs array
        newRawTabs = newRawTabs.map((tab: any) => {
            return {
                ...tab,
                Active: openTabsArg.find((openTab: any) => tab['tabId'] === openTab['TabId'])?.Active,
            }
        });

        console.log('newRawTabs', newRawTabs)

        const newTabs = newRawTabs.map((tab: any) => {
            return {
                name: tab['PageName'],
                title: tab['PageName'],
                to: tab['PageName'].toLowerCase().replace(' ', '-'),
                active: tab.Active === 1,
                id: tab['tabId'],
                pageId: tab['PageId'],
            } as Tab;
        })

        // for each new tab, we'll check if it's already in the openTabs
        // if it is, we'll just replace the tab in the openTabs with the new tab
        // if it's not, we'll just add the new tab to the openTabs
        newTabs.forEach((newTab: Tab) => {
            const openTab = openTabs.value.find((openTab) => openTab.id === newTab.id);

            if (openTab) {
                openTab.active = newTab.active;
            } else {
                openTabs.value.push(newTab);
            }
        });
    }

    function addNewOpenTab(rawTab: any) {
        const newTab = {
            name: rawTab['PageName'],
            title: rawTab['PageName'],
            to: rawTab['PageName'].toLowerCase().replace(' ', '-'),
            active: false,
            id: rawTab['tabId'],
            pageId: rawTab['PageId'],
        } as Tab;

        // add the tab to the tabs
        openTabs.value.push(newTab);

        // set the active tab
        setActiveTab(newTab.name);

        // update the local storage
        return newTab;
    }

    function setActiveTab(tab_name: string) {
        // get the tab by id
        const tab: Tab | undefined = tabs.value.find((tab) => tab.name === tab_name);

        // set the active tab by first deactivating all tabs
        tabs.value.forEach((tab) => tab.active = false);

        // also deactivate all open tabs
        openTabs.value.forEach((tab) => tab.active = false);

        if (tab) {
            // set the active tab
            tab.active = true;

            // set the active tab
            activeTab.value = tab as Tab | null;

            // add the tab to the open tabs if it is not already there
            if (!openTabs.value.some((openTab: Tab) => openTab.name === tab.name)) {
                openTabs.value.push(tab);
            } else {
                const openTab = openTabs.value.find((openTab: Tab) => openTab.name === tab.name);

                if (openTab) {
                    openTab.active = true;
                }
            }
        }
    }

    async function updateActiveTab(tab_name: string) {
        // get the tab by id
        const tab = tabs.value.find((tab) => tab.name === tab_name);

        if (tab) {
            // if it's not the 'home' or 'settings' tab
            if (tab.name !== 'Home' && tab.name !== 'Settings') {
                try {
                    const response = await fetch(`${BASE_URL}/pages/tabs/${tab.id}`, {
                        method: 'PATCH',
                        body: JSON.stringify({
                            msg: 'hello'
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    const res = await response.json();

                    if (res.data === 'success') {
                        // set the active tab
                        setActiveTab(tab.name);
                    }
                } catch (error) {
                    console.error(error)
                }
            } else {
                // set the active tab
                setActiveTab(tab.name);
            }
        }
    }

    function setActiveTabByPageName(page_name: string) {
        // we need to get the tab by page name
        const tab = tabs.value.find((tab) => tab.to === page_name);

        if (tab) {
            // set the active tab
            setActiveTab(tab.name);
        }
    }

    function closeTab(tab_name: string) {
        // get the tab by id
        const tab = tabs.value.find((tab) => tab.name === tab_name);

        // deactivate the tab
        if (tab) {
            tab.active = false;

            // remove the tab from the open tabs
            openTabs.value = openTabs.value.filter((openTab) => openTab.name !== tab.name);

            // remove the tab from the tabs
            tabs.value = tabs.value.filter((tab) => tab.name !== tab.name);

            // check if only the home and settings tabs are left
            if (openTabs.value.length === 2) {
                // set the home tab to active
                activeTab.value = openTabs.value[0];
            } else {
                // set the active tab
                activeTab.value = openTabs.value[openTabs.value.length - 1];
            }

            // set the open tabs to local storage
            localStorage.setItem('openTabs', JSON.stringify(openTabs.value));

            // call setActiveTab
            setActiveTab(activeTab.value?.name as string);

        }
    }

    return {
        fetchTabs,
        tabs,
        activeTab,
        openTabs,
        getTabs,
        getActiveTab,
        getOpenTabs,
        getTabByTo,
        setTabs,
        setOpenTabs,
        setActiveTab,
        addNewTab,
        updateActiveTab,
        setActiveTabByPageName,
        closeTab,
    }
});