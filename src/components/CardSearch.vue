<script setup lang="ts">
import { Elm } from "../CardSearch.elm";
import elmBridge from "elm-vue-bridge/dist/elm-vue-bridge.umd";
import { watchEffect, computed, onMounted, onUnmounted } from "vue";

const CardSearch = elmBridge(Elm, {
  name: "CardSearchElm",
  props: {
    searchTerm: String,
    selectedCard: String,
  },
  emit: ["setSearchTerm", "setSelectedCard"],
});

// Constants
const SEARCH_TERM = "searchTerm";
const SELECTED_CARD = "selectedCard";
let ports: any;
let preventPush: boolean = false;

// Current parameters
const params =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search)
    : null;

const searchTerm = params?.get(SEARCH_TERM) || "";
const selectedCard = params?.get(SELECTED_CARD);

// Setters
function setSearchTerm(term: string) {
  params?.set(SEARCH_TERM, term);
  updateURL();
}

function setSelectedCard(card: string | null) {
  if (card) {
    params?.set(SELECTED_CARD, card);
  } else {
    params?.delete(SELECTED_CARD);
  }
  updateURL(true);
}

function updateURL(push?: boolean) {
  if (typeof window !== "undefined") {
    const updatedParams = `${window.location.pathname}?${params?.toString()}`;
    if (preventPush) {
      preventPush = false;
      return;
    }

    if (push) {
      window.history.pushState({}, "", updatedParams);
    } else {
      window.history.replaceState({}, "", updatedParams);
    }
  }
}

function registerPorts(p: unknown) {
  ports = p;
}

function reportParamsToElm() {
  preventPush = true;
  const updatedParams = new URLSearchParams(window.location.search);
  const updatedSelectedCard = updatedParams?.get(SELECTED_CARD);
  ports?.updateSelectedCard?.send(updatedSelectedCard || "");
}

onMounted(() => {
  window.addEventListener("popstate", reportParamsToElm);
});

onUnmounted(() => {
  window.removeEventListener("popstate", reportParamsToElm);
});
</script>

<template>
  <CardSearch
    :searchTerm="searchTerm"
    :selectedCard="selectedCard"
    :ports="registerPorts"
    @setSearchTerm="setSearchTerm"
    @setSelectedCard="setSelectedCard"
  />
</template>
