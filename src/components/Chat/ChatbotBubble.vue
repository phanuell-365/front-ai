<script lang="ts" setup>
import {computed, onMounted, Ref, ref, watch} from "vue";
import {useColorGenerator} from "../../composables/color-generator.ts";

interface ChatbotBubble {
  chatbotName: string;
  chatbotMessage: string;
  isTyping: boolean;
  isCopyable?: boolean;
  hasDisclosureMessage?: boolean;
  disclosureMessage?: string;
  hasError?: boolean;
  originalMessage?: string;
}

const props = withDefaults(defineProps<ChatbotBubble>(), {
  isTyping: false,
  isCopyable: false,
  hasDisclosureMessage: false,
});

const {
  darkBgColor,
  setColor,
} = useColorGenerator(props.chatbotName);

onMounted(() => {
  setColor();
});

const hasCopyButton = computed(() => {
  return props.isCopyable && props.chatbotMessage.length > 0;
});

const hasText = computed(() => {
  return props.chatbotMessage.length > 0;
});

const smallChatbotName = computed(() => {
  if (props.chatbotName.length > 2) {
    // return props.chatbotName.substring(0, 2).toUpperCase();
    if (props.chatbotName.includes(" ")) {
      const split = props.chatbotName.split(" ");
      return split[0].substring(0, 1).toUpperCase() + split[1].substring(0, 1).toUpperCase();
    } else {
      return props.chatbotName.substring(0, 2).toUpperCase();
    }
  } else {
    return props.chatbotName.toUpperCase();
  }
});

const chatbotMsgRef: Ref<HTMLElement | null> = ref(null);

onMounted(() => {
  if (chatbotMsgRef.value) {
    cursorLeftOffset.value = chatbotMsgRef.value.offsetWidth;
  }
});

watch(() => props.chatbotMessage, () => {
  if (chatbotMsgRef.value) {
    cursorLeftOffset.value = chatbotMsgRef.value.offsetWidth;
  }
});

const cursorLeftOffset = ref(0);

// const chatbotName = ref(props.chatbotName);
// const chatbotMessage = ref(props.chatbotMessage);

const isTextCopied = ref(false);

const onCopyClick = () => {
  if (isTextCopied.value) {
    return;
  }
  if (window.navigator.userAgent.indexOf("Edge") > -1) {
    alert("Your browser does not support this feature. Please use a different browser.");
    return;
  }
  if (!navigator.clipboard) {
    alert("Your browser does not support this feature. Please use a different browser.");
    return;
  }
  navigator.clipboard.writeText(props?.originalMessage as string);
  isTextCopied.value = true;

  setTimeout(() => {
    isTextCopied.value = false;
  }, 2000);
};

// const onCopyTextMouseLeave = () => {
//   isTextCopied.value = false;
// };
</script>

<template>
  <li class="max-w-4xl py-2 px-4 sm:px-6 lg:px-8 mx-auto flex gap-x-2 sm:gap-x-4">
    <div class="flex-shrink-0 w-10 h-10 p-0.5 rounded-full inline-flex items-center justify-center" :class="[darkBgColor]">
      <span class="text-lg font-poppins-semi-bold text-white leading-none">{{ smallChatbotName }}</span>
<!--      <svg xmlns="http://www.w3.org/2000/svg" class="w-10/12 h-full text-white"-->
<!--           width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000"-->
<!--           preserveAspectRatio="xMidYMid meet">-->
<!--        <metadata>-->
<!--          Created by potrace 1.16, written by Peter Selinger 2001-2019-->
<!--        </metadata>-->
<!--        <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"-->
<!--           fill="currentColor" stroke="none">-->
<!--          <path d="M612 4295 c-125 -46 -229 -153 -271 -278 -20 -59 -21 -81 -21 -626 0-->
<!-- -547 1 -567 20 -599 58 -95 216 -99 277 -5 17 25 18 68 23 568 6 600 4 585 73-->
<!--622 30 17 131 18 1852 18 l1820 0 31 -22 c62 -45 59 36 59 -1413 0 -1449 3-->
<!-- -1368 -59 -1413 l-31 -22 -1820 0 c-1721 0 -1822 1 -1852 18 -67 36 -67 40-->
<!-- -73 462 -5 345 -7 384 -23 408 -29 45 -75 67 -137 67 -65 0 -110 -24 -140 -72-->
<!-- -19 -32 -20 -52 -20 -440 0 -402 0 -408 23 -471 47 -128 153 -234 279 -276-->
<!--l62 -21 1872 0 c1847 0 1873 0 1937 20 126 39 236 146 284 277 l23 64 0 1398-->
<!--0 1397 -21 63 c-43 126 -155 237 -282 280 -61 21 -67 21 -1941 20 l-1881 0-->
<!-- -63 -24z"/>-->
<!--          <path d="M1241 3520 c-74 -17 -123 -81 -123 -159 0 -26 5 -59 12 -72 7 -13-->
<!--170 -183 363 -376 l352 -353 -357 -357 c-312 -313 -358 -363 -368 -400 -31-->
<!-- -122 81 -234 203 -203 37 10 93 62 474 443 381 381 433 437 443 475 24 93 31-->
<!--84 -433 550 -232 233 -433 429 -447 436 -36 19 -80 24 -119 16z"/>-->
<!--          <path d="M2312 1900 c-48 -30 -72 -75 -72 -140 0 -65 24 -110 72 -140 32 -19-->
<!--52 -20 808 -20 756 0 776 1 808 20 48 30 72 75 72 140 0 65 -24 110 -72 140-->
<!-- -32 19 -52 20 -808 20 -756 0 -776 -1 -808 -20z"/>-->
<!--        </g>-->
<!--      </svg>-->
      <!--      <img src="/min-icon.png" alt="Bot Icon" class="w-full h-full">-->
    </div>

    <div class="flex flex-col space-y-3 items-start w-full">
      <div class="flex-shrink-0 h-10 rounded-full flex items-center">
        <div class="text-sm font-poppins-semi-bold mb-2 tracking-wide leading-tight">
          {{ props.chatbotName }}
        </div>
      </div>
      <div class="space-y-3 text-sm">
        <div class="h-full w-full inline-flex flex-col relative overflow-hidden">
          <template v-if="hasText">
            <div ref="chatbotMsgRef"
                 class="space-y-1.5 font-medium md:space-y-2 lg:space-y-3 inline overflow-auto"
                 v-html="props.chatbotMessage"></div>
            <span v-if="isTyping" class="loading loading-ring loading-md"></span>
          </template>
          <template v-else>
            <span class="loading loading-ball loading-sm"></span>
          </template>
        </div>
      </div>
      <div class="flex w-full" v-if="hasText && !props.hasError">
        <div v-if="hasText && hasCopyButton" class="flex flex-row items-center justify-between grow">
          <div class="">
            <div class="inline-flex border border-gray-200 rounded-full p-0.5 space-x-0.5 dark:border-gray-700">
              <button type="button"
                      class="inline-flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-full text-gray-500 hover:bg-blue-100 hover:text-blue-800 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-blue-900 dark:hover:text-blue-200 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                <span class="sr-only">Like</span>
                <span class="material-icons-outlined !text-base">thumb_up</span>
              </button>
              <button type="button"
                      class="inline-flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-full text-gray-500 hover:bg-blue-100 hover:text-blue-800 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-blue-900 dark:hover:text-blue-200 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                <span class="sr-only">Dislike</span>
                <span class="material-icons-outlined !text-base">thumb_down</span>
              </button>
            </div>
            <button type="button" v-if="hasCopyButton" @click="onCopyClick"
                    class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-full border border-transparent text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none hover:text-primary active:scale-95 transition duration-300">
              <span v-if="!isTextCopied" class="material-icons-round !text-xl">content_copy</span>
              <span v-else class="material-icons-round !text-xl">check</span>
              <span v-if="!isTextCopied" class="font-poppins-semi-bold text-xs">
                Copy
              </span>
              <span v-else class="font-poppins-semi-bold text-xs">
                Copied
              </span>
            </button>
            <!--            <button type="button"-->
            <!--                    class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-full border border-transparent text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none hover:text-green-500 active:scale-95 transition duration-300">-->
            <!--              <span class="material-icons-round !text-xl">share</span>-->
            <!--              <span class="font-poppins-semi-bold text-xs">-->
            <!--                Share-->
            <!--              </span>-->
            <!--            </button>-->
          </div>

          <div class="mt-1 sm:mt-0 self-end">
            <button type="button"
                    class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-full border border-transparent text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none hover:text-red-500 active:scale-95 transition duration-300">
              <span class="material-icons-round !text-xl">restart_alt</span>
              <span class="font-poppins-semi-bold text-xs">
              New answer
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </li>

</template>

<style scoped>
.chatbot-pop {
  animation: chatbot-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}

@keyframes slideInFromLeft {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes chatbot-pop {
  0% {
    transform: scale(0);
  }
  25% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(0.9);
  }
  75% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

#blinking-cursor {
  width: 2px; /* Adjust the width of the cursor */
  height: 24px; /* Adjust the height of the cursor */
  animation: blink 0.65s step-end infinite; /* Blinking animation */
}

.cursor-after::after {
  content: '<span class="material-icons-round">keyboard_arrow_right</span>';
  width: 2px; /* Adjust the width of the cursor */
  height: 24px; /* Adjust the height of the cursor */
  animation: blink 0.65s steps(1) infinite; /* Blinking animation */
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
