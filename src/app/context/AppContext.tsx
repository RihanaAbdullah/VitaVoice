import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface HealthCondition {
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
}

export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  conditions: string[];
  allergies: string[];
  photo?: string;
  // Extended health profile fields
  currentSymptoms?: string[];
  healthConditions?: HealthCondition[];
  familyHistory?: string[];
  dietaryPreference?: 'vegetarian' | 'non-vegetarian' | 'vegan';
  cuisinePreference?: 'north-indian' | 'south-indian' | 'east-indian' | 'west-indian' | 'all-indian';
  foodAllergies?: string[];
  foodIntolerances?: string[];
}

export interface MealSuggestion {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  cuisine: string;
  dietType: 'vegetarian' | 'non-vegetarian' | 'vegan';
  calories: number;
  ingredients: string[];
  macros: {
    carbs: number;
    protein: number;
    fat: number;
    fiber: number;
  };
  healthNote: string;
  preparationTime: number;
}

export interface MealPlan {
  id: string;
  memberId: string;
  date: Date;
  totalCalories: number;
  meals: {
    breakfast?: MealSuggestion;
    lunch?: MealSuggestion;
    dinner?: MealSuggestion;
    snacks?: MealSuggestion;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  hasVoice?: boolean;
}

export interface HistoryEntry {
  id: string;
  date: Date;
  complaint: string;
  diagnosis: string;
  severity: 'low' | 'medium' | 'high';
  duration: string;
}

interface AppContextType {
  isOnline: boolean;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  familyMembers: FamilyMember[];
  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => void;
  updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => void;
  chatHistory: ChatMessage[];
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  medicalHistory: HistoryEntry[];
  addHistoryEntry: (entry: Omit<HistoryEntry, 'id' | 'date'>) => void;
  mealPlans: MealPlan[];
  saveMealPlan: (plan: Omit<MealPlan, 'id' | 'date'>) => void;
  getMealPlansForMember: (memberId: string) => MealPlan[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() => {
    const saved = localStorage.getItem('vitavoice_family');
    return saved ? JSON.parse(saved) : [];
  });
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [medicalHistory, setMedicalHistory] = useState<HistoryEntry[]>(() => {
    const saved = localStorage.getItem('vitavoice_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [mealPlans, setMealPlans] = useState<MealPlan[]>(() => {
    const saved = localStorage.getItem('vitavoice_mealplans');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('vitavoice_family', JSON.stringify(familyMembers));
  }, [familyMembers]);

  useEffect(() => {
    localStorage.setItem('vitavoice_history', JSON.stringify(medicalHistory));
  }, [medicalHistory]);

  useEffect(() => {
    localStorage.setItem('vitavoice_mealplans', JSON.stringify(mealPlans));
  }, [mealPlans]);

  const addFamilyMember = (member: Omit<FamilyMember, 'id'>) => {
    const newMember = { ...member, id: Date.now().toString() };
    setFamilyMembers(prev => [...prev, newMember]);
  };

  const updateFamilyMember = (id: string, updates: Partial<FamilyMember>) => {
    setFamilyMembers(prev => prev.map(member =>
      member.id === id ? { ...member, ...updates } : member
    ));
  };

  const addChatMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setChatHistory(prev => [...prev, newMessage]);
  };

  const addHistoryEntry = (entry: Omit<HistoryEntry, 'id' | 'date'>) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
      date: new Date()
    };
    setMedicalHistory(prev => [newEntry, ...prev]);
  };

  const saveMealPlan = (plan: Omit<MealPlan, 'id' | 'date'>) => {
    const newPlan = {
      ...plan,
      id: Date.now().toString(),
      date: new Date()
    };
    setMealPlans(prev => [newPlan, ...prev]);
  };

  const getMealPlansForMember = (memberId: string) => {
    return mealPlans.filter(plan => plan.memberId === memberId);
  };

  return (
    <AppContext.Provider
      value={{
        isOnline,
        selectedLanguage,
        setSelectedLanguage,
        familyMembers,
        addFamilyMember,
        updateFamilyMember,
        chatHistory,
        addChatMessage,
        medicalHistory,
        addHistoryEntry,
        mealPlans,
        saveMealPlan,
        getMealPlansForMember
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
