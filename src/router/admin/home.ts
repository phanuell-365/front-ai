import {defineStore} from "pinia";

export const useAdminHomeStore = defineStore({
    id: 'adminHome',
    state: () => ({
        pages: [
            {
                id: 1,
                name: 'Habahaba',
                path: 'habahaba',
            },
            {
                id: 2,
                name: 'Salesforce',
                path: 'salesforce',
            },
            {
                id: 3,
                name: 'Google',
                path: 'google',
            },
            {
                id: 4,
                name: 'Facebook',
                path: 'facebook',
            }
        ],
    }),
    getters: {
        getPages: (state) => state.pages,
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
