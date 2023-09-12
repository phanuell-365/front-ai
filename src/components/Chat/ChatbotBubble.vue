<script lang="ts" setup>
import {ref} from "vue";

interface ChatbotBubble {
  chatbotName: string;
  chatbotMessage: string;
  isCopyable?: boolean;
  hasError?: boolean;
}

const props = withDefaults(defineProps<ChatbotBubble>(), {
  isCopyable: false
});

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
  navigator.clipboard.writeText(props.chatbotMessage);
  isTextCopied.value = true;
};

const onCopyTextMouseLeave = () => {
  isTextCopied.value = false;
};
</script>

<template>
  <div class="w-[98%] mr-auto chatbot-pop">
    <div v-if="!hasError" class="px-4 py-5 bg-blue-100 rounded-xl shadow-lg shadow-blue-400/10">
      <div class="text-sm font-poppins-semi-bold mb-2 tracking-wide leading-tight">
        {{ props.chatbotName }}
      </div>
      <div :class="{'mb-3': props.isCopyable}"
           class="text-sm text-blue-950" v-html="props.chatbotMessage">
      </div>
      <!-- have the copy button here -->
      <button v-if="props.isCopyable"
              :class="!isTextCopied ? 'bg-blue-400 hover:bg-blue-500 text-blue-950 hover:text-blue-950': 'bg-blue-300 hover:bg-blue-400 text-blue-700 hover:text-blue-950'"
              class="btn btn-xs btn-ghost normal-case gap-1" type="button"
              @click="onCopyClick"
              @mouseleave="onCopyTextMouseLeave">
        <svg v-if="!isTextCopied" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5"
             viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
              d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
              stroke-linecap="round"
              stroke-linejoin="round"/>
        </svg>
        <span v-if="!isTextCopied" class="text-xs font-poppins-semi-bold">Copy</span>

        <svg v-else-if="isTextCopied" class="w-4 h-4" fill="none" stroke="currentColor"
             stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.5 12.75l6 6 9-13.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span v-if="isTextCopied" class="text-xs font-poppins-semi-bold">Copied</span>
      </button>
    </div>
    <div v-else>
      <div class="px-4 py-5 bg-red-100 rounded-xl shadow-lg shadow-red-400/10">
        <div class="text-sm font-poppins-semi-bold mb-2 tracking-wide leading-tight">
          {{ props.chatbotName }}
        </div>
        <div class="" v-html="props.chatbotMessage">
        </div>
      </div>
    </div>
  </div>
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
</style>