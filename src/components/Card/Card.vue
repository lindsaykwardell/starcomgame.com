<template>
  <div class="card">
    <img
      :class="hasAssignedDamage"
      :src="getImgUrl(card.img)"
      :alt="card.img"
      @mouseover="hoverCard"
      @contextmenu.prevent="openContextMenu($event)"
      :data-damage="card.damage"
      :title="title"
    />
    <div v-if="showEffects" class="absolute bottom-1 left-1">
      <img
        v-for="(effect, index) in card.effects"
        :key="index"
        :src="getImgUrl(effect)"
        class="card xs"
        :title="effect"
        :alt="effect"
      />
    </div>
  </div>
</template>

<script>
import EventBus from "@/util/EventBus";
import { DAMAGEABLE, SYSTEM, CAPITAL_SYSTEM } from "@/lib/core-v3";

export default {
  props: {
    card: {
      type: Object,
      default: () => ({
        img: "",
        type: "",
        backImg: "",
        explored: false,
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
    showEffects: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    getImgUrl(cardName) {
      if (
        [SYSTEM, CAPITAL_SYSTEM].includes(this.card.type) &&
        !this.card.explored
      ) {
        return this.card.backImg;
      }

      if (cardName) {
        return "/cards/" + cardName + ".webp";
      } else {
        return this.card.backImg || "/back.jpg";
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
  @apply rounded-[7px] hover:border relative;
  width: 125px;
  height: 175px;
  overflow: hidden;

  & img {
    width: 100%;
    height: 100%;
    object-fit: fill;
  }

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
