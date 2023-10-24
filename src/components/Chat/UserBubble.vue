<script lang="ts" setup>
interface UserBubbleProps {
  userName: string;
  userMessage: string;
}

const props = defineProps<UserBubbleProps>();

// const userName = props.userName;

</script>

<template>
  <div class="w-[98%] ml-auto chatbot-pop">
    <div class="px-4 py-5 bg-white rounded-xl shadow-lg shadow-slate-300/10">
      <div class="text-sm text-blue-950" v-html="props.userMessage">
      </div>
    </div>
  </div>
</template>

<style scoped>

.chatbot-pop {
  animation: chatbot-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}

@keyframes slideInFromRight {
  0% {
    transform: translateX(100%);
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