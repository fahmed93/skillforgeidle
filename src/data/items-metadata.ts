import type { ItemMetadata } from '../types';

/**
 * Comprehensive item metadata registry for all items in the game.
 * Includes gold values, descriptions, icons, and categories.
 * 
 * Gold value guidelines:
 * - Level 1-15: 5-20 gold
 * - Level 15-30: 15-40 gold
 * - Level 30-45: 30-80 gold
 * - Level 45-60: 60-160 gold
 * - Level 60-75: 100-250 gold
 * - Level 75+: 200-500 gold
 * - Production items: 1.5-2x raw materials
 */
export const ITEMS_METADATA: Record<string, ItemMetadata> = {
  // ===== WOODCUTTING ITEMS (8) =====
  regular_wood: {
    id: 'regular_wood',
    name: 'Regular Wood',
    description: 'Basic wood logs from regular trees. Used in crafting and construction.',
    icon: '🪵',
    goldValue: 5,
    category: 'wood',
  },
  oak_wood: {
    id: 'oak_wood',
    name: 'Oak Wood',
    description: 'Sturdy oak logs. More valuable than regular wood.',
    icon: '🌳',
    goldValue: 15,
    category: 'wood',
  },
  willow_wood: {
    id: 'willow_wood',
    name: 'Willow Wood',
    description: 'Flexible willow logs. Popular for crafting bows.',
    icon: '🌿',
    goldValue: 35,
    category: 'wood',
  },
  maple_wood: {
    id: 'maple_wood',
    name: 'Maple Wood',
    description: 'Quality maple logs. Strong and reliable.',
    icon: '🍁',
    goldValue: 65,
    category: 'wood',
  },
  yew_wood: {
    id: 'yew_wood',
    name: 'Yew Wood',
    description: 'Valuable yew logs. Excellent for high-level crafting.',
    icon: '🌲',
    goldValue: 120,
    category: 'wood',
  },
  magic_wood: {
    id: 'magic_wood',
    name: 'Magic Wood',
    description: 'Enchanted magic logs with mystical properties.',
    icon: '✨',
    goldValue: 210,
    category: 'wood',
  },
  redwood: {
    id: 'redwood',
    name: 'Redwood',
    description: 'Massive redwood logs from ancient trees.',
    icon: '🌲',
    goldValue: 350,
    category: 'wood',
  },
  ancient_wood: {
    id: 'ancient_wood',
    name: 'Ancient Wood',
    description: 'Legendary ancient logs from the oldest trees in the realm.',
    icon: '🌳',
    goldValue: 480,
    category: 'wood',
  },

  // ===== MINING ITEMS (10) =====
  copper_ore: {
    id: 'copper_ore',
    name: 'Copper Ore',
    description: 'Basic copper ore. Used to smelt bronze bars.',
    icon: '🟫',
    goldValue: 4,
    category: 'ore',
  },
  tin_ore: {
    id: 'tin_ore',
    name: 'Tin Ore',
    description: 'Basic tin ore. Combined with copper to make bronze.',
    icon: '⚪',
    goldValue: 4,
    category: 'ore',
  },
  iron_ore: {
    id: 'iron_ore',
    name: 'Iron Ore',
    description: 'Sturdy iron ore. Smelts into iron bars.',
    icon: '⚫',
    goldValue: 18,
    category: 'ore',
  },
  coal: {
    id: 'coal',
    name: 'Coal',
    description: 'Essential fuel for smelting higher-tier bars.',
    icon: '⬛',
    goldValue: 25,
    category: 'ore',
  },
  silver_ore: {
    id: 'silver_ore',
    name: 'Silver Ore',
    description: 'Precious silver ore. Valuable and craftable.',
    icon: '⚪',
    goldValue: 45,
    category: 'ore',
  },
  gold_ore: {
    id: 'gold_ore',
    name: 'Gold Ore',
    description: 'Precious gold ore. Highly valuable.',
    icon: '🟡',
    goldValue: 70,
    category: 'ore',
  },
  mithril_ore: {
    id: 'mithril_ore',
    name: 'Mithril Ore',
    description: 'Rare mithril ore with a blue-green sheen.',
    icon: '🔵',
    goldValue: 95,
    category: 'ore',
  },
  adamantite_ore: {
    id: 'adamantite_ore',
    name: 'Adamantite Ore',
    description: 'Extremely hard adamantite ore.',
    icon: '🟢',
    goldValue: 140,
    category: 'ore',
  },
  runite_ore: {
    id: 'runite_ore',
    name: 'Runite Ore',
    description: 'Legendary runite ore. The strongest metal known.',
    icon: '🔷',
    goldValue: 220,
    category: 'ore',
  },
  dragon_ore: {
    id: 'dragon_ore',
    name: 'Dragon Ore',
    description: 'Mythical dragon ore infused with draconic power.',
    icon: '🐉',
    goldValue: 380,
    category: 'ore',
  },

  // ===== FISHING ITEMS (10) =====
  raw_shrimp: {
    id: 'raw_shrimp',
    name: 'Raw Shrimp',
    description: 'Basic shrimp caught from shallow waters.',
    icon: '🦐',
    goldValue: 3,
    category: 'fish',
  },
  raw_sardines: {
    id: 'raw_sardines',
    name: 'Raw Sardines',
    description: 'Small sardines. Can be cooked for food.',
    icon: '🐟',
    goldValue: 6,
    category: 'fish',
  },
  raw_herring: {
    id: 'raw_herring',
    name: 'Raw Herring',
    description: 'Common herring fish. Popular for cooking.',
    icon: '🐟',
    goldValue: 10,
    category: 'fish',
  },
  raw_trout: {
    id: 'raw_trout',
    name: 'Raw Trout',
    description: 'Fresh trout from rivers and streams.',
    icon: '🐟',
    goldValue: 20,
    category: 'fish',
  },
  raw_salmon: {
    id: 'raw_salmon',
    name: 'Raw Salmon',
    description: 'Quality salmon. Excellent for cooking.',
    icon: '🐟',
    goldValue: 32,
    category: 'fish',
  },
  raw_tuna: {
    id: 'raw_tuna',
    name: 'Raw Tuna',
    description: 'Large tuna fish. High in protein.',
    icon: '🐟',
    goldValue: 42,
    category: 'fish',
  },
  raw_lobster: {
    id: 'raw_lobster',
    name: 'Raw Lobster',
    description: 'Delicious lobster. A delicacy when cooked.',
    icon: '🦞',
    goldValue: 55,
    category: 'fish',
  },
  raw_swordfish: {
    id: 'raw_swordfish',
    name: 'Raw Swordfish',
    description: 'Prized swordfish. Very valuable.',
    icon: '🐟',
    goldValue: 70,
    category: 'fish',
  },
  raw_shark: {
    id: 'raw_shark',
    name: 'Raw Shark',
    description: 'Fierce shark caught from deep waters.',
    icon: '🦈',
    goldValue: 120,
    category: 'fish',
  },
  raw_whale: {
    id: 'raw_whale',
    name: 'Raw Whale',
    description: 'Massive whale meat. Extremely rare catch.',
    icon: '🐋',
    goldValue: 200,
    category: 'fish',
  },

  // ===== COOKING ITEMS (9) =====
  cooked_shrimp: {
    id: 'cooked_shrimp',
    name: 'Cooked Shrimp',
    description: 'Perfectly cooked shrimp. Ready to eat.',
    icon: '🍤',
    goldValue: 7,
    category: 'food',
  },
  cooked_sardines: {
    id: 'cooked_sardines',
    name: 'Cooked Sardines',
    description: 'Grilled sardines. Tasty and nutritious.',
    icon: '🍖',
    goldValue: 13,
    category: 'food',
  },
  cooked_herring: {
    id: 'cooked_herring',
    name: 'Cooked Herring',
    description: 'Baked herring. A simple but filling meal.',
    icon: '🍖',
    goldValue: 22,
    category: 'food',
  },
  cooked_trout: {
    id: 'cooked_trout',
    name: 'Cooked Trout',
    description: 'Pan-fried trout. Delicious and healthy.',
    icon: '🍖',
    goldValue: 42,
    category: 'food',
  },
  cooked_salmon: {
    id: 'cooked_salmon',
    name: 'Cooked Salmon',
    description: 'Expertly prepared salmon. High quality food.',
    icon: '🍖',
    goldValue: 68,
    category: 'food',
  },
  cooked_tuna: {
    id: 'cooked_tuna',
    name: 'Cooked Tuna',
    description: 'Seared tuna steak. Very filling.',
    icon: '🍖',
    goldValue: 88,
    category: 'food',
  },
  cooked_lobster: {
    id: 'cooked_lobster',
    name: 'Cooked Lobster',
    description: 'Gourmet lobster dish. Fit for royalty.',
    icon: '🦞',
    goldValue: 115,
    category: 'food',
  },
  cooked_swordfish: {
    id: 'cooked_swordfish',
    name: 'Cooked Swordfish',
    description: 'Premium swordfish meal. Exceptionally delicious.',
    icon: '🍖',
    goldValue: 145,
    category: 'food',
  },
  cooked_shark: {
    id: 'cooked_shark',
    name: 'Cooked Shark',
    description: 'Legendary shark meat. The ultimate food.',
    icon: '🍖',
    goldValue: 250,
    category: 'food',
  },

  // ===== SMITHING ITEMS (9 bars) =====
  bronze_bar: {
    id: 'bronze_bar',
    name: 'Bronze Bar',
    description: 'Basic bronze bar. Made from copper and tin.',
    icon: '🟫',
    goldValue: 12,
    category: 'bar',
  },
  iron_bar: {
    id: 'iron_bar',
    name: 'Iron Bar',
    description: 'Sturdy iron bar. Versatile crafting material.',
    icon: '⚫',
    goldValue: 35,
    category: 'bar',
  },
  steel_bar: {
    id: 'steel_bar',
    name: 'Steel Bar',
    description: 'Strong steel bar. Better than iron.',
    icon: '⚪',
    goldValue: 85,
    category: 'bar',
  },
  silver_bar: {
    id: 'silver_bar',
    name: 'Silver Bar',
    description: 'Refined silver bar. Valuable and beautiful.',
    icon: '⚪',
    goldValue: 90,
    category: 'bar',
  },
  gold_bar: {
    id: 'gold_bar',
    name: 'Gold Bar',
    description: 'Pure gold bar. Extremely valuable.',
    icon: '🟡',
    goldValue: 135,
    category: 'bar',
  },
  mithril_bar: {
    id: 'mithril_bar',
    name: 'Mithril Bar',
    description: 'Rare mithril bar with magical properties.',
    icon: '🔵',
    goldValue: 210,
    category: 'bar',
  },
  adamantite_bar: {
    id: 'adamantite_bar',
    name: 'Adamantite Bar',
    description: 'Incredibly hard adamantite bar.',
    icon: '🟢',
    goldValue: 320,
    category: 'bar',
  },
  runite_bar: {
    id: 'runite_bar',
    name: 'Runite Bar',
    description: 'Legendary runite bar. The finest metal.',
    icon: '🔷',
    goldValue: 480,
    category: 'bar',
  },
  dragon_bar: {
    id: 'dragon_bar',
    name: 'Dragon Bar',
    description: 'Mythical dragon bar with immense power.',
    icon: '🐉',
    goldValue: 750,
    category: 'bar',
  },

  // ===== CRAFTING ITEMS (13) =====
  // Leather items
  leather: {
    id: 'leather',
    name: 'Leather',
    description: 'Tanned leather. Used in crafting armor.',
    icon: '🟤',
    goldValue: 8,
    category: 'crafted',
  },
  leather_gloves: {
    id: 'leather_gloves',
    name: 'Leather Gloves',
    description: 'Basic leather gloves. Provides minimal protection.',
    icon: '🧤',
    goldValue: 15,
    category: 'crafted',
  },
  leather_boots: {
    id: 'leather_boots',
    name: 'Leather Boots',
    description: 'Comfortable leather boots.',
    icon: '👢',
    goldValue: 18,
    category: 'crafted',
  },
  leather_body: {
    id: 'leather_body',
    name: 'Leather Body',
    description: 'Basic leather armor. Light and flexible.',
    icon: '👕',
    goldValue: 28,
    category: 'crafted',
  },
  hard_leather: {
    id: 'hard_leather',
    name: 'Hard Leather',
    description: 'Hardened leather. Stronger than regular leather.',
    icon: '🟤',
    goldValue: 22,
    category: 'crafted',
  },
  hard_leather_body: {
    id: 'hard_leather_body',
    name: 'Hard Leather Body',
    description: 'Reinforced leather armor. Better protection.',
    icon: '👕',
    goldValue: 45,
    category: 'crafted',
  },
  steel_studs: {
    id: 'steel_studs',
    name: 'Steel Studs',
    description: 'Metal studs used to reinforce armor.',
    icon: '⚙️',
    goldValue: 40,
    category: 'crafted',
  },
  studded_body: {
    id: 'studded_body',
    name: 'Studded Body',
    description: 'Leather armor reinforced with steel studs.',
    icon: '🦺',
    goldValue: 75,
    category: 'crafted',
  },
  // Dragonhide materials
  green_dragonhide: {
    id: 'green_dragonhide',
    name: 'Green Dragonhide',
    description: 'Hide from a green dragon. Very tough.',
    icon: '🟢',
    goldValue: 120,
    category: 'crafted',
  },
  green_dhide_body: {
    id: 'green_dhide_body',
    name: "Green D'hide Body",
    description: 'Body armor made from green dragonhide.',
    icon: '🦺',
    goldValue: 380,
    category: 'crafted',
  },
  blue_dragonhide: {
    id: 'blue_dragonhide',
    name: 'Blue Dragonhide',
    description: 'Hide from a blue dragon. Extremely durable.',
    icon: '🔵',
    goldValue: 160,
    category: 'crafted',
  },
  blue_dhide_body: {
    id: 'blue_dhide_body',
    name: "Blue D'hide Body",
    description: 'Body armor made from blue dragonhide.',
    icon: '🦺',
    goldValue: 500,
    category: 'crafted',
  },
  red_dragonhide: {
    id: 'red_dragonhide',
    name: 'Red Dragonhide',
    description: 'Hide from a red dragon. Legendary quality.',
    icon: '🔴',
    goldValue: 200,
    category: 'crafted',
  },
  red_dhide_body: {
    id: 'red_dhide_body',
    name: "Red D'hide Body",
    description: 'Body armor made from red dragonhide.',
    icon: '🦺',
    goldValue: 620,
    category: 'crafted',
  },
  black_dragonhide: {
    id: 'black_dragonhide',
    name: 'Black Dragonhide',
    description: 'Hide from a black dragon. The finest hide.',
    icon: '⚫',
    goldValue: 250,
    category: 'crafted',
  },
  black_dhide_body: {
    id: 'black_dhide_body',
    name: "Black D'hide Body",
    description: 'Body armor made from black dragonhide.',
    icon: '🦺',
    goldValue: 780,
    category: 'crafted',
  },
};

/**
 * Get metadata for a specific item by ID
 */
export function getItemMetadata(itemId: string): ItemMetadata | undefined {
  return ITEMS_METADATA[itemId];
}

/**
 * Get all item metadata as an array
 */
export function getAllItemMetadata(): ItemMetadata[] {
  return Object.values(ITEMS_METADATA);
}

/**
 * Get items filtered by category
 */
export function getItemsByCategory(category: ItemMetadata['category']): ItemMetadata[] {
  return getAllItemMetadata().filter(item => item.category === category);
}

/**
 * Get total count of items in the registry
 */
export function getItemMetadataCount(): number {
  return Object.keys(ITEMS_METADATA).length;
}
