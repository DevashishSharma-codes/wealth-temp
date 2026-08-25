import React from 'react';

export function StepNavigation({
  onBack,
  onNext,
  onSkip,
  nextLabel = "Continue →",
  isDisabled = false,
  isLoading = false
}) {
  return (
    <div className="flex flex-wrap items-center gap-6 pt-4">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-bold px-2 py-2 rounded-xl transition-all active:scale-95 text-[#183B91] hover:text-[#2459D2] cursor-pointer"
        >
          &larr; Back
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={isDisabled || isLoading}
        className="glass-morphism-btn flex items-center gap-2 text-sm font-bold px-8 py-3.5 rounded-2xl transition-all active:scale-95 disabled:cursor-not-allowed cursor-pointer"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </span>
        ) : (
          nextLabel
        )}
      </button>
      {onSkip && (
        <button
          type="button"
          onClick={onSkip}
          disabled={isLoading}
          className="neu-btn-flat-inactive flex items-center justify-center text-sm font-bold px-8 py-3.5 rounded-2xl transition-all active:scale-95 hover:text-[#2459D2] cursor-pointer disabled:cursor-not-allowed"
        >
          Skip Step
        </button>
      )}
    </div>
  );
}
