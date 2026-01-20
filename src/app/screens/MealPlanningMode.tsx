import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, UtensilsCrossed, Coffee, Sun, Moon, Cookie } from 'lucide-react';

export const MealPlanningMode = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F0FDF4] to-[#F8FAFC]">
            {/* Header */}
            <div className="bg-white px-4 py-4 flex items-center gap-3 shadow-sm sticky top-0 z-10">
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate('/diet-nutrition')}
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </motion.button>
                <h1 className="text-xl font-bold text-[#1E293B]">Plan Your Meals</h1>
            </div>

            <div className="px-6 py-8">
                {/* Title */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center mb-8"
                >
                    <h2 className="text-2xl font-bold text-[#1E293B] mb-2">
                        How would you like to plan?
                    </h2>
                    <p className="text-gray-600">
                        Choose your preferred meal planning mode
                    </p>
                </motion.div>

                {/* Option Cards */}
                <div className="space-y-4">
                    {/* Plan Full Day */}
                    <motion.button
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/plan-full-day')}
                        className="w-full bg-white rounded-2xl p-6 shadow-lg border-2 border-transparent hover:border-[#059669] transition-all text-left"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#059669] to-[#10B981] rounded-xl flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-[#1E293B] mb-2">
                                    Plan Entire Day
                                </h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    Get a complete meal plan for breakfast, lunch, dinner, and snacks
                                </p>

                                {/* Meal Icons */}
                                <div className="flex gap-3">
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Coffee className="w-4 h-4 text-[#F59E0B]" />
                                        <span>Breakfast</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Sun className="w-4 h-4 text-[#EAB308]" />
                                        <span>Lunch</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Moon className="w-4 h-4 text-[#6366F1]" />
                                        <span>Dinner</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Cookie className="w-4 h-4 text-[#EC4899]" />
                                        <span>Snacks</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.button>

                    {/* Plan Single Meal */}
                    <motion.button
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/plan-single-meal')}
                        className="w-full bg-white rounded-2xl p-6 shadow-lg border-2 border-transparent hover:border-[#2563EB] transition-all text-left"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#2563EB] to-[#3B82F6] rounded-xl flex items-center justify-center flex-shrink-0">
                                <UtensilsCrossed className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-[#1E293B] mb-2">
                                    Plan Single Meal
                                </h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    Get suggestions for a specific meal with your calorie target
                                </p>

                                {/* Features */}
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-[#2563EB]/10 text-[#2563EB] text-xs rounded-full font-medium">
                                        Choose meal type
                                    </span>
                                    <span className="px-3 py-1 bg-[#2563EB]/10 text-[#2563EB] text-xs rounded-full font-medium">
                                        Set calories
                                    </span>
                                    <span className="px-3 py-1 bg-[#2563EB]/10 text-[#2563EB] text-xs rounded-full font-medium">
                                        Multiple options
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.button>
                </div>

                {/* Info Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 bg-gradient-to-r from-[#059669]/10 to-[#10B981]/10 rounded-2xl p-5 border border-[#059669]/20"
                >
                    <h4 className="font-semibold text-[#1E293B] mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#059669] rounded-full"></span>
                        Personalized for You
                    </h4>
                    <p className="text-sm text-gray-600">
                        All meal suggestions are tailored based on your health profile, dietary preferences,
                        allergies, and current health conditions.
                    </p>
                </motion.div>

                {/* Disclaimer */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4"
                >
                    <p className="text-xs text-amber-800 text-center">
                        <strong>Disclaimer:</strong> These are dietary suggestions and not medical prescriptions.
                        Please consult healthcare professionals for medical advice.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};
