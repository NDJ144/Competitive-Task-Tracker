export interface User {
  id: string;
  email: string;
  level: number;
  experience: number;
  dailyTasks: Task[];
  lastTaskReset: string;
}

export interface UserProfile extends User {
  username?: string;
  isAdmin?: boolean;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  experiencePoints: number;
}

export const EXPERIENCE_PER_LEVEL = 100; // Experience points needed per level
export const DAILY_TASK_EXP = 25; // Experience points per task
