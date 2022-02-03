<script setup lang="ts">
import "../assets/index.css";
</script>

<template>
  <header
    class="flex items-center gap-8 pt-4 pb-16 justify-center"
  >
    <img src="@/assets/starcom-logo.png" alt="" />
    <a
      class="font-megrim text-6xl text-center font-bold hover:underline"
      href="/"
      >Star Commander</a
    >
  </header>
  <main class="flex flex-col items-center">
    <slot />
  </main>
  <footer class="w-full md:w-[450px] m-auto">
    <div
      class="flex flex-col md:flex-row justify-around gap-12 mt-12 text-center"
    >
      <a
        href="https://drive.google.com/file/d/1KLPobTj1qqrxwzRxa_q0H43E_LpUAs0w/view?usp=sharing"
        target="__blank"
        class="block rounded-lg bg-gradient-to-b from-blue-900 hover:from-blue-800 via-gray-900 hover:via-gray-800 to-black hover:to-gray-900 px-6 py-3 shadow hover:shadow-md"
      >
        Download the Game
      </a>

      <a
        href="https://rules.starcomgame.com"
        target="__blank"
        class="block rounded-lg bg-gradient-to-b from-blue-900 hover:from-blue-800 via-gray-900 hover:via-gray-800 to-black hover:to-gray-900 px-6 py-3 shadow hover:shadow-md"
      >
        Read the Rulebook
      </a>
    </div>

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
@import url('https://fonts.googleapis.com/css2?family=Megrim&family=Raleway&display=swap');


html {
  @apply bg-gray-800 text-white font-raleway;
}

a {
  @apply text-white;
}

.domain-industry {
  @apply text-red-400;
}

.domain-politics {
  @apply text-yellow-500;
}

.domain-science {
  @apply text-green-400;
}
</style>
