<script lang="ts" setup>
import UserBubble from "@/components/Chat/UserBubble.vue";
import UserInput from "@/components/Chat/UserInput.vue";
import ChatbotBubble from "@/components/Chat/ChatbotBubble.vue";
import {computed, onBeforeMount, onMounted, Ref, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {PageContent, usePageContentStore} from "@/stores/admin/page-data.ts";
import {useChatbotStore} from "@/stores/chatbot";
import {marked} from "marked";
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import _ from 'lodash';
import hljs from 'highlight.js';
import {useNotificationsStore} from "@/stores/notifications.ts";

const notificationsStore = useNotificationsStore();

const route = useRoute();
const pageContentStore = usePageContentStore();
const chatbot = useChatbotStore();
const router = useRouter();

const appIsFetching = ref(true);

const page = ref(route.params.chatbotId);
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
// for (let i = 0; i < aiResponses.value.length; i++) {
//   conversation.value.push({message: userResponses.value[i], isUser: true});
//   conversation.value.push({message: aiResponses.value[i], isUser: false});
// }

const scrollToBottom = () => {
  const conversationCon = document.querySelector('#user-input-placeholder');

  conversationCon?.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
    inline: 'nearest'
  });
};

// const renderer = new marked.Renderer();
//
// renderer.link = (href, title, text) => {
//   return `<a target="_blank" class="link link-primary" href="${href}" title="${title}">${text}</a>`;
// };
//
// renderer.table = (header, body) => {
//   return `
//    <div class="bg-white p-3 rounded-xl shadow-lg shadow-slate-300/10 my-3">
//     <div class="overflow-x-auto py-4">
//         <table class="table table-zebra border">
//         <thead>
//             ${header}
//         </thead>
//         <tbody>
//             ${body}
//         </tbody>
//     </table>
//     </div>
//     </div>
//   `;
// };
//
// renderer.tablerow = (content) => {
//   return `
//     <tr class="hover">${content}</tr>
//   `;
// };
//
// renderer.tablecell = (content, flags) => {
//   return `
//     <td>${content}</td>
//   `;
// };
//
// renderer.code = (code, language, isEscaped) => {
// // return `
// //   <pre><div class="mockup-code my-3"><div class="px-4"><code>${code}</code></div></div></pre>
// // `;
//
//   if (language) {
//     const ignoreIllegals = true;
//     return `
//   <div class="p-3">
//       <pre><div class="mockup-code bg-neutral-800 my-3 relative shadow-xl"><div class="px-4"><code class="language-${language}">${hljs.highlight(code, {language, ignoreIllegals}).value}</code></div></div></pre>
//   </div>
//     `;
//   } else {
//     return `
//   <div class="p-3">
//     <pre><div class="mockup-code bg-neutral-800 my-3"><div class="px-4"><code>${code}</code></div></div></pre>
//   </div>
//   `;
//   }
//
// };
//
// renderer.list = (body, ordered, start) => {
//
//   if (ordered) {
//     // if (start) {
//     //   return `
//     //   <ol start="${start}" class="list-decimal list-outside my-2 py-2 space-y-2">${body}</ol>
//     // `;
//     // }
//     return `
//       <ol class="list-decimal list-outside my-2 py-2 space-y-2">${body}</ol>
//     `;
//   } else {
//     return `
//       <ul class="list-disc list-outside my-2 py-2 space-y-2">${body}</ul>
//     `;
//   }
// };
//
// renderer.listitem = (text) => {
//   return `
//     <li class="text-neutral-800 dark:text-neutral-50">${text}</li>
//   `;
// };
//
// // renderer.paragraph = (text) => {
// //   return `
// //     <p class="text-neutral-800 dark:text-neutral-50">${text}</p>
// //   `;
// // };
// //
// renderer.heading = (text, level, raw, slugger) => {
//   return `
//     <h${level} class="text-2xl font-poppins-bold text-neutral-800 dark:text-neutral-50">${text}</h${level}>
//   `;
// };
//
// renderer.hr = () => {
//   return `
//     <hr class="my-4 border-neutral-200 dark:border-neutral-700"/>
//   `;
// };
//
// renderer.blockquote = (quote) => {
//   return `
//     <blockquote class="my-4 border-l-4 border-neutral-200 dark:border-neutral-700 pl-4">${quote}</blockquote>
//   `;
// };
//
// renderer.image = (href, title, text) => {
//   return `
//     <img src="${href}" alt="${text}" title="${title}" class="w-full"/>
//   `;
// };
//
// renderer.strong = (text) => {
//   return `
//     <strong class="font-poppins-semi-bold my-1 text-base">${text}</strong>
//   `;
// };
//
// renderer.codespan = (code) => {
//   // return `
//   //   <pre><div class="mockup-code"><div class="px-4"><code>${code}</code></div></div></pre>
//   // `;
//
//   // we'll rather render this like in chatGPT
//   return `
//     <code class="font-poppins-semi-bold my-1">&acute;${code}&acute;</code>
//   `;
// };

const renderer = {
  link(href, title, text) {
    return `<a target="_blank" class="link link-primary" href="${href}" title="${title}">${text}</a>`;
  },
  table(header, body) {
    return `
   <div class="bg-white p-3 rounded-xl shadow-lg shadow-slate-300/10 my-3">
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
  tablerow(content) {
    return `
    <tr class="hover">${content}</tr>
  `;
  },
  tablecell(content, flags) {
    return `
    <td>${content}</td>
  `;
  },
  code(code, language, isEscaped) {
    // return `
    //   <pre><div class="mockup-code my-3"><div class="px-4"><code>${code}</code></div></div></pre>
    // `;

    if (language) {
      const ignoreIllegals = true;
      return `
  <div class="p-3">
       <pre><div class="mockup-code bg-neutral-800 my-3 relative shadow-xl"><div class="px-4"><code class="language-${language}">${hljs.highlight(code, {language, ignoreIllegals}).value}</code></div></div></pre>
  </div>
    `;
    } else {
      return `
  <div class="p-3">
    <pre><div class="mockup-code bg-neutral-800 my-3"><div class="px-4"><code>${code}</code></div></div></pre>
  </div>
  `;
    }
  },
  list(body, ordered, start) {
    if (ordered) {
      if (start) {
        return `
         <div class="my-2 py-2">
            <ol start="${start}" class="list-decimal list-outside mx-5">${body}</ol>
         </div>
      `;
      }
      return `
         <div class="my-2 py-2">
            <ol class="list-decimal mx-5 list-outside">${body}</ol>
         </div>
    `;
    } else {
      return `
         <div class="my-2 py-2">
            <ul class="list-disc list-outside mx-5">${body}</ul>
         </div>
    `;
    }
  },
  listitem(text) {
    return `
    <li class="text-neutral-800 dark:text-neutral-50">${text}</li>
  `;
  },
  paragraph(text) {
    return `
    <p class="text-neutral-800 dark:text-neutral-50">${text}</p>
  `;
  },
  heading(text, level, raw, slugger) {
    return `
    <h${level} class="text-2xl font-poppins-bold text-neutral-800 dark:text-neutral-50">${text}</h${level}>
  `;
  },
  hr() {
    return `
    <hr class="my-4 border-neutral-200 dark:border-neutral-700"/>
  `;
  },
  blockquote(quote) {
    return `
    <blockquote class="my-4 border-l-4 border-neutral-200 dark:border-neutral-700 pl-4">${quote}</blockquote>
  `;
  },
  image(href, title, text) {
    return `
    <img src="${href}" alt="${text}" title="${title}" class="w-full"/>
  `;
  },
  strong(text) {
    return `
    <strong class="font-poppins-semi-bold my-1 text-base">${text}</strong>
  `;
  },
  codespan(code) {
    // return `
    //   <pre><div class="mockup-code"><div class="px-4"><code>${code}</code></div></div></pre>
    // `;

    // we'll rather render this like in chatGPT
    return `
    <code class="font-poppins-semi-bold my-1">&acute;${code}&acute;</code>
  `;
  },
  descriptionList(body) {
    return `
    <dl>${body}</dl>
  `;
  },
  description(dt, dd) {
    return `
    <dt>${dt}</dt>
    <dd>${dd}</dd>
  `;
  }
};

// const walkTokens = (token) => {
//   let html = '';
//
//   // tokens.forEach((token) => {
//   if (token.type === 'text') {
//     html += token.text;
//   } else if (token.type === 'paragraph') {
//     html += `<p class="text-neutral-800 dark:text-neutral-50">${walkTokens(token.tokens)}</p>`;
//   } else if (token.type === 'strong') {
//     html += `<strong class="font-poppins-bold my-1">${walkTokens(token.tokens)}</strong>`;
//   } else if (token.type === 'codespan') {
//     html += `<code class="font-poppins-semi-bold my-1">${token.text}</code>`;
//   } else if (token.type === 'code') {
//     html += `<pre><div class="mockup-code my-3"><div class="px-4"><code class="language-${token.lang}">${token.text}</code></div></div></pre>`;
//   } else if (token.type === 'blockquote') {
//     html += `<blockquote class="my-4 border-l-4 border-neutral-200 dark:border-neutral-700 pl-4">${walkTokens(token.tokens)}</blockquote>`;
//   } else if (token.type === 'list') {
//     html += `<${token.ordered ? 'ol' : 'ul'} class="${token.ordered ? 'list-decimal' : 'list-disc'} list-inside my-2 py-2 gap-2">${walkTokens(token.tokens)}</${token.ordered ? 'ol' : 'ul'}>`;
//   } else if (token.type === 'list_item') {
//     html += `<li>${walkTokens(token.tokens)}</li>`;
//   } else if (token.type === 'table') {
//     html += `
//         <div class="overflow-x-auto py-4">
//             <table class="table table-zebra">
//             <thead>
//                 ${walkTokens(token.tokens.header)}
//             </thead>
//             <tbody>
//                 ${walkTokens(token.tokens.body)}
//             </tbody>
//         </table>
//         </div>
//       `;
//   } else if (token.type === 'table_row') {
//     html += `<tr>${walkTokens(token.tokens)}</tr>`;
//   } else if (token.type === 'table_cell') {
//     html += `<td>${walkTokens(token.tokens)}</td>`;
//   } else if (token.type === 'link') {
//     html += `<a target="_blank" class="link link-primary" href="${token.href}" title="${token.title}">${token.text}</a>`;
//   } else if (token.type === 'image') {
//     html += `<img src="${token.href}" alt="${token.text}" title="${token.title}" class="w-full"/>`;
//   } else if (token.type === 'heading') {
//     html += `<h${token.depth} class="text-2xl font-bold text-neutral-800 dark:text-neutral-50">${walkTokens(token.tokens)}</h${token.depth}>`;
//   } else if (token.type === 'hr') {
//     html += `<hr class="my-4 border-neutral-200 dark:border-neutral-700"/>`;
//   } else {
//     html += token.text;
//   }
//   // });
//
//   return html;
// };


// create a custom description list renderer

const descriptionList = {
  name: 'descriptionList',
  level: 'block',                                     // Is this a block-level or inline-level tokenizer?
  start(src) {
    return src.match(/:[^:\n]/)?.index;
  }, // Hint to Marked.js to stop and check for a match
  tokenizer(src, tokens) {
    const rule = /^(?::[^:\n]+:[^:\n]*(?:\n|$))+/;    // Regex for the complete token, anchor to string start
    const match = rule.exec(src);
    if (match) {
      const token = {                                 // Token to generate
        type: 'descriptionList',                      // Should match "name" above
        raw: match[0],                                // Text to consume from the source
        text: match[0].trim(),                        // Additional custom properties
        tokens: []                                    // Array where child inline tokens will be generated
      };
      this.lexer.inline(token.text, token.tokens);    // Queue this data to be processed for inline tokens
      return token;
    }
  },
  renderer(token) {
    return `<dl>${this.parser.parseInline(token.tokens)}\n</dl>`; // parseInline to turn child tokens into HTML
  }
};

const description = {
  name: 'description',
  level: 'inline',                                 // Is this a block-level or inline-level tokenizer?
  start(src) {
    return src.match(/:/)?.index;
  },    // Hint to Marked.js to stop and check for a match
  tokenizer(src, tokens) {
    const rule = /^:([^:\n]+):([^:\n]*)(?:\n|$)/;  // Regex for the complete token, anchor to string start
    const match = rule.exec(src);
    if (match) {
      return {                                         // Token to generate
        type: 'description',                           // Should match "name" above
        raw: match[0],                                 // Text to consume from the source
        dt: this.lexer.inlineTokens(match[1].trim()),  // Additional custom properties, including
        dd: this.lexer.inlineTokens(match[2].trim())   //   any further-nested inline tokens
      };
    }
  },
  renderer(token) {
    return `\n<dt>${this.parser.parseInline(token.dt)}</dt><dd>${this.parser.parseInline(token.dd)}</dd>`;
  },
  childTokens: ['dt', 'dd'],                 // Any child tokens to be visited by walkTokens
};

// function walkTokens(token) {                        // Post-processing on the completed token tree
//   if (token.type === 'strong') {
//     token.text += ' walked';
//     token.tokens = this.Lexer.lexInline(token.text)
//   } else if (token.type === 'code') {
//     token.text += ' walked';
//     token.tokens = this.Lexer.lexInline(token.text)
//   }
// }

// marked.use({extensions: [descriptionList, description]});

marked.use({
  renderer,
  breaks: true,
  gfm: true,
  // walkTokens,
  // extensions: [descriptionList, description],
});

// Function to find the difference between two strings
const lastKnownText = ref('');
const currentText = ref('');

const handleUserInput = (_value: string, formatted: string) => {
  // add the user's response to the conversation
  // scroll to the bottom of the conversation
  scrollToBottom();

  const userMessage = ref<Conversation>({message: formatted, isUser: true, uniqueId: _.uniqueId('user-')});

  conversation.value.push(userMessage);

  const aiMessage = ref<Conversation>({message: '', isUser: false, uniqueId: _.uniqueId('ai-')});

  isGeneratingResponse.value = true;

  setTimeout(() => {
    conversation.value.push(aiMessage);
  }, 500);

  const debouncedUpdateResponse = _.throttle((newMessage) => {
    aiResponses.value.push(newMessage);
    aiMessage.value.message = newMessage;

    // Scroll to the bottom after adding new data
    scrollToBottom();
  }, 100);

  // send the user's response to the server
  // and wait for the server to send the AI's response
  chatbot.establishConnection(pageId.value, formatted).then((responseStream: Response) => {

    // create a new reader
    const reader2 = responseStream.body?.getReader();

    // read the stream
    reader2?.read().then((result) => {

      // convert the stream to a string
      const decoder = new TextDecoder();

      let newMessage = decoder.decode(result.value);

      console.log(newMessage);

      // const isCompleteMessage = newMessage.endsWith('~~~NEWLINE~~~');
      //
      // if (isCompleteMessage) {
      //
      //   const newText = buffer + newMessage;
      //   const difference = findDifference(lastKnownText.value, newText);
      //
      //   aiMessage.value.message += difference;
      //   lastKnownText.value = newText; // Update the last known text
      //   buffer = ''; // Clear the buffer
      // } else {
      //   buffer += newMessage;
      // }

      const lastKnownTextTokens = lastKnownText.value.split('~~~NEWLINE~~~');
      const currentTextTokens = currentText.value.split('~~~NEWLINE~~~');
      const newMessageTokens = newMessage.split('~~~NEWLINE~~~');

      const newTokens = newMessageTokens.filter((token) => {
        return !lastKnownTextTokens.includes(token);
      });

      // newMessage = newTokens.join('~~~NEWLINE~~~');

      // for each token in the new message
      newTokens.forEach((token) => {

        console.log(token)
        // if the token is not in the last known text
        if (!lastKnownTextTokens.includes(token)) {
          // add the token to the last known text
          // lastKnownTextTokens.push(token);
          // add the token to the ai message
          // aiMessage.value.message = token;
          // const previousToken = aiMessage.value.message;
          const previousToken = currentText.value;

          if (previousToken.length <= token.length) {
            // add the token to the AI message
            aiMessage.value.message = marked.parse(token);
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

      // lastKnownText.value = newMessage;

      // console.log(newMessage);

      // convert the string to html
      // newMessage = aiResponseHtmlConverter(newMessage);

      // convert the html to code
      // newMessage = aiResponseCodeConverter(newMessage);
      // newMessage = useTextProcessor(newMessage, '```', '<pre><div class="mockup-code"><div class="px-4"><code>', '</code></div></div></pre>').output.value;

      // newMessage = tableProcessor(newMessage);

      // push the result to the string array

      // aiMessage.value.message = decoder.decode(result.value);
      // aiMessage.value.message = newMessage
      // aiMessage.value.message = aiResponses.value[aiResponses.value.length - 1];

      // const newAiMessageLength = newMessage.length;
      // const previousAiMessageLength = aiMessage.value.message.length;

      // if (newAiMessageLength > previousAiMessageLength) {
      //
      // newMessage = marked.parse(newMessage);
      aiResponses.value.push(newMessage);
      //
      // aiMessage.value.message = '';
      // aiMessage.value.message = newMessage;
      // }

      // debouncedUpdateResponse(newMessage);

      // listen for new data
      reader2.read().then(function processText({done, value}) {
        // Result objects contain two properties:
        // done  - true if the stream has already given you all its data.
        // value - some data. Always undefined when done is true.
        if (done) {
          console.log("Stream complete");

          console.log(aiResponses.value)

          isGeneratingResponse.value = false;

          lastKnownText.value = '';

          currentText.value = '';
          return;
        }
        newMessage = decoder.decode(value);

        // value for fetch streams is a Uint8Array
        console.log("Received", newMessage);

        // const isCompleteMessage = newMessage.endsWith('\n');
        // const isCompleteMessage = newMessage.includes('~~~NEWLINE~~~');
        //
        // if (isCompleteMessage) {
        //   const newText = buffer + newMessage;
        //   // const difference = findDifference(lastKnownText.value, newText);
        //
        //   aiMessage.value.message += difference;
        //   lastKnownText.value = newText; // Update the last known text
        //   buffer = ''; // Clear the buffer
        // } else {
        //   buffer += newMessage;
        // }

        const lastKnownTextTokens = lastKnownText.value.split('~~~NEWLINE~~~');
        const newMessageTokens = newMessage.split('~~~NEWLINE~~~');

        const newTokens = newMessageTokens.filter((token) => {
          return !lastKnownTextTokens.includes(token);
        });

        newTokens.forEach((token) => {

          console.log(token)
          // if the token is not in the last known text
          if (!lastKnownTextTokens.includes(token)) {
            // add the token to the ai message
            // const previousToken = aiMessage.value.message;
            const previousToken = currentText.value;

            if (previousToken.length <= token.length) {
              // add the token to the ai message
              aiMessage.value.message = marked.parse(token);
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

        // newMessage = aiResponseHtmlConverter(newMessage);

        // newMessage = useTextProcessor(newMessage, '```', '<pre><div class="mockup-code"><div class="px-4"><code>', '</code></div></div></pre>').output.value;

        // newMessage = tableProcessor(newMessage);

        // newMessage = marked.parse(newMessage);

        // aiResponses.value.push(newMessage);
        // aiMessage.value.message = decoder.decode(value);
        // aiMessage.value.message = newMessage
        // aiMessage.value.message = aiResponses.value[aiResponses.value.length - 1];

        // aiMessage.value.message += findDifference(aiMessage.value.message, newMessage);

        // const newAiMessageLength = newMessage.length;
        // const previousAiMessageLength = aiMessage.value.message.length;

        // if (newAiMessageLength > previousAiMessageLength) {
        // aiResponses.value.push(newMessage);
        //
        // newMessage = marked.parse(newMessage);
        //
        // aiMessage.value.message = '';
        // aiMessage.value.message = newMessage;
        // }

        // debouncedUpdateResponse(newMessage);
        console.log(aiMessage.value.message)

        scrollToBottom();
        // responseString.value = decoder.decode(value);
        // stringArray.value.push(decoder.decode(value));
        // Read some more, and call this function again
        return reader2.read().then(processText);
      });
    })
  }).catch((error) => {
    console.log(error);

    scrollToBottom();

    aiMessage.value.hasError = true;
    aiMessage.value.message += `
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative text-sm" role="alert">
            <strong class="font-bold">Oops!</strong>
            <span class="block sm:inline">Something went wrong. Please try again.</span>
        </div>
    `;

    isGeneratingResponse.value = false;

    notificationsStore.addNotification('Oops! Something went wrong. Please try again.', 'error');
  });
};

const aiResponseHtmlConverter = (message: string) => {
  return message.replace(/(?:\r\n|\r|\n)/g, '<br>');
};

// convert '```' to '<pre><code>' and '```' to '</code></pre>'
const aiResponseCodeConverter = (message: string) => {
  const regex = /```/g;
  const subst = `<pre><div class="mockup-code"><code>`;

  // The substituted value will be contained in the result variable
  let result = message.replace(regex, subst);

  const regex2 = /```/g;
  const subst2 = `</code></div></pre>`;

  // The substituted value will be contained in the result variable
  result = result.replace(regex2, subst2);

  return result;
};

const tableProcessor = (inputText: string) => {
  const rows = inputText.trim().split('\n').map(row => row.split('|').map(cell => cell.trim()));
  // if (rows.length < 3) {
  //   // Not enough rows to form a table
  //   return '';
  // }

  const headerRow = rows[0];
  const headerCells = headerRow.map(cell => `<th>${cell}</th>`).join('');

  const bodyRows = rows.slice(2).map(row => {
    const bodyCells = row.map(cell => `<td>${cell}</td>`).join('');
    return `<tr>${bodyCells}</tr>`;
  }).join('');

  return `<div class="overflow-x-auto">
        <table class="table table-zebra">
        <thead>
            <tr>${headerCells}</tr>
        </thead>
        <tbody>
            ${bodyRows}
        </tbody>
    </table>
    </div>`;
}

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
            <ChatbotBubble :key="1" :chatbot-message="staticGreeting"
                           :chatbot-name="chatbotName"/>

            <div v-for="(message, index) in conversation" :key="index">
              <UserBubble v-if="message.value.isUser && message.value.message && message.value.message.length > 0"
                          :key="message.value.uniqueId" :user-message="message.value.message" user-name="John Doe"/>
              <ChatbotBubble
                  v-else-if="!message.value.isUser"
                  :key="message.value.uniqueId" :chatbot-message="message.value.message"
                  :chatbot-name="chatbotName"
                  :has-error="message.value?.hasError"
                  :is-copyable="index !== 0"/>
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
</style>
