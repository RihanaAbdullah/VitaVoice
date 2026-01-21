import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Phone, Lock, Check } from 'lucide-react';

/* =========================
   FORM DATA
========================= */
interface FormData {
  name: string;
  age: string;
  sex: string;

  allergies: string[];
  history: string;
  chiefComplaints: string;
  presentIllness: string;

  cvs: string[];
  rs: string[];
  dental: string;
  gyn: string;
  eyes: string;
  ent: string;

  pastMedical: string;
  pastSurgical: string;
  habits: string[];
  children: string;

  familyHistory: string[];

  generalExam: string;
  cvsExam: string;
  rsExam: string;
  abdomen: string;
  psychological: string;
}

/* =========================
   REUSABLE COMPONENTS
========================= */
const Input = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
);

const Textarea = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
);

const ChecklistSingle = ({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-3">{label}</label>
    <div className="space-y-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`w-full px-4 py-3 rounded-lg border text-left flex items-center justify-between transition-all ${
            value === opt
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
          }`}
        >
          <span>{opt}</span>
          {value === opt && <Check className="w-5 h-5" />}
        </button>
      ))}
    </div>
  </div>
);

const ChecklistMultiple = ({ label, options, value, onChange }: { label: string; options: string[]; value: string[]; onChange: (item: string) => void }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-3">{label}</label>
    <div className="space-y-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`w-full px-4 py-3 rounded-lg border text-left flex items-center justify-between transition-all ${
            value.includes(opt)
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
          }`}
        >
          <span>{opt}</span>
          {value.includes(opt) && <Check className="w-5 h-5" />}
        </button>
      ))}
    </div>
  </div>
);

/* =========================
   MAIN COMPONENT
========================= */
export const Signup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    sex: '',

    allergies: [],
    history: '',
    chiefComplaints: '',
    presentIllness: '',

    cvs: [],
    rs: [],
    dental: '',
    gyn: '',
    eyes: '',
    ent: '',

    pastMedical: '',
    pastSurgical: '',
    habits: [],
    children: '',

    familyHistory: [],

    generalExam: '',
    cvsExam: '',
    rsExam: '',
    abdomen: '',
    psychological: ''
  });

  const steps = [
    'Your Details',
    'Your Health Problem',
    'Body Symptoms',
    'Past & Daily Life',
    'Family Health'
  ];

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof FormData, item: string) => {
    const current = formData[field] as string[];
    updateField(
      field,
      current.includes(item)
        ? current.filter(i => i !== item)
        : [...current, item]
    );
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Store data in memory/state or send to backend
      console.log('Form submitted:', formData);
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/emergency')}
        className="fixed top-6 right-6 z-50 w-14 h-14 bg-[#DC2626] rounded-full shadow-2xl flex items-center justify-center"
      >
        <Phone className="w-7 h-7 text-white" />
      </motion.button>

      <div className="bg-white px-4 py-4 flex items-center gap-3 shadow-sm">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() =>
            currentStep > 0 ? setCurrentStep(currentStep - 1) : navigate('/login')
          }
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </motion.button>

        <div className="flex-1">
          <h1 className="text-lg font-bold text-[#1E293B]">Health Check</h1>
          <p className="text-sm text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        <Lock className="w-5 h-5 text-[#059669]" />
      </div>

      <div className="px-6 py-4 bg-white border-b">
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                i <= currentStep ? 'bg-[#2563EB]' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <p className="text-center text-sm mt-2 text-gray-600">{steps[currentStep]}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <AnimatePresence mode="wait">
          {currentStep === 0 && <Step1 key="step1" formData={formData} updateField={updateField} />}
          {currentStep === 1 && <Step2 key="step2" formData={formData} updateField={updateField} toggleArrayItem={toggleArrayItem} />}
          {currentStep === 2 && <Step3 key="step3" formData={formData} toggleArrayItem={toggleArrayItem} updateField={updateField} />}
          {currentStep === 3 && <Step4 key="step4" formData={formData} updateField={updateField} toggleArrayItem={toggleArrayItem} />}
          {currentStep === 4 && <Step5 key="step5" formData={formData} toggleArrayItem={toggleArrayItem} />}
        </AnimatePresence>
      </div>

      <div className="bg-white px-6 py-4 border-t">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          className="w-full h-14 rounded-xl font-semibold bg-[#2563EB] text-white flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
        >
          {currentStep === steps.length - 1 ? 'Save Details' : 'Next'}
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

/* =========================
   STEPS
========================= */

const Step1 = ({ formData, updateField }: any) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-4"
  >
    <Input label="Full Name" value={formData.name} onChange={v => updateField('name', v)} />

    <Input label="Age" value={formData.age} onChange={v => updateField('age', v)} />

    <ChecklistSingle
      label="Sex"
      options={['Male', 'Female', 'Other']}
      value={formData.sex}
      onChange={v => updateField('sex', v)}
    />
  </motion.div>
);

const Step2 = ({ formData, updateField, toggleArrayItem }: any) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-4"
  >
    <ChecklistMultiple
      label="Allergies (select all that apply)"
      options={['None', 'Peanuts', 'Dust/Pollen', 'Penicillin', 'Seafood', 'Milk/Dairy', 'Other']}
      value={Array.isArray(formData.allergies) ? formData.allergies : []}
      onChange={item => toggleArrayItem('allergies', item)}
    />
    {(Array.isArray(formData.allergies) ? formData.allergies : []).includes('Other') && (
      <Textarea label="Specify other allergies" value={formData.allergies} onChange={v => updateField('allergies', v)} />
    )}

    <ChecklistMultiple
      label="Previous illness (select all that apply)"
      options={['None', 'Diabetes', 'BP', 'Asthma', 'Other']}
      value={Array.isArray(formData.history) ? formData.history : []}
      onChange={item => toggleArrayItem('history', item)}
    />
    {(Array.isArray(formData.history) ? formData.history : []).includes('Other') && (
      <Textarea label="Specify other illness" value={formData.history} onChange={v => updateField('history', v)} />
    )}

    <ChecklistMultiple
      label="Current problem (select all that apply)"
      options={['Fever', 'Pain', 'Breathing issue', 'Weakness', 'Other']}
      value={Array.isArray(formData.chiefComplaints) ? formData.chiefComplaints : []}
      onChange={item => toggleArrayItem('chiefComplaints', item)}
    />
    {(Array.isArray(formData.chiefComplaints) ? formData.chiefComplaints : []).includes('Other') && (
      <Textarea label="Specify other problem" value={formData.chiefComplaints} onChange={v => updateField('chiefComplaints', v)} />
    )}

    <ChecklistSingle
      label="Problem duration"
      options={['Today', 'Few days', 'More than 1 week', 'Long-term']}
      value={formData.presentIllness}
      onChange={v => updateField('presentIllness', v)}
    />
  </motion.div>
);

const Step3 = ({ formData, toggleArrayItem, updateField }: any) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-4"
  >
    <ChecklistMultiple
      label="Heart/Circulation symptoms"
      options={['Chest pain', 'Palpitations', 'Swelling', 'None']}
      value={formData.cvs}
      onChange={item => toggleArrayItem('cvs', item)}
    />

    <ChecklistMultiple
      label="Breathing symptoms"
      options={['Cough', 'Shortness of breath', 'Wheezing', 'None']}
      value={formData.rs}
      onChange={item => toggleArrayItem('rs', item)}
    />

    <Textarea
      label="Dental issues (if any)"
      value={formData.dental}
      onChange={v => updateField('dental', v)}
    />

    <Textarea
      label="Gynecological issues (if any)"
      value={formData.gyn}
      onChange={v => updateField('gyn', v)}
    />

    <Textarea
      label="Eye issues (if any)"
      value={formData.eyes}
      onChange={v => updateField('eyes', v)}
    />

    <Textarea
      label="ENT issues (if any)"
      value={formData.ent}
      onChange={v => updateField('ent', v)}
    />
  </motion.div>
);

const Step4 = ({ formData, updateField, toggleArrayItem }: any) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-4"
  >
    <Textarea
      label="Past medical history"
      value={formData.pastMedical}
      onChange={v => updateField('pastMedical', v)}
    />

    <Textarea
      label="Past surgical history"
      value={formData.pastSurgical}
      onChange={v => updateField('pastSurgical', v)}
    />

    <ChecklistMultiple
      label="Daily habits"
      options={['Smoking', 'Alcohol', 'Exercise regularly', 'None']}
      value={formData.habits}
      onChange={item => toggleArrayItem('habits', item)}
    />

    <Input
      label="Number of children"
      value={formData.children}
      onChange={v => updateField('children', v)}
    />
  </motion.div>
);

const Step5 = ({ formData, toggleArrayItem }: any) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-4"
  >
    <ChecklistMultiple
      label="Family medical history"
      options={['Diabetes', 'Heart disease', 'Cancer', 'Hypertension', 'Asthma', 'None']}
      value={formData.familyHistory}
      onChange={item => toggleArrayItem('familyHistory', item)}
    />
  </motion.div>
);
