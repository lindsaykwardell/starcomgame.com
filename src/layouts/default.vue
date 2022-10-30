<script setup lang="ts">
import "../assets/index.css";

useHead({
  link: [{ rel: "icon", href: "/favicon.png" }],
  script: [
    {
      "data-goatcounter": "https://starcomgame.goatcounter.com/count",
      async: true,
      src: "//gc.zgo.at/count.js",
    },
  ],
});
</script>

<template>
  <header
    class="flex flex-col gap-8 pt-4 pb-6 md:pb-16 justify-center m-auto bg-gradient-to-b from-[#000716] to-gray-800"
  >
    <div
      class="flex flex-col md:flex-row items-center gap-8 pt-4 md:pb-16 justify-center"
    >
      <img src="@/assets/starcom-logo.png" alt="" />
      <a
        class="font-megrim text-5xl md:text-6xl text-center font-bold hover:underline"
        href="/"
        >Star Commander</a
      >
    </div>
    <nav
      class="flex flex-col md:flex-row gap-3 md:gap-10 justify-center m-auto"
    >
      <router-link to="/" class="flex items-center gap-1">
        <img src="@/assets/starcom-logo.png" class="w-8" />
        Home
      </router-link>
      <router-link to="/card-database" class="flex items-center gap-1">
        <img src="@/assets/industry-icon.webp" class="w-8" />
        Card Database
      </router-link>
      <router-link to="/blog" class="flex items-center gap-1">
        <img src="@/assets/science-icon.webp" class="w-8" />
        Blog
      </router-link>
      <a
        href="https://rules.starcomgame.com"
        target="_blank"
        class="flex items-center gap-1"
      >
        <img src="@/assets/statecraft-icon.webp" class="w-8" />
        Rules
      </a>
    </nav>
  </header>
  <main class="flex flex-col items-center">
    <slot />
  </main>
  <footer
    class="m-auto flex flex-col justify-center items-center gap-4 py-12 bg-gradient-to-b from-gray-800 to-[#001656]"
  >
    <a href="/">
      <img
        src="@/assets/starcom-logo.png"
        class="m-auto"
        alt="Star Commander"
      />
    </a>
    <p class="text-sm text-center pb-3">
      Copyright © {{ new Date().getFullYear() }} Lindsay Wardell
    </p>
    <a href="https://ko-fi.com/F1F8FU9C3" target="_blank"
      ><img
        height="36"
        style="border: 0px; height: 36px"
        src="https://cdn.ko-fi.com/cdn/kofi2.png?v=3"
        border="0"
        alt="Buy Me a Coffee at ko-fi.com"
    /></a>
  </footer>
</template>

<style lang="pcss">
nav a.router-link-active {
  @apply underline;
}
</style>
