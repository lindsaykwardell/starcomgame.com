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

<!-- <style lang="pcss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transform: translateY(0);
  transition: opacity 0.5s, transform 0.5s;
}

.slide-up-enter,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.my-dialog {
  position: relative;
}

.my-dialog .vts-dialog {
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
}

.my-dialog .vts-dialog__content {
  @apply rounded-md bg-gray-900;
  overflow: hidden;
  transition: transform 0.3s;
  max-width: 95vw;

  & .body {
    max-height: 80vh;
    overflow: auto;
  }
}

.my-dialog .fade-enter .vts-dialog__content,
.my-dialog .fade-leave-active .vts-dialog__content {
  transform: translateY(20px);
}
</style> -->
