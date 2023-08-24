<script setup lang="ts">
interface UserBubbleProps {
  userName: string;
  userMessage: string;
}

const props = defineProps<UserBubbleProps>();

const userName = props.userName;

</script>

<template>
  <div class="w-[98%] ml-auto">
    <div class="px-4 py-5 bg-slate-50 rounded-xl shadow-lg shadow-slate-300/10">
      <div class="text-sm text-blue-950" v-html="props.userMessage">
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>