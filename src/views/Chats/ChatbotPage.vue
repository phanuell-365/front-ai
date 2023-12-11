<script lang="ts" setup>
import UserBubble from "../../components/Chat/UserBubble.vue";
import UserInput from "../../components/Chat/UserInput.vue";
import ChatbotBubble from "../../components/Chat/ChatbotBubble.vue";
import {computed, onBeforeMount, onMounted, onUpdated, Ref, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {PageContent, usePageContentStore} from "../../stores/admin/page-data.ts";
import {useChatbotStore} from "../../stores/chatbot";
import {marked} from "marked";
import LoadingOverlay from "../../components/LoadingOverlay.vue";
import _ from 'lodash';
import hljs from 'highlight.js';
import {useNotificationsStore} from "../../stores/notifications.ts";

const notificationsStore = useNotificationsStore();

const route = useRoute();
const pageContentStore = usePageContentStore();
const chatbot = useChatbotStore();
const router = useRouter();

const appIsFetching = ref(true);

// const page = ref(route.params.chatbotId);
const pageId = ref(route.query.pageId as string);
const pageContent = ref<PageContent | null>(null);

const chatbotName = ref<string | null>(null);
const promptPlaceholder = ref<string | null>(null);
const staticGreeting = ref<string | null>(null);

onBeforeMount(() => {
  pageContentStore.fetchPageContentItems().then(() => {

    pageContent.value = pageContentStore.getPageContentByPageId(pageId.value);

    if (!pageContent.value) {
      router.replace({name: "not-found"});
    }

    chatbotName.value = pageContent.value.chatbotName;
    promptPlaceholder.value = pageContent.value.promptPlaceholder;
    staticGreeting.value = pageContent.value.staticGreeting;

    window.document.title = pageContent.value.chatbotName;

    setTimeout(() => {
      appIsFetching.value = false;
    }, 500);
  });
});

interface Conversation {
  message: string;
  originalMessage?: string;
  isUser: boolean;
  isTyping?: boolean;
  hasError?: boolean;
  uniqueId: string | number;
  audioData?: {
    audioBlob: Blob;
    // audioDuration: number;
    audioUrl: string;
  };
}

const conversationContainerRef = ref<HTMLDivElement | null>();
// const conversationContainerHeight = computed(() => {
//   return conversationContainerRef.value?.clientHeight || 0;
// });
const userInputContainerHeight = computed(() => {
  return userInputContainerHeightRef.value?.clientHeight || 0;
});
const userInputContainerHeightRef = ref<HTMLDivElement | null>();
const conversation = ref<Ref<Conversation>[]>([]);
const aiResponses = ref<string[]>([]);
const isGeneratingResponse = ref(false);

// create sample conversations from the sample data

const renderer: any = {
  link(href: string, title: string, text: string) {
    return `<a target="_blank" class="link link-primary" href="${href}" title="${title}">${text}</a>`;
  },
  table(header: string, body: string) {
    return `
   <div class="bg-white p-2.5 rounded-xl shadow-lg shadow-slate-300/10 my-3">
    <div class="overflow-x-auto py-4">
        <table class="table table-zebra border">
        <thead>
            ${header}
        </thead>
        <tbody>
            ${body}
        </tbody>
    </table>
    </div>
    </div>
  `;
  },
  tablerow(content: string) {
    return `
    <tr class="hover">${content}</tr>
  `;
  },
  tablecell(content: string) {
    return `
    <td>${content}</td>
  `;
  },
  code(code: string, language: string) {
    // return `
    //   <pre><div class="mockup-code my-3"><div class="px-4"><code>${code}</code></div></div></pre>
    // `;

    if (language) {
      const ignoreIllegals = true;
      return `
  <div class="p-2 flex w-full">
       <pre class="w-full"><div class="mockup-code bg-neutral-800 my-3 relative shadow-xl w-full overflow-auto"><div class="px-4 flex-1 overflow-auto h-full w-full"><code class="language-${language}">${hljs.highlight(code, {
        language,
        ignoreIllegals
      }).value}</code></div></div></pre>
  </div>
    `;
    } else {
      return `
  <div class="p-3 flex w-full">
    <pre class="w-full"><div class="mockup-code bg-neutral-800 my-2.5 w-full overflow-auto"><div class="px-4 flex-1 overflow-auto h-full w-full"><code>${code}</code></div></div></pre>
  </div>
  `;
    }
  },
  list(body: string, ordered: boolean, start: number | undefined) {
    if (ordered) {
      if (start) {
        return `
         <div class="my-2 py-2 mx-3">
            <ol start="${start}" class="list-decimal list-outside mx-5 space-y-0.5 md:space-y-1 lg:space-y-1.5">${body}</ol>
         </div>
      `;
      }
      return `
         <div class="my-2 py-2 mx-3">
            <ol class="list-decimal mx-5 list-outside space-y-0.5 md:space-y-1 lg:space-y-1.5">${body}</ol>
         </div>
    `;
    } else {
      return `
         <div class="my-2 py-2 mx-3">
            <ul class="list-disc list-outside mx-5 space-y-0.5 md:space-y-1 lg:space-y-1.5">${body}</ul>
         </div>
    `;
    }
  },
  listitem(text: string) {
    return `
    <li class="text-neutral-800 dark:text-neutral-50">${text}</li>
  `;
  },
  paragraph(text: string) {
    return `
    <p class="text-neutral-800 dark:text-neutral-50 leading-relaxed">${text}</p>
  `;
  },
  heading(text: string, level: string) {
    return `
    <h${level} class="text-2xl font-poppins-bold text-neutral-800 dark:text-neutral-50">${text}</h${level}>
  `;
  },
  hr() {
    return `
    <hr class="my-4 border-neutral-200 dark:border-neutral-700"/>
  `;
  },
  blockquote(quote: string) {
    return `
    <blockquote class="my-4 border-l-4 border-neutral-200 dark:border-neutral-700 pl-4">${quote}</blockquote>
  `;
  },
  image(href: string, title: string, text: string) {
    return `
    <img src="${href}" alt="${text}" title="${title}" class="w-full"/>
  `;
  },
  strong(text: string) {
    return `
    <strong class="font-poppins-semi-bold my-1 text-base">${text}</strong>
  `;
  },
  codespan(code: string) {
    // return `
    //   <pre><div class="mockup-code"><div class="px-4"><code>${code}</code></div></div></pre>
    // `;

    // we'll rather render this like in chatGPT
    return `
    <code class="font-poppins-semi-bold my-1">&acute;${code}&acute;</code>
  `;
  },
  descriptionList(body: string) {
    return `
    <dl>${body}</dl>
  `;
  },
  description(dt: string, dd: string) {
    return `
    <dt>${dt}</dt>
    <dd>${dd}</dd>
  `;
  }
};

// create a custom description list renderer

// const descriptionList = {
//   name: 'descriptionList',
//   level: 'block',                                     // Is this a block-level or inline-level tokenizer?
//   start(src) {
//     return src.match(/:[^:\n]/)?.index;
//   }, // Hint to Marked.js to stop and check for a match
//   tokenizer(src, tokens) {
//     const rule = /^(?::[^:\n]+:[^:\n]*(?:\n|$))+/;    // Regex for the complete token, anchor to string start
//     const match = rule.exec(src);
//     if (match) {
//       const token = {                                 // Token to generate
//         type: 'descriptionList',                      // Should match "name" above
//         raw: match[0],                                // Text to consume from the source
//         text: match[0].trim(),                        // Additional custom properties
//         tokens: []                                    // Array where child inline tokens will be generated
//       };
//       this.lexer.inline(token.text, token.tokens);    // Queue this data to be processed for inline tokens
//       return token;
//     }
//   },
//   renderer(token) {
//     return `<dl>${this.parser.parseInline(token.tokens)}\n</dl>`; // parseInline to turn child tokens into HTML
//   }
// };

// const description = {
//   name: 'description',
//   level: 'inline',                                 // Is this a block-level or inline-level tokenizer?
//   start(src) {
//     return src.match(/:/)?.index;
//   },    // Hint to Marked.js to stop and check for a match
//   tokenizer(src) {
//     const rule = /^:([^:\n]+):([^:\n]*)(?:\n|$)/;  // Regex for the complete token, anchor to string start
//     const match = rule.exec(src);
//     if (match) {
//       return {                                         // Token to generate
//         type: 'description',                           // Should match "name" above
//         raw: match[0],                                 // Text to consume from the source
//         dt: this.lexer.inlineTokens(match[1].trim()),  // Additional custom properties, including
//         dd: this.lexer.inlineTokens(match[2].trim())   //   any further-nested inline tokens
//       };
//     }
//   },
//   renderer(token) {
//     return `\n<dt>${this.parser.parseInline(token.dt)}</dt><dd>${this.parser.parseInline(token.dd)}</dd>`;
//   },
//   childTokens: ['dt', 'dd'],                 // Any child tokens to be visited by walkTokens
// };

// marked.use({extensions: [descriptionList, description]});

marked.use({
  renderer,
  breaks: true,
  gfm: true,
});

// Function to find the difference between two strings
const lastKnownText = ref('');
const currentText = ref('');
// const blinkingCursor = ref(`
//     <div id="blinking-cursor" class="text-blue-950 text-xs">
// `)

const handleUserInput = (_value: string, formatted: string, audioData?: {
  audioBlob: Blob;
  // audioDuration: number;
  audioUrl: string;
}) => {

  // add the user's response to the conversation
  // scroll to the bottom of the conversation
  scrollToBottom();

  console.log('handle-user-input -> audioData', audioData);

  const userMessage = ref<Conversation>({message: formatted, isUser: true, uniqueId: _.uniqueId('user-'), audioData});

  conversation.value.push(userMessage);

  const aiMessage = ref<Conversation>({message: '', isUser: false, isTyping: true, uniqueId: _.uniqueId('ai-')});

  isGeneratingResponse.value = true;

  setTimeout(() => {
    conversation.value.push(aiMessage);
  }, 500);

  try {
    // send the user's response to the server
    // and wait for the server to send the AI's response
    chatbot.establishConnection(pageId.value, formatted).then((responseStream: Response) => {

      // create a new reader
      const reader2 = responseStream.body?.getReader();

      // read the stream
      return reader2?.read().then((result) => {

        // convert the stream to a string
        const decoder = new TextDecoder();

        let newMessage = decoder.decode(result.value);

        // console.log(newMessage);
        console.log('Start');

        const lastKnownTextTokens = lastKnownText.value.split('~~~NEWLINE~~~');
        // const currentTextTokens = currentText.value.split('~~~NEWLINE~~~');
        const newMessageTokens = newMessage.split('~~~NEWLINE~~~');

        const newTokens = newMessageTokens.filter((token) => {
          return !lastKnownTextTokens.includes(token);
        });

        // for each token in the new message
        newTokens.forEach((token) => {

          // console.log(token)
          // if the token is not in the last known text
          if (!lastKnownTextTokens.includes(token)) {

            const previousToken = currentText.value;

            if (previousToken.length <= token.length) {
              // add the token to the AI message
              aiMessage.value.message = marked.parse(token);
              // add the original message to the AI message
              aiMessage.value.originalMessage = token;
              // + blinkingCursor.value;
              currentText.value = token;

              // add the token to the last known text
              lastKnownTextTokens.push(token);
            }
          } else {
            // add the token to the last known text
            lastKnownTextTokens.push(token);

            console.log(lastKnownTextTokens)
          }
        });

        aiResponses.value.push(newMessage);

        // listen for new data
        return reader2.read().then(function processText({done, value}) {
          // Result objects contain two properties:
          // done  - true if the stream has already given you all its data.
          // value - some data. Always undefined when done is true.
          if (done) {
            console.log("Stream complete");

            console.log(aiResponses.value)

            isGeneratingResponse.value = false;

            aiMessage.value.isTyping = false;

            lastKnownText.value = '';

            currentText.value = '';
            return;
          }

          newMessage = decoder.decode(value);

          // value for fetch streams is a Uint8Array

          const lastKnownTextTokens = lastKnownText.value.split('~~~NEWLINE~~~');
          const newMessageTokens = newMessage.split('~~~NEWLINE~~~');

          const newTokens = newMessageTokens.filter((token) => {
            return !lastKnownTextTokens.includes(token);
          });

          newTokens.forEach((token) => {

            // console.log(token)
            // if the token is not in the last known text
            if (!lastKnownTextTokens.includes(token)) {
              // add the token to the ai message
              // const previousToken = aiMessage.value.message;
              const previousToken = currentText.value;

              if (previousToken.length <= token.length) {
                // add the token to the ai message
                aiMessage.value.message = marked.parse(token);
                // add the original message to the ai message
                aiMessage.value.originalMessage = token;
                // + blinkingCursor.value;
                currentText.value = token;

                // add the token to the last known text
                lastKnownTextTokens.push(token);
              }
            } else {
              // add the token to the last known text
              lastKnownTextTokens.push(token);

              console.log(lastKnownTextTokens)
            }
          });

          // debouncedUpdateResponse(newMessage);
          // console.log(aiMessage.value.message)

          scrollToBottom();
          // Read some more, and call this function again
          return reader2.read().then(processText);
        });
      })
    }).catch((error: Error) => {
      console.log(error);

      scrollToBottom();

      aiMessage.value.hasError = true;
      aiMessage.value.message += `
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative text-sm" role="alert">
            <strong class="font-bold">Oops!</strong>
            <span class="block sm:inline">Something went wrong. Please try again.</span>
        </div>
    `;
      aiMessage.value.isTyping = false;

      isGeneratingResponse.value = false;

      notificationsStore.addNotification('Oops! Something went wrong. Please try again.', 'error');

    }).finally(() => {
      // console.log('finally')
      aiMessage.value.isTyping = false;

      isGeneratingResponse.value = false;
    });
  } catch (error) {
    console.log(error);

    scrollToBottom();

    aiMessage.value.hasError = true;
    aiMessage.value.message += `
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative text-sm" role="alert">
            <strong class="font-bold">Oops!</strong>
            <span class="block sm:inline">Something went wrong. Please try again.</span>
        </div>
    `;
    aiMessage.value.isTyping = false;

    isGeneratingResponse.value = false;

    notificationsStore.addNotification('Oops! Something went wrong. Please try again.', 'error');
  }
};

const isScrollable = ref(false);
const isScrolling = ref(false);
const isBottom = ref(false);

const scrollToBottom = () => {

  // isBottom.value = currentScrollPosition.value >= (conversationContainerHeight.value - viewportHeight.value);

  console.log('isBottom', isBottom.value);

  if (currentScrollPosition.value > 0) {
    isScrollable.value = true;
  }

  // if (isScrolling.value) {
  //   return;
  // }

  const conversationCon = document.querySelector('#user-input-placeholder');

  conversationCon?.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
    inline: 'nearest'
  });

  // console.log('conversationContainerHeight', conversationContainerHeight.value);
  // console.log('userInputContainerHeight', userInputContainerHeight.value);
  // console.log('currentScrollPosition', currentScrollPosition.value);

  // console.log('conversationCon', conversationCon?.

  // conversationContainerRef.value?.scrollTo({
  // top: conversationCon.scrollHeight,
  // top: conversationContainerHeight.value,
  // behavior: 'smooth'
  // });
  // conversationContainerRef.value.scrollTop = conversationContainerHeight.value + (userInputContainerHeight.value * 2) + 100;
};

// Create a variable for toggling the relative and the sticky position
const toggleSticky = computed(() => {
  return (conversationContainerHeight.value + (userInputContainerHeight.value * 2)) > viewportHeight.value;
});

const showScrollToBottomButton = computed(() => {
  // calculate the current scroll position by adding twice the height of the user input container and 100
  const val = currentScrollPosition.value + (userInputContainerHeight.value * 2) + 100;
  console.log( 'conversationContainerHeight', conversationContainerHeight.value)
  return isScrollable.value && !isBottom.value && val > conversationContainerHeight.value;
});

// We'll calculate the viewport height and the height of the conversation container
// to determine when to toggle the sticky position
const viewportHeight = computed(() => {
  console.log('window.innerHeight', window.innerHeight)
  return window.innerHeight;
});

const currentScrollPosition = ref(0);

// We'll also create a variable for the height of the conversation container
const conversationContainerHeight = ref(0);

onMounted(() => {
  // document.querySelector('#main-container')?.addEventListener('scroll', (evt) => {
  document.addEventListener('scroll', (evt) => {
    // console.log(evt)
    // console.log('scrolling')

    currentScrollPosition.value = document.documentElement.scrollTop;

    // we know that the user has reached at the bottom if the current scroll position is greater than or equal to the conversation container height minus the viewport height
    // isBottom.value = currentScrollPosition.value >= (conversationContainerHeight.value - viewportHeight.value);
    isBottom.value = conversationContainerRef.value?.scrollTop >= conversationContainerRef.value?.scrollHeight - conversationContainerRef.value?.clientHeight;

    // console.log({
    //   'scrollHeight': document.documentElement.scrollHeight,
    //   'clientHeight': document.documentElement.clientHeight,
    //   'scrollTop': document.documentElement.scrollTop,
    // });

    // isBottom.value = currentScrollPosition.value >= (conversationContainerHeight.value - viewportHeight.value);
    // isScrolling.value = true;

    // set is scrolling to true if the user is scrolling to the top and has not reached 0
    isScrolling.value = currentScrollPosition.value > 0 && !isBottom.value;

    // console.log('isBottom', isBottom.value);
    // console.log('isScrolling', isScrolling.value);
    // console.log('conversationContainerHeight', conversationContainerHeight.value);
    // console.log('userInputContainerHeight', userInputContainerHeight.value);
    // console.log('currentScrollPosition', currentScrollPosition.value)
  });

  // conversationContainerHeight.value = conversationContainerRef.value?.clientHeight || 0;

  // console.log('conversationContainerHeight', conversationContainerHeight.value);

  setTimeout(() => {
    scrollToBottom();
  }, 800);
});

// watch over the conversation array
watch(conversation.value, () => {
  // get the height of the conversation container
  conversationContainerHeight.value = conversationContainerRef.value?.clientHeight || 0;

  // isBottom.value = conversationContainerRef.value?.scrollTop >= conversationContainerRef.value?.scrollHeight - conversationContainerRef.value?.clientHeight;

  // isBottom

  scrollToBottom();
  // if the conversation container height is greater than the viewport height
  // toggleSticky.value =
});
</script>

<template>
  <div class="bg-requested-color">

    <!-- Sidebar -->
    <div id="application-sidebar"
         class="hs-overlay hs-overlay-open:translate-x-0 -translate-x-full duration-300 transform hidden fixed top-0 start-0 bottom-0 z-[60] w-64 bg-white border-e border-gray-200 overflow-y-auto lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-slate-700 dark:[&::-webkit-scrollbar-thumb]:bg-slate-500 dark:bg-slate-900 dark:border-gray-700">
      <nav class="hs-accordion-group w-full h-full flex flex-col" data-hs-accordion-always-open>
        <div class="flex items-center justify-between pt-4 pe-4 ps-7">
          <!-- Logo -->
          <svg class="w-28 h-auto" width="116" height="32" viewBox="0 0 116 32" fill="none"
               xmlns="http://www.w3.org/2000/svg">
            <path
                d="M33.5696 30.2968V10.7968H37.4474V13.1789H37.6229C37.7952 12.7972 38.0445 12.4094 38.3707 12.0155C38.7031 11.6154 39.134 11.283 39.6634 11.0183C40.1989 10.7475 40.8636 10.6121 41.6577 10.6121C42.6918 10.6121 43.6458 10.8829 44.5199 11.4246C45.3939 11.9601 46.0926 12.7695 46.6158 13.8529C47.139 14.93 47.4006 16.2811 47.4006 17.9061C47.4006 19.488 47.1451 20.8237 46.6342 21.9132C46.1295 22.9966 45.4401 23.8183 44.5661 24.3784C43.6982 24.9324 42.7256 25.2094 41.6484 25.2094C40.8852 25.2094 40.2358 25.0832 39.7003 24.8308C39.1709 24.5785 38.737 24.2615 38.3984 23.8799C38.0599 23.4921 37.8014 23.1012 37.6229 22.7073H37.5028V30.2968H33.5696ZM37.4197 17.8877C37.4197 18.7309 37.5367 19.4665 37.7706 20.0943C38.0045 20.7222 38.343 21.2115 38.7862 21.5624C39.2294 21.9071 39.768 22.0794 40.402 22.0794C41.0421 22.0794 41.5838 21.904 42.027 21.5532C42.4702 21.1961 42.8056 20.7037 43.0334 20.0759C43.2673 19.4419 43.3842 18.7125 43.3842 17.8877C43.3842 17.069 43.2704 16.3488 43.0426 15.7272C42.8149 15.1055 42.4794 14.6192 42.0362 14.2683C41.593 13.9175 41.0483 13.7421 40.402 13.7421C39.7618 13.7421 39.2202 13.9113 38.777 14.2499C38.34 14.5884 38.0045 15.0685 37.7706 15.6902C37.5367 16.3119 37.4197 17.0444 37.4197 17.8877ZM49.2427 24.9786V10.7968H53.0559V13.2712H53.2037C53.4622 12.391 53.8961 11.7262 54.5055 11.2769C55.1149 10.8214 55.8166 10.5936 56.6106 10.5936C56.8076 10.5936 57.02 10.6059 57.2477 10.6306C57.4754 10.6552 57.6755 10.689 57.8478 10.7321V14.2222C57.6632 14.1668 57.4077 14.1175 57.0815 14.0745C56.7553 14.0314 56.4567 14.0098 56.1859 14.0098C55.6073 14.0098 55.0903 14.136 54.6348 14.3884C54.1854 14.6346 53.8284 14.9793 53.5638 15.4225C53.3052 15.8657 53.176 16.3765 53.176 16.9551V24.9786H49.2427ZM64.9043 25.2556C63.4455 25.2556 62.1898 24.9601 61.1373 24.3692C60.0909 23.7721 59.2845 22.9289 58.7182 21.8394C58.1519 20.7437 57.8688 19.448 57.8688 17.9523C57.8688 16.4935 58.1519 15.2132 58.7182 14.1114C59.2845 13.0096 60.0816 12.1509 61.1096 11.5354C62.1437 10.9199 63.3563 10.6121 64.7474 10.6121C65.683 10.6121 66.5539 10.7629 67.3603 11.0645C68.1728 11.36 68.8806 11.8062 69.4839 12.4033C70.0932 13.0004 70.5672 13.7513 70.9057 14.6561C71.2443 15.5548 71.4135 16.6074 71.4135 17.8138V18.8941H59.4384V16.4566H67.7111C67.7111 15.8903 67.588 15.3886 67.3418 14.9516C67.0956 14.5146 66.754 14.1729 66.317 13.9267C65.8861 13.6744 65.3844 13.5482 64.812 13.5482C64.2149 13.5482 63.6856 13.6867 63.2239 13.9637C62.7684 14.2345 62.4114 14.6007 62.1529 15.0624C61.8944 15.5179 61.762 16.0257 61.7559 16.5858V18.9033C61.7559 19.605 61.8851 20.2113 62.1437 20.7222C62.4083 21.2331 62.7807 21.627 63.2608 21.904C63.741 22.181 64.3103 22.3195 64.9689 22.3195C65.406 22.3195 65.8061 22.2579 66.1692 22.1348C66.5324 22.0117 66.8432 21.8271 67.1018 21.5808C67.3603 21.3346 67.5572 21.033 67.6927 20.676L71.3304 20.9161C71.1458 21.7901 70.7672 22.5534 70.1948 23.2058C69.6285 23.8522 68.896 24.3569 67.9974 24.7201C67.1048 25.0771 66.0738 25.2556 64.9043 25.2556ZM77.1335 6.06949V24.9786H73.2003V6.06949H77.1335ZM79.5043 24.9786V10.7968H83.4375V24.9786H79.5043ZM81.4801 8.96863C80.8954 8.96863 80.3937 8.77474 79.9752 8.38696C79.5628 7.99302 79.3566 7.52214 79.3566 6.97431C79.3566 6.43265 79.5628 5.96792 79.9752 5.58014C80.3937 5.1862 80.8954 4.98923 81.4801 4.98923C82.0649 4.98923 82.5635 5.1862 82.9759 5.58014C83.3944 5.96792 83.6037 6.43265 83.6037 6.97431C83.6037 7.52214 83.3944 7.99302 82.9759 8.38696C82.5635 8.77474 82.0649 8.96863 81.4801 8.96863ZM89.7415 16.7797V24.9786H85.8083V10.7968H89.5569V13.2989H89.723C90.037 12.4741 90.5632 11.8216 91.3019 11.3415C92.0405 10.8552 92.9361 10.6121 93.9887 10.6121C94.9735 10.6121 95.8322 10.8275 96.5647 11.2584C97.2971 11.6893 97.8665 12.3048 98.2728 13.105C98.679 13.899 98.8821 14.8469 98.8821 15.9487V24.9786H94.9489V16.6505C94.9551 15.7826 94.7335 15.1055 94.2841 14.6192C93.8348 14.1268 93.2162 13.8806 92.4283 13.8806C91.8989 13.8806 91.4311 13.9944 91.0249 14.2222C90.6248 14.4499 90.3109 14.7823 90.0831 15.2193C89.8615 15.6502 89.7477 16.1703 89.7415 16.7797ZM107.665 25.2556C106.206 25.2556 104.951 24.9601 103.898 24.3692C102.852 23.7721 102.045 22.9289 101.479 21.8394C100.913 20.7437 100.63 19.448 100.63 17.9523C100.63 16.4935 100.913 15.2132 101.479 14.1114C102.045 13.0096 102.842 12.1509 103.87 11.5354C104.905 10.9199 106.117 10.6121 107.508 10.6121C108.444 10.6121 109.315 10.7629 110.121 11.0645C110.934 11.36 111.641 11.8062 112.245 12.4033C112.854 13.0004 113.328 13.7513 113.667 14.6561C114.005 15.5548 114.174 16.6074 114.174 17.8138V18.8941H102.199V16.4566H110.472C110.472 15.8903 110.349 15.3886 110.103 14.9516C109.856 14.5146 109.515 14.1729 109.078 13.9267C108.647 13.6744 108.145 13.5482 107.573 13.5482C106.976 13.5482 106.446 13.6867 105.985 13.9637C105.529 14.2345 105.172 14.6007 104.914 15.0624C104.655 15.5179 104.523 16.0257 104.517 16.5858V18.9033C104.517 19.605 104.646 20.2113 104.905 20.7222C105.169 21.2331 105.542 21.627 106.022 21.904C106.502 22.181 107.071 22.3195 107.73 22.3195C108.167 22.3195 108.567 22.2579 108.93 22.1348C109.293 22.0117 109.604 21.8271 109.863 21.5808C110.121 21.3346 110.318 21.033 110.454 20.676L114.091 20.9161C113.907 21.7901 113.528 22.5534 112.956 23.2058C112.389 23.8522 111.657 24.3569 110.758 24.7201C109.866 25.0771 108.835 25.2556 107.665 25.2556Z"
                fill="currentColor" class="fill-blue-600 dark:fill-white"/>
            <path
                d="M1 28.9786V15.9786C1 9.35116 6.37258 3.97858 13 3.97858C19.6274 3.97858 25 9.35116 25 15.9786C25 22.606 19.6274 27.9786 13 27.9786H12"
                class="stroke-blue-600 dark:stroke-white" stroke="currentColor" stroke-width="2"/>
            <path
                d="M5 28.9786V16.1386C5 11.6319 8.58172 7.97858 13 7.97858C17.4183 7.97858 21 11.6319 21 16.1386C21 20.6452 17.4183 24.2986 13 24.2986H12"
                class="stroke-blue-600 dark:stroke-white" stroke="currentColor" stroke-width="2"/>
            <circle cx="13" cy="16" r="5" fill="currentColor" class="fill-blue-600 dark:fill-white"/>
          </svg>
          <!-- End Logo -->
        </div>

        <div class="h-full">
          <!-- List -->
          <ul class="space-y-1.5 p-4">
            <li>
              <a class="flex items-center gap-x-3 py-2 px-3 text-sm text-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-slate-400 dark:hover:text-slate-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                 href="#">
                <svg class="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                     viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                     stroke-linejoin="round">
                  <path d="M5 12h14"/>
                  <path d="M12 5v14"/>
                </svg>
                New chat
              </a>
            </li>
            <li>
              <a class="flex items-center gap-x-3 py-2 px-3 text-sm text-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-slate-400 dark:hover:text-slate-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                 href="#">
                <svg class="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                     fill="currentColor" viewBox="0 0 16 16">
                  <path
                      d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"/>
                </svg>
                Preline AI Discord
              </a>
            </li>
            <li>
              <a class="flex items-center gap-x-3 py-2 px-3 text-sm text-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-slate-400 dark:hover:text-slate-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                 href="#">
                <svg class="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                     viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                     stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" x2="12" y1="15" y2="3"/>
                </svg>
                Save conversation
              </a>
            </li>
            <li>
              <a class="flex items-center gap-x-3 py-2 px-3 text-sm text-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-slate-400 dark:hover:text-slate-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                 href="#">
                <svg class="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                     viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                     stroke-linejoin="round">
                  <path d="m22 2-7 20-4-9-9-4Z"/>
                  <path d="M22 2 11 13"/>
                </svg>
                Updates & FAQ
              </a>
            </li>
            <li>
              <a class="flex items-center gap-x-3 py-2 px-3 text-sm text-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-slate-400 dark:hover:text-slate-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                 href="#">
                <svg class="flex-shrink-0 w-4 h-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24"
                     height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                     stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                <span
                    class="bg-clip-text bg-gradient-to-tl from-blue-600 to-violet-600 text-transparent">Upgrade Plan</span>
              </a>
            </li>
          </ul>
          <!-- End List -->
        </div>

        <!-- Footer -->
        <div class="mt-auto">
          <div class="py-2.5 px-7">
            <p class="inline-flex items-center gap-x-2 text-xs text-green-600">
              <span class="block w-1.5 h-1.5 rounded-full bg-green-600"></span>
              Active 12,320 people
            </p>
          </div>

          <div class="p-4 border-t border-gray-200 dark:border-gray-700">
            <a class="flex justify-between items-center gap-x-3 py-2 px-3 text-sm text-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-slate-400 dark:hover:text-slate-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
               href="#">
              Sign in
              <svg class="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                   viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                   stroke-linejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" x2="3" y1="12" y2="12"/>
              </svg>
            </a>
          </div>
        </div>
        <!-- End Footer -->
      </nav>
    </div>
    <!-- End Sidebar -->

    <div ref="conversationContainerRef" id="main-container" class="relative min-h-screen w-full lg:ps-64">
      <div class="py-10 lg:py-14">
        <!-- Title -->
        <div class="max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto text-center">
          <h1 class="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-white">
            Welcome to {{ chatbotName }} AI
          </h1>
          <p class="mt-3 text-gray-600 dark:text-gray-400">
<!--            Your AI-powered copilot for the web-->
            Here to help you with your questions
          </p>
        </div>
        <div class="grow mt-14">
          <!-- End Title -->
          <Transition mode="out-in" name="slide-in">
            <template v-if="!appIsFetching">
              <div class="">
                <ChatbotBubble :key="1" :chatbot-message="staticGreeting" :chatbot-name="chatbotName"
                               :is-typing="false"/>

                <ul class="space-y-5">
                  <template v-for="(message, index) in conversation" :key="index">
                    <UserBubble
                        v-if="message.value.isUser && message.value.message && message.value.message.length > 0"
                        :key="message.value.uniqueId" :user-message="message.value.message" :audio-data="message.value?.audioData"
                        user-name="John Doe"/>
                    <ChatbotBubble
                        v-else-if="!message.value.isUser"
                        :key="message.value.uniqueId" :chatbot-message="message.value.message"
                        :chatbot-name="chatbotName"
                        :disclosure-message="pageContent?.closureMessage"
                        :has-disclosure-message="pageContent?.displayClosureMessage"
                        :has-error="message.value?.hasError"
                        :is-copyable="index !== 0"
                        :original-message="message.value?.originalMessage"
                        :is-typing="message.value?.isTyping"/>
                  </template>
                </ul>
              </div>
            </template>
            <template v-else-if="appIsFetching">
              <LoadingOverlay :show="appIsFetching"/>
            </template>
          </Transition>
        </div>
      </div>
      <div ref="userInputContainerHeightRef"
           class="sticky w-full bottom-0">
        <div class="relative">
          <button v-if="showScrollToBottomButton"
                  class="absolute -top-4 right-1/2 rounded-full bg-neutral-500 shadow-lg shadow-slate-300/10 p-2 opacity-30 hover:opacity-100 transition-opacity duration-300 active:scale-95 focus:outline-none"
                  @click="scrollToBottom">
            <svg class="h-5 w-5 text-slate-200" fill="none" stroke="currentColor"
                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3" stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="2"/>
            </svg>
          </button>
          <div class="py-4 bg-gradient-to-t from-requested-color block"></div>
          <div class="bg-requested-color w-full px-4 md:px-6 pb-8 flex-1">
            <div class="grid grid-cols-1 w-11/12 md:w-10/12 mx-auto">
              <UserInput :disabled="false" :is-generating="isGeneratingResponse"
                         :prompt-placeholder="promptPlaceholder"
                         user-input=""
                         @userInput="handleUserInput"/>
            </div>
          </div>
        </div>
      </div>
      <div id="user-input-placeholder"></div>
    </div>
  </div>
</template>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.fade-slide-enter, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/** let's have the animation run on the same element as the transition */
.message-enter-active,
.message-leave-active {
  transition: all 0.5s ease-in;
}

/** this is the starting state of the enter animation */
.message-enter {
  opacity: 0;
  transform: translateX(-20px);
}

/** this is the ending state of the enter animation */
.message-enter-to {
  opacity: 1;
  transform: translateX(0);
}

/** this is the starting state of the leave animation */
.message-leave {
  opacity: 1;
  transform: translateX(0);
}

/** this is the ending state of the leave animation */
.message-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

#blinking-cursor {
  width: 2px; /* Adjust the width of the cursor */
  height: 24px; /* Adjust the height of the cursor */
  background-color: black; /* Cursor color */
  animation: blink 0.65s step-end infinite; /* Blinking animation */
}

/* Define the blinking animation */
@keyframes blink {
  0%, 100% {
    opacity: 1; /* Cursor visible */
  }
  50% {
    opacity: 0; /* Cursor hidden */
  }
}
</style>
