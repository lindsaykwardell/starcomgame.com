<template>
  <div v-if="system" class="system">
    <DropZone
      class="dropzone top"
      :class="combat ? 'combat' : ''"
      :cardClass="combat ? '' : 'xs'"
      :list.sync="vessels"
      :group="`player2-${group}`"
      player="player2"
      :loc="system.card.loc"
      :combat="combat"
      :showEffects="showEffects"
    />
    <div class="flex">
      <DropZone
        class="dropzone left"
        :class="combat ? 'combat' : ''"
        :cardClass="combat ? '' : 'xs'"
        :list.sync="vessels"
        :group="`player3-${group}`"
        player="player3"
        :loc="system.card.loc"
        :combat="combat"
        :showEffects="showEffects"
      />
      <div class="relative">
        <Card
          :class="combat ? 'horizontal-lg' : 'horizontal'"
          :card="system.card"
          :showEffects="showEffects"
        />
        <div v-if="system.card.developmentLevel > 0" class="development-die">
          <font-awesome size="2x" :icon="['fa', firstDie]" :class="dieColor" />
          <font-awesome
            v-if="system.card.developmentLevel > 6"
            size="2x"
            :icon="['fa', secondDie]"
            :class="dieColor"
          />
        </div>
      </div>
      <DropZone
        class="dropzone right"
        :class="combat ? 'combat' : ''"
        :cardClass="combat ? '' : 'xs'"
        :list.sync="vessels"
        :group="`player4-${group}`"
        player="player4"
        :loc="system.card.loc"
        :combat="combat"
        :showEffects="showEffects"
      />
    </div>
    <DropZone
      class="dropzone bottom"
      :class="combat ? 'combat' : ''"
      :cardClass="combat ? '' : 'xs'"
      :list.sync="vessels"
      :group="`player1-${group}`"
      player="player1"
      :loc="system.card.loc"
      :combat="combat"
      :showEffects="showEffects"
    />
  </div>
</template>

<script>
import DropZone from "@/components/DropZone/DropZone.vue";
import Card from "@/components/Card/Card.vue";

export default {
  props: {
    system: {
      type: Object,
      default: null,
    },
    group: {
      type: String,
      default: "default",
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
  computed: {
    _system: {
      get() {
        return this.system;
      },
      set(system) {
        this.$emit("update:system", system);
      },
    },
    vessels: {
      get() {
        return this.system.vessels;
      },
      set(vessels) {
        this._system = {
          ...this.system,
          vessels,
        };
      },
    },
    firstDie() {
      switch (this.system.card.developmentLevel) {
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
    secondDie() {
      switch (this.system.card.developmentLevel) {
        case 7:
          return "dice-one";
        case 8:
          return "dice-two";
        case 9:
          return "dice-three";
        case 10:
          return "dice-four";
        case 11:
          return "dice-five";
        case 12:
        default:
          return "dice-six";
      }
    },
    dieColor() {
      // if (this.system.card.controlledBy === "player1") return "text-red-400";
      // else return "text-blue-400";
      switch (this.system.card.controlledBy) {
        case "player1":
          return "text-red-400";
        case "player2":
          return "text-blue-400";
        case "player3":
          return "text-green-400";
        case "player4":
          return "text-yellow-400";
      }
    },
  },
  watch: {
    system: {
      deep: true,
      handler() {
        if (!this.system.card.explored && this.system.vessels.length > 0) {
          this.$emit("explored", this.system.card);
        }
      },
    },
    _system: {
      deep: true,
      handler() {},
    },
  },
  components: {
    DropZone,
    Card,
  },
};
</script>

<style lang="pcss" scoped>
.system {
  @apply flex flex-col justify-center items-center relative my-2;
  /* margin-top: 30px; */
  /* margin-bottom: 50px; */
}

.dropzone {
  position: absolute;
  height: 25px;
  /* width: 30vw; */

  &.top {
    top: -45px;
    min-width: 140px;

    &.combat {
      top: -275px;
      width: 100vw;
    }
  }

  &.left {
    left: -70px;
    top: 35px;
    min-width: 100px;
    transform: rotate(90deg);

    &.combat {
      /* width: 100vh; */
      left: -430px;
      top: 90px;
    }
  }

  &.right {
    left: 105px;
    top: 35px;
    /* width: 300px; */
    min-width: 100px;
    transform: rotate(-90deg);

    &.combat {
      /* width: 100vh; */
      /* left: -160px; */
      right: -890px;
      top: 90px;
    }
  }

  &.bottom {
    bottom: -25px;
    min-width: 140px;
    padding-bottom: 1rem;

    &.combat {
      bottom: -100px;
      width: 100vw;
    }
  }
}

.development-die {
  @apply rounded-full flex gap-1;
  padding: 5px;
  background: white;
  position: absolute;
  bottom: 20px;
  left: 10px;
}
</style>
