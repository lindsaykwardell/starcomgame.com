<script setup>
import { ref, watchEffect } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: "md",
  },
  hideButton: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const dialog = ref();

function close() {
  emit("update:modelValue", false);
}

watchEffect(() => {
  if (props.modelValue) {
    dialog.value?.showModal();
  } else {
    dialog.value?.close();
  }
});
</script>

<template>
  <dialog ref="dialog" class="bg-gray-900 text-white">
    <slot name="trigger"></slot>

    <div class="bg-gray-700 shadow flex items-center p-2 px-5">
      <div class="flex-grow">
        <h5><slot name="header"></slot></h5>
      </div>
      <div class="flex-shrink" :class="{ hidden: hideButton }">
        <button
          @click="close"
          aria-label="close"
          class="text-3xl px-3 text-gray-900 hover:text-gray-600"
        >
          &times;
        </button>
      </div>
    </div>

    <div class="body">
      <div class="m-3">
        <slot></slot>
      </div>
    </div>
  </dialog>
</template>

<style>
dialog {
  user-select: none;
}
</style>
