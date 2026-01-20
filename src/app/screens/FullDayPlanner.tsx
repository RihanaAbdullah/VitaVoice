import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Save, Coffee, Sun, Moon, Cookie, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MealEngine } from '../utils/mealEngine';
import { MealCard } from '../components/MealCard';
import { MealSuggestion } from '../context/AppContext';

export const FullDayPlanner = () => {
    const navigate = useNavigate();
    const { familyMembers, saveMealPlan } = useApp();

    const [step, setStep] = useState<'input' | 'results'>('input');
    const [totalCalories, setTotalCalories] = useState('2000');
    const [selectedMember, setSelectedMember] = useState('');
    const [meals, setMeals] = useState<{
        breakfast?: MealSuggestion;
        lunch?: MealSuggestion;
        dinner?: MealSuggestion;
        snacks?: MealSuggestion;
    }>({});
    const [excludedIds, setExcludedIds] = useState<{
        breakfast: string[];
        lunch: string[];
        dinner: string[];
        snacks: string[];
    }>({
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: []
    });

    useEffect(() => {
        if (familyMembers.length > 0 && !selectedMember) {
            setSelectedMember(familyMembers[0].id);
        }
    }, [familyMembers, selectedMember]);

    const handleGeneratePlan = () => {
        if (!selectedMember) return;

        const member = familyMembers.find(m => m.id === selectedMember);
        if (!member) return;

        const calories = parseInt(totalCalories);
        const validation = MealEngine.validateCalories(calories, member.age, member.gender);

        if (!validation.isValid) {
            alert(validation.message);
            return;
        }

        const distribution = MealEngine.distributeCalories(calories);

        const breakfast = MealEngine.generateMealSuggestions({
            calorieTarget: distribution.breakfast,
            mealType: 'breakfast',
            userProfile: member,
            excludedMealIds: excludedIds.breakfast,
            count: 1
        })[0];

        const lunch = MealEngine.generateMealSuggestions({
            calorieTarget: distribution.lunch,
            mealType: 'lunch',
            userProfile: member,
            excludedMealIds: excludedIds.lunch,
            count: 1
        })[0];

        const dinner = MealEngine.generateMealSuggestions({
            calorieTarget: distribution.dinner,
            mealType: 'dinner',
            userProfile: member,
            excludedMealIds: excludedIds.dinner,
            count: 1
        })[0];

        const snacks = MealEngine.generateMealSuggestions({
            calorieTarget: distribution.snacks,
            mealType: 'snack',
            userProfile: member,
            excludedMealIds: excludedIds.snacks,
            count: 1
        })[0];

        setMeals({ breakfast, lunch, dinner, snacks });
        setStep('results');
    };

    const handleGenerateAlternative = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks') => {
        const member = familyMembers.find(m => m.id === selectedMember);
        if (!member) return;

        const calories = parseInt(totalCalories);
        const distribution = MealEngine.distributeCalories(calories);

        // Extract the template ID from the current meal (before the timestamp)
        const currentMeal = meals[mealType];
        let templateId = '';
        if (currentMeal) {
            // The ID format is: templateId_timestamp_random
            templateId = currentMeal.id.split('_')[0];
        }

        // Update excluded IDs with the template ID
        const updatedExcludedIds = templateId ? [...excludedIds[mealType], templateId] : excludedIds[mealType];

        const newMeal = MealEngine.generateMealSuggestions({
            calorieTarget: distribution[mealType],
            mealType: mealType === 'snacks' ? 'snack' : mealType,
            userProfile: member,
            excludedMealIds: updatedExcludedIds,
            count: 1
        })[0];

        if (newMeal) {
            // Update both the meal and the excluded IDs
            setMeals(prev => ({ ...prev, [mealType]: newMeal }));
            setExcludedIds(prev => ({
                ...prev,
                [mealType]: updatedExcludedIds
            }));
        }
    };

    const handleSavePlan = () => {
        if (!selectedMember || !meals.breakfast || !meals.lunch || !meals.dinner) return;

        saveMealPlan({
            memberId: selectedMember,
            totalCalories: parseInt(totalCalories),
            meals
        });

        alert('Meal plan saved successfully!');
        navigate('/diet-nutrition');
    };

    if (familyMembers.length === 0) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-700 mb-2">No Health Profile Found</h2>
                    <p className="text-gray-600 mb-6">Please create a health profile first</p>
                    <button
                        onClick={() => navigate('/health-profile')}
                        className="px-6 py-3 bg-[#2563EB] text-white rounded-xl font-semibold"
                    >
                        Go to Health Profile
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F0FDF4] to-[#F8FAFC]">
            {/* Header */}
            <div className="bg-white px-4 py-4 flex items-center gap-3 shadow-sm sticky top-0 z-10">
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => step === 'input' ? navigate('/meal-planning-mode') : setStep('input')}
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </motion.button>
                <h1 className="text-xl font-bold text-[#1E293B]">Plan Full Day</h1>
            </div>

            {step === 'input' ? (
                <div className="px-6 py-8">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                    >
                        {/* Member Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Select Family Member
                            </label>
                            <select
                                value={selectedMember}
                                onChange={(e) => setSelectedMember(e.target.value)}
                                className="w-full h-12 px-4 bg-white border border-gray-300 rounded-xl text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#059669]"
                            >
                                {familyMembers.map(member => (
                                    <option key={member.id} value={member.id}>
                                        {member.name} ({member.age} years, {member.gender})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Calorie Input */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Total Daily Calories
                            </label>
                            <input
                                type="number"
                                value={totalCalories}
                                onChange={(e) => setTotalCalories(e.target.value)}
                                className="w-full h-14 px-4 bg-white border-2 border-gray-300 rounded-xl text-2xl font-bold text-center focus:outline-none focus:border-[#059669]"
                                placeholder="2000"
                            />
                            <p className="text-xs text-gray-500 mt-2 text-center">
                                Recommended: 1800-2400 kcal for adults
                            </p>
                        </div>

                        {/* Calorie Distribution Preview */}
                        <div className="bg-white rounded-2xl p-5 shadow-md mb-6">
                            <h3 className="font-semibold text-[#1E293B] mb-4">Calorie Distribution</h3>
                            <div className="space-y-3">
                                {(() => {
                                    const dist = MealEngine.distributeCalories(parseInt(totalCalories) || 2000);
                                    return (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Coffee className="w-5 h-5 text-[#F59E0B]" />
                                                    <span className="text-sm font-medium text-gray-700">Breakfast</span>
                                                </div>
                                                <span className="font-bold text-[#1E293B]">{dist.breakfast} kcal</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Sun className="w-5 h-5 text-[#EAB308]" />
                                                    <span className="text-sm font-medium text-gray-700">Lunch</span>
                                                </div>
                                                <span className="font-bold text-[#1E293B]">{dist.lunch} kcal</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Moon className="w-5 h-5 text-[#6366F1]" />
                                                    <span className="text-sm font-medium text-gray-700">Dinner</span>
                                                </div>
                                                <span className="font-bold text-[#1E293B]">{dist.dinner} kcal</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Cookie className="w-5 h-5 text-[#EC4899]" />
                                                    <span className="text-sm font-medium text-gray-700">Snacks</span>
                                                </div>
                                                <span className="font-bold text-[#1E293B]">{dist.snacks} kcal</span>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* Generate Button */}
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={handleGeneratePlan}
                            className="w-full h-14 bg-gradient-to-r from-[#059669] to-[#10B981] text-white rounded-xl font-bold text-lg shadow-lg"
                        >
                            Generate Meal Plan
                        </motion.button>
                    </motion.div>
                </div>
            ) : (
                <div className="px-6 py-8">
                    {/* Results */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        {/* Summary Card */}
                        <div className="bg-gradient-to-r from-[#059669] to-[#10B981] rounded-2xl p-6 text-white">
                            <h2 className="text-xl font-bold mb-2">Your Daily Meal Plan</h2>
                            <p className="text-white/90 text-sm mb-4">
                                Total: {totalCalories} calories
                            </p>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                <span className="text-sm">Personalized for {familyMembers.find(m => m.id === selectedMember)?.name}</span>
                            </div>
                        </div>

                        {/* Breakfast */}
                        {meals.breakfast && (
                            <div>
                                <h3 className="text-lg font-bold text-[#1E293B] mb-3 flex items-center gap-2">
                                    <Coffee className="w-5 h-5 text-[#F59E0B]" />
                                    Breakfast
                                </h3>
                                <MealCard
                                    meal={meals.breakfast}
                                    onGenerateAlternative={() => handleGenerateAlternative('breakfast')}
                                />
                            </div>
                        )}

                        {/* Lunch */}
                        {meals.lunch && (
                            <div>
                                <h3 className="text-lg font-bold text-[#1E293B] mb-3 flex items-center gap-2">
                                    <Sun className="w-5 h-5 text-[#EAB308]" />
                                    Lunch
                                </h3>
                                <MealCard
                                    meal={meals.lunch}
                                    onGenerateAlternative={() => handleGenerateAlternative('lunch')}
                                />
                            </div>
                        )}

                        {/* Dinner */}
                        {meals.dinner && (
                            <div>
                                <h3 className="text-lg font-bold text-[#1E293B] mb-3 flex items-center gap-2">
                                    <Moon className="w-5 h-5 text-[#6366F1]" />
                                    Dinner
                                </h3>
                                <MealCard
                                    meal={meals.dinner}
                                    onGenerateAlternative={() => handleGenerateAlternative('dinner')}
                                />
                            </div>
                        )}

                        {/* Snacks */}
                        {meals.snacks && (
                            <div>
                                <h3 className="text-lg font-bold text-[#1E293B] mb-3 flex items-center gap-2">
                                    <Cookie className="w-5 h-5 text-[#EC4899]" />
                                    Snacks
                                </h3>
                                <MealCard
                                    meal={meals.snacks}
                                    onGenerateAlternative={() => handleGenerateAlternative('snacks')}
                                />
                            </div>
                        )}

                        {/* Save Button */}
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSavePlan}
                            className="w-full h-14 bg-[#2563EB] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
                        >
                            <Save className="w-5 h-5" />
                            <span>Save Meal Plan</span>
                        </motion.button>
                    </motion.div>
                </div>
            )}
        </div>
    );
};
