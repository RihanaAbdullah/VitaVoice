import { northIndianBreakfast } from './expandedMeals';
import { southIndianBreakfast, eastIndianBreakfast, westIndianBreakfast } from './otherBreakfasts';
import { northIndianLunch, southIndianLunch } from './lunchMeals';
import { eastIndianLunch, westIndianLunch } from './otherLunchMeals';
import { northIndianDinner, southIndianDinner } from './dinnerMeals';
import { eastIndianDinner, westIndianDinner } from './otherDinnerMeals';
import { snackMeals } from './snackMeals';

export interface MealTemplate {
    id: string;
    name: string;
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    cuisine: string;
    dietType: 'vegetarian' | 'non-vegetarian' | 'vegan';
    baseCalories: number;
    ingredients: string[];
    macros: {
        carbs: number;
        protein: number;
        fat: number;
        fiber: number;
    };
    healthTags: string[];
    allergens: string[];
    glycemicIndex: 'low' | 'medium' | 'high';
    preparationTime: number;
    scalable: boolean;
}

// Combine all regional meals
export const mealDatabase: MealTemplate[] = [
    // Breakfasts
    ...northIndianBreakfast,
    ...southIndianBreakfast,
    ...eastIndianBreakfast,
    ...westIndianBreakfast,

    // Lunches
    ...northIndianLunch,
    ...southIndianLunch,
    ...eastIndianLunch,
    ...westIndianLunch,

    // Dinners
    ...northIndianDinner,
    ...southIndianDinner,
    ...eastIndianDinner,
    ...westIndianDinner,

    // Snacks
    ...snackMeals
];
