<template>
  <draggable
    :list="_list"
    :group="group"
    ghost-class="ghost"
    chosen-class="chosen"
    drag-class="drag"
    item-key="id"
    class="flex justify-center"
    @end="dropped"
  >
    <template #item="item">
      <div v-if="!player || item?.element.controlledBy === player">
        <div class="relative">
          <Card
            :class="cardClass"
            :card="item?.element"
            :loc="loc"
            :combat="combat"
            :showEffects="showEffects"
          />
          <DamageDice
            v-if="item?.element.damage"
            :damage="item?.element.damage"
            :showNumber="cardClass.includes('xs')"
          />
        </div>
      </div>
    </template>
  </draggable>
</template>

<script>
import draggable from "vuedraggable";
import Card from "@/components/Card/Card.vue";
import DamageDice from "@/components/Dice/DamageDice.vue";

import EventBus from "@/util/EventBus";

export default {
  name: "dropzone",
  display: "DropZone",
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    group: {
      type: String,
      default: "default",
    },
    player: {
      type: String,
      required: false
    },
    cardClass: {
      type: String,
      default: "",
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
  computed: {
    _list: {
      get() {
        return this.list;
      },
      set(list) {
        this.$emit("update:list", list);
      },
    },
  },
  methods: {
    dropped() {
      EventBus.$emit("dropzone-dropped", this.group);
    }
  },
  components: {
    draggable,
    Card,
    DamageDice,
  },
};
</script>

<style lang="pcss" scoped>
.list-group-item {
  display: inline-flex;
  flex-direction: column;
  height: 350px;
}
.ghost {
  opacity: 0.5;
}
.chosen {
  opacity: 0.5;
}
.drag {
  opacity: 0.5;
}
</style>
