import React from 'react';

export function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  error = null,
  className = '',
  rightIcon = null,
  ...props
}) {
  const isFilled = value !== undefined && value !== null && value.toString().length > 0;

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-[13px] font-bold tracking-wide text-[#1E293B]">
          {label}
          {required && <span className="text-red-500 font-bold ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          onWheel={(e) => type === 'number' && e.currentTarget.blur()}
          className={`${
            isFilled ? 'neu-field-filled' : 'neu-field'
          } w-full px-5 py-3.5 sm:py-4 text-base font-medium rounded-full outline-none transition-all duration-250 ${
            rightIcon ? 'pr-11' : isFilled ? 'pr-10' : ''
          } ${className}`}
          {...props}
        />
        {rightIcon ? (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2459D2] pointer-events-none flex items-center justify-center">
            {rightIcon}
          </div>
        ) : isFilled && !error ? (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#77B1EC]/20 text-[#2459D2] flex items-center justify-center pointer-events-none transition-all">
            <svg className="w-3 h-3 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : null}
      </div>
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
  );
}
