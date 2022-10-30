export const STATECRAFT = "Statecraft";
export const INDUSTRY = "Industry";
export const SCIENCE = "Science";

export const DOMAINS = [STATECRAFT, INDUSTRY, SCIENCE];

export const SHIP = "Ship";
export const FIGHTER = "Fighter";
export const STATION = "Station";
export const SYSTEM = "System";
export const CAPITAL_SYSTEM = "Capital System";
export const START_SYSTEM = "Starting System";
export const COMMAND = "Command";
export const TECHNOLOGY = "Technology";

export const CARD_TYPES = [SHIP, FIGHTER, STATION, SYSTEM, COMMAND, TECHNOLOGY];

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

function shipsControlledBy(system, player) {
  return system.vessels.filter((v) => v.controlledBy === player);
}

function shipsNotControlledBy(system, player) {
  return system.vessels.filter((v) => v.controlledBy !== player);
}

const SYSTEM_CONTEXT_MENU = [
  {
    action: "develop",
    label: "Build Development",
    condition: ({ card, system, activePlayer, players }) =>
      (card.controlledBy === activePlayer ||
        (!card.controlledBy &&
          shipsControlledBy(system, activePlayer).length > 0)) &&
      players[activePlayer].credits >= (card.developmentLevel + 1 || 1) &&
      card.developmentLevel < card.totalMaxDevelopmentLevel(),
  },
  {
    action: "combat",
    label: "Begin Combat",
    condition: ({ card, system, players, inCombat }) =>
      !inCombat &&
      system.vessels.reduce(
        (presentPlayers, v) =>
          presentPlayers.includes(v.controlledBy)
            ? presentPlayers
            : [...presentPlayers, v.controlledBy],
        []
      ).length >= 2,
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
    label: "Remove 1 damage",
    condition: ({ card }) => card.damage > 0,
    repairAction: ({ card }) => {
      card.damage -= 1;
    },
  },
  {
    action: "destroy",
    label: "Destroy this",
  },
];

const SHIP_ID_LIST = [32, 34, 35, 36, 37, 38, 39];

export const CAPITAL_PLANET_NAME_LIST = [
  "Homeworld",
  // "Drummond",
  // "Silis_Major",
  // "Forsei",
];

function shipCountBelowDevelopmentLevel(systems, activePlayer) {
  const playerDevelopmentLevel = systems
    .filter((system) => system.card.controlledBy === activePlayer)
    .reduce((total, system) => system.card.developmentLevel + total, 0);

  const playerTotalShipCount = systems.reduce(
    (total, system) =>
      shipsControlledBy(system, activePlayer).filter(
        (c) => c.type !== STATION && c.img !== "Scout"
      ).length + total,
    0
  );
  return playerDevelopmentLevel > playerTotalShipCount;
}

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
      condition: ({ card, system, systems, activePlayer, players }) =>
        card.controlledBy === activePlayer &&
        players[activePlayer].credits >= cost &&
        shipCountBelowDevelopmentLevel(systems, activePlayer),
      cost,
    };
  });

const STATION_CONTEXT_MENU = [
  {
    action: "build:40",
    label: "Build Defense Station",
    condition: ({ card, system, activePlayer, players }) => {
      const defenseStation = CARD_LIST.find((c) => c.img === "Defense_Station");
      let cost = 3;
      players[activePlayer].technology.forEach((tech) => {
        if (tech.buildCostModifier) {
          cost = tech.buildCostModifier({ card: defenseStation, cost });
        }
      });
      return (
        card.controlledBy === activePlayer &&
        players[activePlayer].credits >= cost &&
        shipsControlledBy(system, activePlayer).filter(
          (c) => c.type === STATION
        ).length < system.card.developmentLevel
      );
    },
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
    condition: ({ card, system, players }) =>
      card.totalAttack() > 0 && !card.damageAssignedTo,
  });
  shipsNotControlledBy(system, card.controlledBy).forEach((c) => {
    menu.unshift({
      action: `assign-damage:${c.id}`,
      label: `Attack ${c.img} (${c.totalHp() - c.damage}/${c.totalHp()})`,
      condition: ({ card, system, players }) =>
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
    effects: [],
    contextMenu: [...DAMAGE_CONTEXT_MENU],
    onTurnStart: ({ card, system, activePlayer, players }) => {
      players[activePlayer].credits += 2;
    },
    combatContextMenu: generateCombatContextMenu,
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
      ({ systems, card, players }) => {
        let menu = [];

        systems.forEach((system) => {
          if (system.card.developmentLevel > 0) {
            menu.push({
              label: `Gain ${system.card.developmentLevel} (${system.card.img})}`,
              action: `step:0`,
              stepAction: () => {
                players[card.controlledBy].credits +=
                  system.card.developmentLevel;
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
    img: "Orbital_Bombardment",
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
      ({ systems, card }) => {
        let menu = [];
        systems.forEach((system) => {
          if (system.card.controlledBy !== card.controlledBy) {
            shipsControlledBy(system, card.controlledBy).forEach((card) => {
              if (card.totalAttack() > 0) {
                menu.push({
                  label: `Choose ${card.img} (ATK: ${card.totalAttack()}) in ${
                    system.card.img
                  }`,
                  action: `step:${menu.length}`,
                  stepAction: () => {
                    return { chosenCard: card, chosenSystem: system };
                  },
                });
              }
            });
          }
        });
        return menu;
      },
      ({ chosenCard, chosenSystem }) => {
        const attack = chosenCard.totalAttack();
        const developmentLevel = chosenSystem.card.developmentLevel;

        const countersToRemove =
          developmentLevel - attack <= 0 ? developmentLevel - 1 : attack;

        return [
          {
            label: `Remove ${countersToRemove} from ${chosenSystem.card.img}`,
            action: "step:0",
            stepAction: () => {
              chosenSystem.card.developmentLevel -= countersToRemove;
            },
          },
        ];
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
      ({ systems, card }) => {
        let menu = [];
        systems.forEach((system) => {
          shipsControlledBy(system, card.controlledBy).forEach((c) => {
            if (c.totalAttack() > 0) {
              menu.push({
                label: `Choose ${c.img} (ATK: ${c.totalAttack()}) in ${
                  system.card.img
                }`,
                action: `step:${menu.length}`,
                stepAction: () => {
                  return { chosenCard: c, chosenSystem: system };
                },
              });
            }
          });
        });
        return menu;
      },
      (ctx) => {
        const { chosenCard, chosenSystem, card } = ctx;
        return shipsNotControlledBy(chosenSystem, card.controlledBy).map(
          (ship) => ({
            label: `Deal ${chosenCard.totalAttack()} to ${ship.img} (${
              ship.totalHp() - ship.damage
            }/${ship.totalHp()})`,
            action: "step:0",
            stepAction: () => {
              ship.damage += chosenCard.totalAttack();
            },
          })
        );
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
      ({ systems, card }) => {
        // Select a ship the active player controls, and add it to step context
        let menu = [];
        systems.forEach((system) => {
          shipsControlledBy(system, card.controlledBy).forEach((c, index) => {
            menu.push({
              label: `Choose ${c.img} (HP: ${c.totalHp()}) in ${
                system.card.img
              }`,
              action: `step:${index}`,
              stepAction: () => ({ chosenCard: c, chosenSystem: system }),
            });
          });
        });
        return menu;
      },
      ({ chosenCard, chosenSystem, card }) => {
        // Select a ship the non active player controls, and add it to step context
        let menu = [];
        shipsNotControlledBy(chosenSystem, card.controlledBy).forEach(
          (c, index) => {
            menu.push({
              label: `Target ${c.img} (HP: ${c.totalHp() - c.damage})`,
              action: `step:${index}`,
              stepAction: () => ({ targetCard: c }),
            });
          }
        );
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
      ({ systems, card, getNextId }) => {
        let menu = [];

        systems.forEach((system, index) => {
          if (system.card.controlledBy == card.controlledBy) {
            menu.push({
              label: `Choose ${system.card.img}`,
              action: `step:${index}`,
              stepAction: () => {
                const corvette = {
                  ...CARD_LIST.find((c) => c.img == "Corvette"),
                };
                if (corvette) {
                  system.vessels = [
                    ...system.vessels,
                    {
                      ...corvette,
                      id: getNextId(),
                      effects: [],
                      controlledBy: card.controlledBy,
                    },
                    {
                      ...corvette,
                      id: getNextId(),
                      effects: [],
                      controlledBy: card.controlledBy,
                    },
                    {
                      ...corvette,
                      id: getNextId(),
                      effects: [],
                      controlledBy: card.controlledBy,
                    },
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
    onResolve: ({ systems, card }) => {
      systems.forEach((system) => {
        shipsControlledBy(system, card.controlledBy).forEach((c) => {
          c.bonusAttack += 2;
          c.effects.push("Maximum_Firepower");
        });
      });
    },
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
        total += shipsControlledBy(system, activePlayer).filter(
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
      ({ systems, card, players }) => {
        let menu = [];

        if (players[card.controlledBy].credits <= 0) {
          return menu;
        }

        systems.forEach((system) => {
          shipsControlledBy(system, card.controlledBy).forEach((c, index) => {
            menu.push({
              label: `Choose ${c.img} (Attack: ${c.totalAttack()}) in ${
                system.card.img
              }`,
              action: `step:${index}`,
              condition: () => {
                players[card.controlledBy].credits >= c.totalAttack() * 2;
              },
              stepAction: () => {
                return { chosenCard: c };
              },
            });
          });
        });

        return menu;
      },
      ({ chosenCard, card, players }) => {
        const cost = chosenCard.totalAttack();
        return [
          {
            label: `Pay ${cost}: ${chosenCard.img} gets +${
              cost * 2
            } attack until end of turn`,
            action: "step:0",
            stepAction: () => {
              chosenCard.bonusAttack += cost * 2;
              players[card.controlledBy].credits -= cost;
              chosenCard.effects.push("Railgun_Turrets");
            },
          },
          {
            label: "Cancel",
            action: "step:0",
            stepAction: () => null,
          },
        ];
      },
    ],
  },
  {
    id: 10,
    img: "Battlecruiser",
    type: SHIP,
    domain: INDUSTRY,
    deck: INDUSTRY,
    count: 2,
    cost: 10,
    damage: 0,
    hp: 8,
    bonusHp: 0,
    totalHp() {
      return this.hp + this.bonusHp;
    },
    attack: 6,
    bonusAttack: 0,
    totalAttack() {
      return this.attack + this.bonusAttack;
    },
    effects: [],
    contextMenu: [...DAMAGE_CONTEXT_MENU],
    combatContextMenu: generateCombatContextMenu,
    abilityMenu: ({ card, players }) => {
      let menu = [];

      for (let i = 1; i <= players[card.controlledBy].credits; i++) {
        menu.push({
          label: `Pay ${i}: Get +${i} attack until end of turn.`,
          action: `perform`,
          performAction: () => {
            card.bonusAttack += i;
            players[card.controlledBy].credits -= i;
            if (!card.effects.includes("Battlecruiser")) {
              card.effects.push("Battlecruiser");
            }
          },
        });
      }

      return menu;
    },
  },
  {
    id: 11,
    img: "Missile_Platform",
    type: STATION,
    domain: STATECRAFT,
    deck: STATECRAFT,
    damage: 0,
    count: 4,
    cost: 5,
    hp: 5,
    bonusHp: 0,
    totalHp() {
      return this.hp + this.bonusHp;
    },
    attack: 3,
    bonusAttack: 0,
    totalAttack() {
      return this.attack + this.bonusAttack;
    },
    effects: [],
    contextMenu: [...DAMAGE_CONTEXT_MENU],
    onResolve: ({ systems, card }) => {
      systems.forEach((system) => {
        shipsControlledBy(system, card.controlledBy).forEach((c) => {
          if (c.id !== card.id && c.type === STATION) {
            c.bonusAttack += 1;
            c.effects.push("Missile_Platform");
          }
        });
      });
    },
    onEachTurnStart: ({ card, system, player }) => {
      shipsControlledBy(system, player).forEach((c) => {
        if (c.id !== card.id && c.type === STATION) {
          c.bonusAttack += 1;
          c.effects.push("Missile_Platform");
        }
      });
    },
    combatContextMenu: generateCombatContextMenu,
  },
  {
    id: 12,
    img: "Orbital_Habitat",
    type: STATION,
    domain: STATECRAFT,
    deck: STATECRAFT,
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
    effects: [],
    contextMenu: [...DAMAGE_CONTEXT_MENU],
    onBuild: ({ system }) => {
      system.card.bonusDevelopmentLevel += 2;
    },
    onDestroy: ({ system }) => {
      system.card.bonusDevelopmentLevel -= 2;
    },
    onTurnStart: ({ system }) => {
      if (
        system.card.totalMaxDevelopmentLevel() > system.card.developmentLevel
      ) {
        system.card.developmentLevel++;
      }
    },
    combatContextMenu: generateCombatContextMenu,
  },
  {
    id: 13,
    img: "Shipyard",
    type: STATION,
    domain: STATECRAFT,
    deck: STATECRAFT,
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
    effects: [],
    contextMenu: [...DAMAGE_CONTEXT_MENU],
    buildShipContextMenu: generateBuildShipContextMenu,
    combatContextMenu: generateCombatContextMenu,
  },
  {
    id: 14,
    img: "Spy_Network",
    type: COMMAND,
    domain: STATECRAFT,
    deck: STATECRAFT,
    count: 4,
    cost: 0,
    hp: null,
    attack: null,
    contextMenu: [],
    step: 0,
    stepContext: {},
    stepContextMenu: [
      ({ players, card }) => {
        return Object.keys(players)
          .filter(
            (player) =>
              player !== card.controlledBy && players[player].hand.length > 0
          )
          .map((player, i) => ({
            label: `View ${player}'s hand (${players[player].hand.length} cards)`,
            action: `step:${i}`,
            stepAction: () => {
              return { chosenPlayer: player };
            },
          }));
      },
      ({ players, chosenPlayer, card }) => {
        return players[chosenPlayer].hand.map((c, i) => ({
          label: `Choose ${c.img}`,
          action: "step:0",
          stepAction: () => {
            players[chosenPlayer].hand = players[chosenPlayer].hand.filter(
              (h) => h.id !== c.id
            );
            players[card.controlledBy].hand = [
              ...players[card.controlledBy].hand,
              { ...c, controlledBy: card.controlledBy },
            ];
          },
        }));
      },
    ],
  },
  {
    id: 15,
    img: "Intercept_Orders",
    type: COMMAND,
    domain: STATECRAFT,
    deck: STATECRAFT,
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
          label: `Cancel the effect of ${card.img}`,
          action: `step:${index}`,
          stepAction: () => {
            const index = stack.findIndex((c) => c.id === card.id);
            if (index > -1) {
              stack.splice(index, 1);
            }
          },
        })),
    ],
  },
  {
    id: 16,
    img: "Sabotage",
    type: COMMAND,
    domain: STATECRAFT,
    deck: STATECRAFT,
    count: 4,
    cost: 0,
    hp: null,
    attack: null,
    contextMenu: [],
    step: 0,
    stepContext: {},
    stepContextMenu: [
      ({ systems, card }) => {
        let menu = [];

        systems.forEach((system) => {
          if (shipsControlledBy(system, card.controlledBy).length) {
            shipsNotControlledBy(system, card.controlledBy).forEach(
              (c, index) => {
                menu.push({
                  label: `Destroy ${c.img} in ${system.card.img}`,
                  action: `step:${index}`,
                  stepAction: () => {
                    c.damage = 1000;
                  },
                });
              }
            );
          }
        });

        return menu;
      },
    ],
  },
  {
    id: 17,
    img: "Bribery",
    type: COMMAND,
    domain: STATECRAFT,
    deck: STATECRAFT,
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
    domain: STATECRAFT,
    deck: STATECRAFT,
    count: 2,
    cost: 0,
    hp: null,
    attack: null,
    contextMenu: [],
    onResolve: ({ nextPlayerOverride, card }) => {
      nextPlayerOverride.player = card.controlledBy;
    },
  },
  {
    id: 19,
    img: "Efficient_Construction",
    type: TECHNOLOGY,
    domain: STATECRAFT,
    deck: STATECRAFT,
    count: 3,
    cost: 0,
    hp: null,
    attack: null,
    contextMenu: [],
    buildCostModifier: ({ card, cost }) => {
      if (card.type === STATION) {
        const updatedCost = cost - 1;
        return updatedCost >= 1 ? updatedCost : 1;
      } else {
        return cost;
      }
    },
    // onResolve: ({ systems, card }) => {
    //   systems.forEach((system) => {
    //     shipsControlledBy(system, card.controlledBy).forEach((c) => {
    //       c.bonusAttack += 1;
    //       c.effects.push("Advanced_Weapons");
    //     });
    //   });
    // },
    // onEachTurnStart: ({ systems, player }) => {
    //   systems.forEach((system) => {
    //     shipsControlledBy(system, player).forEach((card) => {
    //       card.bonusAttack += 1;
    //       card.effects.push("Advanced_Weapons");
    //     });
    //   });
    // },
  },
  {
    id: 20,
    img: "Fighter_Bays",
    type: TECHNOLOGY,
    domain: STATECRAFT,
    deck: STATECRAFT,
    count: 3,
    cost: 0,
    hp: null,
    attack: null,
    contextMenu: [],
    step: 0,
    stepContextMenu: [
      ({ systems, card, getNextId, players }) => {
        return systems.map((system) => {
          return {
            action: "step:0",
            label: `Build Strike Fighter in ${system.card.img}`,
            condition: ({ card, systems, players }) => {
              return (
                system.card.controlledBy === card.controlledBy &&
                players[card.controlledBy].credits >= 1 &&
                shipCountBelowDevelopmentLevel(systems, card.controlledBy) &&
                shipsControlledBy(system, card.controlledBy).find(
                  (c) => c.type === STATION
                )
              );
            },
            stepAction: () => {
              const fighter = { ...CARD_LIST.find((c) => c.id === 32) };
              if (fighter) {
                system.vessels = [
                  ...system.vessels,
                  {
                    ...fighter,
                    id: getNextId(),
                    effects: [],
                    controlledBy: card.controlledBy,
                  },
                ];

                players[card.controlledBy].credits -= 1;
              }
            },
          };
        });
      },
    ],
    onResolve: ({ systems, card }) => {
      systems.forEach((system) => {
        shipsControlledBy(system, card.controlledBy).forEach((c) => {
          if (c.type === FIGHTER) {
            c.bonusHp += 1;
            c.effects.push("Fighter_Bays");
          }
        });
      });
    },
    onBuildOther: ({ card, systems, player }) => {
      console.log("onBuildOther");
      if (card.type === FIGHTER) {
        card.bonusHp += 1;
        card.effects.push("Fighter_Bays");
      }
    },
    onEachTurnStart: ({ systems, player }) => {
      systems.forEach((system) => {
        shipsControlledBy(system, player).forEach((card) => {
          if (card.type === FIGHTER) {
            card.bonusHp += 1;
            card.effects.push("Fighter_Bays");
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
    effects: [],
    contextMenu: [...DAMAGE_CONTEXT_MENU],
    combatContextMenu: generateCombatContextMenu,
  },
  {
    id: 22,
    img: "Jump_Drive_Detonation",
    type: COMMAND,
    domain: SCIENCE,
    deck: SCIENCE,
    count: 3,
    cost: 0,
    hp: null,
    attack: null,
    contextMenu: [],
    step: 0,
    stepContext: {},
    stepContextMenu: [
      ({ systems, card }) =>
        systems
          .filter((system) =>
            system.vessels.find((v) => v.controlledBy === card.controlledBy)
          )
          .map((system, index) => ({
            label: `Choose ${system.card.img} (${system.vessels.length} vessels)`,
            action: `step:${index}`,
            stepAction: () => {
              system.vessels.forEach((v) => {
                v.damage = 1000;
              });
            },
          })),
    ],
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
    step: 0,
    stepContext: {},
    stepContextMenu: [
      ({ systems, card }) => {
        let menu = [];

        systems.forEach((system, index) => {
          const ships = shipsControlledBy(system, card.controlledBy).filter(
            (c) => c.type !== STATION
          );
          const shipCount = ships.length;
          if (shipCount > 0) {
            menu.push({
              label: `Target ${system.card.img} (${shipCount} ships)`,
              action: `step:${index}`,
              stepAction: () => {
                ships.forEach((ship) => {
                  ship.effects.push("Jump_Stabilization");
                });
              },
            });
          }
        });

        return menu;
      },
    ],
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
    step: 0,
    stepContext: {},
    stepContextMenu: [
      ({ systems }) => {
        let menu = [];

        systems.forEach((system, index) => {
          const ships = [
            ...system.vessels.filter((card) => card.type !== STATION),
          ];
          const shipCount = ships.length;
          if (shipCount > 0) {
            menu.push({
              label: `Target ${system.card.img} (${shipCount} ships)`,
              action: `step:${index}`,
              stepAction: () => {
                ships.forEach((ship) => {
                  ship.effects.push("Interdiction");
                });
              },
            });
          }
        });

        return menu;
      },
    ],
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
    onResolve: ({ systems, card }) => {
      systems.forEach((system) => {
        shipsControlledBy(system, card.controlledBy).forEach((c) => {
          c.bonusHp += 2;
          c.effects.push("Raise_Shields");
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
    count: 4,
    cost: 0,
    hp: null,
    attack: null,
    contextMenu: [],
    step: 0,
    stepContext: {},
    stepContextMenu: [
      ({ systems, card }) => {
        let menu = [];

        systems.forEach((system, index) => {
          const ships = shipsControlledBy(system, card.controlledBy).filter(
            (c) => c.type !== STATION
          );
          ships.forEach((ship) => {
            menu.push({
              label: `Target ${ship.img} (in ${system.card.img})`,
              action: `step:${ship.id}`,
              stepAction: () => {
                ship.effects.push("Evasion");
              },
            });
          });
        });

        return menu;
      },
    ],
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
    step: 0,
    stepContext: {},
    stepContextMenu: [
      ({ systems, card }) => {
        let menu = [];

        systems.forEach((system) => {
          shipsControlledBy(system, card.controlledBy).forEach((c) => {
            menu.push({
              label: `Target ${c.img} (in ${system.card.img})`,
              action: `step:${c.id}`,
              stepAction: () => {
                c.effects.push("Experimental_Shields");
                alert("Discard a card!");
              },
            });
          });
        });
      },
    ],
  },
  {
    id: 28,
    img: "Enhanced_Jump_Drive",
    type: TECHNOLOGY,
    domain: SCIENCE,
    deck: SCIENCE,
    count: 3,
    cost: 0,
    hp: null,
    attack: null,
    contextMenu: [],
    onResolve: ({ systems, card }) => {
      systems.forEach((system) => {
        shipsControlledBy(system, card.controlledBy).forEach((c) => {
          c.effects.push("Enhanced_Jump_Drive");
        });
      });
    },
    onEachTurnStart: ({ systems, player }) => {
      systems.forEach((system) => {
        shipsControlledBy(system, player).forEach((card) => {
          card.effects.push("Enhanced_Jump_Drive");
        });
      });
    },
  },
  {
    id: 29,
    img: "Advanced_Systems",
    type: TECHNOLOGY,
    domain: SCIENCE,
    deck: SCIENCE,
    count: 4,
    cost: 0,
    hp: null,
    attack: null,
    contextMenu: [],
    onResolve: ({ systems, card }) => {
      systems.forEach((system) => {
        shipsControlledBy(system, card.controlledBy).forEach((c) => {
          c.bonusHp += 1;
          c.bonusAttack += 1;
          c.effects.push("Advanced_Systems");
        });
      });
    },
    onEachTurnStart: ({ systems, player }) => {
      systems.forEach((system) => {
        shipsControlledBy(system, player).forEach((card) => {
          card.bonusHp += 1;
          card.bonusAttack += 1;
          card.effects.push("Advanced_Systems");
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
    onTurnStart: () => alert("Thrill of Discovery: Draw an additional card."),
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
    attack: 1,
    bonusAttack: 0,
    totalAttack() {
      return this.attack + this.bonusAttack;
    },
    effects: [],
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
    cost: 1,
    hp: 1,
    bonusHp: 0,
    totalHp() {
      return this.hp + this.bonusHp;
    },
    attack: 1,
    bonusAttack: 0,
    totalAttack() {
      return this.attack + this.bonusAttack;
    },
    effects: [],
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
    cost: 3,
    hp: 2,
    bonusHp: 0,
    totalHp() {
      return this.hp + this.bonusHp;
    },
    attack: 2,
    bonusAttack: 0,
    totalAttack() {
      return this.attack + this.bonusAttack;
    },
    effects: [],
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
    cost: 5,
    hp: 3,
    bonusHp: 0,
    totalHp() {
      return this.hp + this.bonusHp;
    },
    attack: 3,
    bonusAttack: 0,
    totalAttack() {
      return this.attack + this.bonusAttack;
    },
    effects: [],
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
    cost: 7,
    hp: 5,
    bonusHp: 0,
    totalHp() {
      return this.hp + this.bonusHp;
    },
    attack: 4,
    bonusAttack: 0,
    totalAttack() {
      return this.attack + this.bonusAttack;
    },
    effects: [],
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
    cost: 9,
    hp: 7,
    bonusHp: 0,
    totalHp() {
      return this.hp + this.bonusHp;
    },
    attack: 5,
    bonusAttack: 0,
    totalAttack() {
      return this.attack + this.bonusAttack;
    },
    effects: [],
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
    cost: 12,
    hp: 10,
    bonusHp: 0,
    totalHp() {
      return this.hp + this.bonusHp;
    },
    attack: 6,
    bonusAttack: 0,
    totalAttack() {
      return this.attack + this.bonusAttack;
    },
    effects: [],
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
    cost: 10,
    hp: 8,
    bonusHp: 0,
    totalHp() {
      return this.hp + this.bonusHp;
    },
    attack: 2,
    bonusAttack: 0,
    totalAttack() {
      return this.attack + this.bonusAttack;
    },
    effects: [],
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
    cost: 3,
    hp: 4,
    bonusHp: 0,
    totalHp() {
      return this.hp + this.bonusHp;
    },
    attack: 1,
    bonusAttack: 0,
    totalAttack() {
      return this.attack + this.bonusAttack;
    },
    effects: [],
    contextMenu: [...DAMAGE_CONTEXT_MENU],
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
      alert("Research World: Draw a card.");
    },
  },
  {
    id: 43,
    img: "Core_World",
    type: SYSTEM,
    domain: STATECRAFT,
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
          system.card.developmentLevel < system.card.totalMaxDevelopmentLevel()
        );
      });

      if (validTargets.length > 0) {
        alert("Core World: Choose a system to develop.");
      }
    },
    perTurnAction: ({ card, systems, activePlayer }) => {
      let menu = [];

      if (card.controlledBy !== activePlayer || card.performedPerTurnAction) {
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
        const card = { ...CARD_LIST.find((c) => c.img === "Defense_Station") };
        if (card) {
          system.vessels = [
            ...system.vessels,
            { ...card, id: getNextId(), controlledBy: activePlayer },
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
    domain: STATECRAFT,
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
    domain: STATECRAFT,
    deck: SYSTEM,
    count: 2,
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
    domain: INDUSTRY,
    deck: SYSTEM,
    count: 2,
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
    count: 2,
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
    domain: STATECRAFT,
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
  },
  {
    id: 54,
    img: "Empty_System",
    type: SYSTEM,
    domain: null,
    deck: SYSTEM,
    count: 0,
    developmentLevel: 0,
    maxDevelopmentLevel: 1,
    bonusDevelopmentLevel: 0,
    totalMaxDevelopmentLevel() {
      return this.maxDevelopmentLevel + this.bonusDevelopmentLevel;
    },
    explored: false,
    contextMenu: [...SYSTEM_CONTEXT_MENU, ...STATION_CONTEXT_MENU],
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

export const DECK_STATECRAFT = CARD_LIST.filter(
  (card) => card.deck === STATECRAFT
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
  card.backImg = "/planet-horizontal.png";
  const list = [...deck];
  for (let i = 0; i < card.count; i++) {
    list.push({ ...card });
  }
  return list;
}, []);

export const SCOUT = CARD_LIST.find((card) => card.img === "Scout");
