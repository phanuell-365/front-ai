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
            chatbotName: '',
            chatbotId: '',
            greetingType: 'static',
            staticGreeting: '',
            generatedGreeting: '',
            promptPlaceholder: '',
            directive: '',
            model: '',
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
                creativity: 0.5,
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
                creativity: 0.5,
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
                creativity: 0.5,
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
                creativity: 0.5,
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