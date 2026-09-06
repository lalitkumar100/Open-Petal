export enum SkillLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT'
}

export enum TeachingMode {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE'
}

export interface SystemSkill {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface UserSkill {
  id: number;
  skillName: string;
  level: SkillLevel;
  rating: number;
  peopleTaught: number;
}

export interface LearningGoal {
  id: number;
  skillName: string;
  currentLevel: SkillLevel;
  targetLevel: SkillLevel;
}

export interface AddUserSkillRequest {
  skillId: number;
  skillLevel: SkillLevel;
  experienceYears: number;
  teachingMode: TeachingMode;
  creditsPerSession: number;
}

export interface AddLearningGoalRequest {
  skillId: number;
  currentLevel: SkillLevel;
  targetLevel: SkillLevel;
}
