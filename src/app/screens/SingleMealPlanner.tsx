import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Coffee, Sun, Moon, Cookie, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MealEngine } from '../utils/mealEngine';
import { MealCard } from '../components/MealCard';
import { MealSuggestion } from '../context/AppContext';

export const SingleMealPlanner = () => {
    const navigate = useNavigate();
    const { familyMembers } = useApp();

    const [step, setStep] = useState<'input' | 'results'>('input');
    const [calories, setCalories] = useState('500');
    const [selectedMember, setSelectedMember] = useState('');
    const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
    const [meals, setMeals] = useState<MealSuggestion[]>([]);
    const [excludedIds, setExcludedIds] = useState<string[]>([]);

    useEffect(() => {
        if (familyMembers.length > 0 && !selectedMember) {
            setSelectedMember(familyMembers[0].id);
        }
    }, [familyMembers, selectedMember]);

    const handleGenerateMeals = () => {
        if (!selectedMember) return;

        const member = familyMembers.find(m => m.id === selectedMember);
        if (!member) return;

        const calorieTarget = parseInt(calories);

        // Use meal-specific validation
        const validation = MealEngine.validateMealCalories(calorieTarget, mealType);

        if (!validation.isValid) {
            alert(validation.message);
            return;
        }

        const suggestions = MealEngine.generateMealSuggestions({
            calorieTarget,
            mealType,
            userProfile: member,
            excludedMealIds: excludedIds,
            count: 3
        });

        setMeals(suggestions);
        setStep('results');
    };

    const handleGenerateMore = () => {
        const member = familyMembers.find(m => m.id === selectedMember);
        if (!member) return;

        // Extract template IDs from current meals (before the timestamp)
        const currentTemplateIds = meals.map(m => m.id.split('_')[0]);

        // Update excluded IDs with template IDs
        const updatedExcludedIds = [...excludedIds, ...currentTemplateIds];

        const newSuggestions = MealEngine.generateMealSuggestions({
            calorieTarget: parseInt(calories),
            mealType,
            userProfile: member,
            excludedMealIds: updatedExcludedIds,
            count: 3
        });

        if (newSuggestions.length > 0) {
            setMeals(newSuggestions);
            setExcludedIds(updatedExcludedIds);
        }
    };

    const mealTypeOptions = [
        { value: 'breakfast', label: 'Breakfast', icon: Coffee, color: '#F59E0B' },
        { value: 'lunch', label: 'Lunch', icon: Sun, color: '#EAB308' },
        { value: 'dinner', label: 'Dinner', icon: Moon, color: '#6366F1' },
        { value: 'snack', label: 'Snacks', icon: Cookie, color: '#EC4899' }
    ];

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
                <h1 className="text-xl font-bold text-[#1E293B]">Plan Single Meal</h1>
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

                        {/* Meal Type Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Select Meal Type
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {mealTypeOptions.map((option) => {
                                    const Icon = option.icon;
                                    const isSelected = mealType === option.value;
                                    return (
                                        <motion.button
                                            key={option.value}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setMealType(option.value as any)}
                                            className={`p-4 rounded-xl border-2 transition-all ${isSelected
                                                ? 'border-current shadow-lg'
                                                : 'border-gray-200 bg-white'
                                                }`}
                                            style={{
                                                borderColor: isSelected ? option.color : undefined,
                                                backgroundColor: isSelected ? `${option.color}15` : undefined
                                            }}
                                        >
                                            <Icon
                                                className="w-8 h-8 mx-auto mb-2"
                                                style={{ color: option.color }}
                                            />
                                            <span
                                                className="font-semibold text-sm"
                                                style={{ color: isSelected ? option.color : '#1E293B' }}
                                            >
                                                {option.label}
                                            </span>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Calorie Input */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Calorie Target for This Meal
                            </label>
                            <input
                                type="number"
                                value={calories}
                                onChange={(e) => setCalories(e.target.value)}
                                className="w-full h-14 px-4 bg-white border-2 border-gray-300 rounded-xl text-2xl font-bold text-center focus:outline-none focus:border-[#059669]"
                                placeholder={
                                    mealType === 'breakfast' ? '400' :
                                        mealType === 'snack' ? '150' : '600'
                                }
                            />
                            <p className="text-xs text-gray-500 mt-2 text-center">
                                {mealType === 'breakfast' && 'Recommended: 300-500 kcal'}
                                {mealType === 'lunch' && 'Recommended: 500-700 kcal'}
                                {mealType === 'dinner' && 'Recommended: 500-700 kcal'}
                                {mealType === 'snack' && 'Recommended: 100-200 kcal'}
                            </p>
                        </div>

                        {/* Info Card */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                            <p className="text-sm text-blue-800">
                                <strong>Tip:</strong> We'll show you 3 different meal options that match your
                                calorie target and health profile. You can generate more alternatives anytime!
                            </p>
                        </div>

                        {/* Generate Button */}
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={handleGenerateMeals}
                            className="w-full h-14 bg-gradient-to-r from-[#059669] to-[#10B981] text-white rounded-xl font-bold text-lg shadow-lg"
                        >
                            Generate Meal Suggestions
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
                        <div
                            className="rounded-2xl p-6 text-white"
                            style={{
                                background: `linear-gradient(135deg, ${mealTypeOptions.find(o => o.value === mealType)?.color}, ${mealTypeOptions.find(o => o.value === mealType)?.color}dd)`
                            }}
                        >
                            <h2 className="text-xl font-bold mb-2 capitalize">{mealType} Suggestions</h2>
                            <p className="text-white/90 text-sm mb-4">
                                Target: {calories} calories
                            </p>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                <span className="text-sm">Personalized for {familyMembers.find(m => m.id === selectedMember)?.name}</span>
                            </div>
                        </div>

                        {/* Meal Cards */}
                        {meals.map((meal, index) => (
                            <motion.div
                                key={meal.id}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                                    Option {index + 1}
                                </h3>
                                <MealCard meal={meal} showGenerateButton={false} />
                            </motion.div>
                        ))}

                        {/* Generate More Button */}
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={handleGenerateMore}
                            className="w-full h-14 bg-[#2563EB] text-white rounded-xl font-bold shadow-lg"
                        >
                            Generate More Options
                        </motion.button>

                        {/* Back to Planning */}
                        <button
                            onClick={() => setStep('input')}
                            className="w-full h-12 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold"
                        >
                            Plan Another Meal
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
};
