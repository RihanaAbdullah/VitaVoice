import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { FamilyMember, HealthCondition } from '../context/AppContext';

interface HealthProfileFormProps {
    member?: FamilyMember;
    onSave: (data: Partial<FamilyMember>) => void;
    onClose: () => void;
}

export const HealthProfileForm = ({ member, onSave, onClose }: HealthProfileFormProps) => {
    const [step, setStep] = useState(1);
    const totalSteps = 7;

    // Form state
    const [formData, setFormData] = useState<Partial<FamilyMember>>({
        name: member?.name || '',
        age: member?.age || 25,
        gender: member?.gender || 'Male',
        bloodType: member?.bloodType || 'O+',
        currentSymptoms: member?.currentSymptoms || [],
        healthConditions: member?.healthConditions || [],
        familyHistory: member?.familyHistory || [],
        dietaryPreference: member?.dietaryPreference || 'vegetarian',
        cuisinePreference: member?.cuisinePreference || 'all-indian',
        foodAllergies: member?.foodAllergies || [],
        foodIntolerances: member?.foodIntolerances || []
    });

    const [tempInput, setTempInput] = useState('');

    const commonSymptoms = [
        'Headache', 'Fever', 'Cough', 'Fatigue', 'Nausea', 'Dizziness',
        'Body Pain', 'Sore Throat', 'Runny Nose', 'Stomach Pain'
    ];

    const commonConditions = [
        { name: 'Diabetes', severity: 'moderate' as const },
        { name: 'Hypertension', severity: 'moderate' as const },
        { name: 'High Blood Pressure', severity: 'moderate' as const },
        { name: 'Anemia', severity: 'mild' as const },
        { name: 'Asthma', severity: 'moderate' as const },
        { name: 'Thyroid', severity: 'mild' as const }
    ];

    const familyHistoryOptions = [
        'Diabetes', 'Heart Disease', 'Hypertension', 'Obesity',
        'Cancer', 'Stroke', 'Kidney Disease', 'Asthma'
    ];

    const commonAllergies = [
        'Peanuts', 'Tree Nuts', 'Dairy', 'Eggs', 'Soy', 'Wheat/Gluten',
        'Fish', 'Shellfish', 'Sesame', 'Mustard'
    ];

    const handleNext = () => {
        if (step < totalSteps) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    const addToList = (field: keyof FamilyMember, value: string) => {
        const currentList = (formData[field] as string[]) || [];
        if (!currentList.includes(value)) {
            setFormData({ ...formData, [field]: [...currentList, value] });
        }
    };

    const removeFromList = (field: keyof FamilyMember, value: string) => {
        const currentList = (formData[field] as string[]) || [];
        setFormData({ ...formData, [field]: currentList.filter(item => item !== value) });
    };

    const addCondition = (condition: HealthCondition) => {
        const currentConditions = formData.healthConditions || [];
        if (!currentConditions.find(c => c.name === condition.name)) {
            setFormData({ ...formData, healthConditions: [...currentConditions, condition] });
        }
    };

    const removeCondition = (conditionName: string) => {
        const currentConditions = formData.healthConditions || [];
        setFormData({
            ...formData,
            healthConditions: currentConditions.filter(c => c.name !== conditionName)
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col"
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#1E293B]">
                        {member ? 'Edit' : 'Add'} Health Profile
                    </h2>
                    <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="px-6 py-3 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">Step {step} of {totalSteps}</span>
                        <span className="text-xs text-gray-500">{Math.round((step / totalSteps) * 100)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-[#059669]"
                            initial={{ width: 0 }}
                            animate={{ width: `${(step / totalSteps) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    <AnimatePresence mode="wait">
                        {/* Step 1: Basic Info */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h3 className="text-lg font-bold text-[#1E293B] mb-4">Basic Information</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
                                            placeholder="Enter name"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
                                            <input
                                                type="number"
                                                value={formData.age}
                                                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                                                className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                                            <select
                                                value={formData.gender}
                                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                                className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
                                            >
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Type</label>
                                        <select
                                            value={formData.bloodType}
                                            onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                                            className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
                                        >
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                        </select>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Current Symptoms */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h3 className="text-lg font-bold text-[#1E293B] mb-2">Current Symptoms</h3>
                                <p className="text-sm text-gray-600 mb-4">Select any symptoms you're currently experiencing</p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {commonSymptoms.map(symptom => {
                                        const isSelected = formData.currentSymptoms?.includes(symptom);
                                        return (
                                            <button
                                                key={symptom}
                                                onClick={() => isSelected ? removeFromList('currentSymptoms', symptom) : addToList('currentSymptoms', symptom)}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isSelected
                                                    ? 'bg-[#059669] text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {symptom}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Add Custom Symptom</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={tempInput}
                                            onChange={(e) => setTempInput(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter' && tempInput.trim()) {
                                                    addToList('currentSymptoms', tempInput.trim());
                                                    setTempInput('');
                                                }
                                            }}
                                            className="flex-1 h-10 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]"
                                            placeholder="Type and press Enter"
                                        />
                                    </div>
                                </div>

                                {formData.currentSymptoms && formData.currentSymptoms.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-sm font-semibold text-gray-700 mb-2">Selected:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.currentSymptoms.map(symptom => (
                                                <span key={symptom} className="px-3 py-1 bg-[#059669] text-white rounded-full text-sm flex items-center gap-1">
                                                    {symptom}
                                                    <button onClick={() => removeFromList('currentSymptoms', symptom)}>
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Step 3: Health Conditions */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h3 className="text-lg font-bold text-[#1E293B] mb-2">Health Conditions</h3>
                                <p className="text-sm text-gray-600 mb-4">Select any existing health conditions</p>

                                <div className="space-y-2 mb-4">
                                    {commonConditions.map(condition => {
                                        const isSelected = formData.healthConditions?.find(c => c.name === condition.name);
                                        return (
                                            <button
                                                key={condition.name}
                                                onClick={() => isSelected ? removeCondition(condition.name) : addCondition(condition)}
                                                className={`w-full p-3 rounded-xl text-left transition-all border-2 ${isSelected
                                                    ? 'border-[#059669] bg-[#059669]/10'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium text-gray-800">{condition.name}</span>
                                                    {isSelected && <Check className="w-5 h-5 text-[#059669]" />}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 4: Family History */}
                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h3 className="text-lg font-bold text-[#1E293B] mb-2">Family Health History</h3>
                                <p className="text-sm text-gray-600 mb-4">Select conditions that run in your family</p>

                                <div className="flex flex-wrap gap-2">
                                    {familyHistoryOptions.map(condition => {
                                        const isSelected = formData.familyHistory?.includes(condition);
                                        return (
                                            <button
                                                key={condition}
                                                onClick={() => isSelected ? removeFromList('familyHistory', condition) : addToList('familyHistory', condition)}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isSelected
                                                    ? 'bg-[#059669] text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {condition}
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 5: Dietary Preference */}
                        {step === 5 && (
                            <motion.div
                                key="step5"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h3 className="text-lg font-bold text-[#1E293B] mb-4">Dietary Preference</h3>

                                <div className="space-y-3">
                                    {[
                                        { value: 'vegetarian', label: 'Vegetarian', desc: 'No meat, fish, or eggs' },
                                        { value: 'non-vegetarian', label: 'Non-Vegetarian', desc: 'Includes all food types' },
                                        { value: 'vegan', label: 'Vegan', desc: 'No animal products' }
                                    ].map(option => (
                                        <button
                                            key={option.value}
                                            onClick={() => setFormData({ ...formData, dietaryPreference: option.value as any })}
                                            className={`w-full p-4 rounded-xl text-left transition-all border-2 ${formData.dietaryPreference === option.value
                                                ? 'border-[#059669] bg-[#059669]/10'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold text-gray-800">{option.label}</div>
                                                    <div className="text-sm text-gray-600">{option.desc}</div>
                                                </div>
                                                {formData.dietaryPreference === option.value && (
                                                    <Check className="w-6 h-6 text-[#059669]" />
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 6: Cuisine Preference */}
                        {step === 6 && (
                            <motion.div
                                key="step6"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h3 className="text-lg font-bold text-[#1E293B] mb-2">Cuisine Preference</h3>
                                <p className="text-sm text-gray-600 mb-4">Select your preferred Indian cuisine type</p>

                                <div className="space-y-3">
                                    {[
                                        { value: 'all-indian', label: 'All Indian Cuisines', desc: 'No preference, show all regional foods', emoji: '🇮🇳' },
                                        { value: 'north-indian', label: 'North Indian', desc: 'Punjabi, Delhi, Rajasthani styles', emoji: '🫓' },
                                        { value: 'south-indian', label: 'South Indian', desc: 'Tamil, Kerala, Karnataka styles', emoji: '🥥' },
                                        { value: 'east-indian', label: 'East Indian', desc: 'Bengali, Odia, Assamese styles', emoji: '🐟' },
                                        { value: 'west-indian', label: 'West Indian', desc: 'Gujarati, Maharashtrian, Goan styles', emoji: '🌶️' }
                                    ].map(option => (
                                        <button
                                            key={option.value}
                                            onClick={() => setFormData({ ...formData, cuisinePreference: option.value as any })}
                                            className={`w-full p-4 rounded-xl text-left transition-all border-2 ${formData.cuisinePreference === option.value
                                                ? 'border-[#059669] bg-[#059669]/10'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{option.emoji}</span>
                                                    <div>
                                                        <div className="font-semibold text-gray-800">{option.label}</div>
                                                        <div className="text-sm text-gray-600">{option.desc}</div>
                                                    </div>
                                                </div>
                                                {formData.cuisinePreference === option.value && (
                                                    <Check className="w-6 h-6 text-[#059669]" />
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 7: Food Allergies */}
                        {step === 7 && (
                            <motion.div
                                key="step6"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h3 className="text-lg font-bold text-[#1E293B] mb-2">Food Allergies</h3>
                                <p className="text-sm text-gray-600 mb-4">Select any food allergies or intolerances</p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {commonAllergies.map(allergy => {
                                        const isSelected = formData.foodAllergies?.includes(allergy);
                                        return (
                                            <button
                                                key={allergy}
                                                onClick={() => isSelected ? removeFromList('foodAllergies', allergy) : addToList('foodAllergies', allergy)}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isSelected
                                                    ? 'bg-red-500 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {allergy}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Add Custom Allergy</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={tempInput}
                                            onChange={(e) => setTempInput(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter' && tempInput.trim()) {
                                                    addToList('foodAllergies', tempInput.trim());
                                                    setTempInput('');
                                                }
                                            }}
                                            className="flex-1 h-10 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]"
                                            placeholder="Type and press Enter"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Buttons */}
                <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
                    {step > 1 && (
                        <button
                            onClick={handleBack}
                            className="flex-1 h-12 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold flex items-center justify-center gap-2"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Back
                        </button>
                    )}

                    {step < totalSteps ? (
                        <button
                            onClick={handleNext}
                            className="flex-1 h-12 bg-[#059669] text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                        >
                            Next
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSave}
                            className="flex-1 h-12 bg-[#059669] text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                        >
                            <Check className="w-5 h-5" />
                            Save Profile
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
