<script lang="ts" setup>
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import DOMPurify from "dompurify";
import {useNotificationsStore} from "../../stores/notifications.ts";

interface UserInputProps {
  userInput: string;
  promptPlaceholder: string;
  disabled: boolean;
  isGenerating?: boolean;
}

const props = defineProps<UserInputProps>();

const notificationsStore = useNotificationsStore();

const userInput = ref<string>(props.userInput);
const formattedUserInput = computed(() => {
  let purifiedBreak = userInput.value.replace(/\n/g, "<br>");

  purifiedBreak = DOMPurify.sanitize(purifiedBreak, {
    ALLOWED_TAGS: ["br"],
  });

  return purifiedBreak;
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
  (event: 'userInput', value: string, formatted: string, audioData?: {
    audioBlob: Blob,
    audioUrl: string,
    // audio: Audio,
  }): void;
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

    // check if a response is being generated
    if (props.isGenerating) {
      // if a response is being generated, do nothing
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

const sendButtonClicked = (audioData?: {
  audioBlob: Blob,
  audioUrl: string,
  // audio: Audio,
}) => {
  // check if the user input is empty
  if (userInput.value.length === 0) {
    // if the user input is empty, do nothing
    return;
  }

  console.log('send-btn-clicked -> audioData', audioData);

  // emit the user input
  emits('userInput', userInput.value, formattedUserInput.value, audioData);

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

// handle the mic button

const mediaRecorder = ref<MediaRecorder | null>(null);
const audioChunks = ref<Array<Blob>>([]);
const isListening = ref(false);
const promptPlaceholderText = computed(() => {
  if (isListening.value) {
    return "Listening...";
  } else {
    return props.promptPlaceholder;
  }
});

// audio context

const audioCtx = new AudioContext();
let analyser = null;
let dataArray = null;
let micScale = ref(1.0);
let animationFrameId = null;
const micPulse = ref(null);

const onMicClick = (data, event) => {
  event.stopPropagation();
  console.log(data);
  if (data === "start") {
    startListening();

    animateMicPulse();
  } else if (data === "stop") {
    stopListening();
  }
};

const animateMicPulse = () => {
  // Get the analyser data and update micScale based on the audio level
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;
  dataArray = new Uint8Array(analyser.frequencyBinCount);

  const draw = () => {
    analyser.getByteFrequencyData(dataArray);

    // Calculate the average amplitude of the audio data
    const averageAmplitude = dataArray.reduce((acc, value) => acc + value, 0) / dataArray.length;

    // Map the average amplitude to a scale factor for mic animation
    micScale.value = 1.0 + averageAmplitude / 128;

    console.log('micScale', micScale.value);

    // Update the mic pulse visualization
    micPulse.value.style.transform = `scale(${micScale.value})`;

    // Continue the animation loop
    animationFrameId = requestAnimationFrame(draw);
  };

  // Start the animation loop
  draw();
};

const startListening = () => {
  navigator.mediaDevices.getUserMedia({audio: true})
      .then((stream) => {
        console.log(stream);

        const sourceNode = audioCtx.createMediaStreamSource(stream);
        sourceNode.connect(analyser);
        analyser.connect(audioCtx.destination);

        // clear the audio chunks
        audioChunks.value = [];

        // const mediaRecorder = new MediaRecorder(stream);
        // const options = {
        //   mimeType: 'audio/webm',
        // };

        // mediaRecorder.value = new MediaRecorder(stream, options);
        mediaRecorder.value = new MediaRecorder(stream);
        mediaRecorder.value.start();
        isListening.value = true;
        // const audioChunks = [];
        mediaRecorder.value?.addEventListener("dataavailable", (e) => {
          console.log(e.data);
          audioChunks.value.push(e.data);
        });
        mediaRecorder.value?.addEventListener("stop", () => {
          console.log(mediaRecorder.value?.state);

          // const tracks = stream.getTracks();
          // tracks.forEach(track => track.stop());

        });
      }).catch((err) => {
    console.log(err);
  });
}

const stopListening = () => {
  mediaRecorder.value?.stop();
  isListening.value = false;
  console.log(mediaRecorder.value?.state);
  console.log("recorder stopped");

  mediaRecorder.value?.stream.getTracks().forEach(track => track.stop());

  cancelAnimationFrame(animationFrameId);

  mediaRecorder.value?.addEventListener("stop", () => {
    const audioBlob = new Blob(audioChunks.value, {type: 'audio/ogg'});
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
    console.log(audioChunks.value);

    // send the audio to the OpenAI API
    const formData = new FormData();

    formData.append("file", audioBlob);
    formData.append("model", "whisper-1");
    formData.append("language", "en");

    fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + import.meta.env.VITE_APP_OPENAI_API_KEY,
      },
      body: formData,
    }).then((response) => {
      return response.json();
    }).then((data) => {
      if (data.error) {
        notificationsStore.addNotification(data.error.message, 'error');
        return;
      }
      userInput.value = data.text;
      sendButtonClicked({
        audioBlob: audioBlob,
        audioUrl: audioUrl,
        // audio: audio,
      });
    }).catch((err) => {
      console.log(err);
    });
  });

  mediaRecorder.value = null;
  analyser = null;

  // navigator.mediaDevices.getUserMedia({audio: false});
}

onMounted(() => {
  micPulse.value = document.getElementById('micPulse');
});


onUnmounted(() => {
  // Cleanup logic, e.g., stop audio context, disconnect nodes
  if (isListening.value) {
    // Stop the mediaRecorder, disconnect it from audio nodes
    stopListening();
  }

  // Stop the animation loop
  cancelAnimationFrame(animationFrameId);
});

</script>

<template>
  <div :class="inputHasFocus ? 'ring-2 ring-primary ring-opacity-50' : ''"
       class="relative text-sm bg-white rounded-xl shadow-lg shadow-slate-300/10 flex flex-row items-center m-0 p-4 pb-14"
       @click.stop="addFocus">
    <textarea ref="textareaRef"
              v-model="userInput"
              :disabled="props.disabled" :placeholder="promptPlaceholderText"
              class="w-full border-none resize-none focus:outline-none bg-transparent h-6 text-sm grow transition duration-150 my-1.5"
              rows="1" @blur="inputHasFocus = false" @focus="inputHasFocus = true" @keydown="onEnterKey"
    ></textarea>

    <Transition name="slide-fade-y">
      <button v-if="isListening" type="button"
              class="absolute right-1/2 -top-12 py-3 px-4 inline-flex justify-center items-center gap-2 rounded-lg font-medium bg-primary text-white shadow-sm align-middle text-sm">
        <svg class="flex-shrink-0 w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
          <circle cx="6" cy="6" r="6"/>
        </svg>
        Listening...
      </button>
    </Transition>

    <div class="absolute bottom-px inset-x-px pt-4 px-4 pb-4 rounded-b-md">
      <div class="flex justify-between items-center">
        <!-- Button Group -->
        <div class="flex items-center">

          <!-- Attach Button -->
          <button type="button"
                  class="btn btn-sm btn-circle btn-ghost normal-case flex items-center justify-center" disabled>
            <span class="material-icons-round animate-rotate-45-cw !text-2xl">
              attach_file
            </span>
          </button>
          <!-- End Attach Button -->
        </div>
        <!-- End Button Group -->

        <!-- Button Group -->
        <div class="flex items-center space-x-2">
          <!-- Mic Button -->
          <button :disabled="isGenerating && !isListening" type="button" @click.prevent="onMicClick(!isListening ? 'start' : 'stop',$event)"
                  class="relative btn btn-sm btn-circle btn-ghost normal-case flex items-center justify-center">
            <span v-if="!isListening" class="material-icons-round !text-2xl">
              mic_none
            </span>
            <span v-else class="material-icons-round !text-4xl">
              mic
            </span>
            <span v-show="isListening" ref="micPulse"
                  class="absolute inset-x-0 -left-4 h-16 w-16 rounded-full bg-neutral-500 opacity-50"
                  :style="{ transform: `scale(${micScale})` }"></span>
          </button>

          <!-- End Mic Button -->

          <!-- Send Button -->
          <button :disabled="!hasText || props.isGenerating"
                  class="btn btn-sm btn-square btn-ghost normal-case flex items-center justify-center" type="button"
                  @click.stop="sendButtonClicked(undefined)">
            <span :class="hasText && !props.isGenerating ? 'text-primary' : 'text-neutral-400'"
                  class="material-icons-round !text-2xl">
              send
            </span>
          </button>
          <!-- End Send Button -->
        </div>
        <!-- End Button Group -->
      </div>
    </div>

  </div>
</template>

<style scoped>
.slide-fade-y-enter-active {
  transition: all 0.5s ease;
}

.slide-fade-y-leave-active {
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.slide-fade-y-enter-from,
.slide-fade-y-leave-to {
  opacity: 0;
  transform: translateY(50px);
}
</style>