<template>
  <img
    class="card"
    :class="hasAssignedDamage"
    :src="getImgUrl(card.img)"
    :alt="card.img"
    @mouseover="hoverCard"
    @contextmenu.prevent="openContextMenu($event)"
    :data-damage="card.damage"
    :title="title"
  />
</template>

<script>
import EventBus from "@/util/EventBus";
import { DAMAGEABLE } from "@/lib/core-v2";

export default {
  props: {
    card: {
      type: Object,
      default: () => ({
        img: "",
      }),
    },
    loc: {
      type: [Number, String],
      default: 0,
    },
    combat: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    getImgUrl(cardName) {
      if (cardName) {
        return "/cards/" + cardName + ".webp"
      } else {
        return "/back.jpg"
      }
    },
    hoverCard() {
      EventBus.$emit("card:hover", this.card);
    },
    openContextMenu(event) {
      EventBus.$emit("card:context", {
        card: this.card,
        loc: this.card.loc || this.loc,
        event,
      });
    },
  },
  computed: {
    hasAssignedDamage() {
      return this.combat && !!this.card.damageAssignedTo
        ? "assigned-damage"
        : "";
    },
    title() {
      if (DAMAGEABLE.includes(this.card.type)) {
        return `(${this.card.id}) Damage: ${this.card.damage}`;
      }

      return "";
    },
  },
};
</script>

<style lang="pcss" scoped>
.assigned-damage {
  @apply transform;
  --transform-rotate: 10deg;
  opacity: 0.5;
}

.card {
  @apply rounded-[7px] hover:border;
  width: 125px;
  height: 175px;

  &.horizontal {
    width: 140px;
    height: 100px;
  }

  &.horizontal-lg {
    width: 300px;
    height: 225px;
  }

  &.sm {
    @apply rounded-[5px];
    width: 75px;
    height: 105px;
  }

  &.xs {
    @apply rounded-[2px];
    width: 30px;
    height: 45px;
  }

  &.md {
    @apply rounded-[11px];
    width: 200px;
    height: 275px;
  }

  &.lg {
    @apply rounded-[18px];
    width: 300px;
    height: 425px;
  }
}
</style>
