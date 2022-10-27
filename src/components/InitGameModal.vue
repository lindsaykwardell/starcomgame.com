<script setup>
import { computed, ref } from "vue";
import Dialog from "./Dialog/Dialog.vue";

const props = defineProps({
  modelValue: Boolean,
  gameSize: Number,
  playerCount: Number,
  multiplayerSeat: String,
  serverStatus: String,
});

const onlineGameId = ref("");

const emit = defineEmits([
  "update:modelValue",
  "update:gameSize",
  "update:playerCount",
  "startGame",
]);

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

const playerCount = computed({
  get() {
    return props.playerCount;
  },
  set(val) {
    emit("update:playerCount", val);
  },
});

function startGame() {
  open.value = false;
  emit("startGame");
}

function connectToOnlineGame() {
  location.href = window.location.hash = onlineGameId.value;
  location.reload();
}
</script>

<template>
  <Dialog v-model="open" :hideButton="true" class="w-[500px]">
    <template #header>
      <div class="text-3xl">Game Settings</div>
    </template>

    <fieldset>
      <legend>Game Size</legend>
      <label class="px-2">
        <input type="radio" v-model="gameSize" :value="3" /> 3x3
      </label>
      <label class="px-2">
        <input type="radio" v-model="gameSize" :value="4" /> 4x4
      </label>
      <label class="px-2">
        <input type="radio" v-model="gameSize" :value="5" /> 5x5
      </label>
    </fieldset>

    <fieldset v-if="!serverStatus">
      <legend>Player Count</legend>
      <label class="px-2">
        <input type="radio" v-model="playerCount" :value="2" /> 2
      </label>
      <label class="px-2">
        <input type="radio" v-model="playerCount" :value="3" /> 3
      </label>
      <label class="px-2">
        <input type="radio" v-model="playerCount" :value="4" /> 4
      </label>
    </fieldset>
    <div v-else>Player Count: {{ playerCount }}</div>

    <form v-if="!serverStatus" @submit="connectToOnlineGame">
      <label class="flex flex-col pb-6">
        Connect to Online Game
        <input class="text-black" v-model="onlineGameId" />
        <button
          class="block rounded-lg bg-gradient-to-b from-blue-900 hover:from-blue-800 via-gray-900 hover:via-gray-800 to-black hover:to-gray-900 px-6 py-3 shadow hover:shadow-md"
        >
          Connect!
        </button>
      </label>
    </form>

    <div
      v-else-if="serverStatus !== 'connected'"
      class="font-megrim text-2xl bold py-6"
    >
      Connecting...
    </div>

    <template v-else>
      <div
        v-if="multiplayerSeat === 'player1'"
        class="font-megrim text-2xl bold text-red-600 py-6"
      >
        Player 1
      </div>
      <div
        v-if="multiplayerSeat === 'player2'"
        class="font-megrim text-2xl bold text-blue-600 py-6"
      >
        Player 2
      </div>
      <div
        v-if="multiplayerSeat === 'player3'"
        class="font-megrim text-2xl bold text-green-600 py-6"
      >
        Player 3
      </div>
      <div
        v-if="multiplayerSeat === 'player4'"
        class="font-megrim text-2xl bold text-yellow-600 py-6"
      >
        Player 4
      </div>
    </template>

    <button
      @click="startGame"
      class="block rounded-lg bg-gradient-to-b from-blue-900 hover:from-blue-800 via-gray-900 hover:via-gray-800 to-black hover:to-gray-900 px-6 py-3 shadow hover:shadow-md"
    >
      Start the game!
    </button>
  </Dialog>
</template>
