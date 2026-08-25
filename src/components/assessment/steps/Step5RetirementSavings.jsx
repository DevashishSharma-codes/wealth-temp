import React, { useState } from 'react';
import { useAssessment } from '../../../hooks/useAssessment';
import { validateStep5Fields } from '../../../hooks/useFormValidation';
import { StepNavigation } from '../../ui/StepNavigation';
import { FormField } from '../../ui/FormField';

export function Step5RetirementSavings() {
  const {
    formData,
    updateFormData,
    submitStep5,
    prevStep,
    isCalculating
  } = useAssessment();

  const [touched, setTouched] = useState({});
  const [showAllErrors, setShowAllErrors] = useState(false);

  const errors = validateStep5Fields(formData);
  const isValid = Object.keys(errors).length === 0;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateFormData({
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleNext = () => {
    setShowAllErrors(true);
    if (isValid) {
      submitStep5();
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
                Current Retirement Savings
              </h1>
              <p className="text-sm leading-relaxed max-w-lg font-medium text-[#475569]">
                Tell us about your existing retirement savings and employer-sponsored plans so we can accurately assess your future retirement readiness.
              </p>
            </div>

            {/* Form Areas */}
            <div className="space-y-5 pt-2">
              
              {/* Target Age & Years Until Retirement Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormField
                  label="Target Retirement Age"
                  name="targetRetireAge"
                  value={formData.targetRetireAge}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={(touched.targetRetireAge || showAllErrors) ? errors.targetRetireAge : null}
                  placeholder="Enter target retirement age"
                  type="number"
                  required={false}
                />
                <FormField
                  label="Years Until Retirement"
                  name="yearsUntilRetirement"
                  value={formData.yearsUntilRetirement}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={(touched.yearsUntilRetirement || showAllErrors) ? errors.yearsUntilRetirement : null}
                  placeholder="Enter years remaining"
                  type="number"
                  required={false}
                />
              </div>

              {/* Required Annual Income */}
              <FormField
                label="Required Annual Income (Today's Value)"
                name="requiredAnnualIncome"
                value={formData.requiredAnnualIncome}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={(touched.requiredAnnualIncome || showAllErrors) ? errors.requiredAnnualIncome : null}
                placeholder="Enter annual income required"
                type="number"
                required={false}
              />

              {/* EPF Section */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center text-[#2459D2] font-bold text-xs uppercase tracking-wider border-l-2 border-[#2459D2] pl-2 mb-2 select-none">
                  EMPLOYEES' PROVIDENT FUND (EPF)
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <FormField
                    label="Employer's Share"
                    name="epfEmployerShare"
                    value={formData.epfEmployerShare}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={(touched.epfEmployerShare || showAllErrors) ? errors.epfEmployerShare : null}
                    placeholder="Enter amount"
                    type="number"
                    required={false}
                  />
                  <FormField
                    label="Employee's Share"
                    name="epfEmployeeShare"
                    value={formData.epfEmployeeShare}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={(touched.epfEmployeeShare || showAllErrors) ? errors.epfEmployeeShare : null}
                    placeholder="Enter amount"
                    type="number"
                    required={false}
                  />
                </div>
                <FormField
                  label="Total Accumulated Corpus"
                  name="epfTotalCorpus"
                  value={formData.epfTotalCorpus}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={(touched.epfTotalCorpus || showAllErrors) ? errors.epfTotalCorpus : null}
                  placeholder="Enter total accumulated amount"
                  type="number"
                  required={false}
                />
              </div>

              {/* NPS Section */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center text-[#2459D2] font-bold text-xs uppercase tracking-wider border-l-2 border-[#2459D2] pl-2 mb-2 select-none">
                  NATIONAL PENSION SYSTEM (NPS)
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <FormField
                    label="Employer's Contribution"
                    name="npsEmployerShare"
                    value={formData.npsEmployerShare}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={(touched.npsEmployerShare || showAllErrors) ? errors.npsEmployerShare : null}
                    placeholder="Enter amount"
                    type="number"
                    required={false}
                  />
                  <FormField
                    label="Employee's Contribution"
                    name="npsEmployeeShare"
                    value={formData.npsEmployeeShare}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={(touched.npsEmployeeShare || showAllErrors) ? errors.npsEmployeeShare : null}
                    placeholder="Enter amount"
                    type="number"
                    required={false}
                  />
                </div>
                <FormField
                  label="Total Accumulated Corpus"
                  name="npsTotalCorpus"
                  value={formData.npsTotalCorpus}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={(touched.npsTotalCorpus || showAllErrors) ? errors.npsTotalCorpus : null}
                  placeholder="Enter total accumulated amount"
                  type="number"
                  required={false}
                />
              </div>

              {/* Superannuation Section */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center text-[#2459D2] font-bold text-xs uppercase tracking-wider border-l-2 border-[#2459D2] pl-2 mb-2 select-none">
                  SUPERANNUATION FUND
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <FormField
                    label="Employer's Share"
                    name="superEmployerShare"
                    value={formData.superEmployerShare}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={(touched.superEmployerShare || showAllErrors) ? errors.superEmployerShare : null}
                    placeholder="Enter amount"
                    type="number"
                    required={false}
                  />
                  <FormField
                    label="Total Accumulated Corpus"
                    name="superTotalCorpus"
                    value={formData.superTotalCorpus}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={(touched.superTotalCorpus || showAllErrors) ? errors.superTotalCorpus : null}
                    placeholder="Enter amount"
                    type="number"
                    required={false}
                  />
                </div>
              </div>

            </div>

            {/* Navigation Actions */}
            <StepNavigation
              onBack={prevStep}
              onNext={handleNext}
              nextLabel="Submit &rarr;"
              isDisabled={false}
              isLoading={isCalculating}
            />

          </div>

          {/* Right Column: Rocking chair illustration */}
          <div className="w-full self-stretch flex items-start justify-center pt-8">
            <div className="md:sticky md:top-32 w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[420px] select-none pointer-events-none drop-shadow-md">
              <img 
                src="/assets/retirement_chair_neu.png" 
                alt="3D Rocking chair retirement illustration"
                className="w-full h-auto object-contain animate-float"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
