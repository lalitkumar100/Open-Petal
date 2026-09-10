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
  skillId?: number;
  skillName: string;
  level: SkillLevel;
  rating: number;
  peopleTaught: number;
  isVerified?: boolean;
  testMarks?: number;
}

export interface LearningGoal {
  id: number;
  skillName: string;
  currentLevel: SkillLevel;
  targetLevel: SkillLevel;
  roadplan?: RoadmapData;
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

export interface RoadmapResource {
  label: string;
  url: string;
}

export interface RoadmapNode {
  id: string;
  title: string;
  desc: string;
  completed?: boolean;
  resources?: RoadmapResource[];
}

export interface RoadmapMilestone {
  id: string;
  step: string;
  title: string;
  desc: string;
  nodes: RoadmapNode[];
  checkpoint: string;
}

export interface RoadmapData {
  title: string;
  subtitle: string;
  milestones: RoadmapMilestone[];
}
