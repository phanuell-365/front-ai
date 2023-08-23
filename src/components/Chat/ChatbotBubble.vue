<script setup lang="ts">
interface ChatbotBubble {
  chatbotName: string;
  chatbotMessage: string;
}

const props = defineProps<ChatbotBubble>();

const chatbotName = props.chatbotName;
</script>

<template>
  <div class="w-[98%] mr-auto">
    <div class="px-4 py-5 bg-blue-100 rounded-xl shadow-lg shadow-blue-400/10">
      <div class="text-sm font-poppins-semi-bold mb-2 tracking-wide leading-tight">
        {{ chatbotName }}
      </div>
      <div class="text-sm text-blue-950">
        {{ props.chatbotMessage }}
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>