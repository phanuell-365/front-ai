import {defineStore} from "pinia";

export const useHomeStore = defineStore({
    id: 'home',
    state: () => ({
        count: 0
    }),
    getters: {
        doubleCount: (state) => state.count * 2,
    },
    actions: {
        increment() {
            this.count++
        },
        sayHello() {
            // say hello for every count
            console.log('This is a hello from the store!');
        }
    }
});
