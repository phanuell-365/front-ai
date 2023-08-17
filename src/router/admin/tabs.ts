import {defineStore} from "pinia";

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
        activeTab: null,
        openTabs: [],
    }),
    getters: {
        getTabs: (state) => state.tabs,
        getActiveTab: (state) => state.activeTab,
        getOpenTabs: (state) => state.openTabs,
    },
    actions: {
        addTab(tab) {
            this.tabs.push(tab);
        },
        removeTab(tab_name) {
            // get the tab by id
            const tab = this.tabs.find((tab) => tab.name === tab_name);

            // remove the tab from the tabs
            this.tabs.splice(this.tabs.indexOf(tab), 1);
        },
        setActiveTab(tab_name) {
            // let's check if there are tabs in local storage
            const tabs = JSON.parse(localStorage.getItem('tabs'));

            console.log('tabs', tabs)

            // check if there are tabs in local storage
            if (tabs) {
                // set the tabs to the store
                this.tabs = tabs;
            } else {
                // set the tabs to local storage
                localStorage.setItem('tabs', JSON.stringify(this.tabs));
            }

            // get the tab by id
            const tab = this.tabs.find((tab) => tab.name === tab_name);

            // set the active tab by first deactivating all tabs
            this.tabs.forEach((tab) => tab.active = false);

            const openTabs = JSON.parse(localStorage.getItem('openTabs'));

            // check if there are open tabs in local storage
            if (openTabs) {
                // set the open tabs to the store
                this.openTabs = openTabs;
            }
            // also deactivate all open tabs
            this.openTabs.forEach((tab) => tab.active = false);

            // set the active tab
            tab.active = true;

            // set the active tab
            this.activeTab = tab;

            // add the tab to the open tabs if it is not already there
            if (!this.openTabs.some((openTab) => openTab.name === tab.name)) {
                this.openTabs.push(tab);
            } else {
                // set the tab to active
                this.openTabs.find((openTab) => openTab.name === tab.name).active = true;
            }

            // set the open tabs to local storage
            // let's check if the open tabs are already in local storage

            // set the open tabs to local storage
            localStorage.setItem('openTabs', JSON.stringify(this.openTabs));
            // } else {

            // }
        },
        setActiveTabByPageName(page_name) {
            // we need to get the tab by page name
            const tab = this.tabs.find((tab) => tab.to === page_name);

            // then call the setActiveTab action
            this.setActiveTab(tab.name);
        },
        closeTab(tab_name) {
            // get the tab by id
            const tab = this.tabs.find((tab) => tab.name === tab_name);

            // remove the tab from the open tabs
            this.openTabs.splice(this.openTabs.indexOf(tab), 1);

            // remove the tab from the tabs
            this.tabs.splice(this.tabs.indexOf(tab), 1);

            // set the active tab
            this.activeTab = this.openTabs[this.openTabs.length - 1];

            // set the open tabs to local storage
            localStorage.setItem('openTabs', JSON.stringify(this.openTabs));
        }
    },
});
