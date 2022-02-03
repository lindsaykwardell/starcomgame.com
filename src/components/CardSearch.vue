<script setup lang="ts">
import { Elm } from "../CardSearch.elm";
import elmBridge from "elm-vue-bridge";

const CardSearch = elmBridge(Elm, {
  name: "CardSearchElm",
});
</script>

<template>
  <CardSearch />
</template>
