import {defineStore} from "pinia";
import {PageData} from "./page-data.ts";

export const useAdminHomeStore = defineStore({
    id: 'adminHome',
    state: () => ({
        pages: [
            {
                id: 1,
                name: 'Habahaba',
                path: 'habahaba',
                title: 'Habahaba'
            },
            {
                id: 2,
                name: 'Salesforce',
                path: 'salesforce',
                title: 'Salesforce'
            },
            {
                id: 3,
                name: 'Google',
                path: 'google',
                title: 'Google'
            },
            {
                id: 4,
                name: 'Facebook',
                path: 'facebook',
                title: 'Facebook'
            }
        ],
        createDialog: {
            isOpen: false,
        },
    }),
    getters: {
        getPages: (state) => state.pages,
        getPageByPath: (state) => (path: string) => {
            return state.pages.find(page => page.path === path);
        }
    },
    actions: {
        createPageFromData(pageData: PageData) {
            // let's check first if the page name is already taken
            const pageNameExists = this.pages.some(page => page.name === pageData.chatbotName);

            if (pageNameExists) {
                // if the page name is already taken, we'll just append the word "copy" to the page name
                pageData.chatbotName = `${pageData.chatbotName} copy`;
            }
            const page = {
                id: this.pages.length + 1,
                name: pageData.chatbotName,
                path: pageData.chatbotId.toLowerCase().replace(' ', '-'),
                title: pageData.chatbotName,
            };
            this.pages.push(page);

            return page;
        },
        addPage(page: any) {
            this.pages.push(page);
        },
        async fetchPages() {
            try {
                const response = await fetch('http://35.179.94.88/admin/test', {});
                const pages = await response.json();
                console.log(pages)
                // this.pages = pages;
            } catch (error) {
                console.error(error)
            }
        },
        removePage(page: any) {
            this.pages.splice(this.pages.indexOf(page), 1);
        },
        updatePage(page: any) {
            this.pages[this.pages.indexOf(page)] = page;
        },
        openCreateDialog() {
            this.createDialog.isOpen = true;
        },
        closeCreateDialog() {
            this.createDialog.isOpen = false;
        }
    }
});
