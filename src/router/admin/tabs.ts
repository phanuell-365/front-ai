import {defineStore} from "pinia";

interface Tab {
    name: string;
    title: string;
    icon: string;
    to: string;
    active: boolean;
}

export const useTabsStore = defineStore({
    id: 'tabs',
    state: () => ({
        tabs: [
            {
                name: 'Home',
                title: 'home',
                icon: 'home',
                to: 'home',
                active: false,
            },
            // Habahaba
            {
                name: 'Habahaba',
                title: 'Habahaba',
                icon: 'home',
                to: 'habahaba',
                active: false,
            },
            // Salesforce
            {
                name: 'Salesforce',
                title: 'Salesforce',
                icon: 'home',
                to: 'salesforce',
                active: false,
            },
            // Google
            {
                name: 'Google',
                title: 'Google',
                icon: 'home',
                to: 'google',
                active: false,
            },
            // Facebook
            {
                name: 'Facebook',
                title: 'Facebook',
                icon: 'home',
                to: 'facebook',
                active: false,
            }
        ],
        activeTab: null as Tab | null,
        openTabs: [] as Tab[],
    }),
    getters: {
        getTabs: (state) => state.tabs,
        getActiveTab: (state) => state.activeTab,
        getOpenTabs: (state) => state.openTabs,
        getTabByTo: (state) => (to: string) => state.tabs.find((tab) => tab.to === to),
    },
    actions: {
        addTab(tab: Tab) {
            this.tabs.push(tab);
        },
        removeTab(tab_name: string) {
            // get the tab by id
            const tab = this.tabs.find((tab) => tab.name === tab_name);

            if (tab) {
                // remove the tab from the open tabs
                this.openTabs.splice(this.openTabs.indexOf(tab), 1);
            }
        },
        setActiveTab(tab_name: string) {
            // let's check if there are tabs in local storage
            const tabs = JSON.parse(localStorage.getItem('tabs') as string);

            // check if there are tabs in local storage
            if (tabs) {
                // set the tabs to the store
                this.tabs = tabs;
            } else {
                // set the tabs to local storage
                localStorage.setItem('tabs', JSON.stringify(this.tabs));
            }

            // get the tab by id
            const tab: Tab | undefined = this.tabs.find((tab) => tab.name === tab_name);

            // set the active tab by first deactivating all tabs
            this.tabs.forEach((tab) => tab.active = false);

            const openTabs = JSON.parse(localStorage.getItem('openTabs') as string);

            // check if there are open tabs in local storage
            if (openTabs) {
                // set the open tabs to the store
                this.openTabs = openTabs;
            }
            // also deactivate all open tabs
            this.openTabs.forEach((tab) => tab.active = false);

            if (tab) {
                // set the active tab
                tab.active = true;

                // set the active tab
                this.activeTab = tab as Tab | null;

                // add the tab to the open tabs if it is not already there
                if (!this.openTabs.some((openTab: Tab) => openTab.name === tab.name)) {
                    this.openTabs.push(tab);
                } else {
                    const openTab = this.openTabs.find((openTab: Tab) => openTab.name === tab.name);

                    if (openTab) {
                        openTab.active = true;
                    }
                }
            }
            // set the open tabs to local storage
            // let's check if the open tabs are already in local storage

            // set the open tabs to local storage
            localStorage.setItem('openTabs', JSON.stringify(this.openTabs));
            // } else {

            // }
        },
        setActiveTabByPageName(page_name: string) {
            // we need to get the tab by page name
            const tab = this.tabs.find((tab) => tab.to === page_name);

            if (tab) {
                // set the active tab
                this.setActiveTab(tab.name);
            }
        },
        closeTab(tab_name: string) {
            // get the tab by id
            const tab = this.tabs.find((tab) => tab.name === tab_name);

            // deactivate the tab
            if (tab) {
                tab.active = false;

                // remove the tab from the open tabs
                this.openTabs = this.openTabs.filter((openTab) => openTab.name !== tab.name);

                // remove the tab from the tabs
                this.tabs = this.tabs.filter((tab) => tab.name !== tab.name);

                // set the active tab
                this.activeTab = this.openTabs[this.openTabs.length - 1];

                // set the open tabs to local storage
                localStorage.setItem('openTabs', JSON.stringify(this.openTabs));

                // call setActiveTab
                this.setActiveTab(this.activeTab?.name as string);

            }
        }
    },
});
