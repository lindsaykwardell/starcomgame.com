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
      players[activePlayer].credits >= (card.developmentLevel * 2 || 1),
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
  },
  {
    action: "destroy",
    label: "Destroy this",
  },
];

const SHIP_ID_LIST = [15, 18, 28, 8, 41, 11, 19];

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

const SHIP_CONTEXT_MENU = [
  {
    action: "build:15",
    label: "Build Corvette",
    condition: ({ card, system, activePlayer, players }) =>
      card.controlledBy === activePlayer && players[activePlayer].credits >= 2,
  },
  {
    action: "build:18",
    label: "Build Destroyer",
    condition: ({ card, system, activePlayer, players }) =>
      card.controlledBy === activePlayer && players[activePlayer].credits >= 3,
  },
  {
    action: "build:28",
    label: "Build Frigate",
    condition: ({ card, system, activePlayer, players }) =>
      card.controlledBy === activePlayer && players[activePlayer].credits >= 2,
  },
  {
    action: "build:8",
    label: "Build Battlecruiser",
    condition: ({ card, system, activePlayer, players }) =>
      card.controlledBy === activePlayer && players[activePlayer].credits >= 6,
  },
  {
    action: "build:41",
    label: "Build Missile Cruiser",
    condition: ({ card, system, activePlayer, players }) =>
      card.controlledBy === activePlayer && players[activePlayer].credits >= 6,
  },
  {
    action: "build:11",
    label: "Build Carrier",
    condition: ({ card, system, activePlayer, players }) =>
      card.controlledBy === activePlayer && players[activePlayer].credits >= 8,
  },
  {
    action: "build:19",
    label: "Build Dreadnought",
    condition: ({ card, system, activePlayer, players }) =>
      card.controlledBy === activePlayer && players[activePlayer].credits >= 8,
  },
];

const STATION_CONTEXT_MENU = [
  {
    action: "build:17",
    label: "Build Defense Station",
    condition: ({ card, system, activePlayer, players }) =>
      card.controlledBy === activePlayer && players[activePlayer].credits >= 2,
  },
  {
    action: "build:45",
    label: "Build Orbital Hangar",
    condition: ({ card, system, activePlayer, players }) =>
      card.controlledBy === activePlayer && players[activePlayer].credits >= 3,
  },
];

export const BUILD_FIGHTER_CONTEXT_MENU = [
  {
    action: "build:60",
    label: "Build Strike Fighter",
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
  let opponent = system.player1.find((c) => c.id === card.id)
    ? "player2"
    : "player1";
  system[opponent].forEach((c) => {
    menu.unshift({
      action: `assign-damage:${c.id}`,
      label: `Attack ${c.img} (${c.hp - c.damage}/${c.hp})`,
      condition: ({ card, system, activePlayer, players }) =>
        card.attack > 0 && !card.damageAssignedTo,
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
    img: "Advanced_Fighters",
    type: TECHNOLOGY,
    domain: POLITICS,
    deck: POLITICS,
    count: 3,
    cost: 2,
    contextMenu: [],
  },
  {
    id: 2,
    img: "Advanced_Shields",
    type: TECHNOLOGY,
    domain: SCIENCE,
    deck: SCIENCE,
    count: 3,
    cost: 4,
    contextMenu: [],
  },
  {
    id: 3,
    img: "Advanced_Weapons",
    type: TECHNOLOGY,
    domain: SCIENCE,
    deck: SCIENCE,
    count: 3,
    cost: 4,
    contextMenu: [],
  },
  {
    id: 4,
    img: "Alien_World",
    type: SYSTEM,
    domain: SCIENCE,
    deck: SYSTEM,
    count: 3,
    contextMenu: [...SYSTEM_CONTEXT_MENU, ...STATION_CONTEXT_MENU],
    developmentLevel: 0,
    maxDevelopmentLevel: 4,
    onExplore: () => alert("Draw two cards from any one deck"),
  },
  {
    id: 5,
    img: "Applied_Learning",
    type: TECHNOLOGY,
    domain: SCIENCE,
    deck: SCIENCE,
    count: 3,
    cost: 4,
    contextMenu: [],
  },
  {
    id: 6,
    img: "Asteroid_Field",
    type: SYSTEM,
    domain: INDUSTRY,
    deck: SYSTEM,
    count: 3,
    contextMenu: [...SYSTEM_CONTEXT_MENU, ...STATION_CONTEXT_MENU],
    developmentLevel: 0,
    maxDevelopmentLevel: 1,
  },
  {
    id: 7,
    img: "Barrage",
    type: COMMAND,
    domain: INDUSTRY,
    deck: INDUSTRY,
    count: 3,
    cost: 3,
    contextMenu: [],
    step: 0,
    stepContext: {},
    stepContextMenu: [
      ({ systems, activePlayer }) => {
        let menu = [];
        systems.forEach((system) => {
          system[activePlayer].forEach((card) => {
            if (card.attack > 0) {
              menu.push({
                label: `Choose ${card.img} (ATK: ${card.attack})`,
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
      ({ chosenCard, chosenSystem, nonActivePlayer }) =>
        chosenSystem[nonActivePlayer].map((card, index) => ({
          label: `Target ${card.img} (${card.hp - card.damage}/${card.hp})`,
          action: `step:${index}`,
          stepAction: () => ({ target: card }),
        })),
      ({ chosenCard, target }) => [
        {
          label: `Deal ${chosenCard.attack} damage to ${target.img}`,
          action: "step:0",
          stepAction: () => {
            target.damage += chosenCard.attack;
          },
        },
      ],
    ],
  },
  {
    id: 8,
    img: "Battlecruiser",
    type: SHIP,
    subtype: MEDIUM,
    domain: null,
    deck: null,
    damage: 0,
    cost: 6,
    hp: 8,
    attack: 4,
    contextMenu: [...DAMAGE_CONTEXT_MENU],
    combatContextMenu: generateCombatContextMenu,
  },
  {
    id: 9,
    img: "Black_Hole",
    type: SYSTEM,
    domain: SCIENCE,
    deck: SYSTEM,
    count: 1,
    contextMenu: [...SYSTEM_CONTEXT_MENU, ...STATION_CONTEXT_MENU],
    developmentLevel: 0,
    maxDevelopmentLevel: 2,
  },
  {
    id: 10,
    img: "Bribery",
    type: COMMAND,
    domain: POLITICS,
    deck: POLITICS,
    count: 3,
    cost: 4,
    contextMenu: [],
    step: 0,
    stepContext: {},
    stepContextMenu: [
      ({ systems, nonActivePlayer }) => {
        let menu = [];
        systems.forEach((system) => {
          system[nonActivePlayer].forEach((card) => {
            menu.push({
              label: `Target ${card.img} (${card.hp - card.damage}/${card.hp})`,
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
    id: 11,
    img: "Carrier",
    type: SHIP,
    subtype: LARGE,
    domain: null,
    deck: null,
    damage: 0,
    cost: 8,
    hp: 14,
    attack: 2,
    contextMenu: [...DAMAGE_CONTEXT_MENU, ...BUILD_FIGHTER_CONTEXT_MENU],
    combatContextMenu: generateCombatContextMenu,
  },
  {
    id: 12,
    img: "Ceasefire",
    type: MANEUVER,
    domain: POLITICS,
    deck: POLITICS,
    count: 3,
    cost: 2,
    contextMenu: [],
  },
  {
    id: 13,
    img: "Citation",
    type: MANEUVER,
    domain: POLITICS,
    deck: POLITICS,
    count: 4,
    cost: 2,
    contextMenu: [],
    step: 0,
    stepContext: {},
    stepContextMenu: [
      ({ systems, nonActivePlayer }) => {
        let menu = [];
        systems.forEach((system) => {
          system[nonActivePlayer].forEach((card) => {
            menu.push({
              label: `Target ${card.img} in ${system.card.img}`,
              action: `step:${menu.length}`,
              stepAction: () => {
                return { target: card, targetSystem: system };
              },
            });
          });
        });
        return menu;
      },
      ({ target, targetSystem }) => [
        {
          label: `${target.img} cannot deal damage this turn.`,
          action: "step:0",
          stepAction: () => {
            const atk = target.attack;

            if (target.damageAssignedTo) {
              targetSystem.player1.forEach((card) => {
                if (card.id === target.damageAssignedTo) {
                  card.damage -= target.attack;
                }
              });

              targetSystem.player2.forEach((card) => {
                if (card.id === target.damageAssignedTo) {
                  card.damage -= target.attack;
                }
              });

              target.damageAssignedTo = undefined;
            }

            target.attack = -1000;
            target.onTurnEnd = () => {
              target.attack = atk;
              target.onTurnEnd = undefined;
            };
          },
        },
      ],
    ],
  },
  {
    id: 14,
    img: "Close_Borders",
    type: COMMAND,
    domain: POLITICS,
    deck: POLITICS,
    count: 2,
    cost: 4,
    contextMenu: [],
  },
  {
    id: 15,
    img: "Corvette",
    type: SHIP,
    subtype: SMALL,
    domain: null,
    deck: null,
    damage: 0,
    cost: 2,
    hp: 2,
    attack: 3,
    contextMenu: [...DAMAGE_CONTEXT_MENU],
    combatContextMenu: generateCombatContextMenu,
  },
  {
    id: 16,
    img: "Damage_Control",
    type: MANEUVER,
    domain: INDUSTRY,
    deck: INDUSTRY,
    count: 3,
    cost: 3,
    contextMenu: [],
    step: 0,
    stepContext: {},
    stepContextMenu: [
      ({ systems, activePlayer }) => {
        let menu = [];
        systems.forEach((system) => {
          system[activePlayer].forEach((card) => {
            if (card.attack > 0) {
              menu.push({
                label: `Choose ${card.img} (ATK: ${card.attack})`,
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
      ({ chosenCard }) => [
        {
          label: `Apply effect to ${chosenCard.img}`,
          action: "step:0",
          stepAction: () => {
            chosenCard.onDestroy = () => {
              // If true, destroy
              // If false, don't.
              chosenCard.damage = chosenCard.hp - 1;
              return false;
            };
          },
        },
      ],
    ],
  },
  {
    id: 17,
    img: "Defense_Station",
    type: STATION,
    domain: null,
    deck: null,
    damage: 0,
    cost: 2,
    hp: 6,
    attack: 1,
    contextMenu: [...DAMAGE_CONTEXT_MENU],
    combatContextMenu: generateCombatContextMenu,
  },
  {
    id: 18,
    img: "Destroyer",
    type: SHIP,
    subtype: SMALL,
    domain: null,
    deck: null,
    damage: 0,
    cost: 3,
    hp: 5,
    attack: 2,
    contextMenu: [...DAMAGE_CONTEXT_MENU],
    combatContextMenu: generateCombatContextMenu,
  },
  {
    id: 19,
    img: "Dreadnought",
    type: SHIP,
    subtype: LARGE,
    domain: null,
    deck: null,
    damage: 0,
    cost: 8,
    hp: 12,
    attack: 5,
    contextMenu: [...DAMAGE_CONTEXT_MENU],
    combatContextMenu: generateCombatContextMenu,
  },
  {
    id: 20,
    img: "Drummond",
    type: CAPITAL_SYSTEM,
    domain: SCIENCE,
    deck: SYSTEM,
    count: 1,
    contextMenu: [...SYSTEM_CONTEXT_MENU, ...STATION_CONTEXT_MENU],
    developmentLevel: 0,
    maxDevelopmentLevel: 6,
  },
  {
    id: 21,
    img: "Empty_System",
    type: SYSTEM,
    domain: null,
    deck: SYSTEM,
    count: 3,
    contextMenu: [],
    developmentLevel: 0,
    maxDevelopmentLevel: 0,
  },
  {
    id: 22,
    img: "Enhanced_Defenses",
    type: TECHNOLOGY,
    domain: POLITICS,
    deck: POLITICS,
    count: 3,
    cost: 4,
    contextMenu: [],
  },
  {
    id: 23,
    img: "Evasion",
    type: MANEUVER,
    domain: SCIENCE,
    deck: SCIENCE,
    count: 4,
    cost: 3,
    contextMenu: [],
  },
  {
    id: 24,
    img: "Fighter_Bays",
    type: TECHNOLOGY,
    domain: POLITICS,
    deck: POLITICS,
    count: 3,
    cost: 3,
    contextMenu: [],
  },
  {
    id: 25,
    img: "Filibuster",
    type: COMMAND,
    domain: POLITICS,
    deck: POLITICS,
    count: 2,
    cost: 5,
    contextMenu: [],
  },
  {
    id: 26,
    img: "Forsei",
    type: CAPITAL_SYSTEM,
    domain: INDUSTRY,
    deck: SYSTEM,
    count: 1,
    contextMenu: [...SYSTEM_CONTEXT_MENU, ...STATION_CONTEXT_MENU],
    developmentLevel: 0,
    maxDevelopmentLevel: 6,
  },
  {
    id: 27,
    img: "Forum",
    type: TECHNOLOGY,
    domain: SCIENCE,
    deck: SCIENCE,
    count: 4,
    cost: 2,
    contextMenu: [],
  },
  {
    id: 28,
    img: "Frigate",
    type: SHIP,
    subtype: SMALL,
    domain: null,
    deck: null,
    damage: 0,
    cost: 2,
    hp: 3,
    attack: 2,
    contextMenu: [...DAMAGE_CONTEXT_MENU],
    combatContextMenu: generateCombatContextMenu,
  },
  {
    id: 29,
    img: "Harvest_the_Remains",
    type: COMMAND,
    domain: INDUSTRY,
    deck: INDUSTRY,
    count: 4,
    cost: 3,
    contextMenu: [],
  },
  {
    id: 30,
    img: "Homeworld",
    type: START_SYSTEM,
    domain: null,
    deck: null,
    contextMenu: [
      ...SYSTEM_CONTEXT_MENU,
      // ...SHIP_CONTEXT_MENU,
      ...STATION_CONTEXT_MENU,
    ],
    buildShipContextMenu: generateBuildShipContextMenu,
    developmentLevel: 1,
    maxDevelopmentLevel: 6,
  },
  {
    id: 31,
    img: "Illusory_Defeat",
    type: MANEUVER,
    domain: SCIENCE,
    deck: SCIENCE,
    count: 2,
    cost: 5,
    contextMenu: [],
  },
  {
    id: 32,
    img: "Industrial_Theory",
    type: TECHNOLOGY,
    domain: INDUSTRY,
    deck: INDUSTRY,
    count: 3,
    cost: 4,
    contextMenu: [],
    buildCostModifier: ({ cost, card }) => {
      if (card.type === SHIP && [MEDIUM, LARGE].includes(card.subtype))
        return cost - 1;
      else return cost;
    },
  },
  {
    id: 33,
    img: "Inspiration",
    type: COMMAND,
    domain: SCIENCE,
    deck: SCIENCE,
    count: 4,
    cost: 3,
    contextMenu: [],
  },
  {
    id: 34,
    img: "Intercept_Orders",
    type: COMMAND,
    domain: POLITICS,
    deck: POLITICS,
    count: 3,
    cost: 3,
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
    id: 35,
    img: "Interdiction",
    type: COMMAND,
    domain: SCIENCE,
    deck: SCIENCE,
    count: 2,
    cost: 5,
    contextMenu: [],
  },
  {
    id: 36,
    img: "Jump_Stabilization",
    type: COMMAND,
    domain: SCIENCE,
    deck: SCIENCE,
    count: 2,
    cost: 4,
    contextMenu: [],
  },
  {
    id: 37,
    img: "Logistics_Computers",
    type: TECHNOLOGY,
    domain: INDUSTRY,
    deck: INDUSTRY,
    count: 2,
    cost: 5,
    contextMenu: [],
  },
  {
    id: 38,
    img: "Machine_Learning",
    type: TECHNOLOGY,
    domain: SCIENCE,
    deck: SCIENCE,
    count: 2,
    cost: 6,
    contextMenu: [],
  },
  {
    id: 39,
    img: "Maximum_Firepower",
    type: MANEUVER,
    domain: SCIENCE,
    deck: SCIENCE,
    count: 4,
    cost: 2,
    contextMenu: [],
  },
  {
    id: 40,
    img: "Military_Outpost",
    type: SYSTEM,
    domain: POLITICS,
    deck: SYSTEM,
    count: 2,
    contextMenu: [
      ...SYSTEM_CONTEXT_MENU,
      ...BUILD_FIGHTER_CONTEXT_MENU,
      ...STATION_CONTEXT_MENU,
    ],
    developmentLevel: 0,
    maxDevelopmentLevel: 3,
  },
  {
    id: 41,
    img: "Missile_Cruiser",
    type: SHIP,
    subtype: MEDIUM,
    domain: null,
    deck: null,
    damage: 0,
    cost: 6,
    hp: 8,
    attack: 3,
    contextMenu: [...DAMAGE_CONTEXT_MENU],
    combatContextMenu: generateCombatContextMenu,
  },
  {
    id: 42,
    img: "Missile_Platform",
    type: STATION,
    domain: POLITICS,
    deck: POLITICS,
    count: 4,
    damage: 0,
    cost: 3,
    hp: 6,
    attack: 3,
    contextMenu: [...DAMAGE_CONTEXT_MENU],
    combatContextMenu: generateCombatContextMenu,
  },
  {
    id: 43,
    img: "New_Colony",
    type: SYSTEM,
    domain: POLITICS,
    deck: SYSTEM,
    count: 3,
    contextMenu: [...SYSTEM_CONTEXT_MENU, ...STATION_CONTEXT_MENU],
    developmentLevel: 0,
    maxDevelopmentLevel: 3,
    onExplore: ({ card, system, activePlayer, players }) => {
      card.controlledBy = activePlayer;
      card.developmentLevel += 1;
    },
  },
  {
    id: 44,
    img: "Observatory",
    type: STATION,
    domain: SCIENCE,
    deck: SCIENCE,
    count: 3,
    damage: 0,
    cost: 3,
    hp: 3,
    attack: 0,
    contextMenu: [...DAMAGE_CONTEXT_MENU],
    combatContextMenu: generateCombatContextMenu,
  },
  {
    id: 45,
    img: "Orbital_Hangar",
    type: STATION,
    domain: null,
    deck: null,
    damage: 0,
    cost: 3,
    hp: 6,
    attack: 0,
    contextMenu: [...BUILD_FIGHTER_CONTEXT_MENU, ...DAMAGE_CONTEXT_MENU],
    combatContextMenu: generateCombatContextMenu,
  },
  {
    id: 46,
    img: "Production_Lines",
    type: COMMAND,
    domain: INDUSTRY,
    deck: INDUSTRY,
    count: 2,
    cost: 4,
    contextMenu: [],
  },
  {
    id: 47,
    img: "Production_World",
    type: SYSTEM,
    domain: INDUSTRY,
    deck: SYSTEM,
    count: 2,
    contextMenu: [...SYSTEM_CONTEXT_MENU, ...STATION_CONTEXT_MENU],
    developmentLevel: 0,
    maxDevelopmentLevel: 4,
    buildCostModifier: ({ cost, card }) => {
      if ([MEDIUM, LARGE].includes(card.subtype)) return cost - 2;
      else if (card.subtype === SMALL || card.type === STATION) return cost - 1;
      else return cost;
    },
  },
  {
    id: 48,
    img: "Pulsar_System",
    type: SYSTEM,
    domain: INDUSTRY,
    deck: SYSTEM,
    count: 1,
    contextMenu: [...SYSTEM_CONTEXT_MENU, ...STATION_CONTEXT_MENU],
    developmentLevel: 0,
    maxDevelopmentLevel: 2,
  },
  {
    id: 49,
    img: "Raise_Shields",
    type: MANEUVER,
    domain: SCIENCE,
    deck: SCIENCE,
    count: 4,
    cost: 2,
    contextMenu: [],
  },
  {
    id: 50,
    img: "Ram",
    type: MANEUVER,
    domain: INDUSTRY,
    deck: INDUSTRY,
    count: 4,
    cost: 2,
    contextMenu: [],
    step: 0,
    stepContext: {},
    stepContextMenu: [
      ({ systems, activePlayer }) => {
        let menu = [];
        systems.forEach((system) => {
          system[activePlayer].forEach((card) => {
            if (card.attack > 0) {
              menu.push({
                label: `Choose ${card.img} (HP: ${card.hp})`,
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
      ({ chosenCard, chosenSystem, nonActivePlayer }) =>
        chosenSystem[nonActivePlayer].map((card, index) => ({
          label: `Target ${card.img} (${card.hp - card.damage}/${card.hp})`,
          action: `step:${index}`,
          stepAction: () => ({ target: card }),
        })),
      ({ chosenCard, target }) => [
        {
          label: `Destroy ${chosenCard.img}. Deal ${chosenCard.hp} damage to ${target.img}`,
          action: "step:0",
          stepAction: () => {
            target.damage += chosenCard.hp;
            chosenCard.damage = chosenCard.hp;
          },
        },
      ],
    ],
  },
  {
    id: 51,
    img: "Refinery",
    type: STATION,
    domain: INDUSTRY,
    deck: INDUSTRY,
    count: 4,
    damage: 0,
    cost: 2,
    hp: 3,
    attack: 0,
    contextMenu: [...DAMAGE_CONTEXT_MENU],
    onTurnStart: ({ card, system, activePlayer, players }) =>
      (players[activePlayer].credits += 2),
    combatContextMenu: generateCombatContextMenu,
  },
  {
    id: 52,
    img: "Repair_Crews",
    type: COMMAND,
    domain: INDUSTRY,
    deck: INDUSTRY,
    count: 4,
    cost: 2,
    contextMenu: [],
    step: 0,
    stepContext: {},
    stepContextMenu: [
      ({ systems, activePlayer }) => {
        let menu = [...RETURN_TO_HAND_CONTEXT_MENU];
        systems.forEach((system) => {
          system[activePlayer].forEach((card) => {
            if (card.damage > 0) {
              menu.push({
                label: `Target ${card.img} (${card.hp - card.damage}/${
                  card.hp
                })`,
                action: "step:" + menu.length,
                stepAction: () => {
                  return { target: card };
                },
              });
            }
          });
        });
        return menu;
      },
      ({ target }) => [
        {
          label: `Repair ${target.img}`,
          action: "step:" + 0,
          stepAction: () => {
            target.damage = 0;
          },
        },
      ],
    ],
  },
  {
    id: 53,
    img: "Research_World",
    type: SYSTEM,
    domain: SCIENCE,
    deck: SYSTEM,
    count: 2,
    contextMenu: [...SYSTEM_CONTEXT_MENU, ...STATION_CONTEXT_MENU],
    developmentLevel: 0,
    maxDevelopmentLevel: 4,
    // onTurnStart: () =>
    //   alert("Research World: At the start of your turn, draw a card."),
  },
  {
    id: 54,
    img: "Sabotage",
    type: COMMAND,
    domain: POLITICS,
    deck: POLITICS,
    count: 4,
    cost: 3,
    contextMenu: [],
    step: 0,
    stepContext: {},
    stepContextMenu: [
      ({ systems }) => {
        let menu = [];
        systems.forEach((system) => {
          system.player1.forEach((card) => {
            menu.push({
              label: `Destroy ${card.img}`,
              action: `step:${menu.length}`,
              stepAction: () => {
                card.damage = card.hp;
              },
            });
          });
          system.player2.forEach((card) => {
            menu.push({
              label: `Destroy ${card.img}`,
              action: `step:${menu.length}`,
              stepAction: () => {
                card.damage = card.hp;
              },
            });
          });
        });
        return menu;
      },
    ],
  },
  {
    id: 55,
    img: "Salvage_Operations",
    type: TECHNOLOGY,
    domain: INDUSTRY,
    deck: INDUSTRY,
    count: 4,
    cost: 3,
    contextMenu: [],
  },
  {
    id: 56,
    img: "Sanctions",
    type: COMMAND,
    domain: POLITICS,
    deck: POLITICS,
    count: 2,
    cost: 5,
    contextMenu: [],
  },
  {
    id: 57,
    img: "Scout",
    type: SHIP,
    subtype: SMALL,
    domain: null,
    deck: null,
    damage: 0,
    hp: 2,
    attack: 0,
    contextMenu: [...DAMAGE_CONTEXT_MENU],
    combatContextMenu: generateCombatContextMenu,
  },
  {
    id: 58,
    img: "Silis_Major",
    type: CAPITAL_SYSTEM,
    domain: POLITICS,
    deck: SYSTEM,
    count: 1,
    contextMenu: [...SYSTEM_CONTEXT_MENU, ...STATION_CONTEXT_MENU],
    developmentLevel: 0,
    maxDevelopmentLevel: 6,
  },
  {
    id: 59,
    img: "Spy_Network",
    type: COMMAND,
    domain: POLITICS,
    deck: POLITICS,
    count: 4,
    cost: 2,
    contextMenu: [],
    step: 0,
    stepContext: {},
    stepContextMenu: [
      ({ players, nonActivePlayer, discard }) =>
        players[nonActivePlayer].hand.map((card, index) => ({
          label: `${nonActivePlayer.charAt(0).toUpperCase() +
            nonActivePlayer.slice(1)} discards ${card.img}`,
          action: `step:${index}`,
          stepAction: () => {
            players[nonActivePlayer].hand = players[
              nonActivePlayer
            ].hand.filter((c) => c.id !== card.id);

            discard = [
              {
                ...card,
                contextMenu: [...DISCARD_CONTEXT_MENU],
              },
              ...discard,
            ];
          },
        })),
    ],
  },
  {
    id: 60,
    img: "Strike_Fighter",
    type: SHIP,
    subtype: FIGHTER,
    domain: null,
    deck: null,
    damage: 0,
    cost: 1,
    hp: 1,
    attack: 1,
    contextMenu: [...DAMAGE_CONTEXT_MENU],
    combatContextMenu: generateCombatContextMenu,
  },
  {
    id: 61,
    img: "Strip_Mining",
    type: COMMAND,
    domain: INDUSTRY,
    deck: INDUSTRY,
    count: 2,
    cost: 6,
    contextMenu: [],
    step: 0,
    stepContext: {},
    stepContextMenu: [
      ({ systems, activePlayer }) =>
        systems
          .filter((system) => system.card.controlledBy === activePlayer)
          .map((system, index) => ({
            label: `Target ${system.card.img}`,
            action: `step:${index}`,
            stepAction: () => ({
              target: system,
            }),
          })),
      ({ target }) => ({
        label: `Apply effect to ${target.img}`,
        action: "step:0",
        stepAction: () => {
          target.card.developmentLevel = 6;
          target.card.onTurnStart = undefined;
        },
      }),
    ],
  },
  {
    id: 62,
    img: "Targeting_Systems",
    type: TECHNOLOGY,
    domain: INDUSTRY,
    deck: INDUSTRY,
    count: 3,
    cost: 4,
    contextMenu: [],
  },
  {
    id: 63,
    img: "Trade_Routes",
    type: TECHNOLOGY,
    domain: INDUSTRY,
    deck: INDUSTRY,
    count: 2,
    cost: 4,
    contextMenu: [],
    onTurnStart: ({ systems, activePlayer, players }) => {
      let total = 0;

      systems.forEach((system) => {
        if (system.card.controlledBy === activePlayer) total++;

        total += system[activePlayer].filter((card) => card.type === STATION)
          .length;
      });

      players[activePlayer].credits += total;
    },
  },
  {
    id: 64,
    img: "Trade_World",
    type: SYSTEM,
    domain: POLITICS,
    deck: SYSTEM,
    count: 2,
    contextMenu: [...SYSTEM_CONTEXT_MENU, ...STATION_CONTEXT_MENU],
    developmentLevel: 0,
    maxDevelopmentLevel: 4,
    onTurnStart: ({ card, system, activePlayer, players }) =>
      (players[activePlayer].credits += 2),
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

export const SCOUT = CARD_LIST.find((card) => card.id === 57);
