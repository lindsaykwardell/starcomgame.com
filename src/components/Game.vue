<template>
  <InitGameModal
    v-model="showInitGameModal"
    v-model:gameSize="gameSize"
    v-model:playerCount="playerCount"
    :multiplayerSeat="multiplayerSeat"
    :serverStatus="serverStatus"
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
          :href="`https://starcomgame.com/card-database${
            hoveredCard.explored === false || !hoveredCard.img
              ? ''
              : `?selectedCard=${hoveredCard.img}`
          }`"
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
        <div
          v-if="player1Technology.length"
          class="fixed bottom-[260px] left-[310px] bg-red-300/25 p-1 rounded-lg flex gap-1"
        >
          <Card
            v-for="card in player1Technology"
            :key="card.id"
            :card="card"
            class="xs"
            loc="tech"
          />
        </div>
        <div
          v-if="player2Technology.length"
          class="fixed top-1 right-1 bg-blue-300/25 p-1 rounded-lg flex gap-1"
        >
          <Card
            v-for="card in player2Technology"
            :key="card.id"
            :card="card"
            class="xs"
            loc="tech"
          />
        </div>
        <div
          v-if="player3Technology?.length"
          class="fixed top-1 left-[310px] bg-green-300/25 p-1 rounded-lg flex gap-1"
        >
          <Card
            v-for="card in player3Technology"
            :key="card.id"
            :card="card"
            class="xs"
            loc="tech"
          />
        </div>
        <div
          v-if="player4Technology?.length"
          class="fixed bottom-[260px] right-1 bg-yellow-300/25 p-1 rounded-lg flex gap-1"
        >
          <Card
            v-for="card in player4Technology"
            :key="card.id"
            :card="card"
            class="xs"
            loc="tech"
          />
        </div>
        <Board
          v-if="!showCombat"
          :gameSize="gameSize"
          :systems="systems"
          :onExplore="onExplore"
          :onScroll="onClickout"
        />
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
          @click="
            showCombat
              ? endCombat()
              : gameOver
              ? (this.showInitGameModal = true)
              : nextTurn()
          "
        >
          {{ showCombat ? "End Combat" : gameOver ? "New Game" : "Pass Turn" }}
        </button>
        <div class="active-player-stats flex items-center gap-4">
          <button
            class="flex-1 p-1 rounded-lg duration-200 whitespace-nowrap text-left border border-transparent"
            :class="
              activePlayer === 'player1'
                ? 'bg-red-400 shadow-lg border-white'
                : 'bg-red-900'
            "
            @click="activePlayerHand = 'player1'"
          >
            <!-- <em>Player 1</em><br /> -->
            <!-- <hr /> -->
            Credits: {{ players.player1.credits }}<br />
            Developments: {{ getPlayerDevelopmentCount("player1") }}<br />
            Hand: {{ players.player1.hand.length }}
          </button>
          <button
            v-if="players.player3"
            class="flex-1 p-1 rounded-lg duration-200 whitespace-nowrap text-left border border-transparent"
            :class="
              activePlayer === 'player3'
                ? 'bg-green-600 shadow-lg border-white'
                : 'bg-green-900'
            "
            @click="activePlayerHand = 'player3'"
          >
            <!-- <em>Player 3</em><br /> -->
            <!-- <hr /> -->
            Credits: {{ players.player3.credits }}<br />
            Developments: {{ getPlayerDevelopmentCount("player3") }}<br />
            Hand: {{ players.player3.hand.length }}
          </button>
          <button
            class="flex-1 p-1 rounded-lg duration-200 whitespace-nowrap text-left border border-transparent"
            :class="
              activePlayer === 'player2'
                ? 'bg-blue-400 shadow-lg border-white'
                : 'bg-blue-900'
            "
            @click="activePlayerHand = 'player2'"
          >
            <!-- <em>Player 2</em><br /> -->
            <!-- <hr /> -->
            Credits: {{ players.player2.credits }}<br />
            Developments: {{ getPlayerDevelopmentCount("player2") }}<br />
            Hand: {{ players.player2.hand.length }}
          </button>
          <button
            v-if="players.player4"
            class="flex-1 p-1 rounded-lg duration-200 whitespace-nowrap text-left border border-transparent"
            :class="
              activePlayer === 'player4'
                ? 'bg-yellow-600 shadow-lg border-white'
                : 'bg-yellow-900'
            "
            @click="activePlayerHand = 'player4'"
          >
            <!-- <em>Player 4</em><br /> -->
            <!-- <hr /> -->
            Credits: {{ players.player4.credits }}<br />
            Developments: {{ getPlayerDevelopmentCount("player4") }}<br />
            Hand: {{ players.player4.hand.length }}
          </button>
          <template v-if="multiplayerSeat">
            <div
              v-if="multiplayerSeat === 'player1'"
              class="font-megrim text-2xl bold text-red-600"
            >
              Player 1
            </div>
            <div
              v-if="multiplayerSeat === 'player2'"
              class="font-megrim text-2xl bold text-blue-600"
            >
              Player 2
            </div>
            <div
              v-if="multiplayerSeat === 'player3'"
              class="font-megrim text-2xl bold text-green-600"
            >
              Player 3
            </div>
            <div
              v-if="multiplayerSeat === 'player4'"
              class="font-megrim text-2xl bold text-yellow-600"
            >
              Player 4
            </div>
          </template>
        </div>
      </div>
      <div class="hand" :class="handClass" v-if="shouldBoardDisplay">
        <DropZone
          :list.sync="hand"
          group="hand"
          loc="hand"
          :showBack="multiplayerSeat && multiplayerSeat !== activePlayerHand"
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
import Board from "@/components/Board/Board.vue";

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
      gameOver: false,
      gameSize: 3,
      playerCount: 2,
      combatSystemLoc: 0,
      showTechnology: false,
      showStack: false,
      showContextMenu: false,
      players: {},
      activePlayer: "player1",
      nextPlayerOverride: {
        player: null,
      },
      activePlayerHand: "player1",
      multiplayerSeat: null,
      serverStatus: null,
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
    nextPlayer() {
      switch (this.playerCount) {
        case 2:
          return this.activePlayer === "player1" ? "player2" : "player1";
        case 3:
          switch (this.activePlayer) {
            case "player1":
              return "player3";
            case "player3":
              return "player2";
            case "player2":
              return "player1";
          }
        case 4:
          switch (this.activePlayer) {
            case "player1":
              return "player3";
            case "player3":
              return "player2";
            case "player2":
              return "player4";
            case "player4":
              return "player1";
          }
      }
    },
    shouldBoardDisplay() {
      return this.showBoard && !this.showStack && !this.showInitGameModal;
    },
    activePlayerDevelopmentCount() {
      return this.systems
        .filter((system) => system.card.controlledBy === this.activePlayer)
        .reduce((total, system) => system.card.developmentLevel + total, 0);
    },
    hand() {
      return this.players[this.activePlayerHand].hand;
    },
    handClass() {
      return this.activePlayerHand;
    },
    player1Technology() {
      return this.players.player1?.technology;
    },
    player2Technology() {
      return this.players.player2?.technology;
    },
    player3Technology() {
      return this.players.player3?.technology;
    },
    player4Technology() {
      return this.players.player4?.technology;
    },
    nonActivePlayers() {
      return Object.keys(this.players).filter((p) => p !== this.activePlayer);
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

      if (
        this.contextCard.type === SYSTEM ||
        (DAMAGEABLE.includes(this.contextCard.type) && !isNaN(+this.contextLoc))
      ) {
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
        nonActivePlayers: this.nonActivePlayers,
        nextPlayer: this.nextPlayer,
        nextPlayerOverride: this.nextPlayerOverride,
        players: this.players,
        discard: this.discard,
        stack: this.stack,
        getNextId: this.getNextId,
        nextId: this.nextId,
        showCombat: this.showCombat,
        showBoard: this.showBoard,
        gameSize: this.gameSize,
        playerCount: this.playerCount,
        combatSystemLoc: this.combatSystemLoc,
        contextLoc: this.contextLoc,
        decks: this.decks,
      };
    },
    activePlayerControlsIndustry() {
      const playerToCheck = this.multiplayerSeat
        ? this.multiplayerSeat
        : this.activePlayer;
      return !!this.systems.find(
        (system) =>
          system.card.controlledBy === playerToCheck &&
          system.card.domain === INDUSTRY
      );
    },
    activePlayerControlsStatecraft() {
      const playerToCheck = this.multiplayerSeat
        ? this.multiplayerSeat
        : this.activePlayer;
      return !!this.systems.find(
        (system) =>
          system.card.controlledBy === playerToCheck &&
          system.card.domain === STATECRAFT
      );
    },
    activePlayerControlsScience() {
      const playerToCheck = this.multiplayerSeat
        ? this.multiplayerSeat
        : this.activePlayer;
      return !!this.systems.find(
        (system) =>
          system.card.controlledBy === playerToCheck &&
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
            controlledBy: this.activePlayer,
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
        system.vessels = system.vessels.filter(
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
      };
      if (event.clientX + 200 >= document.body.scrollWidth) {
        this.contextCoordinates.left = `${event.clientX - 200}px`;
      } else {
        this.contextCoordinates.left = `${event.clientX}px`;
      }
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
            const newcard = {
              ...card,
              id: this.getNextId(),
              effects: [],
              controlledBy: this.activePlayer,
            };
            this.systems[this.contextLoc].vessels = [
              ...this.systems[this.contextLoc].vessels,
              newcard,
            ];

            // Calculate cost
            let cost;
            if (option.cost) {
              cost = option.cost;
            } else {
              cost = card.cost;
            }

            this.players[this.activePlayer].technology.forEach((technology) => {
              if (technology.buildCostModifier) {
                cost = technology.buildCostModifier({ card, cost });
              }
            });

            this.players[this.activePlayer].credits -= cost;

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

          this.systems[keys[1]].vessels = [
            ...this.systems[keys[1]].vessels,
            {
              ...this.contextCard,
              contextMenu: [...DAMAGE_CONTEXT_MENU],
              effects: [],
              controlledBy: this.activePlayer,
            },
          ];

          this.stack = this.stack.filter(
            (card) => card.id !== this.contextCard.id
          );

          playItem();
          break;
        case "develop":
          this.contextCard.controlledBy = this.activePlayer;

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
              // Calculate cost
              let cost = this.contextCard.cost;

              this.players[this.contextCard.controlledBy].technology.forEach(
                (technology) => {
                  if (technology.buildCostModifier) {
                    cost = technology.buildCostModifier({
                      card: this.contextCard,
                      cost,
                    });
                  }
                }
              );
              if (this.players[this.contextCard.controlledBy].credits >= cost) {
                this.players[this.contextCard.controlledBy].credits -= cost;

                this.stack = [
                  {
                    ...this.contextCard,
                    contextMenu: generateResolveContextMenu(this.fnContext),
                  },
                  ...this.stack,
                ];

                this.players[this.contextCard.controlledBy].hand = this.players[
                  this.contextCard.controlledBy
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

              this.players[this.contextCard.controlledBy].hand = this.players[
                this.contextCard.controlledBy
              ].hand.filter((card) => card.id !== this.contextCard.id);

              playItem();
              break;
            case "return":
              this.players[this.contextCard.controlledBy].hand = [
                ...this.players[this.contextCard.controlledBy].hand,
                { ...this.contextCard, contextMenu: [...HAND_CONTEXT_MENU] },
              ];

              this.players[this.contextCard.controlledBy].credits +=
                this.contextCard.cost;

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
        this.players[this.contextCard.controlledBy].technology = [
          ...this.players[this.contextCard.controlledBy].technology,
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
      this.systems[this.combatSystemLoc].vessels.forEach((card) => {
        if (card.id === targetId) {
          card.damage += attackingCard.totalAttack();
        }
      });
    },
    unassignCombatDamage(attackingCard) {
      this.systems[this.combatSystemLoc].vessels.forEach((card) => {
        if (card.id === attackingCard.damageAssignedTo) {
          card.damage -= attackingCard.totalAttack();
        }
      });

      attackingCard.damageAssignedTo = undefined;
    },
    endCombat() {
      this.showCombat = false;

      this.systems[this.combatSystemLoc].vessels.forEach((card) => {
        card.damageAssignedTo = undefined;
      });

      this.cleanUpDestroyedShips();

      this.socket?.emit("state", JSON.stringify(this.fnContext));
    },
    cleanUpDestroyedShips() {
      this.systems.forEach((system) => {
        system.vessels.forEach((card) => {
          if (card.damage >= card.totalHp()) {
            this.destroy(card);
          }
        });
      });
    },
    nextTurn() {
      // If multiplayer, only the active player should click this

      if (this.multiplayerSeat && this.multiplayerSeat !== this.activePlayer) {
        return;
      }

      // Clean up destroyed ship
      this.cleanUpDestroyedShips();

      // Conquest
      this.systems.forEach((system) => {
        const invadingShips = system.vessels.filter(
          (ship) =>
            ship.controlledBy === this.activePlayer &&
            ship.type === SHIP &&
            ship.totalAttack() > 0
        );

        const invadingCruiserCount = invadingShips.filter(
          (ship) => ship.img === "Cruiser"
        ).length;

        const defendingShips = system.vessels.filter(
          (ship) =>
            ship.controlledBy === system.card.controlledBy &&
            [SHIP, STATION].includes(ship.type) &&
            ship.totalAttack() > 0
        );

        // Perform conquest only if no defenders
        if (
          system.card.controlledBy &&
          system.card.controlledBy !== this.activePlayer &&
          invadingShips.length > 0 &&
          defendingShips.length === 0
        ) {
          system.card.developmentLevel -= invadingShips.length;
        } else if (
          system.card.controlledBy &&
          system.card.controlledBy !== this.activePlayer &&
          invadingCruiserCount > 0
        ) {
          // If standard conquest is not possible, perform it for all invading cruisers present
          system.card.developmentLevel -= invadingCruiserCount;
        }

        if (
          system.card.controlledBy &&
          system.card.controlledBy !== this.activePlayer &&
          system.card.developmentLevel <= 0
        ) {
          system.card.controlledBy = this.activePlayer;
          system.card.developmentLevel = 1;
          // Active player gains control of all stations with 0 attack.

          system.vessels.forEach((vessel) => {
            if (
              vessel.controlledBy !== this.activePlayer &&
              vessel.totalAttack() <= 0 &&
              vessel.type === STATION
            ) {
              vessel.controlledBy = this.activePlayer;
            }
          });
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
        system.vessels.forEach((card) => {
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
      if (this.nextPlayerOverride.player) {
        this.activePlayerHand = this.multiplayerSeat
          ? this.activePlayerHand
          : this.nextPlayerOverride.player;
        this.activePlayer = this.nextPlayerOverride.player;
      } else {
        this.activePlayerHand = this.multiplayerSeat
          ? this.activePlayerHand
          : this.nextPlayer;
        this.activePlayer = this.nextPlayer;
      }

      this.nextPlayerOverride.player = null;

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

      for (const nonActivePlayer of this.nonActivePlayers) {
        this.players[nonActivePlayer].technology.forEach((technology) => {
          if (technology.onEachTurnStart) {
            technology.onEachTurnStart({
              ...this.fnContext,
              card: technology,
              player: nonActivePlayer,
            });
          }
        });
      }

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

        // Trigger start of turn effects for active player vessels
        system.vessels.forEach((card) => {
          if (card.controlledBy === this.activePlayer && card.onTurnStart) {
            card.onTurnStart({
              ...this.fnContext,
              card: card,
              system: system,
            });
          }
        });
      });

      // Validate that a player didn't lose last turn.
      const didGameEnd = this.checkGameEndConditions();

      if (didGameEnd) {
        alert("Game over!");

        this.gameOver = true;

        // this.showBoard = false;
        // this.showInitGameModal = true;
        return;
      }

      // Show the draw a card dialog.
      // For now, only show it in singleplayer.
      if (
        !this.multiplayerSeat &&
        (this.activePlayerControlsIndustry ||
          this.activePlayerControlsScience ||
          this.activePlayerControlsStatecraft)
      ) {
        this.showDrawCardModal = true;
      }

      this.socket?.emit("state", JSON.stringify(this.fnContext));
    },
    checkGameEndConditions() {
      // Do players still control their homeworlds?
      const multipleHomeworldsDetected = Object.keys(this.players).reduce(
        (val, player) =>
          val ||
          this.systems.filter(
            (s) => s.card.controlledBy === player && s.card.img === "Homeworld"
          ).length > 1,
        false
      );
      // Did a deck run out of cards?
      const domainDeckIsEmpty =
        this.decks.industry.remaining <= 0 ||
        this.decks.politics.remaining <= 0 ||
        this.decks.science.remaining <= 0;

      return multipleHomeworldsDetected || domainDeckIsEmpty;
    },
    parseAndUpdateState(payload) {
      const {
        card,
        systems,
        activePlayer,
        players,
        discard,
        stack,
        nextId,
        showCombat,
        showBoard,
        combatSystemLoc,
        contextLoc,
        decks,
        gameSize,
        playerCount,
      } = JSON.parse(payload);

      const performUpdate = () => {
        // this.contextCard = this.hydrateCard(card);
        this.systems = systems.map((system) => {
          return {
            card: this.hydrateCard(system.card),
            vessels: system.vessels.map((card) => this.hydrateCard(card)),
          };
        });
        this.activePlayer = activePlayer;
        if (
          this.players.player1?.hand.length > players.player1?.hand.length ||
          this.players.player2?.hand.length > players.player2?.hand.length ||
          this.players.player3?.hand.length > players.player3?.hand.length ||
          this.players.player4?.hand.length > players.player4?.hand.length
        ) {
          audio.src = drawCardMp3;
          audio.play();
        }
        if (players.player1) {
          this.players.player1 = {
            ...players.player1,
            technology: players.player1.technology.map((card) =>
              this.hydrateCard(card)
            ),
            hand: players.player1.hand.map((card) => this.hydrateCard(card)),
          };
        }
        if (players.player2) {
          this.players.player2 = {
            ...players.player2,
            technology: players.player2.technology.map((card) =>
              this.hydrateCard(card)
            ),
            hand: players.player2.hand.map((card) => this.hydrateCard(card)),
          };
        }
        if (players.player3) {
          this.players.player3 = {
            ...players.player3,
            technology: players.player3.technology.map((card) =>
              this.hydrateCard(card)
            ),
            hand: players.player3.hand.map((card) => this.hydrateCard(card)),
          };
        }
        if (players.player4) {
          this.players.player4 = {
            ...players.player4,
            technology: players.player4.technology.map((card) =>
              this.hydrateCard(card)
            ),
            hand: players.player4.hand.map((card) => this.hydrateCard(card)),
          };
        }
        this.discard = discard.map((card) => this.hydrateCard(card));
        this.stack = stack.map((card) => this.hydrateCard(card));
        this.nextId = parseInt(nextId, 10);
        this.showBoard = showBoard;
        this.showCombat = showCombat;
        this.gameSize = gameSize;
        this.playerCount = playerCount;
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
        this.players.player1?.hand.length > players.player1?.hand.length ||
        this.players.player2?.hand.length > players.player2?.hand.length ||
        this.players.player3?.hand.length > players.player3?.hand.length ||
        this.players.player4?.hand.length > players.player4?.hand.length;

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
      this.players = {};

      for (let i = 1; i <= this.playerCount; i++) {
        this.players["player" + i] = {
          credits: 3,
          technology: [],
          hand: [],
          technology: [],
          completedFirstTurn: false,
        };
      }

      // Determine first player
      let firstPlayer = Math.ceil(Math.random() * this.playerCount);

      if (!this.players["player" + firstPlayer]) {
        firstPlayer = 1;
      }

      this.activePlayer = "player" + firstPlayer;
      this.activePlayerHand = "player" + firstPlayer;
      if (this.multiplayerSeat) {
        this.activePlayerHand = this.multiplayerSeat;
      }

      this.decks = {
        politics: new Deck(DECK_STATECRAFT),
        industry: new Deck(DECK_INDUSTRY),
        science: new Deck(DECK_SCIENCE),
        system: new Deck(DECK_SYSTEM),
      };

      const systems = [];
      const boardSize = this.gameSize * this.gameSize;

      const startingLocations = { 0: "player2", [boardSize - 1]: "player1" };

      if (this.playerCount >= 3) {
        let loc;
        if (this.gameSize === 3) {
          loc = 3;
        } else if (this.gameSize === 4) {
          loc = 6;
        } else if (this.gameSize === 5) {
          loc = 10;
        }

        startingLocations[loc] = "player3";
      }

      if (this.playerCount === 4) {
        let loc;
        if (this.gameSize === 3) {
          loc = 5;
        } else if (this.gameSize === 4) {
          loc = 9;
        } else if (this.gameSize === 5) {
          loc = 14;
        }
        startingLocations[loc] = "player4";
      }

      for (let i = 0; i < boardSize; i++) {
        systems.push({
          card: Object.keys(startingLocations)
            .map((l) => +l)
            .includes(i)
            ? {
                ...HOMEWORLD,
                loc: i,
                controlledBy: startingLocations[i],
                explored: true,
              }
            : { ...this.decks.system.draw(), loc: i, controlledBy: null },
          vessels: [],
        });
      }

      for (const loc of Object.keys(startingLocations)) {
        systems[loc].vessels.push({
          ...SCOUT,
          id: this.getNextId(),
          effects: [],
          controlledBy: startingLocations[loc],
        });
      }

      this.systems = systems;
      this.showBoard = true;
      this.gameOver = false;

      this.socket?.emit("state", JSON.stringify(this.fnContext));
    },
  },
  mounted() {
    EventBus.$on("card:hover", (card) => {
      this.hoveredCard = card;
    });

    EventBus.$on("card:context", ({ card, loc, event }) => {
      if (loc !== "hover") this.toggleContextMenu(card, loc, event);
    });

    this.socket = useSocket();

    if (this.socket) {
      this.serverStatus = "init";
    }

    this.socket?.on("connect", () => {
      console.log("connected");
      this.serverStatus = "connected";
    });

    this.socket?.on("connect_error", (err) => {
      console.error("connect error", err);
      this.serverStatus = "error";
    });

    this.socket?.on("state", (payload) => {
      this.parseAndUpdateState(payload);
    });

    this.socket?.on("joined", (payload) => {
      this.playerCount = payload.playerCount;
      switch (payload.playerCount) {
        case 1:
          this.multiplayerSeat = "player1";
          break;
        case 2:
          this.multiplayerSeat = "player2";
          break;
        case 3:
          this.multiplayerSeat = "player3";
          break;
        case 4:
          this.multiplayerSeat = "player4";
          break;
        default:
          this.multiplayerSeat = null;
          break;
      }
    });

    this.socket?.on("playerCount", (playerCount) => {
      this.playerCount = playerCount;
    });

    this.socket?.emit("join", location.hash);

    EventBus.$on("dropzone-dropped", () => {
      playItem();
      this.socket?.emit("state", JSON.stringify(this.fnContext));
    });
  },
  watch: {
    showBoard() {
      if (this.showBoard && this.showInitGameModal) {
        this.showInitGameModal = false;
      }
    },
    gameSize() {
      this.socket?.emit("state", JSON.stringify(this.fnContext));
    },
    // playerCount() {
    //   this.socket?.emit("state", JSON.stringify(this.fnContext));
    // },
  },
  components: {
    DropZone,
    System,
    Card,
    DamageDice,
    Dialog,
    DeckSelector,
    InitGameModal,
    Board,
  },
};
</script>

<style lang="pcss">
body {
  user-select: none;
}

.board {
  padding: 1rem 3rem;
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
  &.player3 {
    @apply bg-green-900;
  }
  &.player4 {
    @apply bg-yellow-900;
  }
}

.context-menu {
  @apply bg-gray-900 text-white rounded overflow-auto;
  position: absolute;
  width: 200px;
  max-height: 300px;
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
