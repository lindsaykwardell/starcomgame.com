<template>
  <div class="flex">
    <div class="bar">
      <div class="bar-content flex flex-col">
        <div class="flex-grow">
          <div class="flex">
            <button
              class="p-1 bg-blue-400 hover:bg-blue-600 duration-200 flex-1"
              @click="draw(activePlayer, decks.politics)"
            >
              Politics ({{ decks.politics.remaining }}/30)
            </button>
            <button
              class="p-1 bg-red-400 hover:bg-red-600 duration-200 flex-1"
              @click="draw(activePlayer, decks.industry)"
            >
              Industry ({{ decks.industry.remaining }}/30)
            </button>
            <button
              class="p-1 bg-green-400 hover:bg-green-600 duration-200 flex-1"
              @click="draw(activePlayer, decks.science)"
            >
              Science ({{ decks.science.remaining }}/30)
            </button>
          </div>

          <!-- <Dialog :show="showDiscard" @toggle="toggleDiscard">
            <template v-slot:button
              ><h6 class="text-white">
                Discard ({{ discard.length }})
              </h6></template
            >
            <template v-slot:header>All Discarded Cards</template>
            <p v-if="discard.length <= 0">
              No cards have been placed in discard yet.
            </p>
            <Card
              v-for="card in discard"
              :key="card.id"
              :card="card"
              class="inline lg"
            />
          </Dialog> -->
          <Card :card="discard[0]" class="m-auto" />
          <!-- <Dialog :show="showStack" @toggle="toggleStack">
            <template v-slot:button
              ><h4 class="text-white">
                Current Actions ({{ stack.length }})
              </h4></template
            >
            <template v-slot:header>All Cards to Resolve</template>
            <p v-if="stack.length <= 0">No cards have been played yet.</p>
            <Card
              v-for="card in stack"
              :key="card.id"
              :card="card"
              class="inline lg"
            />
          </Dialog> -->
          <Card :card="stack[0]" class="md m-auto" loc="stack" />
        </div>
        <a
          class="flex-shrink relative"
          :href="`https://starcomgame.com/card-database?selectedCard=${hoveredCard.img}`"
          target="_blank"
        >
          <Card
            v-if="
              hoveredCard &&
              hoveredCard.type &&
              hoveredCard.type.includes('System')
            "
            class="horizontal-lg"
            :card="hoveredCard"
          />
          <Card v-else class="lg" :card="hoveredCard" loc="hover" />
          <DamageDice
            v-if="hoveredCard.damage"
            :damage="hoveredCard.damage"
            size="3x"
          />
        </a>
      </div>
    </div>
    <div class="flex-grow bg-black h-screen">
      <div v-if="shouldBoardDisplay" class="board relative overflow-y-scroll">
        <template v-if="!showCombat">
          <div class="flex justify-around mt-6">
            <System
              :system.sync="systems[0]"
              group="board"
              @explored="onExplore"
            />
          </div>
          <div class="flex justify-around w-4/5 m-auto">
            <System
              :system.sync="systems[1]"
              group="board"
              @explored="onExplore"
            />
            <System
              :system.sync="systems[2]"
              group="board"
              @explored="onExplore"
            />
          </div>
          <div class="flex justify-around">
            <System
              :system.sync="systems[3]"
              group="board"
              @explored="onExplore"
            />
            <System
              :system.sync="systems[4]"
              group="board"
              @explored="onExplore"
            />
            <System
              :system.sync="systems[5]"
              group="board"
              @explored="onExplore"
            />
          </div>
          <div class="flex justify-between">
            <System
              :system.sync="systems[6]"
              group="board"
              @explored="onExplore"
            />
            <System
              :system.sync="systems[7]"
              group="board"
              @explored="onExplore"
            />
            <System
              :system.sync="systems[8]"
              group="board"
              @explored="onExplore"
            />
            <System
              :system.sync="systems[9]"
              group="board"
              @explored="onExplore"
            />
          </div>
          <div class="flex justify-around">
            <System
              :system.sync="systems[10]"
              group="board"
              @explored="onExplore"
            />
            <System
              :system.sync="systems[11]"
              group="board"
              @explored="onExplore"
            />
            <System
              :system.sync="systems[12]"
              group="board"
              @explored="onExplore"
            />
          </div>
          <div class="flex justify-around w-4/5 m-auto">
            <System
              :system.sync="systems[13]"
              group="board"
              @explored="onExplore"
            />
            <System
              :system.sync="systems[14]"
              group="board"
              @explored="onExplore"
            />
          </div>
          <div class="flex justify-around">
            <System
              :system.sync="systems[15]"
              group="board"
              @explored="onExplore"
            />
          </div>
        </template>
        <template v-else>
          <div class="flex justify-around items-center board-height">
            <System
              group="combat"
              :system.sync="systems[combatSystemLoc]"
              combat
            />
          </div>
        </template>
        <button
          class="next-turn-button"
          @click="showCombat ? endCombat() : nextTurn()"
        >
          {{ showCombat ? "End Combat" : "Pass Turn" }}
        </button>
        <div class="active-player-stats flex">
          <div
            class="flex-1 mr-3 bg-red-400 p-1 rounded-lg duration-200 whitespace-nowrap"
            :class="
              activePlayer === 'player1' ? 'bg-red-400 shadow-lg' : 'bg-red-900'
            "
          >
            Credits: {{ players.player1.credits }}<br />
            Developments: {{ getPlayerDevelopmentCount("player1") }}
          </div>
          <div
            class="flex-1 bg-blue-400 p-1 rounded-lg duration-200 whitespace-nowrap"
            :class="
              activePlayer === 'player2'
                ? 'bg-blue-400 shadow-lg'
                : 'bg-blue-900'
            "
          >
            Credits: {{ players.player2.credits }}<br />
            Developments: {{ getPlayerDevelopmentCount("player2") }}
          </div>
          <button
            class="p-2 bg-gray-700 hover:bg-gray-800 text-white ml-5 rounded-full duration-200 w-48"
            @click="showTechnology = !showTechnology"
          >
            Show {{ showTechnology ? "Hand" : "Technology" }}
          </button>
        </div>
        <div class="d20 text-black">
          <font-awesome size="4x" :icon="['fa', 'dice-d20']" :class="dieRoll" />
        </div>
      </div>
      <div class="hand" v-if="shouldBoardDisplay">
        <DropZone :list.sync="currentHandDisplay" group="hand" />
      </div>
    </div>
    <click-outside
      v-if="showContextMenu && contextCard"
      @clickoutside="onClickout"
      class="context-menu"
      :style="contextCoordinates"
    >
      <div v-for="option in currentContextMenu" :key="option.action" class="">
        <button
          v-if="
            !option.condition ||
            option.condition({
              card: contextCard,
              system: systems[contextLoc],
              activePlayer,
              players,
              inCombat: showCombat,
            })
          "
          class="hover:bg-gray-600 p-2 w-full text-left"
          @click="performAction(option)"
        >
          {{ option.label }}
        </button>
      </div>
    </click-outside>
  </div>
</template>
<script>
import DropZone from "@/components/DropZone/DropZone.vue";
import System from "@/components/System/System.vue";
import Card from "@/components/Card/Card.vue";
import DamageDice from "@/components/Dice/DamageDice.vue";
// import Dialog from "@/components/Dialog/Dialog";
// import { clickout } from "vuetensils/src/directives";

import {
  DECK_POLITICS,
  DECK_INDUSTRY,
  DECK_SCIENCE,
  DECK_SYSTEM,
  CARD_LIST,
  HOMEWORLD,
  HAND_CONTEXT_MENU,
  DISCARD_CONTEXT_MENU,
  DAMAGE_CONTEXT_MENU,
  SCOUT,
  POLITICS,
  INDUSTRY,
  SCIENCE,
  TECHNOLOGY,
  DAMAGEABLE,
  generateResolveContextMenu,
  generateCombatContextMenu,
} from "@/lib/core-v2";
import Deck from "@/models/Deck";

import EventBus from "@/util/EventBus";

export default {
  name: "Game",
  display: "Game",
  order: 1,
  data() {
    return {
      nextId: 0,
      dieValue: 0,
      showBoard: false,
      showCombat: false,
      combatSystemLoc: 0,
      showDiscard: false,
      showTechnology: false,
      showStack: false,
      showContextMenu: false,
      players: {
        player1: {
          credits: 3,
          technology: [],
          hand: [],
          technology: [],
        },
        player2: {
          credits: 3,
          technology: [],
          hand: [],
          technology: [],
        },
      },
      activePlayer: "player1",
      contextCard: null,
      contextLoc: 0,
      contextCoordinates: {
        x: 0,
        y: 0,
      },
      hoveredCard: {
        img: "",
      },
      systems: [],
      discard: [],
      stack: [],
      decks: {
        politics: new Deck(DECK_POLITICS),
        industry: new Deck(DECK_INDUSTRY),
        science: new Deck(DECK_SCIENCE),
        system: new Deck(DECK_SYSTEM),
      },
    };
  },
  computed: {
    shouldBoardDisplay() {
      return this.showBoard && !this.showDiscard && !this.showStack;
    },
    currentHandDisplay() {
      return this.showTechnology ? this.technology : this.hand;
    },
    activePlayerDevelopmentCount() {
      return this.systems
        .filter((system) => system.card.controlledBy === this.activePlayer)
        .reduce((total, system) => system.card.developmentLevel + total, 0);
    },
    hand: {
      get() {
        return this.players[this.activePlayer].hand;
      },
      set(val) {
        this.players[this.activePlayer].hand = val;
      },
    },
    technology() {
      return this.players[this.activePlayer].technology;
    },
    nonActivePlayer() {
      return this.activePlayer === "player1" ? "player2" : "player1";
    },
    dieRoll() {
      switch (this.dieValue) {
        case 1:
        case 2:
          return "industry";
        case 3:
        case 4:
          return "politics";
        case 5:
        case 6:
          return "science";
        default:
          return "";
      }
      // if (this.dieValue <= 5) {
      //   return "industry";
      // } else if (this.dieValue > 5 && this.dieValue <= 10) {
      //   return "politics";
      // } else if (this.dieValue > 10 && this.dieValue <= 15) {
      //   return "science";
      // } else if (this.dieValue > 15 && this.dieValue <= 18) {
      //   return "tax";
      // } else {
      //   return "pirates";
      // }
    },
    currentContextMenu() {
      if (this.contextLoc === "stack" && this.contextCard.stepContextMenu) {
        return this.contextCard.stepContextMenu[this.contextCard.step]({
          ...this.contextCard.stepContext,
          card: this.contextCard,
          systems: this.systems,
          activePlayer: this.activePlayer,
          nonActivePlayer: this.nonActivePlayer,
          players: this.players,
          discard: this.discard,
          stack: this.stack,
        });
      }

      if (!this.showCombat || !this.contextCard.combatContextMenu) {
        // return this.contextCard.contextMenu;
      } else {
        return this.contextCard.combatContextMenu({
          card: this.contextCard,
          system: this.systems[this.combatSystemLoc],
          players: this.players,
        });
      }

      if (this.contextCard.buildShipContextMenu) {
        return [
          ...this.contextCard.contextMenu,
          ...this.contextCard.buildShipContextMenu({
            card: this.contextCard,
            activePlayer: this.activePlayer,
            players: this.players,
            systems: this.systems,
          }),
        ];
      }

      return this.contextCard.contextMenu;
    },
  },
  methods: {
    rollDie() {
      this.dieValue = Math.floor(Math.random() * 6) + 1;
    },
    playerControlsDomain(player, domain) {
      for (const system of this.systems) {
        if (
          system.card.controlledBy === player &&
          system.card.domain === domain
        ) {
          return true;
        }
      }

      return false;
    },
    toggleDiscard(val) {
      this.showDiscard = val;
      this.showBoard = !val;
    },
    toggleStack(val) {
      this.showStack = val;
      this.showBoard = !val;
    },
    getPlayerDevelopmentCount(player) {
      return this.systems
        .filter((system) => system.card.controlledBy === player)
        .reduce((total, system) => system.card.developmentLevel + total, 0);
    },
    getNextId() {
      this.nextId = this.nextId + 1;
      return this.nextId;
    },
    draw(player, deck) {
      if (typeof deck === "string") {
        if (deck === INDUSTRY) deck = this.decks.industry;
        if (deck === POLITICS) deck = this.decks.politics;
        if (deck === SCIENCE) deck = this.decks.science;
      }

      if (this.players[player].hand.length < 8) {
        const nextCard = deck.draw();
        this.players[player].hand = [
          ...this.players[player].hand,
          {
            ...nextCard,
            id: this.getNextId(),
            contextMenu: [
              //...nextCard.contextMenu,
              ...HAND_CONTEXT_MENU,
            ],
          },
        ];
      } else {
        alert("Too many cards in hand!");
      }
    },
    destroy(destroyedCard) {
      if (destroyedCard.onDestroy) {
        const shouldContinueToDestroy = destroyedCard.onDestroy();
        if (!shouldContinueToDestroy) return;
      }

      if (destroyedCard.damageAssignedTo) {
        this.unassignCombatDamage(destroyedCard);
      }

      this.discard = [
        {
          ...destroyedCard,
          contextMenu: [...DISCARD_CONTEXT_MENU],
          damage: 0,
        },
        ...this.discard,
      ];

      this.systems.forEach((system) => {
        system[this.activePlayer] = system[this.activePlayer].filter(
          (card) => card.id !== destroyedCard.id
        );

        system[this.nonActivePlayer] = system[this.nonActivePlayer].filter(
          (card) => card.id !== destroyedCard.id
        );
      });
    },
    onClickout() {
      this.showContextMenu = false;
    },
    toggleContextMenu(card, loc, event) {
      // Opens the context menu on the specified coordinates,

      this.contextCoordinates = {
        top: `${event.clientY}px`,
        left: `${event.clientX}px`,
      };
      this.showContextMenu = true;
      this.contextCard = card;
      this.contextLoc = loc;
    },
    onExplore(card) {
      card.explored = true;
      if (card.onExplore) {
        card.onExplore({
          card,
          system: this.systems[card.loc],
          activePlayer: this.activePlayer,
          players: this.players,
        });
      }
    },
    performAction(option) {
      const keys = option.action.split(":");
      switch (keys[0]) {
        case "build":
          const card = { ...CARD_LIST.find((c) => c.id == keys[1]) };
          if (card) {
            this.systems[this.contextLoc][this.activePlayer] = [
              ...this.systems[this.contextLoc][this.activePlayer],
              { ...card, id: this.getNextId() },
            ];
            if (option.cost) {
              this.players[this.activePlayer].credits -= option.cost;
            } else {
              this.players[this.activePlayer].credits -= card.cost;
            }
          }
          break;
        case "build-in":
          this.systems[keys[1]][this.activePlayer] = [
            ...this.systems[keys[1]][this.activePlayer],
            { ...this.contextCard, contextMenu: [...DAMAGE_CONTEXT_MENU] },
          ];

          this.stack = this.stack.filter(
            (card) => card.id !== this.contextCard.id
          );
          break;
        case "develop":
          this.contextCard.controlledBy = this.activePlayer;

          if (
            this.contextCard.developmentLevel <
            this.contextCard.maxDevelopmentLevel
          ) {
            let cost = this.systems[this.contextLoc].card.developmentLevel * 2;
            if (cost === 0) cost = 1;
            this.players[this.activePlayer].credits -= cost;
            this.systems[this.contextLoc].card.developmentLevel++;
          }

          break;
        case "damage":
          this.contextCard.damage =
            this.contextCard.damage + parseInt(keys[1], 10);
          break;
        case "repair":
          this.contextCard.damage =
            this.contextCard.damage - parseInt(keys[1], 10);

          this.players[this.activePlayer].credits -= 2;
          break;
        case "destroy":
          this.destroy(this.contextCard);
          break;
        case "hand":
          switch (keys[1]) {
            case "play":
              if (
                this.players[this.activePlayer].credits >= this.contextCard.cost
              ) {
                this.players[this.activePlayer].credits -=
                  this.contextCard.cost;

                this.stack = [
                  {
                    ...this.contextCard,
                    contextMenu: generateResolveContextMenu({
                      card: this.contextCard,
                      systems: this.systems,
                      activePlayer: this.activePlayer,
                      players: this.players,
                    }),
                  },
                  ...this.stack,
                ];

                this.players[this.activePlayer].hand = this.players[
                  this.activePlayer
                ].hand.filter((card) => card.id !== this.contextCard.id);
              } else {
                alert("You don't have enough credits!");
              }

              break;
            case "discard":
              this.discard = [
                { ...this.contextCard, contextMenu: [...DISCARD_CONTEXT_MENU] },
                ...this.discard,
              ];

              this.players[this.activePlayer].hand = this.players[
                this.activePlayer
              ].hand.filter((card) => card.id !== this.contextCard.id);
              break;
            case "return":
              this.players[this.activePlayer].hand = [
                ...this.players[this.activePlayer].hand,
                { ...this.contextCard, contextMenu: [...HAND_CONTEXT_MENU] },
              ];

              this.players[this.activePlayer].credits += this.contextCard.cost;

              this.discard = this.discard.filter(
                (card) => card.id !== this.contextCard.id
              );
              this.stack = this.stack.filter(
                (card) => card.id !== this.contextCard.id
              );
              break;
            case "resolve":
              this.resolveCardOnStack();
              break;
          }
          break;
        case "combat":
          this.showCombat = true;
          this.combatSystemLoc = this.contextLoc;
          break;
        case "assign-damage":
          this.assignCombatDamage(this.contextCard, parseInt(keys[1], 10));
          break;
        case "unassign-damage":
          this.unassignCombatDamage(this.contextCard);
          break;
        case "step":
          // Perform the custom function in the step.
          // Store the value in the contextStepResponse (merge all data together)
          // Increment the step
          // If it's the last step, run 'resolve'

          const result = option.stepAction();
          console.log(result);
          this.contextCard.stepContext = {
            ...this.contextCard.stepContext,
            ...result,
          };
          this.contextCard.step++;
          if (
            this.contextCard.stepContextMenu.length <= this.contextCard.step
          ) {
            this.resolveCardOnStack();
          }
          break;
        default:
        // Do nothing
      }

      this.showContextMenu = false;
    },
    resolveCardOnStack() {
      // Reset step data
      if (this.contextCard.step) {
        this.contextCard.step = 0;
        this.contextCard.stepContext = {};
      }

      if (this.contextCard.type === TECHNOLOGY) {
        this.players[this.activePlayer].technology = [
          ...this.players[this.activePlayer].technology,
          this.contextCard,
        ];
      } else {
        this.discard = [
          {
            ...this.contextCard,
            contextMenu: [...DISCARD_CONTEXT_MENU],
          },
          ...this.discard,
        ];
      }

      this.stack = this.stack.filter((card) => card.id !== this.contextCard.id);

      // Destroy any dead ships
      this.cleanUpDestroyedShips();
    },
    assignCombatDamage(attackingCard, targetId) {
      attackingCard.damageAssignedTo = targetId;
      this.systems[this.combatSystemLoc].player1.forEach((card) => {
        if (card.id === targetId) {
          card.damage += attackingCard.attack;
        }
      });

      this.systems[this.combatSystemLoc].player2.forEach((card) => {
        if (card.id === targetId) {
          card.damage += attackingCard.attack;
        }
      });
    },
    unassignCombatDamage(attackingCard) {
      this.systems[this.combatSystemLoc].player1.forEach((card) => {
        if (card.id === attackingCard.damageAssignedTo) {
          card.damage -= attackingCard.attack;
        }
      });

      this.systems[this.combatSystemLoc].player2.forEach((card) => {
        if (card.id === attackingCard.damageAssignedTo) {
          card.damage -= attackingCard.attack;
        }
      });

      attackingCard.damageAssignedTo = undefined;
    },
    endCombat() {
      console.log("Fired!");
      this.showCombat = false;

      this.systems[this.combatSystemLoc].player1.forEach((card) => {
        card.damageAssignedTo = undefined;
      });

      this.systems[this.combatSystemLoc].player2.forEach((card) => {
        card.damageAssignedTo = undefined;
      });

      this.cleanUpDestroyedShips();
    },
    cleanUpDestroyedShips() {
      this.systems.forEach((system) => {
        system.player1.forEach((card) => {
          if (card.damage >= card.hp) this.destroy(card);
        });

        system.player2.forEach((card) => {
          if (card.damage >= card.hp) this.destroy(card);
        });
      });
    },
    nextTurn() {
      // Clean up destroyed ship
      this.cleanUpDestroyedShips();

      // Conquest
      this.systems.forEach((system) => {
        if (
          system.card.controlledBy === this.nonActivePlayer &&
          system[this.activePlayer].length > 0 &&
          system[this.nonActivePlayer].length === 0
        ) {
          system.card.controlledBy = this.activePlayer;
          system.card.developmentLevel = 1;
        }
      });

      // End of turn effects end.
      this.systems.forEach((system) => {
        system.player1.forEach((card) => {
          if (card.onTurnEnd) {
            card.onTurnEnd({
              card,
              system,
              systems: this.systems,
              activePlayer: this.activePlayer,
              players: this.players,
            });
          }
        });
        system.player2.forEach((card) => {
          if (card.onTurnEnd) {
            card.onTurnEnd({
              card,
              system,
              systems: this.systems,
              activePlayer: this.activePlayer,
              players: this.players,
            });
          }
        });
      });

      // Next player
      this.activePlayer =
        this.activePlayer === "player1" ? "player2" : "player1";

      // Gain credits
      this.players[this.activePlayer].credits +=
        this.activePlayerDevelopmentCount;

      // Check for "At start of turn" effects

      this.players[this.activePlayer].technology.forEach((technology) => {
        if (technology.onTurnStart) {
          technology.onTurnStart({
            card: technology,
            systems: this.systems,
            activePlayer: this.activePlayer,
            players: this.players,
          });
        }
      });

      this.systems.forEach((system) => {
        if (
          system.card.controlledBy === this.activePlayer &&
          system.card.onTurnStart
        ) {
          system.card.onTurnStart({
            card: system.card,
            system: system,
            systems: this.systems,
            activePlayer: this.activePlayer,
            players: this.players,
          });
        }
        system[this.activePlayer].forEach((card) => {
          if (card.onTurnStart) {
            card.onTurnStart({
              card: card,
              system: system,
              systems: this.systems,
              activePlayer: this.activePlayer,
              players: this.players,
            });
          }
        });
      });

      // Roll the new turn die
      this.rollDie();

      let domain;

      switch (this.dieRoll) {
        case "industry":
          domain = INDUSTRY;
          break;
        case "politics":
          domain = POLITICS;
          break;
        case "science":
          domain = SCIENCE;
          break;
      }

      // If it came up with a domain, draw a card if player has matching system
      if (domain) {
        if (this.playerControlsDomain(this.activePlayer, domain)) {
          this.draw(this.activePlayer, domain);
        }
      }
    },
  },
  mounted() {
    const systems = [];
    for (let i = 0; i < 16; i++) {
      systems.push({
        card:
          i === 0 || i === 15
            ? {
                ...HOMEWORLD,
                loc: i,
                controlledBy: i === 0 ? "player2" : "player1",
                explored: false,
              }
            : { ...this.decks.system.draw(), loc: i, controlledBy: null },
        player1: [],
        player2: [],
      });
    }

    systems[0].player2.push({ ...SCOUT, id: this.getNextId() });
    systems[0].card.explored = true;
    systems[15].player1.push({ ...SCOUT, id: this.getNextId() });
    systems[15].card.explored = true;

    this.systems = systems;
    this.showBoard = true;

    // this.players.player1.credits++;

    EventBus.$on("card:hover", (card) => {
      if (!this.showDiscard) this.hoveredCard = card;
    });

    EventBus.$on("card:context", ({ card, loc, event }) => {
      if (loc !== "hover") this.toggleContextMenu(card, loc, event);
    });
  },
  components: {
    DropZone,
    System,
    Card,
    DamageDice,
    // Dialog,
  },
  // directives: {
  //   clickout,
  // },
};
</script>

<style lang="pcss" scoped>
.board {
  padding: 1rem;
  background: linear-gradient(
    rgb(41, 40, 40),
    rgb(24, 18, 36),
    rgb(18, 18, 59)
  );
  height: calc(100vh - 245px);
  overflow: scroll;
}

.board-height {
  height: calc(100vh - 175px);
}

.bar {
  width: 300px;
  position: relative;

  & .bar-content {
    position: fixed;
    left: 0;
    width: 300px;
    height: 100vh;
    background: linear-gradient(0.25turn, black, #222);
  }
}

.hand {
  position: fixed;
  bottom: 0;
  width: calc(100% - 300px);
  height: 175px;
  /* overflow-y: scroll; */
  background: black;
}

.context-menu {
  @apply bg-gray-900 text-white rounded;
  position: absolute;
  border: 1px solid white;
}

.next-turn-button {
  @apply fixed p-3 bg-green-900 rounded-lg shadow-md text-white duration-200;
  bottom: 185px;
  right: 10px;

  &:hover {
    @apply bg-green-600;
  }
}

.active-player-stats {
  @apply fixed text-white text-left;
  bottom: 185px;
  left: 310px;
}

.d20 {
  @apply fixed bg-white p-2 rounded-full;
  top: 20px;
  right: 20px;

  & .industry {
    @apply text-red-600;
  }

  & .politics {
    @apply text-blue-600;
  }

  & .science {
    @apply text-green-600;
  }

  & .tax {
    @apply text-yellow-600;
  }

  & .pirates {
    @apply text-black;
  }
}
</style>
