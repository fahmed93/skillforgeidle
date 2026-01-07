/**
 * Resource Definitions
 * 
 * Central registry of all game resources with their properties.
 * Resources are produced by gathering skills and consumed by production skills.
 */

import { Resource } from '../types';

export const RESOURCES: Record<string, Resource> = {
  // Woodcutting resources
  regular_wood: {
    id: 'regular_wood',
    name: 'Regular Wood',
    description: 'Basic wood from regular trees.',
    icon: '🪵',
    goldValue: 10,
  },
  oak_wood: {
    id: 'oak_wood',
    name: 'Oak Wood',
    description: 'Sturdy wood from oak trees.',
    icon: '🪵',
    goldValue: 25,
  },
  willow_wood: {
    id: 'willow_wood',
    name: 'Willow Wood',
    description: 'Flexible wood from willow trees.',
    icon: '🪵',
    goldValue: 50,
  },
  maple_wood: {
    id: 'maple_wood',
    name: 'Maple Wood',
    description: 'Quality wood from maple trees.',
    icon: '🪵',
    goldValue: 100,
  },
  yew_wood: {
    id: 'yew_wood',
    name: 'Yew Wood',
    description: 'Valuable wood from yew trees.',
    icon: '🪵',
    goldValue: 200,
  },
  magic_wood: {
    id: 'magic_wood',
    name: 'Magic Wood',
    description: 'Enchanted wood from magic trees.',
    icon: '🪵',
    goldValue: 350,
  },
  redwood: {
    id: 'redwood',
    name: 'Redwood',
    description: 'Massive logs from ancient redwood trees.',
    icon: '🪵',
    goldValue: 600,
  },
  ancient_wood: {
    id: 'ancient_wood',
    name: 'Ancient Wood',
    description: 'Legendary wood from ancient trees.',
    icon: '🪵',
    goldValue: 1000,
  },

  // Mining resources
  copper_ore: {
    id: 'copper_ore',
    name: 'Copper Ore',
    description: 'Basic ore used in bronze smelting.',
    icon: '🪨',
    goldValue: 8,
  },
  tin_ore: {
    id: 'tin_ore',
    name: 'Tin Ore',
    description: 'Basic ore used in bronze smelting.',
    icon: '🪨',
    goldValue: 8,
  },
  iron_ore: {
    id: 'iron_ore',
    name: 'Iron Ore',
    description: 'Common ore for iron and steel bars.',
    icon: '⛰️',
    goldValue: 30,
  },
  coal: {
    id: 'coal',
    name: 'Coal',
    description: 'Fuel needed for smelting high-tier bars.',
    icon: '🪨',
    goldValue: 50,
  },
  silver_ore: {
    id: 'silver_ore',
    name: 'Silver Ore',
    description: 'Precious ore used in jewelry crafting.',
    icon: '⛰️',
    goldValue: 100,
  },
  gold_ore: {
    id: 'gold_ore',
    name: 'Gold Ore',
    description: 'Valuable ore for gold bars.',
    icon: '⛰️',
    goldValue: 150,
  },
  mithril_ore: {
    id: 'mithril_ore',
    name: 'Mithril Ore',
    description: 'Strong ore for quality equipment.',
    icon: '⛰️',
    goldValue: 200,
  },
  adamantite_ore: {
    id: 'adamantite_ore',
    name: 'Adamantite Ore',
    description: 'Powerful ore for high-tier gear.',
    icon: '⛰️',
    goldValue: 300,
  },
  runite_ore: {
    id: 'runite_ore',
    name: 'Runite Ore',
    description: 'Rare ore for elite equipment.',
    icon: '💎',
    goldValue: 500,
  },
  dragon_ore: {
    id: 'dragon_ore',
    name: 'Dragon Ore',
    description: 'Legendary ore imbued with draconic power.',
    icon: '💎',
    goldValue: 1000,
  },

  // Fishing resources
  raw_shrimp: {
    id: 'raw_shrimp',
    name: 'Raw Shrimp',
    description: 'Small crustaceans caught from fishing spots.',
    icon: '🦐',
    goldValue: 5,
  },
  raw_sardines: {
    id: 'raw_sardines',
    name: 'Raw Sardines',
    description: 'Small fish from the sea.',
    icon: '🐟',
    goldValue: 10,
  },
  raw_herring: {
    id: 'raw_herring',
    name: 'Raw Herring',
    description: 'Common fish caught from fishing spots.',
    icon: '🐟',
    goldValue: 15,
  },
  raw_trout: {
    id: 'raw_trout',
    name: 'Raw Trout',
    description: 'Freshwater fish from rivers.',
    icon: '🐟',
    goldValue: 25,
  },
  raw_salmon: {
    id: 'raw_salmon',
    name: 'Raw Salmon',
    description: 'Prized fish from rivers.',
    icon: '🐟',
    goldValue: 40,
  },
  raw_tuna: {
    id: 'raw_tuna',
    name: 'Raw Tuna',
    description: 'Large ocean fish.',
    icon: '🐟',
    goldValue: 50,
  },
  raw_lobster: {
    id: 'raw_lobster',
    name: 'Raw Lobster',
    description: 'Valuable crustacean from the sea.',
    icon: '🦞',
    goldValue: 60,
  },
  raw_swordfish: {
    id: 'raw_swordfish',
    name: 'Raw Swordfish',
    description: 'Large predatory fish from deep waters.',
    icon: '🐟',
    goldValue: 75,
  },
  raw_shark: {
    id: 'raw_shark',
    name: 'Raw Shark',
    description: 'Powerful predator from the ocean.',
    icon: '🦈',
    goldValue: 100,
  },
  raw_whale: {
    id: 'raw_whale',
    name: 'Raw Whale',
    description: 'Massive creature from the deep sea.',
    icon: '🐋',
    goldValue: 150,
  },

  // Cooking products
  cooked_shrimp: {
    id: 'cooked_shrimp',
    name: 'Cooked Shrimp',
    description: 'Basic food that restores health.',
    icon: '🍤',
    goldValue: 15,
  },
  cooked_sardines: {
    id: 'cooked_sardines',
    name: 'Cooked Sardines',
    description: 'Simple meal that restores health.',
    icon: '🐟',
    goldValue: 20,
  },
  cooked_herring: {
    id: 'cooked_herring',
    name: 'Cooked Herring',
    description: 'Nutritious meal that restores health.',
    icon: '🐟',
    goldValue: 30,
  },
  cooked_trout: {
    id: 'cooked_trout',
    name: 'Cooked Trout',
    description: 'Tasty meal that restores health.',
    icon: '🐟',
    goldValue: 50,
  },
  cooked_salmon: {
    id: 'cooked_salmon',
    name: 'Cooked Salmon',
    description: 'Delicious meal that restores health.',
    icon: '🐟',
    goldValue: 80,
  },
  cooked_tuna: {
    id: 'cooked_tuna',
    name: 'Cooked Tuna',
    description: 'High-quality food that restores health.',
    icon: '🐟',
    goldValue: 100,
  },
  cooked_lobster: {
    id: 'cooked_lobster',
    name: 'Cooked Lobster',
    description: 'Premium meal that restores health.',
    icon: '🦞',
    goldValue: 120,
  },
  cooked_swordfish: {
    id: 'cooked_swordfish',
    name: 'Cooked Swordfish',
    description: 'Excellent food that restores health.',
    icon: '🐟',
    goldValue: 150,
  },
  cooked_shark: {
    id: 'cooked_shark',
    name: 'Cooked Shark',
    description: 'Superior food that restores health.',
    icon: '🦈',
    goldValue: 200,
  },

  // Smithing products
  bronze_bar: {
    id: 'bronze_bar',
    name: 'Bronze Bar',
    description: 'Basic metal bar for crafting bronze equipment.',
    icon: '🔶',
    goldValue: 25,
  },
  iron_bar: {
    id: 'iron_bar',
    name: 'Iron Bar',
    description: 'Common metal bar for iron equipment.',
    icon: '⬜',
    goldValue: 60,
  },
  steel_bar: {
    id: 'steel_bar',
    name: 'Steel Bar',
    description: 'Strong metal bar for steel equipment.',
    icon: '⬜',
    goldValue: 150,
  },
  silver_bar: {
    id: 'silver_bar',
    name: 'Silver Bar',
    description: 'Precious metal bar for jewelry.',
    icon: '⬜',
    goldValue: 180,
  },
  gold_bar: {
    id: 'gold_bar',
    name: 'Gold Bar',
    description: 'Valuable metal bar for gold equipment and jewelry.',
    icon: '🟨',
    goldValue: 250,
  },
  mithril_bar: {
    id: 'mithril_bar',
    name: 'Mithril Bar',
    description: 'High-quality metal bar for strong equipment.',
    icon: '🔷',
    goldValue: 400,
  },
  adamantite_bar: {
    id: 'adamantite_bar',
    name: 'Adamantite Bar',
    description: 'Powerful metal bar for high-tier equipment.',
    icon: '🟩',
    goldValue: 700,
  },
  runite_bar: {
    id: 'runite_bar',
    name: 'Runite Bar',
    description: 'Rare metal bar for elite equipment.',
    icon: '🔶',
    goldValue: 1200,
  },
  dragon_bar: {
    id: 'dragon_bar',
    name: 'Dragon Bar',
    description: 'Legendary metal bar infused with dragon essence.',
    icon: '🔴',
    goldValue: 2000,
  },

  // Crafting materials
  leather: {
    id: 'leather',
    name: 'Leather',
    description: 'Basic material for crafting armor.',
    icon: '🟫',
    goldValue: 20,
  },
  hard_leather: {
    id: 'hard_leather',
    name: 'Hard Leather',
    description: 'Tougher leather for better armor.',
    icon: '🟫',
    goldValue: 50,
  },
  steel_studs: {
    id: 'steel_studs',
    name: 'Steel Studs',
    description: 'Metal studs for reinforcing armor.',
    icon: '⚙️',
    goldValue: 30,
  },
  green_dragonhide: {
    id: 'green_dragonhide',
    name: 'Green Dragonhide',
    description: 'Hide from green dragons.',
    icon: '🟢',
    goldValue: 200,
  },
  blue_dragonhide: {
    id: 'blue_dragonhide',
    name: 'Blue Dragonhide',
    description: 'Hide from blue dragons.',
    icon: '🔵',
    goldValue: 300,
  },
  red_dragonhide: {
    id: 'red_dragonhide',
    name: 'Red Dragonhide',
    description: 'Hide from red dragons.',
    icon: '🔴',
    goldValue: 400,
  },
  black_dragonhide: {
    id: 'black_dragonhide',
    name: 'Black Dragonhide',
    description: 'Hide from black dragons.',
    icon: '⚫',
    goldValue: 500,
  },

  // Crafting products
  leather_gloves: {
    id: 'leather_gloves',
    name: 'Leather Gloves',
    description: 'Basic hand protection.',
    icon: '🧤',
    goldValue: 40,
  },
  leather_boots: {
    id: 'leather_boots',
    name: 'Leather Boots',
    description: 'Basic foot protection.',
    icon: '👢',
    goldValue: 45,
  },
  leather_body: {
    id: 'leather_body',
    name: 'Leather Body',
    description: 'Basic chest protection.',
    icon: '🦺',
    goldValue: 60,
  },
  hard_leather_body: {
    id: 'hard_leather_body',
    name: 'Hard Leather Body',
    description: 'Improved chest protection.',
    icon: '🦺',
    goldValue: 100,
  },
  studded_body: {
    id: 'studded_body',
    name: 'Studded Body',
    description: 'Reinforced leather armor.',
    icon: '🦺',
    goldValue: 120,
  },
  green_dhide_body: {
    id: 'green_dhide_body',
    name: 'Green Dragonhide Body',
    description: 'Armor crafted from green dragonhide.',
    icon: '🦺',
    goldValue: 650,
  },
  blue_dhide_body: {
    id: 'blue_dhide_body',
    name: 'Blue Dragonhide Body',
    description: 'Armor crafted from blue dragonhide.',
    icon: '🦺',
    goldValue: 950,
  },
  red_dhide_body: {
    id: 'red_dhide_body',
    name: 'Red Dragonhide Body',
    description: 'Armor crafted from red dragonhide.',
    icon: '🦺',
    goldValue: 1250,
  },
  black_dhide_body: {
    id: 'black_dhide_body',
    name: 'Black Dragonhide Body',
    description: 'Armor crafted from black dragonhide.',
    icon: '🦺',
    goldValue: 1600,
  },
};

/**
 * Get a resource by its ID
 * @param id - The resource ID
 * @returns The resource object or undefined if not found
 */
export const getResourceById = (id: string): Resource | undefined => {
  return RESOURCES[id];
};

/**
 * Get all resources as an array
 * @returns Array of all resource objects
 */
export const getAllResources = (): Resource[] => {
  return Object.values(RESOURCES);
};

/**
 * Get resource count (helper for display)
 * @returns Total number of unique resources
 */
export const getResourceCount = (): number => {
  return Object.keys(RESOURCES).length;
};
