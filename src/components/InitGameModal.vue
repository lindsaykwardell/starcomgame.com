<script setup>
import { computed } from "vue";
import Dialog from "./Dialog/Dialog.vue";

const props = defineProps({
  modelValue: Boolean,
  gameSize: Number,
});

const emit = defineEmits(["update:modelValue", "update:gameSize", "startGame"]);

const open = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

const gameSize = computed({
  get() {
    return props.gameSize;
  },
  set(val) {
    emit("update:gameSize", val);
  },
});

function startGame() {
  open.value = false;
  emit("startGame");
}
</script>

<template>
  <Dialog v-model="open" :hideButton="true" class="w-[500px]">
    <template #header>
      <div class="text-3xl">Game Settings</div>
    </template>

    <fieldset>
      <legend>Game Size</legend>
      <label> <input type="radio" v-model="gameSize" :value="3" /> 3x3 </label>
      <label> <input type="radio" v-model="gameSize" :value="4" /> 4x4 </label>
      <label> <input type="radio" v-model="gameSize" :value="5" /> 5x5 </label>
    </fieldset>

    <button
      @click="startGame"
      class="block rounded-lg bg-gradient-to-b from-blue-900 hover:from-blue-800 via-gray-900 hover:via-gray-800 to-black hover:to-gray-900 px-6 py-3 shadow hover:shadow-md"
    >
      Start the game!
    </button>
  </Dialog>
</template>