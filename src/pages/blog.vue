<script setup>
const pages = useDocuments("~/pages/blog");

const posts = [...pages.value].sort(
  (a, b) => new Date(b.date) - new Date(a.date)
);
</script>

<template>
  <BlogPostCard v-for="post in posts" :post="post" />
</template>
