import {defineStore} from "pinia";

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
    }),
    getters: {
        getPages: (state) => state.pages,
        getPageByPath: (state) => (path: string) => {
            return state.pages.find(page => page.path === path);
        }
    },
    actions: {
        addPage(page: any) {
            this.pages.push(page);
        },
        removePage(page: any) {
            this.pages.splice(this.pages.indexOf(page), 1);
        },
        updatePage(page: any) {
            this.pages[this.pages.indexOf(page)] = page;
        }
    }
});
