import { FamilyMember, MealSuggestion } from '../context/AppContext';
import { MealTemplate, mealDatabase } from '../data/mealDatabase';

interface GenerateMealOptions {
    calorieTarget: number;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    userProfile: FamilyMember;
    excludedMealIds?: string[];
    count?: number;
}

export class MealEngine {
    /**
     * Generate meal suggestions based on user profile and calorie target
     */
    static generateMealSuggestions(options: GenerateMealOptions): MealSuggestion[] {
        const { calorieTarget, mealType, userProfile, excludedMealIds = [], count = 3 } = options;

        // Filter meals by type
        let availableMeals = mealDatabase.filter(meal => meal.type === mealType);

        // Filter by dietary preference
        if (userProfile.dietaryPreference) {
            availableMeals = this.filterByDietaryPreference(availableMeals, userProfile.dietaryPreference);
        }

        // Filter by cuisine preference
        if (userProfile.cuisinePreference && userProfile.cuisinePreference !== 'all-indian') {
            availableMeals = availableMeals.filter(meal =>
                meal.cuisine.toLowerCase().includes(userProfile.cuisinePreference!.replace('-indian', ''))
            );
        }

        // Exclude allergens
        if (userProfile.foodAllergies && userProfile.foodAllergies.length > 0) {
            availableMeals = this.excludeAllergens(availableMeals, userProfile.foodAllergies);
        }

        // Filter by health conditions
        if (userProfile.healthConditions && userProfile.healthConditions.length > 0) {
            availableMeals = this.filterByHealthConditions(availableMeals, userProfile.healthConditions);
        }

        // Exclude previously shown meals
        availableMeals = availableMeals.filter(meal => !excludedMealIds.includes(meal.id));

        // Score and sort meals by how well they match the calorie target
        const scoredMeals = availableMeals.map(meal => ({
            meal,
            score: this.calculateMealScore(meal, calorieTarget, userProfile)
        }));

        scoredMeals.sort((a, b) => b.score - a.score);

        // Take top N meals
        const selectedMeals = scoredMeals.slice(0, count).map(({ meal }) => meal);

        // Convert to MealSuggestions with scaled calories
        return selectedMeals.map(meal => this.createMealSuggestion(meal, calorieTarget, userProfile));
    }

    /**
     * Filter meals by dietary preference
     */
    private static filterByDietaryPreference(
        meals: MealTemplate[],
        preference: 'vegetarian' | 'non-vegetarian' | 'vegan'
    ): MealTemplate[] {
        if (preference === 'vegan') {
            return meals.filter(meal => meal.dietType === 'vegan');
        } else if (preference === 'vegetarian') {
            return meals.filter(meal => meal.dietType === 'vegetarian' || meal.dietType === 'vegan');
        }
        return meals; // non-vegetarian can have all types
    }

    /**
     * Exclude meals containing allergens
     */
    private static excludeAllergens(meals: MealTemplate[], allergens: string[]): MealTemplate[] {
        return meals.filter(meal => {
            const mealAllergens = meal.allergens.map(a => a.toLowerCase());
            const userAllergens = allergens.map(a => a.toLowerCase());
            return !mealAllergens.some(allergen => userAllergens.includes(allergen));
        });
    }

    /**
     * Filter meals based on health conditions
     */
    private static filterByHealthConditions(
        meals: MealTemplate[],
        conditions: { name: string; severity: string }[]
    ): MealTemplate[] {
        const conditionNames = conditions.map(c => c.name.toLowerCase());

        return meals.filter(meal => {
            // Diabetes - prefer low glycemic index and low sugar
            if (conditionNames.includes('diabetes')) {
                if (meal.glycemicIndex === 'high' || !meal.healthTags.includes('low-sugar')) {
                    return meal.glycemicIndex === 'low'; // Only allow low GI for diabetes
                }
            }

            // Hypertension - prefer low sodium
            if (conditionNames.includes('hypertension') || conditionNames.includes('high blood pressure')) {
                // Exclude meals without low-sodium tag if available
                const hasLowSodiumOptions = meals.some(m => m.healthTags.includes('low-sodium'));
                if (hasLowSodiumOptions && !meal.healthTags.includes('low-sodium')) {
                    return false;
                }
            }

            // Digestive issues - prefer easy to digest
            if (conditionNames.includes('digestive') || conditionNames.includes('ibs') || conditionNames.includes('acidity')) {
                if (!meal.healthTags.includes('easy-digest') && !meal.healthTags.includes('light')) {
                    return false;
                }
            }

            return true;
        });
    }

    /**
     * Calculate how well a meal matches the requirements
     */
    private static calculateMealScore(
        meal: MealTemplate,
        calorieTarget: number,
        userProfile: FamilyMember
    ): number {
        let score = 100;

        // Calorie proximity (most important factor)
        const calorieDiff = Math.abs(meal.baseCalories - calorieTarget);
        const calorieScore = Math.max(0, 100 - (calorieDiff / calorieTarget) * 100);
        score += calorieScore * 2; // Weight this heavily

        // Health condition bonuses
        if (userProfile.healthConditions) {
            const conditionNames = userProfile.healthConditions.map(c => c.name.toLowerCase());

            if (conditionNames.includes('anemia') && meal.healthTags.includes('iron-rich')) {
                score += 30;
            }

            if (conditionNames.includes('diabetes') && meal.glycemicIndex === 'low') {
                score += 30;
            }

            if ((conditionNames.includes('hypertension') || conditionNames.includes('high blood pressure'))
                && meal.healthTags.includes('low-sodium')) {
                score += 30;
            }

            if (conditionNames.includes('heart') && meal.healthTags.includes('heart-healthy')) {
                score += 25;
            }
        }

        // Nutritional balance bonus
        if (this.isNutritionallyBalanced(meal)) {
            score += 20;
        }

        // Fiber bonus (generally healthy)
        if (meal.macros.fiber >= 6) {
            score += 15;
        }

        return score;
    }

    /**
     * Check if meal is nutritionally balanced
     */
    private static isNutritionallyBalanced(meal: MealTemplate): boolean {
        const total = meal.macros.carbs + meal.macros.protein + meal.macros.fat;
        const carbPercent = (meal.macros.carbs / total) * 100;
        const proteinPercent = (meal.macros.protein / total) * 100;
        const fatPercent = (meal.macros.fat / total) * 100;

        // Balanced meal: 45-65% carbs, 15-30% protein, 20-35% fat
        return (
            carbPercent >= 40 && carbPercent <= 70 &&
            proteinPercent >= 10 && proteinPercent <= 35 &&
            fatPercent >= 15 && fatPercent <= 40
        );
    }

    /**
     * Create a MealSuggestion from a MealTemplate
     */
    private static createMealSuggestion(
        template: MealTemplate,
        targetCalories: number,
        userProfile: FamilyMember
    ): MealSuggestion {
        // Scale ingredients if meal is scalable and calories differ significantly
        const scaleFactor = template.scalable ? targetCalories / template.baseCalories : 1;
        const adjustedCalories = Math.round(template.baseCalories * scaleFactor);

        // Generate health note
        const healthNote = this.generateHealthNote(template, userProfile);

        return {
            id: `${template.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: template.name,
            type: template.type,
            cuisine: template.cuisine,
            dietType: template.dietType,
            calories: adjustedCalories,
            ingredients: template.ingredients.map(ing => {
                if (template.scalable && scaleFactor !== 1) {
                    // Scale quantities in ingredients (simple approach)
                    return ing.replace(/(\d+(?:\.\d+)?)/g, (match) => {
                        const num = parseFloat(match);
                        return (num * scaleFactor).toFixed(1);
                    });
                }
                return ing;
            }),
            macros: {
                carbs: Math.round(template.macros.carbs * scaleFactor),
                protein: Math.round(template.macros.protein * scaleFactor),
                fat: Math.round(template.macros.fat * scaleFactor),
                fiber: Math.round(template.macros.fiber * scaleFactor)
            },
            healthNote,
            preparationTime: template.preparationTime
        };
    }

    /**
     * Generate personalized health note for the meal
     */
    private static generateHealthNote(template: MealTemplate, userProfile: FamilyMember): string {
        const notes: string[] = [];

        if (!userProfile.healthConditions || userProfile.healthConditions.length === 0) {
            return 'Nutritionally balanced meal suitable for general health';
        }

        const conditionNames = userProfile.healthConditions.map(c => c.name.toLowerCase());

        if (conditionNames.includes('diabetes')) {
            if (template.glycemicIndex === 'low') {
                notes.push('Low glycemic index - helps manage blood sugar');
            }
            if (template.healthTags.includes('low-sugar')) {
                notes.push('Low sugar content');
            }
        }

        if (conditionNames.includes('hypertension') || conditionNames.includes('high blood pressure')) {
            if (template.healthTags.includes('low-sodium')) {
                notes.push('Low sodium - good for blood pressure management');
            }
        }

        if (conditionNames.includes('anemia')) {
            if (template.healthTags.includes('iron-rich')) {
                notes.push('Rich in iron - helps with anemia');
            }
        }

        if (conditionNames.includes('heart') || conditionNames.includes('cholesterol')) {
            if (template.healthTags.includes('heart-healthy')) {
                notes.push('Heart-healthy option');
            }
            if (template.healthTags.includes('low-fat')) {
                notes.push('Low in saturated fats');
            }
        }

        if (conditionNames.includes('digestive') || conditionNames.includes('ibs') || conditionNames.includes('acidity')) {
            if (template.healthTags.includes('easy-digest')) {
                notes.push('Easy to digest');
            }
        }

        if (template.healthTags.includes('high-fiber')) {
            notes.push('High fiber content');
        }

        if (template.healthTags.includes('high-protein')) {
            notes.push('Good protein source');
        }

        return notes.length > 0
            ? notes.join(' • ')
            : 'Balanced meal suitable for your health profile';
    }

    /**
     * Distribute daily calories across meals
     */
    static distributeCalories(totalCalories: number): {
        breakfast: number;
        lunch: number;
        dinner: number;
        snacks: number;
    } {
        return {
            breakfast: Math.round(totalCalories * 0.25), // 25%
            lunch: Math.round(totalCalories * 0.35),     // 35%
            dinner: Math.round(totalCalories * 0.30),    // 30%
            snacks: Math.round(totalCalories * 0.10)     // 10%
        };
    }

    /**
     * Validate calorie input for safety (for daily total)
     */
    static validateCalories(calories: number, age: number, gender: string): {
        isValid: boolean;
        message?: string;
        suggestedRange: { min: number; max: number };
    } {
        // Basic calorie ranges by age and gender
        let minCalories = 1200;
        let maxCalories = 3000;

        if (gender.toLowerCase() === 'female') {
            minCalories = age < 30 ? 1800 : age < 50 ? 1600 : 1400;
            maxCalories = age < 30 ? 2400 : age < 50 ? 2200 : 2000;
        } else {
            minCalories = age < 30 ? 2200 : age < 50 ? 2000 : 1800;
            maxCalories = age < 30 ? 3000 : age < 50 ? 2800 : 2400;
        }

        // Only block extremely unsafe values
        if (calories < 800) {
            return {
                isValid: false,
                message: 'Daily calorie intake too low - this may be unsafe. Please enter at least 800 calories.',
                suggestedRange: { min: minCalories, max: maxCalories }
            };
        }

        if (calories > 4000) {
            return {
                isValid: false,
                message: 'Daily calorie intake very high - please consult a nutritionist for such high calorie needs.',
                suggestedRange: { min: minCalories, max: maxCalories }
            };
        }

        // For values within safe range but outside recommended, just proceed without error
        return {
            isValid: true,
            suggestedRange: { min: minCalories, max: maxCalories }
        };
    }

    /**
     * Validate calorie input for individual meals
     */
    static validateMealCalories(
        calories: number,
        mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
    ): {
        isValid: boolean;
        message?: string;
        suggestedRange: { min: number; max: number };
    } {
        // Proper calorie ranges based on nutritional guidelines
        const ranges = {
            breakfast: { min: 250, max: 600, recommended: '300-500' },
            lunch: { min: 400, max: 800, recommended: '500-700' },
            dinner: { min: 400, max: 800, recommended: '500-700' },
            snack: { min: 50, max: 300, recommended: '100-200' }
        };

        const range = ranges[mealType];

        if (calories < range.min) {
            return {
                isValid: false,
                message: `Too low for ${mealType}. Minimum ${range.min} calories recommended.`,
                suggestedRange: { min: parseInt(range.recommended.split('-')[0]), max: parseInt(range.recommended.split('-')[1]) }
            };
        }

        if (calories > range.max) {
            return {
                isValid: false,
                message: `Too high for ${mealType}. Maximum ${range.max} calories recommended.`,
                suggestedRange: { min: parseInt(range.recommended.split('-')[0]), max: parseInt(range.recommended.split('-')[1]) }
            };
        }

        return {
            isValid: true,
            suggestedRange: { min: parseInt(range.recommended.split('-')[0]), max: parseInt(range.recommended.split('-')[1]) }
        };
    }

}
