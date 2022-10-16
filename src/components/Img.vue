<template>
  <figure class="text-center">
    <img
      class="border-8 rounded-lg border-black shadow-md"
      :class="class"
      :src="src"
      :alt="alt"
      loading="lazy"
    />
    <figcaption class="text-white italic">
      <slot />
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
defineProps<{
  src: string;
  alt: string;
  class?: string;
}>();
</script>

<style>
img.card {
  aspect-ratio: 2/3;
  object-fit: cover;
}
</style>
