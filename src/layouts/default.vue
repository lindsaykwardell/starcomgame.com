<script setup lang="ts">
import "../assets/index.css";
</script>

<template>
  <header
    class="flex flex-col md:flex-row items-center gap-8 pt-4 pb-16 justify-center"
  >
    <img src="@/assets/starcom-logo.png" alt="" />
    <a
      class="font-megrim text-5xl md:text-6xl text-center font-bold hover:underline"
      href="/"
      >Star Commander</a
    >
  </header>
  <main class="flex flex-col items-center">
    <slot />
  </main>
  <footer class="w-5/6 md:w-[450px] m-auto">
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
