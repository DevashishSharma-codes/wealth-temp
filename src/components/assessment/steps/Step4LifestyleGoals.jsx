import React, { useState } from 'react';
import { useAssessment } from '../../../hooks/useAssessment';
import { validateStep4Fields } from '../../../hooks/useFormValidation';
import { GoalIcon } from '../../ui/GoalIcon';
import { TripPlanModal } from '../modals/TripPlanModal';
import { CustomGoalModal } from '../modals/CustomGoalModal';
import { StepNavigation } from '../../ui/StepNavigation';

/* ------------------------------------------------------------------
   Neumorphic design tokens — identical to Step1Communication
   Light source: top-left.
   Raised  -> shadow bottom-right (dark) + highlight top-left (light)
   Inset   -> inner shadow top-left (dark) + inner highlight bottom-right (light)
 ------------------------------------------------------------------ */
const SURFACE = '#FFFFFF';
const FIELD_BG = 'rgba(255, 255, 255, 0.65)';
const FIELD_BORDER = 'rgba(119, 177, 236, 0.4)';
const SHADOW_DARK = 'rgba(180, 205, 240, 0.6)';
const SHADOW_LIGHT = '#FFFFFF';
const TEXT_DARK = '#0F172A';
const TEXT_MUTED = '#475569';
const PLACEHOLDER = '#94A3B8';
const ORANGE = '#2459D2';
const ORANGE_DARK = '#153FA8';
const ORANGE_GLOW = 'rgba(36, 89, 210, 0.45)';
const ORANGE_BORDER = 'rgba(119, 177, 236, 0.6)';

/* Shadow helpers */
const neuRaised = `0 8px 24px -4px rgba(36, 89, 210, 0.12), inset 0 1.5px 2px rgba(255, 255, 255, 0.95), inset 0 0 20px 2px rgba(119, 177, 236, 0.45)`;
const neuRaisedSoft = `4px 4px 10px ${SHADOW_DARK}, -4px -4px 10px ${SHADOW_LIGHT}`;
const neuInsetBase = `inset 2px 2px 5px rgba(119, 177, 236, 0.15), inset -2px -2px 5px rgba(255, 255, 255, 0.95)`;
const neuInsetSoft = `inset 2px 2px 4px rgba(119, 177, 236, 0.15), inset -2px -2px 4px rgba(255, 255, 255, 0.95)`;

const inputBase =
  'neu-field w-full px-5 py-3.5 sm:py-4 text-base font-medium rounded-full outline-none transition-all duration-150';

export function Step4LifestyleGoals() {
  const {
    activeGoals,
    addGoal,
    removeGoal,
    updateGoal,
    childrenCount,
    submitStep4,
    prevStep,
    isSubmitting,
  } = useAssessment();

  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState(null);

  const [touched, setTouched] = useState({});
  const [showAllErrors, setShowAllErrors] = useState(false);

  const errors = validateStep4Fields(activeGoals);
  const isValid = Object.keys(errors).length === 0;

  const goalCategories = [
    'Home Purchase',
    'Car Purchase',
    'Home Renovation',
    'Holiday Home',
    'Foreign Tour',
    'Family Gifting',
    'Charity',
    'Child Birth Expenses',
    'Big Purchases',
    'Estate For Children',
  ];

  const customGoals = activeGoals.filter(
    (g) => g.type === 'Other' || g.type === 'Others' || (!goalCategories.includes(g.type) && g.type)
  );

  const handleGoalInputChange = (id, field, value) => {
    updateGoal(id, { [field]: value });
  };

  const handleBlur = (goalId, fieldName) => {
    setTouched(prev => ({ ...prev, [`${goalId}-${fieldName}`]: true }));
  };

  const handleNext = () => {
    setShowAllErrors(true);
    if (isValid) {
      submitStep4();
    }
  };

  const openTripModal = (goalId) => {
    setSelectedGoalId(goalId);
    setIsTripModalOpen(true);
  };

  return (
    <div
      className="w-full flex-1 flex flex-col s4-root"
      style={{ color: TEXT_DARK }}
    >
      <style>{`
        /* ── Inactive goal row (Bubbly Raised Pill) ── */
        .s4-root .s4-inactive-pill {
          background: #EEF2F6 !important;
          border: 1.5px solid rgba(255, 255, 255, 0.95) !important; 
          box-shadow:
            5px 5px 14px rgba(160, 185, 215, 0.38),
            -5px -5px 14px #FFFFFF,
            inset 0 1.5px 2px #FFFFFF,
            inset 2px 2px 4px rgba(180, 205, 235, 0.25),
            inset -2px -2px 4px #FFFFFF !important;
          border-radius: 9999px !important;
          color: ${TEXT_DARK} !important;
        }
        
        .s4-root .s4-inactive-pill:hover {
          background: #F8FAFC !important;
          border-color: #FFFFFF !important;
          box-shadow:
            7px 7px 18px rgba(160, 185, 215, 0.48),
            -6px -6px 18px #FFFFFF,
            inset 0 2px 3px #FFFFFF,
            inset 0 0 14px 2px rgba(119, 177, 236, 0.25) !important; 
          transform: translateY(-1px);
        }
        
        .s4-root .s4-inactive-pill:active {
          box-shadow:
            inset 3px 3px 6px #CAD5E2,
            inset -3px -3px 6px #FFFFFF !important; 
          transform: translateY(0);
        }

        /* ── Expanded goal card (Bubbly Morphism Card with Inner Shadows) ── */
        .s4-root .s4-card {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(240, 247, 255, 0.7) 50%,
            rgba(255, 255, 255, 0.85) 100%
          ) !important;
          backdrop-filter: blur(20px) saturate(180%) !important;
          -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
          border: 1.5px solid rgba(255, 255, 255, 0.95) !important;
          border-radius: 2rem !important;
          box-shadow:
            8px 12px 24px -4px rgba(160, 185, 215, 0.4),
            -8px -8px 24px 0 #FFFFFF,
            inset 0 2px 3px 0 #FFFFFF,
            inset 3px 3px 6px rgba(180, 205, 235, 0.35),
            inset -3px -3px 6px #FFFFFF,
            inset 0 0 18px 2px rgba(119, 177, 236, 0.2) !important;
        }

        /* ── Close (×) button ── */
        .s4-root .s4-close-btn {
          background: rgba(255, 255, 255, 0.6) !important;
          border: 1px solid rgba(255, 255, 255, 0.8) !important;
          box-shadow: 2px 2px 5px rgba(180, 205, 240, 0.35), -2px -2px 5px rgba(255, 255, 255, 0.95) !important;
          color: ${TEXT_MUTED} !important;
          transition: all 0.15s ease;
        }
        .s4-root .s4-close-btn:hover {
          background: rgba(255, 255, 255, 0.85) !important;
          box-shadow: 0 0 12px rgba(119, 177, 236, 0.5) !important;
          color: ${ORANGE} !important;
        }

        /* ── "Plan Your Trip" & "Add another" & "Add Other" secondary buttons ── */
        .s4-root .s4-secondary-btn {
          background: rgba(255, 255, 255, 0.55) !important;
          border: 1px solid rgba(255, 255, 255, 0.8) !important;
          box-shadow: 2px 2px 6px rgba(180, 205, 240, 0.35), -2px -2px 6px rgba(255, 255, 255, 0.95) !important;
          color: ${TEXT_DARK} !important;
          transition: all 0.15s ease;
        }
        .s4-root .s4-secondary-btn:hover {
          background: rgba(255, 255, 255, 0.8) !important;
          color: ${ORANGE} !important;
          box-shadow: 0 0 12px rgba(119, 177, 236, 0.4) !important;
        }
        .s4-root .s4-secondary-btn:active {
          box-shadow: ${neuInsetSoft} !important;
        }

        /* ── Card header divider ── */
        .s4-root .s4-card-header {
          border-bottom: 1px solid rgba(119, 177, 236, 0.3);
        }

        /* ── Back button ── */
        .s4-root .s4-back-btn {
          color: ${TEXT_DARK} !important;
        }

        /* ── Continue button (active) ── */
        .s4-root .s4-continue-active {
          background: radial-gradient(135% 135% at 50% 15%, #2459D2 0%, #153FA8 65%, #0E2C7E 100%) !important;
          border: 1.5px solid rgba(175, 215, 255, 0.7) !important;
          box-shadow: 0 8px 24px -4px rgba(36, 89, 210, 0.45), inset 0 1.5px 2px rgba(255, 255, 255, 0.85), inset 0 0 18px 3px rgba(119, 177, 236, 0.85) !important;
          color: #FFFFFF !important;
        }

        /* ── Continue button (disabled) ── */
        .s4-root .s4-continue-disabled {
          background: #E2E8F0 !important;
          box-shadow: none !important;
          color: #94A3B8 !important;
          cursor: not-allowed !important;
        }
      `}</style>

      <div className="w-full flex-1 flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-10 md:gap-12 lg:gap-16 items-start flex-1">

          {/* ── Left Column: List of Goals ── */}
          <div className="space-y-7 w-full">

            <div className="space-y-2">
              <h1
                className="font-heading text-[26px] sm:text-[32px] lg:text-[34px] font-extrabold leading-tight"
                style={{ color: TEXT_DARK }}
              >
                Lifestyle Goals
              </h1>
              <p className="text-sm leading-relaxed max-w-lg font-normal" style={{ color: TEXT_MUTED }}>
                Help us understand your lifestyle aspirations and future priorities so we can create a
                retirement plan that supports the life you envision.
              </p>
            </div>

            {/* ── Accordion List ── */}
            <div className="space-y-4 pt-2">
              {goalCategories.map((catName) => {
                const categoryInstances = activeGoals.filter((g) => g.type === catName);

                /* ── INACTIVE row (raised neumorphic pill) ── */
                if (categoryInstances.length === 0) {
                  return (
                    <button
                      key={catName}
                      type="button"
                      onClick={() => addGoal(catName)}
                      className="s4-inactive-pill w-full flex items-center justify-between rounded-2xl px-5 py-4 text-xs sm:text-sm font-bold text-left cursor-pointer transition-all duration-150"
                    >
                      <div className="flex items-center gap-3">
                        <GoalIcon type={catName} />
                        <span style={{ color: TEXT_DARK }}>{catName}</span>
                      </div>
                      <span style={{ color: ORANGE }} className="text-lg font-bold leading-none">+</span>
                    </button>
                  );
                }

                /* ── ACTIVE: expanded card(s) ── */
                return (
                  <div key={catName} className="space-y-4">
                    {categoryInstances.map((goal, idx) => (
                      <div
                        key={goal.id}
                        className="s4-card w-full rounded-[2rem] p-5 sm:p-6 relative space-y-5"
                      >
                        {/* Card header */}
                        <div className="s4-card-header flex items-center justify-between pb-3.5">
                          <div
                            className="flex items-center gap-3 font-bold text-sm sm:text-base"
                            style={{ color: TEXT_DARK }}
                          >
                            <GoalIcon type={catName} />
                            <span>
                              {catName}
                              {categoryInstances.length > 1 ? ` #${idx + 1}` : ''}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeGoal(goal.id)}
                            className="s4-close-btn w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold select-none outline-none cursor-pointer"
                          >
                            &times;
                          </button>
                        </div>

                        {/* Input grid */}
                        {catName === 'Foreign Tour' ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              {/* Target Year */}
                              <div className="space-y-1.5 flex flex-col justify-end">
                                <div className="min-h-[42px] flex items-end">
                                  <label className="block text-[13px] font-bold tracking-wide select-none" style={{ color: TEXT_DARK }}>
                                    Target Year
                                  </label>
                                </div>
                                <input
                                  type="number"
                                  value={goal.targetYear || ''}
                                  onChange={(e) => handleGoalInputChange(goal.id, 'targetYear', e.target.value)}
                                  onBlur={() => handleBlur(goal.id, 'targetYear')}
                                  placeholder="Enter target year"
                                  className={`${
                                    goal.targetYear !== undefined && goal.targetYear !== null && goal.targetYear.toString().length > 0
                                      ? 'neu-field-filled'
                                      : 'neu-field'
                                  } w-full px-4 py-3.5 text-base font-medium rounded-2xl outline-none transition-all duration-200 ${
                                    (touched[`${goal.id}-targetYear`] || showAllErrors) && errors[goal.id]?.targetYear ? 'border-red-400' : ''
                                  }`}
                                />
                                {(touched[`${goal.id}-targetYear`] || showAllErrors) && errors[goal.id]?.targetYear && (
                                  <span className="text-xs text-red-500 font-medium block mt-1">{errors[goal.id].targetYear}</span>
                                )}
                              </div>

                              {/* Today's Cost (per person) */}
                              <div className="space-y-1.5 flex flex-col justify-end">
                                <div className="min-h-[42px] flex items-end">
                                  <label className="block text-[13px] font-bold tracking-wide select-none" style={{ color: TEXT_DARK }}>
                                    Approx. Today's Cost (per person)
                                  </label>
                                </div>
                                <input
                                  type="number"
                                  value={
                                    goal.costPerPerson !== undefined
                                      ? goal.costPerPerson
                                      : goal.todaysCost && goal.travellers
                                      ? Math.round(Number(goal.todaysCost) / Number(goal.travellers))
                                      : goal.todaysCost || ''
                                  }
                                  onChange={(e) => {
                                    const perPerson = e.target.value;
                                    const people = Number(goal.travellers) || (2 + (childrenCount || 0));
                                    const total = (Number(perPerson) || 0) * people;
                                    updateGoal(goal.id, {
                                      costPerPerson: perPerson,
                                      travellers: String(people),
                                      todaysCost: String(total),
                                    });
                                  }}
                                  onBlur={() => handleBlur(goal.id, 'todaysCost')}
                                  placeholder="Cost per person"
                                  className={`${
                                    goal.costPerPerson || goal.todaysCost ? 'neu-field-filled' : 'neu-field'
                                  } w-full px-4 py-3.5 text-base font-medium rounded-2xl outline-none transition-all duration-200 ${
                                    (touched[`${goal.id}-todaysCost`] || showAllErrors) && errors[goal.id]?.todaysCost ? 'border-red-400' : ''
                                  }`}
                                />
                                {(touched[`${goal.id}-todaysCost`] || showAllErrors) && errors[goal.id]?.todaysCost && (
                                  <span className="text-xs text-red-500 font-medium block mt-1">{errors[goal.id].todaysCost}</span>
                                )}
                              </div>

                              {/* Number of People */}
                              <div className="space-y-1.5 flex flex-col justify-end">
                                <div className="min-h-[42px] flex items-end">
                                  <label className="block text-[13px] font-bold tracking-wide select-none" style={{ color: TEXT_DARK }}>
                                    Number of People
                                  </label>
                                </div>
                                <input
                                  type="number"
                                  min="1"
                                  value={goal.travellers !== undefined ? goal.travellers : 2 + (childrenCount || 0)}
                                  onChange={(e) => {
                                    const people = e.target.value;
                                    const perPerson =
                                      goal.costPerPerson !== undefined
                                        ? Number(goal.costPerPerson)
                                        : goal.todaysCost && goal.travellers
                                        ? Math.round(Number(goal.todaysCost) / Number(goal.travellers))
                                        : Number(goal.todaysCost) || 0;
                                    const total = perPerson * (Number(people) || 1);
                                    updateGoal(goal.id, {
                                      travellers: people,
                                      costPerPerson: String(perPerson),
                                      todaysCost: String(total),
                                    });
                                  }}
                                  placeholder="Number of travellers"
                                  className="neu-field w-full px-4 py-3.5 text-base font-medium rounded-2xl outline-none transition-all duration-200"
                                />
                              </div>
                            </div>

                            {/* Total Today's Cost Calculation Box */}
                            <div className="p-3.5 bg-[#77B1EC]/15 border border-[#77B1EC]/30 rounded-2xl text-xs font-semibold text-[#0E2C7E] flex flex-wrap items-center justify-between gap-2 shadow-xs">
                              <span className="text-[#64748B] font-bold uppercase tracking-wider text-[11px]">Calculated Total Today's Cost:</span>
                              <div>
                                <span>₹{(Number(goal.costPerPerson || (goal.todaysCost && goal.travellers ? Math.round(Number(goal.todaysCost) / Number(goal.travellers)) : goal.todaysCost)) || 0).toLocaleString('en-IN')} (per person) × {Number(goal.travellers || 2 + (childrenCount || 0))} people = </span>
                                <span className="text-[#2459D2] font-extrabold text-sm ml-1">
                                  ₹{(Number(goal.todaysCost) || 0).toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label
                                className="block text-[13px] font-bold tracking-wide select-none"
                                style={{ color: TEXT_DARK }}
                              >
                                Target Year
                              </label>
                              <input
                                type="number"
                                value={goal.targetYear}
                                onChange={(e) =>
                                  handleGoalInputChange(goal.id, 'targetYear', e.target.value)
                                }
                                onBlur={() => handleBlur(goal.id, 'targetYear')}
                                placeholder="Enter target year"
                                className={`${
                                  goal.targetYear !== undefined && goal.targetYear !== null && goal.targetYear.toString().length > 0
                                    ? 'neu-field-filled'
                                    : 'neu-field'
                                } w-full px-5 py-4 text-base font-medium rounded-2xl outline-none transition-all duration-200 ${
                                  (touched[`${goal.id}-targetYear`] || showAllErrors) && errors[goal.id]?.targetYear ? 'border-red-400' : ''
                                }`}
                              />
                              {(touched[`${goal.id}-targetYear`] || showAllErrors) && errors[goal.id]?.targetYear && (
                                <span className="text-xs text-red-500 font-medium block mt-1">{errors[goal.id].targetYear}</span>
                              )}
                            </div>

                            <div className="space-y-1.5">
                              <label
                                className="block text-[13px] font-bold tracking-wide select-none"
                                style={{ color: TEXT_DARK }}
                              >
                                Today's Cost
                              </label>
                              <input
                                type="number"
                                value={goal.todaysCost}
                                onChange={(e) =>
                                  handleGoalInputChange(goal.id, 'todaysCost', e.target.value)
                                }
                                onBlur={() => handleBlur(goal.id, 'todaysCost')}
                                placeholder="Enter today's cost"
                                className={`${
                                  goal.todaysCost !== undefined && goal.todaysCost !== null && goal.todaysCost.toString().length > 0
                                    ? 'neu-field-filled'
                                    : 'neu-field'
                                } w-full px-5 py-4 text-base font-medium rounded-2xl outline-none transition-all duration-200 ${
                                  (touched[`${goal.id}-todaysCost`] || showAllErrors) && errors[goal.id]?.todaysCost ? 'border-red-400' : ''
                                }`}
                              />
                              {(touched[`${goal.id}-todaysCost`] || showAllErrors) && errors[goal.id]?.todaysCost && (
                                <span className="text-xs text-red-500 font-medium block mt-1">{errors[goal.id].todaysCost}</span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Foreign Tour: "Plan Your Trip" link-button */}
                        {catName === 'Foreign Tour' && (
                          <div className="pt-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                openTripModal(goal.id);
                              }}
                              className="s4-secondary-btn text-xs font-bold px-5 py-3 rounded-2xl cursor-pointer inline-flex items-center gap-1.5"
                            >
                              Plan Your Trip in Detail
                              <svg
                                className="w-3.5 h-3.5"
                                style={{ color: ORANGE }}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* "Add another" — Available for all categories */}
                    <div className="text-right pt-1">
                      <button
                        key={`add-another-${catName}`}
                        type="button"
                        onClick={() => addGoal(catName)}
                        className="s4-secondary-btn text-xs font-bold px-5 py-3 rounded-2xl cursor-pointer select-none"
                      >
                        + Add another {catName}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Custom Goals List ── */}
            {customGoals.length > 0 && (
              <div className="space-y-4 pt-2">
                {customGoals.map((goal, idx) => (
                  <div
                    key={goal.id}
                    className="s4-card w-full rounded-[2rem] p-5 sm:p-6 relative space-y-5"
                  >
                    {/* Card header */}
                    <div className="s4-card-header flex items-center justify-between pb-3.5">
                      <div
                        className="flex items-center gap-3 font-bold text-sm sm:text-base"
                        style={{ color: TEXT_DARK }}
                      >
                        <GoalIcon type="Other" />
                        <span className="flex items-center gap-2">
                          {goal.goalName || goal.name || `Custom Goal #${idx + 1}`}
                          <span className="text-[11px] font-normal text-[#2459D2] bg-[#77B1EC]/20 px-2.5 py-0.5 rounded-full border border-[#77B1EC]/40">
                            Custom
                          </span>
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeGoal(goal.id)}
                        className="s4-close-btn w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold select-none outline-none cursor-pointer"
                      >
                        &times;
                      </button>
                    </div>

                    {/* Input grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Goal Name */}
                      <div className="space-y-1.5 sm:col-span-1 flex flex-col justify-end">
                        <div className="min-h-[42px] flex items-end">
                          <label
                            className="block text-[13px] font-bold tracking-wide select-none"
                            style={{ color: TEXT_DARK }}
                          >
                            Goal Name
                          </label>
                        </div>
                        <input
                          type="text"
                          value={goal.goalName || ''}
                          onChange={(e) =>
                            handleGoalInputChange(goal.id, 'goalName', e.target.value)
                          }
                          placeholder="e.g. World Cup Trip"
                          className={`${
                            goal.goalName ? 'neu-field-filled' : 'neu-field'
                          } w-full px-4 py-3.5 text-base font-medium rounded-2xl outline-none transition-all duration-200`}
                        />
                      </div>

                      {/* Target Year */}
                      <div className="space-y-1.5 flex flex-col justify-end">
                        <div className="min-h-[42px] flex items-end">
                          <label
                            className="block text-[13px] font-bold tracking-wide select-none"
                            style={{ color: TEXT_DARK }}
                          >
                            Target Year
                          </label>
                        </div>
                        <input
                          type="number"
                          value={goal.targetYear || ''}
                          onChange={(e) =>
                            handleGoalInputChange(goal.id, 'targetYear', e.target.value)
                          }
                          onBlur={() => handleBlur(goal.id, 'targetYear')}
                          placeholder="Target year"
                          className={`${
                            goal.targetYear !== undefined && goal.targetYear !== null && goal.targetYear.toString().length > 0
                              ? 'neu-field-filled'
                              : 'neu-field'
                          } w-full px-4 py-3.5 text-base font-medium rounded-2xl outline-none transition-all duration-200 ${
                            (touched[`${goal.id}-targetYear`] || showAllErrors) && errors[goal.id]?.targetYear ? 'border-red-400' : ''
                          }`}
                        />
                        {(touched[`${goal.id}-targetYear`] || showAllErrors) && errors[goal.id]?.targetYear && (
                          <span className="text-xs text-red-500 font-medium block mt-1">{errors[goal.id].targetYear}</span>
                        )}
                      </div>

                      {/* Today's Cost */}
                      <div className="space-y-1.5 flex flex-col justify-end">
                        <div className="min-h-[42px] flex items-end">
                          <label
                            className="block text-[13px] font-bold tracking-wide select-none"
                            style={{ color: TEXT_DARK }}
                          >
                            Today's Cost
                          </label>
                        </div>
                        <input
                          type="number"
                          value={goal.todaysCost || ''}
                          onChange={(e) =>
                            handleGoalInputChange(goal.id, 'todaysCost', e.target.value)
                          }
                          onBlur={() => handleBlur(goal.id, 'todaysCost')}
                          placeholder="Today's cost"
                          className={`${
                            goal.todaysCost !== undefined && goal.todaysCost !== null && goal.todaysCost.toString().length > 0
                              ? 'neu-field-filled'
                              : 'neu-field'
                          } w-full px-4 py-3.5 text-base font-medium rounded-2xl outline-none transition-all duration-200 ${
                            (touched[`${goal.id}-todaysCost`] || showAllErrors) && errors[goal.id]?.todaysCost ? 'border-red-400' : ''
                          }`}
                        />
                        {(touched[`${goal.id}-todaysCost`] || showAllErrors) && errors[goal.id]?.todaysCost && (
                          <span className="text-xs text-red-500 font-medium block mt-1">{errors[goal.id].todaysCost}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* "Add Other" button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsCustomModalOpen(true)}
                className="s4-secondary-btn text-xs font-bold px-6 py-3.5 rounded-2xl cursor-pointer"
              >
                + Add Other
              </button>
            </div>

            {/* ── Navigation ── */}
            <StepNavigation
              onBack={prevStep}
              onNext={handleNext}
              isLoading={isSubmitting}
            />
          </div>

          {/* ── Right Column: 3D Illustration ── */}
          <div className="w-full self-stretch flex items-start justify-center pt-8">
            <div className="md:sticky md:top-32 w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[420px] select-none pointer-events-none drop-shadow-md">
              <img
                src="/assets/target_neu.png"
                alt="3D Target goals illustration"
                className="w-full h-auto object-contain animate-float"
              />
            </div>
          </div>

        </div>
      </div>

      {/* ── Trip Plan Modal ── */}
      <TripPlanModal
        isOpen={isTripModalOpen}
        onClose={() => setIsTripModalOpen(false)}
        goal={activeGoals.find((g) => g.id === selectedGoalId)}
        childrenCount={childrenCount}
        onSave={(data) => {
          updateGoal(selectedGoalId, data);
          setIsTripModalOpen(false);
        }}
      />

      {/* ── Custom Goal Modal ── */}
      <CustomGoalModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onAddGoal={(customData) => {
          addGoal('Other', customData);
        }}
      />
    </div>
  );
}