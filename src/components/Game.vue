<template>
  <InitGameModal
    v-model="showInitGameModal"
    v-model:gameSize="gameSize"
    @startGame="initGame"
  />
  <div class="flex">
    <div class="bar">
      <div class="bar-content flex flex-col">
        <div class="bg-gradient-to-b from-blue-900 via-gray-900 to-black pb-4">
          <div class="flex justify-center gap-3 pt-2 pb-4 items-center">
            <img src="/favicon.png" class="w-8 h-8" />
            <h1 class="font-megrim text-2xl">Star Commander</h1>
          </div>
          <div class="flex justify-around items-center">
            <a
              href="https://starcomgame.com"
              class="underline hover:text-gray-300"
              target="_blank"
              >Homepage</a
            >
            <a
              href="https://rules.starcomgame.com"
              class="underline hover:text-gray-300"
              target="_blank"
              >Official Rules</a
            >
          </div>
        </div>
        <div class="flex-grow">
          <DeckSelector
            :drawIndustry="() => draw(activePlayer, decks.industry)"
            :drawStatecraft="() => draw(activePlayer, decks.politics)"
            :drawScience="() => draw(activePlayer, decks.science)"
            :industryRemaining="decks.industry.remaining"
            :statecraftRemaining="decks.politics.remaining"
            :scienceRemaining="decks.science.remaining"
            :activePlayerControlsIndustry="activePlayerControlsIndustry"
            :activePlayerControlsStatecraft="activePlayerControlsStatecraft"
            :activePlayerControlsScience="activePlayerControlsScience"
            :hoverCard="(card) => (hoveredCard = card)"
          />
          <Dialog v-model="showDrawCardModal">
            <template #header>
              <div class="text-3xl">Draw a Card</div>
            </template>
            <DeckSelector
              :drawIndustry="() => draw(activePlayer, decks.industry)"
              :drawStatecraft="() => draw(activePlayer, decks.politics)"
              :drawScience="() => draw(activePlayer, decks.science)"
              :industryRemaining="decks.industry.remaining"
              :statecraftRemaining="decks.politics.remaining"
              :scienceRemaining="decks.science.remaining"
              :activePlayerControlsIndustry="activePlayerControlsIndustry"
              :activePlayerControlsStatecraft="activePlayerControlsStatecraft"
              :activePlayerControlsScience="activePlayerControlsScience"
              :hoverCard="(card) => (hoveredCard = card)"
            />
          </Dialog>

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
          <Card
            :card="stack[0] || { backImg: '/ship.png' }"
            class="md m-auto"
            loc="stack"
          />
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
            showEffects
          />
          <Card v-else class="lg" :card="hoveredCard" loc="hover" showEffects />
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
        <div class="fixed top-1 bg-blue-300/25 p-1 rounded-lg flex gap-1">
          <Card
            v-for="card in player2Technology"
            :key="card.id"
            :card="card"
            class="xs"
            loc="tech"
          />
        </div>
        <div
          class="fixed bottom-[260px] bg-red-300/25 p-1 rounded-lg flex gap-1"
        >
          <Card
            v-for="card in player1Technology"
            :key="card.id"
            :card="card"
            class="xs"
            loc="tech"
          />
        </div>
        <template v-if="!showCombat">
          <template v-if="gameSize === 3">
            <div class="flex justify-around mt-6 relative">
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
            <div class="flex justify-around w-4/5 m-auto">
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
            </div>
            <div class="flex justify-around">
              <System
                :system.sync="systems[8]"
                group="board"
                @explored="onExplore"
              />
            </div>
          </template>
          <template v-else-if="gameSize === 4">
            <div class="flex justify-around mt-6 relative">
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
          <template v-else-if="gameSize === 5">
            <div class="flex justify-around mt-6 relative">
              <System
                :system.sync="systems[0]"
                group="board"
                @explored="onExplore"
              />
            </div>
            <div class="flex justify-around w-3/5 m-auto">
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
            <div class="flex justify-around w-5/6 m-auto">
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
            <div class="flex justify-between w-5/6 m-auto">
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
            <div class="flex justify-between">
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
            <div class="flex justify-between w-5/6 m-auto">
              <System
                :system.sync="systems[15]"
                group="board"
                @explored="onExplore"
              />
              <System
                :system.sync="systems[16]"
                group="board"
                @explored="onExplore"
              />
              <System
                :system.sync="systems[17]"
                group="board"
                @explored="onExplore"
              />
              <System
                :system.sync="systems[18]"
                group="board"
                @explored="onExplore"
              />
            </div>
            <div class="flex justify-around w-5/6 m-auto">
              <System
                :system.sync="systems[19]"
                group="board"
                @explored="onExplore"
              />
              <System
                :system.sync="systems[20]"
                group="board"
                @explored="onExplore"
              />
              <System
                :system.sync="systems[21]"
                group="board"
                @explored="onExplore"
              />
            </div>
            <div class="flex justify-around w-3/5 m-auto">
              <System
                :system.sync="systems[22]"
                group="board"
                @explored="onExplore"
              />
              <System
                :system.sync="systems[23]"
                group="board"
                @explored="onExplore"
              />
            </div>
            <div class="flex justify-around">
              <System
                :system.sync="systems[24]"
                group="board"
                @explored="onExplore"
              />
            </div>
          </template>
        </template>
        <template v-else>
          <div class="flex justify-around items-center board-height">
            <System
              group="combat"
              :system.sync="systems[combatSystemLoc]"
              combat
              showEffects
            />
          </div>
        </template>
        <button
          class="next-turn-button"
          @click="showCombat ? endCombat() : nextTurn()"
        >
          {{ showCombat ? "End Combat" : "Pass Turn" }}
        </button>
        <div class="active-player-stats flex items-center gap-4">
          <button
            class="flex-1 bg-red-400 p-1 rounded-lg duration-200 whitespace-nowrap text-left"
            :class="
              activePlayer === 'player1' ? 'bg-red-400 shadow-lg' : 'bg-red-900'
            "
            @click="activePlayerHand = 'player1'"
          >
            <em>Player 1</em><br />
            <hr />
            Credits: {{ players.player1.credits }}<br />
            Developments: {{ getPlayerDevelopmentCount("player1") }}
          </button>
          <button
            class="flex-1 bg-blue-400 p-1 rounded-lg duration-200 whitespace-nowrap text-left"
            :class="
              activePlayer === 'player2'
                ? 'bg-blue-400 shadow-lg'
                : 'bg-blue-900'
            "
            @click="activePlayerHand = 'player2'"
          >
            <em>Player 2</em><br />
            <hr />
            Credits: {{ players.player2.credits }}<br />
            Developments: {{ getPlayerDevelopmentCount("player2") }}
          </button>
          <div
            v-if="multiplayerSeat"
            class="font-megrim text-2xl bold"
            :class="
              multiplayerSeat === 'player1' ? 'text-red-600' : 'text-blue-600'
            "
          >
            {{ multiplayerSeat === "player1" ? "Player 1" : "Player 2" }}
          </div>
        </div>
      </div>
      <div class="hand" :class="activePlayerHand" v-if="shouldBoardDisplay">
        <DropZone
          :list.sync="hand"
          group="hand"
          :loc="showTechnology ? 'tech' : 'hand'"
        />
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
              systems: systems,
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
import Dialog from "@/components/Dialog/Dialog.vue";
import DeckSelector from "@/components/DeckSelector.vue";
import InitGameModal from "@/components/InitGameModal.vue";

import drawCardMp3 from "@/assets/audio/draw-card.mp3";
import itemMp3 from "@/assets/audio/item.mp3";
import useSocket from "@/lib/useSocket";

import {
  DECK_STATECRAFT,
  DECK_INDUSTRY,
  DECK_SCIENCE,
  DECK_SYSTEM,
  CARD_LIST,
  HOMEWORLD,
  HAND_CONTEXT_MENU,
  DISCARD_CONTEXT_MENU,
  DAMAGE_CONTEXT_MENU,
  SCOUT,
  STATECRAFT,
  INDUSTRY,
  SCIENCE,
  TECHNOLOGY,
  DAMAGEABLE,
  SYSTEM,
  SHIP,
  STATION,
  generateResolveContextMenu,
  generateCombatContextMenu,
  CAPITAL_PLANET_NAME_LIST,
} from "@/lib/core-v3";
import Deck from "@/models/Deck";

import EventBus from "@/util/EventBus";

const audio = new Audio();
audio.volume = 1;

function playItem() {
  if (audio.paused) {
    audio.src = itemMp3;
    audio.volume = 0.1;
    audio.play();

    const restoreVolume = setInterval(() => {
      if (audio.paused) {
        audio.volume = 1;
        clearInterval(restoreVolume);
      }
    }, 100);
  }
}

function playCard() {
  audio.src = drawCardMp3;
  audio.play();
}

export default {
  name: "Game",
  display: "Game",
  order: 1,
  data() {
    return {
      nextId: 0,
      showBoard: false,
      showCombat: false,
      showDrawCardModal: false,
      showInitGameModal: true,
      gameSize: 3,
      combatSystemLoc: 0,
      showTechnology: false,
      showStack: false,
      showContextMenu: false,
      players: {
        player1: {
          credits: 3,
          technology: [],
          hand: [],
          technology: [],
          completedFirstTurn: false,
        },
        player2: {
          credits: 3,
          technology: [],
          hand: [],
          technology: [],
          completedFirstTurn: false,
        },
      },
      activePlayer: "player1",
      nextPlayer: "player2",
      activePlayerHand: "player1",
      multiplayerSeat: null,
      contextCard: null,
      contextLoc: 0,
      contextCoordinates: {
        x: 0,
        y: 0,
      },
      hoveredCard: {
        img: "",
        backImg: "/ship.png",
      },
      systems: [],
      discard: [],
      stack: [],
      decks: {
        politics: new Deck(DECK_STATECRAFT),
        industry: new Deck(DECK_INDUSTRY),
        science: new Deck(DECK_SCIENCE),
        system: new Deck(DECK_SYSTEM),
      },
    };
  },
  computed: {
    shouldBoardDisplay() {
      return this.showBoard && !this.showStack && !this.showInitGameModal;
    },
    activePlayerDevelopmentCount() {
      return this.systems
        .filter((system) => system.card.controlledBy === this.activePlayer)
        .reduce((total, system) => system.card.developmentLevel + total, 0);
    },
    hand: {
      get() {
        if (this.multiplayerSeat) {
          return this.players[this.multiplayerSeat].hand;
        } else {
          return this.players[this.activePlayerHand].hand;
        }
      },
      set(val) {
        this.players[this.activePlayerHand].hand = val;
      },
    },
    player1Technology() {
      return this.players.player1.technology;
    },
    player2Technology() {
      return this.players.player2.technology;
    },
    nonActivePlayer() {
      return this.activePlayer === "player1" ? "player2" : "player1";
    },
    currentContextMenu() {
      if (
        ((this.contextLoc === "stack" &&
          this.contextCard.type !== TECHNOLOGY) ||
          (this.contextLoc === "tech" &&
            this.contextCard.type === TECHNOLOGY)) &&
        this.contextCard.stepContextMenu
      ) {
        return this.contextCard.stepContextMenu[this.contextCard.step]({
          ...this.contextCard.stepContext,
          ...this.fnContext,
        });
      }

      // Combat menus
      if (!this.showCombat || !this.contextCard.combatContextMenu) {
        // return this.contextCard.contextMenu;
      } else {
        return this.contextCard.combatContextMenu({
          ...this.fnContext,
          system: this.systems[this.combatSystemLoc],
        });
      }

      if (this.contextCard.type === SYSTEM) {
        let menu = [...this.contextCard.contextMenu];

        // Per turn actions
        if (
          this.contextCard.perTurnAction &&
          !this.contextCard.performedPerTurnAction
        ) {
          menu = [...menu, ...this.contextCard.perTurnAction(this.fnContext)];
        }

        // Repeatable actions
        if (this.contextCard.abilityMenu) {
          menu = [...menu, ...this.contextCard.abilityMenu(this.fnContext)];
        }

        // Build ships
        if (this.contextCard.buildShipContextMenu) {
          menu = [
            ...menu,
            ...this.contextCard.buildShipContextMenu(this.fnContext),
          ];
        }

        return menu;
      }

      if (
        !["hand", "stack"].includes(this.contextLoc) &&
        this.contextCard.buildShipContextMenu
      ) {
        return [
          ...this.contextCard.contextMenu,
          ...this.contextCard.buildShipContextMenu(this.fnContext),
        ];
      }

      return this.contextCard.contextMenu;
    },
    fnContext() {
      return {
        card: this.contextCard,
        systems: this.systems,
        activePlayer: this.activePlayer,
        nonActivePlayer: this.nonActivePlayer,
        nextPlayer: this.nextPlayer,
        players: this.players,
        discard: this.discard,
        stack: this.stack,
        getNextId: this.getNextId,
        nextId: this.nextId,
        showCombat: this.showCombat,
        combatSystemLoc: this.combatSystemLoc,
        contextLoc: this.contextLoc,
        decks: this.decks,
      };
    },
    activePlayerControlsIndustry() {
      return !!this.systems.find(
        (system) =>
          system.card.controlledBy === this.activePlayer &&
          system.card.domain === INDUSTRY
      );
    },
    activePlayerControlsStatecraft() {
      return !!this.systems.find(
        (system) =>
          system.card.controlledBy === this.activePlayer &&
          system.card.domain === STATECRAFT
      );
    },
    activePlayerControlsScience() {
      return !!this.systems.find(
        (system) =>
          system.card.controlledBy === this.activePlayer &&
          system.card.domain === SCIENCE
      );
    },
  },
  methods: {
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
        if (deck === STATECRAFT) deck = this.decks.politics;
        if (deck === SCIENCE) deck = this.decks.science;
      }

      if (this.players[player].hand.length < 5) {
        playCard();

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

        this.socket?.emit("state", JSON.stringify(this.fnContext));
      } else {
        alert("Too many cards in hand!");
      }
    },
    destroy(destroyedCard) {
      if (destroyedCard.onDestroy) {
        destroyedCard.onDestroy({
          ...this.fnContext,
          card: destroyedCard,
          system: this.systems[this.contextLoc],
        });
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
          ...this.fnContext,
          card,
          system: this.systems[card.loc],
        });
      }
    },
    performAction(option) {
      this.showContextMenu = false;

      const keys = option.action.split(":");
      switch (keys[0]) {
        case "build":
          const card = { ...CARD_LIST.find((c) => c.id == keys[1]) };
          if (card) {
            const newcard = { ...card, id: this.getNextId(), effects: [] };
            this.systems[this.contextLoc][this.activePlayer] = [
              ...this.systems[this.contextLoc][this.activePlayer],
              newcard,
            ];
            if (option.cost) {
              this.players[this.activePlayer].credits -= option.cost;
            } else {
              this.players[this.activePlayer].credits -= card.cost;
            }

            this.players[this.activePlayer].technology.forEach((technology) => {
              if (technology.onBuildOther) {
                technology.onBuildOther({ ...this.fnContext, card: newcard });
              }
            });

            playItem();
          }
          break;
        case "build-in":
          if (this.contextCard.onBuild) {
            this.contextCard.onBuild({
              ...this.fnContext,
              card: this.contextCard,
              system: this.systems[keys[1]],
            });
          }

          this.systems[keys[1]][this.activePlayer] = [
            ...this.systems[keys[1]][this.activePlayer],
            {
              ...this.contextCard,
              contextMenu: [...DAMAGE_CONTEXT_MENU],
              effects: [],
            },
          ];

          this.stack = this.stack.filter(
            (card) => card.id !== this.contextCard.id
          );

          playItem();
          break;
        case "develop":
          this.contextCard.controlledBy = this.activePlayer;

          console.log(this.contextCard.totalMaxDevelopmentLevel());

          if (
            this.contextCard.developmentLevel <
            this.contextCard.totalMaxDevelopmentLevel()
          ) {
            let cost = this.systems[this.contextLoc].card.developmentLevel + 1;
            if (cost === 0) cost = 1;
            this.players[this.activePlayer].credits -= cost;
            this.systems[this.contextLoc].card.developmentLevel++;

            if (this.contextCard.onDevelop) {
              this.contextCard.onDevelop({
                ...this.fnContext,
                system: this.systems[this.contextLoc],
              });
            }

            playItem();
          }

          break;
        case "damage":
          this.contextCard.damage =
            this.contextCard.damage + parseInt(keys[1], 10);

          playItem();
          break;
        case "repair":
          option.repairAction(this.fnContext);

          playItem();
          break;
        case "destroy":
          this.destroy(this.contextCard);

          playItem();
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
                    contextMenu: generateResolveContextMenu(this.fnContext),
                  },
                  ...this.stack,
                ];

                this.players[this.activePlayer].hand = this.players[
                  this.activePlayer
                ].hand.filter((card) => card.id !== this.contextCard.id);

                playItem();
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

              playItem();
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

              playItem();
              break;
            case "resolve":
              this.resolveCardOnStack();

              playItem();
              break;
          }
          break;
        case "combat":
          this.showCombat = true;
          this.combatSystemLoc = this.contextLoc;
          break;
        case "assign-damage":
          if (parseInt(keys[1], 10) === 0) {
            this.contextCard.damageAssignedTo = true;
          } else {
            this.assignCombatDamage(this.contextCard, parseInt(keys[1], 10));
          }

          playItem();
          break;
        case "unassign-damage":
          if (this.contextCard.damageAssignedTo === true) {
            this.contextCard.damageAssignedTo = undefined;
          } else {
            this.unassignCombatDamage(this.contextCard);
          }

          playItem();
          break;
        case "step":
          // Perform the custom function in the step.
          // Store the value in the contextStepResponse (merge all data together)
          // Increment the step
          // If it's the last step, run 'resolve'

          const stepResult = option.stepAction();

          this.contextCard.stepContext = {
            ...this.contextCard.stepContext,
            ...stepResult,
          };
          this.contextCard.step++;
          if (
            this.contextCard.stepContextMenu.length <= this.contextCard.step
          ) {
            this.contextCard.step = 0;
            this.contextCard.stepContext = {};

            if (this.contextLoc === "stack") {
              this.resolveCardOnStack();
            }
          } else {
            this.showContextMenu = true;
          }
          break;
        case "perform":
          const actionResult = option.performAction();
          if (keys[1] === "perTurn") {
            this.contextCard.performedPerTurnAction = true;
          }

          playItem();
          break;
        default:
        // Do nothing
      }

      this.socket?.emit("state", JSON.stringify(this.fnContext));
    },
    resolveCardOnStack() {
      // Perform the action on the card
      if (this.contextCard.onResolve) {
        this.contextCard.onResolve({
          ...this.fnContext,
          system: this.systems[this.contextLoc],
        });
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
          card.damage += attackingCard.totalAttack();
        }
      });

      this.systems[this.combatSystemLoc].player2.forEach((card) => {
        if (card.id === targetId) {
          card.damage += attackingCard.totalAttack();
        }
      });
    },
    unassignCombatDamage(attackingCard) {
      this.systems[this.combatSystemLoc].player1.forEach((card) => {
        if (card.id === attackingCard.damageAssignedTo) {
          card.damage -= attackingCard.totalAttack();
        }
      });

      this.systems[this.combatSystemLoc].player2.forEach((card) => {
        if (card.id === attackingCard.damageAssignedTo) {
          card.damage -= attackingCard.totalAttack();
        }
      });

      attackingCard.damageAssignedTo = undefined;
    },
    endCombat() {
      this.showCombat = false;

      this.systems[this.combatSystemLoc].player1.forEach((card) => {
        card.damageAssignedTo = undefined;
      });

      this.systems[this.combatSystemLoc].player2.forEach((card) => {
        card.damageAssignedTo = undefined;
      });

      this.cleanUpDestroyedShips();

      this.socket?.emit("state", JSON.stringify(this.fnContext));
    },
    cleanUpDestroyedShips() {
      this.systems.forEach((system) => {
        system.player1.forEach((card) => {
          if (card.damage >= card.totalHp()) {
            this.destroy(card);
          }
        });

        system.player2.forEach((card) => {
          if (card.damage >= card.totalHp()) {
            this.destroy(card);
          }
        });
      });
    },
    nextTurn() {
      // Clean up destroyed ship
      this.cleanUpDestroyedShips();

      // Conquest
      this.systems.forEach((system) => {
        const invadingShips = system[this.activePlayer].filter(
          (ship) => ship.type === SHIP && ship.totalAttack() > 0
        );

        const invadingCruiserCount = system[this.activePlayer].filter(
          (ship) => ship.img === "Cruiser"
        ).length;

        const defendingShips = system[this.nonActivePlayer].filter(
          (ship) =>
            [SHIP, STATION].includes(ship.type) && ship.totalAttack() > 0
        );

        // Perform conquest only if no defenders
        if (
          system.card.controlledBy === this.nonActivePlayer &&
          invadingShips.length > 0 &&
          defendingShips.length === 0
        ) {
          system.card.developmentLevel -= invadingShips.length;
        } else if (
          system.card.controlledBy === this.nonActivePlayer &&
          invadingCruiserCount > 0
        ) {
          // If standard conquest is not possible, perform it for all invading cruisers present
          system.card.developmentLevel -= invadingCruiserCount;
        }

        if (
          system.card.controlledBy === this.nonActivePlayer &&
          system.card.developmentLevel <= 0
        ) {
          system.card.controlledBy = this.activePlayer;
          system.card.developmentLevel = 1;
        }
      });

      // End of turn effects end.
      this.systems.forEach((system) => {
        if (
          system.card.performedPerTurnAction == true &&
          system.card.controlledBy == this.activePlayer
        ) {
          system.card.performedPerTurnAction = false;
        }
        system.player1.forEach((card) => {
          if (card.onTurnEnd) {
            card.onTurnEnd({
              ...this.fnContext,
              card,
              system,
            });
          }
          card.bonusAttack = 0;
          card.bonusHp = 0;
          card.damage = 0;
          card.effects = [];
        });
        system.player2.forEach((card) => {
          if (card.onTurnEnd) {
            card.onTurnEnd({
              ...this.fnContext,
              card,
              system,
            });
          }
          card.bonusAttack = 0;
          card.bonusHp = 0;
          card.damage = 0;
          card.effects = [];
        });
      });

      this.players[this.activePlayer].completedFirstTurn = true;

      // Next player
      this.activePlayer = this.nextPlayer;
      this.activePlayerHand = this.nextPlayer;
      this.nextPlayer = this.nextPlayer === "player1" ? "player2" : "player1";

      // Validate the now-active player didn't lose last turn.
      const systemCount = this.systems.filter(
        (system) =>
          system.card.controlledBy === this.activePlayer &&
          CAPITAL_PLANET_NAME_LIST.includes(system.card.img)
      ).length;

      if (systemCount <= 0) {
        alert("Game over!");

        this.showBoard = false;
        this.showInitGameModal = true;
        return;
      }

      // Gain credits
      // if (this.players[this.activePlayer].completedFirstTurn) {
      this.players[this.activePlayer].credits +=
        this.activePlayerDevelopmentCount;
      // }

      // Check for "At start of turn" effects

      this.players[this.activePlayer].technology.forEach((technology) => {
        if (technology.onTurnStart) {
          technology.onTurnStart({
            ...this.fnContext,
            card: technology,
          });
        }

        if (technology.onEachTurnStart) {
          technology.onEachTurnStart({
            ...this.fnContext,
            card: technology,
            player: this.activePlayer,
          });
        }
      });

      this.players[this.nonActivePlayer].technology.forEach((technology) => {
        if (technology.onEachTurnStart) {
          technology.onEachTurnStart({
            ...this.fnContext,
            card: technology,
            player: this.nonActivePlayer,
          });
        }
      });

      this.systems.forEach((system) => {
        if (
          system.card.controlledBy === this.activePlayer &&
          system.card.onTurnStart
        ) {
          system.card.onTurnStart({
            ...this.fnContext,
            card: system.card,
            system: system,
          });
        }
        system[this.activePlayer].forEach((card) => {
          if (card.onTurnStart) {
            card.onTurnStart({
              ...this.fnContext,
              card: card,
              system: system,
            });
          }
        });
      });

      // Show the draw a card dialog.
      if (
        this.activePlayerControlsIndustry ||
        this.activePlayerControlsScience ||
        this.activePlayerControlsStatecraft
      ) {
        console.log("Should show the modal");
        this.showDrawCardModal = true;
      }
    },
    parseAndUpdateState(payload) {
      const {
        card,
        systems,
        activePlayer,
        nextPlayer,
        players,
        discard,
        stack,
        nextId,
        showCombat,
        combatSystemLoc,
        contextLoc,
        decks,
      } = JSON.parse(payload);

      const performUpdate = () => {
        // this.contextCard = this.hydrateCard(card);
        this.systems = systems.map((system) => {
          return {
            card: this.hydrateCard(system.card),
            player1: system.player1.map((card) => this.hydrateCard(card)),
            player2: system.player2.map((card) => this.hydrateCard(card)),
          };
        });
        this.activePlayer = activePlayer;
        this.nextPlayer = nextPlayer;
        if (
          this.players.player1.hand.length > players.player1.hand.length ||
          this.players.player2.hand.length > players.player2.hand.length
        ) {
          audio.src = drawCardMp3;
          audio.play();
        }
        this.players.player1 = {
          ...players.player1,
          technology: players.player1.technology.map((card) =>
            this.hydrateCard(card)
          ),
          hand: players.player1.hand.map((card) => this.hydrateCard(card)),
        };
        this.players.player2 = {
          ...players.player2,
          technology: players.player2.technology.map((card) =>
            this.hydrateCard(card)
          ),
          hand: players.player2.hand.map((card) => this.hydrateCard(card)),
        };
        this.discard = discard.map((card) => this.hydrateCard(card));
        console.log("THE STACK");
        this.stack = stack.map((card) => this.hydrateCard(card));
        console.log("END THE STACK");
        this.nextId = parseInt(nextId, 10);
        this.showCombat = showCombat;
        this.combatSystemLoc = combatSystemLoc;
        this.contextLoc = contextLoc;
        this.decks = {
          politics: new Deck(decks.politics.deck.map(this.hydrateCard), true),
          industry: new Deck(decks.industry.deck.map(this.hydrateCard), true),
          science: new Deck(decks.science.deck.map(this.hydrateCard), true),
          system: new Deck(decks.system.deck.map(this.hydrateCard), true),
        };
      };

      // Audio effects
      const cardDrawn =
        this.players.player1.hand.length > players.player1.hand.length ||
        this.players.player2.hand.length > players.player2.hand.length;

      if (cardDrawn) {
        playCard();
        performUpdate();
      } else {
        playItem();
        performUpdate();
      }
    },
    hydrateCard(cardPayload) {
      if (!cardPayload) throw Error("No payload to hydrate!");
      console.log(cardPayload);
      const cardTemplate = CARD_LIST.find((c) => c.img === cardPayload.img);

      if (!cardTemplate) throw Error("No card template found");

      // Purge potentially invalid properties
      delete cardPayload.stepContextMenu;
      // delete cardPayload.contextMenu;

      return {
        ...cardTemplate,
        ...cardPayload,
      };
    },
    initGame() {
      this.players = {
        player1: {
          credits: 3,
          technology: [],
          hand: [],
          technology: [],
          completedFirstTurn: false,
        },
        player2: {
          credits: 3,
          technology: [],
          hand: [],
          technology: [],
          completedFirstTurn: false,
        },
      };
      this.activePlayer = "player1";
      this.nextPlayer = "player2";
      this.activePlayerHand = "player1";

      this.decks = {
        politics: new Deck(DECK_STATECRAFT),
        industry: new Deck(DECK_INDUSTRY),
        science: new Deck(DECK_SCIENCE),
        system: new Deck(DECK_SYSTEM),
      };

      const systems = [];
      const boardSize = this.gameSize * this.gameSize;
      for (let i = 0; i < boardSize; i++) {
        systems.push({
          card:
            i === 0 || i === boardSize - 1
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

      systems[0].player2.push({ ...SCOUT, id: this.getNextId(), effects: [] });
      systems[0].card.explored = true;
      systems[boardSize - 1].player1.push({
        ...SCOUT,
        id: this.getNextId(),
        effects: [],
      });
      systems[boardSize - 1].card.explored = true;

      this.systems = systems;
      this.showBoard = true;

      // this.players.player1.credits++;
    },
  },
  mounted() {
    EventBus.$on("card:hover", (card) => {
      this.hoveredCard = card;
    });

    EventBus.$on("card:context", ({ card, loc, event }) => {
      if (loc !== "hover") this.toggleContextMenu(card, loc, event);
    });

    // this.socket = useSocket();

    // this.socket?.on("state", (payload) => {
    //   this.parseAndUpdateState(payload);
    // });

    // this.socket?.on("joined", (payload) => {
    //   switch (payload.playerCount) {
    //     case 1:
    //       this.multiplayerSeat = "player1";
    //       break;
    //     case 2:
    //       this.multiplayerSeat = "player2";
    //       break;
    //     default:
    //       this.multiplayerSeat = null;
    //       break;
    //   }
    // });

    // this.socket?.emit("join", location.hash);

    EventBus.$on("dropzone-dropped", () => {
      playItem();
      this.socket?.emit("state", JSON.stringify(this.fnContext));
    });
  },
  beforeUnmount() {
    // document.removeEventListener("click", playItem);
  },
  components: {
    DropZone,
    System,
    Card,
    DamageDice,
    Dialog,
    DeckSelector,
    InitGameModal,
  },
};
</script>

<style lang="pcss">
.board {
  padding: 1rem;
  /* background: linear-gradient(
    rgb(41, 40, 40),
    rgb(24, 18, 36),
    rgb(18, 18, 59)
  ); */
  background: url("/board.jpg");
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

  &.player1 {
    @apply bg-red-900;
  }
  &.player2 {
    @apply bg-blue-900;
  }
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
  bottom: 175px;
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
