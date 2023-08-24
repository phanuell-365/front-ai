<script setup lang="ts">
import {computed, nextTick, ref, watch} from "vue";

interface UserInputProps {
  userInput: string;
  promptPlaceholder: string;
  disabled: boolean;
}

const props = defineProps<UserInputProps>();

const userInput = ref<string>(props.userInput);
const formattedUserInput = computed(() => {
  return userInput.value.replace(/\n/g, "<br>");
});

const hasText = computed(() => {
  return userInput.value.length > 0 && userInput.value.trim().length > 0;
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

const emits = defineEmits<{
  (event: 'userInput', value: string, formatted: string): void;
}>();

const onEnterKey = (e: KeyboardEvent) => {
  // if the user presses the shift key and the enter key at the same time
  if (e.key === "Enter" && e.shiftKey) {
    // check if the user input is empty
    if (hasText.value) {
      // if the user input is empty, do nothing
      return;
    }
  } else
      // if the enter key is pressed and the user input is not empty
  if (e.key === "Enter" && userInput.value.length > 0) {
    // check for empty spaces and newlines
    if (userInput.value.trim().length === 0) {
      // if the user input is empty, do nothing
      return;
    }
    // emit the user input
    emits('userInput', userInput.value, formattedUserInput.value);

    // clear the user input
    userInput.value = "";

    // adjust the textarea height
    adjustTextareaHeight(textareaRef.value as HTMLTextAreaElement);

    // prevent the enter key from creating a new line
    e.preventDefault();
  } else if (e.key === "Enter" && userInput.value.length === 0) {
    // if the enter key is pressed and the user input is empty, do nothing
    e.preventDefault();
  }

  // if the user presses the backspace key and the user input is empty
  if (e.key === "Backspace" && userInput.value.length === 0) {
    // prevent the backspace key from deleting the last character in the textarea
    e.preventDefault();
  }
};

const sendButtonClicked = () => {
  // check if the user input is empty
  if (userInput.value.length === 0) {
    // if the user input is empty, do nothing
    return;
  }

  // emit the user input
  emits('userInput', userInput.value, formattedUserInput.value);

  // clear the user input
  userInput.value = "";

  // adjust the textarea height
  adjustTextareaHeight(textareaRef.value as HTMLTextAreaElement);
};

const addFocus = () => {
  if (inputHasFocus.value || props.disabled) {
    return;
  }
  inputHasFocus.value = true;
  textareaRef.value?.focus();
};

</script>

<template>
  <div class="bg-white rounded-xl shadow-lg shadow-slate-300/10 flex flex-row items-center space-x-4 m-0 p-5" @click.stop="addFocus"
       :class="inputHasFocus ? 'ring-2 ring-primary ring-opacity-50' : ''">
    <textarea v-model="userInput"
              class="w-full border-none resize-none focus:outline-none bg-transparent h-6 text-sm grow transition duration-150"
              @focus="inputHasFocus = true" @blur="inputHasFocus = false" :disabled="props.disabled"
              :placeholder="props.promptPlaceholder" ref="textareaRef" rows="1" @keydown="onEnterKey"
    ></textarea>
    <button type="button" @click.stop="sendButtonClicked" class="btn btn-sm btn-square btn-ghost normal-case" :disabled="!hasText">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
           class="w-6 h-6 transition duration-150"
           :class="hasText ? 'text-primary' : 'text-neutral-400'">
        <path
            d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"/>
      </svg>
    </button>
  </div>
</template>

<style scoped>

</style>