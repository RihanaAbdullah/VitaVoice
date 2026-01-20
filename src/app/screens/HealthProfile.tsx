import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, User, AlertCircle, Apple, Edit } from 'lucide-react';
import { useApp, FamilyMember } from '@/app/context/AppContext';
import { HealthProfileForm } from '@/app/components/HealthProfileForm';

export const HealthProfile = () => {
  const navigate = useNavigate();
  const { familyMembers, addFamilyMember, updateFamilyMember } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | undefined>();

  const quickLinks = [
    { icon: AlertCircle, title: 'Allergies', description: 'Track your allergies', route: '/allergies', color: '#EA580C' },
    { icon: Apple, title: 'Diet & Nutrition', description: 'Meal plans & nutrition', route: '/diet-nutrition', color: '#059669' }
  ];

  const handleSaveProfile = (data: Partial<FamilyMember>) => {
    if (editingMember) {
      updateFamilyMember(editingMember.id, data);
    } else {
      addFamilyMember({
        ...data,
        conditions: data.healthConditions?.map(c => c.name) || [],
        allergies: data.foodAllergies || []
      } as Omit<FamilyMember, 'id'>);
    }
    setShowForm(false);
    setEditingMember(undefined);
  };

  const handleAddNew = () => {
    setEditingMember(undefined);
    setShowForm(true);
  };

  const handleEdit = (member: FamilyMember) => {
    setEditingMember(member);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-white px-4 py-4 flex items-center gap-3 shadow-sm sticky top-0 z-10">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/home')}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </motion.button>
        <h1 className="text-xl font-bold text-[#1E293B]">Health Profiles</h1>
      </div>

      <div className="px-6 py-6">
        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {quickLinks.map((link, index) => (
            <motion.button
              key={link.title}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(link.route)}
              className="bg-white rounded-xl p-4 shadow-md border border-gray-100 text-left"
            >
              <div className="w-10 h-10 rounded-lg mb-2 flex items-center justify-center" style={{ backgroundColor: `${link.color}15` }}>
                <link.icon className="w-5 h-5" style={{ color: link.color }} />
              </div>
              <h3 className="font-semibold text-[#1E293B] text-sm mb-1">{link.title}</h3>
              <p className="text-xs text-gray-500">{link.description}</p>
            </motion.button>
          ))}
        </div>

        <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Family Members</h2>

        {familyMembers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <User className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Profiles Yet</h3>
            <p className="text-gray-500 mb-6">Add family members to track their health</p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddNew}
              className="px-6 py-3 bg-[#2563EB] text-white rounded-xl font-medium"
            >
              Add First Member
            </motion.button>
          </motion.div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {familyMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-4 shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-[#2563EB]/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-8 h-8 text-[#2563EB]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-[#1E293B]">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.age} years • {member.gender}</p>
                      <p className="text-xs text-gray-500 mt-1">Blood: {member.bloodType}</p>

                      {/* Health Info */}
                      <div className="mt-3 space-y-1">
                        {member.dietaryPreference && (
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md mr-2 capitalize">
                            {member.dietaryPreference}
                          </span>
                        )}
                        {member.cuisinePreference && member.cuisinePreference !== 'all-indian' && (
                          <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-md mr-2 capitalize">
                            {member.cuisinePreference.replace('-', ' ')}
                          </span>
                        )}
                        {member.healthConditions && member.healthConditions.length > 0 && (
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md mr-2">
                            {member.healthConditions.length} condition(s)
                          </span>
                        )}
                        {member.foodAllergies && member.foodAllergies.length > 0 && (
                          <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs rounded-md">
                            {member.foodAllergies.length} allergy(ies)
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleEdit(member)}
                      className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddNew}
              className="w-full h-14 bg-white border-2 border-dashed border-[#2563EB] text-[#2563EB] rounded-xl flex items-center justify-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Add Family Member</span>
            </motion.button>
          </>
        )}
      </div>

      {/* Health Profile Form Modal */}
      {showForm && (
        <HealthProfileForm
          member={editingMember}
          onSave={handleSaveProfile}
          onClose={() => {
            setShowForm(false);
            setEditingMember(undefined);
          }}
        />
      )}
    </div>
  );
};