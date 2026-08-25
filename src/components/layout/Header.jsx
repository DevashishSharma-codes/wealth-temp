import React from "react";
import { Link } from "react-router-dom";
import wealthWisdomLogo from "../../assets/wealth-wisdom-logo.png";

/* ------------------------------------------------------------------
   Neumorphic tokens & Glassy Blue Theme
   Light source: top-left.
-------------------------------------------------------------------*/
const TRACK_COLOR = "#D5E5FA";
const STEP_INACTIVE_BG = "rgba(240, 246, 255, 0.8)";
const STEP_INACTIVE_TEXT = "#475569";
const STEP_ACTIVE_BG = "radial-gradient(135% 135% at 50% 15%, #2459D2 0%, #153FA8 65%, #0E2C7E 100%)";

/**
 * Step progress indicator.
 * currentStep is 1-indexed. totalSteps defaults to 5.
 */
export function StepProgress({ currentStep = 1, totalSteps = 5, goToStep }) {
  return (
    <div className="w-full flex items-center justify-center px-4 mt-8">
      <div className="flex items-center w-full max-w-[640px]">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step, idx) => {
          const isActive = step === currentStep;
          const isComplete = step < currentStep;
          const isLast = idx === totalSteps - 1;

          return (
            <React.Fragment key={step}>
              <button
                type="button"
                onClick={() => goToStep && goToStep(step)}
                className={`relative shrink-0 rounded-full flex items-center justify-center font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "w-14 h-14 sm:w-16 sm:h-16 text-lg sm:text-xl"
                    : "w-11 h-11 sm:w-14 sm:h-14 text-sm sm:text-base"
                }`}
                style={
                  isActive
                    ? {
                        // ACTIVE: Glassy Blue Button style
                        background: STEP_ACTIVE_BG,
                        color: "#FFFFFF",
                        border: "1.5px solid rgba(175, 215, 255, 0.7)",
                        boxShadow:
                          "0 8px 20px -2px rgba(36,89,210,0.4), inset 0 1.5px 2px rgba(255,255,255,0.85), inset 0 0 16px 2px rgba(119,177,236,0.85)",
                      }
                    : isComplete
                    ? {
                        // COMPLETED: Crisp White surface, blue text
                        background: "#FFFFFF",
                        color: "#2459D2",
                        border: "1px solid #CBD5E1",
                        boxShadow:
                          "3px 3px 7px #CAD5E2, -3px -3px 7px #FFFFFF",
                      }
                    : {
                        // UNVISITED: Neumorphic Inset
                        background: "#EEF2F6",
                        color: "#64748B",
                        border: "1px solid rgba(255, 255, 255, 0.9)",
                        boxShadow:
                          "inset 3px 3px 6px #CAD5E2, inset -3px -3px 6px #FFFFFF",
                      }
                }
              >
                {step}
              </button>

              {!isLast && (
                <div
                  className="flex-1 h-[6px] rounded-full mx-1 sm:mx-2"
                  style={{
                    background: isComplete ? "#2459D2" : "#CBD5E1",
                    boxShadow:
                      "inset 1px 1px 2px rgba(15,23,42,0.12), inset -1px -1px 2px #FFFFFF",
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export function Header({ currentStep = 1, totalSteps = 5, goToStep, showReport = false }) {
  const isFinalPage = currentStep === 5 || showReport;

  return (
    <header className="py-8 bg-transparent flex flex-col items-center">
      {/* Centered Logo */}
      <a href="https://www.wealthswisdom.com" className="flex flex-col items-center text-center justify-center select-none cursor-pointer">
        <img src={wealthWisdomLogo} alt="Wealth Wisdom - Take Charge of Your Future" className="h-20 w-auto object-contain" />
      </a>

      {/* Title */}
      <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[50px] font-black tracking-tight mt-6 mb-2 text-center px-4 select-none leading-tight animate-color-cycle">
        {isFinalPage ? (
          <span className="cool-title-container">
            <span className="cool-word-pop-1">Thank</span>
            <span className="cool-word-pop-2">You!</span>
          </span>
        ) : (
          <span className="cool-title-container">
            <span className="cool-word-pop-1">Goal</span>
            <span className="cool-word-pop-2">Analysis</span>
            <span className="cool-word-pop-3">Assessment</span>
            <span className="inline-flex items-baseline ml-1 space-x-1 font-black text-[#01569e]">
              <span className="dot-wave-1">.</span>
              <span className="dot-wave-2">.</span>
              <span className="dot-wave-3">.</span>
            </span>
          </span>
        )}
      </h1>

      {/* Step progress indicator */}
      {!showReport && currentStep !== 5 && (
        <StepProgress currentStep={currentStep} totalSteps={totalSteps} goToStep={goToStep} />
      )}
    </header>
  );
}