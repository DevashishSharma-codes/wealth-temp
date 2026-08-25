import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/* Pure Inline SVG Icons for zero external dependencies in new-wealth-fe */
const SearchIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const XIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CheckIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const GlobeIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </svg>
);

export function FloatingDropdownModal({
  isOpen,
  onClose,
  title = 'Select Option',
  subtitle,
  placeholder = 'Search options...',
  options = [],
  selectedValue,
  onSelect,
  showSearch = true,
  emptyMessage = 'No options found',
  isFullScreen = false,
  widthClass = 'max-w-[520px]',
  renderCustomItem,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  // Close on ESC key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus search input when opened & reset search query
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter options based on search query
  const filteredOptions = options.filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const label = String(item.label || item.name || item.value || '').toLowerCase();
    const subtext = String(item.subtext || item.country || item.level || item.category || item.famousFor || '').toLowerCase();
    const rightTag = String(item.rightTag || item.cost || item.badge || '').toLowerCase();
    return label.includes(query) || subtext.includes(query) || rightTag.includes(query);
  });

  const handleSelect = (option) => {
    onSelect(option);
    onClose();
  };

  /* Full Screen Window Panel Variant */
  if (isFullScreen) {
    const fullScreenJSX = (
      <div
        className="fixed inset-0 z-[9999] w-screen h-screen bg-white/95 backdrop-blur-2xl flex flex-col overflow-hidden select-none animate-fade-in text-[#0E2C7E]"
        aria-modal="true"
        role="dialog"
      >
        {/* Fixed Header */}
        <div className="shrink-0 h-16 sm:h-20 px-6 sm:px-10 border-b border-[#77B1EC]/30 bg-white/80 flex items-center justify-between gap-4 z-10">
          <div>
            <h3 className="font-heading text-base sm:text-xl font-extrabold text-[#0E2C7E] flex items-center gap-2">
              {title}
            </h3>
            {subtitle && <p className="text-xs text-[#64748B] font-medium mt-0.5">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="w-10 h-10 rounded-full flex items-center justify-center neu-btn-flat-inactive transition-all cursor-pointer text-[#0E2C7E] hover:text-[#2459D2] outline-none shrink-0"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="shrink-0 px-6 sm:px-10 py-4 bg-[#77B1EC]/10 border-b border-[#77B1EC]/30">
            <div className="max-w-4xl mx-auto relative flex items-center">
              <SearchIcon className="absolute left-4 w-5 h-5 text-[#2459D2] pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={placeholder}
                className="neu-field w-full pl-12 pr-10 py-3 text-sm font-semibold rounded-full outline-none transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 text-xs font-bold text-[#64748B] hover:text-[#2459D2] cursor-pointer"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Scrollable 3-4 Column Grid Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 scrollbar-thin bg-white/40">
          <div className="max-w-7xl mx-auto">
            {filteredOptions.length === 0 ? (
              <div className="py-20 text-center text-sm text-[#64748B] italic font-medium">
                {emptyMessage}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredOptions.map((option, idx) => {
                  const val = option.value !== undefined ? option.value : (option.id !== undefined ? option.id : option.label);
                  const isSelected =
                    selectedValue !== undefined && selectedValue !== null &&
                    (selectedValue === val || selectedValue === option.label || (typeof selectedValue === 'object' && selectedValue?.id === option.id));

                  if (renderCustomItem) {
                    return (
                      <div key={val || idx} onClick={() => !option.disabled && handleSelect(option)}>
                        {renderCustomItem(option, isSelected, idx)}
                      </div>
                    );
                  }

                  return (
                    <button
                      key={val || idx}
                      type="button"
                      disabled={option.disabled}
                      onClick={() => handleSelect(option)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-150 flex items-start justify-between gap-3 ${
                        option.disabled
                          ? 'opacity-40 cursor-not-allowed border-transparent bg-slate-100/40'
                          : isSelected
                          ? 'bg-[#77B1EC]/20 border-[#2459D2] text-[#2459D2] font-bold shadow-xs'
                          : 'border-[#77B1EC]/30 bg-white/70 hover:bg-[#77B1EC]/15 hover:border-[#2459D2]/50 hover:shadow-md text-[#0E2C7E] cursor-pointer'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        {option.icon && typeof option.icon !== 'string' ? (
                          <div className="shrink-0 w-9 h-9 rounded-xl bg-white border border-[#77B1EC]/30 flex items-center justify-center text-[#0E2C7E] shadow-xs mt-0.5">
                            {option.icon}
                          </div>
                        ) : (
                          <div className="shrink-0 w-9 h-9 rounded-xl bg-[#77B1EC]/20 border border-[#77B1EC]/30 flex items-center justify-center text-[#2459D2] mt-0.5">
                            <GlobeIcon className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-bold truncate text-[#0E2C7E]">
                            {option.label || option.name}
                          </div>
                          {option.subtext && (
                            <div className="text-xs font-medium text-[#64748B] truncate mt-0.5">
                              {option.subtext}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 text-right">
                        {option.rightTag && (
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-xl border ${isSelected ? 'bg-[#77B1EC]/20 text-[#2459D2] border-[#2459D2]/40' : 'bg-slate-100 text-[#64748B] border-slate-200'}`}>
                            {option.rightTag}
                          </span>
                        )}
                        {isSelected && (
                          <span className="w-6 h-6 rounded-full bg-[#2459D2] text-white flex items-center justify-center text-xs font-black shadow-xs">
                            <CheckIcon className="w-4 h-4 stroke-[3]" />
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="shrink-0 h-16 sm:h-20 px-6 sm:px-10 border-t border-[#77B1EC]/30 bg-white/80 flex items-center justify-between gap-4 text-xs font-semibold text-[#64748B] z-10">
          <span>Press ESC or click close to dismiss</span>
          <span>{filteredOptions.length} items available</span>
        </div>
      </div>
    );
    return createPortal(fullScreenJSX, document.body);
  }

  /* Normal Compact Dropdown Popup Variant (Default for first filter dropdowns) */
  const normalJSX = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md transition-all duration-200 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`bg-white/95 border border-[#77B1EC]/40 rounded-[28px] w-full ${widthClass} max-h-[65vh] flex flex-col p-5 sm:p-7 relative text-[#0E2C7E] animate-popup-scale overflow-hidden select-none shadow-2xl backdrop-blur-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-[#77B1EC]/30 shrink-0">
          <div>
            <h3 className="font-heading text-base sm:text-lg font-extrabold text-[#0E2C7E] flex items-center gap-2">
              {title}
            </h3>
            {subtitle && <p className="text-xs text-[#64748B] font-medium mt-0.5">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full flex items-center justify-center neu-btn-flat-inactive transition-all cursor-pointer text-lg font-bold text-[#0E2C7E] hover:text-[#2459D2] outline-none shrink-0"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Sticky Search Bar */}
        {showSearch && (
          <div className="py-3 shrink-0">
            <div className="relative flex items-center">
              <SearchIcon className="absolute left-3.5 w-4 h-4 text-[#2459D2] pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={placeholder}
                className="neu-field w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm font-semibold rounded-2xl outline-none transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 text-xs font-extrabold text-[#64748B] hover:text-[#2459D2] cursor-pointer"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Scrollable Items List */}
        <div className="flex-1 overflow-y-auto pr-1 py-1 scrollbar-thin">
          {filteredOptions.length === 0 ? (
            <div className="py-8 text-center text-xs sm:text-sm text-[#64748B] italic font-medium">
              {emptyMessage}
            </div>
          ) : (
            filteredOptions.map((option, idx) => {
              const val = option.value !== undefined ? option.value : (option.id !== undefined ? option.id : option.label);
              const isSelected =
                selectedValue !== undefined && selectedValue !== null &&
                (selectedValue === val || selectedValue === option.label || (typeof selectedValue === 'object' && selectedValue?.id === option.id));

              if (renderCustomItem) {
                return (
                  <div key={val || idx} onClick={() => !option.disabled && handleSelect(option)}>
                    {renderCustomItem(option, isSelected, idx)}
                  </div>
                );
              }

              return (
                <button
                  key={val || idx}
                  type="button"
                  disabled={option.disabled}
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left p-3 mb-2 rounded-2xl border transition-all duration-150 flex items-center justify-between gap-3 ${
                    option.disabled
                      ? 'opacity-40 cursor-not-allowed border-transparent bg-slate-100/40'
                      : isSelected
                      ? 'bg-[#77B1EC]/20 border-[#2459D2] text-[#2459D2] font-bold shadow-xs'
                      : 'border-[#77B1EC]/30 bg-white/70 hover:bg-[#77B1EC]/15 hover:border-[#2459D2]/50 hover:shadow-md text-[#0E2C7E] cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {option.icon && typeof option.icon !== 'string' ? (
                      <div className="shrink-0 w-7 h-7 rounded-xl bg-white border border-[#77B1EC]/30 flex items-center justify-center text-[#0E2C7E] shadow-xs">
                        {option.icon}
                      </div>
                    ) : (
                      <div className="shrink-0 w-7 h-7 rounded-xl bg-[#77B1EC]/20 border border-[#77B1EC]/30 flex items-center justify-center text-[#2459D2]">
                        <GlobeIcon className="w-4 h-4" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-bold truncate text-[#0E2C7E]">
                        {option.label || option.name}
                      </div>
                      {option.subtext && (
                        <div className="text-[11px] font-medium text-[#64748B] truncate mt-0.5">
                          {option.subtext}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-right">
                    {option.rightTag && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-xl border ${isSelected ? 'bg-[#77B1EC]/20 text-[#2459D2] border-[#2459D2]/40' : 'bg-slate-100 text-[#64748B] border-slate-200'}`}>
                        {option.rightTag}
                      </span>
                    )}
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-[#2459D2] text-white flex items-center justify-center text-xs font-black shadow-xs">
                        <CheckIcon className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(normalJSX, document.body);
}
