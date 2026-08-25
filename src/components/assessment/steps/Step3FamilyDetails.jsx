import React, { useState } from 'react';
import { useAssessment } from '../../../hooks/useAssessment';
import { validateStep3Fields } from '../../../hooks/useFormValidation';
import { StepNavigation } from '../../ui/StepNavigation';
import { FormField } from '../../ui/FormField';
import { NeumorphicDatePicker } from '../../ui/NeumorphicDatePicker';
import { EducationPlanModal } from '../modals/EducationPlanModal';
import { FloatingDropdownModal } from '../../ui/FloatingDropdownModal';

const CHILD_GOAL_TYPE_OPTIONS = [
  { label: 'Higher Studies', value: 'Higher Studies', subtext: 'University, degree & college funding', icon: '🎓' },
  { label: 'Marriage', value: 'Marriage', subtext: 'Wedding expenses & celebration fund', icon: '💍' },
  { label: 'Business Setup', value: 'Business Setup', subtext: 'Seed capital & startup funding for child', icon: '💼' },
  { label: 'Career Fund', value: 'Career Fund', subtext: 'Professional training, skills & certifications', icon: '🚀' },
  { label: 'Others', value: 'Others', subtext: 'Other long-term milestone goals', icon: '⭐' },
];

export function Step3FamilyDetails() {
  const {
    childrenCount,
    setChildrenCount,
    childrenData,
    updateChild,
    submitStep3,
    prevStep,
    isSubmitting
  } = useAssessment();

  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [selectedGoalIndex, setSelectedGoalIndex] = useState(0);

  const [activeGoalTypeTarget, setActiveGoalTypeTarget] = useState(null);

  const [touched, setTouched] = useState({});
  const [showAllErrors, setShowAllErrors] = useState(false);


  const errors = validateStep3Fields(childrenData, childrenCount);
  const isValid = Object.keys(errors).length === 0;

  const openEducationModal = (childIndex, goalIndex) => {
    setSelectedChildIndex(childIndex);
    setSelectedGoalIndex(goalIndex);
    setIsEducationModalOpen(true);
  };

  const handleChildInputChange = (index, field, value) => {
    updateChild(index, { [field]: value });
  };

  const handleChildGoalChange = (childIndex, goalIndex, field, value) => {
    const child = childrenData[childIndex] || {
      name: '',
      occupation: '',
      dependent: 'Yes',
      dob: '',
      age: '',
      goalType: '',
      targetYear: '',
      todaysCost: '',
      goals: [{ id: Date.now() + Math.random(), goalType: '', targetYear: '', todaysCost: '' }]
    };
    const goalsList = child.goals && Array.isArray(child.goals) ? child.goals : [
      { id: Date.now() + Math.random(), goalType: child.goalType || '', targetYear: child.targetYear || '', todaysCost: child.todaysCost || '' }
    ];
    const updatedGoals = goalsList.map((g, gIdx) => {
      if (gIdx === goalIndex) {
        return { ...g, [field]: value };
      }
      return g;
    });
    updateChild(childIndex, { goals: updatedGoals });
  };

  const handleAddGoalToChild = (childIndex) => {
    const child = childrenData[childIndex] || {
      name: '',
      occupation: '',
      dependent: 'Yes',
      dob: '',
      age: '',
      goalType: '',
      targetYear: '',
      todaysCost: '',
      goals: []
    };
    const goalsList = child.goals && Array.isArray(child.goals) ? child.goals : [
      { id: Date.now() + Math.random(), goalType: child.goalType || '', targetYear: child.targetYear || '', todaysCost: child.todaysCost || '' }
    ];
    const updatedGoals = [
      ...goalsList,
      { id: Date.now() + Math.random(), goalType: '', targetYear: '', todaysCost: '' }
    ];
    updateChild(childIndex, { goals: updatedGoals });
  };

  const handleRemoveGoalFromChild = (childIndex, goalIndex) => {
    const child = childrenData[childIndex];
    if (!child || !child.goals || child.goals.length <= 1) return;
    const updatedGoals = child.goals.filter((_, gIdx) => gIdx !== goalIndex);
    updateChild(childIndex, { goals: updatedGoals });
  };

  const handleBlur = (childIndex, fieldName) => {
    setTouched(prev => ({ ...prev, [`${childIndex}-${fieldName}`]: true }));
  };

  const handleNext = () => {
    setShowAllErrors(true);
    if (isValid) {
      submitStep3();
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col">
      <div className="w-full flex-1 flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-10 md:gap-12 lg:gap-16 items-start flex-1">
          
          {/* Left Column: Form Fields */}
          <div className="space-y-7 w-full">
            
            <div className="space-y-2">
              <h1 className="font-heading text-[26px] sm:text-[32px] lg:text-[34px] font-black leading-tight text-[#0F172A]">
                Family Details
              </h1>
              <p className="text-sm leading-relaxed max-w-lg font-medium text-[#475569]">
                Help us understand your family structure and financial responsibilities so we can build a retirement strategy that protects your family.
              </p>
            </div>

            {/* Number of Children selector */}
            <div className="glass-morphism-card p-5 sm:p-6 rounded-[24px] space-y-5">
              <div className="space-y-1.5">
                <label className="block text-[15px] sm:text-base font-black text-[#0F172A] tracking-wide select-none">
                  Number of Children <span className="text-[#64748B] font-medium text-[13px] ml-1">(optional)</span>
                </label>
                <p className="text-[#475569] text-xs sm:text-[13px] font-medium leading-relaxed">
                  Select the number of dependent children to plan for their education, marriage, and other key milestones.
                </p>
              </div>
              
              <div className="flex flex-wrap sm:flex-nowrap gap-3 sm:gap-4 w-full">
                {[0, 1, 2, 3, '4+'].map((num) => {
                  const parsedNum = num === '4+' ? 4 : num;
                  const isSelected = num === '4+' ? childrenCount >= 4 : childrenCount === parsedNum;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setChildrenCount(parsedNum)}
                      className={`flex-1 min-w-[60px] h-12 sm:h-14 rounded-[1.25rem] text-sm sm:text-base font-bold transition-all duration-200 cursor-pointer flex items-center justify-center ${
                        isSelected 
                          ? 'glass-morphism-btn scale-[0.98]' 
                          : 'neu-btn-flat-inactive rounded-[1.25rem]'
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>

              {/* Show controls to add more children if childrenCount is 4 or more */}
              {childrenCount >= 4 && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 mt-2 border-t border-[#77B1EC]/30 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-bold text-[#64748B] uppercase tracking-wider select-none">
                      Total Children
                    </span>
                    <span className="flex items-center justify-center glass-morphism-btn w-8 h-8 rounded-full font-extrabold text-sm text-white">
                      {childrenCount}
                    </span>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setChildrenCount(childrenCount + 1)}
                      className="flex-1 sm:flex-none px-4 h-10 rounded-xl text-[13px] font-bold neu-btn-flat-inactive flex items-center justify-center hover:text-[#2459D2] cursor-pointer whitespace-nowrap transition-all"
                    >
                      + Add More
                    </button>
                    <button
                      type="button"
                      onClick={() => childrenCount > 4 && setChildrenCount(childrenCount - 1)}
                      className="flex-1 sm:flex-none px-4 h-10 rounded-xl text-[13px] font-bold neu-btn-flat-inactive flex items-center justify-center hover:text-red-500 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap transition-all"
                      disabled={childrenCount <= 4}
                    >
                      - Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Dynamic Child Details Forms */}
            <div className="space-y-6 pt-2">
              {Array.from({ length: childrenCount }).map((_, i) => {
                const child = childrenData[i] || { name: '', occupation: '', dependent: 'Yes', dob: '', age: '', goalType: '', targetYear: '', todaysCost: '', goals: [{ id: 'g-' + i, goalType: '', targetYear: '', todaysCost: '' }] };
                const goalsList = child.goals && Array.isArray(child.goals) ? child.goals : [
                  { id: Date.now() + Math.random(), goalType: child.goalType || '', targetYear: child.targetYear || '', todaysCost: child.todaysCost || '' }
                ];
                return (
                  <div key={i} className="space-y-8 border-b border-[#77B1EC]/30 pb-8 last:border-b-0 last:pb-0 pt-4">
                    
                    {/* CHILD X INFORMATION CONTAINER - GLASSY MORPHISM CARD */}
                    <div className="glass-morphism-card p-5 sm:p-6 rounded-[24px] space-y-6">
                      
                      {/* CHILD X INFORMATION HEADER */}
                      <div className="text-[#2459D2] font-bold text-xs uppercase tracking-wider select-none">
                        CHILD {i + 1} INFORMATION
                      </div>

                      {/* Full Name */}
                      <FormField
                        label="Full Name"
                        name={`childName-${i}`}
                        value={child.name}
                        onChange={(e) => handleChildInputChange(i, 'name', e.target.value)}
                        onBlur={() => handleBlur(i, 'name')}
                        error={(touched[`${i}-name`] || showAllErrors) ? errors[i]?.name : null}
                        placeholder="Enter child's full name"
                        required={true}
                      />

                      {/* Dependent & DOB Row */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-1.5 w-full">
                          <label className="block text-[13px] font-bold text-[#0E2C7E] tracking-wide select-none">
                            Financially Dependent?<span className="text-[#2459D2] font-bold ml-0.5">*</span>
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {['Yes', 'No'].map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => handleChildInputChange(i, 'dependent', opt)}
                                className={`py-3.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                                  child.dependent === opt ? 'glass-morphism-btn text-white' : 'bg-white/60 text-[#64748B] border border-[#77B1EC]/30'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>

                        <NeumorphicDatePicker
                          label="Date Of Birth"
                          name={`childDob-${i}`}
                          value={child.dob}
                          onChange={(e) => handleChildInputChange(i, 'dob', e.target.value)}
                          onBlur={() => handleBlur(i, 'dob')}
                          error={(touched[`${i}-dob`] || showAllErrors) ? errors[i]?.dob : null}
                          required={true}
                        />
                      </div>

                      {/* Calculated Age */}
                      <div className="space-y-1.5 w-full">
                        <label className="block text-[13px] font-bold text-[#0E2C7E] tracking-wide select-none">
                          Calculated Age<span className="text-[#2459D2] font-bold ml-0.5">*</span>
                        </label>
                        <input 
                          type="text"
                          value={child.age || ''}
                          readOnly
                          placeholder="Calculated age here"
                          className="neu-field w-full px-4 py-3.5 text-sm font-semibold rounded-2xl outline-none transition-all duration-150 text-[#64748B] cursor-not-allowed"
                        />
                      </div>

                    </div>

                    {/* CHILD X GOALS CONTAINER WITH BRACKET CONNECTOR */}
                    <div className="relative pl-6 sm:pl-7 ml-1 sm:ml-2 space-y-6">
                      {/* Left bracket connector */}
                      <div className="absolute left-0 top-1 bottom-1 w-[14px] border-l-[3px] border-t-[3px] border-b-[3px] border-[#2459D2] rounded-l-xl select-none pointer-events-none" />
                      
                      {/* CHILD X GOALS HEADER */}
                      <div className="text-[#2459D2] font-bold text-xs uppercase tracking-wider select-none">
                        CHILD {i + 1} GOALS
                      </div>

                      {/* Dynamic Goal Sections */}
                      <div className="space-y-5">
                        {goalsList.map((g, gIdx) => {
                          const hasGoalTypeErr = errors[i]?.goals?.[gIdx]?.goalType;
                          const hasTargetYearErr = errors[i]?.goals?.[gIdx]?.targetYear;
                          const hasTodaysCostErr = errors[i]?.goals?.[gIdx]?.todaysCost;

                          return (
                            <div key={gIdx} className="space-y-4 glass-morphism-card p-5 rounded-[24px] relative pt-6">
                              {goalsList.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveGoalFromChild(i, gIdx)}
                                  className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-xs font-bold transition-all cursor-pointer outline-none select-none"
                                >
                                  Remove Goal
                                </button>
                              )}

                              <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider select-none mb-1">
                                Goal #{gIdx + 1}
                              </div>

                              {/* Goal Type */}
                              <div className="space-y-1.5 w-full">
                                <label className="block text-[13px] font-bold text-[#0E2C7E] tracking-wide select-none">
                                  Goal Type<span className="text-[#2459D2] font-bold ml-0.5">*</span>
                                </label>
                                <button
                                  type="button"
                                  onClick={() => setActiveGoalTypeTarget({ childIndex: i, goalIndex: gIdx })}
                                  className={`${
                                    g.goalType ? 'neu-field-filled' : 'neu-field'
                                  } w-full px-5 py-4 pr-10 text-base font-semibold rounded-2xl outline-none transition-all duration-200 text-left flex justify-between items-center cursor-pointer hover:border-[#2459D2]/50 ${
                                    (touched[`${i}-goals-${gIdx}-goalType`] || showAllErrors) && hasGoalTypeErr ? 'border-red-400' : ''
                                  }`}
                                >
                                  <span className={g.goalType ? 'text-[#0E2C7E]' : 'text-[#64748B]'}>{g.goalType || 'Select an option'}</span>
                                  <svg className="w-4.5 h-4.5 text-[#2459D2] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                                <FloatingDropdownModal
                                  isOpen={activeGoalTypeTarget?.childIndex === i && activeGoalTypeTarget?.goalIndex === gIdx}
                                  onClose={() => setActiveGoalTypeTarget(null)}
                                  title="Select Child Goal Type"
                                  subtitle="Choose milestone financial goal for your child"
                                  placeholder="Search goal type..."
                                  selectedValue={g.goalType}
                                  onSelect={(opt) => {
                                    handleChildGoalChange(i, gIdx, 'goalType', opt.value);
                                    handleBlur(i, `goals-${gIdx}-goalType`);
                                  }}
                                  options={CHILD_GOAL_TYPE_OPTIONS}
                                />
                                {(touched[`${i}-goals-${gIdx}-goalType`] || showAllErrors) && hasGoalTypeErr && (
                                  <span className="text-xs text-red-500 font-medium block mt-1">{hasGoalTypeErr}</span>
                                )}
                              </div>

                              {/* Target Year & Today's Cost Row */}
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <FormField
                                  label="Target Year"
                                  name={`childTargetYear-${i}-${gIdx}`}
                                  value={g.targetYear}
                                  onChange={(e) => handleChildGoalChange(i, gIdx, 'targetYear', e.target.value)}
                                  onBlur={() => handleBlur(i, `goals-${gIdx}-targetYear`)}
                                  error={(touched[`${i}-goals-${gIdx}-targetYear`] || showAllErrors) ? hasTargetYearErr : null}
                                  placeholder="Enter target year"
                                  type="number"
                                  required={true}
                                />
                                <FormField
                                  label={g.goalType?.toLowerCase().includes('education') || g.goalType?.toLowerCase().includes('graduation') || g.goalType?.toLowerCase().includes('studies') || g.goalType === 'Higher Education' || g.goalType === 'Higher Studies' ? "Approx. Today's Cost" : "Today's Cost"}
                                  name={`childTodaysCost-${i}-${gIdx}`}
                                  value={g.todaysCost}
                                  onChange={(e) => handleChildGoalChange(i, gIdx, 'todaysCost', e.target.value)}
                                  onBlur={() => handleBlur(i, `goals-${gIdx}-todaysCost`)}
                                  error={(touched[`${i}-goals-${gIdx}-todaysCost`] || showAllErrors) ? hasTodaysCostErr : null}
                                  placeholder="Enter today's cost (approx.)"
                                  type="number"
                                  required={true}
                                />
                              </div>

                              {/* Education Planner Tool link */}
                              {(g.goalType === 'Higher Education' || g.goalType === 'Higher Studies') && (
                                <div className="pt-1">
                                  <a 
                                    href="#education-plan"
                                    onClick={(e) => { e.preventDefault(); openEducationModal(i, gIdx); }}
                                    className="text-[#2459D2] text-xs font-bold hover:underline inline-flex items-center gap-1.5 transition-all select-none"
                                  >
                                    Plan with Dream Colleges / Budget Calculator
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                  </a>
                                </div>
                              )}

                            </div>
                          );
                        })}
                      </div>

                      {/* Action buttons under child */}
                      <div className="flex flex-wrap items-center gap-4 pt-2">
                        <button 
                          type="button"
                          onClick={() => handleAddGoalToChild(i)}
                          className="neu-btn-flat-inactive text-xs font-bold px-4 py-2.5 rounded-2xl hover:text-[#2459D2] transition-all cursor-pointer"
                        >
                          + Add Another Goal
                        </button>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>

            {/* CTA to add more child forms at the end of the list */}
            {childrenCount >= 4 && (
              <div className="pt-2 pb-6 flex justify-start animate-fade-in select-none">
                <button
                  type="button"
                  onClick={() => setChildrenCount(childrenCount + 1)}
                  className="glass-morphism-btn px-5 py-3.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 hover:shadow-md hover:translate-y-[-1px] active:translate-y-0 transition-all cursor-pointer text-white"
                >
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  + Add Another Child
                </button>
              </div>
            )}

            {/* Navigation Actions */}
            <StepNavigation
              onBack={prevStep}
              onNext={handleNext}
              isDisabled={false}
              isLoading={isSubmitting}
            />

          </div>

          {/* Right Column: Protective hand family illustration */}
          <div className="w-full self-stretch flex items-start justify-center pt-8">
            <div className="md:sticky md:top-32 w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[420px] select-none pointer-events-none drop-shadow-md">
              <img 
                src="/assets/family_neu.png" 
                alt="3D Protective hand family illustration"
                className="w-full h-auto object-contain animate-float"
              />
            </div>
          </div>

        </div>
      </div>

      <EducationPlanModal
        isOpen={isEducationModalOpen}
        onClose={() => setIsEducationModalOpen(false)}
        child={childrenData[selectedChildIndex]?.goals?.[selectedGoalIndex]}
        onSave={(data) => {
          const child = childrenData[selectedChildIndex];
          const goalsList = child?.goals && Array.isArray(child.goals) ? child.goals : [
            { id: Date.now() + Math.random(), goalType: child?.goalType || '', targetYear: child?.targetYear || '', todaysCost: child?.todaysCost || '' }
          ];
          const updatedGoals = goalsList.map((g, gIdx) => {
            if (gIdx === selectedGoalIndex) {
              return { ...g, ...data };
            }
            return g;
          });
          updateChild(selectedChildIndex, { goals: updatedGoals });
          setIsEducationModalOpen(false);
        }}
      />
    </div>
  );
}