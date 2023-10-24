<script lang="ts" setup>
import UserBubble from "../../components/Chat/UserBubble.vue";
import UserInput from "../../components/Chat/UserInput.vue";
import ChatbotBubble from "../../components/Chat/ChatbotBubble.vue";
import {computed, onBeforeMount, onMounted, Ref, ref, watch} from "vue";
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

// set page metadata

// sample data

// Array for the AI's responses
// const aiResponses = ref([
//   "Hi Ivy, congratulations on your first day at Sunnings Hotel! You've got this.",
//   "Don't worry, you'll do great. Everyone is here to support you.",
//   "No need to stress about the cup ramen order. I'll help you through it.",
//   `Preparing cup ramen is simple. Just follow these steps:<br>
//     <b>Step 1:</b> Boil water in a kettle or microwave until it's hot but not boiling.<br>
//     <b>Step 2:</b> While the water is heating, open the cup ramen packaging and remove the flavoring packet.<br>
//     <b>Step 3:</b> Once the water is ready, pour it into the cup, filling it about halfway.<br>
//     <b>Step 4:</b> Close the lid to let the noodles cook for about 2-3 minutes.<br>
//     <b>Step 5:</b> Open the lid, and carefully add the flavoring from the packet.<br>
//     <b>Step 6:</b> Stir the noodles and flavoring together. You can also add some optional ingredients like sliced vegetables or a boiled egg.<br>
//     <b>Step 7:</b> Let it sit for another minute to let the flavors meld.<br>
//     <b>Step 8:</b> Your cup ramen is ready to serve! Just be cautious of the hot steam when you open the lid.<br>
//     Remember Ivy, it's okay to ask for help if you need it. Everyone starts somewhere, and you'll get the hang of it!`,
//   "You're welcome, Ivy! If you have any more questions or need assistance, feel free to ask.",
//   "I'm here to help. You're doing great, and you'll learn the ropes in no time.",
//   "Keep that positive attitude, Ivy! You're on your way to becoming an excellent waitress.",
//   "Best of luck on your first day, Ivy! Remember, every challenge is an opportunity to learn and grow."
// ]);
//
// // Array for the user's responses
// const userResponses = ref([
//   "I'm really nervous about my first day at Sunnings Hotel.",
//   "I hope I can handle everything they throw at me.",
//   "Oh no, I have an order for cup ramen, and I'm not even a cook!",
//   "I should probably ask someone for help. Maybe I can find a quick recipe."
// ]);
//
interface Conversation {
  message: string;
  isUser: boolean;
  isTyping?: boolean;
  hasError?: boolean;
  uniqueId: string | number;
}

const conversationContainerRef = ref<HTMLDivElement | null>();
const userInputContainerHeight = computed(() => {
  return userInputContainerHeightRef.value?.clientHeight || 0;
});
const userInputContainerHeightRef = ref<HTMLDivElement | null>();
const conversation = ref<Ref<Conversation>[]>([]);
const aiResponses = ref<string[]>([]);
const isGeneratingResponse = ref(false);

// create sample conversations from the sample data

const scrollToBottom = () => {
  const conversationCon = document.querySelector('#user-input-placeholder');

  conversationCon?.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
    inline: 'nearest'
  });
};

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
       <pre class="w-full"><div class="mockup-code bg-neutral-800 my-3 relative shadow-xl w-full overflow-auto"><div class="px-4 flex-1 overflow-auto h-full w-full"><code class="language-${language}">${hljs.highlight(code, {language, ignoreIllegals}).value}</code></div></div></pre>
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

const handleUserInput = (_value: string, formatted: string) => {

  // add the user's response to the conversation
  // scroll to the bottom of the conversation
  scrollToBottom();

  const userMessage = ref<Conversation>({message: formatted, isUser: true, uniqueId: _.uniqueId('user-')});

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
                aiMessage.value.message = marked.parse(token)
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

// const aiResponseHtmlConverter = (message: string) => {
//   return message.replace(/(?:\r\n|\r|\n)/g, '<br>');
// };

// convert '```' to '<pre><code>' and '```' to '</code></pre>'
// const aiResponseCodeConverter = (message: string) => {
//   const regex = /```/g;
//   const subst = `<pre><div class="mockup-code"><code>`;
//
//   // The substituted value will be contained in the result variable
//   let result = message.replace(regex, subst);
//
//   const regex2 = /```/g;
//   const subst2 = `</code></div></pre>`;
//
//   // The substituted value will be contained in the result variable
//   result = result.replace(regex2, subst2);
//
//   return result;
// };

// const tableProcessor = (inputText: string) => {
//   const rows = inputText.trim().split('\n').map(row => row.split('|').map(cell => cell.trim()));
//   // if (rows.length < 3) {
//   //   // Not enough rows to form a table
//   //   return '';
//   // }
//
//   const headerRow = rows[0];
//   const headerCells = headerRow.map(cell => `<th>${cell}</th>`).join('');
//
//   const bodyRows = rows.slice(2).map(row => {
//     const bodyCells = row.map(cell => `<td>${cell}</td>`).join('');
//     return `<tr>${bodyCells}</tr>`;
//   }).join('');
//
//   return `<div class="overflow-x-auto">
//         <table class="table table-zebra">
//         <thead>
//             <tr>${headerCells}</tr>
//         </thead>
//         <tbody>
//             ${bodyRows}
//         </tbody>
//     </table>
//     </div>`;
// }
//
// handle openAI tables

// Create a variable for toggling the relative and the sticky position
const toggleSticky = computed(() => {
  return (conversationContainerHeight.value + (userInputContainerHeight.value * 2)) > viewportHeight.value;
});

const showScrollToBottomButton = computed(() => {
  // calculate the current scroll position by adding twice the height of the user input container and 100
  const val = currentScrollPosition.value + (userInputContainerHeight.value * 2) + 100;
  return val < conversationContainerHeight.value;
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
  document.querySelector('#main-container')?.addEventListener('scroll', (evt) => {
    currentScrollPosition.value = (evt.target as HTMLDivElement).scrollTop;
  });

  conversationContainerHeight.value = conversationContainerRef.value?.clientHeight || 0;

  setTimeout(() => {
    scrollToBottom();
  }, 800);
});

// watch over the conversation array
watch(conversation.value, () => {
  // get the height of the conversation container
  conversationContainerHeight.value = conversationContainerRef.value?.clientHeight || 0;

  scrollToBottom();
  // if the conversation container height is greater than the viewport height
  // toggleSticky.value =
});
</script>

<template>
  <Transition mode="out-in" name="slide-in">
    <template v-if="!appIsFetching">
      <div id="main-container" :class="!toggleSticky ? 'relative' : ''" class="flex-1 overflow-scroll flex flex-col">
        <div class="pt-10 md:pt-20">
          <!-- Simulate a conversation loop -->
          <div ref="conversationContainerRef" class="grid grid-cols-1 gap-7 w-9/12 mx-auto mb-10">
            <ChatbotBubble :key="1" :chatbot-message="staticGreeting" :chatbot-name="chatbotName"
                           :is-typing="false"/>

            <div v-for="(message, index) in conversation" :key="index">
              <UserBubble v-if="message.value.isUser && message.value.message && message.value.message.length > 0"
                          :key="message.value.uniqueId" :user-message="message.value.message" user-name="John Doe"/>
              <ChatbotBubble
                  v-else-if="!message.value.isUser"
                  :key="message.value.uniqueId" :chatbot-message="message.value.message"
                  :chatbot-name="chatbotName"
                  :disclosure-message="pageContent?.closureMessage"
                  :has-disclosure-message="pageContent?.displayClosureMessage"
                  :has-error="message.value?.hasError"
                  :is-copyable="index !== 0"
                  :is-typing="message.value?.isTyping"/>
            </div>
          </div>
        </div>
        <div v-if="toggleSticky" id="user-input-placeholder"
             :style="{'padding-bottom': userInputContainerHeight + 'px'}">
        </div>
        <div v-if="showScrollToBottomButton" class="absolute bottom-2 right-0 mb-32 mr-8 md:mr-12 z-40">
          <button class="rounded-full bg-white shadow-lg shadow-slate-300/10 p-2"
                  @click="scrollToBottom">
            <svg class="h-6 w-6 text-gray-500" fill="none" stroke="currentColor"
                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3" stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="2"/>
            </svg>
          </button>
        </div>
        <div ref="userInputContainerHeightRef"
             :class="!toggleSticky ? 'sticky' : 'absolute'" class="w-full bottom-0">
          <div class="py-6 bg-gradient-to-t from-requested-color block"></div>
          <div class="bg-requested-color w-full px-4 md:px-6 pb-14 flex-1">
            <div class="grid grid-cols-1 w-11/12 md:w-10/12 mx-auto">
              <UserInput :disabled="false" :is-generating="isGeneratingResponse" :prompt-placeholder="promptPlaceholder"
                         user-input=""
                         @userInput="handleUserInput"/>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="appIsFetching">
      <LoadingOverlay :show="appIsFetching"/>
    </template>
  </Transition>
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
