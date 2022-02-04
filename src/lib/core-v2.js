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

const SHIP_ID_LIST = [33, 34, 35, 36, 37, 38, 39];

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
    img: "Refinery",
    type: STATION,
    domain: INDUSTRY,
    deck: INDUSTRY,
    damage: 0,
    count: 4,
    cost: 2,
    hp: 3,
    attack: 0,
    contextMenu: [],
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
    attack: 3,
    contextMenu: [],
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
    attack: 0,
    contextMenu: [],
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
    attack: 0,
    contextMenu: [],
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
    attack: 0,
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
    attack: 0,
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
    attack: 1,
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
    attack: 2,
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
    attack: 3,
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
    attack: 2,
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
    attack: 4,
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
    attack: 3,
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
    attack: 5,
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
    attack: 2,
    contextMenu: [...DAMAGE_CONTEXT_MENU],
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
    attack: 1,
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
    attack: 0,
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
    explored: false,
    contextMenu: [...SYSTEM_CONTEXT_MENU, ...STATION_CONTEXT_MENU],
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
    explored: false,
    contextMenu: [...SYSTEM_CONTEXT_MENU, ...STATION_CONTEXT_MENU],
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
    explored: false,
    contextMenu: [...SYSTEM_CONTEXT_MENU, ...STATION_CONTEXT_MENU],
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
    explored: false,
    contextMenu: [...SYSTEM_CONTEXT_MENU, ...STATION_CONTEXT_MENU],
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
    explored: false,
    contextMenu: [...SYSTEM_CONTEXT_MENU, ...STATION_CONTEXT_MENU],
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
    explored: false,
    contextMenu: [...SYSTEM_CONTEXT_MENU, ...STATION_CONTEXT_MENU],
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
    explored: false,
    contextMenu: [...SYSTEM_CONTEXT_MENU, ...STATION_CONTEXT_MENU],
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
    explored: false,
    contextMenu: [...SYSTEM_CONTEXT_MENU, ...STATION_CONTEXT_MENU],
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
    explored: false,
    contextMenu: [...SYSTEM_CONTEXT_MENU, ...STATION_CONTEXT_MENU],
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
