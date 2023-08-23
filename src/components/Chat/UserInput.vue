<script setup lang="ts">
import {computed, nextTick, ref, watch} from "vue";

interface UserInputProps {
  userInput: string;
  promptPlaceholder: string;
  disabled: boolean;
}

const props = defineProps<UserInputProps>();

const userInput = ref<string>("");

const hasText = computed(() => {
  return userInput.value.length > 0;
});

const textareaRef = ref<HTMLTextAreaElement | null>(null);

const maxHeight = ref(200);

// const maxHeightReached = computed(() => {
//   return textareaRef.value?.scrollHeight >= maxHeight.value;
// });

watch(userInput, () => {
  nextTick(() => {
    adjustTextareaHeight(textareaRef.value as HTMLTextAreaElement);
  });
});

const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, maxHeight.value) + 'px';
};

const inputHasFocus = ref<boolean>(false);

</script>

<template>
  <div class="bg-white rounded-xl shadow-lg shadow-slate-300/10 flex flex-row space-x-4 m-0 p-5" :class="inputHasFocus ? 'ring-2 ring-primary ring-opacity-50' : ''">
    <textarea v-model="userInput" class="w-full border-none resize-none focus:outline-none bg-transparent h-6 text-sm grow transition duration-150" @focus="inputHasFocus = true" @blur="inputHasFocus = false" :disabled="props.disabled"
              :placeholder="props.promptPlaceholder" ref="textareaRef" rows="1"></textarea>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 transition duration-150" :class="hasText ? 'cursor-pointer text-primary' : 'cursor-not-allowed text-neutral-300'">
      <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
  </div>
</template>

<style scoped>

</style>