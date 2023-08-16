<script setup lang="ts">
import {useHomeStore} from "@/stores/home";

const homeStore = useHomeStore();

</script>

<template>
  <h1 class="bg-red-50 text-3xl">
    Here we'll say hello to the user
  </h1>

  <p>
    {{ homeStore.sayHello() }}
  </p>

  <p>
    {{ homeStore.count }}
  </p>

  <p>
    <button @click="homeStore.increment()">
      Increment
    </button>
  </p>
</template>

<style scoped>

</style>