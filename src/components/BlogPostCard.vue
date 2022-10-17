<script setup>
import dayjs from "dayjs";

defineProps({
  post: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <a
    class="bg-gray-900 border border-transparent hover:border-white p-3 rounded w-11/12 sm:w-2/3 md:w-[700px] my-3"
    :href="post.href"
  >
    <div class="flex items-center border-b border-gray-500 py-3 mb-3">
      <h2 class="text-3xl flex-grow">{{ post.title }}</h2>
      <div class="whitespace-nowrap">{{ dayjs(post.date).format("MMM DD YYYY") }}</div>
    </div>
    <Img :src="post.image" v-if="post.image" />
    <p class="p-5">{{ post.snippet }}</p>
  </a>
</template>
