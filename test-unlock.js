const { useGameStore } = require('./src/store/gameStore');
const { SkillType } = require('./src/types');

// Initialize store
const store = useGameStore.getState();
store.initializeNewGame();

console.log('Initial WC activities:', store.gameState.skills[SkillType.WOODCUTTING].unlockedActivities.length);

store.addExperience(SkillType.WOODCUTTING, 2400);

console.log('After adding 2400 XP:');
console.log('  Level:', store.getSkillLevel(SkillType.WOODCUTTING));
console.log('  Activities:', store.gameState.skills[SkillType.WOODCUTTING].unlockedActivities.length);
console.log('  List:', store.gameState.skills[SkillType.WOODCUTTING].unlockedActivities);
