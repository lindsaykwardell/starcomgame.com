<script setup lang="ts">
import "../assets/index.css";
</script>

<template>
  <main class="flex flex-col items-center">
    <slot />
  </main>
</template>

<style lang="pcss">
@import url('https://fonts.googleapis.com/css2?family=Megrim&family=Raleway&display=swap');


html {
  @apply bg-gray-800 text-white font-raleway;
}

.card-art {
  @apply border-8 rounded-lg border-black m-2 shadow-md;
}

a {
  @apply text-white;
}
</style>
