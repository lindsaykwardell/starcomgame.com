<template>
  <figure class="text-center">
    <img
      class="border-8 rounded-lg border-black shadow-md"
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
}>();
</script>
