export const POLITICS = "Politics";
export const INDUSTRY = "Industry";
export const SCIENCE = "Science";

export const DOMAINS = [POLITICS, INDUSTRY, SCIENCE];

export const SHIP = "Ship";
export const FIGHTER = "Fighter";
export const STATION = "Station";
export const SYSTEM = "System";
export const CAPITAL_SYSTEM = "Capital System";
export const START_SYSTEM = "Starting System";
export const COMMAND = "Command";
export const MANEUVER = "Maneuver";
export const TECHNOLOGY = "Technology";

export const CARD_TYPES = [
  SHIP,
  FIGHTER,
  STATION,
  SYSTEM,
  COMMAND,
  MANEUVER,
  TECHNOLOGY,
];

export const SMALL = "Small";
export const MEDIUM = "Medium";
export const LARGE = "Large";

export const DAMAGEABLE = [SHIP, FIGHTER, STATION];

export const HAND_CONTEXT_MENU = [
  {
    action: "hand:discard",
    label: "Discard Card",
  },
  {
    action: "hand:play",
    label: "Play Card",
  },
];

export const DISCARD_CONTEXT_MENU = [
  {
    action: "hand:return",
    label: "Return to Hand",
  },
];

export const RESOLVE_CONTEXT_MENU = [
  {
    action: "hand:resolve",
    label: "Resolve Card",
  },
];

export const RETURN_TO_HAND_CONTEXT_MENU = [
  {
    action: "hand:return",
    label: "Return to Hand",
  },
];

const SYSTEM_CONTEXT_MENU = [
  {
    action: "develop",
    label: "Build Development",
    condition: ({ card, system, activePlayer, players }) =>
      (card.controlledBy === activePlayer ||
        (!card.controlledBy && system[activePlayer].length > 0)) &&
      players[activePlayer].credits >= (card.developmentLevel + 1 || 1) &&
      card.developmentLevel < card.totalMaxDevelopmentLevel(),
  },
  {
    action: "combat",
    label: "Begin Combat",
    condition: ({ card, system, activePlayer, players, inCombat }) =>
      !inCombat && system.player1.length > 0 && system.player2.length > 0,
  },
];

export const DAMAGE_CONTEXT_MENU = [
  {
    action: "damage:1",
    label: "Add 1 damage",
  },
  {
    action: "damage:2",
    label: "Add 2 damage",
  },
  {
    action: "damage:3",
    label: "Add 3 damage",
  },
  {
    action: "repair:1",
    label: "Repair 1 damage",
    condition: ({ card, inCombat, players, activePlayer }) =>
      card.damage > 0 &&
      inCombat === false &&
      players[activePlayer].credits >= 2,
    repairAction: ({ card, players, activePlayer }) => {
      players[activePlayer].credits -= 2;
      card.damage -= 1;
    },
  },
  {
    action: "repair:0",
    label: "Remove 1 damage",
    condition: ({ card, inCombat, players, activePlayer }) =>
      card.damage > 0 && inCombat === true,
    repairAction: ({ card }) => {
      card.damage -= 1;
    },
  },
  {
    action: "destroy",
    label: "Destroy this",
  },
];

const SHIP_ID_LIST = [33, 34, 35, 36, 37, 38, 39];
export const CAPITAL_PLANET_NAME_LIST = [
  "Homeworld",
  "Drummond",
  "Silis_Major",
  "Forsei",
];

const generateBuildShipContextMenu = ({
  card,
  systems,
  activePlayer,
  players,
}) =>
  SHIP_ID_LIST.map((id) => {
    const ship = CARD_LIST.find((c) => c.id === id);

    let cost = ship.cost;

    systems.forEach((system) => {
      if (
        system.card.controlledBy === activePlayer &&
        system.card.buildCostModifier
      ) {
        cost = system.card.buildCostModifier({ card: ship, cost });
      }
    });

    if (cost < 1) cost = 1;

    players[activePlayer].technology.forEach((technology) => {
      if (technology.buildCostModifier) {
        cost = technology.buildCostModifier({ card: ship, cost });
      }
    });

    return {
      action: `build:${id}`,
      label: `Build ${ship.img} (${cost} credits)`,
      condition: ({ card, system, activePlayer, players }) =>
        card.controlledBy === activePlayer &&
        players[activePlayer].credits >= cost,
      cost,
    };
  });

const SMALL_SHIP_CONTEXT_MENU = [
  {
    action: "build:33",
    label: "Build Patrol Ship",
    condition: ({ card, system, activePlayer, players }) =>
      card.controlledBy === activePlayer && players[activePlayer].credits >= 5,
  },
  {
    action: "build:34",
    label: "Build Corvette",
    condition: ({ card, system, activePlayer, players }) =>
      card.controlledBy === activePlayer && players[activePlayer].credits >= 8,
  },
  {
    action: "build:35",
    label: "Build Frigate",
    condition: ({ card, system, activePlayer, players }) =>
      card.controlledBy === activePlayer && players[activePlayer].credits >= 8,
  },
];

const SHIP_CONTEXT_MENU = [
  ...SMALL_SHIP_CONTEXT_MENU,
  {
    action: "build:36",
    label: "Build Destroyer",
    condition: ({ card, system, activePlayer, players }) =>
      card.controlledBy === activePlayer && players[activePlayer].credits >= 13,
  },
  {
    action: "build:37",
    label: "Build Cruiser",
    condition: ({ card, system, activePlayer, players }) =>
      card.controlledBy === activePlayer && players[activePlayer].credits >= 13,
  },
  {
    action: "build:38",
    label: "Build Battleship",
    condition: ({ card, system, activePlayer, players }) =>
      card.controlledBy === activePlayer && players[activePlayer].credits >= 21,
  },
  {
    action: "build:39",
    label: "Build Carrier",
    condition: ({ card, system, activePlayer, players }) =>
      card.controlledBy === activePlayer && players[activePlayer].credits >= 21,
  },
];

const STATION_CONTEXT_MENU = [
  {
    action: "build:40",
    label: "Build Defense Station",
    condition: ({ card, system, activePlayer, players }) =>
      card.controlledBy === activePlayer && players[activePlayer].credits >= 4,
  },
  {
    action: "build:41",
    label: "Build Orbital Hangar",
    condition: ({ card, system, activePlayer, players }) =>
      card.controlledBy === activePlayer && players[activePlayer].credits >= 6,
  },
];

export const BUILD_FIGHTER_CONTEXT_MENU = [
  {
    action: "build:32",
    label: "Build Strike Fighter",
    condition: ({ card, system, activePlayer, players }) =>
      card.controlledBy === activePlayer && players[activePlayer].credits >= 2,
  },
];

export const generateResolveContextMenu = ({ card, systems, activePlayer }) => {
  const menu = [...RETURN_TO_HAND_CONTEXT_MENU];
  if (DAMAGEABLE.includes(card.type)) {
    systems.forEach((system, index) => {
      if (system.card.controlledBy === activePlayer) {
        menu.push({
          action: `build-in:${index}`,
          label: `Build in ${system.card.img}`,
        });
      }
    });
  } else {
    RESOLVE_CONTEXT_MENU.forEach((item) => menu.push(item));
  }
  return menu;
};

export const generateCombatContextMenu = ({ card, system, players }) => {
  const menu = [...DAMAGE_CONTEXT_MENU];
  menu.unshift({
    action: "assign-damage:0",
    label: "Mark as Assigned",
    condition: ({ card, system, activePlayer, players }) =>
      card.totalAttack() > 0 && !card.damageAssignedTo,
  });
  let opponent = system.player1.find((c) => c.id === card.id)
    ? "player2"
    : "player1";
  system[opponent].forEach((c) => {
    menu.unshift({
      action: `assign-damage:${c.id}`,
      label: `Attack ${c.img} (${c.totalHp() - c.damage}/${c.totalHp()})`,
      condition: ({ card, system, activePlayer, players }) =>
        card.totalAttack() > 0 && !card.damageAssignedTo,
    });
  });
  menu.unshift({
    action: `unassign-damage`,
    label: `Unassign damage`,
    condition: ({ card }) => card.damageAssignedTo,
  });
  return menu;
};

export const CARD_LIST = [
  {
    id: 1,
    img: "Refinery",
    type: STATION,
    domain: INDUSTRY,
    deck: INDUSTRY,
    damage: 0,
    count: 4,
    cost: 2,
    hp: 3,
    bonusHp: 0,
    totalHp() {
      return this.hp + this.bonusHp;
    },
    attack: 0,
    bonusAttack: 0,
    totalAttack() {
      return this.attack + this.bonusAttack;
    },
    contextMenu: [],
    onTurnStart: ({ card, system, activePlayer, players }) =>
      (players[activePlayer].credits += 2),
  },
  {
    id: 2,
    img: "Trade_Envoy",
    type: COMMAND,
    domain: INDUSTRY,
    deck: INDUSTRY,
    count: 4,
    cost: 0,
    hp: null,
    attack: null,
    contextMenu: [],
    step: 0,
    stepContext: {},
    stepContextMenu: [
      ({ systems, activePlayer, players }) => {
        let menu = [];

        systems.forEach((system) => {
          if (system.card.developmentLevel > 0) {
            menu.push({
              label: `Gain ${system.card.developmentLevel} (${system.card.img})}`,
              action: `step:0`,
              stepAction: () => {
                players[activePlayer].credits += system.card.developmentLevel;
              },
            });
          }
        });

        return menu;
      },
    ],
  },
  {
    id: 3,
    img: "Repair_Crews",
    type: COMMAND,
    domain: INDUSTRY,
    deck: INDUSTRY,
    count: 3,
    cost: 0,
    hp: null,
    attack: null,
    contextMenu: [],
    step: 0,
    stepContext: {},
    stepContextMenu: [
      ({ systems, activePlayer }) => {
        let menu = [];

        systems.forEach((system) => {
          system[activePlayer].forEach((card) => {
            if (card.damage > 0) {
              menu.push({
                label: `Repair ${card.img} (${
                  card.totalHp() - card.damage
                }/${card.totalHp()})`,
                action: `step:0`,
                stepAction: () => {
                  card.damage = 0;
                },
              });
            }
          });
        });

        return menu;
      },
    ],
  },
  {
    id: 4,
    img: "Barrage",
    type: COMMAND,
    domain: INDUSTRY,
    deck: INDUSTRY,
    count: 4,
    cost: 0,
    hp: null,
    attack: null,
    contextMenu: [],
    step: 0,
    stepContext: {},
    stepContextMenu: [
      ({ systems, activePlayer }) => {
        let menu = [];
        systems.forEach((system) => {
          system[activePlayer].forEach((card) => {
            if (card.totalAttack() > 0) {
              menu.push({
                label: `Choose ${card.img} (ATK: ${card.totalAttack()})`,
                action: `step:${menu.length}`,
                stepAction: () => {
                  return { chosenCard: card, chosenSystem: system };
                },
              });
            }
          });
        });
        return menu;
      },
      (ctx) => {
        const { chosenCard, chosenSystem, nonActivePlayer } = ctx;
        return [
          {
            label: `Deal ${chosenCard.totalAttack()} damage to all ships and stations in ${
              chosenSystem.card.img
            }`,
            action: "step:0",
            stepAction: () => {
              const targets = chosenSystem[nonActivePlayer];

              targets.forEach((target) => {
                target.damage += chosenCard.totalAttack();
              });
            },
          },
        ];
      },
    ],
  },
  {
    id: 5,
    img: "Ram",
    type: COMMAND,
    domain: INDUSTRY,
    deck: INDUSTRY,
    count: 3,
    cost: 0,
    hp: null,
    attack: null,
    contextMenu: [],
    step: 0,
    stepContext: {},
    stepContextMenu: [
      ({ systems, activePlayer }) => {
        // Select a ship the active player controls, and add it to step context
        let menu = [];
        systems.forEach((system) => {
          system[activePlayer].forEach((card, index) => {
            menu.push({
              label: `Choose ${card.img} (HP: ${card.totalHp()})`,
              action: `step:${index}`,
              stepAction: () => ({ chosenCard: card, chosenSystem: system }),
            });
          });
        });
        return menu;
      },
      ({ chosenCard, chosenSystem, nonActivePlayer }) => {
        // Select a ship the non active player controls, and add it to step context
        let menu = [];
        chosenSystem[nonActivePlayer].forEach((card, index) => {
          menu.push({
            label: `Target ${card.img} (HP: ${card.totalHp() - card.damage})`,
            action: `step:${index}`,
            stepAction: () => ({ targetCard: card }),
          });
        });
        return menu;
      },
      ({ chosenCard, targetCard }) => {
        // Deal damage to the target card, and destroy the chosen card
        return [
          {
            label: `Deal ${chosenCard.totalHp()} damage to ${targetCard.img}`,
            action: "step:0",
            stepAction: () => {
              targetCard.damage += chosenCard.totalHp();
              chosenCard.damage = 1000;
            },
          },
        ];
      },
    ],
  },
  {
    id: 6,
    img: "Mass_Production",
    type: COMMAND,
    domain: INDUSTRY,
    deck: INDUSTRY,
    count: 2,
    cost: 0,
    hp: null,
    attack: null,
    contextMenu: [],
    step: 0,
    stepContext: {},
    stepContextMenu: [
      ({ systems, activePlayer, getNextId }) => {
        let menu = [];

        systems.forEach((system, index) => {
          if (system.card.controlledBy == activePlayer) {
            menu.push({
              label: `Choose ${system.card.img}`,
              action: `step:${index}`,
              stepAction: () => {
                const card = { ...CARD_LIST.find((c) => c.id == 33) };
                if (card) {
                  system[activePlayer] = [
                    ...system[activePlayer],
                    { ...card, id: getNextId() },
                    { ...card, id: getNextId() },
                    { ...card, id: getNextId() },
                  ];
                }
              },
            });
          }
        });

        return menu;
      },
    ],
  },
  {
    id: 7,
    img: "Maximum_Firepower",
    type: COMMAND,
    domain: INDUSTRY,
    deck: INDUSTRY,
    count: 3,
    cost: 0,
    hp: null,
    attack: null,
    contextMenu: [],
    step: 0,
    stepContext: {},
    stepContextMenu: [
      ({ systems, activePlayer }) => {
        let menu = [];

        systems.forEach((system) => {
          system[activePlayer].forEach((card, index) => {
            menu.push({
              label: `Choose ${card.img} (Attack: ${card.totalAttack()})`,
              action: `step:${index}`,
              stepAction: () => {
                card.bonusAttack += 2;
              },
            });
          });
        });

        return menu;
      },
    ],
  },
  {
    id: 8,
    img: "Trade_Routes",
    type: TECHNOLOGY,
    domain: INDUSTRY,
    deck: INDUSTRY,
    count: 2,
    cost: 0,
    hp: null,
    attack: null,
    contextMenu: [],
    onTurnStart: ({ systems, activePlayer, players }) => {
      let total = 0;

      systems.forEach((system) => {
        total += system[activePlayer].filter(
          (card) => card.type === STATION
        ).length;
      });

      players[activePlayer].credits += total;
    },
  },
  {
    id: 9,
    img: "Railgun_Turrets",
    type: TECHNOLOGY,
    domain: INDUSTRY,
    deck: INDUSTRY,
    count: 3,
    cost: 0,
    hp: null,
    attack: null,
    contextMenu: [],
    step: 0,
    stepContext: {},
    stepContextMenu: [
      ({ systems, activePlayer, players }) => {
        let menu = [];

        if (players[activePlayer].credits <= 0) {
          return menu;
        }

        systems.forEach((system) => {
          system[activePlayer].forEach((card, index) => {
            menu.push({
              label: `Choose ${card.img} (Attack: ${card.totalAttack()})`,
              action: `step:${index}`,
              stepAction: () => {
                return { chosenCard: card };
              },
            });
          });
        });

        return menu;
      },
      ({ players, activePlayer }) => {
        let menu = [];

        for (let i = 1; i <= players[activePlayer].credits; i++) {
          menu.push({
            label: `Pay ${i} credits`,
            action: `step:${i}`,
            stepAction: () => {
              return { cost: i };
            },
          });
        }

        return menu;
      },
      ({ chosenCard, cost, players, activePlayer }) => {
        return [
          {
            label: `${chosenCard.img} gets +${cost} attack until end of turn`,
            action: "step:0",
            stepAction: () => {
              chosenCard.bonusAttack += cost;
              players[activePlayer].credits -= cost;
            },
          },
        ];
      },
    ],
  },
  {
    id: 10,
    img: "Targeting_Systems",
    type: TECHNOLOGY,
    domain: INDUSTRY,
    deck: INDUSTRY,
    count: 2,
    cost: 0,
    hp: null,
    attack: null,
    contextMenu: [],
  },
  {
    id: 11,
    img: "Missile_Platform",
    type: STATION,
    domain: POLITICS,
    deck: POLITICS,
    damage: 0,
    count: 4,
    cost: 6,
    hp: 12,
    bonusHp: 0,
    totalHp() {
      return this.hp + this.bonusHp;
    },
    attack: 3,
    bonusAttack: 0,
    totalAttack() {
      return this.attack + this.bonusAttack;
    },
    contextMenu: [],
    onTurnStart: ({ card, system, activePlayer }) => {
      system[activePlayer].forEach((c) => {
        if (c.id !== card.id) {
          c.bonusAttack += 1;
        }
      });
    },
  },
  {
    id: 12,
    img: "Orbital_Habitat",
    type: STATION,
    domain: POLITICS,
    deck: POLITICS,
    damage: 0,
    count: 3,
    cost: 4,
    hp: 6,
    bonusHp: 0,
    totalHp() {
      return this.hp + this.bonusHp;
    },
    attack: 0,
    bonusAttack: 0,
    totalAttack() {
      return this.attack + this.bonusAttack;
    },
    contextMenu: [],
    onBuild: ({ system }) => {
      system.card.bonusDevelopmentLevel += 2;
    },
    onDestroy: ({ system }) => {
      system.card.bonusDevelopmentLevel -= 2;
    },
  },
  {
    id: 13,
    img: "Undersized_Shipyard",
    type: STATION,
    domain: POLITICS,
    deck: POLITICS,
    damage: 0,
    count: 2,
    cost: 3,
    hp: 8,
    bonusHp: 0,
    totalHp() {
      return this.hp + this.bonusHp;
    },
    attack: 0,
    bonusAttack: 0,
    totalAttack() {
      return this.attack + this.bonusAttack;
    },
    contextMenu: [...SMALL_SHIP_CONTEXT_MENU],
  },
  {
    id: 14,
    img: "Spy_Network",
    type: COMMAND,
    domain: POLITICS,
    deck: POLITICS,
    count: 4,
    cost: 0,
    hp: null,
    attack: null,
    contextMenu: [],
  },
  {
    id: 15,
    img: "Intercept_Orders",
    type: COMMAND,
    domain: POLITICS,
    deck: POLITICS,
    count: 2,
    cost: 0,
    hp: null,
    attack: null,
    contextMenu: [],
    step: 0,
    stepContext: {},
    stepContextMenu: [
      ({ stack }) =>
        stack.map((card, index) => ({
          label: `Remove ${card.img} from the game`,
          action: `step:${index}`,
          stepAction: () => {
            stack = stack.filter((c) => c.id !== card.id);
          },
        })),
    ],
  },
  {
    id: 16,
    img: "Sabotage",
    type: COMMAND,
    domain: POLITICS,
    deck: POLITICS,
    count: 4,
    cost: 0,
    hp: null,
    attack: null,
    contextMenu: [],
    step: 0,
    stepContext: {},
    stepContextMenu: [
      ({ systems, nonActivePlayer }) => {
        let menu = [];

        systems.forEach((system) => {
          system[nonActivePlayer].forEach((card, index) => {
            menu.push({
              label: `Destroy ${card.img} in ${system.img}`,
              action: `step:${index}`,
              stepAction: () => {
                card.damage = 1000;
              },
            });
          });
        });

        return menu;
      },
    ],
  },
  {
    id: 17,
    img: "Bribery",
    type: COMMAND,
    domain: POLITICS,
    deck: POLITICS,
    count: 3,
    cost: 0,
    hp: null,
    attack: null,
    contextMenu: [],
    step: 0,
    stepContext: {},
    stepContextMenu: [
      ({ systems, nonActivePlayer }) => {
        let menu = [];
        systems.forEach((system) => {
          system[nonActivePlayer].forEach((card) => {
            menu.push({
              label: `Target ${card.img} (${
                card.totalHp() - card.damage
              }/${card.totalHp()})`,
              action: `step:${menu.length}`,
              stepAction: () => {
                return { target: card, targetSystem: system };
              },
            });
          });
        });
        return menu;
      },
      ({ target, targetSystem, activePlayer, nonActivePlayer }) => [
        {
          label: `Gain control of ${target.img}`,
          action: "step:0",
          stepAction: () => {
            targetSystem[nonActivePlayer] = targetSystem[
              nonActivePlayer
            ].filter((card) => card.id !== target.id);

            targetSystem[activePlayer] = [
              ...targetSystem[activePlayer],
              target,
            ];
          },
        },
      ],
    ],
  },
  {
    id: 18,
    img: "Filibuster",
    type: COMMAND,
    domain: POLITICS,
    deck: POLITICS,
    count: 2,
    cost: 0,
    hp: null,
    attack: null,
    contextMenu: [],
    onResolve: ({ nextPlayer, activePlayer }) => {
      nextPlayer = activePlayer;
    },
  },
  {
    id: 19,
    img: "Advanced_Weapons",
    type: TECHNOLOGY,
    domain: POLITICS,
    deck: POLITICS,
    count: 3,
    cost: 0,
    hp: null,
    attack: null,
    contextMenu: [],
    onEachTurnStart: ({ systems, player }) => {
      systems.forEach((system) => {
        system[player].forEach((card) => {
          card.bonusAttack += 2;
        });
      });
    },
  },
  {
    id: 20,
    img: "Fighter_Bays",
    type: TECHNOLOGY,
    domain: POLITICS,
    deck: POLITICS,
    count: 3,
    cost: 0,
    hp: null,
    attack: null,
    contextMenu: [],
    onEachTurnStart: ({ systems, player }) => {
      systems.forEach((system) => {
        system[player].forEach((card) => {
          if (card.type === STATION || card.type === FIGHTER) {
            card.bonusHp += 2;
          }
        });
      });
    },
  },
  {
    id: 21,
    img: "Jump_Nexus",
    type: STATION,
    domain: SCIENCE,
    deck: SCIENCE,
    damage: 0,
    count: 4,
    cost: 4,
    hp: 5,
    bonusHp: 0,
    totalHp() {
      return this.hp + this.bonusHp;
    },
    attack: 0,
    bonusAttack: 0,
    totalAttack() {
      return this.attack + this.bonusAttack;
    },
    contextMenu: [],
  },
  {
    id: 22,
    img: "Explore_The_Unknown",
    type: COMMAND,
    domain: SCIENCE,
    deck: SCIENCE,
    count: 3,
    cost: 0,
    hp: null,
    attack: null,
    contextMenu: [],
    onResolve() {
      alert("Draw two cards from any one deck.");
    },
  },
  {
    id: 23,
    img: "Jump_Stabilization",
    type: COMMAND,
    domain: SCIENCE,
    deck: SCIENCE,
    count: 2,
    cost: 0,
    hp: null,
    attack: null,
    contextMenu: [],
  },
  {
    id: 24,
    img: "Interdiction",
    type: COMMAND,
    domain: SCIENCE,
    deck: SCIENCE,
    count: 3,
    cost: 0,
    hp: null,
    attack: null,
    contextMenu: [],
  },
  {
    id: 25,
    img: "Raise_Shields",
    type: COMMAND,
    domain: SCIENCE,
    deck: SCIENCE,
    count: 3,
    cost: 0,
    hp: null,
    attack: null,
    contextMenu: [],
    onResolve: ({ systems, activePlayer }) => {
      systems.forEach((system) => {
        system[activePlayer].forEach((card) => {
          card.bonusHp += 2;
        });
      });
    },
  },
  {
    id: 26,
    img: "Evasion",
    type: COMMAND,
    domain: SCIENCE,
    deck: SCIENCE,
    count: 3,
    cost: 0,
    hp: null,
    attack: null,
    contextMenu: [],
  },
  {
    id: 27,
    img: "Experimental_Shields",
    type: TECHNOLOGY,
    domain: SCIENCE,
    deck: SCIENCE,
    count: 2,
    cost: 0,
    hp: null,
    attack: null,
    contextMenu: [],
  },
  {
    id: 28,
    img: "Enhanced_Jump_Drive",
    type: TECHNOLOGY,
    domain: SCIENCE,
    deck: SCIENCE,
    count: 4,
    cost: 0,
    hp: null,
    attack: null,
    contextMenu: [],
  },
  {
    id: 29,
    img: "Advanced_Shields",
    type: TECHNOLOGY,
    domain: SCIENCE,
    deck: SCIENCE,
    count: 4,
    cost: 0,
    hp: null,
    attack: null,
    contextMenu: [],
    onEachTurnStart: ({ systems, player }) => {
      systems.forEach((system) => {
        system[player].forEach((card) => {
          card.bonusHp += 1;
        });
      });
    },
  },
  {
    id: 30,
    img: "Thrill_Of_Discovery",
    type: TECHNOLOGY,
    domain: SCIENCE,
    deck: SCIENCE,
    count: 2,
    cost: 0,
    hp: null,
    attack: null,
    contextMenu: [],
    onTurnStart: () => alert("You may roll the domain die an additional time."),
  },
  {
    id: 31,
    img: "Scout",
    type: SHIP,
    subtype: SMALL,
    domain: null,
    deck: null,
    damage: 0,
    cost: 0,
    hp: 2,
    bonusHp: 0,
    totalHp() {
      return this.hp + this.bonusHp;
    },
    attack: 0,
    bonusAttack: 0,
    totalAttack() {
      return this.attack + this.bonusAttack;
    },
    contextMenu: [...DAMAGE_CONTEXT_MENU],
    combatContextMenu: generateCombatContextMenu,
  },
  {
    id: 32,
    img: "Strike_Fighter",
    type: FIGHTER,
    // subtype: SMALL,
    domain: null,
    deck: null,
    damage: 0,
    cost: 2,
    hp: 2,
    bonusHp: 0,
    totalHp() {
      return this.hp + this.bonusHp;
    },
    attack: 1,
    bonusAttack: 0,
    totalAttack() {
      return this.attack + this.bonusAttack;
    },
    contextMenu: [...DAMAGE_CONTEXT_MENU],
    combatContextMenu: generateCombatContextMenu,
  },
  {
    id: 33,
    img: "Patrol_Ship",
    type: SHIP,
    subtype: SMALL,
    domain: null,
    deck: null,
    damage: 0,
    cost: 5,
    hp: 5,
    bonusHp: 0,
    totalHp() {
      return this.hp + this.bonusHp;
    },
    attack: 2,
    bonusAttack: 0,
    totalAttack() {
      return this.attack + this.bonusAttack;
    },
    contextMenu: [...DAMAGE_CONTEXT_MENU],
    combatContextMenu: generateCombatContextMenu,
  },
  {
    id: 34,
    img: "Corvette",
    type: SHIP,
    subtype: SMALL,
    domain: null,
    deck: null,
    damage: 0,
    cost: 8,
    hp: 8,
    bonusHp: 0,
    totalHp() {
      return this.hp + this.bonusHp;
    },
    attack: 3,
    bonusAttack: 0,
    totalAttack() {
      return this.attack + this.bonusAttack;
    },
    contextMenu: [...DAMAGE_CONTEXT_MENU],
    combatContextMenu: generateCombatContextMenu,
  },
  {
    id: 35,
    img: "Frigate",
    type: SHIP,
    subtype: SMALL,
    domain: null,
    deck: null,
    damage: 0,
    cost: 8,
    hp: 12,
    bonusHp: 0,
    totalHp() {
      return this.hp + this.bonusHp;
    },
    attack: 2,
    bonusAttack: 0,
    totalAttack() {
      return this.attack + this.bonusAttack;
    },
    contextMenu: [...DAMAGE_CONTEXT_MENU],
    combatContextMenu: generateCombatContextMenu,
  },
  {
    id: 36,
    img: "Destroyer",
    type: SHIP,
    subtype: MEDIUM,
    domain: null,
    deck: null,
    damage: 0,
    cost: 13,
    hp: 15,
    bonusHp: 0,
    totalHp() {
      return this.hp + this.bonusHp;
    },
    attack: 4,
    bonusAttack: 0,
    totalAttack() {
      return this.attack + this.bonusAttack;
    },
    contextMenu: [...DAMAGE_CONTEXT_MENU],
    combatContextMenu: generateCombatContextMenu,
  },
  {
    id: 37,
    img: "Cruiser",
    type: SHIP,
    subtype: MEDIUM,
    domain: null,
    deck: null,
    damage: 0,
    cost: 13,
    hp: 18,
    bonusHp: 0,
    totalHp() {
      return this.hp + this.bonusHp;
    },
    attack: 3,
    bonusAttack: 0,
    totalAttack() {
      return this.attack + this.bonusAttack;
    },
    contextMenu: [...DAMAGE_CONTEXT_MENU],
    combatContextMenu: generateCombatContextMenu,
  },
  {
    id: 38,
    img: "Battleship",
    type: SHIP,
    subtype: LARGE,
    domain: null,
    deck: null,
    damage: 0,
    cost: 21,
    hp: 25,
    bonusHp: 0,
    totalHp() {
      return this.hp + this.bonusHp;
    },
    attack: 5,
    bonusAttack: 0,
    totalAttack() {
      return this.attack + this.bonusAttack;
    },
    contextMenu: [...DAMAGE_CONTEXT_MENU],
    combatContextMenu: generateCombatContextMenu,
  },
  {
    id: 39,
    img: "Carrier",
    type: SHIP,
    subtype: LARGE,
    domain: null,
    deck: null,
    damage: 0,
    cost: 21,
    hp: 28,
    bonusHp: 0,
    totalHp() {
      return this.hp + this.bonusHp;
    },
    attack: 2,
    bonusAttack: 0,
    totalAttack() {
      return this.attack + this.bonusAttack;
    },
    contextMenu: [...DAMAGE_CONTEXT_MENU, ...BUILD_FIGHTER_CONTEXT_MENU],
    combatContextMenu: generateCombatContextMenu,
  },
  {
    id: 40,
    img: "Defense_Station",
    type: STATION,
    // subtype: SMALL,
    domain: null,
    deck: null,
    damage: 0,
    cost: 4,
    hp: 7,
    bonusHp: 0,
    totalHp() {
      return this.hp + this.bonusHp;
    },
    attack: 1,
    bonusAttack: 0,
    totalAttack() {
      return this.attack + this.bonusAttack;
    },
    contextMenu: [...DAMAGE_CONTEXT_MENU],
    combatContextMenu: generateCombatContextMenu,
  },
  {
    id: 41,
    img: "Orbital_Hangar",
    type: STATION,
    // subtype: SMALL,
    domain: null,
    deck: null,
    damage: 0,
    cost: 6,
    hp: 7,
    bonusHp: 0,
    totalHp() {
      return this.hp + this.bonusHp;
    },
    attack: 0,
    bonusAttack: 0,
    totalAttack() {
      return this.attack + this.bonusAttack;
    },
    contextMenu: [...BUILD_FIGHTER_CONTEXT_MENU, ...DAMAGE_CONTEXT_MENU],
    combatContextMenu: generateCombatContextMenu,
  },
  {
    id: 42,
    img: "Research_World",
    type: SYSTEM,
    domain: SCIENCE,
    deck: SYSTEM,
    count: 2,
    developmentLevel: 0,
    maxDevelopmentLevel: 4,
    bonusDevelopmentLevel: 0,
    totalMaxDevelopmentLevel() {
      return this.maxDevelopmentLevel + this.bonusDevelopmentLevel;
    },
    explored: false,
    contextMenu: [...SYSTEM_CONTEXT_MENU, ...STATION_CONTEXT_MENU],
    onTurnStart() {
      alert("Draw a card.");
    },
  },
  {
    id: 43,
    img: "Gambling_World",
    type: SYSTEM,
    domain: POLITICS,
    deck: SYSTEM,
    count: 2,
    developmentLevel: 0,
    maxDevelopmentLevel: 4,
    bonusDevelopmentLevel: 0,
    totalMaxDevelopmentLevel() {
      return this.maxDevelopmentLevel + this.bonusDevelopmentLevel;
    },
    explored: false,
    contextMenu: [...SYSTEM_CONTEXT_MENU, ...STATION_CONTEXT_MENU],
    performedPerTurnAction: true,
    onTurnStart({ systems, activePlayer }) {
      const validTargets = systems.filter((system) => {
        return (
          system.card.controlledBy == activePlayer &&
          system.developmentLevel < system.totalMaxDevelopmentLevel()
        );
      });

      if (validTargets > 0) {
        alert("Gambling World: Choose a system to develop.");
      }
    },
    perTurnAction: ({ card, systems, activePlayer }) => {
      let menu = [];

      if (card.controlledBy != activePlayer || card.performedPerTurnAction) {
        return menu;
      }

      systems
        .filter((system) => system.card.controlledBy === activePlayer)
        .forEach((system) => {
          if (
            system.card.developmentLevel <
            system.card.totalMaxDevelopmentLevel()
          ) {
            menu.push({
              label: `Develop ${system.card.img}`,
              action: `perform:perTurn:${system.card.id}`,
              performAction: () => {
                system.card.developmentLevel++;
              },
            });
          }
        });

      return menu;
    },
  },
  {
    id: 44,
    img: "Trade_World",
    type: SYSTEM,
    domain: INDUSTRY,
    deck: SYSTEM,
    count: 2,
    developmentLevel: 0,
    maxDevelopmentLevel: 4,
    bonusDevelopmentLevel: 0,
    totalMaxDevelopmentLevel() {
      return this.maxDevelopmentLevel + this.bonusDevelopmentLevel;
    },
    explored: false,
    contextMenu: [...SYSTEM_CONTEXT_MENU, ...STATION_CONTEXT_MENU],
    onTurnStart: ({ card, system, activePlayer, players }) =>
      (players[activePlayer].credits += 2),
  },
  {
    id: 45,
    img: "Military_Base",
    type: SYSTEM,
    domain: INDUSTRY,
    deck: SYSTEM,
    count: 3,
    developmentLevel: 0,
    maxDevelopmentLevel: 3,
    bonusDevelopmentLevel: 0,
    totalMaxDevelopmentLevel() {
      return this.maxDevelopmentLevel + this.bonusDevelopmentLevel;
    },
    explored: false,
    contextMenu: [...SYSTEM_CONTEXT_MENU, ...STATION_CONTEXT_MENU],
    onDevelop: ({ system, activePlayer, getNextId }) => {
      if (system.card.developmentLevel === 1) {
        const card = { ...CARD_LIST.find((c) => c.id == 40) };
        if (card) {
          system[activePlayer] = [
            ...system[activePlayer],
            { ...card, id: getNextId() },
            { ...card, id: getNextId() },
          ];
        }
      }
    },
  },
  {
    id: 46,
    img: "Alien_System",
    type: SYSTEM,
    domain: SCIENCE,
    deck: SYSTEM,
    count: 3,
    developmentLevel: 0,
    maxDevelopmentLevel: 3,
    bonusDevelopmentLevel: 0,
    totalMaxDevelopmentLevel() {
      return this.maxDevelopmentLevel + this.bonusDevelopmentLevel;
    },
    explored: false,
    contextMenu: [...SYSTEM_CONTEXT_MENU, ...STATION_CONTEXT_MENU],
    onDevelop: ({ card }) => {
      if (card.developmentLevel === 1) {
        alert("Draw two cards from any one deck");
      }
    },
  },
  {
    id: 47,
    img: "New_Colony",
    type: SYSTEM,
    domain: POLITICS,
    deck: SYSTEM,
    count: 3,
    developmentLevel: 0,
    maxDevelopmentLevel: 3,
    bonusDevelopmentLevel: 0,
    totalMaxDevelopmentLevel() {
      return this.maxDevelopmentLevel + this.bonusDevelopmentLevel;
    },
    explored: false,
    contextMenu: [...SYSTEM_CONTEXT_MENU, ...STATION_CONTEXT_MENU],
    onDevelop: ({ card }) => {
      if (card.developmentLevel === 1) {
        card.developmentLevel = 2;
      }
    },
  },
  {
    id: 48,
    img: "Asteroid_Field",
    type: SYSTEM,
    domain: INDUSTRY,
    deck: SYSTEM,
    count: 1,
    developmentLevel: 0,
    maxDevelopmentLevel: 2,
    bonusDevelopmentLevel: 0,
    totalMaxDevelopmentLevel() {
      return this.maxDevelopmentLevel + this.bonusDevelopmentLevel;
    },
    explored: false,
    contextMenu: [...SYSTEM_CONTEXT_MENU, ...STATION_CONTEXT_MENU],
  },
  {
    id: 49,
    img: "Pulsar_System",
    type: SYSTEM,
    domain: POLITICS,
    deck: SYSTEM,
    count: 1,
    developmentLevel: 0,
    maxDevelopmentLevel: 2,
    bonusDevelopmentLevel: 0,
    totalMaxDevelopmentLevel() {
      return this.maxDevelopmentLevel + this.bonusDevelopmentLevel;
    },
    explored: false,
    contextMenu: [...SYSTEM_CONTEXT_MENU, ...STATION_CONTEXT_MENU],
  },
  {
    id: 50,
    img: "Black_Hole",
    type: SYSTEM,
    domain: SCIENCE,
    deck: SYSTEM,
    count: 1,
    developmentLevel: 0,
    maxDevelopmentLevel: 2,
    bonusDevelopmentLevel: 0,
    totalMaxDevelopmentLevel() {
      return this.maxDevelopmentLevel + this.bonusDevelopmentLevel;
    },
    explored: false,
    contextMenu: [...SYSTEM_CONTEXT_MENU, ...STATION_CONTEXT_MENU],
  },
  {
    id: 51,
    img: "Silis_Major",
    type: SYSTEM,
    domain: POLITICS,
    deck: SYSTEM,
    count: 1,
    developmentLevel: 0,
    maxDevelopmentLevel: 5,
    bonusDevelopmentLevel: 0,
    totalMaxDevelopmentLevel() {
      return this.maxDevelopmentLevel + this.bonusDevelopmentLevel;
    },
    explored: false,
    contextMenu: [...SYSTEM_CONTEXT_MENU, ...STATION_CONTEXT_MENU],
    buildShipContextMenu: generateBuildShipContextMenu,
    abilityMenu: ({ card, systems, activePlayer, players }) => {
      let menu = [];

      if (
        card.controlledBy != activePlayer ||
        players[activePlayer].credits < 4
      ) {
        return menu;
      }

      systems
        .filter((system) => system.card.controlledBy === activePlayer)
        .forEach((system) => {
          if (
            system.card.developmentLevel <
            system.card.totalMaxDevelopmentLevel()
          ) {
            menu.push({
              label: `Develop ${system.card.img}`,
              action: `perform:ability:${system.card.id}`,
              performAction: () => {
                system.card.developmentLevel++;
                players[activePlayer].credits -= 4;
              },
            });
          }
        });

      return menu;
    },
  },
  {
    id: 52,
    img: "Forsei",
    type: SYSTEM,
    domain: INDUSTRY,
    deck: SYSTEM,
    count: 1,
    developmentLevel: 0,
    maxDevelopmentLevel: 5,
    bonusDevelopmentLevel: 0,
    totalMaxDevelopmentLevel() {
      return this.maxDevelopmentLevel + this.bonusDevelopmentLevel;
    },
    explored: false,
    contextMenu: [...SYSTEM_CONTEXT_MENU, ...STATION_CONTEXT_MENU],
    buildShipContextMenu: generateBuildShipContextMenu,
    abilityMenu: ({ card, systems, activePlayer, players }) => {
      let menu = [];

      if (
        card.controlledBy != activePlayer ||
        players[activePlayer].credits < 4
      ) {
        return menu;
      }

      systems.forEach((system) => {
        system[activePlayer].forEach((card) => {
          if (card.damage > 0) {
            menu.push({
              label: `Repair ${card.img} in ${system.card.img}`,
              action: `perform:ability:${system.card.id}`,
              performAction: () => {
                card.damage = 0;
                players[activePlayer].credits -= 4;
              },
            });
          }
        });
      });

      return menu;
    },
  },
  {
    id: 53,
    img: "Drummond",
    type: SYSTEM,
    domain: SCIENCE,
    deck: SYSTEM,
    count: 1,
    developmentLevel: 0,
    maxDevelopmentLevel: 5,
    bonusDevelopmentLevel: 0,
    totalMaxDevelopmentLevel() {
      return this.maxDevelopmentLevel + this.bonusDevelopmentLevel;
    },
    explored: false,
    contextMenu: [...SYSTEM_CONTEXT_MENU, ...STATION_CONTEXT_MENU],
    buildShipContextMenu: generateBuildShipContextMenu,
    abilityMenu: ({ card, systems, activePlayer, players }) => {
      if (
        card.controlledBy != activePlayer ||
        players[activePlayer].credits < 4
      ) {
        return [];
      }

      return [
        {
          label: `Activate ability`,
          action: `perform:ability:0`,
          performAction: () => {
            players[activePlayer].credits -= 4;
          },
        },
      ];
    },
  },
  {
    id: 54,
    img: "Empty_System",
    type: SYSTEM,
    domain: null,
    deck: SYSTEM,
    count: 4,
    developmentLevel: 0,
    maxDevelopmentLevel: 0,
    bonusDevelopmentLevel: 0,
    totalMaxDevelopmentLevel() {
      return this.maxDevelopmentLevel + this.bonusDevelopmentLevel;
    },
    explored: false,
    contextMenu: [],
  },
  {
    id: 55,
    img: "Homeworld",
    type: SYSTEM,
    domain: null,
    deck: null,
    // count: 1,
    developmentLevel: 1,
    maxDevelopmentLevel: 6,
    bonusDevelopmentLevel: 0,
    totalMaxDevelopmentLevel() {
      return this.maxDevelopmentLevel + this.bonusDevelopmentLevel;
    },
    explored: true,
    contextMenu: [...SYSTEM_CONTEXT_MENU, ...STATION_CONTEXT_MENU],
    buildShipContextMenu: generateBuildShipContextMenu,
  },
];

export const randomCard = () => {
  return CARD_LIST[Math.floor(Math.random() * CARD_LIST.length)];
};

export const HOMEWORLD = CARD_LIST.find((card) => card.img === "Homeworld");

export const DECK_POLITICS = CARD_LIST.filter(
  (card) => card.deck === POLITICS
).reduce((deck, card) => {
  const list = [...deck];
  for (let i = 0; i < card.count; i++) {
    list.push({ ...card });
  }
  return list;
}, []);

export const DECK_INDUSTRY = CARD_LIST.filter(
  (card) => card.deck === INDUSTRY
).reduce((deck, card) => {
  const list = [...deck];
  for (let i = 0; i < card.count; i++) {
    list.push({ ...card });
  }
  return list;
}, []);

export const DECK_SCIENCE = CARD_LIST.filter(
  (card) => card.deck === SCIENCE
).reduce((deck, card) => {
  const list = [...deck];
  for (let i = 0; i < card.count; i++) {
    list.push({ ...card });
  }
  return list;
}, []);

export const DECK_SYSTEM = CARD_LIST.filter(
  (card) => card.deck === SYSTEM
).reduce((deck, card) => {
  const list = [...deck];
  for (let i = 0; i < card.count; i++) {
    list.push({ ...card });
  }
  return list;
}, []);

export const SCOUT = CARD_LIST.find((card) => card.id === 31);
