import { Skill, SkillType } from '../types';
import { WOODCUTTING_SKILL, MINING_SKILL, FISHING_SKILL } from './skills-gathering';
import { COOKING_SKILL, SMITHING_SKILL, CRAFTING_SKILL } from './skills-production';

export const SKILLS_DATA: Record<SkillType, Skill> = {
  [SkillType.WOODCUTTING]: WOODCUTTING_SKILL,
  [SkillType.MINING]: MINING_SKILL,
  [SkillType.FISHING]: FISHING_SKILL,
  [SkillType.COOKING]: COOKING_SKILL,
  [SkillType.SMITHING]: SMITHING_SKILL,
  [SkillType.CRAFTING]: CRAFTING_SKILL,
};

export const getAllSkills = (): Skill[] => {
  return Object.values(SKILLS_DATA);
};

export const getSkillById = (skillType: SkillType): Skill | undefined => {
  return SKILLS_DATA[skillType];
};

export const getActivityById = (skillType: SkillType, activityId: string) => {
  const skill = getSkillById(skillType);
  return skill?.activities.find(a => a.id === activityId);
};

// Export resource functions
export { getResourceById, getAllResources, getResourceCount } from './resources';
