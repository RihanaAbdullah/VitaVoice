import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Apple, Calendar, UtensilsCrossed, ChevronRight } from 'lucide-react';

export const DietNutrition = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Calendar,
      title: 'Plan My Day',
      description: 'Get a complete meal plan for the entire day',
      color: '#059669',
      route: '/plan-full-day'
    },
    {
      icon: UtensilsCrossed,
      title: 'Plan a Meal',
      description: 'Get suggestions for a specific meal',
      color: '#2563EB',
      route: '/plan-single-meal'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0FDF4] to-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 shadow-sm sticky top-0 z-10">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/home')}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </motion.button>
        <h1 className="text-xl font-bold text-[#1E293B]">Diet & Nutrition</h1>
      </div>

      {/* Hero Section */}
      <div className="px-6 py-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#059669] to-[#10B981] rounded-full flex items-center justify-center shadow-xl">
            <Apple className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#1E293B] mb-3">
            Calorie-Aware Meal Planning
          </h2>
          <p className="text-gray-600 max-w-sm mx-auto">
            Get personalized meal suggestions based on your health profile and calorie goals
          </p>
        </motion.div>

        {/* Main Action Cards */}
        <div className="space-y-4 mb-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.button
                key={feature.title}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(feature.route)}
                className="w-full bg-white rounded-2xl p-5 shadow-lg border-2 border-transparent hover:border-current transition-all text-left"
                style={{ borderColor: 'transparent' }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: feature.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#1E293B] mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-400" />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Features Info */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-md"
        >
          <h3 className="font-bold text-lg text-[#1E293B] mb-4">
            What You'll Get
          </h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#059669] flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-[#1E293B] mb-1">Personalized Suggestions</h4>
                <p className="text-sm text-gray-600">Based on your age, health conditions, and dietary preferences</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#059669] flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-[#1E293B] mb-1">Allergen-Free Options</h4>
                <p className="text-sm text-gray-600">All suggestions exclude your food allergies and intolerances</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#059669] flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-[#1E293B] mb-1">Health-Conscious Meals</h4>
                <p className="text-sm text-gray-600">Adapted for diabetes, hypertension, anemia, and other conditions</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#059669] flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">4</span>
              </div>
              <div>
                <h4 className="font-semibold text-[#1E293B] mb-1">Multiple Alternatives</h4>
                <p className="text-sm text-gray-600">Don't like a suggestion? Generate unlimited alternatives</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4"
        >
          <p className="text-xs text-amber-800 text-center">
            <strong>Important:</strong> These are dietary suggestions and not medical prescriptions.
            They do not replace professional medical or nutritional advice. Please consult healthcare
            professionals for personalized medical guidance.
          </p>
        </motion.div>

        {/* Complete Profile CTA */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/health-profile')}
          className="w-full mt-6 h-14 bg-white border-2 border-[#2563EB] text-[#2563EB] rounded-xl font-semibold hover:bg-[#2563EB] hover:text-white transition-colors"
        >
          Complete Health Profile
        </motion.button>
      </div>
    </div>
  );
};
