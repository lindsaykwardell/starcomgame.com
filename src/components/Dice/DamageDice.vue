<template>
  <div class="damage-die">
    <template v-if="showNumber">
      <span class="m-1">{{damage}}</span>
    </template>
    <template v-else>
      <font-awesome
        class="m-1"
        v-for="(n, index) in Math.ceil(damage / 6)"
        :key="index"
        :size="size"
        :icon="['fa', getDice(damage - 6 * index)]"
      />
    </template>
  </div>
</template>

<script>
export default {
  props: {
    damage: {
      type: Number,
      default: 0,
    },
    size: {
      type: String,
      default: "lg",
    },
    showNumber: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    getDice(val) {
      switch (val) {
        case 1:
          return "dice-one";
        case 2:
          return "dice-two";
        case 3:
          return "dice-three";
        case 4:
          return "dice-four";
        case 5:
          return "dice-five";
        case 6:
        default:
          return "dice-six";
      }
    },
  },
};
</script>

<style lang="postcss" scoped>
.damage-die {
  @apply rounded-lg;
  /* padding: 5px; */
  /* max-width: 70%; */
  pointer-events: none;
  user-select: none;
  color: red;
  background: white;
  position: absolute;
  top: 15%;
  left: 10%;
}
</style>
