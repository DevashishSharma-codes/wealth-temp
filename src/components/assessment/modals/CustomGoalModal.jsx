import React, { useState, useEffect } from 'react';

const formatINR = (val) => {
  const num = parseFloat(val);
  if (isNaN(num) || num <= 0) return null;
  return `₹${num.toLocaleString('en-IN')}`;
};

const PRESETS = [
  'World Cup Trip',
  'Luxury Watch',
  'Farm House',
  'Art Collection',
  'Sailing Trip',
  'Start Business',
];

export function CustomGoalModal({ isOpen, onClose, onAddGoal }) {
  const [goalName, setGoalName] = useState('');
  const [targetYear, setTargetYear] = useState('');
  const [todaysCost, setTodaysCost] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setGoalName('');
      setTargetYear('');
      setTodaysCost('');
      setErrors({});
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentYear = new Date().getFullYear();

  const handlePresetClick = (presetName) => {
    setGoalName(presetName);
    if (errors.goalName) {
      setErrors((prev) => ({ ...prev, goalName: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!goalName.trim()) {
      newErrors.goalName = 'Goal name is required';
    }

    if (!targetYear) {
      newErrors.targetYear = 'Target year is required';
    } else {
      const yr = parseInt(targetYear, 10);
      if (isNaN(yr) || yr <= currentYear || yr > currentYear + 60) {
        newErrors.targetYear = `Year must be in the future (between ${currentYear + 1} and ${currentYear + 60})`;
      }
    }

    if (!todaysCost) {
      newErrors.todaysCost = "Today's cost is required";
    } else {
      const cost = parseFloat(todaysCost);
      if (isNaN(cost) || cost <= 0) {
        newErrors.todaysCost = 'Cost must be a positive number';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onAddGoal({
      goalName: goalName.trim(),
      targetYear: targetYear.toString().trim(),
      todaysCost: todaysCost.toString().trim(),
    });
    onClose();
  };

  const formattedCost = formatINR(todaysCost);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md transition-all duration-200"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white/95 border border-[#77B1EC]/40 rounded-[28px] w-full max-w-[500px] p-6 sm:p-8 relative text-[#0E2C7E] shadow-2xl overflow-hidden select-none animate-popup-scale backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#77B1EC]/30">
          <div>
            <h3 className="font-heading text-lg sm:text-xl font-extrabold text-[#0E2C7E] flex items-center gap-2">
              <span className="text-[#2459D2]">🎯</span> Add Custom Goal
            </h3>
            <p className="text-xs text-[#64748B] font-medium mt-0.5">
              Specify your unique lifestyle goal details below
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 border border-[#77B1EC]/30 text-[#64748B] hover:text-[#2459D2] hover:border-[#2459D2]/40 text-lg font-bold transition-all cursor-pointer outline-none"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Preset Suggestions */}
          <div>
            <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2 select-none">
              Quick Suggestions
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => {
                const isSelected = goalName === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePresetClick(preset)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer border ${
                      isSelected
                        ? 'glass-morphism-btn text-white shadow-xs'
                        : 'bg-slate-100/80 text-[#0E2C7E] border-[#77B1EC]/30 hover:border-[#2459D2]/50 hover:bg-[#77B1EC]/15'
                    }`}
                  >
                    {preset}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Goal Name Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#0E2C7E] select-none">
              Goal Name <span className="text-[#2459D2]">*</span>
            </label>
            <input
              type="text"
              value={goalName}
              onChange={(e) => {
                setGoalName(e.target.value);
                if (errors.goalName) setErrors((prev) => ({ ...prev, goalName: null }));
              }}
              placeholder="e.g. World Cup Trip, Luxury Watch"
              className={`neu-field w-full px-4 py-3 text-sm font-medium rounded-2xl outline-none transition-all ${
                errors.goalName ? 'border-red-400' : ''
              }`}
              autoFocus
            />
            {errors.goalName && (
              <span className="text-xs text-red-500 font-medium block mt-1">
                {errors.goalName}
              </span>
            )}
          </div>

          {/* Target Year & Today's Cost Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Target Year */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#0E2C7E] select-none">
                Target Year <span className="text-[#2459D2]">*</span>
              </label>
              <input
                type="number"
                value={targetYear}
                onChange={(e) => {
                  setTargetYear(e.target.value);
                  if (errors.targetYear) setErrors((prev) => ({ ...prev, targetYear: null }));
                }}
                placeholder={`e.g. ${currentYear + 5}`}
                className={`neu-field w-full px-4 py-3 text-sm font-medium rounded-2xl outline-none transition-all ${
                  errors.targetYear ? 'border-red-400' : ''
                }`}
              />
              {errors.targetYear && (
                <span className="text-xs text-red-500 font-medium block mt-1">
                  {errors.targetYear}
                </span>
              )}
            </div>

            {/* Today's Cost */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#0E2C7E] select-none">
                Today's Cost (₹) <span className="text-[#2459D2]">*</span>
              </label>
              <input
                type="number"
                value={todaysCost}
                onChange={(e) => {
                  setTodaysCost(e.target.value);
                  if (errors.todaysCost) setErrors((prev) => ({ ...prev, todaysCost: null }));
                }}
                placeholder="e.g. 500000"
                className={`neu-field w-full px-4 py-3 text-sm font-medium rounded-2xl outline-none transition-all ${
                  errors.todaysCost ? 'border-red-400' : ''
                }`}
              />
              {formattedCost && (
                <span className="text-xs text-[#2459D2] font-bold block mt-1">
                  {formattedCost}
                </span>
              )}
              {errors.todaysCost && (
                <span className="text-xs text-red-500 font-medium block mt-1">
                  {errors.todaysCost}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 text-xs font-bold text-[#64748B] hover:text-[#0E2C7E] transition-colors rounded-2xl cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="glass-morphism-btn px-6 py-3 text-xs font-bold text-white rounded-2xl transition-all active:scale-95 cursor-pointer shadow-md"
            >
              + Add Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
