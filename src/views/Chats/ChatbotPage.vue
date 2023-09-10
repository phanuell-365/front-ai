<script lang="ts" setup>

import UserBubble from "@/components/Chat/UserBubble.vue";
import UserInput from "@/components/Chat/UserInput.vue";
import ChatbotBubble from "@/components/Chat/ChatbotBubble.vue";
import {computed, onMounted, Ref, ref, watch} from "vue";
import {useRoute} from "vue-router";
import {usePageContentStore} from "@/stores/admin/page-data.ts";
import {useChatbotStore} from "@/stores/chatbot";
// import {useTextProcessor} from "@/composables/text-processor.ts";
import {marked} from "marked";

const route = useRoute();
const pageContentStore = usePageContentStore();
const chatbot = useChatbotStore();

await pageContentStore.fetchPageContentItems();

const page = ref(route.params.chatbotId);
const pageId = ref(route.query.pageId as string);
const pageContent = ref(pageContentStore.getPageContentByPageId(pageId.value));

const chatbotName = ref(pageContent.value.chatbotName);
const promptPlaceholder = ref(pageContent.value.promptPlaceholder);
const staticGreeting = ref(pageContent.value.staticGreeting);

// set page metadata
window.document.title = pageContent.value.chatbotName;

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
}

const conversationContainerRef = ref<HTMLDivElement | null>();
const userInputContainerHeight = ref(0);
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

const handleUserInput = async (_value: string, formatted: string) => {
  // add the user's response to the conversation
  // scroll to the bottom of the conversation
  scrollToBottom();

  const userMessage = ref<Conversation>({message: formatted, isUser: true});

  conversation.value.push(userMessage);
  const aiMessage = ref<Conversation>({message: '', isUser: false});

  isGeneratingResponse.value = true;

  conversation.value.push(aiMessage);
  // send the user's response to the server
  // and wait for the server to send the AI's response
  try {
    const responseStream = await chatbot.establishConnection(pageId.value, formatted);

    // create a new reader
    const reader2 = responseStream.body.getReader();

    // read the stream
    const result = await reader2.read();

    // convert the stream to a string
    const decoder = new TextDecoder();

    let newMessage = decoder.decode(result.value);

    console.log(newMessage)

    // convert the string to html
    // newMessage = aiResponseHtmlConverter(newMessage);

    // convert the html to code
    // newMessage = aiResponseCodeConverter(newMessage);
    // newMessage = useTextProcessor(newMessage, '```', '<pre><div class="mockup-code"><div class="px-4"><code>', '</code></div></div></pre>').output.value;

    // newMessage = tableProcessor(newMessage);
    newMessage = marked.parse(newMessage);

    // push the result to the string array
    aiResponses.value.push(newMessage);

    // aiMessage.value.message = decoder.decode(result.value);
    aiMessage.value.message = newMessage
    // aiMessage.value.message = aiResponses.value[aiResponses.value.length - 1];

    // listen for new data
    reader2.read().then(function processText({done, value}) {
      // Result objects contain two properties:
      // done  - true if the stream has already given you all its data.
      // value - some data. Always undefined when done is true.
      if (done) {
        console.log("Stream complete");

        console.log(aiResponses.value)

        isGeneratingResponse.value = false;
        return;
      }
      // value for fetch streams is a Uint8Array
      console.log("Received", decoder.decode(value));

      newMessage = decoder.decode(value);

      console.log(newMessage)

      // newMessage = aiResponseHtmlConverter(newMessage);

      // newMessage = useTextProcessor(newMessage, '```', '<pre><div class="mockup-code"><div class="px-4"><code>', '</code></div></div></pre>').output.value;

      // newMessage = tableProcessor(newMessage);

      newMessage = marked.parse(newMessage);

      aiResponses.value.push(newMessage);
      // aiMessage.value.message = decoder.decode(value);
      aiMessage.value.message = newMessage
      // aiMessage.value.message = aiResponses.value[aiResponses.value.length - 1];

      console.log(aiMessage.value.message)

      scrollToBottom();
      // responseString.value = decoder.decode(value);
      // stringArray.value.push(decoder.decode(value));
      // Read some more, and call this function again
      return reader2.read().then(processText);
    });


  } catch (error) {
    console.log(error);
  }
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
const viewportHeight = ref(0);
const currentScrollPosition = ref(0);

// We'll also create a variable for the height of the conversation container
const conversationContainerHeight = ref(0);

onMounted(() => {
  userInputContainerHeight.value = userInputContainerHeightRef.value?.clientHeight || 0;
  // get the viewport height
  viewportHeight.value = window.innerHeight;

  conversationContainerRef.value = document.querySelector('#conversation-container') as HTMLDivElement;

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

  // if the conversation container height is greater than the viewport height
  // toggleSticky.value =
});
</script>

<template>
  <div id="main-container" :class="!toggleSticky ? 'relative' : ''" class="flex-1 overflow-scroll flex flex-col">
    <div class="pt-10 md:pt-20">
      <!-- Simulate a conversation loop -->
      <TransitionGroup id="conversation-container" class="grid grid-cols-1 gap-7 w-9/12 mx-auto mb-10" name="fade-slide"
                       tag="div"
                       @enter="scrollToBottom">
        <ChatbotBubble :key="1" :chatbot-message="staticGreeting"
                       :chatbot-name="chatbotName"/>

        <div v-for="(message, index) in conversation" :key="index">
          <UserBubble v-if="message.value.isUser && message.value.message && message.value.message.length > 0"
                      :key="index" :user-message="message.value.message" user-name="John Doe"/>
          <ChatbotBubble v-else-if="!message.value.isUser && message.value.message && message.value.message.length > 0"
                         :chatbot-message="message.value.message" :chatbot-name="chatbotName"
                         :is-copyable="index !== 0"/>
        </div>
      </TransitionGroup>
    </div>
    <div v-if="toggleSticky" id="user-input-placeholder" :style="{'padding-bottom': userInputContainerHeight + 'px'}">
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