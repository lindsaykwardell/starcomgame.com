<script setup lang="ts">
import { Elm } from "../CardSearch.elm";
import elmBridge from "elm-vue-bridge";

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
  updateURL();
}

function updateURL() {
  if (typeof window !== "undefined") {
    window.history.pushState(
      {},
      "",
      `${window.location.pathname}?${params?.toString()}`
    );
  }
}
</script>

<template>
  <CardSearch
    :searchTerm="searchTerm"
    :selectedCard="selectedCard"
    @setSearchTerm="setSearchTerm"
    @setSelectedCard="setSelectedCard"
  />
</template>
