<template>
  <VDialog v-model="dialog" bg-transition="fade" class="my-dialog text-white" :classes="{ content: dialogClass }">
    <template v-if="!hideButton" #toggle="{ on, attrs }">
      <button v-on="on" v-bind="attrs" :class="buttonClass">
        <slot name="button">Show the dialog</slot>
      </button>
    </template>

    <div class="bg-gray-700 shadow flex items-center p-2 px-5">
      <div class="flex-grow">
        <h5><slot name="header"></slot></h5>
      </div>
      <div class="flex-shrink">
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
  </VDialog>
</template>

<script>
import { VDialog } from 'vuetensils'

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'md',
    },
    buttonClass: {
      type: String,
      default: '',
    },
    dialogClass: {
      type: String,
      default: ''
    },
    hideButton: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    dialog: {
      get() {
        return this.show
      },
      set(val) {
        this.$emit('toggle', val)
      },
    },
  },
  methods: {
    close() {
      this.$emit('toggle', false)
    }
  },
  components: {
    VDialog,
  },
}
</script>

<style lang="postcss">
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
</style>
