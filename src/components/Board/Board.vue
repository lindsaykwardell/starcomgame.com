<script setup>
import { onMounted, onBeforeUnmount } from "vue";
import System from "@/components/System/System.vue";

const props = defineProps({
  gameSize: Number,
  systems: Array,
  onExplore: Function,
  onScroll: Function,
});

onMounted(() => {
  document.querySelector(".board").addEventListener("scroll", props.onScroll);
});

onBeforeUnmount(() => {
  document
    .querySelector(".board")
    .removeEventListener("scroll", props.onScroll);
});
</script>

<template>
  <template v-if="gameSize === 3">
    <div class="flex justify-around mt-6 relative">
      <System :system.sync="systems[0]" group="board" @explored="onExplore" />
    </div>
    <div class="flex justify-around w-4/5 m-auto">
      <System :system.sync="systems[1]" group="board" @explored="onExplore" />
      <System :system.sync="systems[2]" group="board" @explored="onExplore" />
    </div>
    <div class="flex justify-around">
      <System :system.sync="systems[3]" group="board" @explored="onExplore" />
      <System :system.sync="systems[4]" group="board" @explored="onExplore" />
      <System :system.sync="systems[5]" group="board" @explored="onExplore" />
    </div>
    <div class="flex justify-around w-4/5 m-auto">
      <System :system.sync="systems[6]" group="board" @explored="onExplore" />
      <System :system.sync="systems[7]" group="board" @explored="onExplore" />
    </div>
    <div class="flex justify-around">
      <System :system.sync="systems[8]" group="board" @explored="onExplore" />
    </div>
  </template>
  <template v-else-if="gameSize === 4">
    <div class="flex justify-around mt-6 relative">
      <System :system.sync="systems[0]" group="board" @explored="onExplore" />
    </div>
    <div class="flex justify-around w-4/5 m-auto">
      <System :system.sync="systems[1]" group="board" @explored="onExplore" />
      <System :system.sync="systems[2]" group="board" @explored="onExplore" />
    </div>
    <div class="flex justify-around">
      <System :system.sync="systems[3]" group="board" @explored="onExplore" />
      <System :system.sync="systems[4]" group="board" @explored="onExplore" />
      <System :system.sync="systems[5]" group="board" @explored="onExplore" />
    </div>
    <div class="flex justify-between">
      <System :system.sync="systems[6]" group="board" @explored="onExplore" />
      <System :system.sync="systems[7]" group="board" @explored="onExplore" />
      <System :system.sync="systems[8]" group="board" @explored="onExplore" />
      <System :system.sync="systems[9]" group="board" @explored="onExplore" />
    </div>
    <div class="flex justify-around">
      <System :system.sync="systems[10]" group="board" @explored="onExplore" />
      <System :system.sync="systems[11]" group="board" @explored="onExplore" />
      <System :system.sync="systems[12]" group="board" @explored="onExplore" />
    </div>
    <div class="flex justify-around w-4/5 m-auto">
      <System :system.sync="systems[13]" group="board" @explored="onExplore" />
      <System :system.sync="systems[14]" group="board" @explored="onExplore" />
    </div>
    <div class="flex justify-around">
      <System :system.sync="systems[15]" group="board" @explored="onExplore" />
    </div>
  </template>
  <template v-else-if="gameSize === 5">
    <div class="flex justify-around mt-6 relative">
      <System :system.sync="systems[0]" group="board" @explored="onExplore" />
    </div>
    <div class="flex justify-around w-3/5 m-auto">
      <System :system.sync="systems[1]" group="board" @explored="onExplore" />
      <System :system.sync="systems[2]" group="board" @explored="onExplore" />
    </div>
    <div class="flex justify-around w-5/6 m-auto">
      <System :system.sync="systems[3]" group="board" @explored="onExplore" />
      <System :system.sync="systems[4]" group="board" @explored="onExplore" />
      <System :system.sync="systems[5]" group="board" @explored="onExplore" />
    </div>
    <div class="flex justify-between w-5/6 m-auto">
      <System :system.sync="systems[6]" group="board" @explored="onExplore" />
      <System :system.sync="systems[7]" group="board" @explored="onExplore" />
      <System :system.sync="systems[8]" group="board" @explored="onExplore" />
      <System :system.sync="systems[9]" group="board" @explored="onExplore" />
    </div>
    <div class="flex justify-between">
      <System :system.sync="systems[10]" group="board" @explored="onExplore" />
      <System :system.sync="systems[11]" group="board" @explored="onExplore" />
      <System :system.sync="systems[12]" group="board" @explored="onExplore" />
      <System :system.sync="systems[13]" group="board" @explored="onExplore" />
      <System :system.sync="systems[14]" group="board" @explored="onExplore" />
    </div>
    <div class="flex justify-between w-5/6 m-auto">
      <System :system.sync="systems[15]" group="board" @explored="onExplore" />
      <System :system.sync="systems[16]" group="board" @explored="onExplore" />
      <System :system.sync="systems[17]" group="board" @explored="onExplore" />
      <System :system.sync="systems[18]" group="board" @explored="onExplore" />
    </div>
    <div class="flex justify-around w-5/6 m-auto">
      <System :system.sync="systems[19]" group="board" @explored="onExplore" />
      <System :system.sync="systems[20]" group="board" @explored="onExplore" />
      <System :system.sync="systems[21]" group="board" @explored="onExplore" />
    </div>
    <div class="flex justify-around w-3/5 m-auto">
      <System :system.sync="systems[22]" group="board" @explored="onExplore" />
      <System :system.sync="systems[23]" group="board" @explored="onExplore" />
    </div>
    <div class="flex justify-around">
      <System :system.sync="systems[24]" group="board" @explored="onExplore" />
    </div>
  </template>
</template>
