/**
 * Upgrade Definitions
 * 
 * Permanent upgrades for skills that provide time reduction or production bonuses.
 * Each skill has 6-8 upgrades available at various level requirements.
 */

import { Upgrade, SkillType, UpgradeEffectType } from '../types';

// Woodcutting upgrades (8 total)
const woodcuttingUpgrades: Upgrade[] = [
  {
    id: 'wc_regular_speed',
    name: 'Basic Axe Mastery',
    description: 'Chop regular trees 10% faster',
    icon: '🪓',
    skillType: SkillType.WOODCUTTING,
    levelRequired: 1,
    cost: [{ resourceId: 'regular_wood', quantity: 100 }],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.10,
    appliesToActivities: ['regular_tree'],
  },
  {
    id: 'wc_oak_speed',
    name: 'Oak Efficiency',
    description: 'Chop oak trees 15% faster',
    icon: '🪓',
    skillType: SkillType.WOODCUTTING,
    levelRequired: 20,
    cost: [
      { resourceId: 'oak_wood', quantity: 150 },
      { resourceId: 'regular_wood', quantity: 300 },
    ],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.15,
    appliesToActivities: ['oak_tree'],
  },
  {
    id: 'wc_willow_speed',
    name: 'Willow Swiftness',
    description: 'Chop willow trees 15% faster',
    icon: '🪓',
    skillType: SkillType.WOODCUTTING,
    levelRequired: 35,
    cost: [
      { resourceId: 'willow_wood', quantity: 200 },
      { resourceId: 'oak_wood', quantity: 150 },
    ],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.15,
    appliesToActivities: ['willow_tree'],
  },
  {
    id: 'wc_forest_bounty',
    name: 'Forest Bounty',
    description: 'Gain +1 wood from all trees',
    icon: '🌲',
    skillType: SkillType.WOODCUTTING,
    levelRequired: 40,
    cost: [
      { resourceId: 'willow_wood', quantity: 300 },
      { resourceId: 'oak_wood', quantity: 200 },
    ],
    effectType: UpgradeEffectType.PRODUCTION_INCREASE,
    effectValue: 1,
    appliesToActivities: [],
  },
  {
    id: 'wc_maple_speed',
    name: 'Maple Mastery',
    description: 'Chop maple trees 20% faster',
    icon: '🪓',
    skillType: SkillType.WOODCUTTING,
    levelRequired: 50,
    cost: [
      { resourceId: 'maple_wood', quantity: 250 },
      { resourceId: 'willow_wood', quantity: 300 },
    ],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.20,
    appliesToActivities: ['maple_tree'],
  },
  {
    id: 'wc_yew_speed',
    name: 'Yew Precision',
    description: 'Chop yew trees 20% faster',
    icon: '🪓',
    skillType: SkillType.WOODCUTTING,
    levelRequired: 65,
    cost: [
      { resourceId: 'yew_wood', quantity: 200 },
      { resourceId: 'maple_wood', quantity: 300 },
    ],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.20,
    appliesToActivities: ['yew_tree'],
  },
  {
    id: 'wc_magic_speed',
    name: 'Magic Attunement',
    description: 'Chop magic trees 25% faster',
    icon: '🪄',
    skillType: SkillType.WOODCUTTING,
    levelRequired: 80,
    cost: [
      { resourceId: 'magic_wood', quantity: 150 },
      { resourceId: 'yew_wood', quantity: 250 },
    ],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.25,
    appliesToActivities: ['magic_tree'],
  },
  {
    id: 'wc_ancient_knowledge',
    name: 'Ancient Knowledge',
    description: 'Gain +2 wood from high-level trees (level 60+)',
    icon: '📜',
    skillType: SkillType.WOODCUTTING,
    levelRequired: 95,
    cost: [
      { resourceId: 'ancient_wood', quantity: 100 },
      { resourceId: 'magic_wood', quantity: 200 },
    ],
    effectType: UpgradeEffectType.PRODUCTION_INCREASE,
    effectValue: 2,
    appliesToActivities: ['yew_tree', 'magic_tree', 'redwood_tree', 'ancient_tree'],
  },
];

// Mining upgrades (8 total)
const miningUpgrades: Upgrade[] = [
  {
    id: 'mn_basic_pickaxe',
    name: 'Basic Pickaxe Technique',
    description: 'Mine copper and tin 10% faster',
    icon: '⛏️',
    skillType: SkillType.MINING,
    levelRequired: 1,
    cost: [
      { resourceId: 'copper_ore', quantity: 150 },
      { resourceId: 'tin_ore', quantity: 150 },
    ],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.10,
    appliesToActivities: ['copper_ore', 'tin_ore'],
  },
  {
    id: 'mn_iron_focus',
    name: 'Iron Focus',
    description: 'Mine iron ore 15% faster',
    icon: '⛏️',
    skillType: SkillType.MINING,
    levelRequired: 20,
    cost: [
      { resourceId: 'iron_ore', quantity: 200 },
      { resourceId: 'coal', quantity: 100 },
    ],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.15,
    appliesToActivities: ['iron_ore'],
  },
  {
    id: 'mn_coal_abundance',
    name: 'Coal Abundance',
    description: 'Gain +1 coal per mining action',
    icon: '🪨',
    skillType: SkillType.MINING,
    levelRequired: 35,
    cost: [
      { resourceId: 'coal', quantity: 300 },
      { resourceId: 'iron_ore', quantity: 200 },
    ],
    effectType: UpgradeEffectType.PRODUCTION_INCREASE,
    effectValue: 1,
    appliesToActivities: ['coal'],
  },
  {
    id: 'mn_precious_metal',
    name: 'Precious Metal Finder',
    description: 'Mine silver and gold 15% faster',
    icon: '⛏️',
    skillType: SkillType.MINING,
    levelRequired: 45,
    cost: [
      { resourceId: 'silver_ore', quantity: 150 },
      { resourceId: 'gold_ore', quantity: 150 },
    ],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.15,
    appliesToActivities: ['silver_ore', 'gold_ore'],
  },
  {
    id: 'mn_mithril_mastery',
    name: 'Mithril Mastery',
    description: 'Mine mithril ore 20% faster',
    icon: '⛏️',
    skillType: SkillType.MINING,
    levelRequired: 60,
    cost: [
      { resourceId: 'mithril_ore', quantity: 200 },
      { resourceId: 'coal', quantity: 300 },
    ],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.20,
    appliesToActivities: ['mithril_ore'],
  },
  {
    id: 'mn_adamantite_excellence',
    name: 'Adamantite Excellence',
    description: 'Mine adamantite ore 20% faster',
    icon: '⛏️',
    skillType: SkillType.MINING,
    levelRequired: 75,
    cost: [
      { resourceId: 'adamantite_ore', quantity: 150 },
      { resourceId: 'mithril_ore', quantity: 250 },
    ],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.20,
    appliesToActivities: ['adamantite_ore'],
  },
  {
    id: 'mn_runite_discovery',
    name: 'Runite Discovery',
    description: 'Mine runite ore 25% faster',
    icon: '💎',
    skillType: SkillType.MINING,
    levelRequired: 88,
    cost: [
      { resourceId: 'runite_ore', quantity: 100 },
      { resourceId: 'adamantite_ore', quantity: 200 },
    ],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.25,
    appliesToActivities: ['runite_ore'],
  },
  {
    id: 'mn_master_miner',
    name: 'Master Miner',
    description: 'Gain +1 ore from all rocks',
    icon: '⚒️',
    skillType: SkillType.MINING,
    levelRequired: 92,
    cost: [
      { resourceId: 'runite_ore', quantity: 150 },
      { resourceId: 'adamantite_ore', quantity: 300 },
    ],
    effectType: UpgradeEffectType.PRODUCTION_INCREASE,
    effectValue: 1,
    appliesToActivities: [],
  },
];

// Fishing upgrades (7 total)
const fishingUpgrades: Upgrade[] = [
  {
    id: 'fs_shrimp_efficiency',
    name: 'Shrimp Net Efficiency',
    description: 'Catch shrimp 10% faster',
    icon: '🎣',
    skillType: SkillType.FISHING,
    levelRequired: 1,
    cost: [{ resourceId: 'raw_shrimp', quantity: 150 }],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.10,
    appliesToActivities: ['shrimp'],
  },
  {
    id: 'fs_coastal_expertise',
    name: 'Coastal Expertise',
    description: 'Catch sardines and herring 15% faster',
    icon: '🎣',
    skillType: SkillType.FISHING,
    levelRequired: 15,
    cost: [
      { resourceId: 'raw_sardine', quantity: 200 },
      { resourceId: 'raw_herring', quantity: 150 },
    ],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.15,
    appliesToActivities: ['sardine', 'herring'],
  },
  {
    id: 'fs_river_mastery',
    name: 'River Mastery',
    description: 'Catch trout and salmon 15% faster',
    icon: '🎣',
    skillType: SkillType.FISHING,
    levelRequired: 25,
    cost: [
      { resourceId: 'raw_trout', quantity: 200 },
      { resourceId: 'raw_salmon', quantity: 200 },
    ],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.15,
    appliesToActivities: ['trout', 'salmon'],
  },
  {
    id: 'fs_deep_sea_knowledge',
    name: 'Deep Sea Knowledge',
    description: 'Catch lobsters 20% faster',
    icon: '🎣',
    skillType: SkillType.FISHING,
    levelRequired: 45,
    cost: [
      { resourceId: 'raw_lobster', quantity: 250 },
      { resourceId: 'raw_salmon', quantity: 300 },
    ],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.20,
    appliesToActivities: ['lobster'],
  },
  {
    id: 'fs_swordfish_hunter',
    name: 'Swordfish Hunter',
    description: 'Catch swordfish 20% faster',
    icon: '🗡️',
    skillType: SkillType.FISHING,
    levelRequired: 60,
    cost: [
      { resourceId: 'raw_swordfish', quantity: 200 },
      { resourceId: 'raw_lobster', quantity: 250 },
    ],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.20,
    appliesToActivities: ['swordfish'],
  },
  {
    id: 'fs_shark_tamer',
    name: 'Shark Tamer',
    description: 'Catch sharks 25% faster',
    icon: '🦈',
    skillType: SkillType.FISHING,
    levelRequired: 80,
    cost: [
      { resourceId: 'raw_shark', quantity: 150 },
      { resourceId: 'raw_swordfish', quantity: 250 },
    ],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.25,
    appliesToActivities: ['shark'],
  },
  {
    id: 'fs_bountiful_waters',
    name: 'Bountiful Waters',
    description: 'Gain +1 fish from all fishing spots',
    icon: '🌊',
    skillType: SkillType.FISHING,
    levelRequired: 85,
    cost: [
      { resourceId: 'raw_shark', quantity: 200 },
      { resourceId: 'raw_swordfish', quantity: 300 },
    ],
    effectType: UpgradeEffectType.PRODUCTION_INCREASE,
    effectValue: 1,
    appliesToActivities: [],
  },
];

// Cooking upgrades (6 total)
const cookingUpgrades: Upgrade[] = [
  {
    id: 'ck_fire_control',
    name: 'Fire Control',
    description: 'Cook all fish 10% faster',
    icon: '🔥',
    skillType: SkillType.COOKING,
    levelRequired: 1,
    cost: [
      { resourceId: 'cooked_shrimp', quantity: 100 },
      { resourceId: 'regular_wood', quantity: 100 },
    ],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.10,
    appliesToActivities: [],
  },
  {
    id: 'ck_seasoned_chef',
    name: 'Seasoned Chef',
    description: 'Cook all fish 15% faster',
    icon: '👨‍🍳',
    skillType: SkillType.COOKING,
    levelRequired: 25,
    cost: [
      { resourceId: 'cooked_trout', quantity: 200 },
      { resourceId: 'oak_wood', quantity: 150 },
    ],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.15,
    appliesToActivities: [],
  },
  {
    id: 'ck_master_chef',
    name: 'Master Chef',
    description: 'Cook all fish 20% faster',
    icon: '⭐',
    skillType: SkillType.COOKING,
    levelRequired: 50,
    cost: [
      { resourceId: 'cooked_lobster', quantity: 250 },
      { resourceId: 'willow_wood', quantity: 200 },
    ],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.20,
    appliesToActivities: [],
  },
  {
    id: 'ck_bulk_cooking_1',
    name: 'Bulk Cooking I',
    description: 'Cook +1 fish per action (basic fish)',
    icon: '📦',
    skillType: SkillType.COOKING,
    levelRequired: 35,
    cost: [
      { resourceId: 'cooked_herring', quantity: 200 },
      { resourceId: 'coal', quantity: 150 },
    ],
    effectType: UpgradeEffectType.PRODUCTION_INCREASE,
    effectValue: 1,
    appliesToActivities: ['cook_shrimp', 'cook_sardine', 'cook_herring', 'cook_trout', 'cook_salmon'],
  },
  {
    id: 'ck_bulk_cooking_2',
    name: 'Bulk Cooking II',
    description: 'Cook +1 fish per action (advanced fish)',
    icon: '📦',
    skillType: SkillType.COOKING,
    levelRequired: 65,
    cost: [
      { resourceId: 'cooked_swordfish', quantity: 200 },
      { resourceId: 'maple_wood', quantity: 200 },
    ],
    effectType: UpgradeEffectType.PRODUCTION_INCREASE,
    effectValue: 1,
    appliesToActivities: ['cook_lobster', 'cook_swordfish', 'cook_shark'],
  },
  {
    id: 'ck_perfect_technique',
    name: 'Perfect Technique',
    description: 'Cook all fish 25% faster',
    icon: '💯',
    skillType: SkillType.COOKING,
    levelRequired: 90,
    cost: [
      { resourceId: 'cooked_shark', quantity: 250 },
      { resourceId: 'magic_wood', quantity: 200 },
    ],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.25,
    appliesToActivities: [],
  },
];

// Smithing upgrades (8 total)
const smithingUpgrades: Upgrade[] = [
  {
    id: 'sm_bronze_efficiency',
    name: 'Bronze Efficiency',
    description: 'Smelt bronze bars 10% faster',
    icon: '🔨',
    skillType: SkillType.SMITHING,
    levelRequired: 1,
    cost: [
      { resourceId: 'bronze_bar', quantity: 150 },
      { resourceId: 'coal', quantity: 100 },
    ],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.10,
    appliesToActivities: ['bronze_bar'],
  },
  {
    id: 'sm_iron_mastery',
    name: 'Iron Mastery',
    description: 'Smelt iron bars 15% faster',
    icon: '🔨',
    skillType: SkillType.SMITHING,
    levelRequired: 18,
    cost: [
      { resourceId: 'iron_bar', quantity: 200 },
      { resourceId: 'coal', quantity: 150 },
    ],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.15,
    appliesToActivities: ['iron_bar'],
  },
  {
    id: 'sm_steel_production',
    name: 'Steel Production',
    description: 'Smelt steel bars 15% faster',
    icon: '🔨',
    skillType: SkillType.SMITHING,
    levelRequired: 35,
    cost: [
      { resourceId: 'steel_bar', quantity: 200 },
      { resourceId: 'coal', quantity: 200 },
    ],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.15,
    appliesToActivities: ['steel_bar'],
  },
  {
    id: 'sm_gold_standard',
    name: 'Gold Standard',
    description: 'Smelt gold bars 20% faster',
    icon: '🥇',
    skillType: SkillType.SMITHING,
    levelRequired: 45,
    cost: [{ resourceId: 'gold_bar', quantity: 150 }],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.20,
    appliesToActivities: ['gold_bar'],
  },
  {
    id: 'sm_mithril_forge',
    name: 'Mithril Forge',
    description: 'Smelt mithril bars 20% faster',
    icon: '🔨',
    skillType: SkillType.SMITHING,
    levelRequired: 58,
    cost: [
      { resourceId: 'mithril_bar', quantity: 200 },
      { resourceId: 'coal', quantity: 300 },
    ],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.20,
    appliesToActivities: ['mithril_bar'],
  },
  {
    id: 'sm_adamantite_smithing',
    name: 'Adamantite Smithing',
    description: 'Smelt adamantite bars 20% faster',
    icon: '🔨',
    skillType: SkillType.SMITHING,
    levelRequired: 73,
    cost: [
      { resourceId: 'adamantite_bar', quantity: 150 },
      { resourceId: 'mithril_bar', quantity: 250 },
    ],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.20,
    appliesToActivities: ['adamantite_bar'],
  },
  {
    id: 'sm_runite_forging',
    name: 'Runite Forging',
    description: 'Smelt runite bars 25% faster',
    icon: '💎',
    skillType: SkillType.SMITHING,
    levelRequired: 88,
    cost: [
      { resourceId: 'runite_bar', quantity: 100 },
      { resourceId: 'adamantite_bar', quantity: 200 },
    ],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.25,
    appliesToActivities: ['runite_bar'],
  },
  {
    id: 'sm_efficient_smelting',
    name: 'Efficient Smelting',
    description: 'Smelt +1 bar for all metals',
    icon: '⚒️',
    skillType: SkillType.SMITHING,
    levelRequired: 92,
    cost: [
      { resourceId: 'runite_bar', quantity: 150 },
      { resourceId: 'coal', quantity: 400 },
    ],
    effectType: UpgradeEffectType.PRODUCTION_INCREASE,
    effectValue: 1,
    appliesToActivities: [],
  },
];

// Crafting upgrades (7 total)
const craftingUpgrades: Upgrade[] = [
  {
    id: 'cf_basic_craftsmanship',
    name: 'Basic Craftsmanship',
    description: 'Craft basic items 10% faster',
    icon: '✂️',
    skillType: SkillType.CRAFTING,
    levelRequired: 1,
    cost: [
      { resourceId: 'bronze_bar', quantity: 100 },
      { resourceId: 'regular_wood', quantity: 100 },
    ],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.10,
    appliesToActivities: [],
  },
  {
    id: 'cf_leather_working',
    name: 'Leather Working',
    description: 'Craft leather items 15% faster',
    icon: '🧵',
    skillType: SkillType.CRAFTING,
    levelRequired: 20,
    cost: [
      { resourceId: 'oak_wood', quantity: 200 },
      { resourceId: 'iron_bar', quantity: 150 },
    ],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.15,
    appliesToActivities: [],
  },
  {
    id: 'cf_jewelry_precision',
    name: 'Jewelry Precision',
    description: 'Craft jewelry 15% faster',
    icon: '💍',
    skillType: SkillType.CRAFTING,
    levelRequired: 40,
    cost: [
      { resourceId: 'gold_bar', quantity: 100 },
      { resourceId: 'silver_ore', quantity: 100 },
    ],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.15,
    appliesToActivities: [],
  },
  {
    id: 'cf_gem_cutting',
    name: 'Gem Cutting',
    description: 'Cut gems 20% faster',
    icon: '💎',
    skillType: SkillType.CRAFTING,
    levelRequired: 50,
    cost: [
      { resourceId: 'gold_bar', quantity: 200 },
      { resourceId: 'mithril_bar', quantity: 150 },
    ],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.20,
    appliesToActivities: [],
  },
  {
    id: 'cf_advanced_crafting',
    name: 'Advanced Crafting',
    description: 'Craft advanced items 20% faster',
    icon: '🎨',
    skillType: SkillType.CRAFTING,
    levelRequired: 65,
    cost: [
      { resourceId: 'adamantite_bar', quantity: 200 },
      { resourceId: 'yew_wood', quantity: 200 },
    ],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.20,
    appliesToActivities: [],
  },
  {
    id: 'cf_mass_production',
    name: 'Mass Production',
    description: 'Craft +1 item for all crafting activities',
    icon: '📦',
    skillType: SkillType.CRAFTING,
    levelRequired: 75,
    cost: [
      { resourceId: 'runite_bar', quantity: 150 },
      { resourceId: 'magic_wood', quantity: 200 },
    ],
    effectType: UpgradeEffectType.PRODUCTION_INCREASE,
    effectValue: 1,
    appliesToActivities: [],
  },
  {
    id: 'cf_master_artisan',
    name: 'Master Artisan',
    description: 'Craft all items 25% faster',
    icon: '⭐',
    skillType: SkillType.CRAFTING,
    levelRequired: 92,
    cost: [
      { resourceId: 'runite_bar', quantity: 200 },
      { resourceId: 'ancient_wood', quantity: 200 },
    ],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.25,
    appliesToActivities: [],
  },
];

// Combine all upgrades
export const ALL_UPGRADES: Upgrade[] = [
  ...woodcuttingUpgrades,
  ...miningUpgrades,
  ...fishingUpgrades,
  ...cookingUpgrades,
  ...smithingUpgrades,
  ...craftingUpgrades,
];

/**
 * Get an upgrade by its ID
 */
export const getUpgradeById = (id: string): Upgrade | undefined => {
  return ALL_UPGRADES.find(upgrade => upgrade.id === id);
};

/**
 * Get all upgrades for a specific skill
 */
export const getUpgradesBySkill = (skillType: SkillType): Upgrade[] => {
  return ALL_UPGRADES.filter(upgrade => upgrade.skillType === skillType);
};

/**
 * Get all upgrades that apply to a specific activity
 */
export const getUpgradesForActivity = (
  skillType: SkillType,
  activityId: string
): Upgrade[] => {
  return ALL_UPGRADES.filter(
    upgrade =>
      upgrade.skillType === skillType &&
      (upgrade.appliesToActivities.length === 0 ||
        upgrade.appliesToActivities.includes(activityId))
  );
};
