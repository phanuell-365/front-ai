import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {Page, useAdminHomeStore} from "./home.ts";

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

    const adminHomeStore = useAdminHomeStore();

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
                creativity: rawPageContentItem['chatbotCreativity'] * 10,
                displayClosureMessage: rawPageContentItem['displayClosureMessage'] === 1,
                closureMessage: rawPageContentItem['closureMessage'] as string,
            } as PageContent;
        });
    }

    function addNewPageContentItem(rawPageOptions: any, rawPageContentItem: any) {
        const newPageContent = {
            pageId: rawPageOptions['pageId'] as string,
            chatbotName: rawPageContentItem['chatbotName'] as string,
            pageSlug: rawPageContentItem['pageSlug'] as string,
            greetingType: rawPageContentItem['greetingType'] === 0 ? 'static' : 'generated',
            generatedGreeting: 'Hello, how can I help you?',
            staticGreeting: rawPageContentItem['staticGreeting'] as string,
            promptPlaceholder: rawPageContentItem['placeholderContent'] as string,
            directive: rawPageContentItem['chatbotDirective'] as string,
            model: rawPageContentItem['gptModel'] as string,
            maxResponseLength: 200 as number,
            creativity: rawPageContentItem['chatbotCreativity'] * 10,
            displayClosureMessage: rawPageContentItem['displayClosureMessage'] === 1,
            closureMessage: rawPageContentItem['closureMessage'] as string,
        } as PageContent
        pageContentItems.value.push(newPageContent);

        return newPageContent;
    }

    function updatePageContentItem(rawPageOptions: any, rawPageContentItem) {
        // we'll find and replace the page content item
        const pageContentItem = pageContentItems.value.find(pageContentItem => pageContentItem.pageId === rawPageOptions['pageId']);

        if (pageContentItem) {
            pageContentItem.chatbotName = rawPageContentItem['chatbotName'] as string;
            pageContentItem.pageSlug = rawPageContentItem['pageSlug'] as string;
            pageContentItem.greetingType = rawPageContentItem['greetingType'] === 0 ? 'static' : 'generated';
            pageContentItem.staticGreeting = rawPageContentItem['staticGreeting'] as string;
            pageContentItem.promptPlaceholder = rawPageContentItem['placeholderContent'] as string;
            pageContentItem.directive = rawPageContentItem['chatbotDirective'] as string;
            pageContentItem.model = rawPageContentItem['gptModel'] as string;
            pageContentItem.maxResponseLength = 200 as number;
            pageContentItem.creativity = rawPageContentItem['chatbotCreativity'] * 10;
            pageContentItem.displayClosureMessage = rawPageContentItem['displayClosureMessage'] === 1;
            pageContentItem.closureMessage = rawPageContentItem['closureMessage'] as string;
        }

        return pageContentItem;
    }

    function updatePageOptions(rawPageOptions: any) {
        // we'll find and replace the page content item
        const pageContentItem = pageContentItems.value.find(pageContentItem => pageContentItem.pageId === rawPageOptions['pageId']);

        if (pageContentItem) {
            pageContentItem.chatbotName = rawPageOptions['pageName'] as string;
            pageContentItem.pageSlug = rawPageOptions['pageUrl'] as string;
        }

        return pageContentItem;
    }

    async function savePageOptions(pageOptions: Page) {
        const newPageOptions: PageOptions = {
            pageId: pageOptions.id.toString(),
            pageName: pageOptions.name,
            pageTitle: pageOptions.title,
            pageUrl: pageOptions.path,
        }

        try {
            const response = await fetch(`${BASE_URL}/pages/${newPageOptions.pageId}/options/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPageOptions),
            });

            const {data} = await response.json();

            const {options} = data;

            const [pageOption] = options;

            await adminHomeStore.fetchPages();

            return updatePageOptions(pageOption);

        } catch (error) {
            console.error(error);
        }
    }

    async function savePageContent(pageContent: PageContent) {
        // pageContent.displayClosureMessage = pageContent.displayClosureMessage ? 1 : 0;
        const pageContentBody = {
            ...pageContent,
            greetingType: pageContent.greetingType === 'static' ? 0 : 1,
            displayClosureMessage: pageContent.displayClosureMessage ? 1 : 0,
        };

        try {
            const response = await fetch(`${BASE_URL}/pages/${pageContentBody.pageId}/content/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pageContentBody),
            });

            const {data} = await response.json();

            const {content, options} = data;

            const [pageContent] = content;

            const [pageOption] = options;

            await adminHomeStore.fetchPages();

            return updatePageContentItem(pageOption, pageContent);

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

    // function updatePageContentItem(pageContentItem: PageContent) {
    //     pageContentItems.value[pageContentItems.value.indexOf(pageContentItem)] = pageContentItem;
    // }

    function setActivePageContentItem(pageContentName: string) {
        // find the page data item by id
        // set the active page data item
        const pageContentItem = pageContentItems.value.find(pageContentItem => pageContentItem['chatbotName'] === pageContentName);

        if (pageContentItem) {
            activePageContentItem.value = pageContentItem;
        }
    }

    async function uploadFile(file: File, pageId: string) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${BASE_URL}/pages/${pageId}/data/`, {
                method: 'POST',
                body: formData,
            });

            const {data} = await response.json();

            const {file: uploadedFile} = data;

            return uploadedFile;
        } catch (error) {
            console.error(error);
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
        addNewPageContentItem,
        savePageOptions,
        savePageContent,
        setPageContentItems,
        createNewPageContentItem,
        addPageContentItem,
        removePageContentItem,
        updatePageContentItem,
        setActivePageContentItem,
        uploadFile,
    };
});