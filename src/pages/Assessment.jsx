import React from 'react';
import { useAssessment } from '../hooks/useAssessment';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { StepIndicator } from '../components/assessment/StepIndicator';
import { Step1Communication } from '../components/assessment/steps/Step1Communication';
import { Step2PersonalDetails } from '../components/assessment/steps/Step2PersonalDetails';
import { Step3FamilyDetails } from '../components/assessment/steps/Step3FamilyDetails';
import { Step4LifestyleGoals } from '../components/assessment/steps/Step4LifestyleGoals';
import { Step5RetirementSavings } from '../components/assessment/steps/Step5RetirementSavings';
import { ReportView } from '../components/assessment/report/ReportView';

export default function Assessment() {
  const {
    step,
    showReport,
    isCalculating,
    apiError,
    goToStep
  } = useAssessment();

  const renderStepComponent = () => {
    switch (step) {
      case 1:
        return <Step1Communication />;
      case 2:
        return <Step2PersonalDetails />;
      case 3:
        return <Step3FamilyDetails />;
      case 4:
        return <Step4LifestyleGoals />;
      case 5:
        return showReport ? <ReportView /> : <Step5RetirementSavings />;
      default:
        return <Step1Communication />;
    }
  };



  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [step, showReport]);

  return (
    <div 
      className="min-h-screen flex flex-col font-sans selection:bg-[#2459D2]/20 selection:text-[#183B91] relative overflow-hidden text-[#0F172A]"
      style={{
        background: 'linear-gradient(180deg, #E6EFF8 0%, #EEF2F6 25%, #EEF2F6 100%)'
      }}
    >
      {/* Soft subtle ambient depth */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-white/40 rounded-full blur-[100px] pointer-events-none -z-0" />
      <div className="absolute top-[100px] right-[-100px] w-[500px] h-[350px] bg-[#77B1EC]/8 rounded-full blur-[100px] pointer-events-none -z-0" />
      
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50">
        <button
          type="button"
          onClick={() => {
            sessionStorage.removeItem("ww_assessment_state");
            localStorage.removeItem("ww_assessment_id");
            window.location.href = "/";
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all text-xs sm:text-sm font-bold cursor-pointer glass-morphism-card text-[#0E2C7E] hover:text-[#2459D2]"
        >
          <svg className="w-4 h-4 text-[#2459D2]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Go to Home Page
        </button>
      </div>

      <Header currentStep={step} totalSteps={5} goToStep={goToStep} showReport={showReport} />

      <main className="flex-1 w-full py-10 sm:py-14" style={{ paddingLeft: 'clamp(16px, 5vw, 80px)', paddingRight: 'clamp(16px, 5vw, 80px)' }}>
        
        {apiError && (
          <div className="max-w-4xl mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-3xl text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-3">
            <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{apiError}</span>
          </div>
        )}

        {renderStepComponent()}

      </main>

      <Footer />

    </div>
  );
}
