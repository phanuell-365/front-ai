import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {Page} from "./home.ts";

export interface PageContent {
    pageId: string;
    chatbotName: string;
    pageSlug: string;
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

export interface PageOptions {
    pageId: string;
    pageName: string;
    pageTitle: string;
    pageUrl: string;
}

const BASE_URL = import.meta.env.VITE_API_URL as string;

export const usePageContentStore = defineStore('pageContentStore', () => {
    const newItem = ref<PageContent>({
        pageId: 'new',
        chatbotName: 'New Page',
        pageSlug: 'new-page',
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

    const pageContentItems = ref<PageContent[]>([]);
    const activePageContentItem = ref<PageContent | null>(null);

    // getters

    const getNewItem = computed(() => newItem.value);
    const getPageContentItems = computed(() => pageContentItems.value);
    const getPageContentByPageSlug = computed(() => (pageSlug: string) => {
        return pageContentItems.value.find(pageContentItem => pageContentItem.pageSlug === pageSlug);
    });
    const getActivePageContentItem = computed(() => activePageContentItem.value);
    const getPageContentByPageId = computed(() => (pageId: string) => {
        return pageContentItems.value.find(pageContentItem => pageContentItem.pageId === pageId);
    });

    // actions

    async function fetchPageContentItems() {
        try {

            const response = await fetch(`${BASE_URL}/pages/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const res = await response.json();

            const {options: pageOptions, content: pageContent} = res.data;

            setPageContentItems(pageOptions, pageContent);
        } catch (error) {
            console.error(error);
        }
    }

    function setPageContentItems(rawPageOptions: any[], rawPageContentItems: object[]) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        pageContentItems.value = rawPageContentItems.map((rawPageContentItem: any, index: number) => {
            return {
                pageId: rawPageOptions[index]['pageId'] as string,
                chatbotName: rawPageContentItem['chatbotName'] as string,
                pageSlug: rawPageContentItem['pageSlug'] as string,
                greetingType: rawPageContentItem['greetingType'] === 0 ? 'static' : 'generated',
                generatedGreeting: 'Hello, how can I help you?',
                staticGreeting: rawPageContentItem['staticGreeting'] as string,
                promptPlaceholder: rawPageContentItem['placeholderContent'] as string,
                directive: rawPageContentItem['chatbotDirective'] as string,
                model: rawPageContentItem['gptModel'] as string,
                maxResponseLength: 200 as number,
                creativity: rawPageContentItem['chatbotCreativity'] as number,
                displayClosureMessage: rawPageContentItem['displayClosureMsg'] ?? false as boolean,
                closureMessage: rawPageContentItem['closureMsg'] as string,
            } as PageContent;
        });
    }

    function savePageOptions(pageOptions: Page) {
        const newPageOptions: PageOptions = {
            pageId: pageOptions.id.toString(),
            pageName: pageOptions.name,
            pageTitle: pageOptions.title,
            pageUrl: pageOptions.path,
        }

        try {
            const response = fetch(`${BASE_URL}/pages/${newPageOptions.pageId}/options/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPageOptions),
            });

            console.log('savePageOptions', response);

        } catch (error) {
            console.error(error);
        }
    }

    function savePageContent(pageContent: PageContent) {
        try {
            const response = fetch(`${BASE_URL}/pages/${pageContent.pageId}/content/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pageContent),
            });

            console.log('savePageContent', response);

        } catch (error) {
            console.error(error);
        }
    }

    function createNewPageContentItem(pageName: string) {
        // let's check first if the page name is already taken
        const pageContentItem = pageContentItems.value.find(pageContentItem => pageContentItem.chatbotName === pageName);

        if (pageContentItem) {
            // if the page name is already taken, we'll create a new chatbot id
            // by adding the word "copy" to the page name
            pageName = `${pageName} copy`;
        }

        // create a new page data item
        const newPageContentItem = {
            ...newItem.value,
            chatbotName: pageName,
            chatbotId: pageName.toLowerCase().replace(' ', '-'),
        } as PageContent;

        // add the new page data item to the list
        addPageContentItem(newPageContentItem);

        return newPageContentItem;

        // set the active page data item
        // setActivePageContentItem(newPageContentItem.chatbotId);
    }

    function addPageContentItem(pageContentItem: PageContent) {
        pageContentItems.value.push(pageContentItem);
    }

    function removePageContentItem(pageContentItem: PageContent) {
        pageContentItems.value.splice(pageContentItems.value.indexOf(pageContentItem), 1);
    }

    function updatePageContentItem(pageContentItem: PageContent) {
        pageContentItems.value[pageContentItems.value.indexOf(pageContentItem)] = pageContentItem;
    }

    function setActivePageContentItem(pageContentName: string) {
        // find the page data item by id
        // set the active page data item
        const pageContentItem = pageContentItems.value.find(pageContentItem => pageContentItem['chatbotName'] === pageContentName);

        if (pageContentItem) {
            activePageContentItem.value = pageContentItem;
        }
    }

    return {
        newItem,
        pageContentItems,
        activePageContentItem,
        getNewItem,
        getPageContentItems,
        getPageContentByPageSlug,
        getActivePageContentItem,
        getPageContentByPageId,
        fetchPageContentItems,
        savePageOptions,
        savePageContent,
        setPageContentItems,
        createNewPageContentItem,
        addPageContentItem,
        removePageContentItem,
        updatePageContentItem,
        setActivePageContentItem,
    };
});