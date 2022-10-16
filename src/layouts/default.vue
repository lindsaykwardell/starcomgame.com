<script setup lang="ts">
import "../assets/index.css";
</script>

<template>
  <header
    class="flex flex-col gap-8 pt-4 pb-16 justify-center w-2/3 md:w-[750px] m-auto"
  >
    <div
      class="flex flex-col md:flex-row items-center gap-8 pt-4 pb-16 justify-center"
    >
      <img src="@/assets/starcom-logo.png" alt="" />
      <a
        class="font-megrim text-5xl md:text-6xl text-center font-bold hover:underline"
        href="/"
        >Star Commander</a
      >
    </div>
    <nav class="flex flex-col md:flex-row md:gap-10">
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
  <footer class="w-5/6 md:w-[450px] m-auto">
    <!-- <div
      class="flex flex-col md:flex-row justify-around gap-12 mt-12 text-center"
    >
      <a
        href="https://play.starcomgame.com/"
        target="_blank"
        class="block rounded-lg bg-gradient-to-b from-blue-900 hover:from-blue-800 via-gray-900 hover:via-gray-800 to-black hover:to-gray-900 px-6 py-3 shadow hover:shadow-md"
      >
        Play the Game
      </a>

      <a
        href="/card-database"
        class="block rounded-lg bg-gradient-to-b from-blue-900 hover:from-blue-800 via-gray-900 hover:via-gray-800 to-black hover:to-gray-900 px-6 py-3 shadow hover:shadow-md"
      >
        See the Cards
      </a>

      <a
        href="https://rules.starcomgame.com"
        target="_blank"
        class="block rounded-lg bg-gradient-to-b from-blue-900 hover:from-blue-800 via-gray-900 hover:via-gray-800 to-black hover:to-gray-900 px-6 py-3 shadow hover:shadow-md"
      >
        Read the Rulebook
      </a>
    </div> -->

    <a href="/">
      <img
        src="@/assets/starcom-logo.png"
        class="my-12 m-auto"
        alt="Star Commander"
      />
    </a>
  </footer>
</template>

<style lang="pcss">
nav a.router-link-active {
  @apply underline;
}
</style>
