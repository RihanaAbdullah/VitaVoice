import { motion } from 'motion/react';
import { Clock, Flame, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { MealSuggestion } from '../context/AppContext';
import { useState } from 'react';

interface MealCardProps {
    meal: MealSuggestion;
    onGenerateAlternative?: () => void;
    showGenerateButton?: boolean;
}

export const MealCard = ({ meal, onGenerateAlternative, showGenerateButton = true }: MealCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getMealTypeColor = (type: string) => {
        switch (type) {
            case 'breakfast': return '#F59E0B';
            case 'lunch': return '#EAB308';
            case 'dinner': return '#6366F1';
            case 'snack': return '#EC4899';
            default: return '#059669';
        }
    };

    const color = getMealTypeColor(meal.type);

    return (
        <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
        >
            {/* Header */}
            <div className="p-5 border-b border-gray-100">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span
                                className="px-2 py-1 rounded-md text-xs font-semibold text-white capitalize"
                                style={{ backgroundColor: color }}
                            >
                                {meal.type}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium text-gray-600">
                                {meal.cuisine}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-[#1E293B]">{meal.name}</h3>
                    </div>

                    {/* Calorie Badge */}
                    <div className="flex flex-col items-center bg-gradient-to-br from-[#059669] to-[#10B981] rounded-xl px-3 py-2 min-w-[70px]">
                        <Flame className="w-5 h-5 text-white mb-1" />
                        <span className="text-white font-bold text-lg">{meal.calories}</span>
                        <span className="text-white/80 text-xs">kcal</span>
                    </div>
                </div>

                {/* Health Note */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-800 leading-relaxed">
                        <strong>Health Note:</strong> {meal.healthNote}
                    </p>
                </div>
            </div>

            {/* Macros */}
            <div className="px-5 py-4 bg-gray-50">
                <div className="grid grid-cols-4 gap-3">
                    <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Carbs</div>
                        <div className="font-bold text-[#1E293B]">{meal.macros.carbs}g</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Protein</div>
                        <div className="font-bold text-[#1E293B]">{meal.macros.protein}g</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Fat</div>
                        <div className="font-bold text-[#1E293B]">{meal.macros.fat}g</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Fiber</div>
                        <div className="font-bold text-[#1E293B]">{meal.macros.fiber}g</div>
                    </div>
                </div>
            </div>

            {/* Expandable Details */}
            <div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                    <span className="text-sm font-semibold text-gray-700">
                        {isExpanded ? 'Hide' : 'View'} Ingredients
                    </span>
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                </button>

                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-5 pb-4"
                    >
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-sm text-[#1E293B] mb-2">Ingredients:</h4>
                            <ul className="space-y-1">
                                {meal.ingredients.map((ingredient, index) => (
                                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                                        <span className="text-[#059669] mt-1">•</span>
                                        <span>{ingredient}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span className="text-xs text-gray-600">
                                    Prep time: {meal.preparationTime} minutes
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Generate Alternative Button */}
            {showGenerateButton && onGenerateAlternative && (
                <div className="p-4 border-t border-gray-100">
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={onGenerateAlternative}
                        className="w-full h-11 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span>Generate Alternative</span>
                    </motion.button>
                </div>
            )}
        </motion.div>
    );
};
