<script setup>
defineProps({
  drawIndustry: Function,
  drawStatecraft: Function,
  drawScience: Function,
  industryRemaining: Number,
  statecraftRemaining: Number,
  scienceRemaining: Number,
  hoverCard: Function,
  activePlayerControlsIndustry: Boolean,
  activePlayerControlsStatecraft: Boolean,
  activePlayerControlsScience: Boolean,
});
</script>

<template>
  <div class="flex">
    <button
      class="p-1 bg-red-500 hover:bg-red-600 disabled:bg-red-900 disabled:text-gray-400 duration-200 flex-1"
      @click="drawIndustry"
      @mouseover="hoverCard({ img: '', backImg: '/industry.png' })"
      :disabled="!activePlayerControlsIndustry"
    >
      Industry ({{ industryRemaining }}/30)
    </button>
    <button
      class="p-1 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-900 disabled:text-gray-400 duration-200 flex-1"
      @click="drawStatecraft"
      @mouseover="hoverCard({ img: '', backImg: '/statecraft.png' })"
      :disabled="!activePlayerControlsStatecraft"
    >
      Statecraft ({{ statecraftRemaining }}/30)
    </button>
    <button
      class="p-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 disabled:text-gray-400 duration-200 flex-1"
      @click="drawScience"
      @mouseover="hoverCard({ img: '', backImg: '/science.png' })"
      :disabled="!activePlayerControlsScience"
    >
      Science ({{ scienceRemaining }}/30)
    </button>
  </div>
</template>
