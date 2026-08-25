import React, { useState } from 'react';
import { useAssessment } from '../../../hooks/useAssessment';
import { validateStep1Fields } from '../../../hooks/useFormValidation';
import { StepNavigation } from '../../ui/StepNavigation';
import { FormField } from '../../ui/FormField';

const TEXT_DARK = '#0F172A';

export function Step1Communication() {
  const {
    formData,
    updateFormData,
    submitStep1,
    isSubmitting
  } = useAssessment();

  const [touched, setTouched] = useState({});
  const [showAllErrors, setShowAllErrors] = useState(false);

  const errors = validateStep1Fields(formData);
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
      submitStep1();
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col" style={{ color: TEXT_DARK }}>
      <div className="w-full flex-1 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-10 lg:gap-16 items-center flex-1">

          {/* Left Column: Form Fields */}
          <div className="space-y-7 w-full">

            <div className="space-y-2">
              <h1 className="font-heading text-[26px] sm:text-[32px] lg:text-[34px] font-black leading-tight text-[#0F172A]">
                Communication Details
              </h1>
              <p className="text-sm leading-relaxed max-w-lg font-medium text-[#475569]">
                Provide your contact information so we can securely reach you and save your assessment details.
              </p>
            </div>

            {/* Form Areas */}
            <div className="space-y-6">

              {/* CONTACT INFORMATION SECTION */}
              <div className="space-y-4">
                <div className="flex items-center text-[#2459D2] font-bold text-xs uppercase tracking-wider border-l-2 border-[#2459D2] pl-2 mb-2 select-none">
                  CONTACT INFORMATION
                </div>

                {/* Mobile & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="Mobile Number"
                    name="mobile"
                    value={formData.mobile || ''}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={(touched.mobile || showAllErrors) ? errors.mobile : null}
                    placeholder="Enter your mobile number"
                    required={true}
                  />
                  <FormField
                    label="Email Address"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={(touched.email || showAllErrors) ? errors.email : null}
                    placeholder="Enter your email address"
                    type="email"
                    required={true}
                  />
                </div>

                {/* Address */}
                <FormField
                  label="Residential Address"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={(touched.address || showAllErrors) ? errors.address : null}
                  placeholder="Enter your residential address"
                  required={true}
                />
              </div>

              {/* SPOUSE CONTACT INFORMATION SECTION */}
              <div className="space-y-4">
                <div className="flex items-center text-[#2459D2] font-bold text-xs uppercase tracking-wider border-l-2 border-[#2459D2] pl-2 mb-2 select-none">
                  SPOUSE CONTACT INFORMATION
                </div>

                {/* Spouse Mobile & Spouse Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="Spouse Mobile Number"
                    name="spouseMobile"
                    value={formData.spouseMobile || ''}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={(touched.spouseMobile || showAllErrors) ? errors.spouseMobile : null}
                    placeholder="Enter spouse's mobile number"
                    required={false}
                  />
                  <FormField
                    label="Spouse Email Address"
                    name="spouseEmail"
                    value={formData.spouseEmail || ''}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={(touched.spouseEmail || showAllErrors) ? errors.spouseEmail : null}
                    placeholder="Enter spouse's email address"
                    type="email"
                    required={false}
                  />
                </div>
              </div>

              {/* Consent checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <div className="relative flex items-center mt-0.5">
                    <input
                      type="checkbox"
                      name="consent"
                      checked={!!formData.consent}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-lg transition-all neu-checkbox flex items-center justify-center ${formData.consent ? 'bg-[#2459D2] border-[#2459D2] shadow-none' : ''
                        }`}
                    >
                      <svg
                        className={`w-3.5 h-3.5 text-white transition-opacity ${formData.consent ? 'opacity-100' : 'opacity-0'
                          }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#64748B] leading-tight">
                    I consent to share the communication details and allow contact to save this assessment.
                  </span>
                </label>
                {(touched.consent || showAllErrors) && errors.consent && (
                  <span className="text-xs text-red-500 font-medium block mt-1.5 ml-8">{errors.consent}</span>
                )}
              </div>

            </div>

            {/* Navigation Actions */}
            <StepNavigation
              onNext={handleNext}
              isDisabled={false}
              isLoading={isSubmitting}
            />

          </div>

          {/* Right Column: 3D Illustration */}
          <div className="flex items-center justify-center w-full">
            <div className="w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[420px] select-none pointer-events-none drop-shadow-md">
              <img
                src="/assets/chat_bubbles_neu.png"
                alt="3D Chat bubbles illustration"
                className="w-full h-auto object-contain animate-float"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}