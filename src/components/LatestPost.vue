<script setup>
const pages = useDocuments("~/pages/blog");

const post = [...pages.value].sort(
  (a, b) => new Date(b.date) - new Date(a.date)
)[0];
</script>

<template>
  <BlogPostCard :post="post" />
</template>
