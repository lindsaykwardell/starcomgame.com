<template>
  <img class="card" :src="src" :alt="alt" />
</template>

<script>
export default {
  props: {
    src: {
      type: String,
    },
    alt: {
      type: String,
    },
    float: {
      type: String,
      default: "left",
    },
  },
};
</script>

<style scoped>
.card {
  float: v-bind(float);
  border-radius: 5px;
  margin: 10px;
}
</style>
