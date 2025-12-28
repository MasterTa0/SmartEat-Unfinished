
export interface NutrientInfo {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  weight: number;
}

export interface Meal {
  id: string;
  timestamp: number;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  image?: string;
  foodName: string;
  nutrients: NutrientInfo;
  description?: string;
}

export interface NutritionTask {
  id: string;
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: number;
  type: 'weekly' | 'monthly';
  category: 'calories' | 'protein' | 'veg' | 'water' | 'sugar';
}

export interface UserProfile {
  name: string;
  weight: number;
  height: number;
  goal: string;
  dailyCalorieTarget: number;
}

export type AppTab = 'dashboard' | 'meals' | 'tasks' | 'profile';
