<script setup>
import { Elm } from "../RandomCard.elm";
import elmBridge from "elm-vue-bridge/dist/elm-vue-bridge.umd";

const RandomCard = elmBridge(Elm, {
  name: "RandomCard",
  props: {},
  emit: [],
});
</script>

<template>
  <RandomCard />
</template>
