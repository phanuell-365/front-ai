import {defineStore} from "pinia";

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
}

export const usePageDataStore = defineStore({
    id: 'pageData',
    state: () => ({
        newItem: {
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
        } as PageData,
        pageDataItems: [
            {
                chatbotName: 'Habahaba',
                chatbotId: 'habahaba',
                staticGreeting: 'Hello, how can I help you?',
                generatedGreeting: 'Hello HabaHaba! How can I help you?',
                greetingType: 'static',
                promptPlaceholder: 'Type your message here...',
                directive: 'You are now chatting with Habahaba. Type your message here...',
                model: 'gpt2',
                maxResponseLength: 100,
                creativity: 1,
                displayClosureMessage: false,
            } as PageData,
            {
                chatbotName: 'Salesforce',
                chatbotId: 'salesforce',
                greetingType: 'static',
                staticGreeting: 'Hello, how can I help you?',
                generatedGreeting: 'Hello Salesforce! How can I assist you today?',
                promptPlaceholder: 'Type your message here...',
                directive: 'You are now chatting with Salesforce. You are to ask me anything related to Salesforce. Type your message here...',
                model: 'gpt2',
                maxResponseLength: 100,
                creativity: 8,
                displayClosureMessage: false,
            } as PageData,
            {
                chatbotName: 'Google',
                chatbotId: 'google',
                greetingType: 'generated',
                generatedGreeting: 'Hello Google! How can I assist you today?',
                staticGreeting: 'Hello, how can I assist you today?',
                promptPlaceholder: 'Ask me anything...',
                directive: 'Hello! You are now chatting with Google. Type your message here...',
                model: 'gpt3',
                maxResponseLength: 100,
                creativity: 4,
                displayClosureMessage: true,
            } as PageData,
            {
                chatbotName: 'Facebook',
                chatbotId: 'facebook',
                greetingType: 'static',
                staticGreeting: 'Hello, how can I help you?',
                generatedGreeting: 'Hello Facebook! How can I help you?',
                promptPlaceholder: 'Type your message here...',
                directive: 'You are now chatting with Facebook. Type your message here...',
                model: 'gpt2',
                maxResponseLength: 100,
                creativity: 6,
                displayClosureMessage: false,
            } as PageData,
        ],
        activePageDataItem: null as PageData | null,
    }),
    getters: {
        getNewItem: (state) => state.newItem as PageData,
        getPageDataItems: (state) => state.pageDataItems as PageData[],
        getPageDataByTo: (state) => (to: string) => {
            return state.pageDataItems.find(pageDataItem => pageDataItem.chatbotId === to);
        },
        getActivePageDataItem: (state) => state.activePageDataItem as PageData,
    },
    actions: {
        createNewPageDataItem(pageName: string) {
            // let's check first if the page name is already taken
            const pageDataItem = this.pageDataItems.find(pageDataItem => pageDataItem.chatbotName === pageName);

            if (pageDataItem) {
                // if the page name is already taken, we'll create a new chatbot id
                // by adding the word "copy" to the page name
                pageName = `${pageName} copy`;
            }

            // create a new page data item
            const newPageDataItem = {
                ...this.newItem,
                chatbotName: pageName,
                chatbotId: pageName.toLowerCase().replace(' ', '-'),
            } as PageData;

            // add the new page data item to the list
            this.addPageDataItem(newPageDataItem);

            return newPageDataItem;

            // set the active page data item
            // this.setActivePageDataItem(newPageDataItem.chatbotId);
        },
        addPageDataItem(pageDataItem: PageData) {
            this.pageDataItems.push(pageDataItem);
        },
        removePageDataItem(pageDataItem: PageData) {
            this.pageDataItems.splice(this.pageDataItems.indexOf(pageDataItem), 1);
        },
        updatePageDataItem(pageDataItem: PageData) {
            this.pageDataItems[this.pageDataItems.indexOf(pageDataItem)] = pageDataItem;
        },
        setActivePageDataItem(pageDataId: string) {
            // find the page data item by id
            // set the active page data item
            const pageDataItem = this.pageDataItems.find(pageDataItem => pageDataItem.chatbotId === pageDataId);

            if (pageDataItem) {
                this.activePageDataItem = pageDataItem;
            }
        }
    }
});