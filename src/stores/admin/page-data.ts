import {defineStore} from "pinia";
import {computed, ref} from "vue";

export interface PageData {
    chatbotName: string;
    chatbotId: string;
    greetingType: 'static' | 'generated';
    staticGreeting: string;
    generatedGreeting: string;
    promptPlaceholder: string;
    directive: string;
    model: string;
    maxResponseLength: number;
    creativity: number;
    displayClosureMessage: boolean;
    closureMessage: string;
}

const BASE_URL = import.meta.env.VITE_API_URL as string;

// export const usePageDataStore = defineStore({
//     id: 'pageData',
//     state: () => ({
//         newItem: {
//             chatbotName: 'New Page',
//             chatbotId: 'new-page',
//             greetingType: 'static',
//             staticGreeting: 'Hello, how can I help you?',
//             generatedGreeting: 'Hello New Page! How can I help you?',
//             promptPlaceholder: 'Type your message here...',
//             directive: 'You are now chatting with New Page. Type your message here...',
//             model: 'gpt2',
//             maxResponseLength: 0,
//             creativity: 0,
//             displayClosureMessage: false,
//         } as PageData,
// pageDataItems: [
//     {
//         chatbotName: 'Habahaba',
//         chatbotId: 'habahaba',
//         staticGreeting: 'Hello, how can I help you?',
//         generatedGreeting: 'Hello HabaHaba! How can I help you?',
//         greetingType: 'static',
//         promptPlaceholder: 'Type your message here...',
//         directive: 'You are now chatting with Habahaba. Type your message here...',
//         model: 'gpt2',
//         maxResponseLength: 100,
//         creativity: 1,
//         displayClosureMessage: false,
//     } as PageData,
//     {
//         chatbotName: 'Salesforce',
//         chatbotId: 'salesforce',
//         greetingType: 'static',
//         staticGreeting: 'Hello, how can I help you?',
//         generatedGreeting: 'Hello Salesforce! How can I assist you today?',
//         promptPlaceholder: 'Type your message here...',
//         directive: 'You are now chatting with Salesforce. You are to ask me anything related to Salesforce. Type your message here...',
//         model: 'gpt2',
//         maxResponseLength: 100,
//         creativity: 8,
//         displayClosureMessage: false,
//     } as PageData,
//     {
//         chatbotName: 'Google',
//         chatbotId: 'google',
//         greetingType: 'generated',
//         generatedGreeting: 'Hello Google! How can I assist you today?',
//         staticGreeting: 'Hello, how can I assist you today?',
//         promptPlaceholder: 'Ask me anything...',
//         directive: 'Hello! You are now chatting with Google. Type your message here...',
//         model: 'gpt3',
//         maxResponseLength: 100,
//         creativity: 4,
//         displayClosureMessage: true,
//     } as PageData,
//     {
//         chatbotName: 'Facebook',
//         chatbotId: 'facebook',
//         greetingType: 'static',
//         staticGreeting: 'Hello, how can I help you?',
//         generatedGreeting: 'Hello Facebook! How can I help you?',
//         promptPlaceholder: 'Type your message here...',
//         directive: 'You are now chatting with Facebook. Type your message here...',
//         model: 'gpt2',
//         maxResponseLength: 100,
//         creativity: 6,
//         displayClosureMessage: false,
//     } as PageData,
// ],
//         pageDataItems: [] as PageData[],
//         activePageDataItem: null as PageData | null,
//     }),
//     getters: {
//         getNewItem: (state) => state.newItem as PageData,
//         getPageDataItems: (state) => state.pageDataItems as PageData[],
//         getPageDataByTo: (state) => (to: string) => {
//             return state.pageDataItems.find(pageDataItem => pageDataItem.chatbotId === to);
//         },
//         getActivePageDataItem: (state) => state.activePageDataItem as PageData,
//     },
//     actions: {
//         setPageDataItems(pageDataItems: PageData[]) {
//             this.pageDataItems = pageDataItems;
//         },
//         createNewPageDataItem(pageName: string) {
//             // let's check first if the page name is already taken
//             const pageDataItem = this.pageDataItems.find(pageDataItem => pageDataItem.chatbotName === pageName);
//
//             if (pageDataItem) {
//                 // if the page name is already taken, we'll create a new chatbot id
//                 // by adding the word "copy" to the page name
//                 pageName = `${pageName} copy`;
//             }
//
//             // create a new page data item
//             const newPageDataItem = {
//                 ...this.newItem,
//                 chatbotName: pageName,
//                 chatbotId: pageName.toLowerCase().replace(' ', '-'),
//             } as PageData;
//
//             // add the new page data item to the list
//             this.addPageDataItem(newPageDataItem);
//
//             return newPageDataItem;
//
//             // set the active page data item
//             // this.setActivePageDataItem(newPageDataItem.chatbotId);
//         },
//         addPageDataItem(pageDataItem: PageData) {
//             this.pageDataItems.push(pageDataItem);
//         },
//         removePageDataItem(pageDataItem: PageData) {
//             this.pageDataItems.splice(this.pageDataItems.indexOf(pageDataItem), 1);
//         },
//         updatePageDataItem(pageDataItem: PageData) {
//             this.pageDataItems[this.pageDataItems.indexOf(pageDataItem)] = pageDataItem;
//         },
//         setActivePageDataItem(pageDataId: string) {
//             // find the page data item by id
//             // set the active page data item
//             const pageDataItem = this.pageDataItems.find(pageDataItem => pageDataItem.chatbotId === pageDataId);
//
//             if (pageDataItem) {
//                 this.activePageDataItem = pageDataItem;
//             }
//         }
//     }
// });

/// OLD CODE ABOVE ///

// let's convert this store from using the options API to the composition API

export const usePageDataStore = defineStore('pageDataStore', () => {
    const newItem = ref<PageData>({
        chatbotName: 'New Page',
        chatbotId: 'new-page',
        greetingType: 'static',
        staticGreeting: 'Hello, how can I help you?',
        generatedGreeting: 'Hello New Page! How can I help you?',
        promptPlaceholder: 'Type your message here...',
        directive: 'You are now chatting with New Page. Type your message here...',
        model: 'gpt2',
        maxResponseLength: 0,
        creativity: 0,
        displayClosureMessage: false,
        closureMessage: 'This is an AI generated response. The response may not be accurate. Please consult a professional for advice.',
    });

    const pageDataItems = ref<PageData[]>([]);
    const activePageDataItem = ref<PageData | null>(null);

    // getters

    const getNewItem = computed(() => newItem.value);
    const getPageDataItems = computed(() => pageDataItems.value);
    const getPageDataByTo = computed(() => (to: string) => {
        return pageDataItems.value.find(pageDataItem => pageDataItem.chatbotId === to);
    });
    const getActivePageDataItem = computed(() => activePageDataItem.value);

    // actions

    async function fetchPageDataItems() {
        try {

            const response = await fetch(`${BASE_URL}/pages/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const res = await response.json();

            const {pages} = res.data;

            setPageDataItems(pages);
        } catch (error) {
            console.error(error);
        }
    }

    function setPageDataItems(rawPageDataItems: object[]) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        pageDataItems.value = rawPageDataItems.map((rawPageDataItem: any) => {
            return {
                chatbotId: rawPageDataItem['PageSlug'] as string,
                chatbotName: rawPageDataItem['ChatbotName'] as string,
                greetingType: rawPageDataItem['GreetingType'] === 0 ? 'static' : 'generated',
                staticGreeting: 'Hello, how can I help you?',
                generatedGreeting: rawPageDataItem['Greeting'] as string,
                promptPlaceholder: rawPageDataItem['PlaceholderContent'] as string,
                directive: rawPageDataItem['ChatbotDirective'] as string,
                model: rawPageDataItem['GptModel'] as string,
                maxResponseLength: 200 as number,
                creativity: rawPageDataItem['ChatbotCreativity'] as number,
                displayClosureMessage: rawPageDataItem['DisplayClosureMessage'] as boolean,
                closureMessage: rawPageDataItem['ClosureMessage'] as string,
            } as PageData;
        });
    }

    function createNewPageDataItem(pageName: string) {
        // let's check first if the page name is already taken
        const pageDataItem = pageDataItems.value.find(pageDataItem => pageDataItem.chatbotName === pageName);

        if (pageDataItem) {
            // if the page name is already taken, we'll create a new chatbot id
            // by adding the word "copy" to the page name
            pageName = `${pageName} copy`;
        }

        // create a new page data item
        const newPageDataItem = {
            ...newItem.value,
            chatbotName: pageName,
            chatbotId: pageName.toLowerCase().replace(' ', '-'),
        } as PageData;

        // add the new page data item to the list
        addPageDataItem(newPageDataItem);

        return newPageDataItem;

        // set the active page data item
        // setActivePageDataItem(newPageDataItem.chatbotId);
    }

    function addPageDataItem(pageDataItem: PageData) {
        pageDataItems.value.push(pageDataItem);
    }

    function removePageDataItem(pageDataItem: PageData) {
        pageDataItems.value.splice(pageDataItems.value.indexOf(pageDataItem), 1);
    }

    function updatePageDataItem(pageDataItem: PageData) {
        pageDataItems.value[pageDataItems.value.indexOf(pageDataItem)] = pageDataItem;
    }

    function setActivePageDataItem(pageDataId: string) {
        // find the page data item by id
        // set the active page data item
        const pageDataItem = pageDataItems.value.find(pageDataItem => pageDataItem.chatbotId === pageDataId);

        if (pageDataItem) {
            activePageDataItem.value = pageDataItem;
        }
    }

    return {
        newItem,
        pageDataItems,
        activePageDataItem,
        getNewItem,
        getPageDataItems,
        getPageDataByTo,
        getActivePageDataItem,
        fetchPageDataItems,
        setPageDataItems,
        createNewPageDataItem,
        addPageDataItem,
        removePageDataItem,
        updatePageDataItem,
        setActivePageDataItem,
    };
});